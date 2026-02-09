import { NextRequest, NextResponse } from 'next/server';
import { ProjectIntakeSchema } from '@/lib/schemas';
import { matchGrants } from '@/lib/agents/grant-matcher';

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
