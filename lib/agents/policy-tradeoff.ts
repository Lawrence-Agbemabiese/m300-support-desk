import type { ProjectIntake, PolicyInterpretation } from '@/lib/schemas';

export interface TradeOffScenario {
  title: string;
  description: string;
  upsides: string[];
  risks: string[];
  signals_to_monitor: string[];
  suggested_actions: string[];
}

export interface TradeOffExplorerResult {
  sensitivity_drivers: string[];
  priority_trade_offs: TradeOffScenario[];
  bottom_line: string;
}

// Lightweight, deterministic helper — avoids LLM calls and keeps logic close to policy outputs.
export function exploreTradeOffs(project: ProjectIntake, policy: PolicyInterpretation): TradeOffExplorerResult {
  const ownership = project.ownership_model;
  const tier = policy.debt_sensitivity_tier || 'tier_2';
  const tech = project.technology_type === 'other' && project.technology_other ? project.technology_other : project.technology_type.replace(/_/g, ' ');
  const country = project.country;

  const sensitivity_drivers = [
    `Funding preference (${project.debt_preference.replace(/_/g, ' ')}) determines ${tier === 'tier_1' ? 'Tier 1 — low/no debt preferred' : 'Tier 2 — some debt accepted'}`,
    `Ownership model (${ownership === 'other' && project.ownership_other ? project.ownership_other : ownership.replace(/_/g, ' ')}) is assessed separately for governance and benefit sharing`,
    `Capital need: $${project.estimated_cost_usd.toLocaleString()} for ${tech}`,
    project.productive_uses?.length ? `Productive uses: ${project.productive_uses.slice(0, 3).join(', ')}` : 'Productive uses: not specified',
  ];

  const tradeOffs: TradeOffScenario[] = [];

  // Community/public vs speed of execution
  tradeOffs.push({
    title: 'Community/Public Ownership vs Execution Speed',
    description: 'Deep community/public ownership can strengthen governance and local-benefit alignment but may lengthen approvals.',
    upsides: ['Stronger grant eligibility', 'Lower debt exposure', 'Political goodwill in ' + country],
    risks: ['Longer decision cycles', 'Complex governance setup', 'Potential scope creep from stakeholders'],
    signals_to_monitor: [
      'Community meeting cadence and quorum',
      'Government endorsement timeline',
      'Board/committee formation progress',
    ],
    suggested_actions: [
      'Lock a lightweight governance charter with timelines',
      'Use timeboxed consultations with clear decision gates',
      'Document consent and roles to de-risk future disputes',
    ],
  });

  // Grant-only vs blended
  tradeOffs.push({
    title: 'Grant-Only Position vs Blended Flexibility',
    description: 'Grant-only stance preserves fiscal space; blended may speed funding but adds debt/guarantee risk.',
    upsides: ['Maximum debt protection', 'Alignment with M300 messaging', 'Simpler cap table'],
    risks: [
      'Fewer instruments available if grants are scarce',
      'Risk of delays waiting for pure grants',
      'Bridge finance may still be needed for RBF instruments',
    ],
    signals_to_monitor: [
      'Grant call timelines for top funders',
      'Availability of concessional/guarantee terms without sovereign backstop',
      'Cash flow coverage during construction',
    ],
    suggested_actions: [
      'Maintain grant-first narrative; pre-negotiate soft terms if blended becomes necessary',
      'Model RBF cash flow with bridge assumptions',
      'Prepare credit/guarantee exclusion language for sovereign liabilities',
    ],
  });

  // Ticket size vs scope
  tradeOffs.push({
    title: 'Ticket Size Fit vs Project Scope',
    description: 'Scaling capacity to match funder ticket sizes can unlock funding but risks overbuild.',
    upsides: ['Access to larger grants', 'Room for productive use pilots', 'Future-proofed infrastructure'],
    risks: ['Overestimated demand → idle assets', 'Higher O&M burden', 'Community affordability pressure'],
    signals_to_monitor: ['Demand survey results', 'Anchor offtaker commitments', 'Tariff affordability benchmarks'],
    suggested_actions: [
      'Stage deployment (Phase 1 core load, Phase 2 productive use)',
      'Align ask with conservative demand; include expansion option',
      'Bundle training/O&M budget to avoid hidden costs',
    ],
  });

  const bottom_line = tier === 'tier_1'
    ? 'Stay grant-led and verify that final terms preserve the intended low/no-debt position.'
    : 'Compare repayment, currency, guarantee, and contingent-liability terms while keeping grant options prominent.';

  return {
    sensitivity_drivers,
    priority_trade_offs: tradeOffs,
    bottom_line,
  };
}
