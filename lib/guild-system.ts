/**
 * Guild/Clan System
 * Social features for team-based progression
 */

import { PrismaClient } from '@prisma/client'

export type GuildRole = 'master' | 'officer' | 'member' | 'recruit'
export type GuildRank = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'legendary'

export interface Guild {
  id: string
  name: string
  tag: string // [TAG] format
  description: string
  motto?: string
  
  // Stats
  level: number
  xp: number
  xpForNextLevel: number
  rank: GuildRank
  
  // Members
  memberCount: number
  maxMembers: number
  members: GuildMember[]
  
  // Activity
  totalWorkouts: number
  totalVolume: number
  weeklyGoal: number
  weeklyProgress: number
  
  // Achievements
  achievements: string[]
  
  // Settings
  isPublic: boolean
  requiresApproval: boolean
  minLevelRequired: number
  
  // Visual
  icon: string
  banner?: string
  color: string
  
  // Metadata
  createdAt: Date
  createdBy: string
}

export interface GuildMember {
  userId: string
  username: string
  role: GuildRole
  level: number
  powerLevel: number
  
  // Contribution
  weeklyWorkouts: number
  weeklyVolume: number
  totalContribution: number
  
  // Status
  isOnline: boolean
  lastSeen: Date
  joinedAt: Date
  
  // Visual
  avatar: string
  title?: string
}

export interface GuildActivity {
  id: string
  type: 'workout' | 'achievement' | 'levelup' | 'pr' | 'join' | 'leave'
  userId: string
  username: string
  description: string
  timestamp: Date
  icon: string
}

export class GuildSystem {
  /**
   * Create a new guild
   */
  static async createGuild(
    prisma: PrismaClient,
    userId: string,
    data: {
      name: string
      tag: string
      description: string
      motto?: string
      isPublic: boolean
      minLevelRequired: number
    }
  ): Promise<{ success: boolean; guild?: Guild; error?: string }> {
    try {
      // Check if tag is unique
      const existingTag = await this.findGuildByTag(prisma, data.tag)
      if (existingTag) {
        return { success: false, error: 'Guild tag already taken' }
      }
      
      // Check if name is unique
      const existingName = await this.findGuildByName(prisma, data.name)
      if (existingName) {
        return { success: false, error: 'Guild name already taken' }
      }
      
      // Create guild (in full implementation, this would save to database)
      const guild: Guild = {
        id: `guild-${Date.now()}`,
        name: data.name,
        tag: data.tag,
        description: data.description,
        motto: data.motto,
        level: 1,
        xp: 0,
        xpForNextLevel: 1000,
        rank: 'bronze',
        memberCount: 1,
        maxMembers: 10, // Increases with guild level
        members: [],
        totalWorkouts: 0,
        totalVolume: 0,
        weeklyGoal: 100,
        weeklyProgress: 0,
        achievements: [],
        isPublic: data.isPublic,
        requiresApproval: !data.isPublic,
        minLevelRequired: data.minLevelRequired,
        icon: this.getRandomGuildIcon(),
        color: this.getRandomGuildColor(),
        createdAt: new Date(),
        createdBy: userId,
      }
      
      return { success: true, guild }
    } catch (error) {
      return { success: false, error: 'Failed to create guild' }
    }
  }

  /**
   * Get guild by tag
   */
  static async findGuildByTag(prisma: PrismaClient, tag: string): Promise<Guild | null> {
    // In full implementation, query from database
    return null
  }

  /**
   * Get guild by name
   */
  static async findGuildByName(prisma: PrismaClient, name: string): Promise<Guild | null> {
    // In full implementation, query from database
    return null
  }

  /**
   * Get all guilds (for browsing)
   */
  static async getAllGuilds(
    prisma: PrismaClient,
    filters?: {
      minLevel?: number
      maxLevel?: number
      rank?: GuildRank
      isPublic?: boolean
    }
  ): Promise<Guild[]> {
    // In full implementation, query from database with filters
    return this.getMockGuilds()
  }

  /**
   * Get guild leaderboard
   */
  static async getGuildLeaderboard(
    prisma: PrismaClient,
    sortBy: 'xp' | 'level' | 'members' | 'volume' = 'xp'
  ): Promise<Guild[]> {
    const guilds = await this.getAllGuilds(prisma)
    
    switch (sortBy) {
      case 'level':
        return guilds.sort((a, b) => b.level - a.level)
      case 'members':
        return guilds.sort((a, b) => b.memberCount - a.memberCount)
      case 'volume':
        return guilds.sort((a, b) => b.totalVolume - a.totalVolume)
      default:
        return guilds.sort((a, b) => b.xp - a.xp)
    }
  }

  /**
   * Add member to guild
   */
  static async addMember(
    prisma: PrismaClient,
    guildId: string,
    userId: string,
    role: GuildRole = 'member'
  ): Promise<{ success: boolean; message: string }> {
    // In full implementation, add to database
    return { success: true, message: 'Joined guild successfully!' }
  }

  /**
   * Remove member from guild
   */
  static async removeMember(
    prisma: PrismaClient,
    guildId: string,
    userId: string
  ): Promise<{ success: boolean; message: string }> {
    // In full implementation, remove from database
    return { success: true, message: 'Left guild successfully' }
  }

  /**
   * Update member role
   */
  static async updateMemberRole(
    prisma: PrismaClient,
    guildId: string,
    userId: string,
    newRole: GuildRole
  ): Promise<{ success: boolean; message: string }> {
    // In full implementation, update in database
    return { success: true, message: `Role updated to ${newRole}` }
  }

  /**
   * Contribute to guild (workout completed)
   */
  static async contributeToGuild(
    prisma: PrismaClient,
    guildId: string,
    userId: string,
    contribution: {
      xp: number
      volume: number
      workouts: number
    }
  ): Promise<{ success: boolean; leveledUp: boolean; newLevel?: number }> {
    // In full implementation, update guild stats
    return { success: true, leveledUp: false }
  }

  /**
   * Get guild activity feed
   */
  static async getGuildActivity(
    prisma: PrismaClient,
    guildId: string,
    limit: number = 50
  ): Promise<GuildActivity[]> {
    // In full implementation, query from database
    return this.getMockActivity()
  }

  /**
   * Get guild rank color
   */
  static getRankColor(rank: GuildRank): string {
    const colors: Record<GuildRank, string> = {
      bronze: 'from-orange-700 to-orange-900',
      silver: 'from-gray-400 to-gray-600',
      gold: 'from-yellow-400 to-yellow-600',
      platinum: 'from-cyan-400 to-cyan-600',
      diamond: 'from-blue-400 to-blue-600',
      legendary: 'from-purple-400 via-pink-500 to-red-500',
    }
    return colors[rank]
  }

  /**
   * Calculate guild rank from XP
   */
  static calculateGuildRank(xp: number): GuildRank {
    if (xp >= 1000000) return 'legendary'
    if (xp >= 500000) return 'diamond'
    if (xp >= 100000) return 'platinum'
    if (xp >= 50000) return 'gold'
    if (xp >= 10000) return 'silver'
    return 'bronze'
  }

  /**
   * Get max members for guild level
   */
  static getMaxMembers(level: number): number {
    return Math.min(10 + level * 2, 100) // Max 100 members
  }

  /**
   * Random guild icon
   */
  private static getRandomGuildIcon(): string {
    const icons = ['⚔️', '🛡️', '👑', '🔥', '⚡', '💪', '🏆', '🦁', '🐉', '🦅']
    return icons[Math.floor(Math.random() * icons.length)]
  }

  /**
   * Random guild color
   */
  private static getRandomGuildColor(): string {
    const colors = [
      'from-red-500 to-red-700',
      'from-blue-500 to-blue-700',
      'from-green-500 to-green-700',
      'from-purple-500 to-purple-700',
      'from-yellow-500 to-yellow-700',
      'from-cyan-500 to-cyan-700',
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  /**
   * Mock guilds for demo
   */
  private static getMockGuilds(): Guild[] {
    return [
      {
        id: 'guild-1',
        name: 'Iron Legion',
        tag: '[IRON]',
        description: 'Forged in fire, tempered by discipline',
        motto: 'Strength through unity',
        level: 25,
        xp: 125000,
        xpForNextLevel: 150000,
        rank: 'platinum',
        memberCount: 42,
        maxMembers: 60,
        members: [],
        totalWorkouts: 2500,
        totalVolume: 1250000,
        weeklyGoal: 500,
        weeklyProgress: 342,
        achievements: ['First Blood', 'Volume Kings', 'Consistency Masters'],
        isPublic: true,
        requiresApproval: true,
        minLevelRequired: 20,
        icon: '⚔️',
        color: 'from-gray-600 to-gray-800',
        createdAt: new Date('2025-01-01'),
        createdBy: 'user-1',
      },
      {
        id: 'guild-2',
        name: 'Phoenix Rising',
        tag: '[PHX]',
        description: 'From ashes we rise stronger',
        motto: 'Never give up',
        level: 18,
        xp: 85000,
        xpForNextLevel: 100000,
        rank: 'gold',
        memberCount: 28,
        maxMembers: 46,
        members: [],
        totalWorkouts: 1800,
        totalVolume: 850000,
        weeklyGoal: 300,
        weeklyProgress: 215,
        achievements: ['Comeback Kings', 'PR Crushers'],
        isPublic: true,
        requiresApproval: false,
        minLevelRequired: 10,
        icon: '🔥',
        color: 'from-red-500 to-orange-600',
        createdAt: new Date('2025-02-15'),
        createdBy: 'user-2',
      },
      {
        id: 'guild-3',
        name: 'Thunder Squad',
        tag: '[THDR]',
        description: 'Strike fast, strike hard',
        level: 12,
        xp: 42000,
        xpForNextLevel: 50000,
        rank: 'silver',
        memberCount: 15,
        maxMembers: 34,
        members: [],
        totalWorkouts: 950,
        totalVolume: 420000,
        weeklyGoal: 200,
        weeklyProgress: 128,
        achievements: ['Speed Demons'],
        isPublic: true,
        requiresApproval: false,
        minLevelRequired: 5,
        icon: '⚡',
        color: 'from-yellow-400 to-yellow-600',
        createdAt: new Date('2025-03-20'),
        createdBy: 'user-3',
      },
    ]
  }

  /**
   * Mock activity for demo
   */
  private static getMockActivity(): GuildActivity[] {
    return [
      {
        id: '1',
        type: 'workout',
        userId: 'user-1',
        username: 'John',
        description: 'completed Heavy Strength Training',
        timestamp: new Date(Date.now() - 1000 * 60 * 15),
        icon: '💪',
      },
      {
        id: '2',
        type: 'pr',
        userId: 'user-2',
        username: 'Sarah',
        description: 'hit new PR on Bench Press (120kg)',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        icon: '🏆',
      },
      {
        id: '3',
        type: 'achievement',
        userId: 'user-3',
        username: 'Mike',
        description: 'unlocked "10 Day Streak" achievement',
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        icon: '🎖️',
      },
      {
        id: '4',
        type: 'levelup',
        userId: 'user-1',
        username: 'John',
        description: 'reached Level 42',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        icon: '⭐',
      },
      {
        id: '5',
        type: 'join',
        userId: 'user-4',
        username: 'Emma',
        description: 'joined the guild',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
        icon: '👋',
      },
    ]
  }
}

