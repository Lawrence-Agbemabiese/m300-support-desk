import { NextRequest, NextResponse } from 'next/server';
import { ProjectIntakeSchema } from '@/lib/schemas';
import { interpretPolicy } from '@/lib/agents/policy-interpreter';
import { enhanceNarrative, isConfigured } from '@/lib/llm/client';
import { M300_SYSTEM_PROMPT, getPolicyEnhancementPrompt } from '@/lib/llm/prompts';

export async function POST(request: NextRequest) {
  try {
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
