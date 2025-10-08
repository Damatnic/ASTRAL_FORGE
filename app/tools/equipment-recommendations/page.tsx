'use client'

import React, { useState } from 'react'
import { AlertCircle, TrendingUp, Package, DollarSign, ChevronDown, ChevronUp } from 'lucide-react'
import {
  generateEquipmentRecommendations,
  getEquipmentProgressionPath,
  getPriorityBadge,
  type UserTrainingProfile,
  type EquipmentRecommendation,
} from '@/lib/equipment-recommendations'

export default function EquipmentRecommendationsPage() {
  // User profile state
  const [profile, setProfile] = useState<UserTrainingProfile>({
    goals: ['strength'],
    currentEquipment: [],
    trainingFrequency: 4,
    experience: 'intermediate',
    budget: 'medium',
    spaceAvailable: 'moderate',
  })

  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set())
  const [showProgression, setShowProgression] = useState(false)

  // Generate recommendations based on profile
  const recommendations = generateEquipmentRecommendations(profile)
  const progressionPath = getEquipmentProgressionPath(profile)

  const toggleCard = (equipmentId: string) => {
    const newExpanded = new Set(expandedCards)
    if (newExpanded.has(equipmentId)) {
      newExpanded.delete(equipmentId)
    } else {
      newExpanded.add(equipmentId)
    }
    setExpandedCards(newExpanded)
  }

  const updateGoals = (goal: 'strength' | 'hypertrophy' | 'endurance' | 'general-fitness') => {
    const newGoals = profile.goals.includes(goal)
      ? profile.goals.filter(g => g !== goal)
      : [...profile.goals, goal]
    setProfile({ ...profile, goals: newGoals })
  }

  const updateEquipment = (equipment: string) => {
    const newEquipment = profile.currentEquipment.includes(equipment)
      ? profile.currentEquipment.filter(e => e !== equipment)
      : [...profile.currentEquipment, equipment]
    setProfile({ ...profile, currentEquipment: newEquipment })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Equipment Recommendations
          </h1>
          <p className="text-gray-400">
            Get personalized equipment suggestions based on your training goals and budget.
          </p>
        </div>

        {/* Profile Configuration */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Your Training Profile</h2>

          <div className="space-y-6">
            {/* Goals */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Training Goals</label>
              <div className="flex flex-wrap gap-2">
                {(['strength', 'hypertrophy', 'endurance', 'general-fitness'] as const).map(goal => (
                  <button
                    key={goal}
                    onClick={() => updateGoals(goal)}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      profile.goals.includes(goal)
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {goal === 'general-fitness' ? 'General Fitness' : goal.charAt(0).toUpperCase() + goal.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Current Equipment */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Current Equipment</label>
              <div className="flex flex-wrap gap-2">
                {['barbell', 'dumbbells', 'rack', 'bench', 'plates', 'pullup_bar', 'bands', 'kettlebell'].map(eq => (
                  <button
                    key={eq}
                    onClick={() => updateEquipment(eq)}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      profile.currentEquipment.includes(eq)
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {eq.split('_').join(' ').replace(/\b\w/g, c => c.toUpperCase())}
                  </button>
                ))}
              </div>
            </div>

            {/* Training Frequency */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Training Frequency: {profile.trainingFrequency} days/week
              </label>
              <input
                type="range"
                min="2"
                max="7"
                value={profile.trainingFrequency}
                onChange={e => setProfile({ ...profile, trainingFrequency: Number(e.target.value) })}
                className="w-full"
              />
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Experience Level</label>
              <div className="flex gap-2">
                {(['beginner', 'intermediate', 'advanced'] as const).map(exp => (
                  <button
                    key={exp}
                    onClick={() => setProfile({ ...profile, experience: exp })}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      profile.experience === exp
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {exp.charAt(0).toUpperCase() + exp.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Budget</label>
              <div className="flex gap-2">
                {(['low', 'medium', 'high'] as const).map(budgetLevel => (
                  <button
                    key={budgetLevel}
                    onClick={() => setProfile({ ...profile, budget: budgetLevel })}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      profile.budget === budgetLevel
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {budgetLevel.charAt(0).toUpperCase() + budgetLevel.slice(1)}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Low: {'<'}$500 • Medium: $500-$1500 • High: $1500+
              </p>
            </div>

            {/* Space */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Available Space</label>
              <div className="flex gap-2">
                {(['minimal', 'moderate', 'spacious'] as const).map(space => (
                  <button
                    key={space}
                    onClick={() => setProfile({ ...profile, spaceAvailable: space })}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      profile.spaceAvailable === space
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {space.charAt(0).toUpperCase() + space.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations List */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">
              Your Recommendations ({recommendations.length})
            </h2>
            <button
              onClick={() => setShowProgression(!showProgression)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
            >
              {showProgression ? 'Hide' : 'Show'} Progression Path
            </button>
          </div>

          {recommendations.length === 0 ? (
            <div className="bg-gray-800 rounded-lg p-8 text-center">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">
                You already have all the essential equipment! Consider upgrading or adding specialized items.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <RecommendationCard
                  key={index}
                  recommendation={rec}
                  expanded={expandedCards.has(rec.equipmentName)}
                  onToggle={() => toggleCard(rec.equipmentName)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Progression Path */}
        {showProgression && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Equipment Progression Path</h2>
            <p className="text-gray-400 text-sm mb-6">
              Build your home gym in phases based on priority and budget.
            </p>

            <div className="space-y-6">
              {progressionPath.map((phase, index) => (
                <div key={index} className="bg-gray-900 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-black uppercase tracking-wider text-white">{phase.phase}</h3>
                    <div className="text-amber-400 font-black uppercase tracking-wider">
                      ${phase.estimatedCost.min} - ${phase.estimatedCost.max}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {phase.recommendations.map((rec, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-gray-800 rounded text-sm text-gray-300"
                      >
                        {rec.equipmentName}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function RecommendationCard({
  recommendation,
  expanded,
  onToggle,
}: {
  recommendation: EquipmentRecommendation
  expanded: boolean
  onToggle: () => void
}) {
  const priorityBadge = getPriorityBadge(recommendation.priority)

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between hover:bg-gray-750 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className={`px-3 py-1 rounded ${priorityBadge.color} font-semibold`}>
            {priorityBadge.text}
          </div>
          <div className="text-left">
            <h3 className="text-lg font-semibold text-white">{recommendation.equipmentName}</h3>
            <p className="text-sm text-gray-400">ROI Score: {recommendation.roi}/100</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-amber-400 font-black uppercase tracking-wider">{recommendation.estimatedCost}</div>
          </div>
          {expanded ? (
            <ChevronUp className="w-5 h-5 text-neutral-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-neutral-400" />
          )}
        </div>
      </button>

      {/* Expanded Content */}
      {expanded && (
        <div className="p-4 pt-0 space-y-4">
          {/* Reasoning */}
          <div>
            <h4 className="text-sm font-semibold text-gray-400 mb-2">Why This Equipment?</h4>
            <p className="text-gray-300">{recommendation.reasoning}</p>
          </div>

          {/* Benefits */}
          {recommendation.benefits.length > 0 && (
            <div>
              <h4 className="text-sm font-black uppercase tracking-wider text-neutral-400 mb-2">Benefits</h4>
              <ul className="space-y-1">
                {recommendation.benefits.map((benefit, i) => (
                  <li key={i} className="text-neutral-300 text-sm flex items-start gap-2 uppercase tracking-wider font-bold">
                    <TrendingUp className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Unlocks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendation.unlocks.exercises.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-400 mb-2 flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Unlocks {recommendation.unlocks.exercises.length} Exercises
                </h4>
                <div className="flex flex-wrap gap-1">
                  {recommendation.unlocks.exercises.slice(0, 6).map((ex, i) => (
                    <span key={i} className="px-2 py-1 bg-gray-900 rounded text-xs text-gray-300">
                      {ex}
                    </span>
                  ))}
                  {recommendation.unlocks.exercises.length > 6 && (
                    <span className="px-2 py-1 bg-neutral-900 text-xs text-amber-400 uppercase tracking-wider font-bold">
                      +{recommendation.unlocks.exercises.length - 6} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {recommendation.unlocks.templates.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-400 mb-2 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Unlocks {recommendation.unlocks.templates.length} Templates
                </h4>
                <div className="flex flex-wrap gap-1">
                  {recommendation.unlocks.templates.map((template, i) => (
                    <span key={i} className="px-2 py-1 bg-gray-900 rounded text-xs text-gray-300">
                      {template}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Category */}
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
            <Package className="w-4 h-4" />
            <span>Category: {recommendation.category}</span>
          </div>
        </div>
      )}
    </div>
  )
}
