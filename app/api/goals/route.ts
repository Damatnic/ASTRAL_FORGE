import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  getGoals,
  createGoal,
  getGoalStats,
  getActiveGoalsWithProgress,
  getCompletedGoals,
  getUpcomingDeadlines,
  getOverdueGoals,
  getGoalSuggestions,
} from '@/lib/api/goals';
import { GoalType } from '@/lib/api/goals';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const stats = searchParams.get('stats');
    const active = searchParams.get('active');
    const completed = searchParams.get('completed');
    const upcoming = searchParams.get('upcoming');
    const overdue = searchParams.get('overdue');
    const suggestions = searchParams.get('suggestions');

    // Get stats
    if (stats === 'true') {
      const data = await getGoalStats(session.user.email);
      return NextResponse.json(data);
    }

    // Get active goals with progress
    if (active === 'true') {
      const data = await getActiveGoalsWithProgress(session.user.email);
      return NextResponse.json(data);
    }

    // Get completed goals
    if (completed === 'true') {
      const limit = searchParams.get('limit');
      const data = await getCompletedGoals(
        session.user.email,
        limit ? parseInt(limit) : undefined
      );
      return NextResponse.json(data);
    }

    // Get upcoming deadlines
    if (upcoming === 'true') {
      const days = searchParams.get('days');
      const data = await getUpcomingDeadlines(
        session.user.email,
        days ? parseInt(days) : undefined
      );
      return NextResponse.json(data);
    }

    // Get overdue goals
    if (overdue === 'true') {
      const data = await getOverdueGoals(session.user.email);
      return NextResponse.json(data);
    }

    // Get goal suggestions
    if (suggestions === 'true') {
      const data = await getGoalSuggestions(session.user.email);
      return NextResponse.json(data);
    }

    // Get goals with filters
    const status = searchParams.get('status') as 'active' | 'completed' | 'abandoned' | null;
    const goalType = searchParams.get('goalType') as GoalType | null;
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');

    const data = await getGoals(session.user.email, {
      status: status || undefined,
      goalType: goalType || undefined,
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch goals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch goals' },
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
    if (!body.title || !body.goalType) {
      return NextResponse.json(
        { error: 'Title and goal type are required' },
        { status: 400 }
      );
    }

    const goal = await createGoal(session.user.email, {
      title: body.title,
      description: body.description,
      goalType: body.goalType,
      targetValue: body.targetValue ? parseFloat(body.targetValue) : undefined,
      currentValue: body.currentValue ? parseFloat(body.currentValue) : undefined,
      unit: body.unit,
      deadline: body.deadline ? new Date(body.deadline) : undefined,
      milestones: body.milestones,
    });

    return NextResponse.json(goal, { status: 201 });
  } catch (error) {
    console.error('Failed to create goal:', error);
    return NextResponse.json(
      { error: 'Failed to create goal' },
      { status: 500 }
    );
  }
}

