'use client'

import { useState } from 'react'
import { Apple, Flame, Droplets, TrendingUp, Plus, Target } from 'lucide-react'

interface MacroData {
  protein: number
  carbs: number
  fats: number
}

interface NutritionGoals {
  calories: number
  protein: number
  carbs: number
  fats: number
  hydration: number // in cups
}

interface NutritionDashboardProps {
  currentCalories?: number
  currentMacros?: MacroData
  currentHydration?: number
  goals?: NutritionGoals
  mealQuality?: number // 1-10 scale
  onLogMeal?: () => void
  onLogWater?: () => void
}

export function NutritionDashboard({
  currentCalories = 0,
  currentMacros = { protein: 0, carbs: 0, fats: 0 },
  currentHydration = 0,
  goals = {
    calories: 2500,
    protein: 150,
    carbs: 250,
    fats: 80,
    hydration: 8
  },
  mealQuality = 7,
  onLogMeal,
  onLogWater
}: NutritionDashboardProps) {
  const [activeView, setActiveView] = useState<'overview' | 'macros'>('overview')

  const calorieProgress = Math.min(100, (currentCalories / goals.calories) * 100)
  const proteinProgress = Math.min(100, (currentMacros.protein / goals.protein) * 100)
  const carbsProgress = Math.min(100, (currentMacros.carbs / goals.carbs) * 100)
  const fatsProgress = Math.min(100, (currentMacros.fats / goals.fats) * 100)
  const hydrationProgress = Math.min(100, (currentHydration / goals.hydration) * 100)

  const macroColors = {
    protein: {
      from: 'from-blue-500',
      to: 'to-cyan-500',
      bg: 'bg-blue-500/20',
      text: 'text-blue-400',
      border: 'border-blue-500/30'
    },
    carbs: {
      from: 'from-yellow-500',
      to: 'to-orange-500',
      bg: 'bg-yellow-500/20',
      text: 'text-yellow-400',
      border: 'border-yellow-500/30'
    },
    fats: {
      from: 'from-purple-500',
      to: 'to-pink-500',
      bg: 'bg-purple-500/20',
      text: 'text-purple-400',
      border: 'border-purple-500/30'
    }
  }

  function getQualityColor(quality: number): string {
    if (quality >= 8) return 'text-green-400'
    if (quality >= 6) return 'text-yellow-400'
    return 'text-orange-400'
  }

  function getQualityLabel(quality: number): string {
    if (quality >= 8) return 'Excellent'
    if (quality >= 6) return 'Good'
    return 'Fair'
  }

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Apple className="w-6 h-6 text-green-400" />
          Nutrition Dashboard
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveView('overview')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeView === 'overview'
                ? 'bg-gradient-to-r from-red-500/20 to-pink-500/20 text-white border border-red-500/30'
                : 'bg-slate-800/50 text-gray-400 hover:text-white border border-slate-700'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveView('macros')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeView === 'macros'
                ? 'bg-gradient-to-r from-red-500/20 to-pink-500/20 text-white border border-red-500/30'
                : 'bg-slate-800/50 text-gray-400 hover:text-white border border-slate-700'
            }`}
          >
            Macros
          </button>
        </div>
      </div>

      {activeView === 'overview' ? (
        <div className="space-y-6">
          {/* Calorie Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-400" />
                <span className="font-semibold">Daily Calories</span>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">
                  {currentCalories.toLocaleString()} <span className="text-gray-500 text-sm">/ {goals.calories.toLocaleString()}</span>
                </p>
                <p className="text-xs text-gray-500">
                  {goals.calories - currentCalories} remaining
                </p>
              </div>
            </div>
            <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-500"
                style={{ width: `${calorieProgress}%` }}
              />
            </div>
          </div>

          {/* Hydration */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Droplets className="w-5 h-5 text-blue-400" />
                <span className="font-semibold">Hydration</span>
              </div>
              <button
                onClick={onLogWater}
                className="px-2 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 rounded text-xs font-medium transition-colors flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                Log Water
              </button>
            </div>
            <div className="flex gap-2">
              {Array.from({ length: goals.hydration }).map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-12 rounded-lg border-2 transition-all duration-300 ${
                    i < currentHydration
                      ? 'bg-gradient-to-b from-blue-400/30 to-blue-500/30 border-blue-500/50'
                      : 'bg-slate-800/30 border-slate-700'
                  }`}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <Droplets
                      className={`w-4 h-4 ${
                        i < currentHydration ? 'text-blue-400' : 'text-gray-600'
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              {currentHydration} / {goals.hydration} cups ({hydrationProgress.toFixed(0)}%)
            </p>
          </div>

          {/* Meal Quality */}
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Today&apos;s Meal Quality</p>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  <span className={`text-2xl font-bold ${getQualityColor(mealQuality)}`}>
                    {mealQuality}/10
                  </span>
                  <span className={`text-sm font-semibold ${getQualityColor(mealQuality)}`}>
                    {getQualityLabel(mealQuality)}
                  </span>
                </div>
              </div>
              {onLogMeal && (
                <button
                  onClick={onLogMeal}
                  className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Log Meal
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Protein */}
          <div className={`bg-gradient-to-br ${macroColors.protein.from}/10 ${macroColors.protein.to}/10 border ${macroColors.protein.border} rounded-xl p-4`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Target className={`w-5 h-5 ${macroColors.protein.text}`} />
                <span className="font-semibold">Protein</span>
              </div>
              <div className="text-right">
                <p className={`font-bold text-lg ${macroColors.protein.text}`}>
                  {currentMacros.protein}g <span className="text-gray-500 text-sm">/ {goals.protein}g</span>
                </p>
                <p className="text-xs text-gray-500">{goals.protein - currentMacros.protein}g remaining</p>
              </div>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${macroColors.protein.from} ${macroColors.protein.to} transition-all duration-500`}
                style={{ width: `${proteinProgress}%` }}
              />
            </div>
          </div>

          {/* Carbs */}
          <div className={`bg-gradient-to-br ${macroColors.carbs.from}/10 ${macroColors.carbs.to}/10 border ${macroColors.carbs.border} rounded-xl p-4`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Target className={`w-5 h-5 ${macroColors.carbs.text}`} />
                <span className="font-semibold">Carbohydrates</span>
              </div>
              <div className="text-right">
                <p className={`font-bold text-lg ${macroColors.carbs.text}`}>
                  {currentMacros.carbs}g <span className="text-gray-500 text-sm">/ {goals.carbs}g</span>
                </p>
                <p className="text-xs text-gray-500">{goals.carbs - currentMacros.carbs}g remaining</p>
              </div>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${macroColors.carbs.from} ${macroColors.carbs.to} transition-all duration-500`}
                style={{ width: `${carbsProgress}%` }}
              />
            </div>
          </div>

          {/* Fats */}
          <div className={`bg-gradient-to-br ${macroColors.fats.from}/10 ${macroColors.fats.to}/10 border ${macroColors.fats.border} rounded-xl p-4`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Target className={`w-5 h-5 ${macroColors.fats.text}`} />
                <span className="font-semibold">Fats</span>
              </div>
              <div className="text-right">
                <p className={`font-bold text-lg ${macroColors.fats.text}`}>
                  {currentMacros.fats}g <span className="text-gray-500 text-sm">/ {goals.fats}g</span>
                </p>
                <p className="text-xs text-gray-500">{goals.fats - currentMacros.fats}g remaining</p>
              </div>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${macroColors.fats.from} ${macroColors.fats.to} transition-all duration-500`}
                style={{ width: `${fatsProgress}%` }}
              />
            </div>
          </div>

          {/* Macro Distribution Visualization */}
          <div className="bg-slate-800/50 rounded-xl p-4 mt-6">
            <p className="text-sm font-semibold text-gray-400 mb-3">Macro Distribution</p>
            <div className="flex h-4 rounded-full overflow-hidden">
              <div
                className={`bg-gradient-to-r ${macroColors.protein.from} ${macroColors.protein.to} transition-all duration-500`}
                style={{ width: `${(currentMacros.protein / (currentMacros.protein + currentMacros.carbs + currentMacros.fats)) * 100}%` }}
              />
              <div
                className={`bg-gradient-to-r ${macroColors.carbs.from} ${macroColors.carbs.to} transition-all duration-500`}
                style={{ width: `${(currentMacros.carbs / (currentMacros.protein + currentMacros.carbs + currentMacros.fats)) * 100}%` }}
              />
              <div
                className={`bg-gradient-to-r ${macroColors.fats.from} ${macroColors.fats.to} transition-all duration-500`}
                style={{ width: `${(currentMacros.fats / (currentMacros.protein + currentMacros.carbs + currentMacros.fats)) * 100}%` }}
              />
            </div>
            <div className="flex justify-between mt-3 text-xs">
              <div className="flex items-center gap-1">
                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${macroColors.protein.from} ${macroColors.protein.to}`} />
                <span className="text-gray-400">Protein</span>
              </div>
              <div className="flex items-center gap-1">
                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${macroColors.carbs.from} ${macroColors.carbs.to}`} />
                <span className="text-gray-400">Carbs</span>
              </div>
              <div className="flex items-center gap-1">
                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${macroColors.fats.from} ${macroColors.fats.to}`} />
                <span className="text-gray-400">Fats</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
