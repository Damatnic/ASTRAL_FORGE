import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface ProgressMetric {
  label: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  color: string;
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const searchParams = req.nextUrl.searchParams;
    const period = searchParams.get('period') || '30d';

    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    let previousStartDate = new Date();
    
    switch (period) {
      case '7d':
        startDate.setDate(now.getDate() - 7);
        previousStartDate.setDate(now.getDate() - 14);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        previousStartDate.setDate(now.getDate() - 60);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        previousStartDate.setDate(now.getDate() - 180);
        break;
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1);
        previousStartDate.setFullYear(now.getFullYear() - 2);
        break;
      case 'all':
        startDate = new Date(0); // Beginning of time
        previousStartDate = new Date(0);
        break;
    }

    // Fetch current period data
    const currentSessions = await prisma.workoutSession.findMany({
      where: {
        userId: user.id,
        date: {
          gte: startDate,
          lte: now,
        },
        completed: true,
      },
      include: {
        sets: true,
      },
    });

    // Fetch previous period data
    const previousSessions = await prisma.workoutSession.findMany({
      where: {
        userId: user.id,
        date: {
          gte: previousStartDate,
          lt: startDate,
        },
        completed: true,
      },
      include: {
        sets: true,
      },
    });

    // Calculate total volume
    const currentVolume = currentSessions.reduce((total, session) => {
      return total + session.sets.reduce((setTotal, set) => {
        return setTotal + (set.weight || 0) * (set.reps || 0);
      }, 0);
    }, 0);

    const previousVolume = previousSessions.reduce((total, session) => {
      return total + session.sets.reduce((setTotal, set) => {
        return setTotal + (set.weight || 0) * (set.reps || 0);
      }, 0);
    }, 0);

    const volumeChange = previousVolume > 0 
      ? ((currentVolume - previousVolume) / previousVolume) * 100 
      : 0;

    // Calculate workouts completed
    const currentWorkouts = currentSessions.length;
    const previousWorkouts = previousSessions.length;
    const workoutsChange = previousWorkouts > 0
      ? ((currentWorkouts - previousWorkouts) / previousWorkouts) * 100
      : 0;

    // Calculate average intensity (RPE)
    const currentRPEs = currentSessions.flatMap(s => 
      s.sets.map(set => set.rpe).filter((rpe): rpe is number => rpe !== null)
    );
    const currentAvgRPE = currentRPEs.length > 0
      ? currentRPEs.reduce((sum: number, rpe: number) => sum + rpe, 0) / currentRPEs.length
      : 0;

    const previousRPEs = previousSessions.flatMap(s => 
      s.sets.map(set => set.rpe).filter((rpe): rpe is number => rpe !== null)
    );
    const previousAvgRPE = previousRPEs.length > 0
      ? previousRPEs.reduce((sum: number, rpe: number) => sum + rpe, 0) / previousRPEs.length
      : 0;

    const rpeChange = previousAvgRPE > 0
      ? ((currentAvgRPE - previousAvgRPE) / previousAvgRPE) * 100
      : 0;

    // Calculate training frequency (unique training days)
    const currentDays = new Set(currentSessions.map(s => s.date.toDateString())).size;
    const previousDays = new Set(previousSessions.map(s => s.date.toDateString())).size;
    
    const daysChange = previousDays > 0
      ? ((currentDays - previousDays) / previousDays) * 100
      : currentDays > 0 ? 100 : 0;

    // Helper function to determine trend
    const getTrend = (change: number): 'up' | 'down' | 'stable' => {
      if (change > 2) return 'up';
      if (change < -2) return 'down';
      return 'stable';
    };

    // Build metrics response
    const metrics: ProgressMetric[] = [
      {
        label: 'Total Volume',
        value: `${Math.round(currentVolume).toLocaleString()} kg`,
        change: Math.round(volumeChange * 10) / 10,
        trend: getTrend(volumeChange),
        color: 'blue',
      },
      {
        label: 'Workouts Completed',
        value: currentWorkouts,
        change: Math.round(workoutsChange * 10) / 10,
        trend: getTrend(workoutsChange),
        color: 'green',
      },
      {
        label: 'Avg Intensity (RPE)',
        value: currentAvgRPE > 0 ? currentAvgRPE.toFixed(1) : 'N/A',
        change: Math.round(rpeChange * 10) / 10,
        trend: getTrend(-rpeChange), // Lower RPE is better for recovery
        color: 'orange',
      },
      {
        label: 'Training Days',
        value: currentDays,
        change: Math.round(daysChange * 10) / 10,
        trend: getTrend(daysChange),
        color: 'purple',
      },
    ];

    return NextResponse.json({
      metrics,
      period,
      dateRange: {
        start: startDate.toISOString(),
        end: now.toISOString(),
      },
    });
  } catch (error) {
    console.error('Error fetching analytics overview:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics overview' },
      { status: 500 }
    );
  }
}
