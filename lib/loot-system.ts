/**
 * Loot System
 * Post-workout rewards, chests, and random drops
 */

import { PrismaClient } from '@prisma/client'

export type LootRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic'
export type LootType = 'xp_boost' | 'title' | 'badge' | 'cosmetic' | 'consumable' | 'currency'

export interface LootItem {
  id: string
  name: string
  description: string
  type: LootType
  rarity: LootRarity
  icon: string
  
  // Effects
  effect?: {
    type: string
    value: number
    duration?: number
  }
  
  // Value
  value?: number
}

export interface LootDrop {
  items: LootItem[]
  xp: number
  currency?: number
  totalValue: number
}

export interface Chest {
  id: string
  name: string
  rarity: LootRarity
  icon: string
  description: string
  guaranteedItems: number
  possibleItems: LootItem[]
}

export class LootSystem {
  /**
   * Generate loot drop based on workout performance
   */
  static generateLootDrop(
    workoutDuration: number,
    volume: number,
    prsHit: number,
    rpeAverage: number,
    userLevel: number
  ): LootDrop {
    const items: LootItem[] = []
    let xp = 50 // Base XP
    
    // Duration bonus
    if (workoutDuration >= 60) {
      xp += 50
      items.push(this.getRandomItem('uncommon'))
    }
    
    // Volume bonus
    if (volume >= 5000) {
      xp += 100
      items.push(this.getRandomItem('rare'))
    }
    
    // PR bonus
    if (prsHit > 0) {
      xp += prsHit * 100
      items.push(this.getRandomItem('epic'))
    }
    
    // High intensity bonus
    if (rpeAverage >= 8) {
      xp += 75
      items.push(this.getRandomItem('rare'))
    }
    
    // Level-based bonus loot
    if (userLevel >= 50) {
      items.push(this.getRandomItem('legendary'))
    }
    
    // Always give at least one common item
    if (items.length === 0) {
      items.push(this.getRandomItem('common'))
    }
    
    return {
      items,
      xp,
      currency: Math.floor(xp / 10),
      totalValue: xp + items.reduce((sum, item) => sum + (item.value || 0), 0),
    }
  }

  /**
   * Open a loot chest
   */
  static openChest(chestRarity: LootRarity): LootDrop {
    const chest = this.getChestByRarity(chestRarity)
    const items: LootItem[] = []
    
    // Guaranteed items
    for (let i = 0; i < chest.guaranteedItems; i++) {
      items.push(this.getRandomItemFromChest(chest))
    }
    
    // Random bonus items (chance based on rarity)
    const bonusChance = this.getBonusChance(chestRarity)
    if (Math.random() < bonusChance) {
      items.push(this.getRandomItemFromChest(chest))
    }
    
    const xp = this.getChestXP(chestRarity)
    
    return {
      items,
      xp,
      currency: Math.floor(xp / 5),
      totalValue: xp + items.reduce((sum, item) => sum + (item.value || 0), 0),
    }
  }

  /**
   * Get random loot item by rarity
   */
  private static getRandomItem(rarity: LootRarity): LootItem {
    const items = this.getAllLootItems().filter((item) => item.rarity === rarity)
    return items[Math.floor(Math.random() * items.length)]
  }

  /**
   * Get random item from chest
   */
  private static getRandomItemFromChest(chest: Chest): LootItem {
    return chest.possibleItems[Math.floor(Math.random() * chest.possibleItems.length)]
  }

  /**
   * Get chest by rarity
   */
  private static getChestByRarity(rarity: LootRarity): Chest {
    const chests: Record<LootRarity, Chest> = {
      common: {
        id: 'chest-common',
        name: 'Common Chest',
        rarity: 'common',
        icon: '📦',
        description: 'Basic rewards',
        guaranteedItems: 1,
        possibleItems: this.getAllLootItems().filter((i) => ['common', 'uncommon'].includes(i.rarity)),
      },
      uncommon: {
        id: 'chest-uncommon',
        name: 'Uncommon Chest',
        rarity: 'uncommon',
        icon: '🎁',
        description: 'Better rewards',
        guaranteedItems: 2,
        possibleItems: this.getAllLootItems().filter((i) => ['common', 'uncommon', 'rare'].includes(i.rarity)),
      },
      rare: {
        id: 'chest-rare',
        name: 'Rare Chest',
        rarity: 'rare',
        icon: '💎',
        description: 'Great rewards',
        guaranteedItems: 2,
        possibleItems: this.getAllLootItems().filter((i) => ['uncommon', 'rare', 'epic'].includes(i.rarity)),
      },
      epic: {
        id: 'chest-epic',
        name: 'Epic Chest',
        rarity: 'epic',
        icon: '🏆',
        description: 'Amazing rewards',
        guaranteedItems: 3,
        possibleItems: this.getAllLootItems().filter((i) => ['rare', 'epic', 'legendary'].includes(i.rarity)),
      },
      legendary: {
        id: 'chest-legendary',
        name: 'Legendary Chest',
        rarity: 'legendary',
        icon: '👑',
        description: 'Incredible rewards',
        guaranteedItems: 4,
        possibleItems: this.getAllLootItems().filter((i) => ['epic', 'legendary', 'mythic'].includes(i.rarity)),
      },
      mythic: {
        id: 'chest-mythic',
        name: 'Mythic Chest',
        rarity: 'mythic',
        icon: '🔮',
        description: 'Ultimate rewards',
        guaranteedItems: 5,
        possibleItems: this.getAllLootItems().filter((i) => ['legendary', 'mythic'].includes(i.rarity)),
      },
    }
    
    return chests[rarity]
  }

  /**
   * Get bonus chance for chest
   */
  private static getBonusChance(rarity: LootRarity): number {
    const chances: Record<LootRarity, number> = {
      common: 0.1,
      uncommon: 0.2,
      rare: 0.3,
      epic: 0.5,
      legendary: 0.7,
      mythic: 1.0,
    }
    return chances[rarity]
  }

  /**
   * Get XP from chest
   */
  private static getChestXP(rarity: LootRarity): number {
    const xpValues: Record<LootRarity, number> = {
      common: 50,
      uncommon: 100,
      rare: 250,
      epic: 500,
      legendary: 1000,
      mythic: 2500,
    }
    return xpValues[rarity]
  }

  /**
   * Get all possible loot items
   */
  private static getAllLootItems(): LootItem[] {
    return [
      // XP Boosts
      {
        id: 'xp-small',
        name: 'Small XP Boost',
        description: '+10% XP for next workout',
        type: 'xp_boost',
        rarity: 'common',
        icon: '⭐',
        effect: { type: 'xp_multiplier', value: 1.1, duration: 1 },
        value: 50,
      },
      {
        id: 'xp-medium',
        name: 'Medium XP Boost',
        description: '+25% XP for 3 workouts',
        type: 'xp_boost',
        rarity: 'uncommon',
        icon: '✨',
        effect: { type: 'xp_multiplier', value: 1.25, duration: 3 },
        value: 150,
      },
      {
        id: 'xp-large',
        name: 'Large XP Boost',
        description: '+50% XP for 24 hours',
        type: 'xp_boost',
        rarity: 'rare',
        icon: '💫',
        effect: { type: 'xp_multiplier', value: 1.5, duration: 24 },
        value: 500,
      },
      {
        id: 'xp-mega',
        name: 'Mega XP Boost',
        description: '2x XP for 48 hours',
        type: 'xp_boost',
        rarity: 'epic',
        icon: '🌟',
        effect: { type: 'xp_multiplier', value: 2.0, duration: 48 },
        value: 1500,
      },
      
      // Titles
      {
        id: 'title-novice',
        name: 'Novice Title',
        description: 'Display "Novice" below your name',
        type: 'title',
        rarity: 'common',
        icon: '🏷️',
        value: 100,
      },
      {
        id: 'title-warrior',
        name: 'Warrior Title',
        description: 'Display "Warrior" below your name',
        type: 'title',
        rarity: 'uncommon',
        icon: '🏷️',
        value: 250,
      },
      {
        id: 'title-champion',
        name: 'Champion Title',
        description: 'Display "Champion" below your name',
        type: 'title',
        rarity: 'rare',
        icon: '🏷️',
        value: 750,
      },
      {
        id: 'title-legend',
        name: 'Legend Title',
        description: 'Display "Legend" below your name',
        type: 'title',
        rarity: 'epic',
        icon: '🏷️',
        value: 2000,
      },
      {
        id: 'title-immortal',
        name: 'Immortal Title',
        description: 'Display "Immortal" below your name',
        type: 'title',
        rarity: 'legendary',
        icon: '🏷️',
        value: 5000,
      },
      
      // Badges
      {
        id: 'badge-iron',
        name: 'Iron Badge',
        description: 'Show iron badge on profile',
        type: 'badge',
        rarity: 'common',
        icon: '🥉',
        value: 100,
      },
      {
        id: 'badge-gold',
        name: 'Gold Badge',
        description: 'Show gold badge on profile',
        type: 'badge',
        rarity: 'rare',
        icon: '🥇',
        value: 500,
      },
      {
        id: 'badge-diamond',
        name: 'Diamond Badge',
        description: 'Show diamond badge on profile',
        type: 'badge',
        rarity: 'legendary',
        icon: '💎',
        value: 2500,
      },
      
      // Cosmetics
      {
        id: 'cosmetic-avatar-1',
        name: 'Fire Avatar Border',
        description: 'Animated fire border for avatar',
        type: 'cosmetic',
        rarity: 'epic',
        icon: '🔥',
        value: 1000,
      },
      {
        id: 'cosmetic-avatar-2',
        name: 'Lightning Avatar Border',
        description: 'Animated lightning border for avatar',
        type: 'cosmetic',
        rarity: 'legendary',
        icon: '⚡',
        value: 3000,
      },
      
      // Currency
      {
        id: 'currency-small',
        name: 'Forge Coins (100)',
        description: '100 Forge Coins',
        type: 'currency',
        rarity: 'common',
        icon: '🪙',
        value: 100,
      },
      {
        id: 'currency-large',
        name: 'Forge Coins (500)',
        description: '500 Forge Coins',
        type: 'currency',
        rarity: 'rare',
        icon: '💰',
        value: 500,
      },
    ]
  }
}

