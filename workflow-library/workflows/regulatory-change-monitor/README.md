# Regulatory Change Monitor

Scan regulators/feeds daily and flag changes relevant to the business.

**Team:** Compliance & Regulatory  
**Trigger:** Schedule (daily)  
**Manager / agent Skills:** monitoring-compliance

## The Claude step (prompt)
```
From these fetched regulator/guidance items, identify changes relevant to our products and jurisdictions (edit these here). For each, give the impact and the action required. Return {"relevant":[{"change":"...","area":"...","impact":"...","action":"...","owner":"..."}]}. Drafting support, not legal advice — a qualified lawyer reviews and signs; the workflow never sends, files, or executes anything; grounded steps use only provided sources; escalate contentious or high-value matters to counsel.
```

## Import
1. n8n → **Import from File → `workflow.json`**.
2. Add the **Anthropic** credential (Header Auth, `x-api-key`) on the *ask Claude* node.
3. Replace the *(replace)* NoOp nodes with your real app nodes.
4. Read the yellow **Setup — read me** note inside.

## Legal safeguard
Drafting support, not legal advice. A qualified lawyer reviews and signs; the workflow never sends, files, or executes. Grounded steps use only provided sources; escalate contentious or high-value matters to counsel.

