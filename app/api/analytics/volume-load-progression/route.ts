import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// Linear regression calculation
function calculateLinearRegression(data: Array<{ x: number; y: number }>) {
  const n = data.length;
  if (n === 0) return { slope: 0, intercept: 0 };

  const sumX = data.reduce((sum, point) => sum + point.x, 0);
  const sumY = data.reduce((sum, point) => sum + point.y, 0);
  const sumXY = data.reduce((sum, point) => sum + point.x * point.y, 0);
  const sumX2 = data.reduce((sum, point) => sum + point.x * point.x, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  return { slope, intercept };
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

    // Fetch all workouts with sets
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
          select: {
            weight: true,
            reps: true,
          },
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    if (workouts.length === 0) {
      return NextResponse.json({
        data: [],
        totalVolume: 0,
        averagePerWorkout: 0,
        trend: "stable",
        trendPercentage: 0,
        slope: 0,
      });
    }

    // Group workouts by week for smoother visualization
    const weeklyData = new Map<string, { totalVolume: number; workoutCount: number; date: Date }>();

    workouts.forEach((workout) => {
      // Calculate week start (Monday)
      const workoutDate = new Date(workout.date);
      const dayOfWeek = workoutDate.getDay();
      const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      const weekStart = new Date(workoutDate);
      weekStart.setDate(workoutDate.getDate() - daysToMonday);
      weekStart.setHours(0, 0, 0, 0);

      const weekKey = weekStart.toISOString().split("T")[0];

      // Calculate workout volume
      const workoutVolume = workout.sets.reduce((sum, set) => {
        return sum + set.weight * set.reps;
      }, 0);

      if (!weeklyData.has(weekKey)) {
        weeklyData.set(weekKey, {
          totalVolume: 0,
          workoutCount: 0,
          date: weekStart,
        });
      }

      const weekData = weeklyData.get(weekKey)!;
      weekData.totalVolume += workoutVolume;
      weekData.workoutCount += 1;
    });

    // Convert to array and sort
    const sortedWeeks = Array.from(weeklyData.entries())
      .sort((a, b) => a[1].date.getTime() - b[1].date.getTime())
      .map(([_, data]) => data);

    // Calculate total volume
    const totalVolume = sortedWeeks.reduce((sum, week) => sum + week.totalVolume, 0);
    const totalWorkouts = sortedWeeks.reduce((sum, week) => sum + week.workoutCount, 0);
    const averagePerWorkout = totalWorkouts > 0 ? totalVolume / totalWorkouts : 0;

    // Prepare data for linear regression
    const regressionData = sortedWeeks.map((week, index) => ({
      x: index,
      y: week.totalVolume,
    }));

    // Calculate linear regression
    const { slope, intercept } = calculateLinearRegression(regressionData);

    // Build data points with trend line
    const data = sortedWeeks.map((week, index) => {
      const trendLine = slope * index + intercept;

      return {
        date: week.date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        totalVolume: week.totalVolume,
        trendLine: Math.max(0, trendLine), // Ensure non-negative
        workouts: week.workoutCount,
      };
    });

    // Determine trend based on slope
    let trend: "increasing" | "stable" | "decreasing";
    if (slope > 1000) {
      trend = "increasing";
    } else if (slope < -1000) {
      trend = "decreasing";
    } else {
      trend = "stable";
    }

    // Calculate percentage change from first to last
    const firstWeekVolume = sortedWeeks[0].totalVolume;
    const lastWeekVolume = sortedWeeks[sortedWeeks.length - 1].totalVolume;
    const trendPercentage =
      firstWeekVolume > 0 ? ((lastWeekVolume - firstWeekVolume) / firstWeekVolume) * 100 : 0;

    return NextResponse.json({
      data,
      totalVolume,
      averagePerWorkout,
      trend,
      trendPercentage,
      slope,
    });
  } catch (error) {
    console.error("Error fetching volume load progression:", error);
    return NextResponse.json(
      { error: "Failed to fetch volume load progression" },
      { status: 500 }
    );
  }
}
