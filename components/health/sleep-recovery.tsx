'use client'

import { useState } from 'react'
import { Moon, TrendingUp, TrendingDown, Activity, AlertCircle, CheckCircle2 } from 'lucide-react'

interface SleepDataPoint {
  date: string
  hours: number
  quality: number // 1-10 scale
  deep: number // hours
  rem: number // hours
}

interface SleepRecoveryProps {
  sleepData?: SleepDataPoint[]
  recoveryScore?: number
  onLogSleep?: () => void
}

export function SleepRecovery({
  sleepData = [],
  recoveryScore = 75,
  onLogSleep
}: SleepRecoveryProps) {
  const [view, setView] = useState<'chart' | 'details'>('chart')

  // Calculate averages
  const avgHours = sleepData.length > 0
    ? sleepData.reduce((sum, d) => sum + d.hours, 0) / sleepData.length
    : 0

  const avgQuality = sleepData.length > 0
    ? sleepData.reduce((sum, d) => sum + d.quality, 0) / sleepData.length
    : 0

  const avgDeep = sleepData.length > 0
    ? sleepData.reduce((sum, d) => sum + d.deep, 0) / sleepData.length
    : 0

  const avgRem = sleepData.length > 0
    ? sleepData.reduce((sum, d) => sum + d.rem, 0) / sleepData.length
    : 0

  // Calculate trends (last 3 days vs previous)
  const recentAvgHours = sleepData.slice(-3).reduce((sum, d) => sum + d.hours, 0) / 3
  const previousAvgHours = sleepData.slice(0, -3).reduce((sum, d) => sum + d.hours, 0) / Math.max(1, sleepData.length - 3)
  const hoursTrend = recentAvgHours - previousAvgHours

  const recentAvgQuality = sleepData.slice(-3).reduce((sum, d) => sum + d.quality, 0) / 3
  const previousAvgQuality = sleepData.slice(0, -3).reduce((sum, d) => sum + d.quality, 0) / Math.max(1, sleepData.length - 3)
  const qualityTrend = recentAvgQuality - previousAvgQuality

  // Get max hours for chart scaling
  const maxHours = Math.max(...sleepData.map(d => d.hours), 10)

  function getRecoveryColor(score: number): string {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-yellow-400'
    return 'text-orange-400'
  }

  function getRecoveryLabel(score: number): string {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    if (score >= 40) return 'Fair'
    return 'Poor'
  }

  function getRecoveryBg(score: number): string {
    if (score >= 80) return 'from-green-500/20 to-emerald-500/20 border-green-500/30'
    if (score >= 60) return 'from-yellow-500/20 to-orange-500/20 border-yellow-500/30'
    return 'from-orange-500/20 to-red-500/20 border-orange-500/30'
  }

  function getQualityColor(quality: number): string {
    if (quality >= 8) return 'bg-green-500'
    if (quality >= 6) return 'bg-yellow-500'
    if (quality >= 4) return 'bg-orange-500'
    return 'bg-red-500'
  }

  function getSleepRecommendations(hours: number, quality: number): string[] {
    const recommendations: string[] = []
    
    if (hours < 7) {
      recommendations.push('🛌 Aim for 7-9 hours of sleep')
    }
    if (quality < 7) {
      recommendations.push('😴 Try meditation before bed')
      recommendations.push('📱 Reduce screen time 1hr before sleep')
    }
    if (avgDeep < 1.5) {
      recommendations.push('🌡️ Keep room cool (65-68°F)')
    }
    if (avgRem < 1.5) {
      recommendations.push('⏰ Maintain consistent sleep schedule')
    }
    
    if (recommendations.length === 0) {
      recommendations.push('✨ Great sleep! Keep it up!')
    }
    
    return recommendations
  }

  const recommendations = getSleepRecommendations(avgHours, avgQuality)

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Moon className="w-6 h-6 text-purple-400" />
          Sleep & Recovery
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setView('chart')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              view === 'chart'
                ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border border-purple-500/30'
                : 'bg-slate-800/50 text-gray-400 hover:text-white border border-slate-700'
            }`}
          >
            Chart
          </button>
          <button
            onClick={() => setView('details')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              view === 'details'
                ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border border-purple-500/30'
                : 'bg-slate-800/50 text-gray-400 hover:text-white border border-slate-700'
            }`}
          >
            Details
          </button>
        </div>
      </div>

      {/* Recovery Score */}
      <div className={`bg-gradient-to-br ${getRecoveryBg(recoveryScore)} border rounded-xl p-4 mb-6`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 mb-1">Recovery Score</p>
            <div className="flex items-center gap-3">
              <span className={`text-4xl font-bold ${getRecoveryColor(recoveryScore)}`}>
                {recoveryScore}
              </span>
              <div>
                <p className={`text-lg font-semibold ${getRecoveryColor(recoveryScore)}`}>
                  {getRecoveryLabel(recoveryScore)}
                </p>
                <p className="text-xs text-gray-500">
                  {recoveryScore >= 80 ? 'Ready for intense training' : 
                   recoveryScore >= 60 ? 'Moderate training recommended' : 
                   'Focus on recovery today'}
                </p>
              </div>
            </div>
          </div>
          <Activity className={`w-12 h-12 ${getRecoveryColor(recoveryScore)}`} />
        </div>
      </div>

      {view === 'chart' ? (
        <div className="space-y-6">
          {/* Sleep Hours Chart */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-semibold text-gray-400">Sleep Duration</p>
                <p className="text-2xl font-bold">{avgHours.toFixed(1)}h <span className="text-sm text-gray-500">avg</span></p>
              </div>
              <div className="flex items-center gap-1 text-sm">
                {hoursTrend > 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-400" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-400" />
                )}
                <span className={hoursTrend > 0 ? 'text-green-400' : 'text-red-400'}>
                  {Math.abs(hoursTrend).toFixed(1)}h
                </span>
              </div>
            </div>
            <div className="flex items-end gap-2 h-32">
              {sleepData.map((data, i) => {
                const heightPercent = (data.hours / maxHours) * 100
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex flex-col justify-end h-24">
                      <div
                        className="w-full bg-gradient-to-t from-purple-500 to-pink-500 rounded-t transition-all duration-300 hover:opacity-80 relative group"
                        style={{ height: `${heightPercent}%` }}
                      >
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 border border-purple-500/30 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          {data.hours}h
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">
                      {new Date(data.date).toLocaleDateString('en-US', { weekday: 'short' })}
                    </p>
                  </div>
                )
              })}
            </div>
            {/* Goal line */}
            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
              <div className="flex-1 border-t border-dashed border-gray-600" />
              <span>Target: 8h</span>
              <div className="flex-1 border-t border-dashed border-gray-600" />
            </div>
          </div>

          {/* Quality Trend */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-semibold text-gray-400">Sleep Quality</p>
                <p className="text-2xl font-bold">{avgQuality.toFixed(1)}/10 <span className="text-sm text-gray-500">avg</span></p>
              </div>
              <div className="flex items-center gap-1 text-sm">
                {qualityTrend > 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-400" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-400" />
                )}
                <span className={qualityTrend > 0 ? 'text-green-400' : 'text-red-400'}>
                  {Math.abs(qualityTrend).toFixed(1)}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              {sleepData.map((data, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 w-12">
                    {new Date(data.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                  <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getQualityColor(data.quality)} transition-all duration-300`}
                      style={{ width: `${data.quality * 10}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold w-8 text-right">{data.quality}/10</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Sleep Phase Breakdown */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-1">Deep Sleep</p>
              <p className="text-2xl font-bold text-blue-400">{avgDeep.toFixed(1)}h</p>
              <p className="text-xs text-gray-500 mt-1">
                {avgDeep >= 1.5 ? (
                  <span className="text-green-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Optimal
                  </span>
                ) : (
                  <span className="text-yellow-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Below target
                  </span>
                )}
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-1">REM Sleep</p>
              <p className="text-2xl font-bold text-purple-400">{avgRem.toFixed(1)}h</p>
              <p className="text-xs text-gray-500 mt-1">
                {avgRem >= 1.5 ? (
                  <span className="text-green-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Optimal
                  </span>
                ) : (
                  <span className="text-yellow-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Below target
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-slate-800/50 rounded-xl p-4">
            <p className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-blue-400" />
              Sleep Recommendations
            </p>
            <ul className="space-y-2">
              {recommendations.map((rec, i) => (
                <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                  <span className="mt-0.5">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Recent Nights Details */}
          <div>
            <p className="text-sm font-semibold text-gray-400 mb-3">Recent Nights</p>
            <div className="space-y-2">
              {sleepData.slice(-3).reverse().map((data, i) => (
                <div key={i} className="bg-slate-800/50 rounded-lg p-3 flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{new Date(data.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
                    <p className="text-xs text-gray-500">
                      Deep: {data.deep}h • REM: {data.rem}h
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">{data.hours}h</p>
                    <div className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${getQualityColor(data.quality)}`} />
                      <p className="text-xs text-gray-500">Quality: {data.quality}/10</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {onLogSleep && (
        <button
          onClick={onLogSleep}
          className="w-full mt-6 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border border-purple-500/30 rounded-lg font-medium transition-colors"
        >
          Log Sleep Data
        </button>
      )}
    </div>
  )
}
