# Trade Finance Doc Check

Check LC / Incoterms documents for consistency and discrepancies.

**Department:** Trade & Commodities Department  
**Trigger:** Webhook POST /tf-docs  
**Agent Skills:** structuring-trade-finance

## The Claude step (prompt)
```
Check these trade-finance documents (LC, invoice, B/L, packing list) for discrepancies and Incoterms consistency. Return {"discrepancies":[{"doc":"...","issue":"...","severity":"Low|Med|High"}],"incoterm_ok":"yes|no","summary":"..."}. A human reviews and approves before anything is sent, posted, paid, published, or executed; grounded steps use only provided sources; the workflow drafts and routes, it does not act autonomously.
```

## Import
1. n8n → **Import from File → `workflow.json`**.
2. Add the **Anthropic** credential (Header Auth, `x-api-key`) on the *ask Claude* node.
3. Replace the *(replace)* NoOp nodes with your real app nodes.
4. Read the yellow **Setup — read me** note inside.

