# Putting this library in its own repository

No command line needed. This takes about five minutes.

The library currently lives inside another repository, in a folder called
`workflow-library`. These steps give it a home of its own.

## 1. Create the empty repository

1. Go to <https://github.com/new>.
2. **Repository name:** `workflow-library`
3. Choose **Private**.
4. Leave *Add a README*, *Add .gitignore* and *Choose a license* all
   **unticked**. The repository must start empty.
5. Click **Create repository**.

GitHub will show a mostly blank page with some setup instructions. Leave that
tab open.

## 2. Get the files onto your computer

You were sent a file called `workflow-library.bundle`. If you still have the
folder of files instead, skip to step 3.

To turn the bundle back into a folder you need Git installed
([git-scm.com](https://git-scm.com/downloads)), then double-click a terminal and
run:

```bash
git clone workflow-library.bundle workflow-library
```

That produces a `workflow-library` folder containing everything.

## 3. Upload

On the empty repository page from step 1, click **uploading an existing file**
(it's in the line "…or upload an existing file").

Then drag the **contents** of the `workflow-library` folder into the browser
window — not the folder itself, the things inside it: `README.md`, `package.json`,
`workflows`, `catalog`, `scripts`, `docs`.

GitHub keeps the folder structure. With 165 files it may take a minute.

Scroll down, type a short description such as `Add the n8n workflow library`, and
click **Commit changes**.

## 4. Check it worked

The repository front page should show the README with a table of 51 workflows
grouped by department. Click into `workflows/` — you should see 51 folders.

## What you lose by uploading this way

Uploading through the browser creates a single commit, so the project's history
(which change happened when, and why) is flattened. The content is identical and
everything works. If you would rather keep the history, hand the bundle to
someone comfortable with Git and ask them to push it — the commands are in
`SETUP.md`.

## Hidden files

The upload may skip `.github/workflows/catalog.yml` and `.gitignore`, because
browsers often hide files starting with a dot. Nothing breaks without them —
`.github/workflows/catalog.yml` only runs the automatic checks, and `.gitignore`
only keeps clutter out. If you want them, create them by hand on GitHub with
**Add file** → **Create new file**, using the same names and contents.
