import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  getMeasurements,
  createMeasurement,
  getMeasurementStats,
  getMeasurementTimeline,
  getLatestMeasurement,
} from '@/lib/api/measurements';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const stats = searchParams.get('stats');
    const timeline = searchParams.get('timeline');
    const latest = searchParams.get('latest');

    // Get stats
    if (stats === 'true') {
      const data = await getMeasurementStats(session.user.email);
      return NextResponse.json(data);
    }

    // Get timeline
    if (timeline === 'true') {
      const data = await getMeasurementTimeline(session.user.email);
      return NextResponse.json(data);
    }

    // Get latest
    if (latest === 'true') {
      const data = await getLatestMeasurement(session.user.email);
      return NextResponse.json(data);
    }

    // Get measurements with filters
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');

    const data = await getMeasurements(session.user.email, {
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch measurements:', error);
    return NextResponse.json(
      { error: 'Failed to fetch measurements' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Validate required fields
    if (!body.date) {
      return NextResponse.json(
        { error: 'Date is required' },
        { status: 400 }
      );
    }

    const measurement = await createMeasurement(session.user.email, {
      date: new Date(body.date),
      weight: body.weight ? parseFloat(body.weight) : undefined,
      bodyFat: body.bodyFat ? parseFloat(body.bodyFat) : undefined,
      chest: body.chest ? parseFloat(body.chest) : undefined,
      waist: body.waist ? parseFloat(body.waist) : undefined,
      hips: body.hips ? parseFloat(body.hips) : undefined,
      thighs: body.thighs ? parseFloat(body.thighs) : undefined,
      arms: body.arms ? parseFloat(body.arms) : undefined,
      shoulders: body.shoulders ? parseFloat(body.shoulders) : undefined,
      neck: body.neck ? parseFloat(body.neck) : undefined,
      calves: body.calves ? parseFloat(body.calves) : undefined,
      forearms: body.forearms ? parseFloat(body.forearms) : undefined,
      notes: body.notes,
    });

    return NextResponse.json(measurement, { status: 201 });
  } catch (error) {
    console.error('Failed to create measurement:', error);
    return NextResponse.json(
      { error: 'Failed to create measurement' },
      { status: 500 }
    );
  }
}
