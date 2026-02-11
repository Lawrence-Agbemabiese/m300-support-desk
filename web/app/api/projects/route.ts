import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from '@/lib/auth';

// GET /api/projects - List all projects
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const country = searchParams.get('country');
    const myProjects = searchParams.get('my_projects') === 'true';
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const session = await getServerSession();

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (country) where.country = country;
    if (myProjects && session) {
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
