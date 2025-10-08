import { GET, POST } from '@/app/api/metrics/route'
import { prisma } from '@/lib/prisma'

// Mock next/server BEFORE importing route
jest.mock('next/server', () => ({
  NextResponse: {
    json: (data: any, init?: { status?: number }) => ({
      json: async () => data,
      status: init?.status || 200,
    }),
  },
}))

// Mock Request constructor for Node.js environment
global.Request = class Request {
  url: string
  method: string
  body: any
  
  constructor(url: string, init?: { method?: string; body?: string }) {
    this.url = url
    this.method = init?.method || 'GET'
    this.body = init?.body
  }
  
  async json() {
    return JSON.parse(this.body || '{}')
  }
} as any

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
    bodyMetric: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    achievement: {
      create: jest.fn(),
    },
  },
}))

describe('Body Metrics API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/metrics', () => {
    it('should return user metrics successfully', async () => {
      const mockUser = { id: '1', email: 'demo@astralforge.app' }
      const mockMetrics = [
        {
          id: '1',
          date: new Date('2024-01-01'),
          weight: 75,
          bodyFat: 15,
          waist: 80,
          chest: 100,
        },
        {
          id: '2',
          date: new Date('2024-01-15'),
          weight: 74,
          bodyFat: 14.5,
          waist: 79,
          chest: 101,
        },
      ]

      ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser)
      ;(prisma.bodyMetric.findMany as jest.Mock).mockResolvedValue(mockMetrics)

      const request = new Request('http://localhost:3000/api/metrics')
      const response = await GET(request)
      const data = await response.json()

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'demo@astralforge.app' }
      })
      expect(prisma.bodyMetric.findMany).toHaveBeenCalledWith({
        where: { userId: '1' },
        orderBy: { date: 'desc' },
        take: 50,
      })
      expect(data).toEqual(mockMetrics)
    })

    it('should return 404 if user not found', async () => {
      ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(null)

      const request = new Request('http://localhost:3000/api/metrics')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('User not found')
    })
  })

  describe('POST /api/metrics', () => {
    it('should create new metric entry', async () => {
      const mockUser = { id: '1', email: 'demo@astralforge.app' }
      const newMetric = {
        date: '2024-01-01',
        weight: 75,
        bodyFat: 15,
        waist: 80,
        notes: 'Feeling good',
      }
      
      const createdMetric = {
        id: 'new-metric',
        userId: '1',
        ...newMetric,
        date: new Date(newMetric.date),
      }

      ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser)
      ;(prisma.bodyMetric.findFirst as jest.Mock).mockResolvedValue(null)
      ;(prisma.bodyMetric.create as jest.Mock).mockResolvedValue(createdMetric)
      ;(prisma.bodyMetric.findMany as jest.Mock).mockResolvedValue([])

      const request = new Request('http://localhost:3000/api/metrics', {
        method: 'POST',
        body: JSON.stringify(newMetric),
      })
      const response = await POST(request)
      const data = await response.json()

      expect(prisma.bodyMetric.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: '1',
          weight: 75,
          bodyFat: 15,
          waist: 80,
          notes: 'Feeling good',
        })
      })
      expect(data).toEqual(createdMetric)
    })

    it('should update existing metric for same date', async () => {
      const mockUser = { id: '1', email: 'demo@astralforge.app' }
      const existingMetric = {
        id: 'existing',
        userId: '1',
        date: new Date('2024-01-01'),
        weight: 74,
      }
      
      const updateData = {
        date: '2024-01-01',
        weight: 75,
        bodyFat: 15,
      }

      const updatedMetric = { ...existingMetric, ...updateData }

      ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser)
      ;(prisma.bodyMetric.findFirst as jest.Mock).mockResolvedValue(existingMetric)
      ;(prisma.bodyMetric.update as jest.Mock).mockResolvedValue(updatedMetric)
      ;(prisma.bodyMetric.findMany as jest.Mock).mockResolvedValue([])

      const request = new Request('http://localhost:3000/api/metrics', {
        method: 'POST',
        body: JSON.stringify(updateData),
      })
      const response = await POST(request)
      const data = await response.json()

      expect(prisma.bodyMetric.update).toHaveBeenCalledWith({
        where: { id: 'existing' },
        data: expect.objectContaining({
          weight: 75,
          bodyFat: 15,
        })
      })
      expect(data.weight).toBe(75)
    })

    it('should create weight loss achievement', async () => {
      const mockUser = { id: '1', email: 'demo@astralforge.app' }
      const previousMetric = {
        id: 'prev',
        weight: 80,
        date: new Date('2023-12-01'),
      }
      
      const newMetric = {
        date: '2024-01-01',
        weight: 74, // Lost 6kg
      }

      ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser)
      ;(prisma.bodyMetric.findFirst as jest.Mock).mockResolvedValue(null)
      ;(prisma.bodyMetric.create as jest.Mock).mockResolvedValue({ id: 'new', ...newMetric })
      ;(prisma.bodyMetric.findMany as jest.Mock).mockResolvedValue([previousMetric])

      const request = new Request('http://localhost:3000/api/metrics', {
        method: 'POST',
        body: JSON.stringify(newMetric),
      })
      await POST(request)

      expect(prisma.achievement.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: '1',
          type: 'transformation',
          title: 'Weight Loss Milestone',
          description: 'Lost 6.0kg!',
        })
      })
    })

    it('should create weight gain achievement', async () => {
      const mockUser = { id: '1', email: 'demo@astralforge.app' }
      const previousMetric = {
        id: 'prev',
        weight: 70,
        date: new Date('2023-12-01'),
      }
      
      const newMetric = {
        date: '2024-01-01',
        weight: 76, // Gained 6kg
      }

      ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser)
      ;(prisma.bodyMetric.findFirst as jest.Mock).mockResolvedValue(null)
      ;(prisma.bodyMetric.create as jest.Mock).mockResolvedValue({ id: 'new', ...newMetric })
      ;(prisma.bodyMetric.findMany as jest.Mock).mockResolvedValue([previousMetric])

      const request = new Request('http://localhost:3000/api/metrics', {
        method: 'POST',
        body: JSON.stringify(newMetric),
      })
      await POST(request)

      expect(prisma.achievement.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: '1',
          type: 'transformation',
          title: 'Weight Gain Milestone',
          description: 'Gained 6.0kg!',
        })
      })
    })
  })
})
