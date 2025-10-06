/**
 * Equipment Ownership System
 * 
 * Manages user's owned equipment across different locations (home/gym/travel).
 * Replaces random loot drops with practical equipment tracking.
 */

import { PrismaClient, EquipmentCategory } from '@prisma/client'

export interface EquipmentLocation {
  home: EquipmentItem[]
  gym: EquipmentItem[]
  travel: EquipmentItem[]
}

export interface EquipmentItem {
  id: string
  name: string
  category: EquipmentCategory
  quantity: number
  location: string
  notes?: string
  addedAt: Date
}

export interface EquipmentOwnershipSummary {
  totalItems: number
  byLocation: {
    home: number
    gym: number
    travel: number
  }
  byCategory: Record<EquipmentCategory, number>
  availableExercises: number
  missingRecommendations: string[]
}

export class EquipmentOwnershipSystem {
  /**
   * Get all equipment owned by user
   */
  static async getUserEquipment(
    prisma: PrismaClient,
    userId: string
  ): Promise<EquipmentLocation> {
    const userEquipment = await prisma.userEquipment.findMany({
      where: { userId },
      include: {
        equipment: true,
      },
    })

    const locations: EquipmentLocation = {
      home: [],
      gym: [],
      travel: [],
    }

    userEquipment.forEach(ue => {
      const location = ue.location as keyof EquipmentLocation
      if (location in locations) {
        locations[location].push({
          id: ue.equipment.id,
          name: ue.equipment.name,
          category: ue.equipment.category as EquipmentCategory,
          quantity: ue.quantity,
          location: ue.location,
          notes: ue.notes || undefined,
          addedAt: ue.createdAt,
        })
      }
    })

    return locations
  }

  /**
   * Add equipment to user's ownership
   */
  static async addEquipment(
    prisma: PrismaClient,
    userId: string,
    equipmentId: string,
    location: 'home' | 'gym' | 'travel' = 'home',
    quantity: number = 1,
    notes?: string
  ): Promise<void> {
    // Check if equipment exists
    const equipment = await prisma.equipment.findUnique({
      where: { id: equipmentId },
    })

    if (!equipment) {
      throw new Error(`Equipment not found: ${equipmentId}`)
    }

    // Upsert user equipment
    await prisma.userEquipment.upsert({
      where: {
        userId_equipmentId_location: {
          userId,
          equipmentId,
          location,
        },
      },
      create: {
        userId,
        equipmentId,
        location,
        quantity,
        notes,
      },
      update: {
        quantity,
        notes,
      },
    })
  }

  /**
   * Remove equipment from user's ownership
   */
  static async removeEquipment(
    prisma: PrismaClient,
    userId: string,
    equipmentId: string,
    location: 'home' | 'gym' | 'travel'
  ): Promise<void> {
    await prisma.userEquipment.delete({
      where: {
        userId_equipmentId_location: {
          userId,
          equipmentId,
          location,
        },
      },
    })
  }

  /**
   * Update equipment quantity
   */
  static async updateQuantity(
    prisma: PrismaClient,
    userId: string,
    equipmentId: string,
    location: 'home' | 'gym' | 'travel',
    quantity: number
  ): Promise<void> {
    if (quantity <= 0) {
      await this.removeEquipment(prisma, userId, equipmentId, location)
      return
    }

    await prisma.userEquipment.update({
      where: {
        userId_equipmentId_location: {
          userId,
          equipmentId,
          location,
        },
      },
      data: { quantity },
    })
  }

  /**
   * Get ownership summary statistics
   */
  static async getOwnershipSummary(
    prisma: PrismaClient,
    userId: string
  ): Promise<EquipmentOwnershipSummary> {
    const locations = await this.getUserEquipment(prisma, userId)
    
    const allEquipment = [
      ...locations.home,
      ...locations.gym,
      ...locations.travel,
    ]

    const byLocation = {
      home: locations.home.length,
      gym: locations.gym.length,
      travel: locations.travel.length,
    }

    const byCategory: Record<string, number> = {}
    allEquipment.forEach(eq => {
      byCategory[eq.category] = (byCategory[eq.category] || 0) + 1
    })

    // Get available exercises (simplified - would need full exercise database)
    const availableExercises = await this.getAvailableExerciseCount(prisma, userId)

    // Get missing recommendations
    const missingRecommendations = this.getMissingRecommendations(allEquipment)

    return {
      totalItems: allEquipment.length,
      byLocation,
      byCategory: byCategory as Record<EquipmentCategory, number>,
      availableExercises,
      missingRecommendations,
    }
  }

  /**
   * Check if user can perform an exercise
   */
  static async canPerformExercise(
    prisma: PrismaClient,
    userId: string,
    exerciseId: string
  ): Promise<boolean> {
    // Get exercise equipment requirements
    const exerciseEquipment = await prisma.exerciseEquipment.findMany({
      where: { 
        exerciseId,
        required: true, // Only check required equipment
      },
      include: {
        equipment: true,
      },
    })

    // If no equipment required, user can perform it
    if (exerciseEquipment.length === 0) {
      return true
    }

    // Get user's equipment
    const userEquipment = await prisma.userEquipment.findMany({
      where: { userId },
      select: { equipmentId: true },
    })

    const userEquipmentIds = new Set(userEquipment.map(ue => ue.equipmentId))

    // Check if user has all required equipment
    return exerciseEquipment.every(ee => userEquipmentIds.has(ee.equipmentId))
  }

  /**
   * Get exercises user can perform with owned equipment
   */
  static async getAvailableExercises(
    prisma: PrismaClient,
    userId: string
  ): Promise<string[]> {
    // Get all exercises
    const exercises = await prisma.exercise.findMany({
      select: { id: true },
    })

    // Filter to only those user can perform
    const available: string[] = []
    
    for (const exercise of exercises) {
      const canPerform = await this.canPerformExercise(prisma, userId, exercise.id)
      if (canPerform) {
        available.push(exercise.id)
      }
    }

    return available
  }

  /**
   * Get count of available exercises (more efficient than full list)
   */
  private static async getAvailableExerciseCount(
    prisma: PrismaClient,
    userId: string
  ): Promise<number> {
    const available = await this.getAvailableExercises(prisma, userId)
    return available.length
  }

  /**
   * Get missing equipment needed for a specific workout
   * Simplified version - returns equipment names needed
   */
  static async getMissingForWorkout(
    prisma: PrismaClient,
    userId: string,
    exerciseIds: string[]
  ): Promise<EquipmentItem[]> {
    // Get user's equipment
    const userEquipment = await prisma.userEquipment.findMany({
      where: { userId },
      select: { equipmentId: true },
    })

    const userEquipmentIds = new Set(userEquipment.map(ue => ue.equipmentId))

    // Find missing equipment for these exercises
    const missing = new Set<string>()
    
    for (const exerciseId of exerciseIds) {
      const requiredEquipment = await prisma.exerciseEquipment.findMany({
        where: { 
          exerciseId,
          required: true,
        },
        select: { equipmentId: true },
      })

      requiredEquipment.forEach(eq => {
        if (!userEquipmentIds.has(eq.equipmentId)) {
          missing.add(eq.equipmentId)
        }
      })
    }

    // Convert to EquipmentItem array
    const missingEquipment = await prisma.equipment.findMany({
      where: {
        id: { in: Array.from(missing) },
      },
    })

    return missingEquipment.map(eq => ({
      id: eq.id,
      name: eq.name,
      category: eq.category as EquipmentCategory,
      quantity: 1,
      location: 'needed',
      addedAt: new Date(),
    }))
  }

  /**
   * Get recommended equipment based on owned items
   */
  private static getMissingRecommendations(
    ownedEquipment: EquipmentItem[]
  ): string[] {
    const recommendations: string[] = []
    const ownedNames = new Set(ownedEquipment.map(eq => eq.name.toLowerCase()))

    // Essential recommendations
    if (!ownedNames.has('barbell')) {
      recommendations.push('Olympic Barbell - Essential for compound lifts')
    }
    if (!ownedNames.has('dumbbells')) {
      recommendations.push('Adjustable Dumbbells - Versatile for many exercises')
    }
    if (!ownedNames.has('pull-up bar') && !ownedNames.has('power rack')) {
      recommendations.push('Pull-up Bar - Essential for back training')
    }
    if (!ownedNames.has('bench')) {
      recommendations.push('Adjustable Bench - Needed for pressing variations')
    }
    if (!ownedNames.has('power rack') && !ownedNames.has('squat rack')) {
      recommendations.push('Power Rack - Safe for heavy squats/bench')
    }

    // Weight recommendations
    const hasWeights = ownedEquipment.some(eq => 
      eq.name.toLowerCase().includes('plate') || 
      eq.name.toLowerCase().includes('weight')
    )
    if (!hasWeights && (ownedNames.has('barbell') || ownedNames.has('dumbbells'))) {
      recommendations.push('Weight Plates - Add resistance to your training')
    }

    return recommendations.slice(0, 5) // Top 5 recommendations
  }

  /**
   * Bulk add common home gym setup
   */
  static async addHomeGymEssentials(
    prisma: PrismaClient,
    userId: string
  ): Promise<void> {
    const essentials = [
      'Olympic Barbell',
      'Adjustable Dumbbells',
      'Power Rack',
      'Adjustable Bench',
      'Pull-up Bar',
    ]

    for (const equipmentName of essentials) {
      const equipment = await prisma.equipment.findFirst({
        where: { name: equipmentName },
      })

      if (equipment) {
        await this.addEquipment(prisma, userId, equipment.id, 'home', 1)
      }
    }
  }

  /**
   * Bulk add commercial gym equipment
   */
  static async addCommercialGymAccess(
    prisma: PrismaClient,
    userId: string
  ): Promise<void> {
    // Mark user as having access to all equipment at gym location
    const allEquipment = await prisma.equipment.findMany()

    for (const equipment of allEquipment) {
      await this.addEquipment(
        prisma,
        userId,
        equipment.id,
        'gym',
        1,
        'Available at gym'
      )
    }
  }
}
