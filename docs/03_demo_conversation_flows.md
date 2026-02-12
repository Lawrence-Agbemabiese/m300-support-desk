# Demo Conversation Flows

This document provides complete example user stories and sample runs demonstrating the Co-Intelligent Support Desk in action.

---

## User Story 1: Community-Owned Solar Mini-Grid for Productive Use

### Context

A community cooperative in rural Kaduna State, Nigeria wants to build a solar mini-grid serving households and a cassava processing facility. They have no experience with international grant applications and want guidance.

### Sample Project Intake

```json
{
  "project_intake": {
    "project_name": "Kaduna Community Solar Mini-Grid",
    "country": "Nigeria",
    "location_description": "Rural community in Kaduna State, approximately 45km from nearest grid connection. Population ~1,200 across 200 households.",
    "technology_type": "solar_mini_grid",
    "capacity_kw": 50,
    "target_beneficiaries": "200 households, 1 cassava processing cooperative (35 members, 60% women), 2 schools, 1 health post",
    "ownership_model": "community_cooperative",
    "productive_uses": ["cassava_processing", "phone_charging_business", "cold_storage_small_scale"],
    "estimated_cost_usd": 285000,
    "existing_funding": "Community has committed $15,000 in cash and in-kind contributions (land, labor for site preparation)",
    "project_stage": "concept",
    "community_engagement": "Cooperative formed in 2021 with 180 member households. Monthly meetings held. Community prioritization exercise completed identifying electricity as top need.",
    "additional_context": "The cooperative has successfully managed a community savings scheme for 3 years. Nearest grid has no extension plans for at least 10 years per DISCO. Area has strong solar resource (5.2 kWh/m2/day average)."
  }
}
```

### Agent 1 Output: Policy Interpretation

```json
{
  "policy_interpretation": {
    "project_name": "Kaduna Community Solar Mini-Grid",
    "m300_alignment_score": 88,
    "alignment_narrative": "This project exemplifies the community-ownership model recommended by Mission 300 critics to avoid debt exacerbation. By keeping ownership within the cooperative, tariff revenues remain in Kaduna State rather than flowing to external investors—directly addressing the capital flight concern. The productive use component (cassava processing) transforms this from a consumption-focused project to one that generates income and jobs, strengthening the business case for grant investment. The 45km distance from grid makes mini-grid the economically rational solution, aligning with M300's electrification pathways while avoiding the sovereign debt that would accompany grid extension financing.",
    "ownership_classification": "community_cooperative",
    "grant_suitable_elements": [
      "100% community cooperative ownership eliminates profit extraction",
      "Productive use anchor (cassava processing) ensures financial sustainability",
      "Strong gender component: 60% women in processing cooperative",
      "Last-mile location with no grid extension planned",
      "Demonstrated community organization and financial management",
      "Community cash and in-kind contribution shows commitment",
      "Public institutions served (schools, health post)"
    ],
    "debt_exposure_risks": [
      "None identified under current structure",
      "If any loan component is introduced later, cooperative would bear debt—not sovereign"
    ],
    "private_capital_risks": [
      "Risk if developer model is imposed: could require tariff guarantees",
      "Risk of 'grant capture' by developers claiming community partnership",
      "Mitigation: Ensure cooperative retains asset ownership regardless of implementation support"
    ],
    "community_ownership_justification": "The Kaduna cooperative's 3-year track record managing savings demonstrates governance capacity. Community ownership ensures: (1) tariff decisions reflect local affordability, (2) O&M jobs stay local, (3) surplus revenues fund community priorities, (4) no foreign currency obligations or sovereign guarantees required. This directly implements Power Shift Africa's recommendation to 'promote public and community ownership of energy infrastructure.'",
    "assumptions_list": [
      "Cooperative is formally registered with CAC (verify registration number)",
      "Land for mini-grid site is secured (need documentation)",
      "Solar resource estimate is based on reliable data",
      "Cassava processing facility exists or will be co-developed",
      "DISCO confirmation of no grid plans is documented",
      "Community contribution of $15K is available and committed"
    ],
    "recommended_framing": "Position as 'Community-Led Productive Use Electrification'—emphasizing that this is not charity but investment in productive capacity. Lead with the cassava value chain story: current losses from inability to process, projected gains with electricity, jobs created. The mini-grid enables economic activity, not just lighting. For M300 alignment, explicitly note that 100% grant funding means zero addition to Nigeria's sovereign debt."
  }
}
```

### Agent 2 Output: Grant Match (Top 3)

```json
{
  "grant_match": {
    "project_name": "Kaduna Community Solar Mini-Grid",
    "matches": [
      {
        "funder_name": "Global Energy Alliance for People and Planet (GEAPP)",
        "instrument_type": "grant",
        "fit_score": 92,
        "fit_rationale": [
          "Nigeria is GEAPP priority country with active programming",
          "Mini-grids with productive use is core focus area",
          "Project cost ($285K) within typical range ($150K-$500K)",
          "GEAPP explicitly supports community ownership models",
          "Strong alignment with GEAPP's jobs and livelihoods lens"
        ],
        "red_flags": [],
        "next_actions": [
          "Register on GEAPP partner portal",
          "Complete GEAPP demand assessment template",
          "Obtain cooperative CAC registration certificate",
          "Document land tenure arrangement",
          "Prepare preliminary technical design (single-line diagram, equipment list)",
          "Develop 5-year financial projection"
        ]
      },
      {
        "funder_name": "Africa Mini-Grid Support Facility (AMSF)",
        "instrument_type": "results_based_grant",
        "fit_score": 85,
        "fit_rationale": [
          "West Africa is eligible region",
          "Solar mini-grids are supported technology",
          "Community ownership compatible with facility terms",
          "Results-based approach rewards actual connections"
        ],
        "red_flags": [
          "Results-based payment requires bridge financing for construction",
          "Verify cooperative can secure working capital or find implementation partner"
        ],
        "next_actions": [
          "Identify bridge financing source (local bank, DFI, or implementation NGO)",
          "Develop connection-based milestone schedule",
          "Prepare tariff structure documentation",
          "Register as eligible developer/implementer with facility"
        ]
      },
      {
        "funder_name": "Green Climate Fund - Simplified Approval Process",
        "instrument_type": "grant",
        "fit_score": 78,
        "fit_rationale": [
          "Nigeria is eligible country with accredited entities",
          "Renewable energy mini-grids qualify under mitigation",
          "SAP supports projects up to $10M (well above need)",
          "Strong climate rationale with solar displacing diesel/kerosene"
        ],
        "red_flags": [
          "Requires working through accredited entity (AE)",
          "GCF process longer than bilateral funders",
          "Project may be small for GCF efficiency preferences"
        ],
        "next_actions": [
          "Identify suitable Nigerian or international AE willing to sponsor",
          "Frame project within AE's existing pipeline or program",
          "Develop GHG emissions reduction estimate",
          "Prepare adaptation co-benefits narrative"
        ]
      }
    ],
    "excluded_funders": [
      {
        "funder_name": "IFC InfraVentures",
        "exclusion_reason": "Equity/loan instrument conflicts with grant-only preference"
      },
      {
        "funder_name": "AfDB Partial Risk Guarantee",
        "exclusion_reason": "Guarantee instrument creates contingent liability; not suitable for community project"
      }
    ],
    "overall_funding_strategy": "Lead with GEAPP application—best fit, pure grant, fastest process. Simultaneously explore AMSF if bridge financing can be arranged (could layer on top of GEAPP for scale-up). GCF is longer-term option requiring accredited entity relationship. Reject any funder requiring sovereign guarantees or loan components to maintain debt-free status."
  }
}
```

### Agent 3 Output: Proposal Coach

```json
{
  "proposal_coach": {
    "project_name": "Kaduna Community Solar Mini-Grid",
    "target_funder": "GEAPP",
    "proposal_outline": {
      "problem_statement": "Approximately 1,200 people across 200 households in [Village Name], Kaduna State lack access to reliable electricity. The nearest DISCO grid connection is 45km away with no extension planned for at least 10 years. This energy poverty has cascading economic impacts:\n\n- The local cassava cooperative (35 members, 60% women) cannot process crops, forcing sale of raw cassava at prices 40% below processed value\n- Annual post-harvest losses estimated at [X] tonnes due to lack of storage\n- Students study by kerosene lamp, with associated health and safety risks\n- Health post operates without refrigeration for vaccines\n- Average household spends ₦[X] monthly on kerosene, candles, and phone charging—money leaving the community\n\nWithout intervention, this community faces continued energy poverty and economic stagnation despite national electrification commitments under Mission 300.",

      "theory_of_change": "IF the community cooperative installs and operates a 50kW solar mini-grid with productive use prioritization,\n\nTHEN:\n- 200 households gain Tier 2+ electricity access (lighting, phone charging, fans, TV)\n- Cassava processing facility operates year-round at full capacity\n- Health post gains cold chain capability\n- Schools enable evening study and computer access\n\nLEADING TO:\n- 30% increase in household incomes from cassava value addition\n- 15 direct jobs (operators, processing workers)\n- Reduced kerosene expenditure redirected to productive uses\n- Demonstrated replicable model for community-owned electrification\n\nBECAUSE:\n- Productive use anchor ensures financial sustainability\n- Community ownership ensures affordability and local benefit retention\n- No debt burden on community or government enables long-term viability",

      "community_ownership_governance": "**Ownership Structure**: [Cooperative Name] will own 100% of mini-grid assets. The cooperative is registered with the Corporate Affairs Commission (CAC) since [Year], Registration No. [X].\n\n**Governance**:\n1. *General Assembly*: All member households (currently 180) meet quarterly to approve tariffs, budgets, and major decisions\n2. *Management Committee*: 7 elected members with 2-year terms, minimum 40% women representation, responsible for day-to-day oversight\n3. *Operations Team*: 2-3 trained local technicians employed by cooperative for O&M\n4. *Financial Controls*: Dual-signature bank account, monthly financial reports to Assembly, annual external audit\n\n**Revenue Management**:\n- 50% to operating expenses (salaries, maintenance, consumables)\n- 20% to equipment replacement reserve\n- 20% to debt-free (no debt exists)\n- 10% to community development fund (education, health, infrastructure)\n\n**Tariff Governance**: Tariff changes require General Assembly approval following affordability assessment. Community members have voice in pricing decisions.\n\n**Debt-Free Commitment**: The cooperative commits to 100% grant/equity funding with no borrowing that would create debt obligations for members or require government guarantees.",

      "technical_approach": "**System Sizing**:\n- 50kWp solar PV array (monocrystalline panels, 25-year warranty)\n- 100kWh lithium-ion battery storage (LFP chemistry, 10-year warranty)\n- 50kVA inverter system with smart monitoring\n- Low-voltage distribution network (~2km total)\n- Pre-paid smart meters for all 200+ connections\n\n**Load Analysis**:\n- Residential: 200 households × 150W average peak = 30kW\n- Productive use: Cassava processing 15kW (mills, graters, dryers)\n- Institutions: Schools 3kW, health post 2kW (including vaccine refrigerator)\n- Total peak: ~50kW; Average daily consumption: ~180kWh\n\n**Design Standards**: Comply with Nigerian Electricity Regulatory Commission (NERC) mini-grid regulations and IEC standards for off-grid systems.\n\n**Productive Use Integration**: Cassava processing equipment (electric mills, graters, dryers) sized to system capacity. Daytime operation maximizes direct solar use. Processing schedule coordinated with cooperative to optimize load factor.\n\n**Maintenance Strategy**:\n- Level 1 (daily): Local operators—monitoring, cleaning, basic troubleshooting\n- Level 2 (monthly): Trained technicians—preventive maintenance, minor repairs\n- Level 3 (annual): Regional service provider—comprehensive inspection, major repairs\n- Spare parts inventory maintained on-site for common failures",

      "affordability_tariff_principles": "**Tariff Structure**:\n| Tier | Rate | Consumption | Target Users |\n|------|------|-------------|---------------|\n| Lifeline | ₦100/kWh | 0-30 kWh/month | Poor households |\n| Standard | ₦165/kWh | 31-100 kWh/month | Average households |\n| Productive | ₦130/kWh | Daytime processing | Cassava cooperative |\n\n**Affordability Analysis**:\n- Average household currently spends ₦[X]/month on kerosene + phone charging\n- Lifeline tariff provides basic service at lower cost than kerosene\n- Productive use tariff below DISCO grid rate, enabling competitive processing\n\n**Cross-Subsidy Design**: Productive use revenues (higher volume, better load factor) subsidize lifeline rates for poorest households.\n\n**Payment System**: Pre-paid smart meters eliminate collection risk. Mobile money integration for convenient top-up.\n\n**Tariff Review**: Every 2 years with community consultation. Adjustments require General Assembly approval.",

      "implementation_plan": "| Phase | Timeline | Activities | Milestones |\n|-------|----------|------------|------------|\n| 1. Preparation | Months 1-2 | Detailed design, procurement specs, permits, community mobilization | Design approved, permits secured |\n| 2. Procurement | Months 2-4 | Tender, evaluate, contract equipment suppliers | Contracts signed, equipment ordered |\n| 3. Civil Works | Months 4-5 | Site preparation, foundations, distribution poles | Site ready for equipment |\n| 4. Installation | Months 5-7 | Solar array, batteries, inverters, distribution | System commissioned |\n| 5. Connections | Months 7-8 | Household wiring, meter installation, training | 100 connections live |\n| 6. Optimization | Months 8-12 | Full connections, productive use integration, monitoring | 200 connections, cassava facility operational |\n\n**Key Risks & Mitigation**:\n- Equipment delays: Order 2 months early, identify backup suppliers\n- Rainy season disruption: Schedule civil works for dry season\n- Community disputes: Maintain regular communication, transparent processes",

      "mel_framework": "**Output Indicators**:\n- Number of connections (target: 200 households + institutions)\n- System capacity installed (target: 50kWp / 100kWh)\n- Productive use equipment operational (target: cassava line by month 9)\n\n**Outcome Indicators**:\n| Indicator | Baseline | Target (Year 1) | Target (Year 3) |\n|-----------|----------|-----------------|------------------|\n| Households with electricity access | 0 | 200 | 200+ |\n| Monthly cassava processing (tonnes) | 0 | 5 | 12 |\n| Household income from cassava (avg) | ₦X | +20% | +35% |\n| Kerosene expenditure (avg HH) | ₦X | -80% | -95% |\n| Direct jobs created | 0 | 8 | 15 |\n| System uptime | n/a | >95% | >97% |\n\n**Data Collection**:\n- Smart meters: Real-time consumption, uptime, revenue data\n- Quarterly surveys: 20% household sample on expenditure, income, satisfaction\n- Processing logs: Cassava cooperative volume and sales records\n- Financial audits: Annual cooperative accounts\n\n**Learning & Adaptation**:\n- Monthly operations review meeting\n- Quarterly community feedback session\n- Annual learning report shared with GEAPP and sector stakeholders\n- Willingness to host peer learning visits",

      "risk_register": "| Risk | Likelihood | Impact | Mitigation | Residual |\n|------|------------|--------|------------|----------|\n| Equipment failure | Medium | High | Quality procurement, warranties, spare parts, service agreement | Low |\n| Tariff non-payment | Low | Medium | Pre-paid metering, community ownership incentive, lifeline tier | Low |\n| Governance capture | Low | High | Term limits, Assembly oversight, external audit, transparency | Low |\n| Weather damage | Low | Medium | Robust mounting, insurance, emergency reserve | Low |\n| Theft/vandalism | Low | Medium | Community ownership creates social protection, secure enclosure | Low |\n| Policy change | Low | Medium | Community ownership provides political resilience, NERC engagement | Low |\n| **DEBT SENSITIVITY** | **N/A** | **N/A** | **100% grant funded. No loan component. No sovereign guarantees. No foreign currency obligations. Zero impact on Nigeria's debt position.** | **None** |"
    },
    "readiness_checklist": [
      {"item": "Cooperative CAC registration certificate", "status": "unknown", "notes": "Critical - obtain and attach to application"},
      {"item": "Land documentation (lease/allocation)", "status": "unknown", "notes": "Need formal documentation from community/LGA"},
      {"item": "Community contribution letter", "status": "unknown", "notes": "Document $15K commitment with bank statement"},
      {"item": "Demand assessment data", "status": "not_ready", "notes": "Conduct household survey using GEAPP template"},
      {"item": "Technical feasibility/design", "status": "not_ready", "notes": "Commission preliminary design from qualified engineer"},
      {"item": "Detailed budget with quotes", "status": "not_ready", "notes": "Obtain equipment quotes from 2-3 suppliers"},
      {"item": "5-year financial projection", "status": "not_ready", "notes": "Build model showing revenue, costs, sustainability"},
      {"item": "Cassava facility MOU/commitment", "status": "unknown", "notes": "Document anchor load commitment from processing cooperative"},
      {"item": "DISCO no-grid-plans confirmation", "status": "unknown", "notes": "Obtain written confirmation from Kaduna DISCO"},
      {"item": "Management committee CVs", "status": "not_ready", "notes": "Prepare brief bios of 7 committee members"},
      {"item": "Bank account details", "status": "unknown", "notes": "Confirm cooperative has functional account"},
      {"item": "Photos of site and community", "status": "not_ready", "notes": "Take clear photos of proposed site, community, existing energy use"}
    ],
    "missing_info_questionnaire": [
      "What is the cooperative's CAC registration number?",
      "What is the exact name of the village/community?",
      "What is the GPS coordinates of the proposed mini-grid site?",
      "What is the land tenure arrangement? (Community land, leased, LGA allocation?)",
      "What is the cooperative's current bank balance?",
      "How much of the $15,000 community contribution is cash vs. in-kind?",
      "What is the average household monthly income in the community?",
      "What is current average monthly expenditure on kerosene per household?",
      "What cassava processing equipment is needed? (mills, graters, dryers—specify)",
      "What is current annual cassava production in the area (tonnes)?",
      "Has any technical assessment or feasibility study been done?",
      "What is the composition of the Management Committee? (names, roles, gender)",
      "Are there any existing mini-grids or solar installations nearby?",
      "What permits or approvals are required from state/LGA?",
      "Who will be the primary contact person for the grant application?"
    ]
  }
}
```

---

## User Story 2: Public/Community Hybrid for Clinic Electrification + Cold Chain

### Context

A state Ministry of Health in collaboration with a community cooperative wants to electrify 5 rural health clinics with solar systems including vaccine cold chain. The ownership will be hybrid: Ministry owns equipment, community cooperative manages and maintains.

### Sample Project Intake

```json
{
  "project_intake": {
    "project_name": "Plateau State Health Clinic Electrification",
    "country": "Nigeria",
    "location_description": "5 primary health care centers in rural Plateau State. Clinics serve populations of 3,000-8,000 each. All are off-grid, currently using intermittent diesel generators.",
    "technology_type": "solar_standalone",
    "capacity_kw": 25,
    "target_beneficiaries": "5 health clinics serving ~25,000 people total. Direct beneficiaries include maternal health patients, children (vaccination), and all clinic patients/staff.",
    "ownership_model": "public_community_hybrid",
    "productive_uses": ["vaccine_cold_chain", "medical_equipment", "lighting", "communications"],
    "estimated_cost_usd": 175000,
    "existing_funding": "State Ministry of Health committed to provide sites, installation support, and recurrent budget for consumables. Community health committees will manage day-to-day operations.",
    "project_stage": "early_development",
    "community_engagement": "Each clinic has an active Ward Development Committee. Community health workers are present. Village heads have endorsed the project.",
    "additional_context": "Plateau State has chronic vaccine wastage due to cold chain failures. Recent measles outbreak in 2 LGAs attributed partly to vaccine stockouts. Ministry is motivated but lacks capital for solar installations. State debt-to-revenue ratio is concerning—they cannot take new loans."
  }
}
```

### Agent 1 Output: Policy Interpretation

```json
{
  "policy_interpretation": {
    "project_name": "Plateau State Health Clinic Electrification",
    "m300_alignment_score": 82,
    "alignment_narrative": "This project addresses critical health infrastructure under-electrification—a gap that directly affects vaccine delivery and maternal health outcomes. The hybrid ownership model (Ministry owns assets, community manages operations) balances public accountability with local engagement. Crucially, the state's constrained fiscal position means grant funding is essential: Plateau's debt-to-revenue ratio precludes new borrowing, making this project impossible under loan-based M300 financing. Grant funding enables health system strengthening without adding to sub-national debt—exactly the approach recommended to avoid fiscal strain.",
    "ownership_classification": "public_community_hybrid",
    "grant_suitable_elements": [
      "Public health infrastructure—strong rationale for grant vs. commercial finance",
      "Cold chain for vaccines—climate adaptation and health resilience",
      "No revenue generation expectation—not commercially viable, requires grant",
      "State cannot borrow—grant is only viable pathway",
      "Community management reduces recurrent cost burden on Ministry",
      "Addresses measles outbreak risk—urgent public health need"
    ],
    "debt_exposure_risks": [
      "State guarantee: If any funder requires state guarantee, this adds to Plateau's contingent liabilities",
      "Recurrent budget: Ministry commitment to consumables must be fiscally sustainable",
      "Mitigation: Ensure grant covers full capital cost with no loan component"
    ],
    "private_capital_risks": [
      "Private operation of health facility power is inappropriate—no commercial model",
      "Any PPP structure could create hidden liabilities for state",
      "Recommendation: Maintain public ownership, community management"
    ],
    "community_ownership_justification": "The hybrid model leverages community health committees already active at each clinic. These committees have existing governance structures, meet regularly, and have relationships with clinic staff. Transferring day-to-day management to community reduces Ministry burden while maintaining public ownership of assets. This follows the principle of 'public ownership with community engagement' that avoids both privatization and centralized inefficiency.",
    "assumptions_list": [
      "Ministry has legal authority to receive and manage grant-funded assets",
      "Ward Development Committees have formal status and can enter agreements",
      "Ministry recurrent budget commitment is credible and will be honored",
      "Cold chain equipment specifications are defined (WHO PQS?)",
      "Site assessments for 5 clinics have been conducted",
      "No existing loans or encumbrances on clinic facilities"
    ],
    "recommended_framing": "Position as 'Climate-Resilient Health Infrastructure' with twin benefits: (1) immediate health impact through reliable cold chain and clinic operations, (2) fiscal prudence by avoiding state debt. Emphasize that conventional financing is impossible given state fiscal constraints—grant is the only viable path to achieving health SDG targets in these communities. The community management model demonstrates sustainability without commercial exploitation of health services."
  }
}
```

### Agent 2 Output: Grant Match (Top 3)

```json
{
  "grant_match": {
    "project_name": "Plateau State Health Clinic Electrification",
    "matches": [
      {
        "funder_name": "Gavi / Cold Chain Equipment Optimization Platform (CCEOP)",
        "instrument_type": "grant",
        "fit_score": 94,
        "fit_rationale": [
          "Nigeria is Gavi-eligible country with active programs",
          "Cold chain for vaccines is CCEOP's core mandate",
          "Grant instrument—no debt implications",
          "Health ministry involvement aligns with Gavi's government partnership model",
          "Project scale appropriate for CCEOP support"
        ],
        "red_flags": [],
        "next_actions": [
          "Coordinate with National Primary Health Care Development Agency (NPHCDA)",
          "Verify clinics are in national cold chain inventory",
          "Obtain WHO PQS specifications for solar refrigerators",
          "Document vaccine wastage data from target clinics",
          "Prepare site assessment reports for 5 facilities"
        ]
      },
      {
        "funder_name": "Power Africa Health Electrification Initiative",
        "instrument_type": "grant",
        "fit_score": 88,
        "fit_rationale": [
          "Nigeria is Power Africa partner country",
          "Health facility electrification is explicit focus",
          "Grant mechanism with technical assistance",
          "USAID delivery ensures no debt creation",
          "Strong alignment with US global health priorities"
        ],
        "red_flags": [
          "May require competitive application process",
          "Implementation timeline may depend on USAID programming cycle"
        ],
        "next_actions": [
          "Contact Power Africa Nigeria team",
          "Register on grants.gov if direct application",
          "Identify local implementing partner if required",
          "Prepare detailed facility inventory and specifications"
        ]
      },
      {
        "funder_name": "Global Fund Health System Strengthening",
        "instrument_type": "grant",
        "fit_score": 75,
        "fit_rationale": [
          "Nigeria receives Global Fund support",
          "Health system strengthening can include infrastructure",
          "Cold chain supports immunization programs funded by Global Fund"
        ],
        "red_flags": [
          "Global Fund typically works through national programs, not direct project grants",
          "Would need to integrate into existing Nigeria Country Coordinating Mechanism proposal",
          "Longer timeline for funding decisions"
        ],
        "next_actions": [
          "Consult with Nigeria CCM secretariat",
          "Explore whether project fits within existing grant flexibilities",
          "Document linkage to Global Fund disease programs (malaria, TB, HIV)"
        ]
      }
    ],
    "excluded_funders": [
      {
        "funder_name": "IDA Health Systems Support",
        "exclusion_reason": "Loan instrument would add to Plateau State's debt burden—explicitly contra-indicated given fiscal constraints"
      },
      {
        "funder_name": "AfDB Results-Based Financing",
        "exclusion_reason": "RBF for health typically requires state co-financing/guarantee capacity that Plateau cannot provide"
      }
    ],
    "overall_funding_strategy": "Lead with Gavi/CCEOP through NPHCDA coordination—this is exactly what CCEOP exists for. Power Africa Health Electrification is strong backup with potentially faster decision timeline. Global Fund is lower probability but worth exploring for integration into broader health system support. Critical: reject any funding that requires state borrowing or guarantees given Plateau's fiscal position."
  }
}
```

### Agent 3 Output: Proposal Coach (Abbreviated)

```json
{
  "proposal_coach": {
    "project_name": "Plateau State Health Clinic Electrification",
    "target_funder": "Gavi / CCEOP",
    "proposal_outline": {
      "problem_statement": "Five primary health care centers in rural Plateau State operate without reliable electricity, relying on intermittent diesel generators that frequently fail. This has critical consequences for the state's immunization program:\n\n- Vaccine wastage due to cold chain failure averaged [X]% in 2024\n- Recent measles outbreaks in [LGA names] attributed partly to vaccine stockouts\n- Maternal health services constrained by lack of lighting for night deliveries\n- Clinic staff retention challenged by poor working conditions\n\nPlateau State's fiscal constraints (debt-to-revenue ratio of [X]%) preclude borrowing for infrastructure investments. Without grant support, these clinics will remain without reliable power indefinitely, undermining Nigeria's immunization coverage targets and SDG 3 commitments.",

      "theory_of_change": "IF 5 rural health clinics receive reliable solar power with WHO PQS cold chain equipment, AND community health committees are trained to manage and maintain systems, THEN vaccine wastage will reduce by 80%, clinic operating hours will extend, AND maternal/child health service delivery will improve, LEADING TO increased immunization coverage, reduced preventable disease outbreaks, and improved health outcomes for 25,000 people, BECAUSE reliable power is the critical enabler for vaccine storage, clinical services, and staff retention in off-grid facilities.",

      "community_ownership_governance": "**Hybrid Ownership Model**:\n- *Asset Ownership*: Plateau State Ministry of Health owns all equipment, registered in state asset inventory\n- *Operational Management*: Ward Development Committee at each clinic manages day-to-day operations through formal MOU with Ministry\n- *Technical Support*: State coordinates annual maintenance through regional solar technician network\n\n**Governance at Each Clinic**:\n- Ward Development Committee (existing structure) assigns 2 members to 'Solar Committee'\n- Solar Committee trained on basic monitoring, troubleshooting, cleaning\n- Monthly reporting to Ministry via community health worker\n- Annual review meeting with Ministry technical staff\n\n**No Debt Creation**: 100% grant funding. Ministry provides recurrent budget for consumables only (estimated ₦[X]/year total). No loan, no guarantee, no contingent liability for state.",

      "technical_approach": "Per-clinic specification:\n- 5kWp solar PV array\n- 10kWh lithium battery storage\n- 1x WHO PQS solar direct-drive vaccine refrigerator (SDD)\n- LED lighting for clinical areas, labor room, pharmacy\n- Power points for diagnostic equipment, communications\n\nTotal across 5 clinics: 25kWp solar, 50kWh storage, 5 SDD refrigerators.\n\nDesign standards: WHO PQS for cold chain; IEC for solar systems; NAFDAC guidelines for health facility electrical safety.",

      "affordability_tariff_principles": "N/A - Health facilities do not charge tariffs for electricity. System operational costs (minimal) covered by Ministry recurrent budget. No revenue generation model required—this is public health infrastructure funded by grant.",

      "implementation_plan": "Months 1-2: Site assessments, final designs, procurement | Months 3-4: Equipment delivery, installation at 2 pilot clinics | Months 5-6: Installation at remaining 3 clinics | Months 7-8: Training, commissioning, monitoring setup | Months 9-12: Performance monitoring, troubleshooting, handover to routine operations.",

      "mel_framework": "Key indicators: System uptime (>98%), vaccine wastage rate (target: <5%), clinic operating hours (target: 12 hrs/day), immunization sessions conducted, cold chain alarms/incidents. Data via smart monitoring + Ministry HMIS.",

      "risk_register": "Technical: Equipment failure (mitigated by warranties, spare parts, service agreements). Governance: Committee capacity (mitigated by training, Ministry oversight). External: Policy changes (mitigated by Ministry ownership, formal agreements). **DEBT SENSITIVITY: None. 100% grant funded. No state borrowing. No guarantees. No impact on Plateau State's fiscal position. Ministry recurrent commitment is operational expense, not capital debt.**"
    },
    "readiness_checklist": [
      {"item": "Ministry formal endorsement letter", "status": "unknown", "notes": "Need signed letter from Commissioner for Health"},
      {"item": "Site assessment reports (5 clinics)", "status": "not_ready", "notes": "Conduct technical assessments with solar resource, electrical needs"},
      {"item": "Cold chain inventory alignment", "status": "unknown", "notes": "Verify clinics are in NPHCDA inventory"},
      {"item": "Ward Development Committee agreements", "status": "not_ready", "notes": "Draft and sign MOUs with each committee"},
      {"item": "Recurrent budget commitment", "status": "unknown", "notes": "Document Ministry budget allocation for consumables"},
      {"item": "NPHCDA coordination confirmation", "status": "not_ready", "notes": "Obtain letter of support from national agency"},
      {"item": "Vaccine wastage data", "status": "unknown", "notes": "Compile historical data from target clinics"},
      {"item": "Detailed budget with WHO PQS equipment", "status": "not_ready", "notes": "Price WHO PQS solar refrigerators + balance of system"}
    ],
    "missing_info_questionnaire": [
      "What are the names and locations of the 5 target health clinics?",
      "What is the current vaccine wastage rate at each clinic?",
      "What is the Ministry's confirmed recurrent budget allocation for this project?",
      "Are the clinics registered in the national cold chain equipment inventory?",
      "What is the composition of each Ward Development Committee?",
      "What is the distance from each clinic to the nearest grid connection?",
      "What existing electrical equipment is at each clinic (diagnostic, communications)?",
      "Has the state solar electrification agency been consulted?",
      "What permits or approvals are required from state government?",
      "Who is the designated project focal point at the Ministry of Health?"
    ]
  }
}
```

---

## Running These Examples

### CLI Demo

```bash
cd src
python run_demo.py --intake ../docs/examples/kaduna_intake.json
```

### Agent Builder

Paste the project intake description into the agent conversation:

> "We want to build a 50kW solar mini-grid serving 200 households and a cassava processing facility in rural Kaduna State, Nigeria. The community cooperative will own and operate it. Budget is about $285,000."

### n8n

POST to webhook endpoint:
```json
{
  "project_name": "Kaduna Community Solar Mini-Grid",
  "country": "Nigeria",
  ...
}
```
