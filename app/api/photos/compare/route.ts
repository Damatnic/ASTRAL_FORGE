import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  getPhotoComparison,
  getSuggestedComparisons,
} from '@/lib/api/photos';

export const dynamic = 'force-dynamic';

// GET - Fetch photo comparison or suggestions
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const beforeId = searchParams.get('beforeId');
    const afterId = searchParams.get('afterId');
    const suggestions = searchParams.get('suggestions');

    // Get suggested comparisons
    if (suggestions === 'true') {
      const suggestedComparisons = await getSuggestedComparisons(
        session.user.email
      );
      return NextResponse.json({ suggestions: suggestedComparisons });
    }

    // Get specific comparison
    if (!beforeId || !afterId) {
      return NextResponse.json(
        { error: 'Missing beforeId or afterId' },
        { status: 400 }
      );
    }

    const comparison = await getPhotoComparison(
      session.user.email,
      beforeId,
      afterId
    );

    if (!comparison) {
      return NextResponse.json(
        { error: 'Photos not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(comparison);
  } catch (error) {
    console.error('Photo comparison error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comparison' },
      { status: 500 }
    );
  }
}
