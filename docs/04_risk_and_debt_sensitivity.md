# Risk and Debt Sensitivity Framework

## Principle

M300 should help users prefer low/no-debt finance while still evaluating realistic funding structures. Debt exposure is therefore a weighted decision factor, not a blanket rejection rule.

The framework separates three questions that must not be conflated:

1. **Project preference:** how much debt the applicant is prepared to consider.
2. **Funder structure:** whether the instrument may create debt or debt-like exposure.
3. **Ownership and governance:** who owns, controls, benefits from, and carries obligations for the project.

Ownership does not determine a project's debt tier. A community, public, hybrid, or private project can be debt-free or debt-financed.

## Two user-facing tiers

### Tier 1 — Low/no debt preferred

Use when the project selects `grant_only` or `grant_preferred`, and for funding sources whose known structure is low/no debt.

Preferred characteristics include:

- grant or non-repayable support;
- no sovereign or sub-sovereign guarantee;
- no repayment obligation hidden in an implementation arrangement;
- no bridge facility that the project cannot service; and
- limited contingent liabilities.

Tier 1 receives a `1.00` scoring modifier.

### Tier 2 — Some debt accepted

Use when the project selects `open_to_blended` or `any_instrument`, and for funding sources with any material debt or debt-like exposure.

Examples include:

- blended grant/loan finance;
- concessional or commercial loans;
- results-based grants requiring bridge finance;
- guarantees or government backstops;
- foreign-currency obligations; and
- equity arrangements carrying guaranteed returns or public contingencies.

Tier 2 receives a `0.90` modifier. It remains eligible for matching and may rank highly. Its risks must be stated and verified before a financing decision.

### Legacy data

Older funder records may carry four numeric debt tiers. The application maps legacy Tier 1 to the current Tier 1 and legacy Tiers 2–4 to the current Tier 2. The detailed risk fields preserve the distinctions that the former colors attempted to summarize.

## Required due diligence

For every Tier 2 opportunity—and any Tier 1 opportunity with unclear terms—verify:

| Question | Evidence to capture |
|---|---|
| What is the instrument? | Grant, RBF, loan, equity, guarantee, or components of a blend |
| Who is the obligor? | National government, local government, project entity, cooperative, or private developer |
| What is repayable? | Principal, interest, fees, guaranteed return, or pre-financed expenditure |
| What guarantees apply? | Sovereign, sub-sovereign, tariff, offtake, parent-company, or counter-guarantee |
| In what currency? | Obligation currency, revenue currency, hedging arrangement |
| What is the repayment profile? | Rate, tenor, grace period, amortization, balloon payment, default provisions |
| What contingent liabilities exist? | Termination payments, minimum revenue, take-or-pay, performance support |
| Is information current? | Official source URL and verification date |

## Detailed risk signals

The two-tier label is deliberately simple, but the assessment must retain specific signals:

### Fiscal and guarantee risk

- sovereign or sub-sovereign guarantee;
- tariff or offtake support from a public entity;
- termination payment or minimum-revenue commitment; and
- counter-guarantee attached to third-party risk cover.

### Repayment and affordability risk

- debt-service burden relative to projected cash flow;
- bridge-finance need for results-based payment;
- short tenor, high interest, or balloon repayment;
- uncertain demand or tariff collection; and
- repayment obligation placed on an entity without demonstrated capacity.

### Currency and refinancing risk

- foreign-currency debt against local-currency revenue;
- unpriced or unavailable hedging;
- refinancing dependency; and
- acceleration or cross-default provisions.

### Ownership and benefit risk

- unclear asset ownership;
- guaranteed private return backed by public resources;
- weak community benefit-sharing;
- limited local participation in governance; and
- revenue extraction without corresponding risk transfer or service obligations.

These signals inform scoring, the risk register, and next actions. They do not automatically remove a match.

## Risk register template

```text
DEBT SENSITIVITY ASSESSMENT

1. Project preference
   - Debt preference: [grant_only/grant_preferred/open_to_blended/any_instrument]
   - Project tier: [Tier 1/Tier 2]

2. Funding structure
   - Grant component: [amount/%/unknown]
   - Debt component: [amount/%/unknown]
   - Equity or guarantee component: [amount/%/unknown]

3. Obligations
   - Obligor: [entity]
   - Principal, rate, tenor, and grace period: [terms/unknown]
   - Currency and revenue currency: [currencies/unknown]

4. Guarantees and contingencies
   - Sovereign/sub-sovereign guarantee: [yes/no/unknown]
   - Tariff/offtake/termination support: [details/unknown]
   - Other contingent liabilities: [details/unknown]

5. Risk signals
   - Fiscal: [details]
   - Repayment/affordability: [details]
   - Currency/refinancing: [details]
   - Ownership/benefit-sharing: [details]

6. Mitigation and decision
   - Mitigations: [actions]
   - Residual risk: [low/moderate/high/unknown]
   - Recommendation: [proceed/compare/negotiate/do not proceed]

7. Verification
   - Official source: [URL]
   - Verified on: [date]
   - Verified by: [name/role]
```

## Decision guidance

| Finding | Treatment |
|---|---|
| Confirmed low/no-debt terms | Tier 1; prefer where overall fit is comparable |
| Some debt with manageable terms | Tier 2; retain, rank, and document mitigations |
| RBF requires bridge funding | Tier 2; identify bridge source and repayment capacity |
| Sovereign or municipal guarantee | Tier 2; escalate for fiscal and legal review |
| Foreign-currency debt/local-currency revenue | Tier 2; quantify FX stress and mitigation |
| Terms are unknown or stale | Keep as provisional; require official-source verification |
| Explicit eligibility failure | Exclude only when supported by a verified current source |

## Project-preference behavior

- `grant_only`: prioritize Tier 1; show Tier 2 only as a lower-ranked alternative with an instrument-mismatch warning.
- `grant_preferred`: prioritize Tier 1; show viable Tier 2 options with full risks.
- `open_to_blended`: classify the project Tier 2 and compare grant, debt, and blended structures.
- `any_instrument`: classify the project Tier 2 and require complete term review before recommendation.

## Governance and review

The framework supports informed choice rather than substituting for financial, legal, or sovereign-debt advice. Before a funding decision, a qualified reviewer should confirm current terms, affordability, authority to borrow or guarantee, procurement implications, and material community impacts.

The user-facing tier should remain stable and understandable; the risk register carries the analytical detail needed for responsible follow-through.
