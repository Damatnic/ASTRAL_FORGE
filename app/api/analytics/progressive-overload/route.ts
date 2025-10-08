import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// Epley formula for estimated 1RM
function calculateEstimated1RM(weight: number, reps: number): number {
  if (reps === 1) return weight;
  return weight * (1 + reps / 30);
}

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
      case "1y":
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(startDate.getMonth() - 3);
    }

    // Fetch all workouts with sets and exercises
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
                category: true,
              },
            },
          },
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    // Group sets by exercise and track progression
    const exerciseProgressionMap = new Map<
      string,
      Array<{
        date: string;
        weight: number;
        reps: number;
        estimatedMax: number;
      }>
    >();

    const exerciseNames = new Map<string, string>();

    workouts.forEach((workout) => {
      const dateStr = new Date(workout.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      workout.sets.forEach((set) => {
        if (set.weight > 0 && set.reps > 0) {
          const exerciseId = set.exercise.id;
          const exerciseName = set.exercise.name;

          exerciseNames.set(exerciseId, exerciseName);

          if (!exerciseProgressionMap.has(exerciseId)) {
            exerciseProgressionMap.set(exerciseId, []);
          }

          const estimatedMax = calculateEstimated1RM(set.weight, set.reps);

          exerciseProgressionMap.get(exerciseId)!.push({
            date: dateStr,
            weight: set.weight,
            reps: set.reps,
            estimatedMax,
          });
        }
      });
    });

    // Build exercise progression data with trend analysis
    const exercises = Array.from(exerciseProgressionMap.entries())
      .map(([exerciseId, data]) => {
        if (data.length < 2) return null; // Need at least 2 data points

        // Sort by date to ensure chronological order
        const sortedData = data;

        // Get starting and current max
        const startingMax = sortedData[0].estimatedMax;
        const currentMax = sortedData[sortedData.length - 1].estimatedMax;

        // Calculate percent change
        const percentChange = ((currentMax - startingMax) / startingMax) * 100;

        // Determine trend
        let trend: "increasing" | "stable" | "decreasing";
        if (percentChange > 5) {
          trend = "increasing";
        } else if (percentChange < -5) {
          trend = "decreasing";
        } else {
          trend = "stable";
        }

        return {
          exerciseId,
          exerciseName: exerciseNames.get(exerciseId) || "Unknown",
          data: sortedData,
          trend,
          percentChange,
          currentMax,
          startingMax,
        };
      })
      .filter((e) => e !== null)
      .sort((a, b) => Math.abs(b!.percentChange) - Math.abs(a!.percentChange)); // Sort by biggest changes

    return NextResponse.json({
      exercises,
    });
  } catch (error) {
    console.error("Error fetching progressive overload data:", error);
    return NextResponse.json(
      { error: "Failed to fetch progressive overload data" },
      { status: 500 }
    );
  }
}
