import { prisma } from '@/lib/prisma';

/**
 * Progress Hub - Data Fetching Layer
 * Aggregates achievements, goals, photos, and measurements for central dashboard
 */

// Quick Stats Overview
export async function getQuickStats(userId: string) {
  const [
    totalWorkouts,
    currentStreak,
    totalVolume,
    recentPRs,
    activeGoals,
    latestMeasurement,
  ] = await Promise.all([
    // Total completed workouts
    prisma.workoutSession.count({
      where: { userId, completed: true },
    }),

    // Current workout streak
    prisma.streak.findFirst({
      where: { userId },
      orderBy: { current: 'desc' },
    }),

    // Total volume lifted (last 90 days)
    prisma.setEntry.aggregate({
      where: {
        session: {
          userId,
          date: {
            gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
          },
        },
        isWarmup: false,
      },
      _sum: {
        weight: true,
      },
    }),

    // Recent PRs (last 30 days)
    prisma.achievement.count({
      where: {
        userId,
        earnedAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
        type: 'pr',
      },
    }),

    // Active goals
    prisma.goal.count({
      where: {
        userId,
        status: 'active',
      },
    }),

    // Latest measurement
    prisma.bodyMetric.findFirst({
      where: { userId },
      orderBy: { date: 'desc' },
    }),
  ]);

  return {
    totalWorkouts,
    currentStreak: currentStreak?.current || 0,
    longestStreak: currentStreak?.longest || 0,
    totalVolume: totalVolume._sum?.weight || 0,
    recentPRs,
    activeGoals,
    latestWeight: latestMeasurement?.weight || null,
    latestBodyFat: latestMeasurement?.bodyFat || null,
  };
}

// Recent Achievements (last 30 days)
export async function getRecentAchievements(userId: string, limit = 10) {
  const achievements = await prisma.achievement.findMany({
    where: {
      userId,
      earnedAt: {
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
    },
    orderBy: {
      earnedAt: 'desc',
    },
    take: limit,
  });

  return achievements.map((achievement) => ({
    id: achievement.id,
    title: achievement.title,
    description: achievement.description,
    type: achievement.type,
    earnedAt: achievement.earnedAt,
    metadata: achievement.metadata,
  }));
}

// Goal Progress Summary
export async function getGoalProgress(userId: string) {
  const goals = await prisma.goal.findMany({
    where: {
      userId,
      status: { in: ['active', 'completed'] },
    },
    orderBy: {
      deadline: 'asc',
    },
  });

  return goals.map((goal) => {
    const progress =
      goal.targetValue && goal.targetValue > 0 && goal.currentValue
        ? Math.min((goal.currentValue / goal.targetValue) * 100, 100)
        : 0;

    const daysRemaining = goal.deadline
      ? Math.ceil(
          (goal.deadline.getTime() - Date.now()) / (24 * 60 * 60 * 1000)
        )
      : null;

    return {
      id: goal.id,
      title: goal.title,
      description: goal.description,
      goalType: goal.goalType,
      status: goal.status,
      currentValue: goal.currentValue,
      targetValue: goal.targetValue,
      unit: goal.unit,
      progress,
      deadline: goal.deadline,
      daysRemaining,
      milestones: goal.milestones,
    };
  });
}

// Progress Photos Comparison
export async function getProgressPhotos(userId: string, limit = 6) {
  const photos = await prisma.progressPhoto.findMany({
    where: { userId },
    orderBy: { date: 'desc' },
    take: limit,
  });

  return photos.map((photo) => ({
    id: photo.id,
    photoUrl: photo.photoUrl,
    photoType: photo.photoType,
    date: photo.date,
    notes: photo.notes,
    weight: photo.weight,
    bodyFat: photo.bodyFat,
  }));
}

// Measurement Trends (last 12 weeks)
export async function getMeasurementTrends(userId: string) {
  const measurements = await prisma.bodyMetric.findMany({
    where: {
      userId,
      date: {
        gte: new Date(Date.now() - 12 * 7 * 24 * 60 * 60 * 1000),
      },
    },
    orderBy: {
      date: 'asc',
    },
  });

  // Group by week
  const weeklyData = measurements.reduce((acc, measurement) => {
    const weekStart = new Date(measurement.date);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekKey = weekStart.toISOString().split('T')[0];

    if (!acc[weekKey]) {
      acc[weekKey] = {
        week: weekKey,
        weight: [],
        bodyFat: [],
        chest: [],
        waist: [],
        hips: [],
        arms: [],
        thighs: [],
      };
    }

    if (measurement.weight) acc[weekKey].weight.push(measurement.weight);
    if (measurement.bodyFat) acc[weekKey].bodyFat.push(measurement.bodyFat);
    if (measurement.chest) acc[weekKey].chest.push(measurement.chest);
    if (measurement.waist) acc[weekKey].waist.push(measurement.waist);
    if (measurement.hips) acc[weekKey].hips.push(measurement.hips);
    if (measurement.arms) acc[weekKey].arms.push(measurement.arms);
    if (measurement.thighs) acc[weekKey].thighs.push(measurement.thighs);

    return acc;
  }, {} as Record<string, any>);

  // Calculate averages
  return Object.values(weeklyData).map((week: any) => ({
    week: week.week,
    weight:
      week.weight.length > 0
        ? week.weight.reduce((sum: number, val: number) => sum + val, 0) /
          week.weight.length
        : null,
    bodyFat:
      week.bodyFat.length > 0
        ? week.bodyFat.reduce((sum: number, val: number) => sum + val, 0) /
          week.bodyFat.length
        : null,
    chest:
      week.chest.length > 0
        ? week.chest.reduce((sum: number, val: number) => sum + val, 0) /
          week.chest.length
        : null,
    waist:
      week.waist.length > 0
        ? week.waist.reduce((sum: number, val: number) => sum + val, 0) /
          week.waist.length
        : null,
    hips:
      week.hips.length > 0
        ? week.hips.reduce((sum: number, val: number) => sum + val, 0) /
          week.hips.length
        : null,
    arms:
      week.arms.length > 0
        ? week.arms.reduce((sum: number, val: number) => sum + val, 0) /
          week.arms.length
        : null,
    thighs:
      week.thighs.length > 0
        ? week.thighs.reduce((sum: number, val: number) => sum + val, 0) /
          week.thighs.length
        : null,
  }));
}

// Recent Workout Summary (for quick view)
export async function getRecentWorkouts(userId: string, limit = 5) {
  const sessions = await prisma.workoutSession.findMany({
    where: {
      userId,
      completed: true,
    },
    include: {
      sets: {
        include: {
          exercise: {
            select: {
              name: true,
              category: true,
            },
          },
        },
      },
    },
    orderBy: {
      date: 'desc',
    },
    take: limit,
  });

  return sessions.map((session) => {
    const totalVolume = session.sets.reduce(
      (sum, set) => sum + (set.weight || 0) * set.reps,
      0
    );

    const exercises = Array.from(
      new Set(session.sets.map((set) => set.exercise.name))
    ).length;

    const ratedSets = session.sets.filter((set) => set.rpe);

    return {
      id: session.id,
      name: session.name,
      date: session.date,
      duration: session.duration,
      totalVolume,
      totalSets: session.sets.length,
      exercises,
      avgRPE:
        ratedSets.length > 0
          ? ratedSets.reduce((sum, set) => sum + (set.rpe || 0), 0) / ratedSets.length
          : null,
    };
  });
}

// Aggregate all progress data
export async function getProgressOverview(userId: string) {
  const [
    quickStats,
    recentAchievements,
    goalProgress,
    progressPhotos,
    measurementTrends,
    recentWorkouts,
  ] = await Promise.all([
    getQuickStats(userId),
    getRecentAchievements(userId),
    getGoalProgress(userId),
    getProgressPhotos(userId),
    getMeasurementTrends(userId),
    getRecentWorkouts(userId),
  ]);

  return {
    quickStats,
    recentAchievements,
    goalProgress,
    progressPhotos,
    measurementTrends,
    recentWorkouts,
  };
}
