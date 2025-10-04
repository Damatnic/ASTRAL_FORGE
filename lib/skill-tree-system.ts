/**
 * Skill Tree System
 * Unlock exercises as abilities in RPG-style skill trees
 */

import { PrismaClient } from '@prisma/client'

export type SkillTreeCategory = 'strength' | 'endurance' | 'agility' | 'flexibility' | 'power'

export interface SkillNode {
  id: string
  name: string
  description: string
  category: SkillTreeCategory
  
  // Unlock requirements
  levelRequired: number
  prerequisiteIds: string[]
  statRequirement?: { stat: string; value: number }
  
  // Status
  isUnlocked: boolean
  isAvailable: boolean // Can be unlocked now
  
  // Visual position in tree
  tier: number // 1-5 (bottom to top)
  position: number // horizontal position in tier
  
  // Associated exercise/ability
  exerciseId?: string
  exerciseName: string
  icon: string
  
  // Bonuses
  bonuses: SkillBonus[]
}

export interface SkillBonus {
  type: 'stat' | 'xp' | 'damage' | 'unlock'
  description: string
  value: number | string
}

export class SkillTreeSystem {
  /**
   * Get all skill trees
   */
  static getAllTrees(): Record<SkillTreeCategory, SkillNode[]> {
    return {
      strength: this.getStrengthTree(),
      endurance: this.getEnduranceTree(),
      agility: this.getAgilityTree(),
      flexibility: this.getFlexibilityTree(),
      power: this.getPowerTree(),
    }
  }

  /**
   * STRENGTH TREE - Heavy compound lifts
   */
  private static getStrengthTree(): SkillNode[] {
    return [
      // Tier 1 - Foundation (Level 1+)
      {
        id: 'str-push-basic',
        name: 'Basic Push',
        description: 'Learn basic pushing movements',
        category: 'strength',
        levelRequired: 1,
        prerequisiteIds: [],
        isUnlocked: false,
        isAvailable: true,
        tier: 1,
        position: 1,
        exerciseName: 'Push-ups',
        icon: '💪',
        bonuses: [{ type: 'stat', description: '+5 STR', value: 5 }],
      },
      {
        id: 'str-pull-basic',
        name: 'Basic Pull',
        description: 'Learn basic pulling movements',
        category: 'strength',
        levelRequired: 1,
        prerequisiteIds: [],
        isUnlocked: false,
        isAvailable: true,
        tier: 1,
        position: 2,
        exerciseName: 'Bodyweight Rows',
        icon: '🤸',
        bonuses: [{ type: 'stat', description: '+5 STR', value: 5 }],
      },
      {
        id: 'str-squat-basic',
        name: 'Basic Squat',
        description: 'Learn basic squatting movements',
        category: 'strength',
        levelRequired: 1,
        prerequisiteIds: [],
        isUnlocked: false,
        isAvailable: true,
        tier: 1,
        position: 3,
        exerciseName: 'Bodyweight Squats',
        icon: '🦵',
        bonuses: [{ type: 'stat', description: '+5 STR', value: 5 }],
      },
      
      // Tier 2 - Intermediate (Level 10+)
      {
        id: 'str-bench-press',
        name: 'Bench Press',
        description: 'Unlock the king of upper body pressing',
        category: 'strength',
        levelRequired: 10,
        prerequisiteIds: ['str-push-basic'],
        isUnlocked: false,
        isAvailable: false,
        tier: 2,
        position: 1,
        exerciseName: 'Bench Press',
        icon: '🏋️',
        bonuses: [
          { type: 'stat', description: '+10 STR', value: 10 },
          { type: 'xp', description: '+5% XP from chest exercises', value: 1.05 },
        ],
      },
      {
        id: 'str-pull-up',
        name: 'Pull-ups',
        description: 'Master bodyweight pulling',
        category: 'strength',
        levelRequired: 10,
        prerequisiteIds: ['str-pull-basic'],
        isUnlocked: false,
        isAvailable: false,
        tier: 2,
        position: 2,
        exerciseName: 'Pull-ups',
        icon: '💪',
        bonuses: [
          { type: 'stat', description: '+10 STR', value: 10 },
          { type: 'xp', description: '+5% XP from back exercises', value: 1.05 },
        ],
      },
      {
        id: 'str-barbell-squat',
        name: 'Barbell Squat',
        description: 'The king of all exercises',
        category: 'strength',
        levelRequired: 10,
        prerequisiteIds: ['str-squat-basic'],
        isUnlocked: false,
        isAvailable: false,
        tier: 2,
        position: 3,
        exerciseName: 'Barbell Squat',
        icon: '👑',
        bonuses: [
          { type: 'stat', description: '+15 STR', value: 15 },
          { type: 'xp', description: '+10% XP from leg exercises', value: 1.1 },
        ],
      },
      
      // Tier 3 - Advanced (Level 30+)
      {
        id: 'str-deadlift',
        name: 'Deadlift',
        description: 'Unlock the ultimate strength builder',
        category: 'strength',
        levelRequired: 30,
        prerequisiteIds: ['str-barbell-squat'],
        statRequirement: { stat: 'strength', value: 150 },
        isUnlocked: false,
        isAvailable: false,
        tier: 3,
        position: 2,
        exerciseName: 'Deadlift',
        icon: '⚡',
        bonuses: [
          { type: 'stat', description: '+25 STR', value: 25 },
          { type: 'xp', description: '+20% XP from deadlifts', value: 1.2 },
          { type: 'unlock', description: 'Unlock: Powerlifting path', value: 'powerlifting' },
        ],
      },
      
      // Tier 4 - Expert (Level 50+)
      {
        id: 'str-overhead-press',
        name: 'Overhead Press',
        description: 'Master overhead strength',
        category: 'strength',
        levelRequired: 50,
        prerequisiteIds: ['str-bench-press'],
        statRequirement: { stat: 'strength', value: 200 },
        isUnlocked: false,
        isAvailable: false,
        tier: 4,
        position: 1,
        exerciseName: 'Overhead Press',
        icon: '🏆',
        bonuses: [
          { type: 'stat', description: '+30 STR', value: 30 },
          { type: 'xp', description: '+25% XP from shoulders', value: 1.25 },
        ],
      },
      
      // Tier 5 - Legendary (Level 80+)
      {
        id: 'str-legendary',
        name: 'Strength Mastery',
        description: 'Achieve ultimate strength',
        category: 'strength',
        levelRequired: 80,
        prerequisiteIds: ['str-deadlift', 'str-overhead-press'],
        statRequirement: { stat: 'strength', value: 400 },
        isUnlocked: false,
        isAvailable: false,
        tier: 5,
        position: 2,
        exerciseName: 'Advanced Techniques',
        icon: '👑',
        bonuses: [
          { type: 'stat', description: '+50 STR', value: 50 },
          { type: 'xp', description: '+50% XP from all strength', value: 1.5 },
          { type: 'unlock', description: 'Legendary Strength Title', value: 'title' },
        ],
      },
    ]
  }

  /**
   * ENDURANCE TREE - Cardio and high-rep work
   */
  private static getEnduranceTree(): SkillNode[] {
    return [
      {
        id: 'end-running',
        name: 'Running',
        description: 'Basic cardio foundation',
        category: 'endurance',
        levelRequired: 1,
        prerequisiteIds: [],
        isUnlocked: false,
        isAvailable: true,
        tier: 1,
        position: 1,
        exerciseName: 'Running',
        icon: '🏃',
        bonuses: [{ type: 'stat', description: '+5 END', value: 5 }],
      },
      {
        id: 'end-hiit',
        name: 'HIIT Training',
        description: 'High intensity intervals',
        category: 'endurance',
        levelRequired: 15,
        prerequisiteIds: ['end-running'],
        isUnlocked: false,
        isAvailable: false,
        tier: 2,
        position: 1,
        exerciseName: 'HIIT Circuits',
        icon: '⚡',
        bonuses: [
          { type: 'stat', description: '+15 END', value: 15 },
          { type: 'xp', description: '+10% XP from cardio', value: 1.1 },
        ],
      },
      {
        id: 'end-marathon',
        name: 'Marathon Endurance',
        description: 'Ultimate cardio mastery',
        category: 'endurance',
        levelRequired: 60,
        prerequisiteIds: ['end-hiit'],
        statRequirement: { stat: 'endurance', value: 300 },
        isUnlocked: false,
        isAvailable: false,
        tier: 4,
        position: 1,
        exerciseName: 'Long Distance',
        icon: '🏅',
        bonuses: [
          { type: 'stat', description: '+40 END', value: 40 },
          { type: 'xp', description: '+30% XP from endurance', value: 1.3 },
        ],
      },
    ]
  }

  /**
   * AGILITY TREE - Explosive and plyometric movements
   */
  private static getAgilityTree(): SkillNode[] {
    return [
      {
        id: 'agi-burpees',
        name: 'Burpees',
        description: 'Full body explosive movement',
        category: 'agility',
        levelRequired: 1,
        prerequisiteIds: [],
        isUnlocked: false,
        isAvailable: true,
        tier: 1,
        position: 1,
        exerciseName: 'Burpees',
        icon: '💥',
        bonuses: [{ type: 'stat', description: '+5 AGI', value: 5 }],
      },
      {
        id: 'agi-box-jumps',
        name: 'Box Jumps',
        description: 'Explosive power development',
        category: 'agility',
        levelRequired: 20,
        prerequisiteIds: ['agi-burpees'],
        isUnlocked: false,
        isAvailable: false,
        tier: 2,
        position: 1,
        exerciseName: 'Box Jumps',
        icon: '📦',
        bonuses: [
          { type: 'stat', description: '+15 AGI', value: 15 },
          { type: 'xp', description: '+10% XP from plyometrics', value: 1.1 },
        ],
      },
    ]
  }

  /**
   * FLEXIBILITY TREE - Mobility and stretching
   */
  private static getFlexibilityTree(): SkillNode[] {
    return [
      {
        id: 'flx-stretching',
        name: 'Basic Stretching',
        description: 'Foundation of flexibility',
        category: 'flexibility',
        levelRequired: 1,
        prerequisiteIds: [],
        isUnlocked: false,
        isAvailable: true,
        tier: 1,
        position: 1,
        exerciseName: 'Static Stretching',
        icon: '🧘',
        bonuses: [{ type: 'stat', description: '+5 FLX', value: 5 }],
      },
      {
        id: 'flx-yoga',
        name: 'Yoga',
        description: 'Dynamic flexibility and balance',
        category: 'flexibility',
        levelRequired: 15,
        prerequisiteIds: ['flx-stretching'],
        isUnlocked: false,
        isAvailable: false,
        tier: 2,
        position: 1,
        exerciseName: 'Yoga Flow',
        icon: '🕉️',
        bonuses: [
          { type: 'stat', description: '+15 FLX', value: 15 },
          { type: 'xp', description: '+10% XP from flexibility', value: 1.1 },
        ],
      },
    ]
  }

  /**
   * POWER TREE - Ultimate abilities (requires high stats)
   */
  private static getPowerTree(): SkillNode[] {
    return [
      {
        id: 'pow-olympic',
        name: 'Olympic Lifts',
        description: 'Power and speed combined',
        category: 'power',
        levelRequired: 40,
        prerequisiteIds: [],
        statRequirement: { stat: 'strength', value: 200 },
        isUnlocked: false,
        isAvailable: false,
        tier: 3,
        position: 2,
        exerciseName: 'Clean & Jerk',
        icon: '🏋️‍♂️',
        bonuses: [
          { type: 'stat', description: '+20 PWR', value: 20 },
          { type: 'xp', description: '+20% XP from power movements', value: 1.2 },
        ],
      },
      {
        id: 'pow-ultimate',
        name: 'Ultimate Power',
        description: 'Transcendent ability',
        category: 'power',
        levelRequired: 100,
        prerequisiteIds: ['pow-olympic'],
        statRequirement: { stat: 'power', value: 1000 },
        isUnlocked: false,
        isAvailable: false,
        tier: 5,
        position: 3,
        exerciseName: 'Legendary Techniques',
        icon: '🔥',
        bonuses: [
          { type: 'stat', description: '+100 PWR', value: 100 },
          { type: 'xp', description: '+100% XP from all exercises', value: 2.0 },
          { type: 'unlock', description: 'Ascended Title', value: 'title' },
        ],
      },
    ]
  }

  /**
   * Calculate which nodes are unlocked/available for a user
   */
  static async calculateUserProgress(
    prisma: PrismaClient,
    userId: string,
    userLevel: number,
    userStats: any
  ): Promise<Record<SkillTreeCategory, SkillNode[]>> {
    const trees = this.getAllTrees()
    
    // Get user's unlocked exercises
    const userExercises = await prisma.setEntry.findMany({
      where: {
        session: {
          userId,
        },
      },
      include: { exercise: true },
      distinct: ['exerciseId'],
    })
    
    const unlockedExercises = new Set(userExercises.map((s) => s.exercise?.name))
    
    // Calculate unlock status for each node
    Object.keys(trees).forEach((category) => {
      trees[category as SkillTreeCategory] = trees[category as SkillTreeCategory].map((node) => {
        // Check level requirement
        const levelMet = userLevel >= node.levelRequired
        
        // Check stat requirement
        const statMet = node.statRequirement
          ? userStats[node.statRequirement.stat] >= node.statRequirement.value
          : true
        
        // Check prerequisites
        const prereqsMet = node.prerequisiteIds.every((preId) =>
          trees[category as SkillTreeCategory].find((n) => n.id === preId)?.isUnlocked
        )
        
        // Check if exercise is unlocked (user has performed it)
        const exerciseUnlocked = unlockedExercises.has(node.exerciseName)
        
        return {
          ...node,
          isUnlocked: exerciseUnlocked,
          isAvailable: !exerciseUnlocked && levelMet && statMet && prereqsMet,
        }
      })
    })
    
    return trees
  }

  /**
   * Unlock a skill node
   */
  static unlockSkill(nodeId: string): {
    success: boolean
    bonuses: SkillBonus[]
    message: string
  } {
    // In full implementation, this would update the database
    const trees = this.getAllTrees()
    let node: SkillNode | undefined
    
    Object.values(trees).forEach((tree) => {
      const found = tree.find((n) => n.id === nodeId)
      if (found) node = found
    })
    
    if (!node) {
      return { success: false, bonuses: [], message: 'Skill not found' }
    }
    
    if (!node.isAvailable) {
      return { success: false, bonuses: [], message: 'Requirements not met' }
    }
    
    return {
      success: true,
      bonuses: node.bonuses,
      message: `Unlocked: ${node.name}!`,
    }
  }
}

