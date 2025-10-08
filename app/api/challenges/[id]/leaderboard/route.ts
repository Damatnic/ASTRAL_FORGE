import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/challenges/[id]/leaderboard
 * Get challenge leaderboard
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const challengeId = params.id;
    const session = await getServerSession(authOptions);

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
          orderBy: [
            { progress: 'desc' },
            { joinedAt: 'asc' },
          ],
        },
      },
    });

    if (!challenge) {
      return NextResponse.json(
        { error: 'Challenge not found' },
        { status: 404 }
      );
    }

    // Calculate ranks
    const leaderboard = challenge.participants.map((participant, index) => {
      const rank = index + 1;
      return {
        rank,
        userId: participant.userId,
        userName: participant.user.name || participant.user.email,
        progress: participant.progress,
        completedAt: participant.completedAt,
        isCurrentUser: participant.userId === session?.user?.id,
      };
    });

    // Update ranks in database
    await Promise.all(
      challenge.participants.map((participant, index) =>
        prisma.challengeParticipation.update({
          where: { id: participant.id },
          data: { rank: index + 1 },
        })
      )
    );

    return NextResponse.json({
      challengeId,
      challengeName: challenge.name,
      goal: challenge.goal,
      unit: challenge.unit,
      entries: leaderboard,
      currentUserRank: leaderboard.find((e) => e.isCurrentUser)?.rank,
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}
