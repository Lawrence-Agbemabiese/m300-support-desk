# Multi-Agent Architecture

## Overview

The Co-Intelligent Support Desk uses three specialized agents in sequence. Each agent has defined inputs, outputs, and responsibilities. This separation enables:

1. **Modularity**: Each agent can be tested and improved independently
2. **Transparency**: Users can inspect intermediate outputs
3. **Flexibility**: Agents can be deployed as tools in Agent Builder or nodes in n8n

## Agent 1: Policy Interpreter

### Purpose

Translate a raw project concept into M300-aligned language, explicitly identifying grant-suitable elements and debt exposure risks.

### Inputs

```json
{
  "project_intake": {
    "project_name": "string",
    "country": "string",
    "location_description": "string",
    "technology_type": "string",
    "capacity_kw": "number",
    "target_beneficiaries": "string",
    "ownership_model": "string",
    "productive_uses": "string[]",
    "estimated_cost_usd": "number",
    "existing_funding": "string",
    "project_stage": "string",
    "community_engagement": "string",
    "additional_context": "string"
  }
}
```

### Processing Logic

1. **Extract Project Intent**: What is the project trying to achieve? Who benefits?

2. **Classify Ownership Model**:
   - Community cooperative (strongest for grants)
   - Public utility / municipal
   - Public-community hybrid
   - Private with community benefit-sharing
   - Pure private IPP (weakest for grants)

3. **Assess Financing Sensitivity**:
   - Does the project require sovereign guarantees?
   - Are there foreign currency obligations?
   - What is the implied tariff structure?
   - Could this add to national/municipal debt?

4. **Tag M300 Alignment Elements**:
   - `grant_suitable_elements`: Features that make this attractive for grant funding
   - `debt_exposure_risks`: Any aspects that could create debt obligations
   - `private_capital_risks`: Risks if private investment is involved
   - `community_ownership_justification`: Why public/community ownership makes sense

5. **Generate Outputs**:
   - M300 alignment narrative (2-3 paragraphs)
   - Assumptions list (things that need verification)

### Outputs

```json
{
  "policy_interpretation": {
    "project_name": "string",
    "m300_alignment_score": "number (0-100)",
    "alignment_narrative": "string",
    "ownership_classification": "string",
    "grant_suitable_elements": ["string"],
    "debt_exposure_risks": ["string"],
    "private_capital_risks": ["string"],
    "community_ownership_justification": "string",
    "assumptions_list": ["string"],
    "recommended_framing": "string"
  }
}
```

### Example Output

```json
{
  "policy_interpretation": {
    "project_name": "Kaduna Solar Mini-Grid",
    "m300_alignment_score": 85,
    "alignment_narrative": "This project strongly aligns with M300's electrification goals while embodying the grant-suitable, community-ownership model recommended to avoid debt exacerbation. The cooperative ownership structure ensures revenues remain in the community rather than flowing to external investors. The productive use component (cassava processing) directly supports local livelihoods and economic resilience.",
    "ownership_classification": "community_cooperative",
    "grant_suitable_elements": [
      "100% community cooperative ownership",
      "Productive use anchor load (cassava processing)",
      "Last-mile rural population (200 households)",
      "No sovereign debt implications",
      "Local job creation through O&M"
    ],
    "debt_exposure_risks": [
      "None identified - pure grant/equity model proposed"
    ],
    "private_capital_risks": [
      "If private developer is later introduced, ensure community retains majority ownership",
      "Avoid performance guarantees that create contingent government liabilities"
    ],
    "community_ownership_justification": "Cooperative ownership keeps tariff revenues within Kaduna State, builds local technical capacity, and prevents the capital flight that occurs when foreign investors extract profits. This aligns with Power Shift Africa's recommendation for public/community ownership of energy infrastructure.",
    "assumptions_list": [
      "Cooperative is legally registered and has governance structure",
      "Land tenure for mini-grid site is secured",
      "Community ability-to-pay assessment has been conducted",
      "Cassava processing facility demand is confirmed"
    ],
    "recommended_framing": "Position as a community-led productive use mini-grid that advances M300 goals without adding to Nigeria's debt burden. Emphasize the cooperative's role as owner-operator and the direct link between electrification and agricultural value addition."
  }
}
```

---

## Agent 2: Grant Matcher

### Purpose

Score all grant sources in the local database against the project, returning ranked matches with rationale and next steps.

### Inputs

1. `project_intake` (original user input)
2. `policy_interpretation` (from Agent 1)
3. `grants_seed.json` (local database)
4. `scoring_weights.json` (weighting configuration)

### Processing Logic

1. **Load Grants Database**: Read all 12 entries from `grants_seed.json`

2. **For Each Grant Source**:
   a. Check geography eligibility (country/region match)
   b. Check thematic alignment (technology, use case)
   c. Check ticket size fit (project cost vs. typical range)
   d. Check ownership model compatibility
   e. Check eligibility criteria match
   f. Check for disqualifying patterns

3. **Compute Weighted Score**:
   ```
   fit_score = (
     geography_match * weights.geography +
     thematic_match * weights.thematic +
     size_match * weights.size +
     ownership_match * weights.ownership +
     eligibility_match * weights.eligibility
   ) * (1 - red_flag_penalty)
   ```

4. **Generate Rationale**: Bullet points explaining the score

5. **Identify Red Flags**: Eligibility doubts, debt risks, governance gaps

6. **Specify Next Actions**: Exact documents/data to prepare for this funder

### Outputs

```json
{
  "grant_match": {
    "project_name": "string",
    "matches": [
      {
        "funder_name": "string",
        "instrument_type": "string",
        "fit_score": "number (0-100)",
        "fit_rationale": ["string"],
        "red_flags": ["string"],
        "next_actions": ["string"]
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
}
```

### Example Output (Top 2 of 5)

```json
{
  "grant_match": {
    "project_name": "Kaduna Solar Mini-Grid",
    "matches": [
      {
        "funder_name": "GEAPP Mini-Grid Fund",
        "instrument_type": "grant",
        "fit_score": 92,
        "fit_rationale": [
          "Strong geography match: Nigeria is priority country",
          "Perfect thematic fit: mini-grids with productive use",
          "Ticket size ($150K-$500K) matches project scale",
          "Explicitly supports community ownership models",
          "No debt instrument involvement"
        ],
        "red_flags": [],
        "next_actions": [
          "Obtain cooperative registration certificate",
          "Complete demand assessment survey (GEAPP template)",
          "Document productive use anchor load (cassava facility MOU)",
          "Prepare preliminary technical design with equipment specs"
        ]
      },
      {
        "funder_name": "Africa Mini-Grid Support Facility",
        "instrument_type": "results_based_grant",
        "fit_score": 87,
        "fit_rationale": [
          "Geography match: West Africa eligible",
          "Supports solar mini-grids specifically",
          "Results-based structure rewards connections delivered",
          "Aligns with community ownership preference"
        ],
        "red_flags": [
          "Results-based payment requires upfront capital - verify cooperative can bridge"
        ],
        "next_actions": [
          "Identify bridge financing source for construction phase",
          "Develop connection milestone schedule",
          "Prepare tariff structure documentation"
        ]
      }
    ],
    "excluded_funders": [
      {
        "funder_name": "IFC InfraVentures",
        "exclusion_reason": "Equity/loan instrument - conflicts with grant-only preference"
      }
    ],
    "overall_funding_strategy": "Lead with GEAPP application (pure grant, best fit). Use Africa Mini-Grid Support Facility as secondary if bridge financing can be secured. Consider GCF Simplified Approval Process for additional grant component to cover soft costs."
  }
}
```

---

## Agent 3: Proposal Coach

### Purpose

Generate a grant-ready proposal outline, readiness checklist, and missing information questionnaire based on all previous analysis.

### Inputs

1. `project_intake` (original user input)
2. `policy_interpretation` (from Agent 1)
3. `grant_match` (from Agent 2)

### Processing Logic

1. **Select Target Funder**: Use highest-scoring match as primary framing

2. **Generate Proposal Outline** with these sections:
   - Problem Statement
   - Theory of Change
   - Community Ownership & Governance
   - Technical Approach
   - Affordability & Tariff Principles
   - Implementation Plan
   - Monitoring, Evaluation & Learning (MEL)
   - Risk Register (including debt-sensitivity)

3. **Create Readiness Checklist**: Yes/no items for proposal submission

4. **Generate Missing Info Questionnaire**: Questions to ask the project proponent

### Outputs

```json
{
  "proposal_coach": {
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
        "status": "ready | not_ready | unknown",
        "notes": "string"
      }
    ],
    "missing_info_questionnaire": ["string"]
  }
}
```

### Example Output (Abbreviated)

```json
{
  "proposal_coach": {
    "project_name": "Kaduna Solar Mini-Grid",
    "target_funder": "GEAPP Mini-Grid Fund",
    "proposal_outline": {
      "problem_statement": "Approximately 200 households in [Location], Kaduna State lack access to reliable electricity. The nearest grid connection is [X] km away with no planned extension. Without electricity, the local cassava cooperative cannot process crops, forcing farmers to sell raw cassava at 40% lower prices. Women and children bear disproportionate burden of energy poverty through time spent on manual tasks and exposure to indoor air pollution from kerosene lighting.",
      "theory_of_change": "IF the community cooperative installs and operates a 50kW solar mini-grid with productive use prioritization, THEN 200 households will gain Tier 2+ electricity access AND the cassava processing facility will operate at full capacity, LEADING TO increased household incomes (est. 30% from crop value addition), improved study conditions for children, reduced kerosene expenditure, and demonstrated model for community-owned electrification replicable across Kaduna State.",
      "community_ownership_governance": "The [Cooperative Name] will own 100% of the mini-grid assets. Governance structure includes: (1) General Assembly of all member households meeting quarterly, (2) Elected Management Committee of 7 members with 2-year terms and minimum 40% women representation, (3) Trained local operators employed by the cooperative, (4) Transparent tariff-setting process with community input, (5) Revenue reinvestment policy requiring 20% of surplus for maintenance reserve and 30% for community development fund.",
      "technical_approach": "50kWp solar PV array with 100kWh lithium battery storage, serving 200 household connections (average 150W peak) plus 15kW dedicated productive use load for cassava processing equipment. Pre-paid smart metering for all connections. System designed for 25-year life with battery replacement at year 10. Local technicians trained for Tier 1-2 maintenance; regional service agreement for major repairs.",
      "affordability_tariff_principles": "Tariff structure designed around ability-to-pay: (1) Lifeline rate of $0.15/kWh for first 30kWh/month (basic lighting and phone charging), (2) Standard rate of $0.25/kWh for consumption above lifeline, (3) Productive use rate of $0.20/kWh for daytime processing loads. Cross-subsidy from productive use helps keep household rates affordable. Tariff review every 2 years with community consultation.",
      "implementation_plan": "Month 1-2: Detailed design and procurement | Month 3-4: Site preparation and civil works | Month 5-6: Equipment installation and commissioning | Month 7: Operator training and customer connections | Month 8-12: Performance monitoring and optimization. Key milestones: (1) Design approval, (2) Equipment arrival, (3) First power, (4) 100th connection, (5) Cassava facility operational.",
      "mel_framework": "Output indicators: Connections completed, kWh generated, system uptime. Outcome indicators: Household electricity expenditure (pre/post), cassava processing volume, reported income changes, hours of productive light per household. Data collection: Smart meter analytics, quarterly household surveys (10% sample), annual cooperative financial audit. Learning: Quarterly reflection meetings, annual case study publication.",
      "risk_register": "1. TECHNICAL: Equipment failure - Mitigated by quality procurement, spare parts inventory, service agreement. 2. FINANCIAL: Tariff non-payment - Mitigated by prepaid metering, community ownership incentivizing payment culture. 3. GOVERNANCE: Committee capture - Mitigated by term limits, transparency requirements, external audit. 4. EXTERNAL: Policy change affecting mini-grids - Mitigated by strong community ownership providing political protection. 5. DEBT SENSITIVITY: None - 100% grant funded with no loan component, no sovereign guarantees required, no foreign currency obligations."
    },
    "readiness_checklist": [
      {"item": "Cooperative legally registered", "status": "unknown", "notes": "Verify registration number and certificate"},
      {"item": "Land tenure documentation", "status": "unknown", "notes": "Need lease or allocation letter"},
      {"item": "Community contribution confirmed", "status": "unknown", "notes": "Document in-kind or cash contribution"},
      {"item": "Demand assessment completed", "status": "unknown", "notes": "Household survey + productive use verification"},
      {"item": "Technical design available", "status": "not_ready", "notes": "Need preliminary design from qualified engineer"},
      {"item": "Budget prepared", "status": "not_ready", "notes": "Detailed budget with quotes"},
      {"item": "Implementation timeline", "status": "ready", "notes": "Outlined above"},
      {"item": "M&E framework", "status": "ready", "notes": "Outlined above"}
    ],
    "missing_info_questionnaire": [
      "What is the cooperative's registration number and date of registration?",
      "How many kilometers from the nearest grid connection point?",
      "What is the current average monthly household expenditure on energy (kerosene, candles, phone charging, diesel)?",
      "What is the land tenure arrangement for the mini-grid site?",
      "How much can the community contribute (cash or in-kind)?",
      "What is the current cassava processing volume and target volume with electricity?",
      "Has any technical feasibility study been conducted?",
      "What is the cooperative's current bank balance and annual revenue?",
      "Are there any existing debts or liabilities held by the cooperative?",
      "What gender balance exists in current cooperative leadership?"
    ]
  }
}
```

---

## Agent Orchestration

### Sequential Flow

```
User Input
    │
    ▼
┌─────────────────────┐
│  Policy Interpreter │
│  (Agent 1)          │
└─────────┬───────────┘
          │ policy_interpretation
          ▼
┌─────────────────────┐
│  Grant Matcher      │
│  (Agent 2)          │
└─────────┬───────────┘
          │ grant_match
          ▼
┌─────────────────────┐
│  Proposal Coach     │
│  (Agent 3)          │
└─────────┬───────────┘
          │ proposal_coach
          ▼
     Final Output
```

### Data Flow

Each agent receives:
1. Original `project_intake` (for reference)
2. Outputs from all preceding agents
3. Relevant static data files (grants database, scoring weights)

This ensures:
- No information loss between stages
- Each agent can cross-reference earlier analysis
- Final output is coherent and internally consistent
