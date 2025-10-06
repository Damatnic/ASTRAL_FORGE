import { prisma } from '@/lib/prisma';

export const GOAL_TYPES = [
  'strength',
  'weight',
  'body_composition',
  'performance',
  'habit',
  'measurement',
] as const;

export type GoalType = (typeof GOAL_TYPES)[number];

export const GOAL_TYPE_LABELS: Record<GoalType, string> = {
  strength: 'Strength Goal',
  weight: 'Weight Goal',
  body_composition: 'Body Composition',
  performance: 'Performance Goal',
  habit: 'Habit Goal',
  measurement: 'Measurement Goal',
};

export const GOAL_TYPE_ICONS: Record<GoalType, string> = {
  strength: '💪',
  weight: '⚖️',
  body_composition: '📊',
  performance: '🎯',
  habit: '✅',
  measurement: '📏',
};

export interface GoalFilters {
  status?: 'active' | 'completed' | 'abandoned';
  goalType?: GoalType;
  limit?: number;
  offset?: number;
}

export interface Milestone {
  value: number;
  date: Date;
  note?: string;
  achieved?: boolean;
}

export interface GoalCreate {
  title: string;
  description?: string;
  goalType: GoalType;
  targetValue?: number;
  currentValue?: number;
  unit?: string;
  deadline?: Date;
  milestones?: Milestone[];
}

export interface GoalUpdate {
  title?: string;
  description?: string;
  currentValue?: number;
  deadline?: Date;
  status?: 'active' | 'completed' | 'abandoned';
  milestones?: Milestone[];
}

export interface GoalStats {
  total: number;
  active: number;
  completed: number;
  abandoned: number;
  byType: {
    type: GoalType;
    label: string;
    count: number;
    completionRate: number;
  }[];
  completionRate: number;
  averageDaysToComplete: number;
}

export interface GoalProgress {
  goal: any;
  progress: number;
  daysRemaining: number | null;
  daysElapsed: number;
  isOverdue: boolean;
  nextMilestone: Milestone | null;
  completedMilestones: number;
  totalMilestones: number;
}

/**
 * Get goals with filtering and pagination
 */
export async function getGoals(userId: string, filters: GoalFilters = {}) {
  const { status, goalType, limit = 50, offset = 0 } = filters;

  const where: any = { userId };

  if (status) {
    where.status = status;
  }

  if (goalType) {
    where.goalType = goalType;
  }

  const [goals, total] = await Promise.all([
    prisma.goal.findMany({
      where,
      orderBy: [{ status: 'asc' }, { deadline: 'asc' }, { createdAt: 'desc' }],
      take: limit,
      skip: offset,
    }),
    prisma.goal.count({ where }),
  ]);

  return {
    goals,
    total,
    hasMore: offset + goals.length < total,
  };
}

/**
 * Get single goal detail
 */
export async function getGoalDetail(goalId: string, userId: string) {
  const goal = await prisma.goal.findFirst({
    where: {
      id: goalId,
      userId,
    },
  });

  return goal;
}

/**
 * Create new goal
 */
export async function createGoal(userId: string, data: GoalCreate) {
  return await prisma.goal.create({
    data: {
      userId,
      title: data.title,
      description: data.description,
      goalType: data.goalType,
      targetValue: data.targetValue,
      currentValue: data.currentValue || 0,
      unit: data.unit,
      deadline: data.deadline,
      milestones: (data.milestones || []) as any,
      status: 'active',
    },
  });
}

/**
 * Update goal
 */
export async function updateGoal(
  goalId: string,
  userId: string,
  updates: GoalUpdate
) {
  const updateData: any = {};

  if (updates.title !== undefined) updateData.title = updates.title;
  if (updates.description !== undefined)
    updateData.description = updates.description;
  if (updates.currentValue !== undefined)
    updateData.currentValue = updates.currentValue;
  if (updates.deadline !== undefined) updateData.deadline = updates.deadline;
  if (updates.status !== undefined) updateData.status = updates.status;
  if (updates.milestones !== undefined)
    updateData.milestones = updates.milestones;

  // If completing the goal, set completedAt
  if (updates.status === 'completed') {
    updateData.completedAt = new Date();
  }

  return await prisma.goal.updateMany({
    where: {
      id: goalId,
      userId,
    },
    data: updateData,
  });
}

/**
 * Delete goal
 */
export async function deleteGoal(goalId: string, userId: string) {
  return await prisma.goal.deleteMany({
    where: {
      id: goalId,
      userId,
    },
  });
}

/**
 * Get goal statistics
 */
export async function getGoalStats(userId: string): Promise<GoalStats> {
  const goals = await prisma.goal.findMany({
    where: { userId },
  });

  if (goals.length === 0) {
    return {
      total: 0,
      active: 0,
      completed: 0,
      abandoned: 0,
      byType: [],
      completionRate: 0,
      averageDaysToComplete: 0,
    };
  }

  const active = goals.filter((g) => g.status === 'active').length;
  const completed = goals.filter((g) => g.status === 'completed').length;
  const abandoned = goals.filter((g) => g.status === 'abandoned').length;
  const completionRate =
    goals.length > 0 ? (completed / (completed + abandoned || 1)) * 100 : 0;

  // Calculate average days to complete
  const completedGoals = goals.filter(
    (g) => g.status === 'completed' && g.completedAt
  );
  const averageDaysToComplete =
    completedGoals.length > 0
      ? completedGoals.reduce((sum, goal) => {
          const days = Math.floor(
            (goal.completedAt!.getTime() - goal.createdAt.getTime()) /
              (1000 * 60 * 60 * 24)
          );
          return sum + days;
        }, 0) / completedGoals.length
      : 0;

  // Group by type
  const typeGroups = goals.reduce((acc, goal) => {
    if (!acc[goal.goalType]) {
      acc[goal.goalType] = [];
    }
    acc[goal.goalType].push(goal);
    return acc;
  }, {} as Record<string, typeof goals>);

  const byType = Object.entries(typeGroups).map(([type, typeGoals]) => {
    const typeCompleted = typeGoals.filter((g) => g.status === 'completed').length;
    const typeAbandoned = typeGoals.filter((g) => g.status === 'abandoned').length;
    const typeCompletionRate =
      typeCompleted + typeAbandoned > 0
        ? (typeCompleted / (typeCompleted + typeAbandoned)) * 100
        : 0;

    return {
      type: type as GoalType,
      label: GOAL_TYPE_LABELS[type as GoalType] || type,
      count: typeGoals.length,
      completionRate: typeCompletionRate,
    };
  });

  return {
    total: goals.length,
    active,
    completed,
    abandoned,
    byType,
    completionRate,
    averageDaysToComplete,
  };
}

/**
 * Get goal progress details
 */
export async function getGoalProgress(
  goalId: string,
  userId: string
): Promise<GoalProgress | null> {
  const goal = await prisma.goal.findFirst({
    where: {
      id: goalId,
      userId,
    },
  });

  if (!goal) {
    return null;
  }

  const currentValue = goal.currentValue || 0;
  const targetValue = goal.targetValue || 0;
  const progress =
    targetValue > 0 ? Math.min((currentValue / targetValue) * 100, 100) : 0;

  const now = new Date();
  const daysElapsed = Math.floor(
    (now.getTime() - goal.createdAt.getTime()) / (1000 * 60 * 60 * 24)
  );

  const daysRemaining = goal.deadline
    ? Math.floor(
        (goal.deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      )
    : null;

  const isOverdue = goal.deadline ? now > goal.deadline : false;

  // Process milestones
  const milestones = (goal.milestones as any as Milestone[]) || [];
  const completedMilestones = milestones.filter(
    (m) => currentValue >= m.value
  ).length;
  const nextMilestone =
    milestones.find((m) => currentValue < m.value) || null;

  return {
    goal,
    progress,
    daysRemaining,
    daysElapsed,
    isOverdue,
    nextMilestone,
    completedMilestones,
    totalMilestones: milestones.length,
  };
}

/**
 * Get active goals with progress
 */
export async function getActiveGoalsWithProgress(userId: string) {
  const goals = await prisma.goal.findMany({
    where: {
      userId,
      status: 'active',
    },
    orderBy: { deadline: 'asc' },
  });

  const goalsWithProgress = goals.map((goal) => {
    const currentValue = goal.currentValue || 0;
    const targetValue = goal.targetValue || 0;
    const progress =
      targetValue > 0 ? Math.min((currentValue / targetValue) * 100, 100) : 0;

    const now = new Date();
    const daysRemaining = goal.deadline
      ? Math.floor(
          (goal.deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        )
      : null;

    const isOverdue = goal.deadline ? now > goal.deadline : false;

    return {
      ...goal,
      progress,
      daysRemaining,
      isOverdue,
    };
  });

  return goalsWithProgress;
}

/**
 * Get completed goals
 */
export async function getCompletedGoals(userId: string, limit: number = 10) {
  return await prisma.goal.findMany({
    where: {
      userId,
      status: 'completed',
    },
    orderBy: { completedAt: 'desc' },
    take: limit,
  });
}

/**
 * Get goals by type
 */
export async function getGoalsByType(userId: string, goalType: GoalType) {
  return await prisma.goal.findMany({
    where: {
      userId,
      goalType,
    },
    orderBy: [{ status: 'asc' }, { deadline: 'asc' }],
  });
}

/**
 * Update goal progress
 */
export async function updateGoalProgress(
  goalId: string,
  userId: string,
  newValue: number
) {
  const goal = await prisma.goal.findFirst({
    where: {
      id: goalId,
      userId,
    },
  });

  if (!goal) {
    return null;
  }

  const updateData: any = {
    currentValue: newValue,
  };

  // Check if goal is completed
  if (goal.targetValue && newValue >= goal.targetValue) {
    updateData.status = 'completed';
    updateData.completedAt = new Date();
  }

  return await prisma.goal.updateMany({
    where: {
      id: goalId,
      userId,
    },
    data: updateData,
  });
}

/**
 * Add milestone to goal
 */
export async function addGoalMilestone(
  goalId: string,
  userId: string,
  milestone: Milestone
) {
  const goal = await prisma.goal.findFirst({
    where: {
      id: goalId,
      userId,
    },
  });

  if (!goal) {
    return null;
  }

  const existingMilestones = (goal.milestones as any as Milestone[]) || [];
  const newMilestones = [...existingMilestones, milestone].sort(
    (a, b) => a.value - b.value
  );

  return await prisma.goal.updateMany({
    where: {
      id: goalId,
      userId,
    },
    data: {
      milestones: newMilestones as any,
    },
  });
}

/**
 * Get upcoming deadlines
 */
export async function getUpcomingDeadlines(userId: string, days: number = 7) {
  const now = new Date();
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);

  return await prisma.goal.findMany({
    where: {
      userId,
      status: 'active',
      deadline: {
        gte: now,
        lte: futureDate,
      },
    },
    orderBy: { deadline: 'asc' },
  });
}

/**
 * Get overdue goals
 */
export async function getOverdueGoals(userId: string) {
  const now = new Date();

  return await prisma.goal.findMany({
    where: {
      userId,
      status: 'active',
      deadline: {
        lt: now,
      },
    },
    orderBy: { deadline: 'asc' },
  });
}

/**
 * Get goal suggestions based on user activity
 */
export async function getGoalSuggestions(userId: string) {
  // Get recent workout data to suggest strength goals
  const recentSessions = await prisma.workoutSession.findMany({
    where: { userId },
    orderBy: { date: 'desc' },
    take: 10,
    include: {
      sets: {
        include: {
          exercise: true,
        },
      },
    },
  });

  const suggestions = [];

  // Suggest strength goals based on recent exercises
  if (recentSessions.length > 0) {
    const exercises = recentSessions.flatMap((s) => s.sets.map((set) => set.exercise));
    const uniqueExercises = Array.from(
      new Map(exercises.map((e) => [e.id, e])).values()
    );

    if (uniqueExercises.length > 0) {
      const topExercise = uniqueExercises[0];
      suggestions.push({
        type: 'strength' as GoalType,
        title: `Increase ${topExercise.name} strength`,
        description: `Set a goal to progressively increase your ${topExercise.name} performance`,
        unit: 'lbs',
      });
    }
  }

  // Suggest habit goals
  suggestions.push({
    type: 'habit' as GoalType,
    title: 'Train 3 times per week',
    description: 'Build a consistent workout routine',
    unit: 'workouts',
  });

  // Suggest body composition goals
  const latestMetric = await prisma.bodyMetric.findFirst({
    where: { userId },
    orderBy: { date: 'desc' },
  });

  if (latestMetric && latestMetric.bodyFat) {
    suggestions.push({
      type: 'body_composition' as GoalType,
      title: 'Reduce body fat percentage',
      description: 'Track progress toward your target body composition',
      unit: '%',
    });
  }

  return suggestions;
}
