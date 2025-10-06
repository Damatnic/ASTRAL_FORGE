/**
 * Equipment Recommendations System
 * 
 * Analyzes user's goals, training history, and current equipment
 * to suggest beneficial equipment purchases.
 */

export interface EquipmentRecommendation {
  equipmentName: string
  category: string
  priority: 'high' | 'medium' | 'low'
  reasoning: string
  benefits: string[]
  estimatedCost: string
  unlocks: {
    exercises: string[]
    templates: string[]
  }
  roi: number // Return on investment score (0-100)
}

export interface UserTrainingProfile {
  goals: ('strength' | 'hypertrophy' | 'endurance' | 'general-fitness')[]
  currentEquipment: string[]
  trainingFrequency: number // days per week
  experience: 'beginner' | 'intermediate' | 'advanced'
  budget?: 'low' | 'medium' | 'high'
  spaceAvailable?: 'minimal' | 'moderate' | 'spacious'
}

/**
 * Equipment recommendation database with costs and benefits
 */
const equipmentData = {
  'Olympic Barbell (20kg)': {
    category: 'BARBELL',
    cost: '$200-400',
    unlocks: {
      exercises: ['Barbell Squat', 'Deadlift', 'Bench Press', 'Overhead Press', 'Bent-Over Row', 'Romanian Deadlift', 'Front Squat', 'Barbell Curl'],
      templates: ['Home Gym PPL', 'Minimalist Strength Program'],
    },
    benefits: [
      'Enables all major compound lifts',
      'Progressive overload with precise weight increments',
      'Industry standard for strength training',
      'Extremely versatile and cost-effective long-term',
    ],
    spaceRequired: 'moderate',
    idealFor: ['strength', 'hypertrophy'],
  },
  'Power Rack': {
    category: 'RACK',
    cost: '$300-800',
    unlocks: {
      exercises: ['Barbell Squat (safe)', 'Bench Press (safe)', 'Overhead Press', 'Pull-ups', 'Rack Pulls'],
      templates: ['Home Gym PPL', 'Minimalist Strength Program'],
    },
    benefits: [
      'Safety for heavy compound lifts',
      'Solo training without spotter',
      'Multiple exercise options (pull-ups, dips, etc.)',
      'Foundation of a complete home gym',
    ],
    spaceRequired: 'spacious',
    idealFor: ['strength', 'hypertrophy'],
  },
  'Adjustable Dumbbells': {
    category: 'DUMBBELL',
    cost: '$200-600',
    unlocks: {
      exercises: ['Dumbbell Press', 'Dumbbell Row', 'Goblet Squat', 'Dumbbell Curl', 'Lateral Raise', 'Bulgarian Split Squat', 'Romanian Deadlift'],
      templates: ['Dumbbell Only Hypertrophy'],
    },
    benefits: [
      'Space-efficient weight variation',
      'Unilateral training for balance',
      'Safer than barbell for beginners',
      'Quick weight changes',
    ],
    spaceRequired: 'minimal',
    idealFor: ['hypertrophy', 'general-fitness'],
  },
  'Pull-up Bar': {
    category: 'BODYWEIGHT',
    cost: '$20-100',
    unlocks: {
      exercises: ['Pull-ups', 'Chin-ups', 'Hanging Leg Raise', 'Toes-to-Bar'],
      templates: ['Bodyweight Mastery'],
    },
    benefits: [
      'Best back width exercise',
      'Minimal cost and space',
      'Core strengthening',
      'Multiple grip variations',
    ],
    spaceRequired: 'minimal',
    idealFor: ['strength', 'hypertrophy', 'general-fitness'],
  },
  'Flat Bench': {
    category: 'BENCH',
    cost: '$100-300',
    unlocks: {
      exercises: ['Bench Press', 'Dumbbell Press', 'Dumbbell Row', 'Hip Thrust', 'Bulgarian Split Squat'],
      templates: ['Home Gym PPL', 'Minimalist Strength Program', 'Dumbbell Only Hypertrophy'],
    },
    benefits: [
      'Essential for horizontal pressing',
      'Supports various exercises',
      'Stable platform for heavy lifts',
      'Multi-purpose equipment',
    ],
    spaceRequired: 'moderate',
    idealFor: ['strength', 'hypertrophy'],
  },
  'Adjustable Bench': {
    category: 'BENCH',
    cost: '$150-400',
    unlocks: {
      exercises: ['Incline Press', 'Decline Press', 'Incline Curl', 'Preacher Curl', 'Incline Row'],
      templates: ['Home Gym PPL'],
    },
    benefits: [
      'Multiple angle variations',
      'Targets different muscle portions',
      'More exercise variety than flat bench',
      'Better muscle development',
    ],
    spaceRequired: 'moderate',
    idealFor: ['hypertrophy'],
  },
  'Weight Plates Set': {
    category: 'BARBELL',
    cost: '$200-600',
    unlocks: {
      exercises: ['All barbell exercises'],
      templates: ['All barbell-based programs'],
    },
    benefits: [
      'Progressive overload capability',
      'Required for barbell training',
      'Long-lasting investment',
      'Standard increments (2.5kg-25kg)',
    ],
    spaceRequired: 'moderate',
    idealFor: ['strength', 'hypertrophy'],
  },
  'Resistance Bands': {
    category: 'ACCESSORY',
    cost: '$20-50',
    unlocks: {
      exercises: ['Band Pull-Apart', 'Face Pull', 'Band Curl', 'Lateral Raise', 'Assisted Pull-up'],
      templates: ['Minimal Equipment Programs'],
    },
    benefits: [
      'Extremely affordable',
      'Portable and space-efficient',
      'Great for warm-ups and mobility',
      'Variable resistance training',
    ],
    spaceRequired: 'minimal',
    idealFor: ['general-fitness', 'endurance'],
  },
  'Kettlebell': {
    category: 'ACCESSORY',
    cost: '$30-80',
    unlocks: {
      exercises: ['Kettlebell Swing', 'Goblet Squat', 'Turkish Get-Up', 'Kettlebell Clean'],
      templates: ['Kettlebell Programs'],
    },
    benefits: [
      'Dynamic movement training',
      'Cardio + strength combination',
      'Functional fitness',
      'Single piece multiple exercises',
    ],
    spaceRequired: 'minimal',
    idealFor: ['general-fitness', 'endurance'],
  },
  'Dip Station': {
    category: 'BODYWEIGHT',
    cost: '$80-200',
    unlocks: {
      exercises: ['Dips', 'L-Sit', 'Knee Raises', 'Support Hold'],
      templates: ['Bodyweight Mastery'],
    },
    benefits: [
      'Best tricep mass builder',
      'Chest lower development',
      'Bodyweight strength milestone',
      'Compact equipment',
    ],
    spaceRequired: 'moderate',
    idealFor: ['strength', 'hypertrophy'],
  },
}

/**
 * Calculate ROI score based on multiple factors
 */
function calculateROI(
  equipment: string,
  profile: UserTrainingProfile
): number {
  const data = equipmentData[equipment as keyof typeof equipmentData]
  if (!data) return 0

  let score = 0

  // Goal alignment (0-30 points)
  const goalAlignment = profile.goals.some(goal => data.idealFor.includes(goal))
  score += goalAlignment ? 30 : 10

  // Exercise unlock value (0-25 points)
  const exerciseValue = Math.min(data.unlocks.exercises.length * 3, 25)
  score += exerciseValue

  // Template unlock value (0-20 points)
  const templateValue = Math.min(data.unlocks.templates.length * 10, 20)
  score += templateValue

  // Budget alignment (0-15 points)
  if (profile.budget) {
    const costLevel = data.cost.includes('20-') ? 'low' : data.cost.includes('200-400') ? 'medium' : 'high'
    if (costLevel === profile.budget) score += 15
    else if (profile.budget === 'high') score += 10
  } else {
    score += 10 // neutral if no budget specified
  }

  // Space alignment (0-10 points)
  if (profile.spaceAvailable) {
    const spaceMap = { minimal: 1, moderate: 2, spacious: 3 }
    const requiredSpace = data.spaceRequired === 'minimal' ? 1 : data.spaceRequired === 'moderate' ? 2 : 3
    const availableSpace = spaceMap[profile.spaceAvailable]
    if (requiredSpace <= availableSpace) score += 10
  } else {
    score += 5
  }

  return Math.min(score, 100)
}

/**
 * Generate equipment recommendations for user
 */
export function generateEquipmentRecommendations(
  profile: UserTrainingProfile
): EquipmentRecommendation[] {
  const recommendations: EquipmentRecommendation[] = []

  // Get equipment user doesn't have
  const missingEquipment = Object.keys(equipmentData).filter(
    eq => !profile.currentEquipment.includes(eq)
  )

  // Calculate ROI and priority for each missing equipment
  missingEquipment.forEach(equipment => {
    const data = equipmentData[equipment as keyof typeof equipmentData]
    const roi = calculateROI(equipment, profile)

    // Determine priority based on ROI
    let priority: 'high' | 'medium' | 'low' = 'low'
    if (roi >= 70) priority = 'high'
    else if (roi >= 50) priority = 'medium'

    // Generate reasoning
    const reasoning = generateReasoning(equipment, profile, data)

    recommendations.push({
      equipmentName: equipment,
      category: data.category,
      priority,
      reasoning,
      benefits: data.benefits,
      estimatedCost: data.cost,
      unlocks: data.unlocks,
      roi,
    })
  })

  // Sort by ROI (highest first)
  return recommendations.sort((a, b) => b.roi - a.roi)
}

/**
 * Generate personalized reasoning for recommendation
 */
function generateReasoning(
  equipment: string,
  profile: UserTrainingProfile,
  data: typeof equipmentData[keyof typeof equipmentData]
): string {
  const reasons: string[] = []

  // Goal-based reasoning
  const matchingGoals = profile.goals.filter(goal => data.idealFor.includes(goal))
  if (matchingGoals.length > 0) {
    reasons.push(`Aligns with your ${matchingGoals.join(' and ')} goals`)
  }

  // Foundational equipment
  if (['Olympic Barbell (20kg)', 'Power Rack', 'Flat Bench'].includes(equipment)) {
    reasons.push('Essential foundation piece for serious training')
  }

  // Value proposition
  if (data.unlocks.exercises.length >= 5) {
    reasons.push(`Unlocks ${data.unlocks.exercises.length}+ exercises`)
  }

  // Budget friendly
  if (data.cost.includes('20-') || data.cost.includes('$100')) {
    reasons.push('Affordable entry point')
  }

  // Space efficient
  if (data.spaceRequired === 'minimal') {
    reasons.push('Minimal space requirement')
  }

  return reasons.join('. ') + '.'
}

/**
 * Get top N recommendations
 */
export function getTopRecommendations(
  profile: UserTrainingProfile,
  count: number = 3
): EquipmentRecommendation[] {
  return generateEquipmentRecommendations(profile).slice(0, count)
}

/**
 * Get recommendations by category
 */
export function getRecommendationsByCategory(
  profile: UserTrainingProfile
): Record<string, EquipmentRecommendation[]> {
  const recommendations = generateEquipmentRecommendations(profile)
  const byCategory: Record<string, EquipmentRecommendation[]> = {}

  recommendations.forEach(rec => {
    if (!byCategory[rec.category]) {
      byCategory[rec.category] = []
    }
    byCategory[rec.category].push(rec)
  })

  return byCategory
}

/**
 * Calculate total investment for recommendations
 */
export function calculateTotalInvestment(
  recommendations: EquipmentRecommendation[]
): { min: number; max: number } {
  let min = 0
  let max = 0

  recommendations.forEach(rec => {
    const costs = rec.estimatedCost.match(/\d+/g)?.map(Number) || [0, 0]
    min += costs[0] || 0
    max += costs[1] || costs[0] || 0
  })

  return { min, max }
}

/**
 * Get equipment progression path
 */
export function getEquipmentProgressionPath(
  profile: UserTrainingProfile
): {
  phase: 'starter' | 'intermediate' | 'advanced'
  recommendations: EquipmentRecommendation[]
  estimatedCost: { min: number; max: number }
}[] {
  const allRecommendations = generateEquipmentRecommendations(profile)

  const starter = allRecommendations.filter(r => r.priority === 'high').slice(0, 3)
  const intermediate = allRecommendations.filter(r => r.priority === 'medium').slice(0, 3)
  const advanced = allRecommendations.filter(r => r.priority === 'low').slice(0, 3)

  return [
    {
      phase: 'starter',
      recommendations: starter,
      estimatedCost: calculateTotalInvestment(starter),
    },
    {
      phase: 'intermediate',
      recommendations: intermediate,
      estimatedCost: calculateTotalInvestment(intermediate),
    },
    {
      phase: 'advanced',
      recommendations: advanced,
      estimatedCost: calculateTotalInvestment(advanced),
    },
  ]
}

/**
 * Priority badge colors
 */
export function getPriorityBadge(priority: 'high' | 'medium' | 'low') {
  const badges = {
    high: { color: 'bg-red-500/20 text-red-300 border-red-500/30', text: 'High Priority' },
    medium: { color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30', text: 'Medium Priority' },
    low: { color: 'bg-blue-500/20 text-blue-300 border-blue-500/30', text: 'Low Priority' },
  }
  return badges[priority]
}
