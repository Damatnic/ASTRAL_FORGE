import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { handleApiError } from '@/lib/error-handler'

export const dynamic = 'force-dynamic'

// GET /api/progress/photos - Get progress photos
export async function GET(request: Request) {
  try {
    // For demo, using hardcoded user
    const user = await prisma.user.findUnique({
      where: { email: 'demo@astralforge.app' }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const photos = await prisma.progressPhoto.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        date: 'desc',
      },
    })

    return NextResponse.json(photos)
  } catch (error) {
    return handleApiError(error)
  }
}

// POST /api/progress/photos - Add progress photo
export async function POST(request: Request) {
  try {
    // For demo, using hardcoded user
    const user = await prisma.user.findUnique({
      where: { email: 'demo@astralforge.app' }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()
    const { date, photoUrl, photoType, weight, bodyFat, notes } = body

    if (!date || !photoUrl || !photoType) {
      return NextResponse.json(
        { error: 'Date, photo URL, and photo type are required' },
        { status: 400 }
      )
    }

    const photo = await prisma.progressPhoto.create({
      data: {
        userId: user.id,
        date: new Date(date),
        photoUrl,
        photoType,
        weight: weight || null,
        bodyFat: bodyFat || null,
        notes: notes || null,
      },
    })

    return NextResponse.json(photo)
  } catch (error) {
    return handleApiError(error)
  }
}

// DELETE /api/progress/photos/[id]
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const photoId = searchParams.get('id')

    if (!photoId) {
      return NextResponse.json({ error: 'Photo ID required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: 'demo@astralforge.app' }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Verify photo belongs to user
    const photo = await prisma.progressPhoto.findUnique({
      where: { id: photoId },
    })

    if (!photo || photo.userId !== user.id) {
      return NextResponse.json({ error: 'Photo not found' }, { status: 404 })
    }

    await prisma.progressPhoto.delete({
      where: { id: photoId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return handleApiError(error)
  }
}
