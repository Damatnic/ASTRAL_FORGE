/**
 * Tests for utility functions
 */

describe('Utility Functions', () => {
  describe('Date utilities', () => {
    it('should calculate days between dates', () => {
      const date1 = new Date('2025-01-01')
      const date2 = new Date('2025-01-08')
      
      const daysDiff = Math.floor((date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24))
      
      expect(daysDiff).toBe(7)
    })

    it('should format dates correctly', () => {
      const date = new Date('2025-01-15')
      const formatted = date.toISOString().split('T')[0]
      
      expect(formatted).toBe('2025-01-15')
    })
  })

  describe('Weight calculations', () => {
    it('should convert kg to lbs', () => {
      const kg = 100
      const lbs = Math.round(kg * 2.20462)
      
      expect(lbs).toBe(220)
    })

    it('should convert lbs to kg', () => {
      const lbs = 220
      const kg = Math.round(lbs / 2.20462)
      
      expect(kg).toBe(100)
    })

    it('should calculate estimated 1RM using Brzycki formula', () => {
      const weight = 100
      const reps = 8
      const estimated1RM = Math.round(weight * (1 + reps / 30))
      
      expect(estimated1RM).toBe(127)
    })
  })

  describe('Volume calculations', () => {
    it('should calculate set volume', () => {
      const weight = 100
      const reps = 8
      const volume = weight * reps
      
      expect(volume).toBe(800)
    })

    it('should calculate total workout volume', () => {
      const sets = [
        { weight: 100, reps: 8 },
        { weight: 100, reps: 7 },
        { weight: 100, reps: 6 },
      ]
      
      const totalVolume = sets.reduce((sum, set) => sum + (set.weight * set.reps), 0)
      
      expect(totalVolume).toBe(2100)
    })
  })

  describe('Array utilities', () => {
    it('should find average', () => {
      const numbers = [1, 2, 3, 4, 5]
      const avg = numbers.reduce((sum, n) => sum + n, 0) / numbers.length
      
      expect(avg).toBe(3)
    })

    it('should find max', () => {
      const numbers = [1, 5, 3, 9, 2]
      const max = Math.max(...numbers)
      
      expect(max).toBe(9)
    })

    it('should group by date', () => {
      const items = [
        { date: '2025-01-01', value: 1 },
        { date: '2025-01-01', value: 2 },
        { date: '2025-01-02', value: 3 },
      ]
      
      const grouped = items.reduce((acc, item) => {
        if (!acc[item.date]) acc[item.date] = []
        acc[item.date].push(item)
        return acc
      }, {} as Record<string, typeof items>)
      
      expect(Object.keys(grouped)).toHaveLength(2)
      expect(grouped['2025-01-01']).toHaveLength(2)
    })
  })
})

