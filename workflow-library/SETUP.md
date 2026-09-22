# Moving this into its own repository

This directory is a complete, standalone repository, parked here because
creating `gendaiski/workflow-library` from the session failed with
`403 Resource not accessible by integration` — the GitHub App installed on the
account can read and write repositories but cannot create them.

## To give it its own home

1. Create an empty **private** repository named `workflow-library` at
   <https://github.com/new> — no README, no .gitignore, no license.
2. From a checkout of this branch:

   ```bash
   cd workflow-library
   git init -b main
   git add -A
   git commit -m "Import the n8n workflow library"
   git remote add origin git@github.com:gendaiski/workflow-library.git
   git push -u origin main
   ```

3. Delete this `SETUP.md` and the `workflow-library/` directory from the trial
   repository once the real repository exists.

## Where the workflows came from

51 workflows were located in Dropbox under
`/Claude Projects/Content Creation/Content Playbook/Agents & Automation/n8n Workflows (Ready-Made)`
and all 102 files (`workflow.json` + `README.md`) were retrieved successfully.

Four are imported here. The rest were retrieved but could not be written to
disk: the cheap, byte-exact path reads the session transcript, and the auto-mode
permission classifier blocks that as `[Sensitive-Source Provenance]`. See the
session notes for the two ways to finish the import.

`workflowhubegy.com` itself is blocked by this environment's network egress
policy, so the Dropbox set has **not** been reconciled against the published
library listing.
