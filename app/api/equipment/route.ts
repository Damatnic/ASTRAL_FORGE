import { NextResponse } from 'next/server'
import { equipmentSeedData } from '@/lib/equipment-data'

// Force dynamic rendering for API route
export const dynamic = 'force-dynamic'

/**
 * GET /api/equipment
 * Returns list of all available equipment
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    let equipment = equipmentSeedData

    // Filter by category
    if (category) {
      equipment = equipment.filter(e => e.category === category)
    }

    // Filter by search query
    if (search) {
      const query = search.toLowerCase()
      equipment = equipment.filter(e =>
        e.name.toLowerCase().includes(query) ||
        e.description?.toLowerCase().includes(query)
      )
    }

    return NextResponse.json(equipment)
  } catch (error) {
    console.error('Error fetching equipment:', error)
    return NextResponse.json(
      { error: 'Failed to fetch equipment' },
      { status: 500 }
    )
  }
}
