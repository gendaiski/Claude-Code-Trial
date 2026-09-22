#!/usr/bin/env node
/**
 * Fold an export you already have into the library.
 *
 *   node scripts/import-local.mjs ~/Downloads/workflowhub-export
 *   node scripts/import-local.mjs ~/Downloads/export.zip
 *
 * Accepts a directory tree of .json files, a .zip of the same, or a single
 * .json file holding either one workflow or an array of them. Titles and tags
 * are read off each definition where present; anything missing falls back to
 * the file name.
 */
import { mkdir, readdir, readFile, writeFile, stat, rm } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import os from 'node:os';

const run = promisify(execFile);
const ROOT = path.resolve(import.meta.dirname, '..');
const OUT = path.join(ROOT, 'workflows');

const slugify = (s) =>
  String(s)
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9؀-ۿ]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'workflow';

async function jsonFilesUnder(dir) {
  const found = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) found.push(...(await jsonFilesUnder(full)));
    else if (entry.name.toLowerCase().endsWith('.json')) found.push(full);
  }
  return found;
}

/** One file may hold a single workflow or a list of them. */
function definitionsIn(payload, fallbackTitle) {
  const list = Array.isArray(payload) ? payload : [payload];
  return list
    .filter((d) => d && typeof d === 'object')
    .map((d) => ({ definition: d, title: d.name ?? d.title ?? fallbackTitle }));
}

async function main() {
  const source = process.argv[2];
  if (!source) {
    console.error('Usage: node scripts/import-local.mjs <directory|zip|json>');
    process.exit(1);
  }

  const resolved = path.resolve(source);
  const info = await stat(resolved);
  let searchRoot = resolved;
  let temp;

  if (info.isFile() && resolved.toLowerCase().endsWith('.zip')) {
    temp = path.join(os.tmpdir(), `wf-import-${Date.now()}`);
    await mkdir(temp, { recursive: true });
    await run('unzip', ['-q', resolved, '-d', temp]);
    searchRoot = temp;
  }

  const files = (await stat(searchRoot)).isDirectory()
    ? await jsonFilesUnder(searchRoot)
    : [searchRoot];

  let imported = 0;
  for (const file of files) {
    let payload;
    try {
      payload = JSON.parse(await readFile(file, 'utf8'));
    } catch (err) {
      console.warn(`  ! skipping ${path.basename(file)}: ${err.message}`);
      continue;
    }
    const fallback = path.basename(file, '.json');
    for (const { definition, title } of definitionsIn(payload, fallback)) {
      const slug = slugify(title);
      const dir = path.join(OUT, slug);
      await mkdir(dir, { recursive: true });
      await writeFile(path.join(dir, 'workflow.json'), JSON.stringify(definition, null, 2) + '\n');
      await writeFile(
        path.join(dir, 'meta.json'),
        JSON.stringify(
          {
            title,
            slug,
            description: definition.description ?? definition.meta?.description ?? '',
            category: definition.category ?? 'uncategorized',
            tags: [definition.tags ?? definition.meta?.tags ?? []].flat().filter(Boolean),
            source: path.relative(searchRoot, file) || path.basename(file),
            retrievedAt: new Date().toISOString(),
          },
          null,
          2
        ) + '\n'
      );
      imported += 1;
      console.log(`  + ${slug}`);
    }
  }

  if (temp) await rm(temp, { recursive: true, force: true });
  console.log(`\nImported ${imported} workflow(s). Next: node scripts/build-catalog.mjs`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
