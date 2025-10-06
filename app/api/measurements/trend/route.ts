import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  getMeasurementTrend,
  getActiveBodyParts,
} from '@/lib/api/measurements';
import { BodyPart } from '@/lib/api/measurements';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const bodyPart = searchParams.get('bodyPart') as BodyPart | null;
    const activeOnly = searchParams.get('active');

    // Get active body parts
    if (activeOnly === 'true') {
      const data = await getActiveBodyParts(session.user.email);
      return NextResponse.json(data);
    }

    // Get trend for specific body part
    if (!bodyPart) {
      return NextResponse.json(
        { error: 'Body part is required' },
        { status: 400 }
      );
    }

    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const data = await getMeasurementTrend(
      session.user.email,
      bodyPart,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined
    );

    if (!data) {
      return NextResponse.json(
        { error: 'No data found for this body part' },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch trend:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trend' },
      { status: 500 }
    );
  }
}
