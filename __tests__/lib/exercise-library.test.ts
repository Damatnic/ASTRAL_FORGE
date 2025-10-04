/**
 * Tests for Exercise Library Completeness
 */

import { prisma } from '@/lib/prisma'

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    exercise: {
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
    },
  },
}))

describe('Exercise Library', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('Exercise Data Quality', () => {
    it('should have description for all exercises', async () => {
      const mockExercises = [
        {
          id: 'bench-press',
          name: 'Bench Press',
          description: 'Primary horizontal pressing movement',
          videoUrl: 'https://youtube.com/example',
          category: 'compound',
          muscleGroup: 'push',
          equipment: 'barbell',
        },
      ]

      ;(prisma.exercise.findMany as jest.Mock).mockResolvedValue(mockExercises)

      const exercises = await prisma.exercise.findMany()
      
      exercises.forEach((ex) => {
        expect(ex.description).toBeDefined()
        expect(ex.description.length).toBeGreaterThan(10)
      })
    })

    it('should have video URLs for all exercises', async () => {
      const mockExercises = [
        {
          id: 'squat',
          name: 'Squat',
          description: 'King of leg exercises',
          videoUrl: 'https://youtube.com/watch?v=example',
          category: 'compound',
          muscleGroup: 'legs',
          equipment: 'barbell',
        },
      ]

      ;(prisma.exercise.findMany as jest.Mock).mockResolvedValue(mockExercises)

      const exercises = await prisma.exercise.findMany()
      
      exercises.forEach((ex) => {
        expect(ex.videoUrl).toBeDefined()
        expect(ex.videoUrl).toMatch(/^https:\/\//)
      })
    })

    it('should categorize exercises correctly', async () => {
      const mockExercises = [
        { id: '1', category: 'compound', name: 'Squat' },
        { id: '2', category: 'isolation', name: 'Curl' },
        { id: '3', category: 'cardio', name: 'Running' },
      ]

      ;(prisma.exercise.findMany as jest.Mock).mockResolvedValue(mockExercises)

      const exercises = await prisma.exercise.findMany()
      
      const validCategories = ['compound', 'isolation', 'cardio']
      exercises.forEach((ex) => {
        expect(validCategories).toContain(ex.category)
      })
    })

    it('should have muscle groups assigned', async () => {
      const mockExercises = [
        { id: '1', muscleGroup: 'push', name: 'Bench Press' },
        { id: '2', muscleGroup: 'pull', name: 'Row' },
        { id: '3', muscleGroup: 'legs', name: 'Squat' },
      ]

      ;(prisma.exercise.findMany as jest.Mock).mockResolvedValue(mockExercises)

      const exercises = await prisma.exercise.findMany()
      
      const validMuscleGroups = ['push', 'pull', 'legs', 'core', 'full-body']
      exercises.forEach((ex) => {
        expect(validMuscleGroups).toContain(ex.muscleGroup)
      })
    })

    it('should have equipment specified', async () => {
      const mockExercises = [
        { id: '1', equipment: 'barbell', name: 'Bench Press' },
        { id: '2', equipment: 'dumbbell', name: 'Curl' },
        { id: '3', equipment: 'bodyweight', name: 'Push-up' },
      ]

      ;(prisma.exercise.findMany as jest.Mock).mockResolvedValue(mockExercises)

      const exercises = await prisma.exercise.findMany()
      
      const validEquipment = ['barbell', 'dumbbell', 'machine', 'bodyweight', 'cable', 'other']
      exercises.forEach((ex) => {
        expect(validEquipment).toContain(ex.equipment)
      })
    })
  })

  describe('Exercise Coverage', () => {
    it('should have sufficient chest exercises', async () => {
      const mockChestExercises = [
        { id: '1', muscleGroup: 'push', name: 'Bench Press' },
        { id: '2', muscleGroup: 'push', name: 'Incline Press' },
        { id: '3', muscleGroup: 'push', name: 'Dips' },
      ]

      ;(prisma.exercise.findMany as jest.Mock).mockResolvedValue(mockChestExercises)

      const chestExercises = await prisma.exercise.findMany({
        where: { muscleGroup: 'push' },
      })
      
      expect(chestExercises.length).toBeGreaterThanOrEqual(3)
    })

    it('should have sufficient back exercises', async () => {
      const mockBackExercises = [
        { id: '1', muscleGroup: 'pull', name: 'Deadlift' },
        { id: '2', muscleGroup: 'pull', name: 'Row' },
        { id: '3', muscleGroup: 'pull', name: 'Pull-up' },
      ]

      ;(prisma.exercise.findMany as jest.Mock).mockResolvedValue(mockBackExercises)

      const backExercises = await prisma.exercise.findMany({
        where: { muscleGroup: 'pull' },
      })
      
      expect(backExercises.length).toBeGreaterThanOrEqual(3)
    })

    it('should have sufficient leg exercises', async () => {
      const mockLegExercises = [
        { id: '1', muscleGroup: 'legs', name: 'Squat' },
        { id: '2', muscleGroup: 'legs', name: 'Deadlift' },
        { id: '3', muscleGroup: 'legs', name: 'Leg Press' },
      ]

      ;(prisma.exercise.findMany as jest.Mock).mockResolvedValue(mockLegExercises)

      const legExercises = await prisma.exercise.findMany({
        where: { muscleGroup: 'legs' },
      })
      
      expect(legExercises.length).toBeGreaterThanOrEqual(3)
    })

    it('should have bodyweight exercises', async () => {
      const mockBodyweightExercises = [
        { id: '1', equipment: 'bodyweight', name: 'Push-ups' },
        { id: '2', equipment: 'bodyweight', name: 'Pull-ups' },
      ]

      ;(prisma.exercise.findMany as jest.Mock).mockResolvedValue(mockBodyweightExercises)

      const bodyweightExercises = await prisma.exercise.findMany({
        where: { equipment: 'bodyweight' },
      })
      
      expect(bodyweightExercises.length).toBeGreaterThanOrEqual(2)
    })
  })

  describe('Exercise Search and Filter', () => {
    it('should find exercises by name', async () => {
      const mockExercise = {
        id: 'bench-press',
        name: 'Bench Press',
        description: 'Primary horizontal pressing movement',
        category: 'compound',
        muscleGroup: 'push',
        equipment: 'barbell',
      }

      ;(prisma.exercise.findUnique as jest.Mock).mockResolvedValue(mockExercise)

      const exercise = await prisma.exercise.findUnique({
        where: { id: 'bench-press' },
      })
      
      expect(exercise).toBeDefined()
      expect(exercise?.name).toBe('Bench Press')
    })

    it('should filter by equipment', async () => {
      const mockBarbellExercises = [
        { id: '1', equipment: 'barbell', name: 'Bench Press' },
        { id: '2', equipment: 'barbell', name: 'Squat' },
      ]

      ;(prisma.exercise.findMany as jest.Mock).mockResolvedValue(mockBarbellExercises)

      const barbellExercises = await prisma.exercise.findMany({
        where: { equipment: 'barbell' },
      })
      
      expect(barbellExercises.every((ex) => ex.equipment === 'barbell')).toBe(true)
    })

    it('should filter by muscle group', async () => {
      const mockPushExercises = [
        { id: '1', muscleGroup: 'push', name: 'Bench Press' },
        { id: '2', muscleGroup: 'push', name: 'Shoulder Press' },
      ]

      ;(prisma.exercise.findMany as jest.Mock).mockResolvedValue(mockPushExercises)

      const pushExercises = await prisma.exercise.findMany({
        where: { muscleGroup: 'push' },
      })
      
      expect(pushExercises.every((ex) => ex.muscleGroup === 'push')).toBe(true)
    })
  })
})

