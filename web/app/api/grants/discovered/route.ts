import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from '@/lib/auth';

// GET - List discovered grants
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') || 'pending';
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

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
