import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface PeriodStats {
  totalVolume: number;
  totalWorkouts: number;
  averageIntensity: number;
  trainingDays: number;
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
    const period = searchParams.get('period') || '30d';

    // Calculate current period date range
    const currentEnd = new Date();
    const currentStart = new Date();
    
    // Calculate previous period for comparison
    const previousEnd = new Date(currentStart);
    const previousStart = new Date();
    
    switch (period) {
      case '7d':
        currentStart.setDate(currentStart.getDate() - 7);
        previousStart.setDate(previousStart.getDate() - 14);
        break;
      case '30d':
        currentStart.setDate(currentStart.getDate() - 30);
        previousStart.setDate(previousStart.getDate() - 60);
        break;
      case '90d':
        currentStart.setDate(currentStart.getDate() - 90);
        previousStart.setDate(previousStart.getDate() - 180);
        break;
      default:
        currentStart.setDate(currentStart.getDate() - 30);
        previousStart.setDate(previousStart.getDate() - 60);
    }

    // Helper function to calculate stats for a period
    const calculatePeriodStats = async (
      startDate: Date, 
      endDate: Date
    ): Promise<PeriodStats> => {
      const sessions = await prisma.workoutSession.findMany({
        where: {
          userId: session.user.id,
          completed: true,
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
        include: {
          sets: {
            where: {
              completed: true,
              isWarmup: false,
            },
          },
        },
      });

      let totalVolume = 0;
      let totalRPE = 0;
      let rpeCount = 0;
      const uniqueDates = new Set<string>();

      sessions.forEach((workout) => {
        uniqueDates.add(workout.date.toISOString().split('T')[0]);
        
        workout.sets.forEach((set) => {
          totalVolume += set.weight * set.reps;
          
          if (set.rpe) {
            totalRPE += set.rpe;
            rpeCount++;
          }
        });
      });

      return {
        totalVolume: Math.round(totalVolume),
        totalWorkouts: sessions.length,
        averageIntensity: rpeCount > 0 ? Math.round((totalRPE / rpeCount) * 10) / 10 : 0,
        trainingDays: uniqueDates.size,
      };
    };

    // Get stats for both periods
    const currentStats = await calculatePeriodStats(currentStart, currentEnd);
    const previousStats = await calculatePeriodStats(previousStart, previousEnd);

    // Calculate trends (percentage change)
    const calculateTrend = (current: number, previous: number): number => {
      if (previous === 0) return 0;
      return Math.round(((current - previous) / previous) * 100);
    };

    const trends = {
      volume: calculateTrend(currentStats.totalVolume, previousStats.totalVolume),
      workouts: calculateTrend(currentStats.totalWorkouts, previousStats.totalWorkouts),
      intensity: calculateTrend(currentStats.averageIntensity, previousStats.averageIntensity),
      trainingDays: calculateTrend(currentStats.trainingDays, previousStats.trainingDays),
    };

    // Generate insights based on trends
    const insights: string[] = [];
    
    if (trends.volume > 10) {
      insights.push('📈 Volume is trending up - great progressive overload!');
    } else if (trends.volume < -10) {
      insights.push('📉 Volume has decreased - consider if you need a deload week');
    }
    
    if (currentStats.averageIntensity > 8.5) {
      insights.push('⚠️ High intensity levels - monitor recovery carefully');
    } else if (currentStats.averageIntensity < 7) {
      insights.push('💪 Room to increase intensity for better gains');
    }
    
    if (currentStats.trainingDays < 3) {
      insights.push('📅 Consider increasing training frequency to 3-5 days/week');
    } else if (currentStats.trainingDays >= 5) {
      insights.push('🔥 Excellent training frequency!');
    }

    if (insights.length === 0) {
      insights.push('✨ Keep up the consistent training!');
    }

    return NextResponse.json({
      current: currentStats,
      previous: previousStats,
      trends,
      insights,
    });
  } catch (error) {
    console.error('Error fetching progress overview:', error);
    return NextResponse.json(
      { error: 'Failed to fetch progress overview' },
      { status: 500 }
    );
  }
}
