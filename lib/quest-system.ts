/**
 * Quest System
 * Transform workouts into RPG-style quests with daily, weekly, raids, and boss battles
 */

import { PrismaClient } from '@prisma/client'

export type QuestType = 'daily' | 'weekly' | 'raid' | 'boss' | 'story' | 'side'
export type QuestDifficulty = 'easy' | 'medium' | 'hard' | 'nightmare'
export type QuestStatus = 'available' | 'active' | 'completed' | 'failed'

export interface Quest {
  id: string
  type: QuestType
  title: string
  description: string
  difficulty: QuestDifficulty
  status: QuestStatus
  
  // Requirements
  requirements: QuestRequirement[]
  
  // Progress
  progress: number // 0-100%
  currentValue: number
  targetValue: number
  
  // Rewards
  rewards: QuestReward[]
  
  // Metadata
  expiresAt?: Date
  completedAt?: Date
  icon: string
  tags: string[]
}

export interface QuestRequirement {
  type: 'workout' | 'sets' | 'reps' | 'weight' | 'volume' | 'exercise' | 'streak' | 'rpe'
  description: string
  current: number
  target: number
  unit?: string
}

export interface QuestReward {
  type: 'xp' | 'loot' | 'achievement' | 'title' | 'unlock'
  amount?: number
  name?: string
  description: string
  icon: string
}

export class QuestSystem {
  /**
   * Generate daily quests (reset every 24 hours)
   */
  static generateDailyQuests(userLevel: number, stats: any): Quest[] {
    const quests: Quest[] = []
    
    // Quest 1: Complete any workout
    quests.push({
      id: 'daily-workout',
      type: 'daily',
      title: 'Daily Training',
      description: 'Complete 1 workout session',
      difficulty: 'easy',
      status: 'available',
      requirements: [{
        type: 'workout',
        description: 'Complete workout',
        current: 0,
        target: 1,
      }],
      progress: 0,
      currentValue: 0,
      targetValue: 1,
      rewards: [
        { type: 'xp', amount: 50, description: '50 XP', icon: '⭐' },
        { type: 'loot', name: 'Common Chest', description: 'Random reward', icon: '📦' },
      ],
      expiresAt: this.getNextDayReset(),
      icon: '🎯',
      tags: ['daily', 'workout'],
    })
    
    // Quest 2: Volume challenge
    const volumeTarget = Math.max(1000, userLevel * 100)
    quests.push({
      id: 'daily-volume',
      type: 'daily',
      title: 'Volume Crusher',
      description: `Lift ${volumeTarget.toLocaleString()}kg total volume`,
      difficulty: 'medium',
      status: 'available',
      requirements: [{
        type: 'volume',
        description: 'Total volume lifted',
        current: 0,
        target: volumeTarget,
        unit: 'kg',
      }],
      progress: 0,
      currentValue: 0,
      targetValue: volumeTarget,
      rewards: [
        { type: 'xp', amount: 75, description: '75 XP', icon: '⭐' },
        { type: 'loot', name: 'Uncommon Chest', description: 'Better rewards', icon: '🎁' },
      ],
      expiresAt: this.getNextDayReset(),
      icon: '💪',
      tags: ['daily', 'volume'],
    })
    
    // Quest 3: High intensity (RPE challenge)
    quests.push({
      id: 'daily-intensity',
      type: 'daily',
      title: 'Forge the Fire',
      description: 'Complete 5 sets at RPE 8+',
      difficulty: 'hard',
      status: 'available',
      requirements: [{
        type: 'rpe',
        description: 'High RPE sets',
        current: 0,
        target: 5,
      }],
      progress: 0,
      currentValue: 0,
      targetValue: 5,
      rewards: [
        { type: 'xp', amount: 100, description: '100 XP', icon: '⭐' },
        { type: 'loot', name: 'Rare Chest', description: 'Epic loot inside', icon: '💎' },
      ],
      expiresAt: this.getNextDayReset(),
      icon: '🔥',
      tags: ['daily', 'intensity'],
    })
    
    return quests
  }

  /**
   * Generate weekly quests (reset every Monday)
   */
  static generateWeeklyQuests(userLevel: number): Quest[] {
    const quests: Quest[] = []
    
    // Quest 1: Workout frequency
    const workoutsTarget = Math.min(3 + Math.floor(userLevel / 20), 7)
    quests.push({
      id: 'weekly-frequency',
      type: 'weekly',
      title: 'Consistency Master',
      description: `Complete ${workoutsTarget} workouts this week`,
      difficulty: 'medium',
      status: 'available',
      requirements: [{
        type: 'workout',
        description: 'Workouts completed',
        current: 0,
        target: workoutsTarget,
      }],
      progress: 0,
      currentValue: 0,
      targetValue: workoutsTarget,
      rewards: [
        { type: 'xp', amount: 200, description: '200 XP', icon: '⭐' },
        { type: 'loot', name: 'Epic Chest', description: 'Weekly rewards', icon: '🏆' },
        { type: 'achievement', name: 'Weekly Warrior', description: 'Unlock achievement', icon: '🎖️' },
      ],
      expiresAt: this.getNextWeekReset(),
      icon: '📅',
      tags: ['weekly', 'consistency'],
    })
    
    // Quest 2: Total volume challenge
    const weeklyVolumeTarget = userLevel * 1000
    quests.push({
      id: 'weekly-volume',
      type: 'weekly',
      title: 'Volume Legend',
      description: `Lift ${weeklyVolumeTarget.toLocaleString()}kg this week`,
      difficulty: 'hard',
      status: 'available',
      requirements: [{
        type: 'volume',
        description: 'Total volume',
        current: 0,
        target: weeklyVolumeTarget,
        unit: 'kg',
      }],
      progress: 0,
      currentValue: 0,
      targetValue: weeklyVolumeTarget,
      rewards: [
        { type: 'xp', amount: 300, description: '300 XP', icon: '⭐' },
        { type: 'loot', name: 'Legendary Chest', description: 'Massive rewards', icon: '👑' },
      ],
      expiresAt: this.getNextWeekReset(),
      icon: '⚡',
      tags: ['weekly', 'volume'],
    })
    
    return quests
  }

  /**
   * Generate raid quests (special multi-part challenges)
   */
  static generateRaidQuests(userLevel: number): Quest[] {
    const quests: Quest[] = []
    
    // Raid: Full body domination
    quests.push({
      id: 'raid-fullbody',
      type: 'raid',
      title: '⚔️ RAID: Full Body Domination',
      description: 'Complete Push, Pull, and Legs in one week',
      difficulty: 'nightmare',
      status: 'available',
      requirements: [
        { type: 'exercise', description: 'Push workout', current: 0, target: 1 },
        { type: 'exercise', description: 'Pull workout', current: 0, target: 1 },
        { type: 'exercise', description: 'Legs workout', current: 0, target: 1 },
      ],
      progress: 0,
      currentValue: 0,
      targetValue: 3,
      rewards: [
        { type: 'xp', amount: 500, description: '500 XP', icon: '⭐' },
        { type: 'loot', name: 'Mythic Chest', description: 'Ultimate rewards', icon: '🔮' },
        { type: 'title', name: 'Raid Conqueror', description: 'Earn title', icon: '🏅' },
      ],
      expiresAt: this.getNextWeekReset(),
      icon: '⚔️',
      tags: ['raid', 'challenge'],
    })
    
    return quests
  }

  /**
   * Generate boss battles (major milestones)
   */
  static generateBossBattles(userLevel: number): Quest[] {
    const quests: Quest[] = []
    
    // Boss: The Iron Giant (strength challenge)
    if (userLevel >= 20) {
      quests.push({
        id: 'boss-iron-giant',
        type: 'boss',
        title: '👹 BOSS: The Iron Giant',
        description: 'Defeat the boss by hitting a new PR on any major lift',
        difficulty: 'nightmare',
        status: 'available',
        requirements: [{
          type: 'exercise',
          description: 'Set new PR on compound lift',
          current: 0,
          target: 1,
        }],
        progress: 0,
        currentValue: 0,
        targetValue: 1,
        rewards: [
          { type: 'xp', amount: 1000, description: '1,000 XP', icon: '⭐' },
          { type: 'loot', name: 'Boss Chest', description: 'Legendary rewards', icon: '💀' },
          { type: 'achievement', name: 'Giant Slayer', description: 'Unlock achievement', icon: '🏆' },
          { type: 'unlock', name: 'Advanced Techniques', description: 'Unlock new exercises', icon: '🔓' },
        ],
        icon: '👹',
        tags: ['boss', 'pr', 'strength'],
      })
    }
    
    // Boss: The Endurance Demon (cardio challenge)
    if (userLevel >= 30) {
      quests.push({
        id: 'boss-endurance-demon',
        type: 'boss',
        title: '😈 BOSS: The Endurance Demon',
        description: 'Complete a 60-minute workout session',
        difficulty: 'nightmare',
        status: 'available',
        requirements: [{
          type: 'workout',
          description: 'Workout duration',
          current: 0,
          target: 60,
          unit: 'min',
        }],
        progress: 0,
        currentValue: 0,
        targetValue: 60,
        rewards: [
          { type: 'xp', amount: 1000, description: '1,000 XP', icon: '⭐' },
          { type: 'loot', name: 'Boss Chest', description: 'Legendary rewards', icon: '💀' },
          { type: 'achievement', name: 'Demon Hunter', description: 'Unlock achievement', icon: '🏆' },
        ],
        icon: '😈',
        tags: ['boss', 'endurance', 'cardio'],
      })
    }
    
    return quests
  }

  /**
   * Get all available quests for a user
   */
  static async getAllQuests(
    prisma: PrismaClient,
    userId: string,
    userLevel: number,
    stats: any
  ): Promise<Quest[]> {
    const dailyQuests = this.generateDailyQuests(userLevel, stats)
    const weeklyQuests = this.generateWeeklyQuests(userLevel)
    const raidQuests = this.generateRaidQuests(userLevel)
    const bossQuests = this.generateBossBattles(userLevel)
    
    // Calculate progress for each quest
    const questsWithProgress = await Promise.all([
      ...dailyQuests.map((q) => this.calculateQuestProgress(prisma, userId, q)),
      ...weeklyQuests.map((q) => this.calculateQuestProgress(prisma, userId, q)),
      ...raidQuests.map((q) => this.calculateQuestProgress(prisma, userId, q)),
      ...bossQuests.map((q) => this.calculateQuestProgress(prisma, userId, q)),
    ])
    
    return questsWithProgress
  }

  /**
   * Calculate current progress for a quest
   */
  static async calculateQuestProgress(
    prisma: PrismaClient,
    userId: string,
    quest: Quest
  ): Promise<Quest> {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekStart = this.getWeekStart()
    
    // Get timeframe based on quest type
    const startDate = quest.type === 'daily' ? today : quest.type === 'weekly' ? weekStart : new Date(0)
    
    // Calculate progress based on requirements
    for (const req of quest.requirements) {
      switch (req.type) {
        case 'workout':
          req.current = await prisma.workoutSession.count({
            where: {
              userId,
              completed: true,
              date: { gte: startDate },
            },
          })
          break
          
        case 'volume':
          const sets = await prisma.setEntry.findMany({
            where: {
              session: {
                userId,
                date: { gte: startDate },
              },
            },
            select: { weight: true, reps: true },
          })
          req.current = sets.reduce((sum, s) => sum + (s.weight * s.reps), 0)
          break
          
        case 'rpe':
          req.current = await prisma.setEntry.count({
            where: {
              session: {
                userId,
                date: { gte: startDate },
              },
              rpe: { gte: 8 },
            },
          })
          break
      }
    }
    
    // Calculate overall progress
    quest.currentValue = quest.requirements.reduce((sum, r) => sum + r.current, 0)
    quest.progress = Math.min(100, (quest.currentValue / quest.targetValue) * 100)
    
    // Update status
    if (quest.progress >= 100) {
      quest.status = 'completed'
      quest.completedAt = new Date()
    } else if (quest.expiresAt && quest.expiresAt < now) {
      quest.status = 'failed'
    } else if (quest.progress > 0) {
      quest.status = 'active'
    }
    
    return quest
  }

  /**
   * Claim quest rewards
   */
  static claimQuestRewards(quest: Quest): {
    xp: number
    loot: any[]
    achievements: any[]
    unlocks: any[]
  } {
    const rewards = {
      xp: 0,
      loot: [] as any[],
      achievements: [] as any[],
      unlocks: [] as any[],
    }
    
    quest.rewards.forEach((reward) => {
      if (reward.type === 'xp' && reward.amount) {
        rewards.xp += reward.amount
      } else if (reward.type === 'loot') {
        rewards.loot.push({ name: reward.name, description: reward.description })
      } else if (reward.type === 'achievement') {
        rewards.achievements.push({ name: reward.name, description: reward.description })
      } else if (reward.type === 'unlock') {
        rewards.unlocks.push({ name: reward.name, description: reward.description })
      }
    })
    
    return rewards
  }

  /**
   * Helper: Get next day reset time (midnight)
   */
  private static getNextDayReset(): Date {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)
    return tomorrow
  }

  /**
   * Helper: Get next week reset time (Monday 00:00)
   */
  private static getNextWeekReset(): Date {
    const now = new Date()
    const nextMonday = new Date(now)
    nextMonday.setDate(now.getDate() + ((8 - now.getDay()) % 7 || 7))
    nextMonday.setHours(0, 0, 0, 0)
    return nextMonday
  }

  /**
   * Helper: Get start of current week (Monday 00:00)
   */
  private static getWeekStart(): Date {
    const now = new Date()
    const monday = new Date(now)
    const day = now.getDay()
    const diff = day === 0 ? -6 : 1 - day // Adjust for Sunday
    monday.setDate(now.getDate() + diff)
    monday.setHours(0, 0, 0, 0)
    return monday
  }
}

