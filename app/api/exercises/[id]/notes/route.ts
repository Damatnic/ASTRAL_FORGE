import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { handleApiError } from '@/lib/error-handler'

export const dynamic = 'force-dynamic'

// GET /api/exercises/[id]/notes - Get notes for an exercise
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // For demo, using hardcoded user
    const user = await prisma.user.findUnique({
      where: { email: 'demo@astralpower.app' }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const notes = await prisma.exerciseNote.findMany({
      where: {
        userId: user.id,
        exerciseId: params.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(notes)
  } catch (error) {
    return handleApiError(error)
  }
}

// POST /api/exercises/[id]/notes - Add a note for an exercise
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // For demo, using hardcoded user
    const user = await prisma.user.findUnique({
      where: { email: 'demo@astralpower.app' }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()
    const { content, noteType, severity } = body

    if (!content || !noteType) {
      return NextResponse.json(
        { error: 'Content and noteType are required' },
        { status: 400 }
      )
    }

    const note = await prisma.exerciseNote.create({
      data: {
        userId: user.id,
        exerciseId: params.id,
        content,
        noteType,
        severity: severity || null,
      },
    })

    return NextResponse.json(note)
  } catch (error) {
    return handleApiError(error)
  }
}

// DELETE /api/exercises/[id]/notes/[noteId] - Delete a note
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const noteId = searchParams.get('noteId')

    if (!noteId) {
      return NextResponse.json({ error: 'Note ID required' }, { status: 400 })
    }

    // For demo, using hardcoded user
    const user = await prisma.user.findUnique({
      where: { email: 'demo@astralpower.app' }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Verify the note belongs to the user
    const note = await prisma.exerciseNote.findUnique({
      where: { id: noteId },
    })

    if (!note || note.userId !== user.id) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 })
    }

    await prisma.exerciseNote.delete({
      where: { id: noteId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return handleApiError(error)
  }
}
