# Tools Specification for OpenAI Agent Builder

This document defines the three internal tools/functions the agent uses. In OpenAI Agent Builder, these are implemented as "Function Calling" capabilities.

---

## Tool 1: interpret_policy

### Description
Analyzes a project against M300 principles and produces alignment assessment.

### Function Definition

```json
{
  "name": "interpret_policy",
  "description": "Analyze a project concept against Mission 300 debt-sensitivity principles. Returns M300 alignment score, grant-suitable elements, debt exposure risks, and recommended framing.",
  "parameters": {
    "type": "object",
    "required": ["project_name", "country", "technology_type", "ownership_model", "estimated_cost_usd", "target_beneficiaries"],
    "properties": {
      "project_name": {
        "type": "string",
        "description": "Name of the project"
      },
      "country": {
        "type": "string",
        "description": "Country where project is located"
      },
      "location_description": {
        "type": "string",
        "description": "Detailed location information"
      },
      "technology_type": {
        "type": "string",
        "enum": ["solar_mini_grid", "solar_standalone", "solar_home_systems", "wind_mini_grid", "hydro_mini_grid", "hybrid_mini_grid", "grid_extension", "clean_cooking", "other"],
        "description": "Primary technology"
      },
      "capacity_kw": {
        "type": "number",
        "description": "Installed capacity in kW"
      },
      "ownership_model": {
        "type": "string",
        "enum": ["community_cooperative", "public_utility", "public_community_hybrid", "private_with_benefit_sharing", "private_ipp", "undecided"],
        "description": "Who will own the project"
      },
      "estimated_cost_usd": {
        "type": "number",
        "description": "Estimated total cost in USD"
      },
      "target_beneficiaries": {
        "type": "string",
        "description": "Who benefits from the project"
      },
      "productive_uses": {
        "type": "array",
        "items": {"type": "string"},
        "description": "Income-generating activities enabled"
      },
      "community_engagement": {
        "type": "string",
        "description": "Community involvement description"
      },
      "additional_context": {
        "type": "string",
        "description": "Any other relevant information"
      }
    }
  }
}
```

### Expected Output Schema

```json
{
  "project_name": "string",
  "m300_alignment_score": "integer (0-100)",
  "alignment_narrative": "string (2-3 paragraphs)",
  "ownership_classification": "string (enum)",
  "grant_suitable_elements": ["string"],
  "debt_exposure_risks": ["string"],
  "private_capital_risks": ["string"],
  "community_ownership_justification": "string",
  "assumptions_list": ["string"],
  "recommended_framing": "string",
  "debt_sensitivity_tier": "string (tier_1|tier_2|tier_3|tier_4)"
}
```

### Implementation Logic

The tool should:
1. Classify the ownership model
2. Assess M300 alignment based on:
   - Ownership structure (community = high score)
   - Debt implications (none = high score)
   - Last-mile focus (rural = high score)
   - Productive use (present = higher score)
3. Identify grant-suitable elements
4. Flag debt exposure risks
5. Generate alignment narrative

---

## Tool 2: match_grants

### Description
Searches the grants database and returns ranked matches with scoring rationale.

### Function Definition

```json
{
  "name": "match_grants",
  "description": "Search the grants database and score funders against the project. Returns top 5 matches with fit scores, rationale, red flags, and next actions.",
  "parameters": {
    "type": "object",
    "required": ["project_name", "country", "technology_type", "ownership_model", "estimated_cost_usd"],
    "properties": {
      "project_name": {
        "type": "string",
        "description": "Name of the project"
      },
      "country": {
        "type": "string",
        "description": "Project country"
      },
      "technology_type": {
        "type": "string",
        "description": "Primary technology"
      },
      "ownership_model": {
        "type": "string",
        "description": "Ownership classification"
      },
      "estimated_cost_usd": {
        "type": "number",
        "description": "Project cost"
      },
      "productive_uses": {
        "type": "array",
        "items": {"type": "string"},
        "description": "Productive use categories"
      },
      "policy_interpretation": {
        "type": "object",
        "description": "Output from interpret_policy tool"
      },
      "debt_preference": {
        "type": "string",
        "enum": ["grant_only", "grant_preferred", "open_to_blended"],
        "description": "Project's debt tolerance"
      }
    }
  }
}
```

### Expected Output Schema

```json
{
  "project_name": "string",
  "matches": [
    {
      "funder_name": "string",
      "instrument_type": "string",
      "fit_score": "integer (0-100)",
      "fit_rationale": ["string"],
      "red_flags": ["string"],
      "next_actions": ["string"],
      "debt_sensitivity_tier": "string"
    }
  ],
  "excluded_funders": [
    {
      "funder_name": "string",
      "exclusion_reason": "string"
    }
  ],
  "overall_funding_strategy": "string"
}
```

### Implementation Logic

The tool should:
1. Load grants_seed.json (12 funders)
2. For each funder, compute:
   - Geography score (country/region match)
   - Thematic score (technology/use case match)
   - Size score (cost vs. typical range)
   - Ownership score (ownership model compatibility)
   - Eligibility score (criteria match)
3. Apply red flag penalties
4. Apply debt sensitivity modifiers
5. Rank by final score
6. Return top 5 with exclusion reasons for others

---

## Tool 3: coach_proposal

### Description
Generates grant-ready proposal outline and readiness assessment.

### Function Definition

```json
{
  "name": "coach_proposal",
  "description": "Generate a proposal outline, readiness checklist, and missing information questionnaire for the target funder.",
  "parameters": {
    "type": "object",
    "required": ["project_name", "target_funder", "project_intake", "policy_interpretation", "grant_match"],
    "properties": {
      "project_name": {
        "type": "string",
        "description": "Name of the project"
      },
      "target_funder": {
        "type": "string",
        "description": "Primary funder to target (usually top match)"
      },
      "project_intake": {
        "type": "object",
        "description": "Original project intake data"
      },
      "policy_interpretation": {
        "type": "object",
        "description": "Output from interpret_policy"
      },
      "grant_match": {
        "type": "object",
        "description": "Output from match_grants"
      }
    }
  }
}
```

### Expected Output Schema

```json
{
  "project_name": "string",
  "target_funder": "string",
  "proposal_outline": {
    "problem_statement": "string",
    "theory_of_change": "string",
    "community_ownership_governance": "string",
    "technical_approach": "string",
    "affordability_tariff_principles": "string",
    "implementation_plan": "string",
    "mel_framework": "string",
    "risk_register": "string"
  },
  "readiness_checklist": [
    {
      "item": "string",
      "status": "ready|not_ready|unknown",
      "notes": "string"
    }
  ],
  "missing_info_questionnaire": ["string"]
}
```

### Implementation Logic

The tool should:
1. Select target funder (highest scoring match)
2. Generate proposal outline sections:
   - Problem statement based on location, beneficiaries, current situation
   - Theory of change with IF-THEN-LEADING TO logic
   - Ownership/governance based on ownership_model
   - Technical approach based on technology_type and capacity
   - Tariff principles (or N/A for non-commercial like health)
   - Implementation plan with phases and milestones
   - MEL framework with indicators
   - Risk register including debt-sensitivity section
3. Create readiness checklist based on funder requirements
4. Generate questions for missing information

---

## Tool Orchestration

The agent should call tools in sequence:

```
User Input
    ↓
[interpret_policy] → policy_interpretation
    ↓
[match_grants] → grant_match
    ↓
[coach_proposal] → proposal_coach
    ↓
Formatted Response to User
```

### Error Handling

If a tool returns an error or incomplete data:
1. Ask user for clarification
2. Retry with additional information
3. If still failing, provide partial results with clear indication of gaps

### Presentation

After running all three tools, present results in a clear format:

```
## M300 Alignment Analysis
[policy_interpretation summary]

## Grant Matches
[grant_match top 5 with details]

## Proposal Guidance
[proposal_coach outline and checklist]

## Next Steps
[consolidated action items from all tools]
```
