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
      case "all":
        startDate.setFullYear(2000); // Far enough back to get all workouts
        break;
      default:
        startDate.setMonth(startDate.getMonth() - 3);
    }

    // Fetch workouts with sets and exercises
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

    // Process workouts into timeline format
    const workoutSummaries = workouts.map((workout) => {
      const totalSets = workout.sets.length;
      const totalVolume = workout.sets.reduce(
        (sum, set) => sum + set.weight * set.reps,
        0
      );
      const avgIntensity =
        workout.sets.reduce((sum, set) => sum + (set.rpe || 5), 0) /
        (totalSets || 1);

      // Get unique exercises
      const exercises = Array.from(
        new Set(workout.sets.map((set) => set.exercise.name))
      );

      return {
        id: workout.id,
        date: workout.date.toISOString(),
        duration: workout.duration || 60, // Default 60 min if not set
        totalSets,
        totalVolume,
        exerciseCount: exercises.length,
        avgIntensity: Math.round(avgIntensity * 10) / 10,
        exercises,
      };
    });

    // Calculate summary stats
    const totalWorkouts = workoutSummaries.length;
    const totalVolume = workoutSummaries.reduce(
      (sum, w) => sum + w.totalVolume,
      0
    );
    const avgDuration =
      totalWorkouts > 0
        ? workoutSummaries.reduce((sum, w) => sum + w.duration, 0) /
          totalWorkouts
        : 0;

    return NextResponse.json({
      workouts: workoutSummaries,
      totalWorkouts,
      totalVolume,
      avgDuration,
    });
  } catch (error) {
    console.error("Error fetching workout timeline:", error);
    return NextResponse.json(
      { error: "Failed to fetch workout timeline" },
      { status: 500 }
    );
  }
}
