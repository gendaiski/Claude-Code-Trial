#!/usr/bin/env node
/**
 * Rebuild catalog/index.json and the workflow table in README.md from whatever
 * is currently in ./workflows.
 *
 *   node scripts/build-catalog.mjs          # write
 *   node scripts/build-catalog.mjs --check  # fail if the catalog is stale (CI)
 */
import { readdir, readFile, writeFile, mkdir, access } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const WORKFLOWS = path.join(ROOT, 'workflows');
const CATALOG = path.join(ROOT, 'catalog', 'index.json');
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

function renderTable(entries) {
  if (!entries.length) {
    return `${START}\n\n_No workflows imported yet. See [docs/IMPORTING.md](docs/IMPORTING.md)._\n\n${END}`;
  }
  const byCategory = new Map();
  for (const e of entries) {
    if (!byCategory.has(e.category)) byCategory.set(e.category, []);
    byCategory.get(e.category).push(e);
  }
  const cell = (s) => String(s).replace(/\|/g, '\\|').replace(/\n+/g, ' ').trim();
  const sections = [...byCategory.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([category, list]) => {
      const rows = list
        .map(
          (e) =>
            `| [${cell(e.title)}](${e.path}) | ${cell(e.description).slice(0, 140)} | ${
              e.tags.map(cell).join(', ') || '—'
            } |`
        )
        .join('\n');
      return `### ${category} (${list.length})\n\n| Workflow | Description | Tags |\n| --- | --- | --- |\n${rows}`;
    });
  return `${START}\n\n**${entries.length} workflows** across ${byCategory.size} categories.\n\n${sections.join(
    '\n\n'
  )}\n\n${END}`;
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
  console.log(`Catalog written: ${entries.length} workflow(s).`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
