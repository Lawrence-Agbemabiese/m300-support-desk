import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from '@/lib/auth';
import { z } from 'zod';

const statusValues = ['pending', 'approved', 'rejected', 'duplicate', 'all'] as const;
const QuerySchema = z.object({
  status: z.enum(statusValues).optional(),
  limit: z.preprocess(
    (value) => (value === undefined ? 50 : Number(value)),
    z.number().int().min(1).max(100)
  ),
  offset: z.preprocess(
    (value) => (value === undefined ? 0 : Number(value)),
    z.number().int().min(0)
  ),
});

// GET - List discovered grants
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const parsed = QuerySchema.safeParse({
      status: searchParams.get('status') || 'pending',
      limit: searchParams.get('limit') ?? undefined,
      offset: searchParams.get('offset') ?? undefined,
    });
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters' },
        { status: 400 }
      );
    }

    const { status, limit, offset } = parsed.data;

    const where = status === 'all' ? {} : { status };

    const [grants, total] = await Promise.all([
      prisma.discoveredGrant.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.discoveredGrant.count({ where }),
    ]);

    return NextResponse.json({
      grants,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + grants.length < total,
      },
    });
  } catch (error) {
    console.error('Error fetching discovered grants:', error);
    return NextResponse.json(
      { error: 'Failed to fetch discovered grants' },
      { status: 500 }
    );
  }
}
