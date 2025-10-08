'use client'

import { useState } from 'react'
import { Save, Trash2, Star, Plus, X, Edit2 } from 'lucide-react'

export interface CustomTemplate {
  id: string
  name: string
  exercises: string[]
  category: 'chest' | 'back' | 'legs' | 'arms' | 'shoulders' | 'full-body' | 'custom'
  restTime: number
  isFavorite: boolean
  createdAt: number
  usageCount: number
}

interface CustomTemplateCreatorProps {
  isOpen: boolean
  onClose: () => void
  currentExercises: { id: string; name: string }[]
  onSaveTemplate: (template: Omit<CustomTemplate, 'id' | 'createdAt' | 'usageCount'>) => void
  existingTemplates: CustomTemplate[]
  onDeleteTemplate: (templateId: string) => void
  onToggleFavorite: (templateId: string) => void
}

export function CustomTemplateCreator({
  isOpen,
  onClose,
  currentExercises,
  onSaveTemplate,
  existingTemplates,
  onDeleteTemplate,
  onToggleFavorite
}: CustomTemplateCreatorProps) {
  const [templateName, setTemplateName] = useState('')
  const [selectedExercises, setSelectedExercises] = useState<string[]>([])
  const [category, setCategory] = useState<CustomTemplate['category']>('custom')
  const [restTime, setRestTime] = useState(120)
  const [isFavorite, setIsFavorite] = useState(false)
  const [view, setView] = useState<'create' | 'manage'>('create')
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null)

  const categories = [
    { id: 'chest' as const, label: 'Chest', icon: '💪' },
    { id: 'back' as const, label: 'Back', icon: '🦾' },
    { id: 'legs' as const, label: 'Legs', icon: '🦵' },
    { id: 'arms' as const, label: 'Arms', icon: '💪' },
    { id: 'shoulders' as const, label: 'Shoulders', icon: '🏔️' },
    { id: 'full-body' as const, label: 'Full Body', icon: '🔥' },
    { id: 'custom' as const, label: 'Custom', icon: '⚙️' }
  ]

  const toggleExerciseSelection = (exerciseName: string) => {
    setSelectedExercises(prev =>
      prev.includes(exerciseName)
        ? prev.filter(e => e !== exerciseName)
        : [...prev, exerciseName]
    )
  }

  const handleSaveTemplate = () => {
    if (!templateName.trim() || selectedExercises.length < 2) {
      alert('Please enter a template name and select at least 2 exercises')
      return
    }

    onSaveTemplate({
      name: templateName,
      exercises: selectedExercises,
      category,
      restTime,
      isFavorite
    })

    // Reset form
    setTemplateName('')
    setSelectedExercises([])
    setCategory('custom')
    setRestTime(120)
    setIsFavorite(false)
    setView('manage')
  }

  const handleEditTemplate = (template: CustomTemplate) => {
    setEditingTemplate(template.id)
    setTemplateName(template.name)
    setSelectedExercises(template.exercises)
    setCategory(template.category)
    setRestTime(template.restTime)
    setIsFavorite(template.isFavorite)
    setView('create')
  }

  const handleUpdateTemplate = () => {
    if (!editingTemplate || !templateName.trim() || selectedExercises.length < 2) {
      alert('Please enter a template name and select at least 2 exercises')
      return
    }

    // Delete old and create new (simpler than update logic)
    onDeleteTemplate(editingTemplate)
    onSaveTemplate({
      name: templateName,
      exercises: selectedExercises,
      category,
      restTime,
      isFavorite
    })

    // Reset form
    setEditingTemplate(null)
    setTemplateName('')
    setSelectedExercises([])
    setCategory('custom')
    setRestTime(120)
    setIsFavorite(false)
    setView('manage')
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
                {view === 'create' ? <Plus className="w-6 h-6 text-white" /> : <Edit2 className="w-6 h-6 text-white" />}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {view === 'create' ? 'Create Template' : 'Manage Templates'}
                </h2>
                <p className="text-sm text-slate-400">
                  {view === 'create' ? 'Save your custom superset combinations' : `${existingTemplates.length} templates saved`}
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
            <button
              onClick={() => setView('manage')}
              className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
                view === 'manage'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Edit2 className="w-4 h-4 inline-block mr-2" />
              Manage ({existingTemplates.length})
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-280px)]">
          {view === 'create' ? (
            <div className="space-y-6">
              {/* Template Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-400 mb-2">
                  Template Name *
                </label>
                <input
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="e.g., My Chest Day Superset"
                  className="w-full px-4 py-3 bg-slate-800 border-2 border-slate-700 focus:border-purple-500 rounded-lg text-white outline-none transition-all"
                />
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
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <span>{cat.icon}</span>
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rest Time */}
              <div>
                <label className="block text-sm font-semibold text-slate-400 mb-2">
                  Rest Time (seconds)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="30"
                    max="300"
                    step="15"
                    value={restTime}
                    onChange={(e) => setRestTime(parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <div className="w-20 px-4 py-2 bg-slate-800 border-2 border-slate-700 rounded-lg text-center text-white font-bold">
                    {restTime}s
                  </div>
                </div>
              </div>

              {/* Exercise Selection */}
              <div>
                <label className="block text-sm font-semibold text-slate-400 mb-2">
                  Select Exercises * (min 2, {selectedExercises.length} selected)
                </label>
                {currentExercises.length === 0 ? (
                  <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 text-center">
                    <p className="text-slate-400 mb-2">No exercises in current workout</p>
                    <p className="text-sm text-slate-500">Add exercises to your workout first</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentExercises.map((exercise) => (
                      <button
                        key={exercise.id}
                        onClick={() => toggleExerciseSelection(exercise.name)}
                        className={`px-4 py-3 rounded-lg border-2 transition-all text-left ${
                          selectedExercises.includes(exercise.name)
                            ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500 text-white'
                            : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                              selectedExercises.includes(exercise.name)
                                ? 'border-purple-500 bg-purple-500'
                                : 'border-slate-600'
                            }`}
                          >
                            {selectedExercises.includes(exercise.name) && (
                              <svg className="w-3 h-3 text-white" viewBox="0 0 12 12">
                                <polyline points="1,6 4,9 11,2" fill="none" stroke="currentColor" strokeWidth="2" />
                              </svg>
                            )}
                          </div>
                          {exercise.name}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Favorite Toggle */}
              <div className="flex items-center justify-between p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
                <div>
                  <p className="font-semibold text-white">Mark as Favorite</p>
                  <p className="text-sm text-slate-400">Quick access to this template</p>
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
          ) : (
            /* Manage Templates View */
            <div className="space-y-4">
              {existingTemplates.length === 0 ? (
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-12 text-center">
                  <p className="text-slate-400 mb-4">No custom templates yet</p>
                  <button
                    onClick={() => setView('create')}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg font-semibold text-white transition-all"
                  >
                    Create Your First Template
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {existingTemplates
                    .sort((a, b) => b.createdAt - a.createdAt)
                    .map((template) => (
                      <div
                        key={template.id}
                        className="bg-slate-800/50 border-2 border-slate-700 hover:border-purple-500/50 rounded-xl p-4 transition-all"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                              {template.exercises.length}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-bold text-white">{template.name}</h3>
                                {template.isFavorite && (
                                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-xs text-slate-400">
                                <span className="px-2 py-1 rounded-full bg-purple-500/20 text-purple-400">
                                  {template.category}
                                </span>
                                <span>{template.restTime}s rest</span>
                                <span>•</span>
                                <span>Used {template.usageCount} times</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => onToggleFavorite(template.id)}
                              className="w-8 h-8 rounded-lg bg-slate-700 hover:bg-slate-600 flex items-center justify-center transition-all"
                            >
                              <Star
                                className={`w-4 h-4 ${
                                  template.isFavorite ? 'text-yellow-500 fill-yellow-500' : 'text-slate-400'
                                }`}
                              />
                            </button>
                            <button
                              onClick={() => handleEditTemplate(template)}
                              className="w-8 h-8 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 flex items-center justify-center transition-all"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Delete template "${template.name}"?`)) {
                                  onDeleteTemplate(template.id)
                                }
                              }}
                              className="w-8 h-8 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 flex items-center justify-center transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Exercise List */}
                        <div className="flex flex-wrap gap-2">
                          {template.exercises.map((exercise, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 rounded-full bg-slate-700 text-slate-300 text-sm"
                            >
                              {index + 1}. {exercise}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 p-6 bg-slate-900/50">
          {view === 'create' ? (
            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (editingTemplate) {
                    setEditingTemplate(null)
                    setTemplateName('')
                    setSelectedExercises([])
                    setCategory('custom')
                    setRestTime(120)
                    setIsFavorite(false)
                  }
                  onClose()
                }}
                className="flex-1 px-6 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold transition-all"
              >
                Cancel
              </button>
              <button
                onClick={editingTemplate ? handleUpdateTemplate : handleSaveTemplate}
                disabled={!templateName.trim() || selectedExercises.length < 2}
                className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-slate-700 disabled:to-slate-700 text-white font-semibold transition-all shadow-lg shadow-purple-500/50 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                {editingTemplate ? 'Update Template' : 'Save Template'}
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
