/**
 * Workout History Data Fetching Layer
 * Provides functions to fetch workout session history from the database
 */

import { prisma } from '@/lib/prisma'

export interface WorkoutHistorySummary {
  id: string
  date: Date
  name: string | null
  duration: number | null
  completed: boolean
  exerciseCount: number
  totalSets: number
  totalVolume: number
  avgRPE: number | null
  hasPRs: boolean
}

export interface WorkoutHistoryDetail extends WorkoutHistorySummary {
  notes: string | null
  exercises: WorkoutExercise[]
  personalRecords: PersonalRecord[]
}

export interface WorkoutExercise {
  exerciseId: string
  exerciseName: string
  sets: WorkoutSet[]
}

export interface WorkoutSet {
  id: string
  setNumber: number
  weight: number
  reps: number
  rpe: number | null
  isFailure: boolean
  notes: string | null
}

export interface PersonalRecord {
  exerciseName: string
  type: 'max_weight' | 'max_reps' | 'max_volume' | 'estimated_1rm'
  value: number
  previousValue: number
}

export interface WeeklyStats {
  weekStart: Date
  workouts: number
  totalDuration: number
  totalVolume: number
  avgRPE: number
  streak: number
}

/**
 * Fetch workout history with pagination
 */
export async function getWorkoutHistory(
  userId: string,
  options: {
    limit?: number
    offset?: number
    programId?: string
    startDate?: Date
    endDate?: Date
  } = {}
): Promise<{ workouts: WorkoutHistorySummary[]; total: number }> {
  const { limit = 20, offset = 0, programId, startDate, endDate } = options

  const where: any = {
    userId,
    completed: true,
  }

  if (startDate || endDate) {
    where.date = {}
    if (startDate) where.date.gte = startDate
    if (endDate) where.date.lte = endDate
  }

  const [workouts, total] = await Promise.all([
    prisma.workoutSession.findMany({
      where,
      include: {
        sets: {
          where: { completed: true },
          include: {
            exercise: {
              select: { name: true },
            },
          },
        },
      },
      orderBy: { date: 'desc' },
      skip: offset,
      take: limit,
    }),
    prisma.workoutSession.count({ where }),
  ])

  const workoutSummaries: WorkoutHistorySummary[] = []

  for (const workout of workouts) {
    const exerciseIds = [...new Set(workout.sets.map((s) => s.exerciseId))]
    const totalVolume = workout.sets.reduce((sum, set) => sum + set.weight * set.reps, 0)
    const rpeValues = workout.sets.filter((s) => s.rpe).map((s) => s.rpe!)
    const avgRPE = rpeValues.length > 0 ? rpeValues.reduce((a, b) => a + b, 0) / rpeValues.length : null

    // Check for PRs
    const hasPRs = await checkForPRs(userId, workout.id)

    workoutSummaries.push({
      id: workout.id,
      date: workout.date,
      name: workout.name,
      duration: workout.duration,
      completed: workout.completed,
      exerciseCount: exerciseIds.length,
      totalSets: workout.sets.length,
      totalVolume: Math.round(totalVolume),
      avgRPE: avgRPE ? Math.round(avgRPE * 10) / 10 : null,
      hasPRs,
    })
  }

  return { workouts: workoutSummaries, total }
}

/**
 * Fetch detailed workout information
 */
export async function getWorkoutDetail(
  workoutId: string,
  userId: string
): Promise<WorkoutHistoryDetail | null> {
  const workout = await prisma.workoutSession.findFirst({
    where: {
      id: workoutId,
      userId,
    },
    include: {
      sets: {
        where: { completed: true },
        include: {
          exercise: {
            select: { id: true, name: true },
          },
        },
        orderBy: [
          { exerciseId: 'asc' },
          { setNumber: 'asc' },
        ],
      },
      workoutNotes: true,
    },
  })

  if (!workout) return null

  // Group sets by exercise
  const exerciseMap = new Map<string, WorkoutExercise>()

  workout.sets.forEach((set) => {
    if (!exerciseMap.has(set.exerciseId)) {
      exerciseMap.set(set.exerciseId, {
        exerciseId: set.exerciseId,
        exerciseName: set.exercise.name,
        sets: [],
      })
    }

    exerciseMap.get(set.exerciseId)!.sets.push({
      id: set.id,
      setNumber: set.setNumber,
      weight: set.weight,
      reps: set.reps,
      rpe: set.rpe,
      isFailure: set.isFailure,
      notes: set.notes,
    })
  })

  // Calculate PRs
  const personalRecords = await calculatePRs(userId, workout.id, workout.sets)

  const totalVolume = workout.sets.reduce((sum, set) => sum + set.weight * set.reps, 0)
  const rpeValues = workout.sets.filter((s) => s.rpe).map((s) => s.rpe!)
  const avgRPE = rpeValues.length > 0 ? rpeValues.reduce((a, b) => a + b, 0) / rpeValues.length : null

  return {
    id: workout.id,
    date: workout.date,
    name: workout.name,
    duration: workout.duration,
    completed: workout.completed,
    notes: workout.workoutNotes[0]?.content || null,
    exerciseCount: exerciseMap.size,
    totalSets: workout.sets.length,
    totalVolume: Math.round(totalVolume),
    avgRPE: avgRPE ? Math.round(avgRPE * 10) / 10 : null,
    hasPRs: personalRecords.length > 0,
    exercises: Array.from(exerciseMap.values()),
    personalRecords,
  }
}

/**
 * Get weekly statistics
 */
export async function getWeeklyStats(userId: string, weeks: number = 4): Promise<WeeklyStats[]> {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - weeks * 7)

  const sessions = await prisma.workoutSession.findMany({
    where: {
      userId,
      date: { gte: startDate },
      completed: true,
    },
    include: {
      sets: {
        where: { completed: true, isWarmup: false },
      },
    },
    orderBy: { date: 'asc' },
  })

  // Group by week
  const weeklyData = new Map<string, {
    weekStart: Date
    workouts: number
    totalDuration: number
    totalVolume: number
    rpeSum: number
    rpeCount: number
  }>()

  sessions.forEach((session) => {
    const date = new Date(session.date)
    const weekStart = new Date(date)
    weekStart.setDate(date.getDate() - date.getDay()) // Start of week (Sunday)
    const weekKey = weekStart.toISOString().split('T')[0]

    const data = weeklyData.get(weekKey) || {
      weekStart,
      workouts: 0,
      totalDuration: 0,
      totalVolume: 0,
      rpeSum: 0,
      rpeCount: 0,
    }

    data.workouts += 1
    data.totalDuration += session.duration || 0
    data.totalVolume += session.sets.reduce((sum, set) => sum + set.weight * set.reps, 0)

    session.sets.forEach((set) => {
      if (set.rpe) {
        data.rpeSum += set.rpe
        data.rpeCount += 1
      }
    })

    weeklyData.set(weekKey, data)
  })

  // Calculate streak
  const streak = await prisma.streak.findUnique({
    where: { userId },
  })

  return Array.from(weeklyData.values()).map((data) => ({
    weekStart: data.weekStart,
    workouts: data.workouts,
    totalDuration: data.totalDuration,
    totalVolume: Math.round(data.totalVolume),
    avgRPE: data.rpeCount > 0 ? Math.round((data.rpeSum / data.rpeCount) * 10) / 10 : 0,
    streak: streak?.current || 0,
  }))
}

/**
 * Get monthly summary
 */
export async function getMonthlySummary(userId: string, month: Date) {
  const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1)
  const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0)

  const sessions = await prisma.workoutSession.findMany({
    where: {
      userId,
      date: { gte: startOfMonth, lte: endOfMonth },
      completed: true,
    },
    include: {
      sets: {
        where: { completed: true, isWarmup: false },
      },
    },
  })

  const totalWorkouts = sessions.length
  const totalSets = sessions.reduce((sum, s) => sum + s.sets.length, 0)
  const totalVolume = sessions.reduce(
    (sum, s) => sum + s.sets.reduce((v, set) => v + set.weight * set.reps, 0),
    0
  )
  const totalDuration = sessions.reduce((sum, s) => sum + (s.duration || 0), 0)

  // Count PRs
  const achievements = await prisma.achievement.findMany({
    where: {
      userId,
      type: 'pr',
      earnedAt: { gte: startOfMonth, lte: endOfMonth },
    },
  })

  return {
    totalWorkouts,
    totalSets,
    totalVolume: Math.round(totalVolume),
    totalDuration,
    avgWorkoutDuration: totalWorkouts > 0 ? Math.round(totalDuration / totalWorkouts) : 0,
    personalRecords: achievements.length,
  }
}

// Helper functions
async function checkForPRs(userId: string, sessionId: string): Promise<boolean> {
  const achievements = await prisma.achievement.findFirst({
    where: {
      userId,
      type: 'pr',
      metadata: {
        path: ['sessionId'],
        equals: sessionId,
      },
    },
  })

  return achievements !== null
}

async function calculatePRs(
  userId: string,
  sessionId: string,
  sets: any[]
): Promise<PersonalRecord[]> {
  const prs: PersonalRecord[] = []

  // Group by exercise
  const exerciseGroups = new Map<string, any[]>()
  sets.forEach((set) => {
    const group = exerciseGroups.get(set.exerciseId) || []
    group.push(set)
    exerciseGroups.set(set.exerciseId, group)
  })

  for (const [exerciseId, exerciseSets] of exerciseGroups) {
    const exercise = await prisma.exercise.findUnique({
      where: { id: exerciseId },
    })

    if (!exercise) continue

    // Get all previous sets for this exercise
    const previousSets = await prisma.setEntry.findMany({
      where: {
        exerciseId,
        session: {
          userId,
          completed: true,
          date: { lt: sets[0].timestamp },
        },
        completed: true,
        isWarmup: false,
      },
    })

    // Check max weight PR
    const currentMaxWeight = Math.max(...exerciseSets.map((s) => s.weight))
    const previousMaxWeight = previousSets.length > 0 ? Math.max(...previousSets.map((s) => s.weight)) : 0

    if (currentMaxWeight > previousMaxWeight) {
      prs.push({
        exerciseName: exercise.name,
        type: 'max_weight',
        value: currentMaxWeight,
        previousValue: previousMaxWeight,
      })
    }

    // Check max reps PR
    const currentMaxReps = Math.max(...exerciseSets.map((s) => s.reps))
    const previousMaxReps = previousSets.length > 0 ? Math.max(...previousSets.map((s) => s.reps)) : 0

    if (currentMaxReps > previousMaxReps) {
      prs.push({
        exerciseName: exercise.name,
        type: 'max_reps',
        value: currentMaxReps,
        previousValue: previousMaxReps,
      })
    }

    // Check volume PR
    const currentVolume = exerciseSets.reduce((sum, s) => sum + s.weight * s.reps, 0)
    const previousVolume = previousSets.length > 0 
      ? Math.max(...previousSets.map((s) => s.weight * s.reps))
      : 0

    if (currentVolume > previousVolume) {
      prs.push({
        exerciseName: exercise.name,
        type: 'max_volume',
        value: currentVolume,
        previousValue: previousVolume,
      })
    }
  }

  return prs
}
