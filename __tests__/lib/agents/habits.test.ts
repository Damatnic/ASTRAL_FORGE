import { HabitFormationSystem } from '@/lib/agents/habits'

describe('HabitFormationSystem', () => {
  let system: HabitFormationSystem

  beforeEach(() => {
    system = new HabitFormationSystem()
  })

  describe('updateStreak', () => {
    it('should increment streak for consecutive days', () => {
      const lastWorkout = new Date()
      lastWorkout.setDate(lastWorkout.getDate() - 1)

      const result = system.updateStreak(5, lastWorkout)
      
      expect(result.current).toBe(6)
      expect(result.broken).toBe(false)
    })

    it('should break streak after 2+ days', () => {
      const lastWorkout = new Date()
      lastWorkout.setDate(lastWorkout.getDate() - 3)

      const result = system.updateStreak(5, lastWorkout)
      
      expect(result.current).toBe(1)
      expect(result.broken).toBe(true)
    })

    it('should maintain streak for same day', () => {
      const lastWorkout = new Date()

      const result = system.updateStreak(5, lastWorkout)
      
      expect(result.current).toBe(5)
      expect(result.broken).toBe(false)
    })
  })

  describe('checkAchievements', () => {
    it('should unlock first workout achievement', () => {
      const achievements = system.checkAchievements(
        { totalWorkouts: 1, totalVolume: 5000, streak: 1, prs: 0 }
      )

      const firstWorkout = achievements.find(a => a.title === 'First Steps')
      expect(firstWorkout).toBeDefined()
    })

    it('should unlock volume milestone', () => {
      const achievements = system.checkAchievements(
        { totalWorkouts: 50, totalVolume: 100000, streak: 5, prs: 10 }
      )

      const volumeAchievement = achievements.find(a => a.category === 'volume')
      expect(volumeAchievement).toBeDefined()
    })

    it('should unlock consistency achievement', () => {
      const achievements = system.checkAchievements(
        { totalWorkouts: 10, totalVolume: 50000, streak: 7, prs: 3 }
      )

      const consistencyAchievement = achievements.find(a => a.title === 'Week Warrior')
      expect(consistencyAchievement).toBeDefined()
    })
  })

  describe('generateMotivationalMessage', () => {
    it('should generate encouraging message', () => {
      const message = system.generateMotivationalMessage('positive')
      
      expect(message).toBeTruthy()
      expect(typeof message).toBe('string')
    })

    it('should generate supportive message', () => {
      const message = system.generateMotivationalMessage('supportive')
      
      expect(message).toBeTruthy()
      expect(typeof message).toBe('string')
    })
  })
})

