import type { ProjectIntake, GrantMatch, GrantMatchItem } from '@/lib/schemas';
import { grants, type Grant } from '@/lib/data/grants';
import { scoringWeights } from '@/lib/data/weights';
import { normalizeFundingTier, type CurrentFundingTier } from '@/lib/funding-tiers';

type DebtTier = CurrentFundingTier;

type SupportedProjectIntake = ProjectIntake & {
  technology_other?: string;
  ownership_other?: string;
};

interface ScoreResult {
  score: number;
  explanation: string;
}

function scoreGeography(grant: Grant, projectCountry: string): ScoreResult {
  const countryLower = projectCountry.toLowerCase();

  // Check priority countries
  const priorityCountries = grant.geography_focus.priority_countries || [];
  if (priorityCountries.some((c) => c.toLowerCase() === countryLower)) {
    return { score: 100, explanation: `${projectCountry} is a priority country for this funder` };
  }

  // Check regions
  const regions = grant.geography_focus.regions || [];
  const africanRegions = [
    'Sub-Saharan Africa',
    'West Africa',
    'East Africa',
    'Southern Africa',
    'Africa',
    'Gavi-eligible countries',
  ];

  if (regions.some((r) => africanRegions.includes(r))) {
    return { score: 60, explanation: `${projectCountry} within funder's regional scope (Africa)` };
  }

  // Global South
  const scope = grant.geography_focus.scope || '';
  if (scope === 'global_south') {
    return { score: 50, explanation: `${projectCountry} eligible under Global South scope` };
  }

  return { score: 0, explanation: `${projectCountry} not clearly within funder's geographic focus` };
}

function scoreThematic(grant: Grant, project: ProjectIntake): ScoreResult {
  const extendedProject = project as SupportedProjectIntake;
  const techType = project.technology_type === 'other' && extendedProject.technology_other?.trim()
    ? extendedProject.technology_other.trim().toLowerCase()
    : project.technology_type.toLowerCase();
  const productiveUses = project.productive_uses || [];

  const primaryFocus = grant.thematic_focus.primary || [];
  const secondaryFocus = grant.thematic_focus.secondary || [];

  // Check primary focus match
  let primaryMatch = false;
  for (const focus of primaryFocus) {
    const focusLower = focus.toLowerCase();
    if (focusLower.includes(techType) || techType.includes(focusLower)) {
      primaryMatch = true;
      break;
    }
    if (focusLower.includes('mini_grid') && techType.includes('mini_grid')) {
      primaryMatch = true;
      break;
    }
    if (focusLower.includes('mini-grid') && techType.includes('mini')) {
      primaryMatch = true;
      break;
    }
  }

  // Health facility matching
  if (
    techType.includes('health') ||
    productiveUses.some((u) => u.includes('cold_chain') || u.includes('medical'))
  ) {
    if (primaryFocus.includes('vaccine_cold_chain') || primaryFocus.includes('health_facility_electrification')) {
      return { score: 100, explanation: 'Strong match: Health/cold chain focus aligns with funder priorities' };
    }
  }

  if (primaryMatch) {
    return { score: 100, explanation: `Strong match: ${techType.replace(/_/g, ' ')} aligns with funder's primary focus` };
  }

  // Check secondary focus
  for (const focus of secondaryFocus) {
    if (focus.toLowerCase().includes(techType) || techType.includes(focus.toLowerCase())) {
      return { score: 80, explanation: `Good match: ${techType.replace(/_/g, ' ')} aligns with funder's secondary focus` };
    }
  }

  // Productive use match
  if (productiveUses.length > 0 && [...primaryFocus, ...secondaryFocus].includes('productive_use')) {
    return { score: 80, explanation: `Good match: Productive use component (${productiveUses.slice(0, 2).join(', ')}) aligns` };
  }

  // General energy access
  if ([...primaryFocus, ...secondaryFocus].includes('energy_access')) {
    return { score: 60, explanation: 'Moderate match: General energy access alignment' };
  }

  return { score: 30, explanation: 'Weak thematic alignment - verify funder accepts this technology type' };
}

function scoreSize(grant: Grant, estimatedCost: number): ScoreResult {
  const minUsd = grant.typical_ticket_size_range.min_usd || 0;
  const maxUsd = grant.typical_ticket_size_range.max_usd || Infinity;

  if (estimatedCost >= minUsd && estimatedCost <= maxUsd) {
    return { score: 100, explanation: `Project cost $${estimatedCost.toLocaleString()} within typical range ($${minUsd.toLocaleString()}-$${maxUsd.toLocaleString()})` };
  }

  // Within 50% of boundaries
  const lowerBound = minUsd * 0.5;
  const upperBound = maxUsd * 1.5;

  if (estimatedCost >= lowerBound && estimatedCost <= upperBound) {
    return { score: 60, explanation: `Project cost $${estimatedCost.toLocaleString()} near typical range ($${minUsd.toLocaleString()}-$${maxUsd.toLocaleString()})` };
  }

  return { score: 30, explanation: `Project cost $${estimatedCost.toLocaleString()} outside typical range ($${minUsd.toLocaleString()}-$${maxUsd.toLocaleString()})` };
}

function scoreOwnership(grant: Grant, ownershipModel: string, ownershipOther?: string): ScoreResult {
  const communityNote = grant.notes_on_alignment_to_community_ownership || '';

  if (ownershipModel === 'community_cooperative') {
    if (communityNote.toLowerCase().includes('community') && communityNote.toLowerCase().includes('support')) {
      return { score: 100, explanation: 'Excellent: Community cooperative ownership explicitly supported by funder' };
    }
    return { score: 90, explanation: 'Strong: Community cooperative ownership aligns with grant principles' };
  }

  if (ownershipModel === 'public_utility' || ownershipModel === 'public_community_hybrid') {
    return { score: 85, explanation: `${ownershipModel.replace(/_/g, ' ')} ownership compatible with grant funding` };
  }

  if (ownershipModel === 'private_with_benefit_sharing') {
    return { score: 50, explanation: 'Moderate: Private ownership with benefit-sharing may be acceptable to some funders' };
  }

  if (ownershipModel === 'private_ipp') {
    return { score: 20, explanation: 'Weak: Private IPP model less suited for grant funding; may require guarantees' };
  }

  const ownershipLabel = ownershipModel === 'other' && ownershipOther?.trim()
    ? ownershipOther.trim()
    : ownershipModel.replace(/_/g, ' ');
  return { score: 60, explanation: `Ownership model (${ownershipLabel}) requires funder-specific verification` };
}

function scoreEligibility(grant: Grant, project: ProjectIntake): ScoreResult {
  const hasEntity = project.project_stage !== 'idea';
  const hasEngagement = Boolean(project.community_engagement);

  if (hasEntity && hasEngagement) {
    return { score: 70, explanation: 'Most eligibility criteria likely met (pending verification)' };
  }
  if (hasEntity || hasEngagement) {
    return { score: 50, explanation: 'Some eligibility criteria may be met; gaps to address' };
  }
  return { score: 30, explanation: 'Eligibility criteria unclear; detailed review needed' };
}

function identifyRedFlags(grant: Grant, project: ProjectIntake): string[] {
  const flags: string[] = [];
  const instrumentType = grant.instrument_type;
  const debtPreference = project.debt_preference || 'grant_preferred';

  // RBF bridge financing
  if (instrumentType === 'results_based_grant') {
    flags.push('Results-based payment requires bridge financing for construction phase');
  }

  // Blended finance for grant-only preference
  if (instrumentType.includes('blended') && debtPreference === 'grant_only') {
    flags.push('Blended finance structure may include non-grant components');
  }

  // Size concerns
  const cost = project.estimated_cost_usd;
  const minUsd = grant.typical_ticket_size_range.min_usd;
  const maxUsd = grant.typical_ticket_size_range.max_usd;

  if (cost < minUsd * 0.5) {
    flags.push(`Project may be too small for this funder (typical min: $${minUsd.toLocaleString()})`);
  }
  if (cost > maxUsd * 1.5) {
    flags.push(`Project may be too large for this funder (typical max: $${maxUsd.toLocaleString()})`);
  }

  // Disallowed patterns
  const disallowed = grant.disallowed_or_risky_patterns || [];
  const ownership = project.ownership_model;
  if (ownership === 'private_ipp' && disallowed.some((d) => d.toLowerCase().includes('private') || d.toLowerCase().includes('guarantee'))) {
    flags.push('Private IPP model may conflict with funder restrictions');
  }

  return flags;
}

function generateNextActions(grant: Grant, project: ProjectIntake): string[] {
  const actions: string[] = [];
  const funderName = grant.funder_name;
  const requirements = grant.typical_requirements || [];

  // Add standard first actions
  if (grant.website) {
    actions.push(`Review ${funderName} website and current call guidelines`);
  }

  // Add based on requirements
  for (const req of requirements.slice(0, 4)) {
    if (req.toLowerCase().includes('demand')) {
      actions.push('Complete demand assessment survey (check if funder has template)');
    } else if (req.toLowerCase().includes('technical') || req.toLowerCase().includes('design')) {
      actions.push('Commission preliminary technical design from qualified engineer');
    } else if (req.toLowerCase().includes('financial') || req.toLowerCase().includes('business')) {
      actions.push('Develop 5-year financial projection');
    } else if (req.toLowerCase().includes('community')) {
      actions.push('Document community engagement and contribution');
    }
  }

  // Add ownership-specific
  const ownership = project.ownership_model;
  if (ownership === 'community_cooperative') {
    actions.push('Obtain cooperative registration certificate');
  } else if (ownership.includes('public')) {
    actions.push('Obtain government endorsement letter');
  }

  // Deduplicate and limit
  const uniqueActions = [...new Set(actions)];
  return uniqueActions.slice(0, 6);
}

function calculateFinalScore(
  geoScore: number,
  thematicScore: number,
  sizeScore: number,
  ownershipScore: number,
  eligibilityScore: number,
  redFlags: string[],
  debtTier: DebtTier
): number {
  const weights = scoringWeights.component_weights;

  // Calculate base score
  const baseScore =
    geoScore * weights.geography.weight +
    thematicScore * weights.thematic.weight +
    sizeScore * weights.size.weight +
    ownershipScore * weights.ownership.weight +
    eligibilityScore * weights.eligibility.weight;

  // Apply red flag penalty (10% per flag, max 30%)
  const flagPenalty = Math.min(redFlags.length * scoringWeights.red_flag_penalties.minor, scoringWeights.red_flag_penalties.max_total);

  // Apply debt sensitivity modifier
  const debtModifiers = scoringWeights.debt_sensitivity_modifiers;
  const debtModifier = debtModifiers[debtTier];

  // Calculate final score
  const finalScore = baseScore * (1 - flagPenalty) * debtModifier;

  return Math.round(finalScore);
}

export function matchGrants(project: ProjectIntake): GrantMatch {
  const extendedProject = project as SupportedProjectIntake;
  const results: GrantMatchItem[] = [];

  for (const grant of grants) {
    // Calculate component scores
    const geoResult = scoreGeography(grant, project.country);
    const thematicResult = scoreThematic(grant, project);
    const sizeResult = scoreSize(grant, project.estimated_cost_usd);
    const ownershipResult = scoreOwnership(grant, project.ownership_model, extendedProject.ownership_other);
    const eligibilityResult = scoreEligibility(grant, project);

    // Get red flags
    const redFlags = identifyRedFlags(grant, project);

    // Get debt tier
    // Historical numeric tiers above 1 normalize to the current Tier 2.
    const debtTier = normalizeFundingTier(grant.debt_sensitivity_tier);

    // Calculate final score
    const finalScore = calculateFinalScore(
      geoResult.score,
      thematicResult.score,
      sizeResult.score,
      ownershipResult.score,
      eligibilityResult.score,
      redFlags,
      debtTier
    );

    // Generate next actions
    const nextActions = generateNextActions(grant, project);

    results.push({
      funder_id: grant.id,
      funder_name: grant.funder_name,
      instrument_type: grant.instrument_type as GrantMatchItem['instrument_type'],
      fit_score: finalScore,
      debt_sensitivity_tier: debtTier,
      score_breakdown: {
        geography_score: geoResult.score,
        thematic_score: thematicResult.score,
        size_score: sizeResult.score,
        ownership_score: ownershipResult.score,
        eligibility_score: eligibilityResult.score,
        red_flag_penalty: Math.min(
          redFlags.length * scoringWeights.red_flag_penalties.minor,
          scoringWeights.red_flag_penalties.max_total
        ),
        debt_sensitivity_modifier: scoringWeights.debt_sensitivity_modifiers[debtTier],
      },
      fit_rationale: [
        geoResult.explanation,
        thematicResult.explanation,
        sizeResult.explanation,
        ownershipResult.explanation,
      ],
      red_flags: redFlags,
      next_actions: nextActions,
    });
  }

  // Sort by score descending
  results.sort((a, b) => b.fit_score - a.fit_score);

  // Split into matches and excluded
  const threshold = scoringWeights.minimum_threshold;
  const matches = results.filter((r) => r.fit_score >= threshold).slice(0, 5);
  const excluded = results
    .filter((r) => r.fit_score < threshold)
    .slice(0, 3)
    .map((r) => ({
      funder_id: r.funder_id,
      funder_name: r.funder_name,
      exclusion_reason: `Fit score ${r.fit_score} below threshold ${threshold}`,
    }));

  // Generate funding strategy
  let strategy: string;
  if (matches.length > 0) {
    const top = matches[0];
    strategy = `Lead with ${top.funder_name} application (${top.fit_score}/100 fit score, ${top.instrument_type}). `;
    if (matches.length > 1) {
      strategy += `Consider ${matches[1].funder_name} as secondary option. `;
    }
    if (project.debt_preference === 'grant_only') {
      strategy += 'Prioritize grant instruments to maintain debt-free status.';
    }
  } else {
    strategy = 'No strong matches found. Consider adjusting project parameters or ownership model.';
  }

  // Calculate debt sensitivity summary
  const tier1Count = matches.filter((m) => m.debt_sensitivity_tier === 'tier_1').length;
  const tier2Count = matches.filter((m) => m.debt_sensitivity_tier === 'tier_2').length;

  return {
    project_name: project.project_name,
    matches,
    excluded_funders: excluded,
    overall_funding_strategy: strategy,
    debt_sensitivity_summary: {
      tier_1_count: tier1Count,
      tier_2_count: tier2Count,
      recommendation: tier1Count > 0
        ? 'Low/no-debt options are available - prioritize these while verifying current terms'
        : tier2Count > 0
        ? 'Some-debt options are available; compare repayment, currency, guarantee, and bridge-finance risks'
        : 'No qualifying options found; review current funder terms and project parameters',
    },
    matching_metadata: {
      total_funders_evaluated: grants.length,
      scoring_weights_version: scoringWeights.version,
      timestamp: new Date().toISOString(),
    },
  };
}
