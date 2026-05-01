# Org Profile Components

When to use: Understand what must be in the org profile and how to handle missing or stale data.

---

## Required Fields
- **Mission & Vision:** stated purpose, year founded, legal status (charity number), geographic scope
- **Programs & Services:** name, target population, delivery model, years in operation — active programs only
- **Track Record:** past grants (funder, amount, year, purpose), outcomes achieved (quantitative)
- **Key Staff:** ED/CEO name and experience, program leads, board size and expertise
- **Financials:** revenue/expenses/surplus (most recent FY), revenue breakdown by source, audit status
- **Data currency field:** "Financials current as of: ___" — if blank, flag every financial figure `[HUMAN: confirm this is current]`

## Hard Rules
- Never invent statistics, outcomes, or financial figures not in the profile
- Never upgrade vague claims ("we serve many people" → a specific number) without a source
- Never assume a program exists from the org's mission — only use explicitly stated programs
- Missing info → `[HUMAN: provide — not found in org profile]` then continue drafting

## Data Currency Check
- Are financials from the most recent completed fiscal year?
- Are program descriptions current (not archived programs)?
- Are staff names and roles still active?
- No "current as of" date → flag at top of match report before proceeding

## Related
- [[wiki-alignment-methodology]] — org profile is one of two core inputs to alignment scoring
- [[wiki-budget-conventions]] — staff salaries and financials come from the org profile
- [[wiki-evidence-citation]] — org's own outcome data is a Tier 2 evidence source
- [[wiki-quality-rules]] — rules for missing and unverifiable org data
