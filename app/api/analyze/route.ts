import { NextRequest, NextResponse } from 'next/server';
import { ProjectIntakeSchema } from '@/lib/schemas';
import { isConfigured } from '@/lib/llm/client';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/access-control';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { rejectIfCrossOrigin } from '@/lib/request-security';
import { analyzeProject } from '@/lib/project-analysis';
import { analysisToProjectData, analysisToRevisionData, intakeToProjectData } from '@/lib/project-record';

export async function POST(request: NextRequest) {
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

    const enhance = request.nextUrl.searchParams.get('enhance') === 'true';
    const enhancedMode = request.nextUrl.searchParams.get('enhanced_mode') === 'true';
    const analysis = await analyzeProject(project, { enhance, enhancedMode });
    const savedProject = await prisma.$transaction(async (transaction) => {
      const created = await transaction.project.create({ data: { ...intakeToProjectData(project), ...analysisToProjectData(analysis), advisorId: session.id, currentRevision: 1 } });
      await transaction.projectRevision.create({ data: { ...analysisToRevisionData(analysis, 1, 'initial', session.id), projectId: created.id } });
      return created;
    });

    const result = { ...analysis, metadata: { ...analysis.metadata, project_id: savedProject.id, revision: 1 } };

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
