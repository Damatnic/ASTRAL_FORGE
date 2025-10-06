/**
 * PvP/Duel System - Database Integration
 * Competitive challenges between users
 */

import { PrismaClient, DuelType, DuelStatus } from '@prisma/client'

export type { DuelType, DuelStatus }

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

export interface DuelParticipant {
  userId: string
  username: string
  level: number
  powerLevel: number
  avatar: string
  currentValue: number
  targetValue: number
  progress: number
  hasCompleted: boolean
}

export interface Duel {
  id: string
  type: DuelType
  status: DuelStatus
  challenger: DuelParticipant
  opponent: DuelParticipant
  goal: {
    description: string
    targetValue: number
    unit: string
    icon: string
  }
  rewards: {
    xp: number
    rank: number
    title?: string
    badge?: string
  }
  startDate?: Date
  endDate?: Date
  winnerId?: string
  createdAt: Date
}

export class PvPSystemDB {
  /**
   * Create a new duel challenge
   */
  static async createDuel(
    prisma: PrismaClient,
    challengerId: string,
    opponentId: string,
    type: DuelType,
    customGoal?: { description: string; targetValue: number; unit: string }
  ): Promise<{ success: boolean; duel?: Duel; error?: string }> {
    try {
      // Get both users' levels
      const [challenger, opponent] = await Promise.all([
        this.getUserProfile(prisma, challengerId),
        this.getUserProfile(prisma, opponentId),
      ])

      if (!challenger || !opponent) {
        return { success: false, error: 'User not found' }
      }

      const generatedGoal = this.generateGoal(type, challenger.level, opponent.level)
      const goal = customGoal ? { ...customGoal, icon: generatedGoal.icon } : generatedGoal
      const rewards = this.calculateRewards(challenger.level, opponent.level)

      // Create duel
      const dbDuel = await prisma.duel.create({
        data: {
          challengerId,
          opponentId,
          type,
          status: DuelStatus.PENDING,
          goalDescription: goal.description,
          targetValue: goal.targetValue,
          unit: goal.unit,
          icon: goal.icon,
          xpReward: rewards.xp,
          rankReward: rewards.rank,
          titleReward: rewards.title,
          badgeReward: rewards.badge,
        },
        include: {
          challenger: { select: { id: true, name: true, email: true } },
          opponent: { select: { id: true, name: true, email: true } },
        },
      })

      // Create participants
      await Promise.all([
        prisma.duelParticipant.create({
          data: {
            duelId: dbDuel.id,
            userId: challengerId,
            targetValue: goal.targetValue,
          },
        }),
        prisma.duelParticipant.create({
          data: {
            duelId: dbDuel.id,
            userId: opponentId,
            targetValue: goal.targetValue,
          },
        }),
      ])

      const duel = await this.getDuelById(prisma, dbDuel.id)
      return { success: true, duel: duel! }
    } catch (_error) {
      return { success: false, error: 'Failed to create duel' }
    }
  }

  /**
   * Accept a duel
   */
  static async acceptDuel(
    prisma: PrismaClient,
    duelId: string,
    userId: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const duel = await prisma.duel.findUnique({ where: { id: duelId } })
      if (!duel) return { success: false, message: 'Duel not found' }
      if (duel.opponentId !== userId) return { success: false, message: 'Not authorized' }

      await prisma.duel.update({
        where: { id: duelId },
        data: {
          status: DuelStatus.ACTIVE,
          startDate: new Date(),
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
      })

      return { success: true, message: 'Duel accepted!' }
    } catch (_error) {
      return { success: false, message: 'Failed to accept duel' }
    }
  }

  /**
   * Decline a duel
   */
  static async declineDuel(
    prisma: PrismaClient,
    duelId: string,
    userId: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const duel = await prisma.duel.findUnique({ where: { id: duelId } })
      if (!duel) return { success: false, message: 'Duel not found' }
      if (duel.opponentId !== userId) return { success: false, message: 'Not authorized' }

      await prisma.duel.update({
        where: { id: duelId },
        data: { status: DuelStatus.CANCELLED },
      })

      return { success: true, message: 'Duel declined' }
    } catch (_error) {
      return { success: false, message: 'Failed to decline duel' }
    }
  }

  /**
   * Update duel progress
   */
  static async updateDuelProgress(
    prisma: PrismaClient,
    duelId: string,
    userId: string,
    currentValue: number
  ): Promise<{ success: boolean; winner?: string }> {
    try {
      const participant = await prisma.duelParticipant.findUnique({
        where: { duelId_userId: { duelId, userId } },
      })

      if (!participant) return { success: false }

      const progress = Math.min((currentValue / participant.targetValue) * 100, 100)
      const hasCompleted = currentValue >= participant.targetValue

      await prisma.duelParticipant.update({
        where: { duelId_userId: { duelId, userId } },
        data: {
          currentValue,
          progress,
          hasCompleted,
          completedAt: hasCompleted ? new Date() : null,
        },
      })

      // Check if duel is complete
      if (hasCompleted) {
        const duel = await prisma.duel.findUnique({
          where: { id: duelId },
          include: { participants: true },
        })

        if (duel && duel.participants.every(p => p.hasCompleted)) {
          // Determine winner (first to complete or highest progress)
          const winner = duel.participants.reduce((prev, curr) => {
            if (!prev.completedAt) return curr
            if (!curr.completedAt) return prev
            return curr.completedAt < prev.completedAt ? curr : prev
          })

          await prisma.duel.update({
            where: { id: duelId },
            data: {
              status: DuelStatus.COMPLETED,
              winnerId: winner.userId,
            },
          })

          // Award rewards
          await this.awardDuelRewards(prisma, duelId, winner.userId)

          return { success: true, winner: winner.userId }
        }
      }

      return { success: true }
    } catch (_error) {
      return { success: false }
    }
  }

  /**
   * Get duels for user
   */
  static async getUserDuels(
    prisma: PrismaClient,
    userId: string,
    status?: DuelStatus
  ): Promise<Duel[]> {
    const dbDuels = await prisma.duel.findMany({
      where: {
        OR: [{ challengerId: userId }, { opponentId: userId }],
        ...(status && { status }),
      },
      include: {
        challenger: { select: { id: true, name: true, email: true } },
        opponent: { select: { id: true, name: true, email: true } },
        participants: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return Promise.all(dbDuels.map(d => this.transformDbDuel(prisma, d)))
  }

  /**
   * Get duel by ID
   */
  static async getDuelById(prisma: PrismaClient, duelId: string): Promise<Duel | null> {
    const dbDuel = await prisma.duel.findUnique({
      where: { id: duelId },
      include: {
        challenger: { select: { id: true, name: true, email: true } },
        opponent: { select: { id: true, name: true, email: true } },
        participants: true,
      },
    })

    return dbDuel ? this.transformDbDuel(prisma, dbDuel) : null
  }

  /**
   * Get user PvP rank
   */
  static async getUserPvPRank(prisma: PrismaClient, userId: string): Promise<PvPRank> {
    let pvpRank = await prisma.pvPRank.findUnique({ where: { userId } })

    if (!pvpRank) {
      // Create default rank
      pvpRank = await prisma.pvPRank.create({
        data: {
          userId,
          tier: 'Bronze',
          points: 1000,
          pointsForNextRank: 1100,
        },
      })
    }

    const globalRank = await prisma.pvPRank.count({
      where: { points: { gt: pvpRank.points } },
    })

    return {
      rank: globalRank + 1,
      tier: pvpRank.tier,
      points: pvpRank.points,
      pointsForNextRank: pvpRank.pointsForNextRank,
      wins: pvpRank.wins,
      losses: pvpRank.losses,
      draws: pvpRank.draws,
      winRate: pvpRank.winRate,
    }
  }

  /**
   * Get PvP leaderboard
   */
  static async getPvPLeaderboard(
    prisma: PrismaClient,
    limit: number = 100
  ): Promise<Array<{ userId: string; username: string; rank: PvPRank }>> {
    const ranks = await prisma.pvPRank.findMany({
      take: limit,
      orderBy: { points: 'desc' },
      include: { user: { select: { name: true, email: true } } },
    })

    return ranks.map((r, index) => ({
      userId: r.userId,
      username: r.user.name || r.user.email.split('@')[0],
      rank: {
        rank: index + 1,
        tier: r.tier,
        points: r.points,
        pointsForNextRank: r.pointsForNextRank,
        wins: r.wins,
        losses: r.losses,
        draws: r.draws,
        winRate: r.winRate,
      },
    }))
  }

  // Helper functions
  private static async transformDbDuel(prisma: PrismaClient, dbDuel: {
    id: string;
    type: DuelType;
    status: DuelStatus;
    challengerId: string;
    opponentId: string;
    goalDescription: string;
    targetValue: number;
    unit: string;
    icon: string;
    xpReward: number;
    rankReward: number;
    titleReward: string | null;
    badgeReward: string | null;
    startDate: Date | null;
    endDate: Date | null;
    winnerId: string | null;
    createdAt: Date;
    participants: { userId: string; currentValue: number; targetValue: number; progress: number; hasCompleted: boolean }[];
  }): Promise<Duel> {
    const [challenger, opponent] = await Promise.all([
      this.getUserProfile(prisma, dbDuel.challengerId),
      this.getUserProfile(prisma, dbDuel.opponentId),
    ])

    const challengerParticipant = dbDuel.participants.find((p) => p.userId === dbDuel.challengerId)
    const opponentParticipant = dbDuel.participants.find((p) => p.userId === dbDuel.opponentId)

    return {
      id: dbDuel.id,
      type: dbDuel.type,
      status: dbDuel.status,
      challenger: {
        ...challenger!,
        currentValue: challengerParticipant?.currentValue || 0,
        targetValue: challengerParticipant?.targetValue || 0,
        progress: challengerParticipant?.progress || 0,
        hasCompleted: challengerParticipant?.hasCompleted || false,
      },
      opponent: {
        ...opponent!,
        currentValue: opponentParticipant?.currentValue || 0,
        targetValue: opponentParticipant?.targetValue || 0,
        progress: opponentParticipant?.progress || 0,
        hasCompleted: opponentParticipant?.hasCompleted || false,
      },
      goal: {
        description: dbDuel.goalDescription,
        targetValue: dbDuel.targetValue,
        unit: dbDuel.unit,
        icon: dbDuel.icon,
      },
      rewards: {
        xp: dbDuel.xpReward,
        rank: dbDuel.rankReward,
        title: dbDuel.titleReward ?? undefined,
        badge: dbDuel.badgeReward ?? undefined,
      },
      startDate: dbDuel.startDate ?? undefined,
      endDate: dbDuel.endDate ?? undefined,
      winnerId: dbDuel.winnerId ?? undefined,
      createdAt: dbDuel.createdAt,
    }
  }

  private static async getUserProfile(
    prisma: PrismaClient,
    userId: string
  ): Promise<DuelParticipant | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true },
    })

    if (!user) return null

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

  private static generateGoal(
    type: DuelType,
    challengerLevel: number,
    opponentLevel: number
  ): { description: string; targetValue: number; unit: string; icon: string } {
    const avgLevel = Math.floor((challengerLevel + opponentLevel) / 2)

    switch (type) {
      case DuelType.VOLUME:
        return {
          description: 'Lift the most total volume',
          targetValue: avgLevel * 500,
          unit: 'kg',
          icon: '🏋️',
        }
      case DuelType.REPS:
        return {
          description: 'Complete the most total reps',
          targetValue: avgLevel * 20,
          unit: 'reps',
          icon: '💪',
        }
      case DuelType.TIME:
        return {
          description: 'Workout the longest',
          targetValue: Math.max(30, avgLevel),
          unit: 'minutes',
          icon: '⏱️',
        }
      case DuelType.PR:
        return {
          description: 'Hit the most personal records',
          targetValue: 3,
          unit: 'PRs',
          icon: '🏆',
        }
      case DuelType.STREAK:
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

  private static calculateRewards(
    challengerLevel: number,
    opponentLevel: number
  ): { xp: number; rank: number; title?: string; badge?: string } {
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

  private static async awardDuelRewards(
    prisma: PrismaClient,
    duelId: string,
    winnerId: string
  ): Promise<void> {
    const duel = await prisma.duel.findUnique({ where: { id: duelId } })
    if (!duel) return

    // Update PvP rank
    const pvpRank = await prisma.pvPRank.findUnique({ where: { userId: winnerId } })
    if (pvpRank) {
      await prisma.pvPRank.update({
        where: { userId: winnerId },
        data: {
          points: { increment: duel.rankReward },
          wins: { increment: 1 },
          winRate: (pvpRank.wins + 1) / (pvpRank.wins + pvpRank.losses + pvpRank.draws + 1) * 100,
        },
      })
    }

    // Award loser participation points
    const loserId = duel.challengerId === winnerId ? duel.opponentId : duel.challengerId
    const loserRank = await prisma.pvPRank.findUnique({ where: { userId: loserId } })
    if (loserRank) {
      await prisma.pvPRank.update({
        where: { userId: loserId },
        data: {
          points: { increment: Math.floor(duel.rankReward / 2) },
          losses: { increment: 1 },
          winRate: loserRank.wins / (loserRank.wins + loserRank.losses + loserRank.draws + 1) * 100,
        },
      })
    }
  }

  static getRankTier(points: number): string {
    if (points >= 3000) return 'Legendary'
    if (points >= 2500) return 'Diamond I'
    if (points >= 2000) return 'Diamond II'
    if (points >= 1800) return 'Diamond III'
    if (points >= 1600) return 'Platinum I'
    if (points >= 1400) return 'Platinum II'
    if (points >= 1200) return 'Platinum III'
    if (points >= 1000) return 'Gold I'
    if (points >= 800) return 'Gold II'
    if (points >= 600) return 'Gold III'
    if (points >= 400) return 'Silver I'
    if (points >= 200) return 'Silver II'
    if (points >= 100) return 'Silver III'
    return 'Bronze'
  }

  static getTierColor(tier: string): string {
    if (tier.includes('Legendary')) return 'from-purple-400 via-pink-500 to-red-500'
    if (tier.includes('Diamond')) return 'from-blue-400 to-cyan-500'
    if (tier.includes('Platinum')) return 'from-gray-300 to-gray-400'
    if (tier.includes('Gold')) return 'from-yellow-400 to-yellow-600'
    if (tier.includes('Silver')) return 'from-gray-400 to-gray-500'
    return 'from-orange-700 to-orange-900'
  }
}
