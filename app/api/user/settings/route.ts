import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'demo@astralforge.app' },
      include: { profile: true },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { name, level, preferences } = data

    const user = await prisma.user.findUnique({
      where: { email: 'demo@astralforge.app' },
      include: { profile: true },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Update user name
    await prisma.user.update({
      where: { id: user.id },
      data: { name },
    })

    // Update or create profile
    if (user.profile) {
      await prisma.userProfile.update({
        where: { id: user.profile.id },
        data: {
          level,
          preferences,
        },
      })
    } else {
      await prisma.userProfile.create({
        data: {
          userId: user.id,
          level,
          preferences,
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving settings:', error)
    return NextResponse.json(
      { error: 'Failed to save settings' },
      { status: 500 }
    )
  }
}


