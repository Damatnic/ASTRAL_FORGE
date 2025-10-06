/**
 * Training Metrics System
 * 
 * Replaces RPG stats with real, actionable fitness metrics
 * based on actual workout performance and consistency.
 */

import { PrismaClient, WorkoutSession, SetEntry, Exercise } from '@prisma/client'

type SessionWithSets = WorkoutSession & {
  sets: (SetEntry & { exercise: Exercise | null })[]
}

type SetWithExercise = SetEntry & {
  exercise: Exercise | null
}

type SessionBasic = Pick<WorkoutSession, 'id' | 'date' | 'duration'>

export interface TrainingMetrics {
  // Core Performance Metrics
  totalVolume: VolumeMetric
  estimated1RMs: OneRepMaxMetrics
  consistency: ConsistencyMetric
  recovery: RecoveryMetric
  progressionRate: ProgressionMetric
  
  // Summary
  summary: MetricsSummary
}

export interface VolumeMetric {
  weeklyTotal: number // kg × reps this week
  monthlyTotal: number // kg × reps this month
  weeklyAverage: number // Average over last 4 weeks
  trend: 'increasing' | 'stable' | 'decreasing'
  percentChange: number // % change from previous period
  breakdown: {
    push: number
    pull: number
    legs: number
    accessories: number
  }
}

export interface OneRepMaxMetrics {
  benchPress: number | null
  squat: number | null
  deadlift: number | null
  overheadPress: number | null
  total: number // Sum of big 3
  wilksScore: number | null // Strength relative to bodyweight
  lastUpdated: Date | null
  trends: {
    benchPress: number // % change last 30 days
    squat: number
    deadlift: number
  }
}

export interface ConsistencyMetric {
  currentStreak: number // Days
  longestStreak: number // Days
  weeklyRate: number // % of planned workouts (0-100)
  monthlyRate: number // % of planned workouts (0-100)
  totalWorkouts: number
  averageSessionDuration: number // Minutes
  missedWorkouts: number // Last 30 days
}

export interface RecoveryMetric {
  score: number // 0-100 (calculated from rest patterns)
  averageRestBetweenSessions: number // Hours
  adequateRecovery: boolean // Based on volume and frequency
  recommendedRestDays: number // Per week
  overtrainingRisk: 'low' | 'moderate' | 'high'
}

export interface ProgressionMetric {
  volumeGrowthRate: number // % per month
  strengthGrowthRate: number // % per month (based on 1RMs)
  consistencyImprovement: number // % change in consistency
  timeToNextMilestone: string // "2 weeks to 100kg bench"
  onTrack: boolean // Meeting progressive overload targets
}

export interface MetricsSummary {
  overallScore: number // 0-100
  strengths: string[] // Top 3 metrics
  improvements: string[] // Areas needing work
  weeklyGoalProgress: number // % (0-100)
  monthlyGoalProgress: number // % (0-100)
}

export class TrainingMetricsSystem {
  /**
   * Calculate all training metrics for a user
   */
  static async calculateMetrics(
    prisma: PrismaClient,
    userId: string,
    bodyweight: number = 80, // Default 80kg
    plannedWorkoutsPerWeek: number = 4
  ): Promise<TrainingMetrics> {
    const now = new Date()
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const twoMonthsAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)

    // Fetch workout data
    const [recentSessions, allSessions, recentSets, allSets] = await Promise.all([
      // Last 30 days
      prisma.workoutSession.findMany({
        where: {
          userId,
          date: { gte: oneMonthAgo },
        },
        orderBy: { date: 'desc' },
        include: {
          sets: {
            include: {
              exercise: true,
            },
          },
        },
      }),
      // All sessions (for streak calculation)
      prisma.workoutSession.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
        select: {
          id: true,
          date: true,
          duration: true,
        },
      }),
      // Last 30 days sets
      prisma.setEntry.findMany({
        where: {
          session: {
            userId,
            date: { gte: oneMonthAgo },
          },
        },
        include: {
          exercise: true,
        },
      }),
      // Last 60 days sets (for trends)
      prisma.setEntry.findMany({
        where: {
          session: {
            userId,
            date: { gte: twoMonthsAgo },
          },
        },
        include: {
          exercise: true,
        },
      }),
    ])

    // Calculate each metric
    const totalVolume = this.calculateVolume(recentSessions, recentSets, allSets, oneWeekAgo, oneMonthAgo)
    const estimated1RMs = this.calculate1RMs(allSets, bodyweight, oneMonthAgo)
    const consistency = this.calculateConsistency(allSessions, plannedWorkoutsPerWeek, oneMonthAgo)
    const recovery = this.calculateRecovery(allSessions, totalVolume.weeklyTotal, plannedWorkoutsPerWeek)
    const progressionRate = this.calculateProgression(totalVolume, estimated1RMs, consistency)

    // Generate summary
    const summary = this.generateSummary(
      totalVolume,
      estimated1RMs,
      consistency,
      recovery,
      progressionRate
    )

    return {
      totalVolume,
      estimated1RMs,
      consistency,
      recovery,
      progressionRate,
      summary,
    }
  }

  /**
   * Calculate total volume metrics
   */
  private static calculateVolume(
    sessions: SessionWithSets[],
    recentSets: SetWithExercise[],
    allSets: SetWithExercise[],
    oneWeekAgo: Date,
    oneMonthAgo: Date
  ): VolumeMetric {
    // This week's volume
    const thisWeekSets = recentSets.filter(s => new Date(s.timestamp) >= oneWeekAgo)
    const weeklyTotal = thisWeekSets.reduce((sum, set) => {
      return sum + (set.weight || 0) * (set.reps || 0)
    }, 0)

    // This month's volume
    const monthlyTotal = recentSets.reduce((sum, set) => {
      return sum + (set.weight || 0) * (set.reps || 0)
    }, 0)

    // Last month's volume (for comparison)
    const twoMonthsAgo = new Date(oneMonthAgo.getTime() - 30 * 24 * 60 * 60 * 1000)
    const lastMonthSets = allSets.filter(s => {
      const date = new Date(s.timestamp)
      return date >= twoMonthsAgo && date < oneMonthAgo
    })
    const lastMonthTotal = lastMonthSets.reduce((sum, set) => {
      return sum + (set.weight || 0) * (set.reps || 0)
    }, 0)

    // Weekly average (last 4 weeks)
    const weeklyAverage = monthlyTotal / 4

    // Trend
    const percentChange = lastMonthTotal > 0
      ? ((monthlyTotal - lastMonthTotal) / lastMonthTotal) * 100
      : 0
    
    let trend: 'increasing' | 'stable' | 'decreasing' = 'stable'
    if (percentChange > 5) trend = 'increasing'
    else if (percentChange < -5) trend = 'decreasing'

    // Breakdown by movement pattern
    const breakdown = {
      push: 0,
      pull: 0,
      legs: 0,
      accessories: 0,
    }

    recentSets.forEach(set => {
      const name = (set.exercise?.name || '').toLowerCase()
      const volume = (set.weight || 0) * (set.reps || 0)

      if (name.includes('bench') || name.includes('press') || name.includes('dip') || name.includes('fly')) {
        breakdown.push += volume
      } else if (name.includes('row') || name.includes('pull') || name.includes('chin') || name.includes('curl')) {
        breakdown.pull += volume
      } else if (name.includes('squat') || name.includes('deadlift') || name.includes('lunge') || name.includes('leg')) {
        breakdown.legs += volume
      } else {
        breakdown.accessories += volume
      }
    })

    return {
      weeklyTotal: Math.round(weeklyTotal),
      monthlyTotal: Math.round(monthlyTotal),
      weeklyAverage: Math.round(weeklyAverage),
      trend,
      percentChange: Math.round(percentChange * 10) / 10,
      breakdown: {
        push: Math.round(breakdown.push),
        pull: Math.round(breakdown.pull),
        legs: Math.round(breakdown.legs),
        accessories: Math.round(breakdown.accessories),
      },
    }
  }

  /**
   * Calculate estimated 1RMs using Epley formula
   */
  private static calculate1RMs(
    sets: SetWithExercise[],
    bodyweight: number,
    oneMonthAgo: Date
  ): OneRepMaxMetrics {
    const exercises = {
      benchPress: ['bench press', 'bench'],
      squat: ['squat'],
      deadlift: ['deadlift'],
      overheadPress: ['overhead press', 'military press', 'shoulder press'],
    }

    const calculate1RM = (weight: number, reps: number): number => {
      if (reps === 1) return weight
      // Epley formula: 1RM = weight × (1 + reps/30)
      return weight * (1 + reps / 30)
    }

    const get1RM = (exerciseNames: string[]): number | null => {
      const relevantSets = sets.filter(s => {
        const name = (s.exercise?.name || '').toLowerCase()
        return exerciseNames.some(ex => name.includes(ex))
      })

      if (relevantSets.length === 0) return null

      // Get max estimated 1RM
      const estimated1RMs = relevantSets
        .filter(s => s.weight && s.reps && s.reps <= 12) // Only count working sets
        .map(s => calculate1RM(s.weight, s.reps))

      return estimated1RMs.length > 0 ? Math.max(...estimated1RMs) : null
    }

    const benchPress = get1RM(exercises.benchPress)
    const squat = get1RM(exercises.squat)
    const deadlift = get1RM(exercises.deadlift)
    const overheadPress = get1RM(exercises.overheadPress)

    const total = (benchPress || 0) + (squat || 0) + (deadlift || 0)

    // Calculate Wilks score (simplified)
    const wilksScore = bodyweight > 0 ? Math.round((total / bodyweight) * 100) / 100 : null

    // Calculate trends (last 30 days vs previous 30 days)
    const lastMonthSets = sets.filter(s => new Date(s.timestamp) < oneMonthAgo)
    
    const getOld1RM = (exerciseNames: string[]): number | null => {
      const relevantSets = lastMonthSets.filter(s => {
        const name = (s.exercise?.name || '').toLowerCase()
        return exerciseNames.some(ex => name.includes(ex))
      })
      if (relevantSets.length === 0) return null
      const estimated1RMs = relevantSets
        .filter(s => s.weight && s.reps && s.reps <= 12)
        .map(s => calculate1RM(s.weight, s.reps))
      return estimated1RMs.length > 0 ? Math.max(...estimated1RMs) : null
    }

    const oldBench = getOld1RM(exercises.benchPress)
    const oldSquat = getOld1RM(exercises.squat)
    const oldDeadlift = getOld1RM(exercises.deadlift)

    const trends = {
      benchPress: benchPress && oldBench ? Math.round(((benchPress - oldBench) / oldBench) * 1000) / 10 : 0,
      squat: squat && oldSquat ? Math.round(((squat - oldSquat) / oldSquat) * 1000) / 10 : 0,
      deadlift: deadlift && oldDeadlift ? Math.round(((deadlift - oldDeadlift) / oldDeadlift) * 1000) / 10 : 0,
    }

    return {
      benchPress: benchPress ? Math.round(benchPress * 10) / 10 : null,
      squat: squat ? Math.round(squat * 10) / 10 : null,
      deadlift: deadlift ? Math.round(deadlift * 10) / 10 : null,
      overheadPress: overheadPress ? Math.round(overheadPress * 10) / 10 : null,
      total: Math.round(total * 10) / 10,
      wilksScore,
      lastUpdated: sets.length > 0 ? new Date() : null,
      trends,
    }
  }

  /**
   * Calculate consistency metrics
   */
  private static calculateConsistency(
    sessions: SessionBasic[],
    plannedPerWeek: number,
    oneMonthAgo: Date
  ): ConsistencyMetric {
    // Current streak
    let currentStreak = 0
    const sortedSessions = [...sessions].sort((a, b) => b.date.getTime() - a.date.getTime())
    
    for (let i = 0; i < sortedSessions.length; i++) {
      const sessionDate = new Date(sortedSessions[i].date)
      const daysDiff = i === 0 
        ? Math.floor((new Date().getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24))
        : Math.floor((new Date(sortedSessions[i - 1].date).getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24))
      
      if (daysDiff <= 2) { // Allow 1 rest day
        currentStreak++
      } else {
        break
      }
    }

    // Longest streak (simplified - just use current for now)
    const longestStreak = currentStreak

    // Recent sessions
    const recentSessions = sessions.filter(s => new Date(s.date) >= oneMonthAgo)
    
    // Weekly rate (last 4 weeks)
    const weeksInMonth = 4
    const expectedWeekly = plannedPerWeek * weeksInMonth
    const weeklyRate = expectedWeekly > 0 ? Math.min(100, (recentSessions.length / expectedWeekly) * 100) : 0

    // Monthly rate
    const monthlyRate = weeklyRate

    // Average duration
    const totalDuration = recentSessions.reduce((sum, s) => sum + (s.duration || 0), 0)
    const averageSessionDuration = recentSessions.length > 0 
      ? Math.round(totalDuration / recentSessions.length)
      : 0

    // Missed workouts (expected - actual in last 30 days)
    const expectedMonthly = plannedPerWeek * 4
    const missedWorkouts = Math.max(0, expectedMonthly - recentSessions.length)

    return {
      currentStreak,
      longestStreak,
      weeklyRate: Math.round(weeklyRate),
      monthlyRate: Math.round(monthlyRate),
      totalWorkouts: sessions.length,
      averageSessionDuration,
      missedWorkouts,
    }
  }

  /**
   * Calculate recovery metrics
   */
  private static calculateRecovery(
    sessions: SessionBasic[],
    weeklyVolume: number,
    plannedPerWeek: number
  ): RecoveryMetric {
    // Calculate average rest between sessions
    let totalRestHours = 0
    let restPeriods = 0

    for (let i = 1; i < sessions.length && i < 10; i++) {
      const current = new Date(sessions[i - 1].date)
      const previous = new Date(sessions[i].date)
      const hoursRest = (current.getTime() - previous.getTime()) / (1000 * 60 * 60)
      totalRestHours += hoursRest
      restPeriods++
    }

    const averageRestBetweenSessions = restPeriods > 0 
      ? Math.round(totalRestHours / restPeriods)
      : 48

    // Determine if recovery is adequate
    const minRestHours = 24
    const adequateRecovery = averageRestBetweenSessions >= minRestHours

    // Recommended rest days based on volume
    const volumePerSession = sessions.length > 0 ? weeklyVolume / sessions.length : 0
    let recommendedRestDays = 2
    if (volumePerSession > 20000) recommendedRestDays = 3
    if (volumePerSession < 10000) recommendedRestDays = 1

    // Overtraining risk
    let overtrainingRisk: 'low' | 'moderate' | 'high' = 'low'
    if (!adequateRecovery && plannedPerWeek > 5) overtrainingRisk = 'high'
    else if (!adequateRecovery || plannedPerWeek > 6) overtrainingRisk = 'moderate'

    // Recovery score (0-100)
    let score = 100
    if (!adequateRecovery) score -= 30
    if (overtrainingRisk === 'high') score -= 40
    else if (overtrainingRisk === 'moderate') score -= 20

    return {
      score: Math.max(0, score),
      averageRestBetweenSessions,
      adequateRecovery,
      recommendedRestDays,
      overtrainingRisk,
    }
  }

  /**
   * Calculate progression metrics
   */
  private static calculateProgression(
    volume: VolumeMetric,
    oneRMs: OneRepMaxMetrics,
    consistency: ConsistencyMetric
  ): ProgressionMetric {
    const volumeGrowthRate = volume.percentChange

    // Strength growth (average of big 3 trends)
    const strengthTrends = [
      oneRMs.trends.benchPress,
      oneRMs.trends.squat,
      oneRMs.trends.deadlift,
    ].filter(t => t !== 0)
    const strengthGrowthRate = strengthTrends.length > 0
      ? strengthTrends.reduce((sum, t) => sum + t, 0) / strengthTrends.length
      : 0

    // Consistency improvement (simplified)
    const consistencyImprovement = consistency.weeklyRate - 75 // Compare to 75% baseline

    // On track for progressive overload?
    const onTrack = volumeGrowthRate > 0 || strengthGrowthRate > 0

    // Time to next milestone (placeholder)
    const timeToNextMilestone = "Track workouts for estimates"

    return {
      volumeGrowthRate: Math.round(volumeGrowthRate * 10) / 10,
      strengthGrowthRate: Math.round(strengthGrowthRate * 10) / 10,
      consistencyImprovement: Math.round(consistencyImprovement),
      timeToNextMilestone,
      onTrack,
    }
  }

  /**
   * Generate metrics summary
   */
  private static generateSummary(
    volume: VolumeMetric,
    oneRMs: OneRepMaxMetrics,
    consistency: ConsistencyMetric,
    recovery: RecoveryMetric,
    progression: ProgressionMetric
  ): MetricsSummary {
    const scores = {
      volume: volume.trend === 'increasing' ? 90 : volume.trend === 'stable' ? 70 : 50,
      strength: oneRMs.total > 0 ? 85 : 50,
      consistency: consistency.weeklyRate,
      recovery: recovery.score,
      progression: progression.onTrack ? 80 : 60,
    }

    const overallScore = Math.round(
      (scores.volume + scores.strength + scores.consistency + scores.recovery + scores.progression) / 5
    )

    // Identify strengths (top 3 metrics)
    const strengths: string[] = []
    if (consistency.weeklyRate >= 85) strengths.push('Excellent consistency')
    if (volume.trend === 'increasing') strengths.push('Volume trending up')
    if (recovery.score >= 80) strengths.push('Good recovery')
    if (progression.onTrack) strengths.push('Progressive overload maintained')
    if (consistency.currentStreak >= 7) strengths.push(`${consistency.currentStreak}-day streak`)

    // Identify improvements needed
    const improvements: string[] = []
    if (consistency.weeklyRate < 70) improvements.push('Improve workout consistency')
    if (volume.trend === 'decreasing') improvements.push('Increase training volume')
    if (recovery.score < 60) improvements.push('Focus on recovery')
    if (!progression.onTrack) improvements.push('Restart progressive overload')
    if (consistency.missedWorkouts > 4) improvements.push('Reduce missed sessions')

    return {
      overallScore,
      strengths: strengths.slice(0, 3),
      improvements: improvements.slice(0, 3),
      weeklyGoalProgress: consistency.weeklyRate,
      monthlyGoalProgress: consistency.monthlyRate,
    }
  }
}
