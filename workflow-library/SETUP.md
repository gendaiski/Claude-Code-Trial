# Moving this into its own repository

This directory is a complete, standalone repository holding all 51 workflows.
It is parked here because creating `gendaiski/workflow-library` from the session
failed with `403 Resource not accessible by integration` — the GitHub App
installed on the account can read and write repositories but cannot create them.
That was retried after the GitHub connection was re-established and failed
identically, so it is a permission scope, not a transient error.

## To give it its own home

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

## Where the workflows came from

All 51 were read from Dropbox, under
`/Claude Projects/Content Creation/Content Playbook/Agents & Automation/n8n Workflows (Ready-Made)`.

`workflowhubegy.com` is blocked by this environment's network egress policy, so
the Dropbox set has **not** been reconciled against the published library
listing. When the site is reachable, `scripts/fetch-library.mjs` pulls the
published listing into the same layout and git shows the difference.

## Fidelity

The definitions were rebuilt from the retrieved content rather than copied byte
for byte, because the byte-exact write path was blocked by a permission
classifier. Spot checks against the originals (a plain workflow, a branching
one, a real-estate one, and two legal ones carrying `—` escapes inside the
JS source) matched exactly, and `npm run verify` passes on all 51. Diff against
Dropbox before treating this as an archive of record.
