import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

const ValidateInviteSchema = z.object({
  code: z
    .string()
    .trim()
    .min(6)
    .max(32)
    .regex(/^[A-Z0-9]+$/i)
    .transform((value) => value.toUpperCase()),
  email: z.string().email().optional().transform((value) => value?.trim().toLowerCase()),
});

const GENERIC_INVITE_ERROR = 'Invalid or unavailable invite code';

// POST - Validate an invite code
export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const ipLimit = checkRateLimit(`invite-validate:ip:${ip}`, {
      max: 50,
      windowMs: 10 * 60 * 1000,
    });
    if (!ipLimit.allowed) {
      return NextResponse.json(
        { valid: false, error: 'Too many validation attempts. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = ValidateInviteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { valid: false, error: GENERIC_INVITE_ERROR },
        { status: 400 }
      );
    }
    const { code, email } = parsed.data;

    const codeLimit = checkRateLimit(`invite-validate:code:${code}:${ip}`, {
      max: 20,
      windowMs: 10 * 60 * 1000,
    });
    if (!codeLimit.allowed) {
      return NextResponse.json(
        { valid: false, error: 'Too many validation attempts. Please try again later.' },
        { status: 429 }
      );
    }

    const invite = await prisma.invite.findUnique({
      where: { code },
    });

    if (!invite) {
      return NextResponse.json({ valid: false, error: GENERIC_INVITE_ERROR });
    }

    if (invite.expiresAt && invite.expiresAt < new Date()) {
      return NextResponse.json({ valid: false, error: GENERIC_INVITE_ERROR });
    }

    if (invite.useCount >= invite.maxUses) {
      return NextResponse.json({ valid: false, error: GENERIC_INVITE_ERROR });
    }

    if (invite.email && email && invite.email.toLowerCase() !== email.toLowerCase()) {
      return NextResponse.json({ valid: false, error: GENERIC_INVITE_ERROR });
    }

    return NextResponse.json({
      valid: true,
      invite: {
        expiresAt: invite.expiresAt,
        restrictedToEmail: Boolean(invite.email),
        remainingUses: Math.max(0, invite.maxUses - invite.useCount),
      },
    });
  } catch (error) {
    console.error('Error validating invite:', error);
    return NextResponse.json(
      { valid: false, error: 'Failed to validate invite' },
      { status: 500 }
    );
  }
}
