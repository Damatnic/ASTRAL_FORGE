import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  getMeasurementDetail,
  updateMeasurement,
  deleteMeasurement,
} from '@/lib/api/measurements';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const measurement = await getMeasurementDetail(params.id, session.user.email);

    if (!measurement) {
      return NextResponse.json(
        { error: 'Measurement not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(measurement);
  } catch (error) {
    console.error('Failed to fetch measurement:', error);
    return NextResponse.json(
      { error: 'Failed to fetch measurement' },
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

    const updates: any = {};
    if (body.date) updates.date = new Date(body.date);
    if (body.weight !== undefined) updates.weight = parseFloat(body.weight);
    if (body.bodyFat !== undefined) updates.bodyFat = parseFloat(body.bodyFat);
    if (body.chest !== undefined) updates.chest = parseFloat(body.chest);
    if (body.waist !== undefined) updates.waist = parseFloat(body.waist);
    if (body.hips !== undefined) updates.hips = parseFloat(body.hips);
    if (body.thighs !== undefined) updates.thighs = parseFloat(body.thighs);
    if (body.arms !== undefined) updates.arms = parseFloat(body.arms);
    if (body.shoulders !== undefined) updates.shoulders = parseFloat(body.shoulders);
    if (body.neck !== undefined) updates.neck = parseFloat(body.neck);
    if (body.calves !== undefined) updates.calves = parseFloat(body.calves);
    if (body.forearms !== undefined) updates.forearms = parseFloat(body.forearms);
    if (body.notes !== undefined) updates.notes = body.notes;

    await updateMeasurement(params.id, session.user.email, updates);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update measurement:', error);
    return NextResponse.json(
      { error: 'Failed to update measurement' },
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

    await deleteMeasurement(params.id, session.user.email);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete measurement:', error);
    return NextResponse.json(
      { error: 'Failed to delete measurement' },
      { status: 500 }
    );
  }
}
