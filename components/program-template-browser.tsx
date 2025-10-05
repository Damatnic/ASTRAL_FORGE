'use client'

import { useState } from 'react'
import Link from 'next/link'

export interface ProgramTemplate {
  id: string
  name: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  daysPerWeek: number
  duration: string
  goals: string[]
  equipment: string[]
  type: 'strength' | 'hypertrophy' | 'powerlifting' | 'bodyweight' | 'hybrid'
  tags: string[]
  popular?: boolean
  featured?: boolean
}

const PROGRAM_TEMPLATES: ProgramTemplate[] = [
  {
    id: 'stronglifts-5x5',
    name: 'StrongLifts 5×5',
    description: 'The classic beginner strength program. Build foundational strength with compound movements and linear progression.',
    difficulty: 'beginner',
    daysPerWeek: 3,
    duration: '12-16 weeks',
    goals: ['Strength', 'Muscle Mass', 'Athletic Performance'],
    equipment: ['Barbell', 'Squat Rack', 'Bench'],
    type: 'strength',
    tags: ['linear progression', 'full body', 'compound movements'],
    popular: true,
    featured: true
  },
  {
    id: 'starting-strength',
    name: 'Starting Strength',
    description: "Mark Rippetoe's renowned novice program. Focus on the squat, deadlift, bench press, and overhead press with 3x5 sets.",
    difficulty: 'beginner',
    daysPerWeek: 3,
    duration: '12-16 weeks',
    goals: ['Strength', 'Power', 'Foundation Building'],
    equipment: ['Barbell', 'Squat Rack', 'Bench', 'Power Rack'],
    type: 'strength',
    tags: ['novice', 'powerlifting', 'compound movements'],
    popular: true
  },
  {
    id: 'ppl',
    name: 'PPL (Push/Pull/Legs)',
    description: 'A flexible 6-day split focusing on pushing movements, pulling movements, and legs. Great for hypertrophy and volume.',
    difficulty: 'intermediate',
    daysPerWeek: 6,
    duration: 'Ongoing',
    goals: ['Muscle Mass', 'Definition', 'Aesthetic'],
    equipment: ['Barbell', 'Dumbbells', 'Cable Machine', 'Bench'],
    type: 'hypertrophy',
    tags: ['high volume', 'bodybuilding', 'split routine'],
    popular: true,
    featured: true
  },
  {
    id: 'upper-lower',
    name: 'Upper/Lower Split',
    description: '4-day split alternating between upper and lower body. Balanced approach for strength and size.',
    difficulty: 'intermediate',
    daysPerWeek: 4,
    duration: 'Ongoing',
    goals: ['Strength', 'Muscle Mass', 'Balance'],
    equipment: ['Barbell', 'Dumbbells', 'Bench', 'Squat Rack'],
    type: 'hybrid',
    tags: ['balanced', 'frequency', 'progressive overload'],
    popular: true
  },
  {
    id: '531',
    name: "Wendler's 5/3/1",
    description: 'Monthly progressive overload with deload weeks. Focus on squat, deadlift, bench, and OHP with accessory work.',
    difficulty: 'intermediate',
    daysPerWeek: 4,
    duration: 'Ongoing (4-week cycles)',
    goals: ['Strength', 'Long-term Progress', 'Consistency'],
    equipment: ['Barbell', 'Squat Rack', 'Bench', 'Power Rack'],
    type: 'strength',
    tags: ['periodization', 'powerlifting', 'monthly cycles'],
    featured: true
  },
  {
    id: 'gzclp',
    name: 'GZCLP',
    description: 'Linear progression with tier-based training. Combines heavy compound work with volume accessories.',
    difficulty: 'intermediate',
    daysPerWeek: 4,
    duration: '12-20 weeks',
    goals: ['Strength', 'Muscle Mass', 'Work Capacity'],
    equipment: ['Barbell', 'Dumbbells', 'Squat Rack', 'Bench'],
    type: 'hybrid',
    tags: ['linear progression', 'powerlifting', 'structured'],
    popular: true
  },
  {
    id: 'bodyweight-beginner',
    name: 'Bodyweight Basics',
    description: 'Build strength with no equipment. Perfect for home training or beginners.',
    difficulty: 'beginner',
    daysPerWeek: 3,
    duration: '8-12 weeks',
    goals: ['Strength', 'Mobility', 'Foundation'],
    equipment: ['None', 'Pull-up Bar (optional)'],
    type: 'bodyweight',
    tags: ['calisthenics', 'home workout', 'minimal equipment']
  },
  {
    id: 'nsuns-531',
    name: "nSuns 5/3/1",
    description: 'High volume variant of 5/3/1 with aggressive linear progression. For experienced lifters ready to push limits.',
    difficulty: 'advanced',
    daysPerWeek: 5,
    duration: '8-16 weeks',
    goals: ['Strength', 'Muscle Mass', 'Volume Tolerance'],
    equipment: ['Barbell', 'Squat Rack', 'Bench', 'Power Rack'],
    type: 'strength',
    tags: ['high volume', 'powerlifting', 'linear progression']
  },
  {
    id: 'texas-method',
    name: 'Texas Method',
    description: 'Intermediate program with volume day, recovery day, and intensity day. Bridge between novice and advanced.',
    difficulty: 'intermediate',
    daysPerWeek: 3,
    duration: '12-24 weeks',
    goals: ['Strength', 'Progressive Overload', 'Volume Management'],
    equipment: ['Barbell', 'Squat Rack', 'Bench', 'Power Rack'],
    type: 'strength',
    tags: ['weekly progression', 'powerlifting', 'structured volume']
  },
  {
    id: 'madcow-5x5',
    name: 'Madcow 5×5',
    description: 'Intermediate progression from StrongLifts. Weekly progression with ramping sets.',
    difficulty: 'intermediate',
    daysPerWeek: 3,
    duration: '12-16 weeks',
    goals: ['Strength', 'Muscle Mass', 'Progressive Overload'],
    equipment: ['Barbell', 'Squat Rack', 'Bench'],
    type: 'strength',
    tags: ['weekly progression', 'ramping sets', 'compound movements']
  }
]

interface ProgramTemplateCardProps {
  template: ProgramTemplate
  onSelect?: (template: ProgramTemplate) => void
}

function ProgramTemplateCard({ template, onSelect }: ProgramTemplateCardProps) {
  const difficultyColors = {
    beginner: 'bg-green-500/20 text-green-400 border-green-500/30',
    intermediate: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    advanced: 'bg-red-500/20 text-red-400 border-red-500/30'
  }

  const typeColors = {
    strength: 'bg-blue-500/20 text-blue-400',
    hypertrophy: 'bg-purple-500/20 text-purple-400',
    powerlifting: 'bg-red-500/20 text-red-400',
    bodyweight: 'bg-green-500/20 text-green-400',
    hybrid: 'bg-orange-500/20 text-orange-400'
  }

  return (
    <div className="bg-astral-gray border border-gray-800 rounded-xl overflow-hidden hover:border-astral-blue/50 transition-colors">
      {/* Header with badges */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-bold">{template.name}</h3>
          <div className="flex gap-2">
            {template.featured && (
              <span className="text-yellow-400 text-xl" title="Featured">⭐</span>
            )}
            {template.popular && (
              <span className="text-orange-400 text-xl" title="Popular">🔥</span>
            )}
          </div>
        </div>

        <p className="text-gray-300 text-sm mb-4">{template.description}</p>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${difficultyColors[template.difficulty]}`}>
            {template.difficulty}
          </span>
          <span className={`px-3 py-1 rounded-lg text-xs font-medium ${typeColors[template.type]}`}>
            {template.type}
          </span>
          <span className="px-3 py-1 rounded-lg text-xs font-medium bg-gray-700 text-gray-300">
            {template.daysPerWeek}x/week
          </span>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
          <div>
            <div className="text-gray-400 text-xs mb-1">Duration</div>
            <div className="font-medium">{template.duration}</div>
          </div>
          <div>
            <div className="text-gray-400 text-xs mb-1">Equipment</div>
            <div className="font-medium">{template.equipment.slice(0, 2).join(', ')}</div>
          </div>
        </div>

        {/* Goals */}
        <div className="mb-4">
          <div className="text-gray-400 text-xs mb-2">Primary Goals</div>
          <div className="flex flex-wrap gap-1">
            {template.goals.map(goal => (
              <span key={goal} className="px-2 py-1 bg-astral-blue/20 text-astral-blue text-xs rounded">
                {goal}
              </span>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {template.tags.map(tag => (
            <span key={tag} className="px-2 py-1 bg-gray-700/50 text-gray-400 text-xs rounded">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer with action */}
      <div className="bg-gray-800/50 px-6 py-4 flex items-center justify-between">
        <Link
          href={`/programs/templates/${template.id}`}
          className="text-astral-blue hover:text-astral-purple text-sm font-medium"
        >
          View Details →
        </Link>
        {onSelect && (
          <button
            onClick={() => onSelect(template)}
            className="px-4 py-2 bg-gradient-to-r from-astral-blue to-astral-purple text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Use Template
          </button>
        )}
      </div>
    </div>
  )
}

interface ProgramTemplateBrowserProps {
  onSelectTemplate?: (template: ProgramTemplate) => void
  filterDifficulty?: 'beginner' | 'intermediate' | 'advanced' | 'all'
  filterType?: 'strength' | 'hypertrophy' | 'powerlifting' | 'bodyweight' | 'hybrid' | 'all'
  showFilters?: boolean
}

/**
 * ProgramTemplateBrowser Component
 * 
 * Displays a browsable collection of workout program templates.
 * Supports filtering by difficulty, type, and equipment.
 * 
 * @example
 * ```tsx
 * <ProgramTemplateBrowser
 *   onSelectTemplate={(template) => createProgramFromTemplate(template)}
 *   showFilters
 * />
 * ```
 */
export function ProgramTemplateBrowser({
  onSelectTemplate,
  filterDifficulty = 'all',
  filterType = 'all',
  showFilters = true
}: ProgramTemplateBrowserProps) {
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced' | 'all'>(filterDifficulty)
  const [type, setType] = useState<'strength' | 'hypertrophy' | 'powerlifting' | 'bodyweight' | 'hybrid' | 'all'>(filterType)
  const [daysFilter, setDaysFilter] = useState<number | 'all'>('all')

  const filteredTemplates = PROGRAM_TEMPLATES.filter(template => {
    if (difficulty !== 'all' && template.difficulty !== difficulty) return false
    if (type !== 'all' && template.type !== type) return false
    if (daysFilter !== 'all' && template.daysPerWeek !== daysFilter) return false
    return true
  })

  const featuredTemplates = filteredTemplates.filter(t => t.featured)
  const popularTemplates = filteredTemplates.filter(t => t.popular && !t.featured)
  const otherTemplates = filteredTemplates.filter(t => !t.popular && !t.featured)

  return (
    <div className="space-y-6">
      {/* Filters */}
      {showFilters && (
        <div className="bg-astral-gray border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Filter Programs</h3>
          
          <div className="grid md:grid-cols-3 gap-4">
            {/* Difficulty Filter */}
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Program Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
              >
                <option value="all">All Types</option>
                <option value="strength">Strength</option>
                <option value="hypertrophy">Hypertrophy</option>
                <option value="powerlifting">Powerlifting</option>
                <option value="bodyweight">Bodyweight</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>

            {/* Days Filter */}
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Days Per Week</label>
              <select
                value={daysFilter}
                onChange={(e) => setDaysFilter(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
              >
                <option value="all">Any</option>
                <option value={3}>3 days</option>
                <option value={4}>4 days</option>
                <option value={5}>5 days</option>
                <option value={6}>6 days</option>
              </select>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 text-sm text-gray-400">
            Showing {filteredTemplates.length} program{filteredTemplates.length !== 1 ? 's' : ''}
          </div>
        </div>
      )}

      {/* Featured Section */}
      {featuredTemplates.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span className="text-yellow-400">⭐</span>
            Featured Programs
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {featuredTemplates.map(template => (
              <ProgramTemplateCard
                key={template.id}
                template={template}
                onSelect={onSelectTemplate}
              />
            ))}
          </div>
        </div>
      )}

      {/* Popular Section */}
      {popularTemplates.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span className="text-orange-400">🔥</span>
            Popular Programs
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularTemplates.map(template => (
              <ProgramTemplateCard
                key={template.id}
                template={template}
                onSelect={onSelectTemplate}
              />
            ))}
          </div>
        </div>
      )}

      {/* Other Programs */}
      {otherTemplates.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold mb-4">More Programs</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherTemplates.map(template => (
              <ProgramTemplateCard
                key={template.id}
                template={template}
                onSelect={onSelectTemplate}
              />
            ))}
          </div>
        </div>
      )}

      {/* No results */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p className="text-xl mb-2">No programs match your filters</p>
          <p className="text-sm">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  )
}

/**
 * Export the templates array for use in other components
 */
export { PROGRAM_TEMPLATES }
