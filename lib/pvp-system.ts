/**
 * PvP Duel System
 * Competitive 1v1 workout challenges
 */

import { PrismaClient } from '@prisma/client'

export type DuelType = 'volume' | 'reps' | 'time' | 'pr' | 'streak'
export type DuelStatus = 'pending' | 'active' | 'completed' | 'expired'
export type DuelResult = 'victory' | 'defeat' | 'draw'

export interface Duel {
  id: string
  type: DuelType
  status: DuelStatus
  
  // Participants
  challenger: DuelParticipant
  opponent: DuelParticipant
  
  // Challenge details
  goal: DuelGoal
  duration: number // minutes
  startTime?: Date
  endTime?: Date
  
  // Results
  winner?: string
  result?: DuelResult
  
  // Rewards
  rewards: DuelReward
  
  // Metadata
  createdAt: Date
  expiresAt: Date
}

export interface DuelParticipant {
  userId: string
  username: string
  level: number
  powerLevel: number
  avatar: string
  
  // Performance
  currentValue: number
  targetValue: number
  progress: number
  
  // Status
  hasCompleted: boolean
  completedAt?: Date
}

export interface DuelGoal {
  description: string
  targetValue: number
  unit: string
  icon: string
}

export interface DuelReward {
  xp: number
  rank: number // PvP rank points
  title?: string
  badge?: string
}

export interface PvPRank {
  rank: number
  tier: string
  points: number
  pointsForNextRank: number
  wins: number
  losses: number
  draws: number
  winRate: number
}

export class PvPSystem {
  /**
   * Create a new duel challenge
   */
  static async createDuel(
    prisma: PrismaClient,
    challengerId: string,
    opponentId: string,
    type: DuelType,
    duration: number = 60
  ): Promise<{ success: boolean; duel?: Duel; error?: string }> {
    try {
      // Get participants
      const [challenger, opponent] = await Promise.all([
        this.getUserProfile(prisma, challengerId),
        this.getUserProfile(prisma, opponentId),
      ])

      if (!challenger || !opponent) {
        return { success: false, error: 'User not found' }
      }

      // Generate goal based on duel type
      const goal = this.generateGoal(type, challenger.level, opponent.level)

      const duel: Duel = {
        id: `duel-${Date.now()}`,
        type,
        status: 'pending',
        challenger: {
          ...challenger,
          currentValue: 0,
          targetValue: goal.targetValue,
          progress: 0,
          hasCompleted: false,
        },
        opponent: {
          ...opponent,
          currentValue: 0,
          targetValue: goal.targetValue,
          progress: 0,
          hasCompleted: false,
        },
        goal,
        duration,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours to accept
        rewards: this.calculateRewards(challenger.level, opponent.level),
      }

      return { success: true, duel }
    } catch (error) {
      return { success: false, error: 'Failed to create duel' }
    }
  }

  /**
   * Accept duel challenge
   */
  static async acceptDuel(
    prisma: PrismaClient,
    duelId: string,
    userId: string
  ): Promise<{ success: boolean; message: string }> {
    // In full implementation, update duel status and start timer
    return { success: true, message: 'Duel accepted! Good luck!' }
  }

  /**
   * Decline duel challenge
   */
  static async declineDuel(
    prisma: PrismaClient,
    duelId: string,
    userId: string
  ): Promise<{ success: boolean; message: string }> {
    // In full implementation, update duel status
    return { success: true, message: 'Duel declined' }
  }

  /**
   * Update duel progress
   */
  static async updateDuelProgress(
    prisma: PrismaClient,
    duelId: string,
    userId: string,
    value: number
  ): Promise<{ success: boolean; duel?: Duel }> {
    // In full implementation, update participant's current value
    return { success: true }
  }

  /**
   * Complete duel and determine winner
   */
  static async completeDuel(
    prisma: PrismaClient,
    duelId: string
  ): Promise<{ success: boolean; winner?: string; result?: DuelResult }> {
    // In full implementation, compare values and determine winner
    return { success: true, winner: 'user-1', result: 'victory' }
  }

  /**
   * Get active duels for user
   */
  static async getUserDuels(
    prisma: PrismaClient,
    userId: string,
    status?: DuelStatus
  ): Promise<Duel[]> {
    // In full implementation, query from database
    return this.getMockDuels(userId)
  }

  /**
   * Get PvP rank for user
   */
  static async getUserPvPRank(
    prisma: PrismaClient,
    userId: string
  ): Promise<PvPRank> {
    // In full implementation, query from database
    return {
      rank: 1250,
      tier: 'Gold III',
      points: 1450,
      pointsForNextRank: 1500,
      wins: 42,
      losses: 15,
      draws: 3,
      winRate: 73.7,
    }
  }

  /**
   * Get PvP leaderboard
   */
  static async getPvPLeaderboard(
    prisma: PrismaClient,
    limit: number = 100
  ): Promise<Array<{ userId: string; username: string; rank: PvPRank }>> {
    // In full implementation, query from database
    return []
  }

  /**
   * Generate goal based on duel type
   */
  private static generateGoal(type: DuelType, challengerLevel: number, opponentLevel: number): DuelGoal {
    const avgLevel = Math.floor((challengerLevel + opponentLevel) / 2)
    
    switch (type) {
      case 'volume':
        return {
          description: 'Lift the most total volume',
          targetValue: avgLevel * 500,
          unit: 'kg',
          icon: '🏋️',
        }
      case 'reps':
        return {
          description: 'Complete the most total reps',
          targetValue: avgLevel * 20,
          unit: 'reps',
          icon: '💪',
        }
      case 'time':
        return {
          description: 'Workout the longest',
          targetValue: Math.max(30, avgLevel),
          unit: 'minutes',
          icon: '⏱️',
        }
      case 'pr':
        return {
          description: 'Hit the most personal records',
          targetValue: 3,
          unit: 'PRs',
          icon: '🏆',
        }
      case 'streak':
        return {
          description: 'Maintain the longest streak',
          targetValue: 7,
          unit: 'days',
          icon: '🔥',
        }
      default:
        return {
          description: 'Complete a workout',
          targetValue: 1,
          unit: 'workouts',
          icon: '🎯',
        }
    }
  }

  /**
   * Calculate rewards based on participants' levels
   */
  private static calculateRewards(challengerLevel: number, opponentLevel: number): DuelReward {
    const avgLevel = Math.floor((challengerLevel + opponentLevel) / 2)
    const xp = 100 + avgLevel * 10
    const rank = 25 + Math.floor(avgLevel / 5) * 5
    
    return {
      xp,
      rank,
      title: avgLevel >= 50 ? 'Duel Victor' : undefined,
      badge: avgLevel >= 80 ? '⚔️' : undefined,
    }
  }

  /**
   * Get user profile for duel
   */
  private static async getUserProfile(
    prisma: PrismaClient,
    userId: string
  ): Promise<DuelParticipant | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true },
    })

    if (!user) return null

    // Calculate level (simplified)
    const workouts = await prisma.workoutSession.count({
      where: { userId, completed: true },
    })
    const level = Math.floor(workouts / 5) + 1
    const powerLevel = workouts * 50

    return {
      userId: user.id,
      username: user.name || user.email.split('@')[0],
      level,
      powerLevel,
      avatar: '👤',
      currentValue: 0,
      targetValue: 0,
      progress: 0,
      hasCompleted: false,
    }
  }

  /**
   * Get tier name from rank
   */
  static getRankTier(rank: number): string {
    if (rank >= 3000) return 'Legendary'
    if (rank >= 2500) return 'Diamond I'
    if (rank >= 2000) return 'Diamond II'
    if (rank >= 1800) return 'Diamond III'
    if (rank >= 1600) return 'Platinum I'
    if (rank >= 1400) return 'Platinum II'
    if (rank >= 1200) return 'Platinum III'
    if (rank >= 1000) return 'Gold I'
    if (rank >= 800) return 'Gold II'
    if (rank >= 600) return 'Gold III'
    if (rank >= 400) return 'Silver I'
    if (rank >= 200) return 'Silver II'
    if (rank >= 100) return 'Silver III'
    return 'Bronze'
  }

  /**
   * Get tier color
   */
  static getTierColor(tier: string): string {
    if (tier.includes('Legendary')) return 'from-purple-400 via-pink-500 to-red-500'
    if (tier.includes('Diamond')) return 'from-blue-400 to-cyan-500'
    if (tier.includes('Platinum')) return 'from-gray-300 to-gray-400'
    if (tier.includes('Gold')) return 'from-yellow-400 to-yellow-600'
    if (tier.includes('Silver')) return 'from-gray-400 to-gray-500'
    return 'from-orange-700 to-orange-900'
  }

  /**
   * Mock duels for demo
   */
  private static getMockDuels(userId: string): Duel[] {
    const now = new Date()
    
    return [
      {
        id: 'duel-1',
        type: 'volume',
        status: 'active',
        challenger: {
          userId: 'user-1',
          username: 'John',
          level: 42,
          powerLevel: 2100,
          avatar: '👤',
          currentValue: 8500,
          targetValue: 10000,
          progress: 85,
          hasCompleted: false,
        },
        opponent: {
          userId: 'user-2',
          username: 'Sarah',
          level: 38,
          powerLevel: 1900,
          avatar: '👤',
          currentValue: 7200,
          targetValue: 10000,
          progress: 72,
          hasCompleted: false,
        },
        goal: {
          description: 'Lift the most total volume',
          targetValue: 10000,
          unit: 'kg',
          icon: '🏋️',
        },
        duration: 60,
        startTime: new Date(now.getTime() - 45 * 60 * 1000),
        endTime: new Date(now.getTime() + 15 * 60 * 1000),
        rewards: {
          xp: 500,
          rank: 50,
          title: 'Volume King',
        },
        createdAt: new Date(now.getTime() - 45 * 60 * 1000),
        expiresAt: new Date(now.getTime() + 15 * 60 * 1000),
      },
    ]
  }
}

