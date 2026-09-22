# DPIA / Feature Privacy Review

Review a feature's personal-data handling and flag whether a DPIA is triggered.

**Team:** Data Protection & Privacy  
**Trigger:** Webhook POST /dpia  
**Manager / agent Skills:** reviewing-data-protection

## The Claude step (prompt)
```
Review this feature's personal-data handling: lawful basis, minimisation, retention, security, transfers, and subject rights. Flag gaps with a fix, and say whether a full DPIA is triggered (high-risk processing, profiling, large scale). Return {"findings":[{"area":"...","status":"OK|Gap","risk":"...","fix":"..."}],"dpia_required":"yes|no"}. Drafting support, not legal advice — a qualified lawyer reviews and signs; the workflow never sends, files, or executes anything; grounded steps use only provided sources; escalate contentious or high-value matters to counsel.
```

## Import
1. n8n → **Import from File → `workflow.json`**.
2. Add the **Anthropic** credential (Header Auth, `x-api-key`) on the *ask Claude* node.
3. Replace the *(replace)* NoOp nodes with your real app nodes.
4. Read the yellow **Setup — read me** note inside.

## Legal safeguard
Drafting support, not legal advice. A qualified lawyer reviews and signs; the workflow never sends, files, or executes. Grounded steps use only provided sources; escalate contentious or high-value matters to counsel.

