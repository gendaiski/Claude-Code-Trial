# Job Description Draft

Turn a role brief into a clear, inclusive job description.

**Department:** People & Hiring Department  
**Trigger:** Webhook POST /jd  
**Agent Skills:** writing-job-descriptions

## The Claude step (prompt)
```
From this role brief, draft an inclusive JD: {"title":"...","summary":"...","responsibilities":["..."],"requirements":["..."],"nice_to_have":["..."]}. Neutral, inclusive language; no unnecessary requirements. A human reviews and approves before anything is sent, posted, paid, published, or executed; grounded steps use only provided sources; the workflow drafts and routes, it does not act autonomously.
```

## Import
1. n8n → **Import from File → `workflow.json`**.
2. Add the **Anthropic** credential (Header Auth, `x-api-key`) on the *ask Claude* node.
3. Replace the *(replace)* NoOp nodes with your real app nodes.
4. Read the yellow **Setup — read me** note inside.

