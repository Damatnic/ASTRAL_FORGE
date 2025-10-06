/**
 * Engagement & Polish API
 * Handles social sharing, notifications, analytics, and achievements showcase
 */

import { prisma } from '@/lib/prisma'

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface ShareableContent {
  id: string
  type: 'workout' | 'achievement' | 'pr' | 'level_up' | 'streak' | 'challenge_win'
  title: string
  description: string
  imageUrl?: string
  stats?: Record<string, any>
  createdAt: Date
}

export interface ShareMetadata {
  platform: 'twitter' | 'facebook' | 'instagram' | 'discord' | 'link'
  url: string
  image?: string
  title: string
  description: string
  hashtags?: string[]
}

export interface Notification {
  id: string
  userId: string
  type: 'achievement' | 'friend_request' | 'challenge' | 'quest' | 'level_up' | 'guild' | 'event' | 'pet'
  title: string
  message: string
  icon?: string
  actionUrl?: string
  read: boolean
  createdAt: Date
}

export interface UserAnalytics {
  userId: string
  totalWorkouts: number
  totalVolume: number
  totalSets: number
  totalReps: number
  averageWorkoutDuration: number
  streakDays: number
  totalXP: number
  level: number
  achievementsUnlocked: number
  friendCount: number
  questsCompleted: number
  pvpWins: number
  mostUsedExercises: Array<{ name: string; count: number }>
  weeklyActivity: Array<{ day: string; workouts: number; volume: number }>
  monthlyProgress: Array<{ month: string; workouts: number; volume: number; xp: number }>
}

export interface AchievementShowcase {
  userId: string
  featuredAchievements: string[]
  showcaseLayout: 'grid' | 'carousel' | 'timeline'
  publicProfile: boolean
}

// ============================================================================
// SOCIAL SHARING
// ============================================================================

export async function generateWorkoutShare(userId: string, sessionId: string): Promise<ShareableContent> {
  const session = await prisma.workoutSession.findUnique({
    where: { id: sessionId },
    include: { sets: { include: { exercise: true } } }
  })

  if (!session || session.userId !== userId) {
    throw new Error('Workout not found')
  }

  const totalVolume = session.sets.reduce((sum: number, set) => sum + (set.weight * set.reps), 0)
  const totalSets = session.sets.length
  const uniqueExercises = new Set(session.sets.map(s => s.exerciseId)).size

  return {
    id: session.id,
    type: 'workout',
    title: `💪 Crushed a ${session.name || 'Workout'}!`,
    description: `${uniqueExercises} exercises, ${totalSets} sets, ${Math.round(totalVolume)}kg total volume`,
    stats: { duration: session.duration, volume: totalVolume, sets: totalSets, exercises: uniqueExercises },
    createdAt: session.date
  }
}

export async function generateAchievementShare(userId: string, achievementId: string): Promise<ShareableContent> {
  const user = await prisma.userProfile.findUnique({ where: { userId } })
  if (!user) throw new Error('User not found')

  const prefs = user.preferences as any
  const achievements = prefs?.achievements || { unlocked: [] }
  const achievement = achievements.unlocked.find((a: any) => a.id === achievementId)

  if (!achievement) throw new Error('Achievement not found')

  return {
    id: achievement.id,
    type: 'achievement',
    title: `🏆 Achievement Unlocked: ${achievement.name}!`,
    description: achievement.description,
    stats: { tier: achievement.tier, category: achievement.category, unlockedAt: achievement.unlockedAt },
    createdAt: new Date(achievement.unlockedAt)
  }
}

export async function generatePRShare(userId: string, exerciseName: string, weight: number, reps: number): Promise<ShareableContent> {
  return {
    id: `pr-${Date.now()}`,
    type: 'pr',
    title: `🎯 New Personal Record!`,
    description: `${exerciseName}: ${weight}kg x ${reps} reps`,
    stats: { exercise: exerciseName, weight, reps, estimated1RM: weight * (1 + reps / 30) },
    createdAt: new Date()
  }
}

export function generateShareMetadata(content: ShareableContent, baseUrl: string): ShareMetadata {
  const url = `${baseUrl}/share/${content.id}`
  const hashtags = ['AstralPower', 'Fitness']
  
  if (content.type === 'workout') hashtags.push('Workout', 'GymLife', 'Training')
  else if (content.type === 'achievement') hashtags.push('Achievement', 'Goals', 'Progress')
  else if (content.type === 'pr') hashtags.push('PersonalRecord', 'PR', 'Strength')

  return { platform: 'link', url, title: content.title, description: content.description, hashtags }
}

// ============================================================================
// NOTIFICATIONS
// ============================================================================

export async function createNotification(
  userId: string,
  type: Notification['type'],
  title: string,
  message: string,
  options?: { icon?: string; actionUrl?: string }
): Promise<Notification> {
  const user = await prisma.userProfile.findUnique({ where: { userId } })
  if (!user) throw new Error('User not found')

  const prefs = user.preferences as any
  const notifications = prefs?.notifications || { items: [], settings: {} }
  
  const notification: Notification = {
    id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId,
    type,
    title,
    message,
    icon: options?.icon,
    actionUrl: options?.actionUrl,
    read: false,
    createdAt: new Date()
  }

  notifications.items.unshift(notification)
  if (notifications.items.length > 100) notifications.items = notifications.items.slice(0, 100)

  await prisma.userProfile.update({
    where: { userId },
    data: { preferences: { ...(prefs || {}), notifications } as any }
  })

  return notification
}

export async function getUserNotifications(userId: string, unreadOnly: boolean = false): Promise<Notification[]> {
  const user = await prisma.userProfile.findUnique({ where: { userId } })
  if (!user) return []

  const prefs = user.preferences as any
  const notifications = prefs?.notifications?.items || []
  
  return unreadOnly ? notifications.filter((n: Notification) => !n.read) : notifications
}

export async function markNotificationRead(userId: string, notificationId: string): Promise<void> {
  const user = await prisma.userProfile.findUnique({ where: { userId } })
  if (!user) throw new Error('User not found')

  const prefs = user.preferences as any
  const notifications = prefs?.notifications || { items: [] }
  const notification = notifications.items.find((n: Notification) => n.id === notificationId)

  if (notification) {
    notification.read = true
    await prisma.userProfile.update({
      where: { userId },
      data: { preferences: { ...(prefs || {}), notifications } as any }
    })
  }
}

export async function markAllNotificationsRead(userId: string): Promise<void> {
  const user = await prisma.userProfile.findUnique({ where: { userId } })
  if (!user) throw new Error('User not found')

  const prefs = user.preferences as any
  const notifications = prefs?.notifications || { items: [] }
  notifications.items.forEach((n: Notification) => n.read = true)

  await prisma.userProfile.update({
    where: { userId },
    data: { preferences: { ...(prefs || {}), notifications } as any }
  })
}

// ============================================================================
// ANALYTICS
// ============================================================================

export async function getUserAnalytics(userId: string): Promise<UserAnalytics> {
  const user = await prisma.userProfile.findUnique({ where: { userId } })
  const sessions = await prisma.workoutSession.findMany({
    where: { userId, completed: true },
    include: { sets: { include: { exercise: true } } },
    orderBy: { date: 'desc' }
  })

  const prefs = user?.preferences as any
  const character = prefs?.character || {}
  const achievements = prefs?.achievements || { unlocked: [] }
  const social = prefs?.social || { friends: [] }
  const quests = prefs?.quests || { completed: [] }
  const pvp = prefs?.pvp || { wins: 0 }

  const totalWorkouts = sessions.length
  const totalVolume = sessions.reduce((sum: number, s) => 
    sum + s.sets.reduce((sSum: number, set) => sSum + (set.weight * set.reps), 0), 0
  )
  const totalSets = sessions.reduce((sum: number, s) => sum + s.sets.length, 0)
  const totalReps = sessions.reduce((sum: number, s) => 
    sum + s.sets.reduce((sSum: number, set) => sSum + set.reps, 0), 0
  )
  const averageWorkoutDuration = sessions.length > 0
    ? sessions.reduce((sum: number, s) => sum + (s.duration || 0), 0) / sessions.length
    : 0

  // Calculate streak
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  let streakDays = 0
  let checkDate = new Date(today)
  
  while (true) {
    const dayStart = new Date(checkDate)
    const dayEnd = new Date(checkDate)
    dayEnd.setHours(23, 59, 59, 999)
    
    const hasWorkout = sessions.some(s => s.date >= dayStart && s.date <= dayEnd)
    if (!hasWorkout) break
    
    streakDays++
    checkDate.setDate(checkDate.getDate() - 1)
  }

  // Most used exercises
  const exerciseCounts: Record<string, number> = {}
  sessions.forEach(s => {
    s.sets.forEach(set => {
      const name = set.exercise.name
      exerciseCounts[name] = (exerciseCounts[name] || 0) + 1
    })
  })
  const mostUsedExercises = Object.entries(exerciseCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  // Weekly activity
  const weeklyActivity = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dayEnd = new Date(date)
    dayEnd.setHours(23, 59, 59, 999)
    
    const daySessions = sessions.filter(s => s.date >= date && s.date <= dayEnd)
    const dayVolume = daySessions.reduce((sum: number, s) => 
      sum + s.sets.reduce((sSum: number, set) => sSum + (set.weight * set.reps), 0), 0
    )
    
    weeklyActivity.push({
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      workouts: daySessions.length,
      volume: dayVolume
    })
  }

  // Monthly progress
  const monthlyProgress = []
  for (let i = 5; i >= 0; i--) {
    const date = new Date(today)
    date.setMonth(date.getMonth() - i)
    date.setDate(1)
    date.setHours(0, 0, 0, 0)
    
    const monthEnd = new Date(date)
    monthEnd.setMonth(monthEnd.getMonth() + 1)
    monthEnd.setDate(0)
    monthEnd.setHours(23, 59, 59, 999)
    
    const monthSessions = sessions.filter(s => s.date >= date && s.date <= monthEnd)
    const monthVolume = monthSessions.reduce((sum: number, s) => 
      sum + s.sets.reduce((sSum: number, set) => sSum + (set.weight * set.reps), 0), 0
    )
    
    monthlyProgress.push({
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      workouts: monthSessions.length,
      volume: monthVolume,
      xp: monthSessions.length * 100
    })
  }

  return {
    userId,
    totalWorkouts,
    totalVolume,
    totalSets,
    totalReps,
    averageWorkoutDuration,
    streakDays,
    totalXP: character.totalXP || 0,
    level: character.level || 1,
    achievementsUnlocked: achievements.unlocked.length,
    friendCount: social.friends.length,
    questsCompleted: quests.completed.length,
    pvpWins: pvp.wins || 0,
    mostUsedExercises,
    weeklyActivity,
    monthlyProgress
  }
}

// ============================================================================
// ACHIEVEMENT SHOWCASE
// ============================================================================

export async function getAchievementShowcase(userId: string): Promise<AchievementShowcase> {
  const user = await prisma.userProfile.findUnique({ where: { userId } })
  if (!user) {
    return { userId, featuredAchievements: [], showcaseLayout: 'grid', publicProfile: false }
  }

  const prefs = user.preferences as any
  const showcase = prefs?.achievementShowcase || {
    featuredAchievements: [],
    showcaseLayout: 'grid',
    publicProfile: false
  }

  return { userId, ...showcase }
}

export async function updateAchievementShowcase(
  userId: string,
  updates: Partial<Omit<AchievementShowcase, 'userId'>>
): Promise<void> {
  const user = await prisma.userProfile.findUnique({ where: { userId } })
  if (!user) throw new Error('User not found')

  const prefs = user.preferences as any
  const showcase = prefs?.achievementShowcase || {
    featuredAchievements: [],
    showcaseLayout: 'grid',
    publicProfile: false
  }

  await prisma.userProfile.update({
    where: { userId },
    data: {
      preferences: {
        ...(prefs || {}),
        achievementShowcase: { ...showcase, ...updates }
      } as any
    }
  })
}
