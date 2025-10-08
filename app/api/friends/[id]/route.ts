import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * DELETE /api/friends/[id]
 * Remove a friend (unfriend)
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const friendUserId = params.id;

    // Find the friendship (bidirectional check)
    const friendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { userId, friendId: friendUserId, status: 'ACCEPTED' },
          { userId: friendUserId, friendId: userId, status: 'ACCEPTED' },
        ],
      },
    });

    if (!friendship) {
      return NextResponse.json(
        { error: 'Friendship not found' },
        { status: 404 }
      );
    }

    // Delete the friendship
    await prisma.friendship.delete({
      where: { id: friendship.id },
    });

    // Optionally create activity feed item
    await prisma.activityFeedItem.create({
      data: {
        userId,
        type: 'WORKOUT_COMPLETED', // TODO: Add FRIENDSHIP_REMOVED type
        data: {
          friendId: friendUserId,
        },
      },
    });

    return NextResponse.json({ message: 'Friend removed successfully' });
  } catch (error) {
    console.error('Error removing friend:', error);
    return NextResponse.json(
      { error: 'Failed to remove friend' },
      { status: 500 }
    );
  }
}
