import type { ProjectIntake, PolicyInterpretation, GrantMatch } from '@/lib/schemas';

/**
 * M300 System Prompt - Core principles for all LLM interactions
 */
export const M300_SYSTEM_PROMPT = `You are an expert advisor for Mission 300, helping African communities and governments access grant funding for energy projects while protecting fiscal capacity.

KEY PRINCIPLES (ALWAYS APPLY):

1. DEBT SENSITIVITY: Evaluate repayment, currency, guarantee, and contingent-liability exposure explicitly. Prioritize grants while treating debt sensitivity as a weighted consideration, not an automatic exclusion.

2. GRANT-FIRST APPROACH: Always prioritize grants over loans. When evaluating funding options:
   - Tier 1 (Green): Low/no-debt finance preferred
   - Tier 2 (Yellow): Some debt accepted, with terms and guarantees reviewed

3. COMMUNITY OWNERSHIP: Strongly prefer community cooperatives and public utility ownership models because they:
   - Keep revenues within the community
   - Prevent capital flight to external investors
   - Build local capacity
   - Can reduce reliance on external guarantees when well structured

4. PRODUCTIVE USE: Energy projects with productive use components (processing, cold storage, etc.) are more sustainable and attractive to grant funders.

COMMUNICATION STYLE:
- Be direct and practical
- Provide specific, actionable guidance
- Acknowledge uncertainty where it exists
- Focus on what the community can control
- Avoid jargon; explain technical terms when needed`;

/**
 * Enhanced Policy Interpretation Prompt
 */
export function getPolicyEnhancementPrompt(
  project: ProjectIntake,
  baseInterpretation: PolicyInterpretation
): string {
  return `Based on this project and initial analysis, provide an enhanced narrative that:
1. Explains the M300 alignment in accessible terms
2. Highlights specific strengths for grant applications
3. Identifies any risks or concerns to address
4. Suggests how to position this project for maximum grant appeal

PROJECT DETAILS:
- Name: ${project.project_name}
- Country: ${project.country}
- Technology: ${project.technology_type === 'other' && project.technology_other ? project.technology_other : project.technology_type.replace(/_/g, ' ')}
- Capacity: ${project.capacity_kw || 'Not specified'} kW
- Ownership: ${project.ownership_model === 'other' && project.ownership_other ? project.ownership_other : project.ownership_model.replace(/_/g, ' ')}
- Cost: $${project.estimated_cost_usd.toLocaleString()}
- Beneficiaries: ${project.target_beneficiaries}
- Productive Uses: ${project.productive_uses?.join(', ') || 'None specified'}
- Debt Preference: ${project.debt_preference?.replace(/_/g, ' ') || 'Not specified'}

INITIAL ANALYSIS:
- M300 Alignment Score: ${baseInterpretation.m300_alignment_score}/100
- Funding Tier: ${baseInterpretation.debt_sensitivity_tier === 'tier_1' ? 'Tier 1 — low/no debt preferred' : 'Tier 2 — some debt accepted'}
- Grant-Suitable Elements: ${baseInterpretation.grant_suitable_elements.join('; ')}

Provide a 2-3 paragraph enhanced narrative that a project team could use to understand their grant positioning and what to emphasize in applications.`;
}

/**
 * Proposal Section Enhancement Prompt
 */
export function getProposalSectionPrompt(
  project: ProjectIntake,
  section: string,
  baseContent: string,
  targetFunder: string
): string {
  return `Enhance this proposal section for a grant application to ${targetFunder}.

PROJECT: ${project.project_name}
SECTION: ${section}

CURRENT DRAFT:
${baseContent}

Improve this section by:
1. Making language more compelling for grant reviewers
2. Emphasizing M300 alignment and a debt-sensitive, grant-first approach
3. Adding specific, relevant details
4. Ensuring clear connection to funder priorities
5. Maintaining focus on community ownership benefits

Provide the enhanced section (300-400 words) in a format ready for a grant application.`;
}

/**
 * Funder-Specific Guidance Prompt
 */
export function getFunderGuidancePrompt(
  project: ProjectIntake,
  grantMatch: GrantMatch,
  interpretation: PolicyInterpretation
): string {
  const topMatch = grantMatch.matches[0];
  if (!topMatch) {
    return '';
  }

  return `Provide specific guidance for applying to ${topMatch.funder_name}.

PROJECT SUMMARY:
- Name: ${project.project_name}
- Country: ${project.country}
- Technology: ${project.technology_type === 'other' && project.technology_other ? project.technology_other : project.technology_type.replace(/_/g, ' ')}
- Ownership: ${project.ownership_model === 'other' && project.ownership_other ? project.ownership_other : project.ownership_model.replace(/_/g, ' ')}
- Cost: $${project.estimated_cost_usd.toLocaleString()}

FIT ANALYSIS:
- Fit Score: ${topMatch.fit_score}/100
- Instrument: ${topMatch.instrument_type}
- Key Strengths: ${topMatch.fit_rationale.slice(0, 2).join('; ')}
- Red Flags: ${topMatch.red_flags?.join('; ') || 'None identified'}

M300 CONTEXT:
- Alignment Score: ${interpretation.m300_alignment_score}/100
- Funding Tier: ${interpretation.debt_sensitivity_tier === 'tier_1' ? 'Tier 1 — low/no debt preferred' : 'Tier 2 — some debt accepted'}

Provide:
1. 3-4 key priorities this funder looks for
2. 2-3 common mistakes to avoid
3. Specific framing suggestions for this project
4. List of likely required documents

Keep guidance practical and actionable.`;
}

/**
 * Missing Information Analysis Prompt
 */
export function getMissingInfoPrompt(project: ProjectIntake): string {
  return `Analyze this project intake for critical missing information that grant funders typically require.

PROJECT DETAILS:
${JSON.stringify(project, null, 2)}

Identify:
1. Critical gaps that must be addressed before any application
2. Information that would significantly strengthen the application
3. Specific questions to ask the project proponent

Focus on what's actually missing or unclear in the provided information. Be specific about what additional data would strengthen grant applications.`;
}

/**
 * Risk Analysis Enhancement Prompt
 */
export function getRiskAnalysisPrompt(
  project: ProjectIntake,
  interpretation: PolicyInterpretation
): string {
  return `Provide a comprehensive risk analysis for this project from a grant funder's perspective.

PROJECT: ${project.project_name}
COUNTRY: ${project.country}
OWNERSHIP: ${project.ownership_model === 'other' && project.ownership_other ? project.ownership_other : project.ownership_model.replace(/_/g, ' ')}
FUNDING TIER: ${interpretation.debt_sensitivity_tier === 'tier_1' ? 'Tier 1 — low/no debt preferred' : 'Tier 2 — some debt accepted'}

Current Identified Risks:
- Debt Risks: ${interpretation.debt_exposure_risks.join('; ')}
- Private Capital Risks: ${interpretation.private_capital_risks?.join('; ') || 'Not specified'}

Analyze:
1. Technical risks (equipment, maintenance, capacity)
2. Financial risks (revenue, affordability, sustainability)
3. Governance risks (capacity, oversight, accountability)
4. External risks (policy, climate, market)
5. Debt-specific risks from M300 perspective

For each risk, provide:
- Likelihood (Low/Medium/High)
- Impact (Low/Medium/High)
- Mitigation strategy

Format as a clear risk register suitable for a grant proposal.`;
}
