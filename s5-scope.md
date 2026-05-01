# s5-scope — Grant Response Generator MVP

**Roadmap priority:** 7  
**Status:** To Build → In Progress  
**Vertical:** RE · Consulting · Nonprofit  
**Session target:** Sub-build 1 (RFP Parser + Org-Funder Match Report)

---

## Inputs

| # | Name | Format | Required | Notes |
|---|---|---|---|---|
| 1 | Grant RFP | PDF upload or pasted plain text | Yes | Full document including eligibility, required sections, evaluation criteria, scoring weights, deadlines |
| 2 | Org Profile | Pasted plain text or uploaded doc (1 page max) | Yes | Mission statement, active programs, past grants awarded (name + amount), key staff names/roles, financials summary (revenue, expenses, surplus/deficit) |

---

## Triggers

| Trigger | Description |
|---|---|
| Manual invocation | User pastes RFP text + org profile into the Cowork Skill and runs it |
| No scheduled trigger | v1 is on-demand only — no cron, no webhook, no portal monitoring |

---

## Process (Sub-build 1 → 2 → 3)

### Sub-build 1 — RFP Parser + Match Report
1. Extract from RFP: funder name, deadline, total award amount, eligibility requirements
2. Extract all required sections with word/page limits
3. Extract evaluation criteria and scoring weights (if listed)
4. For each criterion, score the org profile 1–5 with a one-line justification
5. Identify the 2–3 org differentiators to lead with
6. Flag 2–3 gaps to address or reframe in the narrative

### Sub-build 2 — Narrative Drafter
1. Draft problem / need statement
2. Draft project approach section
3. Draft outcomes and evaluation plan
4. Draft org qualifications section
5. Enforce word limits per section from RFP
6. Insert `[HUMAN: verify this claim]` flag on every inferred or unconfirmed statement

### Sub-build 3 — Budget Narrative + Submission Package
1. Generate budget justification narrative from line-item budget
2. Assemble: narrative sections + budget narrative + org bio boilerplate
3. Order all components to match RFP's required section sequence
4. Apply section headings that exactly match RFP labels
5. Run completeness check: every required RFP section accounted for

---

## Output

| Sub-build | Output | Format |
|---|---|---|
| 1 | Match report | Structured markdown — funder summary card, required sections list with word limits, scored criteria table (criterion \| weight \| score \| evidence), top 3 differentiators, 2–3 gaps to reframe |
| 2 | Complete narrative draft | Markdown document — all required sections filled, under word limits, `[HUMAN: verify]` flags inline |
| 3 | Submission package | Single markdown document — narrative + budget narrative + org bio, in RFP section order, headings matching RFP labels exactly |

---

## Destination

| Destination | Notes |
|---|---|
| Markdown file | Primary output format — paste into any editor or Google Doc |
| Google Doc | Optional — user copies markdown into doc, formats for funder portal |
| Funder submission portal | Human pastes assembled document — no automated portal submission in v1 |

---

## Constraints

### Hard constraints (cannot be relaxed in v1)
- **One RFP at a time** — no batch processing across multiple funders
- **Human reviews before any submission** — AI drafts, human submits
- **No portal integration** — no auto-submit to grants.gov, grants.gc.ca, or any foundation portal
- **No budget spreadsheet generation** — budget narrative only; the numbers come from the user's own line-item budget
- **No LOI drafting** — letter of inquiry is a separate deliverable, out of scope

### Scope limits (explicitly out of v1)
- Auto-submission to grant portals (grants.gov, Grants.gc.ca, foundation portals)
- Multi-funder batch processing
- Grant eligibility screening across multiple funders
- CRM or grant tracking database integration
- Automated deadline monitoring or renewal reminders
- Letter of inquiry (LOI) drafting
- Budget spreadsheet generation (numbers only — narrative is in scope)

### Quality constraints
- All narrative sections must be under the RFP's specified word/page limits
- Every claim Claude cannot confirm from the org profile must be flagged `[HUMAN: verify this claim]`
- Section headings in the submission package must exactly match the RFP's required labels
- Output must be scannable — no walls of text, structured headers and clear sections

### Compliance constraints
- Human-in-the-loop on all outputs — no AI output goes to a funder unreviewed
- No client data stored — org profile and RFP are session inputs only, not persisted
- Attorney/reviewer verification on any legal or financial claims in the narrative

---

## Definition of Done (per sub-build)

| Sub-build | Done when |
|---|---|
| 1 | Paste any public grant RFP → receive structured match report in <60s with scored criteria table, top 3 differentiators, and gap list. Verified with a real grants.gov or grants.gc.ca posting. |
| 2 | Feed match report + org profile → receive complete draft narrative with all RFP sections filled, under word limits, and inline `[HUMAN: verify]` flags. Section count and word counts checked against the same RFP. |
| 3 | Feed line-item budget + narrative draft → single assembled document in correct RFP section order with budget narrative inline. Human only needs to paste into funder template — zero reordering. |

---

## V2 / V3 Features

What was cut to reach MVP, plus natural extensions — ordered by what to add first.

### What we cut

The original description promised: *"narrative sections, budget justification, and **supporting attachments compiled automatically**."* That last part got dropped entirely. We also cut:

- LOI drafting (a separate but closely related deliverable)
- Budget spreadsheet — v1 produces the narrative justification, not the actual numbers
- Supporting attachments — org financials, board list, tax-exempt letter, etc.
- Eligibility screening across multiple funders before choosing which to apply to
- Deadline monitoring — no proactive alerts for new or closing grants
- CRM / grant tracking — no record of what was submitted, to whom, or the outcome
- Multi-funder batch — one RFP at a time only
- Portal auto-submission — human pastes and submits manually

---

### V2 — Complete the core workflow

These finish what the original description actually promised. Low incremental effort since the Cowork Skill already exists.

| Priority | Feature | What it adds | Why now |
|---|---|---|---|
| 1 | **LOI Drafter** | Drafts the letter of inquiry that many funders require before a full application — funder intro, program summary, funding ask, alignment statement, 1–2 pages | LOI is the top-of-funnel step; the skill already knows how to write grant prose. Same inputs, shorter output. Natural precursor to the full application workflow. |
| 2 | **Budget spreadsheet generation** | Takes the line-item budget the user provides and produces a formatted spreadsheet (Google Sheets or CSV) with category totals, % of total, and funder-required columns — not just the narrative | v1 produces the budget *justification* in words; the actual numbers still have to be formatted manually. Completing this closes the loop on the budget package. |
| 3 | **Supporting attachments compiler** | Pulls standard attachments from Google Drive (org financials, board member list, 501c3/T3010 letter, audited statements) and assembles them with correct funder-specified filenames and order | Original description said "supporting attachments compiled automatically" — this is what was cut most visibly. Requires Google Drive MCP already in the stack. |
| 4 | **Multi-RFP eligibility screener** | User pastes 5–10 RFP summaries (or URLs); Claude reads each, scores org fit 1–5, returns a ranked table — best matches first, with a one-line reason to apply or skip each | Saves the hours nonprofits spend manually reading grant listings to find the right ones. Produces the shortlist that feeds into the full application workflow. |

---

### V3 — Scale and automate the pipeline

These require new integrations or significantly more build time. Add after V2 features are stable.

| Priority | Feature | What it adds | Why later |
|---|---|---|---|
| 5 | **Deadline monitoring** | Claude in Chrome watches grants.gc.ca and grants.gov for new postings matching the org's program areas; sends a weekly digest of new opportunities + 30/7-day deadline alerts for tracked applications | High client value but requires a scheduled Chrome agent and persistent funder-watchlist storage. Build after the core application workflow is proven. |
| 6 | **Grant tracking CRM** | Logs every application (funder, amount requested, deadline, status), tracks funder responses, surfaces renewals due, stores outcome notes | Needs a Notion or Airtable backend and status update hooks. Becomes valuable once a client has 5+ active applications in flight simultaneously. |
| 7 | **Multi-funder batch processing** | Run the full pipeline (eligibility screen → match report → narrative → budget → package) against multiple RFPs in a single session, producing ranked applications in priority order | Multiplicative effort once the single-RFP pipeline is solid. Makes sense when clients are applying to 10+ grants per cycle. |
| 8 | **Portal auto-submission** | Auto-fills and submits to grants.gov, Grants.gc.ca, or foundation-specific portals via Chrome agent; human reviews the prefilled form before clicking submit | The end-game automation. Highest risk — funder portals change layout without notice, and a mis-submitted application can't be recalled. Build last, with mandatory human checkpoint before every submit click. |

---

## Failure Points & Mitigations

| # | Failure | How it breaks | Mitigation |
|---|---|---|---|
| 1 | **Scanned / image-based PDF** | Claude reads no content; match report looks plausible but is fabricated | Sub-build 1: output a "content detected" block listing first 3 extracted sections. If blank, halt and prompt user to paste text |
| 2 | **Missing evaluation criteria** | RFP doesn't list explicit criteria — Claude infers them; scored table looks authoritative but may be wrong | Flag entire criteria table `[INFERRED — not stated in RFP]`; mandatory user review before Sub-build 2 begins |
| 3 | **Buried eligibility disqualifier** | Geographic or org-type restriction missed; full application written for an ineligible org | End Sub-build 1 with a mandatory STOP: list all eligibility requirements; user must confirm each one before proceeding |
| 4 | **Word limit silent overflow** | Sections exceed RFP word limits; submission disqualified | Sub-build 2: append `[Word count: 487 / 500 ✓]` or `[⚠ 523 / 500 — OVER LIMIT]` after each section; summary table at top |
| 5 | **Flag fatigue / underuse** | Too many flags → ignored; too few → bad claims slip through | Flag rule: flag anything not directly sourced from the org profile. Output total flag count at top of narrative |
| 6 | **Budget narrative ≠ line-item numbers** | Narrative dollar figures don't match the budget sheet; funder flags the discrepancy | Sub-build 3: output a reconciliation table — every dollar figure in narrative alongside its source budget line item |
| 7 | **Section order mismatch** | Assembled package has sections in wrong order; submission penalised or rejected | Sub-build 3: output a section order checklist after assembly; human verifies against RFP before submitting |
| 8 | **Stale org profile data** | Outdated financials used without warning | Org profile template includes "Data current as of: ___"; if blank, Claude flags every financial figure `[HUMAN: confirm this is current]` |

---

## Test Case

- **RFP source:** Any open grant from [grants.gc.ca](https://www.canada.ca/en/grants-contributions.html) or [grants.gov](https://grants.gov)
- **Org profile:** Fictional nonprofit — 1-page mission/programs/financials stub
- **Pass criteria:** Match report produced, all required sections extracted, criteria scored, differentiators identified
