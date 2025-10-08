'use client'

import { useState } from 'react'
import { Save, Trash2, Star, Plus, X, TrendingUp } from 'lucide-react'

export interface WeightPreset {
  id: string
  name: string
  weight: number
  exerciseName: string
  category: 'warmup' | 'working' | 'pr' | 'custom'
  isFavorite: boolean
  createdAt: number
  usageCount: number
  lastUsed: number | null
}

interface PersonalWeightPresetsProps {
  isOpen: boolean
  onClose: () => void
  onSavePreset: (preset: Omit<WeightPreset, 'id' | 'createdAt' | 'usageCount' | 'lastUsed'>) => void
  existingPresets: WeightPreset[]
  onDeletePreset: (presetId: string) => void
  onToggleFavorite: (presetId: string) => void
  onApplyPreset: (weight: number) => void
  currentExercise?: string
  currentWeight?: number
}

export function PersonalWeightPresets({
  isOpen,
  onClose,
  onSavePreset,
  existingPresets,
  onDeletePreset,
  onToggleFavorite,
  onApplyPreset,
  currentExercise,
  currentWeight
}: PersonalWeightPresetsProps) {
  const [view, setView] = useState<'list' | 'create'>('list')
  const [presetName, setPresetName] = useState('')
  const [weight, setWeight] = useState(currentWeight || 135)
  const [exerciseName, setExerciseName] = useState(currentExercise || '')
  const [category, setCategory] = useState<WeightPreset['category']>('working')
  const [isFavorite, setIsFavorite] = useState(false)
  const [filterCategory, setFilterCategory] = useState<'all' | WeightPreset['category']>('all')
  const [sortBy, setSortBy] = useState<'recent' | 'usage' | 'weight'>('recent')

  const categories = [
    { id: 'warmup' as const, label: 'Warmup', icon: '🔥', color: 'orange' },
    { id: 'working' as const, label: 'Working', icon: '💪', color: 'blue' },
    { id: 'pr' as const, label: 'PR', icon: '🏆', color: 'yellow' },
    { id: 'custom' as const, label: 'Custom', icon: '⚙️', color: 'purple' }
  ]

  const handleSavePreset = () => {
    if (!presetName.trim() || !exerciseName.trim()) {
      alert('Please enter a preset name and exercise name')
      return
    }

    onSavePreset({
      name: presetName,
      weight,
      exerciseName,
      category,
      isFavorite
    })

    // Reset form
    setPresetName('')
    setWeight(currentWeight || 135)
    setExerciseName(currentExercise || '')
    setCategory('working')
    setIsFavorite(false)
    setView('list')
  }

  const handleQuickSave = () => {
    if (!currentExercise || !currentWeight) {
      alert('No current weight to save')
      return
    }

    const presetName = `${currentExercise} - ${currentWeight} lbs`
    onSavePreset({
      name: presetName,
      weight: currentWeight,
      exerciseName: currentExercise,
      category: 'working',
      isFavorite: false
    })
  }

  const filteredPresets = existingPresets.filter(preset =>
    filterCategory === 'all' || preset.category === filterCategory
  )

  const sortedPresets = [...filteredPresets].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return (b.lastUsed || b.createdAt) - (a.lastUsed || a.createdAt)
      case 'usage':
        return b.usageCount - a.usageCount
      case 'weight':
        return b.weight - a.weight
      default:
        return 0
    }
  })

  const getCategoryColor = (cat: WeightPreset['category']) => {
    const colors = {
      warmup: 'orange',
      working: 'blue',
      pr: 'yellow',
      custom: 'purple'
    }
    return colors[cat]
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border-2 border-purple-500/30 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl shadow-purple-500/20">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 border-b border-purple-500/30 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Weight Presets</h2>
                <p className="text-sm text-slate-400">
                  {view === 'list' ? `${existingPresets.length} saved presets` : 'Create new preset'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* View Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setView('list')}
              className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
                view === 'list'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              My Presets ({existingPresets.length})
            </button>
            <button
              onClick={() => setView('create')}
              className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
                view === 'create'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Plus className="w-4 h-4 inline-block mr-2" />
              Create New
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-280px)]">
          {view === 'list' ? (
            <div className="space-y-4">
              {/* Quick Save Current Weight */}
              {currentExercise && currentWeight && (
                <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-2 border-green-500/30 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-white">Current Weight</p>
                      <p className="text-sm text-slate-400">
                        {currentExercise}: {currentWeight} lbs
                      </p>
                    </div>
                    <button
                      onClick={handleQuickSave}
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold transition-all shadow-lg flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Quick Save
                    </button>
                  </div>
                </div>
              )}

              {/* Filters */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilterCategory('all')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    filterCategory === 'all'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  All ({existingPresets.length})
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setFilterCategory(cat.id)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                      filterCategory === cat.id
                        ? `bg-gradient-to-r from-${cat.color}-500 to-${cat.color}-600 text-white`
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Sort Options */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-400">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 outline-none"
                >
                  <option value="recent">Recently Used</option>
                  <option value="usage">Most Used</option>
                  <option value="weight">Heaviest First</option>
                </select>
              </div>

              {/* Presets List */}
              {sortedPresets.length === 0 ? (
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-12 text-center">
                  <p className="text-slate-400 mb-4">
                    {filterCategory === 'all' ? 'No presets saved yet' : `No ${filterCategory} presets`}
                  </p>
                  <button
                    onClick={() => setView('create')}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg font-semibold text-white transition-all"
                  >
                    Create Your First Preset
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {sortedPresets.map((preset) => (
                    <div
                      key={preset.id}
                      className="bg-slate-800/50 border-2 border-slate-700 hover:border-purple-500/50 rounded-xl p-4 transition-all group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-white">{preset.name}</h3>
                            {preset.isFavorite && (
                              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            )}
                          </div>
                          <p className="text-sm text-slate-400">{preset.exerciseName}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onToggleFavorite(preset.id)}
                            className="w-8 h-8 rounded-lg bg-slate-700 hover:bg-slate-600 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center"
                          >
                            <Star
                              className={`w-4 h-4 ${
                                preset.isFavorite ? 'text-yellow-500 fill-yellow-500' : 'text-slate-400'
                              }`}
                            />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete preset "${preset.name}"?`)) {
                                onDeletePreset(preset.id)
                              }
                            }}
                            className="w-8 h-8 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Weight Display */}
                      <div className="mb-3">
                        <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                          {preset.weight} lbs
                        </div>
                      </div>

                      {/* Metadata */}
                      <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                        <span className={`px-2 py-1 rounded-full bg-${getCategoryColor(preset.category)}-500/20 text-${getCategoryColor(preset.category)}-400`}>
                          {preset.category}
                        </span>
                        <span>•</span>
                        <span>Used {preset.usageCount} times</span>
                      </div>

                      {/* Apply Button */}
                      <button
                        onClick={() => {
                          onApplyPreset(preset.weight)
                          onClose()
                        }}
                        className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold transition-all shadow-lg shadow-purple-500/50"
                      >
                        Apply {preset.weight} lbs
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Create Preset View */
            <div className="space-y-6">
              {/* Preset Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-400 mb-2">
                  Preset Name *
                </label>
                <input
                  type="text"
                  value={presetName}
                  onChange={(e) => setPresetName(e.target.value)}
                  placeholder="e.g., Bench Press Working Weight"
                  className="w-full px-4 py-3 bg-slate-800 border-2 border-slate-700 focus:border-purple-500 rounded-lg text-white outline-none transition-all"
                />
              </div>

              {/* Exercise Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-400 mb-2">
                  Exercise Name *
                </label>
                <input
                  type="text"
                  value={exerciseName}
                  onChange={(e) => setExerciseName(e.target.value)}
                  placeholder="e.g., Bench Press"
                  className="w-full px-4 py-3 bg-slate-800 border-2 border-slate-700 focus:border-purple-500 rounded-lg text-white outline-none transition-all"
                />
              </div>

              {/* Weight */}
              <div>
                <label className="block text-sm font-semibold text-slate-400 mb-2">
                  Weight (lbs)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                    step="2.5"
                    className="flex-1 px-4 py-3 bg-slate-800 border-2 border-slate-700 focus:border-purple-500 rounded-lg text-white text-2xl font-bold text-center outline-none transition-all"
                  />
                  <span className="text-2xl font-bold text-slate-400">lbs</span>
                </div>
              </div>

              {/* Category Selection */}
              <div>
                <label className="block text-sm font-semibold text-slate-400 mb-2">
                  Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setCategory(cat.id)}
                      className={`px-4 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                        category === cat.id
                          ? `bg-gradient-to-r from-${cat.color}-500 to-${cat.color}-600 text-white shadow-lg`
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <span>{cat.icon}</span>
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Favorite Toggle */}
              <div className="flex items-center justify-between p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
                <div>
                  <p className="font-semibold text-white">Mark as Favorite</p>
                  <p className="text-sm text-slate-400">Quick access to this preset</p>
                </div>
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`w-12 h-12 rounded-lg transition-all flex items-center justify-center ${
                    isFavorite
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                      : 'bg-slate-700 hover:bg-slate-600'
                  }`}
                >
                  <Star className={`w-6 h-6 ${isFavorite ? 'text-white fill-white' : 'text-slate-400'}`} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 p-6 bg-slate-900/50">
          {view === 'create' ? (
            <div className="flex gap-3">
              <button
                onClick={() => setView('list')}
                className="flex-1 px-6 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePreset}
                disabled={!presetName.trim() || !exerciseName.trim()}
                className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-slate-700 disabled:to-slate-700 text-white font-semibold transition-all shadow-lg shadow-purple-500/50 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                Save Preset
              </button>
            </div>
          ) : (
            <button
              onClick={onClose}
              className="w-full px-6 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold transition-all"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
