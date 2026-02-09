import type { ProjectIntake, PolicyInterpretation, GrantMatch, ProposalCoach, ChecklistItem } from '@/lib/schemas';

export function coachProposal(
  project: ProjectIntake,
  interpretation: PolicyInterpretation,
  grantMatch: GrantMatch
): ProposalCoach {
  const matches = grantMatch.matches || [];
  const targetFunder = matches.length > 0 ? matches[0].funder_name : 'General';

  const ownership = project.ownership_model || '';
  const techType = project.technology_type.replace(/_/g, ' ');
  const country = project.country || '';
  const location = project.location_description || country;
  const beneficiaries = project.target_beneficiaries || 'target beneficiaries';
  const productiveUses = project.productive_uses || [];
  const capacity = project.capacity_kw;
  const existingFunding = project.existing_funding || '';

  // Generate proposal outline
  const proposalOutline = {
    problem_statement:
      `Approximately [X] people in ${location} lack access to reliable electricity. ` +
      (techType.toLowerCase().includes('health')
        ? 'Health facilities operate without reliable power, affecting service delivery. '
        : 'This energy poverty constrains economic development and quality of life. ') +
      (productiveUses.length > 0
        ? `Without electricity, productive activities like ${productiveUses.slice(0, 2).join(', ')} cannot operate at full potential.`
        : ''),

    theory_of_change:
      `IF ${project.project_name} is implemented with ${ownership.replace(/_/g, ' ')} ownership, ` +
      `THEN ${beneficiaries} will gain electricity access` +
      (productiveUses.length > 0
        ? ` AND ${productiveUses.slice(0, 2).join(', ')} activities will be enabled`
        : '') +
      `, LEADING TO improved livelihoods, economic opportunities, and demonstrated model for ` +
      `${ownership.includes('community') ? 'community-owned' : 'locally-owned'} electrification in ${country}.`,

    community_ownership_governance:
      `The project will be owned under a ${ownership.replace(/_/g, ' ')} structure. ` +
      (ownership === 'community_cooperative'
        ? 'Governance includes: (1) General Assembly meeting quarterly, (2) Elected Management Committee with term limits and gender representation, (3) Trained local operators, (4) Transparent tariff-setting with community input, (5) Revenue allocation with maintenance reserves.'
        : 'Governance arrangements will ensure local participation and accountability.') +
      ` ${interpretation.community_ownership_justification || ''}`,

    technical_approach:
      `${capacity ? `${capacity}kW` : 'Appropriately sized'} ${techType} system serving ${beneficiaries}. ` +
      (capacity
        ? 'System designed for reliability with battery storage, smart metering, and local maintainability. '
        : 'Technical specifications to be finalized. ') +
      (productiveUses.length > 0
        ? `Productive use loads (${productiveUses.slice(0, 2).join(', ')}) integrated into system design.`
        : ''),

    affordability_tariff_principles:
      techType.toLowerCase().includes('health') || ownership === 'public_utility'
        ? 'N/A - Public infrastructure funded by grant. Operational costs covered by government budget.'
        : 'Tariff structure designed around ability-to-pay: (1) Lifeline rate for basic consumption, (2) Standard rate for higher usage. Pre-paid metering ensures payment discipline. Tariff review every 2 years with community input.',

    implementation_plan:
      'Phased implementation:\n' +
      '- Month 1-2: Detailed design, procurement, community mobilization\n' +
      '- Month 3-4: Site preparation, procurement finalization\n' +
      '- Month 5-6: Equipment installation and commissioning\n' +
      '- Month 7-8: Connections, training, operational handover\n' +
      '- Month 9-12: Performance monitoring, optimization, documentation',

    mel_framework:
      'Output indicators: Connections completed, capacity installed, system uptime\n' +
      'Outcome indicators: Beneficiary satisfaction, energy expenditure changes, income changes\n' +
      'Data collection: Smart meter analytics, quarterly surveys, annual audit\n' +
      'Learning: Quarterly reviews, annual case study, sector knowledge sharing',

    risk_register:
      'Technical: Equipment failure - mitigated by warranties, service agreements, spare parts\n' +
      `Financial: ${techType.toLowerCase().includes('health') ? 'Budget constraints - mitigated by Ministry commitment' : 'Payment delays - mitigated by pre-paid metering'}\n` +
      'Governance: Capacity gaps - mitigated by training, oversight, term limits\n' +
      'External: Policy changes - mitigated by community ownership resilience\n\n' +
      `DEBT SENSITIVITY: ${interpretation.debt_exposure_risks.join('; ')}. ` +
      `This project ${interpretation.debt_sensitivity_tier === 'tier_1' ? 'creates no debt obligations' : 'has debt implications requiring management'}.`,
  };

  // Generate readiness checklist
  const readinessChecklist: ChecklistItem[] = [
    { item: 'Legal entity registration', status: 'unknown', notes: 'Verify certificate is current', priority: 'critical' },
    { item: 'Land/site documentation', status: 'unknown', notes: 'Obtain lease or allocation letter', priority: 'critical' },
    { item: 'Community/stakeholder endorsement', status: 'unknown', notes: 'Document formal support', priority: 'critical' },
    { item: 'Demand assessment', status: 'not_ready', notes: 'Conduct beneficiary survey', priority: 'critical' },
    { item: 'Technical design', status: 'not_ready', notes: 'Commission preliminary design', priority: 'important' },
    { item: 'Detailed budget', status: 'not_ready', notes: 'Obtain equipment quotes', priority: 'important' },
    { item: 'Financial projections', status: 'not_ready', notes: 'Develop 5-year model', priority: 'important' },
    {
      item: 'Co-financing documentation',
      status: existingFunding ? 'unknown' : 'not_ready',
      notes: `Document ${existingFunding || 'any contributions'}`,
      priority: 'important',
    },
    { item: 'Implementation timeline', status: 'ready', notes: 'Outlined in proposal', priority: 'nice_to_have' },
    { item: 'M&E framework', status: 'ready', notes: 'Outlined in proposal', priority: 'nice_to_have' },
  ];

  // Add health-specific items
  if (
    techType.toLowerCase().includes('health') ||
    productiveUses.some((u) => u.includes('cold') || u.includes('medical'))
  ) {
    readinessChecklist.splice(3, 0, {
      item: 'Health Ministry endorsement',
      status: 'unknown',
      notes: 'Obtain formal letter',
      priority: 'critical',
    });
  }

  // Generate missing info questionnaire
  const missingInfo = [
    `What is the exact location (GPS coordinates) of the project site?`,
    `What is the registration number of the ${ownership.replace(/_/g, ' ')} entity?`,
    `What is the current energy situation? (grid access, diesel/kerosene expenditure)`,
    `What community contribution is committed? (amount, cash vs in-kind)`,
    `Has any technical feasibility study been conducted?`,
    `What is the governance structure? (committee composition, decision-making)`,
    `What permits are required and what is their status?`,
    `Who is the primary contact person?`,
  ];

  if (productiveUses.length > 0) {
    missingInfo.push(
      `What is the status of productive use anchor(s)? (${productiveUses.slice(0, 2).join(', ')})`
    );
  }
  if (ownership === 'community_cooperative') {
    missingInfo.push('How many registered members does the cooperative have?');
    missingInfo.push("What is the cooperative's track record?");
  }

  // Calculate readiness summary
  const ready = readinessChecklist.filter((item) => item.status === 'ready').length;
  const notReady = readinessChecklist.filter((item) => item.status === 'not_ready').length;
  const unknown = readinessChecklist.filter((item) => item.status === 'unknown').length;

  let overallReadiness: 'ready_to_submit' | 'nearly_ready' | 'significant_gaps' | 'major_work_needed';
  if (ready >= 8) {
    overallReadiness = 'ready_to_submit';
  } else if (ready >= 5) {
    overallReadiness = 'nearly_ready';
  } else if (notReady >= 5) {
    overallReadiness = 'significant_gaps';
  } else {
    overallReadiness = 'major_work_needed';
  }

  const criticalGaps = readinessChecklist
    .filter((item) => item.priority === 'critical' && item.status !== 'ready')
    .map((item) => item.item);

  // Funder-specific guidance
  const funderGuidance = {
    key_funder_priorities:
      matches.length > 0
        ? [
            'Community ownership and local capacity building',
            'Productive use integration for sustainability',
            'Clear debt-free financing structure',
            'Alignment with national electrification plans',
          ]
        : undefined,
    common_mistakes_to_avoid: [
      'Underestimating demand assessment requirements',
      'Weak community engagement documentation',
      'Unclear ownership and governance structure',
      'Missing climate impact quantification',
    ],
    recommended_attachments: [
      'Entity registration certificate',
      'Community endorsement letters',
      'Preliminary technical design',
      'Demand assessment survey results',
      'Site photos and location map',
    ],
  };

  return {
    project_name: project.project_name,
    target_funder: targetFunder,
    proposal_outline: proposalOutline,
    readiness_checklist: readinessChecklist,
    missing_info_questionnaire: missingInfo,
    readiness_summary: {
      overall_readiness: overallReadiness,
      ready_count: ready,
      not_ready_count: notReady,
      unknown_count: unknown,
      critical_gaps: criticalGaps,
      estimated_preparation_effort: ready >= 5 ? 'weeks' : 'months',
    },
    funder_specific_guidance: funderGuidance,
    debt_sensitivity_statement: `This project is classified as ${interpretation.debt_sensitivity_tier?.replace('_', ' ').toUpperCase() || 'TIER 2'} for debt sensitivity. ${interpretation.debt_exposure_risks[0]}`,
    m300_alignment_statement: `With an M300 alignment score of ${interpretation.m300_alignment_score}/100, this project demonstrates ${interpretation.m300_alignment_score >= 70 ? 'strong' : 'moderate'} alignment with Mission 300's debt-sensitive principles, prioritizing grant funding and ${ownership.includes('community') ? 'community' : 'local'} ownership.`,
  };
}
