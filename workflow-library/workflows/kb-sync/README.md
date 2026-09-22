# Knowledge Base Sync

Summarise new documents into the knowledge base daily.

**Department:** Operations & Knowledge Department  
**Trigger:** Schedule (daily)  
**Agent Skills:** the-ai-second-brain

## The Claude step (prompt)
```
For each new document fetched, write a concise KB entry: {"entries":[{"title":"...","summary":"...","tags":["..."],"links":["..."]}]}. Faithful to the source; no invention. A human reviews and approves before anything is sent, posted, paid, published, or executed; grounded steps use only provided sources; the workflow drafts and routes, it does not act autonomously.
```

## Import
1. n8n → **Import from File → `workflow.json`**.
2. Add the **Anthropic** credential (Header Auth, `x-api-key`) on the *ask Claude* node.
3. Replace the *(replace)* NoOp nodes with your real app nodes.
4. Read the yellow **Setup — read me** note inside.

