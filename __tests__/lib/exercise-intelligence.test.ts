import { ExerciseIntelligence } from '@/lib/exercise-intelligence'

describe('ExerciseIntelligence', () => {
  let intelligence: ExerciseIntelligence

  beforeEach(() => {
    intelligence = new ExerciseIntelligence()
  })

  describe('getExerciseTechnique', () => {
    it('should return exercise technique for valid exercise', () => {
      const technique = intelligence.getExerciseTechnique('squat')
      
      expect(technique).toBeDefined()
      expect(technique?.exerciseName).toBe('Barbell Back Squat')
      expect(technique?.category).toBe('compound')
      expect(technique?.primaryMuscles).toContain('Quadriceps')
      expect(technique?.primaryMuscles).toContain('Glutes')
    })

    it('should return null for invalid exercise', () => {
      const technique = intelligence.getExerciseTechnique('invalid-exercise')
      expect(technique).toBeNull()
    })

    it('should handle different case formats', () => {
      const technique1 = intelligence.getExerciseTechnique('bench-press')
      const technique2 = intelligence.getExerciseTechnique('BENCH-PRESS')
      const technique3 = intelligence.getExerciseTechnique('Bench Press')
      
      expect(technique1).toBeDefined()
      expect(technique2).toBeDefined()
      expect(technique3).toBeDefined()
      expect(technique1?.exerciseId).toBe('bench-press')
    })
  })

  describe('getAllExercises', () => {
    it('should return all exercises in database', () => {
      const exercises = intelligence.getAllExercises()
      
      expect(exercises.length).toBeGreaterThan(0)
      expect(exercises.length).toBe(10) // We have 10 exercises in the database
      expect(exercises.every(ex => ex.exerciseId)).toBe(true)
      expect(exercises.every(ex => ex.formCues.length > 0)).toBe(true)
    })
  })

  describe('getExercisesByMuscleGroup', () => {
    it('should return exercises for specific muscle group', () => {
      const quadExercises = intelligence.getExercisesByMuscleGroup('Quadriceps')
      
      expect(quadExercises.length).toBeGreaterThan(0)
      expect(quadExercises.some(ex => ex.exerciseId === 'squat')).toBe(true)
      expect(quadExercises.some(ex => ex.exerciseId === 'lunge')).toBe(true)
    })

    it('should find exercises where muscle is secondary', () => {
      const coreExercises = intelligence.getExercisesByMuscleGroup('Core')
      
      expect(coreExercises.length).toBeGreaterThan(0)
      expect(coreExercises.some(ex => ex.exerciseId === 'plank')).toBe(true)
      expect(coreExercises.some(ex => ex.exerciseId === 'squat')).toBe(true) // Core is secondary
    })

    it('should handle case insensitive search', () => {
      const exercises1 = intelligence.getExercisesByMuscleGroup('chest')
      const exercises2 = intelligence.getExercisesByMuscleGroup('CHEST')
      
      expect(exercises1.length).toBe(exercises2.length)
      expect(exercises1.length).toBeGreaterThan(0)
    })
  })

  describe('getExercisesByDifficulty', () => {
    it('should return beginner exercises', () => {
      const beginnerExercises = intelligence.getExercisesByDifficulty('beginner')
      
      expect(beginnerExercises.length).toBeGreaterThan(0)
      expect(beginnerExercises.every(ex => ex.difficulty === 'beginner')).toBe(true)
      expect(beginnerExercises.some(ex => ex.exerciseId === 'push-up')).toBe(true)
    })

    it('should return intermediate exercises', () => {
      const intermediateExercises = intelligence.getExercisesByDifficulty('intermediate')
      
      expect(intermediateExercises.length).toBeGreaterThan(0)
      expect(intermediateExercises.every(ex => ex.difficulty === 'intermediate')).toBe(true)
      expect(intermediateExercises.some(ex => ex.exerciseId === 'squat')).toBe(true)
    })

    it('should return advanced exercises', () => {
      const advancedExercises = intelligence.getExercisesByDifficulty('advanced')
      
      expect(advancedExercises.length).toBeGreaterThan(0)
      expect(advancedExercises.every(ex => ex.difficulty === 'advanced')).toBe(true)
      expect(advancedExercises.some(ex => ex.exerciseId === 'deadlift')).toBe(true)
    })
  })

  describe('getExercisesByEquipment', () => {
    it('should return barbell exercises', () => {
      const barbellExercises = intelligence.getExercisesByEquipment('barbell')
      
      expect(barbellExercises.length).toBeGreaterThan(0)
      expect(barbellExercises.some(ex => ex.exerciseId === 'squat')).toBe(true)
      expect(barbellExercises.some(ex => ex.exerciseId === 'bench-press')).toBe(true)
    })

    it('should return bodyweight exercises', () => {
      const bodyweightExercises = intelligence.getExercisesByEquipment('none')
      
      expect(bodyweightExercises.length).toBeGreaterThan(0)
      expect(bodyweightExercises.some(ex => ex.exerciseId === 'push-up')).toBe(true)
      expect(bodyweightExercises.some(ex => ex.exerciseId === 'plank')).toBe(true)
    })

    it('should handle partial equipment matches', () => {
      const dumbellExercises = intelligence.getExercisesByEquipment('dumbbell')
      
      expect(dumbellExercises.length).toBeGreaterThan(0)
      expect(dumbellExercises.some(ex => ex.exerciseId === 'dumbbell-row')).toBe(true)
    })
  })

  describe('getWarmupRecommendations', () => {
    it('should return general warmup for empty exercise list', () => {
      const warmup = intelligence.getWarmupRecommendations([])
      
      expect(warmup.length).toBe(1)
      expect(warmup[0]).toContain('General dynamic warm-up')
    })

    it('should return specific warmup for leg exercises', () => {
      const warmup = intelligence.getWarmupRecommendations(['squat', 'deadlift'])
      
      expect(warmup.length).toBeGreaterThan(1)
      expect(warmup.some(w => w.includes('Leg swings'))).toBe(true)
      expect(warmup.some(w => w.includes('Bodyweight squats'))).toBe(true)
    })

    it('should return specific warmup for upper body exercises', () => {
      const warmup = intelligence.getWarmupRecommendations(['bench-press', 'overhead-press'])
      
      expect(warmup.length).toBeGreaterThan(1)
      expect(warmup.some(w => w.includes('Arm circles'))).toBe(true)
      expect(warmup.some(w => w.includes('Push-ups'))).toBe(true)
    })

    it('should include exercise-specific warmup sets', () => {
      const warmup = intelligence.getWarmupRecommendations(['squat'])
      
      expect(warmup.some(w => w.includes('Barbell Back Squat'))).toBe(true)
      expect(warmup.some(w => w.includes('empty bar'))).toBe(true)
    })
  })

  describe('getCooldownRecommendations', () => {
    it('should return general cooldown for empty exercise list', () => {
      const cooldown = intelligence.getCooldownRecommendations([])
      
      expect(cooldown.length).toBe(1)
      expect(cooldown[0]).toContain('General static stretching')
    })

    it('should return specific stretches for leg exercises', () => {
      const cooldown = intelligence.getCooldownRecommendations(['squat', 'lunge'])
      
      expect(cooldown.length).toBeGreaterThan(1)
      expect(cooldown.some(c => c.includes('Quad stretch'))).toBe(true)
      expect(cooldown.some(c => c.includes('Pigeon pose'))).toBe(true)
    })

    it('should return specific stretches for upper body', () => {
      const cooldown = intelligence.getCooldownRecommendations(['bench-press', 'pull-up'])
      
      expect(cooldown.length).toBeGreaterThan(1)
      expect(cooldown.some(c => c.includes('chest stretch'))).toBe(true)
      expect(cooldown.some(c => c.includes('lat stretch'))).toBe(true)
    })

    it('should always include general recovery recommendations', () => {
      const cooldown = intelligence.getCooldownRecommendations(['squat'])
      
      expect(cooldown.some(c => c.includes('Deep breathing'))).toBe(true)
      expect(cooldown.some(c => c.includes('Foam rolling'))).toBe(true)
    })
  })

  describe('getFormCheckReminders', () => {
    it('should return top form cues for exercise', () => {
      const reminders = intelligence.getFormCheckReminders('squat')
      
      expect(reminders.length).toBe(3)
      expect(reminders[0]).toBeTruthy()
      expect(typeof reminders[0]).toBe('string')
    })

    it('should return empty array for invalid exercise', () => {
      const reminders = intelligence.getFormCheckReminders('invalid')
      
      expect(reminders).toEqual([])
    })
  })

  describe('getSafetyCheck', () => {
    it('should return null for normal conditions', () => {
      const safety = intelligence.getSafetyCheck('squat', 2, 7)
      
      expect(safety).toBeNull()
    })

    it('should warn about high fatigue', () => {
      const safety = intelligence.getSafetyCheck('squat', 4, 9.5)
      
      expect(safety).toBeDefined()
      expect(safety).toContain('High fatigue')
      expect(safety).toContain('Consider reducing weight')
    })

    it('should warn about advanced exercise on first set', () => {
      const safety = intelligence.getSafetyCheck('deadlift', 1, 7)
      
      expect(safety).toBeDefined()
      expect(safety).toContain('Advanced exercise')
      expect(safety).toContain('warm-up')
    })

    it('should warn about compound movement fatigue', () => {
      const safety = intelligence.getSafetyCheck('squat', 5, 9)
      
      expect(safety).toBeDefined()
      expect(safety).toContain('Form may break down')
      expect(safety).toContain('last set')
    })

    it('should return null for invalid exercise', () => {
      const safety = intelligence.getSafetyCheck('invalid', 1, 10)
      
      expect(safety).toBeNull()
    })
  })
})

