'use client'

import { useState } from 'react'

interface FailureIndicatorProps {
  initialValue?: boolean
  onChange: (failed: boolean) => void
  compact?: boolean
}

export function FailureIndicator({ initialValue = false, onChange, compact = false }: FailureIndicatorProps) {
  const [failed, setFailed] = useState(initialValue)

  const toggleFailure = () => {
    const newValue = !failed
    setFailed(newValue)
    onChange(newValue)
  }

  if (compact) {
    return (
      <button
        onClick={toggleFailure}
        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
          failed
            ? 'bg-amber-600 text-white'
            : 'bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-white'
        }`}
        title={failed ? 'Set taken to failure' : 'Set not taken to failure'}
      >
        {failed ? '⚡ Failed' : 'Failure?'}
      </button>
    )
  }

  return (
    <button
      onClick={toggleFailure}
      className={`w-full p-3 rounded-lg font-semibold transition-all border-2 ${
        failed
          ? 'bg-amber-600/20 border-amber-600 text-amber-400'
          : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600 hover:text-gray-300'
      }`}
    >
      <div className="flex items-center justify-center gap-2">
        <span className="text-2xl">{failed ? '⚡' : '💪'}</span>
        <div className="text-left">
          <div className="text-sm font-bold">
            {failed ? 'Taken to Failure' : 'Not to Failure'}
          </div>
          <div className="text-xs opacity-75">
            {failed ? 'Could not complete another rep' : 'Click if you went to failure'}
          </div>
        </div>
      </div>
    </button>
  )
}

// Compact version with tooltip
export function FailureCheckbox({ initialValue = false, onChange }: Omit<FailureIndicatorProps, 'compact'>) {
  const [failed, setFailed] = useState(initialValue)
  const [showTooltip, setShowTooltip] = useState(false)

  const toggleFailure = () => {
    const newValue = !failed
    setFailed(newValue)
    onChange(newValue)
  }

  return (
    <div className="relative inline-block">
      <label 
        className="flex items-center gap-2 cursor-pointer group"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <input
          type="checkbox"
          checked={failed}
          onChange={toggleFailure}
          className="w-5 h-5 rounded bg-gray-800 border-2 border-gray-700 checked:bg-amber-600 checked:border-amber-600 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all cursor-pointer"
        />
        <span className="text-sm text-gray-400 group-hover:text-white transition-colors">
          Went to failure
        </span>
      </label>
      
      {showTooltip && (
        <div className="absolute bottom-full left-0 mb-2 w-64 p-3 bg-gray-900 border border-purple-500/30 rounded-lg shadow-xl z-10 text-xs text-gray-300">
          <div className="font-semibold text-purple-400 mb-1">What is "failure"?</div>
          <p>
            Going to failure means you could not complete another rep with proper form. 
            This is useful for tracking intensity and programming progressive overload.
          </p>
        </div>
      )}
    </div>
  )
}

// RPE-based failure indicator
export function RPEFailureIndicator({ rpe, onChange }: { rpe: number; onChange: (failed: boolean) => void }) {
  const isFailure = rpe >= 10
  
  return (
    <div className={`p-3 rounded-lg border-2 ${
      isFailure
        ? 'bg-red-600/20 border-red-600'
        : rpe >= 9
        ? 'bg-amber-600/20 border-amber-600'
        : 'bg-gray-800 border-gray-700'
    }`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold">
            {isFailure ? '⚡ Failure' : rpe >= 9 ? '🔥 Near Failure' : '💪 Reps in Reserve'}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {isFailure
              ? 'RPE 10 - No reps left'
              : rpe >= 9
              ? `RPE ${rpe} - ~${10 - rpe} rep${10 - rpe === 1 ? '' : 's'} left`
              : `RPE ${rpe} - ~${10 - rpe} reps left`}
          </div>
        </div>
        <button
          onClick={() => onChange(isFailure)}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
            isFailure
              ? 'bg-red-600 text-white'
              : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
          }`}
        >
          {isFailure ? 'Failed' : 'Mark as Failed'}
        </button>
      </div>
    </div>
  )
}
