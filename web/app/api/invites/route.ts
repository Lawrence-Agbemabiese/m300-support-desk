import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from '@/lib/auth';
import { randomBytes } from 'crypto';

// Generate a readable invite code
function generateInviteCode(): string {
  const bytes = randomBytes(4);
  return bytes.toString('hex').toUpperCase();
}

// GET - List all invites (admin only)
export async function GET() {
  try {
    const session = await getServerSession();

    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const invites = await prisma.invite.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ invites });
  } catch (error) {
    console.error('Error fetching invites:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invites' },
      { status: 500 }
    );
  }
}

// POST - Create new invite (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { email, expiresInDays, maxUses } = body;

    const code = generateInviteCode();
    const expiresAt = expiresInDays
      ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000)
      : null;

    const invite = await prisma.invite.create({
      data: {
        code,
        email: email || null,
        createdBy: session.id,
        expiresAt,
        maxUses: maxUses || 1,
      },
    });

    return NextResponse.json({ invite });
  } catch (error) {
    console.error('Error creating invite:', error);
    return NextResponse.json(
      { error: 'Failed to create invite' },
      { status: 500 }
    );
  }
}

// DELETE - Revoke an invite (admin only)
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Invite ID required' },
        { status: 400 }
      );
    }

    await prisma.invite.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting invite:', error);
    return NextResponse.json(
      { error: 'Failed to delete invite' },
      { status: 500 }
    );
  }
}
