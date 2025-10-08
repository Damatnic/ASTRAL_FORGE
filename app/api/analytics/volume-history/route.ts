import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface VolumeDataPoint {
  date: string;
  chest: number;
  back: number;
  legs: number;
  shoulders: number;
  arms: number;
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
    const period = searchParams.get('period') || '3M';
    const aggregation = searchParams.get('aggregation') || 'weekly';

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    
    switch (period) {
      case '1M':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
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

    // Fetch all sets with exercises in the period
    const sets = await prisma.setEntry.findMany({
      where: {
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
        exercise: {
          select: {
            muscleGroup: true,
          },
        },
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

    // Group by time period (weekly or monthly)
    const volumeData = new Map<string, {
      chest: number;
      back: number;
      legs: number;
      shoulders: number;
      arms: number;
    }>();

    const getTimeKey = (date: Date): string => {
      if (aggregation === 'weekly') {
        // Get ISO week
        const onejan = new Date(date.getFullYear(), 0, 1);
        const week = Math.ceil((((date.getTime() - onejan.getTime()) / 86400000) + onejan.getDay() + 1) / 7);
        return `${date.getFullYear()}-W${week.toString().padStart(2, '0')}`;
      } else {
        // Monthly
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      }
    };

    sets.forEach((set) => {
      const timeKey = getTimeKey(set.session.date);
      const volume = set.weight * set.reps;
      const muscleGroup = set.exercise.muscleGroup.toLowerCase();
      
      if (!volumeData.has(timeKey)) {
        volumeData.set(timeKey, {
          chest: 0,
          back: 0,
          legs: 0,
          shoulders: 0,
          arms: 0,
        });
      }
      
      const data = volumeData.get(timeKey)!;
      
      // Map muscle groups to categories
      if (muscleGroup.includes('chest') || muscleGroup.includes('push')) {
        data.chest += volume;
      } else if (muscleGroup.includes('back') || muscleGroup.includes('pull')) {
        data.back += volume;
      } else if (muscleGroup.includes('leg')) {
        data.legs += volume;
      } else if (muscleGroup.includes('shoulder')) {
        data.shoulders += volume;
      } else if (muscleGroup.includes('arm') || muscleGroup.includes('bicep') || muscleGroup.includes('tricep')) {
        data.arms += volume;
      }
    });

    // Convert to array and sort by date
    const volumeHistory: VolumeDataPoint[] = Array.from(volumeData.entries())
      .map(([date, volumes]) => ({
        date,
        chest: Math.round(volumes.chest),
        back: Math.round(volumes.back),
        legs: Math.round(volumes.legs),
        shoulders: Math.round(volumes.shoulders),
        arms: Math.round(volumes.arms),
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Calculate summary stats
    const totalVolume = volumeHistory.reduce(
      (sum, point) => sum + point.chest + point.back + point.legs + point.shoulders + point.arms,
      0
    );

    const averageVolume = volumeHistory.length > 0 
      ? Math.round(totalVolume / volumeHistory.length) 
      : 0;

    return NextResponse.json({
      data: volumeHistory,
      stats: {
        totalVolume: Math.round(totalVolume),
        averageVolume,
        dataPoints: volumeHistory.length,
      },
    });
  } catch (error) {
    console.error('Error fetching volume history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch volume history' },
      { status: 500 }
    );
  }
}
