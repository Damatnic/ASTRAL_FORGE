/**
 * Social Features System
 * Friends, guilds, leaderboards, and challenges
 */

import { prisma } from '@/lib/prisma'

// ============================================================================
// TYPES & CONSTANTS
// ============================================================================

export interface FriendRequest {
  id: string
  fromUserId: string
  fromUserName: string
  fromUserLevel: number
  toUserId: string
  status: 'pending' | 'accepted' | 'rejected'
  createdAt: Date
}

export interface Friend {
  userId: string
  userName: string
  email: string
  level: number
  characterClass: string
  totalWorkouts: number
  currentStreak: number
  lastActive: Date
  isFavorite: boolean
}

export interface Guild {
  id: string
  name: string
  description: string
  icon: string
  level: number
  memberCount: number
  totalProgress: number
  createdAt: Date
  isPublic: boolean
  requirements: {
    minLevel?: number
    minWorkouts?: number
  }
}

export interface GuildMember {
  userId: string
  userName: string
  level: number
  role: 'leader' | 'officer' | 'member'
  contributedProgress: number
  joinedAt: Date
}

export interface LeaderboardEntry {
  rank: number
  userId: string
  userName: string
  characterClass: string
  level: number
  value: number
  change?: number // Position change from last period
}

export interface Challenge {
  id: string
  title: string
  description: string
  type: 'workout_count' | 'total_volume' | 'streak' | 'pr_count' | 'custom'
  goal: number
  unit: string
  startDate: Date
  endDate: Date
  participants: number
  reward: {
    progressPoints: number
    badge?: string
  }
  isActive: boolean
}

export interface ChallengeParticipant {
  userId: string
  userName: string
  progress: number
  rank: number
  joinedAt: Date
}

// Guild Icons
export const GUILD_ICONS = ['⚔️', '🛡️', '🏆', '💪', '🔥', '⚡', '🌟', '👑', '🦁', '🐉']

// Challenge Types
export const CHALLENGE_TYPES = {
  workout_count: { name: 'Workout Count', icon: '🏋️', unit: 'workouts' },
  total_volume: { name: 'Total Volume', icon: '📊', unit: 'lbs' },
  streak: { name: 'Streak', icon: '🔥', unit: 'days' },
  pr_count: { name: 'Personal Records', icon: '📈', unit: 'PRs' },
  custom: { name: 'Custom Challenge', icon: '🎯', unit: 'points' },
}

// ============================================================================
// FRIENDS SYSTEM
// ============================================================================

/**
 * Get user's social data (friends, requests, etc.)
 */
async function getSocialData(userEmail: string): Promise<any> {
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    include: { profile: true },
  })
  
  if (!user || !user.profile) return null
  
  const socialData = (user.profile.preferences as any)?.social || {}
  return {
    friends: socialData.friends || [],
    friendRequests: socialData.friendRequests || [],
    guildId: socialData.guildId || null,
    blockedUsers: socialData.blockedUsers || [],
  }
}

/**
 * Update user's social data
 */
async function updateSocialData(userEmail: string, updates: any): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    include: { profile: true },
  })
  
  if (!user || !user.profile) throw new Error('User not found')
  
  const currentPrefs = user.profile.preferences as any || {}
  const currentSocial = currentPrefs.social || {}
  
  await prisma.userProfile.update({
    where: { userId: user.id },
    data: {
      preferences: {
        ...currentPrefs,
        social: {
          ...currentSocial,
          ...updates,
        },
      } as any,
    },
  })
}

/**
 * Send friend request
 */
export async function sendFriendRequest(fromEmail: string, toEmail: string): Promise<boolean> {
  const fromUser = await prisma.user.findUnique({
    where: { email: fromEmail },
    include: { profile: true },
  })
  
  const toUser = await prisma.user.findUnique({
    where: { email: toEmail },
    include: { profile: true },
  })
  
  if (!fromUser || !toUser || !toUser.profile) return false
  
  // Don't send to self
  if (fromUser.id === toUser.id) return false
  
  // Get training tier for from user
  const fromCharData = (fromUser.profile?.preferences as any)?.character || {}
  const fromLevel = fromCharData.totalXP ? 
    require('./character').calculateLevelFromXP(fromCharData.totalXP).level : 1
  
  const toSocialData = await getSocialData(toEmail)
  
  // Check if already friends
  if (toSocialData.friends?.includes(fromUser.id)) return false
  
  // Check if request already exists
  const existingRequest = toSocialData.friendRequests?.find(
    (req: any) => req.fromUserId === fromUser.id
  )
  if (existingRequest) return false
  
  // Add friend request
  const newRequest: FriendRequest = {
    id: `${fromUser.id}-${Date.now()}`,
    fromUserId: fromUser.id,
    fromUserName: fromUser.name || fromUser.email,
    fromUserLevel: fromLevel,
    toUserId: toUser.id,
    status: 'pending',
    createdAt: new Date(),
  }
  
  const updatedRequests = [...(toSocialData.friendRequests || []), newRequest]
  await updateSocialData(toEmail, { friendRequests: updatedRequests })
  
  return true
}

/**
 * Accept friend request
 */
export async function acceptFriendRequest(userEmail: string, requestId: string): Promise<boolean> {
  const socialData = await getSocialData(userEmail)
  const request = socialData.friendRequests?.find((req: any) => req.id === requestId)
  
  if (!request || request.status !== 'pending') return false
  
  // Add to both users' friend lists
  const currentFriends = socialData.friends || []
  await updateSocialData(userEmail, {
    friends: [...currentFriends, request.fromUserId],
    friendRequests: socialData.friendRequests.filter((req: any) => req.id !== requestId),
  })
  
  // Add to sender's friend list
  const senderUser = await prisma.user.findUnique({ where: { id: request.fromUserId } })
  if (senderUser) {
    const senderSocial = await getSocialData(senderUser.email)
    await updateSocialData(senderUser.email, {
      friends: [...(senderSocial.friends || []), socialData.friends],
    })
  }
  
  return true
}

/**
 * Get friends list with details
 */
export async function getFriends(userEmail: string): Promise<Friend[]> {
  const socialData = await getSocialData(userEmail)
  const friendIds = socialData.friends || []
  
  if (friendIds.length === 0) return []
  
  const friends = await prisma.user.findMany({
    where: { id: { in: friendIds } },
    include: {
      profile: true,
      sessions: { orderBy: { date: 'desc' }, take: 1 },
      streaks: true,
    },
  })
  
  return friends.map(friend => {
    const charData = (friend.profile?.preferences as any)?.character || {}
    const level = charData.totalXP ? 
      require('./character').calculateLevelFromXP(charData.totalXP).level : 1
    
    return {
      userId: friend.id,
      userName: friend.name || friend.email.split('@')[0],
      email: friend.email,
      level,
      characterClass: charData.class || 'athlete',
      totalWorkouts: friend.sessions?.length || 0,
      currentStreak: friend.streaks?.current || 0,
      lastActive: friend.sessions[0]?.date || friend.createdAt,
      isFavorite: false, // Could add favorite system later
    }
  })
}

/**
 * Remove friend
 */
export async function removeFriend(userEmail: string, friendUserId: string): Promise<boolean> {
  const socialData = await getSocialData(userEmail)
  const updatedFriends = (socialData.friends || []).filter((id: string) => id !== friendUserId)
  await updateSocialData(userEmail, { friends: updatedFriends })
  
  // Remove from friend's list too
  const friendUser = await prisma.user.findUnique({ where: { id: friendUserId } })
  if (friendUser) {
    const friendSocial = await getSocialData(friendUser.email)
    const user = await prisma.user.findUnique({ where: { email: userEmail } })
    if (user) {
      const updatedFriendList = (friendSocial.friends || []).filter((id: string) => id !== user.id)
      await updateSocialData(friendUser.email, { friends: updatedFriendList })
    }
  }
  
  return true
}

// ============================================================================
// LEADERBOARDS
// ============================================================================

/**
 * Get global leaderboard by type
 */
export async function getLeaderboard(
  type: 'level' | 'total_xp' | 'workouts' | 'streak' | 'volume',
  limit = 100
): Promise<LeaderboardEntry[]> {
  const users = await prisma.user.findMany({
    include: {
      profile: true,
      sessions: true,
      streaks: true,
    },
    take: limit * 2, // Get more than needed for filtering
  })
  
  const entries = users.map(user => {
    const charData = (user.profile?.preferences as any)?.character || {}
    const totalXP = charData.totalXP || 0
    const level = totalXP ? 
      require('./character').calculateLevelFromXP(totalXP).level : 1
    
    let value = 0
    switch (type) {
      case 'level':
        value = level
        break
      case 'total_xp':
        value = totalXP
        break
      case 'workouts':
        value = user.sessions.length
        break
      case 'streak':
        value = user.streaks?.current || 0
        break
      case 'volume':
        // Would need to calculate from sets - simplified for now
        value = user.sessions.length * 1000 // Placeholder
        break
    }
    
    return {
      rank: 0,
      userId: user.id,
      userName: user.name || user.email.split('@')[0],
      characterClass: charData.class || 'athlete',
      level,
      value,
    }
  })
  
  // Sort by value descending
  entries.sort((a, b) => b.value - a.value)
  
  // Assign ranks
  entries.forEach((entry, index) => {
    entry.rank = index + 1
  })
  
  return entries.slice(0, limit)
}

/**
 * Get user's rank in leaderboard
 */
export async function getUserRank(
  userEmail: string,
  type: 'level' | 'total_xp' | 'workouts' | 'streak' | 'volume'
): Promise<{ rank: number; total: number; percentile: number }> {
  const leaderboard = await getLeaderboard(type, 1000)
  const user = await prisma.user.findUnique({ where: { email: userEmail } })
  
  if (!user) return { rank: 0, total: 0, percentile: 0 }
  
  const entry = leaderboard.find(e => e.userId === user.id)
  const rank = entry?.rank || leaderboard.length + 1
  const total = leaderboard.length
  const percentile = total > 0 ? ((total - rank) / total) * 100 : 0
  
  return { rank, total, percentile }
}

// ============================================================================
// GUILDS
// ============================================================================

/**
 * Create a guild
 */
export async function createGuild(
  creatorEmail: string,
  data: {
    name: string
    description: string
    icon: string
    isPublic: boolean
    minLevel?: number
    minWorkouts?: number
  }
): Promise<Guild> {
  const creator = await prisma.user.findUnique({
    where: { email: creatorEmail },
    include: { profile: true },
  })
  
  if (!creator) throw new Error('User not found')
  
  // Create guild (stored in preferences for now)
  const guildId = `guild_${Date.now()}`
  const guild: Guild = {
    id: guildId,
    name: data.name,
    description: data.description,
    icon: data.icon,
    level: 1,
    memberCount: 1,
    totalProgress: 0,
    createdAt: new Date(),
    isPublic: data.isPublic,
    requirements: {
      minLevel: data.minLevel,
      minWorkouts: data.minWorkouts,
    },
  }
  
  // Store guild data in creator's profile
  const currentPrefs = creator.profile?.preferences as any || {}
  await prisma.userProfile.update({
    where: { userId: creator.id },
    data: {
      preferences: {
        ...currentPrefs,
        guilds: {
          ...(currentPrefs.guilds || {}),
          [guildId]: {
            ...guild,
            members: [{
              userId: creator.id,
              userName: creator.name || creator.email,
              role: 'leader',
              contributedXP: 0,
              joinedAt: new Date(),
            }],
          },
        },
      } as any,
    },
  })
  
  // Update user's social data
  await updateSocialData(creatorEmail, { guildId })
  
  return guild
}

/**
 * Get all public guilds
 */
export async function getPublicGuilds(): Promise<Guild[]> {
  // For now, scan all users' profiles for public guilds
  // In production, would want a dedicated guilds table
  const users = await prisma.user.findMany({
    include: { profile: true },
    take: 100,
  })
  
  const guilds: Guild[] = []
  for (const user of users) {
    const prefs = user.profile?.preferences as any
    const userGuilds = prefs?.guilds || {}
    
    Object.values(userGuilds).forEach((guild: any) => {
      if (guild.isPublic && !guilds.find(g => g.id === guild.id)) {
        guilds.push(guild)
      }
    })
  }
  
  return guilds.sort((a, b) => b.totalProgress - a.totalProgress)
}

/**
 * Get user's guild
 */
export async function getUserGuild(userEmail: string): Promise<Guild | null> {
  const socialData = await getSocialData(userEmail)
  if (!socialData.guildId) return null
  
  // Find guild across all users
  const users = await prisma.user.findMany({
    include: { profile: true },
    take: 100,
  })
  
  for (const user of users) {
    const prefs = user.profile?.preferences as any
    const userGuilds = prefs?.guilds || {}
    if (userGuilds[socialData.guildId]) {
      return userGuilds[socialData.guildId]
    }
  }
  
  return null
}

// ============================================================================
// CHALLENGES
// ============================================================================

/**
 * Get active challenges
 */
export async function getActiveChallenges(): Promise<Challenge[]> {
  // Hardcoded challenges for demo - in production would be in database
  const now = new Date()
  
  return [
    {
      id: 'weekly_warrior',
      title: 'Weekly Warrior',
      description: 'Complete 5 workouts this week',
      type: 'workout_count',
      goal: 5,
      unit: 'workouts',
      startDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay()),
      endDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 7),
      participants: 156,
      reward: { progressPoints: 500, badge: '🏆' },
      isActive: true,
    },
    {
      id: 'streak_master',
      title: 'Streak Master',
      description: 'Maintain a 30-day workout streak',
      type: 'streak',
      goal: 30,
      unit: 'days',
      startDate: new Date(now.getFullYear(), now.getMonth(), 1),
      endDate: new Date(now.getFullYear(), now.getMonth() + 1, 0),
      participants: 89,
      reward: { progressPoints: 1000, badge: '🔥' },
      isActive: true,
    },
    {
      id: 'pr_hunter',
      title: 'PR Hunter',
      description: 'Set 10 personal records this month',
      type: 'pr_count',
      goal: 10,
      unit: 'PRs',
      startDate: new Date(now.getFullYear(), now.getMonth(), 1),
      endDate: new Date(now.getFullYear(), now.getMonth() + 1, 0),
      participants: 234,
      reward: { progressPoints: 750, badge: '📈' },
      isActive: true,
    },
  ]
}

/**
 * Get user's challenge progress
 */
export async function getChallengeProgress(
  userEmail: string,
  challengeId: string
): Promise<{ progress: number; goal: number; completed: boolean }> {
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    include: {
      sessions: true,
      streaks: true,
    },
  })
  
  if (!user) return { progress: 0, goal: 0, completed: false }
  
  const challenges = await getActiveChallenges()
  const challenge = challenges.find(c => c.id === challengeId)
  
  if (!challenge) return { progress: 0, goal: 0, completed: false }
  
  let progress = 0
  
  // Calculate progress based on challenge type
  switch (challenge.type) {
    case 'workout_count':
      const weekStart = challenge.startDate
      const weekEnd = challenge.endDate
      progress = user.sessions.filter(s => 
        s.date >= weekStart && s.date <= weekEnd
      ).length
      break
      
    case 'streak':
      progress = user.streaks?.current || 0
      break
      
    case 'pr_count':
      // Would need to count PRs - simplified for now
      progress = 0
      break
  }
  
  return {
    progress,
    goal: challenge.goal,
    completed: progress >= challenge.goal,
  }
}

/**
 * Search users by name or email
 */
export async function searchUsers(query: string, limit = 20): Promise<Friend[]> {
  const users = await prisma.user.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } },
      ],
    },
    include: {
      profile: true,
      sessions: true,
      streaks: true,
    },
    take: limit,
  })
  
  return users.map(user => {
    const charData = (user.profile?.preferences as any)?.character || {}
    const level = charData.totalXP ? 
      require('./character').calculateLevelFromXP(charData.totalXP).level : 1
    
    return {
      userId: user.id,
      userName: user.name || user.email.split('@')[0],
      email: user.email,
      level,
      characterClass: charData.class || 'athlete',
      totalWorkouts: user.sessions.length,
      currentStreak: user.streaks?.current || 0,
      lastActive: user.sessions[0]?.date || user.createdAt,
      isFavorite: false,
    }
  })
}
