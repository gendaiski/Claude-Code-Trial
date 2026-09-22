# Viewing Scheduler & Feedback

Confirm a viewing request and prepare structured follow-up.

**Department:** Real Estate Brokerage  
**Trigger:** Webhook POST /re-viewing  
**Agent Skills:** scheduling-viewings

## The Claude step (prompt)
```
From this viewing request/feedback, confirm details and produce next steps. Return {"confirm":{"property":"...","slot":"...","access_notes":"..."},"feedback":{"interest":"...","objections":["..."],"next_step":"offer|second-viewing|nurture"}}. A licensed broker/agent (and the client's lawyer) reviews before anything is listed, offered, signed, or transferred; money moves only through proper escrow/solicitor accounts with human authorisation; confirm the jurisdiction's rules.
```

## Import
1. n8n -> Import from File -> workflow.json.
2. Add the Anthropic credential (Header Auth, x-api-key) on the *ask Claude* node.
3. Replace the *(replace)* NoOp nodes with your CRM / portal / KYC / calendar nodes.
4. Keep a human gate on offers, money, and signatures.

