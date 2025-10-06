/**
 * Enhanced Exercise Card with Equipment Indicators
 * 
 * Shows:
 * - Equipment badges with color coding
 * - "Can I do this?" availability indicator
 * - Alternative exercise suggestions
 * - Equipment requirements
 */

'use client'

import { useState } from 'react'
import { Check, X, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  type ExerciseWithEquipment,
  type FilteredExerciseResult,
  getEquipmentBadge,
} from '@/lib/equipment-filters'

interface ExerciseCardEnhancedProps {
  exercise: ExerciseWithEquipment
  filterResult: FilteredExerciseResult
  onSelectAlternative?: (exercise: ExerciseWithEquipment) => void
  showAlternatives?: boolean
  className?: string
}

export function ExerciseCardEnhanced({
  exercise,
  filterResult,
  onSelectAlternative,
  showAlternatives = true,
  className,
}: ExerciseCardEnhancedProps) {
  const [expanded, setExpanded] = useState(false)
  const badge = getEquipmentBadge(exercise.equipment)

  return (
    <div
      className={cn(
        'bg-astral-gray border rounded-lg p-4 transition-all',
        filterResult.canPerform 
          ? 'border-green-500/30 hover:border-green-500/50' 
          : 'border-astral-light hover:border-astral-light/70 opacity-75',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-white">{exercise.name}</h3>
            {filterResult.canPerform ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <X className="w-4 h-4 text-red-400" />
            )}
          </div>
          
          <div className="flex items-center gap-2 text-sm text-astral-text-dim">
            <span className="capitalize">{exercise.category}</span>
            <span>•</span>
            <span className="capitalize">{exercise.muscleGroup}</span>
          </div>
        </div>

        {/* Equipment Badge */}
        <div
          className={cn(
            'px-3 py-1 rounded-full text-xs font-medium border',
            badge.color
          )}
        >
          {badge.text}
        </div>
      </div>

      {/* Description */}
      {exercise.description && (
        <p className="text-sm text-astral-text-dim mb-3">
          {exercise.description}
        </p>
      )}

      {/* Availability Indicator */}
      <div className={cn(
        'flex items-center gap-2 px-3 py-2 rounded-lg text-sm mb-3',
        filterResult.canPerform
          ? 'bg-green-500/10 border border-green-500/30 text-green-300'
          : 'bg-orange-500/10 border border-orange-500/30 text-orange-300'
      )}>
        {filterResult.canPerform ? (
          <>
            <Check className="w-4 h-4" />
            <span>You can perform this exercise</span>
          </>
        ) : (
          <>
            <AlertCircle className="w-4 h-4" />
            <span>Missing: {filterResult.missingEquipment.join(', ')}</span>
          </>
        )}
      </div>

      {/* Alternatives Section */}
      {!filterResult.canPerform && showAlternatives && filterResult.alternatives.length > 0 && (
        <div className="mt-3 pt-3 border-t border-astral-light">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 text-sm text-astral-accent hover:text-astral-accent-bright transition-colors mb-2 w-full"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            <span>Alternatives ({filterResult.alternatives.length})</span>
          </button>

          {expanded && (
            <div className="space-y-2">
              {filterResult.alternatives.map(alt => {
                const altBadge = getEquipmentBadge(alt.equipment)
                return (
                  <button
                    key={alt.id}
                    onClick={() => onSelectAlternative?.(alt)}
                    className="w-full text-left bg-astral-dark/50 hover:bg-astral-dark rounded-lg p-3 transition-colors group"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-sm font-medium text-white group-hover:text-astral-accent transition-colors">
                        {alt.name}
                      </span>
                      <span className={cn(
                        'px-2 py-0.5 rounded-full text-xs border',
                        altBadge.color
                      )}>
                        {altBadge.text}
                      </span>
                    </div>
                    {alt.description && (
                      <p className="text-xs text-astral-text-dim line-clamp-2">
                        {alt.description}
                      </p>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
