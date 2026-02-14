import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/access-control';

// GET - List advisors (admin only)
export async function GET() {
  try {
    const admin = await requireAdmin();
    if (!admin.ok) return admin.response;

    const advisors = await prisma.advisor.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        email: true,
        name: true,
        organization: true,
        role: true,
        _count: {
          select: {
            projects: true,
          },
        },
      },
    });

    return NextResponse.json({ advisors });
  } catch (error) {
    console.error('Error fetching advisors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch advisors' },
      { status: 500 }
    );
  }
}
