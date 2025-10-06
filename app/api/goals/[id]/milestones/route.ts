import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { addGoalMilestone } from '@/lib/api/goals';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    if (body.value === undefined) {
      return NextResponse.json(
        { error: 'Milestone value is required' },
        { status: 400 }
      );
    }

    const goal = await addGoalMilestone(params.id, session.user.email, {
      value: parseFloat(body.value),
      date: body.date ? new Date(body.date) : new Date(),
      note: body.note,
      achieved: body.achieved !== undefined ? body.achieved : false,
    });

    if (!goal) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
    }

    return NextResponse.json(goal);
  } catch (error) {
    console.error('Failed to add milestone:', error);
    return NextResponse.json(
      { error: 'Failed to add milestone' },
      { status: 500 }
    );
  }
}
