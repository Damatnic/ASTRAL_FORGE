'use client'

import { useState } from 'react'
import { Trash2, Plus, Clock, Calculator, StickyNote, Zap, ChevronDown, ChevronUp } from 'lucide-react'

export interface WorkoutSet {
  id: string
  setNumber: number
  weight: number | null
  reps: number | null
  rpe: number | null
  isCompleted: boolean
  isToFailure: boolean
  note: string
  restTime: number
}

export interface ExerciseData {
  id: string
  name: string
  sets: WorkoutSet[]
  previousWorkout?: {
    date: string
    sets: { weight: number; reps: number }[]
  }
}

interface EnhancedSetLogProps {
  exercise: ExerciseData
  onUpdateSet: (setId: string, updates: Partial<WorkoutSet>) => void
  onCompleteSet: (setId: string) => void
  onAddSet: () => void
  onRemoveSet: (setId: string) => void
  onToggleFailure: (setId: string) => void
  onAddNote: (setId: string, note: string) => void
  onRemoveExercise: () => void
  onOpenPlateCalculator: (exerciseId: string, setId: string) => void
  onStartRestTimer: (duration: number) => void
}

export function EnhancedSetLog({
  exercise,
  onUpdateSet,
  onCompleteSet,
  onAddSet,
  onRemoveSet,
  onToggleFailure,
  onAddNote,
  onRemoveExercise,
  onOpenPlateCalculator,
  onStartRestTimer
}: EnhancedSetLogProps) {
  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set())
  const [isExpanded, setIsExpanded] = useState(true)

  const toggleNote = (setId: string) => {
    const newExpanded = new Set(expandedNotes)
    if (newExpanded.has(setId)) {
      newExpanded.delete(setId)
    } else {
      newExpanded.add(setId)
    }
    setExpandedNotes(newExpanded)
  }

  const completeSet = (set: WorkoutSet) => {
    if (set.weight && set.reps) {
      onUpdateSet(set.id, { isCompleted: true })
      onStartRestTimer(set.restTime || 90)
    }
  }

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
      {/* Exercise Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          <div>
            <h3 className="text-xl font-bold">{exercise.name}</h3>
            {exercise.previousWorkout && (
              <p className="text-sm text-gray-400">
                Last workout: {exercise.previousWorkout.date} •{' '}
                {exercise.previousWorkout.sets.map(s => `${s.weight}×${s.reps}`).join(', ')}
              </p>
            )}
          </div>
        </div>
        <button
          onClick={onRemoveExercise}
          className="text-red-400 hover:text-red-300 transition-colors"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Sets Table */}
      {isExpanded && (
        <div className="p-4">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-400 border-b border-slate-800">
                  <th className="pb-2 pr-4">Set</th>
                  <th className="pb-2 pr-4">Previous</th>
                  <th className="pb-2 pr-4">Weight (lbs)</th>
                  <th className="pb-2 pr-4">Reps</th>
                  <th className="pb-2 pr-4">RPE</th>
                  <th className="pb-2 pr-4">Actions</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {exercise.sets.map((set) => {
                  const prevSet = exercise.previousWorkout?.sets[set.setNumber - 1]
                  const isNoteExpanded = expandedNotes.has(set.id)
                  
                  return (
                    <>
                      <tr
                        key={set.id}
                        className={`border-b border-slate-800/50 ${
                          set.isCompleted
                            ? 'bg-green-500/10'
                            : set.isToFailure
                            ? 'bg-orange-500/10'
                            : ''
                        }`}
                      >
                        {/* Set Number */}
                        <td className="py-3 pr-4">
                          <span className="font-semibold">{set.setNumber}</span>
                        </td>

                        {/* Previous */}
                        <td className="py-3 pr-4">
                          {prevSet ? (
                            <span className="text-sm text-gray-500">
                              {prevSet.weight} × {prevSet.reps}
                            </span>
                          ) : (
                            <span className="text-sm text-gray-600">—</span>
                          )}
                        </td>

                        {/* Weight */}
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={set.weight || ''}
                              onChange={(e) =>
                                onUpdateSet(set.id, { weight: parseFloat(e.target.value) || null })
                              }
                              disabled={set.isCompleted}
                              className="w-20 px-2 py-1.5 bg-slate-800 border border-slate-700 rounded text-center focus:border-blue-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                              placeholder="0"
                            />
                            <button
                              onClick={() => onOpenPlateCalculator(exercise.id, set.id)}
                              className="text-blue-400 hover:text-blue-300 transition-colors"
                              title="Plate Calculator"
                            >
                              <Calculator className="w-4 h-4" />
                            </button>
                          </div>
                        </td>

                        {/* Reps */}
                        <td className="py-3 pr-4">
                          <input
                            type="number"
                            value={set.reps || ''}
                            onChange={(e) =>
                              onUpdateSet(set.id, { reps: parseInt(e.target.value) || null })
                            }
                            disabled={set.isCompleted}
                            className="w-16 px-2 py-1.5 bg-slate-800 border border-slate-700 rounded text-center focus:border-blue-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                            placeholder="0"
                          />
                        </td>

                        {/* RPE */}
                        <td className="py-3 pr-4">
                          <input
                            type="number"
                            min="1"
                            max="10"
                            value={set.rpe || ''}
                            onChange={(e) =>
                              onUpdateSet(set.id, { rpe: parseInt(e.target.value) || null })
                            }
                            disabled={set.isCompleted}
                            className="w-16 px-2 py-1.5 bg-slate-800 border border-slate-700 rounded text-center focus:border-blue-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                            placeholder="7"
                          />
                        </td>

                        {/* Actions */}
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => onUpdateSet(set.id, { isToFailure: !set.isToFailure })}
                              className={`${
                                set.isToFailure ? 'text-orange-400' : 'text-gray-500'
                              } hover:text-orange-300 transition-colors`}
                              title="To Failure"
                            >
                              <Zap className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => toggleNote(set.id)}
                              className={`${
                                set.note ? 'text-blue-400' : 'text-gray-500'
                              } hover:text-blue-300 transition-colors`}
                              title="Add Note"
                            >
                              <StickyNote className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onRemoveSet(set.id)}
                              className="text-red-400 hover:text-red-300 transition-colors"
                              title="Remove Set"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-3">
                          {set.isCompleted ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 border border-green-500 rounded text-xs font-medium text-green-400">
                              ✓ Done
                            </span>
                          ) : set.weight && set.reps ? (
                            <button
                              onClick={() => completeSet(set)}
                              className="px-3 py-1 bg-blue-500 hover:bg-blue-600 rounded text-xs font-medium transition-colors"
                            >
                              Complete
                            </button>
                          ) : (
                            <span className="text-gray-600 text-xs">Pending</span>
                          )}
                        </td>
                      </tr>

                      {/* Note Row */}
                      {isNoteExpanded && (
                        <tr>
                          <td colSpan={7} className="py-3 bg-slate-800/50">
                            <div className="px-4">
                              <textarea
                                value={set.note}
                                onChange={(e) => onUpdateSet(set.id, { note: e.target.value })}
                                placeholder="Add a note about this set..."
                                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded resize-none focus:border-blue-500 focus:outline-none text-sm"
                                rows={2}
                              />
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-800">
            <button
              onClick={onAddSet}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Set
            </button>
            
            {exercise.sets.length > 0 && !exercise.sets[exercise.sets.length - 1].isCompleted && (
              <button
                onClick={() => onStartRestTimer(90)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500 hover:bg-purple-500/30 rounded-lg font-medium transition-colors text-purple-400"
              >
                <Clock className="w-4 h-4" />
                Start Rest Timer
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
