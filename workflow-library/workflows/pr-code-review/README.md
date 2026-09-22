# PR Code Review

Review a pull-request diff and post structured review comments.

**Department:** Engineering & Product Department  
**Trigger:** Webhook POST /pr-review  
**Agent Skills:** reviewing-frontend-code · reviewing-backend-code

## The Claude step (prompt)
```
Review this PR diff for correctness, security, performance, and tests. Return {"summary":"...","comments":[{"file":"...","line":"...","severity":"nit|minor|major|blocker","note":"..."}],"verdict":"approve|comment|request-changes"}. A human reviews and approves before anything is sent, posted, paid, published, or executed; grounded steps use only provided sources; the workflow drafts and routes, it does not act autonomously.
```

## Import
1. n8n → **Import from File → `workflow.json`**.
2. Add the **Anthropic** credential (Header Auth, `x-api-key`) on the *ask Claude* node.
3. Replace the *(replace)* NoOp nodes with your real app nodes.
4. Read the yellow **Setup — read me** note inside.

