'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useToast } from '@/components/toast'
import { ChartSkeleton } from '@/components/chart-skeleton'

// Dynamic imports for chart components (performance optimization)
const WeightChart = dynamic(() => import('@/components/metrics/weight-chart'), {
  loading: () => <ChartSkeleton />,
  ssr: false,
})

const BodyFatChart = dynamic(() => import('@/components/metrics/body-fat-chart'), {
  loading: () => <ChartSkeleton />,
  ssr: false,
})

const MeasurementsChart = dynamic(() => import('@/components/metrics/measurements-chart'), {
  loading: () => <ChartSkeleton />,
  ssr: false,
})

interface BodyMetric {
  id: string
  date: string
  weight?: number
  bodyFat?: number
  chest?: number
  waist?: number
  hips?: number
  arms?: number
  shoulders?: number
  thighs?: number
  neck?: number
  calves?: number
  forearms?: number
  notes?: string
}

export default function MetricsPage() {
  const [metrics, setMetrics] = useState<BodyMetric[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [activeTab, setActiveTab] = useState<'weight' | 'measurements' | 'photos'>('weight')
  const { toast } = useToast()

  // Form state
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: '',
    bodyFat: '',
    chest: '',
    waist: '',
    hips: '',
    arms: '',
    shoulders: '',
    thighs: '',
    neck: '',
    calves: '',
    forearms: '',
    notes: '',
  })

  useEffect(() => {
    loadMetrics()
  }, [])

  const loadMetrics = async () => {
    try {
      const res = await fetch('/api/metrics')
      if (res.ok) {
        const data = await res.json()
        setMetrics(data)
      }
    } catch (error) {
      console.error('Failed to load metrics:', error)
      toast('error', 'Failed to load metrics')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const metric: any = {
      date: new Date(formData.date),
    }

    // Only include non-empty values
    if (formData.weight) metric.weight = parseFloat(formData.weight)
    if (formData.bodyFat) metric.bodyFat = parseFloat(formData.bodyFat)
    if (formData.chest) metric.chest = parseFloat(formData.chest)
    if (formData.waist) metric.waist = parseFloat(formData.waist)
    if (formData.hips) metric.hips = parseFloat(formData.hips)
    if (formData.arms) metric.arms = parseFloat(formData.arms)
    if (formData.shoulders) metric.shoulders = parseFloat(formData.shoulders)
    if (formData.thighs) metric.thighs = parseFloat(formData.thighs)
    if (formData.neck) metric.neck = parseFloat(formData.neck)
    if (formData.calves) metric.calves = parseFloat(formData.calves)
    if (formData.forearms) metric.forearms = parseFloat(formData.forearms)
    if (formData.notes) metric.notes = formData.notes

    try {
      const res = await fetch('/api/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metric),
      })

      if (res.ok) {
        toast('success', 'Metrics saved successfully!')
        await loadMetrics()
        setShowForm(false)
        // Reset form
        setFormData({
          date: new Date().toISOString().split('T')[0],
          weight: '',
          bodyFat: '',
          chest: '',
          waist: '',
          hips: '',
          arms: '',
          shoulders: '',
          thighs: '',
          neck: '',
          calves: '',
          forearms: '',
          notes: '',
        })
      } else {
        toast('error', 'Failed to save metrics')
      }
    } catch (error) {
      console.error('Error saving metrics:', error)
      toast('error', 'Failed to save metrics')
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Prepare chart data
  const chartData = metrics
    .slice()
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(metric => ({
      date: new Date(metric.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      weight: metric.weight,
      bodyFat: metric.bodyFat,
      waist: metric.waist,
      chest: metric.chest,
      arms: metric.arms,
    }))

  // Calculate BMI if weight exists
  const latestMetric = metrics[0]
  const bmi = latestMetric?.weight ? (latestMetric.weight / Math.pow(1.75, 2)).toFixed(1) : null

  if (loading) {
    return (
      <div className="min-h-screen bg-astral-dark flex items-center justify-center">
        <div className="text-gray-400">Loading metrics...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-astral-dark text-white">
      {/* Header */}
      <header className="bg-astral-gray border-b border-gray-800 p-6">
        <div className="max-w-6xl mx-auto">
          <Link href="/dashboard" className="text-gray-400 hover:text-white mb-2 inline-block">
            ← Back to Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Body Metrics</h1>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 bg-gradient-to-r from-astral-blue to-astral-purple rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              {showForm ? 'Cancel' : '+ Add Metrics'}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        {/* Form */}
        {showForm && (
          <div className="bg-astral-gray border border-gray-800 rounded-xl p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Record New Metrics</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-astral-blue outline-none"
                  required
                />
              </div>

              {/* Weight & Body Fat */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.weight}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                    placeholder="70.5"
                    className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-astral-blue outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Body Fat (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.bodyFat}
                    onChange={(e) => handleInputChange('bodyFat', e.target.value)}
                    placeholder="15.5"
                    className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-astral-blue outline-none"
                  />
                </div>
              </div>

              {/* Measurements */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Body Measurements (cm)</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Chest</label>
                    <input
                      type="number"
                      step="0.5"
                      value={formData.chest}
                      onChange={(e) => handleInputChange('chest', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-astral-blue outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Waist</label>
                    <input
                      type="number"
                      step="0.5"
                      value={formData.waist}
                      onChange={(e) => handleInputChange('waist', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-astral-blue outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Hips</label>
                    <input
                      type="number"
                      step="0.5"
                      value={formData.hips}
                      onChange={(e) => handleInputChange('hips', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-astral-blue outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Arms</label>
                    <input
                      type="number"
                      step="0.5"
                      value={formData.arms}
                      onChange={(e) => handleInputChange('arms', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-astral-blue outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Shoulders</label>
                    <input
                      type="number"
                      step="0.5"
                      value={formData.shoulders}
                      onChange={(e) => handleInputChange('shoulders', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-astral-blue outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Thighs</label>
                    <input
                      type="number"
                      step="0.5"
                      value={formData.thighs}
                      onChange={(e) => handleInputChange('thighs', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-astral-blue outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="How are you feeling? Any changes in diet or routine?"
                  className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-astral-blue outline-none h-24"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-astral-blue to-astral-purple rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Save Metrics
              </button>
            </form>
          </div>
        )}

        {/* Current Stats */}
        {latestMetric && (
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div className="bg-astral-gray border border-gray-800 rounded-xl p-4">
              <div className="text-sm text-gray-400 mb-1">Current Weight</div>
              <div className="text-2xl font-bold text-astral-blue">
                {latestMetric.weight || '—'} kg
              </div>
            </div>
            <div className="bg-astral-gray border border-gray-800 rounded-xl p-4">
              <div className="text-sm text-gray-400 mb-1">Body Fat</div>
              <div className="text-2xl font-bold text-astral-purple">
                {latestMetric.bodyFat || '—'}%
              </div>
            </div>
            <div className="bg-astral-gray border border-gray-800 rounded-xl p-4">
              <div className="text-sm text-gray-400 mb-1">BMI</div>
              <div className="text-2xl font-bold text-green-400">
                {bmi || '—'}
              </div>
            </div>
            <div className="bg-astral-gray border border-gray-800 rounded-xl p-4">
              <div className="text-sm text-gray-400 mb-1">Last Updated</div>
              <div className="text-lg font-bold">
                {new Date(latestMetric.date).toLocaleDateString()}
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-astral-gray border border-gray-800 rounded-xl p-2 mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('weight')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                activeTab === 'weight'
                  ? 'bg-gradient-to-r from-astral-blue to-astral-purple text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              Weight & Body Fat
            </button>
            <button
              onClick={() => setActiveTab('measurements')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                activeTab === 'measurements'
                  ? 'bg-gradient-to-r from-astral-blue to-astral-purple text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              Measurements
            </button>
            <button
              onClick={() => setActiveTab('photos')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                activeTab === 'photos'
                  ? 'bg-gradient-to-r from-astral-blue to-astral-purple text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              Progress Photos
            </button>
          </div>
        </div>

        {/* Charts */}
        {activeTab === 'weight' && chartData.length > 0 && (
          <div className="space-y-6">
            {/* Weight Chart */}
            <WeightChart data={chartData} />

            {/* Body Fat Chart */}
            {chartData.some(d => d.bodyFat) && <BodyFatChart data={chartData} />}
          </div>
        )}

        {activeTab === 'measurements' && chartData.length > 0 && (
          <MeasurementsChart data={chartData} />
        )}

        {activeTab === 'photos' && (
          <div className="bg-astral-gray border border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Progress Photos</h3>
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📸</div>
              <p className="text-gray-300 mb-4">Track your visual progress with photos!</p>
              <Link
                href="/progress/photos"
                className="inline-block px-8 py-3 bg-gradient-to-r from-astral-blue to-astral-purple rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                📸 Open Photo Gallery
              </Link>
              <p className="text-sm text-gray-400 mt-4">
                Upload, compare, and track visual progress over time
              </p>
            </div>
          </div>
        )}

        {/* History Table */}
        {metrics.length > 0 && (
          <div className="bg-astral-gray border border-gray-800 rounded-xl p-6 mt-6">
            <h3 className="text-lg font-semibold mb-4">Recent Entries</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-2 px-4 text-sm text-gray-400">Date</th>
                    <th className="text-left py-2 px-4 text-sm text-gray-400">Weight</th>
                    <th className="text-left py-2 px-4 text-sm text-gray-400">Body Fat</th>
                    <th className="text-left py-2 px-4 text-sm text-gray-400">Waist</th>
                    <th className="text-left py-2 px-4 text-sm text-gray-400">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.slice(0, 10).map((metric) => (
                    <tr key={metric.id} className="border-b border-gray-700/50">
                      <td className="py-2 px-4">
                        {new Date(metric.date).toLocaleDateString()}
                      </td>
                      <td className="py-2 px-4">{metric.weight || '—'} kg</td>
                      <td className="py-2 px-4">{metric.bodyFat || '—'}%</td>
                      <td className="py-2 px-4">{metric.waist || '—'} cm</td>
                      <td className="py-2 px-4 text-sm text-gray-400">
                        {metric.notes?.substring(0, 50) || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
