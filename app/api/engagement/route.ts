import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import {
  generateWorkoutShare,
  generateAchievementShare,
  generatePRShare,
  generateShareMetadata,
  getUserNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  createNotification,
  getUserAnalytics,
  getAchievementShowcase,
  updateAchievementShowcase
} from '@/lib/api/engagement'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const mode = searchParams.get('mode')

    switch (mode) {
      case 'notifications': {
        const unreadOnly = searchParams.get('unreadOnly') === 'true'
        const notifications = await getUserNotifications(session.user.id, unreadOnly)
        return NextResponse.json({ notifications })
      }

      case 'analytics': {
        const analytics = await getUserAnalytics(session.user.id)
        return NextResponse.json(analytics)
      }

      case 'achievement-showcase': {
        const showcase = await getAchievementShowcase(session.user.id)
        return NextResponse.json(showcase)
      }

      default:
        return NextResponse.json({ error: 'Invalid mode' }, { status: 400 })
    }
  } catch (error: any) {
    console.error('GET /api/engagement error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { action } = body

    switch (action) {
      case 'generate-workout-share': {
        const { sessionId } = body
        const content = await generateWorkoutShare(session.user.id, sessionId)
        const metadata = generateShareMetadata(content, process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000')
        return NextResponse.json({ content, metadata })
      }

      case 'generate-achievement-share': {
        const { achievementId } = body
        const content = await generateAchievementShare(session.user.id, achievementId)
        const metadata = generateShareMetadata(content, process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000')
        return NextResponse.json({ content, metadata })
      }

      case 'generate-pr-share': {
        const { exerciseName, weight, reps } = body
        const content = await generatePRShare(session.user.id, exerciseName, weight, reps)
        const metadata = generateShareMetadata(content, process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000')
        return NextResponse.json({ content, metadata })
      }

      case 'create-notification': {
        const { type, title, message, icon, actionUrl } = body
        const notification = await createNotification(session.user.id, type, title, message, { icon, actionUrl })
        return NextResponse.json({ notification })
      }

      case 'mark-notification-read': {
        const { notificationId } = body
        await markNotificationRead(session.user.id, notificationId)
        return NextResponse.json({ success: true })
      }

      case 'mark-all-notifications-read': {
        await markAllNotificationsRead(session.user.id)
        return NextResponse.json({ success: true })
      }

      case 'update-achievement-showcase': {
        const { updates } = body
        await updateAchievementShowcase(session.user.id, updates)
        return NextResponse.json({ success: true })
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error: any) {
    console.error('POST /api/engagement error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
