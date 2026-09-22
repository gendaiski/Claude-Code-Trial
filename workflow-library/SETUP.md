# Moving this into its own repository

This directory is a complete, standalone repository that is parked here only
because it could not be pushed to its own remote yet:

- `workflowhubegy.com` is blocked by this environment's network egress policy,
  so the workflows themselves could not be downloaded.
- Creating `gendaiski/workflow-library` from the session failed with
  `403 Resource not accessible by integration` — the GitHub App installed on
  the account can read and write repositories but cannot create them.

## To give it its own home

1. Create an empty **private** repository named `workflow-library` at
   <https://github.com/new> — no README, no .gitignore, no license.
2. From a checkout of this branch:

   ```bash
   cd workflow-library
   git init -b main
   git add -A
   git commit -m "Set up the workflow library"
   git remote add origin git@github.com:gendaiski/workflow-library.git
   git push -u origin main
   ```

3. Delete this `SETUP.md` and the `workflow-library/` directory from the trial
   repository once the real repository exists.

## To fill it with the workflows

See `docs/IMPORTING.md`. In short, from a machine that can reach the site:

```bash
node scripts/fetch-library.mjs --dry-run
node scripts/fetch-library.mjs
node scripts/build-catalog.mjs
```
