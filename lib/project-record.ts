import type { Project } from '@prisma/client';
import type { AnalysisResult, GrantMatchResult, PolicyInterpretation, ProjectIntake, ProposalCoach, TradeOffExplorerResult } from '@/lib/schemas';
import { normalizeLegacyProblemStatement } from '@/lib/agents/proposal-coach';

type ProjectRecord = Pick<Project, 'projectName' | 'country' | 'locationDescription' | 'technologyType' | 'technologyOther' | 'capacityKw' | 'targetBeneficiaries' | 'ownershipModel' | 'ownershipOther' | 'productiveUses' | 'estimatedCostUsd' | 'existingFunding' | 'projectStage' | 'communityEngagement' | 'additionalContext' | 'contactInfo' | 'debtPreference' | 'readinessEvidence'>;

function parseOptionalJson<T>(value: string | null): T | undefined {
  if (!value) return undefined;
  try { return JSON.parse(value) as T; } catch { return undefined; }
}

export function projectToIntake(project: ProjectRecord): ProjectIntake {
  return {
    project_name: project.projectName,
    country: project.country,
    location_description: project.locationDescription,
    technology_type: project.technologyType as ProjectIntake['technology_type'],
    technology_other: project.technologyOther ?? undefined,
    capacity_kw: project.capacityKw ?? undefined,
    target_beneficiaries: project.targetBeneficiaries,
    ownership_model: project.ownershipModel as ProjectIntake['ownership_model'],
    ownership_other: project.ownershipOther ?? undefined,
    productive_uses: parseOptionalJson<string[]>(project.productiveUses) ?? [],
    estimated_cost_usd: project.estimatedCostUsd,
    existing_funding: project.existingFunding ?? undefined,
    project_stage: project.projectStage as ProjectIntake['project_stage'],
    community_engagement: project.communityEngagement ?? undefined,
    additional_context: project.additionalContext ?? undefined,
    contact_info: parseOptionalJson<ProjectIntake['contact_info']>(project.contactInfo),
    debt_preference: project.debtPreference as ProjectIntake['debt_preference'],
    readiness_evidence: parseOptionalJson<ProjectIntake['readiness_evidence']>(project.readinessEvidence),
  };
}

export function intakeToProjectData(project: ProjectIntake) {
  return {
    projectName: project.project_name,
    country: project.country,
    locationDescription: project.location_description,
    technologyType: project.technology_type,
    technologyOther: project.technology_type === 'other' ? project.technology_other?.trim() || null : null,
    capacityKw: project.capacity_kw,
    targetBeneficiaries: project.target_beneficiaries,
    ownershipModel: project.ownership_model,
    ownershipOther: project.ownership_model === 'other' ? project.ownership_other?.trim() || null : null,
    productiveUses: JSON.stringify(project.productive_uses),
    estimatedCostUsd: project.estimated_cost_usd,
    existingFunding: project.existing_funding || null,
    projectStage: project.project_stage,
    communityEngagement: project.community_engagement || null,
    additionalContext: project.additional_context || null,
    contactInfo: project.contact_info ? JSON.stringify(project.contact_info) : null,
    debtPreference: project.debt_preference,
    readinessEvidence: project.readiness_evidence ? JSON.stringify(project.readiness_evidence) : null,
  };
}

export function analysisToProjectData(result: AnalysisResult) {
  return {
    policyResult: JSON.stringify(result.policy), grantsResult: JSON.stringify(result.grants), coachResult: JSON.stringify(result.coach),
    tradeoffsResult: result.tradeoffs ? JSON.stringify(result.tradeoffs) : null,
    m300Score: result.policy.m300_alignment_score, debtTier: result.policy.debt_sensitivity_tier,
    topFunder: result.grants.matches[0]?.funder_name ?? null, topFunderScore: result.grants.matches[0]?.fit_score ?? null,
    enhanced: result.metadata.enhanced, processingTimeMs: result.metadata.processing_time_ms,
  };
}

export function analysisToRevisionData(result: AnalysisResult, revisionNumber: number, source: 'initial' | 'reanalysis' | 'legacy_backfill', createdByAdvisorId: string | null) {
  return {
    revisionNumber, source, intakeSnapshot: JSON.stringify(result.project), policyResult: JSON.stringify(result.policy),
    grantsResult: JSON.stringify(result.grants), coachResult: JSON.stringify(result.coach),
    tradeoffsResult: result.tradeoffs ? JSON.stringify(result.tradeoffs) : null,
    enhanced: result.metadata.enhanced, model: result.metadata.model ?? null,
    processingTimeMs: result.metadata.processing_time_ms, createdByAdvisorId,
  };
}

export function projectToAnalysisResult(project: ProjectRecord & { id: string; policyResult: string | null; grantsResult: string | null; coachResult: string | null; tradeoffsResult: string | null; enhanced: boolean; processingTimeMs: number | null; currentRevision: number; }): AnalysisResult | null {
  if (!project.policyResult || !project.grantsResult || !project.coachResult) return null;
  const coach = JSON.parse(project.coachResult) as ProposalCoach;
  const normalizedCoach: ProposalCoach = { ...coach, proposal_outline: { ...coach.proposal_outline, problem_statement: normalizeLegacyProblemStatement(coach.proposal_outline.problem_statement, project.locationDescription, project.country) } };
  return {
    project: projectToIntake(project), policy: JSON.parse(project.policyResult) as PolicyInterpretation,
    grants: JSON.parse(project.grantsResult) as GrantMatchResult, coach: normalizedCoach,
    tradeoffs: project.tradeoffsResult ? JSON.parse(project.tradeoffsResult) as TradeOffExplorerResult : undefined,
    metadata: { enhanced: project.enhanced, processing_time_ms: project.processingTimeMs ?? 0, project_id: project.id, revision: project.currentRevision },
  };
}
