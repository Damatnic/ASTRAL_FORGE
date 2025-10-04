'use client'

import { useState } from 'react'
import { useToast } from '@/components/toast'

interface WorkoutNotesProps {
  sessionId: string
  onSave?: () => void
}

export function WorkoutNotes({ sessionId, onSave }: WorkoutNotesProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()
  
  const [notes, setNotes] = useState({
    content: '',
    energyLevel: 7,
    sleepQuality: 7,
    stress: 5,
    nutrition: '',
  })

  const handleSave = async () => {
    setSaving(true)
    
    try {
      const res = await fetch(`/api/sessions/${sessionId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notes),
      })

      if (res.ok) {
        toast('success', 'Notes saved successfully!')
        setIsOpen(false)
        onSave?.()
      } else {
        toast('error', 'Failed to save notes')
      }
    } catch (error) {
      console.error('Error saving notes:', error)
      toast('error', 'Failed to save notes')
    } finally {
      setSaving(false)
    }
  }

  const getEnergyLabel = (level: number) => {
    if (level <= 3) return 'Low'
    if (level <= 6) return 'Moderate'
    if (level <= 8) return 'Good'
    return 'Excellent'
  }

  const getEnergyColor = (level: number) => {
    if (level <= 3) return 'text-red-400'
    if (level <= 6) return 'text-yellow-400'
    if (level <= 8) return 'text-green-400'
    return 'text-astral-blue'
  }

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-medium transition-colors"
      >
        📝 {isOpen ? 'Hide Notes' : 'Add Workout Notes'}
      </button>

      {/* Notes Form */}
      {isOpen && (
        <div className="bg-astral-gray border border-gray-800 rounded-xl p-6 space-y-4 animate-slide-up">
          <h3 className="text-lg font-semibold mb-4">How was your workout?</h3>

          {/* Energy Level */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Energy Level: <span className={getEnergyColor(notes.energyLevel)}>
                {notes.energyLevel}/10 ({getEnergyLabel(notes.energyLevel)})
              </span>
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                <button
                  key={level}
                  onClick={() => setNotes(prev => ({ ...prev, energyLevel: level }))}
                  className={`flex-1 py-2 rounded-lg transition-all ${
                    notes.energyLevel === level
                      ? 'bg-gradient-to-r from-astral-blue to-astral-purple'
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Sleep Quality */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Last Night's Sleep Quality: {notes.sleepQuality}/10
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                <button
                  key={level}
                  onClick={() => setNotes(prev => ({ ...prev, sleepQuality: level }))}
                  className={`flex-1 py-2 rounded-lg transition-all ${
                    notes.sleepQuality === level
                      ? 'bg-gradient-to-r from-astral-blue to-astral-purple'
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Stress Level */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Stress Level: {notes.stress}/10
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                <button
                  key={level}
                  onClick={() => setNotes(prev => ({ ...prev, stress: level }))}
                  className={`flex-1 py-2 rounded-lg transition-all ${
                    notes.stress === level
                      ? level <= 3 ? 'bg-green-600' : level <= 6 ? 'bg-yellow-600' : 'bg-red-600'
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">1 = No stress, 10 = Very stressed</p>
          </div>

          {/* Pre-Workout Nutrition */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Pre-Workout Nutrition
            </label>
            <input
              type="text"
              value={notes.nutrition}
              onChange={(e) => setNotes(prev => ({ ...prev, nutrition: e.target.value }))}
              placeholder="What did you eat before the workout?"
              className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-astral-blue outline-none"
            />
          </div>

          {/* General Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Notes & Observations
            </label>
            <textarea
              value={notes.content}
              onChange={(e) => setNotes(prev => ({ ...prev, content: e.target.value }))}
              placeholder="How did you feel? Any pain or discomfort? Form issues? Victories?"
              className="w-full px-4 py-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-astral-blue outline-none h-32 resize-none"
            />
          </div>

          {/* Quick Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Quick Tags (click to add)
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                '💪 Felt Strong',
                '😴 Tired',
                '🔥 Great Workout',
                '😓 Struggled',
                '🎯 Hit PRs',
                '🤕 Minor Pain',
                '⏰ Rushed',
                '😊 Good Mood',
              ].map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    setNotes(prev => ({
                      ...prev,
                      content: prev.content ? `${prev.content} ${tag}` : tag
                    }))
                  }}
                  className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-3 bg-gradient-to-r from-astral-blue to-astral-purple rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Notes'}
          </button>
        </div>
      )}
    </>
  )
}
