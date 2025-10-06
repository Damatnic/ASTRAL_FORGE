import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getPrograms, searchPrograms } from '@/lib/api/programs'

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search') || undefined
  const category = searchParams.get('category') || undefined
  const difficulty = searchParams.get('difficulty') || undefined
  const daysPerWeek = searchParams.get('daysPerWeek') ? parseInt(searchParams.get('daysPerWeek')!) : undefined
  
  const userId = session.user.id || session.user.email

  try {
    let programs

    if (search || category || difficulty || daysPerWeek) {
      programs = await searchPrograms(userId, {
        search,
        category,
        difficulty,
        daysPerWeek,
      })
    } else {
      programs = await getPrograms(userId)
    }

    return NextResponse.json({ programs })
  } catch (error) {
    console.error('Programs API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch programs' },
      { status: 500 }
    )
  }
}
