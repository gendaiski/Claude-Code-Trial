# Contract Intake & Triage

Detect contract type and parties, flag risk, and route GREEN/YELLOW/RED.

**Team:** Contracts Team  
**Trigger:** Webhook POST /contract  
**Manager / agent Skills:** intaking-contracts · reviewing-commercial-contracts

## The Claude step (prompt)
```
Detect the contract type (NDA|MSA|SOW|order-form|other) and parties. Flag the top risks (liability cap, indemnity, IP, termination, data). Give a routing colour. Return {"type":"...","parties":"...","routing":"GREEN|YELLOW|RED","top_risks":["..."]}. Drafting support, not legal advice — a qualified lawyer reviews and signs; the workflow never sends, files, or executes anything; grounded steps use only provided sources; escalate contentious or high-value matters to counsel.
```

## Import
1. n8n → **Import from File → `workflow.json`**.
2. Add the **Anthropic** credential (Header Auth, `x-api-key`) on the *ask Claude* node.
3. Replace the *(replace)* NoOp nodes with your real app nodes.
4. Read the yellow **Setup — read me** note inside.

## Legal safeguard
Drafting support, not legal advice. A qualified lawyer reviews and signs; the workflow never sends, files, or executes. Grounded steps use only provided sources; escalate contentious or high-value matters to counsel.

