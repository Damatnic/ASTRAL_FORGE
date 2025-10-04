import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function addBodyweightProgram() {
  console.log('🏋️ Adding Bodyweight Training Program...')

  // Get demo user
  const user = await prisma.user.findUnique({
    where: { email: 'demo@astralforge.app' },
  })

  if (!user) {
    console.error('❌ Demo user not found!')
    return
  }

  // Add bodyweight exercises if they don't exist
  const exercises = [
    {
      id: 'pushups',
      name: 'Push-ups',
      category: 'compound',
      muscleGroup: 'push',
      equipment: 'bodyweight',
      description: 'Classic bodyweight pushing movement for chest, shoulders, and triceps.',
    },
    {
      id: 'bodyweight-squats',
      name: 'Bodyweight Squats',
      category: 'compound',
      muscleGroup: 'legs',
      equipment: 'bodyweight',
      description: 'Fundamental lower body movement pattern.',
    },
    {
      id: 'lunges',
      name: 'Lunges',
      category: 'compound',
      muscleGroup: 'legs',
      equipment: 'bodyweight',
      description: 'Unilateral leg exercise for balance and strength.',
    },
    {
      id: 'mountain-climbers',
      name: 'Mountain Climbers',
      category: 'compound',
      muscleGroup: 'core',
      equipment: 'bodyweight',
      description: 'Dynamic core and cardio exercise.',
    },
  ]

  for (const exercise of exercises) {
    await prisma.exercise.upsert({
      where: { id: exercise.id },
      update: {},
      create: exercise,
    })
    console.log(`✅ Added exercise: ${exercise.name}`)
  }

  // Create a workout session for today with this program
  const session = await prisma.workoutSession.create({
    data: {
      userId: user.id,
      name: 'Bodyweight Training',
      date: new Date(),
      completed: false,
      plan: {
        exercises: [
          {
            id: 'pushups',
            name: 'Push-ups',
            sets: 3,
            reps: 12,
            targetReps: '12-15',
            targetRPE: 7.5,
          },
          {
            id: 'bodyweight-squats',
            name: 'Bodyweight Squats',
            sets: 3,
            reps: 15,
            targetReps: '15-20',
            targetRPE: 7.5,
          },
          {
            id: 'lunges',
            name: 'Lunges',
            sets: 3,
            reps: 10,
            targetReps: '10 per leg',
            targetRPE: 7.5,
          },
          {
            id: 'mountain-climbers',
            name: 'Mountain Climbers',
            sets: 4,
            reps: 30,
            targetReps: '30 seconds',
            targetRPE: 8,
          },
        ],
      },
    },
  })

  console.log('✅ Created Bodyweight Training workout!')
  console.log(`   Session ID: ${session.id}`)
  console.log('🎉 Done! Your bodyweight program is ready.')
}

addBodyweightProgram()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

