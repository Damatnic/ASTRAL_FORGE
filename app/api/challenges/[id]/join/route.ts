import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/challenges/[id]/join
 * Join a challenge
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const challengeId = params.id;
    const userId = session.user.id;

    // Check if challenge exists and is active
    const challenge = await prisma.challenge.findUnique({
      where: { id: challengeId },
    });

    if (!challenge) {
      return NextResponse.json(
        { error: 'Challenge not found' },
        { status: 404 }
      );
    }

    if (!challenge.isActive) {
      return NextResponse.json(
        { error: 'Challenge is not active' },
        { status: 400 }
      );
    }

    const now = new Date();
    if (challenge.endDate < now) {
      return NextResponse.json(
        { error: 'Challenge has ended' },
        { status: 400 }
      );
    }

    // Check if already joined
    const existing = await prisma.challengeParticipation.findUnique({
      where: {
        challengeId_userId: {
          challengeId,
          userId,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Already joined this challenge' },
        { status: 400 }
      );
    }

    // Join challenge
    const participation = await prisma.challengeParticipation.create({
      data: {
        challengeId,
        userId,
        progress: 0,
      },
    });

    // Create activity feed item
    await prisma.activityFeedItem.create({
      data: {
        userId,
        type: 'CHALLENGE_JOINED',
        data: {
          challengeId,
          challengeName: challenge.name,
        },
      },
    });

    return NextResponse.json(participation, { status: 201 });
  } catch (error) {
    console.error('Error joining challenge:', error);
    return NextResponse.json(
      { error: 'Failed to join challenge' },
      { status: 500 }
    );
  }
}
