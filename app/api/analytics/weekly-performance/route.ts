import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface DailyPerformance {
  date: string;
  dayOfWeek: string;
  volume: number;
  workouts: number;
  sets: number;
  avgIntensity: number;
}

interface WeeklyStats {
  totalVolume: number;
  totalWorkouts: number;
  totalSets: number;
  avgIntensity: number;
  peakDay: string;
  peakVolume: number;
  restDays: number;
}

interface WeeklyPerformanceData {
  days: DailyPerformance[];
  stats: WeeklyStats;
  weekStart: string;
  weekEnd: string;
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const weekOffset = parseInt(searchParams.get('weekOffset') || '0');

    // Calculate week boundaries
    const now = new Date();
    const currentDayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const daysToMonday = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1; // Adjust to make Monday = 0

    // Start of the target week (Monday)
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - daysToMonday + (weekOffset * 7));
    weekStart.setHours(0, 0, 0, 0);

    // End of the target week (Sunday)
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    // Initialize daily data for all 7 days
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const dailyData = new Map<string, DailyPerformance>();

    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      const dateKey = date.toISOString().split('T')[0];

      dailyData.set(dateKey, {
        date: dateKey,
        dayOfWeek: dayNames[i],
        volume: 0,
        workouts: 0,
        sets: 0,
        avgIntensity: 0,
      });
    }

    // Fetch workouts for the week
    const workouts = await prisma.workoutSession.findMany({
      where: {
        userId: session.user.id,
        date: {
          gte: weekStart,
          lte: weekEnd,
        },
      },
      include: {
        sets: true,
      },
      orderBy: {
        date: 'asc',
      },
    });

    // Process workouts into daily data
    let totalRPE = 0;
    let rpeCount = 0;

    workouts.forEach((workout) => {
      const dateKey = workout.date.toISOString().split('T')[0];
      const dayData = dailyData.get(dateKey);

      if (dayData) {
        dayData.workouts++;

        workout.sets.forEach((set) => {
          dayData.volume += set.weight * set.reps;
          dayData.sets++;

          if (set.rpe) {
            totalRPE += set.rpe;
            rpeCount++;
          }
        });

        // Calculate average intensity for the day
        const daySets = workout.sets.filter((s) => s.rpe);
        if (daySets.length > 0) {
          const dayRPE = daySets.reduce((sum, s) => sum + (s.rpe || 0), 0);
          dayData.avgIntensity = Math.round((dayRPE / daySets.length) * 10) / 10;
        }
      }
    });

    // Convert map to array
    const days = Array.from(dailyData.values());

    // Calculate weekly stats
    let peakDay = 'N/A';
    let peakVolume = 0;
    let restDays = 0;

    days.forEach((day) => {
      if (day.volume > peakVolume) {
        peakVolume = day.volume;
        peakDay = day.dayOfWeek;
      }
      if (day.workouts === 0) {
        restDays++;
      }
    });

    const totalVolume = days.reduce((sum, day) => sum + day.volume, 0);
    const totalWorkouts = days.reduce((sum, day) => sum + day.workouts, 0);
    const totalSets = days.reduce((sum, day) => sum + day.sets, 0);
    const avgIntensity = rpeCount > 0 ? Math.round((totalRPE / rpeCount) * 10) / 10 : 0;

    const result: WeeklyPerformanceData = {
      days,
      stats: {
        totalVolume: Math.round(totalVolume),
        totalWorkouts,
        totalSets,
        avgIntensity,
        peakDay,
        peakVolume: Math.round(peakVolume),
        restDays,
      },
      weekStart: weekStart.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      weekEnd: weekEnd.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching weekly performance:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weekly performance data' },
      { status: 500 }
    );
  }
}
