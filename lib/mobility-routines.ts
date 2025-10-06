// Mobility and flexibility routine library

export interface MobilityExercise {
  name: string
  duration: number // seconds
  sets?: number
  description: string
  targetArea: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  videoUrl?: string
}

export interface MobilityRoutine {
  id: string
  name: string
  description: string
  duration: number // minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  targetAreas: string[]
  exercises: MobilityExercise[]
}

export const mobilityRoutines: MobilityRoutine[] = [
  {
    id: 'morning-flow',
    name: 'Morning Mobility Flow',
    description: 'Gentle full-body routine to wake up and prepare for the day',
    duration: 10,
    difficulty: 'beginner',
    targetAreas: ['full-body', 'spine', 'hips'],
    exercises: [
      {
        name: 'Cat-Cow Stretch',
        duration: 60,
        sets: 1,
        description: 'On hands and knees, alternate between arching and rounding your spine',
        targetArea: 'spine',
        difficulty: 'beginner',
      },
      {
        name: 'World\'s Greatest Stretch',
        duration: 45,
        sets: 2,
        description: 'Lunge position with rotation and reach',
        targetArea: 'hips',
        difficulty: 'intermediate',
      },
      {
        name: 'Hip Circles',
        duration: 30,
        sets: 2,
        description: 'Large circular motions with hips, both directions',
        targetArea: 'hips',
        difficulty: 'beginner',
      },
      {
        name: 'Thoracic Rotations',
        duration: 40,
        sets: 2,
        description: 'Seated or quadruped position, rotate upper back',
        targetArea: 'spine',
        difficulty: 'beginner',
      },
      {
        name: 'Shoulder Circles',
        duration: 30,
        sets: 2,
        description: 'Large arm circles forward and backward',
        targetArea: 'shoulders',
        difficulty: 'beginner',
      },
    ],
  },
  {
    id: 'pre-workout',
    name: 'Pre-Workout Dynamic Warm-up',
    description: 'Active movements to prepare joints and muscles for training',
    duration: 8,
    difficulty: 'intermediate',
    targetAreas: ['full-body', 'joints'],
    exercises: [
      {
        name: 'Leg Swings',
        duration: 30,
        sets: 2,
        description: 'Front-to-back and side-to-side leg swings',
        targetArea: 'hips',
        difficulty: 'beginner',
      },
      {
        name: 'Arm Swings',
        duration: 30,
        sets: 1,
        description: 'Horizontal and vertical arm swings',
        targetArea: 'shoulders',
        difficulty: 'beginner',
      },
      {
        name: 'Bodyweight Squats',
        duration: 30,
        sets: 2,
        description: 'Controlled squats to warm up legs',
        targetArea: 'legs',
        difficulty: 'beginner',
      },
      {
        name: 'Push-up to Downward Dog',
        duration: 40,
        sets: 2,
        description: 'Flow between push-up position and downward dog',
        targetArea: 'full-body',
        difficulty: 'intermediate',
      },
      {
        name: 'Spiderman Lunges',
        duration: 40,
        sets: 2,
        description: 'Lunge with elbow to instep',
        targetArea: 'hips',
        difficulty: 'intermediate',
      },
    ],
  },
  {
    id: 'post-workout',
    name: 'Post-Workout Cool-down',
    description: 'Static stretches to improve flexibility and recovery',
    duration: 12,
    difficulty: 'beginner',
    targetAreas: ['full-body', 'flexibility'],
    exercises: [
      {
        name: 'Child\'s Pose',
        duration: 60,
        sets: 1,
        description: 'Kneel and sit back on heels, arms extended forward',
        targetArea: 'back',
        difficulty: 'beginner',
      },
      {
        name: 'Pigeon Pose',
        duration: 60,
        sets: 2,
        description: 'Hip flexor and glute stretch, each side',
        targetArea: 'hips',
        difficulty: 'intermediate',
      },
      {
        name: 'Hamstring Stretch',
        duration: 45,
        sets: 2,
        description: 'Seated or standing, reach for toes',
        targetArea: 'hamstrings',
        difficulty: 'beginner',
      },
      {
        name: 'Quad Stretch',
        duration: 45,
        sets: 2,
        description: 'Standing, pull foot to glute',
        targetArea: 'quads',
        difficulty: 'beginner',
      },
      {
        name: 'Shoulder Stretch',
        duration: 30,
        sets: 2,
        description: 'Cross-body arm stretch',
        targetArea: 'shoulders',
        difficulty: 'beginner',
      },
      {
        name: 'Seated Spinal Twist',
        duration: 45,
        sets: 2,
        description: 'Seated position, rotate torso both ways',
        targetArea: 'spine',
        difficulty: 'beginner',
      },
    ],
  },
  {
    id: 'hip-mobility',
    name: 'Hip Mobility Routine',
    description: 'Focused routine for hip flexibility and strength',
    duration: 15,
    difficulty: 'intermediate',
    targetAreas: ['hips', 'glutes'],
    exercises: [
      {
        name: '90/90 Hip Stretch',
        duration: 90,
        sets: 2,
        description: 'Seated with both legs at 90 degrees',
        targetArea: 'hips',
        difficulty: 'intermediate',
      },
      {
        name: 'Cossack Squats',
        duration: 60,
        sets: 2,
        description: 'Side-to-side deep squat',
        targetArea: 'hips',
        difficulty: 'intermediate',
      },
      {
        name: 'Frog Stretch',
        duration: 90,
        sets: 1,
        description: 'On hands and knees, knees wide, rock back',
        targetArea: 'hips',
        difficulty: 'intermediate',
      },
      {
        name: 'Fire Hydrants',
        duration: 40,
        sets: 2,
        description: 'On hands and knees, lift leg to side',
        targetArea: 'hips',
        difficulty: 'beginner',
      },
      {
        name: 'Deep Squat Hold',
        duration: 60,
        sets: 2,
        description: 'Hold bottom of squat position',
        targetArea: 'hips',
        difficulty: 'intermediate',
      },
    ],
  },
  {
    id: 'shoulder-mobility',
    name: 'Shoulder Mobility & Health',
    description: 'Improve shoulder range of motion and prevent injuries',
    duration: 12,
    difficulty: 'intermediate',
    targetAreas: ['shoulders', 'upper-back'],
    exercises: [
      {
        name: 'Band Pull-Aparts',
        duration: 40,
        sets: 3,
        description: 'Light resistance band, pull apart at chest level',
        targetArea: 'shoulders',
        difficulty: 'beginner',
      },
      {
        name: 'Wall Slides',
        duration: 45,
        sets: 2,
        description: 'Back against wall, slide arms up and down',
        targetArea: 'shoulders',
        difficulty: 'beginner',
      },
      {
        name: 'Thread the Needle',
        duration: 60,
        sets: 2,
        description: 'Quadruped position, rotate arm under body',
        targetArea: 'shoulders',
        difficulty: 'beginner',
      },
      {
        name: 'Dislocates (with band/stick)',
        duration: 45,
        sets: 2,
        description: 'Pass band/stick over head and behind back',
        targetArea: 'shoulders',
        difficulty: 'intermediate',
      },
      {
        name: 'Doorway Pec Stretch',
        duration: 60,
        sets: 2,
        description: 'Arm on doorframe, rotate body away',
        targetArea: 'chest',
        difficulty: 'beginner',
      },
    ],
  },
  {
    id: 'spine-flow',
    name: 'Spinal Flexibility Flow',
    description: 'Comprehensive spine mobility and core activation',
    duration: 10,
    difficulty: 'beginner',
    targetAreas: ['spine', 'core'],
    exercises: [
      {
        name: 'Cat-Cow',
        duration: 60,
        sets: 2,
        description: 'Spine flexion and extension',
        targetArea: 'spine',
        difficulty: 'beginner',
      },
      {
        name: 'Bird Dogs',
        duration: 40,
        sets: 2,
        description: 'Opposite arm and leg extension',
        targetArea: 'core',
        difficulty: 'beginner',
      },
      {
        name: 'Superman Hold',
        duration: 30,
        sets: 2,
        description: 'Lying prone, lift arms and legs',
        targetArea: 'back',
        difficulty: 'beginner',
      },
      {
        name: 'Cobra Stretch',
        duration: 45,
        sets: 2,
        description: 'Prone position, press up with arms',
        targetArea: 'spine',
        difficulty: 'beginner',
      },
      {
        name: 'Child\'s Pose to Cobra',
        duration: 60,
        sets: 2,
        description: 'Flow between two positions',
        targetArea: 'spine',
        difficulty: 'beginner',
      },
    ],
  },
]

export function getMobilityRoutineById(id: string): MobilityRoutine | undefined {
  return mobilityRoutines.find(routine => routine.id === id)
}

export function getMobilityRoutinesByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'): MobilityRoutine[] {
  return mobilityRoutines.filter(routine => routine.difficulty === difficulty)
}

export function getMobilityRoutinesByDuration(maxMinutes: number): MobilityRoutine[] {
  return mobilityRoutines.filter(routine => routine.duration <= maxMinutes)
}

