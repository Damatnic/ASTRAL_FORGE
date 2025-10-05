'use client'

import { useState } from 'react'

interface WarmupToggleProps {
  initialValue?: boolean
  onChange: (isWarmup: boolean) => void
  compact?: boolean
}

export function WarmupToggle({ initialValue = false, onChange, compact = false }: WarmupToggleProps) {
  const [isWarmup, setIsWarmup] = useState(initialValue)

  const toggle = () => {
    const newValue = !isWarmup
    setIsWarmup(newValue)
    onChange(newValue)
  }

  if (compact) {
    return (
      <button
        onClick={toggle}
        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
          isWarmup
            ? 'bg-blue-600 text-white'
            : 'bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-white'
        }`}
        title={isWarmup ? 'Warmup set (not counted in volume)' : 'Working set'}
      >
        {isWarmup ? '🔥 Warmup' : 'Warmup?'}
      </button>
    )
  }

  return (
    <button
      onClick={toggle}
      className={`w-full p-3 rounded-lg font-semibold transition-all border-2 ${
        isWarmup
          ? 'bg-blue-600/20 border-blue-600 text-blue-400'
          : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600 hover:text-gray-300'
      }`}
    >
      <div className="flex items-center justify-center gap-2">
        <span className="text-2xl">{isWarmup ? '🔥' : '💪'}</span>
        <div className="text-left">
          <div className="text-sm font-bold">
            {isWarmup ? 'Warmup Set' : 'Working Set'}
          </div>
          <div className="text-xs opacity-75">
            {isWarmup ? 'Not counted in total volume' : 'Counts toward volume'}
          </div>
        </div>
      </div>
    </button>
  )
}

// Checkbox version
export function WarmupCheckbox({ initialValue = false, onChange }: Omit<WarmupToggleProps, 'compact'>) {
  const [isWarmup, setIsWarmup] = useState(initialValue)
  const [showTooltip, setShowTooltip] = useState(false)

  const toggle = () => {
    const newValue = !isWarmup
    setIsWarmup(newValue)
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
          checked={isWarmup}
          onChange={toggle}
          className="w-5 h-5 rounded bg-gray-800 border-2 border-gray-700 checked:bg-blue-600 checked:border-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all cursor-pointer"
        />
        <span className="text-sm text-gray-400 group-hover:text-white transition-colors flex items-center gap-1">
          {isWarmup && <span>🔥</span>}
          Warmup set
        </span>
      </label>
      
      {showTooltip && (
        <div className="absolute bottom-full left-0 mb-2 w-64 p-3 bg-gray-900 border border-purple-500/30 rounded-lg shadow-xl z-10 text-xs text-gray-300">
          <div className="font-semibold text-blue-400 mb-1">What are warmup sets?</div>
          <p>
            Warmup sets prepare your muscles and nervous system for heavier working sets. 
            They're typically lighter weight (40-60% of working weight) and don't count toward your total training volume.
          </p>
        </div>
      )}
    </div>
  )
}

// Badge version for display
export function WarmupBadge({ isWarmup }: { isWarmup: boolean }) {
  if (!isWarmup) return null

  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-600/20 border border-blue-600/50 text-blue-400 text-xs font-semibold rounded-full">
      <span>🔥</span>
      Warmup
    </span>
  )
}

// Automatic warmup set suggester
export function WarmupSuggester({ 
  workingWeight, 
  onSelect 
}: { 
  workingWeight: number
  onSelect: (weight: number) => void 
}) {
  const warmupSets = [
    { percentage: 40, label: '40%' },
    { percentage: 50, label: '50%' },
    { percentage: 60, label: '60%' },
    { percentage: 70, label: '70%' },
  ]

  return (
    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">🔥</span>
        <div>
          <div className="font-semibold text-blue-400 text-sm">Warmup Sets Suggested</div>
          <div className="text-xs text-gray-400">Based on your working weight of {workingWeight}kg</div>
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-2">
        {warmupSets.map(({ percentage, label }) => {
          const weight = Math.round((workingWeight * percentage) / 100)
          return (
            <button
              key={percentage}
              onClick={() => onSelect(weight)}
              className="p-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-600/30 rounded-lg text-center transition-all group"
            >
              <div className="text-lg font-bold text-blue-400 group-hover:text-blue-300">
                {weight}kg
              </div>
              <div className="text-xs text-gray-400">{label}</div>
            </button>
          )
        })}
      </div>
      
      <div className="mt-3 pt-3 border-t border-blue-500/20 text-xs text-gray-400">
        💡 Tip: Do 5-8 reps for warmup sets, focus on movement quality
      </div>
    </div>
  )
}
