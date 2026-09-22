# KYC / AML & Sanctions Screen

Screen the parties to a deal and check regime fit before an offer proceeds.

**Department:** Real Estate Brokerage  
**Trigger:** Webhook POST /re-kyc  
**Agent Skills:** checking-realestate-compliance

## The Claude step (prompt)
```
Run the compliance gate for this deal: KYC (identity + beneficial ownership), AML risk (source of funds, cash, PEP), sanctions screening, and regime fit (licensing, disclosures, escrow) for the jurisdiction. Return {"kyc":"pass|fail","aml_risk":"Low|Med|High","sanctions":"clear|hit","regime_ok":"yes|no","decision":"proceed|conditions|stop","reasons":["..."]}. Never clear or file autonomously. A licensed broker/agent (and the client's lawyer) reviews before anything is listed, offered, signed, or transferred; money moves only through proper escrow/solicitor accounts with human authorisation; confirm the jurisdiction's rules.
```

## Import
1. n8n -> Import from File -> workflow.json.
2. Add the Anthropic credential (Header Auth, x-api-key) on the *ask Claude* node.
3. Replace the *(replace)* NoOp nodes with your CRM / portal / KYC / calendar nodes.
4. Keep a human gate on offers, money, and signatures.

