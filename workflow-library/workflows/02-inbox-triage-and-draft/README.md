# Inbox Triage & Draft

Triage inbound email, extract the ask, and draft a reply in your voice for approval.

**Trigger:** Schedule (swap for email trigger)  

**Integrations needed:** Anthropic API; Gmail/IMAP; Google Sheets  

**Human gate:** Human approves every reply before it sends.

## The Claude step (prompt)
```
You are my inbox assistant. Classify this email as urgent|action|fyi|spam, extract the ask and deadline, and draft a reply in my voice. Return {"category":"...","ask":"...","deadline":"...","draft_reply":"..."}.
```

## Import
1. In n8n: **Workflows → Import from File → `workflow.json`**.
2. Create an **Anthropic credential**: Credentials → *Header Auth* → name `x-api-key`, value = your API key. Select it in the *ask Claude* node.
3. Set the model in the *build prompt* Code node (default `claude-sonnet-4-5`) to your current Claude model.
4. Replace the **NoOp** placeholder nodes (marked *(replace)*) with your real app nodes (Slack, Gmail, CRM, Sheets, helpdesk, etc.).
5. Read the yellow **Setup — read me** sticky note inside the workflow.

## Safety
Keep the human-gate node before anything irreversible (send, post, pay, delete). Grounded steps must cite sources; never let the workflow act on unverified AI output.

