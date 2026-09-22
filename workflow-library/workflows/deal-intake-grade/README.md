# Deal Intake & Routing

Classify an incoming deal, note grade/spec, and route it.

**Department:** Trade & Commodities Department  
**Trigger:** Webhook POST /deal  
**Agent Skills:** trade-ops-manager · classifying-egyptian-cotton · appraising-gemstones

## The Claude step (prompt)
```
Classify this deal (commodity, grade/spec claimed, quantity, Incoterm, counterparty). Flag what needs expert grading and any red flags. Return {"commodity":"...","claimed_grade":"...","needs_expert_grading":"yes|no","flags":["..."],"route":"..."}. A human reviews and approves before anything is sent, posted, paid, published, or executed; grounded steps use only provided sources; the workflow drafts and routes, it does not act autonomously.
```

## Import
1. n8n → **Import from File → `workflow.json`**.
2. Add the **Anthropic** credential (Header Auth, `x-api-key`) on the *ask Claude* node.
3. Replace the *(replace)* NoOp nodes with your real app nodes.
4. Read the yellow **Setup — read me** note inside.

