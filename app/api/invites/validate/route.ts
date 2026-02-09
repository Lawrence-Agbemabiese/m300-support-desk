import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// POST - Validate an invite code
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, email } = body;

    if (!code) {
      return NextResponse.json(
        { valid: false, error: 'Invite code required' },
        { status: 400 }
      );
    }

    const invite = await prisma.invite.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!invite) {
      return NextResponse.json({ valid: false, error: 'Invalid invite code' });
    }

    // Check if expired
    if (invite.expiresAt && invite.expiresAt < new Date()) {
      return NextResponse.json({ valid: false, error: 'Invite code has expired' });
    }

    // Check if used up
    if (invite.useCount >= invite.maxUses) {
      return NextResponse.json({ valid: false, error: 'Invite code has already been used' });
    }

    // Check email restriction
    if (invite.email && email && invite.email.toLowerCase() !== email.toLowerCase()) {
      return NextResponse.json({ valid: false, error: 'This invite code is for a different email address' });
    }

    return NextResponse.json({
      valid: true,
      email: invite.email, // Return restricted email if any
    });
  } catch (error) {
    console.error('Error validating invite:', error);
    return NextResponse.json(
      { valid: false, error: 'Failed to validate invite' },
      { status: 500 }
    );
  }
}
