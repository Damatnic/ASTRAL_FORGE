'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useToast } from '@/components/toast'

interface Goal {
  id: string
  title: string
  description?: string
  goalType: string
  targetValue?: number
  currentValue?: number
  unit?: string
  deadline?: string
  status: string
  completedAt?: string
  milestones?: any[]
  createdAt: string
}

export default function GoalsPage() {
  const { toast } = useToast()
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>('active')

  // Form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [goalType, setGoalType] = useState<string>('strength')
  const [targetValue, setTargetValue] = useState('')
  const [currentValue, setCurrentValue] = useState('')
  const [unit, setUnit] = useState('')
  const [deadline, setDeadline] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadGoals()
  }, [statusFilter])

  const loadGoals = async () => {
    try {
      const url = statusFilter ? `/api/goals?status=${statusFilter}` : '/api/goals'
      const res = await fetch(url)
      if (res.ok) {
        const data = await res.json()
        setGoals(data)
      }
    } catch (error) {
      console.error('Failed to load goals:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast('error', 'Goal title is required')
      return
    }

    setSaving(true)
    try {
      const res = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || null,
          goalType,
          targetValue: targetValue ? parseFloat(targetValue) : null,
          currentValue: currentValue ? parseFloat(currentValue) : 0,
          unit: unit.trim() || null,
          deadline: deadline || null,
        }),
      })

      if (res.ok) {
        toast('success', 'Goal created!')
        resetForm()
        setShowForm(false)
        loadGoals()
      } else {
        toast('error', 'Failed to create goal')
      }
    } catch (error) {
      toast('error', 'Failed to create goal')
    } finally {
      setSaving(false)
    }
  }

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setGoalType('strength')
    setTargetValue('')
    setCurrentValue('')
    setUnit('')
    setDeadline('')
  }

  const updateProgress = async (goalId: string, newValue: number) => {
    try {
      const res = await fetch(`/api/goals?id=${goalId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentValue: newValue }),
      })

      if (res.ok) {
        toast('success', 'Progress updated!')
        loadGoals()
      }
    } catch (error) {
      toast('error', 'Failed to update progress')
    }
  }

  const completeGoal = async (goalId: string) => {
    try {
      const res = await fetch(`/api/goals?id=${goalId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'completed' }),
      })

      if (res.ok) {
        toast('success', '🎉 Goal completed!')
        loadGoals()
      }
    } catch (error) {
      toast('error', 'Failed to complete goal')
    }
  }

  const getGoalProgress = (goal: Goal) => {
    if (!goal.targetValue || !goal.currentValue) return 0
    return Math.min(Math.round((goal.currentValue / goal.targetValue) * 100), 100)
  }

  const getGoalTypeIcon = (type: string) => {
    switch (type) {
      case 'strength': return '💪'
      case 'weight': return '⚖️'
      case 'body_composition': return '🏋️'
      case 'performance': return '🎯'
      case 'habit': return '✅'
      default: return '🎯'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-astral-dark flex items-center justify-center">
        <div className="text-gray-400">Loading goals...</div>
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
          <h1 className="text-3xl font-bold mb-2">Personal Goals</h1>
          <p className="text-gray-400">Track your long-term training objectives</p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 bg-gradient-to-r from-astral-blue to-astral-purple rounded-lg font-semibold hover:opacity-90 touch-manipulation min-h-[44px]"
          >
            {showForm ? '✕ Cancel' : '🎯 New Goal'}
          </button>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-gray-700 rounded-lg"
          >
            <option value="">All Goals</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="abandoned">Abandoned</option>
          </select>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-astral-gray border border-gray-800 rounded-xl p-6 space-y-4 animate-slide-up">
            <h3 className="text-lg font-semibold">Create New Goal</h3>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Goal Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Bench Press 100kg"
                className="w-full px-4 py-2 bg-gray-700 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Why is this goal important to you?"
                className="w-full px-4 py-3 bg-gray-700 rounded-lg h-20 resize-none"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Goal Type</label>
                <select
                  value={goalType}
                  onChange={(e) => setGoalType(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 rounded-lg"
                >
                  <option value="strength">Strength Goal</option>
                  <option value="weight">Weight Goal</option>
                  <option value="body_composition">Body Composition</option>
                  <option value="performance">Performance</option>
                  <option value="habit">Habit Goal</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Deadline</label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 rounded-lg"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Target Value</label>
                <input
                  type="number"
                  step="0.1"
                  value={targetValue}
                  onChange={(e) => setTargetValue(e.target.value)}
                  placeholder="100"
                  className="w-full px-4 py-2 bg-gray-700 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Current Value</label>
                <input
                  type="number"
                  step="0.1"
                  value={currentValue}
                  onChange={(e) => setCurrentValue(e.target.value)}
                  placeholder="75"
                  className="w-full px-4 py-2 bg-gray-700 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Unit</label>
                <input
                  type="text"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="kg"
                  className="w-full px-4 py-2 bg-gray-700 rounded-lg"
                />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={saving || !title.trim()}
              className="w-full py-3 bg-gradient-to-r from-astral-blue to-astral-purple rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 touch-manipulation min-h-[44px]"
            >
              {saving ? 'Creating...' : 'Create Goal'}
            </button>
          </div>
        )}

        {/* Goals List */}
        {goals.length === 0 ? (
          <div className="bg-astral-gray border border-gray-800 rounded-xl p-12 text-center">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-bold mb-2">No Goals Yet</h3>
            <p className="text-gray-400 mb-6">Set your first goal and start tracking progress!</p>
            <button
              onClick={() => setShowForm(true)}
              className="px-8 py-3 bg-gradient-to-r from-astral-blue to-astral-purple rounded-lg font-semibold touch-manipulation min-h-[44px]"
            >
              Create Your First Goal
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {goals.map((goal) => {
              const progress = getGoalProgress(goal)
              const daysLeft = goal.deadline
                ? Math.ceil((new Date(goal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                : null

              return (
                <div
                  key={goal.id}
                  className="bg-astral-gray border border-gray-800 rounded-xl p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">{getGoalTypeIcon(goal.goalType)}</span>
                      <div>
                        <h3 className="text-xl font-bold">{goal.title}</h3>
                        {goal.description && (
                          <p className="text-gray-400 text-sm mt-1">{goal.description}</p>
                        )}
                      </div>
                    </div>
                    {goal.status === 'completed' && (
                      <span className="px-3 py-1 bg-green-900/30 text-green-400 rounded text-sm font-semibold">
                        ✅ Completed
                      </span>
                    )}
                  </div>

                  {goal.targetValue && goal.status !== 'completed' && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-400">
                          Progress: {goal.currentValue} / {goal.targetValue} {goal.unit}
                        </span>
                        <span className="text-sm font-semibold text-astral-blue">
                          {progress}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-astral-blue to-astral-purple transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                    <span>Created: {new Date(goal.createdAt).toLocaleDateString()}</span>
                    {daysLeft !== null && goal.status === 'active' && (
                      <span className={daysLeft < 30 ? 'text-yellow-400' : ''}>
                        {daysLeft > 0 ? `${daysLeft} days left` : 'Overdue'}
                      </span>
                    )}
                  </div>

                  {goal.status === 'active' && (
                    <div className="flex gap-2">
                      {goal.targetValue && progress < 100 && (
                        <button
                          onClick={() => {
                            const newValue = prompt(`Update progress (current: ${goal.currentValue}):`)
                            if (newValue) updateProgress(goal.id, parseFloat(newValue))
                          }}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm touch-manipulation min-h-[44px] flex items-center"
                        >
                          Update Progress
                        </button>
                      )}
                      {progress >= 100 && (
                        <button
                          onClick={() => completeGoal(goal.id)}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm touch-manipulation min-h-[44px] flex items-center"
                        >
                          Mark as Completed
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Tips */}
        <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-700/30 rounded-xl p-6">
          <h4 className="text-sm font-semibold text-gray-400 mb-3">🎯 SMART Goals</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>• <strong>Specific:</strong> Define exactly what you want to achieve</li>
            <li>• <strong>Measurable:</strong> Set clear numbers you can track</li>
            <li>• <strong>Achievable:</strong> Be ambitious but realistic</li>
            <li>• <strong>Relevant:</strong> Align with your overall fitness vision</li>
            <li>• <strong>Time-bound:</strong> Set a deadline to stay accountable</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
