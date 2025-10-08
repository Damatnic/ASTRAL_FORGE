import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface TrainingLoadData {
  date: string;
  tss: number;
  trimp: number;
  acuteLoad: number;
  chronicLoad: number;
  acr: number;
}

interface LoadStats {
  currentTSS: number;
  weeklyAverage: number;
  acr: number;
  status: 'optimal' | 'warning' | 'danger';
  recommendation: string;
}

interface TrainingLoadResponse {
  data: TrainingLoadData[];
  stats: LoadStats;
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const period = searchParams.get('period') || '3m';

    // Calculate date range
    const periodDays = {
      '1m': 30,
      '3m': 90,
      '6m': 180,
    }[period] || 90;

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - periodDays - 28); // Add 28 days for chronic load calculation

    // Fetch all workouts in the extended range
    const workouts = await prisma.workoutSession.findMany({
      where: {
        userId: session.user.id,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        sets: true,
      },
      orderBy: {
        date: 'asc',
      },
    });

    // Calculate daily TSS and TRIMP
    const dailyScores = new Map<string, { tss: number; trimp: number }>();

    workouts.forEach((workout) => {
      const dateKey = workout.date.toISOString().split('T')[0];

      let workoutTSS = 0;
      let workoutTRIMP = 0;

      workout.sets.forEach((set) => {
        // TSS calculation based on volume and RPE
        // TSS = (duration * intensity^2) / 100
        // We approximate duration from sets (assume 3 min per set)
        // Intensity from RPE (scale 0-10 to 0-100)
        const setDuration = 3; // minutes
        const intensity = set.rpe ? (set.rpe / 10) * 100 : 70; // Default to 70% if no RPE
        const setTSS = (setDuration * Math.pow(intensity, 2)) / 3600;
        workoutTSS += setTSS;

        // TRIMP calculation
        // TRIMP = duration * intensity_factor
        // Intensity factor based on RPE (1-10 scale)
        const intensityFactor = set.rpe ? set.rpe / 10 : 0.7;
        const setTRIMP = setDuration * intensityFactor * 10;
        workoutTRIMP += setTRIMP;
      });

      if (!dailyScores.has(dateKey)) {
        dailyScores.set(dateKey, { tss: 0, trimp: 0 });
      }

      const current = dailyScores.get(dateKey)!;
      current.tss += workoutTSS;
      current.trimp += workoutTRIMP;
    });

    // Generate complete daily data for the display period
    const displayStartDate = new Date();
    displayStartDate.setDate(displayStartDate.getDate() - periodDays);

    const data: TrainingLoadData[] = [];
    const allDailyScores: Array<{ date: Date; tss: number; trimp: number }> = [];

    // First, collect all daily scores in chronological order
    for (let i = periodDays + 28; i >= 0; i--) {
      const date = new Date(endDate);
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      const scores = dailyScores.get(dateKey) || { tss: 0, trimp: 0 };

      allDailyScores.push({
        date: new Date(date),
        tss: Math.round(scores.tss),
        trimp: Math.round(scores.trimp),
      });
    }

    // Calculate rolling averages for each day
    for (let i = 28; i < allDailyScores.length; i++) {
      const currentDate = allDailyScores[i].date;

      // Only include data points within the display period
      if (currentDate < displayStartDate) {
        continue;
      }

      // Calculate acute load (7-day average including today)
      let acuteSum = 0;
      for (let j = Math.max(0, i - 6); j <= i; j++) {
        acuteSum += allDailyScores[j].tss;
      }
      const acuteLoad = Math.round(acuteSum / 7);

      // Calculate chronic load (28-day average including today)
      let chronicSum = 0;
      for (let j = Math.max(0, i - 27); j <= i; j++) {
        chronicSum += allDailyScores[j].tss;
      }
      const chronicLoad = Math.round(chronicSum / 28);

      // Calculate Acute:Chronic Ratio
      const acr = chronicLoad > 0 ? acuteLoad / chronicLoad : 1.0;

      data.push({
        date: currentDate.toISOString().split('T')[0],
        tss: allDailyScores[i].tss,
        trimp: allDailyScores[i].trimp,
        acuteLoad,
        chronicLoad,
        acr: Math.round(acr * 100) / 100,
      });
    }

    // Calculate current stats
    const recentData = data.slice(-7); // Last 7 days
    const currentTSS = data.length > 0 ? data[data.length - 1].tss : 0;
    const weeklyAverage = Math.round(
      recentData.reduce((sum, d) => sum + d.tss, 0)
    );
    const currentACR = data.length > 0 ? data[data.length - 1].acr : 1.0;

    // Determine status and recommendation
    let status: 'optimal' | 'warning' | 'danger';
    let recommendation: string;

    if (currentACR < 0.8) {
      status = 'warning';
      recommendation =
        'Your training load is decreasing. Consider increasing volume gradually to avoid detraining.';
    } else if (currentACR >= 0.8 && currentACR <= 1.3) {
      status = 'optimal';
      recommendation =
        'Training load is well balanced. Your acute and chronic loads are in the optimal range for adaptation without excessive fatigue.';
    } else if (currentACR > 1.3 && currentACR <= 1.5) {
      status = 'warning';
      recommendation =
        'Training load is elevated. Monitor recovery closely and consider a deload if fatigue accumulates.';
    } else {
      status = 'danger';
      recommendation =
        'Training load is very high relative to your baseline. High injury risk - consider reducing volume or taking a recovery week.';
    }

    const result: TrainingLoadResponse = {
      data,
      stats: {
        currentTSS,
        weeklyAverage,
        acr: currentACR,
        status,
        recommendation,
      },
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error calculating training load:', error);
    return NextResponse.json(
      { error: 'Failed to calculate training load' },
      { status: 500 }
    );
  }
}
