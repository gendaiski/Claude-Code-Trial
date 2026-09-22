# Ticket Triage & Escalate

Classify a support ticket, set priority, and route or escalate.

**Department:** Customer Support Department  
**Trigger:** Webhook POST /ticket  
**Agent Skills:** handling-support-tickets · support-manager

## The Claude step (prompt)
```
Classify this ticket: {"category":"billing|technical|account|other","priority":"P1|P2|P3","sentiment":"...","route":"auto-reply|agent|escalate","summary":"..."}. A human reviews and approves before anything is sent, posted, paid, published, or executed; grounded steps use only provided sources; the workflow drafts and routes, it does not act autonomously.
```

## Import
1. n8n → **Import from File → `workflow.json`**.
2. Add the **Anthropic** credential (Header Auth, `x-api-key`) on the *ask Claude* node.
3. Replace the *(replace)* NoOp nodes with your real app nodes.
4. Read the yellow **Setup — read me** note inside.

