import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface ComparisonData {
  metric: string;
  current: number;
  previous: number;
  change: number;
}

interface OverallTrend {
  status: 'improving' | 'declining' | 'stable';
  message: string;
}

interface PeriodComparison {
  period: string;
  data: ComparisonData[];
  overallTrend: OverallTrend;
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const period = searchParams.get('period') || 'month';

    // Calculate date ranges based on period
    const periodDays = {
      'month': 30,
      'quarter': 90,
      'year': 365,
    }[period] || 30;

    // Current period
    const currentEnd = new Date();
    const currentStart = new Date();
    currentStart.setDate(currentStart.getDate() - periodDays);

    // Previous period (same length, ending when current starts)
    const previousEnd = new Date(currentStart);
    const previousStart = new Date(previousEnd);
    previousStart.setDate(previousStart.getDate() - periodDays);

    // Calculate stats for current period
    const currentStats = await calculatePeriodStats(
      session.user.id,
      currentStart,
      currentEnd
    );

    // Calculate stats for previous period
    const previousStats = await calculatePeriodStats(
      session.user.id,
      previousStart,
      previousEnd
    );

    // Build comparison data
    const data: ComparisonData[] = [
      {
        metric: 'Total Volume',
        current: currentStats.totalVolume,
        previous: previousStats.totalVolume,
        change:
          previousStats.totalVolume > 0
            ? Math.round(
                ((currentStats.totalVolume - previousStats.totalVolume) /
                  previousStats.totalVolume) *
                  100
              )
            : 0,
      },
      {
        metric: 'Workouts',
        current: currentStats.totalWorkouts,
        previous: previousStats.totalWorkouts,
        change:
          previousStats.totalWorkouts > 0
            ? Math.round(
                ((currentStats.totalWorkouts - previousStats.totalWorkouts) /
                  previousStats.totalWorkouts) *
                  100
              )
            : 0,
      },
      {
        metric: 'Avg Intensity',
        current: currentStats.averageIntensity,
        previous: previousStats.averageIntensity,
        change:
          previousStats.averageIntensity > 0
            ? Math.round(
                ((currentStats.averageIntensity -
                  previousStats.averageIntensity) /
                  previousStats.averageIntensity) *
                  100
              )
            : 0,
      },
      {
        metric: 'PRs Set',
        current: currentStats.prsSet,
        previous: previousStats.prsSet,
        change:
          previousStats.prsSet > 0
            ? Math.round(
                ((currentStats.prsSet - previousStats.prsSet) /
                  previousStats.prsSet) *
                  100
              )
            : 0,
      },
    ];

    // Calculate overall trend
    const avgChange =
      data.reduce((sum, d) => sum + d.change, 0) / data.length;

    let overallTrend: OverallTrend;
    if (avgChange > 5) {
      overallTrend = {
        status: 'improving',
        message:
          'Great progress! Your performance is showing improvement across most metrics.',
      };
    } else if (avgChange < -5) {
      overallTrend = {
        status: 'declining',
        message:
          'Performance has declined. Consider reviewing your training program or recovery strategies.',
      };
    } else {
      overallTrend = {
        status: 'stable',
        message:
          'Performance is relatively stable. Consistent training is key to long-term success.',
      };
    }

    const result: PeriodComparison = {
      period:
        period === 'month'
          ? 'Last 30 Days vs Previous 30 Days'
          : period === 'quarter'
          ? 'Last 90 Days vs Previous 90 Days'
          : 'Last Year vs Previous Year',
      data,
      overallTrend,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error calculating performance comparison:', error);
    return NextResponse.json(
      { error: 'Failed to calculate performance comparison' },
      { status: 500 }
    );
  }
}

// Helper function to calculate period statistics
async function calculatePeriodStats(
  userId: string,
  startDate: Date,
  endDate: Date
) {
  // Fetch workouts in the period
  const workouts = await prisma.workoutSession.findMany({
    where: {
      userId,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      sets: {
        include: {
          exercise: true,
        },
      },
    },
  });

  let totalVolume = 0;
  let totalRPE = 0;
  let rpeCount = 0;
  const exerciseBests = new Map<string, number>();

  workouts.forEach((workout) => {
    workout.sets.forEach((set) => {
      // Calculate volume
      totalVolume += set.weight * set.reps;

      // Track RPE
      if (set.rpe) {
        totalRPE += set.rpe;
        rpeCount++;
      }

      // Track best performance per exercise for PR detection
      const exerciseId = set.exerciseId;
      const estimated1RM =
        set.reps === 1 ? set.weight : set.weight * (1 + set.reps / 30);

      const currentBest = exerciseBests.get(exerciseId) || 0;
      if (estimated1RM > currentBest) {
        exerciseBests.set(exerciseId, estimated1RM);
      }
    });
  });

  // Count PRs by comparing against historical bests
  let prsSet = 0;
  for (const [exerciseId, periodBest] of exerciseBests.entries()) {
    // Get historical best before this period
    const historicalWorkouts = await prisma.workoutSession.findMany({
      where: {
        userId,
        date: {
          lt: startDate, // Before this period
        },
      },
      include: {
        sets: {
          where: {
            exerciseId,
          },
          orderBy: {
            weight: 'desc',
          },
          take: 1,
        },
      },
    });

    // Find the best set from all historical workouts
    let historicalBest = 0;
    historicalWorkouts.forEach((workout) => {
      workout.sets.forEach((set) => {
        const estimated1RM =
          set.reps === 1 ? set.weight : set.weight * (1 + set.reps / 30);
        if (estimated1RM > historicalBest) {
          historicalBest = estimated1RM;
        }
      });
    });

    if (historicalBest === 0) {
      // First time doing this exercise = PR
      prsSet++;
    } else if (periodBest > historicalBest) {
      // Beat historical best = PR
      prsSet++;
    }
  }

  return {
    totalVolume: Math.round(totalVolume),
    totalWorkouts: workouts.length,
    averageIntensity: rpeCount > 0 ? Math.round((totalRPE / rpeCount) * 10) / 10 : 0,
    prsSet,
  };
}
