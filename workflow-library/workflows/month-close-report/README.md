# Monthly Close Report

Turn close data into a board-ready draft with variance narrative.

**Department:** Finance & Reporting Department  
**Trigger:** Webhook POST /month-close  
**Agent Skills:** monthly-financial-reporting · budgeting-and-forecasting

## The Claude step (prompt)
```
From this close data (actuals vs budget vs prior), write a board-ready report: {"summary":"...","variances":[{"line":"...","delta":"...","reason":"..."}],"outlook":"..."}. Neutral, precise, no invented numbers. A human reviews and approves before anything is sent, posted, paid, published, or executed; grounded steps use only provided sources; the workflow drafts and routes, it does not act autonomously.
```

## Import
1. n8n → **Import from File → `workflow.json`**.
2. Add the **Anthropic** credential (Header Auth, `x-api-key`) on the *ask Claude* node.
3. Replace the *(replace)* NoOp nodes with your real app nodes.
4. Read the yellow **Setup — read me** note inside.

