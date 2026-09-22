# Budget Variance Alert

Scan actuals weekly and flag material budget variances.

**Department:** Finance & Reporting Department  
**Trigger:** Schedule (weekly)  
**Agent Skills:** budgeting-and-forecasting

## The Claude step (prompt)
```
Compare actuals to budget in this data and flag variances beyond threshold (edit threshold here). Return {"alerts":[{"line":"...","variance":"...","threshold_breached":true,"note":"..."}]}. A human reviews and approves before anything is sent, posted, paid, published, or executed; grounded steps use only provided sources; the workflow drafts and routes, it does not act autonomously.
```

## Import
1. n8n → **Import from File → `workflow.json`**.
2. Add the **Anthropic** credential (Header Auth, `x-api-key`) on the *ask Claude* node.
3. Replace the *(replace)* NoOp nodes with your real app nodes.
4. Read the yellow **Setup — read me** note inside.

