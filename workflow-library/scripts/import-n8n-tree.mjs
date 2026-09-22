#!/usr/bin/env node
/**
 * Import an n8n library laid out as <department>/<slug>/{workflow.json,README.md}
 * into ./workflows, carrying the department across as the category and pulling
 * the title, description, trigger and skills out of each README.
 *
 *   node scripts/import-n8n-tree.mjs <source-dir>
 */
import { mkdir, readdir, readFile, writeFile, stat, access } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT = path.join(ROOT, 'workflows');

const exists = (p) => access(p).then(() => true, () => false);

const slugify = (s) =>
  String(s)
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'workflow';

/** Strip a leading "01 " ordering prefix off a department folder. */
const cleanCategory = (s) => s.replace(/^\d+\s+/, '').trim();

/** Pull the fields the README puts in bold, e.g. "**Trigger:** Webhook POST /lead". */
function readField(md, ...names) {
  for (const name of names) {
    const m = md.match(new RegExp(`\\*\\*${name}:?\\*\\*\\s*(.+)`, 'i'));
    if (m) return m[1].replace(/\s+$/, '').replace(/\s{2,}$/, '').trim();
  }
  return undefined;
}

function parseReadme(md) {
  const title = md.match(/^#\s+(.+)$/m)?.[1]?.trim();
  // The description is the first non-empty line after the H1 that isn't a field.
  const body = md.split(/\r?\n/);
  const h1 = body.findIndex((l) => /^#\s+/.test(l));
  let description;
  for (const line of body.slice(h1 + 1)) {
    const t = line.trim();
    if (!t || t.startsWith('**') || t.startsWith('#')) continue;
    description = t;
    break;
  }
  return {
    title,
    description,
    department: readField(md, 'Department', 'Team'),
    trigger: readField(md, 'Trigger'),
    skills: readField(md, 'Agent Skills', 'Manager / agent Skills'),
    integrations: readField(md, 'Integrations needed'),
    humanGate: readField(md, 'Human gate'),
  };
}

/** Find every directory holding a workflow.json, at any depth. */
async function findWorkflowDirs(dir, acc = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const full = path.join(dir, entry.name);
    if (await exists(path.join(full, 'workflow.json'))) acc.push(full);
    else await findWorkflowDirs(full, acc);
  }
  return acc;
}

async function main() {
  const source = path.resolve(process.argv[2] ?? '');
  if (!process.argv[2] || !(await stat(source)).isDirectory()) {
    console.error('Usage: node scripts/import-n8n-tree.mjs <source-dir>');
    process.exit(1);
  }

  const dirs = (await findWorkflowDirs(source)).sort();
  let imported = 0;

  for (const dir of dirs) {
    const rel = path.relative(source, dir);
    const definition = JSON.parse(await readFile(path.join(dir, 'workflow.json'), 'utf8'));
    const readmePath = path.join(dir, 'README.md');
    const readme = (await exists(readmePath)) ? await readFile(readmePath, 'utf8') : '';
    const meta = readme ? parseReadme(readme) : {};

    const title = meta.title ?? definition.name ?? path.basename(dir);
    const slug = slugify(path.basename(dir) === 'workflow' ? title : path.basename(dir));
    // Prefer the README's own Department/Team, then the department folder the
    // workflow sits in. A workflow at the top level belongs to no department.
    const category =
      meta.department ??
      (rel.includes(path.sep) ? cleanCategory(rel.split(path.sep)[0]) : 'General');

    const tags = [
      ...(definition.tags ?? []).map((t) => (typeof t === 'string' ? t : t.name)),
      ...(meta.skills ? meta.skills.split(/\s*·\s*/) : []),
    ].filter(Boolean);

    const dest = path.join(OUT, slug);
    await mkdir(dest, { recursive: true });
    await writeFile(path.join(dest, 'workflow.json'), JSON.stringify(definition, null, 2) + '\n');
    if (readme) await writeFile(path.join(dest, 'README.md'), readme);
    await writeFile(
      path.join(dest, 'meta.json'),
      JSON.stringify(
        {
          title,
          slug,
          description: meta.description ?? '',
          category,
          tags: [...new Set(tags)],
          trigger: meta.trigger,
          integrations: meta.integrations,
          humanGate: meta.humanGate,
          nodeCount: Array.isArray(definition.nodes) ? definition.nodes.length : undefined,
          source: `dropbox:/Claude Projects/.../n8n Workflows (Ready-Made)/${rel}`,
          retrievedAt: new Date().toISOString(),
        },
        (_k, v) => (v === undefined ? undefined : v),
        2
      ) + '\n'
    );
    imported += 1;
    console.log(`  + ${category} / ${slug}`);
  }

  console.log(`\nImported ${imported} workflow(s). Next: node scripts/build-catalog.mjs`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
