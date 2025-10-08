import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const muscleGroup = searchParams.get('muscleGroup')
    const equipment = searchParams.get('equipment')
    const availableOnly = searchParams.get('availableOnly') === 'true'

    // Build where clause
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {}

    if (category) {
      where.category = category
    }

    if (muscleGroup) {
      where.muscleGroup = muscleGroup
    }

    if (equipment) {
      where.equipment = equipment
    }

    // If filtering by available equipment, get user's equipment first
    let exerciseIds: string[] | undefined

    if (availableOnly) {
      const session = await getServerSession(authOptions)
      
      if (session?.user?.email) {
        const user = await prisma.user.findUnique({
          where: { email: session.user.email },
          select: { id: true }
        })

        if (user) {
          // Get user's equipment
          const userEquipment = await prisma.userEquipment.findMany({
            where: { userId: user.id },
            select: { equipmentId: true }
          })

          const userEquipmentIds = userEquipment.map(e => e.equipmentId)

          // Get exercises that only require user's equipment
          const exercisesWithEquipment = await prisma.exercise.findMany({
            include: {
              equipmentLinks: {
                include: {
                  equipment: true
                }
              }
            }
          })

          // Filter exercises where all required equipment is in user's inventory
          const availableExercises = exercisesWithEquipment.filter(exercise => {
            // If no equipment required, it's available
            if (exercise.equipmentLinks.length === 0) {
              return true
            }

            // Check if all required equipment is available
            const requiredEquipmentIds = exercise.equipmentLinks
              .filter(link => link.required)
              .map(link => link.equipmentId)

            return requiredEquipmentIds.every(id => userEquipmentIds.includes(id))
          })

          exerciseIds = availableExercises.map(e => e.id)
        }
      }
    }

    // Add exercise ID filter if we have filtered by equipment availability
    if (exerciseIds !== undefined) {
      where.id = { in: exerciseIds }
    }

    const exercises = await prisma.exercise.findMany({
      where,
      include: {
        equipmentLinks: {
          include: {
            equipment: true
          }
        }
      },
      orderBy: {
        name: 'asc',
      },
    })

    return NextResponse.json(exercises)
  } catch (error) {
    console.error('Error fetching exercises:', error)
    return NextResponse.json(
      { error: 'Failed to fetch exercises' },
      { status: 500 }
    )
  }
}


