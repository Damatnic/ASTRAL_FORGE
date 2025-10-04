import { describe, it, expect } from 'vitest'
import { AutoregulationSystem } from '@/lib/agents/autoregulation'

describe('Autoregulation System', () => {
  const autoregulation = new AutoregulationSystem()

  it('should correctly interpret RPE to RIR', () => {
    const interpretation = autoregulation.interpretRPE(8, 5)
    expect(interpretation.rir).toBe(2)
    expect(interpretation.fatigueLevel).toBe('moderate')
  })

  it('should calculate velocity loss correctly', () => {
    const velocityLoss = autoregulation.calculateVelocityLoss(0.8, 0.6)
    expect(velocityLoss).toBe(25) // 25% loss
  })

  it('should recommend stopping set when velocity loss exceeds threshold', () => {
    const shouldStop = autoregulation.shouldStopSet('hypertrophy', 26)
    expect(shouldStop).toBe(true)
  })

  it('should estimate 1RM based on weight, reps, and RPE', () => {
    const estimated1RM = autoregulation.estimate1RM(100, 5, 8)
    expect(estimated1RM).toBeGreaterThan(100)
  })

  it('should provide coaching feedback based on performance', () => {
    const feedback = autoregulation.analyzeSetPerformance(80, 80, 8, 8, 7.5)
    expect(feedback).toBeTruthy()
    expect(typeof feedback).toBe('string')
  })
})

