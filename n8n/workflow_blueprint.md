# n8n Workflow Blueprint

## Purpose

The importable workflow in `n8n/n8n_workflow.json` mirrors the web application's deterministic M300 pipeline:

1. receive and normalize intake;
2. interpret policy and project debt preference;
3. score and rank funders; and
4. generate proposal-readiness guidance.

The embedded funder records are examples. They are not evidence that an opportunity is open or that its terms remain current. Every next-action list begins with official-source verification.

## Flow

`Webhook → Validate & Normalize → Policy Interpreter → Grant Matcher → Proposal Coach → Respond to Webhook`

## Webhook

- Method: `POST`
- Path: `/m300-support`
- Response: final node output

Production deployments should add authentication, request-size limits, rate limits, and secret management appropriate to the n8n environment.

## Intake contract

Required fields:

```json
{
  "project_name": "string",
  "country": "string",
  "technology_type": "string",
  "ownership_model": "string",
  "estimated_cost_usd": 0
}
```

The normalize node also accepts optional fields used by analysis, including `debt_preference`, `productive_uses`, `technology_other`, and `ownership_other`.

### Custom labels

When `technology_type` is `other`, `technology_other` is required. When `ownership_model` is `other`, `ownership_other` is required. Downstream narrative, proposal, and scoring logic use the custom text instead of displaying “other.”

### Debt preference

If absent, `debt_preference` defaults to `grant_preferred`. Supported values and project tiers are:

| Value | Project tier |
|---|---|
| `grant_only` | Tier 1 |
| `grant_preferred` | Tier 1 |
| `open_to_blended` | Tier 2 |
| `any_instrument` | Tier 2 |

The project tier is calculated from this field only. Ownership is scored independently and never used as a debt proxy.

## Policy Interpreter

The node produces:

- M300 alignment score and narrative;
- ownership classification;
- grant-suitable elements;
- debt and private-capital risk signals;
- assumptions and recommended framing; and
- the two-tier project debt classification.

The policy score rewards community/public-interest alignment, productive use, and low/no-debt preference. Detailed risks remain visible even when the overall alignment is strong.

## Grant Matcher

### Component weights

| Component | Weight |
|---|---:|
| Geography | 25% |
| Thematic fit | 30% |
| Project size | 15% |
| Ownership fit | 20% |
| Provisional eligibility | 10% |

### Modifiers

- Each red flag reduces the result by 10%, capped at 30%.
- Tier 1 funders use a `1.00` modifier.
- Tier 2 funders use a `0.90` modifier.
- A final score below 30 is placed in the explanatory excluded list.

Tier 2 is not automatically excluded. It is ranked alongside Tier 1, with repayment, currency, bridge-finance, guarantee, and contingent-liability risks retained in output.

### Legacy tier normalization

The n8n grant examples use numeric source tiers to demonstrate compatibility:

```javascript
const normalizeTier = value =>
  Number(value) === 1 || value === 'tier_1' ? 'tier_1' : 'tier_2';
```

Thus, historical numeric tiers 2, 3, and 4 all render as current Tier 2. The detailed red flags—not additional colors—carry the risk distinctions.

## Proposal Coach

The final analysis includes:

- proposal outline;
- readiness checklist;
- missing-information questions; and
- explicit debt-term verification prompts.

The risk register reminds users that Tier 2 can remain eligible while requiring review of obligor, repayment, currency, guarantees, and contingent liabilities.

## Import and smoke check

1. In n8n, select **Import from File** and choose `n8n_workflow.json`.
2. Configure webhook authentication before production activation.
3. Run the Tier 1 example from `node_payload_examples.md`.
4. Confirm `policy_interpretation.debt_sensitivity_tier` is `tier_1`.
5. Run the Tier 2 example.
6. Confirm the project tier is `tier_2` regardless of ownership.
7. Confirm funder legacy values greater than 1 render as `tier_2` and remain eligible for ranking.
8. Confirm an `other` input displays its custom label.
9. Confirm each match asks the user to verify the opportunity and terms through an official source.

## Operational controls

- Treat embedded and AI-generated funding leads as provisional.
- Store an official source URL and verification date outside the workflow before application work begins.
- Version changes to scoring behavior.
- Keep the workflow's two-tier mapping synchronized with `lib/agents/policy-interpreter.ts`, `lib/agents/grant-matcher.ts`, and `lib/data/weights.ts`.
- Do not log secrets or sensitive contact information in production execution data.
