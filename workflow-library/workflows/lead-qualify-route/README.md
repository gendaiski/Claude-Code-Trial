# Lead Qualify & Route

Enrich and score an inbound lead against the ICP, then route it.

**Department:** Sales & Growth Department  
**Trigger:** Webhook POST /lead  
**Agent Skills:** researching-markets · growth-manager

## The Claude step (prompt)
```
Score this lead against our ICP (edit the ICP here). Return {"fit":"A|B|C","reasons":["..."],"next_step":"...","route":"sales|nurture|disqualify"}. A human reviews and approves before anything is sent, posted, paid, published, or executed; grounded steps use only provided sources; the workflow drafts and routes, it does not act autonomously.
```

## Import
1. n8n → **Import from File → `workflow.json`**.
2. Add the **Anthropic** credential (Header Auth, `x-api-key`) on the *ask Claude* node.
3. Replace the *(replace)* NoOp nodes with your real app nodes.
4. Read the yellow **Setup — read me** note inside.

