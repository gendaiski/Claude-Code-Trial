# Weekly Feedback Synthesis

Pull customer feedback weekly and synthesise ranked themes with evidence.

**Trigger:** Schedule (weekly)  

**Integrations needed:** Anthropic API; feedback sources; Slack/Docs  

**Human gate:** None (read-only brief).

## The Claude step (prompt)
```
You are a product analyst. From the collected feedback, produce the top themes with a count, sentiment, one representative quote each, and a ranked priority. Return {"themes":[{"theme":"...","count":0,"sentiment":"...","quote":"..."}],"summary":"..."}.
```

## Import
1. In n8n: **Workflows → Import from File → `workflow.json`**.
2. Create an **Anthropic credential**: Credentials → *Header Auth* → name `x-api-key`, value = your API key. Select it in the *ask Claude* node.
3. Set the model in the *build prompt* Code node (default `claude-sonnet-4-5`) to your current Claude model.
4. Replace the **NoOp** placeholder nodes (marked *(replace)*) with your real app nodes (Slack, Gmail, CRM, Sheets, helpdesk, etc.).
5. Read the yellow **Setup — read me** sticky note inside the workflow.

## Safety
Keep the human-gate node before anything irreversible (send, post, pay, delete). Grounded steps must cite sources; never let the workflow act on unverified AI output.

