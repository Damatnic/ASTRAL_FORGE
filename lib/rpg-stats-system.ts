/**
 * RPG Stats System
 * Calculate real stats from workout data
 */

import { PrismaClient } from '@prisma/client'

export interface RPGStats {
  strength: number
  endurance: number
  agility: number
  flexibility: number
  power: number
  
  // Detailed breakdowns
  breakdown: {
    strength: StatBreakdown
    endurance: StatBreakdown
    agility: StatBreakdown
    flexibility: StatBreakdown
  }
  
  // Ranks
  ranks: {
    strength: StatRank
    endurance: StatRank
    agility: StatRank
    flexibility: StatRank
    overall: StatRank
  }
}

export interface StatBreakdown {
  base: number
  fromWorkouts: number
  fromPRs: number
  fromConsistency: number
  fromPrestige: number
  total: number
}

export type StatRank = 'F' | 'D' | 'C' | 'B' | 'A' | 'S' | 'SS' | 'SSS'

export class RPGStatsSystem {
  /**
   * Calculate all RPG stats from user data
   */
  static async calculateStats(
    prisma: PrismaClient,
    userId: string,
    prestigeBonus: number = 0
  ): Promise<RPGStats> {
    // Fetch user workout data
    const [sessions, sets, user] = await Promise.all([
      prisma.workoutSession.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
        take: 100, // Last 100 sessions
      }),
      prisma.set.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 1000, // Last 1000 sets
      }),
      prisma.user.findUnique({
        where: { id: userId },
        select: { createdAt: true },
      }),
    ])

    // Calculate base stats (age of account, consistency)
    const accountAge = user ? Math.floor((Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24)) : 0
    const baseStats = Math.min(accountAge * 0.5, 50) // Up to 50 base from account age

    // Calculate individual stats
    const strength = this.calculateStrength(sets, baseStats, prestigeBonus)
    const endurance = this.calculateEndurance(sessions, sets, baseStats, prestigeBonus)
    const agility = this.calculateAgility(sessions, sets, baseStats, prestigeBonus)
    const flexibility = this.calculateFlexibility(sessions, sets, baseStats, prestigeBonus)
    
    // Power is the sum of all stats
    const power = strength.total + endurance.total + agility.total + flexibility.total

    return {
      strength: strength.total,
      endurance: endurance.total,
      agility: agility.total,
      flexibility: flexibility.total,
      power,
      breakdown: {
        strength,
        endurance,
        agility,
        flexibility,
      },
      ranks: {
        strength: this.getStatRank(strength.total),
        endurance: this.getStatRank(endurance.total),
        agility: this.getStatRank(agility.total),
        flexibility: this.getStatRank(flexibility.total),
        overall: this.getStatRank(power / 4),
      },
    }
  }

  /**
   * Calculate STRENGTH stat
   * Based on: Heavy weights, low reps, PRs, progressive overload
   */
  private static calculateStrength(
    sets: any[],
    base: number,
    prestigeBonus: number
  ): StatBreakdown {
    let fromWorkouts = 0
    let fromPRs = 0
    let fromConsistency = 0

    // Strength-focused exercises
    const strengthExercises = [
      'bench press', 'squat', 'deadlift', 'overhead press',
      'barbell row', 'pull-up', 'dip', 'weighted'
    ]

    // Filter strength-related sets
    const strengthSets = sets.filter((set) => {
      const name = (set.exercise?.name || '').toLowerCase()
      return strengthExercises.some((ex) => name.includes(ex))
    })

    // Calculate from heavy sets (high weight, low reps)
    strengthSets.forEach((set) => {
      if (set.weight && set.weight > 0) {
        // Heavy weight bonus (weight * reps)
        const volume = (set.weight || 0) * (set.reps || 0)
        fromWorkouts += Math.min(volume * 0.01, 5) // Cap per set
        
        // Low rep bonus (1-5 reps = strength training)
        if (set.reps && set.reps <= 5) {
          fromWorkouts += 2
        }
        
        // High RPE bonus (8-10 RPE = near max effort)
        if (set.rpe && set.rpe >= 8) {
          fromWorkouts += 3
        }
      }
    })

    // PRs increase strength significantly
    const prSets = strengthSets.filter((set) => set.isPR)
    fromPRs = Math.min(prSets.length * 10, 100)

    // Consistency bonus (training frequency)
    const uniqueDays = new Set(strengthSets.map((s) => s.createdAt?.toDateString())).size
    fromConsistency = Math.min(uniqueDays * 2, 50)

    const total = Math.floor(
      base + fromWorkouts + fromPRs + fromConsistency + prestigeBonus
    )

    return {
      base,
      fromWorkouts: Math.floor(fromWorkouts),
      fromPRs,
      fromConsistency,
      fromPrestige: prestigeBonus,
      total,
    }
  }

  /**
   * Calculate ENDURANCE stat
   * Based on: High reps, total volume, workout duration, cardio
   */
  private static calculateEndurance(
    sessions: any[],
    sets: any[],
    base: number,
    prestigeBonus: number
  ): StatBreakdown {
    let fromWorkouts = 0
    let fromPRs = 0
    let fromConsistency = 0

    // Endurance exercises
    const enduranceExercises = [
      'run', 'jog', 'bike', 'row', 'swim', 'hiit',
      'cardio', 'burpee', 'jump rope', 'mountain climber'
    ]

    const enduranceSets = sets.filter((set) => {
      const name = (set.exercise?.name || '').toLowerCase()
      return enduranceExercises.some((ex) => name.includes(ex)) || (set.reps && set.reps >= 15)
    })

    // High rep sets
    enduranceSets.forEach((set) => {
      if (set.reps && set.reps >= 15) {
        fromWorkouts += Math.min(set.reps * 0.5, 10)
      }
      
      // Duration-based exercises
      if (set.duration) {
        fromWorkouts += Math.min(set.duration / 60, 15) // per minute
      }
    })

    // Long workout sessions boost endurance
    sessions.forEach((session) => {
      if (session.duration && session.duration >= 30) {
        fromWorkouts += Math.min(session.duration / 10, 20)
      }
    })

    // PRs for endurance (most reps, longest duration)
    fromPRs = Math.min(enduranceSets.filter((s) => s.isPR).length * 10, 100)

    // Consistency (frequency of training)
    const uniqueDays = new Set(enduranceSets.map((s) => s.createdAt?.toDateString())).size
    fromConsistency = Math.min(uniqueDays * 2, 50)

    const total = Math.floor(
      base + fromWorkouts + fromPRs + fromConsistency + prestigeBonus
    )

    return {
      base,
      fromWorkouts: Math.floor(fromWorkouts),
      fromPRs,
      fromConsistency,
      fromPrestige: prestigeBonus,
      total,
    }
  }

  /**
   * Calculate AGILITY stat
   * Based on: Explosive movements, speed work, plyometrics
   */
  private static calculateAgility(
    sessions: any[],
    sets: any[],
    base: number,
    prestigeBonus: number
  ): StatBreakdown {
    let fromWorkouts = 0
    let fromPRs = 0
    let fromConsistency = 0

    // Agility exercises
    const agilityExercises = [
      'jump', 'sprint', 'box', 'plyometric', 'explosive',
      'burpee', 'mountain climber', 'speed', 'agility'
    ]

    const agilitySets = sets.filter((set) => {
      const name = (set.exercise?.name || '').toLowerCase()
      return agilityExercises.some((ex) => name.includes(ex))
    })

    // Quick, explosive sets
    agilitySets.forEach((set) => {
      fromWorkouts += 5 // Each agility exercise counts
      
      // High RPE on explosive movements
      if (set.rpe && set.rpe >= 8) {
        fromWorkouts += 3
      }
    })

    // Short rest times indicate explosiveness
    sessions.forEach((session) => {
      if (session.duration && session.duration <= 30) {
        fromWorkouts += 10 // Quick, intense sessions
      }
    })

    fromPRs = Math.min(agilitySets.filter((s) => s.isPR).length * 10, 100)

    const uniqueDays = new Set(agilitySets.map((s) => s.createdAt?.toDateString())).size
    fromConsistency = Math.min(uniqueDays * 2, 50)

    const total = Math.floor(
      base + fromWorkouts + fromPRs + fromConsistency + prestigeBonus
    )

    return {
      base,
      fromWorkouts: Math.floor(fromWorkouts),
      fromPRs,
      fromConsistency,
      fromPrestige: prestigeBonus,
      total,
    }
  }

  /**
   * Calculate FLEXIBILITY stat
   * Based on: Stretching, mobility work, yoga, range of motion
   */
  private static calculateFlexibility(
    sessions: any[],
    sets: any[],
    base: number,
    prestigeBonus: number
  ): StatBreakdown {
    let fromWorkouts = 0
    let fromPRs = 0
    let fromConsistency = 0

    // Flexibility exercises
    const flexibilityExercises = [
      'stretch', 'yoga', 'mobility', 'flexibility',
      'foam roll', 'lunge', 'hamstring', 'hip'
    ]

    const flexSets = sets.filter((set) => {
      const name = (set.exercise?.name || '').toLowerCase()
      return flexibilityExercises.some((ex) => name.includes(ex))
    })

    flexSets.forEach((set) => {
      fromWorkouts += 8 // Each flexibility exercise
      
      // Duration-based
      if (set.duration) {
        fromWorkouts += Math.min(set.duration / 30, 10)
      }
    })

    // Warmup/cooldown sessions
    const mobilityRoutines = sessions.filter((s) => {
      const plan = s.plan as any
      const name = (plan?.name || '').toLowerCase()
      return name.includes('mobility') || name.includes('stretch') || name.includes('yoga')
    })
    fromWorkouts += mobilityRoutines.length * 15

    fromPRs = Math.min(flexSets.filter((s) => s.isPR).length * 10, 50)

    const uniqueDays = new Set(flexSets.map((s) => s.createdAt?.toDateString())).size
    fromConsistency = Math.min(uniqueDays * 2, 50)

    const total = Math.floor(
      base + fromWorkouts + fromPRs + fromConsistency + prestigeBonus
    )

    return {
      base,
      fromWorkouts: Math.floor(fromWorkouts),
      fromPRs,
      fromConsistency,
      fromPrestige: prestigeBonus,
      total,
    }
  }

  /**
   * Get rank based on stat value
   */
  private static getStatRank(value: number): StatRank {
    if (value >= 500) return 'SSS'
    if (value >= 400) return 'SS'
    if (value >= 300) return 'S'
    if (value >= 200) return 'A'
    if (value >= 150) return 'B'
    if (value >= 100) return 'C'
    if (value >= 50) return 'D'
    return 'F'
  }

  /**
   * Get rank color for UI
   */
  static getRankColor(rank: StatRank): string {
    const colors: Record<StatRank, string> = {
      SSS: 'text-red-500',
      SS: 'text-orange-500',
      S: 'text-yellow-500',
      A: 'text-green-500',
      B: 'text-blue-500',
      C: 'text-cyan-500',
      D: 'text-gray-400',
      F: 'text-gray-600',
    }
    return colors[rank]
  }

  /**
   * Get stat growth recommendations
   */
  static getStatRecommendations(stats: RPGStats): Record<string, string[]> {
    const recommendations: Record<string, string[]> = {
      strength: [],
      endurance: [],
      agility: [],
      flexibility: [],
    }

    // Strength recommendations
    if (stats.strength < 100) {
      recommendations.strength.push('Focus on compound lifts (Squat, Bench, Deadlift)')
      recommendations.strength.push('Use progressive overload (increase weight weekly)')
      recommendations.strength.push('Train in 1-5 rep range for maximum strength')
    }

    // Endurance recommendations
    if (stats.endurance < 100) {
      recommendations.endurance.push('Increase workout volume (more sets/reps)')
      recommendations.endurance.push('Add cardio sessions 2-3x per week')
      recommendations.endurance.push('Reduce rest times between sets')
    }

    // Agility recommendations
    if (stats.agility < 100) {
      recommendations.agility.push('Include plyometric exercises (box jumps, burpees)')
      recommendations.agility.push('Add sprint intervals to your routine')
      recommendations.agility.push('Focus on explosive movements')
    }

    // Flexibility recommendations
    if (stats.flexibility < 100) {
      recommendations.flexibility.push('Add daily stretching routine (10-15 min)')
      recommendations.flexibility.push('Try mobility work or yoga 2x per week')
      recommendations.flexibility.push('Include dynamic warmups before workouts')
    }

    return recommendations
  }

  /**
   * Compare stats with previous period
   */
  static compareStats(current: RPGStats, previous: RPGStats): {
    strength: number
    endurance: number
    agility: number
    flexibility: number
    power: number
  } {
    return {
      strength: current.strength - previous.strength,
      endurance: current.endurance - previous.endurance,
      agility: current.agility - previous.agility,
      flexibility: current.flexibility - previous.flexibility,
      power: current.power - previous.power,
    }
  }
}

