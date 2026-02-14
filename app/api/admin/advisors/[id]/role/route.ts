import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/access-control';

const ALLOWED_ROLES = new Set(['advisor', 'admin']);

// PATCH - Update advisor role (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin();
    if (!admin.ok) return admin.response;
    const { session } = admin;

    const { id } = await params;
    const body = await request.json();
    const role = typeof body?.role === 'string' ? body.role.trim().toLowerCase() : '';

    if (!ALLOWED_ROLES.has(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Allowed roles: advisor, admin' },
        { status: 400 }
      );
    }

    if (session.id === id && role !== 'admin') {
      return NextResponse.json(
        { error: 'You cannot demote your own account' },
        { status: 400 }
      );
    }

    const target = await prisma.advisor.findUnique({
      where: { id },
      select: { id: true, role: true },
    });

    if (!target) {
      return NextResponse.json(
        { error: 'Advisor not found' },
        { status: 404 }
      );
    }

    if (target.role === 'admin' && role !== 'admin') {
      const adminCount = await prisma.advisor.count({
        where: { role: 'admin' },
      });

      if (adminCount <= 1) {
        return NextResponse.json(
          { error: 'Cannot demote the last admin account' },
          { status: 400 }
        );
      }
    }

    const advisor = await prisma.advisor.update({
      where: { id },
      data: { role },
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

    return NextResponse.json({ advisor });
  } catch (error) {
    console.error('Error updating advisor role:', error);
    return NextResponse.json(
      { error: 'Failed to update advisor role' },
      { status: 500 }
    );
  }
}
