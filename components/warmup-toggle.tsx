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
        className={`px-3 py-1 text-xs font-black transition-all uppercase tracking-wider ${
          isWarmup
            ? 'bg-amber-950/50 text-white border-2 border-amber-700'
            : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800 hover:text-white border-2 border-neutral-800'
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
      className={`w-full p-3 font-black transition-all border-2 uppercase tracking-wider ${
        isWarmup
          ? 'bg-amber-950/20 border-amber-700 text-amber-400'
          : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-neutral-300'
      }`}
    >
      <div className="flex items-center justify-center gap-2">
        <span className="text-2xl">{isWarmup ? '🔥' : '💪'}</span>
        <div className="text-left">
          <div className="text-sm font-black uppercase tracking-wider">
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
          className="w-5 h-5 bg-neutral-900 border-2 border-neutral-700 checked:bg-amber-600 checked:border-amber-600 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-neutral-900 transition-all cursor-pointer"
        />
        <span className="text-sm text-neutral-400 group-hover:text-white transition-colors flex items-center gap-1 uppercase tracking-wider font-bold">
          {isWarmup && <span>🔥</span>}
          Warmup set
        </span>
      </label>
      
      {showTooltip && (
        <div className="absolute bottom-full left-0 mb-2 w-64 p-3 bg-neutral-900 border-2 border-amber-700/50 shadow-xl z-10 text-xs text-neutral-300">
          <div className="font-bold text-amber-400 mb-1 uppercase tracking-wider">What are warmup sets?</div>
          <p>
            Warmup sets prepare your muscles and nervous system for heavier working sets. 
            They&apos;re typically lighter weight (40-60% of working weight) and don&apos;t count toward your total training volume.
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
    <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-950/50 border-2 border-amber-700 text-amber-400 text-xs font-bold uppercase tracking-wider">
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
    <div className="bg-amber-950/50 border-2 border-amber-700/50 p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">🔥</span>
        <div>
          <div className="font-bold text-amber-400 text-sm uppercase tracking-wider">Warmup Sets Suggested</div>
          <div className="text-xs text-neutral-400">Based on your working weight of {workingWeight}kg</div>
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-2">
        {warmupSets.map(({ percentage, label }) => {
          const weight = Math.round((workingWeight * percentage) / 100)
          return (
            <button
              key={percentage}
              onClick={() => onSelect(weight)}
              className="p-2 bg-amber-950/50 hover:bg-amber-900/50 border-2 border-amber-700/50 text-center transition-all group"
            >
              <div className="text-lg font-bold text-amber-400 group-hover:text-amber-300">
                {weight}kg
              </div>
              <div className="text-xs text-neutral-400">{label}</div>
            </button>
          )
        })}
      </div>
      
      <div className="mt-3 pt-3 border-t-2 border-amber-700/30 text-xs text-neutral-400">
        💡 Tip: Do 5-8 reps for warmup sets, focus on movement quality
      </div>
    </div>
  )
}
