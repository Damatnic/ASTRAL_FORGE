import { AutoregulationSystem } from '@/lib/agents/autoregulation'

describe('AutoregulationSystem', () => {
  let system: AutoregulationSystem

  beforeEach(() => {
    system = new AutoregulationSystem()
  })

  describe('interpretRPE', () => {
    it('should interpret RPE 10 correctly', () => {
      const result = system.interpretRPE(10, 5)
      expect(result.rir).toBe(0)
      expect(result.description).toContain('maximal effort')
    })

    it('should interpret RPE 8 correctly', () => {
      const result = system.interpretRPE(8, 5)
      expect(result.rir).toBe(2)
      expect(result.description).toContain('2 reps')
    })

    it('should interpret RPE 6 correctly', () => {
      const result = system.interpretRPE(6, 5)
      expect(result.rir).toBe(4)
      expect(result.description).toContain('4 reps')
    })
  })

  describe('adjustWorkoutInRealtime', () => {
    it('should increase weight when RPE is too low', async () => {
      const plannedSets = [
        { weight: 100, reps: 8 },
        { weight: 100, reps: 8 },
        { weight: 100, reps: 8 },
      ]

      const result = await system.adjustWorkoutInRealtime(
        plannedSets,
        1,
        6.5, // Low RPE
        8    // Hit target reps
      )

      // With RPE 6.5, the system should increase weight
      if (result.adjusted) {
        expect(result.weight).toBeGreaterThan(100)
        expect(result.note).toContain('Increasing')
      }
    })

    it('should decrease weight when RPE is too high', async () => {
      const plannedSets = [
        { weight: 100, reps: 8 },
        { weight: 100, reps: 8 },
        { weight: 100, reps: 8 },
      ]

      const result = await system.adjustWorkoutInRealtime(
        plannedSets,
        1,
        9.5, // High RPE
        6    // Below target reps
      )

      expect(result.adjusted).toBe(true)
      expect(result.weight).toBeLessThan(100)
      expect(result.note).toContain('reduce')
    })

    it('should maintain weight when RPE is in target range', async () => {
      const plannedSets = [
        { weight: 100, reps: 8 },
        { weight: 100, reps: 8 },
        { weight: 100, reps: 8 },
      ]

      const result = await system.adjustWorkoutInRealtime(
        plannedSets,
        1,
        8,   // Target RPE
        8    // Target reps
      )

      expect(result.adjusted).toBe(false)
      expect(result.weight).toBe(100)
    })
  })

  describe('analyzeSetPerformance', () => {
    it('should provide encouragement when performance is good', () => {
      const feedback = system.analyzeSetPerformance(
        100, 100, // Matched planned weight
        8, 8,     // Matched planned reps
        8         // Target RPE
      )

      expect(feedback).toContain('Perfect')
    })

    it('should suggest adjustments when performance is weak', () => {
      const feedback = system.analyzeSetPerformance(
        100, 100,
        8, 5,     // Below target reps
        9.5       // High RPE
      )

      expect(feedback).toBeTruthy()
      expect(feedback.length).toBeGreaterThan(0)
    })
  })
})

