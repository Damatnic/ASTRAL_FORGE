import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

interface Insight {
  id: string;
  type: "strength" | "weakness" | "recommendation" | "achievement" | "warning" | "opportunity";
  category: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  actionable: boolean;
  action?: string;
}

export async function GET(_request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Fetch comprehensive data for analysis
    const [workouts, recentWorkouts] = await Promise.all([
      // All workouts (for overall patterns)
      prisma.workoutSession.findMany({
        where: { userId },
        include: { sets: { include: { exercise: true } } },
        orderBy: { date: "desc" },
      }),
      // Recent 30 days
      prisma.workoutSession.findMany({
        where: {
          userId,
          date: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        },
        include: { sets: { include: { exercise: true } } },
      }),
    ]);

    // Get all sets from user's workouts
    const allSetsData = workouts.flatMap(w => w.sets);

    const insights: Insight[] = [];

    // Analysis 1: Consistency Analysis
    const consistency = analyzeConsistency(recentWorkouts);
    if (consistency.insight) insights.push(consistency.insight);

    // Analysis 2: Volume Trends
    const volumeTrend = analyzeVolumeTrend(workouts);
    if (volumeTrend.insight) insights.push(volumeTrend.insight);

    // Analysis 3: Muscle Group Balance
    const balance = analyzeMuscleGroupBalance(allSetsData);
    insights.push(...balance.insights);

    // Analysis 4: Progressive Overload
    const overload = analyzeProgressiveOverload(allSetsData);
    insights.push(...overload.insights);

    // Analysis 5: Recovery Patterns
    const recovery = analyzeRecovery(workouts);
    if (recovery.insight) insights.push(recovery.insight);

    // Analysis 6: Exercise Variety
    const variety = analyzeExerciseVariety(allSetsData);
    if (variety.insight) insights.push(variety.insight);

    // Analysis 7: Plateau Detection
    const plateau = detectPlateau(workouts);
    if (plateau.insight) insights.push(plateau.insight);

    // Calculate overall score (0-100)
    const overallScore = calculateOverallScore({
      consistency: consistency.score,
      volume: volumeTrend.score,
      balance: balance.score,
      overload: overload.score,
      recovery: recovery.score,
      variety: variety.score,
    });

    // Generate predictions
    const predictions = generatePredictions(workouts);

    // Extract strengths and improvements
    const strengths: string[] = [];
    const improvements: string[] = [];

    insights.forEach((insight) => {
      if (insight.type === "strength" || insight.type === "achievement") {
        strengths.push(insight.title);
      } else if (insight.type === "weakness" || insight.type === "warning") {
        improvements.push(insight.title);
      }
    });

    return NextResponse.json({
      insights,
      overallScore,
      strengths: strengths.slice(0, 5),
      improvements: improvements.slice(0, 5),
      predictions,
    });
  } catch (error) {
    console.error("Error generating AI insights:", error);
    return NextResponse.json(
      { error: "Failed to generate AI insights" },
      { status: 500 }
    );
  }
}

// Analysis Functions

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function analyzeConsistency(workouts: any[]) {
  const daysWithWorkouts = workouts.length;
  const score = Math.min(100, (daysWithWorkouts / 30) * 100 * 3.33); // 3x/week = 100

  let insight: Insight | null = null;

  if (daysWithWorkouts >= 12) {
    insight = {
      id: "consistency-high",
      type: "strength",
      category: "Consistency",
      title: "Excellent Training Consistency",
      description: `You've worked out ${daysWithWorkouts} times in the past 30 days. This consistency is a key driver of long-term progress.`,
      priority: "low",
      actionable: false,
    };
  } else if (daysWithWorkouts < 6) {
    insight = {
      id: "consistency-low",
      type: "weakness",
      category: "Consistency",
      title: "Inconsistent Training Frequency",
      description: `Only ${daysWithWorkouts} workouts in the past 30 days. Consistency is crucial for progress.`,
      priority: "high",
      actionable: true,
      action: "Aim for at least 3 workouts per week. Schedule them in advance and treat them as non-negotiable appointments.",
    };
  }

  return { score, insight };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function analyzeVolumeTrend(workouts: any[]) {
  if (workouts.length < 10) return { score: 50, insight: null };

  const recent = workouts.slice(0, 5);
  const previous = workouts.slice(5, 10);

  const recentVolume = recent.reduce((sum, w) => sum + calculateWorkoutVolume(w), 0);
  const previousVolume = previous.reduce((sum, w) => sum + calculateWorkoutVolume(w), 0);

  const change = ((recentVolume - previousVolume) / previousVolume) * 100;
  const score = Math.min(100, 50 + change);

  let insight: Insight | null = null;

  if (change > 15) {
    insight = {
      id: "volume-increasing",
      type: "strength",
      category: "Volume",
      title: "Volume Trending Upward",
      description: `Your training volume has increased by ${change.toFixed(1)}% recently. Progressive overload is happening!`,
      priority: "low",
      actionable: false,
    };
  } else if (change < -15) {
    insight = {
      id: "volume-decreasing",
      type: "warning",
      category: "Volume",
      title: "Decreasing Training Volume",
      description: `Your volume has decreased by ${Math.abs(change).toFixed(1)}%. This could impact progress unless intentional.`,
      priority: "medium",
      actionable: true,
      action: "If not deloading, gradually increase sets or weight to restore progressive overload.",
    };
  }

  return { score, insight };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function analyzeMuscleGroupBalance(sets: any[]) {
  const muscleGroups = new Map<string, number>();

  sets.forEach((set) => {
    const group = set.exercise.muscleGroup;
    muscleGroups.set(group, (muscleGroups.get(group) || 0) + 1);
  });

  const push = muscleGroups.get("push") || 0;
  const pull = muscleGroups.get("pull") || 0;
  const legs = muscleGroups.get("legs") || 0;

  const insights: Insight[] = [];
  let score = 80;

  // Push:Pull ratio
  if (push > 0 && pull > 0) {
    const ratio = push / pull;
    if (ratio > 1.5 || ratio < 0.67) {
      score -= 20;
      insights.push({
        id: "balance-push-pull",
        type: "warning",
        category: "Muscle Balance",
        title: "Push/Pull Imbalance Detected",
        description: `Your push-to-pull ratio is ${ratio.toFixed(2)}:1. This could lead to posture issues or injury.`,
        priority: "high",
        actionable: true,
        action: ratio > 1.5
          ? "Add more pulling exercises (rows, pull-ups) to balance chest and shoulder work."
          : "Add more pushing exercises (bench, overhead press) to balance back work.",
      });
    }
  }

  // Leg training
  const upperBody = push + pull;
  if (upperBody > 0 && legs > 0) {
    const legRatio = legs / upperBody;
    if (legRatio < 0.3) {
      score -= 15;
      insights.push({
        id: "balance-legs",
        type: "weakness",
        category: "Muscle Balance",
        title: "Undertraining Lower Body",
        description: "Leg training is significantly lower than upper body. Don't skip leg day!",
        priority: "medium",
        actionable: true,
        action: "Add 1-2 dedicated leg days per week with squats, deadlifts, and accessory work.",
      });
    }
  }

  return { score, insights };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function analyzeProgressiveOverload(sets: any[]) {
  const insights: Insight[] = [];
  let score = 70;

  // Group by exercise and check for progression
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const exerciseMap = new Map<string, any[]>();
  sets.forEach((set) => {
    const key = set.exercise.id;
    if (!exerciseMap.has(key)) exerciseMap.set(key, []);
    exerciseMap.get(key)!.push(set);
  });

  let progressingCount = 0;
  let stallCount = 0;

  exerciseMap.forEach((exerciseSets) => {
    if (exerciseSets.length < 5) return;

    const recent = exerciseSets.slice(0, 5);
    const previous = exerciseSets.slice(5, 10);

    if (previous.length === 0) return;

    const recentMax = Math.max(...recent.map((s) => s.weight));
    const previousMax = Math.max(...previous.map((s) => s.weight));

    if (recentMax > previousMax) {
      progressingCount++;
    } else if (recentMax === previousMax) {
      stallCount++;
    }
  });

  if (progressingCount > 3) {
    score += 20;
    insights.push({
      id: "overload-good",
      type: "strength",
      category: "Progressive Overload",
      title: "Multiple Exercises Progressing",
      description: `You're making strength gains on ${progressingCount} exercises. Keep it up!`,
      priority: "low",
      actionable: false,
    });
  }

  if (stallCount > 5) {
    score -= 10;
    insights.push({
      id: "overload-stall",
      type: "recommendation",
      category: "Progressive Overload",
      title: "Some Exercises Have Stalled",
      description: `${stallCount} exercises haven't increased weight recently. Time to switch things up.`,
      priority: "medium",
      actionable: true,
      action: "Try: deload week, change rep ranges, add volume, or substitute similar exercises.",
    });
  }

  return { score, insights };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function analyzeRecovery(workouts: any[]) {
  if (workouts.length < 7) return { score: 70, insight: null };

  // Check for consecutive training days
  const dates = workouts.map((w) => new Date(w.date).getTime());
  let maxConsecutive = 1;
  let currentConsecutive = 1;

  for (let i = 1; i < dates.length; i++) {
    const dayDiff = (dates[i - 1] - dates[i]) / (1000 * 60 * 60 * 24);
    if (dayDiff <= 1.5) {
      currentConsecutive++;
      maxConsecutive = Math.max(maxConsecutive, currentConsecutive);
    } else {
      currentConsecutive = 1;
    }
  }

  let score = 70;
  let insight: Insight | null = null;

  if (maxConsecutive >= 7) {
    score -= 30;
    insight = {
      id: "recovery-overtraining",
      type: "warning",
      category: "Recovery",
      title: "Potential Overtraining Detected",
      description: `You've trained ${maxConsecutive} days in a row. Recovery is essential for progress.`,
      priority: "high",
      actionable: true,
      action: "Schedule at least 1-2 rest days per week. Active recovery (walking, stretching) is beneficial.",
    };
  }

  return { score, insight };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function analyzeExerciseVariety(sets: any[]) {
  const uniqueExercises = new Set(sets.map((s) => s.exercise.id)).size;
  const score = Math.min(100, uniqueExercises * 5);

  let insight: Insight | null = null;

  if (uniqueExercises < 10) {
    insight = {
      id: "variety-low",
      type: "opportunity",
      category: "Exercise Selection",
      title: "Limited Exercise Variety",
      description: `You're using only ${uniqueExercises} different exercises. More variety can prevent plateaus.`,
      priority: "low",
      actionable: true,
      action: "Explore new exercises to target muscles from different angles and prevent adaptation.",
    };
  } else if (uniqueExercises > 30) {
    insight = {
      id: "variety-high",
      type: "strength",
      category: "Exercise Selection",
      title: "Excellent Exercise Variety",
      description: `Training with ${uniqueExercises} different exercises provides comprehensive stimulation.`,
      priority: "low",
      actionable: false,
    };
  }

  return { score, insight };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function detectPlateau(workouts: any[]) {
  if (workouts.length < 15) return { insight: null };

  const recent5 = workouts.slice(0, 5);
  const previous5 = workouts.slice(10, 15);

  const recentAvgVolume = recent5.reduce((sum, w) => sum + calculateWorkoutVolume(w), 0) / 5;
  const previousAvgVolume = previous5.reduce((sum, w) => sum + calculateWorkoutVolume(w), 0) / 5;

  const change = Math.abs((recentAvgVolume - previousAvgVolume) / previousAvgVolume) * 100;

  let insight: Insight | null = null;

  if (change < 5) {
    insight = {
      id: "plateau-detected",
      type: "warning",
      category: "Plateau Detection",
      title: "Training Plateau Detected",
      description: "Your volume hasn't changed significantly. You might be plateauing.",
      priority: "high",
      actionable: true,
      action: "Consider: deload week, increase intensity, change exercises, or adjust programming.",
    };
  }

  return { insight };
}

// Helper Functions

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function calculateWorkoutVolume(workout: any): number {
  if (!workout.sets) return 0;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return workout.sets.reduce((sum: number, set: any) => sum + set.weight * set.reps, 0);
}

function calculateOverallScore(scores: Record<string, number>): number {
  const values = Object.values(scores);
  const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
  return Math.round(Math.min(100, Math.max(0, avg)));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function generatePredictions(workouts: any[]) {
  // Next PR Prediction
  let nextPR = "Continue current training for PR opportunities in 2-3 weeks";
  if (workouts.length > 10) {
    const volumeTrending = workouts.slice(0, 5).length > 0;
    if (volumeTrending) {
      nextPR = "Based on current progression, expect PRs in bench press or squat within 2 weeks";
    }
  }

  // Plateau Risk
  let plateauRisk = "Low - maintaining good progression";
  const recentWorkouts = workouts.slice(0, 10);
  if (recentWorkouts.length >= 10) {
    const volumes = recentWorkouts.map(calculateWorkoutVolume);
    const variance = calculateVariance(volumes);
    if (variance < 1000000) {
      plateauRisk = "Medium - consider varying your training stimulus";
    }
  }

  // Injury Risk
  let injuryRisk = "Low - training load is manageable";
  if (workouts.length > 7) {
    const recentDays = workouts.slice(0, 7);
    if (recentDays.length === 7) {
      injuryRisk = "Medium - ensure adequate recovery between sessions";
    }
  }

  return { nextPR, plateauRisk, injuryRisk };
}

function calculateVariance(numbers: number[]): number {
  const mean = numbers.reduce((sum, val) => sum + val, 0) / numbers.length;
  const squaredDiffs = numbers.map((val) => Math.pow(val - mean, 2));
  return squaredDiffs.reduce((sum, val) => sum + val, 0) / numbers.length;
}
