/**
 * Workout Template Browser
 * 
 * Browse and filter pre-built workout programs based on equipment availability
 */

'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ArrowLeft, Search, Filter, X, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'
import { 
  workoutTemplates, 
  filterTemplatesByEquipment,
  type WorkoutTemplate 
} from '@/lib/workout-templates'
import { WorkoutTemplateCard } from '@/components/templates/workout-template-card'

// Mock user equipment - in production, fetch from database
const mockUserEquipment = [
  'Olympic Barbell (20kg)',
  'Dumbbell (Pair)',
  'Flat Bench',
  'Pull-up Bar',
  'Power Rack',
]

type CategoryFilter = 'all' | 'home-gym' | 'commercial-gym' | 'minimal' | 'bodyweight' | 'barbell-only' | 'dumbbell-only'
type DifficultyFilter = 'all' | 'beginner' | 'intermediate' | 'advanced'
type GoalFilter = 'all' | 'strength' | 'hypertrophy' | 'endurance'

export default function WorkoutTemplatesBrowserPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all')
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>('all')
  const [goalFilter, setGoalFilter] = useState<GoalFilter>('all')
  const [showFilters, setShowFilters] = useState(false)

  // Filter templates by equipment
  const { available, partial, unavailable } = useMemo(
    () => filterTemplatesByEquipment(workoutTemplates, mockUserEquipment),
    []
  )

  // Apply additional filters
  const filteredTemplates = useMemo(() => {
    let templates = [...available, ...partial]

    // Category filter
    if (categoryFilter !== 'all') {
      templates = templates.filter(t => t.category === categoryFilter)
    }

    // Difficulty filter
    if (difficultyFilter !== 'all') {
      templates = templates.filter(t => t.difficulty === difficultyFilter)
    }

    // Goal filter
    if (goalFilter !== 'all') {
      templates = templates.filter(t => t.goals.includes(goalFilter))
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      templates = templates.filter(t =>
        t.name.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query)
      )
    }

    return templates
  }, [available, partial, categoryFilter, difficultyFilter, goalFilter, searchQuery])

  // Get missing equipment for each template
  const getTemplateStatus = (template: WorkoutTemplate) => {
    const hasAllRequired = template.requiredEquipment.every(eq =>
      mockUserEquipment.some(userEq => userEq.toLowerCase().includes(eq.toLowerCase()))
    )

    const missingEquipment = template.requiredEquipment.filter(eq =>
      !mockUserEquipment.some(userEq => userEq.toLowerCase().includes(eq.toLowerCase()))
    )

    return { canPerform: hasAllRequired, missingEquipment }
  }

  const activeFilterCount = [
    categoryFilter !== 'all',
    difficultyFilter !== 'all',
    goalFilter !== 'all',
  ].filter(Boolean).length

  return (
    <div className="min-h-screen bg-astral-dark p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-astral-text-dim hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>

          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-8 h-8 text-astral-accent" />
            <h1 className="text-3xl font-bold text-white">Workout Templates</h1>
          </div>
          
          <p className="text-astral-text-dim">
            Pre-built workout programs filtered by your available equipment. Find the perfect program for your goals.
          </p>
        </div>

        {/* Equipment Summary */}
        <div className="bg-astral-gray border border-astral-light rounded-lg p-4 mb-6">
          <h2 className="text-sm font-medium text-white mb-2">Your Equipment</h2>
          <div className="flex flex-wrap gap-2">
            {mockUserEquipment.map(equipment => (
              <span
                key={equipment}
                className="px-3 py-1 bg-astral-dark border border-astral-accent/30 rounded-full text-xs text-astral-accent"
              >
                {equipment}
              </span>
            ))}
            <Link
              href="/settings/equipment"
              className="px-3 py-1 bg-astral-accent/10 border border-astral-accent rounded-full text-xs text-astral-accent hover:bg-astral-accent/20 transition-colors"
            >
              Edit Equipment
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-astral-text-dim" />
          <input
            type="text"
            placeholder="Search templates..."
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
        <div className="flex items-center justify-between mb-4">
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
            {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-astral-dark border border-astral-light rounded-lg p-4 mb-6 space-y-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Equipment Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                {(['all', 'home-gym', 'commercial-gym', 'minimal', 'bodyweight', 'barbell-only', 'dumbbell-only'] as const).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={cn(
                      'px-3 py-2 rounded-lg text-xs font-medium capitalize transition-colors',
                      categoryFilter === cat
                        ? 'bg-astral-accent text-astral-dark'
                        : 'bg-astral-gray border border-astral-light text-white hover:border-astral-accent'
                    )}
                  >
                    {cat === 'all' ? 'All' : cat.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Filter */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Difficulty Level
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['all', 'beginner', 'intermediate', 'advanced'] as const).map(diff => (
                  <button
                    key={diff}
                    onClick={() => setDifficultyFilter(diff)}
                    className={cn(
                      'px-3 py-2 rounded-lg text-sm font-medium capitalize transition-colors',
                      difficultyFilter === diff
                        ? 'bg-astral-accent text-astral-dark'
                        : 'bg-astral-gray border border-astral-light text-white hover:border-astral-accent'
                    )}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Goal Filter */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Primary Goal
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['all', 'strength', 'hypertrophy', 'endurance'] as const).map(goal => (
                  <button
                    key={goal}
                    onClick={() => setGoalFilter(goal)}
                    className={cn(
                      'px-3 py-2 rounded-lg text-sm font-medium capitalize transition-colors',
                      goalFilter === goal
                        ? 'bg-astral-accent text-astral-dark'
                        : 'bg-astral-gray border border-astral-light text-white hover:border-astral-accent'
                    )}
                  >
                    {goal}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            {activeFilterCount > 0 && (
              <button
                onClick={() => {
                  setCategoryFilter('all')
                  setDifficultyFilter('all')
                  setGoalFilter('all')
                }}
                className="w-full px-4 py-2 bg-astral-gray border border-astral-light rounded-lg text-white hover:border-red-500 hover:text-red-400 transition-colors"
              >
                Clear All Filters
              </button>
            )}
          </div>
        )}

        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-green-400">{available.length}</div>
            <div className="text-xs text-green-300/70">Ready to Start</div>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-yellow-400">{partial.length}</div>
            <div className="text-xs text-yellow-300/70">Partial Equipment</div>
          </div>
          <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-orange-400">{unavailable.length}</div>
            <div className="text-xs text-orange-300/70">Missing Equipment</div>
          </div>
        </div>

        {/* Templates Grid */}
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-12 bg-astral-dark border border-astral-light rounded-lg">
            <p className="text-astral-text-dim mb-2">No templates found</p>
            <button
              onClick={() => {
                setSearchQuery('')
                setCategoryFilter('all')
                setDifficultyFilter('all')
                setGoalFilter('all')
              }}
              className="text-astral-accent hover:text-astral-accent-bright transition-colors"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTemplates.map(template => {
              const { canPerform, missingEquipment } = getTemplateStatus(template)
              return (
                <WorkoutTemplateCard
                  key={template.id}
                  template={template}
                  canPerform={canPerform}
                  missingEquipment={missingEquipment}
                  onSelect={(t) => {
                    console.log('Selected template:', t)
                    // Handle template selection - could navigate to program creation
                  }}
                />
              )
            })}
          </div>
        )}

        {/* Info Section */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="bg-astral-gray border border-astral-light rounded-lg p-4">
            <h3 className="font-bold text-white mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              Ready to Start
            </h3>
            <p className="text-sm text-astral-text-dim">
              You have all required equipment for these programs
            </p>
          </div>

          <div className="bg-astral-gray border border-astral-light rounded-lg p-4">
            <h3 className="font-bold text-white mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
              Partial Equipment
            </h3>
            <p className="text-sm text-astral-text-dim">
              Programs with some equipment missing but still doable with modifications
            </p>
          </div>

          <div className="bg-astral-gray border border-astral-light rounded-lg p-4">
            <h3 className="font-bold text-white mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
              Missing Equipment
            </h3>
            <p className="text-sm text-astral-text-dim">
              Programs requiring equipment you do not currently have
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
