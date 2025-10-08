'use client'

import { useState } from 'react'
import { Zap, TrendingDown, Flame, Link2 } from 'lucide-react'

export type SupersetMode = 'standard' | 'drop-set' | 'tri-set' | 'giant-set'

export interface SupersetModeConfig {
  mode: SupersetMode
  restTime: number
  instructions: string
  icon: typeof Zap
  color: string
  gradient: string
}

interface AdvancedSupersetModesProps {
  isOpen: boolean
  onClose: () => void
  onSelectMode: (config: SupersetModeConfig) => void
}

export function AdvancedSupersetModes({
  isOpen,
  onClose,
  onSelectMode
}: AdvancedSupersetModesProps) {
  const [selectedMode, setSelectedMode] = useState<SupersetMode>('standard')

  const supersetModes: Record<SupersetMode, SupersetModeConfig> = {
    standard: {
      mode: 'standard',
      restTime: 120,
      instructions:
        'Complete one set from each exercise in order, then rest. Perfect for balanced muscle stimulation.',
      icon: Link2,
      color: 'purple',
      gradient: 'from-purple-500 to-pink-500'
    },
    'drop-set': {
      mode: 'drop-set',
      restTime: 60,
      instructions:
        'Perform a set to failure, immediately reduce weight by 20-30%, and continue. Great for muscle exhaustion and growth.',
      icon: TrendingDown,
      color: 'orange',
      gradient: 'from-orange-500 to-red-500'
    },
    'tri-set': {
      mode: 'tri-set',
      restTime: 90,
      instructions:
        'Three exercises targeting the same muscle group with minimal rest. Ideal for hypertrophy and time efficiency.',
      icon: Zap,
      color: 'blue',
      gradient: 'from-blue-500 to-cyan-500'
    },
    'giant-set': {
      mode: 'giant-set',
      restTime: 180,
      instructions:
        'Four or more exercises performed back-to-back. Ultimate challenge for conditioning and muscle endurance.',
      icon: Flame,
      color: 'red',
      gradient: 'from-red-500 to-pink-500'
    }
  }

  const handleSelectMode = (mode: SupersetMode) => {
    setSelectedMode(mode)
  }

  const handleApply = () => {
    onSelectMode(supersetModes[selectedMode])
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border-2 border-purple-500/30 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl shadow-purple-500/20">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 border-b border-purple-500/30 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Advanced Superset Modes</h2>
                <p className="text-sm text-slate-400">Choose your training intensity</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all flex items-center justify-center"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Mode Selection */}
        <div className="p-6 space-y-4">
          {(Object.entries(supersetModes) as [SupersetMode, SupersetModeConfig][]).map(
            ([modeKey, config]) => {
              const Icon = config.icon
              const isSelected = selectedMode === modeKey

              return (
                <button
                  key={modeKey}
                  onClick={() => handleSelectMode(modeKey)}
                  className={`w-full p-6 rounded-xl border-2 transition-all text-left ${
                    isSelected
                      ? 'border-purple-500 bg-gradient-to-r from-purple-500/10 to-pink-500/10 shadow-lg shadow-purple-500/30'
                      : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-16 h-16 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center flex-shrink-0`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold text-white capitalize">
                          {modeKey.replace('-', ' ')}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            isSelected
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                              : 'bg-slate-700 text-slate-300'
                          }`}
                        >
                          {config.restTime}s rest
                        </span>
                      </div>
                      <p className="text-slate-300 text-sm mb-3">{config.instructions}</p>

                      {/* Mode-specific details */}
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        {modeKey === 'standard' && (
                          <>
                            <div className="bg-slate-700/50 px-3 py-2 rounded-lg">
                              <p className="text-slate-400">Exercises</p>
                              <p className="text-white font-semibold">2-3</p>
                            </div>
                            <div className="bg-slate-700/50 px-3 py-2 rounded-lg">
                              <p className="text-slate-400">Intensity</p>
                              <p className="text-green-400 font-semibold">Moderate</p>
                            </div>
                            <div className="bg-slate-700/50 px-3 py-2 rounded-lg">
                              <p className="text-slate-400">Goal</p>
                              <p className="text-white font-semibold">Balance</p>
                            </div>
                          </>
                        )}
                        {modeKey === 'drop-set' && (
                          <>
                            <div className="bg-slate-700/50 px-3 py-2 rounded-lg">
                              <p className="text-slate-400">Drops</p>
                              <p className="text-white font-semibold">2-4</p>
                            </div>
                            <div className="bg-slate-700/50 px-3 py-2 rounded-lg">
                              <p className="text-slate-400">Intensity</p>
                              <p className="text-orange-400 font-semibold">High</p>
                            </div>
                            <div className="bg-slate-700/50 px-3 py-2 rounded-lg">
                              <p className="text-slate-400">Goal</p>
                              <p className="text-white font-semibold">Hypertrophy</p>
                            </div>
                          </>
                        )}
                        {modeKey === 'tri-set' && (
                          <>
                            <div className="bg-slate-700/50 px-3 py-2 rounded-lg">
                              <p className="text-slate-400">Exercises</p>
                              <p className="text-white font-semibold">3</p>
                            </div>
                            <div className="bg-slate-700/50 px-3 py-2 rounded-lg">
                              <p className="text-slate-400">Intensity</p>
                              <p className="text-blue-400 font-semibold">High</p>
                            </div>
                            <div className="bg-slate-700/50 px-3 py-2 rounded-lg">
                              <p className="text-slate-400">Goal</p>
                              <p className="text-white font-semibold">Growth</p>
                            </div>
                          </>
                        )}
                        {modeKey === 'giant-set' && (
                          <>
                            <div className="bg-slate-700/50 px-3 py-2 rounded-lg">
                              <p className="text-slate-400">Exercises</p>
                              <p className="text-white font-semibold">4+</p>
                            </div>
                            <div className="bg-slate-700/50 px-3 py-2 rounded-lg">
                              <p className="text-slate-400">Intensity</p>
                              <p className="text-red-400 font-semibold">Extreme</p>
                            </div>
                            <div className="bg-slate-700/50 px-3 py-2 rounded-lg">
                              <p className="text-slate-400">Goal</p>
                              <p className="text-white font-semibold">Endurance</p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              )
            }
          )}
        </div>

        {/* Tips Section */}
        <div className="border-t border-slate-800 p-6 bg-slate-900/50">
          <h3 className="text-sm font-semibold text-slate-400 mb-3">💡 Training Tips</h3>
          <div className="space-y-2 text-sm text-slate-300">
            {selectedMode === 'standard' && (
              <>
                <p>• Rest 2-3 minutes between complete superset rounds</p>
                <p>• Maintain form and control throughout all exercises</p>
                <p>• Choose complementary exercises for best results</p>
              </>
            )}
            {selectedMode === 'drop-set' && (
              <>
                <p>• Reduce weight by 20-30% for each drop</p>
                <p>• Continue until muscular failure on final set</p>
                <p>• Best used as a finisher, not for every exercise</p>
              </>
            )}
            {selectedMode === 'tri-set' && (
              <>
                <p>• Target same muscle from different angles</p>
                <p>• Minimal rest between exercises (10-15s max)</p>
                <p>• Perfect for arm, shoulder, or leg training</p>
              </>
            )}
            {selectedMode === 'giant-set' && (
              <>
                <p>• High volume and intensity - use sparingly</p>
                <p>• Ensure adequate recovery between sessions</p>
                <p>• Great for metabolic conditioning and fat loss</p>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 p-6 bg-slate-900/50">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold transition-all shadow-lg shadow-purple-500/50"
            >
              Apply {selectedMode.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())} Mode
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
