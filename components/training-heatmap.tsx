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
    if (intensity === 0) return 'bg-neutral-900'
    if (intensity === 1) return 'bg-amber-950'
    if (intensity === 2) return 'bg-amber-700'
    return 'bg-amber-500'
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
        <h3 className="text-lg font-black uppercase tracking-wider">BATTLE FREQUENCY</h3>
        <select
          value={weeks}
          onChange={(e) => setWeeks(Number(e.target.value))}
          className="px-3 py-1 bg-neutral-900 border-2 border-neutral-800 text-sm font-bold uppercase tracking-wider"
        >
          <option value={4}>4 WEEKS</option>
          <option value={8}>8 WEEKS</option>
          <option value={12}>12 WEEKS</option>
          <option value={26}>26 WEEKS</option>
        </select>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 text-xs text-neutral-400 uppercase tracking-wider">
        <span>LESS</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 bg-neutral-900 border border-neutral-800"></div>
          <div className="w-3 h-3 bg-amber-950 border border-amber-900"></div>
          <div className="w-3 h-3 bg-amber-700 border border-amber-800"></div>
          <div className="w-3 h-3 bg-amber-500 border border-amber-600"></div>
        </div>
        <span>MORE</span>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-[auto_1fr] gap-2">
        <div className="flex flex-col justify-around text-xs text-neutral-500 font-bold uppercase tracking-wider">
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
                      className={`w-3 h-3 ${getIntensityColor(dayData.intensity)} hover:ring-2 hover:ring-amber-500 transition-all cursor-pointer group relative border border-neutral-800`}
                      title={`${dayData.date}\n${dayData.count} battle(s)\n${dayData.duration} min`}
                    >
                      {/* Tooltip */}
                      <div className="invisible group-hover:visible absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-neutral-900 border-2 border-amber-700 text-amber-100 text-xs whitespace-nowrap z-10">
                        <div className="font-black uppercase tracking-wider">{new Date(dayData.date).toLocaleDateString()}</div>
                        {dayData.count > 0 ? (
                          <>
                            <div className="font-bold">{dayData.count} battle{dayData.count !== 1 ? 's' : ''}</div>
                            <div className="font-bold">{dayData.duration} MINUTES</div>
                          </>
                        ) : (
                          <div className="font-bold">RECOVERY DAY</div>
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
        <div className="bg-neutral-900 border-2 border-neutral-800 p-3">
          <div className="text-2xl font-black text-amber-400 uppercase tracking-wider">
            {data.filter(d => d.count > 0).length}
          </div>
          <div className="text-xs text-neutral-400 font-bold uppercase tracking-wider">ACTIVE DAYS</div>
        </div>
        <div className="bg-neutral-900 border-2 border-neutral-800 p-3">
          <div className="text-2xl font-black text-amber-400 uppercase tracking-wider">
            {Math.round(data.reduce((sum, d) => sum + d.count, 0) / weeks * 10) / 10}
          </div>
          <div className="text-xs text-neutral-400 font-bold uppercase tracking-wider">BATTLES/WEEK</div>
        </div>
        <div className="bg-neutral-900 border-2 border-neutral-800 p-3">
          <div className="text-2xl font-black text-amber-400 uppercase tracking-wider">
            {data.filter(d => d.count > 1).length}
          </div>
          <div className="text-xs text-neutral-400 font-bold uppercase tracking-wider">DOUBLE DAYS</div>
        </div>
      </div>
    </div>
  )
}

