# Getting started — no prior experience needed

This library is 51 ready-made automations. Each one is a small recipe: something
happens, Claude reads it and writes a structured answer, and a person approves
what happens next. None of them do anything on their own until you set them up.

You don't have to set up all 51. Start with one.

## What you need

- **An n8n account.** n8n is the app that runs these automations. The hosted
  version at [n8n.io](https://n8n.io) is the easiest start; there is nothing to
  install.
- **An Anthropic API key.** This is what lets the automation talk to Claude. You
  get one from [console.anthropic.com](https://console.anthropic.com) → API
  keys. It looks like `sk-ant-...`. Treat it like a password.

## Pick a workflow

Open the table in the main [README](../README.md). Each row is one automation,
grouped by department, with a one-line description. Click through to its folder.

Inside each folder:

| File | What it is |
| --- | --- |
| `workflow.json` | The automation itself — this is the file you import |
| `README.md` | What it does, what sets it off, and the exact instructions it gives Claude |
| `meta.json` | The same details in a form other software can read |

If you're not sure where to begin, pick one whose **Human gate** says a person
approves before anything is sent. Those are the safest to learn on.

## Set one up

1. **Import it.** In n8n: *Workflows* → *Import from File* → choose that
   workflow's `workflow.json`. You'll see a diagram of connected boxes.
2. **Read the yellow note.** Every workflow has a sticky note headed
   **Setup — read me** with its own specific instructions. Read that first.
3. **Add your Anthropic key.** In n8n go to *Credentials* → *New* → **Header
   Auth**. Set the name to `x-api-key` and the value to your `sk-ant-...` key.
   Save it. Then click the box called *ask Claude* and select that credential.
   Until you do this, the workflow cannot reach Claude.
4. **Check the model.** Click the box called *build prompt*. Near the bottom
   you'll see `model: "claude-sonnet-4-5"`. Change it to the Claude model you
   want to use.
5. **Replace the grey boxes.** Any box whose name ends in **(replace)** is a
   placeholder — it deliberately does nothing. Delete it and drop in the real
   thing: your Slack, Gmail, Google Sheets, CRM or helpdesk box. n8n has a
   built-in box for most popular apps.
6. **Test before switching it on.** Use n8n's *Execute workflow* button and look
   at what comes out of each box. Only switch the workflow to *Active* once
   you're happy with what it produces.

## The one rule worth keeping

Every workflow was built so that a person approves anything irreversible —
sending, posting, paying, deleting, signing. That approval step is the box named
something like *Human approve* or *→ Send for review*. Don't remove it to save
time. The automation drafts and routes; a person decides.

## When something doesn't work

- **Nothing happens at all** — the workflow is probably not *Active*, or it's
  waiting on a webhook that nothing has called yet.
- **An error at the *ask Claude* box** — almost always the credential: wrong
  key, or the Header Auth name isn't exactly `x-api-key`.
- **It runs but the result is empty** — the *parse* box expects Claude to reply
  with JSON. Look at the raw reply in `_raw` to see what actually came back.
- **A box shows "(replace)"** — that's the placeholder from step 5, still not
  swapped for a real one.
