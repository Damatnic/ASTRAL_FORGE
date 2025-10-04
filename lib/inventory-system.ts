/**
 * Inventory System
 * Workout programs as spell books, exercises as skill compendium
 */

import { PrismaClient } from '@prisma/client'

export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic'
export type ItemType = 'program' | 'exercise' | 'consumable' | 'equipment' | 'cosmetic'

export interface InventoryItem {
  id: string
  name: string
  description: string
  type: ItemType
  rarity: ItemRarity
  
  // Visual
  icon: string
  image?: string
  
  // Stats/Properties
  properties: ItemProperty[]
  
  // Metadata
  isEquipped?: boolean
  isLocked: boolean
  levelRequired: number
  quantity?: number
  
  // Source
  obtainedFrom?: string
  obtainedAt?: Date
}

export interface ItemProperty {
  name: string
  value: string | number
  description: string
  icon?: string
}

export class InventorySystem {
  /**
   * Get user's inventory
   */
  static async getUserInventory(
    prisma: PrismaClient,
    userId: string
  ): Promise<{
    programs: InventoryItem[]
    exercises: InventoryItem[]
    consumables: InventoryItem[]
    equipment: InventoryItem[]
    cosmetics: InventoryItem[]
  }> {
    // Get user's workout programs (spell books)
    const programs = await prisma.workoutPlan.findMany({
      where: { userId },
    })
    
    // Get user's exercises (skill compendium)
    const exercises = await prisma.exercise.findMany({
      include: {
        _count: {
          select: {
            sets: {
              where: { userId },
            },
          },
        },
      },
    })
    
    return {
      programs: programs.map((p) => this.programToInventoryItem(p)),
      exercises: exercises.map((e) => this.exerciseToInventoryItem(e)),
      consumables: [], // Future: pre-workout, supplements, etc.
      equipment: [], // Future: gear, weights, accessories
      cosmetics: [], // Future: themes, avatars, titles
    }
  }

  /**
   * Convert workout program to inventory item (Spell Book)
   */
  private static programToInventoryItem(program: any): InventoryItem {
    const exercises = (program.plan as any)?.exercises || []
    const difficulty = program.difficulty || 'intermediate'
    
    const rarity = this.getRarityFromDifficulty(difficulty)
    
    return {
      id: program.id,
      name: program.name,
      description: program.description || 'A powerful training spell book',
      type: 'program',
      rarity,
      icon: this.getProgramIcon(program.name),
      properties: [
        {
          name: 'Days per Week',
          value: program.daysPerWeek || exercises.length,
          description: 'Training frequency',
          icon: '📅',
        },
        {
          name: 'Exercises',
          value: exercises.length,
          description: 'Total exercises',
          icon: '💪',
        },
        {
          name: 'Difficulty',
          value: difficulty,
          description: 'Training difficulty',
          icon: '⚡',
        },
        {
          name: 'Focus',
          value: program.focusArea || 'Full Body',
          description: 'Primary muscle groups',
          icon: '🎯',
        },
      ],
      isLocked: false,
      levelRequired: this.getLevelFromDifficulty(difficulty),
      obtainedFrom: 'Created',
      obtainedAt: program.createdAt,
    }
  }

  /**
   * Convert exercise to inventory item (Skill/Ability)
   */
  private static exerciseToInventoryItem(exercise: any): InventoryItem {
    const usageCount = exercise._count?.sets || 0
    const rarity = this.getExerciseRarity(exercise, usageCount)
    
    return {
      id: exercise.id,
      name: exercise.name,
      description: exercise.description || `A powerful ${exercise.category} ability`,
      type: 'exercise',
      rarity,
      icon: this.getExerciseIcon(exercise),
      properties: [
        {
          name: 'Category',
          value: exercise.category || 'General',
          description: 'Exercise type',
          icon: '🏋️',
        },
        {
          name: 'Muscles',
          value: exercise.primaryMuscles || 'Full Body',
          description: 'Target muscles',
          icon: '💪',
        },
        {
          name: 'Equipment',
          value: exercise.equipment || 'Bodyweight',
          description: 'Required equipment',
          icon: '⚙️',
        },
        {
          name: 'Times Used',
          value: usageCount,
          description: 'Total sets performed',
          icon: '📊',
        },
        {
          name: 'Difficulty',
          value: exercise.difficulty || 'Intermediate',
          description: 'Exercise difficulty',
          icon: '⚡',
        },
      ],
      isLocked: usageCount === 0,
      levelRequired: 1,
      quantity: usageCount,
      obtainedFrom: usageCount > 0 ? 'Mastered' : 'Locked',
    }
  }

  /**
   * Get rarity from difficulty
   */
  private static getRarityFromDifficulty(difficulty: string): ItemRarity {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'common'
      case 'intermediate':
        return 'uncommon'
      case 'advanced':
        return 'rare'
      case 'expert':
        return 'epic'
      case 'master':
        return 'legendary'
      default:
        return 'uncommon'
    }
  }

  /**
   * Get exercise rarity based on usage and complexity
   */
  private static getExerciseRarity(exercise: any, usageCount: number): ItemRarity {
    const difficulty = (exercise.difficulty || 'intermediate').toLowerCase()
    const category = (exercise.category || '').toLowerCase()
    
    // Olympic lifts and complex movements are legendary
    if (category.includes('olympic') || category.includes('power')) {
      return 'legendary'
    }
    
    // Main compound lifts are epic
    if (['squat', 'deadlift', 'bench'].some((m) => exercise.name.toLowerCase().includes(m))) {
      return 'epic'
    }
    
    // High usage = higher rarity
    if (usageCount > 100) return 'epic'
    if (usageCount > 50) return 'rare'
    if (usageCount > 20) return 'uncommon'
    
    // Base on difficulty
    return this.getRarityFromDifficulty(difficulty)
  }

  /**
   * Get level requirement from difficulty
   */
  private static getLevelFromDifficulty(difficulty: string): number {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 1
      case 'intermediate':
        return 10
      case 'advanced':
        return 30
      case 'expert':
        return 50
      case 'master':
        return 80
      default:
        return 1
    }
  }

  /**
   * Get program icon based on name
   */
  private static getProgramIcon(name: string): string {
    const nameLower = name.toLowerCase()
    
    if (nameLower.includes('strength') || nameLower.includes('power')) return '💪'
    if (nameLower.includes('cardio') || nameLower.includes('endurance')) return '🏃'
    if (nameLower.includes('hiit') || nameLower.includes('explosive')) return '⚡'
    if (nameLower.includes('yoga') || nameLower.includes('flexibility')) return '🧘'
    if (nameLower.includes('bodyweight') || nameLower.includes('calisthenics')) return '🤸'
    if (nameLower.includes('powerlifting')) return '🏋️'
    if (nameLower.includes('beginner')) return '🌱'
    if (nameLower.includes('advanced') || nameLower.includes('expert')) return '🔥'
    
    return '📖'
  }

  /**
   * Get exercise icon based on category
   */
  private static getExerciseIcon(exercise: any): string {
    const category = (exercise.category || '').toLowerCase()
    const name = (exercise.name || '').toLowerCase()
    
    if (name.includes('squat')) return '🦵'
    if (name.includes('deadlift')) return '⚡'
    if (name.includes('bench')) return '💪'
    if (name.includes('pull')) return '🤸'
    if (name.includes('press')) return '🏋️'
    if (name.includes('run')) return '🏃'
    if (name.includes('jump')) return '💥'
    if (name.includes('stretch') || name.includes('yoga')) return '🧘'
    
    if (category.includes('strength')) return '💪'
    if (category.includes('cardio')) return '🏃'
    if (category.includes('flexibility')) return '🧘'
    if (category.includes('power')) return '⚡'
    
    return '🎯'
  }

  /**
   * Get rarity color for UI
   */
  static getRarityColor(rarity: ItemRarity): {
    bg: string
    border: string
    text: string
    glow: string
  } {
    switch (rarity) {
      case 'mythic':
        return {
          bg: 'from-red-500 via-orange-500 to-yellow-500',
          border: 'border-red-500',
          text: 'text-red-400',
          glow: 'shadow-red-500/50',
        }
      case 'legendary':
        return {
          bg: 'from-yellow-500 via-orange-500 to-yellow-600',
          border: 'border-yellow-500',
          text: 'text-yellow-400',
          glow: 'shadow-yellow-500/50',
        }
      case 'epic':
        return {
          bg: 'from-purple-500 via-pink-500 to-purple-600',
          border: 'border-purple-500',
          text: 'text-purple-400',
          glow: 'shadow-purple-500/50',
        }
      case 'rare':
        return {
          bg: 'from-blue-500 to-cyan-500',
          border: 'border-blue-500',
          text: 'text-blue-400',
          glow: 'shadow-blue-500/50',
        }
      case 'uncommon':
        return {
          bg: 'from-green-500 to-emerald-500',
          border: 'border-green-500',
          text: 'text-green-400',
          glow: 'shadow-green-500/50',
        }
      default:
        return {
          bg: 'from-gray-500 to-gray-600',
          border: 'border-gray-500',
          text: 'text-gray-400',
          glow: 'shadow-gray-500/30',
        }
    }
  }

  /**
   * Equip a program (set as active)
   */
  static async equipProgram(
    prisma: PrismaClient,
    userId: string,
    programId: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      // In full implementation, this would set the program as active
      // For now, just validate it exists
      const program = await prisma.workoutPlan.findFirst({
        where: { id: programId, userId },
      })
      
      if (!program) {
        return { success: false, message: 'Program not found' }
      }
      
      return { success: true, message: `Equipped: ${program.name}` }
    } catch (error) {
      return { success: false, message: 'Failed to equip program' }
    }
  }

  /**
   * Create consumable items (future feature)
   */
  static getConsumables(): InventoryItem[] {
    return [
      {
        id: 'consumable-preworkout',
        name: 'Pre-Workout Elixir',
        description: '+20% XP for next workout',
        type: 'consumable',
        rarity: 'rare',
        icon: '🧪',
        properties: [
          { name: 'Effect', value: '+20% XP', description: 'Bonus experience', icon: '⭐' },
          { name: 'Duration', value: '1 workout', description: 'Effect duration', icon: '⏱️' },
        ],
        isLocked: false,
        levelRequired: 10,
        quantity: 3,
      },
      {
        id: 'consumable-double-xp',
        name: 'Double XP Potion',
        description: '2x XP for 24 hours',
        type: 'consumable',
        rarity: 'legendary',
        icon: '✨',
        properties: [
          { name: 'Effect', value: '2x XP', description: 'Double experience', icon: '⭐' },
          { name: 'Duration', value: '24 hours', description: 'Effect duration', icon: '⏱️' },
        ],
        isLocked: true,
        levelRequired: 50,
        quantity: 0,
      },
    ]
  }

  /**
   * Sort inventory by rarity
   */
  static sortByRarity(items: InventoryItem[]): InventoryItem[] {
    const rarityOrder: Record<ItemRarity, number> = {
      mythic: 6,
      legendary: 5,
      epic: 4,
      rare: 3,
      uncommon: 2,
      common: 1,
    }
    
    return items.sort((a, b) => rarityOrder[b.rarity] - rarityOrder[a.rarity])
  }
}

