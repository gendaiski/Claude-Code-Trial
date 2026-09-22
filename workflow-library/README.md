# Workflow Library

A self-hosted, version-controlled library of the workflows from
[workflowhubegy.com/library](https://workflowhubegy.com/library).

Each workflow lives in its own folder under `workflows/`:

```
workflows/<slug>/
├── workflow.json   # the workflow definition, exactly as published
└── meta.json       # title, description, category, tags, source URL, retrieval date
```

`catalog/index.json` is a machine-readable index of everything in the library,
and the table below is generated from it. Both are rebuilt with one command, so
the catalog can never drift from what is actually on disk.

## Getting the workflows in

```bash
# From the live site (run from a machine that can reach it)
node scripts/fetch-library.mjs --dry-run   # preview what it finds
node scripts/fetch-library.mjs             # download everything

# From an export you already have
node scripts/import-local.mjs ~/Downloads/workflowhub-export.zip

# Then, always:
node scripts/build-catalog.mjs
```

Full notes, including what to do when the site's markup doesn't match what the
fetcher expects, are in [docs/IMPORTING.md](docs/IMPORTING.md).

## Using a workflow

Open the `workflow.json` you want and import it into your automation tool
(n8n, Make, Zapier export, or whatever the library publishes for). Before
running one, read it for credentials, webhook URLs, and hard-coded IDs —
published workflows routinely carry placeholders that need replacing.

## Commands

| Command | What it does |
| --- | --- |
| `npm run fetch` | Download workflows from the live library |
| `npm run import -- <path>` | Import a local directory, zip, or JSON export |
| `npm run catalog` | Rebuild `catalog/index.json` and the table below |
| `npm run validate` | Fail if the catalog is stale (used in CI) |

## Library

<!-- catalog:start -->

_No workflows imported yet. See [docs/IMPORTING.md](docs/IMPORTING.md)._

<!-- catalog:end -->

## Provenance

These workflows are mirrored from workflowhubegy.com by the repository owner,
who holds the rights to do so. `meta.json` records each workflow's source URL
and the date it was retrieved. Nothing here is re-licensed — the original terms
attached to each workflow still apply.
