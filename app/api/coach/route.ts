import { NextRequest, NextResponse } from 'next/server';
import { ProjectIntakeSchema, PolicyInterpretationSchema, GrantMatchSchema } from '@/lib/schemas';
import { interpretPolicy } from '@/lib/agents/policy-interpreter';
import { matchGrants } from '@/lib/agents/grant-matcher';
import { coachProposal } from '@/lib/agents/proposal-coach';

interface CoachRequestBody {
  project: unknown;
  policy?: unknown;
  grants?: unknown;
}

export async function POST(request: NextRequest) {
  try {
    const body: CoachRequestBody = await request.json();

    // Parse and validate project intake
    const projectResult = ProjectIntakeSchema.safeParse(body.project);
    if (!projectResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid project intake data',
          details: projectResult.error.errors,
        },
        { status: 400 }
      );
    }

    const project = projectResult.data;

    // Use provided policy or generate
    let policy;
    if (body.policy) {
      const policyResult = PolicyInterpretationSchema.safeParse(body.policy);
      if (!policyResult.success) {
        return NextResponse.json(
          {
            error: 'Invalid policy interpretation data',
            details: policyResult.error.errors,
          },
          { status: 400 }
        );
      }
      policy = policyResult.data;
    } else {
      policy = interpretPolicy(project);
    }

    // Use provided grants or generate
    let grants;
    if (body.grants) {
      const grantsResult = GrantMatchSchema.safeParse(body.grants);
      if (!grantsResult.success) {
        return NextResponse.json(
          {
            error: 'Invalid grant match data',
            details: grantsResult.error.errors,
          },
          { status: 400 }
        );
      }
      grants = grantsResult.data;
    } else {
      grants = matchGrants(project);
    }

    // Run proposal coaching
    const coach = coachProposal(project, policy, grants);

    return NextResponse.json({
      coach,
      metadata: {
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Proposal coaching error:', error);
    return NextResponse.json(
      {
        error: 'Failed to coach proposal',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
