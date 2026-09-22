# Workflow Library

A self-hosted, version-controlled library of ready-made n8n workflows — each one
a Claude-powered automation with a human approval gate before anything
irreversible.

Each workflow lives in its own folder under `workflows/`:

```
workflows/<slug>/
├── workflow.json   # the n8n definition, importable as-is
├── README.md       # setup notes, the Claude prompt, the safety gate
└── meta.json       # title, description, department, tags, trigger, integrations, provenance
```

`catalog/index.json` is a machine-readable index of everything in the library,
and the table below is generated from it. Both are rebuilt with one command, so
the catalog can never drift from what is actually on disk.

## Getting the workflows in

```bash
# From a department-organised n8n tree (<department>/<slug>/workflow.json)
node scripts/import-n8n-tree.mjs ~/path/to/n8n-workflows

# From a flat export — a directory, a zip, or a single JSON file
node scripts/import-local.mjs ~/Downloads/export.zip

# From the live workflowhubegy.com library
node scripts/fetch-library.mjs --dry-run   # preview what it finds
node scripts/fetch-library.mjs             # download everything

# Then, always:
node scripts/build-catalog.mjs
```

Full notes, including what to do when the site's markup doesn't match what the
fetcher expects, are in [docs/IMPORTING.md](docs/IMPORTING.md).

## Using a workflow

In n8n: **Workflows → Import from File → `workflow.json`**. Then:

1. Add an **Anthropic** credential (Credentials → *Header Auth*, name `x-api-key`)
   and select it on the *ask Claude* node.
2. Update the model in the *build prompt* Code node — the definitions ship with
   `claude-sonnet-4-5`; set it to the model you actually want to run.
3. Replace every **NoOp** node marked *(replace)* with your real Slack, Gmail,
   CRM, Sheets or helpdesk node.
4. Read the yellow **Setup — read me** sticky note inside the workflow, and keep
   the human-gate node ahead of anything irreversible (send, post, pay, delete).

Each folder's `README.md` carries the workflow's own Claude prompt and its
safety note.

## Commands

| Command | What it does |
| --- | --- |
| `npm run fetch` | Download workflows from the live workflowhubegy.com library |
| `npm run import -- <path>` | Import a flat export: directory, zip, or JSON file |
| `npm run import:tree -- <path>` | Import a department-organised n8n tree |
| `npm run catalog` | Rebuild `catalog/index.json` and the table below |
| `npm run validate` | Fail if the catalog is stale (used in CI) |

## Library

<!-- catalog:start -->

**4 workflows** across 2 categories.

### General (1)

| Workflow | Description | Tags |
| --- | --- | --- |
| [Lead Qualify & Route](workflows/01-lead-qualify-and-route) | Qualify an inbound lead against your ICP; route good fits to the CRM + rep, archive the rest. | — |

### Marketing & Content Department (3)

| Workflow | Description | Tags |
| --- | --- | --- |
| [Content Brief → Draft](workflows/content-brief-to-draft) | Turn a content brief into a researched, on-brand first draft for approval. | Marketing & Content Department, content-ops-manager, editing-prose |
| [SEO Article Pipeline](workflows/seo-article-pipeline) | Expand a target keyword into an SEO-structured outline and draft. | Marketing & Content Department, writing-seo-content |
| [Social Repurpose Studio](workflows/social-repurpose) | Turn one long piece into platform-native posts for each channel. | Marketing & Content Department, drafting-social-posts |

<!-- catalog:end -->

## Provenance

Every workflow records where it came from and when, in its `meta.json` `source`
field. The workflows currently in this library were imported from the owner's
own Dropbox (`n8n Workflows (Ready-Made)`); they have **not** been reconciled
against the published workflowhubegy.com/library listing, which the import
environment could not reach. Nothing here is re-licensed — the original terms
attached to each workflow still apply.
