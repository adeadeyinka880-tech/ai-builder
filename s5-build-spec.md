# s5-build-spec — Grant Response Generator

---

## What It Does

Reads a grant RFP and a one-page org profile, scores the org against the funder's evaluation criteria, and produces a complete first-draft grant application (problem statement, project approach, outcomes plan, org qualifications, budget narrative) as a single markdown document ready for human review before submission.

---

## Trigger

- **Type:** Manual invocation only
- **How:** User opens the Cowork Skill, pastes or uploads two inputs, and runs it
- **Not triggered by:** Cron, webhook, email, portal monitoring, or any external event
- **One RFP per run** — no batch mode in v1

---

## Inputs

| # | Name | Format | Required | Validation |
|---|---|---|---|---|
| 1 | **Grant RFP** | Pasted plain text or PDF upload | Yes | On receipt, output a "content detected" block listing the first 3 extracted sections. If blank → halt and prompt user to paste text instead. Do not proceed on empty input. |
| 2 | **Org Profile** | Pasted plain text or uploaded doc, 1 page max | Yes | Must contain: mission, at least one active program, financials (revenue + expenses), and at least one staff name. Missing any of these → insert `[HUMAN: provide — X]` flags and continue; do not invent. |
| 3 | **Line-item budget** | Pasted plain text or table | Required for Sub-build 3 only | Every line must have: category, description, amount. If amounts are missing → halt Sub-build 3 and ask. |

**Org profile data currency check:** If the profile does not include "Data current as of: [date]" → flag every financial figure `[HUMAN: confirm this is current]` before using it in the budget narrative.

---

## Process

### Sub-build 1 — RFP Parser + Org-Funder Match Report

1. Extract from RFP: funder name, deadline (date + time + timezone), total award amount, eligibility requirements (every one, including those in appendices)
2. Extract all required application sections with their exact word/page limits
3. Extract evaluation criteria and scoring weights. If not explicitly listed → derive from program overview, label entire criteria table `[INFERRED — not stated in RFP]`, require user confirmation before Sub-build 2 begins
4. **Eligibility STOP:** List all eligibility requirements. User must confirm each is met before proceeding. If any cannot be confirmed from the org profile → halt and ask; do not draft a full application for a potentially ineligible org
5. For each criterion, score the org profile 1–5 with a one-line justification citing specific org profile evidence
6. Identify the top 2–3 differentiators (highest org score × highest funder weight)
7. Flag 2–3 gaps (score ≤ 2) with a specific reframe strategy for each

**Sub-build 1 output:** Structured match report (see Output Format section)
**Done when:** Any public RFP from grants.gc.ca or grants.gov → match report in under 60 seconds with scored criteria table, top 3 differentiators, gap list, and eligibility confirmation

---

### Sub-build 2 — Narrative Drafter

**Input:** Match report from Sub-build 1 + org profile. Do not begin without the match report.

1. Set language register: identify funder type (government / foundation / corporate) and org vertical; apply correct vocabulary per `wiki-vocab-switching`. Extract RFP key terms (used ≥ 2 times) and mirror them back in the narrative.
2. Draft each required section in this order, using the match report's differentiators to lead and reframe strategies to address gaps:
   - Problem / Need Statement: specific problem, quantified population affected, root causes, geographic specificity, cited evidence, connection to funder priorities
   - Project Approach: specific activities + deliverables, phased timeline, staff/partner roles, theory of change, evidence base for approach, how it avoids duplication
   - Outcomes & Evaluation Plan: outputs (produced), outcomes (changes), measurable indicators, data collection methods, reporting plan
   - Organizational Qualifications: past projects similar in scope, key staff credentials, confirmed partnerships only, financial management capacity
3. After each section, append: `[Word count: X / Y limit ✓]` or `[⚠ Word count: X / Y — OVER LIMIT — must cut]`
4. Flag rule: flag `[HUMAN: verify this claim]` on anything not directly sourced from the org profile or a cited document — not just things that seem uncertain. Apply this broadly.
5. At the top of the completed narrative, output: `⚑ This draft contains [N] flagged items requiring human review before submission.`

**Done when:** Complete draft narrative with all RFP-required sections filled, every section under its word limit, and all inferred claims flagged. Section count and word counts verified against the same RFP used in Sub-build 1.

---

### Sub-build 3 — Budget Narrative + Submission Package

**Input:** Line-item budget + narrative draft from Sub-build 2 + org bio boilerplate.

1. Generate budget justification narrative: for each line item, write 1–2 sentences explaining *why* it is necessary for this specific project (not just what it is)
2. After generating the narrative, output a **reconciliation table**: every dollar figure mentioned in the narrative alongside its source budget line item. Any mismatch → flag before proceeding
3. Assemble all components in the exact section order specified by the RFP (not the drafting order): narrative sections + budget narrative + org bio
4. Apply section headings that exactly match the RFP's required labels — no paraphrasing
5. Output a **section order checklist** after assembly:
   ```
   [ ] 1. [RFP section name] — [word count] / [limit] ✓
   [ ] 2. [RFP section name] — ...
   HUMAN: verify this order matches the RFP before submitting
   ```

**Done when:** Feed line-item budget + narrative draft → single assembled document in correct RFP section order with budget narrative inline and reconciliation table attached. Human pastes into funder template — zero reordering required.

---

## Output Format

### Sub-build 1 — Match Report
```
FUNDER SUMMARY
Name: [exact funder name from RFP]
Deadline: [date, time, timezone]
Award: [min–max or fixed amount]
Eligibility confirmed: [Yes / PENDING — see flags below]

ELIGIBILITY REQUIREMENTS
[ ] [Requirement 1] — confirmed / NOT CONFIRMED
[ ] [Requirement 2] — confirmed / NOT CONFIRMED

REQUIRED SECTIONS
[Section name exactly as in RFP] — [word/page limit]
...

ALIGNMENT SCORES [INFERRED if criteria not explicit]
Criterion | Weight | Score (1–5) | Evidence from org profile
...

TOP 3 DIFFERENTIATORS
1. [Criterion] — [Why the org leads here, specific evidence]
2.
3.

GAPS TO ADDRESS
1. [Criterion] — Score: [X] — Reframe: [specific strategy]
...
```

### Sub-build 2 — Narrative Draft
- Markdown document
- Sections in drafting order (will be reordered in Sub-build 3)
- Word count appended after every section
- `[HUMAN: verify this claim]` inline on all inferred statements
- Flag count summary at top

### Sub-build 3 — Submission Package
- Single markdown document
- Sections in RFP-specified order with RFP-exact headings
- Budget justification narrative inline
- Reconciliation table appended at end
- Section order checklist appended at end

---

## Destination

| Step | Where it goes |
|---|---|
| Match report | Displayed in Cowork Skill output; user copies to working doc |
| Narrative draft | Markdown output; user pastes into Google Doc for review |
| Submission package | Markdown output; user pastes into funder's submission portal or Word template |
| **Nothing is submitted automatically** | Human reviews, formats, and submits — no automated portal interaction in v1 |
| **Nothing is stored** | RFP and org profile are session inputs only; no data persisted after the run |

---

## Knowledge-Base Files to Load

Load these files as context before each sub-build. Load only what each sub-build needs.

### All sub-builds (always load)
- `wiki-quality-rules.md` — 7 hard rules, flag taxonomy, clarification triggers

### Sub-build 1
- `wiki-grant-types.md` — identify funder type; sets register and criteria expectations
- `wiki-rfp-anatomy.md` — how to extract sections, criteria, eligibility; STOP check protocol
- `wiki-org-profile.md` — what to expect from the org profile; how to handle missing fields
- `wiki-alignment-methodology.md` — 5-step scoring process, match report format

### Sub-build 2
- `wiki-vocab-switching.md` — language register by funder type and org vertical
- `wiki-narrative-sections.md` — what each section must accomplish; common failure modes
- `wiki-evidence-citation.md` — which evidence type to use for which claim; citation format

### Sub-build 3
- `wiki-budget-conventions.md` — line-item structure, narrative justification rules, reconciliation table
- `wiki-output-formats.md` — section assembly order, submission format, pre-submission checklist

---

## Tools and Credentials

| Tool | Purpose | Required for | Credential |
|---|---|---|---|
| **Cowork Skill** | Execution environment — accepts inputs, runs Claude, returns output | All sub-builds | None — user's Cowork account |
| **Claude (Sonnet)** | Core reasoning and drafting | All sub-builds | Anthropic API key via Cowork |
| **PDF reader** (if PDF input) | Extract text from uploaded RFP | Sub-build 1 (optional) | None — Cowork handles file upload |
| **Google Drive MCP** | Not required in v1 | V2 only (attachments compiler) | OAuth token — not needed yet |
| **Notion MCP** | Not required in v1 | V3 only (grant tracking CRM) | Not needed yet |

**No external API calls in v1.** All inputs are provided by the user. No web scraping, no portal access, no credential storage.

---

## Quality Bar

The output passes when every one of the following is true:

| Check | Pass condition |
|---|---|
| **Content detected** | Sub-build 1 outputs a content-detected confirmation before the match report. If PDF was blank, user was halted and asked to paste text. |
| **Eligibility confirmed** | User explicitly confirmed every eligibility requirement before Sub-build 2 began. If any could not be confirmed, the run was halted. |
| **Criteria labelled** | If evaluation criteria were inferred (not explicitly in RFP), the entire criteria table is marked `[INFERRED]` and user confirmed before narrative drafting. |
| **Word limits** | Every narrative section is under its RFP-specified word limit. No section has `⚠ OVER LIMIT` in the final output. |
| **Flag count reported** | Top of narrative document shows total flag count: `⚑ This draft contains N flagged items`. |
| **No fabricated statistics** | Every number in the narrative is either sourced from the org profile, a cited document, or flagged `[HUMAN: insert statistic here]`. |
| **No unconfirmed partnerships** | Any partnership mentioned is either confirmed in the org profile or flagged `[HUMAN: confirm this partnership is secured]`. |
| **Budget reconciles** | Every dollar figure in the budget narrative appears in the reconciliation table with its source line item. No mismatches. |
| **Section order matches RFP** | Section order checklist produced. Sections assembled in RFP-specified order with RFP-exact headings. |
| **Human checkpoint before submission** | Output makes clear the human must review, verify all flags, and submit manually. No submission action taken. |

---

## Known Failure Points

| # | Failure | How it breaks | Mitigation |
|---|---|---|---|
| 1 | **Scanned / image-based PDF** | No text extracted; match report is generated from nothing and looks plausible | Output content-detected block after reading input. If blank → halt and instruct user to paste RFP text instead. Never proceed on empty extraction. |
| 2 | **Missing evaluation criteria** | Claude infers criteria silently; scored table looks authoritative but may be fabricated | Label entire table `[INFERRED — not stated in RFP]`. Require explicit user confirmation before Sub-build 2 begins. Do not present inferred criteria as confirmed. |
| 3 | **Buried eligibility disqualifier** | Geographic restriction or org-type requirement buried in appendix is missed; full application drafted for ineligible org | Read entire RFP including appendices and schedules. End Sub-build 1 with a mandatory STOP block listing every eligibility requirement. User confirms each one. If any cannot be confirmed → halt. |
| 4 | **Word limit silent overflow** | Sections exceed RFP limits; submission disqualified without warning | Append word count after every section. Flag any section over limit before Sub-build 3. Never assemble a package with over-limit sections. |
| 5 | **Flag fatigue** | Too many flags → user stops reading them; unverified claims reach the funder | Flag anything not directly sourced from org profile — not just things that "seem uncertain." Show total flag count at top of document so human knows the scope before reading. |
| 6 | **Budget narrative ≠ line-item numbers** | Narrative says "$45,000 for staff"; budget shows $47,500; funder flags discrepancy | Produce reconciliation table after budget narrative. Surface any mismatch as a hard blocker before assembling the submission package. |
| 7 | **Section order mismatch** | Assembled package reorders sections incorrectly; submission penalised or rejected | Assemble strictly in RFP-specified order. Produce section order checklist with human verification prompt. Never reorder based on narrative logic. |
| 8 | **Stale org profile data** | Two-year-old financials used without warning; funder may flag inconsistencies on submission | Check for "Data current as of" field. If absent → flag every financial figure `[HUMAN: confirm this is current]` before using in budget narrative or qualifications section. |
