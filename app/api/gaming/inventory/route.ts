import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { InventorySystem } from '@/lib/inventory-system'

/**
 * GET /api/gaming/inventory
 * Get user's inventory (programs, exercises, consumables)
 */
export async function GET() {
  try {
    // Get demo user
    const user = await prisma.user.findUnique({
      where: { email: 'demo@astralforge.app' },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get user's inventory
    const inventory = await InventorySystem.getUserInventory(prisma, user.id)

    // Sort by rarity
    inventory.programs = InventorySystem.sortByRarity(inventory.programs)
    inventory.exercises = InventorySystem.sortByRarity(inventory.exercises)

    // Calculate summary
    const summary = {
      programs: {
        total: inventory.programs.length,
        common: inventory.programs.filter((i) => i.rarity === 'common').length,
        uncommon: inventory.programs.filter((i) => i.rarity === 'uncommon').length,
        rare: inventory.programs.filter((i) => i.rarity === 'rare').length,
        epic: inventory.programs.filter((i) => i.rarity === 'epic').length,
        legendary: inventory.programs.filter((i) => i.rarity === 'legendary').length,
      },
      exercises: {
        total: inventory.exercises.length,
        unlocked: inventory.exercises.filter((i) => !i.isLocked).length,
        locked: inventory.exercises.filter((i) => i.isLocked).length,
      },
    }

    return NextResponse.json({
      inventory,
      summary,
    })
  } catch (error) {
    console.error('Error fetching inventory:', error)
    return NextResponse.json(
      { error: 'Failed to fetch inventory' },
      { status: 500 }
    )
  }
}

