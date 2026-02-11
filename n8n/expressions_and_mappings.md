# n8n Expressions and Mappings

This document provides the exact expressions needed to map data between nodes in the n8n workflow.

---

## Node Data Flow

```
Node 1 (Webhook)
    │
    └─▶ $json.* (raw input fields)
        │
Node 2 (Validate & Normalize)
    │
    └─▶ $json.project_intake.*
    └─▶ $json.validation.*
        │
Node 3 (Policy Interpreter)
    │
    └─▶ $json.project_intake.*
    └─▶ $json.policy_interpretation.*
        │
Node 4 (Grant Matcher)
    │
    └─▶ $json.project_intake.*
    └─▶ $json.policy_interpretation.*
    └─▶ $json.grant_match.*
        │
Node 5 (Proposal Coach)
    │
    └─▶ $json.project_intake.*
    └─▶ $json.policy_interpretation.*
    └─▶ $json.grant_match.*
    └─▶ $json.proposal_coach.*
        │
Node 6 (Respond to Webhook)
```

---

## Accessing Webhook Input (Node 1 → Node 2)

In the Validate & Normalize function node:

```javascript
// Access raw webhook input fields
const projectName = $json.project_name;
const country = $json.country;
const techType = $json.technology_type;
const ownershipModel = $json.ownership_model;
const costUsd = $json.estimated_cost_usd;

// Access optional fields with defaults
const locationDesc = $json.location_description || '';
const capacityKw = $json.capacity_kw || null;
const productiveUses = $json.productive_uses || [];
```

---

## Accessing Normalized Intake (Node 2 → Node 3)

In the Policy Interpreter function node:

```javascript
// Access normalized intake
const intake = $json.project_intake;

// Individual fields
const projectName = $json.project_intake.project_name;
const country = $json.project_intake.country;
const techType = $json.project_intake.technology_type;
const ownershipModel = $json.project_intake.ownership_model;
const costUsd = $json.project_intake.estimated_cost_usd;
const productiveUses = $json.project_intake.productive_uses;

// Validation metadata
const validationStatus = $json.validation.status;
const validationTime = $json.validation.timestamp;
```

---

## Accessing Policy Interpretation (Node 3 → Node 4)

In the Grant Matcher function node:

```javascript
// Access intake (passed through)
const intake = $json.project_intake;

// Access policy interpretation
const interpretation = $json.policy_interpretation;

// Specific policy fields
const alignmentScore = $json.policy_interpretation.m300_alignment_score;
const ownershipClass = $json.policy_interpretation.ownership_classification;
const grantElements = $json.policy_interpretation.grant_suitable_elements;
const debtRisks = $json.policy_interpretation.debt_exposure_risks;
const debtTier = $json.policy_interpretation.debt_sensitivity_tier;
```

---

## Accessing Grant Matches (Node 4 → Node 5)

In the Proposal Coach function node:

```javascript
// Access all previous data
const intake = $json.project_intake;
const interpretation = $json.policy_interpretation;
const grantMatch = $json.grant_match;

// Access specific grant match fields
const matches = $json.grant_match.matches;
const topMatch = $json.grant_match.matches[0];
const topFunderName = $json.grant_match.matches[0].funder_name;
const topFitScore = $json.grant_match.matches[0].fit_score;
const excludedFunders = $json.grant_match.excluded_funders;
const fundingStrategy = $json.grant_match.overall_funding_strategy;

// Iterate over matches
$json.grant_match.matches.forEach(match => {
  console.log(match.funder_name, match.fit_score);
});
```

---

## Accessing All Data for Response (Node 5 → Node 6)

In the Respond to Webhook node or final function:

```javascript
// Complete data access
const intake = $json.project_intake;
const interpretation = $json.policy_interpretation;
const grantMatch = $json.grant_match;
const proposalCoach = $json.proposal_coach;

// Build response object
const response = {
  status: 'success',
  project_name: $json.project_intake.project_name,

  m300_alignment: {
    score: $json.policy_interpretation.m300_alignment_score,
    narrative: $json.policy_interpretation.alignment_narrative,
    tier: $json.policy_interpretation.debt_sensitivity_tier
  },

  grant_matches: $json.grant_match.matches.map(m => ({
    funder: m.funder_name,
    score: m.fit_score,
    type: m.instrument_type,
    tier: m.debt_sensitivity_tier
  })),

  top_match: {
    funder: $json.grant_match.matches[0].funder_name,
    score: $json.grant_match.matches[0].fit_score,
    next_actions: $json.grant_match.matches[0].next_actions
  },

  funding_strategy: $json.grant_match.overall_funding_strategy,

  proposal_guidance: {
    target_funder: $json.proposal_coach.target_funder,
    outline_sections: Object.keys($json.proposal_coach.proposal_outline),
    readiness_items: $json.proposal_coach.readiness_checklist.length,
    questions: $json.proposal_coach.missing_info_questionnaire.length
  },

  timestamp: new Date().toISOString()
};

return response;
```

---

## Common Expression Patterns

### Conditional Access (with fallback)

```javascript
// If field might not exist
const capacity = $json.project_intake.capacity_kw ?? 0;
const uses = $json.project_intake.productive_uses ?? [];

// Using || for falsy check
const context = $json.project_intake.additional_context || 'No additional context provided';
```

### Array Operations

```javascript
// Get count
const matchCount = $json.grant_match.matches.length;

// Filter by condition
const grantOnlyMatches = $json.grant_match.matches.filter(
  m => m.instrument_type === 'grant'
);

// Find specific match
const geappMatch = $json.grant_match.matches.find(
  m => m.funder_name.includes('GEAPP')
);

// Check if any match has red flags
const hasRedFlags = $json.grant_match.matches.some(
  m => m.red_flags.length > 0
);

// Get all next actions
const allActions = $json.grant_match.matches.flatMap(
  m => m.next_actions
);
```

### Object Mapping

```javascript
// Transform matches for output
const simplifiedMatches = $json.grant_match.matches.map(m => ({
  name: m.funder_name,
  score: m.fit_score
}));

// Create lookup object
const matchByFunder = Object.fromEntries(
  $json.grant_match.matches.map(m => [m.funder_name, m])
);
```

### String Operations

```javascript
// Check country
const isNigeria = $json.project_intake.country.toLowerCase() === 'nigeria';

// Format for display
const projectTitle = `${$json.project_intake.project_name} (${$json.project_intake.country})`;

// Join array elements
const grantElementsList = $json.policy_interpretation.grant_suitable_elements.join('; ');
```

---

## Error Handling Expressions

### Check for Missing Data

```javascript
// Validate required fields exist
if (!$json.project_intake) {
  throw new Error('Missing project_intake from previous node');
}

if (!$json.policy_interpretation?.m300_alignment_score) {
  throw new Error('Policy interpretation incomplete');
}

if (!$json.grant_match?.matches?.length) {
  throw new Error('No grant matches found');
}
```

### Safe Access Pattern

```javascript
// Optional chaining
const score = $json.policy_interpretation?.m300_alignment_score ?? 0;
const topFunder = $json.grant_match?.matches?.[0]?.funder_name ?? 'Unknown';

// Try-catch for complex operations
let formattedOutput;
try {
  formattedOutput = formatResponse($json);
} catch (error) {
  formattedOutput = { error: error.message };
}
```

---

## Set Node Expressions (Alternative to Function)

If using Set nodes instead of Function nodes for simple transformations:

### Set Node: Extract Key Fields

| Name | Value |
|------|-------|
| project_name | `{{ $json.project_intake.project_name }}` |
| country | `{{ $json.project_intake.country }}` |
| alignment_score | `{{ $json.policy_interpretation.m300_alignment_score }}` |
| top_funder | `{{ $json.grant_match.matches[0].funder_name }}` |
| top_score | `{{ $json.grant_match.matches[0].fit_score }}` |

### Set Node: Computed Fields

| Name | Value |
|------|-------|
| is_grant_ready | `{{ $json.policy_interpretation.m300_alignment_score > 70 }}` |
| match_count | `{{ $json.grant_match.matches.length }}` |
| has_tier1_option | `{{ $json.grant_match.matches.some(m => m.debt_sensitivity_tier === 'tier_1') }}` |

---

## HTTP Request Node (For LLM Integration)

If replacing function nodes with LLM calls:

### Request Body Expression

```javascript
// For OpenAI API
{
  "model": "gpt-4",
  "messages": [
    {
      "role": "system",
      "content": "You are the M300 Policy Interpreter agent..."
    },
    {
      "role": "user",
      "content": `Analyze this project:\n${JSON.stringify($json.project_intake, null, 2)}`
    }
  ]
}
```

### Parse LLM Response

```javascript
// Extract from OpenAI response
const llmContent = $json.choices[0].message.content;
const parsed = JSON.parse(llmContent);
return [{ json: { ...previousData, policy_interpretation: parsed } }];
```
