import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

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
    const period = searchParams.get('period') || '3M';

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
      default:
        startDate.setMonth(startDate.getMonth() - 3);
    }

    // Fetch all workout sessions in the period
    const sessions = await prisma.workoutSession.findMany({
      where: {
        userId: session.user.id,
        date: {
          gte: startDate,
          lte: endDate,
        },
        completed: true,
      },
      include: {
        sets: true,
      },
      orderBy: {
        date: 'asc',
      },
    });

    // Group sessions by date and calculate daily metrics
    const dailyData = new Map<string, {
      date: string;
      workouts: number;
      volume: number;
      intensity: 'rest' | 'light' | 'moderate' | 'intense' | 'max';
    }>();

    // Initialize all dates in range with rest days
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dateKey = currentDate.toISOString().split('T')[0];
      dailyData.set(dateKey, {
        date: dateKey,
        workouts: 0,
        volume: 0,
        intensity: 'rest',
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Fill in actual workout data
    sessions.forEach((workoutSession) => {
      const dateKey = workoutSession.date.toISOString().split('T')[0];
      const existing = dailyData.get(dateKey);
      
      if (existing) {
        const volume = workoutSession.sets.reduce(
          (sum: number, set: { weight: number | null; reps: number | null }) => 
            sum + (set.weight || 0) * (set.reps || 0),
          0
        );
        
        existing.workouts += 1;
        existing.volume += volume;
        
        // Determine intensity based on volume
        if (volume < 3000) existing.intensity = 'light';
        else if (volume < 5000) existing.intensity = 'moderate';
        else if (volume < 7000) existing.intensity = 'intense';
        else existing.intensity = 'max';
      }
    });

    // Calculate streak statistics
    const sortedData = Array.from(dailyData.values()).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let totalWorkouts = 0;

    // Calculate from most recent backwards for current streak
    const reversedData = [...sortedData].reverse();
    let foundFirstRest = false;

    for (const day of reversedData) {
      totalWorkouts += day.workouts;
      
      if (day.workouts > 0) {
        if (!foundFirstRest) {
          currentStreak++;
        }
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        foundFirstRest = true;
        tempStreak = 0;
      }
    }

    const totalDays = sortedData.length;
    const weeks = totalDays / 7;
    const averagePerWeek = totalWorkouts / weeks;

    return NextResponse.json({
      data: sortedData,
      stats: {
        currentStreak,
        longestStreak,
        totalWorkouts,
        averagePerWeek: Math.round(averagePerWeek * 10) / 10,
      },
    });
  } catch (error) {
    console.error('Error fetching consistency data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch consistency data' },
      { status: 500 }
    );
  }
}
