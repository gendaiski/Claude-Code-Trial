# RAG Eval Run

Run an eval set against a RAG feature and report pass/fail.

**Department:** Engineering & Product Department  
**Trigger:** Schedule (daily)  
**Agent Skills:** building-rag-systems

## The Claude step (prompt)
```
Grade these RAG answers against their expected answers for groundedness and correctness. Return {"pass":0,"fail":0,"failures":[{"q":"...","why":"..."}],"grounded_rate":"..."}. A human reviews and approves before anything is sent, posted, paid, published, or executed; grounded steps use only provided sources; the workflow drafts and routes, it does not act autonomously.
```

## Import
1. n8n → **Import from File → `workflow.json`**.
2. Add the **Anthropic** credential (Header Auth, `x-api-key`) on the *ask Claude* node.
3. Replace the *(replace)* NoOp nodes with your real app nodes.
4. Read the yellow **Setup — read me** note inside.

