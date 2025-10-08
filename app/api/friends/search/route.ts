import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/friends/search
 * Search for users to add as friends
 * Query param: q (search query)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query || query.length < 2) {
      return NextResponse.json([]);
    }

    const currentUserId = session.user.id;

    // Search for users by name or email
    const users = await prisma.user.findMany({
      where: {
        AND: [
          { id: { not: currentUserId } }, // Exclude current user
          {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { email: { contains: query, mode: 'insensitive' } },
            ],
          },
        ],
      },
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
      take: 10,
    });

    // Check friendship status for each user
    const usersWithStatus = await Promise.all(
      users.map(async (user) => {
        // Check if already friends
        const friendship = await prisma.friendship.findFirst({
          where: {
            OR: [
              { userId: currentUserId, friendId: user.id, status: 'ACCEPTED' },
              { userId: user.id, friendId: currentUserId, status: 'ACCEPTED' },
            ],
          },
        });

        // Check for pending request
        const pendingRequest = await prisma.friendship.findFirst({
          where: {
            OR: [
              { userId: currentUserId, friendId: user.id, status: 'PENDING' },
              { userId: user.id, friendId: currentUserId, status: 'PENDING' },
            ],
          },
        });

        return {
          ...user,
          isFriend: !!friendship,
          hasPendingRequest: !!pendingRequest,
        };
      })
    );

    return NextResponse.json(usersWithStatus);
  } catch (error) {
    console.error('Error searching users:', error);
    return NextResponse.json(
      { error: 'Failed to search users' },
      { status: 500 }
    );
  }
}
