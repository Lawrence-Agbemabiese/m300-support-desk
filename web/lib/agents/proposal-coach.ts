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
  const cleanLocation = (() => {
    const normalized = location.trim().replace(/\s+/g, ' ');
    const withoutLeadIn = normalized
      .replace(/^(located|situated|based)\s+in\s+/i, '')
      .replace(/^in\s+/i, '')
      .replace(/^at\s+/i, '')
      .replace(/^within\s+/i, '');

    if (!withoutLeadIn) return country || 'the project area';
    return withoutLeadIn;
  })();
  const beneficiaries = project.target_beneficiaries || 'target beneficiaries';
  const productiveUses = project.productive_uses || [];
  const capacity = project.capacity_kw;
  const existingFunding = project.existing_funding || '';
  const readiness = project.readiness_evidence;
  const implementationEvidence = readiness?.implementation_timeline;

  const evidenceSummary = (
    key: keyof NonNullable<ProjectIntake['readiness_evidence']>,
    label: string
  ): string => {
    const item = readiness?.[key];
    if (!item) return `${label}: status unknown.`;
    if (item.status === 'complete') {
      return item.details?.trim().length ? `${label}: ${item.details.trim()}` : `${label}: complete.`;
    }
    if (item.status === 'partial') {
      return item.details?.trim().length
        ? `${label}: partial - ${item.details.trim()}`
        : `${label}: partial - additional work required.`;
    }
    if (item.status === 'missing') {
      return `${label}: missing.`;
    }
    return `${label}: status unknown${item.details?.trim().length ? ` - ${item.details.trim()}` : ''}.`;
  };

  // Generate proposal outline
  const proposalOutline = {
    problem_statement:
      `The project site is in ${cleanLocation}, where approximately [X] people lack access to reliable electricity. ` +
      (techType.toLowerCase().includes('health')
        ? 'Health facilities operate without reliable power, affecting service delivery. '
        : 'This energy poverty constrains economic development and quality of life. ') +
      (productiveUses.length > 0
        ? `Without electricity, productive activities like ${productiveUses.slice(0, 2).join(', ')} cannot operate at full potential.`
        : '') +
      `\n\nReadiness signal: ${evidenceSummary('demand_assessment', 'Demand assessment')}`,

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
      ` ${interpretation.community_ownership_justification || ''}` +
      `\n\nReadiness signals:\n` +
      `- ${evidenceSummary('legal_entity_registration', 'Legal entity registration')}\n` +
      `- ${evidenceSummary('land_site_documentation', 'Land/site documentation')}\n` +
      `- ${evidenceSummary('community_stakeholder_endorsement', 'Community/stakeholder endorsement')}\n` +
      `- ${evidenceSummary('ministry_agency_endorsement', 'Relevant ministry/agency endorsement')}`,

    technical_approach:
      `${capacity ? `${capacity}kW` : 'Appropriately sized'} ${techType} system serving ${beneficiaries}. ` +
      (capacity
        ? 'System designed for reliability with battery storage, smart metering, and local maintainability. '
        : 'Technical specifications to be finalized. ') +
      (productiveUses.length > 0
        ? `Productive use loads (${productiveUses.slice(0, 2).join(', ')}) integrated into system design.`
        : '') +
      `\n\nReadiness signal: ${evidenceSummary('technical_design', 'Technical design')}`,

    affordability_tariff_principles:
      (techType.toLowerCase().includes('health') || ownership === 'public_utility'
        ? 'N/A - Public infrastructure funded by grant. Operational costs covered by government budget.'
        : 'Tariff structure designed around ability-to-pay: (1) Lifeline rate for basic consumption, (2) Standard rate for higher usage. Pre-paid metering ensures payment discipline. Tariff review every 2 years with community input.') +
      `\n\nFinancial readiness signals:\n` +
      `- ${evidenceSummary('detailed_budget', 'Detailed budget')}\n` +
      `- ${evidenceSummary('financial_projections', 'Financial projections')}\n` +
      `- ${evidenceSummary('co_financing_documentation', 'Co-financing documentation')}`,

    implementation_plan:
      implementationEvidence?.details && implementationEvidence.details.trim().length > 0
        ? implementationEvidence.status === 'complete'
          ? implementationEvidence.details.trim()
          : `${implementationEvidence.details.trim()}\n\nStatus: ${implementationEvidence.status.replace('_', ' ')}. Please finalize any remaining dependencies and milestone dates before submission.`
        : 'Phased implementation:\n' +
          '- Month 1-2: Detailed design, procurement, community mobilization\n' +
          '- Month 3-4: Site preparation, procurement finalization\n' +
          '- Month 5-6: Equipment installation and commissioning\n' +
          '- Month 7-8: Connections, training, operational handover\n' +
          '- Month 9-12: Performance monitoring, optimization, documentation',

    mel_framework:
      'Output indicators: Connections completed, capacity installed, system uptime\n' +
      'Outcome indicators: Beneficiary satisfaction, energy expenditure changes, income changes\n' +
      'Data collection: Smart meter analytics, quarterly surveys, annual audit\n' +
      'Learning: Quarterly reviews, annual case study, sector knowledge sharing' +
      `\n\nReadiness signal: ${evidenceSummary('mel_framework', 'M&E framework')}`,

    risk_register:
      'Technical: Equipment failure - mitigated by warranties, service agreements, spare parts\n' +
      `Financial: ${techType.toLowerCase().includes('health') ? 'Budget constraints - mitigated by Ministry commitment' : 'Payment delays - mitigated by pre-paid metering'}\n` +
      'Governance: Capacity gaps - mitigated by training, oversight, term limits\n' +
      'External: Policy changes - mitigated by community ownership resilience\n\n' +
      `DEBT SENSITIVITY: ${interpretation.debt_exposure_risks.join('; ')}. ` +
      `This project ${interpretation.debt_sensitivity_tier === 'tier_1' ? 'creates no debt obligations' : 'has debt implications requiring management'}.`,
  };

  const mapEvidenceStatus = (
    status: 'complete' | 'partial' | 'missing' | 'unknown' | undefined,
    fallback: 'ready' | 'not_ready' | 'unknown' = 'unknown'
  ): 'ready' | 'in_progress' | 'not_ready' | 'unknown' => {
    if (!status) return fallback;
    if (status === 'complete') return 'ready';
    if (status === 'partial') return 'in_progress';
    if (status === 'missing') return 'not_ready';
    return 'unknown';
  };

  const readinessChecklist: ChecklistItem[] = [
    {
      item: 'Legal entity registration',
      status: mapEvidenceStatus(readiness?.legal_entity_registration?.status, 'unknown'),
      notes: readiness?.legal_entity_registration?.details || 'Verify certificate is current',
      priority: 'critical',
    },
    {
      item: 'Land/site documentation',
      status: mapEvidenceStatus(readiness?.land_site_documentation?.status, 'unknown'),
      notes: readiness?.land_site_documentation?.details || 'Obtain lease or allocation letter',
      priority: 'critical',
    },
    {
      item: 'Community/stakeholder endorsement',
      status: mapEvidenceStatus(readiness?.community_stakeholder_endorsement?.status, 'unknown'),
      notes: readiness?.community_stakeholder_endorsement?.details || 'Document formal support',
      priority: 'critical',
    },
    {
      item: 'Relevant ministry/agency endorsement',
      status: mapEvidenceStatus(readiness?.ministry_agency_endorsement?.status, 'unknown'),
      notes: readiness?.ministry_agency_endorsement?.details || 'Obtain formal letter from relevant authority',
      priority: 'critical',
    },
    {
      item: 'Demand assessment',
      status: mapEvidenceStatus(readiness?.demand_assessment?.status, 'not_ready'),
      notes: readiness?.demand_assessment?.details || 'Conduct beneficiary survey',
      priority: 'critical',
    },
    {
      item: 'Technical design',
      status: mapEvidenceStatus(readiness?.technical_design?.status, 'not_ready'),
      notes: readiness?.technical_design?.details || 'Commission preliminary design',
      priority: 'important',
    },
    {
      item: 'Detailed budget',
      status: mapEvidenceStatus(readiness?.detailed_budget?.status, 'not_ready'),
      notes: readiness?.detailed_budget?.details || 'Obtain equipment quotes',
      priority: 'important',
    },
    {
      item: 'Financial projections',
      status: mapEvidenceStatus(readiness?.financial_projections?.status, 'not_ready'),
      notes: readiness?.financial_projections?.details || 'Develop 5-year model',
      priority: 'important',
    },
    {
      item: 'Co-financing documentation',
      status: mapEvidenceStatus(
        readiness?.co_financing_documentation?.status,
        existingFunding ? 'unknown' : 'not_ready'
      ),
      notes: readiness?.co_financing_documentation?.details || `Document ${existingFunding || 'any contributions'}`,
      priority: 'important',
    },
    {
      item: 'Implementation timeline',
      status: mapEvidenceStatus(readiness?.implementation_timeline?.status, 'unknown'),
      notes: readiness?.implementation_timeline?.details || 'Add milestone-based implementation schedule',
      priority: 'important',
    },
    {
      item: 'M&E framework',
      status: mapEvidenceStatus(readiness?.mel_framework?.status, 'unknown'),
      notes: readiness?.mel_framework?.details || 'Define indicators, baselines, and reporting cadence',
      priority: 'important',
    },
  ];

  // Generate targeted missing-info questionnaire (only ask what is incomplete/unclear)
  const missingInfoSet = new Set<string>();
  const addQuestion = (question: string | undefined) => {
    if (!question) return;
    const clean = question.trim();
    if (clean.length > 0) missingInfoSet.add(clean);
  };

  const readinessQuestionMap = {
    legal_entity_registration: 'Legal entity registration',
    land_site_documentation: 'Land/site documentation',
    community_stakeholder_endorsement: 'Community/stakeholder endorsement',
    ministry_agency_endorsement: 'Relevant ministry/agency endorsement',
    demand_assessment: 'Demand assessment',
    technical_design: 'Technical design',
    detailed_budget: 'Detailed budget',
    financial_projections: 'Financial projections',
    co_financing_documentation: 'Co-financing documentation',
    implementation_timeline: 'Implementation timeline',
    mel_framework: 'M&E framework',
  } as const;

  if (readiness) {
    for (const [key, label] of Object.entries(readinessQuestionMap)) {
      const item = readiness[key as keyof typeof readiness];
      if (!item || item.status === 'complete') continue;

      if (item.status === 'partial') {
        addQuestion(
          `${label}: what remains to finalize this item before submission?` +
          (item.details ? ` (Current note: ${item.details})` : '')
        );
      } else {
        addQuestion(
          `${label}: provide status and supporting evidence/reference (document name or link).`
        );
      }
    }
  } else {
    // Backward compatibility for older inputs without readiness evidence
    addQuestion('Provide status and evidence for legal entity registration.');
    addQuestion('Provide status and evidence for land/site documentation.');
    addQuestion('Provide status and evidence for community/stakeholder endorsement.');
    addQuestion('Provide status and evidence for demand assessment.');
    addQuestion('Provide status and evidence for technical design and budget.');
  }

  // Ask only if information is not already supplied in intake
  if (!project.contact_info?.name || !project.contact_info?.email) {
    addQuestion('Who is the primary contact person (name, role, and email)?');
  }

  if (!capacity) {
    addQuestion('What is the planned installed capacity (kW) and key load assumptions?');
  }

  if (!project.existing_funding && readiness?.co_financing_documentation?.status !== 'complete') {
    addQuestion('What co-financing (cash/in-kind) has been committed, by whom, and with what proof?');
  }

  if (!project.additional_context || !/(permit|license|approval)/i.test(project.additional_context)) {
    addQuestion('What permits/approvals are required and what is the timeline/status for each?');
  }

  if (productiveUses.length > 0 && readiness?.demand_assessment?.status !== 'complete') {
    addQuestion(
      `For productive uses (${productiveUses.slice(0, 2).join(', ')}), what demand evidence is available (off-taker, baseline usage, projected kWh)?`
    );
  }

  if (ownership === 'community_cooperative' && (!project.community_engagement || project.community_engagement.length < 40)) {
    addQuestion('For the cooperative, provide member count, governance structure, and decision-making process.');
  }

  const missingInfo = Array.from(missingInfoSet);

  // Calculate readiness summary
  const ready = readinessChecklist.filter((item) => item.status === 'ready').length;
  const notReady = readinessChecklist.filter((item) => item.status === 'not_ready').length;
  // Treat "in_progress" as pending for summary counts.
  const unknown = readinessChecklist.filter(
    (item) => item.status === 'unknown' || item.status === 'in_progress'
  ).length;

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
