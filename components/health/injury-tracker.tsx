'use client'

import { useState } from 'react'
import { AlertTriangle, Calendar, TrendingUp, X, Plus, CheckCircle2, Clock } from 'lucide-react'

interface Injury {
  id: number
  name: string
  severity: 'minor' | 'moderate' | 'severe'
  affectedArea: string
  startDate: string
  estimatedRecovery: string
  status: 'new' | 'recovering' | 'healed'
  restrictedExercises: string[]
  notes: string
  recoveryProgress: number
}

interface InjuryTrackerProps {
  injuries?: Injury[]
  onAddInjury?: () => void
  onUpdateInjury?: (id: number, updates: Partial<Injury>) => void
  onRemoveInjury?: (id: number) => void
}

export function InjuryTracker({
  injuries = [],
  onAddInjury,
  onUpdateInjury,
  onRemoveInjury
}: InjuryTrackerProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const severityColors = {
    minor: {
      bg: 'from-green-500/20 to-emerald-500/20',
      text: 'text-green-400',
      border: 'border-green-500/30',
      badge: 'bg-green-500/20 text-green-400 border-green-500/30'
    },
    moderate: {
      bg: 'from-yellow-500/20 to-orange-500/20',
      text: 'text-yellow-400',
      border: 'border-yellow-500/30',
      badge: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    },
    severe: {
      bg: 'from-red-500/20 to-pink-500/20',
      text: 'text-red-400',
      border: 'border-red-500/30',
      badge: 'bg-red-500/20 text-red-400 border-red-500/30'
    }
  }

  const statusIcons = {
    new: AlertTriangle,
    recovering: TrendingUp,
    healed: CheckCircle2
  }

  function getDaysRemaining(recoveryDate: string): number {
    const today = new Date()
    const recovery = new Date(recoveryDate)
    const diff = recovery.getTime() - today.getTime()
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  }

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-yellow-400" />
          Injury Tracker
        </h2>
        {onAddInjury && (
          <button
            onClick={onAddInjury}
            className="px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Log Injury
          </button>
        )}
      </div>

      {injuries.length === 0 ? (
        <div className="text-center py-12">
          <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No active injuries</p>
          <p className="text-green-400 text-xs mt-1">You&apos;re healthy! Keep it up! 💪</p>
        </div>
      ) : (
        <div className="space-y-4">
          {injuries.map((injury) => {
            const colors = severityColors[injury.severity]
            const StatusIcon = statusIcons[injury.status]
            const isExpanded = expandedId === injury.id
            const daysRemaining = getDaysRemaining(injury.estimatedRecovery)

            return (
              <div
                key={injury.id}
                className={`bg-gradient-to-br ${colors.bg} border ${colors.border} rounded-xl p-4 transition-all ${
                  isExpanded ? 'ring-2 ring-offset-2 ring-offset-slate-950' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg">{injury.name}</h3>
                      <span className={`px-2 py-0.5 rounded-md text-xs font-semibold border ${colors.badge}`}>
                        {injury.severity}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">{injury.affectedArea}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusIcon className={`w-5 h-5 ${colors.text}`} />
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : injury.id)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <svg
                        className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-400">Recovery Progress</span>
                    <span className={colors.text}>{injury.recoveryProgress}%</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${colors.bg} transition-all duration-500`}
                      style={{ width: `${injury.recoveryProgress}%` }}
                    />
                  </div>
                </div>

                {/* Timeline */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Started</p>
                      <p className="text-gray-300">{new Date(injury.startDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Est. Recovery</p>
                      <p className={colors.text}>
                        {daysRemaining === 0 ? 'Today' : `${daysRemaining} days`}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-slate-700/50 pt-3 mt-3 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* Restricted Exercises */}
                    {injury.restrictedExercises.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-gray-400 mb-2">⛔ Avoid These Exercises:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {injury.restrictedExercises.map((exercise, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded text-xs"
                            >
                              {exercise}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Notes */}
                    {injury.notes && (
                      <div>
                        <p className="text-xs font-semibold text-gray-400 mb-1">📝 Notes:</p>
                        <p className="text-sm text-gray-300 bg-slate-800/50 rounded-lg p-2">{injury.notes}</p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      {onUpdateInjury && (
                        <button
                          onClick={() =>
                            onUpdateInjury(injury.id, {
                              recoveryProgress: Math.min(100, injury.recoveryProgress + 10)
                            })
                          }
                          className="flex-1 px-3 py-1.5 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 rounded text-xs font-medium transition-colors"
                        >
                          Mark Progress
                        </button>
                      )}
                      {onRemoveInjury && (
                        <button
                          onClick={() => onRemoveInjury(injury.id)}
                          className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded text-xs font-medium transition-colors flex items-center gap-1"
                        >
                          <X className="w-3 h-3" />
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
