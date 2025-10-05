import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

/**
 * POST /api/workout/start
 * Start a workout session from a program
 * Query params: programId (optional)
 * 
 * If programId provided: Load today's workout from that program
 * If no programId: Load next workout from active program
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get programId from query params
    const { searchParams } = new URL(request.url)
    const programId = searchParams.get('programId')

    let program

    if (programId) {
      // Load specific program
      program = await prisma.workoutProgram.findUnique({
        where: { id: programId },
        include: {
          exercises: {
            orderBy: [
              { weekNumber: 'asc' },
              { dayOfWeek: 'asc' },
              { orderIndex: 'asc' }
            ]
          }
        }
      })

      if (!program) {
        return NextResponse.json({ error: 'Program not found' }, { status: 404 })
      }
    } else {
      // Load from active program
      program = await prisma.workoutProgram.findFirst({
        where: {
          userId: user.id,
          isActive: true
        },
        include: {
          exercises: {
            orderBy: [
              { weekNumber: 'asc' },
              { dayOfWeek: 'asc' },
              { orderIndex: 'asc' }
            ]
          }
        }
      })

      if (!program) {
        return NextResponse.json({ 
          error: 'No active program found. Please select a program first.' 
        }, { status: 404 })
      }
    }

    // Determine which day we're on based on day of week
    const today = new Date().getDay() // 0 = Sunday, 1 = Monday, etc.
    
    // Get today's exercises from week 1
    let programExercises = program.exercises.filter(ex => 
      (ex.weekNumber === null || ex.weekNumber === 1) && ex.dayOfWeek === today
    )

    // If no exercises for today, get Monday's workout
    if (programExercises.length === 0) {
      programExercises = program.exercises.filter(ex => 
        (ex.weekNumber === null || ex.weekNumber === 1) && ex.dayOfWeek === 1
      )
    }

    // If still no exercises, just get the first day's workout
    if (programExercises.length === 0) {
      const firstDay = program.exercises[0]?.dayOfWeek || 1
      programExercises = program.exercises.filter(ex => 
        (ex.weekNumber === null || ex.weekNumber === 1) && ex.dayOfWeek === firstDay
      )
    }

    // Load the actual exercise details
    const exerciseIds = programExercises.map(pe => pe.exerciseId)
    const exercises = await prisma.exercise.findMany({
      where: { id: { in: exerciseIds } }
    })

    // Create exercise map for quick lookup
    const exerciseMap = new Map(exercises.map(e => [e.id, e]))

    // Format the workout for the session player
    const formattedWorkout = {
      id: program.id,
      name: program.name,
      description: program.description || `${program.daysPerWeek}x per week workout`,
      exercises: programExercises.map(pe => {
        const exercise = exerciseMap.get(pe.exerciseId)
        if (!exercise) return null
        
        return {
          id: exercise.id,
          name: exercise.name,
          sets: pe.sets,
          reps: pe.repsTarget || pe.repsMax || 10,
          repsMin: pe.repsMin,
          repsMax: pe.repsMax,
          weight: 0, // User will input actual weight during workout
          targetRPE: pe.rpe || 7.5,
          restSeconds: pe.restSeconds || 90,
          notes: pe.notes || exercise.description || '',
          muscleGroup: exercise.muscleGroup,
          equipment: exercise.equipment
        }
      }).filter(Boolean) // Remove any nulls
    }

    if (formattedWorkout.exercises.length === 0) {
      return NextResponse.json({ 
        error: 'No exercises found for this workout' 
      }, { status: 404 })
    }

    return NextResponse.json(formattedWorkout)

  } catch (error) {
    console.error('Error starting workout:', error)
    return NextResponse.json(
      { error: 'Failed to start workout' },
      { status: 500 }
    )
  }
}
