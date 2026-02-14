import { NextRequest, NextResponse } from 'next/server';
import { ProjectIntakeSchema } from '@/lib/schemas';
import { matchGrants } from '@/lib/agents/grant-matcher';
import { getServerSession } from '@/lib/auth';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { rejectIfCrossOrigin } from '@/lib/request-security';

export async function POST(request: NextRequest) {
  try {
    const originError = rejectIfCrossOrigin(request);
    if (originError) return originError;

    const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const ip = getClientIp(request);
    const ipLimit = checkRateLimit(`grants:ip:${ip}`, {
      max: 80,
      windowMs: 10 * 60 * 1000,
    });
    const userLimit = checkRateLimit(`grants:user:${session.id}`, {
      max: 40,
      windowMs: 10 * 60 * 1000,
    });
    if (!ipLimit.allowed || !userLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many grant-matching requests. Please try again later.' },
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

    // Run grant matching
    const grants = matchGrants(project);

    return NextResponse.json({
      grants,
      metadata: {
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Grant matching error:', error);
    return NextResponse.json(
      {
        error: 'Failed to match grants',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
