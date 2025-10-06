/**
 * Guild/Clan System - Database Integration
 * Social features for team-based progression
 */

import { PrismaClient, GuildRank, GuildRole, GuildActivityType } from '@prisma/client'

export type { GuildRole, GuildRank, GuildActivityType }

export interface Guild {
  id: string
  name: string
  tag: string
  description: string | null
  motto: string | null
  level: number
  xp: number
  xpForNextLevel: number
  rank: GuildRank
  memberCount: number
  maxMembers: number
  members: GuildMember[]
  totalWorkouts: number
  totalVolume: number
  weeklyGoal: number
  weeklyProgress: number
  achievements: string[]
  isPublic: boolean
  requiresApproval: boolean
  minLevelRequired: number
  icon: string
  banner?: string
  color: string
  createdAt: Date
  createdBy: string
}

export interface GuildMember {
  userId: string
  username: string
  role: GuildRole
  level: number
  powerLevel: number
  weeklyWorkouts: number
  weeklyVolume: number
  totalContribution: number
  isOnline: boolean
  lastSeen: Date
  joinedAt: Date
  avatar: string
  title?: string
}

export interface GuildActivity {
  id: string
  type: GuildActivityType
  userId: string
  username: string
  description: string
  timestamp: Date
  icon: string
}

export class GuildSystemDB {
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
      // Check uniqueness
      const [existingTag, existingName] = await Promise.all([
        prisma.guild.findUnique({ where: { tag: data.tag } }),
        prisma.guild.findUnique({ where: { name: data.name } }),
      ])

      if (existingTag) return { success: false, error: 'Guild tag already taken' }
      if (existingName) return { success: false, error: 'Guild name already taken' }

      // Create guild
      const dbGuild = await prisma.guild.create({
        data: {
          name: data.name,
          tag: data.tag,
          description: data.description,
          motto: data.motto ?? null,
          level: 1,
          xp: 0,
          xpForNextLevel: 1000,
          rank: GuildRank.BRONZE,
          maxMembers: 20,
          totalWorkouts: 0,
          totalVolume: 0,
          weeklyGoal: 100,
          weeklyProgress: 0,
          isPublic: data.isPublic,
          requiresApproval: !data.isPublic,
          minLevelRequired: data.minLevelRequired,
          icon: this.getRandomGuildIcon(),
          color: this.getRandomGuildColor(),
          createdById: userId,
        },
        include: { members: true, achievements: true },
      })

      // Add creator as guild leader
      await prisma.guildMember.create({
        data: {
          guildId: dbGuild.id,
          userId,
          role: GuildRole.LEADER,
        },
      })

      return { success: true, guild: this.transformDbGuild(dbGuild) }
    } catch (_error) {
      return { success: false, error: 'Failed to create guild' }
    }
  }

  /**
   * Get all guilds with filters
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
    const dbGuilds = await prisma.guild.findMany({
      where: {
        ...(filters?.minLevel && { level: { gte: filters.minLevel } }),
        ...(filters?.maxLevel && { level: { lte: filters.maxLevel } }),
        ...(filters?.rank && { rank: filters.rank }),
        ...(filters?.isPublic !== undefined && { isPublic: filters.isPublic }),
      },
      include: { members: true, achievements: true },
      orderBy: { xp: 'desc' },
    })
    return dbGuilds.map(g => this.transformDbGuild(g))
  }

  /**
   * Get guild by ID
   */
  static async getGuildById(prisma: PrismaClient, guildId: string): Promise<Guild | null> {
    const dbGuild = await prisma.guild.findUnique({
      where: { id: guildId },
      include: { members: true, achievements: true },
    })
    return dbGuild ? this.transformDbGuild(dbGuild) : null
  }

  /**
   * Add member to guild
   */
  static async addMember(
    prisma: PrismaClient,
    guildId: string,
    userId: string,
    role: GuildRole = GuildRole.MEMBER
  ): Promise<{ success: boolean; message: string }> {
    try {
      await prisma.guildMember.create({
        data: { guildId, userId, role },
      })
      return { success: true, message: 'Joined guild successfully!' }
    } catch (_error) {
      return { success: false, message: 'Failed to join guild' }
    }
  }

  /**
   * Remove member from guild
   */
  static async removeMember(
    prisma: PrismaClient,
    guildId: string,
    userId: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      await prisma.guildMember.deleteMany({
        where: { guildId, userId },
      })
      return { success: true, message: 'Left guild successfully' }
    } catch (_error) {
      return { success: false, message: 'Failed to leave guild' }
    }
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
    try {
      await prisma.guildMember.updateMany({
        where: { guildId, userId },
        data: { role: newRole },
      })
      return { success: true, message: `Role updated to ${newRole}` }
    } catch (_error) {
      return { success: false, message: 'Failed to update role' }
    }
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
    try {
      const guild = await prisma.guild.update({
        where: { id: guildId },
        data: {
          xp: { increment: contribution.xp },
          totalVolume: { increment: contribution.volume },
          totalWorkouts: { increment: contribution.workouts },
          weeklyProgress: { increment: contribution.workouts },
        },
      })

      // Update member contribution
      await prisma.guildMember.updateMany({
        where: { guildId, userId },
        data: {
          contributedXp: { increment: contribution.xp },
          contributedVolume: { increment: contribution.volume },
          lastActiveAt: new Date(),
        },
      })

      // Check for level up
      const leveledUp = guild.xp >= guild.xpForNextLevel
      if (leveledUp) {
        const newLevel = guild.level + 1
        await prisma.guild.update({
          where: { id: guildId },
          data: {
            level: newLevel,
            xpForNextLevel: this.calculateXpForLevel(newLevel + 1),
            rank: this.calculateGuildRank(guild.xp),
            maxMembers: this.getMaxMembers(newLevel),
          },
        })
        return { success: true, leveledUp: true, newLevel }
      }

      return { success: true, leveledUp: false }
    } catch (_error) {
      return { success: false, leveledUp: false }
    }
  }

  /**
   * Get guild activity feed
   */
  static async getGuildActivity(
    prisma: PrismaClient,
    guildId: string,
    limit: number = 50
  ): Promise<GuildActivity[]> {
    const dbActivity = await prisma.guildActivity.findMany({
      where: { guildId },
      orderBy: { timestamp: 'desc' },
      take: limit,
      include: { user: { select: { name: true, email: true } } },
    })
    return dbActivity.map(a => ({
      id: a.id,
      type: a.type,
      userId: a.userId,
      username: a.user.name || a.user.email.split('@')[0],
      description: a.description,
      timestamp: a.timestamp,
      icon: a.icon,
    }))
  }

  /**
   * Log guild activity
   */
  static async logActivity(
    prisma: PrismaClient,
    guildId: string,
    userId: string,
    type: GuildActivityType,
    description: string,
    icon: string = '💪'
  ): Promise<void> {
    await prisma.guildActivity.create({
      data: { guildId, userId, type, description, icon },
    })
  }

  /**
   * Get guild leaderboard
   */
  static async getGuildLeaderboard(
    prisma: PrismaClient,
    sortBy: 'xp' | 'level' | 'members' | 'volume' = 'xp',
    limit: number = 100
  ): Promise<Guild[]> {
    const orderBy = sortBy === 'members'
      ? { members: { _count: 'desc' } as const }
      : sortBy === 'volume'
      ? { totalVolume: 'desc' as const }
      : sortBy === 'level'
      ? { level: 'desc' as const }
      : { xp: 'desc' as const }

    const dbGuilds = await prisma.guild.findMany({
      where: { isPublic: true },
      take: limit,
      orderBy,
      include: { members: true, achievements: true },
    })

    return dbGuilds.map(g => this.transformDbGuild(g))
  }

  // Helper functions
  private static transformDbGuild(dbGuild: {
    id: string;
    name: string;
    tag: string;
    description: string | null;
    motto: string | null;
    level: number;
    xp: number;
    xpForNextLevel: number;
    rank: GuildRank;
    maxMembers: number;
    totalWorkouts: number;
    totalVolume: number;
    weeklyGoal: number;
    weeklyProgress: number;
    isPublic: boolean;
    requiresApproval: boolean;
    minLevelRequired: number;
    icon: string;
    color: string;
    createdAt: Date;
    createdById: string;
    members?: unknown[];
    achievements?: { title: string }[];
  }): Guild {
    return {
      id: dbGuild.id,
      name: dbGuild.name,
      tag: dbGuild.tag,
      description: dbGuild.description,
      motto: dbGuild.motto,
      level: dbGuild.level,
      xp: dbGuild.xp,
      xpForNextLevel: dbGuild.xpForNextLevel,
      rank: dbGuild.rank,
      memberCount: dbGuild.members?.length || 0,
      maxMembers: dbGuild.maxMembers,
      members: [],
      totalWorkouts: dbGuild.totalWorkouts,
      totalVolume: dbGuild.totalVolume,
      weeklyGoal: dbGuild.weeklyGoal,
      weeklyProgress: dbGuild.weeklyProgress,
      achievements: dbGuild.achievements?.map((a) => a.title) || [],
      isPublic: dbGuild.isPublic,
      requiresApproval: dbGuild.requiresApproval,
      minLevelRequired: dbGuild.minLevelRequired,
      icon: dbGuild.icon,
      color: dbGuild.color,
      createdAt: dbGuild.createdAt,
      createdBy: dbGuild.createdById,
    }
  }

  static getRankColor(rank: GuildRank): string {
    const colors: Record<GuildRank, string> = {
      BRONZE: 'from-orange-700 to-orange-900',
      SILVER: 'from-gray-400 to-gray-600',
      GOLD: 'from-yellow-400 to-yellow-600',
      PLATINUM: 'from-cyan-400 to-cyan-600',
      DIAMOND: 'from-blue-400 to-blue-600',
      LEGENDARY: 'from-purple-400 via-pink-500 to-red-500',
    }
    return colors[rank]
  }

  static calculateGuildRank(xp: number): GuildRank {
    if (xp >= 1000000) return GuildRank.LEGENDARY
    if (xp >= 500000) return GuildRank.DIAMOND
    if (xp >= 100000) return GuildRank.PLATINUM
    if (xp >= 50000) return GuildRank.GOLD
    if (xp >= 10000) return GuildRank.SILVER
    return GuildRank.BRONZE
  }

  static getMaxMembers(level: number): number {
    return Math.min(20 + level * 2, 100)
  }

  static calculateXpForLevel(level: number): number {
    return Math.floor(1000 * Math.pow(1.5, level - 1))
  }

  private static getRandomGuildIcon(): string {
    const icons = ['⚔️', '🛡️', '👑', '🔥', '⚡', '💪', '🏆', '🦁', '🐉', '🦅']
    return icons[Math.floor(Math.random() * icons.length)]
  }

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
}
