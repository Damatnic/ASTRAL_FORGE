/**
 * Exercise Library with Equipment-Based Filtering
 * 
 * Features:
 * - Filter by equipment availability
 * - Filter by muscle group
 * - Filter by exercise category
 * - Search exercises
 * - Show alternatives for unavailable exercises
 * - Equipment requirement badges
 */

'use client'

import { useState, useMemo } from 'react'
import { Search, Filter, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  type ExerciseWithEquipment,
  groupExercisesByAvailability,
  getExerciseFilterResult,
} from '@/lib/equipment-filters'
import { ExerciseCardEnhanced } from './exercise-card-enhanced'

interface ExerciseLibraryFilteredProps {
  exercises: ExerciseWithEquipment[]
  userEquipment: string[]
  onSelectExercise?: (exercise: ExerciseWithEquipment) => void
  className?: string
}

type AvailabilityFilter = 'all' | 'available' | 'unavailable' | 'bodyweight'
type MuscleGroupFilter = 'all' | 'push' | 'pull' | 'legs' | 'core'
type CategoryFilter = 'all' | 'compound' | 'isolation' | 'accessory'

export function ExerciseLibraryFiltered({
  exercises,
  userEquipment,
  onSelectExercise,
  className,
}: ExerciseLibraryFilteredProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [availabilityFilter, setAvailabilityFilter] = useState<AvailabilityFilter>('all')
  const [muscleGroupFilter, setMuscleGroupFilter] = useState<MuscleGroupFilter>('all')
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all')
  const [showFilters, setShowFilters] = useState(false)

  // Group exercises by availability
  const { available, unavailable, bodyweight } = useMemo(
    () => groupExercisesByAvailability(exercises, userEquipment),
    [exercises, userEquipment]
  )

  // Apply all filters
  const filteredExercises = useMemo(() => {
    let filtered = exercises

    // Availability filter
    if (availabilityFilter === 'available') {
      filtered = available
    } else if (availabilityFilter === 'unavailable') {
      filtered = unavailable
    } else if (availabilityFilter === 'bodyweight') {
      filtered = bodyweight
    }

    // Muscle group filter
    if (muscleGroupFilter !== 'all') {
      filtered = filtered.filter(ex => ex.muscleGroup === muscleGroupFilter)
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(ex => ex.category === categoryFilter)
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(ex =>
        ex.name.toLowerCase().includes(query) ||
        ex.description?.toLowerCase().includes(query) ||
        ex.muscleGroup.toLowerCase().includes(query)
      )
    }

    return filtered
  }, [
    exercises,
    available,
    unavailable,
    bodyweight,
    availabilityFilter,
    muscleGroupFilter,
    categoryFilter,
    searchQuery,
  ])

  // Get filter results for each exercise
  const exercisesWithResults = useMemo(() => {
    return filteredExercises.map(exercise => ({
      exercise,
      filterResult: getExerciseFilterResult(exercise, userEquipment, exercises),
    }))
  }, [filteredExercises, userEquipment, exercises])

  const activeFilterCount = [
    availabilityFilter !== 'all',
    muscleGroupFilter !== 'all',
    categoryFilter !== 'all',
  ].filter(Boolean).length

  return (
    <div className={cn('space-y-4', className)}>
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-astral-text-dim" />
        <input
          type="text"
          placeholder="Search exercises..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-astral-dark border border-astral-light rounded-lg pl-10 pr-4 py-3 text-white placeholder:text-astral-text-dim focus:outline-none focus:ring-2 focus:ring-astral-accent"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-astral-text-dim hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-astral-dark border border-astral-light rounded-lg hover:border-astral-accent transition-colors"
        >
          <Filter className="w-4 h-4" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="px-2 py-0.5 bg-astral-accent text-astral-dark text-xs font-bold rounded-full">
              {activeFilterCount}
            </span>
          )}
        </button>

        <div className="text-sm text-astral-text-dim">
          {filteredExercises.length} exercise{filteredExercises.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-astral-dark border border-astral-light rounded-lg p-4 space-y-4">
          {/* Availability Filter */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Equipment Availability
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['all', 'available', 'unavailable', 'bodyweight'] as const).map(filter => (
                <button
                  key={filter}
                  onClick={() => setAvailabilityFilter(filter)}
                  className={cn(
                    'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    availabilityFilter === filter
                      ? 'bg-astral-accent text-astral-dark'
                      : 'bg-astral-gray border border-astral-light text-white hover:border-astral-accent'
                  )}
                >
                  {filter === 'all' && 'All'}
                  {filter === 'available' && `Available (${available.length})`}
                  {filter === 'unavailable' && `Unavailable (${unavailable.length})`}
                  {filter === 'bodyweight' && `Bodyweight (${bodyweight.length})`}
                </button>
              ))}
            </div>
          </div>

          {/* Muscle Group Filter */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Muscle Group
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {(['all', 'push', 'pull', 'legs', 'core'] as const).map(group => (
                <button
                  key={group}
                  onClick={() => setMuscleGroupFilter(group)}
                  className={cn(
                    'px-3 py-2 rounded-lg text-sm font-medium capitalize transition-colors',
                    muscleGroupFilter === group
                      ? 'bg-astral-accent text-astral-dark'
                      : 'bg-astral-gray border border-astral-light text-white hover:border-astral-accent'
                  )}
                >
                  {group}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Exercise Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['all', 'compound', 'isolation', 'accessory'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={cn(
                    'px-3 py-2 rounded-lg text-sm font-medium capitalize transition-colors',
                    categoryFilter === cat
                      ? 'bg-astral-accent text-astral-dark'
                      : 'bg-astral-gray border border-astral-light text-white hover:border-astral-accent'
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          {activeFilterCount > 0 && (
            <button
              onClick={() => {
                setAvailabilityFilter('all')
                setMuscleGroupFilter('all')
                setCategoryFilter('all')
              }}
              className="w-full px-4 py-2 bg-astral-gray border border-astral-light rounded-lg text-white hover:border-red-500 hover:text-red-400 transition-colors"
            >
              Clear All Filters
            </button>
          )}
        </div>
      )}

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-green-400">{available.length}</div>
          <div className="text-xs text-green-300/70">Available</div>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-blue-400">{bodyweight.length}</div>
          <div className="text-xs text-blue-300/70">Bodyweight</div>
        </div>
        <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-orange-400">{unavailable.length}</div>
          <div className="text-xs text-orange-300/70">Unavailable</div>
        </div>
      </div>

      {/* Exercise List */}
      {filteredExercises.length === 0 ? (
        <div className="text-center py-12 bg-astral-dark border border-astral-light rounded-lg">
          <p className="text-astral-text-dim mb-2">No exercises found</p>
          <button
            onClick={() => {
              setSearchQuery('')
              setAvailabilityFilter('all')
              setMuscleGroupFilter('all')
              setCategoryFilter('all')
            }}
            className="text-astral-accent hover:text-astral-accent-bright transition-colors"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {exercisesWithResults.map(({ exercise, filterResult }) => (
            <ExerciseCardEnhanced
              key={exercise.id}
              exercise={exercise}
              filterResult={filterResult}
              onSelectAlternative={onSelectExercise}
            />
          ))}
        </div>
      )}
    </div>
  )
}
