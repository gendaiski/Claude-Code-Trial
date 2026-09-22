# Contract Intake & Route

Classify an inbound contract, flag top risks, and route by GREEN/YELLOW/RED to counsel.

**Trigger:** Webhook POST /contract  

**Integrations needed:** Anthropic API; CLM/email; storage  

**Human gate:** Counsel reviews and signs; never auto-executes.

## The Claude step (prompt)
```
You are a legal-ops assistant. Detect the contract type (NDA|MSA|SOW|order-form) and parties, flag the top risks (liability, IP, termination, data), and give a routing colour. Return {"type":"...","parties":"...","routing":"GREEN|YELLOW|RED","top_risks":["..."]}. This is drafting support, not legal advice.
```

## Import
1. In n8n: **Workflows → Import from File → `workflow.json`**.
2. Create an **Anthropic credential**: Credentials → *Header Auth* → name `x-api-key`, value = your API key. Select it in the *ask Claude* node.
3. Set the model in the *build prompt* Code node (default `claude-sonnet-4-5`) to your current Claude model.
4. Replace the **NoOp** placeholder nodes (marked *(replace)*) with your real app nodes (Slack, Gmail, CRM, Sheets, helpdesk, etc.).
5. Read the yellow **Setup — read me** sticky note inside the workflow.

## Safety
Keep the human-gate node before anything irreversible (send, post, pay, delete). Grounded steps must cite sources; never let the workflow act on unverified AI output.

