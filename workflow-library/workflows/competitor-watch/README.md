# Competitor Watch

Scan competitor sources weekly and produce a positioning brief.

**Department:** Sales & Growth Department  
**Trigger:** Schedule (weekly)  
**Agent Skills:** competitive-intelligence

## The Claude step (prompt)
```
From these fetched competitor updates, summarise what changed, the implication for us, and any positioning move. Return {"items":[{"competitor":"...","change":"...","implication":"...","action":"..."}]}. A human reviews and approves before anything is sent, posted, paid, published, or executed; grounded steps use only provided sources; the workflow drafts and routes, it does not act autonomously.
```

## Import
1. n8n → **Import from File → `workflow.json`**.
2. Add the **Anthropic** credential (Header Auth, `x-api-key`) on the *ask Claude* node.
3. Replace the *(replace)* NoOp nodes with your real app nodes.
4. Read the yellow **Setup — read me** note inside.

