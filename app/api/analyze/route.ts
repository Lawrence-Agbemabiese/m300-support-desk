import { NextRequest, NextResponse } from 'next/server';
import { ProjectIntakeSchema, type AnalysisResult } from '@/lib/schemas';
import { interpretPolicy } from '@/lib/agents/policy-interpreter';
import { matchGrants } from '@/lib/agents/grant-matcher';
import { coachProposal } from '@/lib/agents/proposal-coach';
import { exploreTradeOffs } from '@/lib/agents/policy-tradeoff';
import { enhanceNarrative, isConfigured } from '@/lib/llm/client';
import { M300_SYSTEM_PROMPT, getPolicyEnhancementPrompt } from '@/lib/llm/prompts';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/access-control';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { rejectIfCrossOrigin } from '@/lib/request-security';

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const originError = rejectIfCrossOrigin(request);
    if (originError) return originError;

    const ip = getClientIp(request);
    const ipLimit = checkRateLimit(`analyze:ip:${ip}`, {
      max: 40,
      windowMs: 10 * 60 * 1000,
    });
    if (!ipLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many analysis requests. Please try again later.' },
        { status: 429 }
      );
    }

    const auth = await requireAuth();
    if (!auth.ok) return auth.response;
    const { session } = auth;

    const userLimit = checkRateLimit(`analyze:user:${session.id}`, {
      max: 20,
      windowMs: 10 * 60 * 1000,
    });
    if (!userLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many analysis requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Parse and validate project intake
    const parseResult = ProjectIntakeSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid project intake data',
          details: parseResult.error.errors,
        },
        { status: 400 }
      );
    }

    const project = parseResult.data;

    // Check for enhanced mode
    const enhance = request.nextUrl.searchParams.get('enhance') === 'true';
    const useEnhancedMode = request.nextUrl.searchParams.get('enhanced_mode') === 'true';

    // Step 1: Policy Interpretation
    let policy = interpretPolicy(project);

    // Step 1b: Policy Trade-Off Explorer (deterministic, no LLM)
    const tradeoffs = exploreTradeOffs(project, policy);

    // Step 2: Grant Matching
    const grants = matchGrants(project);

    // Step 3: Proposal Coaching
    const coach = coachProposal(project, policy, grants);

    // Optional: Enhance with Claude API
    let modelUsed: string | undefined;
    if (enhance && isConfigured()) {
      try {
        const enhancedNarrative = await enhanceNarrative(
          M300_SYSTEM_PROMPT,
          getPolicyEnhancementPrompt(project, policy),
          { useEnhancedMode, maxTokens: 1024 }
        );

        // Update policy with enhanced narrative
        policy = {
          ...policy,
          alignment_narrative: enhancedNarrative,
        };

        modelUsed = useEnhancedMode ? 'claude-opus-4-20250514' : 'claude-sonnet-4-20250514';
      } catch (llmError) {
        console.error('LLM enhancement failed, using base analysis:', llmError);
        // Continue with base analysis
      }
    }

    const processingTime = Date.now() - startTime;

    // Save to database
    const savedProject = await prisma.project.create({
      // Cast to any to remain compatible until Prisma client is regenerated with new column
      data: {
        projectName: project.project_name,
        country: project.country,
        locationDescription: project.location_description,
        technologyType: project.technology_type,
        capacityKw: project.capacity_kw,
        targetBeneficiaries: project.target_beneficiaries,
        ownershipModel: project.ownership_model,
        productiveUses: JSON.stringify(project.productive_uses),
        estimatedCostUsd: project.estimated_cost_usd,
        existingFunding: project.existing_funding,
        projectStage: project.project_stage,
        communityEngagement: project.community_engagement,
        additionalContext: project.additional_context,
        debtPreference: project.debt_preference,
        policyResult: JSON.stringify(policy),
        grantsResult: JSON.stringify(grants),
        coachResult: JSON.stringify(coach),
        tradeoffsResult: JSON.stringify(tradeoffs),
        m300Score: policy.m300_alignment_score,
        debtTier: policy.debt_sensitivity_tier,
        topFunder: grants.matches[0]?.funder_name,
        topFunderScore: grants.matches[0]?.fit_score,
        enhanced: Boolean(modelUsed),
        processingTimeMs: processingTime,
        advisorId: session.id,
      } as any,
    });

    const result: AnalysisResult = {
      project,
      policy,
      grants,
      coach,
      tradeoffs,
      metadata: {
        enhanced: Boolean(modelUsed),
        model: modelUsed,
        timestamp: new Date().toISOString(),
        processing_time_ms: processingTime,
        project_id: savedProject.id,
      },
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      {
        error: 'Failed to analyze project',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'M300 Support Desk Analysis API',
    endpoints: {
      POST: {
        description: 'Analyze a project for M300 alignment and grant matching',
        query_params: {
          enhance: 'Set to "true" to enable LLM enhancement (requires ANTHROPIC_API_KEY)',
          enhanced_mode: 'Set to "true" to use Opus model for deeper analysis',
        },
        body: 'ProjectIntake JSON object',
      },
    },
    llm_configured: isConfigured(),
  });
}
