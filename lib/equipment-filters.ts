/**
 * Equipment-based exercise filtering utilities
 * 
 * Provides functions to filter exercises based on user's available equipment,
 * suggest alternatives, and check equipment requirements.
 */

import { equipmentSeedData } from './equipment-data'

export interface ExerciseWithEquipment {
  id: string
  name: string
  category: string
  muscleGroup: string
  equipment: string | null
  description?: string | null
  videoUrl?: string | null
}

export interface EquipmentRequirement {
  equipmentName: string
  category: string
  required: boolean
  alternatives?: string[]
}

export interface FilteredExerciseResult {
  canPerform: boolean
  missingEquipment: string[]
  alternatives: ExerciseWithEquipment[]
  requiredEquipment: EquipmentRequirement[]
}

/**
 * Maps exercise equipment strings to our equipment database
 */
export const equipmentMapping: Record<string, string[]> = {
  barbell: ['Olympic Barbell (20kg)', 'Olympic Barbell (15kg)', 'Training Barbell (10kg)'],
  dumbbell: ['Dumbbell (Pair)', 'Adjustable Dumbbells', 'Fixed Dumbbells'],
  machine: ['Cable Machine', 'Leg Press', 'Lat Pulldown Machine', 'Seated Row Machine'],
  bodyweight: ['Pull-up Bar', 'Dip Station', 'Gymnastic Rings', 'Parallettes'],
  bench: ['Flat Bench', 'Adjustable Bench'],
  rack: ['Power Rack', 'Squat Rack', 'Half Rack'],
  cable: ['Cable Machine'],
  'resistance-band': ['Resistance Bands'],
  kettlebell: ['Kettlebell'],
  'medicine-ball': ['Medicine Ball'],
  'ez-bar': ['EZ Curl Bar'],
  'trap-bar': ['Trap Bar (Hex Bar)'],
}

/**
 * Exercise alternatives grouped by muscle group and movement pattern
 */
export const exerciseAlternatives: Record<string, string[]> = {
  // LEGS - SQUAT PATTERN
  'Barbell Squat': ['Goblet Squat', 'Bulgarian Split Squat', 'Pistol Squat', 'Leg Press'],
  'Front Squat': ['Goblet Squat', 'Barbell Squat', 'Hack Squat'],
  'Goblet Squat': ['Barbell Squat', 'Dumbbell Squat', 'Bulgarian Split Squat'],
  
  // LEGS - HINGE PATTERN
  'Deadlift': ['Romanian Deadlift', 'Trap Bar Deadlift', 'Single-Leg RDL', 'Kettlebell Swing'],
  'Romanian Deadlift': ['Deadlift', 'Good Morning', 'Single-Leg RDL', 'Glute Ham Raise'],
  'Trap Bar Deadlift': ['Deadlift', 'Romanian Deadlift', 'Hex Bar Squat'],
  
  // PUSH - HORIZONTAL
  'Bench Press': ['Dumbbell Bench Press', 'Push-Up', 'Machine Chest Press', 'Floor Press'],
  'Dumbbell Bench Press': ['Bench Press', 'Push-Up', 'Dumbbell Floor Press'],
  'Incline Bench Press': ['Incline Dumbbell Press', 'Landmine Press', 'Pike Push-Up'],
  
  // PUSH - VERTICAL
  'Overhead Press': ['Dumbbell Shoulder Press', 'Landmine Press', 'Pike Push-Up', 'Handstand Push-Up'],
  'Dumbbell Shoulder Press': ['Overhead Press', 'Arnold Press', 'Pike Push-Up'],
  
  // PULL - VERTICAL
  'Pull-Up': ['Lat Pulldown', 'Assisted Pull-Up', 'Inverted Row', 'Resistance Band Pull-Down'],
  'Lat Pulldown': ['Pull-Up', 'Assisted Pull-Up', 'Straight-Arm Pulldown'],
  'Chin-Up': ['Pull-Up', 'Lat Pulldown', 'Bicep Curl + Lat Pulldown'],
  
  // PULL - HORIZONTAL
  'Bent-Over Row': ['Dumbbell Row', 'Pendlay Row', 'T-Bar Row', 'Inverted Row'],
  'Dumbbell Row': ['Bent-Over Row', 'Single-Arm Row', 'Chest-Supported Row'],
  'Seated Row': ['Bent-Over Row', 'Dumbbell Row', 'Inverted Row'],
  
  // ISOLATION - ARMS
  'Dumbbell Curl': ['Barbell Curl', 'Hammer Curl', 'Cable Curl', 'Resistance Band Curl'],
  'Barbell Curl': ['Dumbbell Curl', 'EZ Bar Curl', 'Cable Curl'],
  'Tricep Pushdown': ['Overhead Tricep Extension', 'Dips', 'Close-Grip Bench Press', 'Diamond Push-Up'],
  'Overhead Tricep Extension': ['Tricep Pushdown', 'Skull Crusher', 'Dips'],
  
  // ISOLATION - SHOULDERS
  'Lateral Raise': ['Cable Lateral Raise', 'Resistance Band Lateral Raise', 'Upright Row'],
  'Face Pull': ['Reverse Fly', 'Band Pull-Apart', 'Rear Delt Fly'],
  
  // CORE
  'Plank': ['Dead Bug', 'Hollow Hold', 'RKC Plank', 'Ab Wheel Rollout'],
  'Ab Wheel Rollout': ['Plank', 'Long-Lever Plank', 'Inchworm'],
  'Hanging Leg Raise': ['Lying Leg Raise', 'Dragon Flag', 'V-Up', 'Toes-to-Bar'],
}

/**
 * Check if user can perform an exercise based on available equipment
 */
export function canPerformExercise(
  exercise: ExerciseWithEquipment,
  userEquipment: string[]
): boolean {
  // Bodyweight exercises can always be performed
  if (!exercise.equipment || exercise.equipment === 'bodyweight') {
    return true
  }

  // Get required equipment names from mapping
  const requiredEquipmentNames = equipmentMapping[exercise.equipment.toLowerCase()] || []
  
  // Check if user has any of the required equipment
  return requiredEquipmentNames.some(equipName => 
    userEquipment.includes(equipName)
  )
}

/**
 * Get detailed equipment requirements for an exercise
 */
export function getEquipmentRequirements(
  exercise: ExerciseWithEquipment
): EquipmentRequirement[] {
  if (!exercise.equipment || exercise.equipment === 'bodyweight') {
    return []
  }

  const equipmentNames = equipmentMapping[exercise.equipment.toLowerCase()] || []
  const category = equipmentSeedData.find(e => equipmentNames.includes(e.name))?.category || 'ACCESSORY'

  return [{
    equipmentName: exercise.equipment,
    category,
    required: true,
    alternatives: equipmentNames,
  }]
}

/**
 * Filter exercises by user's available equipment
 */
export function filterExercisesByEquipment(
  exercises: ExerciseWithEquipment[],
  userEquipment: string[]
): ExerciseWithEquipment[] {
  return exercises.filter(exercise => canPerformExercise(exercise, userEquipment))
}

/**
 * Get alternative exercises when user doesn't have required equipment
 */
export function getAlternativeExercises(
  exerciseName: string,
  allExercises: ExerciseWithEquipment[],
  userEquipment: string[]
): ExerciseWithEquipment[] {
  const alternativeNames = exerciseAlternatives[exerciseName] || []
  
  return allExercises.filter(exercise => 
    alternativeNames.includes(exercise.name) &&
    canPerformExercise(exercise, userEquipment)
  )
}

/**
 * Get comprehensive filtering result for an exercise
 */
export function getExerciseFilterResult(
  exercise: ExerciseWithEquipment,
  userEquipment: string[],
  allExercises: ExerciseWithEquipment[]
): FilteredExerciseResult {
  const canPerform = canPerformExercise(exercise, userEquipment)
  const requiredEquipment = getEquipmentRequirements(exercise)
  
  const missingEquipment = canPerform 
    ? [] 
    : requiredEquipment.map(req => req.equipmentName)
  
  const alternatives = canPerform 
    ? []
    : getAlternativeExercises(exercise.name, allExercises, userEquipment)

  return {
    canPerform,
    missingEquipment,
    alternatives,
    requiredEquipment,
  }
}

/**
 * Group exercises by equipment availability
 */
export function groupExercisesByAvailability(
  exercises: ExerciseWithEquipment[],
  userEquipment: string[]
) {
  const available: ExerciseWithEquipment[] = []
  const unavailable: ExerciseWithEquipment[] = []
  const bodyweight: ExerciseWithEquipment[] = []

  exercises.forEach(exercise => {
    if (!exercise.equipment || exercise.equipment === 'bodyweight') {
      bodyweight.push(exercise)
    } else if (canPerformExercise(exercise, userEquipment)) {
      available.push(exercise)
    } else {
      unavailable.push(exercise)
    }
  })

  return { available, unavailable, bodyweight }
}

/**
 * Get equipment badge color and text
 */
export function getEquipmentBadge(equipment: string | null): { color: string; text: string } {
  if (!equipment || equipment === 'bodyweight') {
    return { color: 'bg-green-500/20 text-green-300 border-green-500/30', text: 'Bodyweight' }
  }

  const badges: Record<string, { color: string; text: string }> = {
    barbell: { color: 'bg-red-500/20 text-red-300 border-red-500/30', text: 'Barbell' },
    dumbbell: { color: 'bg-blue-500/20 text-blue-300 border-blue-500/30', text: 'Dumbbell' },
    machine: { color: 'bg-purple-500/20 text-purple-300 border-purple-500/30', text: 'Machine' },
    cable: { color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30', text: 'Cable' },
    bench: { color: 'bg-orange-500/20 text-orange-300 border-orange-500/30', text: 'Bench' },
    rack: { color: 'bg-pink-500/20 text-pink-300 border-pink-500/30', text: 'Rack' },
    kettlebell: { color: 'bg-teal-500/20 text-teal-300 border-teal-500/30', text: 'Kettlebell' },
    'resistance-band': { color: 'bg-lime-500/20 text-lime-300 border-lime-500/30', text: 'Bands' },
  }

  return badges[equipment.toLowerCase()] || { 
    color: 'bg-gray-500/20 text-gray-300 border-gray-500/30', 
    text: equipment.charAt(0).toUpperCase() + equipment.slice(1) 
  }
}
