import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isAdmin, requireAdmin, requireAuth } from '@/lib/access-control';
import { normalizeLegacyProblemStatement } from '@/lib/agents/proposal-coach';
import type { AnalysisResult, ProjectIntake, PolicyInterpretation, GrantMatchResult, ProposalCoach, TradeOffExplorerResult } from '@/lib/schemas';
import { z } from 'zod';
import { rejectIfCrossOrigin } from '@/lib/request-security';

const ProjectUpdateSchema = z.object({
  status: z.enum(['submitted', 'in_review', 'approved', 'needs_info', 'archived']).optional(),
  advisorNotes: z.string().max(5000).optional(),
});

// GET /api/projects/[id] - Get single project with full details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth();
    if (!auth.ok) return auth.response;
    const { session } = auth;
    const sessionIsAdmin = isAdmin(session);

    const { id } = await params;

    const project = await prisma.project.findFirst({
      where: sessionIsAdmin ? { id } : { id, advisorId: session.id },
      include: {
        advisor: {
          select: {
            id: true,
            name: true,
            email: true,
            organization: true,
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Reconstruct the full analysis result
    const tradeoffsRaw = (project as any).tradeoffsResult as string | null | undefined;
    const parsedCoach = project.coachResult
      ? (JSON.parse(project.coachResult) as ProposalCoach)
      : null;
    const normalizedCoach = parsedCoach
      ? {
          ...parsedCoach,
          proposal_outline: {
            ...parsedCoach.proposal_outline,
            problem_statement: normalizeLegacyProblemStatement(
              parsedCoach.proposal_outline.problem_statement,
              project.locationDescription,
              project.country
            ),
          },
        }
      : null;

    const analysisResult: AnalysisResult | null = project.policyResult && normalizedCoach ? {
      project: {
        project_name: project.projectName,
        country: project.country,
        location_description: project.locationDescription,
        technology_type: project.technologyType as ProjectIntake['technology_type'],
        capacity_kw: project.capacityKw ?? undefined,
        target_beneficiaries: project.targetBeneficiaries,
        ownership_model: project.ownershipModel as ProjectIntake['ownership_model'],
        productive_uses: JSON.parse(project.productiveUses),
        estimated_cost_usd: project.estimatedCostUsd,
        existing_funding: project.existingFunding ?? undefined,
        project_stage: project.projectStage as ProjectIntake['project_stage'],
        community_engagement: project.communityEngagement ?? undefined,
        additional_context: project.additionalContext ?? undefined,
        debt_preference: project.debtPreference as ProjectIntake['debt_preference'],
      },
      policy: JSON.parse(project.policyResult) as PolicyInterpretation,
      grants: JSON.parse(project.grantsResult!) as GrantMatchResult,
      coach: normalizedCoach,
      tradeoffs: tradeoffsRaw ? (JSON.parse(tradeoffsRaw) as TradeOffExplorerResult) : undefined,
      metadata: {
        enhanced: project.enhanced,
        processing_time_ms: project.processingTimeMs ?? 0,
      },
    } : null;

    return NextResponse.json({
      id: project.id,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      status: project.status,
      advisorNotes: project.advisorNotes,
      advisor: project.advisor,
      summary: {
        projectName: project.projectName,
        country: project.country,
        technologyType: project.technologyType,
        estimatedCostUsd: project.estimatedCostUsd,
        m300Score: project.m300Score,
        debtTier: project.debtTier,
        topFunder: project.topFunder,
        topFunderScore: project.topFunderScore,
      },
      analysisResult,
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}

// PATCH /api/projects/[id] - Update project status or notes
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const originError = rejectIfCrossOrigin(request);
    if (originError) return originError;

    const auth = await requireAuth();
    if (!auth.ok) return auth.response;
    const { session } = auth;
    const sessionIsAdmin = isAdmin(session);

    const { id } = await params;
    const body = await request.json();
    const parsed = ProjectUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid project update payload' },
        { status: 400 }
      );
    }
    const parsedBody = parsed.data;

    if (parsedBody.status !== undefined && !sessionIsAdmin) {
      return NextResponse.json(
        { error: 'Only admins can update project status' },
        { status: 403 }
      );
    }

    const allowedFields: Array<keyof typeof parsedBody> = sessionIsAdmin
      ? ['status', 'advisorNotes']
      : ['advisorNotes'];
    const updateData: Record<string, string> = {};

    for (const field of allowedFields) {
      if (parsedBody[field] !== undefined) {
        updateData[field] = parsedBody[field];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      );
    }

    const existing = await prisma.project.findFirst({
      where: sessionIsAdmin ? { id } : { id, advisorId: session.id },
      select: { id: true },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    const project = await prisma.project.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        status: true,
        advisorNotes: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/[id] - Delete a project
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const originError = rejectIfCrossOrigin(request);
    if (originError) return originError;

    const admin = await requireAdmin();
    if (!admin.ok) return admin.response;

    const { id } = await params;

    await prisma.project.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}
