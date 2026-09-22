# Contract Review & Redlines

Review a contract against the playbook and propose clause-by-clause redlines.

**Team:** Contracts Team  
**Trigger:** Webhook POST /contract-review  
**Manager / agent Skills:** reviewing-commercial-contracts · drafting-legal-memos

## The Claude step (prompt)
```
Review this contract against a standard playbook. For each material clause, flag the risk (Low/Med/High), the issue, and a suggested redline with a fallback. Return {"issues":[{"clause":"...","risk":"...","issue":"...","redline":"...","fallback":"..."}],"summary":"...","recommendation":"go|negotiate|walk"}. Drafting support, not legal advice — a qualified lawyer reviews and signs; the workflow never sends, files, or executes anything; grounded steps use only provided sources; escalate contentious or high-value matters to counsel.
```

## Import
1. n8n → **Import from File → `workflow.json`**.
2. Add the **Anthropic** credential (Header Auth, `x-api-key`) on the *ask Claude* node.
3. Replace the *(replace)* NoOp nodes with your real app nodes.
4. Read the yellow **Setup — read me** note inside.

## Legal safeguard
Drafting support, not legal advice. A qualified lawyer reviews and signs; the workflow never sends, files, or executes. Grounded steps use only provided sources; escalate contentious or high-value matters to counsel.

