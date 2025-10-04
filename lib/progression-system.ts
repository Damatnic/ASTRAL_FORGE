/**
 * 100-Level Progression System with Prestige & Paragon
 * Complete RPG-style leveling system
 */

export interface LevelData {
  level: number
  currentXP: number
  xpForNextLevel: number
  totalXP: number
  title: string
  tier: number
  prestige: number
  paragonLevel: number
}

export interface PrestigeData {
  prestige: number
  totalPrestige: number
  bonuses: {
    xpMultiplier: number
    statBoost: number
    specialAbility?: string
  }
}

// Level titles by tier (every 10 levels)
const LEVEL_TITLES = [
  'Novice',           // 1-9
  'Apprentice',       // 10-19
  'Warrior',          // 20-29
  'Adept',            // 30-39
  'Veteran',          // 40-49
  'Expert',           // 50-59
  'Master',           // 60-69
  'Grandmaster',      // 70-79
  'Champion',         // 80-89
  'Legend',           // 90-99
  'Ascended',         // 100
]

export class ProgressionSystem {
  /**
   * Calculate XP required for a specific level
   * Uses exponential curve for balanced progression
   */
  static getXPForLevel(level: number): number {
    if (level <= 1) return 0
    if (level > 100) {
      // Paragon levels: linear scaling after 100
      return 10000 + (level - 100) * 1000
    }
    
    // Formula: Base * (Level^2.5) for smooth exponential growth
    const base = 100
    const exponent = 2.5
    return Math.floor(base * Math.pow(level, exponent))
  }

  /**
   * Calculate total XP needed to reach a level
   */
  static getTotalXPForLevel(level: number): number {
    let total = 0
    for (let i = 2; i <= level; i++) {
      total += this.getXPForLevel(i)
    }
    return total
  }

  /**
   * Calculate level from total XP
   */
  static getLevelFromXP(totalXP: number): LevelData {
    let level = 1
    let xpSoFar = 0
    
    // Find current level
    while (xpSoFar + this.getXPForLevel(level + 1) <= totalXP && level < 100) {
      xpSoFar += this.getXPForLevel(level + 1)
      level++
    }
    
    // Handle Paragon levels (100+)
    if (level === 100 && totalXP > this.getTotalXPForLevel(100)) {
      const paragonXP = totalXP - this.getTotalXPForLevel(100)
      const paragonLevel = Math.floor(paragonXP / 10000)
      
      return {
        level: 100,
        currentXP: paragonXP % 10000,
        xpForNextLevel: 10000,
        totalXP,
        title: `${LEVEL_TITLES[10]} ∞${paragonLevel}`,
        tier: 10,
        prestige: 0,
        paragonLevel,
      }
    }
    
    const currentXP = totalXP - xpSoFar
    const xpForNextLevel = this.getXPForLevel(level + 1)
    const tier = Math.floor(level / 10)
    
    return {
      level,
      currentXP,
      xpForNextLevel,
      totalXP,
      title: LEVEL_TITLES[tier],
      tier,
      prestige: 0,
      paragonLevel: 0,
    }
  }

  /**
   * Calculate XP gains from various activities
   */
  static calculateXPGain(activity: {
    type: 'workout' | 'pr' | 'streak' | 'achievement' | 'quest'
    baseXP: number
    multipliers?: {
      prestige?: number
      streak?: number
      difficulty?: number
    }
  }): number {
    let xp = activity.baseXP
    
    // Apply multipliers
    if (activity.multipliers) {
      if (activity.multipliers.prestige) {
        xp *= activity.multipliers.prestige
      }
      if (activity.multipliers.streak) {
        xp *= activity.multipliers.streak
      }
      if (activity.multipliers.difficulty) {
        xp *= activity.multipliers.difficulty
      }
    }
    
    return Math.floor(xp)
  }

  /**
   * Prestige system - reset to level 1 with permanent bonuses
   */
  static calculatePrestigeBonus(prestigeLevel: number): PrestigeData {
    const xpMultiplier = 1 + (prestigeLevel * 0.1) // +10% XP per prestige
    const statBoost = prestigeLevel * 5 // +5 to all stats per prestige
    
    let specialAbility: string | undefined
    
    // Unlock special abilities at prestige milestones
    if (prestigeLevel >= 10) specialAbility = 'Eternal Forge'
    else if (prestigeLevel >= 5) specialAbility = 'Master\'s Blessing'
    else if (prestigeLevel >= 3) specialAbility = 'Veteran\'s Insight'
    else if (prestigeLevel >= 1) specialAbility = 'Second Wind'
    
    return {
      prestige: prestigeLevel,
      totalPrestige: prestigeLevel,
      bonuses: {
        xpMultiplier,
        statBoost,
        specialAbility,
      },
    }
  }

  /**
   * Check if player can prestige (must be level 100)
   */
  static canPrestige(level: number): boolean {
    return level >= 100
  }

  /**
   * Get prestige rewards preview
   */
  static getPrestigeRewards(currentPrestige: number): string[] {
    const next = currentPrestige + 1
    const bonus = this.calculatePrestigeBonus(next)
    
    const rewards = [
      `+${(bonus.bonuses.xpMultiplier - 1) * 100}% XP gain`,
      `+${bonus.bonuses.statBoost} to all stats`,
    ]
    
    if (bonus.bonuses.specialAbility) {
      rewards.push(`Unlock: ${bonus.bonuses.specialAbility}`)
    }
    
    return rewards
  }

  /**
   * Calculate XP breakdown with multipliers shown
   */
  static getXPBreakdown(
    baseXP: number,
    multipliers: { name: string; value: number }[]
  ): { total: number; breakdown: Array<{ source: string; xp: number }> } {
    const breakdown: Array<{ source: string; xp: number }> = [
      { source: 'Base XP', xp: baseXP },
    ]
    
    let total = baseXP
    
    multipliers.forEach((mult) => {
      const bonus = Math.floor(baseXP * (mult.value - 1))
      breakdown.push({ source: mult.name, xp: bonus })
      total += bonus
    })
    
    return { total, breakdown }
  }

  /**
   * Get level progression chart (for UI display)
   */
  static getLevelChart(startLevel: number, endLevel: number): Array<{
    level: number
    xpRequired: number
    totalXP: number
    title: string
  }> {
    const chart: Array<{
      level: number
      xpRequired: number
      totalXP: number
      title: string
    }> = []
    
    for (let i = startLevel; i <= endLevel; i++) {
      const tier = Math.floor(i / 10)
      chart.push({
        level: i,
        xpRequired: this.getXPForLevel(i),
        totalXP: this.getTotalXPForLevel(i),
        title: LEVEL_TITLES[tier],
      })
    }
    
    return chart
  }

  /**
   * Get next milestone info
   */
  static getNextMilestone(currentLevel: number): {
    level: number
    title: string
    xpNeeded: number
  } | null {
    // Milestones at every 10 levels
    const nextMilestone = Math.ceil((currentLevel + 1) / 10) * 10
    
    if (nextMilestone > 100) return null
    
    const tier = Math.floor(nextMilestone / 10)
    const currentTotalXP = this.getTotalXPForLevel(currentLevel)
    const milestoneTotalXP = this.getTotalXPForLevel(nextMilestone)
    
    return {
      level: nextMilestone,
      title: LEVEL_TITLES[tier],
      xpNeeded: milestoneTotalXP - currentTotalXP,
    }
  }

  /**
   * Validate XP gain (prevent cheating)
   */
  static validateXPGain(xp: number, activityType: string): boolean {
    const maxXPPerActivity: Record<string, number> = {
      workout: 100,
      pr: 200,
      streak: 500,
      achievement: 1000,
      quest: 300,
    }
    
    const max = maxXPPerActivity[activityType] || 100
    return xp > 0 && xp <= max
  }
}

// XP Sources and Values
export const XP_VALUES = {
  // Workouts
  WORKOUT_COMPLETE: 50,
  WORKOUT_WITH_NOTES: 60,
  WORKOUT_PR: 100,
  WORKOUT_PERFECT_FORM: 75,
  
  // Sets & Reps
  SET_COMPLETE: 5,
  REP_COMPLETE: 1,
  RPE_8_OR_HIGHER: 10,
  
  // Streaks
  DAILY_STREAK_BONUS: 10, // per day
  WEEKLY_STREAK: 50,
  MONTHLY_STREAK: 200,
  
  // Achievements
  ACHIEVEMENT_COMMON: 50,
  ACHIEVEMENT_UNCOMMON: 100,
  ACHIEVEMENT_RARE: 250,
  ACHIEVEMENT_EPIC: 500,
  ACHIEVEMENT_LEGENDARY: 1000,
  ACHIEVEMENT_MYTHIC: 2500,
  
  // Quests
  DAILY_QUEST: 50,
  WEEKLY_QUEST: 200,
  RAID_QUEST: 500,
  BOSS_BATTLE: 1000,
  
  // Social
  GUILD_CONTRIBUTION: 25,
  HELP_GUILD_MATE: 15,
  
  // Misc
  FIRST_TIME_BONUS: 50,
  COMEBACK_BONUS: 100, // after 7+ day break
  PERFECT_WEEK: 300,
}

// Level-up rewards by tier
export const LEVEL_REWARDS: Record<number, string[]> = {
  10: ['Title: Apprentice', 'Unlock: Exercise Library'],
  20: ['Title: Warrior', 'Unlock: Custom Programs'],
  30: ['Title: Adept', 'Unlock: Advanced Analytics'],
  40: ['Title: Veteran', 'Unlock: Skill Trees'],
  50: ['Title: Expert', 'Unlock: Guild System'],
  60: ['Title: Master', 'Unlock: PvP Duels'],
  70: ['Title: Grandmaster', 'Unlock: Seasonal Content'],
  80: ['Title: Champion', 'Unlock: Legendary Gear'],
  90: ['Title: Legend', 'Unlock: Mythic Achievements'],
  100: ['Title: Ascended', 'Unlock: Prestige System', 'Unlock: Paragon Levels'],
}

