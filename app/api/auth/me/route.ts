import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ advisor: null });
  }

  // Get full advisor details
  const advisor = await prisma.advisor.findUnique({
    where: { id: session.id },
    select: {
      id: true,
      email: true,
      name: true,
      organization: true,
      role: true,
      createdAt: true,
      _count: {
        select: { projects: true },
      },
    },
  });

  if (!advisor) {
    return NextResponse.json({ advisor: null });
  }

  return NextResponse.json({
    advisor: {
      id: advisor.id,
      email: advisor.email,
      name: advisor.name,
      organization: advisor.organization,
      role: advisor.role,
      createdAt: advisor.createdAt,
      projectCount: advisor._count.projects,
    },
  });
}
