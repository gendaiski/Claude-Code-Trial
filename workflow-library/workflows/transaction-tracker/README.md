# Transaction Milestone Tracker

Scan live deals daily and flag milestones, documents, and deadlines due.

**Department:** Real Estate Brokerage  
**Trigger:** Schedule (daily)  
**Agent Skills:** coordinating-transactions

## The Claude step (prompt)
```
From these live deals (with stages, documents, and dates), flag milestones, missing documents, and deadlines due in the next 3/7/14 days for each jurisdiction's process (UK exchange/completion/HMLR/SDLT; Egypt Shahr Aqari registration; Dubai NOC/DLD transfer). Return {"actions":[{"deal":"...","event":"...","due":"...","owner":"...","blocker":"..."}]}. A licensed broker/agent (and the client's lawyer) reviews before anything is listed, offered, signed, or transferred; money moves only through proper escrow/solicitor accounts with human authorisation; confirm the jurisdiction's rules.
```

## Import
1. n8n -> Import from File -> workflow.json.
2. Add the Anthropic credential (Header Auth, x-api-key) on the *ask Claude* node.
3. Replace the *(replace)* NoOp nodes with your CRM / portal / KYC / calendar nodes.
4. Keep a human gate on offers, money, and signatures.

