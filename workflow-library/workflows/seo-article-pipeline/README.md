# SEO Article Pipeline

Expand a target keyword into an SEO-structured outline and draft.

**Department:** Marketing & Content Department  
**Trigger:** Webhook POST /seo-article  
**Agent Skills:** writing-seo-content

## The Claude step (prompt)
```
For this target keyword and intent, produce an SEO article plan: {"title":"...","h2s":["..."],"faqs":["..."],"draft":"...","internal_link_ideas":["..."]}. Match search intent; no keyword stuffing. A human reviews and approves before anything is sent, posted, paid, published, or executed; grounded steps use only provided sources; the workflow drafts and routes, it does not act autonomously.
```

## Import
1. n8n → **Import from File → `workflow.json`**.
2. Add the **Anthropic** credential (Header Auth, `x-api-key`) on the *ask Claude* node.
3. Replace the *(replace)* NoOp nodes with your real app nodes.
4. Read the yellow **Setup — read me** note inside.

