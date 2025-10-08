'use client'

import { useState, useMemo } from 'react'
import { X, Calculator, Plus, Minus, Settings, Star } from 'lucide-react'

export interface PlateCalculatorPreset {
  id: string
  name: string
  weight: number
  barWeight: number
  isFavorite: boolean
}

interface PlateCalculatorEnhancedProps {
  isOpen: boolean
  onClose: () => void
  currentWeight: number | null
  onApplyWeight: (weight: number) => void
  barWeight?: number
}

export function PlateCalculatorEnhanced({
  isOpen,
  onClose,
  currentWeight,
  onApplyWeight,
  barWeight: initialBarWeight = 45
}: PlateCalculatorEnhancedProps) {
  const [targetWeight, setTargetWeight] = useState(currentWeight || 135)
  const [barWeight, setBarWeight] = useState(initialBarWeight)
  const [unit, setUnit] = useState<'lbs' | 'kg'>('lbs')
  const [showPresets, setShowPresets] = useState(false)

  // Plate sets by unit (memoized to avoid recalculation)
  const availablePlates = useMemo(() => ({
    lbs: [45, 35, 25, 10, 5, 2.5, 1.25],
    kg: [25, 20, 15, 10, 5, 2.5, 1.25, 0.5]
  }), [])

  // Standard bars by unit
  const standardBars = {
    lbs: [
      { weight: 45, label: 'Olympic Bar (45 lbs)', isDefault: true },
      { weight: 35, label: 'Women\'s Bar (35 lbs)', isDefault: false },
      { weight: 25, label: 'Training Bar (25 lbs)', isDefault: false },
      { weight: 15, label: 'Technique Bar (15 lbs)', isDefault: false }
    ],
    kg: [
      { weight: 20, label: 'Olympic Bar (20 kg)', isDefault: true },
      { weight: 15, label: 'Women\'s Bar (15 kg)', isDefault: false },
      { weight: 10, label: 'Training Bar (10 kg)', isDefault: false },
      { weight: 5, label: 'Technique Bar (5 kg)', isDefault: false }
    ]
  }

  // Weight presets by unit
  const weightPresets: Record<'lbs' | 'kg', PlateCalculatorPreset[]> = {
    lbs: [
      { id: '1', name: '1 Plate', weight: 135, barWeight: 45, isFavorite: true },
      { id: '2', name: '2 Plates', weight: 225, barWeight: 45, isFavorite: true },
      { id: '3', name: '3 Plates', weight: 315, barWeight: 45, isFavorite: true },
      { id: '4', name: '4 Plates', weight: 405, barWeight: 45, isFavorite: true },
      { id: '5', name: '5 Plates', weight: 495, barWeight: 45, isFavorite: false },
      { id: '6', name: 'Warmup 1', weight: 95, barWeight: 45, isFavorite: false },
      { id: '7', name: 'Warmup 2', weight: 115, barWeight: 45, isFavorite: false },
      { id: '8', name: 'Bodyweight', weight: 185, barWeight: 45, isFavorite: false }
    ],
    kg: [
      { id: '1', name: '1 Plate', weight: 60, barWeight: 20, isFavorite: true },
      { id: '2', name: '2 Plates', weight: 100, barWeight: 20, isFavorite: true },
      { id: '3', name: '3 Plates', weight: 140, barWeight: 20, isFavorite: true },
      { id: '4', name: '4 Plates', weight: 180, barWeight: 20, isFavorite: true },
      { id: '5', name: 'Warmup 1', weight: 40, barWeight: 20, isFavorite: false },
      { id: '6', name: 'Warmup 2', weight: 50, barWeight: 20, isFavorite: false }
    ]
  }

  const calculatePlates = useMemo(() => {
    const plates = availablePlates[unit]
    const weightPerSide = (targetWeight - barWeight) / 2

    if (weightPerSide <= 0) {
      return {
        plates: [],
        weightPerSide: 0,
        totalWeight: barWeight,
        remaining: targetWeight - barWeight,
        isValid: false
      }
    }

    let remaining = weightPerSide
    const result: { weight: number; count: number }[] = []

    for (const plate of plates) {
      const count = Math.floor(remaining / plate)
      if (count > 0) {
        result.push({ weight: plate, count })
        remaining -= plate * count
      }
    }

    const totalPlateWeight = result.reduce((sum, p) => sum + p.weight * p.count, 0)
    const totalWeight = barWeight + totalPlateWeight * 2

    return {
      plates: result,
      weightPerSide,
      totalWeight,
      remaining,
      isValid: remaining < 0.1
    }
  }, [targetWeight, barWeight, unit, availablePlates])

  const handleApply = () => {
    // Convert to lbs if needed before applying
    const weightToApply = unit === 'kg' ? targetWeight * 2.20462 : targetWeight
    onApplyWeight(weightToApply)
    onClose()
  }

  const handlePresetClick = (preset: PlateCalculatorPreset) => {
    setTargetWeight(preset.weight)
    setBarWeight(preset.barWeight)
    setShowPresets(false)
  }

  const toggleUnit = () => {
    const newUnit = unit === 'lbs' ? 'kg' : 'lbs'
    // Convert current weights
    if (newUnit === 'kg') {
      setTargetWeight(Math.round((targetWeight / 2.20462) * 2) / 2)
      setBarWeight(Math.round((barWeight / 2.20462) * 2) / 2)
    } else {
      setTargetWeight(Math.round(targetWeight * 2.20462 * 2) / 2)
      setBarWeight(Math.round(barWeight * 2.20462 * 2) / 2)
    }
    setUnit(newUnit)
  }

  const step = unit === 'lbs' ? 2.5 : 1.25
  const quickAdjustments = unit === 'lbs' ? [10, 5, 2.5] : [5, 2.5, 1.25]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border-2 border-purple-500/30 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl shadow-purple-500/20">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 border-b border-purple-500/30 p-6 sticky top-0 z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Plate Calculator</h2>
                <p className="text-sm text-slate-400">Calculate plate loading</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Unit Toggle */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowPresets(!showPresets)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                showPresets
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Star className="w-4 h-4" />
              Presets
            </button>
            <button
              onClick={toggleUnit}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-all flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              {unit === 'lbs' ? '🇺🇸 Imperial (lbs)' : '🌍 Metric (kg)'}
            </button>
          </div>
        </div>

        {/* Presets Panel */}
        {showPresets && (
          <div className="border-b border-slate-800 p-4 bg-slate-900/50">
            <h3 className="text-sm font-semibold text-slate-400 mb-3">Quick Presets</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {weightPresets[unit].map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handlePresetClick(preset)}
                  className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 text-slate-300 hover:text-white transition-all text-sm font-semibold flex items-center justify-between"
                >
                  <span>{preset.name}</span>
                  {preset.isFavorite && <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />}
                  <span className="text-xs ml-1">
                    {preset.weight} {unit}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="p-6 space-y-6">
          {/* Bar Weight Selection */}
          <div>
            <label className="block text-sm font-semibold text-slate-400 mb-3">Bar Weight</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {standardBars[unit].map((bar) => (
                <button
                  key={bar.weight}
                  onClick={() => setBarWeight(bar.weight)}
                  className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                    barWeight === bar.weight
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <div className="text-lg">{bar.weight}</div>
                  <div className="text-xs opacity-75">{unit}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Target Weight */}
          <div>
            <label className="block text-sm font-semibold text-slate-400 mb-3">Target Weight</label>
            <div className="flex items-center justify-center gap-4">
              <input
                type="number"
                value={targetWeight}
                onChange={(e) => setTargetWeight(parseFloat(e.target.value) || 0)}
                step={step}
                className="w-40 px-4 py-3 bg-slate-800 border-2 border-slate-700 focus:border-purple-500 rounded-lg text-white text-2xl font-bold text-center outline-none transition-all"
              />
              <span className="text-2xl font-bold text-slate-400">{unit}</span>
            </div>
          </div>

          {/* Quick Adjust */}
          <div>
            <label className="block text-sm font-semibold text-slate-400 mb-3">Quick Adjust</label>
            <div className="grid grid-cols-6 gap-2">
              {quickAdjustments.map((amount) => (
                <button
                  key={`minus-${amount}`}
                  onClick={() => setTargetWeight(Math.max(barWeight, targetWeight - amount))}
                  className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-red-500/20 border border-slate-700 hover:border-red-500 text-slate-300 hover:text-red-400 font-semibold transition-all flex items-center justify-center gap-1"
                >
                  <Minus className="w-4 h-4" />
                  {amount}
                </button>
              ))}
              {quickAdjustments.map((amount) => (
                <button
                  key={`plus-${amount}`}
                  onClick={() => setTargetWeight(targetWeight + amount)}
                  className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-green-500/20 border border-slate-700 hover:border-green-500 text-slate-300 hover:text-green-400 font-semibold transition-all flex items-center justify-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  {amount}
                </button>
              ))}
            </div>
          </div>

          {/* Calculation Error */}
          {!calculatePlates.isValid && targetWeight >= barWeight && (
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
              <p className="text-orange-400 font-semibold mb-1">⚠️ Cannot reach exact weight</p>
              <p className="text-sm text-orange-300">
                You will be {calculatePlates.remaining?.toFixed(2)} {unit} short of your target. Consider using
                smaller plates or adjusting your target weight.
              </p>
            </div>
          )}

          {targetWeight < barWeight && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <p className="text-red-400 font-semibold mb-1">❌ Target weight is less than bar weight!</p>
              <p className="text-sm text-red-300">
                Increase your target weight or select a lighter bar.
              </p>
            </div>
          )}

          {/* Plate Breakdown */}
          {calculatePlates.plates.length > 0 && (
            <div>
              <label className="block text-sm font-semibold text-slate-400 mb-3">
                Weight Per Side: 
                <span className="text-2xl text-purple-400 ml-2">
                  {calculatePlates.weightPerSide.toFixed(2)} {unit}
                </span>
              </label>
              <div className="space-y-2">
                {calculatePlates.plates.map((plate, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold flex items-center justify-center shadow-lg"
                        style={{
                          width: `${32 + plate.weight / 2}px`,
                          height: `${32 + plate.weight / 2}px`
                        }}
                      >
                        {plate.weight}
                      </div>
                      <div>
                        <span className="text-white font-semibold">
                          {plate.weight} {unit} × {plate.count}
                        </span>
                        <p className="text-sm text-slate-400">
                          {plate.count} × {plate.weight} = {(plate.weight * plate.count).toFixed(2)} {unit}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Total Weight Display */}
          {calculatePlates.plates.length > 0 && (
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-2 border-purple-500/30 rounded-xl p-6">
              <div className="text-center">
                <p className="text-sm text-slate-400 mb-2">Total Weight</p>
                <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  {calculatePlates.totalWeight} {unit}
                </p>
                <p className="text-sm text-slate-400 mt-2">
                  {barWeight} {unit} bar + {(calculatePlates.totalWeight - barWeight).toFixed(2)} {unit} plates
                </p>
              </div>
            </div>
          )}
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
              disabled={!calculatePlates.isValid || targetWeight < barWeight}
              className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-slate-700 disabled:to-slate-700 text-white font-semibold transition-all shadow-lg shadow-purple-500/50 disabled:shadow-none disabled:cursor-not-allowed"
            >
              Apply {calculatePlates.totalWeight} {unit}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
