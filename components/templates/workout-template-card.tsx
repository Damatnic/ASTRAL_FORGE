/**
 * Workout Template Card Component
 * 
 * Displays workout template with equipment requirements,
 * availability indicator, and details.
 */

'use client'

import { useState } from 'react'
import { 
  Calendar, 
  Target, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp,
  Dumbbell,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { type WorkoutTemplate, getTemplateEquipmentBadge } from '@/lib/workout-templates'

interface WorkoutTemplateCardProps {
  template: WorkoutTemplate
  canPerform: boolean
  missingEquipment?: string[]
  onSelect?: (template: WorkoutTemplate) => void
  className?: string
}

const difficultyColors = {
  beginner: 'bg-amber-950/20 text-amber-400 border-2 border-amber-700/30',
  intermediate: 'bg-amber-950/20 text-amber-400 border-2 border-amber-700/30',
  advanced: 'bg-red-950/20 text-red-400 border-2 border-red-700/30',
}

export function WorkoutTemplateCard({
  template,
  canPerform,
  missingEquipment = [],
  onSelect,
  className,
}: WorkoutTemplateCardProps) {
  const [expanded, setExpanded] = useState(false)
  const badge = getTemplateEquipmentBadge(template)

  return (
    <div
      className={cn(
        'bg-astral-gray border-2 p-5 transition-all hover:border-amber-700/50',
        canPerform 
          ? 'border-amber-700/30' 
          : 'border-astral-light opacity-90',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-black text-white uppercase tracking-wider">{template.name}</h3>
            {canPerform ? (
              <CheckCircle2 className="w-5 h-5 text-amber-400 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
            )}
          </div>
          
          <p className="text-sm text-astral-text-dim mb-3">
            {template.description}
          </p>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <span className={cn('px-2 py-1 rounded-full text-xs font-medium border', badge.color)}>
              {badge.text}
            </span>
            <span className={cn('px-2 py-1 rounded-full text-xs font-medium border', difficultyColors[template.difficulty])}>
              {template.difficulty.charAt(0).toUpperCase() + template.difficulty.slice(1)}
            </span>
            <span className="px-2 py-1 rounded-full text-xs font-medium border bg-astral-dark border-astral-light text-white">
              {template.daysPerWeek}x/week
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-astral-dark/50 rounded-lg p-3 text-center">
          <Calendar className="w-4 h-4 mx-auto mb-1 text-astral-accent" />
          <div className="text-xs text-astral-text-dim">Duration</div>
          <div className="text-sm font-bold text-white">{template.duration}</div>
        </div>
        
        <div className="bg-astral-dark/50 rounded-lg p-3 text-center">
          <Target className="w-4 h-4 mx-auto mb-1 text-astral-accent" />
          <div className="text-xs text-astral-text-dim">Goals</div>
          <div className="text-sm font-bold text-white capitalize">
            {template.goals[0]}
          </div>
        </div>

        <div className="bg-astral-dark/50 rounded-lg p-3 text-center">
          <Clock className="w-4 h-4 mx-auto mb-1 text-astral-accent" />
          <div className="text-xs text-astral-text-dim">Per Session</div>
          <div className="text-sm font-bold text-white">
            {template.weeklySchedule[0]?.estimatedDuration || 45}min
          </div>
        </div>
      </div>

      {/* Availability Status */}
      <div className={cn(
        'flex items-center gap-2 px-3 py-2 text-sm mb-3 font-black uppercase tracking-wider',
        canPerform
          ? 'bg-amber-950/10 border-2 border-amber-700/30 text-amber-400'
          : 'bg-amber-950/10 border-2 border-amber-700/30 text-amber-400'
      )}>
        {canPerform ? (
          <>
            <CheckCircle2 className="w-4 h-4" />
            <span>You have all required equipment</span>
          </>
        ) : (
          <>
            <AlertCircle className="w-4 h-4" />
            <span>Missing: {missingEquipment.join(', ')}</span>
          </>
        )}
      </div>

      {/* Equipment Requirements */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-sm text-astral-accent hover:text-astral-accent-bright transition-colors mb-2 w-full"
      >
        {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        <span>Equipment & Schedule</span>
      </button>

      {expanded && (
        <div className="space-y-3 pt-3 border-t border-astral-light">
          {/* Required Equipment */}
          <div>
            <h4 className="text-xs font-medium text-white mb-2 flex items-center gap-1">
              <Dumbbell className="w-3 h-3" />
              Required Equipment
            </h4>
            <div className="flex flex-wrap gap-1">
              {template.requiredEquipment.length === 0 ? (
                <span className="text-xs text-astral-text-dim">None (bodyweight only)</span>
              ) : (
                template.requiredEquipment.map(eq => (
                  <span
                    key={eq}
                    className="px-2 py-1 bg-astral-dark border border-astral-light rounded text-xs text-white"
                  >
                    {eq}
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Optional Equipment */}
          {template.optionalEquipment.length > 0 && (
            <div>
              <h4 className="text-xs font-medium text-white mb-2">Optional Equipment</h4>
              <div className="flex flex-wrap gap-1">
                {template.optionalEquipment.map(eq => (
                  <span
                    key={eq}
                    className="px-2 py-1 bg-astral-dark/50 border border-astral-light/50 rounded text-xs text-astral-text-dim"
                  >
                    {eq}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Weekly Schedule */}
          <div>
            <h4 className="text-xs font-medium text-white mb-2">Weekly Schedule</h4>
            <div className="space-y-1">
              {template.weeklySchedule.map((day, index) => (
                <div key={index} className="flex items-center justify-between text-xs bg-astral-dark/50 rounded px-2 py-1">
                  <span className="text-white font-medium">{day.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-astral-text-dim">{day.exercises.length} exercises</span>
                    <span className="text-astral-text-dim">•</span>
                    <span className="text-astral-text-dim">{day.estimatedDuration}min</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Action Button */}
      {onSelect && (
        <button
          onClick={() => onSelect(template)}
          className={cn(
            'w-full mt-4 px-4 py-3 rounded-lg font-medium transition-all',
            canPerform
              ? 'bg-astral-accent text-astral-dark hover:bg-astral-accent-bright'
              : 'bg-astral-dark border border-astral-light text-white hover:border-astral-accent'
          )}
        >
          {canPerform ? 'Start This Program' : 'View Details'}
        </button>
      )}
    </div>
  )
}
