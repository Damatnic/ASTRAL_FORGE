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

    // Fetch workouts for the period
    const workouts = await prisma.workoutSession.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        sets: true,
      },
      orderBy: {
        date: "asc",
      },
    });

    // Generate daily recovery data
    const dailyRecovery = new Map<string, {
      sleepQuality: number;
      sorenessLevel: number;
      hrvScore: number;
      recoveryScore: number;
    }>();

    // Initialize all dates in range
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dateKey = currentDate.toISOString().split('T')[0];
      
      // Simulate recovery metrics based on training load
      // In a real app, this would come from user input or wearable device
      const dayWorkouts = workouts.filter(
        (w) => w.date.toISOString().split('T')[0] === dateKey
      );

      const totalSets = dayWorkouts.reduce((sum, w) => sum + w.sets.length, 0);
      const avgIntensity = dayWorkouts.length > 0
        ? dayWorkouts.reduce((sum, w) => {
            const workoutAvgRPE = w.sets.reduce((s, set) => s + (set.rpe || 7), 0) / w.sets.length;
            return sum + workoutAvgRPE;
          }, 0) / dayWorkouts.length
        : 0;

      // Simulate sleep quality (decreases with high training load)
      const baselineSleep = 7.5;
      const sleepImpact = Math.min(2, totalSets * 0.05); // High load impacts sleep
      const sleepQuality = Math.max(4, Math.min(10, baselineSleep - sleepImpact + (Math.random() * 1.5 - 0.75)));

      // Simulate soreness (increases with training load)
      const baselineSoreness = 2;
      const sorenessIncrease = Math.min(6, totalSets * 0.08 + avgIntensity * 0.3);
      const sorenessLevel = Math.max(0, Math.min(10, baselineSoreness + sorenessIncrease + (Math.random() * 1.5 - 0.75)));

      // Simulate HRV (decreases with fatigue, increases with recovery)
      const baselineHRV = 65;
      const hrvImpact = (sleepQuality - 7) * 3 - (sorenessLevel - 2) * 2;
      const hrvScore = Math.max(40, Math.min(90, baselineHRV + hrvImpact + (Math.random() * 10 - 5)));

      // Calculate composite recovery score
      // Sleep Quality: 40%, HRV: 30%, Inverse Soreness: 30%
      const sleepComponent = (sleepQuality / 10) * 100 * 0.4;
      const hrvComponent = (hrvScore / 90) * 100 * 0.3;
      const sorenessComponent = ((10 - sorenessLevel) / 10) * 100 * 0.3;
      const recoveryScore = Math.round(sleepComponent + hrvComponent + sorenessComponent);

      dailyRecovery.set(dateKey, {
        sleepQuality: Math.round(sleepQuality * 10) / 10,
        sorenessLevel: Math.round(sorenessLevel * 10) / 10,
        hrvScore: Math.round(hrvScore),
        recoveryScore,
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Convert to array
    const data = Array.from(dailyRecovery.entries()).map(([date, metrics]) => ({
      date,
      ...metrics,
    }));

    // Calculate averages
    const totalDays = data.length;
    const averageRecovery = data.reduce((sum, d) => sum + d.recoveryScore, 0) / totalDays;
    const averageSleep = data.reduce((sum, d) => sum + d.sleepQuality, 0) / totalDays;
    const averageHRV = data.reduce((sum, d) => sum + d.hrvScore, 0) / totalDays;
    const averageSoreness = data.reduce((sum, d) => sum + d.sorenessLevel, 0) / totalDays;

    // Determine trend (compare first third vs last third)
    const thirdSize = Math.floor(totalDays / 3);
    const firstThird = data.slice(0, thirdSize);
    const lastThird = data.slice(-thirdSize);

    const avgFirstThird = firstThird.reduce((sum, d) => sum + d.recoveryScore, 0) / firstThird.length;
    const avgLastThird = lastThird.reduce((sum, d) => sum + d.recoveryScore, 0) / lastThird.length;

    let trend: "improving" | "stable" | "declining";
    if (avgLastThird > avgFirstThird + 5) {
      trend = "improving";
    } else if (avgLastThird < avgFirstThird - 5) {
      trend = "declining";
    } else {
      trend = "stable";
    }

    // Generate recommendation
    let recommendation = "";
    if (averageRecovery < 50) {
      recommendation = "Recovery scores are low. Consider taking additional rest days, prioritizing sleep (8+ hours), and reducing training intensity.";
    } else if (averageRecovery < 70) {
      recommendation = "Recovery is moderate. Monitor sleep quality and soreness levels. Consider active recovery sessions and proper nutrition.";
    } else if (trend === "declining") {
      recommendation = "Recovery trend is declining. Watch for signs of overtraining. Ensure adequate rest between intense sessions.";
    } else if (averageSleep < 6.5) {
      recommendation = "Sleep quality is below optimal. Aim for 7-9 hours of quality sleep. Consider sleep hygiene improvements.";
    } else if (averageSoreness > 6) {
      recommendation = "High soreness levels detected. Incorporate more stretching, foam rolling, and active recovery. Consider massage or physical therapy.";
    } else {
      recommendation = "Recovery metrics look good. Continue with current training and recovery practices. Listen to your body and adjust as needed.";
    }

    return NextResponse.json({
      data,
      averageRecovery: Math.round(averageRecovery * 10) / 10,
      averageSleep: Math.round(averageSleep * 10) / 10,
      averageHRV: Math.round(averageHRV),
      averageSoreness: Math.round(averageSoreness * 10) / 10,
      trend,
      recommendation,
    });
  } catch (error) {
    console.error("Error fetching recovery metrics:", error);
    return NextResponse.json(
      { error: "Failed to fetch recovery metrics" },
      { status: 500 }
    );
  }
}
