# CV Screening & Scoring

Score a CV against a role and produce an interview kit.

**Department:** People & Hiring Department  
**Trigger:** Webhook POST /cv  
**Agent Skills:** screening-candidates

## The Claude step (prompt)
```
Score this CV against the role (provided). Use evidence from the CV only; avoid bias and protected attributes. Return {"score":0,"evidence":["..."],"gaps":["..."],"interview_questions":["..."],"recommend":"advance|hold|decline"}. A human reviews and approves before anything is sent, posted, paid, published, or executed; grounded steps use only provided sources; the workflow drafts and routes, it does not act autonomously.
```

## Import
1. n8n → **Import from File → `workflow.json`**.
2. Add the **Anthropic** credential (Header Auth, `x-api-key`) on the *ask Claude* node.
3. Replace the *(replace)* NoOp nodes with your real app nodes.
4. Read the yellow **Setup — read me** note inside.

