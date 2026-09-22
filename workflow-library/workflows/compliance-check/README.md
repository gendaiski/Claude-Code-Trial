# Compliance Check

Run a compliance check on a proposed action and decide proceed / conditions / escalate.

**Team:** Compliance & Regulatory  
**Trigger:** Webhook POST /compliance-check  
**Manager / agent Skills:** checking-compliance

## The Claude step (prompt)
```
For this proposed action, feature, or campaign, list the applicable regimes and the trigger for each, the required control/approval and owner, and the residual risk. Decide proceed | proceed-with-conditions | escalate. Return {"regimes":[{"regime":"...","trigger":"...","control":"...","owner":"...","risk":"Low|Med|High"}],"decision":"..."}. Drafting support, not legal advice — a qualified lawyer reviews and signs; the workflow never sends, files, or executes anything; grounded steps use only provided sources; escalate contentious or high-value matters to counsel.
```

## Import
1. n8n → **Import from File → `workflow.json`**.
2. Add the **Anthropic** credential (Header Auth, `x-api-key`) on the *ask Claude* node.
3. Replace the *(replace)* NoOp nodes with your real app nodes.
4. Read the yellow **Setup — read me** note inside.

## Legal safeguard
Drafting support, not legal advice. A qualified lawyer reviews and signs; the workflow never sends, files, or executes. Grounded steps use only provided sources; escalate contentious or high-value matters to counsel.

