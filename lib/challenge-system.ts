/**
 * Challenge System
 * Transform workouts into realistic training challenges with metrics-based progression
 * 
 * Features:
 * - Daily challenges (24-hour reset)
 * - Weekly challenges (7-day reset)
 * - Progression milestones (long-term goals)
 * - Advanced multi-part challenges
 * - Real fitness metrics and clear success criteria
 */

import { PrismaClient } from '@prisma/client'

// Challenge Types
export type ChallengeType = 'daily' | 'weekly' | 'progression' | 'advanced' | 'bonus'
export type ChallengeDifficulty = 'beginner' | 'intermediate' | 'advanced' | 'elite' | 'legendary'
export type ChallengeCategory = 'strength' | 'volume' | 'consistency' | 'technique' | 'progressive-overload' | 'endurance'
export type ChallengeStatus = 'available' | 'active' | 'completed' | 'expired'

// Challenge Interface
export interface Challenge {
  id: string
  type: ChallengeType
  category: ChallengeCategory
  difficulty: ChallengeDifficulty
  status: ChallengeStatus
  
  // Content
  title: string
  description: string
  
  // Requirements
  requirements: ChallengeRequirement[]
  
  // Progress
  progress: number // 0-100%
  currentValue: number
  targetValue: number
  
  // Rewards
  rewards: ChallengeReward[]
  
  // Metadata
  expiresAt?: Date
  completedAt?: Date
  icon: string
  tags: string[]
}

// Challenge Requirement
export interface ChallengeRequirement {
  type: 'workout-count' | 'total-volume' | 'exercise-specific' | 'streak' | 'intensity' | 'pr-attempt' | 'time-based'
  description: string
  current: number
  target: number
  unit?: string
  exerciseName?: string // For exercise-specific requirements
}

// Challenge Reward
export interface ChallengeReward {
  type: 'xp' | 'achievement' | 'template' | 'feature' | 'title'
  amount?: number
  name?: string
  description: string
  icon: string
}

// User Stats Interface
export interface UserStats {
  totalWorkouts: number
  currentStreak: number
  totalVolume: number
  weeklyWorkouts: number
  monthlyWorkouts: number
  tier: string
  bodyweight?: number
  benchPR?: number
  squatPR?: number
  deadliftPR?: number
}

export class ChallengeSystem {
  /**
   * Generate daily challenges (reset every 24 hours)
   */
  static generateDailyChallenges(userStats: UserStats): Challenge[] {
    const challenges: Challenge[] = []
    const tier = userStats.tier || 'Beginner'
    
    // Challenge 1: Complete a Workout (Beginner)
    challenges.push({
      id: 'daily-workout',
      type: 'daily',
      category: 'consistency',
      difficulty: 'beginner',
      status: 'available',
      title: 'Complete a Workout',
      description: 'Complete 1 workout session today to maintain your training momentum',
      requirements: [{
        type: 'workout-count',
        description: 'Workout completed',
        current: 0,
        target: 1,
      }],
      progress: 0,
      currentValue: 0,
      targetValue: 1,
      rewards: [
        { type: 'xp', amount: 50, description: '+50 Progress Points', icon: '⭐' },
        { type: 'achievement', name: 'Daily Warrior', description: 'Complete daily training', icon: '🎯' },
      ],
      expiresAt: this.getNextDayReset(),
      icon: '🎯',
      tags: ['daily', 'consistency'],
    })
    
    // Challenge 2: Volume Target (Intermediate)
    const volumeTarget = this.calculateVolumeTarget(tier)
    challenges.push({
      id: 'daily-volume',
      type: 'daily',
      category: 'volume',
      difficulty: 'intermediate',
      status: 'available',
      title: 'Hit Volume Target',
      description: `Lift ${volumeTarget.toLocaleString()}kg total volume today`,
      requirements: [{
        type: 'total-volume',
        description: 'Total volume lifted',
        current: 0,
        target: volumeTarget,
        unit: 'kg',
      }],
      progress: 0,
      currentValue: 0,
      targetValue: volumeTarget,
      rewards: [
        { type: 'xp', amount: 75, description: '+75 Progress Points', icon: '⭐' },
        { type: 'achievement', name: 'Volume Crusher', description: 'Hit daily volume target', icon: '💪' },
      ],
      expiresAt: this.getNextDayReset(),
      icon: '💪',
      tags: ['daily', 'volume'],
    })
    
    // Challenge 3: High Intensity Work (Advanced)
    challenges.push({
      id: 'daily-intensity',
      type: 'daily',
      category: 'strength',
      difficulty: 'advanced',
      status: 'available',
      title: 'High Intensity Training',
      description: 'Complete 5 sets at RPE 8 or higher to build strength',
      requirements: [{
        type: 'intensity',
        description: 'High RPE sets (8+)',
        current: 0,
        target: 5,
      }],
      progress: 0,
      currentValue: 0,
      targetValue: 5,
      rewards: [
        { type: 'xp', amount: 100, description: '+100 Progress Points', icon: '⭐' },
        { type: 'achievement', name: 'Intensity Master', description: 'Complete high-intensity work', icon: '🔥' },
      ],
      expiresAt: this.getNextDayReset(),
      icon: '🔥',
      tags: ['daily', 'intensity'],
    })
    
    return challenges
  }

  /**
   * Generate weekly challenges (reset every Monday)
   */
  static generateWeeklyChallenges(userStats: UserStats): Challenge[] {
    const challenges: Challenge[] = []
    const tier = userStats.tier || 'Beginner'
    
    // Challenge 1: Workout Frequency (Intermediate)
    const workoutsTarget = this.calculateWorkoutFrequency(tier)
    challenges.push({
      id: 'weekly-frequency',
      type: 'weekly',
      category: 'consistency',
      difficulty: 'intermediate',
      status: 'available',
      title: 'Maintain Training Frequency',
      description: `Complete ${workoutsTarget} workouts this week`,
      requirements: [{
        type: 'workout-count',
        description: 'Workouts completed',
        current: 0,
        target: workoutsTarget,
      }],
      progress: 0,
      currentValue: 0,
      targetValue: workoutsTarget,
      rewards: [
        { type: 'xp', amount: 200, description: '+200 Progress Points', icon: '⭐' },
        { type: 'template', name: 'PPL Program', description: 'Unlock Push/Pull/Legs program', icon: '📋' },
        { type: 'achievement', name: 'Weekly Warrior', description: 'Complete weekly frequency goal', icon: '🎖️' },
      ],
      expiresAt: this.getNextWeekReset(),
      icon: '📅',
      tags: ['weekly', 'consistency'],
    })
    
    // Challenge 2: Total Volume (Advanced)
    const weeklyVolumeTarget = this.calculateWeeklyVolumeTarget(tier)
    challenges.push({
      id: 'weekly-volume',
      type: 'weekly',
      category: 'volume',
      difficulty: 'advanced',
      status: 'available',
      title: 'Weekly Volume Goal',
      description: `Lift ${weeklyVolumeTarget.toLocaleString()}kg total volume this week`,
      requirements: [{
        type: 'total-volume',
        description: 'Total volume',
        current: 0,
        target: weeklyVolumeTarget,
        unit: 'kg',
      }],
      progress: 0,
      currentValue: 0,
      targetValue: weeklyVolumeTarget,
      rewards: [
        { type: 'xp', amount: 300, description: '+300 Progress Points', icon: '⭐' },
        { type: 'feature', name: 'Advanced Metrics', description: 'Unlock advanced analytics', icon: '📊' },
      ],
      expiresAt: this.getNextWeekReset(),
      icon: '⚡',
      tags: ['weekly', 'volume'],
    })
    
    // Challenge 3: Progressive Overload (Advanced)
    challenges.push({
      id: 'weekly-overload',
      type: 'weekly',
      category: 'progressive-overload',
      difficulty: 'advanced',
      status: 'available',
      title: 'Progressive Overload',
      description: 'Increase weight on at least 2 exercises this week',
      requirements: [{
        type: 'exercise-specific',
        description: 'Weight increases',
        current: 0,
        target: 2,
      }],
      progress: 0,
      currentValue: 0,
      targetValue: 2,
      rewards: [
        { type: 'xp', amount: 250, description: '+250 Progress Points', icon: '⭐' },
        { type: 'achievement', name: 'Gains Master', description: 'Progressive overload success', icon: '📈' },
      ],
      expiresAt: this.getNextWeekReset(),
      icon: '📈',
      tags: ['weekly', 'progressive-overload'],
    })
    
    return challenges
  }

  /**
   * Generate progression challenges (long-term milestones)
   */
  static generateProgressionChallenges(_userStats: UserStats): Challenge[] {
    const challenges: Challenge[] = []
    
    // Challenge 1: Set a Personal Record (Advanced)
    challenges.push({
      id: 'progression-pr',
      type: 'progression',
      category: 'strength',
      difficulty: 'advanced',
      status: 'available',
      title: 'Set a Personal Record',
      description: 'Set a new 1RM on any compound lift (bench/squat/deadlift)',
      requirements: [{
        type: 'pr-attempt',
        description: 'New PR on compound lift',
        current: 0,
        target: 1,
      }],
      progress: 0,
      currentValue: 0,
      targetValue: 1,
      rewards: [
        { type: 'xp', amount: 500, description: '+500 Progress Points', icon: '⭐' },
        { type: 'template', name: 'German Volume Training', description: 'Unlock GVT program', icon: '💀' },
        { type: 'achievement', name: 'PR Breaker', description: 'Set new personal record', icon: '🏆' },
        { type: 'feature', name: 'Advanced Techniques', description: 'Unlock advanced training methods', icon: '🔓' },
      ],
      icon: '🏆',
      tags: ['progression', 'strength', 'pr'],
    })
    
    // Challenge 2: Consistency Streak (Intermediate)
    challenges.push({
      id: 'progression-consistency',
      type: 'progression',
      category: 'consistency',
      difficulty: 'intermediate',
      status: 'available',
      title: 'Build Training Consistency',
      description: 'Complete workouts 4 days per week for 4 consecutive weeks',
      requirements: [
        {
          type: 'workout-count',
          description: 'Total workouts',
          current: 0,
          target: 16,
        },
        {
          type: 'streak',
          description: 'Weeks with 4+ workouts',
          current: 0,
          target: 4,
        },
      ],
      progress: 0,
      currentValue: 0,
      targetValue: 16,
      rewards: [
        { type: 'xp', amount: 800, description: '+800 Progress Points', icon: '⭐' },
        { type: 'title', name: 'The Relentless', description: 'Perfect consistency achievement', icon: '👑' },
        { type: 'achievement', name: 'Consistency King', description: 'Maintain 4-week streak', icon: '🔥' },
      ],
      icon: '🔥',
      tags: ['progression', 'consistency'],
    })
    
    // Challenge 3: Endurance Milestone (Advanced)
    challenges.push({
      id: 'progression-endurance',
      type: 'progression',
      category: 'endurance',
      difficulty: 'advanced',
      status: 'available',
      title: 'Endurance Milestone',
      description: 'Complete a 60-minute workout session',
      requirements: [{
        type: 'time-based',
        description: 'Workout duration',
        current: 0,
        target: 60,
        unit: 'min',
      }],
      progress: 0,
      currentValue: 0,
      targetValue: 60,
      rewards: [
        { type: 'xp', amount: 500, description: '+500 Progress Points', icon: '⭐' },
        { type: 'feature', name: 'Cardio Tracker', description: 'Unlock cardio metrics', icon: '❤️' },
        { type: 'achievement', name: 'Endurance Athlete', description: 'Complete 60-min session', icon: '🏃' },
      ],
      icon: '🏃',
      tags: ['progression', 'endurance'],
    })
    
    return challenges
  }

  /**
   * Generate advanced multi-part challenges
   */
  static generateAdvancedChallenges(_userStats: UserStats): Challenge[] {
    const challenges: Challenge[] = []
    
    // Challenge 1: Full Body Training Week (Intermediate)
    challenges.push({
      id: 'advanced-fullbody',
      type: 'advanced',
      category: 'technique',
      difficulty: 'intermediate',
      status: 'available',
      title: 'Complete Full Body Training Week',
      description: 'Train all major muscle groups: push, pull, and legs',
      requirements: [
        {
          type: 'exercise-specific',
          description: 'Push workout (chest/shoulders/triceps)',
          current: 0,
          target: 1,
        },
        {
          type: 'exercise-specific',
          description: 'Pull workout (back/biceps)',
          current: 0,
          target: 1,
        },
        {
          type: 'exercise-specific',
          description: 'Legs workout (quads/hamstrings/glutes)',
          current: 0,
          target: 1,
        },
      ],
      progress: 0,
      currentValue: 0,
      targetValue: 3,
      rewards: [
        { type: 'xp', amount: 400, description: '+400 Progress Points', icon: '⭐' },
        { type: 'achievement', name: 'Balanced Athlete', description: 'Complete full body training', icon: '⚖️' },
        { type: 'template', name: 'Full Body Program', description: 'Unlock full body routine', icon: '📋' },
      ],
      expiresAt: this.getNextWeekReset(),
      icon: '⚖️',
      tags: ['advanced', 'technique'],
    })
    
    // Challenge 2: Big 3 Progression (Elite)
    challenges.push({
      id: 'advanced-big3',
      type: 'advanced',
      category: 'progressive-overload',
      difficulty: 'elite',
      status: 'available',
      title: 'Big 3 Progressive Overload',
      description: 'Increase weight on bench press, squat, and deadlift within 2 weeks',
      requirements: [
        {
          type: 'exercise-specific',
          description: 'Bench press weight increase',
          current: 0,
          target: 1,
          exerciseName: 'Bench Press',
        },
        {
          type: 'exercise-specific',
          description: 'Squat weight increase',
          current: 0,
          target: 1,
          exerciseName: 'Squat',
        },
        {
          type: 'exercise-specific',
          description: 'Deadlift weight increase',
          current: 0,
          target: 1,
          exerciseName: 'Deadlift',
        },
      ],
      progress: 0,
      currentValue: 0,
      targetValue: 3,
      rewards: [
        { type: 'xp', amount: 600, description: '+600 Progress Points', icon: '⭐' },
        { type: 'title', name: 'Powerlifter', description: 'Master the big 3 lifts', icon: '💎' },
        { type: 'template', name: '5/3/1 Program', description: 'Unlock 5/3/1 strength program', icon: '📋' },
      ],
      icon: '💎',
      tags: ['advanced', 'progressive-overload', 'big3'],
    })
    
    // Challenge 3: Volume Accumulation (Advanced)
    challenges.push({
      id: 'advanced-volume',
      type: 'advanced',
      category: 'volume',
      difficulty: 'advanced',
      status: 'available',
      title: 'High Volume Training Block',
      description: 'Complete 5 workouts with 15+ sets each within one week',
      requirements: [
        {
          type: 'workout-count',
          description: 'High-volume workouts (15+ sets)',
          current: 0,
          target: 5,
        },
      ],
      progress: 0,
      currentValue: 0,
      targetValue: 5,
      rewards: [
        { type: 'xp', amount: 450, description: '+450 Progress Points', icon: '⭐' },
        { type: 'achievement', name: 'Volume Specialist', description: 'Complete high-volume block', icon: '💪' },
        { type: 'feature', name: 'Volume Analytics', description: 'Unlock volume tracking tools', icon: '📊' },
      ],
      expiresAt: this.getNextWeekReset(),
      icon: '💪',
      tags: ['advanced', 'volume'],
    })
    
    return challenges
  }

  /**
   * Update challenge progress based on workout data
   */
  static updateChallengeProgress(
    challenge: Challenge,
    workoutData: {
      workoutCompleted?: boolean
      totalVolume?: number
      highRPESets?: number
      prSet?: boolean
      duration?: number
      exercisesCompleted?: string[]
      weightIncreases?: { exercise: string; previousMax: number; newMax: number }[]
    }
  ): Challenge {
    const updated = { ...challenge }
    
    // Update based on requirement type
    updated.requirements = updated.requirements.map(req => {
      const updatedReq = { ...req }
      
      switch (req.type) {
        case 'workout-count':
          if (workoutData.workoutCompleted) {
            updatedReq.current = Math.min(req.current + 1, req.target)
          }
          break
          
        case 'total-volume':
          if (workoutData.totalVolume) {
            updatedReq.current = Math.min(req.current + workoutData.totalVolume, req.target)
          }
          break
          
        case 'intensity':
          if (workoutData.highRPESets) {
            updatedReq.current = Math.min(req.current + workoutData.highRPESets, req.target)
          }
          break
          
        case 'pr-attempt':
          if (workoutData.prSet) {
            updatedReq.current = 1
          }
          break
          
        case 'time-based':
          if (workoutData.duration) {
            updatedReq.current = Math.max(req.current, workoutData.duration)
          }
          break
          
        case 'exercise-specific':
          if (workoutData.exercisesCompleted && req.exerciseName) {
            if (workoutData.exercisesCompleted.includes(req.exerciseName)) {
              updatedReq.current = Math.min(req.current + 1, req.target)
            }
          } else if (workoutData.weightIncreases) {
            const increase = workoutData.weightIncreases.find(w => 
              !req.exerciseName || w.exercise === req.exerciseName
            )
            if (increase) {
              updatedReq.current = Math.min(req.current + 1, req.target)
            }
          }
          break
      }
      
      return updatedReq
    })
    
    // Calculate overall progress
    const totalRequirements = updated.requirements.length
    const completedRequirements = updated.requirements.filter(r => r.current >= r.target).length
    updated.progress = Math.round((completedRequirements / totalRequirements) * 100)
    
    // Update current value (sum of all requirement progress)
    updated.currentValue = updated.requirements.reduce((sum, req) => sum + req.current, 0)
    
    // Check if completed
    if (updated.progress === 100 && updated.status !== 'completed') {
      updated.status = 'completed'
      updated.completedAt = new Date()
    }
    
    return updated
  }

  /**
   * Mark challenge as active
   */
  static activateChallenge(challenge: Challenge): Challenge {
    return {
      ...challenge,
      status: 'active',
    }
  }

  /**
   * Complete challenge and award rewards
   */
  static async completeChallenge(
    prisma: PrismaClient,
    userId: string,
    challenge: Challenge
  ): Promise<{ success: boolean; xp: number; unlocked: Array<{ type: string; name?: string; description: string; icon: string }> }> {
    if (challenge.status !== 'completed') {
      return { success: false, xp: 0, unlocked: [] }
    }
    
    let totalXP = 0
    const unlocked: Array<{ type: string; name?: string; description: string; icon: string }> = []
    
    // Process rewards
    for (const reward of challenge.rewards) {
      if (reward.type === 'xp' && reward.amount) {
        totalXP += reward.amount
      } else if (reward.type === 'achievement' || reward.type === 'template' || reward.type === 'feature' || reward.type === 'title') {
        unlocked.push({
          type: reward.type,
          name: reward.name,
          description: reward.description,
          icon: reward.icon,
        })
      }
    }
    
    // Award XP (update user progress)
    if (totalXP > 0) {
      // Note: Adjust this based on your User model schema
      // If you don't have an 'xp' field, you may need to track this differently
      try {
        await prisma.user.update({
          where: { id: userId },
          data: {
            // XP tracking - adjust based on your schema
            updatedAt: new Date(),
          },
        })
      } catch (error) {
        console.error('Error updating user:', error)
      }
    }
    
    return { success: true, xp: totalXP, unlocked }
  }

  /**
   * Get all active challenges for a user
   */
  static getActiveChallenges(allChallenges: Challenge[]): Challenge[] {
    return allChallenges.filter(c => c.status === 'active' || c.status === 'available')
  }

  /**
   * Get completed challenges
   */
  static getCompletedChallenges(allChallenges: Challenge[]): Challenge[] {
    return allChallenges.filter(c => c.status === 'completed')
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  /**
   * Calculate volume target based on tier
   */
  private static calculateVolumeTarget(tier: string): number {
    const tierMultipliers: Record<string, number> = {
      'Novice': 1500,
      'Beginner': 2000,
      'Intermediate': 2500,
      'Advanced': 3000,
      'Elite': 3500,
      'Master': 4000,
    }
    return tierMultipliers[tier] || 2000
  }

  /**
   * Calculate weekly volume target based on tier
   */
  private static calculateWeeklyVolumeTarget(tier: string): number {
    const tierMultipliers: Record<string, number> = {
      'Novice': 8000,
      'Beginner': 10000,
      'Intermediate': 12000,
      'Advanced': 15000,
      'Elite': 18000,
      'Master': 20000,
    }
    return tierMultipliers[tier] || 10000
  }

  /**
   * Calculate workout frequency based on tier
   */
  private static calculateWorkoutFrequency(tier: string): number {
    const tierFrequencies: Record<string, number> = {
      'Novice': 3,
      'Beginner': 3,
      'Intermediate': 4,
      'Advanced': 4,
      'Elite': 5,
      'Master': 5,
    }
    return tierFrequencies[tier] || 3
  }

  /**
   * Get next day reset time (tomorrow at midnight)
   */
  private static getNextDayReset(): Date {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)
    return tomorrow
  }

  /**
   * Get next week reset time (next Monday at midnight)
   */
  private static getNextWeekReset(): Date {
    const now = new Date()
    const daysUntilMonday = (8 - now.getDay()) % 7 || 7
    const nextMonday = new Date(now)
    nextMonday.setDate(now.getDate() + daysUntilMonday)
    nextMonday.setHours(0, 0, 0, 0)
    return nextMonday
  }
}
