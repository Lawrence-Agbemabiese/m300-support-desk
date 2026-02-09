import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { hashPassword, createToken, setAuthCookie } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, organization, inviteCode } = body;

    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    if (!inviteCode) {
      return NextResponse.json(
        { error: 'Invite code is required to register' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Validate invite code
    const invite = await prisma.invite.findUnique({
      where: { code: inviteCode.toUpperCase() },
    });

    if (!invite) {
      return NextResponse.json(
        { error: 'Invalid invite code' },
        { status: 400 }
      );
    }

    if (invite.expiresAt && invite.expiresAt < new Date()) {
      return NextResponse.json(
        { error: 'Invite code has expired' },
        { status: 400 }
      );
    }

    if (invite.useCount >= invite.maxUses) {
      return NextResponse.json(
        { error: 'Invite code has already been used' },
        { status: 400 }
      );
    }

    if (invite.email && invite.email.toLowerCase() !== email.toLowerCase()) {
      return NextResponse.json(
        { error: 'This invite code is for a different email address' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existing = await prisma.advisor.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 400 }
      );
    }

    // Create advisor
    const passwordHash = await hashPassword(password);
    const advisor = await prisma.advisor.create({
      data: {
        email: email.toLowerCase(),
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

    // Mark invite as used
    await prisma.invite.update({
      where: { id: invite.id },
      data: {
        useCount: { increment: 1 },
        usedAt: invite.useCount === 0 ? new Date() : undefined,
        usedBy: invite.useCount === 0 ? advisor.id : undefined,
      },
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
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    );
  }
}
