import { prisma } from '@/lib/prisma';

/**
 * Progress Photos - Data Fetching Layer
 * Handles photo CRUD operations, comparisons, and timeline views
 */

export type PhotoPose = 'front' | 'back' | 'side' | 'other';

export interface PhotoUpload {
  userId: string;
  photoUrl: string;
  photoType: PhotoPose;
  date: Date;
  weight?: number;
  bodyFat?: number;
  notes?: string;
}

export interface PhotoComparison {
  beforePhoto: any;
  afterPhoto: any;
  weightDiff: number | null;
  bodyFatDiff: number | null;
  daysBetween: number;
}

// Get all photos with filters
export async function getPhotos(
  userId: string,
  options?: {
    photoType?: PhotoPose;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
  }
) {
  const where: any = { userId };

  if (options?.photoType) {
    where.photoType = options.photoType;
  }

  if (options?.startDate || options?.endDate) {
    where.date = {};
    if (options.startDate) {
      where.date.gte = options.startDate;
    }
    if (options.endDate) {
      where.date.lte = options.endDate;
    }
  }

  const [photos, total] = await Promise.all([
    prisma.progressPhoto.findMany({
      where,
      orderBy: { date: 'desc' },
      take: options?.limit || 50,
      skip: options?.offset || 0,
    }),
    prisma.progressPhoto.count({ where }),
  ]);

  return {
    photos: photos.map((photo) => ({
      id: photo.id,
      photoUrl: photo.photoUrl,
      photoType: photo.photoType,
      date: photo.date,
      weight: photo.weight,
      bodyFat: photo.bodyFat,
      notes: photo.notes,
    })),
    total,
    hasMore: total > (options?.offset || 0) + photos.length,
  };
}

// Get single photo detail
export async function getPhotoDetail(photoId: string, userId: string) {
  const photo = await prisma.progressPhoto.findFirst({
    where: {
      id: photoId,
      userId,
    },
  });

  if (!photo) {
    return null;
  }

  // Get nearby photos (previous and next)
  const [previousPhoto, nextPhoto] = await Promise.all([
    prisma.progressPhoto.findFirst({
      where: {
        userId,
        date: { lt: photo.date },
      },
      orderBy: { date: 'desc' },
    }),
    prisma.progressPhoto.findFirst({
      where: {
        userId,
        date: { gt: photo.date },
      },
      orderBy: { date: 'asc' },
    }),
  ]);

  return {
    photo: {
      id: photo.id,
      photoUrl: photo.photoUrl,
      photoType: photo.photoType,
      date: photo.date,
      weight: photo.weight,
      bodyFat: photo.bodyFat,
      notes: photo.notes,
    },
    previousPhoto: previousPhoto
      ? {
          id: previousPhoto.id,
          date: previousPhoto.date,
        }
      : null,
    nextPhoto: nextPhoto
      ? {
          id: nextPhoto.id,
          date: nextPhoto.date,
        }
      : null,
  };
}

// Upload new photo
export async function uploadPhoto(data: PhotoUpload) {
  const photo = await prisma.progressPhoto.create({
    data: {
      userId: data.userId,
      photoUrl: data.photoUrl,
      photoType: data.photoType,
      date: data.date,
      weight: data.weight,
      bodyFat: data.bodyFat,
      notes: data.notes,
    },
  });

  return {
    id: photo.id,
    photoUrl: photo.photoUrl,
    photoType: photo.photoType,
    date: photo.date,
    weight: photo.weight,
    bodyFat: photo.bodyFat,
    notes: photo.notes,
  };
}

// Update photo
export async function updatePhoto(
  photoId: string,
  userId: string,
  updates: {
    photoType?: PhotoPose;
    date?: Date;
    weight?: number;
    bodyFat?: number;
    notes?: string;
  }
) {
  const photo = await prisma.progressPhoto.updateMany({
    where: {
      id: photoId,
      userId,
    },
    data: updates,
  });

  return photo.count > 0;
}

// Delete photo
export async function deletePhoto(photoId: string, userId: string) {
  const photo = await prisma.progressPhoto.deleteMany({
    where: {
      id: photoId,
      userId,
    },
  });

  return photo.count > 0;
}

// Get photo comparison
export async function getPhotoComparison(
  userId: string,
  beforePhotoId: string,
  afterPhotoId: string
): Promise<PhotoComparison | null> {
  const [beforePhoto, afterPhoto] = await Promise.all([
    prisma.progressPhoto.findFirst({
      where: {
        id: beforePhotoId,
        userId,
      },
    }),
    prisma.progressPhoto.findFirst({
      where: {
        id: afterPhotoId,
        userId,
      },
    }),
  ]);

  if (!beforePhoto || !afterPhoto) {
    return null;
  }

  const weightDiff =
    beforePhoto.weight && afterPhoto.weight
      ? afterPhoto.weight - beforePhoto.weight
      : null;

  const bodyFatDiff =
    beforePhoto.bodyFat && afterPhoto.bodyFat
      ? afterPhoto.bodyFat - beforePhoto.bodyFat
      : null;

  const daysBetween = Math.floor(
    (afterPhoto.date.getTime() - beforePhoto.date.getTime()) /
      (1000 * 60 * 60 * 24)
  );

  return {
    beforePhoto: {
      id: beforePhoto.id,
      photoUrl: beforePhoto.photoUrl,
      photoType: beforePhoto.photoType,
      date: beforePhoto.date,
      weight: beforePhoto.weight,
      bodyFat: beforePhoto.bodyFat,
      notes: beforePhoto.notes,
    },
    afterPhoto: {
      id: afterPhoto.id,
      photoUrl: afterPhoto.photoUrl,
      photoType: afterPhoto.photoType,
      date: afterPhoto.date,
      weight: afterPhoto.weight,
      bodyFat: afterPhoto.bodyFat,
      notes: afterPhoto.notes,
    },
    weightDiff,
    bodyFatDiff,
    daysBetween,
  };
}

// Get timeline data (grouped by month)
export async function getPhotoTimeline(userId: string) {
  const photos = await prisma.progressPhoto.findMany({
    where: { userId },
    orderBy: { date: 'desc' },
  });

  // Group by month
  const timeline = photos.reduce((acc, photo) => {
    const monthKey = new Date(photo.date).toISOString().slice(0, 7); // YYYY-MM

    if (!acc[monthKey]) {
      acc[monthKey] = {
        month: monthKey,
        photos: [],
        count: 0,
      };
    }

    acc[monthKey].photos.push({
      id: photo.id,
      photoUrl: photo.photoUrl,
      photoType: photo.photoType,
      date: photo.date,
      weight: photo.weight,
      bodyFat: photo.bodyFat,
    });
    acc[monthKey].count++;

    return acc;
  }, {} as Record<string, any>);

  return Object.values(timeline);
}

// Get photos by pose type for comparison
export async function getPhotosByPose(userId: string, photoType: PhotoPose) {
  const photos = await prisma.progressPhoto.findMany({
    where: {
      userId,
      photoType,
    },
    orderBy: { date: 'desc' },
    take: 20, // Last 20 photos of this pose
  });

  return photos.map((photo) => ({
    id: photo.id,
    photoUrl: photo.photoUrl,
    date: photo.date,
    weight: photo.weight,
    bodyFat: photo.bodyFat,
    notes: photo.notes,
  }));
}

// Get photo statistics
export async function getPhotoStats(userId: string) {
  const [total, byType, dateRange] = await Promise.all([
    prisma.progressPhoto.count({
      where: { userId },
    }),
    prisma.progressPhoto.groupBy({
      by: ['photoType'],
      where: { userId },
      _count: true,
    }),
    prisma.progressPhoto.aggregate({
      where: { userId },
      _min: { date: true },
      _max: { date: true },
    }),
  ]);

  const typeBreakdown = byType.reduce(
    (acc, item) => {
      acc[item.photoType] = item._count;
      return acc;
    },
    {} as Record<string, number>
  );

  const daysSinceFirst = dateRange._min.date
    ? Math.floor(
        (Date.now() - dateRange._min.date.getTime()) / (1000 * 60 * 60 * 24)
      )
    : 0;

  const daysSinceLast = dateRange._max.date
    ? Math.floor(
        (Date.now() - dateRange._max.date.getTime()) / (1000 * 60 * 60 * 24)
      )
    : 0;

  return {
    total,
    byType: typeBreakdown,
    firstPhotoDate: dateRange._min.date,
    lastPhotoDate: dateRange._max.date,
    daysSinceFirst,
    daysSinceLast,
  };
}

// Get suggested comparisons (photos from same pose type at different times)
export async function getSuggestedComparisons(userId: string) {
  const photos = await prisma.progressPhoto.findMany({
    where: { userId },
    orderBy: { date: 'desc' },
  });

  // Group by photo type
  const byType = photos.reduce(
    (acc, photo) => {
      if (!acc[photo.photoType]) {
        acc[photo.photoType] = [];
      }
      acc[photo.photoType].push(photo);
      return acc;
    },
    {} as Record<string, any[]>
  );

  // Create suggested comparisons (first vs latest for each type)
  const suggestions = Object.entries(byType)
    .filter(([_, photos]) => photos.length >= 2)
    .map(([photoType, photos]) => {
      const latest = photos[0];
      const earliest = photos[photos.length - 1];

      const weightDiff =
        earliest.weight && latest.weight
          ? latest.weight - earliest.weight
          : null;

      const bodyFatDiff =
        earliest.bodyFat && latest.bodyFat
          ? latest.bodyFat - earliest.bodyFat
          : null;

      const daysBetween = Math.floor(
        (latest.date.getTime() - earliest.date.getTime()) /
          (1000 * 60 * 60 * 24)
      );

      return {
        photoType,
        beforePhoto: {
          id: earliest.id,
          photoUrl: earliest.photoUrl,
          date: earliest.date,
          weight: earliest.weight,
          bodyFat: earliest.bodyFat,
        },
        afterPhoto: {
          id: latest.id,
          photoUrl: latest.photoUrl,
          date: latest.date,
          weight: latest.weight,
          bodyFat: latest.bodyFat,
        },
        weightDiff,
        bodyFatDiff,
        daysBetween,
      };
    });

  return suggestions;
}
