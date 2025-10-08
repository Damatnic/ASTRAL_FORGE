'use client'

import { useState } from 'react'
import { BarChart3, TrendingUp, Clock, Target, Award, X } from 'lucide-react'
import type { CustomTemplate } from './custom-template-creator'

interface TemplateAnalyticsProps {
  isOpen: boolean
  onClose: () => void
  templates: CustomTemplate[]
}

export function TemplateAnalytics({ isOpen, onClose, templates }: TemplateAnalyticsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'all'>('month')

  // Calculate analytics
  const totalTemplates = templates.length
  const totalUsage = templates.reduce((sum, t) => sum + t.usageCount, 0)
  const averageUsage = totalTemplates > 0 ? (totalUsage / totalTemplates).toFixed(1) : '0'
  const favoriteTemplates = templates.filter(t => t.isFavorite).length

  // Most used templates
  const mostUsedTemplates = [...templates]
    .sort((a, b) => b.usageCount - a.usageCount)
    .slice(0, 5)

  // Category distribution
  const categoryStats = templates.reduce((acc, template) => {
    acc[template.category] = (acc[template.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Usage by category
  const categoryUsage = templates.reduce((acc, template) => {
    acc[template.category] = (acc[template.category] || 0) + template.usageCount
    return acc
  }, {} as Record<string, number>)

  const categoryIcons: Record<string, string> = {
    chest: '💪',
    back: '🦾',
    legs: '🦵',
    arms: '💪',
    shoulders: '🏔️',
    'full-body': '🔥',
    custom: '⚙️'
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-900 border-2 border-amber-700/30 max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl shadow-amber-500/20">
        {/* Header */}
        <div className="bg-amber-950/30 border-b-2 border-amber-700/30 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-amber-950/50 border-2 border-amber-700 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white uppercase tracking-wider">Template Analytics</h2>
                <p className="text-sm text-neutral-400 uppercase tracking-wider font-bold">Track your superset template usage and effectiveness</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-neutral-900 border-2 border-neutral-800 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-all flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Period Filter */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setSelectedPeriod('week')}
              className={`px-4 py-2 font-black transition-all uppercase tracking-wider ${
                selectedPeriod === 'week'
                  ? 'bg-amber-950/50 border-2 border-amber-700 text-amber-400'
                  : 'bg-neutral-900 border-2 border-neutral-800 text-neutral-400 hover:bg-neutral-800'
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => setSelectedPeriod('month')}
              className={`px-4 py-2 font-black transition-all uppercase tracking-wider ${
                selectedPeriod === 'month'
                  ? 'bg-amber-950/50 border-2 border-amber-700 text-amber-400'
                  : 'bg-neutral-900 border-2 border-neutral-800 text-neutral-400 hover:bg-neutral-800'
              }`}
            >
              This Month
            </button>
            <button
              onClick={() => setSelectedPeriod('all')}
              className={`px-4 py-2 font-black transition-all uppercase tracking-wider ${
                selectedPeriod === 'all'
                  ? 'bg-amber-950/50 border-2 border-amber-700 text-amber-400'
                  : 'bg-neutral-900 border-2 border-neutral-800 text-neutral-400 hover:bg-neutral-800'
              }`}
            >
              All Time
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {templates.length === 0 ? (
            <div className="bg-neutral-900 border-2 border-neutral-800 p-12 text-center">
              <BarChart3 className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
              <p className="text-neutral-400 mb-2 uppercase tracking-wider font-bold">No template data yet</p>
              <p className="text-sm text-neutral-500 uppercase tracking-wider font-bold">Create and use templates to see analytics</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Overview Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-amber-950/20 border-2 border-amber-700/30 p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-amber-950/50 border-2 border-amber-700 flex items-center justify-center">
                      <Target className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-sm text-neutral-400 uppercase tracking-wider font-bold">Total Templates</p>
                      <p className="text-3xl font-black text-white uppercase tracking-wider">{totalTemplates}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-950/20 border-2 border-amber-700/30 p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-amber-950/50 border-2 border-amber-700 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-sm text-neutral-400 uppercase tracking-wider font-bold">Total Uses</p>
                      <p className="text-3xl font-black text-white uppercase tracking-wider">{totalUsage}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-950/10 border-2 border-amber-700/20 p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-amber-950/10 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-sm text-neutral-400 uppercase tracking-wider font-bold">Avg Usage</p>
                      <p className="text-3xl font-black text-white uppercase tracking-wider">{averageUsage}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-950/10 border-2 border-amber-700/20 p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-amber-950/10 flex items-center justify-center">
                      <Award className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-sm text-neutral-400 uppercase tracking-wider font-bold">Favorites</p>
                      <p className="text-3xl font-black text-white uppercase tracking-wider">{favoriteTemplates}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Most Used Templates */}
              <div className="bg-neutral-900 border-2 border-neutral-800 p-6">
                <h3 className="text-xl font-black text-white mb-4 flex items-center gap-2 uppercase tracking-wider">
                  <TrendingUp className="w-5 h-5 text-amber-400" />
                  Most Used Campaigns
                </h3>
                <div className="space-y-3">
                  {mostUsedTemplates.length === 0 ? (
                    <p className="text-neutral-400 text-center py-4 uppercase tracking-wider font-bold">No usage data yet</p>
                  ) : (
                    mostUsedTemplates.map((template, index) => (
                      <div
                        key={template.id}
                        className="flex items-center gap-4 p-4 bg-neutral-950 border-2 border-neutral-800"
                      >
                        <div className="w-10 h-10 bg-amber-950/50 border-2 border-amber-700 flex items-center justify-center text-white font-black text-lg">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-black text-white uppercase tracking-wider">{template.name}</h4>
                            {template.isFavorite && (
                              <span className="text-amber-500">⭐</span>
                            )}
                          </div>
                          <p className="text-sm text-neutral-400 uppercase tracking-wider font-bold">
                            {template.exercises.length} techniques • {template.category}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-black text-amber-400 uppercase tracking-wider">{template.usageCount}</p>
                          <p className="text-xs text-neutral-500 uppercase tracking-wider font-bold">uses</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Category Distribution */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Templates per Category */}
                <div className="bg-neutral-900 border-2 border-neutral-800 p-6">
                  <h3 className="text-xl font-black text-white mb-4 flex items-center gap-2 uppercase tracking-wider">
                    <Target className="w-5 h-5 text-amber-400" />
                    Campaigns by Category
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(categoryStats)
                      .sort(([, a], [, b]) => b - a)
                      .map(([category, count]) => (
                        <div key={category} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span>{categoryIcons[category] || '⚙️'}</span>
                              <span className="font-black text-white uppercase tracking-wider">{category}</span>
                            </div>
                            <span className="text-neutral-400 font-bold">{count}</span>
                          </div>
                          <div className="h-2 bg-neutral-800 overflow-hidden">
                            <div
                              className="h-full bg-amber-600"
                              style={{ width: `${(count / totalTemplates) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Usage per Category */}
                <div className="bg-neutral-900 border-2 border-neutral-800 p-6">
                  <h3 className="text-xl font-black text-white mb-4 flex items-center gap-2 uppercase tracking-wider">
                    <BarChart3 className="w-5 h-5 text-amber-400" />
                    Usage by Category
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(categoryUsage)
                      .sort(([, a], [, b]) => b - a)
                      .map(([category, usage]) => (
                        <div key={category} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span>{categoryIcons[category] || '⚙️'}</span>
                              <span className="font-black text-white uppercase tracking-wider">{category}</span>
                            </div>
                            <span className="text-neutral-400 uppercase tracking-wider font-bold">{usage} uses</span>
                          </div>
                          <div className="h-2 bg-neutral-800 overflow-hidden">
                            <div
                              className="h-full bg-amber-600"
                              style={{ width: `${(usage / totalUsage) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* Insights */}
              <div className="bg-amber-950/20 border-2 border-amber-700/30 p-6">
                <h3 className="text-xl font-black text-white mb-4 flex items-center gap-2 uppercase tracking-wider">
                  💡 Insights
                </h3>
                <div className="space-y-3 text-neutral-300">
                  {mostUsedTemplates.length > 0 && (
                    <p className="uppercase tracking-wider font-bold">
                      • Your most popular campaign is <span className="font-black text-amber-400">{mostUsedTemplates[0].name}</span> with{' '}
                      <span className="font-black text-amber-400">{mostUsedTemplates[0].usageCount}</span> uses
                    </p>
                  )}
                  {Object.entries(categoryUsage).length > 0 && (
                    <p className="uppercase tracking-wider font-bold">
                      • You battle{' '}
                      <span className="font-black text-amber-400">
                        {Object.entries(categoryUsage).sort(([, a], [, b]) => b - a)[0][0]}
                      </span>{' '}
                      most frequently
                    </p>
                  )}
                  {favoriteTemplates > 0 && (
                    <p className="uppercase tracking-wider font-bold">
                      • You have <span className="font-black text-amber-400">{favoriteTemplates}</span> favorite{' '}
                      {favoriteTemplates === 1 ? 'campaign' : 'campaigns'}
                    </p>
                  )}
                  {totalUsage > 50 && (
                    <p className="text-amber-400 uppercase tracking-wider font-bold">
                      🎉 Great job! You&apos;ve used campaigns over 50 times. Consistency builds champions!
                    </p>
                  )}
                  {totalTemplates === 0 && (
                    <p className="text-amber-400 uppercase tracking-wider font-bold">
                      💪 Create your first campaign to start tracking your progress!
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t-2 border-neutral-800 p-6 bg-neutral-950">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-amber-950/50 hover:bg-amber-950/70 text-neutral-300 hover:text-white font-black transition-all border-2 border-amber-700 uppercase tracking-wider"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
