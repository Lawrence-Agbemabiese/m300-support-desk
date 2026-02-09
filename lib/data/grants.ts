export interface Grant {
  id: string;
  funder_name: string;
  instrument_type: string;
  geography_focus: {
    priority_countries: string[];
    regions: string[];
    scope: string;
  };
  thematic_focus: {
    primary: string[];
    secondary: string[];
    cross_cutting: string[];
  };
  typical_ticket_size_range: {
    min_usd: number;
    max_usd: number;
    notes?: string;
  };
  key_eligibility: string[];
  typical_requirements: string[];
  disallowed_or_risky_patterns: string[];
  notes_on_alignment_to_community_ownership: string;
  debt_sensitivity_tier: number;
  application_modality: string;
  website: string;
}

export const grants: Grant[] = [
  {
    id: "geapp_minigrid",
    funder_name: "Global Energy Alliance for People and Planet (GEAPP)",
    instrument_type: "grant",
    geography_focus: {
      priority_countries: ["Nigeria", "Kenya", "Ethiopia", "DRC", "India", "Indonesia"],
      regions: ["Sub-Saharan Africa", "South Asia", "Southeast Asia"],
      scope: "multi_country"
    },
    thematic_focus: {
      primary: ["mini_grids", "productive_use", "distributed_renewables"],
      secondary: ["grid_integration", "energy_access"],
      cross_cutting: ["jobs", "gender", "climate"]
    },
    typical_ticket_size_range: {
      min_usd: 150000,
      max_usd: 500000,
      notes: "Larger grants for aggregation platforms"
    },
    key_eligibility: [
      "Registered legal entity (cooperative, company, NGO)",
      "Demonstrated community engagement",
      "Technical feasibility assessment",
      "Business plan with demand analysis"
    ],
    typical_requirements: [
      "Demand assessment survey",
      "Technical design (preliminary acceptable)",
      "5-year financial projection",
      "Community contribution documentation",
      "Land tenure evidence"
    ],
    disallowed_or_risky_patterns: [
      "Projects requiring sovereign guarantees",
      "Pure grid extension (no distributed component)",
      "Projects in conflict zones without security plan"
    ],
    notes_on_alignment_to_community_ownership: "GEAPP explicitly supports community ownership models. Their 'Community of Practice' promotes cooperatives and local ownership. Strong alignment with debt-free approach.",
    debt_sensitivity_tier: 1,
    application_modality: "ongoing",
    website: "energyalliance.org"
  },
  {
    id: "amsf_rbf",
    funder_name: "Africa Mini-Grid Support Facility (AMSF)",
    instrument_type: "results_based_grant",
    geography_focus: {
      priority_countries: [],
      regions: ["West Africa", "East Africa", "Southern Africa"],
      scope: "africa_wide"
    },
    thematic_focus: {
      primary: ["mini_grids"],
      secondary: ["solar_home_systems", "productive_use"],
      cross_cutting: ["scale", "sustainability"]
    },
    typical_ticket_size_range: {
      min_usd: 100000,
      max_usd: 1000000,
      notes: "Results-based payment per connection"
    },
    key_eligibility: [
      "Registered mini-grid developer or operator",
      "Track record of at least 1 operational mini-grid (for some windows)",
      "Ability to pre-finance construction",
      "Commitment to affordable tariffs"
    ],
    typical_requirements: [
      "Connection milestone schedule",
      "Tariff structure documentation",
      "Bridge financing arrangement",
      "Monitoring and reporting capacity"
    ],
    disallowed_or_risky_patterns: [
      "Cannot pre-finance construction phase",
      "No track record (for certain windows)",
      "Tariffs above affordability thresholds"
    ],
    notes_on_alignment_to_community_ownership: "Supports community ownership if bridge financing is available. Does not require private developer. Cooperative can apply if financially capable of pre-financing.",
    debt_sensitivity_tier: 2,
    application_modality: "periodic_calls",
    website: "afdb.org/en/topics-and-sectors/initiatives-partnerships/africa-mini-grid-support-facility"
  },
  {
    id: "gcf_sap",
    funder_name: "Green Climate Fund - Simplified Approval Process",
    instrument_type: "grant",
    geography_focus: {
      priority_countries: [],
      regions: ["Africa", "Asia", "Latin America", "Pacific"],
      scope: "global_south"
    },
    thematic_focus: {
      primary: ["climate_mitigation", "climate_adaptation"],
      secondary: ["renewable_energy", "resilience"],
      cross_cutting: ["gender", "indigenous_peoples"]
    },
    typical_ticket_size_range: {
      min_usd: 250000,
      max_usd: 10000000,
      notes: "SAP for projects up to $10M; larger via full proposal"
    },
    key_eligibility: [
      "Must apply through GCF Accredited Entity",
      "Clear climate rationale (mitigation or adaptation)",
      "Country ownership (no-objection letter)",
      "Environmental and social safeguards compliance"
    ],
    typical_requirements: [
      "Concept note or funding proposal",
      "GHG emissions reduction estimate (for mitigation)",
      "Adaptation benefits documentation",
      "Gender assessment",
      "Co-financing (often required)"
    ],
    disallowed_or_risky_patterns: [
      "Fossil fuel components",
      "Projects without clear climate impact",
      "Weak country ownership"
    ],
    notes_on_alignment_to_community_ownership: "GCF supports public and community ownership. Accredited Entities include UN agencies and national entities that can channel to community projects. Grant instrument avoids debt.",
    debt_sensitivity_tier: 1,
    application_modality: "ongoing",
    website: "greenclimate.fund"
  },
  {
    id: "gavi_cceop",
    funder_name: "Gavi Cold Chain Equipment Optimization Platform (CCEOP)",
    instrument_type: "grant",
    geography_focus: {
      priority_countries: ["Nigeria", "DRC", "Ethiopia", "Pakistan", "India"],
      regions: ["Gavi-eligible countries"],
      scope: "multi_country"
    },
    thematic_focus: {
      primary: ["vaccine_cold_chain", "health_facility_electrification"],
      secondary: ["solar_direct_drive"],
      cross_cutting: ["immunization", "health_systems"]
    },
    typical_ticket_size_range: {
      min_usd: 50000,
      max_usd: 5000000,
      notes: "Per-country allocation based on need"
    },
    key_eligibility: [
      "Gavi-eligible country (verified by Gavi)",
      "Health facilities in national inventory",
      "Ministry of Health engagement",
      "WHO PQS equipment specifications"
    ],
    typical_requirements: [
      "Cold chain equipment inventory",
      "National deployment plan",
      "Coordination with EPI program",
      "Installation and maintenance plan"
    ],
    disallowed_or_risky_patterns: [
      "Non-health applications",
      "Equipment not meeting WHO PQS standards",
      "Private sector health facilities (typically)"
    ],
    notes_on_alignment_to_community_ownership: "Supports public ownership (Ministry of Health). Equipment becomes government asset. No debt implications. Can integrate community maintenance models.",
    debt_sensitivity_tier: 1,
    application_modality: "national_allocation",
    website: "gavi.org/our-alliance/market-shaping/cold-chain-equipment"
  },
  {
    id: "power_africa_health",
    funder_name: "Power Africa Health Electrification Initiative",
    instrument_type: "grant",
    geography_focus: {
      priority_countries: ["Nigeria", "Kenya", "Tanzania", "Uganda", "Ethiopia"],
      regions: ["Sub-Saharan Africa"],
      scope: "africa_only"
    },
    thematic_focus: {
      primary: ["health_facility_electrification"],
      secondary: ["solar_standalone", "mini_grids_health"],
      cross_cutting: ["maternal_health", "vaccine_delivery"]
    },
    typical_ticket_size_range: {
      min_usd: 100000,
      max_usd: 2000000,
      notes: "Through implementing partners"
    },
    key_eligibility: [
      "Power Africa partner country",
      "Health facility focus",
      "Ministry of Health coordination",
      "Technical partner or implementer identified"
    ],
    typical_requirements: [
      "Facility assessment",
      "Equipment specifications",
      "Implementation timeline",
      "Sustainability plan"
    ],
    disallowed_or_risky_patterns: [
      "Non-health applications",
      "Countries outside Power Africa scope",
      "Private hospital focus"
    ],
    notes_on_alignment_to_community_ownership: "Supports public sector (government health facilities). USAID grant mechanism ensures no debt creation. Community management models encouraged for sustainability.",
    debt_sensitivity_tier: 1,
    application_modality: "through_partners",
    website: "usaid.gov/powerafrica"
  },
  {
    id: "endev_rbf",
    funder_name: "Energising Development (EnDev)",
    instrument_type: "results_based_grant",
    geography_focus: {
      priority_countries: ["Benin", "Ethiopia", "Kenya", "Malawi", "Mozambique", "Rwanda", "Senegal", "Tanzania", "Uganda"],
      regions: ["Sub-Saharan Africa", "Southeast Asia", "Latin America"],
      scope: "multi_country"
    },
    thematic_focus: {
      primary: ["energy_access", "clean_cooking", "productive_use"],
      secondary: ["mini_grids", "solar_home_systems"],
      cross_cutting: ["market_development", "pro_poor"]
    },
    typical_ticket_size_range: {
      min_usd: 50000,
      max_usd: 500000,
      notes: "RBF payments based on verified connections/sales"
    },
    key_eligibility: [
      "Active in EnDev country",
      "Energy access focus (Tier 1+)",
      "Pro-poor targeting",
      "Sustainability pathway"
    ],
    typical_requirements: [
      "Market assessment",
      "Pro-poor business model",
      "Verification methodology",
      "Reporting capacity"
    ],
    disallowed_or_risky_patterns: [
      "Countries without EnDev presence",
      "Non-energy access applications",
      "High-income customer focus"
    ],
    notes_on_alignment_to_community_ownership: "EnDev supports various ownership models including community cooperatives. RBF structure means no upfront debt requirement for EnDev funds, but may need bridge financing.",
    debt_sensitivity_tier: 2,
    application_modality: "country_programs",
    website: "endev.info"
  },
  {
    id: "undp_africa_minigrid",
    funder_name: "UNDP Africa Minigrids Program",
    instrument_type: "grant",
    geography_focus: {
      priority_countries: ["Burkina Faso", "DRC", "Eswatini", "Ethiopia", "Madagascar", "Malawi", "Nigeria", "Somalia", "Sudan", "Zambia"],
      regions: ["Sub-Saharan Africa"],
      scope: "africa_only"
    },
    thematic_focus: {
      primary: ["mini_grids"],
      secondary: ["policy_support", "business_model_innovation"],
      cross_cutting: ["gender", "climate", "local_capacity"]
    },
    typical_ticket_size_range: {
      min_usd: 100000,
      max_usd: 1500000,
      notes: "Country-level allocations for demonstration projects"
    },
    key_eligibility: [
      "Located in program country",
      "Alignment with national electrification plan",
      "Government support",
      "Replication potential"
    ],
    typical_requirements: [
      "Technical feasibility study",
      "Business model documentation",
      "Policy alignment letter",
      "Community engagement evidence"
    ],
    disallowed_or_risky_patterns: [
      "Countries not in program",
      "Grid-connected projects",
      "Purely private projects without public benefit"
    ],
    notes_on_alignment_to_community_ownership: "Program explicitly supports community ownership models and cooperative structures. Funded by GEF, so grant instrument with no debt implications.",
    debt_sensitivity_tier: 1,
    application_modality: "country_programs",
    website: "undp.org/africa-minigrids"
  },
  {
    id: "usadf_energy",
    funder_name: "US African Development Foundation - Energy Grants",
    instrument_type: "grant",
    geography_focus: {
      priority_countries: [],
      regions: ["Sub-Saharan Africa"],
      scope: "africa_wide"
    },
    thematic_focus: {
      primary: ["community_enterprise", "productive_use"],
      secondary: ["energy_access", "agriculture"],
      cross_cutting: ["enterprise_development", "marginalized_groups"]
    },
    typical_ticket_size_range: {
      min_usd: 50000,
      max_usd: 250000,
      notes: "Direct grants to community enterprises"
    },
    key_eligibility: [
      "100% African-owned enterprise",
      "Community-based or cooperative structure",
      "Job creation focus",
      "Sustainability pathway"
    ],
    typical_requirements: [
      "Business plan",
      "Community ownership documentation",
      "Financial projections",
      "Job creation targets"
    ],
    disallowed_or_risky_patterns: [
      "Foreign-owned enterprises",
      "Non-African beneficiaries",
      "Projects without community ownership"
    ],
    notes_on_alignment_to_community_ownership: "USADF specifically requires African and community ownership. Perfect alignment with debt-free, community-ownership principles. Direct grants to cooperatives.",
    debt_sensitivity_tier: 1,
    application_modality: "open_application",
    website: "usadf.gov"
  },
  {
    id: "sef_trust_minigrid",
    funder_name: "Sustainable Energy Fund for Africa - Mini-Grid Window",
    instrument_type: "grant",
    geography_focus: {
      priority_countries: [],
      regions: ["Africa"],
      scope: "africa_wide"
    },
    thematic_focus: {
      primary: ["mini_grids", "renewable_energy"],
      secondary: ["grid_integration", "enabling_environment"],
      cross_cutting: ["private_sector", "scale"]
    },
    typical_ticket_size_range: {
      min_usd: 500000,
      max_usd: 3000000,
      notes: "Larger projects; may co-finance with AfDB loans"
    },
    key_eligibility: [
      "African location",
      "Renewable energy focus",
      "Scale-up potential",
      "Government support"
    ],
    typical_requirements: [
      "Feasibility study",
      "Detailed business plan",
      "Financial model",
      "Government endorsement"
    ],
    disallowed_or_risky_patterns: [
      "Standalone pilots without scale pathway",
      "Fossil fuel components",
      "Projects outside Africa"
    ],
    notes_on_alignment_to_community_ownership: "SEFA supports various ownership models. Grant component can be debt-free, but often combined with AfDB loans for larger projects. Verify structure.",
    debt_sensitivity_tier: 2,
    application_modality: "periodic_calls",
    website: "afdb.org/en/topics-and-sectors/initiatives-partnerships/sustainable-energy-fund-africa"
  },
  {
    id: "shell_foundation",
    funder_name: "Shell Foundation - Access to Energy",
    instrument_type: "grant",
    geography_focus: {
      priority_countries: ["Nigeria", "Kenya", "Tanzania", "Uganda", "India"],
      regions: ["Sub-Saharan Africa", "South Asia"],
      scope: "multi_country"
    },
    thematic_focus: {
      primary: ["energy_access", "enterprise_development"],
      secondary: ["mini_grids", "productive_use", "clean_cooking"],
      cross_cutting: ["market_building", "impact_measurement"]
    },
    typical_ticket_size_range: {
      min_usd: 100000,
      max_usd: 1000000,
      notes: "Multi-year grants for enterprise development"
    },
    key_eligibility: [
      "Enterprise or social enterprise model",
      "Scale potential",
      "Strong management team",
      "Clear impact thesis"
    ],
    typical_requirements: [
      "Detailed business plan",
      "Management team CVs",
      "Financial projections",
      "Impact metrics framework"
    ],
    disallowed_or_risky_patterns: [
      "Pure charity without sustainability model",
      "Fossil fuel lock-in",
      "Weak governance"
    ],
    notes_on_alignment_to_community_ownership: "Shell Foundation supports social enterprises including community-based models. Grant instrument, but typically expects enterprise sustainability. Good for cooperatives with commercial orientation.",
    debt_sensitivity_tier: 1,
    application_modality: "invitation_based",
    website: "shellfoundation.org"
  },
  {
    id: "eu_electrifi",
    funder_name: "ElectriFI - Electrification Financing Initiative",
    instrument_type: "blended_grant_equity",
    geography_focus: {
      priority_countries: [],
      regions: ["Sub-Saharan Africa", "Southeast Asia", "Latin America"],
      scope: "global_south"
    },
    thematic_focus: {
      primary: ["energy_access", "mini_grids", "solar_home_systems"],
      secondary: ["grid_connection", "productive_use"],
      cross_cutting: ["private_sector", "market_development"]
    },
    typical_ticket_size_range: {
      min_usd: 500000,
      max_usd: 10000000,
      notes: "Blended grants, equity, and debt"
    },
    key_eligibility: [
      "Energy access business",
      "Scale potential",
      "Financial sustainability pathway",
      "Impact demonstration"
    ],
    typical_requirements: [
      "Business plan with scale pathway",
      "Financial projections (5+ years)",
      "Impact measurement framework",
      "Governance documentation"
    ],
    disallowed_or_risky_patterns: [
      "Non-viable business models",
      "Weak governance",
      "Fossil fuel components"
    ],
    notes_on_alignment_to_community_ownership: "ElectriFI prefers private sector focus. Community cooperatives may qualify if structured commercially. Blended structure means some components may not be grants. Evaluate carefully.",
    debt_sensitivity_tier: 3,
    application_modality: "ongoing",
    website: "electrifi.eu"
  },
  {
    id: "rockefeller_foundation",
    funder_name: "Rockefeller Foundation - Power for Climate",
    instrument_type: "grant",
    geography_focus: {
      priority_countries: ["Nigeria", "Kenya", "Uganda", "India"],
      regions: ["Sub-Saharan Africa", "South Asia"],
      scope: "multi_country"
    },
    thematic_focus: {
      primary: ["distributed_renewables", "mini_grids", "grid_reliability"],
      secondary: ["productive_use", "health_energy_nexus"],
      cross_cutting: ["climate", "equity", "systems_change"]
    },
    typical_ticket_size_range: {
      min_usd: 250000,
      max_usd: 5000000,
      notes: "Strategic grants for systems change"
    },
    key_eligibility: [
      "Alignment with Foundation strategy",
      "Systems change potential",
      "Strong track record",
      "Replication pathway"
    ],
    typical_requirements: [
      "Concept note (usually invited)",
      "Theory of change",
      "Detailed budget",
      "MEL framework"
    ],
    disallowed_or_risky_patterns: [
      "Pure service delivery without innovation",
      "Weak institutional capacity",
      "Single-site pilots without learning"
    ],
    notes_on_alignment_to_community_ownership: "Rockefeller supports community-focused models. Strong interest in public goods and equity. Grant instrument with no debt implications. May be harder to access directly.",
    debt_sensitivity_tier: 1,
    application_modality: "invitation_based",
    website: "rockefellerfoundation.org/initiative/power"
  },
  {
    id: "ikea_foundation_energy",
    funder_name: "IKEA Foundation - Renewable Energy",
    instrument_type: "grant",
    geography_focus: {
      priority_countries: ["Kenya", "Uganda", "Ethiopia", "Rwanda", "Tanzania"],
      regions: ["East Africa", "Sub-Saharan Africa"],
      scope: "multi_country"
    },
    thematic_focus: {
      primary: ["renewable_energy", "energy_access", "refugee_settings"],
      secondary: ["productive_use", "livelihoods"],
      cross_cutting: ["climate", "displacement", "poverty"]
    },
    typical_ticket_size_range: {
      min_usd: 500000,
      max_usd: 10000000,
      notes: "Large multi-year grants through partners"
    },
    key_eligibility: [
      "Focus on poverty reduction",
      "Climate and renewable energy alignment",
      "Strong implementation partner",
      "Systems change approach"
    ],
    typical_requirements: [
      "Concept note (usually invited)",
      "Theory of change",
      "Detailed implementation plan",
      "MEL framework"
    ],
    disallowed_or_risky_patterns: [
      "Fossil fuel components",
      "Weak poverty focus",
      "Single-site projects without scale"
    ],
    notes_on_alignment_to_community_ownership: "IKEA Foundation strongly supports community ownership and local solutions. Focus on reaching the poorest and most marginalized. Pure grant funding with no debt.",
    debt_sensitivity_tier: 1,
    application_modality: "invitation_based",
    website: "ikeafoundation.org"
  },
  {
    id: "uk_fcdo_energy",
    funder_name: "UK FCDO - Energy Access Programs",
    instrument_type: "grant",
    geography_focus: {
      priority_countries: ["Nigeria", "Kenya", "Tanzania", "Uganda", "Ethiopia", "Ghana", "Sierra Leone"],
      regions: ["Sub-Saharan Africa", "South Asia"],
      scope: "multi_country"
    },
    thematic_focus: {
      primary: ["energy_access", "clean_cooking", "mini_grids"],
      secondary: ["productive_use", "health_energy_nexus"],
      cross_cutting: ["gender", "climate", "poverty"]
    },
    typical_ticket_size_range: {
      min_usd: 100000,
      max_usd: 5000000,
      notes: "Through implementing partners and country programs"
    },
    key_eligibility: [
      "UK aid priority country",
      "Poverty focus",
      "Gender integration",
      "Value for money demonstration"
    ],
    typical_requirements: [
      "Logical framework",
      "Value for money analysis",
      "Risk assessment",
      "Gender equality strategy"
    ],
    disallowed_or_risky_patterns: [
      "Non-priority countries",
      "Weak poverty focus",
      "Projects without gender consideration"
    ],
    notes_on_alignment_to_community_ownership: "FCDO supports community-based approaches and local ownership. Strong emphasis on sustainability and value for money. Grant instrument avoids debt creation.",
    debt_sensitivity_tier: 1,
    application_modality: "through_partners",
    website: "gov.uk/guidance/energy-and-infrastructure"
  },
  {
    id: "giz_energize_africa",
    funder_name: "GIZ - Energising Africa",
    instrument_type: "grant",
    geography_focus: {
      priority_countries: ["Ghana", "Senegal", "Benin", "Nigeria", "Kenya", "Uganda", "Tanzania", "Mozambique"],
      regions: ["West Africa", "East Africa", "Southern Africa"],
      scope: "africa_wide"
    },
    thematic_focus: {
      primary: ["energy_access", "renewable_energy", "productive_use"],
      secondary: ["mini_grids", "grid_integration"],
      cross_cutting: ["employment", "gender", "climate"]
    },
    typical_ticket_size_range: {
      min_usd: 50000,
      max_usd: 2000000,
      notes: "Technical assistance and investment grants"
    },
    key_eligibility: [
      "German development cooperation partner country",
      "Alignment with national energy plans",
      "Local partner involvement",
      "Sustainability pathway"
    ],
    typical_requirements: [
      "Project proposal",
      "Local partnership documentation",
      "Technical specifications",
      "Sustainability plan"
    ],
    disallowed_or_risky_patterns: [
      "Non-partner countries",
      "Purely commercial without development impact",
      "Projects without local ownership component"
    ],
    notes_on_alignment_to_community_ownership: "GIZ strongly supports community ownership and cooperative models. Technical assistance often focuses on capacity building for local management. Grant-based with no debt.",
    debt_sensitivity_tier: 1,
    application_modality: "country_programs",
    website: "giz.de/en/worldwide/energy.html"
  },
  {
    id: "world_bank_esmap",
    funder_name: "World Bank ESMAP - Energy Sector Management Assistance Program",
    instrument_type: "grant",
    geography_focus: {
      priority_countries: [],
      regions: ["Sub-Saharan Africa", "South Asia", "Southeast Asia"],
      scope: "global_south"
    },
    thematic_focus: {
      primary: ["energy_access", "clean_cooking", "renewable_energy"],
      secondary: ["mini_grids", "policy_support", "data"],
      cross_cutting: ["gender", "climate", "analytics"]
    },
    typical_ticket_size_range: {
      min_usd: 100000,
      max_usd: 3000000,
      notes: "Technical assistance and pilot grants"
    },
    key_eligibility: [
      "World Bank client country",
      "Government engagement",
      "Policy relevance",
      "Replication potential"
    ],
    typical_requirements: [
      "Government request or endorsement",
      "Technical concept note",
      "Alignment with country energy strategy",
      "Knowledge sharing commitment"
    ],
    disallowed_or_risky_patterns: [
      "Projects without government support",
      "Pure commercial projects",
      "No policy relevance"
    ],
    notes_on_alignment_to_community_ownership: "ESMAP is a grant facility (not loans). Supports analytical work and pilots that inform larger investments. Can support community ownership models through technical assistance.",
    debt_sensitivity_tier: 1,
    application_modality: "government_request",
    website: "esmap.org"
  },
  {
    id: "afd_sunref",
    funder_name: "AFD SUNREF - Sustainable Use of Natural Resources and Energy Finance",
    instrument_type: "blended_grant_loan",
    geography_focus: {
      priority_countries: ["Kenya", "Nigeria", "South Africa", "Senegal", "Côte d'Ivoire", "Ghana"],
      regions: ["Sub-Saharan Africa"],
      scope: "africa_wide"
    },
    thematic_focus: {
      primary: ["renewable_energy", "energy_efficiency"],
      secondary: ["green_buildings", "sustainable_agriculture"],
      cross_cutting: ["climate", "private_sector"]
    },
    typical_ticket_size_range: {
      min_usd: 50000,
      max_usd: 5000000,
      notes: "Credit lines through local banks with grant incentives"
    },
    key_eligibility: [
      "Country with SUNREF program",
      "Through participating financial institution",
      "Renewable energy or efficiency project",
      "Technical eligibility verification"
    ],
    typical_requirements: [
      "Application through local bank",
      "Technical eligibility assessment",
      "Business plan",
      "Environmental screening"
    ],
    disallowed_or_risky_patterns: [
      "Countries without SUNREF presence",
      "Non-eligible technologies",
      "Projects without bankability"
    ],
    notes_on_alignment_to_community_ownership: "SUNREF includes grant incentives (subsidy) on top of loans. Cooperative or community projects may access if bankable. Grant component reduces effective debt burden.",
    debt_sensitivity_tier: 3,
    application_modality: "through_banks",
    website: "afd.fr/en/sunref"
  },
  {
    id: "clean_cooking_alliance",
    funder_name: "Clean Cooking Alliance",
    instrument_type: "grant",
    geography_focus: {
      priority_countries: ["Kenya", "Nigeria", "Ghana", "Uganda", "Ethiopia", "Tanzania"],
      regions: ["Sub-Saharan Africa", "South Asia"],
      scope: "multi_country"
    },
    thematic_focus: {
      primary: ["clean_cooking", "improved_cookstoves"],
      secondary: ["behavior_change", "market_development"],
      cross_cutting: ["gender", "health", "climate"]
    },
    typical_ticket_size_range: {
      min_usd: 50000,
      max_usd: 1000000,
      notes: "Various grant windows and challenges"
    },
    key_eligibility: [
      "Clean cooking focus",
      "ISO/IWA tiers compliance",
      "Market-based approach",
      "Gender integration"
    ],
    typical_requirements: [
      "Product/technology specifications",
      "Market assessment",
      "Distribution strategy",
      "Gender strategy"
    ],
    disallowed_or_risky_patterns: [
      "Traditional stoves without efficiency improvement",
      "Non-market approaches",
      "Weak gender consideration"
    ],
    notes_on_alignment_to_community_ownership: "CCA supports social enterprises and community-based distribution. Strong focus on women as entrepreneurs. Grant funding with no debt implications.",
    debt_sensitivity_tier: 1,
    application_modality: "periodic_calls",
    website: "cleancooking.org"
  },
  {
    id: "nama_facility",
    funder_name: "NAMA Facility",
    instrument_type: "grant",
    geography_focus: {
      priority_countries: [],
      regions: ["Africa", "Asia", "Latin America"],
      scope: "global_south"
    },
    thematic_focus: {
      primary: ["climate_mitigation", "energy_transition"],
      secondary: ["renewable_energy", "energy_efficiency", "transport"],
      cross_cutting: ["NDC_implementation", "transformational_change"]
    },
    typical_ticket_size_range: {
      min_usd: 5000000,
      max_usd: 20000000,
      notes: "Large-scale transformational projects"
    },
    key_eligibility: [
      "Government involvement (NAMA framework)",
      "Transformational impact potential",
      "Alignment with NDC",
      "GHG reduction quantification"
    ],
    typical_requirements: [
      "NAMA outline",
      "Government endorsement",
      "GHG baseline and projections",
      "MRV system design"
    ],
    disallowed_or_risky_patterns: [
      "Small standalone projects",
      "Weak government ownership",
      "No clear climate impact"
    ],
    notes_on_alignment_to_community_ownership: "NAMA Facility can support community energy programs if framed as national NAMA. Requires government partnership. Grant instrument with no debt to recipient country.",
    debt_sensitivity_tier: 1,
    application_modality: "periodic_calls",
    website: "nama-facility.org"
  },
  {
    id: "cif_srep",
    funder_name: "Climate Investment Funds - SREP (Scaling Up Renewable Energy Program)",
    instrument_type: "grant",
    geography_focus: {
      priority_countries: ["Ethiopia", "Kenya", "Liberia", "Mali", "Rwanda", "Tanzania"],
      regions: ["Sub-Saharan Africa", "South Asia", "Pacific"],
      scope: "pilot_countries"
    },
    thematic_focus: {
      primary: ["renewable_energy", "energy_access"],
      secondary: ["mini_grids", "grid_connected_renewables"],
      cross_cutting: ["climate", "private_sector_mobilization"]
    },
    typical_ticket_size_range: {
      min_usd: 1000000,
      max_usd: 25000000,
      notes: "Through MDB implementing partners"
    },
    key_eligibility: [
      "SREP pilot country",
      "Government-endorsed investment plan",
      "Through MDB (World Bank, AfDB, etc.)",
      "Renewable energy focus"
    ],
    typical_requirements: [
      "SREP Investment Plan alignment",
      "Government endorsement",
      "MDB project preparation",
      "Results framework"
    ],
    disallowed_or_risky_patterns: [
      "Non-SREP countries",
      "Fossil fuel components",
      "Projects outside investment plan"
    ],
    notes_on_alignment_to_community_ownership: "SREP provides concessional funds that can be grants for public/community projects. Implemented through MDBs but can support community ownership if in investment plan.",
    debt_sensitivity_tier: 2,
    application_modality: "country_investment_plans",
    website: "cif.org/topics/energy-access"
  },
  {
    id: "arei",
    funder_name: "Africa Renewable Energy Initiative (AREI)",
    instrument_type: "grant",
    geography_focus: {
      priority_countries: [],
      regions: ["Africa"],
      scope: "africa_wide"
    },
    thematic_focus: {
      primary: ["renewable_energy", "energy_access"],
      secondary: ["grid_connected", "off_grid"],
      cross_cutting: ["climate", "NDC_support"]
    },
    typical_ticket_size_range: {
      min_usd: 500000,
      max_usd: 10000000,
      notes: "Varies by delivery partner"
    },
    key_eligibility: [
      "African Union member state",
      "Renewable energy project",
      "Government support",
      "Transformative impact"
    ],
    typical_requirements: [
      "Project concept note",
      "Government endorsement",
      "Technical feasibility",
      "Development impact assessment"
    ],
    disallowed_or_risky_patterns: [
      "Non-African countries",
      "Fossil fuel projects",
      "Purely commercial without development focus"
    ],
    notes_on_alignment_to_community_ownership: "AREI supports African-owned renewable energy development. Can support community and public ownership models. Coordinates multiple funding sources.",
    debt_sensitivity_tier: 1,
    application_modality: "through_partners",
    website: "afrec-energy.org/arei"
  },
  {
    id: "gogla_consumer_finance",
    funder_name: "GOGLA - Off-Grid Solar Market Development",
    instrument_type: "grant",
    geography_focus: {
      priority_countries: ["Kenya", "Tanzania", "Uganda", "Nigeria", "Ghana", "Senegal", "Rwanda"],
      regions: ["Sub-Saharan Africa", "South Asia"],
      scope: "multi_country"
    },
    thematic_focus: {
      primary: ["solar_home_systems", "productive_use_appliances"],
      secondary: ["consumer_finance", "market_data"],
      cross_cutting: ["quality_standards", "consumer_protection"]
    },
    typical_ticket_size_range: {
      min_usd: 25000,
      max_usd: 500000,
      notes: "Various programs including market development grants"
    },
    key_eligibility: [
      "Off-grid solar focus",
      "Quality verified products (VeraSol)",
      "Market development orientation",
      "Industry engagement"
    ],
    typical_requirements: [
      "Company/organization profile",
      "Product quality certification",
      "Market development plan",
      "Impact metrics"
    ],
    disallowed_or_risky_patterns: [
      "Non-quality-verified products",
      "Grid-connected only",
      "No market development component"
    ],
    notes_on_alignment_to_community_ownership: "GOGLA supports various business models including community distribution. Market development grants can support cooperative approaches. Industry association with multiple funding programs.",
    debt_sensitivity_tier: 1,
    application_modality: "periodic_calls",
    website: "gogla.org"
  },
  // ============================================================================
  // SOUTHERN AFRICA FOCUSED
  // ============================================================================
  {
    id: "dbsa_climate_finance",
    funder_name: "Development Bank of Southern Africa (DBSA) - Climate Finance Facility",
    instrument_type: "grant",
    geography_focus: {
      priority_countries: ["South Africa", "Lesotho", "Eswatini", "Namibia", "Botswana", "Zimbabwe", "Zambia", "Malawi", "Mozambique"],
      regions: ["Southern Africa", "SADC"],
      scope: "southern_africa"
    },
    thematic_focus: {
      primary: ["climate_mitigation", "renewable_energy", "energy_efficiency"],
      secondary: ["adaptation", "green_infrastructure"],
      cross_cutting: ["climate", "jobs", "transformation"]
    },
    typical_ticket_size_range: {
      min_usd: 500000,
      max_usd: 10000000,
      notes: "Climate finance facility with grant and concessional components"
    },
    key_eligibility: [
      "SADC member state location",
      "Clear climate impact",
      "Developmental impact demonstration",
      "Financial sustainability pathway"
    ],
    typical_requirements: [
      "Climate impact assessment",
      "Feasibility study",
      "Development impact metrics",
      "Implementation capacity"
    ],
    disallowed_or_risky_patterns: [
      "Non-SADC countries",
      "Fossil fuel projects",
      "Weak climate rationale"
    ],
    notes_on_alignment_to_community_ownership: "DBSA supports developmental projects including community-owned infrastructure. Climate Finance Facility provides grant components that avoid debt burden.",
    debt_sensitivity_tier: 2,
    application_modality: "ongoing",
    website: "dbsa.org"
  },
  {
    id: "sadc_energy_fund",
    funder_name: "SADC Regional Energy Access Fund",
    instrument_type: "grant",
    geography_focus: {
      priority_countries: ["Angola", "Botswana", "DRC", "Eswatini", "Lesotho", "Madagascar", "Malawi", "Mauritius", "Mozambique", "Namibia", "Seychelles", "South Africa", "Tanzania", "Zambia", "Zimbabwe"],
      regions: ["Southern Africa", "SADC"],
      scope: "southern_africa"
    },
    thematic_focus: {
      primary: ["energy_access", "regional_integration", "renewable_energy"],
      secondary: ["mini_grids", "cross_border_trade"],
      cross_cutting: ["regional_cooperation", "harmonization"]
    },
    typical_ticket_size_range: {
      min_usd: 100000,
      max_usd: 5000000,
      notes: "Regional projects prioritized"
    },
    key_eligibility: [
      "SADC member state",
      "Alignment with SADC energy protocols",
      "Government endorsement",
      "Regional benefit demonstration"
    ],
    typical_requirements: [
      "Project proposal",
      "Government support letter",
      "Regional impact assessment",
      "Implementation plan"
    ],
    disallowed_or_risky_patterns: [
      "Non-SADC countries",
      "Purely national projects without regional dimension",
      "Fossil fuel expansion"
    ],
    notes_on_alignment_to_community_ownership: "SADC fund supports public and community ownership models. Regional focus means cross-border community projects are welcomed.",
    debt_sensitivity_tier: 1,
    application_modality: "periodic_calls",
    website: "sadc.int/pillars/infrastructure/energy"
  },
  {
    id: "beyond_the_grid_zambia",
    funder_name: "Beyond the Grid Fund for Africa - Zambia",
    instrument_type: "results_based_grant",
    geography_focus: {
      priority_countries: ["Zambia", "Mozambique", "Uganda", "Burkina Faso", "Liberia"],
      regions: ["Southern Africa", "East Africa", "West Africa"],
      scope: "multi_country"
    },
    thematic_focus: {
      primary: ["off_grid_energy", "solar_home_systems", "mini_grids"],
      secondary: ["productive_use", "clean_cooking"],
      cross_cutting: ["market_development", "last_mile"]
    },
    typical_ticket_size_range: {
      min_usd: 100000,
      max_usd: 3000000,
      notes: "Results-based financing per verified connection"
    },
    key_eligibility: [
      "BGFA country presence",
      "Off-grid energy focus",
      "Pro-poor targeting",
      "Ability to pre-finance"
    ],
    typical_requirements: [
      "Business plan",
      "Connection targets",
      "Verification methodology",
      "Pre-financing capacity"
    ],
    disallowed_or_risky_patterns: [
      "Non-BGFA countries",
      "Grid-connected only",
      "No pre-financing capacity"
    ],
    notes_on_alignment_to_community_ownership: "BGFA supports various business models. Community cooperatives can access if they have pre-financing capacity. RBF structure reduces debt risk.",
    debt_sensitivity_tier: 2,
    application_modality: "periodic_calls",
    website: "beyondthegrid.africa"
  },
  // ============================================================================
  // EAST AFRICA FOCUSED
  // ============================================================================
  {
    id: "eadb_energy",
    funder_name: "East African Development Bank - Renewable Energy Program",
    instrument_type: "grant",
    geography_focus: {
      priority_countries: ["Kenya", "Uganda", "Tanzania", "Rwanda", "Burundi", "South Sudan"],
      regions: ["East Africa", "EAC"],
      scope: "east_africa"
    },
    thematic_focus: {
      primary: ["renewable_energy", "energy_access"],
      secondary: ["regional_integration", "private_sector"],
      cross_cutting: ["climate", "regional_trade"]
    },
    typical_ticket_size_range: {
      min_usd: 200000,
      max_usd: 5000000,
      notes: "Grant windows available alongside lending"
    },
    key_eligibility: [
      "EAC member state",
      "Renewable energy focus",
      "Development impact",
      "Financial viability"
    ],
    typical_requirements: [
      "Feasibility study",
      "Business plan",
      "Environmental assessment",
      "Government support"
    ],
    disallowed_or_risky_patterns: [
      "Non-EAC countries",
      "Fossil fuel projects",
      "Non-developmental focus"
    ],
    notes_on_alignment_to_community_ownership: "EADB has grant facilities that can support community projects. Regional bank with understanding of local ownership models.",
    debt_sensitivity_tier: 2,
    application_modality: "ongoing",
    website: "eadb.org"
  },
  {
    id: "sunfunder_east_africa",
    funder_name: "SunFunder - East Africa Solar Debt Fund",
    instrument_type: "blended_grant_loan",
    geography_focus: {
      priority_countries: ["Kenya", "Tanzania", "Uganda", "Rwanda", "Ethiopia"],
      regions: ["East Africa"],
      scope: "east_africa"
    },
    thematic_focus: {
      primary: ["solar_energy", "off_grid", "C&I_solar"],
      secondary: ["mini_grids", "productive_use"],
      cross_cutting: ["market_building", "local_currency"]
    },
    typical_ticket_size_range: {
      min_usd: 100000,
      max_usd: 5000000,
      notes: "Debt financing with some grant components for TA"
    },
    key_eligibility: [
      "Solar energy business",
      "East Africa operations",
      "Track record",
      "Bankable business model"
    ],
    typical_requirements: [
      "Financial statements",
      "Business plan",
      "Technical specifications",
      "Management team"
    ],
    disallowed_or_risky_patterns: [
      "Early stage without track record",
      "Non-solar focus",
      "Weak financials"
    ],
    notes_on_alignment_to_community_ownership: "SunFunder primarily supports commercial solar businesses. Community enterprises may access if commercially structured. Some TA grants available.",
    debt_sensitivity_tier: 3,
    application_modality: "ongoing",
    website: "sunfunder.com"
  },
  {
    id: "ethiopia_one_wash",
    funder_name: "Ethiopia One WASH Plus - Energy Component",
    instrument_type: "grant",
    geography_focus: {
      priority_countries: ["Ethiopia"],
      regions: ["East Africa"],
      scope: "single_country"
    },
    thematic_focus: {
      primary: ["water_energy_nexus", "solar_pumping", "health_facilities"],
      secondary: ["WASH", "rural_development"],
      cross_cutting: ["health", "gender", "climate"]
    },
    typical_ticket_size_range: {
      min_usd: 50000,
      max_usd: 500000,
      notes: "Through implementing partners"
    },
    key_eligibility: [
      "Ethiopia location",
      "WASH or health facility focus",
      "Government coordination",
      "Community engagement"
    ],
    typical_requirements: [
      "Site assessment",
      "Community engagement plan",
      "Government coordination",
      "Technical design"
    ],
    disallowed_or_risky_patterns: [
      "Non-Ethiopia projects",
      "Non-WASH/health applications",
      "Weak community engagement"
    ],
    notes_on_alignment_to_community_ownership: "One WASH supports community-managed infrastructure. Solar water pumping and health facility electrification with community ownership.",
    debt_sensitivity_tier: 1,
    application_modality: "through_partners",
    website: "onewash.gov.et"
  },
  // ============================================================================
  // CENTRAL AFRICA FOCUSED
  // ============================================================================
  {
    id: "cafi_drc",
    funder_name: "Central African Forest Initiative (CAFI) - DRC Energy Program",
    instrument_type: "grant",
    geography_focus: {
      priority_countries: ["DRC", "Gabon", "Republic of Congo", "Cameroon", "Central African Republic", "Equatorial Guinea"],
      regions: ["Central Africa", "Congo Basin"],
      scope: "central_africa"
    },
    thematic_focus: {
      primary: ["clean_cooking", "sustainable_forestry", "reduced_deforestation"],
      secondary: ["renewable_energy", "community_forestry"],
      cross_cutting: ["climate", "biodiversity", "indigenous_peoples"]
    },
    typical_ticket_size_range: {
      min_usd: 500000,
      max_usd: 20000000,
      notes: "Large programs through government and NGO partners"
    },
    key_eligibility: [
      "Congo Basin country",
      "Deforestation reduction link",
      "Government partnership",
      "FPIC compliance"
    ],
    typical_requirements: [
      "Deforestation baseline",
      "FPIC documentation",
      "Government endorsement",
      "Safeguards compliance"
    ],
    disallowed_or_risky_patterns: [
      "Projects increasing deforestation",
      "Weak indigenous peoples engagement",
      "Non-forest-linked energy"
    ],
    notes_on_alignment_to_community_ownership: "CAFI strongly supports community and indigenous ownership. Clean cooking programs explicitly target community-managed solutions.",
    debt_sensitivity_tier: 1,
    application_modality: "country_programs",
    website: "cafi.org"
  },
  {
    id: "bdeac_energy",
    funder_name: "Development Bank of Central African States (BDEAC) - Energy Window",
    instrument_type: "blended_grant_loan",
    geography_focus: {
      priority_countries: ["Cameroon", "Central African Republic", "Chad", "Republic of Congo", "Equatorial Guinea", "Gabon"],
      regions: ["Central Africa", "CEMAC"],
      scope: "central_africa"
    },
    thematic_focus: {
      primary: ["energy_infrastructure", "renewable_energy"],
      secondary: ["regional_integration", "electrification"],
      cross_cutting: ["regional_development", "economic_integration"]
    },
    typical_ticket_size_range: {
      min_usd: 500000,
      max_usd: 15000000,
      notes: "Larger infrastructure projects with grant components"
    },
    key_eligibility: [
      "CEMAC member state",
      "Energy infrastructure focus",
      "Government support",
      "Regional benefit"
    ],
    typical_requirements: [
      "Feasibility study",
      "Government guarantee or support",
      "Environmental assessment",
      "Financial projections"
    ],
    disallowed_or_risky_patterns: [
      "Non-CEMAC countries",
      "Purely commercial without development focus",
      "Environmentally harmful projects"
    ],
    notes_on_alignment_to_community_ownership: "BDEAC can support community infrastructure through grant windows. Regional bank understands local contexts.",
    debt_sensitivity_tier: 3,
    application_modality: "ongoing",
    website: "bdeac.org"
  },
  // ============================================================================
  // NORTH AFRICA FOCUSED
  // ============================================================================
  {
    id: "ebrd_semed_green",
    funder_name: "EBRD SEMED Green Economy Financing Facility",
    instrument_type: "blended_grant_loan",
    geography_focus: {
      priority_countries: ["Egypt", "Morocco", "Tunisia", "Jordan"],
      regions: ["North Africa", "MENA", "Southern Mediterranean"],
      scope: "north_africa_mena"
    },
    thematic_focus: {
      primary: ["renewable_energy", "energy_efficiency", "green_economy"],
      secondary: ["SME_finance", "residential_solar"],
      cross_cutting: ["climate", "private_sector", "green_transition"]
    },
    typical_ticket_size_range: {
      min_usd: 50000,
      max_usd: 2000000,
      notes: "Through local partner financial institutions"
    },
    key_eligibility: [
      "EBRD country of operations",
      "Green economy focus",
      "Through participating bank",
      "Technical eligibility verification"
    ],
    typical_requirements: [
      "Application through local bank",
      "Green eligibility verification",
      "Business plan",
      "Technical assessment"
    ],
    disallowed_or_risky_patterns: [
      "Non-eligible countries",
      "Non-green investments",
      "Fossil fuel related"
    ],
    notes_on_alignment_to_community_ownership: "GEFF includes grant incentives on top of financing. Can support community energy if structured through eligible financial institutions.",
    debt_sensitivity_tier: 3,
    application_modality: "through_banks",
    website: "ebrdgeff.com"
  },
  {
    id: "morocco_masen",
    funder_name: "MASEN - Moroccan Agency for Sustainable Energy",
    instrument_type: "grant",
    geography_focus: {
      priority_countries: ["Morocco"],
      regions: ["North Africa"],
      scope: "single_country"
    },
    thematic_focus: {
      primary: ["renewable_energy", "solar", "wind"],
      secondary: ["rural_electrification", "research_development"],
      cross_cutting: ["energy_transition", "technology_transfer"]
    },
    typical_ticket_size_range: {
      min_usd: 100000,
      max_usd: 10000000,
      notes: "Various programs including rural electrification"
    },
    key_eligibility: [
      "Morocco location",
      "Renewable energy focus",
      "Technical feasibility",
      "Alignment with national strategy"
    ],
    typical_requirements: [
      "Technical proposal",
      "Site assessment",
      "Grid connection plan (if applicable)",
      "Environmental assessment"
    ],
    disallowed_or_risky_patterns: [
      "Non-Morocco projects",
      "Fossil fuel components",
      "Non-aligned with national strategy"
    ],
    notes_on_alignment_to_community_ownership: "MASEN supports rural electrification including community-scale projects. Government agency with grant programs.",
    debt_sensitivity_tier: 1,
    application_modality: "periodic_calls",
    website: "masen.ma"
  },
  {
    id: "egypt_nrea",
    funder_name: "Egypt New and Renewable Energy Authority (NREA) - Rural Program",
    instrument_type: "grant",
    geography_focus: {
      priority_countries: ["Egypt"],
      regions: ["North Africa"],
      scope: "single_country"
    },
    thematic_focus: {
      primary: ["renewable_energy", "rural_electrification", "solar"],
      secondary: ["wind", "biogas"],
      cross_cutting: ["energy_access", "rural_development"]
    },
    typical_ticket_size_range: {
      min_usd: 50000,
      max_usd: 2000000,
      notes: "Government co-funding programs"
    },
    key_eligibility: [
      "Egypt location",
      "Renewable energy technology",
      "Rural/underserved focus",
      "Technical standards compliance"
    ],
    typical_requirements: [
      "Technical design",
      "Site assessment",
      "Community engagement",
      "Local partner"
    ],
    disallowed_or_risky_patterns: [
      "Urban commercial projects",
      "Non-renewable technologies",
      "Non-Egypt locations"
    ],
    notes_on_alignment_to_community_ownership: "NREA supports rural community electrification. Government programs with grant components for underserved areas.",
    debt_sensitivity_tier: 1,
    application_modality: "government_programs",
    website: "nrea.gov.eg"
  },
  // ============================================================================
  // PAN-AFRICAN / CONTINENT-WIDE
  // ============================================================================
  {
    id: "afd_choose_africa",
    funder_name: "AFD Choose Africa - Resilience Facility",
    instrument_type: "grant",
    geography_focus: {
      priority_countries: [],
      regions: ["Sub-Saharan Africa", "North Africa"],
      scope: "africa_wide"
    },
    thematic_focus: {
      primary: ["SME_support", "resilience", "green_economy"],
      secondary: ["renewable_energy", "climate_adaptation"],
      cross_cutting: ["employment", "gender", "youth"]
    },
    typical_ticket_size_range: {
      min_usd: 50000,
      max_usd: 1000000,
      notes: "SME-focused grants and technical assistance"
    },
    key_eligibility: [
      "African location",
      "SME or social enterprise",
      "Resilience/green focus",
      "Job creation potential"
    ],
    typical_requirements: [
      "Business plan",
      "Job creation projections",
      "Green/resilience rationale",
      "Financial projections"
    ],
    disallowed_or_risky_patterns: [
      "Large corporations",
      "Non-African operations",
      "Environmentally harmful"
    ],
    notes_on_alignment_to_community_ownership: "Choose Africa supports SMEs and social enterprises including community-owned businesses. Grant facility with focus on resilience.",
    debt_sensitivity_tier: 1,
    application_modality: "ongoing",
    website: "choose-africa.com"
  },
  {
    id: "afdb_fapa",
    funder_name: "AfDB Fund for African Private Sector Assistance (FAPA)",
    instrument_type: "grant",
    geography_focus: {
      priority_countries: [],
      regions: ["Africa"],
      scope: "africa_wide"
    },
    thematic_focus: {
      primary: ["private_sector_development", "SME_support", "capacity_building"],
      secondary: ["energy", "agriculture", "infrastructure"],
      cross_cutting: ["fragile_states", "gender", "youth"]
    },
    typical_ticket_size_range: {
      min_usd: 100000,
      max_usd: 2000000,
      notes: "Technical assistance and capacity building grants"
    },
    key_eligibility: [
      "African location",
      "Private sector development focus",
      "Capacity building component",
      "AfDB Regional Member Country"
    ],
    typical_requirements: [
      "TA proposal",
      "Capacity building plan",
      "Beneficiary identification",
      "Results framework"
    ],
    disallowed_or_risky_patterns: [
      "Non-African beneficiaries",
      "No capacity building component",
      "Pure infrastructure without TA"
    ],
    notes_on_alignment_to_community_ownership: "FAPA supports capacity building for enterprises including cooperatives. Technical assistance grants with no debt.",
    debt_sensitivity_tier: 1,
    application_modality: "ongoing",
    website: "afdb.org/en/topics-and-sectors/initiatives-partnerships/fund-for-african-private-sector-assistance"
  },
  {
    id: "african_guarantee_fund",
    funder_name: "African Guarantee Fund - Green Guarantee",
    instrument_type: "guarantee",
    geography_focus: {
      priority_countries: [],
      regions: ["Africa"],
      scope: "africa_wide"
    },
    thematic_focus: {
      primary: ["SME_finance", "green_economy", "renewable_energy"],
      secondary: ["energy_efficiency", "climate_adaptation"],
      cross_cutting: ["financial_inclusion", "women_entrepreneurs"]
    },
    typical_ticket_size_range: {
      min_usd: 50000,
      max_usd: 5000000,
      notes: "Guarantees that enable bank lending to SMEs"
    },
    key_eligibility: [
      "African SME",
      "Through partner financial institution",
      "Green investment focus",
      "Business viability"
    ],
    typical_requirements: [
      "Bank loan application",
      "Business plan",
      "Green eligibility verification",
      "Collateral (reduced with guarantee)"
    ],
    disallowed_or_risky_patterns: [
      "Non-African businesses",
      "Large corporates",
      "Non-green investments"
    ],
    notes_on_alignment_to_community_ownership: "AGF guarantees enable SMEs including community enterprises to access bank loans. Reduces debt burden through lower collateral requirements.",
    debt_sensitivity_tier: 2,
    application_modality: "through_banks",
    website: "africanguaranteefund.com"
  },
  {
    id: "africa50_project_dev",
    funder_name: "Africa50 - Project Development Fund",
    instrument_type: "grant",
    geography_focus: {
      priority_countries: [],
      regions: ["Africa"],
      scope: "africa_wide"
    },
    thematic_focus: {
      primary: ["infrastructure", "renewable_energy", "project_preparation"],
      secondary: ["transport", "ICT", "water"],
      cross_cutting: ["bankability", "scale", "regional_integration"]
    },
    typical_ticket_size_range: {
      min_usd: 500000,
      max_usd: 5000000,
      notes: "Project preparation and development grants"
    },
    key_eligibility: [
      "African Union member state",
      "Infrastructure project",
      "Scale potential",
      "Transformative impact"
    ],
    typical_requirements: [
      "Project concept",
      "Pre-feasibility study",
      "Government support",
      "Scale-up pathway"
    ],
    disallowed_or_risky_patterns: [
      "Small standalone projects",
      "Non-African locations",
      "Non-infrastructure focus"
    ],
    notes_on_alignment_to_community_ownership: "Africa50 Project Development provides early-stage grant funding to make projects bankable. Can support community infrastructure at scale.",
    debt_sensitivity_tier: 1,
    application_modality: "ongoing",
    website: "africa50.com"
  },
  {
    id: "acumen_africa",
    funder_name: "Acumen - Africa Energy Portfolio",
    instrument_type: "blended_grant_equity",
    geography_focus: {
      priority_countries: ["Kenya", "Uganda", "Nigeria", "Ghana", "Tanzania", "Rwanda"],
      regions: ["East Africa", "West Africa"],
      scope: "multi_country"
    },
    thematic_focus: {
      primary: ["energy_access", "off_grid", "clean_cooking"],
      secondary: ["productive_use", "enterprise_development"],
      cross_cutting: ["poverty", "impact_investing", "patient_capital"]
    },
    typical_ticket_size_range: {
      min_usd: 250000,
      max_usd: 3000000,
      notes: "Patient capital with long time horizons"
    },
    key_eligibility: [
      "Social enterprise model",
      "Poverty focus",
      "Scalable solution",
      "Strong leadership"
    ],
    typical_requirements: [
      "Business plan",
      "Impact thesis",
      "Leadership team",
      "Scale pathway"
    ],
    disallowed_or_risky_patterns: [
      "Pure profit maximization",
      "Weak poverty focus",
      "Non-scalable models"
    ],
    notes_on_alignment_to_community_ownership: "Acumen supports social enterprises including community-oriented models. Patient capital approach with long-term view. Some grant capital available.",
    debt_sensitivity_tier: 2,
    application_modality: "ongoing",
    website: "acumen.org"
  },
  {
    id: "we_care_solar",
    funder_name: "We Care Solar - Solar Suitcase Program",
    instrument_type: "grant",
    geography_focus: {
      priority_countries: ["Uganda", "Liberia", "Sierra Leone", "Malawi", "Zimbabwe", "Ethiopia", "Philippines"],
      regions: ["Sub-Saharan Africa", "Southeast Asia"],
      scope: "multi_country"
    },
    thematic_focus: {
      primary: ["health_facility_electrification", "maternal_health"],
      secondary: ["solar_standalone", "medical_equipment"],
      cross_cutting: ["health", "gender", "SDGs"]
    },
    typical_ticket_size_range: {
      min_usd: 5000,
      max_usd: 500000,
      notes: "Solar suitcase units at ~$1,500 each plus installation"
    },
    key_eligibility: [
      "Health facility focus",
      "Off-grid or unreliable grid",
      "Ministry of Health coordination",
      "Training capacity"
    ],
    typical_requirements: [
      "Health facility assessment",
      "MoH coordination letter",
      "Training plan",
      "Maintenance commitment"
    ],
    disallowed_or_risky_patterns: [
      "Non-health facilities",
      "Grid-connected facilities",
      "No training component"
    ],
    notes_on_alignment_to_community_ownership: "We Care Solar provides equipment grants to public health facilities. Community health committees often involved in maintenance.",
    debt_sensitivity_tier: 1,
    application_modality: "through_partners",
    website: "wecaresolar.org"
  },
  {
    id: "energy4impact",
    funder_name: "Energy 4 Impact - Market Development Programs",
    instrument_type: "grant",
    geography_focus: {
      priority_countries: ["Kenya", "Tanzania", "Uganda", "Rwanda", "Senegal", "Benin", "Burkina Faso"],
      regions: ["East Africa", "West Africa"],
      scope: "multi_country"
    },
    thematic_focus: {
      primary: ["energy_access", "productive_use", "enterprise_development"],
      secondary: ["mini_grids", "clean_cooking", "agri_energy"],
      cross_cutting: ["gender", "SME_development", "livelihoods"]
    },
    typical_ticket_size_range: {
      min_usd: 25000,
      max_usd: 500000,
      notes: "TA and small grants for enterprise development"
    },
    key_eligibility: [
      "Energy access or productive use focus",
      "Enterprise development component",
      "Pro-poor targeting",
      "Gender consideration"
    ],
    typical_requirements: [
      "Enterprise profile",
      "Market assessment",
      "Gender strategy",
      "Impact metrics"
    ],
    disallowed_or_risky_patterns: [
      "Non-energy focus",
      "Weak enterprise development",
      "No gender consideration"
    ],
    notes_on_alignment_to_community_ownership: "Energy 4 Impact supports community enterprises and cooperatives. Focus on productive use and enterprise development with grant funding.",
    debt_sensitivity_tier: 1,
    application_modality: "periodic_calls",
    website: "energy4impact.org"
  },
  {
    id: "practical_action",
    funder_name: "Practical Action - Poor People's Energy Outlook Programs",
    instrument_type: "grant",
    geography_focus: {
      priority_countries: ["Kenya", "Nepal", "Peru", "Zimbabwe", "Malawi", "Bangladesh"],
      regions: ["Sub-Saharan Africa", "South Asia", "Latin America"],
      scope: "multi_country"
    },
    thematic_focus: {
      primary: ["energy_access", "appropriate_technology", "community_energy"],
      secondary: ["mini_grids", "clean_cooking", "knowledge"],
      cross_cutting: ["poverty", "technology_transfer", "advocacy"]
    },
    typical_ticket_size_range: {
      min_usd: 50000,
      max_usd: 1000000,
      notes: "Through country programs and partnerships"
    },
    key_eligibility: [
      "Practical Action country presence",
      "Pro-poor energy focus",
      "Appropriate technology",
      "Community engagement"
    ],
    typical_requirements: [
      "Community needs assessment",
      "Appropriate technology selection",
      "Capacity building plan",
      "Sustainability pathway"
    ],
    disallowed_or_risky_patterns: [
      "High-tech without appropriateness",
      "Non-poor targeting",
      "Weak community engagement"
    ],
    notes_on_alignment_to_community_ownership: "Practical Action strongly supports community ownership and appropriate technology. NGO with long track record in community energy.",
    debt_sensitivity_tier: 1,
    application_modality: "country_programs",
    website: "practicalaction.org"
  },
  {
    id: "hivos_energia",
    funder_name: "Hivos - Green Energy Programs",
    instrument_type: "grant",
    geography_focus: {
      priority_countries: ["Kenya", "Tanzania", "Malawi", "Zimbabwe", "Indonesia"],
      regions: ["East Africa", "Southern Africa", "Southeast Asia"],
      scope: "multi_country"
    },
    thematic_focus: {
      primary: ["biogas", "clean_cooking", "renewable_energy"],
      secondary: ["women_energy", "productive_use"],
      cross_cutting: ["gender", "civic_engagement", "green_economy"]
    },
    typical_ticket_size_range: {
      min_usd: 100000,
      max_usd: 2000000,
      notes: "Program grants through local partners"
    },
    key_eligibility: [
      "Hivos country presence",
      "Green energy focus",
      "Civil society engagement",
      "Gender integration"
    ],
    typical_requirements: [
      "Partner profile",
      "Program proposal",
      "Gender strategy",
      "Theory of change"
    ],
    disallowed_or_risky_patterns: [
      "Government-only projects",
      "Weak civil society engagement",
      "No gender consideration"
    ],
    notes_on_alignment_to_community_ownership: "Hivos supports civil society and community-based approaches. Strong focus on gender and civic engagement in energy access.",
    debt_sensitivity_tier: 1,
    application_modality: "through_partners",
    website: "hivos.org"
  },
  {
    id: "lit_world_rural",
    funder_name: "Lighting Global / IFC - Quality Assurance and Market Support",
    instrument_type: "grant",
    geography_focus: {
      priority_countries: [],
      regions: ["Sub-Saharan Africa", "South Asia"],
      scope: "global_south"
    },
    thematic_focus: {
      primary: ["solar_home_systems", "quality_standards", "consumer_protection"],
      secondary: ["market_development", "productive_use_appliances"],
      cross_cutting: ["quality", "consumer_finance", "market_intelligence"]
    },
    typical_ticket_size_range: {
      min_usd: 25000,
      max_usd: 500000,
      notes: "Market development and quality assurance grants"
    },
    key_eligibility: [
      "Off-grid solar focus",
      "Quality verified products",
      "Market development component",
      "Consumer benefit"
    ],
    typical_requirements: [
      "Product quality certification",
      "Market development plan",
      "Consumer protection measures",
      "Results framework"
    ],
    disallowed_or_risky_patterns: [
      "Non-quality-verified products",
      "No consumer protection",
      "Grid-connected only"
    ],
    notes_on_alignment_to_community_ownership: "Lighting Global supports market development that can include community distribution models. Quality assurance benefits all end users.",
    debt_sensitivity_tier: 1,
    application_modality: "ongoing",
    website: "lightingglobal.org"
  }
];
