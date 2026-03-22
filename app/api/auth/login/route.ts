import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyPassword, createToken, setAuthCookie, toAdvisorPayload } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find advisor
    const advisor = await prisma.advisor.findUnique({
      where: { email: email.toLowerCase() },
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
