#!/usr/bin/env node
/**
 * Pull the whole workflowhubegy.com library into ./workflows.
 *
 *   node scripts/fetch-library.mjs --dry-run     # discover only, write nothing
 *   node scripts/fetch-library.mjs               # download everything, resumable
 *   node scripts/fetch-library.mjs --concurrency 16
 *   node scripts/fetch-library.mjs --cookie "session=..."   # if it needs a login
 *
 * Built for a library in the tens of thousands: it pages through the listing,
 * downloads in parallel with retries, skips anything already on disk, and
 * streams each definition straight to a file. Nothing is buffered in memory and
 * nothing passes through a chat context, so the cost is bandwidth and time.
 *
 * Re-running is safe and cheap — it only fetches what is missing, so an
 * interrupted run picks up where it stopped.
 */
import { mkdir, writeFile, readdir, access } from 'node:fs/promises';
import path from 'node:path';

const BASE = process.env.LIBRARY_BASE ?? 'https://workflowhubegy.com';
const LIBRARY_PATH = process.env.LIBRARY_PATH ?? '/library';
const ROOT = path.resolve(import.meta.dirname, '..');
const OUT = path.join(ROOT, 'workflows');
const RAW = path.join(ROOT, 'raw');

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const value = (name, fallback) => {
  const i = args.indexOf(name);
  return i === -1 ? fallback : args[i + 1];
};

const dryRun = flag('--dry-run');
const force = flag('--force');
const concurrency = Math.max(1, Number(value('--concurrency', 8)));
const limit = Number(value('--limit', Infinity));
const maxPages = Number(value('--max-pages', 2000));
const cookie = value('--cookie');

const headers = {
  'user-agent': 'workflow-library-importer/1.0 (+personal archive)',
  accept: 'text/html,application/json;q=0.9,*/*;q=0.8',
  ...(cookie ? { cookie } : {}),
};

const exists = (p) => access(p).then(() => true, () => false);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const slugify = (s) =>
  String(s)
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9؀-ۿ]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'workflow';

/** Fetch with retries. Backs off on 429 and 5xx; gives up on a real 404. */
async function get(url, as = 'text', attempt = 1) {
  try {
    const res = await fetch(url, { headers, redirect: 'follow' });
    if (res.status === 404) throw Object.assign(new Error(`404 ${url}`), { fatal: true });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return as === 'json' ? res.json() : res.text();
  } catch (err) {
    if (err.fatal || attempt >= 4) throw err;
    // 1s, 4s, 9s — enough to ride out a rate limit without stalling the run.
    await sleep(1000 * attempt * attempt);
    return get(url, as, attempt + 1);
  }
}

/** Run `worker` over `items`, `concurrency` at a time, reporting as it goes. */
async function pool(items, worker, onProgress) {
  let index = 0;
  let done = 0;
  const runners = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (index < items.length) {
      const item = items[index++];
      try {
        await worker(item);
      } catch (err) {
        onProgress?.({ done: ++done, total: items.length, error: err, item });
        continue;
      }
      onProgress?.({ done: ++done, total: items.length });
    }
  });
  await Promise.all(runners);
}

// --- discovery ------------------------------------------------------------
// The site's markup is not known ahead of time, so these run in order and the
// first that yields anything wins. Each returns {title, url, slug, ...}.

function collectWorkflowish(node, acc = [], seen = new Set()) {
  if (!node || typeof node !== 'object' || seen.has(node)) return acc;
  seen.add(node);
  if (Array.isArray(node)) {
    for (const item of node) collectWorkflowish(item, acc, seen);
    return acc;
  }
  const title = node.title ?? node.name ?? node.workflowName;
  if (typeof title === 'string' && (node.nodes || node.slug || node.id || node.url)) {
    acc.push({
      title,
      slug: node.slug,
      id: node.id,
      description: node.description ?? node.summary ?? node.excerpt,
      category: node.category ?? node.categories ?? node.type,
      tags: node.tags ?? node.keywords,
      url: node.url ?? node.link ?? node.permalink,
      definition: node.nodes ? node : undefined,
    });
  }
  for (const v of Object.values(node)) collectWorkflowish(v, acc, seen);
  return acc;
}

function fromEmbeddedState(html) {
  for (const re of [
    /<script[^>]+id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/,
    /window\.__NUXT__\s*=\s*({[\s\S]*?});?\s*<\/script>/,
    /window\.__INITIAL_STATE__\s*=\s*({[\s\S]*?});?\s*<\/script>/,
  ]) {
    const m = html.match(re);
    if (!m) continue;
    try {
      return collectWorkflowish(JSON.parse(m[1]));
    } catch { /* not JSON after all */ }
  }
  return [];
}

function fromAnchors(html, pageUrl) {
  const out = new Map();
  for (const [, href, inner] of html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
    if (!/workflow|template|automation|\.json$/i.test(href)) continue;
    if (/^(#|mailto:|javascript:)/i.test(href)) continue;
    const url = new URL(href, pageUrl).href;
    if (new URL(url).origin !== new URL(BASE).origin) continue;
    const title = inner.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    if (!out.has(url)) out.set(url, { title: title || url, url });
  }
  return [...out.values()];
}

/** Walk the listing page by page until it stops yielding anything new. */
async function discover() {
  const found = new Map();
  const apiCandidates = ['/api/workflows', '/api/library', '/api/v1/workflows', '/wp-json/wp/v2/workflow'];

  // A JSON API is the only sane way to page through tens of thousands.
  for (const endpoint of apiCandidates) {
    try {
      let page = 1;
      let got = 0;
      for (; page <= maxPages; page++) {
        const url = new URL(`${endpoint}${endpoint.includes('?') ? '&' : '?'}page=${page}&per_page=100`, BASE).href;
        const batch = collectWorkflowish(await get(url, 'json'));
        if (!batch.length) break;
        for (const e of batch) found.set(e.url ?? e.slug ?? e.id ?? e.title, e);
        got += batch.length;
        if (found.size >= limit) break;
        process.stdout.write(`\r  ${endpoint}: page ${page}, ${found.size} workflow(s)   `);
      }
      if (got) {
        process.stdout.write('\n');
        console.log(`  discovered via ${endpoint}`);
        return [...found.values()];
      }
    } catch { /* endpoint absent — try the next */ }
  }

  // Otherwise page the HTML listing.
  for (let page = 1; page <= maxPages; page++) {
    const url = new URL(page === 1 ? LIBRARY_PATH : `${LIBRARY_PATH}?page=${page}`, BASE).href;
    let html;
    try {
      html = await get(url);
    } catch {
      break;
    }
    if (page === 1) {
      await mkdir(RAW, { recursive: true });
      await writeFile(path.join(RAW, 'library.html'), html);
    }
    const batch = [...fromEmbeddedState(html), ...fromAnchors(html, url)];
    const before = found.size;
    for (const e of batch) found.set(e.url ?? e.slug ?? e.title, e);
    process.stdout.write(`\r  listing page ${page}: ${found.size} workflow(s)   `);
    if (found.size === before) break; // page added nothing new — we're at the end
    if (found.size >= limit) break;
  }
  process.stdout.write('\n');
  return [...found.values()];
}

/** Find the definition JSON for one workflow. */
async function resolveDefinition(entry) {
  if (entry.definition) return entry.definition;
  if (!entry.url) return undefined;
  if (entry.url.endsWith('.json')) return get(entry.url, 'json');

  const html = await get(entry.url);
  const embedded = fromEmbeddedState(html).find((e) => e.definition);
  if (embedded) return embedded.definition;

  const link = html.match(/href=["']([^"']+\.json(?:\?[^"']*)?)["']/i);
  if (link) return get(new URL(link[1], entry.url).href, 'json');

  const inline = html.match(/<pre[^>]*>\s*({[\s\S]*?"nodes"[\s\S]*?})\s*<\/pre>/i);
  if (inline) {
    try {
      return JSON.parse(inline[1]);
    } catch { /* not a definition */ }
  }
  return undefined;
}

async function main() {
  console.log(`Reading ${new URL(LIBRARY_PATH, BASE).href}`);
  const entries = (await discover()).slice(0, limit === Infinity ? undefined : limit);
  console.log(`Found ${entries.length.toLocaleString('en-US')} workflow(s).`);

  if (!entries.length) {
    console.error(
      `\nNothing matched. The page HTML is saved at raw/library.html — open it, find how the\n` +
        `listing is delivered, and point the fetcher straight at it:\n` +
        `  LIBRARY_PATH=/api/whatever node scripts/fetch-library.mjs`
    );
    process.exitCode = 1;
    return;
  }

  if (dryRun) {
    for (const e of entries.slice(0, 40)) console.log(`  ${slugify(e.slug ?? e.title)}  ${e.url ?? ''}`);
    if (entries.length > 40) console.log(`  … and ${entries.length - 40} more`);
    return;
  }

  // Resume: anything already downloaded is skipped unless --force.
  const onDisk = new Set(
    (await exists(OUT)) ? (await readdir(OUT, { withFileTypes: true })).filter((d) => d.isDirectory()).map((d) => d.name) : []
  );
  const todo = force ? entries : entries.filter((e) => !onDisk.has(slugify(e.slug ?? e.title)));
  console.log(`${onDisk.size} already on disk; fetching ${todo.length.toLocaleString('en-US')} at concurrency ${concurrency}.`);

  const failures = [];
  const started = Date.now();
  await pool(
    todo,
    async (entry) => {
      const slug = slugify(entry.slug ?? entry.title);
      const definition = await resolveDefinition(entry);
      const dir = path.join(OUT, slug);
      await mkdir(dir, { recursive: true });
      if (definition) await writeFile(path.join(dir, 'workflow.json'), JSON.stringify(definition, null, 2) + '\n');
      await writeFile(
        path.join(dir, 'meta.json'),
        JSON.stringify(
          {
            title: entry.title,
            slug,
            description: entry.description ?? '',
            category: entry.category ?? 'uncategorized',
            tags: [entry.tags ?? []].flat().filter(Boolean),
            source: entry.url ?? new URL(LIBRARY_PATH, BASE).href,
            retrievedAt: new Date().toISOString(),
          },
          null,
          2
        ) + '\n'
      );
    },
    ({ done, total, error, item }) => {
      if (error) failures.push({ item, error: error.message });
      if (done % 25 === 0 || done === total) {
        const rate = done / ((Date.now() - started) / 1000);
        const left = rate ? Math.round((total - done) / rate) : 0;
        process.stdout.write(
          `\r  ${done.toLocaleString('en-US')}/${total.toLocaleString('en-US')}` +
            `  ${rate.toFixed(1)}/s  ~${left}s left  ${failures.length} failed   `
        );
      }
    }
  );
  process.stdout.write('\n');

  if (failures.length) {
    await writeFile(path.join(RAW, 'failures.json'), JSON.stringify(failures, null, 2) + '\n');
    console.warn(`${failures.length} failed — listed in raw/failures.json. Re-run to retry just those.`);
  }
  console.log('Next: node scripts/build-catalog.mjs');
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
