import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyPassword, createToken, setAuthCookie, toAdvisorPayload } from '@/lib/auth';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { rejectIfCrossOrigin } from '@/lib/request-security';

const LoginSchema = z.object({
  email: z.string().email().transform((value) => value.trim().toLowerCase()),
  password: z.string().min(1).max(128),
});

export async function POST(request: NextRequest) {
  try {
    const originError = rejectIfCrossOrigin(request);
    if (originError) return originError;

    const ip = getClientIp(request);
    const ipLimit = checkRateLimit(`auth-login:ip:${ip}`, {
      max: 30,
      windowMs: 10 * 60 * 1000,
    });
    if (!ipLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = LoginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'A valid email and password are required' },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;
    const emailLimit = checkRateLimit(`auth-login:email:${email}`, {
      max: 10,
      windowMs: 10 * 60 * 1000,
    });
    if (!emailLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        { status: 429 }
      );
    }

    // Find advisor
    const advisor = await prisma.advisor.findUnique({
      where: { email },
    });

    if (!advisor) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const valid = await verifyPassword(password, advisor.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Create token and set cookie
    const sessionAdvisor = toAdvisorPayload(advisor);
    const token = createToken(sessionAdvisor);

    const cookieStore = await cookies();
    const cookie = setAuthCookie(token);
    cookieStore.set(cookie.name, cookie.value, cookie);

    return NextResponse.json({
      advisor: {
        id: advisor.id,
        email: advisor.email,
        name: advisor.name,
        organization: advisor.organization,
        role: sessionAdvisor.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Failed to login' },
      { status: 500 }
    );
  }
}
