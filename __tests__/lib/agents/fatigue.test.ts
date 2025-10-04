import { FatigueManagementSystem } from '@/lib/agents/fatigue'

describe('FatigueManagementSystem', () => {
  let system: FatigueManagementSystem

  beforeEach(() => {
    system = new FatigueManagementSystem()
  })

  describe('calculateACWR', () => {
    it('should calculate acute:chronic workload ratio correctly', () => {
      const recentSessions = [
        { volume: 5000, date: new Date() },
        { volume: 5500, date: new Date() },
        { volume: 6000, date: new Date() },
      ]

      const acwr = system.calculateACWR(recentSessions)
      
      expect(acwr).toBeGreaterThan(0)
      expect(acwr).toBeLessThan(5)
    })

    it('should return 0 for insufficient data', () => {
      const acwr = system.calculateACWR([])
      expect(acwr).toBe(0)
    })
  })

  describe('recommendDeload', () => {
    it('should recommend deload for high ACWR', () => {
      expect(system.recommendDeload(2.0)).toBe(true)
    })

    it('should not recommend deload for optimal ACWR', () => {
      expect(system.recommendDeload(1.2)).toBe(false)
    })

    it('should recommend deload for very low ACWR', () => {
      expect(system.recommendDeload(0.6)).toBe(true)
    })
  })

  describe('assessRecoveryReadiness', () => {
    it('should assess good recovery readiness', () => {
      const result = system.assessRecoveryReadiness(1.2, 8, 3)
      
      expect(result.ready).toBe(true)
      expect(result.recommendation.toLowerCase()).toContain('excellent')
    })

    it('should detect overtraining risk', () => {
      const result = system.assessRecoveryReadiness(1.8, 9, 2)
      
      // High ACWR (1.8) should trigger recommendation for rest
      expect(result.recommendation.toLowerCase()).toContain('risk')
    })

    it('should detect undertraining', () => {
      const result = system.assessRecoveryReadiness(0.7, 4, 8)
      
      expect(result.ready).toBe(true)
      // Low ACWR should trigger message about training load
      expect(result.recommendation.toLowerCase()).toContain('low')
    })
  })

  describe('suggestDeloadProtocol', () => {
    it('should suggest appropriate deload for high fatigue', () => {
      const protocol = system.suggestDeloadProtocol(1.8, 9)
      
      expect(protocol.volumeReduction).toBeGreaterThanOrEqual(0.4)
      expect(protocol.duration).toBeGreaterThanOrEqual(5)
    })

    it('should suggest mild deload for moderate fatigue', () => {
      const protocol = system.suggestDeloadProtocol(1.4, 7)
      
      expect(protocol.volumeReduction).toBeLessThan(0.4)
      expect(protocol.duration).toBeLessThan(7)
    })
  })
})

