# Lead Capture & Qualify

Qualify an inbound buyer lead against budget/financing/intent and route it.

**Department:** Real Estate Brokerage  
**Trigger:** Webhook POST /re-lead  
**Agent Skills:** qualifying-buyers · real-estate-ops-manager

## The Claude step (prompt)
```
Qualify this real-estate buyer lead. Score budget realism, financing readiness, intent, and timeline; check ownership eligibility for the jurisdiction. Return {"fit":"A|B|C","eligible":"yes|no|check","reasons":["..."],"route":"viewing|nurture|refer-mortgage|disqualify"}. A licensed broker/agent (and the client's lawyer) reviews before anything is listed, offered, signed, or transferred; money moves only through proper escrow/solicitor accounts with human authorisation; confirm the jurisdiction's rules.
```

## Import
1. n8n -> Import from File -> workflow.json.
2. Add the Anthropic credential (Header Auth, x-api-key) on the *ask Claude* node.
3. Replace the *(replace)* NoOp nodes with your CRM / portal / KYC / calendar nodes.
4. Keep a human gate on offers, money, and signatures.

