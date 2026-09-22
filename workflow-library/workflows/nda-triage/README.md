# NDA Triage

Triage an NDA GREEN/YELLOW/RED and draft a counter-position.

**Team:** NDA Fast-Track  
**Trigger:** Webhook POST /nda  
**Manager / agent Skills:** triaging-ndas

## The Claude step (prompt)
```
Triage this NDA. Classify GREEN (signable under delegation), YELLOW (counsel review), or RED (full review). Check mutuality, term, definition of confidential info, permitted use, carve-outs; flag any embedded non-solicit/non-compete/IP-assignment. Return {"routing":"GREEN|YELLOW|RED","issues":["..."],"counter":"suggested wording for the two clauses to fix first"}. Drafting support, not legal advice — a qualified lawyer reviews and signs; the workflow never sends, files, or executes anything; grounded steps use only provided sources; escalate contentious or high-value matters to counsel.
```

## Import
1. n8n → **Import from File → `workflow.json`**.
2. Add the **Anthropic** credential (Header Auth, `x-api-key`) on the *ask Claude* node.
3. Replace the *(replace)* NoOp nodes with your real app nodes.
4. Read the yellow **Setup — read me** note inside.

## Legal safeguard
Drafting support, not legal advice. A qualified lawyer reviews and signs; the workflow never sends, files, or executes. Grounded steps use only provided sources; escalate contentious or high-value matters to counsel.

