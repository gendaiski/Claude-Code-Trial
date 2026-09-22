#!/usr/bin/env node
/**
 * Rebuild catalog/index.json and the workflow table in README.md from whatever
 * is currently in ./workflows.
 *
 *   node scripts/build-catalog.mjs          # write
 *   node scripts/build-catalog.mjs --check  # fail if the catalog is stale (CI)
 */
import { readdir, readFile, writeFile, mkdir, access, rm } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const WORKFLOWS = path.join(ROOT, 'workflows');
const CATALOG = path.join(ROOT, 'catalog', 'index.json');
const BY_CATEGORY = path.join(ROOT, 'catalog', 'by-category');
// Past this many workflows a single README table stops being readable, so the
// README carries a summary and each category gets its own index file.
const INLINE_LIMIT = 200;
const README = path.join(ROOT, 'README.md');
const START = '<!-- catalog:start -->';
const END = '<!-- catalog:end -->';
const check = process.argv.includes('--check');

const exists = (p) => access(p).then(() => true, () => false);

async function collect() {
  if (!(await exists(WORKFLOWS))) return [];
  const dirs = (await readdir(WORKFLOWS, { withFileTypes: true }))
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

  const entries = [];
  for (const slug of dirs) {
    const metaPath = path.join(WORKFLOWS, slug, 'meta.json');
    if (!(await exists(metaPath))) continue;
    const meta = JSON.parse(await readFile(metaPath, 'utf8'));
    const defPath = path.join(WORKFLOWS, slug, 'workflow.json');
    const hasDefinition = await exists(defPath);
    let nodeCount;
    if (hasDefinition) {
      const def = JSON.parse(await readFile(defPath, 'utf8'));
      nodeCount = Array.isArray(def.nodes) ? def.nodes.length : undefined;
    }
    entries.push({
      slug,
      title: meta.title ?? slug,
      description: meta.description ?? '',
      category: meta.category ?? 'uncategorized',
      tags: meta.tags ?? [],
      source: meta.source ?? '',
      path: `workflows/${slug}`,
      hasDefinition,
      ...(nodeCount === undefined ? {} : { nodeCount }),
    });
  }
  return entries;
}

const cell = (s) => String(s).replace(/\|/g, '\\|').replace(/\n+/g, ' ').trim();

function groupByCategory(entries) {
  const by = new Map();
  for (const e of entries) {
    if (!by.has(e.category)) by.set(e.category, []);
    by.get(e.category).push(e);
  }
  return [...by.entries()].sort(([a], [b]) => a.localeCompare(b));
}

function rows(list) {
  return list
    .map(
      (e) =>
        `| [${cell(e.title)}](${e.path}) | ${cell(e.description).slice(0, 140)} | ${
          e.tags.map(cell).join(', ') || '—'
        } |`
    )
    .join('\n');
}

const TABLE_HEAD = '| Workflow | Description | Tags |\n| --- | --- | --- |';

/** Small library: every workflow listed inline, grouped by category. */
function renderInline(groups, count) {
  const sections = groups.map(
    ([category, list]) => `### ${category} (${list.length})\n\n${TABLE_HEAD}\n${rows(list)}`
  );
  return `**${count} workflows** across ${groups.length} categories.\n\n${sections.join('\n\n')}`;
}

/** Large library: a summary here, the detail in catalog/by-category/. */
function renderSummary(groups, count) {
  const body = groups
    .map(
      ([category, list]) =>
        `| [${cell(category)}](catalog/by-category/${categoryFile(category)}) | ${list.length} |`
    )
    .join('\n');
  return (
    `**${count.toLocaleString('en-US')} workflows** across ${groups.length} categories. ` +
    `Too many to list here — each category has its own index, and ` +
    `[\`catalog/index.json\`](catalog/index.json) holds every entry.\n\n` +
    `| Category | Workflows |\n| --- | --- |\n${body}`
  );
}

const categoryFile = (category) =>
  category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') + '.md';

async function writeCategoryIndexes(groups) {
  await rm(BY_CATEGORY, { recursive: true, force: true });
  await mkdir(BY_CATEGORY, { recursive: true });
  for (const [category, list] of groups) {
    const body =
      `# ${category}\n\n${list.length} workflow(s).\n\n${TABLE_HEAD}\n` +
      rows(list).replace(/\]\(workflows\//g, '](../../workflows/') +
      '\n';
    await writeFile(path.join(BY_CATEGORY, categoryFile(category)), body);
  }
}

function renderTable(entries) {
  if (!entries.length) {
    return `${START}\n\n_No workflows imported yet. See [docs/IMPORTING.md](docs/IMPORTING.md)._\n\n${END}`;
  }
  const groups = groupByCategory(entries);
  const body =
    entries.length > INLINE_LIMIT
      ? renderSummary(groups, entries.length)
      : renderInline(groups, entries.length);
  return `${START}\n\n${body}\n\n${END}`;
}

async function main() {
  const entries = await collect();
  const catalog = {
    generatedAt: new Date().toISOString(),
    count: entries.length,
    workflows: entries,
  };

  const readme = await readFile(README, 'utf8');
  if (!readme.includes(START) || !readme.includes(END)) {
    throw new Error(`README.md is missing the ${START} / ${END} markers`);
  }
  const nextReadme =
    readme.slice(0, readme.indexOf(START)) +
    renderTable(entries) +
    readme.slice(readme.indexOf(END) + END.length);

  if (check) {
    // generatedAt always differs, so compare only the parts that matter.
    const current = (await exists(CATALOG))
      ? JSON.parse(await readFile(CATALOG, 'utf8'))
      : { workflows: null };
    const stale =
      JSON.stringify(current.workflows) !== JSON.stringify(entries) || nextReadme !== readme;
    if (stale) {
      console.error('Catalog is out of date. Run: node scripts/build-catalog.mjs');
      process.exit(1);
    }
    console.log(`Catalog is current (${entries.length} workflows).`);
    return;
  }

  await mkdir(path.dirname(CATALOG), { recursive: true });
  await writeFile(CATALOG, JSON.stringify(catalog, null, 2) + '\n');
  await writeFile(README, nextReadme);
  if (entries.length > INLINE_LIMIT) {
    await writeCategoryIndexes(groupByCategory(entries));
    console.log(`Catalog written: ${entries.length} workflow(s), indexed by category.`);
  } else {
    await rm(BY_CATEGORY, { recursive: true, force: true });
    console.log(`Catalog written: ${entries.length} workflow(s).`);
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
