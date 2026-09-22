# Lead Qualify & Route

Qualify an inbound lead against your ICP; route good fits to the CRM + rep, archive the rest.

**Trigger:** Webhook POST /lead  

**Integrations needed:** Anthropic API; CRM; Slack/Email  

**Human gate:** Rep approves the first-touch before it sends.

## The Claude step (prompt)
```
You are a sales qualifier. Given a new lead, decide if it fits the ICP (edit the ICP here). Return {"good_fit":"yes|no","reason":"...","first_touch":"a personalised opening message"}.
```

## Import
1. In n8n: **Workflows → Import from File → `workflow.json`**.
2. Create an **Anthropic credential**: Credentials → *Header Auth* → name `x-api-key`, value = your API key. Select it in the *ask Claude* node.
3. Set the model in the *build prompt* Code node (default `claude-sonnet-4-5`) to your current Claude model.
4. Replace the **NoOp** placeholder nodes (marked *(replace)*) with your real app nodes (Slack, Gmail, CRM, Sheets, helpdesk, etc.).
5. Read the yellow **Setup — read me** sticky note inside the workflow.

## Safety
Keep the human-gate node before anything irreversible (send, post, pay, delete). Grounded steps must cite sources; never let the workflow act on unverified AI output.

