'use client'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
  count?: number
}

export function Skeleton({ 
  className = '', 
  variant = 'text',
  width,
  height,
  count = 1
}: SkeletonProps) {
  const baseClasses = 'animate-pulse bg-gradient-to-r from-neutral-800 via-neutral-700 to-neutral-800 bg-[length:200%_100%]'
  
  const variantClasses = {
    text: 'h-4',
    circular: '',
    rectangular: '',
  }

  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  }

  if (count > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            style={style}
          />
        ))}
      </div>
    )
  }

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  )
}

// Pre-built skeleton layouts
export function CardSkeleton() {
  return (
    <div className="bg-neutral-900 border-2 border-neutral-800 p-6 space-y-4">
      <Skeleton variant="rectangular" height={200} />
      <Skeleton variant="text" width="60%" height={24} />
      <Skeleton variant="text" count={3} />
      <div className="flex gap-2">
        <Skeleton variant="rectangular" width={80} height={32} />
        <Skeleton variant="rectangular" width={80} height={32} />
      </div>
    </div>
  )
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 items-center p-4 bg-neutral-900 border-2 border-neutral-800">
          <Skeleton variant="circular" width={40} height={40} />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" width="40%" height={20} />
            <Skeleton variant="text" width="60%" />
          </div>
          <Skeleton variant="rectangular" width={60} height={32} />
        </div>
      ))}
    </div>
  )
}

export function WorkoutCardSkeleton() {
  return (
    <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 border-2 border-amber-700/30 p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width="50%" height={28} />
          <Skeleton variant="text" width="70%" />
        </div>
        <Skeleton variant="circular" width={48} height={48} />
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-neutral-900 border-2 border-neutral-800 p-3 space-y-1">
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="80%" height={24} />
          </div>
        ))}
      </div>
      <Skeleton variant="rectangular" height={44} className="rounded-lg" />
    </div>
  )
}

export function ExerciseListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-neutral-900 border-2 border-neutral-800 p-4">
          <div className="flex items-center gap-4">
            <Skeleton variant="rectangular" width={80} height={80} className="rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton variant="text" width="40%" height={20} />
              <Skeleton variant="text" width="60%" />
              <div className="flex gap-2">
                <Skeleton variant="rectangular" width={60} height={24} className="rounded-full" />
                <Skeleton variant="rectangular" width={60} height={24} className="rounded-full" />
              </div>
            </div>
            <Skeleton variant="rectangular" width={100} height={36} className="rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function ProgramDetailSkeleton() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <Skeleton variant="text" width="40%" height={40} />
        <Skeleton variant="text" width="70%" />
        
        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-neutral-900 border-2 border-neutral-800 p-4 space-y-2">
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" width="80%" height={24} />
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Skeleton variant="rectangular" width={150} height={48} />
        <Skeleton variant="rectangular" width={120} height={48} />
      </div>

      {/* Exercise Days */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-neutral-900 border-2 border-neutral-800 p-6 space-y-4">
          <Skeleton variant="text" width="30%" height={28} />
          <ExerciseListSkeleton count={3} />
        </div>
      ))}
    </div>
  )
}
