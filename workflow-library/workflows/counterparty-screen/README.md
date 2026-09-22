# Counterparty & Sanctions Screen

Screen a counterparty and summarise risk for review.

**Department:** Trade & Commodities Department  
**Trigger:** Webhook POST /counterparty  
**Agent Skills:** compliance-monitoring

## The Claude step (prompt)
```
From the provided counterparty data and screening results, summarise sanctions/PEP/adverse-media exposure and give a risk rating. Return {"risk":"Low|Med|High","findings":["..."],"recommendation":"proceed|review|block"}. Never assert a legal determination. A human reviews and approves before anything is sent, posted, paid, published, or executed; grounded steps use only provided sources; the workflow drafts and routes, it does not act autonomously.
```

## Import
1. n8n → **Import from File → `workflow.json`**.
2. Add the **Anthropic** credential (Header Auth, `x-api-key`) on the *ask Claude* node.
3. Replace the *(replace)* NoOp nodes with your real app nodes.
4. Read the yellow **Setup — read me** note inside.

