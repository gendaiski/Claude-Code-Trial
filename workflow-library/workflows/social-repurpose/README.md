# Social Repurpose Studio

Turn one long piece into platform-native posts for each channel.

**Department:** Marketing & Content Department  
**Trigger:** Webhook POST /repurpose  
**Agent Skills:** drafting-social-posts

## The Claude step (prompt)
```
Repurpose this long-form content into {"linkedin":"...","x_thread":["..."],"instagram_caption":"...","carousel_slides":["..."]}, each in the right voice and length for its platform. A human reviews and approves before anything is sent, posted, paid, published, or executed; grounded steps use only provided sources; the workflow drafts and routes, it does not act autonomously.
```

## Import
1. n8n → **Import from File → `workflow.json`**.
2. Add the **Anthropic** credential (Header Auth, `x-api-key`) on the *ask Claude* node.
3. Replace the *(replace)* NoOp nodes with your real app nodes.
4. Read the yellow **Setup — read me** note inside.

