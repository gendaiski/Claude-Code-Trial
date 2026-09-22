# Content Draft & Approve

Turn a brief into a draft, carousel outline, and social post for editor approval.

**Trigger:** Webhook POST /content-brief  

**Integrations needed:** Anthropic API; Docs/Notion; Slack  

**Human gate:** Editor approves the draft before publishing.

## The Claude step (prompt)
```
You are my content writer. From this brief, produce a draft in my voice plus a 4-slide carousel outline and one social post. Return {"title":"...","draft":"...","carousel":["slide1","..."],"social_post":"..."}.
```

## Import
1. In n8n: **Workflows → Import from File → `workflow.json`**.
2. Create an **Anthropic credential**: Credentials → *Header Auth* → name `x-api-key`, value = your API key. Select it in the *ask Claude* node.
3. Set the model in the *build prompt* Code node (default `claude-sonnet-4-5`) to your current Claude model.
4. Replace the **NoOp** placeholder nodes (marked *(replace)*) with your real app nodes (Slack, Gmail, CRM, Sheets, helpdesk, etc.).
5. Read the yellow **Setup — read me** sticky note inside the workflow.

## Safety
Keep the human-gate node before anything irreversible (send, post, pay, delete). Grounded steps must cite sources; never let the workflow act on unverified AI output.

