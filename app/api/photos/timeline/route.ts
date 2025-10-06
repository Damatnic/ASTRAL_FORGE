import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getPhotoTimeline, getPhotosByPose } from '@/lib/api/photos';

export const dynamic = 'force-dynamic';

// GET - Fetch photo timeline or photos by pose
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const pose = searchParams.get('pose');

    // Get photos by pose
    if (pose) {
      const photos = await getPhotosByPose(session.user.email, pose as any);
      return NextResponse.json({ photos });
    }

    // Get timeline
    const timeline = await getPhotoTimeline(session.user.email);
    return NextResponse.json({ timeline });
  } catch (error) {
    console.error('Photo timeline error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch timeline' },
      { status: 500 }
    );
  }
}
