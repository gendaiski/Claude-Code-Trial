# Contract Renewal & Obligation Watch

Scan the contract register daily and flag renewals, expiries, and surviving obligations.

**Team:** Contracts Team  
**Trigger:** Schedule (daily)  
**Manager / agent Skills:** reviewing-commercial-contracts

## The Claude step (prompt)
```
From this list of contracts (with dates and terms), flag anything with a renewal, expiry, notice deadline, or surviving obligation due in the next 30/60/90 days. Return {"due":[{"contract":"...","event":"...","date":"...","action":"..."}]}. Drafting support, not legal advice — a qualified lawyer reviews and signs; the workflow never sends, files, or executes anything; grounded steps use only provided sources; escalate contentious or high-value matters to counsel.
```

## Import
1. n8n → **Import from File → `workflow.json`**.
2. Add the **Anthropic** credential (Header Auth, `x-api-key`) on the *ask Claude* node.
3. Replace the *(replace)* NoOp nodes with your real app nodes.
4. Read the yellow **Setup — read me** note inside.

## Legal safeguard
Drafting support, not legal advice. A qualified lawyer reviews and signs; the workflow never sends, files, or executes. Grounded steps use only provided sources; escalate contentious or high-value matters to counsel.

