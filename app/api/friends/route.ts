import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/friends
 * List all friends for the authenticated user
 */
export async function GET(_request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Get all friendships where user is either userId or friendId
    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [
          { userId, status: 'ACCEPTED' },
          { friendId: userId, status: 'ACCEPTED' },
        ],
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profile: {
              select: {
                level: true,
              },
            },
          },
        },
        friend: {
          select: {
            id: true,
            name: true,
            email: true,
            profile: {
              select: {
                level: true,
              },
            },
          },
        },
      },
    });

    // Transform to always show the friend (not the current user)
    const friends = friendships.map((friendship) => {
      const isFriendUser = friendship.userId === userId;
      const friendData = isFriendUser ? friendship.friend : friendship.user;
      const friendId = isFriendUser ? friendship.friendId : friendship.userId;

      return {
        id: friendship.id,
        userId: friendship.userId,
        friendId,
        status: friendship.status,
        createdAt: friendship.createdAt.toISOString(),
        acceptedAt: friendship.acceptedAt?.toISOString(),
        friend: friendData,
      };
    });

    // Optionally get stats for each friend
    const friendsWithStats = await Promise.all(
      friends.map(async (friend) => {
        const stats = await prisma.workoutSession.aggregate({
          where: { userId: friend.friendId },
          _count: { id: true },
        });

        // Get current streak (simplified)
        const recentSessions = await prisma.workoutSession.findMany({
          where: { userId: friend.friendId },
          orderBy: { date: 'desc' },
          take: 30,
          select: { date: true },
        });

        let currentStreak = 0;
        if (recentSessions.length > 0) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          let lastDate = new Date(recentSessions[0].date);
          lastDate.setHours(0, 0, 0, 0);

          const daysSinceLastWorkout = Math.floor(
            (today.getTime() - lastDate.getTime()) / (24 * 60 * 60 * 1000)
          );

          if (daysSinceLastWorkout <= 1) {
            for (const session of recentSessions) {
              const sessionDate = new Date(session.date);
              sessionDate.setHours(0, 0, 0, 0);
              const daysDiff = Math.floor(
                (lastDate.getTime() - sessionDate.getTime()) / (24 * 60 * 60 * 1000)
              );

              if (daysDiff <= 1) {
                currentStreak++;
                lastDate = sessionDate;
              } else {
                break;
              }
            }
          }
        }

        return {
          ...friend,
          stats: {
            totalWorkouts: stats._count.id,
            currentStreak,
            totalPRs: 0, // TODO: Calculate from workout data
          },
        };
      })
    );

    return NextResponse.json(friendsWithStats);
  } catch (error) {
    console.error('Error fetching friends:', error);
    return NextResponse.json(
      { error: 'Failed to fetch friends' },
      { status: 500 }
    );
  }
}
