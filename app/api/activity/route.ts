import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/activity
 * Get activity feed items
 * Query params:
 * - filter: 'all' | 'friends' | 'personal'
 * - type: ActivityType (optional)
 * - limit: number (default 20)
 * - cursor: string (for pagination)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter') || 'all';
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const cursor = searchParams.get('cursor');

    // Build where clause based on filter
    let userFilter = {};
    if (filter === 'friends') {
      // Get friend IDs
      const friendships = await prisma.friendship.findMany({
        where: {
          OR: [
            { userId, status: 'ACCEPTED' },
            { friendId: userId, status: 'ACCEPTED' },
          ],
        },
      });

      const friendIds = friendships.map((f) =>
        f.userId === userId ? f.friendId : f.userId
      );

      userFilter = { userId: { in: friendIds } };
    } else if (filter === 'personal') {
      userFilter = { userId };
    }
    // 'all' - no user filter

    // Build where clause
    const whereClause: {
      userId?: { in: string[] } | string;
      type?: string;
      createdAt?: { lt: Date };
    } = {
      ...userFilter,
    };

    if (type && type !== 'all') {
      whereClause.type = type;
    }

    if (cursor) {
      whereClause.createdAt = { lt: new Date(cursor) };
    }

    const activities = await prisma.activityFeedItem.findMany({
      where: whereClause as never,
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
        reactions: {
          select: {
            id: true,
            type: true,
            userId: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit + 1, // Take one extra to check if there are more
    });

    const hasMore = activities.length > limit;
    const items = hasMore ? activities.slice(0, limit) : activities;

    return NextResponse.json({
      activities: items.map((activity) => ({
        ...activity,
        createdAt: activity.createdAt.toISOString(),
      })),
      hasMore,
    });
  } catch (error) {
    console.error('Error fetching activity feed:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activity feed' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/activity
 * Create a new activity feed item
 * Body: { type: ActivityType, data: Record<string, unknown> }
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { type, data } = body;

    if (!type) {
      return NextResponse.json({ error: 'Missing type' }, { status: 400 });
    }

    const activity = await prisma.activityFeedItem.create({
      data: {
        userId: session.user.id,
        type,
        data: data || {},
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
      },
    });

    return NextResponse.json(
      {
        ...activity,
        createdAt: activity.createdAt.toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating activity:', error);
    return NextResponse.json(
      { error: 'Failed to create activity' },
      { status: 500 }
    );
  }
}
