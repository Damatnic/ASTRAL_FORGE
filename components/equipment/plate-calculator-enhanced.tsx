'use client'

/**
 * Enhanced Plate Calculator
 * Visual plate loading calculator with multiple bar types and unit conversion
 */

import React, { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Calculator, ChevronDown, ChevronUp } from 'lucide-react'

interface BarType {
  name: string
  weight: number // kg
  color: string
}

interface PlateColor {
  weight: number // kg
  color: string
  label: string
}

const barTypes: BarType[] = [
  { name: 'Olympic Barbell (20kg)', weight: 20, color: 'bg-gray-400' },
  { name: 'Women\'s Olympic (15kg)', weight: 15, color: 'bg-gray-400' },
  { name: 'Training Bar (10kg)', weight: 10, color: 'bg-gray-300' },
  { name: 'EZ Curl Bar (7kg)', weight: 7, color: 'bg-gray-300' },
  { name: 'Trap Bar (25kg)', weight: 25, color: 'bg-gray-500' },
  { name: 'Safety Squat Bar (32kg)', weight: 32, color: 'bg-gray-500' },
]

// IPF/IWF standard plate colors
const plateColors: PlateColor[] = [
  { weight: 25, color: 'bg-red-600', label: 'Red' },
  { weight: 20, color: 'bg-blue-600', label: 'Blue' },
  { weight: 15, color: 'bg-yellow-500', label: 'Yellow' },
  { weight: 10, color: 'bg-green-600', label: 'Green' },
  { weight: 5, color: 'bg-white border-2 border-gray-600', label: 'White' },
  { weight: 2.5, color: 'bg-red-800', label: 'Dark Red' },
  { weight: 1.25, color: 'bg-gray-400', label: 'Chrome' },
  { weight: 0.5, color: 'bg-gray-300', label: 'Light' },
]

interface PlateCalculatorEnhancedProps {
  initialWeight?: number
  onWeightChange?: (weight: number) => void
  className?: string
}

export function PlateCalculatorEnhanced({
  initialWeight = 100,
  onWeightChange,
  className,
}: PlateCalculatorEnhancedProps) {
  const [targetWeight, setTargetWeight] = useState(initialWeight)
  const [unit, setUnit] = useState<'kg' | 'lb'>('kg')
  const [selectedBar, setSelectedBar] = useState(barTypes[0])
  const [showWarmup, setShowWarmup] = useState(false)
  const [showOneRM, setShowOneRM] = useState(false)
  const [oneRM, setOneRM] = useState(200)

  // Calculate plates needed
  const calculatePlates = (weight: number, barWeight: number) => {
    const weightPerSide = (weight - barWeight) / 2
    
    if (weightPerSide <= 0) {
      return []
    }

    const plates: { weight: number; count: number }[] = []
    let remaining = weightPerSide

    // Sort plates from heaviest to lightest
    const sortedPlates = [...plateColors].sort((a, b) => b.weight - a.weight)

    for (const plate of sortedPlates) {
      const count = Math.floor(remaining / plate.weight)
      if (count > 0) {
        plates.push({ weight: plate.weight, count })
        remaining = Math.round((remaining - count * plate.weight) * 100) / 100
      }
    }

    return plates
  }

  // Convert between kg and lb
  const kgToLb = (kg: number) => Math.round(kg * 2.20462 * 10) / 10
  const lbToKg = (lb: number) => Math.round(lb / 2.20462 * 10) / 10

  const displayWeight = unit === 'kg' ? targetWeight : kgToLb(targetWeight)
  const displayBarWeight = unit === 'kg' ? selectedBar.weight : kgToLb(selectedBar.weight)

  const plates = calculatePlates(targetWeight, selectedBar.weight)
  const totalPlateWeight = plates.reduce((sum, p) => sum + p.weight * p.count * 2, 0)
  const actualWeight = selectedBar.weight + totalPlateWeight

  // Generate warmup sets
  const generateWarmupSets = () => {
    const sets = [
      { percentage: 0.40, reps: 8 },
      { percentage: 0.60, reps: 5 },
      { percentage: 0.80, reps: 3 },
      { percentage: 0.90, reps: 1 },
    ]

    return sets.map(set => {
      const weight = Math.round((targetWeight * set.percentage) / 2.5) * 2.5
      return {
        ...set,
        weight,
        plates: calculatePlates(weight, selectedBar.weight),
      }
    })
  }

  // Generate percentage sets from 1RM
  const generatePercentageSets = () => {
    const percentages = [50, 60, 70, 75, 80, 85, 90, 95, 100]
    return percentages.map(pct => {
      const weight = Math.round((oneRM * (pct / 100)) / 2.5) * 2.5
      return {
        percentage: pct,
        weight,
        plates: calculatePlates(weight, selectedBar.weight),
      }
    })
  }

  const warmupSets = showWarmup ? generateWarmupSets() : []
  const percentageSets = showOneRM ? generatePercentageSets() : []

  const handleWeightChange = (value: number) => {
    const newWeight = unit === 'kg' ? value : lbToKg(value)
    setTargetWeight(newWeight)
    onWeightChange?.(newWeight)
  }

  return (
    <div className={cn('bg-astral-gray rounded-xl border border-astral-light p-6', className)}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Calculator className="w-6 h-6 text-astral-blue" />
        <div>
          <h2 className="text-xl font-bold text-white">Plate Calculator</h2>
          <p className="text-sm text-gray-400">Visual plate loading guide</p>
        </div>
      </div>

      {/* Input Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Target Weight */}
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">
            Target Weight
          </label>
          <div className="relative">
            <input
              type="number"
              value={displayWeight}
              onChange={(e) => handleWeightChange(Number(e.target.value))}
              step={unit === 'kg' ? 2.5 : 5}
              className="w-full px-4 py-3 bg-astral-dark border border-astral-light rounded-lg text-white text-lg font-bold focus:outline-none focus:ring-2 focus:ring-astral-blue"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">
              {unit}
            </span>
          </div>
        </div>

        {/* Unit Toggle */}
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">
            Unit
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setUnit('kg')}
              className={cn(
                'flex-1 px-4 py-3 rounded-lg font-semibold transition-colors',
                unit === 'kg'
                  ? 'bg-astral-blue text-white'
                  : 'bg-astral-dark text-gray-400 hover:bg-astral-light'
              )}
            >
              kg
            </button>
            <button
              onClick={() => setUnit('lb')}
              className={cn(
                'flex-1 px-4 py-3 rounded-lg font-semibold transition-colors',
                unit === 'lb'
                  ? 'bg-astral-blue text-white'
                  : 'bg-astral-dark text-gray-400 hover:bg-astral-light'
              )}
            >
              lb
            </button>
          </div>
        </div>

        {/* Bar Type */}
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">
            Bar Type
          </label>
          <select
            value={selectedBar.name}
            onChange={(e) => setSelectedBar(barTypes.find(b => b.name === e.target.value) || barTypes[0])}
            className="w-full px-4 py-3 bg-astral-dark border border-astral-light rounded-lg text-white font-semibold focus:outline-none focus:ring-2 focus:ring-astral-blue"
          >
            {barTypes.map(bar => (
              <option key={bar.name} value={bar.name}>
                {bar.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Visual Bar Display */}
      <div className="bg-astral-dark rounded-lg p-6 mb-6 overflow-x-auto">
        <div className="min-w-[600px]">
          {/* Plate Display */}
          <div className="flex items-center justify-center gap-1 mb-4">
            {/* Left Plates */}
            <div className="flex items-center gap-1">
              {plates.map((plate, idx) => {
                const plateColor = plateColors.find(p => p.weight === plate.weight)
                return (
                  <div key={`left-${idx}`} className="flex gap-1">
                    {Array.from({ length: plate.count }).map((_, i) => (
                      <div
                        key={i}
                        className={cn(
                          'rounded flex items-center justify-center text-white font-bold text-xs',
                          plateColor?.color,
                          plate.weight >= 20 ? 'w-12 h-24' :
                          plate.weight >= 10 ? 'w-10 h-20' :
                          plate.weight >= 5 ? 'w-8 h-16' :
                          'w-6 h-12'
                        )}
                        title={`${plate.weight}kg plate`}
                      >
                        {plate.weight}
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>

            {/* Bar */}
            <div className={cn('h-6 flex items-center justify-center text-white font-bold text-sm px-4', selectedBar.color)} style={{ minWidth: '200px' }}>
              {selectedBar.weight}kg BAR
            </div>

            {/* Right Plates (mirror) */}
            <div className="flex items-center gap-1 flex-row-reverse">
              {plates.map((plate, idx) => {
                const plateColor = plateColors.find(p => p.weight === plate.weight)
                return (
                  <div key={`right-${idx}`} className="flex gap-1 flex-row-reverse">
                    {Array.from({ length: plate.count }).map((_, i) => (
                      <div
                        key={i}
                        className={cn(
                          'rounded flex items-center justify-center text-white font-bold text-xs',
                          plateColor?.color,
                          plate.weight >= 20 ? 'w-12 h-24' :
                          plate.weight >= 10 ? 'w-10 h-20' :
                          plate.weight >= 5 ? 'w-8 h-16' :
                          'w-6 h-12'
                        )}
                        title={`${plate.weight}kg plate`}
                      >
                        {plate.weight}
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Plate Breakdown */}
          <div className="text-center space-y-2">
            <div className="text-sm text-gray-400">
              Per Side: {plates.map(p => `${p.count}×${p.weight}kg`).join(' + ') || 'No plates needed'}
              {plates.length > 0 && ` = ${totalPlateWeight / 2}kg`}
            </div>
            <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-astral-blue to-astral-purple">
              Total: {actualWeight}kg ({kgToLb(actualWeight)}lb)
            </div>
            {Math.abs(actualWeight - targetWeight) > 0.1 && (
              <div className="text-xs text-yellow-400">
                ⚠️ Closest loadable: {actualWeight}kg (±{Math.abs(actualWeight - targetWeight).toFixed(1)}kg)
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Warmup Sets */}
      <div className="mb-4">
        <button
          onClick={() => setShowWarmup(!showWarmup)}
          className="flex items-center justify-between w-full px-4 py-3 bg-astral-dark border border-astral-light rounded-lg hover:bg-astral-light transition-colors"
        >
          <span className="font-semibold text-white">Warmup Sets</span>
          {showWarmup ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
        
        {showWarmup && (
          <div className="mt-2 space-y-2">
            {warmupSets.map((set, idx) => (
              <div key={idx} className="bg-astral-dark border border-astral-light rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-white">
                    Set {idx + 1}: {set.weight}kg ({kgToLb(set.weight)}lb)
                  </span>
                  <span className="text-xs text-gray-400">
                    {set.reps} reps @ {Math.round(set.percentage * 100)}%
                  </span>
                </div>
                <div className="text-xs text-gray-400">
                  {set.plates.map(p => `${p.count}×${p.weight}kg`).join(' + ') || 'Bar only'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 1RM Percentage Calculator */}
      <div>
        <button
          onClick={() => setShowOneRM(!showOneRM)}
          className="flex items-center justify-between w-full px-4 py-3 bg-astral-dark border border-astral-light rounded-lg hover:bg-astral-light transition-colors"
        >
          <span className="font-semibold text-white">1RM Percentage Calculator</span>
          {showOneRM ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
        
        {showOneRM && (
          <div className="mt-2">
            <div className="mb-3">
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">
                Your 1 Rep Max
              </label>
              <input
                type="number"
                value={oneRM}
                onChange={(e) => setOneRM(Number(e.target.value))}
                step={2.5}
                className="w-full px-4 py-2 bg-astral-dark border border-astral-light rounded-lg text-white font-semibold focus:outline-none focus:ring-2 focus:ring-astral-blue"
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {percentageSets.map((set) => (
                <button
                  key={set.percentage}
                  onClick={() => setTargetWeight(set.weight)}
                  className="bg-astral-dark border border-astral-light rounded-lg p-2 hover:bg-astral-light transition-colors text-left"
                >
                  <div className="text-xs text-gray-400">{set.percentage}%</div>
                  <div className="text-sm font-bold text-white">{set.weight}kg</div>
                  <div className="text-xs text-gray-500">{kgToLb(set.weight)}lb</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Plate Legend */}
      <div className="mt-6 pt-6 border-t border-astral-light">
        <h3 className="text-xs font-semibold text-gray-400 uppercase mb-3">
          Standard Plate Colors
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {plateColors.map(plate => (
            <div key={plate.weight} className="flex items-center gap-2">
              <div className={cn('w-6 h-6 rounded', plate.color)} />
              <span className="text-sm text-gray-400">
                {plate.weight}kg
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
