import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from '@/lib/auth';
import { z } from 'zod';

const statusValues = ['submitted', 'in_review', 'approved', 'needs_info', 'archived'] as const;
const ProjectsQuerySchema = z.object({
  status: z.enum(statusValues).optional(),
  country: z.string().trim().min(2).max(120).optional(),
  myProjects: z.boolean().optional(),
  limit: z.preprocess(
    (value) => (value === undefined ? 50 : Number(value)),
    z.number().int().min(1).max(100)
  ),
  offset: z.preprocess(
    (value) => (value === undefined ? 0 : Number(value)),
    z.number().int().min(0)
  ),
});

// GET /api/projects - List all projects
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const parsed = ProjectsQuerySchema.safeParse({
      status: searchParams.get('status') || undefined,
      country: searchParams.get('country') || undefined,
      myProjects: searchParams.get('my_projects') === 'true',
      limit: searchParams.get('limit') ?? undefined,
      offset: searchParams.get('offset') ?? undefined,
    });
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters' },
        { status: 400 }
      );
    }
    const { status, country, myProjects, limit, offset } = parsed.data;

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (country) where.country = country;
    if (session.role !== 'admin' || myProjects) {
      where.advisorId = session.id;
    }

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
          projectName: true,
          country: true,
          technologyType: true,
          estimatedCostUsd: true,
          ownershipModel: true,
          projectStage: true,
          m300Score: true,
          debtTier: true,
          topFunder: true,
          topFunderScore: true,
          status: true,
          enhanced: true,
          advisor: {
            select: {
              id: true,
              name: true,
              organization: true,
            },
          },
        },
      }),
      prisma.project.count({ where }),
    ]);

    return NextResponse.json({
      projects,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + projects.length < total,
      },
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}
