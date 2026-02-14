import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { hashPassword, createToken, setAuthCookie } from '@/lib/auth';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { Prisma } from '@prisma/client';

const RegisterSchema = z.object({
  email: z.string().email().transform((value) => value.trim().toLowerCase()),
  password: z.string().min(8).max(128),
  name: z.string().trim().min(2).max(120),
  organization: z.string().trim().max(200).optional(),
  inviteCode: z
    .string()
    .trim()
    .min(6)
    .max(32)
    .regex(/^[A-Z0-9]+$/i)
    .transform((value) => value.toUpperCase()),
});

const INVITE_ERROR = 'Invalid or unavailable invite code';

class RegistrationError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const ipLimit = checkRateLimit(`auth-register:ip:${ip}`, {
      max: 20,
      windowMs: 15 * 60 * 1000,
    });
    if (!ipLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many registration attempts. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = RegisterSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Please provide valid registration details.' },
        { status: 400 }
      );
    }

    const { email, password, name, organization, inviteCode } = parsed.data;
    const emailLimit = checkRateLimit(`auth-register:email:${email}`, {
      max: 8,
      windowMs: 15 * 60 * 1000,
    });
    if (!emailLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many registration attempts. Please try again later.' },
        { status: 429 }
      );
    }

    const advisor = await prisma.$transaction(async (tx) => {
      const invite = await tx.invite.findUnique({
        where: { code: inviteCode },
      });

      if (!invite) {
        throw new RegistrationError(INVITE_ERROR);
      }

      const now = new Date();

      if (invite.expiresAt && invite.expiresAt < now) {
        throw new RegistrationError(INVITE_ERROR);
      }

      if (invite.useCount >= invite.maxUses) {
        throw new RegistrationError(INVITE_ERROR);
      }

      if (invite.email && invite.email.toLowerCase() !== email) {
        throw new RegistrationError(INVITE_ERROR);
      }

      const existing = await tx.advisor.findUnique({
        where: { email },
      });

      if (existing) {
        throw new RegistrationError('An account with this email already exists');
      }

      const passwordHash = await hashPassword(password);
      const createdAdvisor = await tx.advisor.create({
        data: {
          email,
          name,
          organization: organization || null,
          passwordHash,
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          organization: true,
        },
      });

      const consumed = await tx.invite.updateMany({
        where: {
          id: invite.id,
          useCount: invite.useCount,
        },
        data: {
          useCount: { increment: 1 },
          usedAt: invite.useCount === 0 ? now : undefined,
          usedBy: invite.useCount === 0 ? createdAdvisor.id : undefined,
        },
      });

      if (consumed.count !== 1) {
        throw new RegistrationError(INVITE_ERROR);
      }

      return createdAdvisor;
    });

    // Create token and set cookie
    const token = createToken({
      id: advisor.id,
      email: advisor.email,
      name: advisor.name,
      role: advisor.role,
    });

    const cookieStore = await cookies();
    const cookie = setAuthCookie(token);
    cookieStore.set(cookie.name, cookie.value, cookie);

    return NextResponse.json({
      advisor: {
        id: advisor.id,
        email: advisor.email,
        name: advisor.name,
        organization: advisor.organization,
        role: advisor.role,
      },
    });
  } catch (error) {
    if (error instanceof RegistrationError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 400 }
      );
    }
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    );
  }
}
