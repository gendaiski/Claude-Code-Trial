# Listing Intake & Verify

Capture a new listing, normalise details, and flag title/disclosure gaps.

**Department:** Real Estate Brokerage  
**Trigger:** Webhook POST /re-listing  
**Agent Skills:** intaking-listings · checking-realestate-compliance

## The Claude step (prompt)
```
From this listing submission, produce a clean record and a verification checklist. Flag title/ownership items to confirm (Shahr Aqari / Land Registry / DLD) and mandatory disclosures (material information, EPC). Return {"record":{...},"to_verify":["..."],"disclosures_needed":["..."],"ready_to_market":"yes|no"}. A licensed broker/agent (and the client's lawyer) reviews before anything is listed, offered, signed, or transferred; money moves only through proper escrow/solicitor accounts with human authorisation; confirm the jurisdiction's rules.
```

## Import
1. n8n -> Import from File -> workflow.json.
2. Add the Anthropic credential (Header Auth, x-api-key) on the *ask Claude* node.
3. Replace the *(replace)* NoOp nodes with your CRM / portal / KYC / calendar nodes.
4. Keep a human gate on offers, money, and signatures.

