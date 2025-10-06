/**
 * Habit Formation System
 * 
 * Tracks consistency, streaks, and achievements to build sustainable training habits
 */

export interface StreakData {
  current: number
  longest: number
  lastWorkout: Date | null
}

export interface Achievement {
  id: string
  title: string
  description: string
  category: 'consistency' | 'volume' | 'strength' | 'milestone'
  unlockedAt?: Date
  icon?: string
}

export interface UserStats {
  totalWorkouts: number
  totalVolume: number
  streak: number
  prs: number
}

export class HabitFormationSystem {
  /**
   * Update user's workout streak based on last workout date
   */
  updateStreak(currentStreak: number, lastWorkout: Date | null): { current: number; broken: boolean } {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    
    if (!lastWorkout) {
      return { current: 1, broken: false }
    }

    const lastWorkoutDate = new Date(lastWorkout)
    const lastDate = new Date(
      lastWorkoutDate.getFullYear(),
      lastWorkoutDate.getMonth(),
      lastWorkoutDate.getDate()
    )
    
    const daysSinceLastWorkout = Math.floor(
      (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
    )

    if (daysSinceLastWorkout === 0) {
      // Same day - maintain streak
      return { current: currentStreak, broken: false }
    } else if (daysSinceLastWorkout === 1) {
      // Consecutive day - increment streak
      return { current: currentStreak + 1, broken: false }
    } else if (daysSinceLastWorkout === 2) {
      // One day missed - maintain streak (grace period)
      return { current: currentStreak, broken: false }
    } else {
      // Streak broken - restart at 1
      return { current: 1, broken: true }
    }
  }

  /**
   * Check for newly unlocked achievements based on user stats
   */
  checkAchievements(stats: UserStats): Achievement[] {
    const achievements: Achievement[] = []

    // First workout achievement
    if (stats.totalWorkouts === 1) {
      achievements.push({
        id: 'first_workout',
        title: 'First Steps',
        description: 'Complete your first workout',
        category: 'milestone',
        icon: '🎯',
      })
    }

    // Workout milestones
    const workoutMilestones = [10, 25, 50, 100, 200, 500, 1000]
    for (const milestone of workoutMilestones) {
      if (stats.totalWorkouts === milestone) {
        achievements.push({
          id: `workouts_${milestone}`,
          title: `Iron Warrior ${milestone}`,
          description: `Complete ${milestone} workouts`,
          category: 'milestone',
          icon: '💪',
        })
      }
    }

    // Volume milestones (in kg)
    const volumeMilestones = [
      { volume: 10000, title: 'Heavy Lifter', icon: '🏋️' },
      { volume: 50000, title: 'Iron Beast', icon: '🦾' },
      { volume: 100000, title: 'Titan', icon: '⚡' },
      { volume: 500000, title: 'Hercules', icon: '🏛️' },
      { volume: 1000000, title: 'God Mode', icon: '⚡' },
    ]

    for (const milestone of volumeMilestones) {
      if (stats.totalVolume >= milestone.volume) {
        achievements.push({
          id: `volume_${milestone.volume}`,
          title: milestone.title,
          description: `Lift ${milestone.volume.toLocaleString()}kg total`,
          category: 'volume',
          icon: milestone.icon,
        })
        break // Only award the highest achieved
      }
    }

    // Consistency achievements (streaks)
    const streakMilestones = [
      { days: 7, title: 'Week Warrior', icon: '🔥' },
      { days: 14, title: 'Fortnight Fighter', icon: '🔥' },
      { days: 30, title: 'Monthly Master', icon: '🔥' },
      { days: 60, title: 'Dedicated', icon: '🏆' },
      { days: 90, title: 'Committed', icon: '💎' },
      { days: 180, title: 'Half Year Hero', icon: '🌟' },
      { days: 365, title: 'Year of Gains', icon: '👑' },
    ]

    for (const milestone of streakMilestones) {
      if (stats.streak >= milestone.days) {
        achievements.push({
          id: `streak_${milestone.days}`,
          title: milestone.title,
          description: `${milestone.days} day streak`,
          category: 'consistency',
          icon: milestone.icon,
        })
        break // Only award the highest achieved
      }
    }

    // PR achievements
    const prMilestones = [
      { prs: 1, title: 'First PR', icon: '🎯' },
      { prs: 5, title: 'Strength Surge', icon: '📈' },
      { prs: 10, title: 'PR Machine', icon: '🚀' },
      { prs: 25, title: 'Limit Breaker', icon: '💥' },
      { prs: 50, title: 'Unstoppable', icon: '🏆' },
      { prs: 100, title: 'PR Legend', icon: '👑' },
    ]

    for (const milestone of prMilestones) {
      if (stats.prs >= milestone.prs) {
        achievements.push({
          id: `pr_${milestone.prs}`,
          title: milestone.title,
          description: `Set ${milestone.prs} personal records`,
          category: 'strength',
          icon: milestone.icon,
        })
        break // Only award the highest achieved
      }
    }

    return achievements
  }

  /**
   * Generate motivational message based on context
   */
  generateMotivationalMessage(
    context: 'positive' | 'supportive' | 'streak' | 'pr' | 'milestone'
  ): string {
    const messages = {
      positive: [
        'Great work! Keep pushing!',
        'Excellent form today!',
        "You're crushing it!",
        'Strong performance!',
        'Outstanding effort!',
        'Beast mode activated!',
        'Impressive work!',
        "You're on fire today!",
      ],
      supportive: [
        'Every rep counts!',
        'Progress, not perfection!',
        "You've got this!",
        'Stay consistent!',
        'Trust the process!',
        'One day at a time!',
        'Keep showing up!',
        'Strength is earned!',
      ],
      streak: [
        'Consistency is key!',
        'Another day, another victory!',
        'Building unstoppable habits!',
        'Streak master!',
        'Dedication pays off!',
        "You're unstoppable!",
      ],
      pr: [
        'NEW PERSONAL RECORD!',
        'LIMIT BREAKER!',
        "You're getting stronger!",
        'Breaking boundaries!',
        'New heights reached!',
        'Strength milestone unlocked!',
      ],
      milestone: [
        'Milestone achieved!',
        'Level up!',
        'Achievement unlocked!',
        'Goal crushed!',
        'Victory earned!',
        'Champion status!',
      ],
    }

    const contextMessages = messages[context]
    return contextMessages[Math.floor(Math.random() * contextMessages.length)]
  }

  /**
   * Calculate workout frequency recommendation
   */
  recommendFrequency(
    recentWorkouts: number,
    timeframe: number, // in days
    userLevel: 'beginner' | 'intermediate' | 'advanced'
  ): {
    recommendation: string
    optimalFrequency: number
    currentFrequency: number
  } {
    const currentFrequency = (recentWorkouts / timeframe) * 7 // per week
    
    const optimalFrequency = {
      beginner: 3,
      intermediate: 4,
      advanced: 5,
    }[userLevel]

    let recommendation: string

    if (currentFrequency < optimalFrequency * 0.7) {
      recommendation = `Consider increasing frequency. Aim for ${optimalFrequency} sessions per week.`
    } else if (currentFrequency > optimalFrequency * 1.3) {
      recommendation = 'High training frequency detected. Ensure adequate recovery.'
    } else {
      recommendation = `Frequency looks good! Maintaining ${optimalFrequency} sessions per week.`
    }

    return {
      recommendation,
      optimalFrequency,
      currentFrequency: Math.round(currentFrequency * 10) / 10,
    }
  }

  /**
   * Analyze training consistency
   */
  analyzeConsistency(workoutDates: Date[]): {
    consistency: number // percentage
    averageGap: number // days
    longestGap: number // days
    assessment: string
  } {
    if (workoutDates.length < 2) {
      return {
        consistency: 0,
        averageGap: 0,
        longestGap: 0,
        assessment: 'Not enough data to analyze consistency',
      }
    }

    // Sort dates chronologically
    const sortedDates = [...workoutDates].sort((a, b) => a.getTime() - b.getTime())
    
    let totalGap = 0
    let longestGap = 0
    let consistentDays = 0
    
    for (let i = 1; i < sortedDates.length; i++) {
      const gap = Math.floor(
        (sortedDates[i].getTime() - sortedDates[i - 1].getTime()) / (1000 * 60 * 60 * 24)
      )
      totalGap += gap
      longestGap = Math.max(longestGap, gap)
      
      // Consider consistent if gap is 3 days or less
      if (gap <= 3) {
        consistentDays++
      }
    }

    const averageGap = totalGap / (sortedDates.length - 1)
    const consistency = (consistentDays / (sortedDates.length - 1)) * 100

    let assessment: string
    if (consistency >= 80) {
      assessment = 'Excellent consistency! Keep up the great work!'
    } else if (consistency >= 60) {
      assessment = 'Good consistency. Try to reduce gaps between workouts.'
    } else if (consistency >= 40) {
      assessment = 'Moderate consistency. Focus on building a regular schedule.'
    } else {
      assessment = 'Inconsistent training. Set a schedule and stick to it.'
    }

    return {
      consistency: Math.round(consistency),
      averageGap: Math.round(averageGap * 10) / 10,
      longestGap,
      assessment,
    }
  }

  /**
   * Create a habit trigger reminder
   */
  createHabitTrigger(
    preferredTime: string,
    preferredDays: string[]
  ): {
    trigger: string
    cue: string
    routine: string
    reward: string
  } {
    const timeOfDay = parseInt(preferredTime.split(':')[0]) < 12 ? 'morning' : 
                     parseInt(preferredTime.split(':')[0]) < 17 ? 'afternoon' : 'evening'

    const triggers = {
      morning: {
        trigger: 'After morning coffee/breakfast',
        cue: 'Set gym clothes out the night before',
        routine: `Workout at ${preferredTime}`,
        reward: 'Post-workout protein shake',
      },
      afternoon: {
        trigger: 'Lunch break or after work',
        cue: 'Pack gym bag in the morning',
        routine: `Workout at ${preferredTime}`,
        reward: 'Relaxing evening knowing workout is done',
      },
      evening: {
        trigger: 'After work/dinner',
        cue: 'Change into workout clothes immediately',
        routine: `Workout at ${preferredTime}`,
        reward: 'Good sleep from exercise',
      },
    }

    return triggers[timeOfDay]
  }

  /**
   * Gamification level calculation
   */
  calculateLevel(totalWorkouts: number, totalVolume: number, prs: number): {
    level: number
    title: string
    progress: number // percentage to next level
    nextLevelWorkouts: number
  } {
    // Simple XP system: workouts=10xp, volume/1000kg=1xp, PRs=50xp
    const xp = (totalWorkouts * 10) + (totalVolume / 1000) + (prs * 50)
    
    // Level thresholds (exponential growth)
    const levelThresholds = [
      0,      // Level 1
      100,    // Level 2
      250,    // Level 3
      450,    // Level 4
      700,    // Level 5
      1000,   // Level 6
      1400,   // Level 7
      1900,   // Level 8
      2500,   // Level 9
      3200,   // Level 10
      4000,   // Level 11
      5000,   // Level 12
      6250,   // Level 13
      7750,   // Level 14
      9500,   // Level 15
      11500,  // Level 16
      14000,  // Level 17
      17000,  // Level 18
      20500,  // Level 19
      25000,  // Level 20
    ]

    let level = 1
    let currentLevelXP = 0
    let nextLevelXP = levelThresholds[1]
    
    for (let i = 0; i < levelThresholds.length - 1; i++) {
      if (xp >= levelThresholds[i]) {
        level = i + 1
        currentLevelXP = levelThresholds[i]
        nextLevelXP = levelThresholds[i + 1] || levelThresholds[i] + 5000
      } else {
        break
      }
    }

    const xpInCurrentLevel = xp - currentLevelXP
    const xpNeededForNextLevel = nextLevelXP - currentLevelXP
    const progress = (xpInCurrentLevel / xpNeededForNextLevel) * 100

    const titles = [
      'Novice',       // 1
      'Beginner',     // 2
      'Trainee',      // 3
      'Regular',      // 4
      'Dedicated',    // 5
      'Committed',    // 6
      'Experienced',  // 7
      'Advanced',     // 8
      'Expert',       // 9
      'Master',       // 10
      'Elite',        // 11
      'Champion',     // 12
      'Hero',         // 13
      'Legend',       // 14
      'Titan',        // 15
      'Immortal',     // 16
      'Mythical',     // 17
      'Divine',       // 18
      'Transcendent', // 19
      'Godlike',      // 20
    ]

    const workoutsForNextXP = Math.ceil((nextLevelXP - xp) / 10)

    return {
      level,
      title: titles[level - 1] || 'Unknown',
      progress: Math.min(100, Math.round(progress)),
      nextLevelWorkouts: workoutsForNextXP,
    }
  }
}

