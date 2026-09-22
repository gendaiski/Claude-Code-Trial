# Outbound Sequence Draft

Draft a personalised, multi-touch outreach sequence for a prospect.

**Department:** Sales & Growth Department  
**Trigger:** Webhook POST /outbound  
**Agent Skills:** outbound-sales

## The Claude step (prompt)
```
For this prospect (role, company, trigger event), draft a 4-touch outreach sequence: {"touches":[{"channel":"email|linkedin","day":0,"subject":"...","body":"..."}]}. Personal, concise, value-first, no fluff. A human reviews and approves before anything is sent, posted, paid, published, or executed; grounded steps use only provided sources; the workflow drafts and routes, it does not act autonomously.
```

## Import
1. n8n → **Import from File → `workflow.json`**.
2. Add the **Anthropic** credential (Header Auth, `x-api-key`) on the *ask Claude* node.
3. Replace the *(replace)* NoOp nodes with your real app nodes.
4. Read the yellow **Setup — read me** note inside.

