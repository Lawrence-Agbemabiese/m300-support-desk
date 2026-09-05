import { interpretPolicy } from '@/lib/agents/policy-interpreter';
import { matchGrants } from '@/lib/agents/grant-matcher';
import { coachProposal } from '@/lib/agents/proposal-coach';
import { exploreTradeOffs } from '@/lib/agents/policy-tradeoff';
import { enhanceNarrative, isConfigured } from '@/lib/llm/client';
import { M300_SYSTEM_PROMPT, getPolicyEnhancementPrompt } from '@/lib/llm/prompts';
import type { AnalysisResult, ProjectIntake } from '@/lib/schemas';

export interface AnalysisOptions { enhance: boolean; enhancedMode: boolean; }

export async function analyzeProject(project: ProjectIntake, options: AnalysisOptions): Promise<AnalysisResult> {
  const startTime = Date.now();
  let policy = interpretPolicy(project);
  const tradeoffs = exploreTradeOffs(project, policy);
  const grants = matchGrants(project);
  const coach = coachProposal(project, policy, grants);
  let modelUsed: string | undefined;
  if (options.enhance && isConfigured()) {
    try {
      const enhancedNarrative = await enhanceNarrative(M300_SYSTEM_PROMPT, getPolicyEnhancementPrompt(project, policy), { useEnhancedMode: options.enhancedMode, maxTokens: 1024 });
      policy = { ...policy, alignment_narrative: enhancedNarrative };
      modelUsed = options.enhancedMode ? 'claude-opus-4-20250514' : 'claude-sonnet-4-20250514';
    } catch (error) { console.error('LLM enhancement failed, using base analysis:', error); }
  }
  return { project, policy, grants, coach, tradeoffs, metadata: { enhanced: Boolean(modelUsed), model: modelUsed, timestamp: new Date().toISOString(), processing_time_ms: Date.now() - startTime } };
}
