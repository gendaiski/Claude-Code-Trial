# Support Ticket — RAG Reply

Classify a support ticket, retrieve KB context, draft a grounded reply or escalate.

**Trigger:** Webhook POST /ticket  

**Integrations needed:** Anthropic API; a RAG/search endpoint; helpdesk  

**Human gate:** Human sends replies until trusted; humans handle escalations.

## The Claude step (prompt)
```
You are a support agent. Using ONLY the knowledge-base context provided, classify the ticket (billing|bug|how-to|escalation), and draft a reply that cites the source. If the context does not answer it, set escalate=yes. Return {"category":"...","escalate":"yes|no","draft_reply":"...","citation":"..."}.
```

## Import
1. In n8n: **Workflows → Import from File → `workflow.json`**.
2. Create an **Anthropic credential**: Credentials → *Header Auth* → name `x-api-key`, value = your API key. Select it in the *ask Claude* node.
3. Set the model in the *build prompt* Code node (default `claude-sonnet-4-5`) to your current Claude model.
4. Replace the **NoOp** placeholder nodes (marked *(replace)*) with your real app nodes (Slack, Gmail, CRM, Sheets, helpdesk, etc.).
5. Read the yellow **Setup — read me** sticky note inside the workflow.

## Safety
Keep the human-gate node before anything irreversible (send, post, pay, delete). Grounded steps must cite sources; never let the workflow act on unverified AI output.

