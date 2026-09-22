# Legal Intake Router

Classify any inbound legal request and route it to the right team.

**Team:** Intake & Routing  
**Trigger:** Webhook POST /legal-intake  
**Manager / agent Skills:** legal-ops-manager

## The Claude step (prompt)
```
You are the legal front door. Classify the request into a team: contracts|nda|compliance|data-protection|litigation|ip|other. Extract the ask, urgency, and any deadline. Return {"team":"...","ask":"...","urgency":"low|med|high","deadline":"..."}. Drafting support, not legal advice — a qualified lawyer reviews and signs; the workflow never sends, files, or executes anything; grounded steps use only provided sources; escalate contentious or high-value matters to counsel.
```

## Import
1. n8n → **Import from File → `workflow.json`**.
2. Add the **Anthropic** credential (Header Auth, `x-api-key`) on the *ask Claude* node.
3. Replace the *(replace)* NoOp nodes with your real app nodes.
4. Read the yellow **Setup — read me** note inside.

## Legal safeguard
Drafting support, not legal advice. A qualified lawyer reviews and signs; the workflow never sends, files, or executes. Grounded steps use only provided sources; escalate contentious or high-value matters to counsel.

