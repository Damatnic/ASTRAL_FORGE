import { prisma } from '@/lib/prisma';

export const BODY_PARTS = [
  'weight',
  'bodyFat',
  'chest',
  'waist',
  'hips',
  'thighs',
  'arms',
  'shoulders',
  'neck',
  'calves',
  'forearms',
] as const;

export type BodyPart = (typeof BODY_PARTS)[number];

export const BODY_PART_LABELS: Record<BodyPart, string> = {
  weight: 'Weight',
  bodyFat: 'Body Fat %',
  chest: 'Chest',
  waist: 'Waist',
  hips: 'Hips',
  thighs: 'Thighs',
  arms: 'Arms',
  shoulders: 'Shoulders',
  neck: 'Neck',
  calves: 'Calves',
  forearms: 'Forearms',
};

export const BODY_PART_UNITS: Record<BodyPart, string> = {
  weight: 'lbs',
  bodyFat: '%',
  chest: 'in',
  waist: 'in',
  hips: 'in',
  thighs: 'in',
  arms: 'in',
  shoulders: 'in',
  neck: 'in',
  calves: 'in',
  forearms: 'in',
};

export interface MeasurementFilters {
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}

export interface MeasurementEntry {
  date: Date;
  weight?: number;
  bodyFat?: number;
  chest?: number;
  waist?: number;
  hips?: number;
  thighs?: number;
  arms?: number;
  shoulders?: number;
  neck?: number;
  calves?: number;
  forearms?: number;
  notes?: string;
}

export interface MeasurementStats {
  totalEntries: number;
  byBodyPart: {
    bodyPart: BodyPart;
    label: string;
    count: number;
    latest: number | null;
    earliest: number | null;
    change: number | null;
    changePercent: number | null;
    unit: string;
  }[];
  firstDate: Date | null;
  lastDate: Date | null;
  daysTracking: number;
}

export interface MeasurementTrend {
  bodyPart: BodyPart;
  label: string;
  data: {
    date: Date;
    value: number;
  }[];
  latest: number | null;
  earliest: number | null;
  change: number | null;
  changePercent: number | null;
  unit: string;
}

export interface MeasurementComparison {
  bodyPart: BodyPart;
  label: string;
  beforeDate: Date;
  afterDate: Date;
  beforeValue: number;
  afterValue: number;
  change: number;
  changePercent: number;
  daysBetween: number;
  unit: string;
}

/**
 * Get measurements with filtering and pagination
 */
export async function getMeasurements(
  userId: string,
  filters: MeasurementFilters = {}
) {
  const { startDate, endDate, limit = 50, offset = 0 } = filters;

  const where: any = { userId };

  if (startDate || endDate) {
    where.date = {};
    if (startDate) where.date.gte = startDate;
    if (endDate) where.date.lte = endDate;
  }

  const [measurements, total] = await Promise.all([
    prisma.bodyMetric.findMany({
      where,
      orderBy: { date: 'desc' },
      take: limit,
      skip: offset,
    }),
    prisma.bodyMetric.count({ where }),
  ]);

  return {
    measurements,
    total,
    hasMore: offset + measurements.length < total,
  };
}

/**
 * Get single measurement detail
 */
export async function getMeasurementDetail(measurementId: string, userId: string) {
  const measurement = await prisma.bodyMetric.findFirst({
    where: {
      id: measurementId,
      userId,
    },
  });

  if (!measurement) {
    return null;
  }

  // Get previous and next measurements
  const [previousMeasurement, nextMeasurement] = await Promise.all([
    prisma.bodyMetric.findFirst({
      where: {
        userId,
        date: { lt: measurement.date },
      },
      orderBy: { date: 'desc' },
    }),
    prisma.bodyMetric.findFirst({
      where: {
        userId,
        date: { gt: measurement.date },
      },
      orderBy: { date: 'asc' },
    }),
  ]);

  return {
    ...measurement,
    previousMeasurement,
    nextMeasurement,
  };
}

/**
 * Create new measurement entry
 */
export async function createMeasurement(
  userId: string,
  data: MeasurementEntry
) {
  return await prisma.bodyMetric.create({
    data: {
      userId,
      date: data.date,
      weight: data.weight,
      bodyFat: data.bodyFat,
      chest: data.chest,
      waist: data.waist,
      hips: data.hips,
      thighs: data.thighs,
      arms: data.arms,
      shoulders: data.shoulders,
      neck: data.neck,
      calves: data.calves,
      forearms: data.forearms,
      notes: data.notes,
    },
  });
}

/**
 * Update measurement
 */
export async function updateMeasurement(
  measurementId: string,
  userId: string,
  updates: Partial<MeasurementEntry>
) {
  return await prisma.bodyMetric.updateMany({
    where: {
      id: measurementId,
      userId,
    },
    data: updates,
  });
}

/**
 * Delete measurement
 */
export async function deleteMeasurement(measurementId: string, userId: string) {
  return await prisma.bodyMetric.deleteMany({
    where: {
      id: measurementId,
      userId,
    },
  });
}

/**
 * Get measurement statistics
 */
export async function getMeasurementStats(
  userId: string
): Promise<MeasurementStats> {
  const measurements = await prisma.bodyMetric.findMany({
    where: { userId },
    orderBy: { date: 'asc' },
  });

  if (measurements.length === 0) {
    return {
      totalEntries: 0,
      byBodyPart: [],
      firstDate: null,
      lastDate: null,
      daysTracking: 0,
    };
  }

  // Calculate stats for each body part
  const stats = BODY_PARTS.map((bodyPart) => {
    const values = measurements
      .map((m) => ({
        date: m.date,
        value: m[bodyPart],
      }))
      .filter((v) => v.value !== null) as { date: Date; value: number }[];

    if (values.length === 0) {
      return {
        bodyPart,
        label: BODY_PART_LABELS[bodyPart],
        count: 0,
        latest: null,
        earliest: null,
        change: null,
        changePercent: null,
        unit: BODY_PART_UNITS[bodyPart],
      };
    }

    const earliest = values[0].value;
    const latest = values[values.length - 1].value;
    const change = latest - earliest;
    const changePercent = earliest !== 0 ? (change / earliest) * 100 : 0;

    return {
      bodyPart,
      label: BODY_PART_LABELS[bodyPart],
      count: values.length,
      latest,
      earliest,
      change,
      changePercent,
      unit: BODY_PART_UNITS[bodyPart],
    };
  }).filter((stat) => stat.count > 0);

  const firstDate = measurements[0].date;
  const lastDate = measurements[measurements.length - 1].date;
  const daysTracking = Math.floor(
    (lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  return {
    totalEntries: measurements.length,
    byBodyPart: stats,
    firstDate,
    lastDate,
    daysTracking,
  };
}

/**
 * Get measurement trend for a specific body part
 */
export async function getMeasurementTrend(
  userId: string,
  bodyPart: BodyPart,
  startDate?: Date,
  endDate?: Date
): Promise<MeasurementTrend | null> {
  const where: any = { userId };

  if (startDate || endDate) {
    where.date = {};
    if (startDate) where.date.gte = startDate;
    if (endDate) where.date.lte = endDate;
  }

  const measurements = await prisma.bodyMetric.findMany({
    where,
    orderBy: { date: 'asc' },
  });

  const data = measurements
    .map((m) => ({
      date: m.date,
      value: m[bodyPart],
    }))
    .filter((d) => d.value !== null) as { date: Date; value: number }[];

  if (data.length === 0) {
    return null;
  }

  const earliest = data[0].value;
  const latest = data[data.length - 1].value;
  const change = latest - earliest;
  const changePercent = earliest !== 0 ? (change / earliest) * 100 : 0;

  return {
    bodyPart,
    label: BODY_PART_LABELS[bodyPart],
    data,
    latest,
    earliest,
    change,
    changePercent,
    unit: BODY_PART_UNITS[bodyPart],
  };
}

/**
 * Get all active body parts for user (parts that have been measured)
 */
export async function getActiveBodyParts(userId: string) {
  const measurements = await prisma.bodyMetric.findMany({
    where: { userId },
    take: 1,
  });

  if (measurements.length === 0) {
    return [];
  }

  // Check which fields have been populated
  const activeBodyParts = BODY_PARTS.filter((bodyPart) => {
    return measurements.some((m) => m[bodyPart] !== null);
  });

  return activeBodyParts.map((bp) => ({
    bodyPart: bp,
    label: BODY_PART_LABELS[bp],
    unit: BODY_PART_UNITS[bp],
  }));
}

/**
 * Get measurement comparison between two dates for a specific body part
 */
export async function getMeasurementComparison(
  userId: string,
  bodyPart: BodyPart,
  beforeDate: Date,
  afterDate: Date
): Promise<MeasurementComparison | null> {
  const [beforeMeasurement, afterMeasurement] = await Promise.all([
    prisma.bodyMetric.findFirst({
      where: { userId, date: { lte: beforeDate } },
      orderBy: { date: 'desc' },
    }),
    prisma.bodyMetric.findFirst({
      where: { userId, date: { gte: afterDate } },
      orderBy: { date: 'asc' },
    }),
  ]);

  if (!beforeMeasurement || !afterMeasurement) {
    return null;
  }

  const beforeValue = beforeMeasurement[bodyPart];
  const afterValue = afterMeasurement[bodyPart];

  if (beforeValue === null || afterValue === null) {
    return null;
  }

  const change = afterValue - beforeValue;
  const changePercent = beforeValue !== 0 ? (change / beforeValue) * 100 : 0;

  const daysBetween = Math.floor(
    (afterMeasurement.date.getTime() - beforeMeasurement.date.getTime()) /
      (1000 * 60 * 60 * 24)
  );

  return {
    bodyPart,
    label: BODY_PART_LABELS[bodyPart],
    beforeDate: beforeMeasurement.date,
    afterDate: afterMeasurement.date,
    beforeValue,
    afterValue,
    change,
    changePercent,
    daysBetween,
    unit: BODY_PART_UNITS[bodyPart],
  };
}

/**
 * Get suggested comparisons for all active body parts (first vs latest)
 */
export async function getSuggestedMeasurementComparisons(userId: string) {
  const [firstMeasurement, latestMeasurement] = await Promise.all([
    prisma.bodyMetric.findFirst({
      where: { userId },
      orderBy: { date: 'asc' },
    }),
    prisma.bodyMetric.findFirst({
      where: { userId },
      orderBy: { date: 'desc' },
    }),
  ]);

  if (!firstMeasurement || !latestMeasurement || firstMeasurement.id === latestMeasurement.id) {
    return [];
  }

  const daysBetween = Math.floor(
    (latestMeasurement.date.getTime() - firstMeasurement.date.getTime()) /
      (1000 * 60 * 60 * 24)
  );

  const comparisons = BODY_PARTS.map((bodyPart) => {
    const beforeValue = firstMeasurement[bodyPart];
    const afterValue = latestMeasurement[bodyPart];

    if (beforeValue === null || afterValue === null) {
      return null;
    }

    const change = afterValue - beforeValue;
    const changePercent = beforeValue !== 0 ? (change / beforeValue) * 100 : 0;

    return {
      bodyPart,
      label: BODY_PART_LABELS[bodyPart],
      beforeDate: firstMeasurement.date,
      afterDate: latestMeasurement.date,
      beforeValue,
      afterValue,
      change,
      changePercent,
      daysBetween,
      unit: BODY_PART_UNITS[bodyPart],
    };
  }).filter((c) => c !== null) as MeasurementComparison[];

  return comparisons;
}

/**
 * Get latest measurement entry
 */
export async function getLatestMeasurement(userId: string) {
  return await prisma.bodyMetric.findFirst({
    where: { userId },
    orderBy: { date: 'desc' },
  });
}

/**
 * Get measurement history for timeline view
 */
export async function getMeasurementTimeline(userId: string) {
  const measurements = await prisma.bodyMetric.findMany({
    where: { userId },
    orderBy: { date: 'desc' },
    take: 50,
  });

  // Group by month
  const grouped = measurements.reduce((acc, measurement) => {
    const monthKey = measurement.date.toISOString().slice(0, 7); // YYYY-MM
    if (!acc[monthKey]) {
      acc[monthKey] = [];
    }
    acc[monthKey].push(measurement);
    return acc;
  }, {} as Record<string, typeof measurements>);

  return Object.entries(grouped).map(([month, data]) => ({
    month,
    measurements: data,
    count: data.length,
  }));
}
