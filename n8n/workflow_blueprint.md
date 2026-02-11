# n8n Workflow Blueprint

## Overview

This document describes the n8n workflow for the M300 Co-Intelligent Support Desk. The workflow receives project intake via webhook, processes through three stages (interpret → match → coach), and returns results.

---

## Workflow Diagram

```
┌──────────────┐     ┌──────────────┐     ┌──────────────────┐
│   Webhook    │────▶│   Validate   │────▶│ Policy           │
│  (Trigger)   │     │   & Normalize│     │ Interpreter      │
└──────────────┘     └──────────────┘     └────────┬─────────┘
                                                    │
                                                    ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────────┐
│   Respond    │◀────│  Proposal    │◀────│ Grant            │
│  to Webhook  │     │  Coach       │     │ Matcher          │
└──────────────┘     └──────────────┘     └──────────────────┘
```

---

## Node Specifications

### Node 1: Webhook (Trigger)

**Type**: `n8n-nodes-base.webhook`

**Purpose**: Receives incoming project intake requests

**Configuration**:
- HTTP Method: POST
- Path: `/m300-support`
- Response Mode: Last Node
- Authentication: None (or add header auth for production)

**Input**: HTTP POST body with project_intake JSON

**Output**: `$json` containing the intake data

---

### Node 2: Validate & Normalize

**Type**: `n8n-nodes-base.function`

**Purpose**: Validates intake against schema and normalizes data

**Configuration**:
```javascript
// Validate required fields
const required = ['project_name', 'country', 'technology_type', 'ownership_model', 'estimated_cost_usd'];
const missing = required.filter(field => !$json[field]);

if (missing.length > 0) {
  throw new Error(`Missing required fields: ${missing.join(', ')}`);
}

// Normalize ownership model
const ownershipMap = {
  'cooperative': 'community_cooperative',
  'coop': 'community_cooperative',
  'community': 'community_cooperative',
  'public': 'public_utility',
  'government': 'public_utility',
  'hybrid': 'public_community_hybrid',
  'private': 'private_ipp'
};

const normalizedOwnership = ownershipMap[$json.ownership_model.toLowerCase()] || $json.ownership_model;

// Normalize technology type
const techMap = {
  'mini-grid': 'solar_mini_grid',
  'minigrid': 'solar_mini_grid',
  'solar minigrid': 'solar_mini_grid',
  'standalone': 'solar_standalone',
  'shs': 'solar_home_systems'
};

const normalizedTech = techMap[$json.technology_type.toLowerCase()] || $json.technology_type;

return [{
  json: {
    project_intake: {
      project_name: $json.project_name,
      country: $json.country,
      location_description: $json.location_description || '',
      technology_type: normalizedTech,
      capacity_kw: $json.capacity_kw || null,
      target_beneficiaries: $json.target_beneficiaries || '',
      ownership_model: normalizedOwnership,
      productive_uses: $json.productive_uses || [],
      estimated_cost_usd: Number($json.estimated_cost_usd),
      existing_funding: $json.existing_funding || '',
      project_stage: $json.project_stage || 'concept',
      community_engagement: $json.community_engagement || '',
      additional_context: $json.additional_context || '',
      debt_preference: $json.debt_preference || 'grant_preferred'
    },
    validation: {
      status: 'valid',
      timestamp: new Date().toISOString()
    }
  }
}];
```

**Input**: Raw webhook JSON

**Output**: Validated and normalized `project_intake` object

---

### Node 3: Policy Interpreter

**Type**: `n8n-nodes-base.function` (or `n8n-nodes-base.httpRequest` for LLM call)

**Purpose**: Analyzes project against M300 principles

**Option A: Local Logic (No LLM)**

```javascript
const intake = $json.project_intake;

// Score M300 alignment
let score = 50; // Base score

// Ownership scoring
const ownershipScores = {
  'community_cooperative': 30,
  'public_utility': 25,
  'public_community_hybrid': 28,
  'private_with_benefit_sharing': 10,
  'private_ipp': 0
};
score += ownershipScores[intake.ownership_model] || 0;

// Productive use bonus
if (intake.productive_uses && intake.productive_uses.length > 0) {
  score += 10;
}

// Debt preference bonus
if (intake.debt_preference === 'grant_only') {
  score += 10;
}

// Cap at 100
score = Math.min(score, 100);

// Generate grant-suitable elements
const grantSuitable = [];
if (intake.ownership_model === 'community_cooperative') {
  grantSuitable.push('Community cooperative ownership eliminates profit extraction');
}
if (intake.productive_uses && intake.productive_uses.length > 0) {
  grantSuitable.push(`Productive use component: ${intake.productive_uses.join(', ')}`);
}
grantSuitable.push('Last-mile rural electrification focus');

// Generate debt risks
const debtRisks = [];
if (intake.ownership_model === 'private_ipp') {
  debtRisks.push('Private IPP model may require sovereign guarantees');
} else if (intake.ownership_model.includes('community') || intake.ownership_model.includes('public')) {
  debtRisks.push('None identified under current structure');
}

return [{
  json: {
    project_intake: intake,
    policy_interpretation: {
      project_name: intake.project_name,
      m300_alignment_score: score,
      alignment_narrative: `This ${intake.technology_type} project in ${intake.country} demonstrates ${score >= 70 ? 'strong' : 'moderate'} alignment with M300 debt-sensitivity principles. The ${intake.ownership_model} ownership model ${score >= 70 ? 'supports grant eligibility' : 'may face challenges with grant funders'}.`,
      ownership_classification: intake.ownership_model,
      grant_suitable_elements: grantSuitable,
      debt_exposure_risks: debtRisks,
      assumptions_list: [
        'Project entity is legally registered',
        'Land/site tenure is secured',
        'Community engagement is documented'
      ],
      recommended_framing: `Position as ${intake.ownership_model === 'community_cooperative' ? 'community-led' : 'locally-owned'} energy access project aligned with M300 goals.`
    }
  }
}];
```

**Option B: LLM Call (Stub)**

```javascript
// TODO: Replace with actual LLM API call
// Use HTTP Request node to call OpenAI/Anthropic API
// Pass intake data and prompt from agent_instructions.md
// Parse response into policy_interpretation schema

return [{
  json: {
    project_intake: $json.project_intake,
    policy_interpretation: {
      // LLM-generated content would go here
      project_name: $json.project_intake.project_name,
      m300_alignment_score: 0, // LLM determines
      alignment_narrative: "LLM_PLACEHOLDER",
      // ... rest of schema
    }
  }
}];
```

**Input**: Validated `project_intake`

**Output**: `project_intake` + `policy_interpretation`

---

### Node 4: Grant Matcher

**Type**: `n8n-nodes-base.function` (calls scoring logic)

**Purpose**: Scores grants database and returns matches

**Configuration**:
```javascript
const intake = $json.project_intake;
const interpretation = $json.policy_interpretation;

// Embedded grants database (subset for n8n)
// In production, load from HTTP Request or database node
const grants = [
  {
    id: 'geapp_minigrid',
    funder_name: 'GEAPP',
    instrument_type: 'grant',
    priority_countries: ['Nigeria', 'Kenya', 'Ethiopia', 'DRC'],
    regions: ['Sub-Saharan Africa'],
    thematic_focus: ['mini_grids', 'productive_use'],
    min_usd: 150000,
    max_usd: 500000,
    debt_tier: 'tier_1'
  },
  {
    id: 'amsf_rbf',
    funder_name: 'Africa Mini-Grid Support Facility',
    instrument_type: 'results_based_grant',
    priority_countries: [],
    regions: ['West Africa', 'East Africa', 'Southern Africa'],
    thematic_focus: ['mini_grids'],
    min_usd: 100000,
    max_usd: 1000000,
    debt_tier: 'tier_2'
  },
  {
    id: 'gcf_sap',
    funder_name: 'Green Climate Fund SAP',
    instrument_type: 'grant',
    priority_countries: [],
    regions: ['Africa', 'Asia', 'Latin America'],
    thematic_focus: ['climate_mitigation', 'renewable_energy'],
    min_usd: 250000,
    max_usd: 10000000,
    debt_tier: 'tier_1'
  },
  {
    id: 'usadf',
    funder_name: 'US African Development Foundation',
    instrument_type: 'grant',
    priority_countries: [],
    regions: ['Sub-Saharan Africa'],
    thematic_focus: ['community_enterprise', 'productive_use'],
    min_usd: 50000,
    max_usd: 250000,
    debt_tier: 'tier_1'
  }
];

// Scoring function
function scoreGrant(grant, intake) {
  let score = 0;

  // Geography (25%)
  let geoScore = 0;
  if (grant.priority_countries.includes(intake.country)) {
    geoScore = 100;
  } else if (grant.regions.some(r => r.includes('Africa'))) {
    geoScore = 60;
  }
  score += geoScore * 0.25;

  // Thematic (30%)
  let thematicScore = 0;
  if (grant.thematic_focus.includes('mini_grids') &&
      intake.technology_type.includes('mini_grid')) {
    thematicScore = 100;
  } else if (grant.thematic_focus.includes('productive_use') &&
             intake.productive_uses.length > 0) {
    thematicScore = 80;
  } else {
    thematicScore = 40;
  }
  score += thematicScore * 0.30;

  // Size (15%)
  let sizeScore = 0;
  if (intake.estimated_cost_usd >= grant.min_usd &&
      intake.estimated_cost_usd <= grant.max_usd) {
    sizeScore = 100;
  } else {
    sizeScore = 40;
  }
  score += sizeScore * 0.15;

  // Ownership (20%)
  let ownershipScore = 0;
  if (intake.ownership_model === 'community_cooperative') {
    ownershipScore = 100;
  } else if (intake.ownership_model.includes('public')) {
    ownershipScore = 80;
  } else {
    ownershipScore = 40;
  }
  score += ownershipScore * 0.20;

  // Eligibility (10%)
  score += 70 * 0.10; // Assume partial eligibility

  return Math.round(score);
}

// Score all grants
const scored = grants.map(grant => ({
  funder_name: grant.funder_name,
  funder_id: grant.id,
  instrument_type: grant.instrument_type,
  fit_score: scoreGrant(grant, intake),
  debt_sensitivity_tier: grant.debt_tier,
  fit_rationale: [
    `Technology match: ${intake.technology_type}`,
    `Country: ${intake.country}`,
    `Cost within range: $${intake.estimated_cost_usd}`
  ],
  red_flags: [],
  next_actions: [
    'Prepare project documentation',
    'Complete demand assessment',
    'Develop financial projections'
  ]
}));

// Sort by score and take top 5
const matches = scored
  .sort((a, b) => b.fit_score - a.fit_score)
  .slice(0, 5);

return [{
  json: {
    project_intake: intake,
    policy_interpretation: interpretation,
    grant_match: {
      project_name: intake.project_name,
      matches: matches,
      excluded_funders: [],
      overall_funding_strategy: `Lead with ${matches[0].funder_name} application based on highest fit score of ${matches[0].fit_score}/100.`
    }
  }
}];
```

**Input**: `project_intake` + `policy_interpretation`

**Output**: All previous + `grant_match`

---

### Node 5: Proposal Coach

**Type**: `n8n-nodes-base.function` (or LLM call)

**Purpose**: Generates proposal outline and readiness checklist

**Configuration**:
```javascript
const intake = $json.project_intake;
const interpretation = $json.policy_interpretation;
const matches = $json.grant_match;

const targetFunder = matches.matches[0].funder_name;

// Generate proposal outline
const proposalOutline = {
  problem_statement: `Approximately [X] households in ${intake.location_description || intake.country} lack access to reliable electricity. This energy poverty constrains economic development and quality of life.`,

  theory_of_change: `IF ${intake.project_name} is implemented with ${intake.ownership_model} ownership, THEN ${intake.target_beneficiaries} will gain electricity access, LEADING TO improved livelihoods and economic opportunities.`,

  community_ownership_governance: `The project will be owned by a ${intake.ownership_model} structure. Governance includes community participation in decision-making, transparent tariff-setting, and local employment for operations.`,

  technical_approach: `${intake.capacity_kw || 'Appropriately sized'} kW ${intake.technology_type} system serving ${intake.target_beneficiaries}. Designed for reliability and local maintainability.`,

  affordability_tariff_principles: intake.technology_type.includes('health') ?
    'N/A - Public health infrastructure funded by grant.' :
    'Tariff structure designed around community ability-to-pay with lifeline rates for basic consumption.',

  implementation_plan: 'Phased implementation: Month 1-2 Design & Procurement | Month 3-4 Installation | Month 5-6 Commissioning & Training | Month 7-12 Optimization',

  mel_framework: 'Key indicators: Connections delivered, system uptime, beneficiary satisfaction, income changes. Quarterly monitoring with annual evaluation.',

  risk_register: `Technical risks mitigated by quality procurement. Financial risks mitigated by pre-paid metering. DEBT SENSITIVITY: ${interpretation.debt_exposure_risks.join('; ')}`
};

// Generate readiness checklist
const readinessChecklist = [
  { item: 'Legal entity registration', status: 'unknown', notes: 'Verify registration certificate' },
  { item: 'Land/site documentation', status: 'unknown', notes: 'Obtain tenure documentation' },
  { item: 'Demand assessment', status: 'not_ready', notes: 'Conduct household survey' },
  { item: 'Technical design', status: 'not_ready', notes: 'Commission preliminary design' },
  { item: 'Financial projections', status: 'not_ready', notes: 'Develop 5-year model' },
  { item: 'Community contribution', status: 'unknown', notes: 'Document cash/in-kind commitment' }
];

// Generate missing info questions
const missingInfo = [
  `What is the exact location (GPS coordinates) of the project site?`,
  `What is the registration number of the ${intake.ownership_model}?`,
  `What is the current energy expenditure of target households?`,
  `What community contribution (cash or in-kind) is committed?`,
  `Has any technical feasibility study been conducted?`
];

return [{
  json: {
    project_intake: intake,
    policy_interpretation: interpretation,
    grant_match: matches,
    proposal_coach: {
      project_name: intake.project_name,
      target_funder: targetFunder,
      proposal_outline: proposalOutline,
      readiness_checklist: readinessChecklist,
      missing_info_questionnaire: missingInfo
    }
  }
}];
```

**Input**: All previous outputs

**Output**: Complete result with `proposal_coach`

---

### Node 6: Respond to Webhook

**Type**: `n8n-nodes-base.respondToWebhook`

**Purpose**: Returns final JSON response

**Configuration**:
- Response Code: 200
- Response Body: Expression referencing final JSON

**Response Template**:
```javascript
return {
  status: 'success',
  project_name: $json.project_intake.project_name,
  m300_alignment: {
    score: $json.policy_interpretation.m300_alignment_score,
    narrative: $json.policy_interpretation.alignment_narrative
  },
  grant_matches: $json.grant_match.matches,
  funding_strategy: $json.grant_match.overall_funding_strategy,
  proposal_guidance: {
    target_funder: $json.proposal_coach.target_funder,
    outline: $json.proposal_coach.proposal_outline,
    readiness: $json.proposal_coach.readiness_checklist,
    questions: $json.proposal_coach.missing_info_questionnaire
  },
  timestamp: new Date().toISOString()
};
```

---

## Error Handling

Add error handling nodes:

1. **Validation Error**: If Node 2 fails, return 400 with missing field list
2. **Processing Error**: If any function node fails, return 500 with error message

---

## Production Enhancements

For production deployment:

1. **Add authentication**: Header-based API key or OAuth
2. **Add rate limiting**: Use n8n's built-in rate limiting
3. **Add logging**: Log requests to database for analytics
4. **Load data externally**: Fetch grants_seed.json from storage instead of embedding
5. **Integrate LLM**: Replace function stubs with actual LLM calls for richer output
