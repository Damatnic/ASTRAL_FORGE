/**
 * Achievement Unlock System
 * Deterministic reward claiming - no RNG, clear progression paths
 */

import { PrismaClient } from '@prisma/client'

export interface UnlockResult {
  success: boolean
  alreadyUnlocked?: boolean
  unlocked?: Achievement | Template | Title | { id: string; name: string; unlockedAt: Date }
  message: string
}

export interface UserUnlocks {
  achievements: Achievement[]
  templates: Template[]
  features: string[]
  titles: Title[]
  stats: {
    totalAchievements: number
    totalTemplates: number
    totalFeatures: number
    totalTitles: number
  }
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon?: string
  tier?: string
  unlockedAt?: Date
}

export interface Template {
  id: string
  name: string
  description: string
  category?: string
  unlockedAt?: Date
}

export interface Title {
  id: string
  name: string
  description?: string
  grantedAt?: Date
  isActive?: boolean
}

export class AchievementUnlockSystem {
  /**
   * Check if an achievement is unlocked
   */
  static async isAchievementUnlocked(
    prisma: PrismaClient,
    userId: string,
    achievementTitle: string
  ): Promise<boolean> {
    const achievement = await prisma.achievement.findFirst({
      where: {
        userId,
        title: achievementTitle,
      },
    })
    
    return achievement !== null
  }

  /**
   * Unlock an achievement
   */
  static async unlockAchievement(
    prisma: PrismaClient,
    userId: string,
    achievementTitle: string,
    achievementType: string = 'quest',
    description: string = ''
  ): Promise<UnlockResult> {
    try {
      // Check if already unlocked
      const alreadyUnlocked = await this.isAchievementUnlocked(
        prisma,
        userId,
        achievementTitle
      )

      if (alreadyUnlocked) {
        return {
          success: true,
          alreadyUnlocked: true,
          message: 'Achievement already unlocked',
        }
      }

      // Create achievement record
      const achievement = await prisma.achievement.create({
        data: {
          userId,
          type: achievementType,
          title: achievementTitle,
          description: description || `Unlocked ${achievementTitle}`,
          earnedAt: new Date(),
        },
      })

      return {
        success: true,
        alreadyUnlocked: false,
        unlocked: {
          id: achievement.id,
          name: achievement.title,
          description: achievement.description,
          unlockedAt: achievement.earnedAt,
        },
        message: `Achievement unlocked: ${achievement.title}`,
      }
    } catch (error) {
      console.error('Error unlocking achievement:', error)
      return {
        success: false,
        message: 'Failed to unlock achievement',
      }
    }
  }

  /**
   * Get all unlocked achievements for a user
   */
  static async getUnlockedAchievements(
    prisma: PrismaClient,
    userId: string
  ): Promise<Achievement[]> {
    const achievements = await prisma.achievement.findMany({
      where: { userId },
      orderBy: { earnedAt: 'desc' },
    })

    return achievements.map((a) => ({
      id: a.id,
      name: a.title,
      description: a.description,
      tier: a.type,
      unlockedAt: a.earnedAt,
    }))
  }

  /**
   * Check if a workout template is unlocked
   */
  static async isTemplateUnlocked(
    prisma: PrismaClient,
    userId: string,
    templateName: string
  ): Promise<boolean> {
    // For now, use a simple string-based unlock system
    // We can store unlocked templates in UserUnlock table with type 'template'
    const unlock = await prisma.userUnlock?.findFirst({
      where: {
        userId,
        type: 'template',
        identifier: templateName,
      },
    })
    
    return unlock !== null
  }

  /**
   * Unlock a workout template
   */
  static async unlockTemplate(
    prisma: PrismaClient,
    userId: string,
    templateName: string,
    source?: string
  ): Promise<UnlockResult> {
    try {
      // Check if already unlocked
      const alreadyUnlocked = await this.isTemplateUnlocked(
        prisma,
        userId,
        templateName
      )

      if (alreadyUnlocked) {
        return {
          success: true,
          alreadyUnlocked: true,
          message: 'Template already unlocked',
        }
      }

      // Create unlock record
      await prisma.userUnlock?.create({
        data: {
          userId,
          type: 'template',
          identifier: templateName,
          source: source || 'quest',
          unlockedAt: new Date(),
        },
      })

      return {
        success: true,
        alreadyUnlocked: false,
        unlocked: { id: templateName, name: templateName, unlockedAt: new Date() },
        message: `Template unlocked: ${templateName}`,
      }
    } catch (error) {
      console.error('Error unlocking template:', error)
      return {
        success: false,
        message: 'Failed to unlock template',
      }
    }
  }

  /**
   * Check if a feature is unlocked
   */
  static async isFeatureUnlocked(
    prisma: PrismaClient,
    userId: string,
    featureId: string
  ): Promise<boolean> {
    const unlock = await prisma.userUnlock?.findFirst({
      where: {
        userId,
        type: 'feature',
        identifier: featureId,
      },
    })
    
    return unlock !== null
  }

  /**
   * Unlock a feature/metric
   */
  static async unlockFeature(
    prisma: PrismaClient,
    userId: string,
    featureId: string,
    source?: string
  ): Promise<UnlockResult> {
    try {
      // Check if already unlocked
      const alreadyUnlocked = await this.isFeatureUnlocked(
        prisma,
        userId,
        featureId
      )

      if (alreadyUnlocked) {
        return {
          success: true,
          alreadyUnlocked: true,
          message: 'Feature already unlocked',
        }
      }

      // Create unlock record
      await prisma.userUnlock?.create({
        data: {
          userId,
          type: 'feature',
          identifier: featureId,
          source: source || 'quest',
          unlockedAt: new Date(),
        },
      })

      return {
        success: true,
        alreadyUnlocked: false,
        unlocked: { id: featureId, name: featureId, unlockedAt: new Date() },
        message: `Feature unlocked: ${featureId}`,
      }
    } catch (error) {
      console.error('Error unlocking feature:', error)
      return {
        success: false,
        message: 'Failed to unlock feature',
      }
    }
  }

  /**
   * Grant a title to a user
   */
  static async grantTitle(
    prisma: PrismaClient,
    userId: string,
    titleName: string,
    source?: string
  ): Promise<UnlockResult> {
    try {
      // Check if already granted
      const existing = await prisma.userUnlock?.findFirst({
        where: {
          userId,
          type: 'title',
          identifier: titleName,
        },
      })

      if (existing) {
        return {
          success: true,
          alreadyUnlocked: true,
          message: 'Title already granted',
        }
      }

      // Grant title
      await prisma.userUnlock?.create({
        data: {
          userId,
          type: 'title',
          identifier: titleName,
          source: source || 'quest',
          unlockedAt: new Date(),
        },
      })

      return {
        success: true,
        alreadyUnlocked: false,
        unlocked: { id: titleName, name: titleName, grantedAt: new Date() },
        message: `Title granted: ${titleName}`,
      }
    } catch (error) {
      console.error('Error granting title:', error)
      return {
        success: false,
        message: 'Failed to grant title',
      }
    }
  }

  /**
   * Alias for grantTitle (for backwards compatibility)
   */
  static async unlockTitle(
    prisma: PrismaClient,
    userId: string,
    titleName: string,
    description?: string
  ): Promise<UnlockResult> {
    return this.grantTitle(prisma, userId, titleName, description || 'quest')
  }

  /**
   * Get all unlocks for a user (achievements, templates, features, titles)
   */
  static async getUserUnlocks(
    prisma: PrismaClient,
    userId: string
  ): Promise<UserUnlocks> {
    try {
      // Get achievements
      const achievements = await this.getUnlockedAchievements(prisma, userId)

      // Get other unlocks (templates, features, titles)
      const unlocks = await prisma.userUnlock?.findMany({
        where: { userId },
        orderBy: { unlockedAt: 'desc' },
      }) || []

      const templates = unlocks
        .filter((u: { type: string }) => u.type === 'template')
        .map((u: { identifier: string; unlockedAt: Date }) => ({
          id: u.identifier,
          name: u.identifier,
          description: '',
          unlockedAt: u.unlockedAt,
        }))

      const features = unlocks
        .filter((u: { type: string }) => u.type === 'feature')
        .map((u: { identifier: string }) => u.identifier)

      const titles = unlocks
        .filter((u: { type: string }) => u.type === 'title')
        .map((u: { identifier: string; unlockedAt: Date }) => ({
          id: u.identifier,
          name: u.identifier,
          grantedAt: u.unlockedAt,
          isActive: false,
        }))

      return {
        achievements,
        templates,
        features,
        titles,
        stats: {
          totalAchievements: achievements.length,
          totalTemplates: templates.length,
          totalFeatures: features.length,
          totalTitles: titles.length,
        },
      }
    } catch (error) {
      console.error('Error getting user unlocks:', error)
      return {
        achievements: [],
        templates: [],
        features: [],
        titles: [],
        stats: {
          totalAchievements: 0,
          totalTemplates: 0,
          totalFeatures: 0,
          totalTitles: 0,
        },
      }
    }
  }

  /**
   * Process quest rewards and unlock accordingly
   */
  static async processQuestRewards(
    prisma: PrismaClient,
    userId: string,
    rewards: Array<{
      type: 'xp' | 'achievement' | 'title' | 'unlock' | 'template'
      amount?: number
      name?: string
      description: string
    }>
  ): Promise<{
    xp: number
    unlocked: Array<{
      type: string
      name: string
      message: string
    }>
  }> {
    const results = {
      xp: 0,
      unlocked: [] as Array<{ type: string; name: string; message: string }>,
    }

    for (const reward of rewards) {
      if (reward.type === 'xp' && reward.amount) {
        results.xp += reward.amount
      } else if (reward.type === 'achievement' && reward.name) {
        const result = await this.unlockAchievement(prisma, userId, reward.name)
        if (result.success && !result.alreadyUnlocked) {
          results.unlocked.push({
            type: 'achievement',
            name: reward.name,
            message: result.message,
          })
        }
      } else if (reward.type === 'template' && reward.name) {
        const result = await this.unlockTemplate(prisma, userId, reward.name, 'quest')
        if (result.success && !result.alreadyUnlocked) {
          results.unlocked.push({
            type: 'template',
            name: reward.name,
            message: result.message,
          })
        }
      } else if (reward.type === 'unlock' && reward.name) {
        const result = await this.unlockFeature(prisma, userId, reward.name, 'quest')
        if (result.success && !result.alreadyUnlocked) {
          results.unlocked.push({
            type: 'feature',
            name: reward.name,
            message: result.message,
          })
        }
      } else if (reward.type === 'title' && reward.name) {
        const result = await this.grantTitle(prisma, userId, reward.name, 'quest')
        if (result.success && !result.alreadyUnlocked) {
          results.unlocked.push({
            type: 'title',
            name: reward.name,
            message: result.message,
          })
        }
      }
    }

    return results
  }
}
