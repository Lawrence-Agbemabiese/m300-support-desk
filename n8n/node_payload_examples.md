# Node Payload Examples

These examples exercise the current two-tier debt model and custom “Other” labels. Funding matches produced by the workflow are provisional until verified through current official sources.

## Tier 1 webhook input

```json
{
  "project_name": "Kaduna Community Solar Mini-Grid",
  "country": "Nigeria",
  "location_description": "Rural community in Kaduna State, 45 km from the grid",
  "technology_type": "solar_mini_grid",
  "capacity_kw": 50,
  "target_beneficiaries": "200 households and one cassava-processing facility",
  "ownership_model": "community_cooperative",
  "productive_uses": ["cassava_processing", "phone_charging"],
  "estimated_cost_usd": 285000,
  "project_stage": "concept",
  "community_engagement": "A community cooperative has been formed",
  "debt_preference": "grant_only"
}
```

Expected policy result:

```json
{
  "debt_sensitivity_tier": "tier_1",
  "debt_exposure_risks": [
    "No debt exposure identified from intake; verify current financing terms"
  ]
}
```

The Tier 1 result comes from `grant_only`, not from cooperative ownership.

## Tier 2 webhook input

```json
{
  "project_name": "Regional Productive-Use Energy Hub",
  "country": "Ghana",
  "location_description": "A peri-urban productive-use cluster",
  "technology_type": "hybrid_mini_grid",
  "capacity_kw": 120,
  "target_beneficiaries": "Small enterprises and nearby households",
  "ownership_model": "community_cooperative",
  "productive_uses": ["cold_storage", "agro_processing"],
  "estimated_cost_usd": 700000,
  "debt_preference": "open_to_blended"
}
```

Expected policy result:

```json
{
  "debt_sensitivity_tier": "tier_2",
  "debt_exposure_risks": [
    "Blended finance may introduce repayment, bridge-finance, currency, or guarantee exposure"
  ]
}
```

This demonstrates that ownership does not control the debt tier: a community cooperative is Tier 2 when its financing preference accepts blended finance.

## Custom “Other” input

```json
{
  "project_name": "Lake Transport Charging Network",
  "country": "Uganda",
  "location_description": "Landing sites serving electric fishing and passenger boats",
  "technology_type": "other",
  "technology_other": "Solar-powered electric-boat charging",
  "target_beneficiaries": "Fishing cooperatives and passenger operators",
  "ownership_model": "other",
  "ownership_other": "Multi-cooperative special-purpose entity",
  "estimated_cost_usd": 450000,
  "debt_preference": "grant_preferred"
}
```

Expected behavior:

- Policy and proposal narratives display the two custom labels.
- The project is Tier 1 because the preference is `grant_preferred`.
- Ownership fit remains provisional rather than being treated as debt exposure.

## Normalize-node output

```json
{
  "project_intake": {
    "project_name": "Lake Transport Charging Network",
    "country": "Uganda",
    "technology_type": "other",
    "technology_other": "Solar-powered electric-boat charging",
    "ownership_model": "other",
    "ownership_other": "Multi-cooperative special-purpose entity",
    "productive_uses": [],
    "estimated_cost_usd": 450000,
    "project_stage": "concept",
    "debt_preference": "grant_preferred"
  },
  "validation": {
    "status": "valid",
    "timestamp": "2026-09-05T12:00:00.000Z"
  }
}
```

## Grant match excerpt

```json
{
  "matches": [
    {
      "funder_name": "Illustrative grant funder",
      "fit_score": 82,
      "debt_sensitivity_tier": "tier_1",
      "red_flags": [],
      "next_actions": [
        "Verify the opportunity and terms on an official source",
        "Prepare project documentation",
        "Complete demand and financial assessments",
        "Record debt, currency, guarantee, and bridge-finance terms"
      ]
    },
    {
      "funder_name": "Illustrative results-based funder",
      "fit_score": 74,
      "debt_sensitivity_tier": "tier_2",
      "red_flags": [
        "Results-based payment may require bridge financing"
      ],
      "next_actions": [
        "Verify the opportunity and terms on an official source",
        "Identify the bridge-finance source and obligor"
      ]
    }
  ],
  "debt_sensitivity_summary": {
    "tier_1_count": 1,
    "tier_2_count": 1,
    "recommendation": "Prefer Tier 1 where overall fit is comparable; retain Tier 2 with explicit due diligence."
  }
}
```

Legacy funder numeric tiers `2`, `3`, or `4` are all normalized to `tier_2`; they are not automatically removed.

## Validation errors

Missing required fields:

```json
{
  "error": true,
  "message": "Missing required fields: technology_type, estimated_cost_usd"
}
```

Missing custom label:

```json
{
  "error": true,
  "message": "technology_other is required when technology_type is other"
}
```

## Proposal risk-register excerpt

```json
{
  "risk_register": "Technical, financial, governance, and delivery assumptions require evidence. DEBT SENSITIVITY (tier_2): Blended finance may introduce repayment, bridge-finance, currency, or guarantee exposure. Tier 2 remains eligible but requires repayment, currency, obligor, guarantee, and contingent-liability review."
}
```
