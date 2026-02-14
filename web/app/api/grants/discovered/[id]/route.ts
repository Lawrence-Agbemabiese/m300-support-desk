import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from '@/lib/auth';
import { z } from 'zod';
import { rejectIfCrossOrigin } from '@/lib/request-security';

const PatchSchema = z.object({
  status: z.enum(['approved', 'rejected', 'duplicate', 'pending']),
  reviewNotes: z.string().max(2000).optional(),
});

// GET - Get single discovered grant
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { id } = await params;

    const grant = await prisma.discoveredGrant.findUnique({
      where: { id },
    });

    if (!grant) {
      return NextResponse.json(
        { error: 'Grant not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(grant);
  } catch (error) {
    console.error('Error fetching grant:', error);
    return NextResponse.json(
      { error: 'Failed to fetch grant' },
      { status: 500 }
    );
  }
}

// PATCH - Update discovered grant status (approve/reject)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const body = await request.json();
    const parsed = PatchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid status update payload' },
        { status: 400 }
      );
    }
    const { status, reviewNotes } = parsed.data;

    const grant = await prisma.discoveredGrant.update({
      where: { id },
      data: {
        status,
        reviewNotes,
        reviewedBy: session.id,
        reviewedAt: new Date(),
      },
    });

    return NextResponse.json(grant);
  } catch (error) {
    console.error('Error updating grant:', error);
    return NextResponse.json(
      { error: 'Failed to update grant' },
      { status: 500 }
    );
  }
}

// DELETE - Delete discovered grant
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    await prisma.discoveredGrant.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting grant:', error);
    return NextResponse.json(
      { error: 'Failed to delete grant' },
      { status: 500 }
    );
  }
}
