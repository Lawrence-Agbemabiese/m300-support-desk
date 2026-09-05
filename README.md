# M300 Co-Intelligent Support Desk

A multi-agent system to help African countries prepare **community-owned energy projects** for **grant funding** aligned with Mission 300 (M300), with explicit debt-sensitivity and public ownership emphasis.

## Why This Exists

Mission 300 aims to connect 300 million Africans to electricity by 2030, mobilizing ~$90 billion. However, the current financing model relies heavily on:
- **Concessional loans** (via IDA) that still add to sovereign debt
- **Private capital de-risking** (via MIGA guarantees) that can lead to capital flight

This Support Desk takes a different approach: **prioritizing grant alignment and community ownership** to avoid exacerbating Africa's debt crisis. It explicitly distinguishes debt instruments from non-debt instruments and helps projects articulate public/community ownership narratives that funders increasingly require.

## Core Principles (from M300 Analysis)

1. **Grants over loans**: Prioritize grant-based finance while allowing documented comparison of other instruments
2. **Debt sensitivity**: Weight repayment, currency, guarantee, and contingent-liability exposure; do not treat debt as an automatic exclusion
3. **Public/community ownership**: Keep infrastructure locally owned to prevent capital flight
4. **Fiscal capacity protection**: Avoid arrangements that reduce fiscal space for health, education, other priorities

## Multi-Agent Architecture

The web application combines four specialized analysis stages:

| Agent | Role | Input | Output |
|-------|------|-------|--------|
| **Policy Interpreter** | Translates project concepts into M300-aligned language | `project_intake` | `policy_interpretation` |
| **Grant Matcher** | Scores and ranks grant sources from local database | `project_intake` + `policy_interpretation` | `grant_match` |
| **Proposal Coach** | Generates grant-ready outline and readiness checklist | All previous outputs | `proposal_coach` |
| **Trade-Off Explorer** | Separates ownership, delivery, scope, and finance choices | `project_intake` + `policy_interpretation` | `tradeoffs` |

Projects are searchable and vertically listed. An owner or admin can reopen a saved intake, edit it, and submit it for reanalysis. Each submission creates an immutable numbered revision; current project fields and the revision record are committed atomically with optimistic concurrency protection.

## Repository Structure

```
/
├── README.md                          # This file
├── docs/
│   ├── 00_overview.md                 # System overview and M300 grounding
│   ├── 01_multi_agent_architecture.md # Detailed agent specifications
│   ├── 02_decision_framework.md       # Scoring logic and decision rules
│   ├── 03_demo_conversation_flows.md  # Example user stories and sample runs
│   └── 04_risk_and_debt_sensitivity.md# Debt analysis framework
├── data/
│   ├── grants_seed.json               # 12 mock grant sources
│   ├── funder_taxonomy.json           # Funder classification
│   └── scoring_weights.json           # Explicit scoring weights
├── schemas/
│   ├── project_intake.schema.json     # Input schema
│   ├── policy_interpretation.schema.json
│   ├── grant_match.schema.json
│   └── proposal_coach.schema.json
├── agent_builder/
│   ├── agent_instructions.md          # OpenAI Agent Builder config
│   ├── tools_spec.md                  # Tool definitions
│   └── sample_prompts.md              # Demo conversations
├── n8n/
│   ├── workflow_blueprint.md          # Node-by-node workflow design
│   ├── node_payload_examples.md       # Example payloads
│   ├── expressions_and_mappings.md    # n8n expressions
│   └── n8n_workflow.json              # Importable workflow JSON
└── src/
    ├── score_match.py                 # Scoring implementation
    └── run_demo.py                    # CLI demo
```

## Quick Start

### Run the CLI Demo

```bash
cd src
python run_demo.py
```

Or with a custom intake file:

```bash
python run_demo.py --intake path/to/intake.json
```

### Deploy to OpenAI Agent Builder

1. Create a new Agent in the OpenAI platform
2. Copy contents of `agent_builder/agent_instructions.md` into the system instructions
3. Add tools as defined in `agent_builder/tools_spec.md`
4. Test with prompts from `agent_builder/sample_prompts.md`

### Deploy to n8n

1. Import `n8n/n8n_workflow.json` into your n8n instance
2. Configure the webhook URL
3. Replace LLM stubs with your preferred AI provider (OpenAI, Anthropic, etc.)
4. Test with payloads from `n8n/node_payload_examples.md`

## Sample User Journey

1. **User** pastes a project concept: *"We want to build a 50kW solar mini-grid serving 200 households and a cassava processing facility in rural Kaduna State, Nigeria. The community cooperative will own and operate it."*

2. **Policy Interpreter** returns:
   - M300 alignment narrative
   - Grant-suitable elements (community ownership, productive use, last-mile)
   - Debt exposure risks and verification points, even when grant-only is preferred
   - Assumptions list

3. **Grant Matcher** returns:
   - Top 5 grant sources with fit scores (0-100)
   - Fit rationale tied to project specifics
   - Red flags (if any)
   - Next actions (documents to prepare)

4. **Proposal Coach** returns:
   - Grant-ready proposal outline
   - Readiness checklist
   - Missing information questionnaire

## Key M300 Alignment Criteria

Projects score higher when they demonstrate:

- [ ] Community or public ownership model (not private IPP)
- [ ] No sovereign debt implications
- [ ] Productive use component (jobs, income generation)
- [ ] Last-mile / unserved population focus
- [ ] Tariff affordability mechanism
- [ ] Local capacity building component
- [ ] Gender/inclusion considerations
- [ ] Climate resilience features

## License

MIT License - Use freely, adapt for your context.

## Acknowledgments

Analysis grounded in "Mission 300: Electrification Finance and the African Debt Dilemma" (Power Shift Africa) and related M300 documentation.
