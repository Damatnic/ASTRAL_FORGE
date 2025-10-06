/**
 * Training Tier System
 * 
 * Replaces arbitrary XP/Levels with achievement-based tiers
 * based on actual strength performance and training consistency.
 */

export type TrainingTier = 'novice' | 'beginner' | 'intermediate' | 'advanced' | 'elite' | 'master'

export interface TierInfo {
  name: string
  icon: string
  description: string
  duration: string
  criteria: TierCriteria
  color: string
  benefits: string[]
}

export interface TierCriteria {
  // Strength standards (multipliers of bodyweight)
  minBenchPress?: number // x bodyweight
  minSquat?: number // x bodyweight
  minDeadlift?: number // x bodyweight
  minTotal?: number // Combined total (x bodyweight)
  
  // OR time-based for beginners
  minMonths?: number
  minWorkouts?: number
  
  // Consistency requirements
  minConsistencyRate?: number // % of planned workouts completed
  minStreak?: number // Days of consecutive training
}

export interface UserTierData {
  currentTier: TrainingTier
  tierProgress: number // 0-100% progress to next tier
  achievedAt: Date
  nextTier: TrainingTier | null
  criteriamet: Partial<TierCriteria>
  unmetCriteria: Partial<TierCriteria>
}

export const TIER_DEFINITIONS: Record<TrainingTier, TierInfo> = {
  novice: {
    name: 'Novice',
    icon: '🌱',
    description: 'Just starting your strength journey',
    duration: '0-3 months',
    color: 'text-gray-400',
    criteria: {
      minMonths: 0,
      minWorkouts: 0,
    },
    benefits: [
      'Learning proper form and technique',
      'Building training habit and consistency',
      'Experiencing rapid "newbie gains"',
      'Establishing baseline strength levels',
    ],
  },
  
  beginner: {
    name: 'Beginner',
    icon: '🔰',
    description: 'Consistent training with solid fundamentals',
    duration: '3-12 months',
    color: 'text-blue-400',
    criteria: {
      minMonths: 3,
      minWorkouts: 36, // ~3 workouts/week for 3 months
      minConsistencyRate: 70,
      minBenchPress: 0.75, // 0.75x bodyweight
      minSquat: 1.0, // 1x bodyweight
      minDeadlift: 1.25, // 1.25x bodyweight
    },
    benefits: [
      'Linear progression on major lifts',
      'Access to beginner workout templates',
      'Form mastery on compound movements',
      'Building sustainable training habits',
    ],
  },
  
  intermediate: {
    name: 'Intermediate',
    icon: '⚡',
    description: 'Solid strength foundation established',
    duration: '1-3 years',
    color: 'text-purple-400',
    criteria: {
      minMonths: 12,
      minWorkouts: 150,
      minConsistencyRate: 75,
      minBenchPress: 1.0, // 1x bodyweight
      minSquat: 1.5, // 1.5x bodyweight
      minDeadlift: 2.0, // 2x bodyweight
      minTotal: 4.5, // Combined 4.5x bodyweight
    },
    benefits: [
      'Periodization and advanced programming',
      'Slower but steady strength gains',
      'Access to intermediate templates',
      'Understanding of progressive overload',
      'Equipment recommendations for home gym',
    ],
  },
  
  advanced: {
    name: 'Advanced',
    icon: '🔥',
    description: 'Approaching competition-level strength',
    duration: '3-5 years',
    color: 'text-orange-400',
    criteria: {
      minMonths: 36,
      minWorkouts: 400,
      minConsistencyRate: 80,
      minBenchPress: 1.5, // 1.5x bodyweight
      minSquat: 2.0, // 2x bodyweight
      minDeadlift: 2.5, // 2.5x bodyweight
      minTotal: 6.0, // Combined 6x bodyweight
    },
    benefits: [
      'Competition-level programming',
      'Advanced periodization strategies',
      'Peak performance optimization',
      'Mentorship opportunities',
      'Access to specialized equipment guides',
    ],
  },
  
  elite: {
    name: 'Elite',
    icon: '💎',
    description: 'Competition-ready athlete',
    duration: '5-10 years',
    color: 'text-cyan-400',
    criteria: {
      minMonths: 60,
      minWorkouts: 800,
      minConsistencyRate: 85,
      minBenchPress: 1.75, // 1.75x bodyweight
      minSquat: 2.25, // 2.25x bodyweight
      minDeadlift: 2.75, // 2.75x bodyweight
      minTotal: 6.75, // Combined 6.75x bodyweight
    },
    benefits: [
      'Competitive powerlifting standards',
      'Elite-level programming access',
      'Advanced recovery protocols',
      'Performance analytics and tracking',
      'Community leadership role',
    ],
  },
  
  master: {
    name: 'Master',
    icon: '👑',
    description: 'Legendary strength and expertise',
    duration: '10+ years',
    color: 'text-yellow-400',
    criteria: {
      minMonths: 120,
      minWorkouts: 1500,
      minConsistencyRate: 90,
      minBenchPress: 2.0, // 2x bodyweight
      minSquat: 2.5, // 2.5x bodyweight
      minDeadlift: 3.0, // 3x bodyweight
      minTotal: 7.5, // Combined 7.5x bodyweight
    },
    benefits: [
      'Coaching and mentorship capabilities',
      'Decade+ of training wisdom',
      'Elite strength standards achieved',
      'Community mentor status',
      'Lifetime training mastery',
    ],
  },
}

export const TIER_ORDER: TrainingTier[] = [
  'novice',
  'beginner',
  'intermediate',
  'advanced',
  'elite',
  'master',
]

/**
 * Calculate user's training tier based on performance metrics
 */
export function calculateUserTier(stats: {
  bodyweight: number // in kg
  benchPress1RM?: number
  squat1RM?: number
  deadlift1RM?: number
  totalWorkouts: number
  trainingMonths: number
  consistencyRate: number // 0-100
  currentStreak?: number
}): UserTierData {
  // Calculate strength ratios
  const benchRatio = stats.benchPress1RM ? stats.benchPress1RM / stats.bodyweight : 0
  const squatRatio = stats.squat1RM ? stats.squat1RM / stats.bodyweight : 0
  const deadliftRatio = stats.deadlift1RM ? stats.deadlift1RM / stats.bodyweight : 0
  const totalRatio = benchRatio + squatRatio + deadliftRatio

  let currentTier: TrainingTier = 'novice'
  let criteriamet: Partial<TierCriteria> = {}
  const unmetCriteria: Partial<TierCriteria> = {}

  // Check tiers from highest to lowest
  for (let i = TIER_ORDER.length - 1; i >= 0; i--) {
    const tier = TIER_ORDER[i]
    const criteria = TIER_DEFINITIONS[tier].criteria
    
    const meetsTimeRequirement = 
      !criteria.minMonths || stats.trainingMonths >= criteria.minMonths
    
    const meetsWorkoutRequirement = 
      !criteria.minWorkouts || stats.totalWorkouts >= criteria.minWorkouts
    
    const meetsConsistencyRequirement = 
      !criteria.minConsistencyRate || stats.consistencyRate >= criteria.minConsistencyRate
    
    const meetsBenchRequirement = 
      !criteria.minBenchPress || benchRatio >= criteria.minBenchPress
    
    const meetsSquatRequirement = 
      !criteria.minSquat || squatRatio >= criteria.minSquat
    
    const meetsDeadliftRequirement = 
      !criteria.minDeadlift || deadliftRatio >= criteria.minDeadlift
    
    const meetsTotalRequirement = 
      !criteria.minTotal || totalRatio >= criteria.minTotal

    const meetsAllRequirements = 
      meetsTimeRequirement &&
      meetsWorkoutRequirement &&
      meetsConsistencyRequirement &&
      meetsBenchRequirement &&
      meetsSquatRequirement &&
      meetsDeadliftRequirement &&
      meetsTotalRequirement

    if (meetsAllRequirements) {
      currentTier = tier
      criteriamet = criteria
      break
    } else if (i === 0) {
      // Track what's blocking next tier
      if (!meetsTimeRequirement) unmetCriteria.minMonths = criteria.minMonths
      if (!meetsWorkoutRequirement) unmetCriteria.minWorkouts = criteria.minWorkouts
      if (!meetsConsistencyRequirement) unmetCriteria.minConsistencyRate = criteria.minConsistencyRate
      if (!meetsBenchRequirement) unmetCriteria.minBenchPress = criteria.minBenchPress
      if (!meetsSquatRequirement) unmetCriteria.minSquat = criteria.minSquat
      if (!meetsDeadliftRequirement) unmetCriteria.minDeadlift = criteria.minDeadlift
      if (!meetsTotalRequirement) unmetCriteria.minTotal = criteria.minTotal
    }
  }

  // Calculate progress to next tier
  const currentIndex = TIER_ORDER.indexOf(currentTier)
  const nextTier = currentIndex < TIER_ORDER.length - 1 ? TIER_ORDER[currentIndex + 1] : null
  
  let tierProgress = 100 // Default: at max tier
  if (nextTier) {
    const nextCriteria = TIER_DEFINITIONS[nextTier].criteria
    const progressFactors: number[] = []

    if (nextCriteria.minMonths) {
      progressFactors.push(Math.min(100, (stats.trainingMonths / nextCriteria.minMonths) * 100))
    }
    if (nextCriteria.minWorkouts) {
      progressFactors.push(Math.min(100, (stats.totalWorkouts / nextCriteria.minWorkouts) * 100))
    }
    if (nextCriteria.minConsistencyRate) {
      progressFactors.push(Math.min(100, (stats.consistencyRate / nextCriteria.minConsistencyRate) * 100))
    }
    if (nextCriteria.minBenchPress) {
      progressFactors.push(Math.min(100, (benchRatio / nextCriteria.minBenchPress) * 100))
    }
    if (nextCriteria.minSquat) {
      progressFactors.push(Math.min(100, (squatRatio / nextCriteria.minSquat) * 100))
    }
    if (nextCriteria.minDeadlift) {
      progressFactors.push(Math.min(100, (deadliftRatio / nextCriteria.minDeadlift) * 100))
    }

    // Average progress across all factors
    tierProgress = progressFactors.length > 0
      ? progressFactors.reduce((sum, p) => sum + p, 0) / progressFactors.length
      : 0
  }

  return {
    currentTier,
    tierProgress: Math.round(tierProgress),
    achievedAt: new Date(), // This should be stored in DB
    nextTier,
    criteriamet,
    unmetCriteria,
  }
}

/**
 * Get tier badge component props
 */
export function getTierBadge(tier: TrainingTier): {
  icon: string
  name: string
  color: string
  gradient: string
} {
  const info = TIER_DEFINITIONS[tier]
  const gradients = {
    novice: 'from-gray-600 to-gray-400',
    beginner: 'from-blue-600 to-blue-400',
    intermediate: 'from-purple-600 to-purple-400',
    advanced: 'from-orange-600 to-orange-400',
    elite: 'from-cyan-600 to-cyan-400',
    master: 'from-yellow-600 to-yellow-400',
  }

  return {
    icon: info.icon,
    name: info.name,
    color: info.color,
    gradient: gradients[tier],
  }
}

/**
 * Get recommended next steps for tier progression
 */
export function getTierProgressionRecommendations(
  currentTierData: UserTierData,
  stats: {
    bodyweight: number
    benchPress1RM?: number
    squat1RM?: number
    deadlift1RM?: number
  }
): string[] {
  if (!currentTierData.nextTier) {
    return ['You\'ve reached Master tier! Focus on maintaining strength and mentoring others.']
  }

  const recommendations: string[] = []
  const nextCriteria = TIER_DEFINITIONS[currentTierData.nextTier].criteria

  if (currentTierData.unmetCriteria.minMonths) {
    const remaining = currentTierData.unmetCriteria.minMonths
    recommendations.push(`Continue training for ${remaining} more months to meet time requirement`)
  }

  if (currentTierData.unmetCriteria.minWorkouts) {
    const remaining = currentTierData.unmetCriteria.minWorkouts
    recommendations.push(`Complete ${remaining} more workouts to meet volume requirement`)
  }

  if (currentTierData.unmetCriteria.minConsistencyRate) {
    const target = currentTierData.unmetCriteria.minConsistencyRate
    recommendations.push(`Improve consistency to ${target}% of planned workouts`)
  }

  if (currentTierData.unmetCriteria.minBenchPress && nextCriteria.minBenchPress) {
    const targetWeight = Math.round(stats.bodyweight * nextCriteria.minBenchPress)
    recommendations.push(`Increase bench press 1RM to ${targetWeight}kg (${nextCriteria.minBenchPress}x bodyweight)`)
  }

  if (currentTierData.unmetCriteria.minSquat && nextCriteria.minSquat) {
    const targetWeight = Math.round(stats.bodyweight * nextCriteria.minSquat)
    recommendations.push(`Increase squat 1RM to ${targetWeight}kg (${nextCriteria.minSquat}x bodyweight)`)
  }

  if (currentTierData.unmetCriteria.minDeadlift && nextCriteria.minDeadlift) {
    const targetWeight = Math.round(stats.bodyweight * nextCriteria.minDeadlift)
    recommendations.push(`Increase deadlift 1RM to ${targetWeight}kg (${nextCriteria.minDeadlift}x bodyweight)`)
  }

  return recommendations
}

/**
 * Get strength standards comparison
 */
export function getStrengthStandards(bodyweight: number, tier: TrainingTier): {
  benchPress: number
  squat: number
  deadlift: number
  total: number
} {
  const criteria = TIER_DEFINITIONS[tier].criteria

  return {
    benchPress: bodyweight * (criteria.minBenchPress || 0),
    squat: bodyweight * (criteria.minSquat || 0),
    deadlift: bodyweight * (criteria.minDeadlift || 0),
    total: bodyweight * (criteria.minTotal || 0),
  }
}
