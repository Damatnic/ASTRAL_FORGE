import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌟 Seeding Astral Power database...')

  // Create demo user
  const passwordHash = await bcrypt.hash('demo123', 10)
  const user = await prisma.user.upsert({
    where: { email: 'demo@astralforge.app' },
    update: {},
    create: {
      email: 'demo@astralforge.app',
      passwordHash,
      name: 'Demo User',
      profile: {
        create: {
          level: 'intermediate',
          goals: {
            primary: 'hypertrophy',
            secondary: 'strength',
          },
          preferences: {
            units: 'kg',
            notifications: true,
            theme: 'dark',
          },
        },
      },
      streaks: {
        create: {
          current: 5,
          longest: 12,
          lastWorkout: new Date(),
        },
      },
    },
  })

  console.log('✅ Created demo user:', user.email)

  // Create exercise library
  const exercises = [
    // COMPOUND LIFTS
    {
      name: 'Barbell Squat',
      category: 'compound',
      muscleGroup: 'legs',
      equipment: 'barbell',
      description: 'King of leg exercises. Full depth, controlled tempo.',
    },
    {
      name: 'Deadlift',
      category: 'compound',
      muscleGroup: 'pull',
      equipment: 'barbell',
      description: 'Full body power movement. Focus on hip hinge pattern.',
    },
    {
      name: 'Bench Press',
      category: 'compound',
      muscleGroup: 'push',
      equipment: 'barbell',
      description: 'Primary horizontal pressing movement.',
    },
    {
      name: 'Overhead Press',
      category: 'compound',
      muscleGroup: 'push',
      equipment: 'barbell',
      description: 'Vertical pressing for shoulders.',
    },
    {
      name: 'Bent-Over Row',
      category: 'compound',
      muscleGroup: 'pull',
      equipment: 'barbell',
      description: 'Horizontal pulling for back thickness.',
    },
    {
      name: 'Pull-Up',
      category: 'compound',
      muscleGroup: 'pull',
      equipment: 'bodyweight',
      description: 'Vertical pulling for back width.',
    },
    // ISOLATION EXERCISES
    {
      name: 'Dumbbell Curl',
      category: 'isolation',
      muscleGroup: 'pull',
      equipment: 'dumbbell',
      description: 'Bicep isolation with full ROM.',
    },
    {
      name: 'Tricep Pushdown',
      category: 'isolation',
      muscleGroup: 'push',
      equipment: 'cable',
      description: 'Tricep isolation for arm development.',
    },
    {
      name: 'Lateral Raise',
      category: 'isolation',
      muscleGroup: 'push',
      equipment: 'dumbbell',
      description: 'Medial deltoid isolation.',
    },
    {
      name: 'Leg Curl',
      category: 'isolation',
      muscleGroup: 'legs',
      equipment: 'machine',
      description: 'Hamstring isolation.',
    },
    {
      name: 'Leg Extension',
      category: 'isolation',
      muscleGroup: 'legs',
      equipment: 'machine',
      description: 'Quadricep isolation.',
    },
    {
      name: 'Face Pull',
      category: 'isolation',
      muscleGroup: 'pull',
      equipment: 'cable',
      description: 'Rear deltoid and upper back health.',
    },
  ]

  for (const exercise of exercises) {
    const created = await prisma.exercise.upsert({
      where: { id: exercise.name.toLowerCase().replace(/\s+/g, '-') },
      update: {},
      create: {
        id: exercise.name.toLowerCase().replace(/\s+/g, '-'),
        ...exercise,
        progressionRules: {
          create: [
            {
              userLevel: 'beginner',
              algorithm: 'linear',
              parameters: {
                weightIncrement: exercise.category === 'compound' ? 5 : 2.5,
                deloadPercentage: 10,
                failureThreshold: 2,
              },
            },
            {
              userLevel: 'intermediate',
              algorithm: 'undulating',
              parameters: {
                weightIncrement: exercise.category === 'compound' ? 2.5 : 1.25,
                deloadPercentage: 10,
                pattern: 'DUP',
              },
            },
            {
              userLevel: 'advanced',
              algorithm: 'autoregulated',
              parameters: {
                rpeThreshold: 7,
                velocityLossThreshold: exercise.category === 'compound' ? 15 : 25,
                deloadPercentage: 15,
              },
            },
          ],
        },
      },
    })
    console.log(`✅ Created exercise: ${created.name}`)
  }

  // Create sample workout history for demo user
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)

  const session = await prisma.workoutSession.create({
    data: {
      userId: user.id,
      date: yesterday,
      name: 'Push Day',
      completed: true,
      duration: 75,
      sets: {
        create: [
          {
            exerciseId: 'bench-press',
            setNumber: 1,
            weight: 80,
            reps: 8,
            rpe: 7.5,
            rir: 2,
          },
          {
            exerciseId: 'bench-press',
            setNumber: 2,
            weight: 80,
            reps: 8,
            rpe: 8,
            rir: 2,
          },
          {
            exerciseId: 'bench-press',
            setNumber: 3,
            weight: 80,
            reps: 7,
            rpe: 8.5,
            rir: 1,
          },
          {
            exerciseId: 'overhead-press',
            setNumber: 1,
            weight: 50,
            reps: 10,
            rpe: 7,
            rir: 3,
          },
          {
            exerciseId: 'overhead-press',
            setNumber: 2,
            weight: 50,
            reps: 10,
            rpe: 7.5,
            rir: 2,
          },
        ],
      },
    },
  })

  console.log('✅ Created sample workout session')

  // Create initial fatigue metric
  await prisma.fatigueMetric.create({
    data: {
      userId: user.id,
      acuteLoad: 350,
      chronicLoad: 320,
      acuteChronic: 1.09,
      sleepQuality: 7,
      stress: 4,
      soreness: {
        chest: 3,
        shoulders: 2,
        triceps: 4,
      },
    },
  })

  console.log('✅ Created fatigue metrics')

  // Create achievements
  await prisma.achievement.createMany({
    data: [
      {
        userId: user.id,
        type: 'streak',
        title: '5 Day Streak',
        description: 'Completed 5 workouts in a row',
        metadata: { streak: 5 },
      },
      {
        userId: user.id,
        type: 'pr',
        title: 'Bench Press PR',
        description: 'New personal record on Bench Press',
        metadata: { exercise: 'Bench Press', weight: 80, reps: 8 },
      },
    ],
  })

  console.log('✅ Created achievements')

  // Create workout programs
  const stronglifts = await prisma.workoutProgram.create({
    data: {
      userId: user.id,
      name: 'StrongLifts 5×5',
      description: 'Classic beginner strength program. Two alternating workouts, 3 days per week. Linear progression.',
      category: 'powerlifting',
      difficulty: 'beginner',
      daysPerWeek: 3,
      weeksTotal: 12,
      progressionType: 'linear',
      trainingMaxPct: 1.0, // Start with actual 5RM
      deloadWeek: 4,
      isActive: true,
      isPublic: false,
      tags: ['strength', 'beginner', 'full-body'],
      exercises: {
        create: [
          // WORKOUT A (Day 1, 3, 5...)
          {
            exerciseId: 'barbell-squat',
            dayOfWeek: 1, // Monday
            orderIndex: 1,
            sets: 5,
            repsTarget: 5,
            weightPct: 1.0,
            restSeconds: 180,
            notes: 'Add 5kg when complete all 5×5',
          },
          {
            exerciseId: 'bench-press',
            dayOfWeek: 1,
            orderIndex: 2,
            sets: 5,
            repsTarget: 5,
            weightPct: 1.0,
            restSeconds: 180,
            notes: 'Add 2.5kg when complete all 5×5',
          },
          {
            exerciseId: 'bent-over-row',
            dayOfWeek: 1,
            orderIndex: 3,
            sets: 5,
            repsTarget: 5,
            weightPct: 1.0,
            restSeconds: 180,
            notes: 'Add 2.5kg when complete all 5×5',
          },
          // WORKOUT B (Day 2, 4, 6...)
          {
            exerciseId: 'barbell-squat',
            dayOfWeek: 3, // Wednesday
            orderIndex: 1,
            sets: 5,
            repsTarget: 5,
            weightPct: 1.0,
            restSeconds: 180,
            notes: 'Add 5kg when complete all 5×5',
          },
          {
            exerciseId: 'overhead-press',
            dayOfWeek: 3,
            orderIndex: 2,
            sets: 5,
            repsTarget: 5,
            weightPct: 1.0,
            restSeconds: 180,
            notes: 'Add 2.5kg when complete all 5×5',
          },
          {
            exerciseId: 'deadlift',
            dayOfWeek: 3,
            orderIndex: 3,
            sets: 1,
            repsTarget: 5,
            weightPct: 1.0,
            restSeconds: 300,
            notes: 'Only 1 set. Add 5kg each workout.',
          },
          // WORKOUT A (Friday)
          {
            exerciseId: 'barbell-squat',
            dayOfWeek: 5, // Friday
            orderIndex: 1,
            sets: 5,
            repsTarget: 5,
            weightPct: 1.0,
            restSeconds: 180,
            notes: 'Add 5kg when complete all 5×5',
          },
          {
            exerciseId: 'bench-press',
            dayOfWeek: 5,
            orderIndex: 2,
            sets: 5,
            repsTarget: 5,
            weightPct: 1.0,
            restSeconds: 180,
            notes: 'Add 2.5kg when complete all 5×5',
          },
          {
            exerciseId: 'bent-over-row',
            dayOfWeek: 5,
            orderIndex: 3,
            sets: 5,
            repsTarget: 5,
            weightPct: 1.0,
            restSeconds: 180,
            notes: 'Add 2.5kg when complete all 5×5',
          },
        ],
      },
    },
  })

  console.log('✅ Created StrongLifts 5×5 program')

  // Create PPL (Push/Pull/Legs) program
  const ppl = await prisma.workoutProgram.create({
    data: {
      userId: user.id,
      name: 'PPL (Push/Pull/Legs)',
      description: 'Popular 6-day bodybuilding split. Focus on muscle growth with moderate to high volume.',
      category: 'bodybuilding',
      difficulty: 'intermediate',
      daysPerWeek: 6,
      weeksTotal: null, // Ongoing program
      progressionType: 'daily_undulating',
      trainingMaxPct: 0.85,
      deloadWeek: 6,
      isActive: false,
      isPublic: false,
      tags: ['hypertrophy', 'bodybuilding', 'high-volume'],
      exercises: {
        create: [
          // PUSH DAY (Mon, Thu)
          {
            exerciseId: 'bench-press',
            dayOfWeek: 1,
            orderIndex: 1,
            sets: 4,
            repsMin: 6,
            repsMax: 8,
            weightPct: 0.85,
            rpe: 8.0,
            restSeconds: 120,
          },
          {
            exerciseId: 'overhead-press',
            dayOfWeek: 1,
            orderIndex: 2,
            sets: 3,
            repsMin: 8,
            repsMax: 10,
            weightPct: 0.75,
            rpe: 7.5,
            restSeconds: 90,
          },
          {
            exerciseId: 'lateral-raise',
            dayOfWeek: 1,
            orderIndex: 3,
            sets: 3,
            repsMin: 12,
            repsMax: 15,
            rpe: 7.0,
            restSeconds: 60,
            notes: 'Focus on form, not weight',
          },
          {
            exerciseId: 'tricep-pushdown',
            dayOfWeek: 1,
            orderIndex: 4,
            sets: 3,
            repsMin: 12,
            repsMax: 15,
            rpe: 7.5,
            restSeconds: 60,
          },
          // PULL DAY (Tue, Fri)
          {
            exerciseId: 'deadlift',
            dayOfWeek: 2,
            orderIndex: 1,
            sets: 3,
            repsMin: 5,
            repsMax: 8,
            weightPct: 0.80,
            rpe: 8.0,
            restSeconds: 180,
          },
          {
            exerciseId: 'pull-up',
            dayOfWeek: 2,
            orderIndex: 2,
            sets: 4,
            repsMin: 8,
            repsMax: 12,
            rpe: 7.5,
            restSeconds: 90,
            notes: 'Add weight if bodyweight too easy',
          },
          {
            exerciseId: 'bent-over-row',
            dayOfWeek: 2,
            orderIndex: 3,
            sets: 3,
            repsMin: 8,
            repsMax: 10,
            weightPct: 0.75,
            rpe: 7.5,
            restSeconds: 90,
          },
          {
            exerciseId: 'face-pull',
            dayOfWeek: 2,
            orderIndex: 4,
            sets: 3,
            repsMin: 15,
            repsMax: 20,
            rpe: 7.0,
            restSeconds: 60,
            notes: 'High reps for shoulder health',
          },
          {
            exerciseId: 'dumbbell-curl',
            dayOfWeek: 2,
            orderIndex: 5,
            sets: 3,
            repsMin: 10,
            repsMax: 12,
            rpe: 7.5,
            restSeconds: 60,
          },
          // LEG DAY (Wed, Sat)
          {
            exerciseId: 'barbell-squat',
            dayOfWeek: 3,
            orderIndex: 1,
            sets: 4,
            repsMin: 6,
            repsMax: 10,
            weightPct: 0.80,
            rpe: 8.0,
            restSeconds: 150,
          },
          {
            exerciseId: 'leg-curl',
            dayOfWeek: 3,
            orderIndex: 2,
            sets: 3,
            repsMin: 10,
            repsMax: 12,
            rpe: 7.5,
            restSeconds: 90,
          },
          {
            exerciseId: 'leg-extension',
            dayOfWeek: 3,
            orderIndex: 3,
            sets: 3,
            repsMin: 12,
            repsMax: 15,
            rpe: 7.5,
            restSeconds: 60,
          },
        ],
      },
    },
  })

  console.log('✅ Created PPL program')

  console.log('🎉 Seeding complete!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

