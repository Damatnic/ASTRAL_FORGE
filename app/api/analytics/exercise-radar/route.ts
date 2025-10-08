import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface ExerciseMetrics {
  metric: string;
  value: number;
  fullMark: number;
}

interface ExerciseRadarData {
  exerciseName: string;
  muscleGroup: string;
  metrics: ExerciseMetrics[];
  summary: {
    overallScore: number;
    strengths: string[];
    weaknesses: string[];
  };
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const exerciseId = searchParams.get('exerciseId');

    if (!exerciseId) {
      return NextResponse.json({ error: 'Exercise ID required' }, { status: 400 });
    }

    // Get exercise details
    const exercise = await prisma.exercise.findUnique({
      where: { id: exerciseId },
    });

    if (!exercise) {
      return NextResponse.json({ error: 'Exercise not found' }, { status: 404 });
    }

    // Get all workout sessions with sets for this exercise
    const workouts = await prisma.workoutSession.findMany({
      where: {
        userId: session.user.id,
        sets: {
          some: {
            exerciseId,
          },
        },
      },
      include: {
        sets: {
          where: {
            exerciseId,
          },
        },
      },
      orderBy: {
        date: 'asc',
      },
    });

    // Flatten sets from all workouts
    const sets = workouts.flatMap((workout) =>
      workout.sets.map((set) => ({
        ...set,
        session: workout,
      }))
    );

    if (sets.length === 0) {
      return NextResponse.json({
        exerciseName: exercise.name,
        muscleGroup: exercise.muscleGroup,
        metrics: [],
        summary: {
          overallScore: 0,
          strengths: [],
          weaknesses: [],
        },
      });
    }

    // Calculate metrics

    // 1. Strength Score (based on max estimated 1RM)
    const estimated1RMs = sets.map((set) =>
      set.reps === 1 ? set.weight : set.weight * (1 + set.reps / 30)
    );
    const max1RM = Math.max(...estimated1RMs);
    const avg1RM = estimated1RMs.reduce((a, b) => a + b, 0) / estimated1RMs.length;
    const strengthScore = Math.min(100, (max1RM / (avg1RM * 1.2)) * 100);

    // 2. Volume Score (based on total volume vs sessions)
    const totalVolume = sets.reduce((sum, set) => sum + set.weight * set.reps, 0);
    const uniqueSessions = new Set(sets.map((set) => set.sessionId)).size;
    const avgVolumePerSession = totalVolume / uniqueSessions;
    const volumeScore = Math.min(100, (avgVolumePerSession / 1000) * 10);

    // 3. Consistency Score (based on training frequency)
    const firstDate = new Date(sets[0].session.date);
    const lastDate = new Date(sets[sets.length - 1].session.date);
    const daysBetween = Math.max(
      1,
      (lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const expectedSessions = daysBetween / 7; // Expect once per week
    const consistencyScore = Math.min(100, (uniqueSessions / expectedSessions) * 100);

    // 4. Progression Score (based on improvement in 1RM over time)
    const recentSets = sets.slice(-10);
    const earlySets = sets.slice(0, 10);
    const recent1RM =
      recentSets.reduce(
        (sum, s) => sum + (s.reps === 1 ? s.weight : s.weight * (1 + s.reps / 30)),
        0
      ) / recentSets.length;
    const early1RM =
      earlySets.reduce(
        (sum, s) => sum + (s.reps === 1 ? s.weight : s.weight * (1 + s.reps / 30)),
        0
      ) / earlySets.length;
    const improvementRate = ((recent1RM - early1RM) / early1RM) * 100;
    const progressionScore = Math.min(100, Math.max(0, 50 + improvementRate * 2));

    // 5. Intensity Score (based on average RPE)
    const setsWithRPE = sets.filter((s) => s.rpe);
    const avgRPE =
      setsWithRPE.length > 0
        ? setsWithRPE.reduce((sum, s) => sum + (s.rpe || 0), 0) / setsWithRPE.length
        : 7.5;
    const intensityScore = (avgRPE / 10) * 100;

    // 6. Technique Score (based on consistency of reps at similar weights)
    // Higher variance = lower technique score
    const weightGroups = new Map<number, number[]>();
    sets.forEach((set) => {
      const weightKey = Math.round(set.weight / 5) * 5; // Group by 5kg increments
      if (!weightGroups.has(weightKey)) {
        weightGroups.set(weightKey, []);
      }
      weightGroups.get(weightKey)!.push(set.reps);
    });

    let totalVariance = 0;
    let groupCount = 0;
    weightGroups.forEach((reps) => {
      if (reps.length > 1) {
        const mean = reps.reduce((a, b) => a + b, 0) / reps.length;
        const variance =
          reps.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / reps.length;
        totalVariance += variance;
        groupCount++;
      }
    });

    const avgVariance = groupCount > 0 ? totalVariance / groupCount : 0;
    const techniqueScore = Math.max(0, 100 - avgVariance * 10);

    // Build metrics array
    const metrics: ExerciseMetrics[] = [
      { metric: 'Strength', value: Math.round(strengthScore), fullMark: 100 },
      { metric: 'Volume', value: Math.round(volumeScore), fullMark: 100 },
      { metric: 'Consistency', value: Math.round(consistencyScore), fullMark: 100 },
      { metric: 'Progression', value: Math.round(progressionScore), fullMark: 100 },
      { metric: 'Intensity', value: Math.round(intensityScore), fullMark: 100 },
      { metric: 'Technique', value: Math.round(techniqueScore), fullMark: 100 },
    ];

    // Calculate overall score
    const overallScore =
      metrics.reduce((sum, m) => sum + m.value, 0) / metrics.length;

    // Determine strengths and weaknesses
    const sortedMetrics = [...metrics].sort((a, b) => b.value - a.value);
    const strengths = sortedMetrics.slice(0, 2).map((m) => m.metric);
    const weaknesses = sortedMetrics.slice(-2).map((m) => m.metric);

    const result: ExerciseRadarData = {
      exerciseName: exercise.name,
      muscleGroup: exercise.muscleGroup,
      metrics,
      summary: {
        overallScore: Math.round(overallScore * 10) / 10,
        strengths,
        weaknesses,
      },
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error calculating exercise radar data:', error);
    return NextResponse.json(
      { error: 'Failed to calculate exercise radar data' },
      { status: 500 }
    );
  }
}
