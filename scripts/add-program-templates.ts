/**
 * Script to add popular workout program templates to the database
 * Run with: npx ts-node scripts/add-program-templates.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🏋️ Adding workout program templates...')

  // Get or create demo user
  let user = await prisma.user.findUnique({
    where: { email: 'demo@astralforge.app' },
  })

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: 'demo@astralforge.app',
        name: 'Demo User',
        passwordHash: 'demo-password-hash', // Not used in this script
      },
    })
  }

  // Find or create exercises
  const exercises = {
    squat: await findOrCreateExercise('Barbell Back Squat', 'compound', 'legs', 'barbell'),
    bench: await findOrCreateExercise('Barbell Bench Press', 'compound', 'chest', 'barbell'),
    deadlift: await findOrCreateExercise('Barbell Deadlift', 'compound', 'back', 'barbell'),
    overheadPress: await findOrCreateExercise('Barbell Overhead Press', 'compound', 'shoulders', 'barbell'),
    barbellRow: await findOrCreateExercise('Barbell Row', 'compound', 'back', 'barbell'),
    pullup: await findOrCreateExercise('Pull-ups', 'compound', 'back', 'bodyweight'),
    dip: await findOrCreateExercise('Dips', 'compound', 'chest', 'bodyweight'),
  }

  // Template 1: Starting Strength (3x5)
  console.log('Adding Starting Strength template...')
  await createProgram(user.id, {
    name: 'Starting Strength - Workout A',
    notes: 'Classic beginner strength program. Do 3 sets of 5 reps with increasing weight each session.',
    exercises: [
      { exercise: exercises.squat, sets: 3, reps: 5, weight: 60, restSeconds: 180 },
      { exercise: exercises.bench, sets: 3, reps: 5, weight: 40, restSeconds: 180 },
      { exercise: exercises.deadlift, sets: 1, reps: 5, weight: 80, restSeconds: 300 },
    ],
  })

  await createProgram(user.id, {
    name: 'Starting Strength - Workout B',
    notes: 'Alternate with Workout A. Focus on overhead press instead of bench.',
    exercises: [
      { exercise: exercises.squat, sets: 3, reps: 5, weight: 60, restSeconds: 180 },
      { exercise: exercises.overheadPress, sets: 3, reps: 5, weight: 30, restSeconds: 180 },
      { exercise: exercises.deadlift, sets: 1, reps: 5, weight: 80, restSeconds: 300 },
    ],
  })

  // Template 2: StrongLifts 5x5
  console.log('Adding StrongLifts 5x5 template...')
  await createProgram(user.id, {
    name: 'StrongLifts 5x5 - Workout A',
    notes: 'Popular 5x5 program. Do 5 sets of 5 reps, add 2.5kg each session.',
    exercises: [
      { exercise: exercises.squat, sets: 5, reps: 5, weight: 60, restSeconds: 180 },
      { exercise: exercises.bench, sets: 5, reps: 5, weight: 40, restSeconds: 180 },
      { exercise: exercises.barbellRow, sets: 5, reps: 5, weight: 50, restSeconds: 180 },
    ],
  })

  await createProgram(user.id, {
    name: 'StrongLifts 5x5 - Workout B',
    notes: 'Alternate with Workout A. Deadlift only 1x5 due to intensity.',
    exercises: [
      { exercise: exercises.squat, sets: 5, reps: 5, weight: 60, restSeconds: 180 },
      { exercise: exercises.overheadPress, sets: 5, reps: 5, weight: 30, restSeconds: 180 },
      { exercise: exercises.deadlift, sets: 1, reps: 5, weight: 80, restSeconds: 300 },
    ],
  })

  // Template 3: Push/Pull/Legs - Push Day
  console.log('Adding Push/Pull/Legs templates...')
  await createProgram(user.id, {
    name: 'PPL - Push Day',
    notes: 'Push muscles: chest, shoulders, triceps. 3-4 sets, moderate rep ranges.',
    exercises: [
      { exercise: exercises.bench, sets: 4, reps: 8, weight: 40, restSeconds: 120 },
      { exercise: exercises.overheadPress, sets: 4, reps: 8, weight: 30, restSeconds: 120 },
      { exercise: exercises.dip, sets: 3, reps: 10, weight: 0, restSeconds: 90 },
    ],
  })

  // Template 4: PPL - Pull Day
  await createProgram(user.id, {
    name: 'PPL - Pull Day',
    notes: 'Pull muscles: back, biceps. Focus on rowing and pulling movements.',
    exercises: [
      { exercise: exercises.deadlift, sets: 3, reps: 6, weight: 80, restSeconds: 240 },
      { exercise: exercises.barbellRow, sets: 4, reps: 8, weight: 50, restSeconds: 120 },
      { exercise: exercises.pullup, sets: 3, reps: 8, weight: 0, restSeconds: 120 },
    ],
  })

  // Template 5: PPL - Legs Day
  await createProgram(user.id, {
    name: 'PPL - Legs Day',
    notes: 'Leg day: squats and accessory work. High volume for lower body.',
    exercises: [
      { exercise: exercises.squat, sets: 4, reps: 8, weight: 60, restSeconds: 180 },
      { exercise: await findOrCreateExercise('Romanian Deadlift', 'compound', 'legs', 'barbell'), sets: 3, reps: 10, weight: 50, restSeconds: 120 },
      { exercise: await findOrCreateExercise('Leg Press', 'compound', 'legs', 'machine'), sets: 3, reps: 12, weight: 100, restSeconds: 90 },
    ],
  })

  // Template 6: Upper/Lower Split
  console.log('Adding Upper/Lower split templates...')
  await createProgram(user.id, {
    name: 'Upper/Lower - Upper A',
    notes: 'Upper body focus on pressing movements. 4-day split.',
    exercises: [
      { exercise: exercises.bench, sets: 4, reps: 6, weight: 40, restSeconds: 150 },
      { exercise: exercises.barbellRow, sets: 4, reps: 6, weight: 50, restSeconds: 150 },
      { exercise: exercises.overheadPress, sets: 3, reps: 8, weight: 30, restSeconds: 120 },
      { exercise: exercises.pullup, sets: 3, reps: 8, weight: 0, restSeconds: 120 },
    ],
  })

  await createProgram(user.id, {
    name: 'Upper/Lower - Lower A',
    notes: 'Lower body focus on squats. Heavy compound lifts.',
    exercises: [
      { exercise: exercises.squat, sets: 4, reps: 6, weight: 60, restSeconds: 180 },
      { exercise: await findOrCreateExercise('Romanian Deadlift', 'compound', 'legs', 'barbell'), sets: 3, reps: 8, weight: 50, restSeconds: 150 },
      { exercise: await findOrCreateExercise('Leg Curl', 'isolation', 'legs', 'machine'), sets: 3, reps: 12, weight: 30, restSeconds: 90 },
    ],
  })

  // Template 7: Bodyweight Beginner
  console.log('Adding bodyweight templates...')
  await createProgram(user.id, {
    name: 'Bodyweight Basics',
    notes: 'No equipment needed. Perfect for home workouts or beginners.',
    exercises: [
      { exercise: await findOrCreateExercise('Push-ups', 'compound', 'chest', 'bodyweight'), sets: 4, reps: 15, weight: 0, restSeconds: 60 },
      { exercise: await findOrCreateExercise('Bodyweight Squats', 'compound', 'legs', 'bodyweight'), sets: 4, reps: 20, weight: 0, restSeconds: 60 },
      { exercise: await findOrCreateExercise('Lunges', 'compound', 'legs', 'bodyweight'), sets: 3, reps: 10, weight: 0, restSeconds: 60 },
      { exercise: await findOrCreateExercise('Mountain Climbers', 'cardio', 'full-body', 'bodyweight'), sets: 3, reps: 30, weight: 0, restSeconds: 45 },
      { exercise: await findOrCreateExercise('Plank', 'isolation', 'core', 'bodyweight'), sets: 3, reps: 60, weight: 0, restSeconds: 45 },
    ],
  })

  console.log('✅ All program templates added successfully!')
}

async function findOrCreateExercise(
  name: string,
  category: string,
  muscleGroup: string,
  equipment: string
) {
  let exercise = await prisma.exercise.findFirst({
    where: { name },
  })

  if (!exercise) {
    exercise = await prisma.exercise.create({
      data: {
        name,
        category,
        muscleGroup,
        equipment,
        description: `${name} - ${category} exercise for ${muscleGroup}`,
      },
    })
    console.log(`  Created exercise: ${name}`)
  }

  return exercise
}

async function createProgram(
  userId: string,
  data: {
    name: string
    notes: string
    exercises: Array<{
      exercise: { id: string; name: string }
      sets: number
      reps: number
      weight: number
      restSeconds: number
    }>
  }
) {
  const plan = {
    exercises: data.exercises.map((e) => ({
      id: e.exercise.id,
      name: e.exercise.name,
      sets: Array.from({ length: e.sets }, () => ({
        weight: e.weight,
        reps: e.reps,
      })),
      restSeconds: e.restSeconds,
      targetReps: e.reps,
      targetRPE: 8,
    })),
  }

  await prisma.workoutSession.create({
    data: {
      userId,
      name: data.name,
      notes: data.notes,
      plan: plan,
      completed: false,
    },
  })

  console.log(`  ✓ Created: ${data.name}`)
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

