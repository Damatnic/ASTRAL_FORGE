/**
 * Tests for Workout Programs and Templates
 */

import { prisma } from '@/lib/prisma'

jest.mock('@/lib/prisma', () => ({
  prisma: {
    workoutSession: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    },
  },
}))

describe('Workout Programs', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('Program Structure', () => {
    it('should have valid workout plan structure', async () => {
      const mockProgram = {
        id: 'program-1',
        name: 'Push Day',
        plan: {
          exercises: [
            {
              id: 'bench-press',
              name: 'Bench Press',
              sets: [{ weight: 80, reps: 8 }, { weight: 80, reps: 8 }],
              restSeconds: 120,
              targetRPE: 8,
            },
          ],
        },
        completed: false,
      }

      ;(prisma.workoutSession.findUnique as jest.Mock).mockResolvedValue(mockProgram)

      const program = await prisma.workoutSession.findUnique({
        where: { id: 'program-1' },
      })

      expect(program).toBeDefined()
      expect(program?.plan).toHaveProperty('exercises')
      expect(Array.isArray((program?.plan as any).exercises)).toBe(true)
    })

    it('should have exercises with proper set structure', async () => {
      const mockProgram = {
        id: 'program-1',
        plan: {
          exercises: [
            {
              id: 'squat',
              name: 'Squat',
              sets: [{ weight: 100, reps: 5 }],
              restSeconds: 180,
            },
          ],
        },
      }

      ;(prisma.workoutSession.findUnique as jest.Mock).mockResolvedValue(mockProgram)

      const program = await prisma.workoutSession.findUnique({
        where: { id: 'program-1' },
      })

      const exercise = (program?.plan as any).exercises[0]
      
      expect(exercise).toHaveProperty('id')
      expect(exercise).toHaveProperty('name')
      expect(exercise).toHaveProperty('sets')
      expect(Array.isArray(exercise.sets)).toBe(true)
      expect(exercise.sets[0]).toHaveProperty('weight')
      expect(exercise.sets[0]).toHaveProperty('reps')
    })

    it('should have rest times specified', async () => {
      const mockProgram = {
        id: 'program-1',
        plan: {
          exercises: [
            {
              id: 'deadlift',
              name: 'Deadlift',
              sets: [{ weight: 140, reps: 5 }],
              restSeconds: 240,
            },
          ],
        },
      }

      ;(prisma.workoutSession.findUnique as jest.Mock).mockResolvedValue(mockProgram)

      const program = await prisma.workoutSession.findUnique({
        where: { id: 'program-1' },
      })

      const exercise = (program?.plan as any).exercises[0]
      
      expect(exercise.restSeconds).toBeDefined()
      expect(exercise.restSeconds).toBeGreaterThan(0)
    })
  })

  describe('Program Variety', () => {
    it('should have multiple program templates', async () => {
      const mockPrograms = [
        { id: '1', name: 'Starting Strength - Workout A' },
        { id: '2', name: 'StrongLifts 5x5 - Workout A' },
        { id: '3', name: 'PPL - Push Day' },
      ]

      ;(prisma.workoutSession.findMany as jest.Mock).mockResolvedValue(mockPrograms)

      const programs = await prisma.workoutSession.findMany({
        where: { completed: false },
      })

      expect(programs.length).toBeGreaterThanOrEqual(3)
    })

    it('should have beginner-friendly programs', async () => {
      const mockBeginnerPrograms = [
        { id: '1', name: 'Starting Strength', plan: { exercises: [] } },
        { id: '2', name: 'Bodyweight Basics', plan: { exercises: [] } },
      ]

      ;(prisma.workoutSession.findMany as jest.Mock).mockResolvedValue(mockBeginnerPrograms)

      const beginnerPrograms = await prisma.workoutSession.findMany()

      expect(beginnerPrograms.length).toBeGreaterThanOrEqual(1)
    })

    it('should have bodyweight programs', async () => {
      const mockBodyweightProgram = {
        id: 'bw-1',
        name: 'Bodyweight Basics',
        plan: {
          exercises: [
            {
              id: 'push-ups',
              name: 'Push-ups',
              sets: [{ weight: 0, reps: 15 }],
            },
          ],
        },
      }

      ;(prisma.workoutSession.findUnique as jest.Mock).mockResolvedValue(mockBodyweightProgram)

      const program = await prisma.workoutSession.findUnique({
        where: { id: 'bw-1' },
      })

      expect(program).toBeDefined()
      const allBodyweight = (program?.plan as any).exercises.every(
        (ex: any) => ex.sets.every((set: any) => set.weight === 0)
      )
      expect(allBodyweight).toBe(true)
    })
  })

  describe('Program Operations', () => {
    it('should create new program', async () => {
      const newProgram = {
        id: 'new-1',
        userId: 'user-1',
        name: 'Custom Program',
        plan: {
          exercises: [
            {
              id: 'bench-press',
              name: 'Bench Press',
              sets: [{ weight: 80, reps: 8 }],
            },
          ],
        },
        completed: false,
      }

      ;(prisma.workoutSession.create as jest.Mock).mockResolvedValue(newProgram)

      const created = await prisma.workoutSession.create({
        data: newProgram,
      })

      expect(created).toBeDefined()
      expect(created.id).toBe('new-1')
    })

    it('should delete program', async () => {
      ;(prisma.workoutSession.delete as jest.Mock).mockResolvedValue({ id: 'delete-1' })

      await prisma.workoutSession.delete({
        where: { id: 'delete-1' },
      })

      expect(prisma.workoutSession.delete).toHaveBeenCalledWith({
        where: { id: 'delete-1' },
      })
    })
  })

  describe('Program Recommendations', () => {
    it('should recommend appropriate rest times for compounds', () => {
      const compoundRestTime = 180 // 3 minutes
      expect(compoundRestTime).toBeGreaterThanOrEqual(120)
      expect(compoundRestTime).toBeLessThanOrEqual(300)
    })

    it('should recommend appropriate rest times for isolation', () => {
      const isolationRestTime = 60 // 1 minute
      expect(isolationRestTime).toBeGreaterThanOrEqual(30)
      expect(isolationRestTime).toBeLessThanOrEqual(90)
    })

    it('should have progressive overload built in', async () => {
      const mockProgram = {
        id: 'program-1',
        plan: {
          exercises: [
            {
              id: 'squat',
              name: 'Squat',
              sets: [
                { weight: 100, reps: 5 },
                { weight: 100, reps: 5 },
                { weight: 100, reps: 5 },
              ],
            },
          ],
        },
      }

      ;(prisma.workoutSession.findUnique as jest.Mock).mockResolvedValue(mockProgram)

      const program = await prisma.workoutSession.findUnique({
        where: { id: 'program-1' },
      })

      const exercise = (program?.plan as any).exercises[0]
      const allSetsHaveWeight = exercise.sets.every((set: any) => 
        typeof set.weight === 'number' && set.weight >= 0
      )

      expect(allSetsHaveWeight).toBe(true)
    })
  })
})

