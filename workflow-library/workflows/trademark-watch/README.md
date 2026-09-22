# Trademark & GI Watch

Scan watch results weekly for confusingly similar marks and flag risk.

**Team:** Intellectual Property  
**Trigger:** Schedule (weekly)  
**Manager / agent Skills:** monitoring-compliance

## The Claude step (prompt)
```
From these watch results, flag potentially infringing or confusingly similar marks against our marks and names (edit the list here — include any geographical indications such as ‘Egyptian Cotton’). Rate the risk for each. Return {"hits":[{"mark":"...","similar_to":"...","risk":"Low|Med|High","note":"..."}]}. Drafting support, not legal advice — a qualified lawyer reviews and signs; the workflow never sends, files, or executes anything; grounded steps use only provided sources; escalate contentious or high-value matters to counsel.
```

## Import
1. n8n → **Import from File → `workflow.json`**.
2. Add the **Anthropic** credential (Header Auth, `x-api-key`) on the *ask Claude* node.
3. Replace the *(replace)* NoOp nodes with your real app nodes.
4. Read the yellow **Setup — read me** note inside.

## Legal safeguard
Drafting support, not legal advice. A qualified lawyer reviews and signs; the workflow never sends, files, or executes. Grounded steps use only provided sources; escalate contentious or high-value matters to counsel.

