'use client'

import { useState, useEffect } from 'react'

interface HeatmapData {
  date: string
  dayOfWeek: number
  weekNumber: number
  count: number
  duration: number
  intensity: number
}

export function TrainingHeatmap() {
  const [data, setData] = useState<HeatmapData[]>([])
  const [loading, setLoading] = useState(true)
  const [weeks, setWeeks] = useState(12)

  useEffect(() => {
    loadData()
  }, [weeks])

  const loadData = async () => {
    try {
      const res = await fetch(`/api/progress/frequency-heatmap?weeks=${weeks}`)
      if (res.ok) {
        const heatmapData = await res.json()
        setData(heatmapData)
      }
    } catch (error) {
      console.error('Failed to load heatmap:', error)
    } finally {
      setLoading(false)
    }
  }

  const getIntensityColor = (intensity: number) => {
    if (intensity === 0) return 'bg-gray-800'
    if (intensity === 1) return 'bg-green-900'
    if (intensity === 2) return 'bg-green-600'
    return 'bg-green-400'
  }

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  // Group data by week
  const weeklyData: HeatmapData[][] = []
  data.forEach(day => {
    if (!weeklyData[day.weekNumber]) {
      weeklyData[day.weekNumber] = []
    }
    weeklyData[day.weekNumber].push(day)
  })

  if (loading) {
    return <div className="text-gray-400">Loading heatmap...</div>
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Training Frequency</h3>
        <select
          value={weeks}
          onChange={(e) => setWeeks(Number(e.target.value))}
          className="px-3 py-1 bg-gray-700 border border-gray-600 rounded-lg text-sm"
        >
          <option value={4}>4 weeks</option>
          <option value={8}>8 weeks</option>
          <option value={12}>12 weeks</option>
          <option value={26}>26 weeks</option>
        </select>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 bg-gray-800 rounded"></div>
          <div className="w-3 h-3 bg-green-900 rounded"></div>
          <div className="w-3 h-3 bg-green-600 rounded"></div>
          <div className="w-3 h-3 bg-green-400 rounded"></div>
        </div>
        <span>More</span>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-[auto_1fr] gap-2">
        <div className="flex flex-col justify-around text-xs text-gray-500">
          {dayNames.map(day => (
            <div key={day} className="h-3 flex items-center">{day}</div>
          ))}
        </div>

        {/* Heatmap grid */}
        <div className="overflow-x-auto">
          <div className="flex gap-1">
            {weeklyData.map((week, weekIdx) => (
              <div key={weekIdx} className="flex flex-col gap-1">
                {[0, 1, 2, 3, 4, 5, 6].map(dayOfWeek => {
                  const dayData = week.find(d => d.dayOfWeek === dayOfWeek)
                  if (!dayData) return <div key={dayOfWeek} className="w-3 h-3" />
                  
                  return (
                    <div
                      key={dayOfWeek}
                      className={`w-3 h-3 rounded-sm ${getIntensityColor(dayData.intensity)} hover:ring-2 hover:ring-white transition-all cursor-pointer group relative`}
                      title={`${dayData.date}\n${dayData.count} workout(s)\n${dayData.duration} min`}
                    >
                      {/* Tooltip */}
                      <div className="invisible group-hover:visible absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap z-10">
                        <div className="font-semibold">{new Date(dayData.date).toLocaleDateString()}</div>
                        {dayData.count > 0 ? (
                          <>
                            <div>{dayData.count} workout{dayData.count !== 1 ? 's' : ''}</div>
                            <div>{dayData.duration} minutes</div>
                          </>
                        ) : (
                          <div>Rest day</div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="bg-gray-700/50 rounded-lg p-3">
          <div className="text-2xl font-bold text-green-400">
            {data.filter(d => d.count > 0).length}
          </div>
          <div className="text-xs text-gray-400">Active days</div>
        </div>
        <div className="bg-gray-700/50 rounded-lg p-3">
          <div className="text-2xl font-bold text-blue-400">
            {Math.round(data.reduce((sum, d) => sum + d.count, 0) / weeks * 10) / 10}
          </div>
          <div className="text-xs text-gray-400">Workouts/week</div>
        </div>
        <div className="bg-gray-700/50 rounded-lg p-3">
          <div className="text-2xl font-bold text-purple-400">
            {data.filter(d => d.count > 1).length}
          </div>
          <div className="text-xs text-gray-400">Double days</div>
        </div>
      </div>
    </div>
  )
}

