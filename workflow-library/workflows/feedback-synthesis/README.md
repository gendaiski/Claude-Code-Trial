# Weekly Feedback Synthesis

Turn the week's tickets and reviews into a voice-of-customer brief.

**Department:** Customer Support Department  
**Trigger:** Schedule (weekly)  
**Agent Skills:** customer-feedback-synthesis

## The Claude step (prompt)
```
From this week's feedback items, extract the top themes, their frequency and sentiment, and product signals. Return {"themes":[{"theme":"...","count":0,"sentiment":"...","signal":"..."}],"headline":"..."}. A human reviews and approves before anything is sent, posted, paid, published, or executed; grounded steps use only provided sources; the workflow drafts and routes, it does not act autonomously.
```

## Import
1. n8n → **Import from File → `workflow.json`**.
2. Add the **Anthropic** credential (Header Auth, `x-api-key`) on the *ask Claude* node.
3. Replace the *(replace)* NoOp nodes with your real app nodes.
4. Read the yellow **Setup — read me** note inside.

