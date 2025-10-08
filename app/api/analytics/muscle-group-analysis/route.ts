import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// Muscle group colors
const MUSCLE_GROUP_COLORS: Record<string, string> = {
  legs: "#8b5cf6",
  push: "#3b82f6",
  pull: "#10b981",
  core: "#06b6d4",
  other: "#64748b",
};

// Muscle group display names
const MUSCLE_GROUP_NAMES: Record<string, string> = {
  legs: "Legs",
  push: "Push (Chest/Shoulders/Triceps)",
  pull: "Pull (Back/Biceps)",
  core: "Core",
  other: "Other",
};

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
                muscleGroup: true,
              },
            },
          },
        },
      },
    });

    // Aggregate data by muscle group
    const muscleGroupStats = new Map<
      string,
      {
        volume: number;
        sets: number;
      }
    >();

    workouts.forEach((workout) => {
      workout.sets.forEach((set) => {
        const muscleGroup = set.exercise.muscleGroup.toLowerCase();
        const volume = set.weight * set.reps;

        if (!muscleGroupStats.has(muscleGroup)) {
          muscleGroupStats.set(muscleGroup, {
            volume: 0,
            sets: 0,
          });
        }

        const stats = muscleGroupStats.get(muscleGroup)!;
        stats.volume += volume;
        stats.sets += 1;
      });
    });

    // Calculate totals
    let totalVolume = 0;
    let totalSets = 0;
    muscleGroupStats.forEach((stats) => {
      totalVolume += stats.volume;
      totalSets += stats.sets;
    });

    // Build muscle group data array
    const muscleGroups = Array.from(muscleGroupStats.entries())
      .map(([muscleGroup, stats]) => ({
        muscleGroup: MUSCLE_GROUP_NAMES[muscleGroup] || muscleGroup,
        volume: stats.volume,
        sets: stats.sets,
        percentage: totalVolume > 0 ? Math.round((stats.volume / totalVolume) * 100) : 0,
        color: MUSCLE_GROUP_COLORS[muscleGroup] || MUSCLE_GROUP_COLORS.other,
      }))
      .sort((a, b) => b.volume - a.volume);

    // Analyze balance
    const balanceAnalysis = analyzeBalance(muscleGroups);

    return NextResponse.json({
      muscleGroups,
      totalVolume,
      totalSets,
      balanceAnalysis,
    });
  } catch (error) {
    console.error("Error fetching muscle group analysis:", error);
    return NextResponse.json(
      { error: "Failed to fetch muscle group analysis" },
      { status: 500 }
    );
  }
}

function analyzeBalance(muscleGroups: Array<{ muscleGroup: string; volume: number; percentage: number }>) {
  const imbalances: Array<{
    primary: string;
    secondary: string;
    ratio: number;
    recommendation: string;
  }> = [];

  // Find push and pull groups
  const pushGroup = muscleGroups.find((g) => g.muscleGroup.includes("Push"));
  const pullGroup = muscleGroups.find((g) => g.muscleGroup.includes("Pull"));

  // Check push/pull balance
  if (pushGroup && pullGroup) {
    const ratio = pushGroup.volume > pullGroup.volume 
      ? pushGroup.volume / pullGroup.volume 
      : pullGroup.volume / pushGroup.volume;
    
    const dominant = pushGroup.volume > pullGroup.volume ? "Push" : "Pull";
    const weaker = pushGroup.volume > pullGroup.volume ? "Pull" : "Push";

    if (ratio > 1.5) {
      imbalances.push({
        primary: dominant,
        secondary: weaker,
        ratio,
        recommendation: `Increase ${weaker.toLowerCase()} exercises to balance with ${dominant.toLowerCase()} work`,
      });
    }
  }

  // Check if legs are significantly underworked
  const legsGroup = muscleGroups.find((g) => g.muscleGroup === "Legs");
  const upperBodyVolume = muscleGroups
    .filter((g) => g.muscleGroup !== "Legs" && g.muscleGroup !== "Core" && g.muscleGroup !== "Other")
    .reduce((sum, g) => sum + g.volume, 0);

  if (legsGroup && upperBodyVolume > 0) {
    const legToUpperRatio = legsGroup.volume / upperBodyVolume;
    
    // Legs should be at least 30% of upper body volume
    if (legToUpperRatio < 0.3) {
      imbalances.push({
        primary: "Upper Body",
        secondary: "Legs",
        ratio: upperBodyVolume / legsGroup.volume,
        recommendation: "Increase leg training frequency and volume to balance with upper body",
      });
    }
  }

  // Determine overall balance status
  let status: "balanced" | "minor-imbalance" | "major-imbalance";
  if (imbalances.length === 0) {
    status = "balanced";
  } else if (imbalances.some((i) => i.ratio > 2.0)) {
    status = "major-imbalance";
  } else {
    status = "minor-imbalance";
  }

  return {
    status,
    imbalances,
  };
}
