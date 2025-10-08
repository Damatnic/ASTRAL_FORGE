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
    if (level <= 3) return 'text-amber-400'
    if (level <= 6) return 'text-amber-400'
    if (level <= 8) return 'text-amber-400'
    return 'text-amber-400'
  }

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-3 bg-neutral-900 border-2 border-neutral-800 hover:bg-neutral-800 transition-colors font-bold uppercase tracking-wider"
      >
        📝 {isOpen ? 'Hide Notes' : 'Add Battle Notes'}
      </button>

      {/* Notes Form */}
      {isOpen && (
        <div className="bg-astral-gray border-2 border-neutral-800 p-6 space-y-4 animate-slide-up">
          <h3 className="text-lg font-black uppercase tracking-wider mb-4">How Was Your Battle?</h3>

          {/* Energy Level */}
          <div>
            <label className="block text-sm font-bold text-neutral-400 mb-2 uppercase tracking-wider">
              Energy Level: <span className={getEnergyColor(notes.energyLevel)}>
                {notes.energyLevel}/10 ({getEnergyLabel(notes.energyLevel)})
              </span>
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                <button
                  key={level}
                  onClick={() => setNotes(prev => ({ ...prev, energyLevel: level }))}
                  className={`flex-1 py-2 transition-all font-bold uppercase tracking-wider ${
                    notes.energyLevel === level
                      ? 'bg-amber-950/50 border-2 border-amber-700 text-amber-400'
                      : 'bg-neutral-900 border-2 border-neutral-800 hover:bg-neutral-800'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Sleep Quality */}
          <div>
            <label className="block text-sm font-bold text-neutral-400 mb-2 uppercase tracking-wider">
              Last Night&apos;s Sleep Quality: {notes.sleepQuality}/10
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                <button
                  key={level}
                  onClick={() => setNotes(prev => ({ ...prev, sleepQuality: level }))}
                  className={`flex-1 py-2 transition-all font-bold uppercase tracking-wider ${
                    notes.sleepQuality === level
                      ? 'bg-amber-950/50 border-2 border-amber-700 text-amber-400'
                      : 'bg-neutral-900 border-2 border-neutral-800 hover:bg-neutral-800'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Stress Level */}
          <div>
            <label className="block text-sm font-bold text-neutral-400 mb-2 uppercase tracking-wider">
              Stress Level: {notes.stress}/10
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                <button
                  key={level}
                  onClick={() => setNotes(prev => ({ ...prev, stress: level }))}
                  className={`flex-1 py-2 transition-all font-bold uppercase tracking-wider ${
                    notes.stress === level
                      ? level <= 3 ? 'bg-amber-950/50 border-2 border-amber-500 text-amber-400' : level <= 6 ? 'bg-amber-950/50 border-2 border-amber-600 text-amber-400' : 'bg-amber-950/50 border-2 border-amber-700 text-amber-400'
                      : 'bg-neutral-900 border-2 border-neutral-800 hover:bg-neutral-800'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
            <p className="text-xs text-neutral-500 mt-1 uppercase tracking-wider font-bold">1 = No stress, 10 = Very stressed</p>
          </div>

          {/* Pre-Workout Nutrition */}
          <div>
            <label className="block text-sm font-bold text-neutral-400 mb-2 uppercase tracking-wider">
              Pre-Battle Nutrition
            </label>
            <input
              type="text"
              value={notes.nutrition}
              onChange={(e) => setNotes(prev => ({ ...prev, nutrition: e.target.value }))}
              placeholder="What did you eat before the battle?"
              className="w-full px-4 py-2 bg-neutral-900 border-2 border-neutral-800 focus:ring-2 focus:ring-amber-700 outline-none"
            />
          </div>

          {/* General Notes */}
          <div>
            <label className="block text-sm font-bold text-neutral-400 mb-2 uppercase tracking-wider">
              Notes & Observations
            </label>
            <textarea
              value={notes.content}
              onChange={(e) => setNotes(prev => ({ ...prev, content: e.target.value }))}
              placeholder="How did you feel? Any pain or discomfort? Form issues? Victories?"
              className="w-full px-4 py-3 bg-neutral-900 border-2 border-neutral-800 focus:ring-2 focus:ring-amber-700 outline-none h-32 resize-none"
            />
          </div>

          {/* Quick Tags */}
          <div>
            <label className="block text-sm font-bold text-neutral-400 mb-2 uppercase tracking-wider">
              Quick Tags (click to add)
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                '💪 Felt Strong',
                '😴 Tired',
                '🔥 Great Battle',
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
                  className="px-3 py-1 bg-neutral-900 border-2 border-neutral-800 hover:bg-neutral-800 text-sm transition-colors font-bold uppercase tracking-wider"
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
            className="w-full py-3 bg-amber-950/50 hover:bg-amber-900/50 border-2 border-amber-700 font-black uppercase tracking-wider hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Battle Notes'}
          </button>
        </div>
      )}
    </>
  )
}

