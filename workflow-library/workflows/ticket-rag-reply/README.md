# Support RAG Reply

Draft a grounded reply from your knowledge base for agent review.

**Department:** Customer Support Department  
**Trigger:** Webhook POST /support-reply  
**Agent Skills:** handling-support-tickets

## The Claude step (prompt)
```
Using ONLY the provided knowledge-base context, draft a support reply. If the answer isn't in context, say so and route to a human. Return {"reply":"...","grounded":"yes|no","escalate":"yes|no","sources_used":["..."]}. A human reviews and approves before anything is sent, posted, paid, published, or executed; grounded steps use only provided sources; the workflow drafts and routes, it does not act autonomously.
```

## Import
1. n8n → **Import from File → `workflow.json`**.
2. Add the **Anthropic** credential (Header Auth, `x-api-key`) on the *ask Claude* node.
3. Replace the *(replace)* NoOp nodes with your real app nodes.
4. Read the yellow **Setup — read me** note inside.

