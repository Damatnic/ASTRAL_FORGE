/**
 * Fatigue Management Agent
 * 
 * Monitors accumulated fatigue and prevents overtraining using:
 * - Acute:Chronic Workload Ratio (ACWR)
 * - Session RPE tracking
 * - Muscle group recovery status
 * 
 * Sweet spot ACWR: 0.8-1.3
 * Risk zone: >1.5 or <0.8
 */

import { PrismaClient } from '@prisma/client'
import type { FatigueState, ReadinessAssessment } from '../types'

export class FatigueManager {
  constructor(private prisma: PrismaClient) {}

  /**
   * Assess user's current readiness to train
   */
  async assessReadiness(userId: string): Promise<ReadinessAssessment> {
    const fatigueState = await this.calculateFatigueState(userId)
    
    let recommendation: string
    
    switch (fatigueState.recommendation) {
      case 'proceed':
        recommendation = 'You\'re recovered and ready to train hard!'
        break
      case 'light':
        recommendation = 'Train today but keep intensity moderate.'
        break
      case 'deload':
        recommendation = 'Reduce training load by 15-20% to recover.'
        break
      case 'rest':
        recommendation = 'Take an extra rest day. Your body needs recovery.'
        break
      default:
        recommendation = 'Continue your training as planned.'
    }

    return {
      score: fatigueState.score,
      fatigueLevel: fatigueState.level,
      recommendation,
      adjustmentFactor: fatigueState.adjustmentFactor,
    }
  }

  /**
   * Calculate comprehensive fatigue state
   */
  async calculateFatigueState(userId: string): Promise<FatigueState> {
    const acwr = await this.calculateACWR(userId)
    const muscleRecovery = await this.assessMuscleGroupRecovery(userId)
    const recentMetrics = await this.getRecentMetrics(userId)

    // Determine fatigue level based on ACWR
    let level: FatigueState['level']
    let recommendation: FatigueState['recommendation']
    let adjustmentFactor: number
    let score: number

    if (acwr > 1.5) {
      level = 'high'
      recommendation = 'deload'
      adjustmentFactor = 0.85
      score = 0.3
    } else if (acwr > 1.3) {
      level = 'moderate'
      recommendation = 'light'
      adjustmentFactor = 0.92
      score = 0.6
    } else if (acwr < 0.8) {
      level = 'low'
      recommendation = 'proceed'
      adjustmentFactor = 1.0
      score = 0.9
    } else {
      level = 'low'
      recommendation = 'proceed'
      adjustmentFactor = 1.0
      score = 0.85
    }

    // Adjust based on subjective metrics if available
    if (recentMetrics) {
      if (recentMetrics.sleepQuality && recentMetrics.sleepQuality < 5) {
        adjustmentFactor *= 0.95
        score *= 0.9
      }
      if (recentMetrics.stress && recentMetrics.stress > 7) {
        adjustmentFactor *= 0.95
        score *= 0.9
      }
    }

    return {
      level,
      score,
      acuteChronic: acwr,
      muscleGroupRecovery: muscleRecovery,
      recommendation,
      adjustmentFactor,
    }
  }

  /**
   * Calculate Acute:Chronic Workload Ratio
   * Acute = 7-day rolling average
   * Chronic = 28-day rolling average
   */
  async calculateACWR(userId: string): Promise<number> {
    const sessions = await this.prisma.workoutSession.findMany({
      where: {
        userId,
        completed: true,
        date: {
          gte: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000), // Last 28 days
        },
      },
      include: {
        sets: true,
      },
      orderBy: { date: 'desc' },
    })

    if (sessions.length === 0) {
      return 1.0 // Default neutral ratio
    }

    // Calculate training load for each session (sets * reps * weight * RPE)
    const sessionLoads = sessions.map(session => {
      const load = session.sets.reduce((sum, set) => {
        const rpe = set.rpe || 7.5
        return sum + (set.weight * set.reps * (rpe / 10))
      }, 0)
      return { date: session.date, load }
    })

    // Acute load: last 7 days
    const acuteCutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const acuteLoads = sessionLoads.filter(s => s.date >= acuteCutoff)
    const acuteLoad = acuteLoads.reduce((sum, s) => sum + s.load, 0) / 7

    // Chronic load: last 28 days
    const chronicLoad = sessionLoads.reduce((sum, s) => sum + s.load, 0) / 28

    // Calculate ratio
    const acwr = chronicLoad > 0 ? acuteLoad / chronicLoad : 1.0

    // Store in database
    await this.prisma.fatigueMetric.upsert({
      where: {
        userId_date: {
          userId,
          date: new Date(),
        },
      },
      update: {
        acuteLoad,
        chronicLoad,
        acuteChronic: acwr,
      },
      create: {
        userId,
        acuteLoad,
        chronicLoad,
        acuteChronic: acwr,
      },
    })

    return acwr
  }

  /**
   * Assess recovery status of individual muscle groups
   */
  async assessMuscleGroupRecovery(
    userId: string
  ): Promise<Record<string, 'recovered' | 'fatigued' | 'overtrained'>> {
    const recentSessions = await this.prisma.workoutSession.findMany({
      where: {
        userId,
        completed: true,
        date: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
      include: {
        sets: {
          include: {
            exercise: true,
          },
        },
      },
      orderBy: { date: 'desc' },
    })

    const muscleGroupLoad: Record<string, { load: number; lastTrained: Date }> = {}

    for (const session of recentSessions) {
      for (const set of session.sets) {
        const muscle = set.exercise.muscleGroup
        const load = set.weight * set.reps * (set.rpe || 7.5)

        if (!muscleGroupLoad[muscle]) {
          muscleGroupLoad[muscle] = { load: 0, lastTrained: session.date }
        }

        muscleGroupLoad[muscle].load += load
        
        if (session.date > muscleGroupLoad[muscle].lastTrained) {
          muscleGroupLoad[muscle].lastTrained = session.date
        }
      }
    }

    const recovery: Record<string, 'recovered' | 'fatigued' | 'overtrained'> = {}

    for (const [muscle, data] of Object.entries(muscleGroupLoad)) {
      const daysSince = (Date.now() - data.lastTrained.getTime()) / (24 * 60 * 60 * 1000)
      const weeklyVolume = data.load

      // Simple heuristic: recovered if >48h since training
      if (daysSince >= 2) {
        recovery[muscle] = 'recovered'
      } else if (daysSince >= 1) {
        recovery[muscle] = 'fatigued'
      } else if (weeklyVolume > 50000) { // High volume threshold
        recovery[muscle] = 'overtrained'
      } else {
        recovery[muscle] = 'fatigued'
      }
    }

    return recovery
  }

  /**
   * Get most recent fatigue metrics
   */
  async getRecentMetrics(userId: string) {
    return this.prisma.fatigueMetric.findFirst({
      where: { userId },
      orderBy: { date: 'desc' },
    })
  }

  /**
   * Log subjective recovery metrics
   */
  async logRecoveryMetrics(
    userId: string,
    metrics: {
      sleepQuality?: number
      stress?: number
      soreness?: Record<string, number>
      hrv?: number
    }
  ) {
    return this.prisma.fatigueMetric.create({
      data: {
        userId,
        date: new Date(),
        ...metrics,
      },
    })
  }

  /**
   * Recommend deload week
   */
  async shouldDeload(userId: string): Promise<boolean> {
    const sessions = await this.prisma.workoutSession.findMany({
      where: {
        userId,
        completed: true,
      },
      orderBy: { date: 'desc' },
      take: 20,
    })

    // Deload every 4-6 weeks or when ACWR is high
    const weeksSinceStart = sessions.length / 4 // Assuming 4 sessions/week
    const acwr = await this.calculateACWR(userId)

    return weeksSinceStart >= 4 || acwr > 1.4
  }
}

