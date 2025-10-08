import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface ProgressionDataPoint {
  date: string;
  estimated1RM: number;
  weight: number;
  reps: number;
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const exerciseId = searchParams.get('exerciseId');
    const period = searchParams.get('period') || '1Y';

    if (!exerciseId) {
      return NextResponse.json(
        { error: 'Exercise ID is required' },
        { status: 400 }
      );
    }

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    
    switch (period) {
      case '3M':
        startDate.setMonth(startDate.getMonth() - 3);
        break;
      case '6M':
        startDate.setMonth(startDate.getMonth() - 6);
        break;
      case '1Y':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      case 'ALL':
        startDate.setFullYear(startDate.getFullYear() - 10);
        break;
      default:
        startDate.setFullYear(startDate.getFullYear() - 1);
    }

    // Fetch exercise details
    const exercise = await prisma.exercise.findUnique({
      where: { id: exerciseId },
      select: { name: true, muscleGroup: true },
    });

    if (!exercise) {
      return NextResponse.json(
        { error: 'Exercise not found' },
        { status: 404 }
      );
    }

    // Fetch all sets for this exercise
    const sets = await prisma.setEntry.findMany({
      where: {
        exerciseId,
        session: {
          userId: session.user.id,
          completed: true,
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
        completed: true,
        isWarmup: false,
      },
      include: {
        session: {
          select: {
            date: true,
          },
        },
      },
      orderBy: {
        timestamp: 'asc',
      },
    });

    // Calculate 1RM for each set using Epley formula
    const calculate1RM = (weight: number, reps: number): number => {
      if (reps === 1) return weight;
      return Math.round(weight * (1 + reps / 30));
    };

    // Group by session date and find best set per session
    const sessionBests = new Map<string, ProgressionDataPoint>();

    sets.forEach((set) => {
      const dateKey = set.session.date.toISOString().split('T')[0];
      const estimated1RM = calculate1RM(set.weight, set.reps);
      
      const existing = sessionBests.get(dateKey);
      if (!existing || estimated1RM > existing.estimated1RM) {
        sessionBests.set(dateKey, {
          date: dateKey,
          estimated1RM,
          weight: set.weight,
          reps: set.reps,
        });
      }
    });

    // Convert to array and sort
    const progressionData = Array.from(sessionBests.values())
      .sort((a, b) => a.date.localeCompare(b.date));

    // Calculate statistics
    const allTime1RMs = progressionData.map(d => d.estimated1RM);
    const peak1RM = allTime1RMs.length > 0 ? Math.max(...allTime1RMs) : 0;
    const current1RM = allTime1RMs.length > 0 ? allTime1RMs[allTime1RMs.length - 1] : 0;
    
    // Calculate improvement
    const first1RM = allTime1RMs.length > 0 ? allTime1RMs[0] : 0;
    const improvement = first1RM > 0 
      ? Math.round(((current1RM - first1RM) / first1RM) * 100) 
      : 0;

    // Find peak date
    const peakIndex = allTime1RMs.indexOf(peak1RM);
    const peakDate = peakIndex >= 0 ? progressionData[peakIndex].date : '';

    return NextResponse.json({
      data: progressionData,
      stats: {
        exerciseName: exercise.name,
        muscleGroup: exercise.muscleGroup,
        current1RM,
        peak1RM,
        peakDate,
        improvement,
        dataPoints: progressionData.length,
      },
    });
  } catch (error) {
    console.error('Error fetching strength progression:', error);
    return NextResponse.json(
      { error: 'Failed to fetch strength progression' },
      { status: 500 }
    );
  }
}
