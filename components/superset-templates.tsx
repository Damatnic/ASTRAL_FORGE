'use client'

import { useState } from 'react'
import { BookOpen, Download, Star } from 'lucide-react'

export interface SupersetTemplate {
  id: string
  name: string
  exercises: string[]
  category: 'chest' | 'back' | 'legs' | 'arms' | 'shoulders' | 'full-body'
  restTime: number
  isFavorite: boolean
}

interface SupersetTemplatesProps {
  isOpen: boolean
  onClose: () => void
  onApplyTemplate: (exercises: string[]) => void
}

export function SupersetTemplates({
  isOpen,
  onClose,
  onApplyTemplate
}: SupersetTemplatesProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // Built-in superset templates
  const builtInTemplates: SupersetTemplate[] = [
    {
      id: 'chest-tri-1',
      name: 'Chest Tri Superset',
      exercises: ['Bench Press', 'Dumbbell Flyes', 'Tricep Extension'],
      category: 'chest',
      restTime: 120,
      isFavorite: true
    },
    {
      id: 'back-bi-1',
      name: 'Back Bi Superset',
      exercises: ['Pull-ups', 'Barbell Row', 'Dumbbell Curl'],
      category: 'back',
      restTime: 120,
      isFavorite: true
    },
    {
      id: 'leg-power',
      name: 'Leg Power Superset',
      exercises: ['Squat', 'Leg Press', 'Romanian Deadlift'],
      category: 'legs',
      restTime: 150,
      isFavorite: false
    },
    {
      id: 'shoulder-pump',
      name: 'Shoulder Pump',
      exercises: ['Overhead Press', 'Lateral Raise', 'Front Raise'],
      category: 'shoulders',
      restTime: 90,
      isFavorite: true
    },
    {
      id: 'arm-blaster',
      name: 'Arm Blaster',
      exercises: ['Barbell Curl', 'Skull Crusher', 'Hammer Curl'],
      category: 'arms',
      restTime: 90,
      isFavorite: false
    },
    {
      id: 'upper-body',
      name: 'Upper Body Circuit',
      exercises: ['Bench Press', 'Pull-ups', 'Overhead Press', 'Barbell Row'],
      category: 'full-body',
      restTime: 180,
      isFavorite: false
    },
    {
      id: 'push-day',
      name: 'Push Day Superset',
      exercises: ['Bench Press', 'Overhead Press', 'Tricep Dips'],
      category: 'chest',
      restTime: 120,
      isFavorite: false
    },
    {
      id: 'pull-day',
      name: 'Pull Day Superset',
      exercises: ['Deadlift', 'Pull-ups', 'Face Pulls'],
      category: 'back',
      restTime: 120,
      isFavorite: false
    }
  ]

  const categories = [
    { id: 'all', label: 'All Templates', icon: '🏋️' },
    { id: 'chest', label: 'Chest', icon: '💪' },
    { id: 'back', label: 'Back', icon: '🦾' },
    { id: 'legs', label: 'Legs', icon: '🦵' },
    { id: 'arms', label: 'Arms', icon: '💪' },
    { id: 'shoulders', label: 'Shoulders', icon: '🏔️' },
    { id: 'full-body', label: 'Full Body', icon: '🔥' }
  ]

  const filteredTemplates =
    selectedCategory === 'all'
      ? builtInTemplates
      : builtInTemplates.filter((t) => t.category === selectedCategory)

  const handleApplyTemplate = (template: SupersetTemplate) => {
    onApplyTemplate(template.exercises)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-900 border-2 border-amber-700/30 max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl shadow-amber-500/20">
        {/* Header */}
        <div className="bg-amber-950/30 border-b-2 border-amber-700/30 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-amber-950/50 border-2 border-amber-700 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white uppercase tracking-wider">Superset Templates</h2>
                <p className="text-sm text-neutral-400 uppercase tracking-wider font-bold">Quick load proven superset combinations</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-neutral-900 border-2 border-neutral-800 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-all flex items-center justify-center"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="border-b-2 border-neutral-800 p-4 bg-neutral-950">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 font-black whitespace-nowrap transition-all flex items-center gap-2 uppercase tracking-wider ${
                  selectedCategory === category.id
                    ? 'bg-amber-950/50 border-2 border-amber-700 text-amber-400 shadow-lg shadow-amber-500/50'
                    : 'bg-neutral-900 border-2 border-neutral-800 text-neutral-400 hover:bg-neutral-800'
                }`}
              >
                <span>{category.icon}</span>
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-280px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="bg-neutral-900 border-2 border-neutral-800 hover:border-amber-700/50 p-4 transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-white group-hover:text-amber-400 transition-colors uppercase tracking-wider">
                      {template.name}
                    </h3>
                    {template.isFavorite && (
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    )}
                  </div>
                  <span className="px-2 py-1 bg-amber-950/30 border-2 border-amber-700 text-amber-400 text-xs font-black uppercase tracking-wider">
                    {template.exercises.length} exercises
                  </span>
                </div>

                {/* Exercise List */}
                <div className="space-y-2 mb-4">
                  {template.exercises.map((exercise, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-sm text-neutral-300"
                    >
                      <span className="w-6 h-6 bg-amber-950/50 border-2 border-amber-700 flex items-center justify-center text-amber-400 text-xs font-black">
                        {index + 1}
                      </span>
                      {exercise}
                    </div>
                  ))}
                </div>

                {/* Rest Time */}
                <div className="flex items-center justify-between text-sm text-neutral-400 mb-4">
                  <span className="uppercase tracking-wider font-bold">Rest Time:</span>
                  <span className="font-black text-amber-400 uppercase tracking-wider">{template.restTime}s</span>
                </div>

                {/* Apply Button */}
                <button
                  onClick={() => handleApplyTemplate(template)}
                  className="w-full px-4 py-2 bg-amber-950/50 border-2 border-amber-700 hover:bg-amber-900/50 text-amber-400 font-black transition-all shadow-lg shadow-amber-500/50 flex items-center justify-center gap-2 uppercase tracking-wider"
                >
                  <Download className="w-4 h-4" />
                  Load Template
                </button>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <p className="text-neutral-400 mb-2 uppercase tracking-wider font-bold">No templates in this category yet</p>
              <p className="text-sm text-neutral-500 uppercase tracking-wider font-bold">Try selecting a different category</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t-2 border-neutral-800 p-4 bg-neutral-950">
          <div className="flex items-center justify-between text-sm text-neutral-400">
            <span className="uppercase tracking-wider font-bold">💡 Tip: Create your own templates by grouping exercises in your battle</span>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-neutral-900 border-2 border-neutral-800 hover:bg-neutral-800 text-neutral-400 hover:text-white font-black transition-all uppercase tracking-wider"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
