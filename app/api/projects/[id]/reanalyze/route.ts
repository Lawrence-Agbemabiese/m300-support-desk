import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { isAdmin, requireAuth } from '@/lib/access-control';
import { prisma } from '@/lib/db';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { rejectIfCrossOrigin } from '@/lib/request-security';
import { ProjectIntakeSchema } from '@/lib/schemas';
import { analyzeProject } from '@/lib/project-analysis';
import { analysisToProjectData, analysisToRevisionData, intakeToProjectData } from '@/lib/project-record';

const ReanalysisRequestSchema = z.object({ project: ProjectIntakeSchema, expected_updated_at: z.string().datetime() });
class RevisionConflictError extends Error {}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const originError = rejectIfCrossOrigin(request); if (originError) return originError;
    const auth = await requireAuth(); if (!auth.ok) return auth.response;
    const { session } = auth; const sessionIsAdmin = isAdmin(session);
    const ipLimit = checkRateLimit(`reanalyze:ip:${getClientIp(request)}`, { max: 40, windowMs: 10 * 60 * 1000 });
    const userLimit = checkRateLimit(`reanalyze:user:${session.id}`, { max: 20, windowMs: 10 * 60 * 1000 });
    if (!ipLimit.allowed || !userLimit.allowed) return NextResponse.json({ error: 'Too many reanalysis requests. Please try again later.' }, { status: 429 });

    const { id } = await params;
    const parsed = ReanalysisRequestSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: 'Invalid reanalysis payload', details: parsed.error.errors }, { status: 400 });
    const existing = await prisma.project.findFirst({ where: sessionIsAdmin ? { id } : { id, advisorId: session.id }, select: { id: true, updatedAt: true, currentRevision: true } });
    if (!existing) return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    const expectedUpdatedAt = new Date(parsed.data.expected_updated_at);
    if (existing.updatedAt.getTime() !== expectedUpdatedAt.getTime()) return NextResponse.json({ error: 'This project changed after you opened it. Reload before reanalysing.' }, { status: 409 });

    const enhance = request.nextUrl.searchParams.get('enhance') === 'true';
    const enhancedMode = request.nextUrl.searchParams.get('enhanced_mode') === 'true';
    const analysis = await analyzeProject(parsed.data.project, { enhance, enhancedMode });
    const revisionNumber = existing.currentRevision + 1;
    const updatedProject = await prisma.$transaction(async (transaction) => {
      const updated = await transaction.project.updateMany({
        where: { id, updatedAt: expectedUpdatedAt, ...(sessionIsAdmin ? {} : { advisorId: session.id }) },
        data: { ...intakeToProjectData(parsed.data.project), ...analysisToProjectData(analysis), currentRevision: revisionNumber, status: 'submitted' },
      });
      if (updated.count !== 1) throw new RevisionConflictError();
      await transaction.projectRevision.create({ data: { ...analysisToRevisionData(analysis, revisionNumber, 'reanalysis', session.id), projectId: id } });
      return transaction.project.findUniqueOrThrow({ where: { id }, select: { updatedAt: true } });
    });
    return NextResponse.json({ ...analysis, metadata: { ...analysis.metadata, project_id: id, revision: revisionNumber, project_updated_at: updatedProject.updatedAt.toISOString() } });
  } catch (error) {
    if (error instanceof RevisionConflictError) return NextResponse.json({ error: 'This project changed while it was being analysed. Reload and try again.' }, { status: 409 });
    console.error('Project reanalysis error:', error);
    return NextResponse.json({ error: 'Failed to reanalyse project' }, { status: 500 });
  }
}
