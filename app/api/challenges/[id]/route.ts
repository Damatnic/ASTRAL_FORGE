import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/challenges/[id]
 * Get single challenge with details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const challengeId = params.id;

    const challenge = await prisma.challenge.findUnique({
      where: { id: challengeId },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            rank: 'asc',
          },
        },
      },
    });

    if (!challenge) {
      return NextResponse.json(
        { error: 'Challenge not found' },
        { status: 404 }
      );
    }

    const userId = session?.user?.id;
    const userParticipation = userId
      ? challenge.participants.find((p) => p.userId === userId)
      : null;

    return NextResponse.json({
      ...challenge,
      participantCount: challenge.participants.length,
      isJoined: !!userParticipation,
      userProgress: userParticipation?.progress,
      userRank: userParticipation?.rank,
    });
  } catch (error) {
    console.error('Error fetching challenge:', error);
    return NextResponse.json(
      { error: 'Failed to fetch challenge' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/challenges/[id]
 * Update challenge (admin only)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const challengeId = params.id;
    const body = await request.json();

    // Check if user is challenge creator
    const existingChallenge = await prisma.challenge.findUnique({
      where: { id: challengeId },
    });

    if (!existingChallenge) {
      return NextResponse.json(
        { error: 'Challenge not found' },
        { status: 404 }
      );
    }

    if (existingChallenge.createdBy !== session.user.id) {
      return NextResponse.json(
        { error: 'Only challenge creator can update' },
        { status: 403 }
      );
    }

    const challenge = await prisma.challenge.update({
      where: { id: challengeId },
      data: {
        ...body,
        ...(body.startDate && { startDate: new Date(body.startDate) }),
        ...(body.endDate && { endDate: new Date(body.endDate) }),
        ...(body.goal && { goal: parseFloat(body.goal) }),
      },
    });

    return NextResponse.json(challenge);
  } catch (error) {
    console.error('Error updating challenge:', error);
    return NextResponse.json(
      { error: 'Failed to update challenge' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/challenges/[id]
 * Delete challenge (admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const challengeId = params.id;

    // Check if user is challenge creator
    const existingChallenge = await prisma.challenge.findUnique({
      where: { id: challengeId },
    });

    if (!existingChallenge) {
      return NextResponse.json(
        { error: 'Challenge not found' },
        { status: 404 }
      );
    }

    if (existingChallenge.createdBy !== session.user.id) {
      return NextResponse.json(
        { error: 'Only challenge creator can delete' },
        { status: 403 }
      );
    }

    await prisma.challenge.delete({
      where: { id: challengeId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting challenge:', error);
    return NextResponse.json(
      { error: 'Failed to delete challenge' },
      { status: 500 }
    );
  }
}
