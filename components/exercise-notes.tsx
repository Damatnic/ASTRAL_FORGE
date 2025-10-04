'use client'

import { useState, useEffect } from 'react'
import { useToast } from './toast'

interface ExerciseNote {
  id: string
  content: string
  noteType: 'form_issue' | 'pain_point' | 'general'
  severity?: number
  createdAt: string
}

interface ExerciseNotesProps {
  exerciseId: string
}

export function ExerciseNotes({ exerciseId }: ExerciseNotesProps) {
  const { toast } = useToast()
  const [notes, setNotes] = useState<ExerciseNote[]>([])
  const [showForm, setShowForm] = useState(false)
  const [content, setContent] = useState('')
  const [noteType, setNoteType] = useState<'form_issue' | 'pain_point' | 'general'>('general')
  const [severity, setSeverity] = useState(5)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadNotes()
  }, [exerciseId])

  const loadNotes = async () => {
    try {
      const res = await fetch(`/api/exercises/${exerciseId}/notes`)
      if (res.ok) {
        const data = await res.json()
        setNotes(data)
      }
    } catch (error) {
      console.error('Failed to load notes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast('error', 'Please enter a note')
      return
    }

    setSaving(true)
    try {
      const res = await fetch(`/api/exercises/${exerciseId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: content.trim(),
          noteType,
          severity: noteType === 'pain_point' ? severity : null,
        }),
      })

      if (res.ok) {
        toast('success', 'Note saved')
        setContent('')
        setNoteType('general')
        setSeverity(5)
        setShowForm(false)
        loadNotes()
      } else {
        toast('error', 'Failed to save note')
      }
    } catch (error) {
      toast('error', 'Failed to save note')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (noteId: string) => {
    if (!confirm('Delete this note?')) return

    try {
      const res = await fetch(`/api/exercises/${exerciseId}/notes?noteId=${noteId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        toast('success', 'Note deleted')
        loadNotes()
      } else {
        toast('error', 'Failed to delete note')
      }
    } catch (error) {
      toast('error', 'Failed to delete note')
    }
  }

  const getNoteIcon = (type: string) => {
    switch (type) {
      case 'form_issue':
        return '⚠️'
      case 'pain_point':
        return '🤕'
      default:
        return '📝'
    }
  }

  const getNoteLabel = (type: string) => {
    switch (type) {
      case 'form_issue':
        return 'Form Issue'
      case 'pain_point':
        return 'Pain Point'
      default:
        return 'General Note'
    }
  }

  const getSeverityColor = (severity: number) => {
    if (severity >= 8) return 'text-red-400'
    if (severity >= 5) return 'text-yellow-400'
    return 'text-green-400'
  }

  if (loading) {
    return <div className="text-gray-400 text-center py-4">Loading notes...</div>
  }

  return (
    <div className="space-y-4">
      {/* Add Note Button */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-medium transition-colors"
      >
        {showForm ? '✕ Hide Form' : '📝 Add Exercise Note'}
      </button>

      {/* Add Note Form */}
      {showForm && (
        <div className="bg-astral-gray border border-gray-800 rounded-xl p-6 space-y-4 animate-slide-up">
          <h3 className="text-lg font-semibold">Add Note</h3>

          {/* Note Type */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Note Type</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setNoteType('general')}
                className={`py-2 rounded-lg transition-all ${
                  noteType === 'general'
                    ? 'bg-gradient-to-r from-astral-blue to-astral-purple'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                📝 General
              </button>
              <button
                onClick={() => setNoteType('form_issue')}
                className={`py-2 rounded-lg transition-all ${
                  noteType === 'form_issue'
                    ? 'bg-gradient-to-r from-astral-blue to-astral-purple'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                ⚠️ Form Issue
              </button>
              <button
                onClick={() => setNoteType('pain_point')}
                className={`py-2 rounded-lg transition-all ${
                  noteType === 'pain_point'
                    ? 'bg-gradient-to-r from-astral-blue to-astral-purple'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                🤕 Pain
              </button>
            </div>
          </div>

          {/* Severity (for pain points) */}
          {noteType === 'pain_point' && (
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Pain Severity: <span className={getSeverityColor(severity)}>{severity}/10</span>
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={severity}
                onChange={(e) => setSeverity(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Mild</span>
                <span>Moderate</span>
                <span>Severe</span>
              </div>
            </div>
          )}

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Details</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Describe the issue, pain location, or general observation..."
              className="w-full px-4 py-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-astral-blue outline-none h-32 resize-none"
            />
          </div>

          {/* Quick Tags */}
          {noteType === 'form_issue' && (
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Common Issues</label>
              <div className="flex flex-wrap gap-2">
                {['Rounding back', 'Knees caving', 'Uneven bar', 'Too much arch', 'Incomplete ROM'].map(tag => (
                  <button
                    key={tag}
                    onClick={() => setContent(prev => prev ? `${prev}\n• ${tag}` : `• ${tag}`)}
                    className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors"
                  >
                    + {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {noteType === 'pain_point' && (
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Common Locations</label>
              <div className="flex flex-wrap gap-2">
                {['Lower back', 'Shoulders', 'Knees', 'Elbows', 'Wrists', 'Hip'].map(tag => (
                  <button
                    key={tag}
                    onClick={() => setContent(prev => prev ? `${prev}\n• ${tag}` : `• ${tag}`)}
                    className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors"
                  >
                    + {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={saving || !content.trim()}
            className="w-full py-3 bg-gradient-to-r from-astral-blue to-astral-purple rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Note'}
          </button>
        </div>
      )}

      {/* Notes List */}
      {notes.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <p>No notes yet</p>
          <p className="text-sm mt-2">Track form issues, pain points, or general observations</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notes.map((note) => (
            <div
              key={note.id}
              className="bg-gray-700/50 border border-gray-700 rounded-lg p-4"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{getNoteIcon(note.noteType)}</span>
                  <span className="text-sm font-medium text-gray-400">
                    {getNoteLabel(note.noteType)}
                  </span>
                  {note.noteType === 'pain_point' && note.severity && (
                    <span className={`text-sm font-bold ${getSeverityColor(note.severity)}`}>
                      {note.severity}/10
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="text-gray-500 hover:text-red-400 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <p className="text-gray-300 whitespace-pre-wrap">{note.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
