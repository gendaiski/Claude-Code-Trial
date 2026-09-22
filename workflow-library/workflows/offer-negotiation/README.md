# Offer & Negotiation Summary

Summarise an offer, compare to valuation, and draft counter options.

**Department:** Real Estate Brokerage  
**Trigger:** Webhook POST /re-offer  
**Agent Skills:** negotiating-offers

## The Claude step (prompt)
```
Capture this offer (price, conditions, financing, timeline, inclusions), compare to the asking/valuation, and draft counter-offer options with rationale and fallbacks. Return {"summary":"...","gap":"...","counters":[{"terms":"...","rationale":"..."}],"heads_of_terms":"..."}. Only progress after the compliance gate. A licensed broker/agent (and the client's lawyer) reviews before anything is listed, offered, signed, or transferred; money moves only through proper escrow/solicitor accounts with human authorisation; confirm the jurisdiction's rules.
```

## Import
1. n8n -> Import from File -> workflow.json.
2. Add the Anthropic credential (Header Auth, x-api-key) on the *ask Claude* node.
3. Replace the *(replace)* NoOp nodes with your CRM / portal / KYC / calendar nodes.
4. Keep a human gate on offers, money, and signatures.

