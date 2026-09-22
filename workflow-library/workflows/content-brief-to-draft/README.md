# Content Brief → Draft

Turn a content brief into a researched, on-brand first draft for approval.

**Department:** Marketing & Content Department  
**Trigger:** Webhook POST /content-brief  
**Agent Skills:** content-ops-manager · editing-prose

## The Claude step (prompt)
```
You are a senior content writer. From this brief (topic, audience, angle, keywords), produce {"title":"...","outline":["..."],"draft":"full first draft in the house voice","meta_description":"..."}. A human reviews and approves before anything is sent, posted, paid, published, or executed; grounded steps use only provided sources; the workflow drafts and routes, it does not act autonomously.
```

## Import
1. n8n → **Import from File → `workflow.json`**.
2. Add the **Anthropic** credential (Header Auth, `x-api-key`) on the *ask Claude* node.
3. Replace the *(replace)* NoOp nodes with your real app nodes.
4. Read the yellow **Setup — read me** note inside.

