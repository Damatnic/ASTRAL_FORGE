'use client'

import { useMemo } from 'react'

interface SetHistory {
  timestamp: string | Date
  weight: number
  reps: number
  rpe?: number
}

interface ExerciseProgressChartProps {
  history: SetHistory[]
  unit?: 'kg' | 'lbs'
  metric?: 'weight' | 'volume' | 'estimated1rm'
  timeRange?: 'week' | 'month' | '3months' | 'year' | 'all'
}

/**
 * ExerciseProgressChart Component
 * 
 * Displays a visual chart showing exercise progress over time.
 * Supports multiple metrics: max weight, total volume, estimated 1RM.
 * 
 * @example
 * ```tsx
 * <ExerciseProgressChart
 *   history={exerciseHistory}
 *   metric="weight"
 *   timeRange="month"
 * />
 * ```
 */
export function ExerciseProgressChart({
  history,
  unit = 'kg',
  metric = 'weight',
  timeRange = 'all'
}: ExerciseProgressChartProps) {
  const filteredData = useMemo(() => {
    const now = new Date()
    const cutoffDate = new Date()

    switch (timeRange) {
      case 'week':
        cutoffDate.setDate(now.getDate() - 7)
        break
      case 'month':
        cutoffDate.setMonth(now.getMonth() - 1)
        break
      case '3months':
        cutoffDate.setMonth(now.getMonth() - 3)
        break
      case 'year':
        cutoffDate.setFullYear(now.getFullYear() - 1)
        break
      case 'all':
      default:
        cutoffDate.setFullYear(2000) // Far in the past
    }

    return history
      .filter(set => new Date(set.timestamp) >= cutoffDate)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
  }, [history, timeRange])

  const chartData = useMemo(() => {
    // Group by date and get the best value for each day
    const byDate = new Map<string, number>()

    filteredData.forEach(set => {
      const date = new Date(set.timestamp).toLocaleDateString()
      let value: number

      switch (metric) {
        case 'weight':
          value = set.weight
          break
        case 'volume':
          value = set.weight * set.reps
          break
        case 'estimated1rm':
          value = calculateEstimated1RM(set.weight, set.reps)
          break
        default:
          value = set.weight
      }

      const existing = byDate.get(date)
      if (!existing || value > existing) {
        byDate.set(date, value)
      }
    })

    return Array.from(byDate.entries()).map(([date, value]) => ({ date, value }))
  }, [filteredData, metric])

  const { min, max, range } = useMemo(() => {
    if (chartData.length === 0) {
      return { min: 0, max: 100, range: 100 }
    }

    const values = chartData.map(d => d.value)
    const min = Math.min(...values)
    const max = Math.max(...values)
    const range = max - min || 1

    return { min, max, range }
  }, [chartData])

  if (chartData.length === 0) {
    return (
      <div className="bg-astral-gray border border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Progress Chart</h3>
        <div className="text-center py-12 text-gray-400">
          <p>No data available for the selected time range</p>
          <p className="text-sm mt-2">Complete more workouts to see your progress!</p>
        </div>
      </div>
    )
  }

  const metricLabel = {
    weight: `Max Weight (${unit})`,
    volume: `Volume (${unit})`,
    estimated1rm: `Est. 1RM (${unit})`
  }[metric]

  return (
    <div className="bg-astral-gray border border-gray-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Progress Chart</h3>
        <span className="text-sm text-gray-400">{metricLabel}</span>
      </div>

      {/* Chart */}
      <div className="relative h-48 mb-4">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-xs text-gray-400">
          <span>{max.toFixed(0)}</span>
          <span>{((max + min) / 2).toFixed(0)}</span>
          <span>{min.toFixed(0)}</span>
        </div>

        {/* Chart area */}
        <div className="ml-12 h-full relative">
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between">
            <div className="border-t border-gray-700/50" />
            <div className="border-t border-gray-700/50" />
            <div className="border-t border-gray-700/50" />
          </div>

          {/* Data points and line */}
          <svg className="absolute inset-0 w-full h-full">
            {/* Line */}
            <polyline
              points={chartData
                .map((d, i) => {
                  const x = (i / (chartData.length - 1)) * 100
                  const y = 100 - ((d.value - min) / range) * 100
                  return `${x}%,${y}%`
                })
                .join(' ')}
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="2"
              className="drop-shadow-lg"
            />

            {/* Area under line */}
            <polygon
              points={[
                `0%,100%`,
                ...chartData.map((d, i) => {
                  const x = (i / (chartData.length - 1)) * 100
                  const y = 100 - ((d.value - min) / range) * 100
                  return `${x}%,${y}%`
                }),
                `100%,100%`
              ].join(' ')}
              fill="url(#gradient)"
              opacity="0.2"
            />

            {/* Data points */}
            {chartData.map((d, i) => {
              const x = (i / (chartData.length - 1)) * 100
              const y = 100 - ((d.value - min) / range) * 100
              return (
                <g key={i}>
                  <circle
                    cx={`${x}%`}
                    cy={`${y}%`}
                    r="4"
                    fill="#6366f1"
                    className="drop-shadow-lg"
                  />
                  <title>{`${d.date}: ${d.value.toFixed(1)} ${unit}`}</title>
                </g>
              )
            })}

            {/* Gradient definition */}
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div>
          <div className="text-gray-400 mb-1">Current</div>
          <div className="font-semibold">
            {chartData[chartData.length - 1].value.toFixed(1)} {unit}
          </div>
        </div>
        <div>
          <div className="text-gray-400 mb-1">Peak</div>
          <div className="font-semibold text-green-400">
            {max.toFixed(1)} {unit}
          </div>
        </div>
        <div>
          <div className="text-gray-400 mb-1">Change</div>
          <div className={`font-semibold ${
            chartData[chartData.length - 1].value >= chartData[0].value
              ? 'text-green-400'
              : 'text-red-400'
          }`}>
            {chartData[chartData.length - 1].value >= chartData[0].value ? '+' : ''}
            {(chartData[chartData.length - 1].value - chartData[0].value).toFixed(1)} {unit}
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Calculate estimated 1RM using the Epley formula
 * 1RM = weight × (1 + reps / 30)
 * 
 * More accurate for reps in the 1-10 range.
 * For higher reps, the estimate becomes less reliable.
 */
function calculateEstimated1RM(weight: number, reps: number): number {
  if (reps === 1) return weight
  return weight * (1 + reps / 30)
}

/**
 * ChartTimeRangeSelector Component
 * 
 * Allows users to select the time range for the progress chart.
 * 
 * @example
 * ```tsx
 * <ChartTimeRangeSelector
 *   selected="month"
 *   onChange={(range) => setTimeRange(range)}
 * />
 * ```
 */
interface ChartTimeRangeSelectorProps {
  selected: 'week' | 'month' | '3months' | 'year' | 'all'
  onChange: (range: 'week' | 'month' | '3months' | 'year' | 'all') => void
}

export function ChartTimeRangeSelector({ selected, onChange }: ChartTimeRangeSelectorProps) {
  const ranges: Array<{ value: 'week' | 'month' | '3months' | 'year' | 'all'; label: string }> = [
    { value: 'week', label: '7D' },
    { value: 'month', label: '1M' },
    { value: '3months', label: '3M' },
    { value: 'year', label: '1Y' },
    { value: 'all', label: 'All' }
  ]

  return (
    <div className="flex gap-1 bg-gray-700/50 p-1 rounded-lg">
      {ranges.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            selected === value
              ? 'bg-astral-blue text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

/**
 * ChartMetricSelector Component
 * 
 * Allows users to select which metric to display in the chart.
 * 
 * @example
 * ```tsx
 * <ChartMetricSelector
 *   selected="weight"
 *   onChange={(metric) => setMetric(metric)}
 * />
 * ```
 */
interface ChartMetricSelectorProps {
  selected: 'weight' | 'volume' | 'estimated1rm'
  onChange: (metric: 'weight' | 'volume' | 'estimated1rm') => void
}

export function ChartMetricSelector({ selected, onChange }: ChartMetricSelectorProps) {
  const metrics: Array<{ value: 'weight' | 'volume' | 'estimated1rm'; label: string }> = [
    { value: 'weight', label: 'Max Weight' },
    { value: 'volume', label: 'Volume' },
    { value: 'estimated1rm', label: 'Est. 1RM' }
  ]

  return (
    <div className="flex gap-2">
      {metrics.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selected === value
              ? 'bg-gradient-to-r from-astral-blue to-astral-purple text-white'
              : 'bg-gray-700/50 text-gray-400 hover:text-white'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
