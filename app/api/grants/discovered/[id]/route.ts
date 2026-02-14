import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/access-control';

// GET - Get single discovered grant
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin();
    if (!admin.ok) return admin.response;

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
    const admin = await requireAdmin();
    if (!admin.ok) return admin.response;
    const { session } = admin;

    const { id } = await params;
    const body = await request.json();
    const { status, reviewNotes } = body;

    if (!['approved', 'rejected', 'duplicate', 'pending'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

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
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin();
    if (!admin.ok) return admin.response;

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
