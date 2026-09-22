#!/usr/bin/env node
/**
 * Pull every workflow from the WorkflowHub Egypt library into ./workflows.
 *
 * Run this from a machine that can reach the site:
 *
 *   node scripts/fetch-library.mjs --dry-run   # show what was found, write nothing
 *   node scripts/fetch-library.mjs             # download everything
 *   node scripts/fetch-library.mjs --cookie "session=..."   # if the library is behind a login
 *
 * The site's markup is not known ahead of time, so discovery runs through a
 * chain of strategies and reports which one produced the list. If all of them
 * come up empty the raw HTML is left in ./raw for inspection.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const BASE = process.env.LIBRARY_BASE ?? 'https://workflowhubegy.com';
const LIBRARY_URL = new URL(process.env.LIBRARY_PATH ?? '/library', BASE).href;
const ROOT = path.resolve(import.meta.dirname, '..');
const OUT = path.join(ROOT, 'workflows');
const RAW = path.join(ROOT, 'raw');

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const cookie = valueOf('--cookie');
const limit = Number(valueOf('--limit') ?? Infinity);

function valueOf(flag) {
  const i = args.indexOf(flag);
  return i === -1 ? undefined : args[i + 1];
}

const headers = {
  'user-agent': 'workflow-library-importer/0.1 (+personal archive)',
  accept: 'text/html,application/json;q=0.9,*/*;q=0.8',
  ...(cookie ? { cookie } : {}),
};

async function get(url, as = 'text') {
  const res = await fetch(url, { headers, redirect: 'follow' });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return as === 'json' ? res.json() : res.text();
}

const slugify = (s) =>
  String(s)
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9؀-ۿ]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'workflow';

/** Strategy 1: framework payloads embedded in the page. */
function fromEmbeddedState(html) {
  const patterns = [
    /<script[^>]+id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/,
    /window\.__NUXT__\s*=\s*({[\s\S]*?});?\s*<\/script>/,
    /window\.__INITIAL_STATE__\s*=\s*({[\s\S]*?});?\s*<\/script>/,
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (!m) continue;
    try {
      return collectWorkflowish(JSON.parse(m[1]));
    } catch {
      /* not JSON after all — fall through */
    }
  }
  return [];
}

/** Strategy 2: schema.org ItemList / CreativeWork blocks. */
function fromJsonLd(html) {
  const out = [];
  const re = /<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g;
  for (const m of html.matchAll(re)) {
    try {
      out.push(...collectWorkflowish(JSON.parse(m[1])));
    } catch {
      /* ignore malformed block */
    }
  }
  return out;
}

/** Strategy 3: the JSON API the page itself is probably calling. */
async function fromApi() {
  const candidates = [
    '/api/workflows',
    '/api/library',
    '/api/v1/workflows',
    '/library.json',
    '/workflows.json',
    '/wp-json/wp/v2/workflow?per_page=100',
  ];
  for (const p of candidates) {
    const url = new URL(p, BASE).href;
    try {
      const found = collectWorkflowish(await get(url, 'json'));
      if (found.length) {
        console.log(`  api endpoint responded: ${url}`);
        return found;
      }
    } catch {
      /* endpoint absent — try the next */
    }
  }
  return [];
}

/** Strategy 4: plain anchors on the page. */
function fromAnchors(html) {
  const out = new Map();
  const re = /<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  for (const [, href, inner] of html.matchAll(re)) {
    if (!/workflow|template|automation|\.json$/i.test(href)) continue;
    if (/^(#|mailto:|javascript:)/i.test(href)) continue;
    const url = new URL(href, LIBRARY_URL).href;
    if (new URL(url).origin !== new URL(BASE).origin) continue;
    const title = inner.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    if (!out.has(url)) out.set(url, { title: title || url, url });
  }
  return [...out.values()];
}

/** Walk arbitrary JSON and pull out anything that looks like a workflow record. */
function collectWorkflowish(node, acc = [], seen = new Set()) {
  if (!node || typeof node !== 'object' || seen.has(node)) return acc;
  seen.add(node);
  if (Array.isArray(node)) {
    for (const item of node) collectWorkflowish(item, acc, seen);
    return acc;
  }
  const title = node.title ?? node.name ?? node.workflowName;
  const looksLikeOne =
    typeof title === 'string' &&
    (node.nodes || node.slug || node.id || node.url || node.description);
  if (looksLikeOne) {
    acc.push({
      title,
      slug: node.slug,
      id: node.id,
      description: node.description ?? node.summary ?? node.excerpt,
      category: node.category ?? node.categories ?? node.type,
      tags: node.tags ?? node.keywords,
      url: node.url ?? node.link ?? node.permalink,
      // A payload with `nodes` is already the workflow definition itself.
      definition: node.nodes ? node : undefined,
    });
  }
  for (const v of Object.values(node)) collectWorkflowish(v, acc, seen);
  return acc;
}

/** Given a workflow's detail page, find the definition JSON. */
async function resolveDefinition(entry) {
  if (entry.definition) return entry.definition;
  if (!entry.url) return undefined;
  if (entry.url.endsWith('.json')) return get(entry.url, 'json');

  const html = await get(entry.url);
  const embedded = [...fromEmbeddedState(html), ...fromJsonLd(html)].find((e) => e.definition);
  if (embedded) return embedded.definition;

  const link = html.match(/href=["']([^"']+\.json(?:\?[^"']*)?)["']/i);
  if (link) return get(new URL(link[1], entry.url).href, 'json');

  const inline = html.match(/<pre[^>]*>\s*({[\s\S]*?"nodes"[\s\S]*?})\s*<\/pre>/i);
  if (inline) {
    try {
      return JSON.parse(inline[1]);
    } catch {
      /* not a definition */
    }
  }
  return undefined;
}

async function main() {
  console.log(`Reading ${LIBRARY_URL}`);
  const html = await get(LIBRARY_URL);
  await mkdir(RAW, { recursive: true });
  await writeFile(path.join(RAW, 'library.html'), html);

  let entries = fromEmbeddedState(html);
  let via = 'embedded state';
  if (!entries.length) (entries = fromJsonLd(html)), (via = 'json-ld');
  if (!entries.length) (entries = await fromApi()), (via = 'json api');
  if (!entries.length) (entries = fromAnchors(html)), (via = 'page anchors');

  const unique = [...new Map(entries.map((e) => [e.url ?? e.slug ?? e.title, e])).values()];
  console.log(`Found ${unique.length} workflow(s) via ${via}.`);

  if (!unique.length) {
    console.error(
      `\nNothing matched. The page HTML is saved at ${path.relative(ROOT, RAW)}/library.html —\n` +
        `open it, find how the list is delivered, and adjust the strategies in this script.\n` +
        `If the list loads over XHR, pass the real endpoint: LIBRARY_PATH=/api/... node scripts/fetch-library.mjs`
    );
    process.exitCode = 1;
    return;
  }

  let saved = 0;
  for (const entry of unique.slice(0, limit)) {
    const slug = slugify(entry.slug ?? entry.title);
    if (dryRun) {
      console.log(`  ${slug}  ${entry.url ?? ''}`);
      continue;
    }
    let definition;
    try {
      definition = await resolveDefinition(entry);
    } catch (err) {
      console.warn(`  ! ${slug}: ${err.message}`);
    }
    const dir = path.join(OUT, slug);
    await mkdir(dir, { recursive: true });
    await writeFile(
      path.join(dir, 'meta.json'),
      JSON.stringify(
        {
          title: entry.title,
          slug,
          description: entry.description ?? '',
          category: entry.category ?? 'uncategorized',
          tags: [entry.tags ?? []].flat().filter(Boolean),
          source: entry.url ?? LIBRARY_URL,
          retrievedAt: new Date().toISOString(),
        },
        null,
        2
      ) + '\n'
    );
    if (definition) {
      await writeFile(path.join(dir, 'workflow.json'), JSON.stringify(definition, null, 2) + '\n');
    }
    saved += 1;
    console.log(`  ${definition ? '+' : '~'} ${slug}${definition ? '' : ' (metadata only)'}`);
  }

  if (!dryRun) console.log(`\nSaved ${saved} workflow(s) to ${path.relative(ROOT, OUT)}/.`);
  console.log('Next: node scripts/build-catalog.mjs');
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
