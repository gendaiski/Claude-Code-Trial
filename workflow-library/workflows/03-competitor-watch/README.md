# Competitor Watch

Fetch a competitor page daily, detect material changes, and post a digest.

**Trigger:** Schedule (daily)  

**Integrations needed:** Anthropic API; Slack; a store for snapshots  

**Human gate:** None (read-only digest).

## The Claude step (prompt)
```
You are a competitive analyst. Compare the fetched page text to the previous snapshot and summarise material changes (pricing, product, positioning). Ignore cosmetic edits. Return {"changed":"yes|no","summary":"...","why_it_matters":"..."}.
```

## Import
1. In n8n: **Workflows → Import from File → `workflow.json`**.
2. Create an **Anthropic credential**: Credentials → *Header Auth* → name `x-api-key`, value = your API key. Select it in the *ask Claude* node.
3. Set the model in the *build prompt* Code node (default `claude-sonnet-4-5`) to your current Claude model.
4. Replace the **NoOp** placeholder nodes (marked *(replace)*) with your real app nodes (Slack, Gmail, CRM, Sheets, helpdesk, etc.).
5. Read the yellow **Setup — read me** sticky note inside the workflow.

## Safety
Keep the human-gate node before anything irreversible (send, post, pay, delete). Grounded steps must cite sources; never let the workflow act on unverified AI output.

