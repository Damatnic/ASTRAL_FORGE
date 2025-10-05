'use client'

import { useState } from 'react'

interface SetNotesProps {
  initialNotes?: string
  onSave: (notes: string) => void
  placeholder?: string
}

export function SetNotes({ initialNotes = '', onSave, placeholder = 'Add notes for this set...' }: SetNotesProps) {
  const [notes, setNotes] = useState(initialNotes)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  const handleSave = () => {
    onSave(notes)
    setIsEditing(false)
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2000)
  }

  const handleCancel = () => {
    setNotes(initialNotes)
    setIsEditing(false)
  }

  if (!isEditing && !notes) {
    return (
      <button
        onClick={() => setIsEditing(true)}
        className="w-full py-2 text-sm text-gray-400 hover:text-purple-400 border border-dashed border-gray-700 hover:border-purple-500/50 rounded-lg transition-all"
      >
        + Add notes
      </button>
    )
  }

  if (!isEditing) {
    return (
      <div className="relative group">
        <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg text-sm text-gray-300">
          {notes}
        </div>
        <button
          onClick={() => setIsEditing(true)}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 px-2 py-1 bg-gray-800 hover:bg-gray-700 text-xs text-gray-400 hover:text-white rounded transition-all"
        >
          Edit
        </button>
        {isSaved && (
          <div className="absolute -top-8 right-0 px-3 py-1 bg-green-600 text-white text-xs font-semibold rounded-lg shadow-lg animate-slide-in-right">
            ✓ Saved
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder={placeholder}
        className="w-full p-3 bg-gray-900 border border-purple-500/30 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
        rows={3}
        autoFocus
      />
      <div className="flex gap-2">
        <button
          onClick={handleSave}
          className="flex-1 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 text-white text-sm font-semibold rounded-lg transition-all"
        >
          Save
        </button>
        <button
          onClick={handleCancel}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-semibold rounded-lg transition-all"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

// Quick note templates
const NOTE_TEMPLATES = [
  'Felt strong 💪',
  'Felt weak today',
  'Good form ✓',
  'Struggled with form',
  'Easy - increase weight',
  'Too heavy - decrease weight',
  'Perfect RPE',
  'Left some in the tank',
  'Went to failure',
  'Great pump 🔥',
  'Lower back tight',
  'Shoulder pain',
  'Knee discomfort',
  'Focus on tempo',
  'Focus on stretch',
  'Focus on squeeze',
]

interface QuickNotesProps {
  onSelect: (note: string) => void
}

export function QuickNotes({ onSelect }: QuickNotesProps) {
  const [showAll, setShowAll] = useState(false)
  
  const displayTemplates = showAll ? NOTE_TEMPLATES : NOTE_TEMPLATES.slice(0, 6)

  return (
    <div className="space-y-2">
      <div className="text-xs text-gray-400 mb-2">Quick notes:</div>
      <div className="flex flex-wrap gap-2">
        {displayTemplates.map((template, index) => (
          <button
            key={index}
            onClick={() => onSelect(template)}
            className="px-3 py-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 text-xs font-medium rounded-full transition-all"
          >
            {template}
          </button>
        ))}
        <button
          onClick={() => setShowAll(!showAll)}
          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-400 hover:text-white text-xs font-medium rounded-full transition-all"
        >
          {showAll ? 'Show less' : `+${NOTE_TEMPLATES.length - 6} more`}
        </button>
      </div>
    </div>
  )
}
