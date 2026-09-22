# DSAR Intake & Triage

Triage a data-subject request, set the statutory clock, and open the case.

**Team:** Data Protection & Privacy  
**Trigger:** Webhook POST /dsar  
**Manager / agent Skills:** reviewing-data-protection

## The Claude step (prompt)
```
Classify this data-subject request (access|erasure|rectification|portability|objection). Note whether identity verification is needed, the statutory response deadline, and the steps to fulfil it. Return {"type":"...","identity_check_needed":"yes|no","deadline":"...","steps":["..."]}. Drafting support, not legal advice — a qualified lawyer reviews and signs; the workflow never sends, files, or executes anything; grounded steps use only provided sources; escalate contentious or high-value matters to counsel.
```

## Import
1. n8n → **Import from File → `workflow.json`**.
2. Add the **Anthropic** credential (Header Auth, `x-api-key`) on the *ask Claude* node.
3. Replace the *(replace)* NoOp nodes with your real app nodes.
4. Read the yellow **Setup — read me** note inside.

## Legal safeguard
Drafting support, not legal advice. A qualified lawyer reviews and signs; the workflow never sends, files, or executes. Grounded steps use only provided sources; escalate contentious or high-value matters to counsel.

