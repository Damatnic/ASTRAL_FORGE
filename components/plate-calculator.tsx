'use client'

import { useState, useEffect } from 'react'

interface PlateCalculatorProps {
  targetWeight: number
  barWeight?: number
  onClose?: () => void
}

export function PlateCalculator({ targetWeight, barWeight = 20, onClose }: PlateCalculatorProps) {
  const [plates, setPlates] = useState<Array<{ weight: number; count: number }>>([])
  
  // Standard Olympic plates in kg
  const availablePlates = [25, 20, 15, 10, 5, 2.5, 1.25, 0.5]

  useEffect(() => {
    calculatePlates()
  }, [targetWeight, barWeight])

  const calculatePlates = () => {
    const weightPerSide = (targetWeight - barWeight) / 2
    
    if (weightPerSide <= 0) {
      setPlates([])
      return
    }

    let remaining = weightPerSide
    const result: Array<{ weight: number; count: number }> = []

    for (const plate of availablePlates) {
      if (remaining >= plate) {
        const count = Math.floor(remaining / plate)
        result.push({ weight: plate, count })
        remaining = Math.round((remaining - (plate * count)) * 100) / 100
      }
    }

    setPlates(result)
  }

  const totalWeight = barWeight + (plates.reduce((sum, p) => sum + (p.weight * p.count), 0) * 2)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-astral-gray border border-gray-800 rounded-xl p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">Plate Calculator</h3>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl"
            >
              ×
            </button>
          )}
        </div>

        {/* Target Weight */}
        <div className="mb-6">
          <div className="text-center">
            <div className="text-5xl font-bold text-astral-blue mb-2">
              {targetWeight}kg
            </div>
            <div className="text-sm text-gray-400">Target Weight</div>
          </div>
        </div>

        {/* Bar Weight */}
        <div className="mb-6 text-center">
          <div className="inline-block px-4 py-2 bg-gray-700 rounded-lg">
            <span className="text-gray-400 mr-2">Bar:</span>
            <span className="font-semibold">{barWeight}kg</span>
          </div>
        </div>

        {/* Plates per Side */}
        {plates.length > 0 ? (
          <>
            <div className="mb-4">
              <div className="text-sm font-medium text-gray-400 mb-3">
                Load per side:
              </div>
              <div className="space-y-2">
                {plates.map((plate, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white"
                        style={{
                          backgroundColor:
                            plate.weight >= 20 ? '#EF4444' :
                            plate.weight >= 10 ? '#3B82F6' :
                            plate.weight >= 5 ? '#FCD34D' :
                            plate.weight >= 2.5 ? '#10B981' :
                            '#6B7280',
                          fontSize: plate.weight >= 10 ? '0.875rem' : '0.75rem',
                        }}
                      >
                        {plate.weight}
                      </div>
                      <span className="text-white font-medium">
                        {plate.weight}kg plate
                      </span>
                    </div>
                    <div className="text-astral-blue font-bold text-lg">
                      ×{plate.count}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Bar Representation */}
            <div className="mb-4 bg-gray-800 rounded-lg p-4">
              <div className="text-xs text-gray-400 mb-2 text-center">
                Loading order (inside to outside):
              </div>
              <div className="flex items-center justify-center gap-1">
                {/* Left side plates (reversed order) */}
                <div className="flex gap-1">
                  {[...plates].reverse().map((plate, idx) => (
                    <div key={`left-${idx}`} className="flex gap-1">
                      {Array.from({ length: plate.count }).map((_, i) => (
                        <div
                          key={i}
                          className="h-10 rounded"
                          style={{
                            width: `${Math.max(2, plate.weight / 3)}px`,
                            backgroundColor:
                              plate.weight >= 20 ? '#EF4444' :
                              plate.weight >= 10 ? '#3B82F6' :
                              plate.weight >= 5 ? '#FCD34D' :
                              plate.weight >= 2.5 ? '#10B981' :
                              '#6B7280',
                          }}
                        />
                      ))}
                    </div>
                  ))}
                </div>

                {/* Bar */}
                <div className="h-8 w-20 bg-gray-500 rounded-sm flex items-center justify-center text-xs">
                  BAR
                </div>

                {/* Right side plates */}
                <div className="flex gap-1">
                  {[...plates].reverse().map((plate, idx) => (
                    <div key={`right-${idx}`} className="flex gap-1">
                      {Array.from({ length: plate.count }).map((_, i) => (
                        <div
                          key={i}
                          className="h-10 rounded"
                          style={{
                            width: `${Math.max(2, plate.weight / 3)}px`,
                            backgroundColor:
                              plate.weight >= 20 ? '#EF4444' :
                              plate.weight >= 10 ? '#3B82F6' :
                              plate.weight >= 5 ? '#FCD34D' :
                              plate.weight >= 2.5 ? '#10B981' :
                              '#6B7280',
                          }}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Total Weight Verification */}
            <div className="text-center p-3 bg-green-900/20 border border-green-700 rounded-lg">
              <div className="text-sm text-gray-400">Actual loaded weight</div>
              <div className="text-2xl font-bold text-green-400">
                {totalWeight}kg
              </div>
              {totalWeight !== targetWeight && (
                <div className="text-xs text-yellow-400 mt-1">
                  ({Math.abs(totalWeight - targetWeight)}kg {totalWeight > targetWeight ? 'over' : 'under'})
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <p>Bar only (no plates needed)</p>
            <p className="text-sm mt-2">Target weight is {barWeight}kg or less</p>
          </div>
        )}

        {/* Quick Tips */}
        <div className="mt-4 p-3 bg-astral-blue/10 border border-astral-blue/30 rounded-lg">
          <div className="text-xs text-gray-300">
            <strong>💡 Pro Tip:</strong> Load the heaviest plates first (closest to the bar) for stability
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="w-full mt-4 py-3 bg-gradient-to-r from-astral-blue to-astral-purple rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Got It!
          </button>
        )}
      </div>
    </div>
  )
}


