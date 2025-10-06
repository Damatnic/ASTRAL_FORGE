/**
 * Analytics Data Fetching Layer
 * Provides functions to fetch real analytics data from the database
 */

import { prisma } from '@/lib/prisma'

export interface VolumeDataPoint {
  week: string
  volume: number
  sets: number
}

export interface StrengthProgress {
  exercise: string
  current: number
  previous: number
  change: number
  trend: 'up' | 'down' | 'neutral'
}

export interface FrequencyData {
  day: string
  workouts: number
  avgDuration: number
}

export interface RPEDataPoint {
  week: string
  avgRPE: number
}

export interface MuscleGroupData {
  muscle: string
  sets: number
  volume: number
}

/**
 * Fetch volume progression data
 */
export async function getVolumeProgression(
  userId: string,
  timeRange: 'week' | 'month' | 'year' = 'month'
): Promise<VolumeDataPoint[]> {
  const now = new Date()
  const startDate = new Date()

  if (timeRange === 'week') {
    startDate.setDate(now.getDate() - 56) // 8 weeks
  } else if (timeRange === 'month') {
    startDate.setMonth(now.getMonth() - 2) // 2 months (8 weeks)
  } else {
    startDate.setFullYear(now.getFullYear() - 1)
  }

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
  const weeklyData = new Map<string, { volume: number; sets: number }>()

  sessions.forEach((session) => {
    const weekStart = new Date(session.date)
    weekStart.setDate(weekStart.getDate() - weekStart.getDay()) // Start of week
    const weekKey = `W${Math.floor((now.getTime() - weekStart.getTime()) / (7 * 24 * 60 * 60 * 1000))}`

    const weekData = weeklyData.get(weekKey) || { volume: 0, sets: 0 }

    session.sets.forEach((set) => {
      weekData.volume += set.weight * set.reps
      weekData.sets += 1
    })

    weeklyData.set(weekKey, weekData)
  })

  return Array.from(weeklyData.entries())
    .map(([week, data]) => ({
      week,
      volume: Math.round(data.volume),
      sets: data.sets,
    }))
    .slice(0, 8)
    .reverse()
}

/**
 * Fetch strength progression for main lifts
 */
export async function getStrengthProgression(
  userId: string,
  exercises: string[] = ['Squat', 'Bench Press', 'Deadlift', 'Overhead Press']
): Promise<StrengthProgress[]> {
  const results: StrengthProgress[] = []

  for (const exerciseName of exercises) {
    const exercise = await prisma.exercise.findFirst({
      where: { name: { contains: exerciseName, mode: 'insensitive' } },
    })

    if (!exercise) continue

    // Get last 2 months of data
    const twoMonthsAgo = new Date()
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2)

    const sets = await prisma.setEntry.findMany({
      where: {
        exerciseId: exercise.id,
        session: { userId, completed: true },
        completed: true,
        isWarmup: false,
        timestamp: { gte: twoMonthsAgo },
      },
      orderBy: { timestamp: 'desc' },
      take: 100,
    })

    if (sets.length === 0) continue

    // Calculate estimated 1RM using Epley formula: weight * (1 + reps/30)
    const calculate1RM = (weight: number, reps: number) =>
      Math.round(weight * (1 + reps / 30))

    const recent1RMs = sets
      .slice(0, 10)
      .map((set) => calculate1RM(set.weight, set.reps))
    const previous1RMs = sets
      .slice(10, 20)
      .map((set) => calculate1RM(set.weight, set.reps))

    const current = Math.max(...recent1RMs)
    const previous = previous1RMs.length > 0 ? Math.max(...previous1RMs) : current
    const change = current - previous

    results.push({
      exercise: exerciseName,
      current,
      previous,
      change,
      trend: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral',
    })
  }

  return results
}

/**
 * Fetch RPE trends over time
 */
export async function getRPETrends(
  userId: string,
  weeks: number = 8
): Promise<RPEDataPoint[]> {
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
        where: { completed: true, isWarmup: false, rpe: { not: null } },
      },
    },
    orderBy: { date: 'asc' },
  })

  // Group by week
  const weeklyRPE = new Map<number, number[]>()

  sessions.forEach((session) => {
    const weekNumber = Math.floor(
      (new Date().getTime() - session.date.getTime()) / (7 * 24 * 60 * 60 * 1000)
    )

    const rpeValues = weeklyRPE.get(weekNumber) || []
    session.sets.forEach((set) => {
      if (set.rpe) rpeValues.push(set.rpe)
    })
    weeklyRPE.set(weekNumber, rpeValues)
  })

  return Array.from(weeklyRPE.entries())
    .map(([weekNum, rpeValues]) => ({
      week: `W${weeks - weekNum}`,
      avgRPE:
        rpeValues.length > 0
          ? Math.round((rpeValues.reduce((a, b) => a + b, 0) / rpeValues.length) * 10) / 10
          : 0,
    }))
    .slice(0, weeks)
    .reverse()
}

/**
 * Fetch workout frequency by day of week
 */
export async function getFrequencyData(userId: string): Promise<FrequencyData[]> {
  const oneMonthAgo = new Date()
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)

  const sessions = await prisma.workoutSession.findMany({
    where: {
      userId,
      date: { gte: oneMonthAgo },
      completed: true,
    },
  })

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const dayData = new Map<number, { count: number; totalDuration: number }>()

  // Initialize all days
  for (let i = 0; i < 7; i++) {
    dayData.set(i, { count: 0, totalDuration: 0 })
  }

  sessions.forEach((session) => {
    const dayOfWeek = session.date.getDay()
    const data = dayData.get(dayOfWeek)!
    data.count += 1
    data.totalDuration += session.duration || 0
    dayData.set(dayOfWeek, data)
  })

  return Array.from(dayData.entries())
    .map(([day, data]) => ({
      day: dayNames[day],
      workouts: data.count,
      avgDuration: data.count > 0 ? Math.round(data.totalDuration / data.count) : 0,
    }))
    .slice(1) // Remove Sunday
    .concat([{ day: dayNames[0], workouts: dayData.get(0)!.count, avgDuration: dayData.get(0)!.count > 0 ? Math.round(dayData.get(0)!.totalDuration / dayData.get(0)!.count) : 0 }]) // Add Sunday at end
}

/**
 * Fetch muscle group volume distribution
 */
export async function getMuscleGroupData(userId: string): Promise<MuscleGroupData[]> {
  const oneMonthAgo = new Date()
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)

  const sessions = await prisma.workoutSession.findMany({
    where: {
      userId,
      date: { gte: oneMonthAgo },
      completed: true,
    },
    include: {
      sets: {
        where: { completed: true, isWarmup: false },
        include: { exercise: true },
      },
    },
  })

  const muscleData = new Map<string, { sets: number; volume: number }>()

  sessions.forEach((session) => {
    session.sets.forEach((set) => {
      const muscle = set.exercise.muscleGroup
      const data = muscleData.get(muscle) || { sets: 0, volume: 0 }
      data.sets += 1
      data.volume += set.weight * set.reps
      muscleData.set(muscle, data)
    })
  })

  return Array.from(muscleData.entries())
    .map(([muscle, data]) => ({
      muscle: muscle.charAt(0).toUpperCase() + muscle.slice(1),
      sets: data.sets,
      volume: Math.round(data.volume),
    }))
    .sort((a, b) => b.volume - a.volume)
}

/**
 * Fetch key metrics summary
 */
export async function getKeyMetrics(
  userId: string,
  timeRange: 'week' | 'month' | 'year' = 'month'
) {
  const now = new Date()
  const startDate = new Date()
  const compareStartDate = new Date()

  if (timeRange === 'week') {
    startDate.setDate(now.getDate() - 7)
    compareStartDate.setDate(now.getDate() - 14)
  } else if (timeRange === 'month') {
    startDate.setMonth(now.getMonth() - 1)
    compareStartDate.setMonth(now.getMonth() - 2)
  } else {
    startDate.setFullYear(now.getFullYear() - 1)
    compareStartDate.setFullYear(now.getFullYear() - 2)
  }

  // Current period
  const currentSessions = await prisma.workoutSession.findMany({
    where: {
      userId,
      date: { gte: startDate, lte: now },
      completed: true,
    },
    include: {
      sets: { where: { completed: true, isWarmup: false } },
    },
  })

  // Previous period
  const previousSessions = await prisma.workoutSession.findMany({
    where: {
      userId,
      date: { gte: compareStartDate, lt: startDate },
      completed: true,
    },
    include: {
      sets: { where: { completed: true, isWarmup: false } },
    },
  })

  const currentVolume = currentSessions.reduce(
    (sum, s) => sum + s.sets.reduce((v, set) => v + set.weight * set.reps, 0),
    0
  )
  const previousVolume = previousSessions.reduce(
    (sum, s) => sum + s.sets.reduce((v, set) => v + set.weight * set.reps, 0),
    0
  )

  const volumeChange = previousVolume > 0 ? ((currentVolume - previousVolume) / previousVolume) * 100 : 0

  const currentAvgRPE =
    currentSessions.reduce((sum, s) => {
      const rpeValues = s.sets.filter((set) => set.rpe).map((set) => set.rpe!)
      return sum + (rpeValues.length > 0 ? rpeValues.reduce((a, b) => a + b, 0) / rpeValues.length : 0)
    }, 0) / (currentSessions.length || 1)

  const previousAvgRPE =
    previousSessions.reduce((sum, s) => {
      const rpeValues = s.sets.filter((set) => set.rpe).map((set) => set.rpe!)
      return sum + (rpeValues.length > 0 ? rpeValues.reduce((a, b) => a + b, 0) / rpeValues.length : 0)
    }, 0) / (previousSessions.length || 1)

  const rpeChange = currentAvgRPE - previousAvgRPE

  return {
    totalVolume: Math.round(currentVolume),
    volumeChange: Math.round(volumeChange * 10) / 10,
    avgStrengthGain: 0, // Calculated separately
    workoutFrequency: currentSessions.length,
    avgRPE: Math.round(currentAvgRPE * 10) / 10,
    rpeChange: Math.round(rpeChange * 10) / 10,
  }
}

/**
 * Fetch recovery metrics
 */
export async function getRecoveryMetrics(userId: string) {
  const oneMonthAgo = new Date()
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)

  const sessions = await prisma.workoutSession.findMany({
    where: {
      userId,
      date: { gte: oneMonthAgo },
      completed: true,
    },
    include: {
      sets: { where: { completed: true } },
    },
    orderBy: { date: 'asc' },
  })

  // Calculate average rest between sets (from session duration and set count)
  const avgRestSeconds =
    sessions.reduce((sum, s) => {
      const duration = s.duration || 0
      const setCount = s.sets.length
      if (setCount > 1) {
        // Estimate ~45 seconds per set for actual work, rest is remainder
        const workTime = setCount * 0.75
        const restTime = duration - workTime
        return sum + restTime / (setCount - 1)
      }
      return sum
    }, 0) / (sessions.length || 1)

  // Calculate rest days per week
  const daysInPeriod = 30
  const workoutDays = sessions.length
  const restDays = daysInPeriod - workoutDays
  const restDaysPerWeek = (restDays / daysInPeriod) * 7

  // Get latest fatigue metric
  const latestFatigue = await prisma.fatigueMetric.findFirst({
    where: { userId },
    orderBy: { date: 'desc' },
  })

  // Calculate recovery score based on acute:chronic ratio
  const recoveryScore = latestFatigue?.acuteChronic
    ? Math.min(100, Math.max(0, 100 - Math.abs((latestFatigue.acuteChronic - 1.0) * 100)))
    : 75

  // Determine training stress
  const avgRPE =
    sessions.reduce((sum, s) => {
      const rpes = s.sets.filter((set) => set.rpe).map((set) => set.rpe!)
      return sum + (rpes.length > 0 ? rpes.reduce((a, b) => a + b, 0) / rpes.length : 0)
    }, 0) / (sessions.length || 1)

  const trainingStress = avgRPE > 8.5 ? 'High' : avgRPE > 7.5 ? 'Moderate' : 'Low'

  return {
    avgRestBetweenSets: Math.round(avgRestSeconds),
    restDaysPerWeek: Math.round(restDaysPerWeek * 10) / 10,
    recoveryScore: Math.round(recoveryScore),
    trainingStress,
  }
}

/**
 * Fetch recent personal records
 */
export async function getRecentPRs(userId: string, limit: number = 4) {
  const oneMonthAgo = new Date()
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)

  const achievements = await prisma.achievement.findMany({
    where: {
      userId,
      type: 'pr',
      earnedAt: { gte: oneMonthAgo },
    },
    orderBy: { earnedAt: 'desc' },
    take: limit,
  })

  return achievements.map((achievement) => {
    const metadata = achievement.metadata as any
    return {
      exercise: achievement.title,
      type: metadata?.prType || 'Max Weight',
      value: metadata?.value || achievement.description,
      date: achievement.earnedAt,
      icon: metadata?.icon || '💪',
    }
  })
}
