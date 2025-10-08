import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "3m";

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();

    switch (period) {
      case "1m":
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case "3m":
        startDate.setMonth(startDate.getMonth() - 3);
        break;
      case "6m":
        startDate.setMonth(startDate.getMonth() - 6);
        break;
      default:
        startDate.setMonth(startDate.getMonth() - 3);
    }

    // Fetch all workouts in the period with sets
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
            exercise: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    // Calculate comparison period (previous period of same length)
    const periodLength = endDate.getTime() - startDate.getTime();
    const comparisonEndDate = new Date(startDate.getTime() - 1);
    const comparisonStartDate = new Date(comparisonEndDate.getTime() - periodLength);

    const comparisonWorkouts = await prisma.workoutSession.findMany({
      where: {
        userId,
        date: {
          gte: comparisonStartDate,
          lte: comparisonEndDate,
        },
      },
      include: {
        sets: {
          include: {
            exercise: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    // Aggregate data by exercise
    const exerciseStats = new Map<
      string,
      {
        exerciseId: string;
        exerciseName: string;
        totalVolume: number;
        maxWeight: number;
        frequency: number;
        totalRPE: number;
        rpeCount: number;
        lastPerformed: Date;
      }
    >();

    // Process current period
    workouts.forEach((workout) => {
      workout.sets.forEach((set) => {
        const exerciseId = set.exercise.id;
        const exerciseName = set.exercise.name;
        const volume = set.weight * set.reps;

        if (!exerciseStats.has(exerciseId)) {
          exerciseStats.set(exerciseId, {
            exerciseId,
            exerciseName,
            totalVolume: 0,
            maxWeight: 0,
            frequency: 0,
            totalRPE: 0,
            rpeCount: 0,
            lastPerformed: workout.date,
          });
        }

        const stats = exerciseStats.get(exerciseId)!;
        stats.totalVolume += volume;
        stats.maxWeight = Math.max(stats.maxWeight, set.weight);
        
        if (set.rpe) {
          stats.totalRPE += set.rpe;
          stats.rpeCount++;
        }

        // Update last performed
        if (workout.date > stats.lastPerformed) {
          stats.lastPerformed = workout.date;
        }
      });
    });

    // Count unique sessions per exercise
    const exerciseSessions = new Map<string, Set<string>>();
    workouts.forEach((workout) => {
      workout.sets.forEach((set) => {
        const exerciseId = set.exercise.id;
        if (!exerciseSessions.has(exerciseId)) {
          exerciseSessions.set(exerciseId, new Set());
        }
        exerciseSessions.get(exerciseId)!.add(workout.id);
      });
    });

    exerciseSessions.forEach((sessions, exerciseId) => {
      if (exerciseStats.has(exerciseId)) {
        exerciseStats.get(exerciseId)!.frequency = sessions.size;
      }
    });

    // Calculate comparison volumes for trends
    const comparisonVolumes = new Map<string, number>();
    comparisonWorkouts.forEach((workout) => {
      workout.sets.forEach((set) => {
        const exerciseId = set.exercise.id;
        const volume = set.weight * set.reps;
        comparisonVolumes.set(
          exerciseId,
          (comparisonVolumes.get(exerciseId) || 0) + volume
        );
      });
    });

    // Build rankings
    const rankings = Array.from(exerciseStats.values()).map((stats) => {
      const currentVolume = stats.totalVolume;
      const previousVolume = comparisonVolumes.get(stats.exerciseId) || 0;
      const volumeTrend =
        previousVolume > 0
          ? Math.round(((currentVolume - previousVolume) / previousVolume) * 100)
          : 0;

      return {
        exerciseId: stats.exerciseId,
        exerciseName: stats.exerciseName,
        totalVolume: stats.totalVolume,
        maxWeight: stats.maxWeight,
        frequency: stats.frequency,
        avgRPE: stats.rpeCount > 0 ? stats.totalRPE / stats.rpeCount : 5,
        lastPerformed: stats.lastPerformed.toISOString(),
        volumeTrend,
      };
    });

    // Sort by different metrics
    const byVolume = [...rankings].sort((a, b) => b.totalVolume - a.totalVolume);
    const byStrength = [...rankings].sort((a, b) => b.maxWeight - a.maxWeight);
    const byFrequency = [...rankings].sort((a, b) => b.frequency - a.frequency);

    return NextResponse.json({
      byVolume,
      byStrength,
      byFrequency,
      totalExercises: rankings.length,
    });
  } catch (error) {
    console.error("Error fetching exercise leaderboard:", error);
    return NextResponse.json(
      { error: "Failed to fetch exercise leaderboard" },
      { status: 500 }
    );
  }
}
