import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  getMeasurementComparison,
  getSuggestedMeasurementComparisons,
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
    const suggestions = searchParams.get('suggestions');

    // Get suggested comparisons
    if (suggestions === 'true') {
      const data = await getSuggestedMeasurementComparisons(session.user.email);
      return NextResponse.json({ suggestions: data });
    }

    // Get specific comparison
    const bodyPart = searchParams.get('bodyPart') as BodyPart | null;
    const beforeDate = searchParams.get('beforeDate');
    const afterDate = searchParams.get('afterDate');

    if (!bodyPart || !beforeDate || !afterDate) {
      return NextResponse.json(
        { error: 'Body part, before date, and after date are required' },
        { status: 400 }
      );
    }

    const data = await getMeasurementComparison(
      session.user.email,
      bodyPart,
      new Date(beforeDate),
      new Date(afterDate)
    );

    if (!data) {
      return NextResponse.json(
        { error: 'Comparison not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch comparison:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comparison' },
      { status: 500 }
    );
  }
}
