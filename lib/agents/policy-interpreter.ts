import type { ProjectIntake, PolicyInterpretation } from '@/lib/schemas';

interface OwnershipScores {
  [key: string]: number;
}

const ownershipScores: OwnershipScores = {
  community_cooperative: 30,
  public_utility: 25,
  public_community_hybrid: 28,
  private_with_benefit_sharing: 10,
  private_ipp: 0,
};

type SupportedProjectIntake = ProjectIntake & {
  technology_other?: string;
  ownership_other?: string;
};

function projectDebtTier(debtPreference: ProjectIntake['debt_preference']): 'tier_1' | 'tier_2' {
  return debtPreference === 'grant_only' || debtPreference === 'grant_preferred'
    ? 'tier_1'
    : 'tier_2';
}

function projectLabel(value: string, customValue?: string): string {
  if (value === 'other' && customValue?.trim()) {
    return customValue.trim();
  }

  return value.replace(/_/g, ' ');
}

export function interpretPolicy(project: ProjectIntake): PolicyInterpretation {
  const extendedProject = project as SupportedProjectIntake;
  const ownership = project.ownership_model || 'undecided';
  const productiveUses = project.productive_uses || [];
  const debtPreference = project.debt_preference || 'grant_preferred';
  const country = project.country || '';

  // Calculate M300 alignment score
  let score = 50; // Base score

  // Ownership scoring
  score += ownershipScores[ownership] || 0;

  // Productive use bonus
  if (productiveUses.length > 0) {
    score += 10;
  }

  // Debt preference bonus
  score += debtPreference === 'grant_only' ? 10 : debtPreference === 'grant_preferred' ? 5 : 0;

  score = Math.min(score, 100);

  // Financing preference determines project debt tier. Ownership remains an
  // independent alignment and governance signal; it must never stand in for debt.
  const debtTier = projectDebtTier(debtPreference);

  // Generate grant-suitable elements
  const grantSuitable: string[] = [];
  if (ownership === 'community_cooperative') {
    grantSuitable.push('Community cooperative ownership eliminates profit extraction');
  }
  if (ownership === 'public_utility' || ownership === 'public_community_hybrid') {
    grantSuitable.push('Public ownership keeps infrastructure in government/community hands');
  }
  if (productiveUses.length > 0) {
    grantSuitable.push(`Productive use component: ${productiveUses.slice(0, 3).join(', ')}`);
  }
  grantSuitable.push('Last-mile rural electrification focus');
  if (debtPreference === 'grant_only') {
    grantSuitable.push('Explicit grant-only preference aligns with M300 recommendations');
  } else if (debtPreference === 'grant_preferred') {
    grantSuitable.push('Low/no-debt financing preference aligns with M300 recommendations');
  }

  // Generate debt risks
  const debtRisks: string[] = [];
  if (ownership === 'private_ipp') {
    debtRisks.push('Private IPP model may require sovereign guarantees');
    debtRisks.push('Profit extraction creates capital flight risk');
  } else if (ownership.includes('private')) {
    debtRisks.push('Private component may create guarantee requirements');
  } else {
    debtRisks.push('No debt exposure identified from intake; verify proposed financing terms');
  }
  if (debtPreference === 'open_to_blended') {
    debtRisks.push('Blended finance may introduce repayment, bridge-finance, currency, or guarantee exposure');
  }
  if (debtPreference === 'any_instrument') {
    debtRisks.push('Debt terms, obligor, currency, guarantees, and contingent liabilities require full review');
  }

  // Generate private capital risks
  const privateRisks: string[] = [];
  if (ownership !== 'private_ipp') {
    privateRisks.push('If private developer introduced later, ensure community retains asset ownership');
    privateRisks.push('Avoid performance guarantees that create contingent government liabilities');
  }

  // Generate alignment narrative
  const techType = projectLabel(project.technology_type, extendedProject.technology_other);
  const ownershipLabel = projectLabel(ownership, extendedProject.ownership_other);
  const alignmentLevel = score >= 70 ? 'strong' : score >= 50 ? 'moderate' : 'weak';

  let narrative = `This ${techType} project in ${country} demonstrates ${alignmentLevel} alignment with M300 debt-sensitivity principles (score: ${score}/100). The ${ownershipLabel} ownership model `;

  if (score >= 70) {
    narrative += 'supports local-benefit and public-interest objectives, subject to governance and funder verification.';
  } else {
    narrative += 'may face challenges with grant funders who prefer community/public ownership.';
  }

  if (productiveUses.length > 0) {
    narrative += ` The productive use component (${productiveUses.slice(0, 2).join(', ')}) strengthens the business case for grant investment.`;
  }

  // Generate assumptions list
  const assumptions = [
    'Project entity is legally registered and in good standing',
    'Land/site tenure is secured or securable',
    'Community engagement and buy-in is genuine and documented',
    'Demand assessment confirms project viability',
    'Technical feasibility has been preliminarily assessed',
  ];

  // Generate recommended framing
  const framingType = ownership.includes('community') ? 'community-led' : 'locally-owned';
  const framing = debtTier === 'tier_1'
    ? `Position as a ${framingType} energy access project that advances M300 electrification goals with a clear low/no-debt preference for ${country}.`
    : `Position as a ${framingType} energy access project that advances M300 electrification goals while explicitly managing repayment, currency, guarantee, and contingent-liability risks in ${country}.`;

  // Community ownership justification
  const justification = `The ${ownershipLabel} structure can keep revenues within ${country}, build local capacity, and reduce capital-flight risk when governance and benefit-sharing safeguards are verified.`;

  return {
    project_name: project.project_name,
    m300_alignment_score: score,
    alignment_narrative: narrative,
    ownership_classification: ownership,
    grant_suitable_elements: grantSuitable,
    debt_exposure_risks: debtRisks,
    private_capital_risks: privateRisks,
    community_ownership_justification: justification,
    assumptions_list: assumptions,
    recommended_framing: framing,
    debt_sensitivity_tier: debtTier,
    m300_specific_tags: {
      avoids_sovereign_debt: debtPreference === 'grant_only',
      supports_public_ownership: ownership.includes('public') || ownership === 'community_cooperative',
      prevents_capital_flight: ownership === 'community_cooperative' || ownership.includes('public'),
      preserves_fiscal_capacity: debtPreference === 'grant_only',
      prioritizes_grants: debtPreference === 'grant_only' || debtPreference === 'grant_preferred',
    },
  };
}
