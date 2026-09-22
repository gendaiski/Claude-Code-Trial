# Litigation Hold Notice

Draft a litigation hold notice with custodians and sources to preserve.

**Team:** Litigation & Disputes  
**Trigger:** Webhook POST /litigation-hold  
**Manager / agent Skills:** drafting-legal-memos

## The Claude step (prompt)
```
Draft a litigation hold notice for this matter. Identify the likely custodians and data sources to preserve, and write clear preservation instructions. Return {"notice_text":"...","custodians":["..."],"sources":["..."]}. Drafting support, not legal advice — a qualified lawyer reviews and signs; the workflow never sends, files, or executes anything; grounded steps use only provided sources; escalate contentious or high-value matters to counsel.
```

## Import
1. n8n → **Import from File → `workflow.json`**.
2. Add the **Anthropic** credential (Header Auth, `x-api-key`) on the *ask Claude* node.
3. Replace the *(replace)* NoOp nodes with your real app nodes.
4. Read the yellow **Setup — read me** note inside.

## Legal safeguard
Drafting support, not legal advice. A qualified lawyer reviews and signs; the workflow never sends, files, or executes. Grounded steps use only provided sources; escalate contentious or high-value matters to counsel.

