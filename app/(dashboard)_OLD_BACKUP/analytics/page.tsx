'use client'

import { useState, useEffect } from 'react'
import { Container, Stack, Section, Card, Grid, Inline } from '@/components/ui/layout'
import { 
  TrendingUp, 
  TrendingDown,
  BarChart3,
  Calendar,
  Dumbbell,
  Target,
  Zap,
  Award,
  Clock,
  Activity,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react'

interface AnalyticsData {
  volumeData: Array<{ week: string; volume: number; sets: number }>
  strengthData: Array<{ exercise: string; current: number; previous: number; change: number; trend: 'up' | 'down' | 'neutral' }>
  rpeData: Array<{ week: string; avgRPE: number }>
  frequencyData: Array<{ day: string; workouts: number; avgDuration: number }>
  muscleGroupData: Array<{ muscle: string; sets: number; volume: number }>
  keyMetrics: {
    totalVolume: number
    volumeChange: number
    avgStrengthGain: number
    workoutFrequency: number
    avgRPE: number
    rpeChange: number
  }
  recoveryMetrics: {
    avgRestBetweenSets: number
    restDaysPerWeek: number
    recoveryScore: number
    trainingStress: string
  }
  recentPRs: Array<{
    exercise: string
    type: string
    value: string
    date: Date
    icon: string
  }>
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month')
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAnalytics() {
      setLoading(true)
      try {
        const response = await fetch(`/api/analytics?timeRange=${timeRange}`)
        if (response.ok) {
          const analyticsData = await response.json()
          setData(analyticsData)
        }
      } catch (error) {
        console.error('Failed to fetch analytics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [timeRange])

  if (loading || !data) {
    return (
      <Container>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading analytics...</p>
          </div>
        </div>
      </Container>
    )
  }

  const { volumeData, strengthData, rpeData, frequencyData, muscleGroupData, keyMetrics, recoveryMetrics, recentPRs } = data

  return (
    <Container>
      <Stack spacing="xl">
        {/* Header */}
        <Section>
          <Stack spacing="sm">
            <Inline justify="between" align="center">
              <div>
                <h1 className="text-display-sm font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Training Analytics
                </h1>
                <p className="text-body-md text-gray-400 mt-2">
                  Comprehensive insights into your training performance
                </p>
              </div>
              
              {/* Time Range Selector */}
              <div className="flex gap-2 bg-astral-gray rounded-lg p-1">
                {(['week', 'month', 'year'] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      timeRange === range
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {range.charAt(0).toUpperCase() + range.slice(1)}
                  </button>
                ))}
              </div>
            </Inline>
          </Stack>
        </Section>

        {/* Key Metrics Overview */}
        <Section>
          <Grid cols={1} gap="md" responsive={{ sm: 2, lg: 4 }}>
            <Card variant="bordered">
              <Stack spacing="sm">
                <Inline justify="between" align="start">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                  </div>
                  <span className={`text-sm flex items-center gap-1 ${
                    keyMetrics.volumeChange > 0 ? 'text-green-400' : 
                    keyMetrics.volumeChange < 0 ? 'text-red-400' : 'text-gray-400'
                  }`}>
                    {keyMetrics.volumeChange > 0 ? <ArrowUpRight className="w-4 h-4" /> : 
                     keyMetrics.volumeChange < 0 ? <ArrowDownRight className="w-4 h-4" /> : 
                     <Minus className="w-4 h-4" />}
                    {keyMetrics.volumeChange > 0 ? '+' : ''}{keyMetrics.volumeChange}%
                  </span>
                </Inline>
                <div>
                  <p className="text-gray-400 text-sm">Total Volume</p>
                  <p className="text-heading-xl font-bold text-white mt-1">{keyMetrics.totalVolume.toLocaleString()} lbs</p>
                  <p className="text-xs text-gray-500 mt-1">This {timeRange}</p>
                </div>
              </Stack>
            </Card>

            <Card variant="bordered">
              <Stack spacing="sm">
                <Inline justify="between" align="start">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Dumbbell className="w-5 h-5 text-purple-400" />
                  </div>
                  <span className="text-green-400 text-sm flex items-center gap-1">
                    <ArrowUpRight className="w-4 h-4" />
                    +{((strengthData.reduce((sum, s) => sum + s.change, 0) / strengthData.length) || 0).toFixed(1)}%
                  </span>
                </Inline>
                <div>
                  <p className="text-gray-400 text-sm">Avg Strength</p>
                  <p className="text-heading-xl font-bold text-white mt-1">
                    +{((strengthData.reduce((sum, s) => sum + s.change, 0) / strengthData.length) || 0).toFixed(1)} lbs
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Per exercise</p>
                </div>
              </Stack>
            </Card>

            <Card variant="bordered">
              <Stack spacing="sm">
                <Inline justify="between" align="start">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <Calendar className="w-5 h-5 text-green-400" />
                  </div>
                  <span className="text-gray-400 text-sm flex items-center gap-1">
                    <Minus className="w-4 h-4" />
                    0%
                  </span>
                </Inline>
                <div>
                  <p className="text-gray-400 text-sm">Workout Frequency</p>
                  <p className="text-heading-xl font-bold text-white mt-1">{keyMetrics.workoutFrequency}/week</p>
                  <p className="text-xs text-gray-500 mt-1">Consistency: {Math.round((keyMetrics.workoutFrequency / 7) * 100)}%</p>
                </div>
              </Stack>
            </Card>

            <Card variant="bordered">
              <Stack spacing="sm">
                <Inline justify="between" align="start">
                  <div className="p-2 bg-orange-500/20 rounded-lg">
                    <Zap className="w-5 h-5 text-orange-400" />
                  </div>
                  <span className={`text-sm flex items-center gap-1 ${
                    keyMetrics.rpeChange > 0 ? 'text-orange-400' : 'text-green-400'
                  }`}>
                    {keyMetrics.rpeChange > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    {keyMetrics.rpeChange > 0 ? '+' : ''}{keyMetrics.rpeChange.toFixed(1)}
                  </span>
                </Inline>
                <div>
                  <p className="text-gray-400 text-sm">Avg RPE</p>
                  <p className="text-heading-xl font-bold text-white mt-1">{keyMetrics.avgRPE.toFixed(1)}</p>
                  <p className="text-xs text-gray-500 mt-1">Training intensity</p>
                </div>
              </Stack>
            </Card>
          </Grid>
        </Section>

        {/* Volume Progression Chart */}
        <Section>
          <Card variant="bordered">
            <Stack spacing="lg">
              <Inline justify="between" align="center">
                <div>
                  <h2 className="text-heading-md font-semibold text-white">Volume Progression</h2>
                  <p className="text-sm text-gray-400 mt-1">Total training volume over time</p>
                </div>
                <button className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
                  View Details
                  <ChevronRight className="w-4 h-4" />
                </button>
              </Inline>

              {/* Chart Visualization */}
              <div className="relative h-64">
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500 pr-2">
                  <span>80k</span>
                  <span>60k</span>
                  <span>40k</span>
                  <span>20k</span>
                  <span>0</span>
                </div>

                {/* Chart area */}
                <div className="ml-10 h-full flex items-end justify-between gap-2">
                  {volumeData.map((data, index) => {
                    const height = (data.volume / 80000) * 100
                    const isDeload = data.week === 'W4'
                    return (
                      <div key={data.week} className="flex-1 flex flex-col items-center gap-2">
                        {/* Bar */}
                        <div className="w-full flex flex-col justify-end h-full">
                          <div
                            className={`w-full rounded-t-lg transition-all hover:opacity-80 ${
                              isDeload
                                ? 'bg-gradient-to-t from-orange-500/50 to-orange-400/50'
                                : 'bg-gradient-to-t from-blue-500/50 to-purple-500/50'
                            }`}
                            style={{ height: `${height}%` }}
                          >
                            {/* Tooltip on hover */}
                            <div className="opacity-0 hover:opacity-100 transition-opacity">
                              <div className="relative">
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-astral-dark border border-gray-700 rounded-lg p-2 whitespace-nowrap text-xs">
                                  <p className="text-white font-semibold">{data.volume.toLocaleString()} lbs</p>
                                  <p className="text-gray-400">{data.sets} sets</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* Label */}
                        <span className="text-xs text-gray-400">{data.week}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Legend */}
              <Inline spacing="md" justify="center">
                <Inline spacing="xs" align="center">
                  <div className="w-3 h-3 rounded bg-gradient-to-r from-blue-500 to-purple-500" />
                  <span className="text-xs text-gray-400">Training Weeks</span>
                </Inline>
                <Inline spacing="xs" align="center">
                  <div className="w-3 h-3 rounded bg-gradient-to-r from-orange-500 to-orange-400" />
                  <span className="text-xs text-gray-400">Deload Weeks</span>
                </Inline>
              </Inline>
            </Stack>
          </Card>
        </Section>

        {/* Strength Progression & RPE Trends */}
        <Grid cols={1} gap="md" responsive={{ lg: 2 }}>
          {/* Strength Progression */}
          <Card variant="bordered">
            <Stack spacing="md">
              <div>
                <h2 className="text-heading-md font-semibold text-white">Strength Progression</h2>
                <p className="text-sm text-gray-400 mt-1">Estimated 1RM changes</p>
              </div>

              <Stack spacing="xs">
                {strengthData.map((lift) => (
                  <div
                    key={lift.exercise}
                    className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <Inline justify="between" align="center">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">{lift.exercise}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {lift.previous} lbs → {lift.current} lbs
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-white">{lift.current} lbs</p>
                        <div
                          className={`text-xs font-medium flex items-center gap-1 justify-end mt-1 ${
                            lift.trend === 'up'
                              ? 'text-green-400'
                              : lift.trend === 'down'
                              ? 'text-red-400'
                              : 'text-gray-400'
                          }`}
                        >
                          {lift.trend === 'up' && <ArrowUpRight className="w-3 h-3" />}
                          {lift.trend === 'down' && <ArrowDownRight className="w-3 h-3" />}
                          {lift.trend === 'neutral' && <Minus className="w-3 h-3" />}
                          {lift.change > 0 && '+'}
                          {lift.change} lbs
                        </div>
                      </div>
                    </Inline>
                  </div>
                ))}
              </Stack>
            </Stack>
          </Card>

          {/* RPE Trends */}
          <Card variant="bordered">
            <Stack spacing="md">
              <div>
                <h2 className="text-heading-md font-semibold text-white">RPE Trends</h2>
                <p className="text-sm text-gray-400 mt-1">Training intensity over time</p>
              </div>

              {/* Line chart visualization */}
              <div className="relative h-48">
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500 pr-2">
                  <span>10</span>
                  <span>8</span>
                  <span>6</span>
                  <span>4</span>
                  <span>2</span>
                </div>

                {/* Chart area */}
                <div className="ml-8 h-full relative">
                  {/* Grid lines */}
                  <div className="absolute inset-0 flex flex-col justify-between">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-px bg-gray-800" />
                    ))}
                  </div>

                  {/* Line chart */}
                  <svg className="absolute inset-0 w-full h-full">
                    <defs>
                      <linearGradient id="rpeGradient" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#f97316" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <polyline
                      fill="url(#rpeGradient)"
                      stroke="#f97316"
                      strokeWidth="2"
                      points={rpeData
                        .map((data, i) => {
                          const x = (i / (rpeData.length - 1)) * 100
                          const y = 100 - (data.avgRPE / 10) * 100
                          return `${x}%,${y}%`
                        })
                        .join(' ')}
                    />
                  </svg>
                </div>

                {/* X-axis labels */}
                <div className="absolute bottom-0 left-8 right-0 flex justify-between text-xs text-gray-500 pt-2">
                  {rpeData.map((data) => (
                    <span key={data.week}>{data.week}</span>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <Grid cols={3} gap="sm">
                <div className="text-center p-2 rounded-lg bg-orange-500/10">
                  <p className="text-xs text-gray-400">Current</p>
                  <p className="text-lg font-bold text-orange-400">8.5</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-white/5">
                  <p className="text-xs text-gray-400">Average</p>
                  <p className="text-lg font-bold text-white">7.6</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-white/5">
                  <p className="text-xs text-gray-400">Peak</p>
                  <p className="text-lg font-bold text-white">8.5</p>
                </div>
              </Grid>
            </Stack>
          </Card>
        </Grid>

        {/* Frequency Analysis & Muscle Group Distribution */}
        <Grid cols={1} gap="md" responsive={{ lg: 2 }}>
          {/* Frequency Heatmap */}
          <Card variant="bordered">
            <Stack spacing="md">
              <div>
                <h2 className="text-heading-md font-semibold text-white">Weekly Frequency</h2>
                <p className="text-sm text-gray-400 mt-1">Workouts per day of week</p>
              </div>

              <Stack spacing="xs">
                {frequencyData.map((day) => {
                  const intensity = (day.workouts / 12) * 100
                  return (
                    <div key={day.day}>
                      <Inline justify="between" align="center" className="mb-1">
                        <span className="text-sm text-gray-400 w-12">{day.day}</span>
                        <span className="text-xs text-gray-500">{day.workouts} workouts</span>
                      </Inline>
                      <div className="relative h-8 bg-white/5 rounded-lg overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all"
                          style={{ width: `${intensity}%` }}
                        />
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                          Avg {day.avgDuration}min
                        </span>
                      </div>
                    </div>
                  )
                })}
              </Stack>

              <div className="pt-2 border-t border-gray-800">
                <Inline justify="between">
                  <span className="text-xs text-gray-400">Total Workouts</span>
                  <span className="text-sm font-semibold text-white">60 sessions</span>
                </Inline>
              </div>
            </Stack>
          </Card>

          {/* Muscle Group Distribution */}
          <Card variant="bordered">
            <Stack spacing="md">
              <div>
                <h2 className="text-heading-md font-semibold text-white">Muscle Group Volume</h2>
                <p className="text-sm text-gray-400 mt-1">Distribution this {timeRange}</p>
              </div>

              <Stack spacing="xs">
                {muscleGroupData.map((muscle) => {
                  const maxVolume = Math.max(...muscleGroupData.map((m) => m.volume))
                  const percentage = (muscle.volume / maxVolume) * 100

                  return (
                    <div key={muscle.muscle}>
                      <Inline justify="between" align="center" className="mb-1">
                        <span className="text-sm text-white">{muscle.muscle}</span>
                        <span className="text-xs text-gray-400">
                          {muscle.sets} sets • {(muscle.volume / 1000).toFixed(1)}k lbs
                        </span>
                      </Inline>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </Stack>

              <div className="pt-2 border-t border-gray-800">
                <Inline justify="between">
                  <span className="text-xs text-gray-400">Total Sets</span>
                  <span className="text-sm font-semibold text-white">
                    {muscleGroupData.reduce((sum, m) => sum + m.sets, 0)} sets
                  </span>
                </Inline>
              </div>
            </Stack>
          </Card>
        </Grid>

        {/* Recovery Metrics */}
        <Section>
          <Card variant="bordered">
            <Stack spacing="md">
              <div>
                <h2 className="text-heading-md font-semibold text-white">Recovery Metrics</h2>
                <p className="text-sm text-gray-400 mt-1">Rest and recovery analysis</p>
              </div>

              <Grid cols={1} gap="md" responsive={{ sm: 2, lg: 4 }}>
                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <Inline spacing="sm" align="center">
                    <Clock className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="text-xs text-gray-400">Avg Rest Between Sets</p>
                      <p className="text-lg font-bold text-white mt-1">
                        {Math.floor(recoveryMetrics.avgRestBetweenSets / 60)}:{String(recoveryMetrics.avgRestBetweenSets % 60).padStart(2, '0')}
                      </p>
                    </div>
                  </Inline>
                </div>

                <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <Inline spacing="sm" align="center">
                    <Calendar className="w-5 h-5 text-purple-400" />
                    <div>
                      <p className="text-xs text-gray-400">Rest Days</p>
                      <p className="text-lg font-bold text-white mt-1">{recoveryMetrics.restDaysPerWeek}/week</p>
                    </div>
                  </Inline>
                </div>

                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                  <Inline spacing="sm" align="center">
                    <Activity className="w-5 h-5 text-green-400" />
                    <div>
                      <p className="text-xs text-gray-400">Recovery Score</p>
                      <p className="text-lg font-bold text-white mt-1">{recoveryMetrics.recoveryScore}/100</p>
                    </div>
                  </Inline>
                </div>

                <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
                  <Inline spacing="sm" align="center">
                    <Target className="w-5 h-5 text-orange-400" />
                    <div>
                      <p className="text-xs text-gray-400">Training Stress</p>
                      <p className="text-lg font-bold text-white mt-1">{recoveryMetrics.trainingStress}</p>
                    </div>
                  </Inline>
                </div>
              </Grid>
            </Stack>
          </Card>
        </Section>

        {/* Personal Records Timeline */}
        <Section>
          <Card variant="bordered">
            <Stack spacing="md">
              <Inline justify="between" align="center">
                <div>
                  <h2 className="text-heading-md font-semibold text-white">Recent Personal Records</h2>
                  <p className="text-sm text-gray-400 mt-1">PRs achieved this {timeRange}</p>
                </div>
                <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                  View All PRs
                </button>
              </Inline>

              <Stack spacing="xs">
                {recentPRs.length > 0 ? (
                  recentPRs.map((pr, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 hover:border-yellow-500/40 transition-colors"
                    >
                      <Inline justify="between" align="center">
                        <Inline spacing="md" align="center">
                          <span className="text-2xl">{pr.icon}</span>
                          <div>
                            <p className="text-sm font-semibold text-white">{pr.exercise}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{pr.type}</p>
                          </div>
                        </Inline>
                        <div className="text-right">
                          <p className="text-lg font-bold text-yellow-400">{pr.value}</p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {new Date(pr.date).toLocaleDateString()}
                          </p>
                        </div>
                      </Inline>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-400">
                    <Award className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No personal records yet this {timeRange}</p>
                    <p className="text-sm mt-1">Keep training to set new PRs!</p>
                  </div>
                )}
              </Stack>
            </Stack>
          </Card>
        </Section>
      </Stack>
    </Container>
  )
}
