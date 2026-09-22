# Workflow Library

A self-hosted, version-controlled library of ready-made n8n workflows — each one
a Claude-powered automation with a human approval gate before anything
irreversible.

Each workflow lives in its own folder under `workflows/`:

```
workflows/<slug>/
├── workflow.json   # the n8n definition, importable as-is
├── README.md       # setup notes, the Claude prompt, the safety gate
└── meta.json       # title, description, department, tags, trigger, integrations, provenance
```

`catalog/index.json` is a machine-readable index of everything in the library,
and the table below is generated from it. Both are rebuilt with one command, so
the catalog can never drift from what is actually on disk.

## Getting the workflows in

```bash
# From a department-organised n8n tree (<department>/<slug>/workflow.json)
node scripts/import-n8n-tree.mjs ~/path/to/n8n-workflows

# From a flat export — a directory, a zip, or a single JSON file
node scripts/import-local.mjs ~/Downloads/export.zip

# From the live workflowhubegy.com library
node scripts/fetch-library.mjs --dry-run   # preview what it finds
node scripts/fetch-library.mjs             # download everything

# Then, always:
node scripts/build-catalog.mjs
```

Full notes, including what to do when the site's markup doesn't match what the
fetcher expects, are in [docs/IMPORTING.md](docs/IMPORTING.md).

## Using a workflow

In n8n: **Workflows → Import from File → `workflow.json`**. Then:

1. Add an **Anthropic** credential (Credentials → *Header Auth*, name `x-api-key`)
   and select it on the *ask Claude* node.
2. Update the model in the *build prompt* Code node — the definitions ship with
   `claude-sonnet-4-5`; set it to the model you actually want to run.
3. Replace every **NoOp** node marked *(replace)* with your real Slack, Gmail,
   CRM, Sheets or helpdesk node.
4. Read the yellow **Setup — read me** sticky note inside the workflow, and keep
   the human-gate node ahead of anything irreversible (send, post, pay, delete).

Each folder's `README.md` carries the workflow's own Claude prompt and its
safety note.

## Commands

| Command | What it does |
| --- | --- |
| `npm run fetch` | Download workflows from the live workflowhubegy.com library |
| `npm run import -- <path>` | Import a flat export: directory, zip, or JSON file |
| `npm run import:tree -- <path>` | Import a department-organised n8n tree |
| `npm run catalog` | Rebuild `catalog/index.json` and the table below |
| `npm run validate` | Fail if the catalog is stale (used in CI) |

## Library

<!-- catalog:start -->

**51 workflows** across 17 categories.

### Compliance & Regulatory (2)

| Workflow | Description | Tags |
| --- | --- | --- |
| [Compliance Check](workflows/compliance-check) | Run a compliance check on a proposed action and decide proceed / conditions / escalate. | Legal Department, checking-compliance |
| [Regulatory Change Monitor](workflows/regulatory-change-monitor) | Scan regulators/feeds daily and flag changes relevant to the business. | Legal Department, monitoring-compliance |

### Contracts Team (3)

| Workflow | Description | Tags |
| --- | --- | --- |
| [Contract Intake & Triage](workflows/contract-intake-triage) | Detect contract type and parties, flag risk, and route GREEN/YELLOW/RED. | Legal Department, intaking-contracts, reviewing-commercial-contracts |
| [Contract Renewal & Obligation Watch](workflows/contract-renewal-watch) | Scan the contract register daily and flag renewals, expiries, and surviving obligations. | Legal Department, reviewing-commercial-contracts |
| [Contract Review & Redlines](workflows/contract-review-redlines) | Review a contract against the playbook and propose clause-by-clause redlines. | Legal Department, reviewing-commercial-contracts, drafting-legal-memos |

### Customer Support Department (3)

| Workflow | Description | Tags |
| --- | --- | --- |
| [Weekly Feedback Synthesis](workflows/feedback-synthesis) | Turn the week's tickets and reviews into a voice-of-customer brief. | Customer Support Department, customer-feedback-synthesis |
| [Support RAG Reply](workflows/ticket-rag-reply) | Draft a grounded reply from your knowledge base for agent review. | Customer Support Department, handling-support-tickets |
| [Ticket Triage & Escalate](workflows/ticket-triage-escalate) | Classify a support ticket, set priority, and route or escalate. | Customer Support Department, handling-support-tickets, support-manager |

### Data Protection & Privacy (2)

| Workflow | Description | Tags |
| --- | --- | --- |
| [DPIA / Feature Privacy Review](workflows/dpia-feature-review) | Review a feature's personal-data handling and flag whether a DPIA is triggered. | Legal Department, reviewing-data-protection |
| [DSAR Intake & Triage](workflows/dsar-intake-triage) | Triage a data-subject request, set the statutory clock, and open the case. | Legal Department, reviewing-data-protection |

### Engineering & Product Department (3)

| Workflow | Description | Tags |
| --- | --- | --- |
| [Issue → Fix Plan](workflows/issue-to-fix-pr) | Turn a bug/issue into a plan and a proposed patch summary. | Engineering & Product Department, designing-systems, writing-tests |
| [PR Code Review](workflows/pr-code-review) | Review a pull-request diff and post structured review comments. | Engineering & Product Department, reviewing-frontend-code, reviewing-backend-code |
| [RAG Eval Run](workflows/rag-eval-run) | Run an eval set against a RAG feature and report pass/fail. | Engineering & Product Department, building-rag-systems |

### Finance & Reporting Department (3)

| Workflow | Description | Tags |
| --- | --- | --- |
| [Budget Variance Alert](workflows/budget-variance-alert) | Scan actuals weekly and flag material budget variances. | Finance & Reporting Department, budgeting-and-forecasting |
| [Daily Metrics Digest](workflows/metrics-digest) | Pull the day's metrics and write a plain-English digest. | Finance & Reporting Department, reporting-manager |
| [Monthly Close Report](workflows/month-close-report) | Turn close data into a board-ready draft with variance narrative. | Finance & Reporting Department, monthly-financial-reporting, budgeting-and-forecasting |

### General (8)

| Workflow | Description | Tags |
| --- | --- | --- |
| [Lead Qualify & Route](workflows/01-lead-qualify-and-route) | Qualify an inbound lead against your ICP; route good fits to the CRM + rep, archive the rest. | — |
| [Inbox Triage & Draft](workflows/02-inbox-triage-and-draft) | Triage inbound email, extract the ask, and draft a reply in your voice for approval. | — |
| [Competitor Watch](workflows/03-competitor-watch) | Fetch a competitor page daily, detect material changes, and post a digest. | — |
| [Content Draft & Approve](workflows/04-content-draft-and-approve) | Turn a brief into a draft, carousel outline, and social post for editor approval. | — |
| [Support Ticket — RAG Reply](workflows/05-support-ticket-rag-reply) | Classify a support ticket, retrieve KB context, draft a grounded reply or escalate. | — |
| [Contract Intake & Route](workflows/06-contract-intake-and-route) | Classify an inbound contract, flag top risks, and route by GREEN/YELLOW/RED to counsel. | — |
| [Weekly Feedback Synthesis](workflows/07-weekly-feedback-synthesis) | Pull customer feedback weekly and synthesise ranked themes with evidence. | — |
| [Daily Metrics Digest](workflows/08-daily-metrics-digest) | Pull today's metrics daily and post a plain-English digest with the one thing to watch. | — |

### Intake & Routing (1)

| Workflow | Description | Tags |
| --- | --- | --- |
| [Legal Intake Router](workflows/legal-intake-router) | Classify any inbound legal request and route it to the right team. | Legal Department, legal-ops-manager |

### Intellectual Property (2)

| Workflow | Description | Tags |
| --- | --- | --- |
| [IP Intake & Triage](workflows/ip-intake-triage) | Classify an IP matter, flag deadlines and priorities, and route. | Legal Department, drafting-legal-memos |
| [Trademark & GI Watch](workflows/trademark-watch) | Scan watch results weekly for confusingly similar marks and flag risk. | Legal Department, monitoring-compliance |

### Litigation & Disputes (2)

| Workflow | Description | Tags |
| --- | --- | --- |
| [Legal Research Brief](workflows/legal-research-brief) | Produce a memo-style research brief from provided sources only. | Legal Department, drafting-legal-memos, researching-markets |
| [Litigation Hold Notice](workflows/litigation-hold-notice) | Draft a litigation hold notice with custodians and sources to preserve. | Legal Department, drafting-legal-memos |

### Marketing & Content Department (3)

| Workflow | Description | Tags |
| --- | --- | --- |
| [Content Brief → Draft](workflows/content-brief-to-draft) | Turn a content brief into a researched, on-brand first draft for approval. | Marketing & Content Department, content-ops-manager, editing-prose |
| [SEO Article Pipeline](workflows/seo-article-pipeline) | Expand a target keyword into an SEO-structured outline and draft. | Marketing & Content Department, writing-seo-content |
| [Social Repurpose Studio](workflows/social-repurpose) | Turn one long piece into platform-native posts for each channel. | Marketing & Content Department, drafting-social-posts |

### NDA Fast-Track (1)

| Workflow | Description | Tags |
| --- | --- | --- |
| [NDA Triage](workflows/nda-triage) | Triage an NDA GREEN/YELLOW/RED and draft a counter-position. | Legal Department, triaging-ndas |

### Operations & Knowledge Department (3)

| Workflow | Description | Tags |
| --- | --- | --- |
| [Inbox Triage & Draft](workflows/inbox-triage-draft) | Triage an incoming email, classify it, and draft a reply. | Operations & Knowledge Department, orchestrating-agents (Ops) |
| [Knowledge Base Sync](workflows/kb-sync) | Summarise new documents into the knowledge base daily. | Operations & Knowledge Department, the-ai-second-brain |
| [Research Brief on Demand](workflows/research-brief) | Produce a sourced research brief from provided material. | Operations & Knowledge Department, researching-markets, writing-prds |

### People & Hiring Department (2)

| Workflow | Description | Tags |
| --- | --- | --- |
| [CV Screening & Scoring](workflows/cv-screen-score) | Score a CV against a role and produce an interview kit. | People & Hiring Department, screening-candidates |
| [Job Description Draft](workflows/jd-draft) | Turn a role brief into a clear, inclusive job description. | People & Hiring Department, writing-job-descriptions |

### Real Estate Brokerage (7)

| Workflow | Description | Tags |
| --- | --- | --- |
| [Buyer–Property Match](workflows/buyer-property-match) | Match qualified buyers to new/updated listings and rank by fit. | Real Estate Brokerage, qualifying-buyers |
| [KYC / AML & Sanctions Screen](workflows/kyc-aml-screen) | Screen the parties to a deal and check regime fit before an offer proceeds. | Real Estate Brokerage, checking-realestate-compliance |
| [Lead Capture & Qualify](workflows/lead-capture-qualify) | Qualify an inbound buyer lead against budget/financing/intent and route it. | Real Estate Brokerage, qualifying-buyers, real-estate-ops-manager |
| [Listing Intake & Verify](workflows/listing-intake) | Capture a new listing, normalise details, and flag title/disclosure gaps. | Real Estate Brokerage, intaking-listings, checking-realestate-compliance |
| [Offer & Negotiation Summary](workflows/offer-negotiation) | Summarise an offer, compare to valuation, and draft counter options. | Real Estate Brokerage, negotiating-offers |
| [Transaction Milestone Tracker](workflows/transaction-tracker) | Scan live deals daily and flag milestones, documents, and deadlines due. | Real Estate Brokerage, coordinating-transactions |
| [Viewing Scheduler & Feedback](workflows/viewing-scheduler) | Confirm a viewing request and prepare structured follow-up. | Real Estate Brokerage, scheduling-viewings |

### Sales & Growth Department (3)

| Workflow | Description | Tags |
| --- | --- | --- |
| [Competitor Watch](workflows/competitor-watch) | Scan competitor sources weekly and produce a positioning brief. | Sales & Growth Department, competitive-intelligence |
| [Lead Qualify & Route](workflows/lead-qualify-route) | Enrich and score an inbound lead against the ICP, then route it. | Sales & Growth Department, researching-markets, growth-manager |
| [Outbound Sequence Draft](workflows/outbound-sequence) | Draft a personalised, multi-touch outreach sequence for a prospect. | Sales & Growth Department, outbound-sales |

### Trade & Commodities Department (3)

| Workflow | Description | Tags |
| --- | --- | --- |
| [Counterparty & Sanctions Screen](workflows/counterparty-screen) | Screen a counterparty and summarise risk for review. | Trade & Commodities Department, compliance-monitoring |
| [Deal Intake & Routing](workflows/deal-intake-grade) | Classify an incoming deal, note grade/spec, and route it. | Trade & Commodities Department, trade-ops-manager, classifying-egyptian-cotton, appraising-gemstones |
| [Trade Finance Doc Check](workflows/trade-finance-doc-check) | Check LC / Incoterms documents for consistency and discrepancies. | Trade & Commodities Department, structuring-trade-finance |

<!-- catalog:end -->

## Provenance

Every workflow records where it came from and when, in its `meta.json` `source`
field. All 51 were imported from the owner's own Dropbox, under
`n8n Workflows (Ready-Made)`.

They have **not** been reconciled against the published
[workflowhubegy.com/library](https://workflowhubegy.com/library) listing, which
the import environment could not reach — so treat this as a mirror of the
Dropbox set, not a verified copy of the published one. Once the site is
reachable, `scripts/fetch-library.mjs` will pull the published listing into the
same layout and git will show the difference.

Nothing here is re-licensed — the original terms attached to each workflow
still apply.
