import { NextRequest, NextResponse } from 'next/server';
import { ProjectIntakeSchema } from '@/lib/schemas';
import { interpretPolicy } from '@/lib/agents/policy-interpreter';
import { enhanceNarrative, isConfigured } from '@/lib/llm/client';
import { M300_SYSTEM_PROMPT, getPolicyEnhancementPrompt } from '@/lib/llm/prompts';
import { requireAuth } from '@/lib/access-control';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { rejectIfCrossOrigin } from '@/lib/request-security';

export async function POST(request: NextRequest) {
  try {
    const originError = rejectIfCrossOrigin(request);
    if (originError) return originError;

    const auth = await requireAuth();
    if (!auth.ok) return auth.response;
    const { session } = auth;

    const ip = getClientIp(request);
    const ipLimit = checkRateLimit(`policy:ip:${ip}`, {
      max: 60,
      windowMs: 10 * 60 * 1000,
    });
    const userLimit = checkRateLimit(`policy:user:${session.id}`, {
      max: 30,
      windowMs: 10 * 60 * 1000,
    });
    if (!ipLimit.allowed || !userLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many policy requests. Please try again later.' },
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

    // Run policy interpretation
    let policy = interpretPolicy(project);

    // Check for enhanced mode
    const enhance = request.nextUrl.searchParams.get('enhance') === 'true';
    const useEnhancedMode = request.nextUrl.searchParams.get('enhanced_mode') === 'true';

    if (enhance && isConfigured()) {
      try {
        const enhancedNarrative = await enhanceNarrative(
          M300_SYSTEM_PROMPT,
          getPolicyEnhancementPrompt(project, policy),
          { useEnhancedMode, maxTokens: 1024 }
        );

        policy = {
          ...policy,
          alignment_narrative: enhancedNarrative,
        };
      } catch (llmError) {
        console.error('LLM enhancement failed:', llmError);
        // Continue with base analysis
      }
    }

    return NextResponse.json({
      policy,
      metadata: {
        enhanced: enhance && isConfigured(),
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Policy interpretation error:', error);
    return NextResponse.json(
      {
        error: 'Failed to interpret policy',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
