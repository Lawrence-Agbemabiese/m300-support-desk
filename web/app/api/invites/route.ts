import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from '@/lib/auth';
import { randomBytes } from 'crypto';
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { rejectIfCrossOrigin } from '@/lib/request-security';

// Generate a readable invite code
function generateInviteCode(): string {
  const bytes = randomBytes(6);
  return bytes.toString('hex').toUpperCase();
}

const CreateInviteSchema = z.object({
  email: z
    .union([z.string().email(), z.literal('')])
    .optional()
    .transform((value) => {
      if (!value) return undefined;
      return value.trim().toLowerCase();
    }),
  expiresInDays: z.preprocess(
    (value) => (value === '' || value === undefined || value === null ? 7 : Number(value)),
    z.number().int().min(1).max(365)
  ),
  maxUses: z.preprocess(
    (value) => (value === '' || value === undefined || value === null ? 1 : Number(value)),
    z.number().int().min(1).max(20)
  ),
});

const DeleteInviteQuerySchema = z.object({
  id: z.string().cuid(),
});

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
    const originError = rejectIfCrossOrigin(request);
    if (originError) return originError;

    const session = await getServerSession();

    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const ip = getClientIp(request);
    const limit = checkRateLimit(`admin-invites:create:${session.id}:${ip}`, {
      max: 50,
      windowMs: 10 * 60 * 1000,
    });
    if (!limit.allowed) {
      return NextResponse.json(
        { error: 'Too many invite creation requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = CreateInviteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid invite configuration' },
        { status: 400 }
      );
    }

    const { email, expiresInDays, maxUses } = parsed.data;

    const expiresAt = expiresInDays
      ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000)
      : null;

    let invite = null;
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const code = generateInviteCode();
      try {
        invite = await prisma.invite.create({
          data: {
            code,
            email: email || null,
            createdBy: session.id,
            expiresAt,
            maxUses: maxUses || 1,
          },
        });
        break;
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2002'
        ) {
          continue;
        }
        throw error;
      }
    }

    if (!invite) {
      return NextResponse.json(
        { error: 'Failed to generate a unique invite code. Please try again.' },
        { status: 500 }
      );
    }

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
    const originError = rejectIfCrossOrigin(request);
    if (originError) return originError;

    const session = await getServerSession();

    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const parsed = DeleteInviteQuerySchema.safeParse({
      id: searchParams.get('id'),
    });
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Valid invite ID required' },
        { status: 400 }
      );
    }
    const { id } = parsed.data;

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
