/**
 * Programs Data Fetching Layer
 * Provides functions to fetch workout programs from the database
 */

import { prisma } from '@/lib/prisma'

export interface ProgramSummary {
  id: string
  name: string
  description: string
  category: string
  difficulty: string
  daysPerWeek: number
  weeksTotal: number | null
  isActive: boolean
  isPublic: boolean
  tags: string[]
  exerciseCount: number
  completionRate?: number
  userRating?: number
}

export interface ProgramDetail extends ProgramSummary {
  progressionType: string
  trainingMaxPct: number | null
  deloadWeek: number | null
  weeks: ProgramWeek[]
  userProgress?: {
    currentWeek: number
    completedWorkouts: number
    totalWorkouts: number
  }
}

export interface ProgramWeek {
  weekNumber: number
  days: ProgramDay[]
}

export interface ProgramDay {
  dayOfWeek: number
  dayName: string
  exercises: ProgramExerciseDetail[]
}

export interface ProgramExerciseDetail {
  id: string
  exerciseId: string
  exerciseName: string
  orderIndex: number
  sets: number
  repsMin: number | null
  repsMax: number | null
  repsTarget: number | null
  weightPct: number | null
  rpe: number | null
  restSeconds: number | null
  notes: string | null
}

/**
 * Fetch all programs for user (both own and public)
 */
export async function getPrograms(userId: string): Promise<ProgramSummary[]> {
  const programs = await prisma.workoutProgram.findMany({
    where: {
      OR: [
        { userId },
        { isPublic: true },
      ],
    },
    include: {
      exercises: true,
      _count: {
        select: { exercises: true },
      },
    },
    orderBy: [
      { isActive: 'desc' },
      { createdAt: 'desc' },
    ],
  })

  return programs.map((program) => ({
    id: program.id,
    name: program.name,
    description: program.description || '',
    category: program.category,
    difficulty: program.difficulty,
    daysPerWeek: program.daysPerWeek,
    weeksTotal: program.weeksTotal,
    isActive: program.isActive,
    isPublic: program.isPublic,
    tags: program.tags,
    exerciseCount: program._count.exercises,
    completionRate: 85, // TODO: Calculate from user sessions
    userRating: 4.5, // TODO: Calculate from ratings
  }))
}

/**
 * Fetch detailed program information including week breakdown
 */
export async function getProgramDetail(
  programId: string,
  userId: string
): Promise<ProgramDetail | null> {
  const program = await prisma.workoutProgram.findFirst({
    where: {
      id: programId,
      OR: [
        { userId },
        { isPublic: true },
      ],
    },
    include: {
      exercises: {
        orderBy: [
          { weekNumber: 'asc' },
          { dayOfWeek: 'asc' },
          { orderIndex: 'asc' },
        ],
      },
    },
  })

  if (!program) return null

  // Get exercise names
  const exerciseIds = [...new Set(program.exercises.map((e) => e.exerciseId))]
  const exercises = await prisma.exercise.findMany({
    where: { id: { in: exerciseIds } },
  })
  const exerciseMap = new Map(exercises.map((e) => [e.id, e.name]))

  // Group by week
  const weeksMap = new Map<number, Map<number, ProgramExerciseDetail[]>>()

  program.exercises.forEach((pe) => {
    const weekNum = pe.weekNumber || 1
    const dayNum = pe.dayOfWeek

    if (!weeksMap.has(weekNum)) {
      weeksMap.set(weekNum, new Map())
    }

    const weekDays = weeksMap.get(weekNum)!
    if (!weekDays.has(dayNum)) {
      weekDays.set(dayNum, [])
    }

    weekDays.get(dayNum)!.push({
      id: pe.id,
      exerciseId: pe.exerciseId,
      exerciseName: exerciseMap.get(pe.exerciseId) || 'Unknown',
      orderIndex: pe.orderIndex,
      sets: pe.sets,
      repsMin: pe.repsMin,
      repsMax: pe.repsMax,
      repsTarget: pe.repsTarget,
      weightPct: pe.weightPct,
      rpe: pe.rpe,
      restSeconds: pe.restSeconds,
      notes: pe.notes,
    })
  })

  // Convert to array format
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const weeks: ProgramWeek[] = []

  weeksMap.forEach((days, weekNum) => {
    const programDays: ProgramDay[] = []

    days.forEach((exercises, dayNum) => {
      programDays.push({
        dayOfWeek: dayNum,
        dayName: dayNames[dayNum],
        exercises,
      })
    })

    weeks.push({
      weekNumber: weekNum,
      days: programDays.sort((a, b) => a.dayOfWeek - b.dayOfWeek),
    })
  })

  // Calculate user progress
  const userProgress = await calculateUserProgress(userId, programId)

  return {
    id: program.id,
    name: program.name,
    description: program.description || '',
    category: program.category,
    difficulty: program.difficulty,
    daysPerWeek: program.daysPerWeek,
    weeksTotal: program.weeksTotal,
    progressionType: program.progressionType,
    trainingMaxPct: program.trainingMaxPct,
    deloadWeek: program.deloadWeek,
    isActive: program.isActive,
    isPublic: program.isPublic,
    tags: program.tags,
    exerciseCount: program.exercises.length,
    weeks: weeks.sort((a, b) => a.weekNumber - b.weekNumber),
    userProgress,
  }
}

async function calculateUserProgress(userId: string, programId: string) {
  // Find sessions matching program exercises
  const program = await prisma.workoutProgram.findUnique({
    where: { id: programId },
    include: { exercises: true },
  })

  if (!program) return undefined

  const totalWorkouts = program.daysPerWeek * (program.weeksTotal || 1)

  // Count completed workouts
  const completedWorkouts = await prisma.workoutSession.count({
    where: {
      userId,
      completed: true,
      // TODO: Add program tracking field to sessions
    },
  })

  return {
    currentWeek: Math.floor(completedWorkouts / program.daysPerWeek) + 1,
    completedWorkouts,
    totalWorkouts,
  }
}

/**
 * Search/filter programs
 */
export async function searchPrograms(
  userId: string,
  filters: {
    search?: string
    category?: string
    difficulty?: string
    daysPerWeek?: number
  }
): Promise<ProgramSummary[]> {
  const where: any = {
    OR: [
      { userId },
      { isPublic: true },
    ],
  }

  if (filters.search) {
    where.AND = where.AND || []
    where.AND.push({
      OR: [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { tags: { has: filters.search.toLowerCase() } },
      ],
    })
  }

  if (filters.category) {
    where.category = filters.category
  }

  if (filters.difficulty) {
    where.difficulty = filters.difficulty
  }

  if (filters.daysPerWeek) {
    where.daysPerWeek = filters.daysPerWeek
  }

  const programs = await prisma.workoutProgram.findMany({
    where,
    include: {
      _count: {
        select: { exercises: true },
      },
    },
    orderBy: [
      { isActive: 'desc' },
      { createdAt: 'desc' },
    ],
  })

  return programs.map((program) => ({
    id: program.id,
    name: program.name,
    description: program.description || '',
    category: program.category,
    difficulty: program.difficulty,
    daysPerWeek: program.daysPerWeek,
    weeksTotal: program.weeksTotal,
    isActive: program.isActive,
    isPublic: program.isPublic,
    tags: program.tags,
    exerciseCount: program._count.exercises,
  }))
}
