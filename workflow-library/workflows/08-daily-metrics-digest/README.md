# Daily Metrics Digest

Pull today's metrics daily and post a plain-English digest with the one thing to watch.

**Trigger:** Schedule (daily)  

**Integrations needed:** Anthropic API; your metrics source; Slack  

**Human gate:** None (read-only digest).

## The Claude step (prompt)
```
You are an analytics assistant. From today's metrics, write a short plain-English digest: the headline numbers, what changed vs yesterday, and the one thing to watch. Return {"digest":"...","watch":"..."}.
```

## Import
1. In n8n: **Workflows → Import from File → `workflow.json`**.
2. Create an **Anthropic credential**: Credentials → *Header Auth* → name `x-api-key`, value = your API key. Select it in the *ask Claude* node.
3. Set the model in the *build prompt* Code node (default `claude-sonnet-4-5`) to your current Claude model.
4. Replace the **NoOp** placeholder nodes (marked *(replace)*) with your real app nodes (Slack, Gmail, CRM, Sheets, helpdesk, etc.).
5. Read the yellow **Setup — read me** sticky note inside the workflow.

## Safety
Keep the human-gate node before anything irreversible (send, post, pay, delete). Grounded steps must cite sources; never let the workflow act on unverified AI output.

