'use client'

interface SetHistory {
  weight: number
  reps: number
  timestamp: string | Date
  rpe?: number
}

interface Estimated1RMCardProps {
  history: SetHistory[]
  unit?: 'kg' | 'lbs'
  showFormula?: boolean
}

/**
 * Calculate estimated 1RM using multiple formulas for accuracy comparison
 */
function calculateEstimated1RM(weight: number, reps: number): {
  epley: number
  brzycki: number
  lander: number
  average: number
} {
  // Epley Formula: 1RM = weight × (1 + reps / 30)
  const epley = reps === 1 ? weight : weight * (1 + reps / 30)

  // Brzycki Formula: 1RM = weight × (36 / (37 - reps))
  const brzycki = reps === 1 ? weight : weight * (36 / (37 - reps))

  // Lander Formula: 1RM = (100 × weight) / (101.3 - 2.67123 × reps)
  const lander = reps === 1 ? weight : (100 * weight) / (101.3 - 2.67123 * reps)

  // Average of all three
  const average = (epley + brzycki + lander) / 3

  return { epley, brzycki, lander, average }
}

/**
 * Get the best estimated 1RM from workout history
 */
function getBestEstimated1RM(history: SetHistory[]): {
  value: number
  set: SetHistory
  formulas: { epley: number; brzycki: number; lander: number; average: number }
} | null {
  if (history.length === 0) return null

  let best = {
    value: 0,
    set: history[0],
    formulas: calculateEstimated1RM(history[0].weight, history[0].reps)
  }

  history.forEach(set => {
    const estimated = calculateEstimated1RM(set.weight, set.reps)
    if (estimated.average > best.value) {
      best = {
        value: estimated.average,
        set,
        formulas: estimated
      }
    }
  })

  return best
}

/**
 * Estimated1RMCard Component
 * 
 * Displays estimated 1 rep max based on workout history.
 * Uses multiple formulas (Epley, Brzycki, Lander) and shows average.
 * More accurate for rep ranges of 1-10, less reliable above 10 reps.
 * 
 * @example
 * ```tsx
 * <Estimated1RMCard
 *   history={exerciseHistory}
 *   unit="kg"
 *   showFormula
 * />
 * ```
 */
export function Estimated1RMCard({ history, unit = 'kg', showFormula = false }: Estimated1RMCardProps) {
  const best = getBestEstimated1RM(history)

  if (!best) {
    return (
      <div className="bg-astral-gray border border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-2">Estimated 1 Rep Max</h3>
        <div className="text-center py-8 text-gray-400">
          <p>No data available yet</p>
          <p className="text-sm mt-2">Complete some sets to see your estimated 1RM!</p>
        </div>
      </div>
    )
  }

  const reliability = best.set.reps <= 10 ? 'high' : best.set.reps <= 15 ? 'medium' : 'low'

  return (
    <div className="bg-gradient-to-br from-astral-blue/20 to-astral-purple/20 border border-astral-blue/30 rounded-xl p-6">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold">Estimated 1 Rep Max</h3>
        <div className={`px-2 py-1 rounded text-xs font-medium ${
          reliability === 'high' ? 'bg-green-500/20 text-green-400' :
          reliability === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
          'bg-orange-500/20 text-orange-400'
        }`}>
          {reliability === 'high' ? 'High Accuracy' :
           reliability === 'medium' ? 'Medium Accuracy' :
           'Low Accuracy'}
        </div>
      </div>

      {/* Main 1RM Value */}
      <div className="text-center mb-6">
        <div className="text-5xl font-bold bg-gradient-to-r from-astral-blue to-astral-purple bg-clip-text text-transparent mb-2">
          {best.formulas.average.toFixed(1)}
        </div>
        <div className="text-gray-400 text-sm">{unit}</div>
      </div>

      {/* Based on */}
      <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
        <div className="text-sm text-gray-400 mb-2">Based on your best set:</div>
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold">
              {best.set.weight} {unit} × {best.set.reps} reps
            </div>
            <div className="text-xs text-gray-400">
              {new Date(best.set.timestamp).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </div>
          </div>
          {best.set.rpe && (
            <div className="text-right">
              <div className="text-sm text-gray-400">RPE</div>
              <div className="font-semibold">{best.set.rpe}</div>
            </div>
          )}
        </div>
      </div>

      {/* Formula breakdown */}
      {showFormula && (
        <div className="space-y-2">
          <div className="text-sm text-gray-400 mb-2">Formula Breakdown:</div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Epley Formula:</span>
              <span className="font-medium">{best.formulas.epley.toFixed(1)} {unit}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Brzycki Formula:</span>
              <span className="font-medium">{best.formulas.brzycki.toFixed(1)} {unit}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Lander Formula:</span>
              <span className="font-medium">{best.formulas.lander.toFixed(1)} {unit}</span>
            </div>
            <div className="border-t border-gray-700 pt-2 mt-2 flex justify-between font-semibold">
              <span>Average (Most Accurate):</span>
              <span className="text-astral-blue">{best.formulas.average.toFixed(1)} {unit}</span>
            </div>
          </div>
        </div>
      )}

      {/* Accuracy note */}
      <div className="mt-4 p-3 bg-gray-800/50 rounded-lg">
        <div className="text-xs text-gray-400">
          {reliability === 'high' && (
            <>
              <span className="text-green-400 font-medium">✓ High Accuracy:</span> Estimate based on {best.set.reps} reps. 
              This rep range (1-10) provides the most accurate 1RM prediction.
            </>
          )}
          {reliability === 'medium' && (
            <>
              <span className="text-yellow-400 font-medium">⚠ Medium Accuracy:</span> Estimate based on {best.set.reps} reps. 
              For better accuracy, perform sets in the 1-10 rep range.
            </>
          )}
          {reliability === 'low' && (
            <>
              <span className="text-orange-400 font-medium">⚠ Low Accuracy:</span> Estimate based on {best.set.reps} reps. 
              High rep sets provide less reliable 1RM estimates. Try performing sets with 1-10 reps for better accuracy.
            </>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * PersonalRecordsCard Component
 * 
 * Displays all-time personal records for an exercise.
 * Shows max weight, max reps, max volume, and best estimated 1RM.
 * 
 * @example
 * ```tsx
 * <PersonalRecordsCard
 *   history={exerciseHistory}
 *   unit="kg"
 * />
 * ```
 */
interface PersonalRecordsCardProps {
  history: SetHistory[]
  unit?: 'kg' | 'lbs'
}

export function PersonalRecordsCard({ history, unit = 'kg' }: PersonalRecordsCardProps) {
  if (history.length === 0) {
    return (
      <div className="bg-astral-gray border border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-2">Personal Records</h3>
        <div className="text-center py-8 text-gray-400">
          <p>No records yet</p>
          <p className="text-sm mt-2">Start lifting to set your first PR!</p>
        </div>
      </div>
    )
  }

  // Calculate PRs
  const maxWeight = history.reduce((max, set) => set.weight > max.weight ? set : max, history[0])
  const maxReps = history.reduce((max, set) => set.reps > max.reps ? set : max, history[0])
  const maxVolume = history.reduce((max, set) => {
    const volume = set.weight * set.reps
    const maxVol = max.weight * max.reps
    return volume > maxVol ? set : max
  }, history[0])
  const best1RM = getBestEstimated1RM(history)

  return (
    <div className="bg-astral-gray border border-gray-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <span className="text-2xl">🏆</span>
        Personal Records
      </h3>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Max Weight */}
        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-lg p-4">
          <div className="text-sm text-blue-400 mb-2">Max Weight</div>
          <div className="text-3xl font-bold mb-1">
            {maxWeight.weight} {unit}
          </div>
          <div className="text-sm text-gray-400">
            {maxWeight.reps} reps • {new Date(maxWeight.timestamp).toLocaleDateString()}
          </div>
        </div>

        {/* Max Reps */}
        <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-lg p-4">
          <div className="text-sm text-purple-400 mb-2">Max Reps</div>
          <div className="text-3xl font-bold mb-1">
            {maxReps.reps}
          </div>
          <div className="text-sm text-gray-400">
            @ {maxReps.weight} {unit} • {new Date(maxReps.timestamp).toLocaleDateString()}
          </div>
        </div>

        {/* Max Volume */}
        <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 rounded-lg p-4">
          <div className="text-sm text-green-400 mb-2">Max Volume (Single Set)</div>
          <div className="text-3xl font-bold mb-1">
            {(maxVolume.weight * maxVolume.reps).toFixed(0)} {unit}
          </div>
          <div className="text-sm text-gray-400">
            {maxVolume.weight} {unit} × {maxVolume.reps} • {new Date(maxVolume.timestamp).toLocaleDateString()}
          </div>
        </div>

        {/* Best Estimated 1RM */}
        {best1RM && (
          <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-500/30 rounded-lg p-4">
            <div className="text-sm text-orange-400 mb-2">Est. 1RM</div>
            <div className="text-3xl font-bold mb-1">
              {best1RM.formulas.average.toFixed(1)} {unit}
            </div>
            <div className="text-sm text-gray-400">
              From {best1RM.set.weight} {unit} × {best1RM.set.reps}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * PercentageCalculatorCard Component
 * 
 * Shows common training percentages based on estimated 1RM.
 * Useful for planning training programs.
 * 
 * @example
 * ```tsx
 * <PercentageCalculatorCard
 *   estimated1RM={225}
 *   unit="kg"
 * />
 * ```
 */
interface PercentageCalculatorCardProps {
  estimated1RM: number
  unit?: 'kg' | 'lbs'
}

export function PercentageCalculatorCard({ estimated1RM, unit = 'kg' }: PercentageCalculatorCardProps) {
  const percentages = [
    { percent: 100, label: '1RM (Max Effort)', repRange: '1', color: 'red' },
    { percent: 95, label: 'Heavy Singles', repRange: '1-2', color: 'orange' },
    { percent: 90, label: 'Strength', repRange: '2-4', color: 'yellow' },
    { percent: 85, label: 'Strength', repRange: '4-6', color: 'yellow' },
    { percent: 80, label: 'Hypertrophy', repRange: '6-8', color: 'green' },
    { percent: 75, label: 'Hypertrophy', repRange: '8-10', color: 'green' },
    { percent: 70, label: 'Volume', repRange: '10-12', color: 'blue' },
    { percent: 65, label: 'Volume', repRange: '12-15', color: 'blue' },
    { percent: 60, label: 'Endurance', repRange: '15+', color: 'purple' },
  ]

  const colorClasses = {
    red: 'bg-red-500/20 border-red-500/30 text-red-400',
    orange: 'bg-orange-500/20 border-orange-500/30 text-orange-400',
    yellow: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400',
    green: 'bg-green-500/20 border-green-500/30 text-green-400',
    blue: 'bg-blue-500/20 border-blue-500/30 text-blue-400',
    purple: 'bg-purple-500/20 border-purple-500/30 text-purple-400',
  }

  return (
    <div className="bg-astral-gray border border-gray-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4">Training Percentages</h3>
      <div className="text-sm text-gray-400 mb-4">
        Based on estimated 1RM of {estimated1RM.toFixed(1)} {unit}
      </div>

      <div className="space-y-2">
        {percentages.map(({ percent, label, repRange, color }) => (
          <div
            key={percent}
            className={`flex items-center justify-between p-3 rounded-lg border ${
              colorClasses[color as keyof typeof colorClasses]
            }`}
          >
            <div>
              <div className="font-medium">{percent}% - {label}</div>
              <div className="text-xs opacity-75">Target: {repRange} reps</div>
            </div>
            <div className="text-right">
              <div className="font-bold text-lg">
                {(estimated1RM * (percent / 100)).toFixed(1)}
              </div>
              <div className="text-xs opacity-75">{unit}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-gray-800/50 rounded-lg text-xs text-gray-400">
        💡 <span className="font-medium">Tip:</span> These percentages are guidelines. 
        Adjust based on your training experience, recovery, and goals.
      </div>
    </div>
  )
}
