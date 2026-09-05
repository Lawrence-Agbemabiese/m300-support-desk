# Decision Framework

## Purpose

The Grant Matcher ranks potential funding sources for an M300 project. It is a decision-support tool, not an eligibility determination. Every funder opportunity and financing term must be checked against a current official source before action.

## Final score

The base fit score (0–100) combines five components:

| Component | Weight | What it measures |
|---|---:|---|
| Geography | 25% | Country and regional fit |
| Thematic | 30% | Technology, use case, and sector fit |
| Size | 15% | Project cost relative to the typical ticket |
| Ownership | 20% | Fit with the funder's stated ownership preferences |
| Eligibility | 10% | Apparent readiness against typical requirements |

The calculation is:

`final score = base score × (1 − red-flag penalty) × debt modifier`

Red flags reduce the score by 10% each, capped at 30%. They remain visible in the result so a user can distinguish a weak fit from a promising option with manageable risks.

## Two-tier debt model

The M300 interface uses two debt-sensitivity tiers:

| Tier | Meaning | Score modifier | Matching treatment |
|---|---|---:|---|
| Tier 1 | Low/no-debt option preferred | 1.00 | Preferred where fit is otherwise comparable |
| Tier 2 | Some debt or debt-like exposure accepted | 0.90 | Retained and ranked with explicit risk warnings |

Tier 2 is not an automatic exclusion. A Tier 2 source may still be the strongest practical match when its geography, thematic fit, size, and terms are favorable.

Historical funder records may contain numeric tiers 1–4. The matcher normalizes `1` to Tier 1 and every value greater than `1` to Tier 2. This preserves older data while keeping the user-facing model clear.

### Project tier

The Policy Interpreter derives the project's tier only from `debt_preference`:

| Debt preference | Project tier |
|---|---|
| `grant_only` | Tier 1 |
| `grant_preferred` | Tier 1 |
| `open_to_blended` | Tier 2 |
| `any_instrument` | Tier 2 |

Ownership never determines the debt tier. Ownership remains a separate governance and funder-fit signal because a public, community, or private structure can each use either debt or non-debt finance.

## Component rules

### Geography (25%)

| Condition | Score |
|---|---:|
| Country listed as a priority | 100 |
| African regional scope applies | 60 |
| Global South scope applies | 50 |
| Coverage not established | 0 |

### Thematic fit (30%)

| Condition | Score |
|---|---:|
| Primary-focus match | 100 |
| Secondary-focus or productive-use match | 80 |
| General energy-access match | 60 |
| Weak or uncertain match | 30 |

If `technology_type` is `other`, scoring and explanations use `technology_other` when supplied.

### Size (15%)

| Condition | Score |
|---|---:|
| Within the stated typical range | 100 |
| Within 50% beyond a range boundary | 60 |
| Further outside the range | 30 |

### Ownership (20%)

Ownership is scored against stated funder preferences, not used as a proxy for debt. Community and public models often fit grant criteria strongly, while private models can still match where funder terms support them. If `ownership_model` is `other`, displays use `ownership_other` when supplied.

### Eligibility (10%)

| Evidence available | Score |
|---|---:|
| Entity/readiness and engagement both indicated | 70 |
| One indicated | 50 |
| Neither indicated | 30 |

These scores are intentionally provisional; the user must verify actual eligibility.

## Risk signals

The matcher retains detailed warnings even when an opportunity remains ranked. Current signals include:

- results-based payments that may require bridge financing;
- blended instruments that conflict with a grant-only preference;
- project size well outside a funder's typical range;
- private-IPP terms that may require guarantees; and
- unknown repayment, currency, guarantee, or contingent-liability terms.

Warnings are prompts for due diligence, not assertions that a financing source is unsuitable.

## Ranking and exclusion

1. Score every known funder.
2. Apply the red-flag penalty and debt modifier.
3. Sort by final score descending.
4. Return up to five matches at or above the score threshold of 30.
5. Show up to three below-threshold sources with the numerical reason.

No source is excluded solely because it is Tier 2 or because the project selected `open_to_blended` or `any_instrument`. Explicit eligibility failures may be added later when backed by verified current terms.

## Worked example

A project receives these component scores: geography 100, thematic 100, size 100, ownership 90, eligibility 70. Its base score is:

`100×0.25 + 100×0.30 + 100×0.15 + 90×0.20 + 70×0.10 = 95`

With one red flag and a Tier 2 funder:

`95 × 0.90 × 0.90 = 76.95`, rounded to `77`.

The source remains a match and its warning remains visible.

## Configuration

Weights, modifiers, penalties, and the minimum threshold are defined in `lib/data/weights.ts`. Changes require a version increment and regression checks so saved analyses can identify the scoring version used.

## Transparency requirements

Every result must show:

1. the component rationale;
2. identified risk signals;
3. the normalized debt tier;
4. concrete next actions; and
5. a reminder to verify current funder terms through an official source.
