import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/challenges
 * List all challenges with optional filters
 * Query params: status (active|upcoming|ended), type, featured, userId
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status'); // active, upcoming, ended
    const type = searchParams.get('type');
    const featured = searchParams.get('featured') === 'true';
    const userId = session?.user?.id || searchParams.get('userId');

    const now = new Date();

    const challenges = await prisma.challenge.findMany({
      where: {
        ...(status === 'active' && {
          startDate: { lte: now },
          endDate: { gte: now },
          isActive: true,
        }),
        ...(status === 'upcoming' && {
          startDate: { gt: now },
        }),
        ...(status === 'ended' && {
          endDate: { lt: now },
        }),
        ...(type && { type: type as 'THIRTY_DAY' | 'DISTANCE' | 'CONSISTENCY' | 'STRENGTH' | 'ENDURANCE' | 'VOLUME' | 'CUSTOM' }),
        ...(featured && { isPremade: true }),
      },
      include: {
        participants: {
          select: {
            userId: true,
            progress: true,
            rank: true,
            completedAt: true,
          },
        },
      },
      orderBy: [
        { isPremade: 'desc' },
        { startDate: 'asc' },
      ],
    });

    // Add user-specific data if userId provided
    const enrichedChallenges = challenges.map((challenge) => {
      const participantCount = challenge.participants.length;
      const userParticipation = userId
        ? challenge.participants.find((p) => p.userId === userId)
        : null;

      return {
        id: challenge.id,
        name: challenge.name,
        description: challenge.description,
        type: challenge.type,
        startDate: challenge.startDate.toISOString(),
        endDate: challenge.endDate.toISOString(),
        goal: challenge.goal,
        unit: challenge.unit,
        isPremade: challenge.isPremade,
        isActive: challenge.isActive,
        participantCount,
        ...(userParticipation && {
          isJoined: true,
          userProgress: userParticipation.progress,
          userRank: userParticipation.rank,
        }),
      };
    });

    return NextResponse.json(enrichedChallenges);
  } catch (error) {
    console.error('Error fetching challenges:', error);
    return NextResponse.json(
      { error: 'Failed to fetch challenges' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/challenges
 * Create a new challenge
 * Requires: name, description, type, startDate, endDate, goal, unit
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      description,
      type,
      startDate,
      endDate,
      goal,
      unit,
      isPremade = false,
    } = body;

    // Validation
    if (!name || !description || !type || !startDate || !endDate || !goal || !unit) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end <= start) {
      return NextResponse.json(
        { error: 'End date must be after start date' },
        { status: 400 }
      );
    }

    const challenge = await prisma.challenge.create({
      data: {
        name,
        description,
        type,
        startDate: start,
        endDate: end,
        goal: parseFloat(goal),
        unit,
        createdBy: session.user.id,
        isPremade,
        isActive: true,
      },
      include: {
        participants: true,
      },
    });

    return NextResponse.json(challenge, { status: 201 });
  } catch (error) {
    console.error('Error creating challenge:', error);
    return NextResponse.json(
      { error: 'Failed to create challenge' },
      { status: 500 }
    );
  }
}

