import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface MuscleDistribution {
  name: string;
  volume: number;
  percentage: number;
  color: string;
}

const MUSCLE_COLORS: { [key: string]: string } = {
  Chest: '#FF6B9D',
  Back: '#C084FC',
  Legs: '#60A5FA',
  Shoulders: '#FCD34D',
  Arms: '#34D399',
  Core: '#F97316',
};

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

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    
    switch (period) {
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(startDate.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(startDate.getDate() - 30);
    }

    // Fetch all sets with exercise info
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
      },
    });

    // Calculate volume per muscle group
    const muscleVolumes = new Map<string, number>();
    
    // Initialize muscle groups
    ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core'].forEach(muscle => {
      muscleVolumes.set(muscle, 0);
    });

    sets.forEach((set) => {
      const volume = set.weight * set.reps;
      const muscleGroup = set.exercise.muscleGroup;
      
      // Map muscle groups to our categories
      let category = 'Core';
      
      if (muscleGroup.toLowerCase().includes('chest') || 
          muscleGroup.toLowerCase().includes('push')) {
        category = 'Chest';
      } else if (muscleGroup.toLowerCase().includes('back') || 
                 muscleGroup.toLowerCase().includes('pull')) {
        category = 'Back';
      } else if (muscleGroup.toLowerCase().includes('leg')) {
        category = 'Legs';
      } else if (muscleGroup.toLowerCase().includes('shoulder')) {
        category = 'Shoulders';
      } else if (muscleGroup.toLowerCase().includes('arm') || 
                 muscleGroup.toLowerCase().includes('bicep') ||
                 muscleGroup.toLowerCase().includes('tricep')) {
        category = 'Arms';
      }
      
      const current = muscleVolumes.get(category) || 0;
      muscleVolumes.set(category, current + volume);
    });

    // Calculate total and percentages
    const totalVolume = Array.from(muscleVolumes.values()).reduce((sum, vol) => sum + vol, 0);
    
    const distribution: MuscleDistribution[] = Array.from(muscleVolumes.entries()).map(
      ([name, volume]) => ({
        name,
        volume: Math.round(volume),
        percentage: totalVolume > 0 ? Math.round((volume / totalVolume) * 100) : 0,
        color: MUSCLE_COLORS[name] || '#94A3B8',
      })
    );

    // Calculate balance score (coefficient of variation)
    const volumes = distribution.map(d => d.volume).filter(v => v > 0);
    const mean = volumes.reduce((sum, v) => sum + v, 0) / volumes.length;
    const variance = volumes.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / volumes.length;
    const stdDev = Math.sqrt(variance);
    const coefficientOfVariation = mean > 0 ? (stdDev / mean) * 100 : 0;

    let balance: 'excellent' | 'good' | 'unbalanced';
    if (coefficientOfVariation < 30) {
      balance = 'excellent';
    } else if (coefficientOfVariation < 50) {
      balance = 'good';
    } else {
      balance = 'unbalanced';
    }

    // Find most and least trained
    const sorted = [...distribution].sort((a, b) => b.volume - a.volume);
    const mostTrained = sorted[0]?.name || 'N/A';
    const leastTrained = sorted[sorted.length - 1]?.name || 'N/A';

    return NextResponse.json({
      distribution,
      stats: {
        totalVolume: Math.round(totalVolume),
        mostTrained,
        leastTrained,
        balance,
      },
    });
  } catch (error) {
    console.error('Error fetching training distribution:', error);
    return NextResponse.json(
      { error: 'Failed to fetch training distribution' },
      { status: 500 }
    );
  }
}
