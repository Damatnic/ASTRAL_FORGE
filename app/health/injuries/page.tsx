'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useToast } from '@/components/toast'

interface Injury {
  id: string
  name: string
  bodyPart: string
  severity: string
  status: string
  dateOccurred: string
  dateHealed?: string
  notes?: string
  affectedExercises: string[]
}

export default function InjuriesPage() {
  const { toast } = useToast()
  const [injuries, setInjuries] = useState<Injury[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>('active')

  // Form state
  const [name, setName] = useState('')
  const [bodyPart, setBodyPart] = useState('')
  const [severity, setSeverity] = useState<'minor' | 'moderate' | 'severe'>('minor')
  const [dateOccurred, setDateOccurred] = useState(new Date().toISOString().split('T')[0])
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadInjuries()
  }, [statusFilter])

  const loadInjuries = async () => {
    try {
      const url = statusFilter ? `/api/injuries?status=${statusFilter}` : '/api/injuries'
      const res = await fetch(url)
      if (res.ok) {
        const data = await res.json()
        setInjuries(data)
      }
    } catch (error) {
      console.error('Failed to load injuries:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!name || !bodyPart) {
      toast('error', 'Name and body part are required')
      return
    }

    setSaving(true)
    try {
      const res = await fetch('/api/injuries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          bodyPart,
          severity,
          dateOccurred,
          notes: notes.trim() || null,
          affectedExercises: [],
        }),
      })

      if (res.ok) {
        toast('success', 'Injury logged')
        setName('')
        setBodyPart('')
        setSeverity('minor')
        setNotes('')
        setShowForm(false)
        loadInjuries()
      } else {
        toast('error', 'Failed to log injury')
      }
    } catch (error) {
      toast('error', 'Failed to log injury')
    } finally {
      setSaving(false)
    }
  }

  const updateStatus = async (injuryId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/injuries?id=${injuryId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          dateHealed: newStatus === 'healed' ? new Date().toISOString() : null,
        }),
      })

      if (res.ok) {
        toast('success', `Marked as ${newStatus}`)
        loadInjuries()
      }
    } catch (error) {
      toast('error', 'Failed to update')
    }
  }

  const getSeverityColor = (severity: string) => {
    if (severity === 'minor') return 'bg-yellow-900/30 text-yellow-400'
    if (severity === 'moderate') return 'bg-orange-900/30 text-orange-400'
    return 'bg-red-900/30 text-red-400'
  }

  const getStatusColor = (status: string) => {
    if (status === 'active') return 'bg-red-900/30 text-red-400'
    if (status === 'recovering') return 'bg-yellow-900/30 text-yellow-400'
    return 'bg-green-900/30 text-green-400'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-astral-dark flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-astral-dark text-white">
      <header className="bg-astral-gray border-b border-gray-800 p-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/dashboard" className="text-gray-400 hover:text-white mb-2 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold mb-2">Injury Tracking</h1>
          <p className="text-gray-400">Monitor and manage injuries for safer training</p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 bg-gradient-to-r from-astral-blue to-astral-purple rounded-lg font-semibold hover:opacity-90"
          >
            {showForm ? '✕ Cancel' : '🤕 Log Injury'}
          </button>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-gray-700 rounded-lg"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="recovering">Recovering</option>
            <option value="healed">Healed</option>
          </select>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-astral-gray border border-gray-800 rounded-xl p-6 space-y-4 animate-slide-up">
            <h3 className="text-lg font-semibold">Log New Injury</h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Injury Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Lower back strain"
                  className="w-full px-4 py-2 bg-gray-700 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Body Part</label>
                <select
                  value={bodyPart}
                  onChange={(e) => setBodyPart(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 rounded-lg"
                >
                  <option value="">Select...</option>
                  <option value="shoulder">Shoulder</option>
                  <option value="elbow">Elbow</option>
                  <option value="wrist">Wrist</option>
                  <option value="back">Back</option>
                  <option value="hip">Hip</option>
                  <option value="knee">Knee</option>
                  <option value="ankle">Ankle</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Severity</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['minor', 'moderate', 'severe'] as const).map((level) => (
                    <button
                      key={level}
                      onClick={() => setSeverity(level)}
                      className={`py-2 rounded-lg capitalize transition-all ${
                        severity === level
                          ? level === 'minor' ? 'bg-yellow-600' : level === 'moderate' ? 'bg-orange-600' : 'bg-red-600'
                          : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Date Occurred</label>
                <input
                  type="date"
                  value={dateOccurred}
                  onChange={(e) => setDateOccurred(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="How did it happen? Symptoms? Treatment plan?"
                className="w-full px-4 py-3 bg-gray-700 rounded-lg h-24 resize-none"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={saving || !name || !bodyPart}
              className="w-full py-3 bg-gradient-to-r from-astral-blue to-astral-purple rounded-lg font-semibold hover:opacity-90 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Log Injury'}
            </button>
          </div>
        )}

        {/* Injuries List */}
        {injuries.length === 0 ? (
          <div className="bg-astral-gray border border-gray-800 rounded-xl p-12 text-center">
            <div className="text-6xl mb-4">💪</div>
            <h3 className="text-xl font-bold mb-2">No Injuries</h3>
            <p className="text-gray-400">
              {statusFilter === 'active' ? 'No active injuries - keep training safely!' : 'No injuries found for this filter'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {injuries.map((injury) => (
              <div
                key={injury.id}
                className="bg-astral-gray border border-gray-800 rounded-xl p-6"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold">{injury.name}</h3>
                    <p className="text-gray-400 capitalize">{injury.bodyPart}</p>
                  </div>
                  <div className="flex gap-2">
                    <span className={`px-3 py-1 rounded text-sm font-semibold ${getSeverityColor(injury.severity)}`}>
                      {injury.severity}
                    </span>
                    <span className={`px-3 py-1 rounded text-sm font-semibold ${getStatusColor(injury.status)}`}>
                      {injury.status}
                    </span>
                  </div>
                </div>

                {injury.notes && (
                  <p className="text-gray-300 mb-4">{injury.notes}</p>
                )}

                <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                  <span>Occurred: {new Date(injury.dateOccurred).toLocaleDateString()}</span>
                  {injury.dateHealed && (
                    <span>Healed: {new Date(injury.dateHealed).toLocaleDateString()}</span>
                  )}
                </div>

                {injury.status !== 'healed' && (
                  <div className="flex gap-2">
                    {injury.status === 'active' && (
                      <button
                        onClick={() => updateStatus(injury.id, 'recovering')}
                        className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-sm"
                      >
                        Mark as Recovering
                      </button>
                    )}
                    {injury.status === 'recovering' && (
                      <button
                        onClick={() => updateStatus(injury.id, 'healed')}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm"
                      >
                        Mark as Healed
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Safety Tips */}
        <div className="bg-gradient-to-br from-red-900/20 to-orange-900/20 border border-red-700/30 rounded-xl p-6">
          <h4 className="text-sm font-semibold text-gray-400 mb-3">🚨 Injury Prevention Tips</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>• Always warm up properly before training</li>
            <li>• Listen to your body - pain is a warning sign</li>
            <li>• Progress gradually - don't rush weight increases</li>
            <li>• Prioritize form over weight</li>
            <li>• Get adequate rest and recovery</li>
            <li>• Consult a healthcare professional for persistent pain</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
