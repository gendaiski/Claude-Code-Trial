# Legal Research Brief

Produce a memo-style research brief from provided sources only.

**Team:** Litigation & Disputes  
**Trigger:** Webhook POST /legal-research  
**Manager / agent Skills:** drafting-legal-memos · researching-markets

## The Claude step (prompt)
```
Research the legal question using ONLY the provided sources. Return {"issue":"...","short_answer":"...","analysis":"...","authorities_cited":["..."],"open_questions":["..."],"needs_confirmation":["..."]}. Drafting support, not legal advice — a qualified lawyer reviews and signs; the workflow never sends, files, or executes anything; grounded steps use only provided sources; escalate contentious or high-value matters to counsel.
```

## Import
1. n8n → **Import from File → `workflow.json`**.
2. Add the **Anthropic** credential (Header Auth, `x-api-key`) on the *ask Claude* node.
3. Replace the *(replace)* NoOp nodes with your real app nodes.
4. Read the yellow **Setup — read me** note inside.

## Legal safeguard
Drafting support, not legal advice. A qualified lawyer reviews and signs; the workflow never sends, files, or executes. Grounded steps use only provided sources; escalate contentious or high-value matters to counsel.

