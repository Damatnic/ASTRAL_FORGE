/**
 * Exercise Intelligence System
 * 
 * Provides form cues, technique tips, common mistakes, and exercise metadata
 * to help users perform exercises safely and effectively.
 */

export interface ExerciseTechnique {
  exerciseId: string
  exerciseName: string
  category: 'compound' | 'isolation' | 'cardio' | 'flexibility' | 'bodyweight'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  primaryMuscles: string[]
  secondaryMuscles: string[]
  equipment: string[]
  setup: string[]
  execution: string[]
  formCues: string[]
  commonMistakes: string[]
  safetyTips: string[]
  breathingPattern: string
  tempo?: string // e.g., "2-1-2-1" (eccentric-pause-concentric-pause)
  alternatives: string[]
  variations: string[]
  warmupSets?: string
}

export class ExerciseIntelligence {
  private exerciseDatabase: Map<string, ExerciseTechnique> = new Map()

  constructor() {
    this.initializeDatabase()
  }

  private initializeDatabase() {
    // Squat
    this.exerciseDatabase.set('squat', {
      exerciseId: 'squat',
      exerciseName: 'Barbell Back Squat',
      category: 'compound',
      difficulty: 'intermediate',
      primaryMuscles: ['Quadriceps', 'Glutes'],
      secondaryMuscles: ['Hamstrings', 'Core', 'Lower Back'],
      equipment: ['Barbell', 'Squat Rack'],
      setup: [
        'Set the bar at upper chest height in the squat rack',
        'Position the bar on your upper traps, not your neck',
        'Grip the bar slightly wider than shoulder-width',
        'Step back and set feet shoulder-width apart',
        'Toes pointed slightly outward (15-30 degrees)',
      ],
      execution: [
        'Take a deep breath and brace your core',
        'Initiate by pushing hips back while bending knees',
        'Keep chest up and maintain neutral spine',
        'Descend until hips are just below knee level',
        'Drive through heels to return to starting position',
        'Exhale forcefully at the top',
      ],
      formCues: [
        'Keep knees tracking over toes',
        'Maintain big toe, pinky toe, and heel contact with floor',
        'Drive knees out in line with toes',
        'Keep core tight throughout the movement',
        'Look forward or slightly upward, not down',
        'Squeeze glutes at the top',
      ],
      commonMistakes: [
        'Knees caving inward (valgus collapse)',
        'Heels rising off the ground',
        'Butt wink (pelvis tucking under)',
        'Leaning too far forward',
        'Not reaching proper depth',
        'Bouncing at the bottom',
      ],
      safetyTips: [
        'Always use safety bars or pins',
        'Warm up thoroughly with bodyweight squats',
        'Never round your lower back',
        'Use a spotter for heavy sets',
        'Start with just the bar to practice form',
      ],
      breathingPattern: 'Inhale on descent, exhale on ascent',
      tempo: '2-0-1-0',
      alternatives: ['Goblet Squat', 'Front Squat', 'Leg Press'],
      variations: ['High Bar', 'Low Bar', 'Box Squat', 'Pause Squat'],
      warmupSets: '2-3 sets with empty bar, then 50%, 70% of working weight',
    })

    // Bench Press
    this.exerciseDatabase.set('bench-press', {
      exerciseId: 'bench-press',
      exerciseName: 'Barbell Bench Press',
      category: 'compound',
      difficulty: 'intermediate',
      primaryMuscles: ['Chest (Pectorals)'],
      secondaryMuscles: ['Shoulders (Anterior Deltoids)', 'Triceps'],
      equipment: ['Barbell', 'Bench', 'Rack'],
      setup: [
        'Lie on bench with eyes directly under the bar',
        'Plant feet firmly on the floor',
        'Squeeze shoulder blades together and down',
        'Create slight arch in lower back',
        'Grip bar slightly wider than shoulder-width',
      ],
      execution: [
        'Lift bar off rack with straight arms',
        'Position bar over upper chest/shoulders',
        'Lower bar with control to chest (nipple line)',
        'Touch chest lightly without bouncing',
        'Press bar up and slightly back to starting position',
        'Lock out elbows at the top',
      ],
      formCues: [
        'Maintain 5 points of contact (head, shoulders, butt, both feet)',
        'Keep wrists straight and stacked over elbows',
        'Tuck elbows at 45-75 degree angle from torso',
        'Drive feet into floor for leg drive',
        'Keep chest up throughout the movement',
        'Squeeze the bar hard for better stability',
      ],
      commonMistakes: [
        'Bouncing bar off chest',
        'Flaring elbows too wide (90 degrees)',
        'Lifting hips off bench',
        'Not touching chest or half-repping',
        'Uneven bar path',
        'Losing tightness in upper back',
      ],
      safetyTips: [
        'Always use a spotter for heavy sets',
        'Use safety bars/pins if training alone',
        'Never use suicide grip (thumbless)',
        'Keep collars on the bar',
        'Start with manageable weight',
      ],
      breathingPattern: 'Inhale on descent, exhale on press',
      tempo: '2-1-1-0',
      alternatives: ['Dumbbell Press', 'Machine Press', 'Push-ups'],
      variations: ['Incline', 'Decline', 'Close Grip', 'Pause Press'],
      warmupSets: 'Bar only, then 50%, 70% of working weight',
    })

    // Deadlift
    this.exerciseDatabase.set('deadlift', {
      exerciseId: 'deadlift',
      exerciseName: 'Conventional Deadlift',
      category: 'compound',
      difficulty: 'advanced',
      primaryMuscles: ['Glutes', 'Hamstrings', 'Lower Back'],
      secondaryMuscles: ['Traps', 'Lats', 'Core', 'Forearms'],
      equipment: ['Barbell', 'Plates'],
      setup: [
        'Stand with feet hip-width apart',
        'Bar over mid-foot (1-2 inches from shins)',
        'Bend at hips and knees to grip bar',
        'Hands just outside legs (shoulder-width)',
        'Shoulders slightly in front of bar',
      ],
      execution: [
        'Take slack out of bar by pulling shoulders back',
        'Take deep breath and brace core',
        'Drive through heels and push floor away',
        'Keep bar close to body throughout',
        'Extend hips and knees simultaneously',
        'Lock out with shoulders back, hips forward',
      ],
      formCues: [
        'Keep back flat and chest up',
        'Engage lats (protect your armpits)',
        'Push knees out in line with toes',
        'Bar should travel in straight vertical line',
        'Hips and shoulders rise together',
        'Squeeze glutes hard at lockout',
      ],
      commonMistakes: [
        'Rounding lower back',
        'Bar drifting away from body',
        'Hyperextending at lockout',
        'Jerking the bar off floor',
        'Hips shooting up first',
        'Not fully locking out',
      ],
      safetyTips: [
        'Never round your back under load',
        'Warm up thoroughly before heavy pulls',
        'Use mixed or hook grip for heavy sets',
        'Consider using straps for volume work',
        'Reset form between reps if needed',
      ],
      breathingPattern: 'Big breath at bottom, hold until lockout',
      tempo: '1-0-1-1',
      alternatives: ['Trap Bar Deadlift', 'Romanian Deadlift', 'Rack Pulls'],
      variations: ['Sumo', 'Deficit', 'Block Pulls', 'Pause Deadlift'],
      warmupSets: 'Dynamic stretching, then 40%, 60%, 80% of working weight',
    })

    // Overhead Press
    this.exerciseDatabase.set('overhead-press', {
      exerciseId: 'overhead-press',
      exerciseName: 'Standing Barbell Overhead Press',
      category: 'compound',
      difficulty: 'intermediate',
      primaryMuscles: ['Shoulders (Deltoids)'],
      secondaryMuscles: ['Triceps', 'Upper Chest', 'Core'],
      equipment: ['Barbell', 'Rack'],
      setup: [
        'Set bar at upper chest height in rack',
        'Grip bar slightly wider than shoulder-width',
        'Step under bar, position on front delts',
        'Elbows slightly in front of bar',
        'Feet hip to shoulder-width apart',
      ],
      execution: [
        'Take deep breath and brace core',
        'Press bar straight up, moving head back slightly',
        'Once bar passes face, push head through',
        'Lock out arms overhead with bar over mid-foot',
        'Lower with control back to starting position',
      ],
      formCues: [
        'Keep core tight and glutes squeezed',
        'Maintain vertical forearms',
        'Drive through heels',
        'Bar path should be straight up',
        'Shrug shoulders at the top',
        'Keep ribs down, avoid arching back',
      ],
      commonMistakes: [
        'Excessive back arch',
        'Press going forward instead of up',
        'Not achieving full lockout',
        'Using leg drive (unless push press)',
        'Flaring elbows too wide',
        'Looking up during the press',
      ],
      safetyTips: [
        'Warm up shoulders thoroughly',
        'Start with manageable weight',
        'Keep core engaged to protect lower back',
        'Use wrist wraps for heavy sets',
        'Consider seated variation if balance is issue',
      ],
      breathingPattern: 'Inhale at bottom, exhale during press',
      tempo: '2-0-1-1',
      alternatives: ['Dumbbell Press', 'Machine Press', 'Handstand Push-ups'],
      variations: ['Push Press', 'Seated', 'Behind Neck', 'Z-Press'],
      warmupSets: 'Arm circles, band work, then bar only',
    })

    // Pull-up
    this.exerciseDatabase.set('pull-up', {
      exerciseId: 'pull-up',
      exerciseName: 'Pull-up',
      category: 'bodyweight',
      difficulty: 'intermediate',
      primaryMuscles: ['Lats', 'Middle Back'],
      secondaryMuscles: ['Biceps', 'Rear Delts', 'Core'],
      equipment: ['Pull-up Bar'],
      setup: [
        'Grip bar slightly wider than shoulder-width',
        'Palms facing away (pronated grip)',
        'Hang with arms fully extended',
        'Engage shoulders (active hang)',
        'Cross ankles behind you if desired',
      ],
      execution: [
        'Pull up by driving elbows down and back',
        'Lead with chest toward the bar',
        'Continue until chin clears the bar',
        'Lower with control to full extension',
        'Maintain core tension throughout',
      ],
      formCues: [
        'Squeeze shoulder blades together',
        'Keep core tight to prevent swinging',
        'Focus on pulling with back, not arms',
        'Maintain hollow body position',
        'Control the descent, dont drop',
        'Full range of motion on every rep',
      ],
      commonMistakes: [
        'Using momentum/kipping',
        'Not achieving full range of motion',
        'Pulling with arms only',
        'Craning neck to get chin over bar',
        'Swinging or using body English',
        'Half reps at bottom',
      ],
      safetyTips: [
        'Warm up with dead hangs',
        'Use assistance bands if needed',
        'Build up gradually to avoid elbow issues',
        'Stop if you feel shoulder impingement',
        'Consider using straps for high volume',
      ],
      breathingPattern: 'Exhale on pull up, inhale on descent',
      tempo: '1-1-2-0',
      alternatives: ['Lat Pulldown', 'Assisted Pull-up Machine', 'Inverted Row'],
      variations: ['Chin-up', 'Wide Grip', 'Neutral Grip', 'Weighted'],
      warmupSets: 'Band pull-aparts, scap pulls, then bodyweight sets',
    })

    // Dumbbell Row
    this.exerciseDatabase.set('dumbbell-row', {
      exerciseId: 'dumbbell-row',
      exerciseName: 'Single-Arm Dumbbell Row',
      category: 'compound',
      difficulty: 'beginner',
      primaryMuscles: ['Lats', 'Middle Back'],
      secondaryMuscles: ['Biceps', 'Rear Delts', 'Core'],
      equipment: ['Dumbbell', 'Bench'],
      setup: [
        'Place one knee and same-side hand on bench',
        'Other foot firmly on floor, slightly back',
        'Keep back parallel to floor',
        'Let dumbbell hang straight down',
        'Maintain neutral spine',
      ],
      execution: [
        'Pull dumbbell up toward hip',
        'Lead with elbow, keeping it close to body',
        'Squeeze shoulder blade at top',
        'Lower with control to full stretch',
        'Avoid rotating torso',
      ],
      formCues: [
        'Think about pulling elbow to ceiling',
        'Keep core engaged throughout',
        'Dont let shoulder roll forward',
        'Maintain neutral neck position',
        'Control the weight, dont jerk',
        'Get full stretch at bottom',
      ],
      commonMistakes: [
        'Using momentum to swing weight',
        'Rotating torso to lift higher',
        'Pulling too high (to chest)',
        'Not getting full range of motion',
        'Rounding back',
        'Looking up or to the side',
      ],
      safetyTips: [
        'Start with lighter weight to master form',
        'Keep movements controlled',
        'Dont sacrifice form for weight',
        'Stop if lower back hurts',
        'Ensure stable base position',
      ],
      breathingPattern: 'Exhale on pull, inhale on descent',
      tempo: '1-1-2-0',
      alternatives: ['Barbell Row', 'Cable Row', 'T-Bar Row'],
      variations: ['Two-Arm Row', 'Kroc Row', 'Pendlay Row'],
      warmupSets: 'Light weight for 15-20 reps each arm',
    })

    // Romanian Deadlift
    this.exerciseDatabase.set('romanian-deadlift', {
      exerciseId: 'romanian-deadlift',
      exerciseName: 'Romanian Deadlift (RDL)',
      category: 'compound',
      difficulty: 'intermediate',
      primaryMuscles: ['Hamstrings', 'Glutes'],
      secondaryMuscles: ['Lower Back', 'Core'],
      equipment: ['Barbell'],
      setup: [
        'Start with bar in rack at hip height',
        'Grip bar shoulder-width with overhand grip',
        'Step back with feet hip-width apart',
        'Slight bend in knees (soft knees)',
        'Shoulders back, chest up',
      ],
      execution: [
        'Push hips back while maintaining slight knee bend',
        'Lower bar by sliding down thighs',
        'Keep bar close to body throughout',
        'Feel stretch in hamstrings',
        'Drive hips forward to return to start',
        'Squeeze glutes at top',
      ],
      formCues: [
        'This is a hip hinge, not a squat',
        'Keep back flat and chest proud',
        'Weight on heels and mid-foot',
        'Knees stay over ankles',
        'Maintain neutral spine',
        'Think about closing a door with your butt',
      ],
      commonMistakes: [
        'Bending knees too much (squatting)',
        'Rounding lower back',
        'Bar drifting away from body',
        'Not pushing hips back enough',
        'Hyperextending at top',
        'Looking up during movement',
      ],
      safetyTips: [
        'Master hip hinge pattern first',
        'Start with light weight',
        'Stop when you feel good hamstring stretch',
        'Never round back to go lower',
        'Use straps for grip if needed',
      ],
      breathingPattern: 'Inhale on descent, exhale on ascent',
      tempo: '3-1-1-0',
      alternatives: ['Stiff-Leg Deadlift', 'Good Morning', 'Leg Curl'],
      variations: ['Single-Leg RDL', 'Dumbbell RDL', 'Deficit RDL'],
      warmupSets: 'Hip circles, leg swings, then light weight',
    })

    // Push-ups
    this.exerciseDatabase.set('push-up', {
      exerciseId: 'push-up',
      exerciseName: 'Push-up',
      category: 'bodyweight',
      difficulty: 'beginner',
      primaryMuscles: ['Chest'],
      secondaryMuscles: ['Shoulders', 'Triceps', 'Core'],
      equipment: ['None'],
      setup: [
        'Start in plank position',
        'Hands slightly wider than shoulder-width',
        'Fingers spread, weight on palms',
        'Body in straight line from head to heels',
        'Core engaged, glutes squeezed',
      ],
      execution: [
        'Lower body as one unit',
        'Elbows at 45-degree angle from torso',
        'Descend until chest nearly touches floor',
        'Push through palms to return to start',
        'Lock out arms at top',
      ],
      formCues: [
        'Keep core tight throughout',
        'Dont let hips sag or pike',
        'Look slightly ahead, not down',
        'Squeeze glutes to maintain position',
        'Push the floor away from you',
        'Maintain rigid body position',
      ],
      commonMistakes: [
        'Hips sagging (weak core)',
        'Butt too high in air',
        'Elbows flaring to 90 degrees',
        'Not going low enough',
        'Head dropping down',
        'Hands too far forward',
      ],
      safetyTips: [
        'Master incline push-ups first if needed',
        'Keep movements controlled',
        'Stop if wrists hurt',
        'Use push-up handles for wrist comfort',
        'Progress gradually',
      ],
      breathingPattern: 'Inhale down, exhale up',
      tempo: '2-1-1-0',
      alternatives: ['Bench Press', 'Dips', 'Chest Fly'],
      variations: ['Incline', 'Decline', 'Diamond', 'Wide Grip', 'Archer'],
      warmupSets: 'Arm circles, wrist stretches, easier variation first',
    })

    // Lunges
    this.exerciseDatabase.set('lunge', {
      exerciseId: 'lunge',
      exerciseName: 'Walking Lunge',
      category: 'compound',
      difficulty: 'beginner',
      primaryMuscles: ['Quadriceps', 'Glutes'],
      secondaryMuscles: ['Hamstrings', 'Calves', 'Core'],
      equipment: ['None', 'Dumbbells (optional)'],
      setup: [
        'Stand with feet hip-width apart',
        'Hands on hips or holding dumbbells at sides',
        'Shoulders back, chest up',
        'Core engaged',
        'Look straight ahead',
      ],
      execution: [
        'Step forward with one leg',
        'Lower hips until both knees at 90 degrees',
        'Front knee over ankle, not pushed out too far',
        'Back knee hovering just above ground',
        'Push through front heel to step forward',
        'Alternate legs with each step',
      ],
      formCues: [
        'Keep torso upright',
        'Dont let front knee cave inward',
        'Drive through heel, not toes',
        'Keep core tight for balance',
        'Controlled descent, powerful ascent',
        'Maintain forward momentum',
      ],
      commonMistakes: [
        'Knee going past toes',
        'Leaning too far forward',
        'Taking too short steps',
        'Knee caving inward',
        'Looking down',
        'Bouncing at bottom',
      ],
      safetyTips: [
        'Master bodyweight before adding load',
        'Start with reverse lunges if balance is issue',
        'Keep movements controlled',
        'Stop if knees hurt',
        'Ensure adequate space',
      ],
      breathingPattern: 'Inhale on descent, exhale on ascent',
      tempo: '2-1-1-0',
      alternatives: ['Split Squats', 'Step-ups', 'Leg Press'],
      variations: ['Reverse', 'Lateral', 'Curtsy', 'Jump Lunges'],
      warmupSets: 'Leg swings, bodyweight squats, then bodyweight lunges',
    })

    // Plank
    this.exerciseDatabase.set('plank', {
      exerciseId: 'plank',
      exerciseName: 'Plank',
      category: 'bodyweight',
      difficulty: 'beginner',
      primaryMuscles: ['Core', 'Abs'],
      secondaryMuscles: ['Shoulders', 'Back', 'Glutes'],
      equipment: ['None'],
      setup: [
        'Start in push-up position or on forearms',
        'Elbows directly under shoulders',
        'Feet hip-width apart',
        'Body in straight line',
        'Neck neutral',
      ],
      execution: [
        'Hold position with perfect form',
        'Breathe normally throughout',
        'Maintain tension in entire body',
        'Dont let hips drop or rise',
        'Hold for prescribed time',
      ],
      formCues: [
        'Squeeze glutes hard',
        'Pull belly button to spine',
        'Push away from floor',
        'Keep breathing steady',
        'Maintain neutral spine',
        'Engage entire core',
      ],
      commonMistakes: [
        'Hips sagging down',
        'Butt too high',
        'Holding breath',
        'Looking up or down',
        'Hands too far forward',
        'Not maintaining full-body tension',
      ],
      safetyTips: [
        'Start with shorter holds',
        'Focus on form over time',
        'Stop if lower back hurts',
        'Progress gradually',
        'Use knees if needed initially',
      ],
      breathingPattern: 'Steady breathing throughout',
      tempo: 'Hold for time',
      alternatives: ['Dead Bug', 'Bird Dog', 'Mountain Climbers'],
      variations: ['Side Plank', 'Plank Up-Downs', 'Plank Jacks'],
      warmupSets: 'Cat-cow stretches, then shorter holds',
    })
  }

  getExerciseTechnique(exerciseId: string): ExerciseTechnique | null {
    const id = exerciseId.toLowerCase().replace(/\s+/g, '-')
    return this.exerciseDatabase.get(id) || null
  }

  getAllExercises(): ExerciseTechnique[] {
    return Array.from(this.exerciseDatabase.values())
  }

  getExercisesByMuscleGroup(muscleGroup: string): ExerciseTechnique[] {
    return Array.from(this.exerciseDatabase.values()).filter(
      exercise => 
        exercise.primaryMuscles.some(muscle => 
          muscle.toLowerCase().includes(muscleGroup.toLowerCase())
        ) ||
        exercise.secondaryMuscles.some(muscle => 
          muscle.toLowerCase().includes(muscleGroup.toLowerCase())
        )
    )
  }

  getExercisesByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'): ExerciseTechnique[] {
    return Array.from(this.exerciseDatabase.values()).filter(
      exercise => exercise.difficulty === difficulty
    )
  }

  getExercisesByEquipment(equipment: string): ExerciseTechnique[] {
    return Array.from(this.exerciseDatabase.values()).filter(
      exercise => exercise.equipment.some(eq => 
        eq.toLowerCase().includes(equipment.toLowerCase())
      )
    )
  }

  getWarmupRecommendations(exerciseIds: string[]): string[] {
    const recommendations: string[] = []
    const exercises = exerciseIds.map(id => this.getExerciseTechnique(id)).filter(Boolean) as ExerciseTechnique[]
    
    if (exercises.length === 0) return ['General dynamic warm-up for 5-10 minutes']

    // Analyze muscle groups
    const muscleGroups = new Set<string>()
    exercises.forEach(ex => {
      ex.primaryMuscles.forEach(m => muscleGroups.add(m))
    })

    // General recommendations
    recommendations.push('5 minutes light cardio (treadmill, bike, or rowing)')
    
    // Specific muscle group warm-ups
    if (muscleGroups.has('Quadriceps') || muscleGroups.has('Glutes')) {
      recommendations.push('Leg swings: 10 each direction')
      recommendations.push('Bodyweight squats: 15-20 reps')
      recommendations.push('Walking lunges: 10 per leg')
    }
    
    if (muscleGroups.has('Chest') || muscleGroups.has('Shoulders') || muscleGroups.has('Chest (Pectorals)') || muscleGroups.has('Shoulders (Deltoids)')) {
      recommendations.push('Arm circles: 10 forward, 10 backward')
      recommendations.push('Band pull-aparts: 15-20 reps')
      recommendations.push('Push-ups: 10-15 reps')
    }
    
    if (muscleGroups.has('Lats') || muscleGroups.has('Middle Back')) {
      recommendations.push('Dead hangs: 20-30 seconds')
      recommendations.push('Scapular pulls: 10 reps')
      recommendations.push('Band rows: 15-20 reps')
    }

    // Exercise-specific warm-ups
    exercises.forEach(ex => {
      if (ex.warmupSets) {
        recommendations.push(`${ex.exerciseName}: ${ex.warmupSets}`)
      }
    })

    return recommendations
  }

  getCooldownRecommendations(exerciseIds: string[]): string[] {
    const recommendations: string[] = []
    const exercises = exerciseIds.map(id => this.getExerciseTechnique(id)).filter(Boolean) as ExerciseTechnique[]
    
    if (exercises.length === 0) return ['General static stretching for 10-15 minutes']

    // Analyze muscle groups
    const muscleGroups = new Set<string>()
    exercises.forEach(ex => {
      ex.primaryMuscles.forEach(m => muscleGroups.add(m))
    })

    // General cool-down
    recommendations.push('5 minutes light walking to lower heart rate')
    
    // Specific stretches
    if (muscleGroups.has('Quadriceps')) {
      recommendations.push('Quad stretch: 30 seconds each leg')
    }
    
    if (muscleGroups.has('Hamstrings')) {
      recommendations.push('Hamstring stretch: 30 seconds each leg')
    }
    
    if (muscleGroups.has('Glutes')) {
      recommendations.push('Pigeon pose: 30 seconds each side')
      recommendations.push('Figure-4 stretch: 30 seconds each side')
    }
    
    if (muscleGroups.has('Chest') || muscleGroups.has('Chest (Pectorals)')) {
      recommendations.push('Doorway chest stretch: 30 seconds each side')
    }
    
    if (muscleGroups.has('Shoulders')) {
      recommendations.push('Cross-body shoulder stretch: 30 seconds each arm')
    }
    
    if (muscleGroups.has('Lats')) {
      recommendations.push('Overhead lat stretch: 30 seconds each side')
    }

    recommendations.push('Deep breathing: 5-10 breaths')
    recommendations.push('Foam rolling: 5-10 minutes on worked muscles')

    return recommendations
  }

  getFormCheckReminders(exerciseId: string): string[] {
    const technique = this.getExerciseTechnique(exerciseId)
    if (!technique) return []

    // Return top 3 most important form cues as reminders
    return technique.formCues.slice(0, 3)
  }

  getSafetyCheck(exerciseId: string, currentSet: number, rpe: number): string | null {
    const technique = this.getExerciseTechnique(exerciseId)
    if (!technique) return null

    // Check for high fatigue
    if (rpe >= 9.5 && currentSet >= 3) {
      return '⚠️ High fatigue detected. Consider reducing weight or ending exercise.'
    }

    // Advanced exercise warnings
    if (technique.difficulty === 'advanced' && currentSet === 1) {
      return '⚠️ Advanced exercise - ensure proper warm-up and focus on form.'
    }

    // Compound movement fatigue check
    if (technique.category === 'compound' && rpe >= 9 && currentSet >= 4) {
      return '⚠️ Form may break down with fatigue. Consider this your last set.'
    }

    return null
  }

  getExerciseSubstitutions(exerciseId: string, availableEquipment: string[]): ExerciseTechnique[] {
    const exercise = this.getExerciseTechnique(exerciseId)
    if (!exercise) return []

    // Find exercises with similar primary muscles and compatible equipment
    return Array.from(this.exerciseDatabase.values()).filter(ex => {
      if (ex.exerciseId === exerciseId) return false
      
      // Check if equipment is available
      const hasEquipment = ex.equipment.every(eq => 
        availableEquipment.some(avail => avail.toLowerCase().includes(eq.toLowerCase()))
      )
      if (!hasEquipment) return false

      // Check if targets similar muscle groups
      const similarMuscles = ex.primaryMuscles.some(muscle => 
        exercise.primaryMuscles.includes(muscle)
      )
      
      return similarMuscles
    }).slice(0, 5) // Return top 5 substitutes
  }
}
