import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/friends/requests/[id]/accept
 * Accept a friend request
 */
export async function POST(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const requestId = params.id;

    // Find the friend request
    const friendRequest = await prisma.friendship.findUnique({
      where: { id: requestId },
    });

    if (!friendRequest) {
      return NextResponse.json(
        { error: 'Friend request not found' },
        { status: 404 }
      );
    }

    // Verify this user is the recipient
    if (friendRequest.friendId !== userId) {
      return NextResponse.json(
        { error: 'Not authorized to accept this request' },
        { status: 403 }
      );
    }

    // Verify request is still pending
    if (friendRequest.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Friend request is not pending' },
        { status: 400 }
      );
    }

    // Accept the friend request
    const updatedFriendship = await prisma.friendship.update({
      where: { id: requestId },
      data: {
        status: 'ACCEPTED',
        acceptedAt: new Date(),
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

    // Create activity feed items for both users
    await prisma.activityFeedItem.createMany({
      data: [
        {
          userId: friendRequest.userId,
          type: 'WORKOUT_COMPLETED', // TODO: Add FRIEND_REQUEST_ACCEPTED type
          data: {
            friendId: userId,
          },
        },
        {
          userId,
          type: 'WORKOUT_COMPLETED', // TODO: Add FRIEND_REQUEST_ACCEPTED type
          data: {
            friendId: friendRequest.userId,
          },
        },
      ],
    });

    return NextResponse.json(updatedFriendship);
  } catch (error) {
    console.error('Error accepting friend request:', error);
    return NextResponse.json(
      { error: 'Failed to accept friend request' },
      { status: 500 }
    );
  }
}
