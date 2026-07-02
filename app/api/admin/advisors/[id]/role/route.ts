import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/access-control';
import { getEffectiveRole, isProtectedDeveloper } from '@/lib/auth';
import { z } from 'zod';
import { rejectIfCrossOrigin } from '@/lib/request-security';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

const ALLOWED_ROLES = new Set(['advisor', 'admin']);
const RoleUpdateSchema = z.object({
  role: z.enum(['advisor', 'admin']),
});

// PATCH - Update advisor role (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const originError = rejectIfCrossOrigin(request);
    if (originError) return originError;

    const admin = await requireAdmin();
    if (!admin.ok) return admin.response;
    const { session } = admin;
    const ip = getClientIp(request);
    const limit = checkRateLimit(`admin-role-update:${session.id}:${ip}`, {
      max: 30,
      windowMs: 10 * 60 * 1000,
    });
    if (!limit.allowed) {
      return NextResponse.json(
        { error: 'Too many role update requests. Please try again later.' },
        { status: 429 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const parsed = RoleUpdateSchema.safeParse({
      role: typeof body?.role === 'string' ? body.role.trim().toLowerCase() : body?.role,
    });

    if (!parsed.success || !ALLOWED_ROLES.has(parsed.data.role)) {
      return NextResponse.json(
        { error: 'Invalid role. Allowed roles: advisor, admin' },
        { status: 400 }
      );
    }
    const { role } = parsed.data;

    if (session.id === id && role !== 'admin') {
      return NextResponse.json(
        { error: 'You cannot demote your own account' },
        { status: 400 }
      );
    }

    const target = await prisma.advisor.findUnique({
      where: { id },
      select: { id: true, email: true, name: true, role: true },
    });

    if (!target) {
      return NextResponse.json(
        { error: 'Advisor not found' },
        { status: 404 }
      );
    }

    if (isProtectedDeveloper(target)) {
      return NextResponse.json(
        { error: 'Developer access is protected and cannot be modified here' },
        { status: 400 }
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

    return NextResponse.json({
      advisor: {
        ...advisor,
        role: getEffectiveRole(advisor),
        isProtectedDeveloper: isProtectedDeveloper(advisor),
      },
    });
  } catch (error) {
    console.error('Error updating advisor role:', error);
    return NextResponse.json(
      { error: 'Failed to update advisor role' },
      { status: 500 }
    );
  }
}
