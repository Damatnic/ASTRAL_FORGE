import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * DELETE /api/friends/requests/[id]/decline
 * Decline a friend request
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
        { error: 'Not authorized to decline this request' },
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

    // Update status to DECLINED (or delete the record)
    await prisma.friendship.update({
      where: { id: requestId },
      data: {
        status: 'DECLINED',
      },
    });

    // Alternatively, delete the record entirely:
    // await prisma.friendship.delete({
    //   where: { id: requestId },
    // });

    return NextResponse.json({ message: 'Friend request declined' });
  } catch (error) {
    console.error('Error declining friend request:', error);
    return NextResponse.json(
      { error: 'Failed to decline friend request' },
      { status: 500 }
    );
  }
}
