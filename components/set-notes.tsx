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
        className="w-full py-2 text-sm text-neutral-400 hover:text-amber-400 border border-dashed border-neutral-700 hover:border-amber-700/50 transition-all uppercase tracking-wider font-bold"
      >
        + Add notes
      </button>
    )
  }

  if (!isEditing) {
    return (
      <div className="relative group">
        <div className="p-3 bg-amber-950/50 border-2 border-amber-800/50 text-sm text-neutral-300">
          {notes}
        </div>
        <button
          onClick={() => setIsEditing(true)}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 px-2 py-1 bg-neutral-900 hover:bg-neutral-800 border-2 border-neutral-700 text-xs text-neutral-400 hover:text-white uppercase tracking-wider font-bold transition-all"
        >
          Edit
        </button>
        {isSaved && (
          <div className="absolute -top-8 right-0 px-3 py-1 bg-amber-950/50 border-2 border-amber-700 text-white text-xs font-bold uppercase tracking-wider shadow-lg animate-slide-in-right">
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
        className="w-full p-3 bg-neutral-900 border-2 border-amber-800/50 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-600 resize-none"
        rows={3}
        autoFocus
      />
      <div className="flex gap-2">
        <button
          onClick={handleSave}
          className="flex-1 py-2 bg-amber-950/90 hover:bg-amber-900 border-2 border-amber-700 text-white text-sm font-black uppercase tracking-wider transition-all"
        >
          SAVE
        </button>
        <button
          onClick={handleCancel}
          className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 border-2 border-neutral-600 text-white text-sm font-black uppercase tracking-wider transition-all"
        >
          CANCEL
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
      <div className="text-xs text-neutral-400 mb-2 uppercase tracking-wider font-bold">Quick notes:</div>
      <div className="flex flex-wrap gap-2">
        {displayTemplates.map((template, index) => (
          <button
            key={index}
            onClick={() => onSelect(template)}
            className="px-3 py-1 bg-amber-950/20 hover:bg-amber-950/30 text-amber-400 text-xs font-black uppercase tracking-wider transition-all border-2 border-amber-700/30"
          >
            {template}
          </button>
        ))}
        <button
          onClick={() => setShowAll(!showAll)}
          className="px-3 py-1 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white text-xs font-black uppercase tracking-wider transition-all border-2 border-neutral-800"
        >
          {showAll ? 'Show less' : `+${NOTE_TEMPLATES.length - 6} more`}
        </button>
      </div>
    </div>
  )
}
