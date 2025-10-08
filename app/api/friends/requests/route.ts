import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/friends/requests
 * Get all friend requests (sent and received)
 */
export async function GET(_request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    const requests = await prisma.friendship.findMany({
      where: {
        OR: [
          { userId, status: 'PENDING' },
          { friendId: userId, status: 'PENDING' },
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
      orderBy: {
        createdAt: 'desc',
      },
    });

    const formattedRequests = requests.map((req) => ({
      id: req.id,
      fromUserId: req.userId,
      toUserId: req.friendId,
      status: req.status,
      createdAt: req.createdAt.toISOString(),
      fromUser: req.user,
      toUser: req.friend,
    }));

    return NextResponse.json(formattedRequests);
  } catch (error) {
    console.error('Error fetching friend requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch friend requests' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/friends/requests
 * Send a friend request
 * Body: { toUserId: string }
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { toUserId } = body;

    if (!toUserId) {
      return NextResponse.json(
        { error: 'Missing toUserId' },
        { status: 400 }
      );
    }

    const fromUserId = session.user.id;

    if (fromUserId === toUserId) {
      return NextResponse.json(
        { error: 'Cannot send friend request to yourself' },
        { status: 400 }
      );
    }

    // Check if friendship already exists
    const existingFriendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { userId: fromUserId, friendId: toUserId },
          { userId: toUserId, friendId: fromUserId },
        ],
      },
    });

    if (existingFriendship) {
      if (existingFriendship.status === 'ACCEPTED') {
        return NextResponse.json(
          { error: 'Already friends' },
          { status: 400 }
        );
      }
      if (existingFriendship.status === 'PENDING') {
        return NextResponse.json(
          { error: 'Friend request already sent' },
          { status: 400 }
        );
      }
    }

    // Create friend request
    const friendRequest = await prisma.friendship.create({
      data: {
        userId: fromUserId,
        friendId: toUserId,
        status: 'PENDING',
      },
    });

    // Create activity feed item
    await prisma.activityFeedItem.create({
      data: {
        userId: fromUserId,
        type: 'WORKOUT_COMPLETED', // TODO: Add FRIEND_REQUEST_SENT type
        data: {
          toUserId,
        },
      },
    });

    return NextResponse.json(friendRequest, { status: 201 });
  } catch (error) {
    console.error('Error sending friend request:', error);
    return NextResponse.json(
      { error: 'Failed to send friend request' },
      { status: 500 }
    );
  }
}
