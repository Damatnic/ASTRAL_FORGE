import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * DELETE /api/challenges/[id]/leave
 * Leave a challenge
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
    const userId = session.user.id;

    // Check if participation exists
    const participation = await prisma.challengeParticipation.findUnique({
      where: {
        challengeId_userId: {
          challengeId,
          userId,
        },
      },
    });

    if (!participation) {
      return NextResponse.json(
        { error: 'Not participating in this challenge' },
        { status: 404 }
      );
    }

    // Delete participation
    await prisma.challengeParticipation.delete({
      where: {
        id: participation.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error leaving challenge:', error);
    return NextResponse.json(
      { error: 'Failed to leave challenge' },
      { status: 500 }
    );
  }
}
