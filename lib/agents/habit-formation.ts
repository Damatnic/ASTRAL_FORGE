/**
 * Habit Formation Agent
 * 
 * Implements evidence-based habit-building mechanics:
 * - Streak tracking with visual feedback
 * - Achievement system for milestones
 * - Smart reminders based on user patterns
 * - Progress visibility
 * 
 * Research shows 89% of users noted enhanced fitness accountability
 * within 3 months with proper features.
 */

import { PrismaClient } from '@prisma/client'
import type { StreakData, Achievement, Milestone, Badge } from '../types'

export class HabitFormationAgent {
  constructor(private prisma: PrismaClient) {}

  /**
   * Update user streak based on workout completion
   */
  async updateStreak(userId: string, workoutDate: Date = new Date()): Promise<StreakData> {
    const streak = await this.prisma.streak.findUnique({
      where: { userId },
    })

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const workoutDay = new Date(workoutDate)
    workoutDay.setHours(0, 0, 0, 0)

    if (!streak) {
      // Create new streak
      const newStreak = await this.prisma.streak.create({
        data: {
          userId,
          current: 1,
          longest: 1,
          lastWorkout: workoutDate,
        },
      })

      // Award first workout achievement
      await this.awardAchievement(userId, {
        type: 'consistency',
        title: 'First Step',
        description: 'Completed your first workout',
        metadata: { workoutNumber: 1 },
      })

      return {
        current: newStreak.current,
        longest: newStreak.longest,
        lastWorkout: newStreak.lastWorkout,
      }
    }

    const lastWorkout = new Date(streak.lastWorkout || 0)
    lastWorkout.setHours(0, 0, 0, 0)

    const daysDiff = Math.floor((today.getTime() - lastWorkout.getTime()) / (24 * 60 * 60 * 1000))

    let newCurrent = streak.current
    let newLongest = streak.longest

    if (daysDiff === 0) {
      // Already worked out today, no change
      return {
        current: streak.current,
        longest: streak.longest,
        lastWorkout: streak.lastWorkout,
      }
    } else if (daysDiff === 1) {
      // Consecutive day, increment streak
      newCurrent = streak.current + 1
      newLongest = Math.max(newCurrent, streak.longest)

      // Check for streak milestones
      if ([3, 5, 7, 14, 21, 30, 60, 90, 180, 365].includes(newCurrent)) {
        await this.awardAchievement(userId, {
          type: 'streak',
          title: `${newCurrent} Day Streak`,
          description: `Completed ${newCurrent} workouts in a row`,
          metadata: { streak: newCurrent },
        })
      }
    } else {
      // Streak broken, reset
      newCurrent = 1
    }

    const updated = await this.prisma.streak.update({
      where: { userId },
      data: {
        current: newCurrent,
        longest: newLongest,
        lastWorkout: workoutDate,
      },
    })

    return {
      current: updated.current,
      longest: updated.longest,
      lastWorkout: updated.lastWorkout,
    }
  }

  /**
   * Award achievement to user
   */
  async awardAchievement(
    userId: string,
    achievement: {
      type: Achievement['type']
      title: string
      description: string
      metadata?: Record<string, any>
    }
  ): Promise<Achievement> {
    const existing = await this.prisma.achievement.findFirst({
      where: {
        userId,
        title: achievement.title,
      },
    })

    if (existing) {
      return existing as Achievement
    }

    const created = await this.prisma.achievement.create({
      data: {
        userId,
        type: achievement.type,
        title: achievement.title,
        description: achievement.description,
        metadata: achievement.metadata || {},
      },
    })

    return created as Achievement
  }

  /**
   * Check for new personal records and award achievements
   */
  async checkForPRs(
    userId: string,
    exerciseId: string,
    weight: number,
    reps: number
  ): Promise<Achievement | null> {
    const exercise = await this.prisma.exercise.findUnique({
      where: { id: exerciseId },
    })

    if (!exercise) return null

    // Find previous best
    const previousBest = await this.prisma.setEntry.findFirst({
      where: {
        exerciseId,
        session: { userId },
      },
      orderBy: { weight: 'desc' },
    })

    const isNewPR = !previousBest || weight > previousBest.weight || 
                    (weight === previousBest.weight && reps > previousBest.reps)

    if (isNewPR) {
      return this.awardAchievement(userId, {
        type: 'pr',
        title: `${exercise.name} PR`,
        description: `New personal record: ${weight}kg x ${reps} reps`,
        metadata: {
          exercise: exercise.name,
          exerciseId,
          weight,
          reps,
          previousWeight: previousBest?.weight,
          previousReps: previousBest?.reps,
        },
      })
    }

    return null
  }

  /**
   * Check for volume milestones
   */
  async checkVolumeMilestones(userId: string): Promise<Achievement | null> {
    const sessions = await this.prisma.workoutSession.findMany({
      where: {
        userId,
        completed: true,
      },
      include: {
        sets: true,
      },
    })

    const totalVolume = sessions.reduce((sum, session) => {
      return sum + session.sets.reduce((s, set) => s + (set.weight * set.reps), 0)
    }, 0)

    // Volume milestones in kg
    const milestones = [10000, 25000, 50000, 100000, 250000, 500000, 1000000]

    for (const milestone of milestones) {
      if (totalVolume >= milestone) {
        const existing = await this.prisma.achievement.findFirst({
          where: {
            userId,
            type: 'volume',
            title: `${milestone.toLocaleString()}kg Total Volume`,
          },
        })

        if (!existing) {
          return this.awardAchievement(userId, {
            type: 'volume',
            title: `${milestone.toLocaleString()}kg Total Volume`,
            description: `Lifted ${milestone.toLocaleString()}kg total across all workouts`,
            metadata: { volume: totalVolume },
          })
        }
      }
    }

    return null
  }

  /**
   * Get user's current achievements
   */
  async getAchievements(userId: string): Promise<Achievement[]> {
    const achievements = await this.prisma.achievement.findMany({
      where: { userId },
      orderBy: { earnedAt: 'desc' },
    })

    return achievements as Achievement[]
  }

  /**
   * Get recent achievements (last 7 days)
   */
  async getRecentAchievements(userId: string): Promise<Achievement[]> {
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const achievements = await this.prisma.achievement.findMany({
      where: {
        userId,
        earnedAt: {
          gte: sevenDaysAgo,
        },
      },
      orderBy: { earnedAt: 'desc' },
    })

    return achievements as Achievement[]
  }

  /**
   * Calculate next milestone for motivation
   */
  async getNextMilestone(userId: string): Promise<Milestone> {
    const sessions = await this.prisma.workoutSession.findMany({
      where: { userId, completed: true },
    })

    const workoutCount = sessions.length
    const milestones = [5, 10, 25, 50, 100, 200, 500, 1000]

    const nextMilestone = milestones.find(m => m > workoutCount) || milestones[milestones.length - 1]

    return {
      description: `Complete ${nextMilestone} total workouts`,
      progress: workoutCount,
      target: nextMilestone,
      type: 'consistency',
    }
  }

  /**
   * Calculate motivation score (0-100)
   */
  async calculateMotivationScore(userId: string): Promise<number> {
    const streak = await this.prisma.streak.findUnique({
      where: { userId },
    })

    const recentAchievements = await this.getRecentAchievements(userId)
    
    const sessions = await this.prisma.workoutSession.findMany({
      where: {
        userId,
        completed: true,
        date: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
    })

    // Score based on:
    // - Current streak (0-40 points)
    // - Recent achievements (0-30 points)
    // - Workout consistency in last 30 days (0-30 points)

    const streakScore = Math.min(40, (streak?.current || 0) * 4)
    const achievementScore = Math.min(30, recentAchievements.length * 10)
    const consistencyScore = Math.min(30, (sessions.length / 12) * 30) // 12 sessions in 30 days = max

    return Math.round(streakScore + achievementScore + consistencyScore)
  }

  /**
   * Get weekly completion status (for calendar view)
   */
  async getWeeklyCompletion(userId: string): Promise<boolean[]> {
    const today = new Date()
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay()) // Sunday
    startOfWeek.setHours(0, 0, 0, 0)

    const sessions = await this.prisma.workoutSession.findMany({
      where: {
        userId,
        completed: true,
        date: {
          gte: startOfWeek,
        },
      },
      orderBy: { date: 'asc' },
    })

    const completed: boolean[] = new Array(7).fill(false)

    for (const session of sessions) {
      const day = session.date.getDay()
      completed[day] = true
    }

    return completed
  }

  /**
   * Suggest optimal workout reminder time based on user patterns
   */
  async suggestReminderTime(userId: string): Promise<{ hour: number; minute: number }> {
    const sessions = await this.prisma.workoutSession.findMany({
      where: {
        userId,
        completed: true,
      },
      orderBy: { date: 'desc' },
      take: 20,
    })

    if (sessions.length === 0) {
      return { hour: 17, minute: 0 } // Default 5 PM
    }

    // Calculate average workout start time
    const avgHour = sessions.reduce((sum, s) => sum + s.date.getHours(), 0) / sessions.length

    // Round to nearest hour
    const hour = Math.round(avgHour)
    
    // Suggest reminder 1 hour before typical workout time
    const reminderHour = hour > 0 ? hour - 1 : 23

    return { hour: reminderHour, minute: 0 }
  }
}


