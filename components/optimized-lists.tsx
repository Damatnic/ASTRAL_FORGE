'use client'

import { useRef, useCallback, memo } from 'react'
import { useVirtualScroll } from '@/lib/performance'
import Link from 'next/link'

interface WorkoutItem {
  id: string
  name: string
  date: string
  duration?: number
  completed: boolean
}

interface VirtualWorkoutListProps {
  workouts: WorkoutItem[]
  containerHeight?: number
  itemHeight?: number
}

// Memoized workout card component
const WorkoutCard = memo(({ workout }: { workout: WorkoutItem }) => {
  return (
    <Link
      href={`/workout/${workout.id}`}
      className="block bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-4 hover:border-blue-500/50 transition-all"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="font-bold text-white mb-1">{workout.name}</div>
          <div className="text-sm text-slate-400">
            {new Date(workout.date).toLocaleDateString()}
          </div>
        </div>
        
        {workout.duration && (
          <div className="text-sm text-slate-400">
            {Math.floor(workout.duration / 60)}m
          </div>
        )}
        
        {workout.completed && (
          <div className="ml-2 text-green-400">✓</div>
        )}
      </div>
    </Link>
  )
})

WorkoutCard.displayName = 'WorkoutCard'

// Virtual scrolling workout list for performance
export function VirtualWorkoutList({
  workouts,
  containerHeight = 600,
  itemHeight = 80
}: VirtualWorkoutListProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  
  const {
    visibleItems,
    totalHeight,
    offsetY,
    onScroll
  } = useVirtualScroll(workouts, {
    itemHeight,
    containerHeight,
    overscan: 5
  })

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    onScroll(e.currentTarget.scrollTop)
  }, [onScroll])

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="overflow-y-auto"
      style={{ height: containerHeight }}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div
          style={{
            transform: `translateY(${offsetY}px)`,
            position: 'absolute',
            width: '100%'
          }}
        >
          <div className="space-y-3">
            {visibleItems.map((workout) => (
              <div key={workout.id} style={{ height: itemHeight }}>
                <WorkoutCard workout={workout} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Optimized exercise list with lazy loading
interface ExerciseItem {
  id: string
  name: string
  sets: number
  reps: number
  weight?: number
}

const ExerciseCard = memo(({ exercise }: { exercise: ExerciseItem }) => {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
      <div className="font-semibold text-white mb-1">{exercise.name}</div>
      <div className="text-sm text-slate-400">
        {exercise.sets} sets × {exercise.reps} reps
        {exercise.weight && ` @ ${exercise.weight}kg`}
      </div>
    </div>
  )
})

ExerciseCard.displayName = 'ExerciseCard'

export function OptimizedExerciseList({ exercises }: { exercises: ExerciseItem[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {exercises.map((exercise) => (
        <ExerciseCard key={exercise.id} exercise={exercise} />
      ))}
    </div>
  )
}

// Lazy loading image component
export const LazyImage = memo(({
  src,
  alt,
  className
}: {
  src: string
  alt: string
  className?: string
}) => {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={className}
    />
  )
})

LazyImage.displayName = 'LazyImage'
