# IP Intake & Triage

Classify an IP matter, flag deadlines and priorities, and route.

**Team:** Intellectual Property  
**Trigger:** Webhook POST /ip-intake  
**Manager / agent Skills:** drafting-legal-memos

## The Claude step (prompt)
```
Classify this IP matter (patent|trademark|design|copyright|geographical-indication). Summarise it, flag any priority dates or filing deadlines, and route. Return {"ip_type":"...","summary":"...","deadlines":["..."],"routing":"..."}. Drafting support, not legal advice — a qualified lawyer reviews and signs; the workflow never sends, files, or executes anything; grounded steps use only provided sources; escalate contentious or high-value matters to counsel.
```

## Import
1. n8n → **Import from File → `workflow.json`**.
2. Add the **Anthropic** credential (Header Auth, `x-api-key`) on the *ask Claude* node.
3. Replace the *(replace)* NoOp nodes with your real app nodes.
4. Read the yellow **Setup — read me** note inside.

## Legal safeguard
Drafting support, not legal advice. A qualified lawyer reviews and signs; the workflow never sends, files, or executes. Grounded steps use only provided sources; escalate contentious or high-value matters to counsel.

