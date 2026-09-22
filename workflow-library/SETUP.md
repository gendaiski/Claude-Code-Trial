# Moving this into its own repository

This directory is a complete, standalone repository holding all 51 workflows.
It is parked here because creating `gendaiski/workflow-library` from the session
failed with `403 Resource not accessible by integration` — the GitHub App can
read and write repositories but cannot create them. That was retried after the
GitHub connection was re-established and failed identically, so it is a
permission scope, not a transient error.

**If you don't use a terminal, follow [docs/PUBLISHING.md](docs/PUBLISHING.md)
instead — it does this entirely through the browser.**

## With a terminal

1. Create an empty **private** repository named `workflow-library` at
   <https://github.com/new> — no README, no .gitignore, no license.
2. From a checkout of this branch:

   ```bash
   cd workflow-library
   git init -b main
   git add -A
   git commit -m "Add the n8n workflow library"
   git remote add origin git@github.com:gendaiski/workflow-library.git
   git push -u origin main
   ```

3. Delete this `SETUP.md` and the `workflow-library/` directory from the trial
   repository once the real repository exists.

## Provenance

All 51 were read from Dropbox, under
`/Claude Projects/Content Creation/Content Playbook/Agents & Automation/n8n Workflows (Ready-Made)`,
and every one is **byte-identical** to its source — verified against Dropbox's
own content hashes. `npm run checksums` re-checks that offline at any time.

`workflowhubegy.com` is blocked by this environment's network egress policy, so
this set has **not** been compared against the published library listing. When
the site is reachable, `scripts/fetch-library.mjs` pulls that listing into the
same layout and git shows the difference.
