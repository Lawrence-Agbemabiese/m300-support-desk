import { z } from 'zod';

// ============================================================================
// Project Intake Schema
// ============================================================================

export const TechnologyType = z.enum([
  'solar_mini_grid',
  'solar_standalone',
  'solar_home_systems',
  'wind_mini_grid',
  'hydro_mini_grid',
  'hybrid_mini_grid',
  'grid_extension',
  'grid_densification',
  'clean_cooking',
  'other',
]);

export const OwnershipModel = z.enum([
  'community_cooperative',
  'public_utility',
  'public_community_hybrid',
  'private_with_benefit_sharing',
  'private_ipp',
  'undecided',
]);

export const ProjectStage = z.enum([
  'idea',
  'concept',
  'early_development',
  'feasibility_complete',
  'ready_for_funding',
  'under_construction',
  'operational',
]);

export const DebtPreference = z.enum([
  'grant_only',
  'grant_preferred',
  'open_to_blended',
  'any_instrument',
]);

export const ContactInfoSchema = z.object({
  name: z.string().optional(),
  organization: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
});

export const ReadinessEvidenceStatus = z.enum(['complete', 'partial', 'missing', 'unknown']);

export const ReadinessEvidenceItemSchema = z.object({
  status: ReadinessEvidenceStatus,
  details: z.string().optional(),
});

export const ReadinessEvidenceSchema = z.object({
  legal_entity_registration: ReadinessEvidenceItemSchema,
  land_site_documentation: ReadinessEvidenceItemSchema,
  community_stakeholder_endorsement: ReadinessEvidenceItemSchema,
  ministry_agency_endorsement: ReadinessEvidenceItemSchema,
  demand_assessment: ReadinessEvidenceItemSchema,
  technical_design: ReadinessEvidenceItemSchema,
  detailed_budget: ReadinessEvidenceItemSchema,
  financial_projections: ReadinessEvidenceItemSchema,
  co_financing_documentation: ReadinessEvidenceItemSchema,
  implementation_timeline: ReadinessEvidenceItemSchema,
  mel_framework: ReadinessEvidenceItemSchema,
});

export const ProjectIntakeSchema = z.object({
  project_name: z.string().min(3).max(200),
  country: z.string().min(2),
  location_description: z.string().min(10),
  technology_type: TechnologyType,
  capacity_kw: z.number().min(0).optional(),
  target_beneficiaries: z.string().min(10),
  ownership_model: OwnershipModel,
  productive_uses: z.array(z.string()).optional(),
  estimated_cost_usd: z.number().min(0),
  existing_funding: z.string().optional(),
  project_stage: ProjectStage.default('concept'),
  community_engagement: z.string().optional(),
  additional_context: z.string().optional(),
  contact_info: ContactInfoSchema.optional(),
  debt_preference: DebtPreference.default('grant_preferred'),
  readiness_evidence: ReadinessEvidenceSchema.optional(),
});

export type ProjectIntake = z.infer<typeof ProjectIntakeSchema>;

// ============================================================================
// Policy Interpretation Schema
// ============================================================================

export const DebtSensitivityTier = z.enum(['tier_1', 'tier_2', 'tier_3', 'tier_4']);

export const M300SpecificTags = z.object({
  avoids_sovereign_debt: z.boolean().optional(),
  supports_public_ownership: z.boolean().optional(),
  prevents_capital_flight: z.boolean().optional(),
  preserves_fiscal_capacity: z.boolean().optional(),
  prioritizes_grants: z.boolean().optional(),
});

export const PolicyInterpretationSchema = z.object({
  project_name: z.string(),
  m300_alignment_score: z.number().int().min(0).max(100),
  alignment_narrative: z.string().min(100),
  ownership_classification: OwnershipModel,
  grant_suitable_elements: z.array(z.string()).min(1),
  debt_exposure_risks: z.array(z.string()),
  private_capital_risks: z.array(z.string()).optional(),
  community_ownership_justification: z.string().min(50).optional(),
  assumptions_list: z.array(z.string()).min(1),
  recommended_framing: z.string().min(50).optional(),
  debt_sensitivity_tier: DebtSensitivityTier.optional(),
  m300_specific_tags: M300SpecificTags.optional(),
});

export type PolicyInterpretation = z.infer<typeof PolicyInterpretationSchema>;

// ============================================================================
// Grant Match Schema
// ============================================================================

export const InstrumentType = z.enum([
  'grant',
  'results_based_grant',
  'concessional_loan',
  'equity',
  'guarantee',
  'blended_grant_equity',
  'blended_grant_loan',
]);

export const ScoreBreakdown = z.object({
  geography_score: z.number().optional(),
  thematic_score: z.number().optional(),
  size_score: z.number().optional(),
  ownership_score: z.number().optional(),
  eligibility_score: z.number().optional(),
  red_flag_penalty: z.number().optional(),
  debt_sensitivity_modifier: z.number().optional(),
});

export const GrantMatchItemSchema = z.object({
  funder_id: z.string().optional(),
  funder_name: z.string(),
  instrument_type: InstrumentType,
  fit_score: z.number().int().min(0).max(100),
  fit_rationale: z.array(z.string()).min(3),
  score_breakdown: ScoreBreakdown.optional(),
  red_flags: z.array(z.string()).optional(),
  next_actions: z.array(z.string()).min(2),
  debt_sensitivity_tier: DebtSensitivityTier.optional(),
});

export type GrantMatchItem = z.infer<typeof GrantMatchItemSchema>;

export const ExcludedFunderSchema = z.object({
  funder_id: z.string().optional(),
  funder_name: z.string(),
  exclusion_reason: z.string(),
});

export const DebtSensitivitySummary = z.object({
  tier_1_count: z.number().int().optional(),
  tier_2_count: z.number().int().optional(),
  tier_3_count: z.number().int().optional(),
  tier_4_count: z.number().int().optional(),
  recommendation: z.string().optional(),
});

export const MatchingMetadata = z.object({
  total_funders_evaluated: z.number().int().optional(),
  scoring_weights_version: z.string().optional(),
  grants_database_version: z.string().optional(),
  timestamp: z.string().datetime().optional(),
});

export const GrantMatchSchema = z.object({
  project_name: z.string(),
  matches: z.array(GrantMatchItemSchema).max(5),
  excluded_funders: z.array(ExcludedFunderSchema).optional(),
  overall_funding_strategy: z.string().min(50),
  debt_sensitivity_summary: DebtSensitivitySummary.optional(),
  matching_metadata: MatchingMetadata.optional(),
});

export type GrantMatch = z.infer<typeof GrantMatchSchema>;

// ============================================================================
// Proposal Coach Schema
// ============================================================================

export const ChecklistStatus = z.enum(['ready', 'not_ready', 'unknown', 'in_progress']);
export const ChecklistPriority = z.enum(['critical', 'important', 'nice_to_have']);
export const ReadinessLevel = z.enum(['ready_to_submit', 'nearly_ready', 'significant_gaps', 'major_work_needed']);
export const PreparationEffort = z.enum(['days', 'weeks', 'months']);

export const ProposalOutlineSchema = z.object({
  problem_statement: z.string().min(100),
  theory_of_change: z.string().min(100),
  community_ownership_governance: z.string().min(100),
  technical_approach: z.string().min(100),
  affordability_tariff_principles: z.string().min(50),
  implementation_plan: z.string().min(100),
  mel_framework: z.string().min(100),
  risk_register: z.string().min(100),
});

export type ProposalOutline = z.infer<typeof ProposalOutlineSchema>;

export const ChecklistItemSchema = z.object({
  item: z.string(),
  status: ChecklistStatus,
  notes: z.string().optional(),
  priority: ChecklistPriority.optional(),
});

export type ChecklistItem = z.infer<typeof ChecklistItemSchema>;

export const ReadinessSummarySchema = z.object({
  overall_readiness: ReadinessLevel,
  ready_count: z.number().int(),
  not_ready_count: z.number().int(),
  unknown_count: z.number().int(),
  critical_gaps: z.array(z.string()).optional(),
  estimated_preparation_effort: PreparationEffort.optional(),
});

export const FunderSpecificGuidance = z.object({
  key_funder_priorities: z.array(z.string()).optional(),
  common_mistakes_to_avoid: z.array(z.string()).optional(),
  recommended_attachments: z.array(z.string()).optional(),
});

export const ProposalCoachSchema = z.object({
  project_name: z.string(),
  target_funder: z.string(),
  proposal_outline: ProposalOutlineSchema,
  readiness_checklist: z.array(ChecklistItemSchema).min(5),
  missing_info_questionnaire: z.array(z.string()).min(5),
  readiness_summary: ReadinessSummarySchema.optional(),
  funder_specific_guidance: FunderSpecificGuidance.optional(),
  debt_sensitivity_statement: z.string().min(50).optional(),
  m300_alignment_statement: z.string().min(50).optional(),
});

export type ProposalCoach = z.infer<typeof ProposalCoachSchema>;

// ============================================================================
// Policy Trade-Off Explorer Schema
// ============================================================================

export const TradeOffScenarioSchema = z.object({
  title: z.string(),
  description: z.string(),
  upsides: z.array(z.string()),
  risks: z.array(z.string()),
  signals_to_monitor: z.array(z.string()),
  suggested_actions: z.array(z.string()),
});

export const TradeOffExplorerSchema = z.object({
  sensitivity_drivers: z.array(z.string()),
  priority_trade_offs: z.array(TradeOffScenarioSchema),
  bottom_line: z.string(),
});

export type TradeOffScenario = z.infer<typeof TradeOffScenarioSchema>;
export type TradeOffExplorerResult = z.infer<typeof TradeOffExplorerSchema>;

// ============================================================================
// Combined Analysis Result
// ============================================================================

export const AnalysisResultSchema = z.object({
  project: ProjectIntakeSchema,
  policy: PolicyInterpretationSchema,
  grants: GrantMatchSchema,
  coach: ProposalCoachSchema,
  tradeoffs: TradeOffExplorerSchema.optional(),
  metadata: z.object({
    enhanced: z.boolean(),
    model: z.string().optional(),
    timestamp: z.string().optional(),
    processing_time_ms: z.number().optional(),
    project_id: z.string().optional(),
  }),
});

export type AnalysisResult = z.infer<typeof AnalysisResultSchema>;

// Grant Match Result (wrapper for consistency)
export type GrantMatchResult = z.infer<typeof GrantMatchSchema>;
