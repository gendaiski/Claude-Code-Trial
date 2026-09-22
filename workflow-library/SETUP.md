# State of this library, and what's left

## What's here

51 workflows, read from Dropbox
(`/Claude Projects/Content Creation/Content Playbook/Agents & Automation/n8n Workflows (Ready-Made)`),
every one **byte-identical** to its source — verified against Dropbox's own
content hashes. `npm run checksums` re-checks that offline at any time.

## What's missing

The owner reports the published library at workflowhubegy.com holds about
**27,000** workflows. Those are not in Dropbox: a search of the whole account
finds 68 files named `workflow.json` plus 6 in `n8n Flows (Directory)`. The 51
here are a small subset of what the site publishes.

`workflowhubegy.com` is blocked by the network egress policy of the environment
this was built in, so the full library could not be read. The fetcher is built
and tested for that scale; it just needs to run somewhere that can reach the
site.

## Getting the other 26,900

Either allow `workflowhubegy.com` through the environment's network policy and
run it in a fresh session, or run it on any machine with Node 18+:

```bash
node scripts/fetch-library.mjs --dry-run          # discover only
node scripts/fetch-library.mjs --concurrency 16   # download everything
node scripts/build-catalog.mjs
```

It pages through the listing, downloads in parallel, retries transient
failures, and skips whatever is already on disk — so it is safe to stop and
re-run. At ~5 KB a definition, 27,000 is about 142 MB.

**Do not try to pull them through a chat file-connector.** Every byte would pass
through the model's context: roughly 40M tokens for 27,000 workflows, which no
session can carry. Over plain HTTP the script streams straight to disk and the
cost is bandwidth.

If it finds nothing, the site's listing is delivered some way the discovery
guesses don't cover. `raw/library.html` is saved for exactly that case, and
`docs/IMPORTING.md` explains how to point the fetcher at the real endpoint.

## Its own repository

Creating `gendaiski/workflow-library` from the session failed with
`403 Resource not accessible by integration` — the GitHub App can read and write
repositories but cannot create them. Retried after reconnecting; identical
failure, so it is a permission scope, not a transient error.

Browser-only instructions: [docs/PUBLISHING.md](docs/PUBLISHING.md).
With a terminal:

```bash
cd workflow-library
git init -b main && git add -A && git commit -m "Add the n8n workflow library"
git remote add origin git@github.com:gendaiski/workflow-library.git
git push -u origin main
```
