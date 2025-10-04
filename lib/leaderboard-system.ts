/**
 * Leaderboard System
 * Global, guild, and seasonal rankings
 */

import { PrismaClient } from '@prisma/client'

export type LeaderboardType = 'global' | 'guild' | 'friends' | 'seasonal'
export type LeaderboardCategory = 
  | 'level' 
  | 'power' 
  | 'strength' 
  | 'endurance' 
  | 'volume' 
  | 'workouts' 
  | 'prs'
  | 'streak'

export interface LeaderboardEntry {
  rank: number
  userId: string
  username: string
  avatar: string
  level: number
  
  // Stats
  value: number // The ranked value
  powerLevel: number
  strength: number
  endurance: number
  
  // Visual
  title?: string
  badge?: string
  guildTag?: string
  
  // Change from last period
  change: number // +3, -1, 0, etc.
  
  // Metadata
  isCurrentUser?: boolean
}

export interface SeasonData {
  id: string
  name: string
  startDate: Date
  endDate: Date
  isActive: boolean
  rewards: SeasonReward[]
}

export interface SeasonReward {
  rank: number
  title: string
  badge: string
  description: string
}

export class LeaderboardSystem {
  /**
   * Get global leaderboard
   */
  static async getGlobalLeaderboard(
    prisma: PrismaClient,
    category: LeaderboardCategory,
    limit: number = 100
  ): Promise<LeaderboardEntry[]> {
    const users = await prisma.user.findMany({
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        streaks: {
          select: {
            current: true,
          },
        },
      },
    })

    // Calculate stats for each user
    const entries: LeaderboardEntry[] = await Promise.all(
      users.map(async (user, index) => {
        const stats = await this.calculateUserStats(prisma, user.id)
        
        return {
          rank: index + 1,
          userId: user.id,
          username: user.name || user.email.split('@')[0],
          avatar: '👤',
          level: stats.level,
          value: this.getValueByCategory(stats, category),
          powerLevel: stats.power,
          strength: stats.strength,
          endurance: stats.endurance,
          change: 0, // Would be calculated from previous period
          guildTag: stats.guildTag,
        }
      })
    )

    // Sort by value
    return entries.sort((a, b) => b.value - a.value).map((e, i) => ({ ...e, rank: i + 1 }))
  }

  /**
   * Get guild leaderboard
   */
  static async getGuildLeaderboard(
    prisma: PrismaClient,
    guildId: string,
    category: LeaderboardCategory
  ): Promise<LeaderboardEntry[]> {
    // In full implementation, filter by guild members
    return this.getGlobalLeaderboard(prisma, category, 50)
  }

  /**
   * Get friends leaderboard
   */
  static async getFriendsLeaderboard(
    prisma: PrismaClient,
    userId: string,
    category: LeaderboardCategory
  ): Promise<LeaderboardEntry[]> {
    // In full implementation, filter by friends list
    return this.getGlobalLeaderboard(prisma, category, 20)
  }

  /**
   * Get seasonal leaderboard
   */
  static async getSeasonalLeaderboard(
    prisma: PrismaClient,
    seasonId: string,
    category: LeaderboardCategory
  ): Promise<LeaderboardEntry[]> {
    // In full implementation, filter by season timeframe
    return this.getGlobalLeaderboard(prisma, category, 100)
  }

  /**
   * Get user rank in leaderboard
   */
  static async getUserRank(
    prisma: PrismaClient,
    userId: string,
    category: LeaderboardCategory
  ): Promise<{ rank: number; total: number; percentile: number }> {
    const leaderboard = await this.getGlobalLeaderboard(prisma, category, 10000)
    const userEntry = leaderboard.find((e) => e.userId === userId)
    
    return {
      rank: userEntry?.rank || 0,
      total: leaderboard.length,
      percentile: userEntry ? ((leaderboard.length - userEntry.rank) / leaderboard.length) * 100 : 0,
    }
  }

  /**
   * Get current season
   */
  static getCurrentSeason(): SeasonData {
    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    
    const seasonNames = [
      'Winter Forge', 'Spring Tempering', 'Summer Blaze', 'Autumn Harvest',
      'Winter Forge', 'Spring Tempering', 'Summer Blaze', 'Autumn Harvest',
      'Winter Forge', 'Spring Tempering', 'Summer Blaze', 'Autumn Harvest',
    ]
    
    return {
      id: `season-${now.getFullYear()}-${now.getMonth() + 1}`,
      name: `${seasonNames[now.getMonth()]} ${now.getFullYear()}`,
      startDate: monthStart,
      endDate: monthEnd,
      isActive: true,
      rewards: this.getSeasonRewards(),
    }
  }

  /**
   * Get season rewards
   */
  private static getSeasonRewards(): SeasonReward[] {
    return [
      {
        rank: 1,
        title: 'Seasonal Champion',
        badge: '👑',
        description: 'Legendary title and exclusive avatar',
      },
      {
        rank: 2,
        title: 'Seasonal Master',
        badge: '🥈',
        description: 'Epic title and special badge',
      },
      {
        rank: 3,
        title: 'Seasonal Expert',
        badge: '🥉',
        description: 'Rare title and achievement',
      },
      {
        rank: 10,
        title: 'Top 10 Finisher',
        badge: '🏆',
        description: 'Elite recognition',
      },
      {
        rank: 100,
        title: 'Top 100 Finisher',
        badge: '🎖️',
        description: 'Seasonal badge',
      },
    ]
  }

  /**
   * Calculate user stats for leaderboard
   */
  private static async calculateUserStats(
    prisma: PrismaClient,
    userId: string
  ): Promise<any> {
    const [workouts, sets, prs, streakData] = await Promise.all([
      prisma.workoutSession.count({
        where: { userId, completed: true },
      }),
      prisma.setEntry.findMany({
        where: { session: { userId } },
        select: { weight: true, reps: true },
      }),
      prisma.achievement.count({
        where: { userId, type: 'pr' },
      }),
      prisma.streak.findUnique({
        where: { userId },
        select: { current: true },
      }),
    ])

    const totalVolume = sets.reduce((sum, s) => sum + (s.weight * s.reps), 0)
    const workoutXP = workouts * 50
    const volumeXP = Math.floor(totalVolume / 1000) * 5
    const prXP = prs * 100
    const streakXP = (streakData?.current || 0) * 10
    const totalXP = workoutXP + volumeXP + prXP + streakXP
    
    const level = Math.floor(Math.sqrt(totalXP / 100)) + 1
    
    return {
      level,
      power: Math.floor(totalXP / 10),
      strength: Math.min(Math.floor(totalVolume / 1000), 500),
      endurance: Math.min(workouts * 3, 500),
      volume: totalVolume,
      workouts,
      prs,
      streak: streakData?.current || 0,
      guildTag: undefined, // Would fetch from guild membership
    }
  }

  /**
   * Get value by category
   */
  private static getValueByCategory(stats: any, category: LeaderboardCategory): number {
    switch (category) {
      case 'level':
        return stats.level
      case 'power':
        return stats.power
      case 'strength':
        return stats.strength
      case 'endurance':
        return stats.endurance
      case 'volume':
        return stats.volume
      case 'workouts':
        return stats.workouts
      case 'prs':
        return stats.prs
      case 'streak':
        return stats.streak
      default:
        return stats.power
    }
  }

  /**
   * Get rank badge
   */
  static getRankBadge(rank: number): string {
    if (rank === 1) return '👑'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    if (rank <= 10) return '🏆'
    if (rank <= 50) return '🎖️'
    if (rank <= 100) return '🏅'
    return ''
  }

  /**
   * Get rank color
   */
  static getRankColor(rank: number): string {
    if (rank === 1) return 'text-yellow-400'
    if (rank === 2) return 'text-gray-400'
    if (rank === 3) return 'text-orange-400'
    if (rank <= 10) return 'text-purple-400'
    if (rank <= 50) return 'text-blue-400'
    if (rank <= 100) return 'text-green-400'
    return 'text-gray-500'
  }

  /**
   * Format value for display
   */
  static formatValue(value: number, category: LeaderboardCategory): string {
    switch (category) {
      case 'volume':
        return `${(value / 1000).toFixed(1)}k kg`
      case 'workouts':
        return `${value} workouts`
      case 'prs':
        return `${value} PRs`
      case 'streak':
        return `${value} days`
      case 'power':
      case 'strength':
      case 'endurance':
        return value.toLocaleString()
      default:
        return value.toString()
    }
  }

  /**
   * Get category icon
   */
  static getCategoryIcon(category: LeaderboardCategory): string {
    const icons: Record<LeaderboardCategory, string> = {
      level: '⭐',
      power: '⚡',
      strength: '💪',
      endurance: '🏃',
      volume: '🏋️',
      workouts: '🎯',
      prs: '🏆',
      streak: '🔥',
    }
    return icons[category]
  }
}

