/**
 * TRAINING MILESTONES SYSTEM
 * 
 * Professional fitness milestone tracking system.
 * Replaces RPG skill trees with real strength benchmarks, volume goals,
 * consistency achievements, and performance milestones.
 * 
 * Categories:
 * - Strength: Absolute/relative strength benchmarks
 * - Volume: Total weight lifted milestones
 * - Consistency: Workout streak achievements
 * - Technique: Exercise mastery certifications
 * - Endurance: Rep/time-based goals
 * - Body Recomp: Body composition achievements
 */

import { PrismaClient } from '@prisma/client'

const _prisma = new PrismaClient()

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type MilestoneCategory = 
  | 'strength'        // Absolute/relative strength benchmarks
  | 'volume'          // Total volume milestones
  | 'consistency'     // Workout streak achievements
  | 'technique'       // Exercise mastery levels
  | 'endurance'       // Rep/time-based endurance goals
  | 'body-recomp'     // Body composition goals

export type MilestoneTier = 
  | 'beginner'        // First achievements (0-3 months)
  | 'novice'          // Early progress (3-6 months)
  | 'intermediate'    // Solid foundation (6-12 months)
  | 'advanced'        // Serious lifter (1-2 years)
  | 'elite'           // Top-tier achievement (2+ years)
  | 'world-class'     // Exceptional performance (elite athletes)

export interface TrainingMilestone {
  id: string
  name: string
  description: string
  category: MilestoneCategory
  tier: MilestoneTier
  
  // Requirement (how to unlock)
  requirement: MilestoneRequirement
  
  // Visual
  badge: string
  color: string
  
  // Rewards
  unlocks: string[]  // What this enables
  points: number     // Progress points awarded
  
  // Status
  isCompleted: boolean
  progress: number   // 0-100%
  dateEarned?: Date
}

// Requirement types
export type MilestoneRequirement = 
  | AbsoluteStrengthRequirement
  | RelativeStrengthRequirement
  | VolumeRequirement
  | ConsistencyRequirement
  | EnduranceRequirement
  | TechniqueRequirement
  | BodyRecompRequirement

export interface AbsoluteStrengthRequirement {
  type: 'absolute-strength'
  exercise: string
  weight: number      // kg
  reps: number
}

export interface RelativeStrengthRequirement {
  type: 'relative-strength'
  exercise: string
  ratio: number       // multiplier of bodyweight (1x, 1.5x, 2x)
  reps: number
}

export interface VolumeRequirement {
  type: 'volume'
  totalKg: number     // Total weight lifted across all time
}

export interface ConsistencyRequirement {
  type: 'consistency'
  streakDays: number  // Consecutive days with workouts
}

export interface EnduranceRequirement {
  type: 'endurance'
  exercise: string
  reps: number        // Unbroken reps
}

export interface TechniqueRequirement {
  type: 'technique'
  exercise: string
  criteria: string    // Description of mastery criteria
}

export interface BodyRecompRequirement {
  type: 'body-recomp'
  metric: 'weight-loss' | 'weight-gain' | 'body-fat-loss'
  amount: number      // kg or %
  timeframe: number   // days
}

export interface UserStats {
  userId: string
  bodyweight: number  // kg
  totalVolume: number // Total kg lifted all-time
  currentStreak: number // Current workout streak (days)
  maxStreak: number   // Longest streak ever
  totalWorkouts: number
  
  // Personal Records (exercise name → best weight/reps)
  personalRecords: Record<string, { weight: number; reps: number; date: Date }>
  
  // Exercise mastery (exercise name → proficiency level)
  exerciseMastery: Record<string, 'learning' | 'proficient' | 'mastered'>
  
  // Body metrics
  bodyFatPercentage?: number
  weightHistory: Array<{ date: Date; weight: number }>
}

// ============================================================================
// MILESTONE SYSTEM CLASS
// ============================================================================

export class MilestoneSystem {
  /**
   * Generate all available milestones with progress tracking
   */
  static generateMilestones(userStats: UserStats): TrainingMilestone[] {
    return [
      ...this.generateStrengthMilestones(userStats),
      ...this.generateVolumeMilestones(userStats),
      ...this.generateConsistencyMilestones(userStats),
      ...this.generateEnduranceMilestones(userStats),
      ...this.generateTechniqueMilestones(userStats),
    ]
  }

  /**
   * STRENGTH MILESTONES
   * Absolute and relative strength benchmarks
   */
  private static generateStrengthMilestones(userStats: UserStats): TrainingMilestone[] {
    const milestones: TrainingMilestone[] = []
    const bodyweight = userStats.bodyweight

    // BENCH PRESS MILESTONES
    const benchPR = userStats.personalRecords['Bench Press']
    
    // Absolute strength
    milestones.push(
      {
        id: 'bench-first-plate',
        name: 'First Plate Bench',
        description: 'Bench press 60kg (1 plate per side) for 5 reps',
        category: 'strength',
        tier: 'beginner',
        requirement: {
          type: 'absolute-strength',
          exercise: 'Bench Press',
          weight: 60,
          reps: 5,
        },
        badge: '🏋️',
        color: 'green',
        unlocks: ['Intermediate bench programs'],
        points: 50,
        isCompleted: benchPR ? benchPR.weight >= 60 && benchPR.reps >= 5 : false,
        progress: benchPR ? Math.min((benchPR.weight / 60) * 100, 100) : 0,
      },
      {
        id: 'bench-two-plates',
        name: 'Two Plates Bench',
        description: 'Bench press 100kg (2 plates per side) for 5 reps',
        category: 'strength',
        tier: 'intermediate',
        requirement: {
          type: 'absolute-strength',
          exercise: 'Bench Press',
          weight: 100,
          reps: 5,
        },
        badge: '💪',
        color: 'blue',
        unlocks: ['Advanced bench programs', 'Powerlifting templates'],
        points: 150,
        isCompleted: benchPR ? benchPR.weight >= 100 && benchPR.reps >= 5 : false,
        progress: benchPR ? Math.min((benchPR.weight / 100) * 100, 100) : 0,
      },
      {
        id: 'bench-three-plates',
        name: 'Three Plates Bench',
        description: 'Bench press 140kg (3 plates per side) for 5 reps',
        category: 'strength',
        tier: 'advanced',
        requirement: {
          type: 'absolute-strength',
          exercise: 'Bench Press',
          weight: 140,
          reps: 5,
        },
        badge: '🔥',
        color: 'orange',
        unlocks: ['Elite powerlifting programs'],
        points: 300,
        isCompleted: benchPR ? benchPR.weight >= 140 && benchPR.reps >= 5 : false,
        progress: benchPR ? Math.min((benchPR.weight / 140) * 100, 100) : 0,
      }
    )

    // Relative strength (bodyweight multipliers)
    if (bodyweight > 0) {
      milestones.push(
        {
          id: 'bench-bodyweight',
          name: 'Bodyweight Bench',
          description: `Bench press 1x bodyweight (${bodyweight.toFixed(1)}kg) for 5 reps`,
          category: 'strength',
          tier: 'novice',
          requirement: {
            type: 'relative-strength',
            exercise: 'Bench Press',
            ratio: 1.0,
            reps: 5,
          },
          badge: '💯',
          color: 'green',
          unlocks: ['Intermediate strength programs'],
          points: 100,
          isCompleted: benchPR ? benchPR.weight >= bodyweight && benchPR.reps >= 5 : false,
          progress: benchPR ? Math.min((benchPR.weight / bodyweight) * 100, 100) : 0,
        },
        {
          id: 'bench-1.5x-bodyweight',
          name: 'Bench 1.5x Bodyweight',
          description: `Bench press 1.5x bodyweight (${(bodyweight * 1.5).toFixed(1)}kg) for 5 reps`,
          category: 'strength',
          tier: 'advanced',
          requirement: {
            type: 'relative-strength',
            exercise: 'Bench Press',
            ratio: 1.5,
            reps: 5,
          },
          badge: '⚡',
          color: 'purple',
          unlocks: ['Advanced powerlifting programs'],
          points: 250,
          isCompleted: benchPR ? benchPR.weight >= bodyweight * 1.5 && benchPR.reps >= 5 : false,
          progress: benchPR ? Math.min((benchPR.weight / (bodyweight * 1.5)) * 100, 100) : 0,
        }
      )
    }

    // SQUAT MILESTONES
    const squatPR = userStats.personalRecords['Squat']
    
    milestones.push(
      {
        id: 'squat-first-plate',
        name: 'First Plate Squat',
        description: 'Squat 60kg (1 plate per side) for 5 reps',
        category: 'strength',
        tier: 'beginner',
        requirement: {
          type: 'absolute-strength',
          exercise: 'Squat',
          weight: 60,
          reps: 5,
        },
        badge: '🦵',
        color: 'green',
        unlocks: ['Intermediate squat programs'],
        points: 50,
        isCompleted: squatPR ? squatPR.weight >= 60 && squatPR.reps >= 5 : false,
        progress: squatPR ? Math.min((squatPR.weight / 60) * 100, 100) : 0,
      },
      {
        id: 'squat-two-plates',
        name: 'Two Plates Squat',
        description: 'Squat 100kg (2 plates per side) for 5 reps',
        category: 'strength',
        tier: 'intermediate',
        requirement: {
          type: 'absolute-strength',
          exercise: 'Squat',
          weight: 100,
          reps: 5,
        },
        badge: '💪',
        color: 'blue',
        unlocks: ['Advanced squat programs'],
        points: 150,
        isCompleted: squatPR ? squatPR.weight >= 100 && squatPR.reps >= 5 : false,
        progress: squatPR ? Math.min((squatPR.weight / 100) * 100, 100) : 0,
      }
    )

    if (bodyweight > 0) {
      milestones.push(
        {
          id: 'squat-1.5x-bodyweight',
          name: 'Squat 1.5x Bodyweight',
          description: `Squat 1.5x bodyweight (${(bodyweight * 1.5).toFixed(1)}kg) for 5 reps`,
          category: 'strength',
          tier: 'intermediate',
          requirement: {
            type: 'relative-strength',
            exercise: 'Squat',
            ratio: 1.5,
            reps: 5,
          },
          badge: '🏆',
          color: 'blue',
          unlocks: ['Advanced leg programs'],
          points: 200,
          isCompleted: squatPR ? squatPR.weight >= bodyweight * 1.5 && squatPR.reps >= 5 : false,
          progress: squatPR ? Math.min((squatPR.weight / (bodyweight * 1.5)) * 100, 100) : 0,
        },
        {
          id: 'squat-2x-bodyweight',
          name: 'Squat 2x Bodyweight',
          description: `Squat 2x bodyweight (${(bodyweight * 2).toFixed(1)}kg) for 5 reps`,
          category: 'strength',
          tier: 'advanced',
          requirement: {
            type: 'relative-strength',
            exercise: 'Squat',
            ratio: 2.0,
            reps: 5,
          },
          badge: '👑',
          color: 'purple',
          unlocks: ['Elite powerlifting programs'],
          points: 350,
          isCompleted: squatPR ? squatPR.weight >= bodyweight * 2 && squatPR.reps >= 5 : false,
          progress: squatPR ? Math.min((squatPR.weight / (bodyweight * 2)) * 100, 100) : 0,
        }
      )
    }

    // DEADLIFT MILESTONES
    const deadliftPR = userStats.personalRecords['Deadlift']
    
    milestones.push(
      {
        id: 'deadlift-two-plates',
        name: 'Two Plates Deadlift',
        description: 'Deadlift 100kg (2 plates per side) for 5 reps',
        category: 'strength',
        tier: 'beginner',
        requirement: {
          type: 'absolute-strength',
          exercise: 'Deadlift',
          weight: 100,
          reps: 5,
        },
        badge: '⬆️',
        color: 'green',
        unlocks: ['Intermediate deadlift programs'],
        points: 75,
        isCompleted: deadliftPR ? deadliftPR.weight >= 100 && deadliftPR.reps >= 5 : false,
        progress: deadliftPR ? Math.min((deadliftPR.weight / 100) * 100, 100) : 0,
      },
      {
        id: 'deadlift-three-plates',
        name: 'Three Plates Deadlift',
        description: 'Deadlift 140kg (3 plates per side) for 5 reps',
        category: 'strength',
        tier: 'intermediate',
        requirement: {
          type: 'absolute-strength',
          exercise: 'Deadlift',
          weight: 140,
          reps: 5,
        },
        badge: '💪',
        color: 'blue',
        unlocks: ['Advanced deadlift programs'],
        points: 175,
        isCompleted: deadliftPR ? deadliftPR.weight >= 140 && deadliftPR.reps >= 5 : false,
        progress: deadliftPR ? Math.min((deadliftPR.weight / 140) * 100, 100) : 0,
      }
    )

    if (bodyweight > 0) {
      milestones.push(
        {
          id: 'deadlift-2x-bodyweight',
          name: 'Deadlift 2x Bodyweight',
          description: `Deadlift 2x bodyweight (${(bodyweight * 2).toFixed(1)}kg) for 5 reps`,
          category: 'strength',
          tier: 'intermediate',
          requirement: {
            type: 'relative-strength',
            exercise: 'Deadlift',
            ratio: 2.0,
            reps: 5,
          },
          badge: '🔥',
          color: 'orange',
          unlocks: ['Advanced pulling programs'],
          points: 225,
          isCompleted: deadliftPR ? deadliftPR.weight >= bodyweight * 2 && deadliftPR.reps >= 5 : false,
          progress: deadliftPR ? Math.min((deadliftPR.weight / (bodyweight * 2)) * 100, 100) : 0,
        },
        {
          id: 'deadlift-2.5x-bodyweight',
          name: 'Deadlift 2.5x Bodyweight',
          description: `Deadlift 2.5x bodyweight (${(bodyweight * 2.5).toFixed(1)}kg) for 5 reps`,
          category: 'strength',
          tier: 'elite',
          requirement: {
            type: 'relative-strength',
            exercise: 'Deadlift',
            ratio: 2.5,
            reps: 5,
          },
          badge: '⚡',
          color: 'red',
          unlocks: ['Elite powerlifting programs', 'Competition prep'],
          points: 400,
          isCompleted: deadliftPR ? deadliftPR.weight >= bodyweight * 2.5 && deadliftPR.reps >= 5 : false,
          progress: deadliftPR ? Math.min((deadliftPR.weight / (bodyweight * 2.5)) * 100, 100) : 0,
        }
      )
    }

    return milestones
  }

  /**
   * VOLUME MILESTONES
   * Total weight lifted across all time
   */
  private static generateVolumeMilestones(userStats: UserStats): TrainingMilestone[] {
    const totalVolume = userStats.totalVolume

    return [
      {
        id: 'volume-100k',
        name: '100,000kg Lifted',
        description: 'Lift a total of 100,000kg across all workouts',
        category: 'volume',
        tier: 'beginner',
        requirement: {
          type: 'volume',
          totalKg: 100000,
        },
        badge: '📦',
        color: 'green',
        unlocks: ['Volume tracking analytics'],
        points: 100,
        isCompleted: totalVolume >= 100000,
        progress: Math.min((totalVolume / 100000) * 100, 100),
      },
      {
        id: 'volume-500k',
        name: '500,000kg Lifted',
        description: 'Lift a total of 500,000kg - serious volume!',
        category: 'volume',
        tier: 'novice',
        requirement: {
          type: 'volume',
          totalKg: 500000,
        },
        badge: '📊',
        color: 'blue',
        unlocks: ['Advanced volume programs'],
        points: 200,
        isCompleted: totalVolume >= 500000,
        progress: Math.min((totalVolume / 500000) * 100, 100),
      },
      {
        id: 'volume-1m',
        name: 'One Million Club',
        description: 'Lift 1,000,000kg total - join the million kg club!',
        category: 'volume',
        tier: 'intermediate',
        requirement: {
          type: 'volume',
          totalKg: 1000000,
        },
        badge: '💎',
        color: 'purple',
        unlocks: ['Elite volume programs', 'Million Club badge'],
        points: 500,
        isCompleted: totalVolume >= 1000000,
        progress: Math.min((totalVolume / 1000000) * 100, 100),
      },
      {
        id: 'volume-5m',
        name: '5 Million Milestone',
        description: 'Lift 5,000,000kg total - elite volume achievement',
        category: 'volume',
        tier: 'advanced',
        requirement: {
          type: 'volume',
          totalKg: 5000000,
        },
        badge: '👑',
        color: 'orange',
        unlocks: ['Volume mastery programs'],
        points: 1000,
        isCompleted: totalVolume >= 5000000,
        progress: Math.min((totalVolume / 5000000) * 100, 100),
      },
      {
        id: 'volume-10m',
        name: '10 Million Legend',
        description: 'Lift 10,000,000kg total - legendary dedication',
        category: 'volume',
        tier: 'elite',
        requirement: {
          type: 'volume',
          totalKg: 10000000,
        },
        badge: '🌟',
        color: 'red',
        unlocks: ['Legend status', 'All volume programs'],
        points: 2000,
        isCompleted: totalVolume >= 10000000,
        progress: Math.min((totalVolume / 10000000) * 100, 100),
      },
    ]
  }

  /**
   * CONSISTENCY MILESTONES
   * Workout streaks and total workouts
   */
  private static generateConsistencyMilestones(userStats: UserStats): TrainingMilestone[] {
    const currentStreak = userStats.currentStreak
    const maxStreak = userStats.maxStreak
    const totalWorkouts = userStats.totalWorkouts

    return [
      // Streak milestones
      {
        id: 'streak-7-days',
        name: 'Week Warrior',
        description: 'Complete 7 consecutive days with workouts',
        category: 'consistency',
        tier: 'beginner',
        requirement: {
          type: 'consistency',
          streakDays: 7,
        },
        badge: '🔥',
        color: 'orange',
        unlocks: ['Consistency tracking'],
        points: 75,
        isCompleted: maxStreak >= 7,
        progress: Math.min((currentStreak / 7) * 100, 100),
      },
      {
        id: 'streak-30-days',
        name: 'Monthly Dedication',
        description: 'Complete 30 consecutive days with workouts',
        category: 'consistency',
        tier: 'novice',
        requirement: {
          type: 'consistency',
          streakDays: 30,
        },
        badge: '📅',
        color: 'blue',
        unlocks: ['Advanced habit tracking'],
        points: 200,
        isCompleted: maxStreak >= 30,
        progress: Math.min((currentStreak / 30) * 100, 100),
      },
      {
        id: 'streak-90-days',
        name: 'Quarter Champion',
        description: 'Complete 90 consecutive days with workouts',
        category: 'consistency',
        tier: 'intermediate',
        requirement: {
          type: 'consistency',
          streakDays: 90,
        },
        badge: '💪',
        color: 'purple',
        unlocks: ['Elite consistency programs'],
        points: 400,
        isCompleted: maxStreak >= 90,
        progress: Math.min((currentStreak / 90) * 100, 100),
      },
      {
        id: 'streak-180-days',
        name: 'Half-Year Hero',
        description: 'Complete 180 consecutive days with workouts',
        category: 'consistency',
        tier: 'advanced',
        requirement: {
          type: 'consistency',
          streakDays: 180,
        },
        badge: '🏆',
        color: 'orange',
        unlocks: ['Advanced programming'],
        points: 600,
        isCompleted: maxStreak >= 180,
        progress: Math.min((currentStreak / 180) * 100, 100),
      },
      {
        id: 'streak-365-days',
        name: 'Year-Round Athlete',
        description: 'Complete 365 consecutive days with workouts - full year!',
        category: 'consistency',
        tier: 'elite',
        requirement: {
          type: 'consistency',
          streakDays: 365,
        },
        badge: '🌟',
        color: 'red',
        unlocks: ['Elite athlete programs', 'Year-round badge'],
        points: 1000,
        isCompleted: maxStreak >= 365,
        progress: Math.min((currentStreak / 365) * 100, 100),
      },
      
      // Total workouts milestones
      {
        id: 'workouts-50',
        name: '50 Workouts',
        description: 'Complete 50 total workouts',
        category: 'consistency',
        tier: 'beginner',
        requirement: {
          type: 'consistency',
          streakDays: 0, // Not used for total workouts
        },
        badge: '🎯',
        color: 'green',
        unlocks: ['Workout analytics'],
        points: 50,
        isCompleted: totalWorkouts >= 50,
        progress: Math.min((totalWorkouts / 50) * 100, 100),
      },
      {
        id: 'workouts-100',
        name: 'Century Club',
        description: 'Complete 100 total workouts',
        category: 'consistency',
        tier: 'novice',
        requirement: {
          type: 'consistency',
          streakDays: 0,
        },
        badge: '💯',
        color: 'blue',
        unlocks: ['Advanced analytics'],
        points: 150,
        isCompleted: totalWorkouts >= 100,
        progress: Math.min((totalWorkouts / 100) * 100, 100),
      },
      {
        id: 'workouts-500',
        name: 'Dedicated Athlete',
        description: 'Complete 500 total workouts',
        category: 'consistency',
        tier: 'intermediate',
        requirement: {
          type: 'consistency',
          streakDays: 0,
        },
        badge: '⚡',
        color: 'purple',
        unlocks: ['Professional programs'],
        points: 400,
        isCompleted: totalWorkouts >= 500,
        progress: Math.min((totalWorkouts / 500) * 100, 100),
      },
      {
        id: 'workouts-1000',
        name: '1000 Workout Legend',
        description: 'Complete 1000 total workouts - elite dedication',
        category: 'consistency',
        tier: 'elite',
        requirement: {
          type: 'consistency',
          streakDays: 0,
        },
        badge: '👑',
        color: 'red',
        unlocks: ['Legend status', 'All programs'],
        points: 1000,
        isCompleted: totalWorkouts >= 1000,
        progress: Math.min((totalWorkouts / 1000) * 100, 100),
      },
    ]
  }

  /**
   * ENDURANCE MILESTONES
   * Rep-based bodyweight achievements
   */
  private static generateEnduranceMilestones(userStats: UserStats): TrainingMilestone[] {
    const pullupsPR = userStats.personalRecords['Pull-ups']
    const pushusPR = userStats.personalRecords['Push-ups']

    return [
      // Pull-ups
      {
        id: 'pullups-5',
        name: '5 Pull-ups',
        description: 'Complete 5 unbroken pull-ups',
        category: 'endurance',
        tier: 'beginner',
        requirement: {
          type: 'endurance',
          exercise: 'Pull-ups',
          reps: 5,
        },
        badge: '🤸',
        color: 'green',
        unlocks: ['Pull-up progressions'],
        points: 50,
        isCompleted: pullupsPR ? pullupsPR.reps >= 5 : false,
        progress: pullupsPR ? Math.min((pullupsPR.reps / 5) * 100, 100) : 0,
      },
      {
        id: 'pullups-10',
        name: '10 Pull-ups',
        description: 'Complete 10 unbroken pull-ups',
        category: 'endurance',
        tier: 'novice',
        requirement: {
          type: 'endurance',
          exercise: 'Pull-ups',
          reps: 10,
        },
        badge: '💪',
        color: 'blue',
        unlocks: ['Advanced pull-up programs'],
        points: 100,
        isCompleted: pullupsPR ? pullupsPR.reps >= 10 : false,
        progress: pullupsPR ? Math.min((pullupsPR.reps / 10) * 100, 100) : 0,
      },
      {
        id: 'pullups-20',
        name: '20 Pull-ups',
        description: 'Complete 20 unbroken pull-ups - impressive!',
        category: 'endurance',
        tier: 'advanced',
        requirement: {
          type: 'endurance',
          exercise: 'Pull-ups',
          reps: 20,
        },
        badge: '🔥',
        color: 'orange',
        unlocks: ['Elite pull-up programs'],
        points: 250,
        isCompleted: pullupsPR ? pullupsPR.reps >= 20 : false,
        progress: pullupsPR ? Math.min((pullupsPR.reps / 20) * 100, 100) : 0,
      },
      {
        id: 'pullups-30',
        name: '30 Pull-ups',
        description: 'Complete 30 unbroken pull-ups - elite endurance',
        category: 'endurance',
        tier: 'elite',
        requirement: {
          type: 'endurance',
          exercise: 'Pull-ups',
          reps: 30,
        },
        badge: '⚡',
        color: 'red',
        unlocks: ['Elite endurance programs'],
        points: 400,
        isCompleted: pullupsPR ? pullupsPR.reps >= 30 : false,
        progress: pullupsPR ? Math.min((pullupsPR.reps / 30) * 100, 100) : 0,
      },

      // Push-ups
      {
        id: 'pushups-20',
        name: '20 Push-ups',
        description: 'Complete 20 unbroken push-ups',
        category: 'endurance',
        tier: 'beginner',
        requirement: {
          type: 'endurance',
          exercise: 'Push-ups',
          reps: 20,
        },
        badge: '💪',
        color: 'green',
        unlocks: ['Push-up progressions'],
        points: 40,
        isCompleted: pushusPR ? pushusPR.reps >= 20 : false,
        progress: pushusPR ? Math.min((pushusPR.reps / 20) * 100, 100) : 0,
      },
      {
        id: 'pushups-50',
        name: '50 Push-ups',
        description: 'Complete 50 unbroken push-ups',
        category: 'endurance',
        tier: 'intermediate',
        requirement: {
          type: 'endurance',
          exercise: 'Push-ups',
          reps: 50,
        },
        badge: '🔥',
        color: 'blue',
        unlocks: ['Advanced push-up programs'],
        points: 100,
        isCompleted: pushusPR ? pushusPR.reps >= 50 : false,
        progress: pushusPR ? Math.min((pushusPR.reps / 50) * 100, 100) : 0,
      },
      {
        id: 'pushups-100',
        name: '100 Push-ups',
        description: 'Complete 100 unbroken push-ups - incredible endurance!',
        category: 'endurance',
        tier: 'advanced',
        requirement: {
          type: 'endurance',
          exercise: 'Push-ups',
          reps: 100,
        },
        badge: '💯',
        color: 'purple',
        unlocks: ['Elite push-up programs'],
        points: 300,
        isCompleted: pushusPR ? pushusPR.reps >= 100 : false,
        progress: pushusPR ? Math.min((pushusPR.reps / 100) * 100, 100) : 0,
      },
    ]
  }

  /**
   * TECHNIQUE MILESTONES
   * Exercise mastery certifications
   */
  private static generateTechniqueMilestones(userStats: UserStats): TrainingMilestone[] {
    const mastery = userStats.exerciseMastery

    return [
      {
        id: 'squat-form-certified',
        name: 'Squat Form Certified',
        description: 'Master proper squat technique with consistent depth and form',
        category: 'technique',
        tier: 'novice',
        requirement: {
          type: 'technique',
          exercise: 'Squat',
          criteria: 'Consistent depth, neutral spine, knee tracking',
        },
        badge: '✅',
        color: 'green',
        unlocks: ['Advanced squat variations'],
        points: 100,
        isCompleted: mastery['Squat'] === 'mastered',
        progress: mastery['Squat'] === 'mastered' ? 100 : mastery['Squat'] === 'proficient' ? 66 : 33,
      },
      {
        id: 'deadlift-form-certified',
        name: 'Deadlift Form Certified',
        description: 'Master proper deadlift technique with neutral spine and hip hinge',
        category: 'technique',
        tier: 'novice',
        requirement: {
          type: 'technique',
          exercise: 'Deadlift',
          criteria: 'Neutral spine, hip hinge, bar path',
        },
        badge: '✅',
        color: 'green',
        unlocks: ['Advanced pulling variations'],
        points: 100,
        isCompleted: mastery['Deadlift'] === 'mastered',
        progress: mastery['Deadlift'] === 'mastered' ? 100 : mastery['Deadlift'] === 'proficient' ? 66 : 33,
      },
      {
        id: 'bench-form-certified',
        name: 'Bench Press Form Certified',
        description: 'Master proper bench press technique with shoulder stability',
        category: 'technique',
        tier: 'novice',
        requirement: {
          type: 'technique',
          exercise: 'Bench Press',
          criteria: 'Shoulder retraction, leg drive, bar path',
        },
        badge: '✅',
        color: 'green',
        unlocks: ['Advanced pressing variations'],
        points: 100,
        isCompleted: mastery['Bench Press'] === 'mastered',
        progress: mastery['Bench Press'] === 'mastered' ? 100 : mastery['Bench Press'] === 'proficient' ? 66 : 33,
      },
    ]
  }

  /**
   * Get next suggested milestones (3-5 closest to completion)
   */
  static getNextMilestones(userStats: UserStats, limit: number = 5): TrainingMilestone[] {
    const allMilestones = this.generateMilestones(userStats)
    
    // Filter incomplete milestones and sort by progress (descending)
    const incomplete = allMilestones
      .filter(m => !m.isCompleted && m.progress > 0)
      .sort((a, b) => b.progress - a.progress)
    
    return incomplete.slice(0, limit)
  }

  /**
   * Get recently earned milestones
   */
  static getRecentlyEarned(userStats: UserStats, limit: number = 5): TrainingMilestone[] {
    const allMilestones = this.generateMilestones(userStats)
    
    return allMilestones
      .filter(m => m.isCompleted && m.dateEarned)
      .sort((a, b) => {
        if (!a.dateEarned || !b.dateEarned) return 0
        return b.dateEarned.getTime() - a.dateEarned.getTime()
      })
      .slice(0, limit)
  }

  /**
   * Get milestones by category
   */
  static getMilestonesByCategory(
    userStats: UserStats,
    category: MilestoneCategory
  ): TrainingMilestone[] {
    const allMilestones = this.generateMilestones(userStats)
    return allMilestones.filter(m => m.category === category)
  }

  /**
   * Get milestones by tier
   */
  static getMilestonesByTier(
    userStats: UserStats,
    tier: MilestoneTier
  ): TrainingMilestone[] {
    const allMilestones = this.generateMilestones(userStats)
    return allMilestones.filter(m => m.tier === tier)
  }

  /**
   * Get completion statistics
   */
  static getCompletionStats(userStats: UserStats): {
    total: number
    completed: number
    inProgress: number
    locked: number
    completionPercentage: number
    byCategory: Record<MilestoneCategory, { total: number; completed: number }>
    byTier: Record<MilestoneTier, { total: number; completed: number }>
  } {
    const allMilestones = this.generateMilestones(userStats)
    
    const total = allMilestones.length
    const completed = allMilestones.filter(m => m.isCompleted).length
    const inProgress = allMilestones.filter(m => !m.isCompleted && m.progress > 0).length
    const locked = allMilestones.filter(m => m.progress === 0).length
    const completionPercentage = total > 0 ? (completed / total) * 100 : 0

    // By category
    const byCategory: Record<MilestoneCategory, { total: number; completed: number }> = {
      strength: { total: 0, completed: 0 },
      volume: { total: 0, completed: 0 },
      consistency: { total: 0, completed: 0 },
      technique: { total: 0, completed: 0 },
      endurance: { total: 0, completed: 0 },
      'body-recomp': { total: 0, completed: 0 },
    }

    allMilestones.forEach(m => {
      byCategory[m.category].total++
      if (m.isCompleted) byCategory[m.category].completed++
    })

    // By tier
    const byTier: Record<MilestoneTier, { total: number; completed: number }> = {
      beginner: { total: 0, completed: 0 },
      novice: { total: 0, completed: 0 },
      intermediate: { total: 0, completed: 0 },
      advanced: { total: 0, completed: 0 },
      elite: { total: 0, completed: 0 },
      'world-class': { total: 0, completed: 0 },
    }

    allMilestones.forEach(m => {
      byTier[m.tier].total++
      if (m.isCompleted) byTier[m.tier].completed++
    })

    return {
      total,
      completed,
      inProgress,
      locked,
      completionPercentage,
      byCategory,
      byTier,
    }
  }
}
