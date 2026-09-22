# Importing workflows

## Option A — fetch from the live site

```bash
node scripts/fetch-library.mjs --dry-run
```

The fetcher does not assume a particular site structure. It tries, in order:

1. **Embedded state** — `__NEXT_DATA__`, `window.__NUXT__`, `window.__INITIAL_STATE__`
2. **JSON-LD** — `application/ld+json` blocks describing an `ItemList`
3. **A JSON API** — probes `/api/workflows`, `/api/library`, `/library.json`,
   `/wp-json/wp/v2/workflow`, and a few others
4. **Page anchors** — links whose href mentions `workflow`, `template`,
   `automation`, or ends in `.json`

It prints which strategy matched and how many workflows it found. `--dry-run`
lists them without writing anything.

Useful flags and variables:

| Flag / env | Purpose |
| --- | --- |
| `--dry-run` | List what was found, write nothing |
| `--limit 5` | Stop after N workflows (handy while iterating) |
| `--cookie "session=..."` | Send a session cookie if the library needs a login |
| `LIBRARY_BASE` | Override the origin (default `https://workflowhubegy.com`) |
| `LIBRARY_PATH` | Override the listing path (default `/library`) |

### When it finds nothing

The raw HTML is saved to `raw/library.html`. Open it and check how the list
is actually delivered:

- **The list arrives over XHR.** Open the site with DevTools → Network → Fetch/XHR,
  find the request that returns the workflows, and point the fetcher straight
  at it: `LIBRARY_PATH=/api/whatever node scripts/fetch-library.mjs`.
- **The list is rendered by JavaScript with no JSON endpoint.** The page needs a
  real browser. Load the library in your browser, and either use the site's own
  export/download control, or save the rendered page and run
  `node scripts/import-local.mjs` over the downloaded JSON files.
- **The markup is plain but unusual.** Adjust the strategy functions near the top
  of `scripts/fetch-library.mjs` — each one is self-contained and returns a list
  of `{ title, url, description, tags }`.

## Option B — import an export you already have

If the site offers a bulk download, or you have the workflows in a folder:

```bash
node scripts/import-local.mjs ~/Downloads/workflowhub-export.zip
node scripts/import-local.mjs ~/Downloads/workflows/
node scripts/import-local.mjs ~/Downloads/single-workflow.json
```

Directories are searched recursively for `.json` files. A file containing an
array of workflows is split into one folder per workflow. Titles come from the
definition's `name`/`title` field, falling back to the file name.

## Always finish with the catalog

```bash
node scripts/build-catalog.mjs
```

This regenerates `catalog/index.json` and the table in `README.md`. CI runs
`npm run validate`, which fails the build if the two ever drift apart.

## Re-running

Both importers overwrite a workflow's folder in place, keyed by slug. Re-running
the fetcher refreshes the library and leaves the git history as the record of
what changed between pulls.
