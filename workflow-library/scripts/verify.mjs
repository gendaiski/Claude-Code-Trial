#!/usr/bin/env node
/**
 * Check every workflow in the library is structurally sound and safe to import.
 *
 *   node scripts/verify.mjs
 *
 * Exits non-zero on the first category of problem found, listing every instance.
 * This runs in CI alongside the catalog check.
 */
import { readdir, readFile, access } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const WORKFLOWS = path.join(ROOT, 'workflows');
const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';

const exists = (p) => access(p).then(() => true, () => false);
const problems = [];
const fail = (slug, msg) => problems.push(`${slug}: ${msg}`);

async function checkWorkflow(slug) {
  const dir = path.join(WORKFLOWS, slug);
  const defPath = path.join(dir, 'workflow.json');
  if (!(await exists(defPath))) return fail(slug, 'no workflow.json');
  if (!(await exists(path.join(dir, 'meta.json')))) fail(slug, 'no meta.json');

  let def;
  try {
    def = JSON.parse(await readFile(defPath, 'utf8'));
  } catch (err) {
    return fail(slug, `workflow.json does not parse: ${err.message}`);
  }

  if (!def.name) fail(slug, 'workflow has no name');
  if (!Array.isArray(def.nodes) || !def.nodes.length) return fail(slug, 'no nodes');

  const names = new Set();
  const ids = new Set();
  for (const node of def.nodes) {
    for (const key of ['id', 'name', 'type', 'typeVersion', 'position', 'parameters']) {
      if (!(key in node)) fail(slug, `node ${node.name ?? '?'} is missing ${key}`);
    }
    if (names.has(node.name)) fail(slug, `duplicate node name ${node.name}`);
    if (ids.has(node.id)) fail(slug, `duplicate node id ${node.id}`);
    names.add(node.name);
    ids.add(node.id);
  }

  // A connection pointing at a node that doesn't exist silently breaks the import.
  for (const [source, conn] of Object.entries(def.connections ?? {})) {
    if (!names.has(source)) fail(slug, `connection source "${source}" is not a node`);
    for (const branch of conn.main ?? []) {
      for (const target of branch) {
        if (!names.has(target.node)) fail(slug, `connection target "${target.node}" is not a node`);
      }
    }
  }

  const claude = def.nodes.filter(
    (n) => n.type === 'n8n-nodes-base.httpRequest' && n.parameters?.url === ANTHROPIC_URL
  );
  if (claude.length !== 1) fail(slug, `expected 1 Anthropic call, found ${claude.length}`);
  else if (claude[0].credentials?.httpHeaderAuth?.id !== 'REPLACE_ME') {
    fail(slug, 'Anthropic node is missing the REPLACE_ME credential placeholder');
  }

  // A real key committed here would leak the moment the repo is shared.
  const raw = JSON.stringify(def);
  if (/sk-ant-[A-Za-z0-9_-]{8,}/.test(raw)) fail(slug, 'looks like it contains a real Anthropic key');

  if (def.active === true) fail(slug, 'is marked active — definitions ship inactive');
  if (!def.nodes.some((n) => n.type === 'n8n-nodes-base.stickyNote')) {
    fail(slug, 'has no "Setup — read me" sticky note');
  }
  return def.nodes.length;
}

async function main() {
  if (!(await exists(WORKFLOWS))) {
    console.error('No workflows/ directory.');
    process.exit(1);
  }
  const slugs = (await readdir(WORKFLOWS, { withFileTypes: true }))
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

  let nodes = 0;
  for (const slug of slugs) nodes += (await checkWorkflow(slug)) ?? 0;

  if (problems.length) {
    console.error(`${problems.length} problem(s):`);
    for (const p of problems) console.error(`  ${p}`);
    process.exit(1);
  }
  console.log(`${slugs.length} workflow(s), ${nodes} nodes — all sound.`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
