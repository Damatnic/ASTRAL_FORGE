/**
 * Equipment-Based Workout Templates
 * 
 * Pre-built workout programs categorized by equipment availability.
 * Each template includes exercise alternatives for different equipment setups.
 */

export interface WorkoutTemplateExercise {
  exerciseName: string
  sets: number
  reps: string // e.g., "8-12", "AMRAP", "5"
  restSeconds: number
  notes?: string
  requiredEquipment: string[]
  alternatives?: {
    exerciseName: string
    requiredEquipment: string[]
  }[]
}

export interface WorkoutDay {
  name: string
  focus: string // e.g., "Push", "Pull", "Legs", "Upper", "Lower", "Full Body"
  exercises: WorkoutTemplateExercise[]
  estimatedDuration: number // minutes
}

export interface WorkoutTemplate {
  id: string
  name: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  daysPerWeek: number
  weeklySchedule: WorkoutDay[]
  requiredEquipment: string[] // Minimum equipment needed
  optionalEquipment: string[] // Nice to have
  goals: string[] // e.g., "strength", "hypertrophy", "endurance"
  duration: string // e.g., "6-8 weeks", "12 weeks"
  category: 'home-gym' | 'commercial-gym' | 'minimal' | 'bodyweight' | 'barbell-only' | 'dumbbell-only'
}

/**
 * HOME GYM TEMPLATES
 */

export const homeGymPPLTemplate: WorkoutTemplate = {
  id: 'home-gym-ppl',
  name: 'Home Gym Push/Pull/Legs',
  description: 'Classic PPL split for home gym with barbell, dumbbells, and bench. Perfect for building strength and muscle with minimal equipment.',
  difficulty: 'intermediate',
  daysPerWeek: 6,
  requiredEquipment: [
    'Olympic Barbell (20kg)',
    'Dumbbell (Pair)',
    'Flat Bench',
    'Power Rack',
  ],
  optionalEquipment: [
    'Pull-up Bar',
    'Adjustable Bench',
  ],
  goals: ['strength', 'hypertrophy'],
  duration: '8-12 weeks',
  category: 'home-gym',
  weeklySchedule: [
    {
      name: 'Push Day A',
      focus: 'Push',
      estimatedDuration: 60,
      exercises: [
        {
          exerciseName: 'Bench Press',
          sets: 4,
          reps: '6-8',
          restSeconds: 180,
          requiredEquipment: ['barbell', 'bench'],
          alternatives: [
            { exerciseName: 'Dumbbell Bench Press', requiredEquipment: ['dumbbell', 'bench'] },
            { exerciseName: 'Push-Up', requiredEquipment: ['bodyweight'] },
          ],
        },
        {
          exerciseName: 'Overhead Press',
          sets: 4,
          reps: '6-8',
          restSeconds: 180,
          requiredEquipment: ['barbell'],
          alternatives: [
            { exerciseName: 'Dumbbell Shoulder Press', requiredEquipment: ['dumbbell'] },
          ],
        },
        {
          exerciseName: 'Incline Dumbbell Press',
          sets: 3,
          reps: '8-12',
          restSeconds: 120,
          requiredEquipment: ['dumbbell', 'bench'],
          alternatives: [
            { exerciseName: 'Pike Push-Up', requiredEquipment: ['bodyweight'] },
          ],
        },
        {
          exerciseName: 'Lateral Raise',
          sets: 3,
          reps: '12-15',
          restSeconds: 60,
          requiredEquipment: ['dumbbell'],
        },
        {
          exerciseName: 'Overhead Tricep Extension',
          sets: 3,
          reps: '10-12',
          restSeconds: 60,
          requiredEquipment: ['dumbbell'],
          alternatives: [
            { exerciseName: 'Diamond Push-Up', requiredEquipment: ['bodyweight'] },
          ],
        },
      ],
    },
    {
      name: 'Pull Day A',
      focus: 'Pull',
      estimatedDuration: 60,
      exercises: [
        {
          exerciseName: 'Deadlift',
          sets: 4,
          reps: '5-6',
          restSeconds: 240,
          requiredEquipment: ['barbell'],
        },
        {
          exerciseName: 'Pull-Up',
          sets: 4,
          reps: '6-10',
          restSeconds: 180,
          requiredEquipment: ['bodyweight'],
          alternatives: [
            { exerciseName: 'Inverted Row', requiredEquipment: ['bodyweight'] },
          ],
        },
        {
          exerciseName: 'Bent-Over Row',
          sets: 4,
          reps: '8-10',
          restSeconds: 120,
          requiredEquipment: ['barbell'],
          alternatives: [
            { exerciseName: 'Dumbbell Row', requiredEquipment: ['dumbbell'] },
          ],
        },
        {
          exerciseName: 'Face Pull',
          sets: 3,
          reps: '12-15',
          restSeconds: 60,
          requiredEquipment: ['cable'],
          alternatives: [
            { exerciseName: 'Reverse Fly', requiredEquipment: ['dumbbell'] },
          ],
        },
        {
          exerciseName: 'Dumbbell Curl',
          sets: 3,
          reps: '10-12',
          restSeconds: 60,
          requiredEquipment: ['dumbbell'],
          alternatives: [
            { exerciseName: 'Barbell Curl', requiredEquipment: ['barbell'] },
          ],
        },
      ],
    },
    {
      name: 'Leg Day A',
      focus: 'Legs',
      estimatedDuration: 60,
      exercises: [
        {
          exerciseName: 'Barbell Squat',
          sets: 4,
          reps: '6-8',
          restSeconds: 180,
          requiredEquipment: ['barbell', 'rack'],
          alternatives: [
            { exerciseName: 'Goblet Squat', requiredEquipment: ['dumbbell'] },
          ],
        },
        {
          exerciseName: 'Romanian Deadlift',
          sets: 4,
          reps: '8-10',
          restSeconds: 120,
          requiredEquipment: ['barbell'],
          alternatives: [
            { exerciseName: 'Single-Leg RDL', requiredEquipment: ['dumbbell'] },
          ],
        },
        {
          exerciseName: 'Bulgarian Split Squat',
          sets: 3,
          reps: '10-12',
          restSeconds: 90,
          requiredEquipment: ['dumbbell', 'bench'],
          alternatives: [
            { exerciseName: 'Lunges', requiredEquipment: ['bodyweight'] },
          ],
        },
        {
          exerciseName: 'Leg Curl',
          sets: 3,
          reps: '12-15',
          restSeconds: 60,
          requiredEquipment: ['machine'],
          alternatives: [
            { exerciseName: 'Nordic Hamstring Curl', requiredEquipment: ['bodyweight'] },
          ],
        },
        {
          exerciseName: 'Calf Raise',
          sets: 4,
          reps: '15-20',
          restSeconds: 60,
          requiredEquipment: ['bodyweight'],
        },
      ],
    },
    // Days 4-6 would be similar with variation
  ],
}

export const minimalistStrengthTemplate: WorkoutTemplate = {
  id: 'minimalist-strength',
  name: 'Minimalist Strength Program',
  description: 'Bare-bones strength program focusing on the big 3 lifts. Perfect for those with basic barbell setup.',
  difficulty: 'intermediate',
  daysPerWeek: 3,
  requiredEquipment: [
    'Olympic Barbell (20kg)',
    'Power Rack',
    'Flat Bench',
  ],
  optionalEquipment: [],
  goals: ['strength'],
  duration: '12 weeks',
  category: 'barbell-only',
  weeklySchedule: [
    {
      name: 'Day A - Squat Focus',
      focus: 'Legs',
      estimatedDuration: 45,
      exercises: [
        {
          exerciseName: 'Barbell Squat',
          sets: 5,
          reps: '5',
          restSeconds: 300,
          requiredEquipment: ['barbell', 'rack'],
          notes: 'Main lift - linear progression',
        },
        {
          exerciseName: 'Bench Press',
          sets: 3,
          reps: '5',
          restSeconds: 180,
          requiredEquipment: ['barbell', 'bench'],
        },
        {
          exerciseName: 'Bent-Over Row',
          sets: 3,
          reps: '8',
          restSeconds: 120,
          requiredEquipment: ['barbell'],
        },
      ],
    },
    {
      name: 'Day B - Deadlift Focus',
      focus: 'Pull',
      estimatedDuration: 45,
      exercises: [
        {
          exerciseName: 'Deadlift',
          sets: 5,
          reps: '5',
          restSeconds: 300,
          requiredEquipment: ['barbell'],
          notes: 'Main lift - linear progression',
        },
        {
          exerciseName: 'Overhead Press',
          sets: 3,
          reps: '5',
          restSeconds: 180,
          requiredEquipment: ['barbell'],
        },
        {
          exerciseName: 'Barbell Squat',
          sets: 3,
          reps: '8',
          restSeconds: 120,
          requiredEquipment: ['barbell', 'rack'],
          notes: 'Volume work',
        },
      ],
    },
    {
      name: 'Day C - Bench Focus',
      focus: 'Push',
      estimatedDuration: 45,
      exercises: [
        {
          exerciseName: 'Bench Press',
          sets: 5,
          reps: '5',
          restSeconds: 300,
          requiredEquipment: ['barbell', 'bench'],
          notes: 'Main lift - linear progression',
        },
        {
          exerciseName: 'Barbell Squat',
          sets: 3,
          reps: '5',
          restSeconds: 180,
          requiredEquipment: ['barbell', 'rack'],
        },
        {
          exerciseName: 'Deadlift',
          sets: 3,
          reps: '8',
          restSeconds: 120,
          requiredEquipment: ['barbell'],
          notes: 'Volume work',
        },
      ],
    },
  ],
}

export const dumbbellOnlyTemplate: WorkoutTemplate = {
  id: 'dumbbell-only-hypertrophy',
  name: 'Dumbbell Only Hypertrophy',
  description: 'Complete muscle-building program using only dumbbells and a bench. Great for home gyms with limited space.',
  difficulty: 'beginner',
  daysPerWeek: 4,
  requiredEquipment: [
    'Dumbbell (Pair)',
    'Flat Bench',
  ],
  optionalEquipment: [
    'Adjustable Bench',
  ],
  goals: ['hypertrophy'],
  duration: '8 weeks',
  category: 'dumbbell-only',
  weeklySchedule: [
    {
      name: 'Upper Body A',
      focus: 'Upper',
      estimatedDuration: 50,
      exercises: [
        {
          exerciseName: 'Dumbbell Bench Press',
          sets: 4,
          reps: '8-12',
          restSeconds: 90,
          requiredEquipment: ['dumbbell', 'bench'],
        },
        {
          exerciseName: 'Dumbbell Row',
          sets: 4,
          reps: '8-12',
          restSeconds: 90,
          requiredEquipment: ['dumbbell', 'bench'],
        },
        {
          exerciseName: 'Dumbbell Shoulder Press',
          sets: 3,
          reps: '10-12',
          restSeconds: 60,
          requiredEquipment: ['dumbbell'],
        },
        {
          exerciseName: 'Dumbbell Curl',
          sets: 3,
          reps: '12-15',
          restSeconds: 45,
          requiredEquipment: ['dumbbell'],
        },
        {
          exerciseName: 'Overhead Tricep Extension',
          sets: 3,
          reps: '12-15',
          restSeconds: 45,
          requiredEquipment: ['dumbbell'],
        },
      ],
    },
    {
      name: 'Lower Body A',
      focus: 'Lower',
      estimatedDuration: 50,
      exercises: [
        {
          exerciseName: 'Goblet Squat',
          sets: 4,
          reps: '10-15',
          restSeconds: 90,
          requiredEquipment: ['dumbbell'],
        },
        {
          exerciseName: 'Romanian Deadlift',
          sets: 4,
          reps: '10-12',
          restSeconds: 90,
          requiredEquipment: ['dumbbell'],
        },
        {
          exerciseName: 'Bulgarian Split Squat',
          sets: 3,
          reps: '10-12',
          restSeconds: 60,
          requiredEquipment: ['dumbbell', 'bench'],
        },
        {
          exerciseName: 'Dumbbell Lunge',
          sets: 3,
          reps: '12-15',
          restSeconds: 60,
          requiredEquipment: ['dumbbell'],
        },
        {
          exerciseName: 'Calf Raise',
          sets: 4,
          reps: '15-20',
          restSeconds: 45,
          requiredEquipment: ['dumbbell'],
        },
      ],
    },
  ],
}

export const bodyweightMasteryTemplate: WorkoutTemplate = {
  id: 'bodyweight-mastery',
  name: 'Bodyweight Mastery',
  description: 'Progressive calisthenics program for building strength and muscle with zero equipment. Train anywhere, anytime.',
  difficulty: 'beginner',
  daysPerWeek: 4,
  requiredEquipment: [],
  optionalEquipment: [
    'Pull-up Bar',
    'Dip Station',
  ],
  goals: ['strength', 'hypertrophy'],
  duration: '12 weeks',
  category: 'bodyweight',
  weeklySchedule: [
    {
      name: 'Push Day',
      focus: 'Push',
      estimatedDuration: 40,
      exercises: [
        {
          exerciseName: 'Push-Up',
          sets: 4,
          reps: '12-20',
          restSeconds: 90,
          requiredEquipment: ['bodyweight'],
          notes: 'Progress to diamond, decline, or one-arm variations',
        },
        {
          exerciseName: 'Pike Push-Up',
          sets: 3,
          reps: '8-12',
          restSeconds: 90,
          requiredEquipment: ['bodyweight'],
        },
        {
          exerciseName: 'Dips',
          sets: 3,
          reps: '8-15',
          restSeconds: 90,
          requiredEquipment: ['bodyweight'],
          alternatives: [
            { exerciseName: 'Bench Dips', requiredEquipment: ['bodyweight'] },
          ],
        },
        {
          exerciseName: 'Diamond Push-Up',
          sets: 3,
          reps: '10-15',
          restSeconds: 60,
          requiredEquipment: ['bodyweight'],
        },
      ],
    },
    {
      name: 'Pull Day',
      focus: 'Pull',
      estimatedDuration: 40,
      exercises: [
        {
          exerciseName: 'Pull-Up',
          sets: 4,
          reps: '6-12',
          restSeconds: 120,
          requiredEquipment: ['bodyweight'],
          alternatives: [
            { exerciseName: 'Inverted Row', requiredEquipment: ['bodyweight'] },
          ],
        },
        {
          exerciseName: 'Chin-Up',
          sets: 3,
          reps: '6-12',
          restSeconds: 120,
          requiredEquipment: ['bodyweight'],
          alternatives: [
            { exerciseName: 'Inverted Row', requiredEquipment: ['bodyweight'] },
          ],
        },
        {
          exerciseName: 'Inverted Row',
          sets: 3,
          reps: '12-15',
          restSeconds: 60,
          requiredEquipment: ['bodyweight'],
        },
      ],
    },
    {
      name: 'Leg Day',
      focus: 'Legs',
      estimatedDuration: 35,
      exercises: [
        {
          exerciseName: 'Pistol Squat',
          sets: 3,
          reps: '6-10',
          restSeconds: 90,
          requiredEquipment: ['bodyweight'],
          alternatives: [
            { exerciseName: 'Bulgarian Split Squat', requiredEquipment: ['bodyweight'] },
          ],
        },
        {
          exerciseName: 'Bulgarian Split Squat',
          sets: 3,
          reps: '12-15',
          restSeconds: 60,
          requiredEquipment: ['bodyweight'],
        },
        {
          exerciseName: 'Nordic Hamstring Curl',
          sets: 3,
          reps: '5-8',
          restSeconds: 90,
          requiredEquipment: ['bodyweight'],
        },
        {
          exerciseName: 'Single-Leg Calf Raise',
          sets: 3,
          reps: '15-20',
          restSeconds: 45,
          requiredEquipment: ['bodyweight'],
        },
      ],
    },
    {
      name: 'Core & Conditioning',
      focus: 'Core',
      estimatedDuration: 30,
      exercises: [
        {
          exerciseName: 'Plank',
          sets: 3,
          reps: '60s',
          restSeconds: 60,
          requiredEquipment: ['bodyweight'],
        },
        {
          exerciseName: 'Hanging Leg Raise',
          sets: 3,
          reps: '10-15',
          restSeconds: 60,
          requiredEquipment: ['bodyweight'],
          alternatives: [
            { exerciseName: 'Lying Leg Raise', requiredEquipment: ['bodyweight'] },
          ],
        },
        {
          exerciseName: 'Ab Wheel Rollout',
          sets: 3,
          reps: '10-12',
          restSeconds: 60,
          requiredEquipment: ['bodyweight'],
          alternatives: [
            { exerciseName: 'Inchworm', requiredEquipment: ['bodyweight'] },
          ],
        },
      ],
    },
  ],
}

/**
 * All available templates
 */
export const workoutTemplates: WorkoutTemplate[] = [
  homeGymPPLTemplate,
  minimalistStrengthTemplate,
  dumbbellOnlyTemplate,
  bodyweightMasteryTemplate,
]

/**
 * Filter templates by user's available equipment
 */
export function filterTemplatesByEquipment(
  templates: WorkoutTemplate[],
  userEquipment: string[]
): { available: WorkoutTemplate[]; partial: WorkoutTemplate[]; unavailable: WorkoutTemplate[] } {
  const available: WorkoutTemplate[] = []
  const partial: WorkoutTemplate[] = []
  const unavailable: WorkoutTemplate[] = []

  templates.forEach(template => {
    const hasAllRequired = template.requiredEquipment.every(eq =>
      userEquipment.some(userEq => userEq.toLowerCase().includes(eq.toLowerCase()))
    )

    const hasSomeRequired = template.requiredEquipment.some(eq =>
      userEquipment.some(userEq => userEq.toLowerCase().includes(eq.toLowerCase()))
    )

    if (hasAllRequired) {
      available.push(template)
    } else if (hasSomeRequired || template.requiredEquipment.length === 0) {
      partial.push(template)
    } else {
      unavailable.push(template)
    }
  })

  return { available, partial, unavailable }
}

/**
 * Get equipment requirements badge
 */
export function getTemplateEquipmentBadge(template: WorkoutTemplate): {
  color: string
  text: string
} {
  const badges: Record<typeof template.category, { color: string; text: string }> = {
    'home-gym': { color: 'bg-blue-500/20 text-blue-300 border-blue-500/30', text: 'Home Gym' },
    'commercial-gym': { color: 'bg-purple-500/20 text-purple-300 border-purple-500/30', text: 'Commercial Gym' },
    'minimal': { color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30', text: 'Minimal Equipment' },
    'bodyweight': { color: 'bg-green-500/20 text-green-300 border-green-500/30', text: 'Bodyweight Only' },
    'barbell-only': { color: 'bg-red-500/20 text-red-300 border-red-500/30', text: 'Barbell Only' },
    'dumbbell-only': { color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30', text: 'Dumbbell Only' },
  }

  return badges[template.category]
}
