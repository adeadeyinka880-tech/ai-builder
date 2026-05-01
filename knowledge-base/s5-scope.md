# Grant Response Generator — MVP Scope

See full scope document at `../s5-scope.md`. This is the knowledge-base reference copy.

---

## Quick Reference

**What it builds:** Cowork Skill — RFP + org profile → complete first-draft grant application

**Inputs:** Grant RFP (PDF or text) · Org profile (1-page)
**Trigger:** Manual invocation only
**Output:** Markdown document — all sections, budget narrative, `[HUMAN: verify]` flags
**Destination:** Markdown → Google Doc → funder portal (human submits)

---

## Sub-build Pipeline

| Sub-build | Output | Time |
|---|---|---|
| 1 — RFP Parser + Match Report | Scored criteria table, differentiators, gaps | 2–3 hrs |
| 2 — Narrative Drafter | All sections under word limits, flagged claims | 2–3 hrs |
| 3 — Budget + Submission Package | Assembled doc in RFP order, reconciliation table | 1–2 hrs |

---

## Failure Points (summary)

| Risk | Mitigation |
|---|---|
| Scanned PDF — no content | Content detected confirmation; halt if blank |
| Missing eval criteria | Flag table `[INFERRED]`; user confirms before Sub-build 2 |
| Buried eligibility disqualifier | Mandatory STOP block; user confirms each requirement |
| Word limit overflow | Word count appended after every section |
| Flag fatigue | Flag count at top of every draft |
| Budget ≠ narrative numbers | Reconciliation table in Sub-build 3 |
| Section order mismatch | Section order checklist after assembly |
| Stale org profile data | "Data current as of" field; flag if absent |

---

## V2 / V3 Roadmap (ordered)

1. LOI Drafter
2. Budget spreadsheet generation
3. Supporting attachments compiler
4. Multi-RFP eligibility screener
5. Deadline monitoring
6. Grant tracking CRM
7. Multi-funder batch processing
8. Portal auto-submission

## Related
- [[wiki-alignment-methodology]] — Sub-build 1 process
- [[wiki-narrative-sections]] — Sub-build 2 process
- [[wiki-budget-conventions]] — Sub-build 3 process
- [[wiki-quality-rules]] — failure point mitigations
- [[wiki-output-formats]] — submission and assembly standards
