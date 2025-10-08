import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface PersonalRecord {
  id: string;
  exerciseName: string;
  weight: number;
  reps: number;
  estimated1RM: number;
  date: string;
  isAllTime: boolean;
}

export async function GET(_request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch all completed sets with exercises
    const sets = await prisma.setEntry.findMany({
      where: {
        session: {
          userId: session.user.id,
          completed: true,
        },
        completed: true,
        isWarmup: false, // Exclude warmup sets
      },
      include: {
        exercise: {
          select: {
            name: true,
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
        timestamp: 'desc',
      },
    });

    // Calculate 1RM for each set using Epley formula
    const calculate1RM = (weight: number, reps: number): number => {
      if (reps === 1) return weight;
      return Math.round(weight * (1 + reps / 30));
    };

    // Group sets by exercise and find PRs
    const exerciseMap = new Map<string, PersonalRecord[]>();

    sets.forEach((set) => {
      const exerciseName = set.exercise.name;
      const estimated1RM = calculate1RM(set.weight, set.reps);
      
      const record: PersonalRecord = {
        id: set.id,
        exerciseName,
        weight: set.weight,
        reps: set.reps,
        estimated1RM,
        date: set.session.date.toISOString(),
        isAllTime: false,
      };

      if (!exerciseMap.has(exerciseName)) {
        exerciseMap.set(exerciseName, []);
      }
      
      exerciseMap.get(exerciseName)!.push(record);
    });

    // Find all-time PRs and recent PRs for each exercise
    const allRecords: PersonalRecord[] = [];
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    exerciseMap.forEach((records, _exerciseName) => {
      // Sort by estimated 1RM descending
      const sorted = records.sort((a, b) => b.estimated1RM - a.estimated1RM);
      
      // Mark the all-time PR
      if (sorted.length > 0) {
        sorted[0].isAllTime = true;
      }

      // Add all records that are either:
      // 1. All-time PR
      // 2. Recent (last 30 days)
      sorted.forEach((record) => {
        const recordDate = new Date(record.date);
        if (record.isAllTime || recordDate >= thirtyDaysAgo) {
          allRecords.push(record);
        }
      });
    });

    // Sort all records by date (most recent first)
    const sortedRecords = allRecords.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // Calculate stats
    const allTimePRs = sortedRecords.filter(r => r.isAllTime).length;
    const recentPRs = sortedRecords.filter(r => {
      const recordDate = new Date(r.date);
      return recordDate >= thirtyDaysAgo;
    }).length;

    return NextResponse.json({
      records: sortedRecords,
      stats: {
        allTimePRs,
        recentPRs,
        totalPRs: sortedRecords.length,
      },
    });
  } catch (error) {
    console.error('Error fetching personal records:', error);
    return NextResponse.json(
      { error: 'Failed to fetch personal records' },
      { status: 500 }
    );
  }
}
