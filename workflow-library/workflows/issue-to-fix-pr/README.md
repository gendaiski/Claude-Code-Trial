# Issue → Fix Plan

Turn a bug/issue into a plan and a proposed patch summary.

**Department:** Engineering & Product Department  
**Trigger:** Webhook POST /issue  
**Agent Skills:** designing-systems · writing-tests

## The Claude step (prompt)
```
From this issue and the relevant code context, produce {"root_cause":"...","plan":["..."],"patch_summary":"...","tests_to_add":["..."],"risk":"Low|Med|High"}. Do not claim to have tested it. A human reviews and approves before anything is sent, posted, paid, published, or executed; grounded steps use only provided sources; the workflow drafts and routes, it does not act autonomously.
```

## Import
1. n8n → **Import from File → `workflow.json`**.
2. Add the **Anthropic** credential (Header Auth, `x-api-key`) on the *ask Claude* node.
3. Replace the *(replace)* NoOp nodes with your real app nodes.
4. Read the yellow **Setup — read me** note inside.

