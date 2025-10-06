/**
 * User Profile & Progression System
 * Training progression, tiers, and milestone tracking
 */

import { prisma } from '@/lib/prisma'

// ============================================================================
// CONSTANTS & CONFIGURATION
// ============================================================================

// Character Classes
export const CHARACTER_CLASSES = [
  'warrior', // Strength focused
  'athlete', // Balanced
  'endurance', // Cardio/endurance
  'powerlifter', // Max strength
  'bodybuilder', // Hypertrophy
  'crossfitter', // Functional fitness
] as const

export type CharacterClass = typeof CHARACTER_CLASSES[number]

export const CLASS_INFO = {
  warrior: {
    name: 'Warrior',
    icon: '⚔️',
    description: 'Balanced strength and conditioning',
    primaryStat: 'strength',
    bonuses: { strength: 1.1, endurance: 1.0, power: 1.05 },
  },
  athlete: {
    name: 'Athlete',
    icon: '🏃',
    description: 'Versatile and well-rounded',
    primaryStat: 'balanced',
    bonuses: { strength: 1.0, endurance: 1.0, power: 1.0 },
  },
  endurance: {
    name: 'Endurance Master',
    icon: '🏃‍♂️',
    description: 'Cardio and stamina focused',
    primaryStat: 'endurance',
    bonuses: { strength: 0.95, endurance: 1.15, power: 1.0 },
  },
  powerlifter: {
    name: 'Powerlifter',
    icon: '🏋️',
    description: 'Maximum strength pursuer',
    primaryStat: 'strength',
    bonuses: { strength: 1.15, endurance: 0.9, power: 1.1 },
  },
  bodybuilder: {
    name: 'Bodybuilder',
    icon: '💪',
    description: 'Muscle growth specialist',
    primaryStat: 'hypertrophy',
    bonuses: { strength: 1.05, endurance: 0.95, power: 1.0 },
  },
  crossfitter: {
    name: 'CrossFitter',
    icon: '🤸',
    description: 'Functional fitness expert',
    primaryStat: 'functional',
    bonuses: { strength: 1.05, endurance: 1.1, power: 1.05 },
  },
}

// XP and Leveling
export const XP_PER_LEVEL = 1000 // Base XP needed for level 1->2
export const XP_SCALING = 1.15 // Each level requires 15% more XP
export const MAX_LEVEL = 100

// XP Sources
export const XP_REWARDS = {
  WORKOUT_COMPLETE: 100,
  SET_COMPLETE: 10,
  PR_ACHIEVED: 500,
  STREAK_DAY: 50,
  GOAL_COMPLETE: 1000,
  ACHIEVEMENT_EARNED: 250,
  FIRST_WORKOUT_DAY: 200,
}

// Skill Trees
export const SKILL_TREES = {
  strength: {
    name: 'Strength',
    icon: '💪',
    skills: [
      { id: 'str_1', name: 'Iron Will', description: '+5% to all lifts', maxLevel: 5, cost: 1 },
      { id: 'str_2', name: 'Power Surge', description: '+10% 1RM gains', maxLevel: 3, cost: 2 },
      { id: 'str_3', name: 'Titan Grip', description: '+15% compound lift strength', maxLevel: 5, cost: 3 },
    ],
  },
  endurance: {
    name: 'Endurance',
    icon: '🏃',
    skills: [
      { id: 'end_1', name: 'Cardio King', description: '+10% cardio efficiency', maxLevel: 5, cost: 1 },
      { id: 'end_2', name: 'Marathon Runner', description: '+20% stamina', maxLevel: 3, cost: 2 },
      { id: 'end_3', name: 'Iron Lungs', description: 'Reduced rest time needed', maxLevel: 5, cost: 3 },
    ],
  },
  technique: {
    name: 'Technique',
    icon: '🎯',
    skills: [
      { id: 'tech_1', name: 'Perfect Form', description: '-10% injury risk', maxLevel: 5, cost: 1 },
      { id: 'tech_2', name: 'Mind-Muscle Link', description: '+15% muscle activation', maxLevel: 3, cost: 2 },
      { id: 'tech_3', name: 'Master Craftsman', description: '+25% exercise efficiency', maxLevel: 5, cost: 3 },
    ],
  },
  recovery: {
    name: 'Recovery',
    icon: '😴',
    skills: [
      { id: 'rec_1', name: 'Fast Healer', description: '+20% recovery speed', maxLevel: 5, cost: 1 },
      { id: 'rec_2', name: 'Iron Body', description: '-15% fatigue accumulation', maxLevel: 3, cost: 2 },
      { id: 'rec_3', name: 'Phoenix Rise', description: '+30% post-workout recovery', maxLevel: 5, cost: 3 },
    ],
  },
}

// Achievement Definitions
export const ACHIEVEMENT_DEFINITIONS = [
  // Workout Milestones
  { id: 'first_workout', title: 'First Steps', description: 'Complete your first workout', icon: '👟', xp: 100 },
  { id: 'workout_10', title: 'Dedicated', description: 'Complete 10 workouts', icon: '🔟', xp: 200 },
  { id: 'workout_50', title: 'Committed', description: 'Complete 50 workouts', icon: '💯', xp: 500 },
  { id: 'workout_100', title: 'Centurion', description: 'Complete 100 workouts', icon: '💯', xp: 1000 },
  
  // Streak Achievements
  { id: 'streak_7', title: 'Week Warrior', description: '7 day workout streak', icon: '🔥', xp: 300 },
  { id: 'streak_30', title: 'Monthly Master', description: '30 day workout streak', icon: '🔥🔥', xp: 1000 },
  { id: 'streak_100', title: 'Unstoppable', description: '100 day workout streak', icon: '🔥🔥🔥', xp: 5000 },
  
  // Strength PRs
  { id: 'pr_first', title: 'Breaking Barriers', description: 'Set your first PR', icon: '📈', xp: 200 },
  { id: 'pr_10', title: 'PR Machine', description: 'Set 10 PRs', icon: '📊', xp: 500 },
  { id: 'pr_50', title: 'Record Breaker', description: 'Set 50 PRs', icon: '🏆', xp: 2000 },
  
  // Volume
  { id: 'volume_1000', title: 'Volume King', description: 'Lift 1,000 total reps', icon: '🏋️', xp: 300 },
  { id: 'volume_10000', title: 'Volume God', description: 'Lift 10,000 total reps', icon: '🏋️‍♂️', xp: 1500 },
  
  // Special
  { id: 'early_bird', title: 'Early Bird', description: 'Complete a workout before 6 AM', icon: '🌅', xp: 200 },
  { id: 'night_owl', title: 'Night Owl', description: 'Complete a workout after 10 PM', icon: '🌙', xp: 200 },
  { id: 'perfectionist', title: 'Perfectionist', description: 'Complete a workout with all 10/10 ratings', icon: '⭐', xp: 500 },
]

// ============================================================================
// TYPES
// ============================================================================

export interface CharacterStats {
  level: number
  currentXP: number
  xpToNextLevel: number
  totalXP: number
  characterClass: CharacterClass
  stats: {
    strength: number
    endurance: number
    power: number
    technique: number
  }
  skills: Record<string, number> // skillId -> level
}

export interface SkillTreeData {
  tree: typeof SKILL_TREES[keyof typeof SKILL_TREES]
  unlockedSkills: Record<string, number>
}

export interface AchievementProgress {
  achievementId: string
  title: string
  description: string
  icon: string
  isUnlocked: boolean
  unlockedAt?: Date
  progress?: number // For progressive achievements
  total?: number
}

// ============================================================================
// CHARACTER MANAGEMENT
// ============================================================================

/**
 * Calculate XP needed for a specific level
 */
export function calculateXPForLevel(level: number): number {
  if (level <= 1) return 0
  let totalXP = 0
  for (let i = 1; i < level; i++) {
    totalXP += Math.floor(XP_PER_LEVEL * Math.pow(XP_SCALING, i - 1))
  }
  return totalXP
}

/**
 * Calculate level from total XP
 */
export function calculateLevelFromXP(totalXP: number): { level: number; currentXP: number; xpToNextLevel: number } {
  let level = 1
  let xpForCurrentLevel = 0
  
  while (level < MAX_LEVEL) {
    const xpForNextLevel = calculateXPForLevel(level + 1)
    if (totalXP < xpForNextLevel) break
    level++
    xpForCurrentLevel = xpForNextLevel
  }
  
  const xpToNextLevel = calculateXPForLevel(level + 1) - xpForCurrentLevel
  const currentXP = totalXP - xpForCurrentLevel
  
  return { level, currentXP, xpToNextLevel }
}

/**
 * Get or create character stats for user
 * Character data is stored in UserProfile.preferences JSON field
 */
export async function getCharacterStats(userEmail: string): Promise<CharacterStats | null> {
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    include: { profile: true },
  })
  
  if (!user) return null
  
  // Get character data from profile preferences
  const profile = user.profile
  const characterData = profile?.preferences as any
  
  const totalXP = characterData?.character?.totalXP || 0
  const { level, currentXP, xpToNextLevel } = calculateLevelFromXP(totalXP)
  
  return {
    level,
    currentXP,
    xpToNextLevel,
    totalXP,
    characterClass: characterData?.character?.class || 'athlete',
    stats: characterData?.character?.stats || {
      strength: 1,
      endurance: 1,
      power: 1,
      technique: 1,
    },
    skills: characterData?.character?.skills || {},
  }
}

/**
 * Award XP to user and handle level ups
 */
export async function awardXP(
  userEmail: string,
  amount: number,
  source: string
): Promise<{ newLevel: number; leveledUp: boolean; totalXP: number }> {
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    include: { profile: true },
  })
  
  if (!user || !user.profile) {
    throw new Error('User or profile not found')
  }
  
  const currentData = user.profile.preferences as any || {}
  const characterData = currentData.character || {}
  
  const oldTotalXP = characterData.totalXP || 0
  const newTotalXP = oldTotalXP + amount
  
  const oldLevelData = calculateLevelFromXP(oldTotalXP)
  const newLevelData = calculateLevelFromXP(newTotalXP)
  
  // Update character data
  const updatedPreferences = {
    ...currentData,
    character: {
      ...characterData,
      totalXP: newTotalXP,
      class: characterData.class || 'athlete',
      stats: characterData.stats || { strength: 1, endurance: 1, power: 1, technique: 1 },
      skills: characterData.skills || {},
    },
  }
  
  await prisma.userProfile.update({
    where: { userId: user.id },
    data: { preferences: updatedPreferences as any },
  })
  
  return {
    newLevel: newLevelData.level,
    leveledUp: newLevelData.level > oldLevelData.level,
    totalXP: newTotalXP,
  }
}

/**
 * Set character class
 */
export async function setCharacterClass(userEmail: string, characterClass: CharacterClass): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    include: { profile: true },
  })
  
  if (!user || !user.profile) {
    throw new Error('User or profile not found')
  }
  
  const currentData = user.profile.preferences as any || {}
  const characterData = currentData.character || {}
  
  const updatedPreferences = {
    ...currentData,
    character: {
      ...characterData,
      class: characterClass,
      totalXP: characterData.totalXP || 0,
      stats: characterData.stats || { strength: 1, endurance: 1, power: 1, technique: 1 },
      skills: characterData.skills || {},
    },
  }
  
  await prisma.userProfile.update({
    where: { userId: user.id },
    data: { preferences: updatedPreferences as any },
  })
}

// ============================================================================
// SKILL TREE
// ============================================================================

/**
 * Get skill tree data for user
 */
export async function getSkillTreeData(userEmail: string, treeName: keyof typeof SKILL_TREES): Promise<SkillTreeData | null> {
  const stats = await getCharacterStats(userEmail)
  if (!stats) return null
  
  return {
    tree: SKILL_TREES[treeName],
    unlockedSkills: stats.skills,
  }
}

/**
 * Unlock or upgrade a skill
 */
export async function unlockSkill(userEmail: string, skillId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    include: { profile: true },
  })
  
  if (!user || !user.profile) return false
  
  const currentData = user.profile.preferences as any || {}
  const characterData = currentData.character || {}
  const skills = characterData.skills || {}
  
  // Find skill definition
  let skillDef: any = null
  for (const tree of Object.values(SKILL_TREES)) {
    skillDef = tree.skills.find(s => s.id === skillId)
    if (skillDef) break
  }
  
  if (!skillDef) return false
  
  const currentSkillLevel = skills[skillId] || 0
  
  // Check if can upgrade (milestone unlocks are now automatic based on achievements)
  if (currentSkillLevel >= skillDef.maxLevel) return false
  
  // Upgrade skill
  const updatedSkills = {
    ...skills,
    [skillId]: currentSkillLevel + 1,
  }
  
  const updatedPreferences = {
    ...currentData,
    character: {
      ...characterData,
      skills: updatedSkills,
    },
  }
  
  await prisma.userProfile.update({
    where: { userId: user.id },
    data: { preferences: updatedPreferences as any },
  })
  
  return true
}

// ============================================================================
// ACHIEVEMENTS
// ============================================================================

/**
 * Get all achievements with unlock status
 */
export async function getAchievements(userEmail: string): Promise<AchievementProgress[]> {
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    include: {
      achievements: true,
      sessions: true,
      streaks: true,
    },
  })
  
  if (!user) return []
  
  const unlockedAchievements = user.achievements.map(a => a.type)
  
  // Calculate progress for each achievement
  const workoutCount = user.sessions.length
  const currentStreak = user.streaks?.current || 0
  
  return ACHIEVEMENT_DEFINITIONS.map(def => {
    const isUnlocked = unlockedAchievements.includes(def.id)
    const unlockedAchievement = user.achievements.find(a => a.type === def.id)
    
    let progress = 0
    let total = 1
    
    // Calculate progress based on achievement type
    if (def.id.startsWith('workout_')) {
      const target = parseInt(def.id.split('_')[1])
      progress = Math.min(workoutCount, target)
      total = target
    } else if (def.id.startsWith('streak_')) {
      const target = parseInt(def.id.split('_')[1])
      progress = Math.min(currentStreak, target)
      total = target
    }
    
    return {
      achievementId: def.id,
      title: def.title,
      description: def.description,
      icon: def.icon,
      isUnlocked,
      unlockedAt: unlockedAchievement?.earnedAt,
      progress: !isUnlocked ? progress : undefined,
      total: !isUnlocked ? total : undefined,
    }
  })
}

/**
 * Check and award achievements based on user activity
 */
export async function checkAndAwardAchievements(userEmail: string): Promise<string[]> {
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    include: {
      achievements: true,
      sessions: true,
      streaks: true,
    },
  })
  
  if (!user) return []
  
  const unlockedIds = user.achievements.map(a => a.type)
  const newAchievements: string[] = []
  
  const workoutCount = user.sessions.length
  const currentStreak = user.streaks?.current || 0
  
  // Check workout milestones
  const workoutAchievements = [
    { id: 'first_workout', target: 1 },
    { id: 'workout_10', target: 10 },
    { id: 'workout_50', target: 50 },
    { id: 'workout_100', target: 100 },
  ]
  
  for (const ach of workoutAchievements) {
    if (!unlockedIds.includes(ach.id) && workoutCount >= ach.target) {
      const def = ACHIEVEMENT_DEFINITIONS.find(d => d.id === ach.id)!
      await prisma.achievement.create({
        data: {
          userId: user.id,
          type: ach.id,
          title: def.title,
          description: def.description,
          metadata: { workoutCount } as any,
        },
      })
      await awardXP(userEmail, def.xp, `achievement_${ach.id}`)
      newAchievements.push(ach.id)
    }
  }
  
  // Check streak achievements
  const streakAchievements = [
    { id: 'streak_7', target: 7 },
    { id: 'streak_30', target: 30 },
    { id: 'streak_100', target: 100 },
  ]
  
  for (const ach of streakAchievements) {
    if (!unlockedIds.includes(ach.id) && currentStreak >= ach.target) {
      const def = ACHIEVEMENT_DEFINITIONS.find(d => d.id === ach.id)!
      await prisma.achievement.create({
        data: {
          userId: user.id,
          type: ach.id,
          title: def.title,
          description: def.description,
          metadata: { streak: currentStreak } as any,
        },
      })
      await awardXP(userEmail, def.xp, `achievement_${ach.id}`)
      newAchievements.push(ach.id)
    }
  }
  
  return newAchievements
}
