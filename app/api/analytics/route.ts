import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import {
  getVolumeProgression,
  getStrengthProgression,
  getRPETrends,
  getFrequencyData,
  getMuscleGroupData,
  getKeyMetrics,
  getRecoveryMetrics,
  getRecentPRs,
} from '@/lib/api/analytics'

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const timeRange = (searchParams.get('timeRange') as 'week' | 'month' | 'year') || 'month'
  const userId = session.user.id || session.user.email // Adjust based on your session structure

  try {
    const [
      volumeData,
      strengthData,
      rpeData,
      frequencyData,
      muscleGroupData,
      keyMetrics,
      recoveryMetrics,
      recentPRs,
    ] = await Promise.all([
      getVolumeProgression(userId, timeRange),
      getStrengthProgression(userId),
      getRPETrends(userId),
      getFrequencyData(userId),
      getMuscleGroupData(userId),
      getKeyMetrics(userId, timeRange),
      getRecoveryMetrics(userId),
      getRecentPRs(userId),
    ])

    return NextResponse.json({
      volumeData,
      strengthData,
      rpeData,
      frequencyData,
      muscleGroupData,
      keyMetrics,
      recoveryMetrics,
      recentPRs,
      timeRange,
    })
  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
}
