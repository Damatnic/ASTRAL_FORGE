'use client'

import { useState, useEffect } from 'react'
import { X, Calculator, Plus, Minus } from 'lucide-react'

interface PlateCalculatorModalProps {
  isOpen: boolean
  onClose: () => void
  currentWeight: number | null
  onApplyWeight: (weight: number) => void
  barWeight?: number
}

export function PlateCalculatorModal({
  isOpen,
  onClose,
  currentWeight,
  onApplyWeight,
  barWeight = 45 // Default Olympic barbell
}: PlateCalculatorModalProps) {
  const [targetWeight, setTargetWeight] = useState<number>(currentWeight || 135)
  const [selectedBarWeight, setSelectedBarWeight] = useState(barWeight)

  // Available plates in pounds (most common in gyms)
  const availablePlates = [45, 35, 25, 10, 5, 2.5, 1.25]

  useEffect(() => {
    if (currentWeight) {
      setTargetWeight(currentWeight)
    }
  }, [currentWeight])

  // Calculate plates needed per side
  const calculatePlates = () => {
    const weightPerSide = (targetWeight - selectedBarWeight) / 2
    
    if (weightPerSide < 0) {
      return { plates: [], weightPerSide: 0, isValid: false }
    }

    const plates: { weight: number; count: number }[] = []
    let remaining = weightPerSide

    for (const plate of availablePlates) {
      const count = Math.floor(remaining / plate)
      if (count > 0) {
        plates.push({ weight: plate, count })
        remaining = Math.round((remaining - plate * count) * 100) / 100
      }
    }

    return {
      plates,
      weightPerSide: Math.round(weightPerSide * 100) / 100,
      totalWeight: selectedBarWeight + weightPerSide * 2,
      remaining: Math.round(remaining * 100) / 100,
      isValid: remaining < 0.1 // Allow small rounding errors
    }
  }

  const result = calculatePlates()

  const quickAdjustments = [
    { label: '-10', value: -10 },
    { label: '-5', value: -5 },
    { label: '-2.5', value: -2.5 },
    { label: '+2.5', value: 2.5 },
    { label: '+5', value: 5 },
    { label: '+10', value: 10 }
  ]

  const handleApply = () => {
    onApplyWeight(targetWeight)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border-2 border-purple-500/30 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-auto shadow-2xl shadow-purple-500/20">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 border-b border-purple-500/30 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Plate Calculator</h2>
                <p className="text-sm text-slate-400">Calculate plates needed per side</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Bar Weight Selection */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Bar Weight
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[45, 35, 25, 15].map((weight) => (
                <button
                  key={weight}
                  onClick={() => setSelectedBarWeight(weight)}
                  className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                    selectedBarWeight === weight
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {weight} lbs
                </button>
              ))}
            </div>
          </div>

          {/* Target Weight Input */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Target Weight
            </label>
            <div className="relative">
              <input
                type="number"
                value={targetWeight}
                onChange={(e) => setTargetWeight(Number(e.target.value))}
                className="w-full px-4 py-3 bg-slate-800 border-2 border-slate-700 rounded-lg text-white text-2xl font-bold text-center focus:border-purple-500 focus:outline-none transition-colors"
                step="2.5"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                lbs
              </span>
            </div>
          </div>

          {/* Quick Adjustments */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Quick Adjust
            </label>
            <div className="grid grid-cols-6 gap-2">
              {quickAdjustments.map((adj) => (
                <button
                  key={adj.label}
                  onClick={() => setTargetWeight(Math.max(selectedBarWeight, targetWeight + adj.value))}
                  className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold transition-colors flex items-center justify-center gap-1"
                >
                  {adj.value > 0 ? <Plus className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                  {Math.abs(adj.value)}
                </button>
              ))}
            </div>
          </div>

          {/* Calculation Result */}
          <div className="bg-slate-800/50 rounded-xl p-6 border-2 border-slate-700">
            <h3 className="text-lg font-bold text-white mb-4">Plates Per Side</h3>
            
            {result.weightPerSide < 0 ? (
              <div className="text-center text-red-400 py-4">
                <p className="font-semibold">Target weight is less than bar weight!</p>
                <p className="text-sm mt-1">Increase target weight or select lighter bar.</p>
              </div>
            ) : (
              <>
                {/* Weight Per Side */}
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-700">
                  <span className="text-slate-400">Weight per side:</span>
                  <span className="text-2xl font-bold text-purple-400">
                    {result.weightPerSide} lbs
                  </span>
                </div>

                {/* Plates Visualization */}
                <div className="space-y-3">
                  {result.plates.length > 0 ? (
                    result.plates.map((plate, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-slate-900 rounded-lg p-3 border border-slate-700"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-white shadow-lg"
                            style={{
                              width: `${32 + plate.weight / 2}px`,
                              height: `${32 + plate.weight / 2}px`
                            }}
                          >
                            {plate.weight}
                          </div>
                          <div>
                            <div className="font-semibold text-white">
                              {plate.weight} lbs plate
                            </div>
                            <div className="text-sm text-slate-400">
                              {plate.count} × {plate.weight} = {plate.count * plate.weight} lbs
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-purple-400">×{plate.count}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-slate-400 py-4">
                      <p>No plates needed!</p>
                      <p className="text-sm mt-1">Bar weight only</p>
                    </div>
                  )}
                </div>

                {/* Remaining Weight Warning */}
                {result.remaining !== undefined && result.remaining > 0.1 && (
                  <div className="mt-4 bg-orange-500/10 border border-orange-500/30 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-orange-400 text-xs font-bold">!</span>
                      </div>
                      <div className="text-sm text-orange-300">
                        <strong className="font-semibold">Cannot reach exact weight</strong>
                        <p className="mt-1 text-orange-400/80">
                          {result.remaining?.toFixed(2)} lbs short. Use smaller plates or adjust target weight.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Total Weight Display */}
                <div className="mt-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300 font-semibold">Total Weight:</span>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-white">
                        {result.totalWeight} lbs
                      </div>
                      <div className="text-sm text-slate-400">
                        {selectedBarWeight} lbs bar + {(result.weightPerSide * 2).toFixed(1)} lbs plates
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-slate-800 p-6 bg-slate-900/50">
          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              disabled={result.weightPerSide < 0}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold transition-all shadow-lg shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Apply Weight
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
