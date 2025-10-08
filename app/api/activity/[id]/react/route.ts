import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/activity/[id]/react
 * Add or remove a reaction to an activity
 * Body: { type: 'LIKE' | 'CELEBRATE' | 'SUPPORT' }
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

    const userId = session.user.id;
    const activityId = params.id;
    const body = await request.json();
    const { type } = body;

    if (!type || !['LIKE', 'CELEBRATE', 'STRONG', 'FIRE'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid reaction type' },
        { status: 400 }
      );
    }

    // Check if activity exists
    const activity = await prisma.activityFeedItem.findUnique({
      where: { id: activityId },
    });

    if (!activity) {
      return NextResponse.json(
        { error: 'Activity not found' },
        { status: 404 }
      );
    }

    // Check if user already reacted
    const existingReaction = await prisma.activityReaction.findFirst({
      where: {
        activityId,
        userId,
      },
    });

    if (existingReaction) {
      if (existingReaction.type === type) {
        // Remove reaction if clicking same type
        await prisma.activityReaction.delete({
          where: { id: existingReaction.id },
        });
        return NextResponse.json({ message: 'Reaction removed' });
      } else {
        // Update reaction type
        const updatedReaction = await prisma.activityReaction.update({
          where: { id: existingReaction.id },
          data: { type },
        });
        return NextResponse.json(updatedReaction);
      }
    } else {
      // Create new reaction
      const reaction = await prisma.activityReaction.create({
        data: {
          activityId,
          userId,
          type,
        },
      });
      return NextResponse.json(reaction, { status: 201 });
    }
  } catch (error) {
    console.error('Error reacting to activity:', error);
    return NextResponse.json(
      { error: 'Failed to react to activity' },
      { status: 500 }
    );
  }
}
