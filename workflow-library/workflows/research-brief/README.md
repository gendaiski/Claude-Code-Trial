# Research Brief on Demand

Produce a sourced research brief from provided material.

**Department:** Operations & Knowledge Department  
**Trigger:** Webhook POST /research  
**Agent Skills:** researching-markets · writing-prds

## The Claude step (prompt)
```
Answer the research question using ONLY the provided sources. Return {"question":"...","answer":"...","key_points":["..."],"sources_used":["..."],"open_questions":["..."]}. A human reviews and approves before anything is sent, posted, paid, published, or executed; grounded steps use only provided sources; the workflow drafts and routes, it does not act autonomously.
```

## Import
1. n8n → **Import from File → `workflow.json`**.
2. Add the **Anthropic** credential (Header Auth, `x-api-key`) on the *ask Claude* node.
3. Replace the *(replace)* NoOp nodes with your real app nodes.
4. Read the yellow **Setup — read me** note inside.

