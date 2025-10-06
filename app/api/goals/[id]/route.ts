import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  getGoalDetail,
  updateGoal,
  deleteGoal,
  getGoalProgress,
} from '@/lib/api/goals';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const progress = searchParams.get('progress');

    const goal = await getGoalDetail(params.id, session.user.email);

    if (!goal) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
    }

    // Include progress calculation if requested
    if (progress === 'true') {
      const progressData = await getGoalProgress(params.id, session.user.email);
      return NextResponse.json({ ...goal, progress: progressData });
    }

    return NextResponse.json(goal);
  } catch (error) {
    console.error('Failed to fetch goal:', error);
    return NextResponse.json(
      { error: 'Failed to fetch goal' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const goal = await updateGoal(params.id, session.user.email, {
      title: body.title,
      description: body.description,
      currentValue: body.currentValue !== undefined ? parseFloat(body.currentValue) : undefined,
      deadline: body.deadline ? new Date(body.deadline) : undefined,
      status: body.status,
      milestones: body.milestones,
    });

    if (!goal) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
    }

    return NextResponse.json(goal);
  } catch (error) {
    console.error('Failed to update goal:', error);
    return NextResponse.json(
      { error: 'Failed to update goal' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await deleteGoal(params.id, session.user.email);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete goal:', error);
    return NextResponse.json(
      { error: 'Failed to delete goal' },
      { status: 500 }
    );
  }
}
