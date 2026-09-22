# Moving this into its own repository

This directory is a complete, standalone repository holding all 51 workflows.
It is parked here because creating `gendaiski/workflow-library` from the session
failed with `403 Resource not accessible by integration` — the GitHub App
installed on the account can read and write repositories but cannot create them.

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
