# Daily Metrics Digest

Pull the day's metrics and write a plain-English digest.

**Department:** Finance & Reporting Department  
**Trigger:** Schedule (daily)  
**Agent Skills:** reporting-manager

## The Claude step (prompt)
```
Summarise these metrics vs target and vs yesterday. Call out what moved and why it might matter. Return {"headline":"...","highlights":["..."],"watch":["..."]}. A human reviews and approves before anything is sent, posted, paid, published, or executed; grounded steps use only provided sources; the workflow drafts and routes, it does not act autonomously.
```

## Import
1. n8n → **Import from File → `workflow.json`**.
2. Add the **Anthropic** credential (Header Auth, `x-api-key`) on the *ask Claude* node.
3. Replace the *(replace)* NoOp nodes with your real app nodes.
4. Read the yellow **Setup — read me** note inside.

