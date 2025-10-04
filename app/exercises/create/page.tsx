'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/toast'

export default function CreateExercisePage() {
  const router = useRouter()
  const { toast } = useToast()

  const [name, setName] = useState('')
  const [category, setCategory] = useState<'compound' | 'isolation' | 'accessory'>('compound')
  const [muscleGroup, setMuscleGroup] = useState<'push' | 'pull' | 'legs' | 'core'>('push')
  const [equipment, setEquipment] = useState('')
  const [description, setDescription] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [customInstructions, setCustomInstructions] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast('error', 'Exercise name is required')
      return
    }

    setSaving(true)
    try {
      const res = await fetch('/api/custom-exercises', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          category,
          muscleGroup,
          equipment: equipment.trim() || null,
          description: description.trim() || null,
          videoUrl: videoUrl.trim() || null,
          customInstructions: customInstructions.trim() || null,
          isPublic,
        }),
      })

      if (res.ok) {
        toast('success', 'Custom exercise created!')
        router.push('/exercises')
      } else {
        toast('error', 'Failed to create exercise')
      }
    } catch (error) {
      toast('error', 'Failed to create exercise')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-astral-dark text-white">
      <header className="bg-astral-gray border-b border-gray-800 p-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/exercises" className="text-gray-400 hover:text-white mb-2 inline-block">
            ← Back to Exercises
          </Link>
          <h1 className="text-3xl font-bold mb-2">Create Custom Exercise</h1>
          <p className="text-gray-400">Add your own exercise to the library</p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-astral-gray border border-gray-800 rounded-xl p-6 space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Exercise Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Archer Push-ups"
              className="w-full px-4 py-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-astral-blue outline-none"
            />
          </div>

          {/* Category & Muscle Group */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-4 py-3 bg-gray-700 rounded-lg"
              >
                <option value="compound">Compound</option>
                <option value="isolation">Isolation</option>
                <option value="accessory">Accessory</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Muscle Group *
              </label>
              <select
                value={muscleGroup}
                onChange={(e) => setMuscleGroup(e.target.value as any)}
                className="w-full px-4 py-3 bg-gray-700 rounded-lg"
              >
                <option value="push">Push (Chest, Shoulders, Triceps)</option>
                <option value="pull">Pull (Back, Biceps)</option>
                <option value="legs">Legs (Quads, Hamstrings, Glutes)</option>
                <option value="core">Core (Abs, Obliques)</option>
              </select>
            </div>
          </div>

          {/* Equipment */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Equipment
            </label>
            <input
              type="text"
              value={equipment}
              onChange={(e) => setEquipment(e.target.value)}
              placeholder="e.g., Barbell, Dumbbells, Bodyweight"
              className="w-full px-4 py-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-astral-blue outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the exercise..."
              className="w-full px-4 py-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-astral-blue outline-none h-24 resize-none"
            />
          </div>

          {/* Custom Instructions */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Custom Form/Technique Instructions
            </label>
            <textarea
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
              placeholder="Your personal cues and tips for this exercise..."
              className="w-full px-4 py-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-astral-blue outline-none h-32 resize-none"
            />
          </div>

          {/* Video URL */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Video URL (Optional)
            </label>
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://youtube.com/..."
              className="w-full px-4 py-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-astral-blue outline-none"
            />
          </div>

          {/* Public Toggle */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isPublic"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="w-5 h-5"
            />
            <label htmlFor="isPublic" className="text-gray-300">
              Make this exercise public (visible to other users)
            </label>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={saving || !name.trim()}
            className="w-full py-4 bg-gradient-to-r from-astral-blue to-astral-purple rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {saving ? 'Creating...' : 'Create Exercise'}
          </button>
        </div>

        {/* Tips */}
        <div className="mt-6 bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-700/30 rounded-xl p-6">
          <h4 className="text-sm font-semibold text-gray-400 mb-3">💡 Tips for Custom Exercises</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>• Be specific with the name (include variation details)</li>
            <li>• Choose the primary muscle group worked</li>
            <li>• Add your personal cues that help YOU perform it correctly</li>
            <li>• Include any equipment substitutions you use</li>
            <li>• Make it public if you want to share with the community</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
