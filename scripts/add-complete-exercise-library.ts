/**
 * Comprehensive Exercise Library with Full Details
 * Run with: npx ts-node scripts/add-complete-exercise-library.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface ExerciseData {
  name: string
  category: 'compound' | 'isolation' | 'cardio'
  muscleGroup: string
  equipment: string
  description: string
  videoUrl: string
}

const comprehensiveExercises: ExerciseData[] = [
  // ============================================================================
  // CHEST EXERCISES
  // ============================================================================
  {
    name: 'Barbell Bench Press',
    category: 'compound',
    muscleGroup: 'push',
    equipment: 'barbell',
    description: 'Primary horizontal pressing movement. Targets chest, anterior deltoids, and triceps. Position eyes under bar, lower to chest, press explosively.',
    videoUrl: 'https://www.youtube.com/watch?v=rT7DgCr-3pg',
  },
  {
    name: 'Incline Barbell Bench Press',
    category: 'compound',
    muscleGroup: 'push',
    equipment: 'barbell',
    description: 'Upper chest emphasis. Set bench to 30-45 degrees. Same form as flat bench but targets upper pectorals more effectively.',
    videoUrl: 'https://www.youtube.com/watch?v=IP4oeWs  GYs',
  },
  {
    name: 'Decline Barbell Bench Press',
    category: 'compound',
    muscleGroup: 'push',
    equipment: 'barbell',
    description: 'Lower chest emphasis. Decline angle shifts focus to lower pectorals. Secure feet and maintain control throughout.',
    videoUrl: 'https://www.youtube.com/watch?v=LfyQBUKR8SE',
  },
  {
    name: 'Dumbbell Bench Press',
    category: 'compound',
    muscleGroup: 'push',
    equipment: 'dumbbell',
    description: 'Greater range of motion than barbell. Allows for independent arm movement and addresses strength imbalances. More chest activation.',
    videoUrl: 'https://www.youtube.com/watch?v=VmB1G1K7v94',
  },
  {
    name: 'Dumbbell Incline Press',
    category: 'compound',
    muscleGroup: 'push',
    equipment: 'dumbbell',
    description: 'Upper chest and shoulder development. 30-45 degree angle optimal. Greater stretch and contraction than barbell version.',
    videoUrl: 'https://www.youtube.com/watch?v=8iPEnn-ltC8',
  },
  {
    name: 'Dumbbell Flyes',
    category: 'isolation',
    muscleGroup: 'push',
    equipment: 'dumbbell',
    description: 'Chest isolation with maximum stretch. Arc motion, slight elbow bend, focus on pec stretch at bottom. Control the weight.',
    videoUrl: 'https://www.youtube.com/watch?v=eozdVDA78K0',
  },
  {
    name: 'Cable Crossover',
    category: 'isolation',
    muscleGroup: 'push',
    equipment: 'cable',
    description: 'Constant tension throughout movement. Adjustable angle for upper/mid/lower chest. Squeeze and contract at the center.',
    videoUrl: 'https://www.youtube.com/watch?v=taI4XduLpTk',
  },
  {
    name: 'Push-Ups',
    category: 'compound',
    muscleGroup: 'push',
    equipment: 'bodyweight',
    description: 'Classic chest builder. Body forms straight line, lower chest to ground, press back up. Versatile and effective anywhere.',
    videoUrl: 'https://www.youtube.com/watch?v=IODxDxX7oi4',
  },
  {
    name: 'Dips (Chest Focus)',
    category: 'compound',
    muscleGroup: 'push',
    equipment: 'bodyweight',
    description: 'Lower chest and triceps. Lean forward for chest emphasis. Full range of motion, control the descent.',
    videoUrl: 'https://www.youtube.com/watch?v=2z8JmcrW-As',
  },

  // ============================================================================
  // BACK EXERCISES
  // ============================================================================
  {
    name: 'Barbell Deadlift',
    category: 'compound',
    muscleGroup: 'pull',
    equipment: 'barbell',
    description: 'King of posterior chain. Hip hinge pattern, neutral spine, drive through heels. Builds total body strength and mass.',
    videoUrl: 'https://www.youtube.com/watch?v=op9kVnSso6Q',
  },
  {
    name: 'Sumo Deadlift',
    category: 'compound',
    muscleGroup: 'pull',
    equipment: 'barbell',
    description: 'Wide stance variation. More quad and glute involvement, less lower back stress. Hands inside knees, vertical torso.',
    videoUrl: 'https://www.youtube.com/watch?v=LGIS9vs65Sk',
  },
  {
    name: 'Romanian Deadlift',
    category: 'compound',
    muscleGroup: 'pull',
    equipment: 'barbell',
    description: 'Hamstring and glute focus. Slight knee bend, hinge at hips, feel hamstring stretch. Excellent for posterior chain development.',
    videoUrl: 'https://www.youtube.com/watch?v=XowKMitOVNc',
  },
  {
    name: 'Bent-Over Barbell Row',
    category: 'compound',
    muscleGroup: 'pull',
    equipment: 'barbell',
    description: 'Back thickness builder. Hinge forward, pull to lower chest/upper abs. Keep core tight, avoid momentum.',
    videoUrl: 'https://www.youtube.com/watch?v=FWJR5Ve8bnQ',
  },
  {
    name: 'T-Bar Row',
    category: 'compound',
    muscleGroup: 'pull',
    equipment: 'barbell',
    description: 'Mid-back mass builder. Supported torso reduces lower back stress. Pull handles to chest, squeeze shoulder blades.',
    videoUrl: 'https://www.youtube.com/watch?v=j3Igk5nyZE4',
  },
  {
    name: 'Pendlay Row',
    category: 'compound',
    muscleGroup: 'pull',
    equipment: 'barbell',
    description: 'Explosive row variation. Bar touches floor each rep. Develops upper back power and strength.',
    videoUrl: 'https://www.youtube.com/watch?v=h4nkoayPECM',
  },
  {
    name: 'Dumbbell Row (Single-Arm)',
    category: 'compound',
    muscleGroup: 'pull',
    equipment: 'dumbbell',
    description: 'Unilateral back development. Support on bench, pull dumbbell to hip. Greater range of motion than barbell.',
    videoUrl: 'https://www.youtube.com/watch?v=roCP6wCXPqo',
  },
  {
    name: 'Seated Cable Row',
    category: 'compound',
    muscleGroup: 'pull',
    equipment: 'cable',
    description: 'Constant tension rowing. Chest up, pull to sternum, squeeze shoulder blades. Various handle options.',
    videoUrl: 'https://www.youtube.com/watch?v=GZbfZ033f74',
  },
  {
    name: 'Pull-Ups',
    category: 'compound',
    muscleGroup: 'pull',
    equipment: 'bodyweight',
    description: 'Upper back width developer. Palms away, pull chest to bar, control descent. Best lat builder.',
    videoUrl: 'https://www.youtube.com/watch?v=eGo4IYlbE5g',
  },
  {
    name: 'Chin-Ups',
    category: 'compound',
    muscleGroup: 'pull',
    equipment: 'bodyweight',
    description: 'Bicep-emphasized pulling. Palms toward face, narrower grip than pull-ups. Great for arm development.',
    videoUrl: 'https://www.youtube.com/watch?v=brhYBBFqOhU',
  },
  {
    name: 'Lat Pulldown',
    category: 'compound',
    muscleGroup: 'pull',
    equipment: 'cable',
    description: 'Vertical pulling alternative. Wide grip, pull to upper chest, lean back slightly. Builds lat width.',
    videoUrl: 'https://www.youtube.com/watch?v=CAwf7n6Luuc',
  },
  {
    name: 'Face Pulls',
    category: 'isolation',
    muscleGroup: 'pull',
    equipment: 'cable',
    description: 'Rear delt and upper back. Pull rope to face, externally rotate shoulders. Essential for shoulder health.',
    videoUrl: 'https://www.youtube.com/watch?v=rep-qVOkqgk',
  },
  {
    name: 'Straight-Arm Pulldown',
    category: 'isolation',
    muscleGroup: 'pull',
    equipment: 'cable',
    description: 'Lat isolation. Arms stay straight, pull bar to thighs using lats. Feel the stretch at top.',
    videoUrl: 'https://www.youtube.com/watch?v=wmw5gnJOTEU',
  },

  // ============================================================================
  // SHOULDER EXERCISES
  // ============================================================================
  {
    name: 'Barbell Overhead Press',
    category: 'compound',
    muscleGroup: 'push',
    equipment: 'barbell',
    description: 'Primary vertical press. Strict form, bar travels in straight line. Builds shoulder size and strength.',
    videoUrl: 'https://www.youtube.com/watch?v=QAQ64hK4Xxs',
  },
  {
    name: 'Dumbbell Shoulder Press',
    category: 'compound',
    muscleGroup: 'push',
    equipment: 'dumbbell',
    description: 'Independent arm movement. Greater stabilizer activation. Press dumbbells overhead, maintain control.',
    videoUrl: 'https://www.youtube.com/watch?v=qEwKCR5JCog',
  },
  {
    name: 'Arnold Press',
    category: 'compound',
    muscleGroup: 'push',
    equipment: 'dumbbell',
    description: 'Rotation during press. Starts palms in, rotates out as pressing. Targets all three deltoid heads.',
    videoUrl: 'https://www.youtube.com/watch?v=6Z15_WdXmVw',
  },
  {
    name: 'Lateral Raise',
    category: 'isolation',
    muscleGroup: 'push',
    equipment: 'dumbbell',
    description: 'Medial deltoid isolation. Slight forward lean, raise to shoulder height, control descent. Builds shoulder width.',
    videoUrl: 'https://www.youtube.com/watch?v=3VcKaXpzqRo',
  },
  {
    name: 'Front Raise',
    category: 'isolation',
    muscleGroup: 'push',
    equipment: 'dumbbell',
    description: 'Anterior deltoid focus. Raise dumbbells to eye level, control throughout. Often overtrained.',
    videoUrl: 'https://www.youtube.com/watch?v=KHJmLMknfvU',
  },
  {
    name: 'Rear Delt Flyes',
    category: 'isolation',
    muscleGroup: 'pull',
    equipment: 'dumbbell',
    description: 'Posterior deltoid isolation. Bent over, raise dumbbells out to sides. Essential for shoulder balance.',
    videoUrl: 'https://www.youtube.com/watch?v=JlvSKsNhTJ0',
  },
  {
    name: 'Cable Lateral Raise',
    category: 'isolation',
    muscleGroup: 'push',
    equipment: 'cable',
    description: 'Constant tension lateral raise. Cross-body setup, raise to shoulder level. Excellent medial delt pump.',
    videoUrl: 'https://www.youtube.com/watch?v=PPrzBWZDOhA',
  },

  // ============================================================================
  // ARM EXERCISES
  // ============================================================================
  {
    name: 'Barbell Curl',
    category: 'isolation',
    muscleGroup: 'pull',
    equipment: 'barbell',
    description: 'Classic bicep builder. Shoulder-width grip, curl to shoulders, control descent. Avoid swinging.',
    videoUrl: 'https://www.youtube.com/watch?v=kwG2ipFRgfo',
  },
  {
    name: 'Dumbbell Curl',
    category: 'isolation',
    muscleGroup: 'pull',
    equipment: 'dumbbell',
    description: 'Unilateral bicep work. Supinate at top for peak contraction. Addresses strength imbalances.',
    videoUrl: 'https://www.youtube.com/watch?v=-B9JDsPYRwg',
  },
  {
    name: 'Hammer Curl',
    category: 'isolation',
    muscleGroup: 'pull',
    equipment: 'dumbbell',
    description: 'Brachialis and forearm emphasis. Neutral grip throughout, curl to shoulder. Builds arm thickness.',
    videoUrl: 'https://www.youtube.com/watch?v=TwD-YGVP4Bk',
  },
  {
    name: 'Preacher Curl',
    category: 'isolation',
    muscleGroup: 'pull',
    equipment: 'barbell',
    description: 'Strict bicep isolation. Arm supported, eliminates momentum. Excellent for bicep peak.',
    videoUrl: 'https://www.youtube.com/watch?v=fIWP-FRFNU0',
  },
  {
    name: 'Cable Bicep Curl',
    category: 'isolation',
    muscleGroup: 'pull',
    equipment: 'cable',
    description: 'Constant tension curls. Various handle options. Maintains tension at all points of ROM.',
    videoUrl: 'https://www.youtube.com/watch?v=P4hh9jZUFNA',
  },
  {
    name: 'Close-Grip Bench Press',
    category: 'compound',
    muscleGroup: 'push',
    equipment: 'barbell',
    description: 'Tricep mass builder. Hands shoulder-width or closer, tuck elbows, press. Best tricep compound.',
    videoUrl: 'https://www.youtube.com/watch?v=nEF0bv2FW94',
  },
  {
    name: 'Tricep Pushdown',
    category: 'isolation',
    muscleGroup: 'push',
    equipment: 'cable',
    description: 'Tricep isolation. Elbows locked at sides, extend arms fully, squeeze at bottom. Various attachments.',
    videoUrl: 'https://www.youtube.com/watch?v=-xa-6cQaZKY',
  },
  {
    name: 'Overhead Tricep Extension',
    category: 'isolation',
    muscleGroup: 'push',
    equipment: 'dumbbell',
    description: 'Long head tricep emphasis. Dumbbell overhead, lower behind head, extend. Great stretch.',
    videoUrl: 'https://www.youtube.com/watch?v=6SS6K3lAwZ8',
  },
  {
    name: 'Skull Crushers',
    category: 'isolation',
    muscleGroup: 'push',
    equipment: 'barbell',
    description: 'Lying tricep extension. Lower to forehead/behind head, extend fully. Controlled movement crucial.',
    videoUrl: 'https://www.youtube.com/watch?v=d_KZxkY_0cM',
  },
  {
    name: 'Dips (Tricep Focus)',
    category: 'compound',
    muscleGroup: 'push',
    equipment: 'bodyweight',
    description: 'Vertical tricep press. Upright torso, full extension at top. Excellent for tricep size.',
    videoUrl: 'https://www.youtube.com/watch?v=2z8JmcrW-As',
  },

  // ============================================================================
  // LEG EXERCISES
  // ============================================================================
  {
    name: 'Barbell Back Squat',
    category: 'compound',
    muscleGroup: 'legs',
    equipment: 'barbell',
    description: 'King of leg exercises. Bar on upper traps, squat to parallel or below. Unmatched lower body developer.',
    videoUrl: 'https://www.youtube.com/watch?v=ultWZbUMPL8',
  },
  {
    name: 'Front Squat',
    category: 'compound',
    muscleGroup: 'legs',
    equipment: 'barbell',
    description: 'Quad-dominant squat. Bar on front delts, upright torso. Less lower back stress than back squat.',
    videoUrl: 'https://www.youtube.com/watch?v=uYumuL_G_V0',
  },
  {
    name: 'Bulgarian Split Squat',
    category: 'compound',
    muscleGroup: 'legs',
    equipment: 'dumbbell',
    description: 'Unilateral leg builder. Rear foot elevated, lunge down. Excellent for glutes and balance.',
    videoUrl: 'https://www.youtube.com/watch?v=2C-uNgKwPLE',
  },
  {
    name: 'Leg Press',
    category: 'compound',
    muscleGroup: 'legs',
    equipment: 'machine',
    description: 'Machine leg development. Feet shoulder-width, press through heels. No spinal loading.',
    videoUrl: 'https://www.youtube.com/watch?v=IZxyjW7MPJQ',
  },
  {
    name: 'Hack Squat',
    category: 'compound',
    muscleGroup: 'legs',
    equipment: 'machine',
    description: 'Quad-focused machine squat. Shoulders under pads, squat deep. Excellent quad builder.',
    videoUrl: 'https://www.youtube.com/watch?v=0tn5K9NlCfo',
  },
  {
    name: 'Walking Lunges',
    category: 'compound',
    muscleGroup: 'legs',
    equipment: 'dumbbell',
    description: 'Dynamic unilateral work. Step forward, lower knee to ground, push up. Functional leg strength.',
    videoUrl: 'https://www.youtube.com/watch?v=L8fvypPrzzs',
  },
  {
    name: 'Leg Extension',
    category: 'isolation',
    muscleGroup: 'legs',
    equipment: 'machine',
    description: 'Quad isolation. Extend legs fully, squeeze at top, control descent. Pre-exhaust or finisher.',
    videoUrl: 'https://www.youtube.com/watch?v=YyvSfVjQeL0',
  },
  {
    name: 'Leg Curl (Lying)',
    category: 'isolation',
    muscleGroup: 'legs',
    equipment: 'machine',
    description: 'Hamstring isolation. Lie face down, curl heels to glutes. Essential for leg balance.',
    videoUrl: 'https://www.youtube.com/watch?v=1Tq3QdYUuHs',
  },
  {
    name: 'Standing Calf Raise',
    category: 'isolation',
    muscleGroup: 'legs',
    equipment: 'machine',
    description: 'Gastrocnemius focus. Shoulders under pads, raise onto toes, full stretch at bottom.',
    videoUrl: 'https://www.youtube.com/watch?v=wClEOoRdnqw',
  },
  {
    name: 'Seated Calf Raise',
    category: 'isolation',
    muscleGroup: 'legs',
    equipment: 'machine',
    description: 'Soleus focus. Knees bent 90 degrees, raise onto toes. Complements standing raises.',
    videoUrl: 'https://www.youtube.com/watch?v=pZlHbBH4HhA',
  },

  // ============================================================================
  // CORE EXERCISES
  // ============================================================================
  {
    name: 'Plank',
    category: 'isolation',
    muscleGroup: 'core',
    equipment: 'bodyweight',
    description: 'Core stability. Forearms on ground, body straight as board. Hold for time.',
    videoUrl: 'https://www.youtube.com/watch?v=ASdvN_XEl_c',
  },
  {
    name: 'Ab Wheel Rollout',
    category: 'compound',
    muscleGroup: 'core',
    equipment: 'other',
    description: 'Advanced core exercise. Roll out maintaining neutral spine, return. Extremely effective.',
    videoUrl: 'https://www.youtube.com/watch?v=EXm5RT3TRq0',
  },
  {
    name: 'Hanging Leg Raise',
    category: 'compound',
    muscleGroup: 'core',
    equipment: 'bodyweight',
    description: 'Lower ab focus. Hang from bar, raise legs to parallel or higher. Control the swing.',
    videoUrl: 'https://www.youtube.com/watch?v=Pr1ieGZ5atk',
  },
  {
    name: 'Cable Crunch',
    category: 'isolation',
    muscleGroup: 'core',
    equipment: 'cable',
    description: 'Weighted ab work. Kneel below cable, crunch down. Progressive overload for abs.',
    videoUrl: 'https://www.youtube.com/watch?v=sKvIH09mw0s',
  },
]

async function main() {
  console.log('🏋️ Adding comprehensive exercise library...')
  let addedCount = 0
  let updatedCount = 0

  for (const exercise of comprehensiveExercises) {
    const exerciseId = exercise.name.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '')
    
    const existing = await prisma.exercise.findUnique({
      where: { id: exerciseId },
    })

    if (existing) {
      await prisma.exercise.update({
        where: { id: exerciseId },
        data: {
          description: exercise.description,
          videoUrl: exercise.videoUrl,
        },
      })
      updatedCount++
      console.log(`  ✓ Updated: ${exercise.name}`)
    } else {
      await prisma.exercise.create({
        data: {
          id: exerciseId,
          name: exercise.name,
          category: exercise.category,
          muscleGroup: exercise.muscleGroup,
          equipment: exercise.equipment,
          description: exercise.description,
          videoUrl: exercise.videoUrl,
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
                  volumeVariation: 20,
                  intensityRange: [70, 85],
                  deloadWeek: 4,
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
      addedCount++
      console.log(`  ✓ Created: ${exercise.name}`)
    }
  }

  console.log(`\n✅ Exercise library complete!`)
  console.log(`   📝 Added: ${addedCount} new exercises`)
  console.log(`   🔄 Updated: ${updatedCount} existing exercises`)
  console.log(`   📊 Total: ${comprehensiveExercises.length} exercises`)
}

main()
  .catch((e) => {
    console.error('❌ Failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

