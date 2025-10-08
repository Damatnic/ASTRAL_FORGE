'use client'

import { useState, useEffect } from 'react'
import { useToast } from '@/components/toast'
import { AppLayout, PageContainer, PageHeader } from '@/components/layout'
import {
  Target,
  Plus,
  TrendingUp,
  Calendar,
  CheckCircle2,
  Clock,
  Flame,
  Trophy,
  X,
  Award,
} from 'lucide-react'

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
  milestones?: Array<{ value: number; date: string; note?: string; achieved?: boolean }>
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter])

  const loadGoals = async () => {
    try {
      const url = statusFilter ? `/api/goals?status=${statusFilter}` : '/api/goals'
      const res = await fetch(url)
      if (res.ok) {
        const data = await res.json()
        // API returns { goals, total, hasMore } so extract goals array
        setGoals(Array.isArray(data) ? data : (data.goals || []))
      }
    } catch (error) {
      console.error('Failed to load goals:', error)
      setGoals([])
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
    } catch (_error) {
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
    } catch (_error) {
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
    } catch (_error) {
      toast('error', 'Failed to complete goal')
    }
  }

  const getGoalProgress = (goal: Goal) => {
    if (!goal.targetValue || !goal.currentValue) return 0
    return Math.min(Math.round((goal.currentValue / goal.targetValue) * 100), 100)
  }

  const goalTypeConfig: Record<string, { icon: string; gradient: string; bgColor: string; borderColor: string }> = {
    strength: { 
      icon: '💪', 
      gradient: 'from-amber-700 to-amber-600', 
      bgColor: 'bg-amber-950/50', 
      borderColor: 'border-amber-800/50' 
    },
    weight: { 
      icon: '⚖️', 
      gradient: 'from-amber-700 to-amber-600', 
      bgColor: 'bg-amber-950/50', 
      borderColor: 'border-amber-800/50' 
    },
    body_composition: { 
      icon: '🏋️', 
      gradient: 'from-amber-700 to-amber-600', 
      bgColor: 'bg-amber-950/50', 
      borderColor: 'border-amber-800/50' 
    },
    performance: { 
      icon: '🎯', 
      gradient: 'from-amber-700 to-amber-600', 
      bgColor: 'bg-amber-950/50', 
      borderColor: 'border-amber-800/50' 
    },
    habit: { 
      icon: '✅', 
      gradient: 'from-amber-700 to-amber-600', 
      bgColor: 'bg-amber-950/50', 
      borderColor: 'border-amber-800/50' 
    },
  }

  const activeGoals = goals.filter(g => g.status === 'active')
  const completedGoals = goals.filter(g => g.status === 'completed')
  const successRate = goals.length > 0 
    ? Math.round((completedGoals.length / goals.length) * 100) 
    : 0

  if (loading) {
    return (
      <AppLayout>
        <PageContainer>
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent animate-spin"></div>
              <div className="text-neutral-400 font-light">Loading your objectives...</div>
            </div>
          </div>
        </PageContainer>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <PageContainer>
        <PageHeader
          title="Objectives"
          description="Set ambitious targets and forge your path to glory"
          action={
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-6 py-3 bg-amber-950/50 hover:bg-amber-950/70 border-2 border-amber-700 hover:border-amber-600 font-bold transition-all flex items-center gap-2 text-amber-400 uppercase tracking-wider"
            >
              {showForm ? (
                <>
                  <X className="w-5 h-5" />
                  Cancel
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  New Objective
                </>
              )}
            </button>
          }
        />

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-neutral-900 border-2 border-neutral-800 p-6">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-amber-950/50 border-2 border-amber-800/50">
                <Target className="w-6 h-6 text-amber-400" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-400">
                  {activeGoals.length}
                </div>
                <div className="text-sm text-neutral-400 uppercase tracking-wider font-bold">Active</div>
              </div>
            </div>
          </div>

          <div className="bg-neutral-900 border-2 border-neutral-800 p-6">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-amber-950/50 border-2 border-amber-800/50">
                <CheckCircle2 className="w-6 h-6 text-amber-400" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-400">
                  {completedGoals.length}
                </div>
                <div className="text-sm text-neutral-400 uppercase tracking-wider font-bold">Conquered</div>
              </div>
            </div>
          </div>

          <div className="bg-neutral-900 border-2 border-neutral-800 p-6">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-amber-950/50 border-2 border-amber-800/50">
                <Trophy className="w-6 h-6 text-amber-400" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-400">
                  {successRate}%
                </div>
                <div className="text-sm text-neutral-400 uppercase tracking-wider font-bold">Victory Rate</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          <button
            onClick={() => setStatusFilter('')}
            className={`px-4 py-2 font-bold uppercase tracking-wider transition-all whitespace-nowrap border-2 ${
              statusFilter === '' 
                ? 'bg-amber-950/50 text-amber-400 border-amber-700' 
                : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-amber-400'
            }`}
          >
            All Objectives
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-4 py-2 font-bold uppercase tracking-wider transition-all whitespace-nowrap border-2 ${
              statusFilter === 'active' 
                ? 'bg-amber-950/50 text-amber-400 border-amber-700' 
                : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-amber-400'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setStatusFilter('completed')}
            className={`px-4 py-2 font-bold uppercase tracking-wider transition-all whitespace-nowrap border-2 ${
              statusFilter === 'completed' 
                ? 'bg-amber-950/50 text-amber-400 border-amber-700' 
                : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-amber-400'
            }`}
          >
            Conquered
          </button>
          <button
            onClick={() => setStatusFilter('abandoned')}
            className={`px-4 py-2 font-bold uppercase tracking-wider transition-all whitespace-nowrap border-2 ${
              statusFilter === 'abandoned' 
                ? 'bg-amber-950/50 text-amber-400 border-amber-700' 
                : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-amber-400'
            }`}
          >
            Abandoned
          </button>
        </div>

        {/* Create Goal Form */}
        {showForm && (
          <div className="bg-neutral-900 border-2 border-neutral-800 p-6 mb-6">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 uppercase tracking-wider text-amber-400">
              <Award className="w-5 h-5 text-amber-400" />
              Create New Objective
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-neutral-400 mb-2 uppercase tracking-wider">
                  Objective Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Bench Press 100kg"
                  className="w-full px-4 py-3 bg-neutral-950 border-2 border-neutral-800 focus:outline-none focus:border-amber-700 text-neutral-100 font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-neutral-400 mb-2 uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Why is this objective important to you?"
                  className="w-full px-4 py-3 bg-neutral-950 border-2 border-neutral-800 h-24 resize-none focus:outline-none focus:border-amber-700 text-neutral-100 font-medium"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-neutral-400 mb-2 uppercase tracking-wider">
                    Objective Type
                  </label>
                  <select
                    value={goalType}
                    onChange={(e) => setGoalType(e.target.value)}
                    className="w-full px-4 py-3 bg-neutral-950 border-2 border-neutral-800 focus:outline-none focus:border-amber-700 text-neutral-100 font-medium"
                  >
                    <option value="strength">💪 Strength Objective</option>
                    <option value="weight">⚖️ Weight Objective</option>
                    <option value="body_composition">🏋️ Body Composition</option>
                    <option value="performance">🎯 Performance</option>
                    <option value="habit">✅ Habit Objective</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-neutral-400 mb-2 uppercase tracking-wider">
                    Deadline
                  </label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Target Value
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={targetValue}
                    onChange={(e) => setTargetValue(e.target.value)}
                    placeholder="100"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Current Value
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={currentValue}
                    onChange={(e) => setCurrentValue(e.target.value)}
                    placeholder="75"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Unit
                  </label>
                  <input
                    type="text"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="kg"
                    className="w-full px-4 py-3 bg-neutral-950 border-2 border-neutral-800 focus:outline-none focus:border-amber-700 text-neutral-100 font-medium"
                  />
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={saving || !title.trim()}
                className="w-full py-3 bg-amber-950/50 hover:bg-amber-950/70 border-2 border-amber-700 hover:border-amber-600 font-bold uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed text-amber-400"
              >
                {saving ? 'Creating Objective...' : 'Create Objective'}
              </button>
            </div>
          </div>
        )}

        {/* Goals List */}
        {goals.length === 0 ? (
          <div className="bg-neutral-900 border-2 border-neutral-800 p-12 text-center">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-bold mb-2 uppercase tracking-wider text-amber-400">No Objectives Yet</h3>
            <p className="text-neutral-400 mb-6">Set your first objective and begin your conquest!</p>
            <button
              onClick={() => setShowForm(true)}
              className="px-8 py-3 bg-amber-950/50 hover:bg-amber-950/70 border-2 border-amber-700 hover:border-amber-600 font-bold uppercase tracking-wider transition-all text-amber-400"
            >
              Create Your First Objective
            </button>
          </div>
        ) : (
          <div className="space-y-4 mb-8">
            {goals.map((goal) => {
              const progress = getGoalProgress(goal)
              const config = goalTypeConfig[goal.goalType] || goalTypeConfig.performance
              const daysLeft = goal.deadline
                ? Math.ceil((new Date(goal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                : null

              return (
                <div
                  key={goal.id}
                  className={`bg-neutral-900 border-2 p-6 ${config.borderColor}`}
                >
                  {/* Goal Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <div className={`text-3xl p-2 ${config.bgColor} border-2 ${config.borderColor}`}>
                        {config.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold uppercase tracking-wide text-amber-100">{goal.title}</h3>
                        {goal.description && (
                          <p className="text-neutral-400 text-sm mt-1">{goal.description}</p>
                        )}
                        <div className="flex items-center gap-3 mt-2 text-sm text-neutral-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(goal.createdAt).toLocaleDateString()}
                          </span>
                          {daysLeft !== null && goal.status === 'active' && (
                            <span className={`flex items-center gap-1 ${daysLeft < 30 ? 'text-amber-400' : 'text-neutral-400'}`}>
                              <Clock className="w-4 h-4" />
                              {daysLeft > 0 ? `${daysLeft} days left` : 'Overdue!'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {goal.status === 'completed' && (
                      <span className="px-3 py-1 bg-amber-950/50 border-2 border-amber-700 text-amber-400 text-sm font-bold uppercase tracking-wider flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        Conquered
                      </span>
                    )}
                  </div>

                  {/* Progress Bar */}
                  {goal.targetValue && goal.status !== 'completed' && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-400">
                          {goal.currentValue} / {goal.targetValue} {goal.unit}
                        </span>
                        <span className={`text-sm font-bold bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}>
                          {progress}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${config.gradient} transition-all duration-500`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  {goal.status === 'active' && (
                    <div className="flex gap-2">
                      {goal.targetValue && progress < 100 && (
                        <button
                          onClick={() => {
                            const newValue = prompt(`Update progress (current: ${goal.currentValue}):`)
                            if (newValue) updateProgress(goal.id, parseFloat(newValue))
                          }}
                          className={`px-4 py-2 bg-gradient-to-r ${config.gradient} rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2`}
                        >
                          <TrendingUp className="w-4 h-4" />
                          Update Progress
                        </button>
                      )}
                      {progress >= 100 && (
                        <button
                          onClick={() => completeGoal(goal.id)}
                          className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
                        >
                          <CheckCircle2 className="w-4 h-4" />
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

        {/* SMART Goals Tips */}
        <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-700/30 rounded-lg p-6">
          <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Flame className="w-5 h-5 text-purple-400" />
            SMART Goals Framework
          </h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div>
                <span className="font-bold text-blue-400">Specific:</span>
                <span className="text-gray-300"> Define exactly what you want to achieve</span>
              </div>
              <div>
                <span className="font-bold text-purple-400">Measurable:</span>
                <span className="text-gray-300"> Set clear numbers you can track</span>
              </div>
              <div>
                <span className="font-bold text-green-400">Achievable:</span>
                <span className="text-gray-300"> Be ambitious but realistic</span>
              </div>
            </div>
            <div className="space-y-2">
              <div>
                <span className="font-bold text-orange-400">Relevant:</span>
                <span className="text-gray-300"> Align with your overall fitness vision</span>
              </div>
              <div>
                <span className="font-bold text-pink-400">Time-bound:</span>
                <span className="text-gray-300"> Set a deadline to stay accountable</span>
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
    </AppLayout>
  )
}

