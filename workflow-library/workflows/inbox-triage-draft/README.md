# Inbox Triage & Draft

Triage an incoming email, classify it, and draft a reply.

**Department:** Operations & Knowledge Department  
**Trigger:** Webhook POST /inbox  
**Agent Skills:** orchestrating-agents (Ops)

## The Claude step (prompt)
```
Triage this email: {"category":"...","priority":"high|med|low","intent":"...","draft_reply":"...","needs_human":"yes|no"}. Draft only; never send. A human reviews and approves before anything is sent, posted, paid, published, or executed; grounded steps use only provided sources; the workflow drafts and routes, it does not act autonomously.
```

## Import
1. n8n → **Import from File → `workflow.json`**.
2. Add the **Anthropic** credential (Header Auth, `x-api-key`) on the *ask Claude* node.
3. Replace the *(replace)* NoOp nodes with your real app nodes.
4. Read the yellow **Setup — read me** note inside.

