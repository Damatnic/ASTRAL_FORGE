import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/user/equipment
 * Get user's available equipment
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || 'demo-user-id'
    const location = searchParams.get('location') || 'default'

    const userEquipment = await prisma.userEquipment.findMany({
      where: {
        userId,
        location,
      },
      include: {
        equipment: true,
      },
    })

    return NextResponse.json(userEquipment)
  } catch (error) {
    console.error('Error fetching user equipment:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user equipment' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/user/equipment
 * Add equipment to user's profile
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId = 'demo-user-id', equipmentNames, location = 'default' } = body

    if (!equipmentNames || !Array.isArray(equipmentNames)) {
      return NextResponse.json(
        { error: 'equipmentNames array is required' },
        { status: 400 }
      )
    }

    // First, ensure all equipment exists in the database
    // For now, we'll assume equipment is pre-seeded
    // In production, you'd seed the equipment table first

    // Get equipment IDs
    const equipment = await prisma.equipment.findMany({
      where: {
        name: {
          in: equipmentNames,
        },
      },
    })

    if (equipment.length === 0) {
      return NextResponse.json(
        { error: 'No equipment found. Please seed equipment data first.' },
        { status: 400 }
      )
    }

    // Delete existing equipment for this location
    await prisma.userEquipment.deleteMany({
      where: {
        userId,
        location,
      },
    })

    // Create new equipment assignments
    const userEquipment = await prisma.userEquipment.createMany({
      data: equipment.map(eq => ({
        userId,
        equipmentId: eq.id,
        location,
        quantity: 1,
      })),
    })

    return NextResponse.json({
      success: true,
      count: userEquipment.count,
    })
  } catch (error) {
    console.error('Error saving user equipment:', error)
    return NextResponse.json(
      { error: 'Failed to save user equipment' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/user/equipment
 * Remove equipment from user's profile
 */
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || 'demo-user-id'
    const equipmentId = searchParams.get('equipmentId')
    const location = searchParams.get('location') || 'default'

    if (!equipmentId) {
      return NextResponse.json(
        { error: 'equipmentId is required' },
        { status: 400 }
      )
    }

    await prisma.userEquipment.delete({
      where: {
        userId_equipmentId_location: {
          userId,
          equipmentId,
          location,
        },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting user equipment:', error)
    return NextResponse.json(
      { error: 'Failed to delete user equipment' },
      { status: 500 }
    )
  }
}
