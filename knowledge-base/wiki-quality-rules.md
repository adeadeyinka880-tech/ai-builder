# Quality Rules & Hard Limits

When to use: Always — these rules apply to every output, every section, every funder type. This is the root constraint layer.

---

## 7 Hard Rules — Never Violate

1. **Be truthful always.** Every claim must trace to a verifiable source. If unverifiable → flag, never invent.
2. **Ask when information is missing.** Insert `[HUMAN: provide — specific info needed]` and continue. Never fill gaps with plausible-sounding data.
3. **Never fabricate statistics.** No number without a traceable source → `[HUMAN: insert statistic — suggested source: Statistics Canada / CIHI / municipal report]`
4. **Never overpromise outcomes.** Targets must be grounded in org history or set by the user. Unverifiable target → `[HUMAN: verify this target is achievable based on past program results]`
5. **Never misrepresent org capacity.** Only describe staff, systems, partnerships confirmed in the org profile. Unconfirmed partnership → `[HUMAN: confirm this partnership is secured before submission]`
6. **Never use funder jargon incorrectly.** Wrong usage is worse than no usage. Uncertain → plain language + flag.
7. **Budget figures must reconcile.** Narrative dollar amounts match spreadsheet exactly. No rounding.

## Flag Taxonomy
| Flag | When |
|---|---|
| `[HUMAN: verify this claim]` | Plausible but not directly sourced from org profile or cited doc |
| `[HUMAN: provide — X]` | Information needed but absent from all inputs |
| `[HUMAN: confirm this is current]` | Data present but currency unknown |
| `[HUMAN: confirm this partnership is secured]` | Partnership mentioned but unconfirmed |
| `[HUMAN: verify this target is achievable]` | Outcome target not traceable to past performance |
| `[INFERRED — not stated in RFP]` | Evaluation criteria derived by AI, not listed explicitly |
| `[⚠ OVER WORD LIMIT]` | Section exceeds RFP word limit |

## Clarification Triggers — Stop and Ask Before Proceeding
- Eligibility requirements cannot be confirmed from org profile
- RFP appears image-based; no text extracted
- Org profile contains no financial data
- Proposed project not described anywhere in org profile
- RFP contains contradictory instructions

## Flag Count Report — Required at Top of Every Draft
```
⚑ This draft contains [N] flagged items requiring human review before submission.
   Review all flags before finalizing.
```

## Related
- [[wiki-grant-types]] — truthfulness and vocabulary rules apply across all funder types
- [[wiki-rfp-anatomy]] — eligibility confirmation is a mandatory STOP
- [[wiki-org-profile]] — never invent org data; flag all gaps
- [[wiki-narrative-sections]] — word limits, outcome flags, partnership confirmation
- [[wiki-evidence-citation]] — prohibition on fabricating statistics
- [[wiki-budget-conventions]] — budget figures must reconcile exactly
- [[wiki-alignment-methodology]] — inferred criteria must be labelled; eligibility confirmed first
- [[wiki-vocab-switching]] — plain language + flag when funder terminology is uncertain
- [[wiki-output-formats]] — pre-submission checklist enforces all quality rules
