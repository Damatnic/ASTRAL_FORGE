/**
 * Exercises Data Fetching Layer
 * Provides functions to fetch exercise data from the database
 */

import { prisma } from '@/lib/prisma'

export interface ExerciseSummary {
  id: string
  name: string
  category: string
  muscleGroup: string
  equipment: string | null
  isFavorite: boolean
  lastPerformed: Date | null
  personalRecords: {
    maxWeight: number | null
    maxReps: number | null
    maxVolume: number | null
  }
}

export interface ExerciseDetail extends ExerciseSummary {
  description: string | null
  videoUrl: string | null
  instructions: string[]
  formTips: string[]
  commonMistakes: string[]
  alternatives: string[]
  muscleGroups: {
    primary: string[]
    secondary: string[]
  }
  recentSets: RecentSet[]
}

export interface RecentSet {
  id: string
  date: Date
  weight: number
  reps: number
  rpe: number | null
  sessionName: string | null
}

/**
 * Fetch all exercises with user-specific data
 */
export async function getExercises(userId: string): Promise<ExerciseSummary[]> {
  const exercises = await prisma.exercise.findMany({
    include: {
      ratings: {
        where: { userId },
      },
      sets: {
        where: {
          session: {
            userId,
            completed: true,
          },
          completed: true,
          isWarmup: false,
        },
        orderBy: { timestamp: 'desc' },
        take: 50,
      },
    },
    orderBy: { name: 'asc' },
  })

  return exercises.map((exercise) => {
    const sets = exercise.sets

    // Calculate PRs
    const maxWeight = sets.length > 0 ? Math.max(...sets.map((s) => s.weight)) : null
    const maxReps = sets.length > 0 ? Math.max(...sets.map((s) => s.reps)) : null
    const maxVolume = sets.length > 0 ? Math.max(...sets.map((s) => s.weight * s.reps)) : null

    // Last performed
    const lastPerformed = sets.length > 0 ? sets[0].timestamp : null

    return {
      id: exercise.id,
      name: exercise.name,
      category: exercise.category,
      muscleGroup: exercise.muscleGroup,
      equipment: exercise.equipment,
      isFavorite: exercise.ratings[0]?.isFavorite || false,
      lastPerformed,
      personalRecords: {
        maxWeight,
        maxReps,
        maxVolume,
      },
    }
  })
}

/**
 * Fetch detailed exercise information
 */
export async function getExerciseDetail(
  exerciseId: string,
  userId: string
): Promise<ExerciseDetail | null> {
  const exercise = await prisma.exercise.findUnique({
    where: { id: exerciseId },
    include: {
      ratings: {
        where: { userId },
      },
      sets: {
        where: {
          session: {
            userId,
            completed: true,
          },
          completed: true,
          isWarmup: false,
        },
        include: {
          session: {
            select: {
              id: true,
              name: true,
              date: true,
            },
          },
        },
        orderBy: { timestamp: 'desc' },
        take: 100,
      },
    },
  })

  if (!exercise) return null

  const sets = exercise.sets

  // Calculate PRs
  const maxWeight = sets.length > 0 ? Math.max(...sets.map((s) => s.weight)) : null
  const maxReps = sets.length > 0 ? Math.max(...sets.map((s) => s.reps)) : null
  const maxVolume = sets.length > 0 ? Math.max(...sets.map((s) => s.weight * s.reps)) : null
  const est1RM = maxWeight && maxReps ? Math.round(maxWeight * (1 + maxReps / 30)) : null

  // Last performed
  const lastPerformed = sets.length > 0 ? sets[0].timestamp : null

  // Recent sets (last 10)
  const recentSets: RecentSet[] = sets.slice(0, 10).map((set) => ({
    id: set.id,
    date: set.session.date,
    weight: set.weight,
    reps: set.reps,
    rpe: set.rpe,
    sessionName: set.session.name,
  }))

  // Get alternative exercises (same muscle group, different equipment)
  const alternatives = await prisma.exercise.findMany({
    where: {
      muscleGroup: exercise.muscleGroup,
      id: { not: exerciseId },
    },
    take: 5,
  })

  // Parse description into instructions, tips, and mistakes
  const description = exercise.description || ''
  const instructions = parseInstructions(description)
  const formTips = parseFormTips(exercise.name, exercise.category)
  const commonMistakes = parseCommonMistakes(exercise.name, exercise.category)

  return {
    id: exercise.id,
    name: exercise.name,
    category: exercise.category,
    muscleGroup: exercise.muscleGroup,
    equipment: exercise.equipment,
    description: exercise.description,
    videoUrl: exercise.videoUrl,
    isFavorite: exercise.ratings[0]?.isFavorite || false,
    lastPerformed,
    personalRecords: {
      maxWeight,
      maxReps,
      maxVolume,
    },
    instructions,
    formTips,
    commonMistakes,
    alternatives: alternatives.map((a) => a.name),
    muscleGroups: parseMuscleGroups(exercise.muscleGroup),
    recentSets,
  }
}

/**
 * Search/filter exercises
 */
export async function searchExercises(
  userId: string,
  filters: {
    search?: string
    muscleGroup?: string
    equipment?: string
    difficulty?: string
    favoritesOnly?: boolean
  }
): Promise<ExerciseSummary[]> {
  const where: any = {}

  if (filters.search) {
    where.name = { contains: filters.search, mode: 'insensitive' }
  }

  if (filters.muscleGroup) {
    where.muscleGroup = filters.muscleGroup
  }

  if (filters.equipment) {
    where.equipment = filters.equipment
  }

  if (filters.difficulty) {
    where.category = filters.difficulty
  }

  const exercises = await prisma.exercise.findMany({
    where,
    include: {
      ratings: {
        where: { userId },
      },
      sets: {
        where: {
          session: {
            userId,
            completed: true,
          },
          completed: true,
          isWarmup: false,
        },
        orderBy: { timestamp: 'desc' },
        take: 50,
      },
    },
    orderBy: { name: 'asc' },
  })

  let results = exercises.map((exercise) => {
    const sets = exercise.sets
    const maxWeight = sets.length > 0 ? Math.max(...sets.map((s) => s.weight)) : null
    const maxReps = sets.length > 0 ? Math.max(...sets.map((s) => s.reps)) : null
    const maxVolume = sets.length > 0 ? Math.max(...sets.map((s) => s.weight * s.reps)) : null
    const lastPerformed = sets.length > 0 ? sets[0].timestamp : null

    return {
      id: exercise.id,
      name: exercise.name,
      category: exercise.category,
      muscleGroup: exercise.muscleGroup,
      equipment: exercise.equipment,
      isFavorite: exercise.ratings[0]?.isFavorite || false,
      lastPerformed,
      personalRecords: {
        maxWeight,
        maxReps,
        maxVolume,
      },
    }
  })

  if (filters.favoritesOnly) {
    results = results.filter((e) => e.isFavorite)
  }

  return results
}

// Helper functions for parsing exercise data
function parseInstructions(description: string): string[] {
  // TODO: Implement proper parsing logic
  return [
    'Position yourself correctly with proper stance',
    'Engage core and maintain neutral spine',
    'Execute the movement with controlled tempo',
    'Focus on the target muscle group',
    'Complete the full range of motion',
  ]
}

function parseFormTips(name: string, category: string): string[] {
  // TODO: Implement exercise-specific form tips
  return [
    'Keep your core engaged throughout the movement',
    'Maintain proper breathing pattern',
    'Control the eccentric portion',
    'Avoid using momentum',
    'Focus on mind-muscle connection',
  ]
}

function parseCommonMistakes(name: string, category: string): string[] {
  // TODO: Implement exercise-specific mistakes
  return [
    'Using too much weight at the expense of form',
    'Not completing full range of motion',
    'Rushing through reps',
    'Improper breathing technique',
    'Neglecting proper warm-up',
  ]
}

function parseMuscleGroups(muscleGroup: string): { primary: string[]; secondary: string[] } {
  // TODO: Implement proper muscle group mapping
  const muscleMap: Record<string, { primary: string[]; secondary: string[] }> = {
    legs: {
      primary: ['Quadriceps', 'Hamstrings', 'Glutes'],
      secondary: ['Calves', 'Core'],
    },
    push: {
      primary: ['Chest', 'Shoulders', 'Triceps'],
      secondary: ['Core'],
    },
    pull: {
      primary: ['Back', 'Biceps'],
      secondary: ['Forearms', 'Rear Delts'],
    },
    core: {
      primary: ['Abs', 'Obliques'],
      secondary: ['Lower Back'],
    },
  }

  return muscleMap[muscleGroup] || { primary: [muscleGroup], secondary: [] }
}

/**
 * Toggle exercise favorite status
 */
export async function toggleExerciseFavorite(
  userId: string,
  exerciseId: string
): Promise<boolean> {
  const existing = await prisma.exerciseRating.findUnique({
    where: {
      userId_exerciseId: {
        userId,
        exerciseId,
      },
    },
  })

  if (existing) {
    await prisma.exerciseRating.update({
      where: {
        userId_exerciseId: {
          userId,
          exerciseId,
        },
      },
      data: {
        isFavorite: !existing.isFavorite,
      },
    })
    return !existing.isFavorite
  } else {
    await prisma.exerciseRating.create({
      data: {
        userId,
        exerciseId,
        rating: 5,
        isFavorite: true,
      },
    })
    return true
  }
}
