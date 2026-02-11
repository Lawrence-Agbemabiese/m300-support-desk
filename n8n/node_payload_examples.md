# Node Payload Examples

This document provides example payloads for each node in the n8n workflow.

---

## Webhook Input (Node 1)

### Example 1: Community Mini-Grid

```json
{
  "project_name": "Kaduna Community Solar Mini-Grid",
  "country": "Nigeria",
  "location_description": "Rural community in Kaduna State, 45km from grid",
  "technology_type": "solar_mini_grid",
  "capacity_kw": 50,
  "target_beneficiaries": "200 households, 1 cassava processing facility",
  "ownership_model": "community_cooperative",
  "productive_uses": ["cassava_processing", "phone_charging"],
  "estimated_cost_usd": 285000,
  "existing_funding": "Community committed $15,000",
  "project_stage": "concept",
  "community_engagement": "Cooperative formed 2021, 180 members",
  "additional_context": "DISCO confirms no grid extension planned",
  "debt_preference": "grant_only"
}
```

### Example 2: Health Facility Electrification

```json
{
  "project_name": "Plateau Health Clinic Electrification",
  "country": "Nigeria",
  "location_description": "5 rural health clinics in Plateau State",
  "technology_type": "solar_standalone",
  "capacity_kw": 25,
  "target_beneficiaries": "5 health clinics serving 25,000 people",
  "ownership_model": "public_community_hybrid",
  "productive_uses": ["vaccine_cold_chain", "medical_equipment"],
  "estimated_cost_usd": 175000,
  "existing_funding": "Ministry provides sites and recurrent budget",
  "project_stage": "early_development",
  "community_engagement": "Ward Development Committees active at each clinic",
  "additional_context": "State cannot take new loans due to debt",
  "debt_preference": "grant_only"
}
```

### Example 3: Minimal Input (Requires Clarification)

```json
{
  "project_name": "Kenya School Solar",
  "country": "Kenya",
  "technology_type": "solar",
  "ownership_model": "public",
  "estimated_cost_usd": 50000
}
```

---

## Validate & Normalize Output (Node 2)

### From Example 1:

```json
{
  "project_intake": {
    "project_name": "Kaduna Community Solar Mini-Grid",
    "country": "Nigeria",
    "location_description": "Rural community in Kaduna State, 45km from grid",
    "technology_type": "solar_mini_grid",
    "capacity_kw": 50,
    "target_beneficiaries": "200 households, 1 cassava processing facility",
    "ownership_model": "community_cooperative",
    "productive_uses": ["cassava_processing", "phone_charging"],
    "estimated_cost_usd": 285000,
    "existing_funding": "Community committed $15,000",
    "project_stage": "concept",
    "community_engagement": "Cooperative formed 2021, 180 members",
    "additional_context": "DISCO confirms no grid extension planned",
    "debt_preference": "grant_only"
  },
  "validation": {
    "status": "valid",
    "timestamp": "2026-02-03T15:30:00Z"
  }
}
```

### Validation Error Example:

```json
{
  "error": true,
  "message": "Missing required fields: technology_type, estimated_cost_usd",
  "received_fields": ["project_name", "country", "ownership_model"],
  "required_fields": ["project_name", "country", "technology_type", "ownership_model", "estimated_cost_usd"]
}
```

---

## Policy Interpreter Output (Node 3)

### From Example 1:

```json
{
  "project_intake": {
    "project_name": "Kaduna Community Solar Mini-Grid",
    "country": "Nigeria",
    "technology_type": "solar_mini_grid",
    "capacity_kw": 50,
    "ownership_model": "community_cooperative",
    "productive_uses": ["cassava_processing", "phone_charging"],
    "estimated_cost_usd": 285000,
    "debt_preference": "grant_only"
  },
  "policy_interpretation": {
    "project_name": "Kaduna Community Solar Mini-Grid",
    "m300_alignment_score": 88,
    "alignment_narrative": "This solar_mini_grid project in Nigeria demonstrates strong alignment with M300 debt-sensitivity principles. The community_cooperative ownership model supports grant eligibility by ensuring revenues remain local and no sovereign debt is created. The productive use component (cassava processing) strengthens the business case for grant investment.",
    "ownership_classification": "community_cooperative",
    "grant_suitable_elements": [
      "Community cooperative ownership eliminates profit extraction",
      "Productive use component: cassava_processing, phone_charging",
      "Last-mile rural electrification focus",
      "No sovereign debt implications",
      "Grant-only preference explicitly stated"
    ],
    "debt_exposure_risks": [
      "None identified under current structure"
    ],
    "private_capital_risks": [
      "If private developer introduced later, ensure community retains ownership"
    ],
    "community_ownership_justification": "Cooperative ownership keeps tariff revenues in Kaduna State, builds local capacity, and prevents capital flight.",
    "assumptions_list": [
      "Cooperative is formally registered with CAC",
      "Land tenure for site is secured",
      "Community ability-to-pay has been assessed",
      "Cassava processing demand is confirmed"
    ],
    "recommended_framing": "Position as community-led productive use electrification that advances M300 goals without adding to Nigeria's debt burden.",
    "debt_sensitivity_tier": "tier_1"
  }
}
```

---

## Grant Matcher Output (Node 4)

### From Example 1:

```json
{
  "project_intake": { "...": "..." },
  "policy_interpretation": { "...": "..." },
  "grant_match": {
    "project_name": "Kaduna Community Solar Mini-Grid",
    "matches": [
      {
        "funder_id": "geapp_minigrid",
        "funder_name": "GEAPP",
        "instrument_type": "grant",
        "fit_score": 92,
        "debt_sensitivity_tier": "tier_1",
        "fit_rationale": [
          "Nigeria is GEAPP priority country",
          "Mini-grids with productive use is core focus",
          "Cost $285K within typical range ($150K-$500K)",
          "Community cooperative ownership explicitly supported"
        ],
        "red_flags": [],
        "next_actions": [
          "Register on GEAPP partner portal",
          "Complete GEAPP demand assessment template",
          "Obtain cooperative CAC registration certificate",
          "Document land tenure arrangement"
        ]
      },
      {
        "funder_id": "amsf_rbf",
        "funder_name": "Africa Mini-Grid Support Facility",
        "instrument_type": "results_based_grant",
        "fit_score": 85,
        "debt_sensitivity_tier": "tier_2",
        "fit_rationale": [
          "West Africa is eligible region",
          "Solar mini-grids supported",
          "Community ownership compatible"
        ],
        "red_flags": [
          "Results-based payment requires bridge financing"
        ],
        "next_actions": [
          "Identify bridge financing source",
          "Develop connection milestone schedule",
          "Prepare tariff documentation"
        ]
      },
      {
        "funder_id": "gcf_sap",
        "funder_name": "Green Climate Fund SAP",
        "instrument_type": "grant",
        "fit_score": 78,
        "debt_sensitivity_tier": "tier_1",
        "fit_rationale": [
          "Nigeria is eligible country",
          "Renewable mini-grids qualify under mitigation",
          "Grant instrument"
        ],
        "red_flags": [
          "Requires accredited entity",
          "Longer process"
        ],
        "next_actions": [
          "Identify suitable accredited entity",
          "Develop GHG reduction estimate",
          "Frame within existing AE pipeline"
        ]
      },
      {
        "funder_id": "usadf",
        "funder_name": "US African Development Foundation",
        "instrument_type": "grant",
        "fit_score": 75,
        "debt_sensitivity_tier": "tier_1",
        "fit_rationale": [
          "Direct grants to African cooperatives",
          "Community enterprise focus",
          "Productive use aligned"
        ],
        "red_flags": [
          "Maximum $250K may be limiting"
        ],
        "next_actions": [
          "Apply directly through USADF portal",
          "Document African ownership",
          "Develop job creation targets"
        ]
      },
      {
        "funder_id": "undp_africa_minigrid",
        "funder_name": "UNDP Africa Minigrids Program",
        "instrument_type": "grant",
        "fit_score": 72,
        "debt_sensitivity_tier": "tier_1",
        "fit_rationale": [
          "Nigeria is program country",
          "Mini-grids are core focus",
          "Supports community ownership"
        ],
        "red_flags": [
          "May require alignment with national program"
        ],
        "next_actions": [
          "Contact UNDP Nigeria office",
          "Align with national electrification plan"
        ]
      }
    ],
    "excluded_funders": [
      {
        "funder_id": "eu_electrifi",
        "funder_name": "ElectriFI",
        "exclusion_reason": "Blended finance structure conflicts with grant-only preference"
      }
    ],
    "overall_funding_strategy": "Lead with GEAPP application (92/100 fit, pure grant, fastest process). AMSF as secondary if bridge financing available. Avoid blended finance given grant-only preference."
  }
}
```

---

## Proposal Coach Output (Node 5)

### From Example 1 (abbreviated):

```json
{
  "project_intake": { "...": "..." },
  "policy_interpretation": { "...": "..." },
  "grant_match": { "...": "..." },
  "proposal_coach": {
    "project_name": "Kaduna Community Solar Mini-Grid",
    "target_funder": "GEAPP",
    "proposal_outline": {
      "problem_statement": "Approximately 1,200 people across 200 households in rural Kaduna State lack access to reliable electricity. The nearest grid is 45km away with no extension planned. Without power, the local cassava cooperative cannot process crops, forcing farmers to sell raw cassava at lower prices.",
      "theory_of_change": "IF the community cooperative installs and operates a 50kW solar mini-grid with productive use prioritization, THEN 200 households will gain electricity access AND the cassava processing facility will operate at capacity, LEADING TO increased incomes, job creation, and a replicable model for community-owned electrification.",
      "community_ownership_governance": "The cooperative will own 100% of assets. Governance includes General Assembly (quarterly), Management Committee (7 members, 40% women), trained local operators, transparent tariff-setting, and 20% revenue to maintenance reserve.",
      "technical_approach": "50kWp solar PV, 100kWh battery, smart pre-paid metering, serving 200 households plus 15kW productive use load.",
      "affordability_tariff_principles": "Lifeline rate for first 30kWh/month, standard rate above. Productive use cross-subsidizes household rates. Tariff review every 2 years with community input.",
      "implementation_plan": "Month 1-2: Design & procurement | Month 3-4: Civil works | Month 5-6: Installation | Month 7-8: Connections & training | Month 9-12: Optimization",
      "mel_framework": "Outputs: connections, kWh generated, uptime. Outcomes: income changes, processing volume, expenditure reduction. Data: smart meters, quarterly surveys, annual audit.",
      "risk_register": "Technical: quality procurement, warranties. Financial: prepaid metering. Governance: term limits, audits. DEBT SENSITIVITY: 100% grant funded, no sovereign debt, no guarantees, zero fiscal impact."
    },
    "readiness_checklist": [
      {"item": "Cooperative CAC registration", "status": "unknown", "notes": "Verify and attach certificate"},
      {"item": "Land documentation", "status": "unknown", "notes": "Obtain lease or allocation letter"},
      {"item": "Community contribution letter", "status": "unknown", "notes": "Document $15K commitment"},
      {"item": "Demand assessment", "status": "not_ready", "notes": "Conduct using GEAPP template"},
      {"item": "Technical design", "status": "not_ready", "notes": "Commission from engineer"},
      {"item": "Detailed budget", "status": "not_ready", "notes": "Obtain equipment quotes"},
      {"item": "Financial projection", "status": "not_ready", "notes": "Build 5-year model"},
      {"item": "Productive use MOU", "status": "unknown", "notes": "Document cassava facility commitment"}
    ],
    "missing_info_questionnaire": [
      "What is the cooperative's CAC registration number?",
      "What is the exact GPS location of the proposed site?",
      "What is the land tenure arrangement?",
      "How much of the $15,000 is cash vs. in-kind?",
      "What is current average household energy expenditure?",
      "What cassava processing equipment is needed?",
      "Has any technical study been done?",
      "What is the cooperative's current bank balance?"
    ]
  }
}
```

---

## Final Webhook Response (Node 6)

### Success Response:

```json
{
  "status": "success",
  "project_name": "Kaduna Community Solar Mini-Grid",
  "m300_alignment": {
    "score": 88,
    "narrative": "This solar_mini_grid project in Nigeria demonstrates strong alignment with M300 debt-sensitivity principles..."
  },
  "grant_matches": [
    {
      "funder_name": "GEAPP",
      "fit_score": 92,
      "instrument_type": "grant",
      "debt_tier": "tier_1"
    },
    {
      "funder_name": "Africa Mini-Grid Support Facility",
      "fit_score": 85,
      "instrument_type": "results_based_grant",
      "debt_tier": "tier_2"
    }
  ],
  "funding_strategy": "Lead with GEAPP application (92/100 fit, pure grant, fastest process).",
  "proposal_guidance": {
    "target_funder": "GEAPP",
    "readiness_summary": {
      "ready": 0,
      "not_ready": 4,
      "unknown": 4
    }
  },
  "timestamp": "2026-02-03T15:35:00Z"
}
```

### Error Response:

```json
{
  "status": "error",
  "error_code": "VALIDATION_FAILED",
  "message": "Missing required fields: technology_type, estimated_cost_usd",
  "timestamp": "2026-02-03T15:35:00Z"
}
```
