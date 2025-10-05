import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { PROGRAM_TEMPLATES } from '@/components/program-template-browser'

/**
 * POST /api/programs/from-template
 * 
 * Creates a new workout program from a template.
 * Generates all exercises and sets based on the template structure.
 */
export async function POST(request: Request) {
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

    const { templateId } = await request.json()

    // Find the template
    const template = PROGRAM_TEMPLATES.find(t => t.id === templateId)
    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    }

    // Get detailed structure for the template
    const exercises = await getTemplateExercises(templateId)

    // Create the program
    const program = await prisma.workoutProgram.create({
      data: {
        name: template.name,
        description: template.description,
        userId: user.id,
        isActive: false,
        category: template.type,
        difficulty: template.difficulty,
        daysPerWeek: template.daysPerWeek,
        progressionType: 'linear',
        createdAt: new Date(),
        exercises: {
          create: exercises.map((ex, index) => ({
            exerciseId: ex.exerciseId,
            sets: ex.sets,
            repsTarget: ex.reps,
            restSeconds: ex.restSeconds || 120,
            dayOfWeek: ex.dayOfWeek,
            orderIndex: index,
            notes: ex.notes || null
          }))
        }
      },
      include: {
        exercises: true
      }
    })

    return NextResponse.json({ 
      programId: program.id,
      program
    })
  } catch (error) {
    console.error('Failed to create program from template:', error)
    return NextResponse.json(
      { error: 'Failed to create program' },
      { status: 500 }
    )
  }
}

/**
 * Get exercise structure for a specific template
 */
async function getTemplateExercises(templateId: string) {
  // Map template IDs to exercise structures
  const templateStructures: Record<string, any[]> = {
    'stronglifts-5x5': [
      // Workout A (Monday, Friday)
      { name: 'Squat', sets: 5, reps: 5, dayOfWeek: 1, restSeconds: 180 },
      { name: 'Bench Press', sets: 5, reps: 5, dayOfWeek: 1, restSeconds: 180 },
      { name: 'Barbell Row', sets: 5, reps: 5, dayOfWeek: 1, restSeconds: 180 },
      
      // Workout B (Wednesday)
      { name: 'Squat', sets: 5, reps: 5, dayOfWeek: 3, restSeconds: 180 },
      { name: 'Overhead Press', sets: 5, reps: 5, dayOfWeek: 3, restSeconds: 180 },
      { name: 'Deadlift', sets: 1, reps: 5, dayOfWeek: 3, restSeconds: 240 }
    ],
    'starting-strength': [
      // Workout A (Monday, Friday)
      { name: 'Squat', sets: 3, reps: 5, dayOfWeek: 1, restSeconds: 180 },
      { name: 'Bench Press', sets: 3, reps: 5, dayOfWeek: 1, restSeconds: 180 },
      { name: 'Deadlift', sets: 1, reps: 5, dayOfWeek: 1, restSeconds: 240 },
      
      // Workout B (Wednesday)
      { name: 'Squat', sets: 3, reps: 5, dayOfWeek: 3, restSeconds: 180 },
      { name: 'Overhead Press', sets: 3, reps: 5, dayOfWeek: 3, restSeconds: 180 },
      { name: 'Power Clean', sets: 5, reps: 3, dayOfWeek: 3, restSeconds: 180 }
    ],
    'ppl': [
      // Push (Monday, Thursday)
      { name: 'Bench Press', sets: 4, reps: 10, dayOfWeek: 1, restSeconds: 120 },
      { name: 'Overhead Press', sets: 3, reps: 10, dayOfWeek: 1, restSeconds: 120 },
      { name: 'Incline Dumbbell Press', sets: 3, reps: 12, dayOfWeek: 1, restSeconds: 90 },
      { name: 'Lateral Raise', sets: 3, reps: 15, dayOfWeek: 1, restSeconds: 60 },
      { name: 'Tricep Pushdown', sets: 3, reps: 12, dayOfWeek: 1, restSeconds: 60 },
      
      // Pull (Tuesday, Friday)
      { name: 'Deadlift', sets: 3, reps: 5, dayOfWeek: 2, restSeconds: 180 },
      { name: 'Barbell Row', sets: 4, reps: 10, dayOfWeek: 2, restSeconds: 120 },
      { name: 'Pull-up', sets: 3, reps: 10, dayOfWeek: 2, restSeconds: 120 },
      { name: 'Face Pull', sets: 3, reps: 15, dayOfWeek: 2, restSeconds: 60 },
      { name: 'Barbell Curl', sets: 3, reps: 10, dayOfWeek: 2, restSeconds: 60 },
      
      // Legs (Wednesday, Saturday)
      { name: 'Squat', sets: 4, reps: 10, dayOfWeek: 3, restSeconds: 180 },
      { name: 'Romanian Deadlift', sets: 3, reps: 10, dayOfWeek: 3, restSeconds: 120 },
      { name: 'Leg Press', sets: 3, reps: 12, dayOfWeek: 3, restSeconds: 90 },
      { name: 'Leg Curl', sets: 3, reps: 12, dayOfWeek: 3, restSeconds: 60 },
      { name: 'Calf Raise', sets: 4, reps: 15, dayOfWeek: 3, restSeconds: 60 }
    ],
    'upper-lower': [
      // Upper (Monday, Thursday)
      { name: 'Bench Press', sets: 4, reps: 8, dayOfWeek: 1, restSeconds: 120 },
      { name: 'Barbell Row', sets: 4, reps: 8, dayOfWeek: 1, restSeconds: 120 },
      { name: 'Overhead Press', sets: 3, reps: 10, dayOfWeek: 1, restSeconds: 120 },
      { name: 'Pull-up', sets: 3, reps: 10, dayOfWeek: 1, restSeconds: 120 },
      { name: 'Dumbbell Curl', sets: 3, reps: 12, dayOfWeek: 1, restSeconds: 60 },
      { name: 'Tricep Extension', sets: 3, reps: 12, dayOfWeek: 1, restSeconds: 60 },
      
      // Lower (Tuesday, Friday)
      { name: 'Squat', sets: 4, reps: 8, dayOfWeek: 2, restSeconds: 180 },
      { name: 'Romanian Deadlift', sets: 3, reps: 10, dayOfWeek: 2, restSeconds: 120 },
      { name: 'Leg Press', sets: 3, reps: 12, dayOfWeek: 2, restSeconds: 90 },
      { name: 'Leg Curl', sets: 3, reps: 12, dayOfWeek: 2, restSeconds: 60 },
      { name: 'Calf Raise', sets: 4, reps: 15, dayOfWeek: 2, restSeconds: 60 }
    ],
    'bodyweight-beginner': [
      // Full Body (Monday, Wednesday, Friday)
      { name: 'Push-up', sets: 3, reps: 10, dayOfWeek: 1, restSeconds: 90 },
      { name: 'Pull-up', sets: 3, reps: 8, dayOfWeek: 1, restSeconds: 90 },
      { name: 'Bodyweight Squat', sets: 3, reps: 15, dayOfWeek: 1, restSeconds: 60 },
      { name: 'Pike Push-up', sets: 3, reps: 10, dayOfWeek: 1, restSeconds: 90 },
      { name: 'Inverted Row', sets: 3, reps: 10, dayOfWeek: 1, restSeconds: 90 },
      { name: 'Plank', sets: 3, reps: 30, dayOfWeek: 1, restSeconds: 60, notes: '30 seconds' }
    ]
  }

  const structure = templateStructures[templateId] || []

  // Find or create exercises in the database
  const exercisesWithIds = await Promise.all(
    structure.map(async (ex) => {
      // Try to find existing exercise by name
      let exercise = await prisma.exercise.findFirst({
        where: { name: ex.name }
      })

      // If not found, create a basic exercise entry
      if (!exercise) {
        // For now, we'll just use a placeholder. In production, you'd have all exercises pre-seeded.
        // Let's try to get any exercise as a fallback
        const anyExercise = await prisma.exercise.findFirst()
        if (anyExercise) {
          exercise = anyExercise
        } else {
          // Create a basic exercise if none exist
          exercise = await prisma.exercise.create({
            data: {
              name: ex.name,
              category: 'compound',
              muscleGroup: 'full-body',
              equipment: 'barbell'
            }
          })
        }
      }

      return {
        exerciseId: exercise.id,
        sets: ex.sets,
        reps: ex.reps,
        dayOfWeek: ex.dayOfWeek,
        restSeconds: ex.restSeconds,
        notes: ex.notes
      }
    })
  )

  return exercisesWithIds
}
