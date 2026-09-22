#!/usr/bin/env node
/**
 * Check each workflow still matches the copy it was imported from.
 *
 *   node scripts/checksums.mjs            # verify against catalog/provenance.json
 *   node scripts/checksums.mjs --write     # record current hashes (import time only)
 *
 * catalog/provenance.json holds, per workflow, the Dropbox content hash of the
 * source file. Dropbox computes that as SHA256 over each 4 MiB block, joined,
 * then SHA256 of the join — so the same value can be recomputed here with no
 * network access, and any later edit to a definition shows up immediately.
 *
 * The source files are stored with 2-space indent, non-ASCII escaped as \uXXXX
 * and no trailing newline; canonicalise() reproduces exactly that byte stream.
 */
import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const WORKFLOWS = path.join(ROOT, 'workflows');
const MANIFEST = path.join(ROOT, 'catalog', 'provenance.json');
const BLOCK = 4 * 1024 * 1024;

/** The byte stream the source file holds, regardless of how we store it here. */
function canonicalise(obj) {
  const json = JSON.stringify(obj, null, 2);
  // Non-ASCII is written as a \uXXXX escape in the source files.
  const escaped = json.replace(/[\u007f-￿]/g, (c) =>
    '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0')
  );
  return Buffer.from(escaped, 'utf8');
}

function dropboxHash(buf) {
  const blocks = [];
  for (let i = 0; i < Math.max(buf.length, 1); i += BLOCK) {
    blocks.push(createHash('sha256').update(buf.subarray(i, i + BLOCK)).digest());
  }
  return createHash('sha256').update(Buffer.concat(blocks)).digest('hex');
}

async function main() {
  const write = process.argv.includes('--write');
  const slugs = (await readdir(WORKFLOWS, { withFileTypes: true }))
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

  const current = {};
  for (const slug of slugs) {
    const def = JSON.parse(await readFile(path.join(WORKFLOWS, slug, 'workflow.json'), 'utf8'));
    current[slug] = dropboxHash(canonicalise(def));
  }

  if (write) {
    await writeFile(MANIFEST, JSON.stringify({ algorithm: 'dropbox-content-hash', workflows: current }, null, 2) + '\n');
    console.log(`Recorded ${slugs.length} checksum(s).`);
    return;
  }

  let manifest;
  try {
    manifest = JSON.parse(await readFile(MANIFEST, 'utf8')).workflows;
  } catch {
    console.error('No catalog/provenance.json — run with --write at import time.');
    process.exit(1);
  }

  const changed = slugs.filter((s) => manifest[s] && manifest[s] !== current[s]);
  const missing = slugs.filter((s) => !manifest[s]);
  const gone = Object.keys(manifest).filter((s) => !current[s]);

  for (const s of changed) console.error(`  changed since import: ${s}`);
  for (const s of missing) console.error(`  not in the manifest:  ${s}`);
  for (const s of gone) console.error(`  missing from disk:    ${s}`);
  if (changed.length || missing.length || gone.length) process.exit(1);

  console.log(`${slugs.length} workflow(s) match the source they were imported from.`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
