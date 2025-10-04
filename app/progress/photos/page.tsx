'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useToast } from '@/components/toast'

interface ProgressPhoto {
  id: string
  date: string
  photoUrl: string
  photoType: string
  weight?: number
  bodyFat?: number
  notes?: string
}

export default function ProgressPhotosPage() {
  const { toast } = useToast()
  const [photos, setPhotos] = useState<ProgressPhoto[]>([])
  const [loading, setLoading] = useState(true)
  const [showUpload, setShowUpload] = useState(false)
  const [compareMode, setCompareMode] = useState(false)
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([])

  // Form state
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [photoType, setPhotoType] = useState<'front' | 'back' | 'side'>('front')
  const [photoUrl, setPhotoUrl] = useState('')
  const [weight, setWeight] = useState('')
  const [bodyFat, setBodyFat] = useState('')
  const [notes, setNotes] = useState('')
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    loadPhotos()
  }, [])

  const loadPhotos = async () => {
    try {
      const res = await fetch('/api/progress/photos')
      if (res.ok) {
        const data = await res.json()
        setPhotos(data)
      }
    } catch (error) {
      console.error('Failed to load photos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async () => {
    if (!photoUrl.trim()) {
      toast('error', 'Please enter a photo URL')
      return
    }

    setUploading(true)
    try {
      const res = await fetch('/api/progress/photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date,
          photoUrl: photoUrl.trim(),
          photoType,
          weight: weight ? parseFloat(weight) : null,
          bodyFat: bodyFat ? parseFloat(bodyFat) : null,
          notes: notes.trim() || null,
        }),
      })

      if (res.ok) {
        toast('success', 'Photo added!')
        setPhotoUrl('')
        setWeight('')
        setBodyFat('')
        setNotes('')
        setShowUpload(false)
        loadPhotos()
      } else {
        toast('error', 'Failed to add photo')
      }
    } catch (error) {
      toast('error', 'Failed to add photo')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (photoId: string) => {
    if (!confirm('Delete this photo?')) return

    try {
      const res = await fetch(`/api/progress/photos?id=${photoId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        toast('success', 'Photo deleted')
        loadPhotos()
      } else {
        toast('error', 'Failed to delete photo')
      }
    } catch (error) {
      toast('error', 'Failed to delete photo')
    }
  }

  const togglePhotoSelection = (photoId: string) => {
    if (selectedPhotos.includes(photoId)) {
      setSelectedPhotos(selectedPhotos.filter(id => id !== photoId))
    } else if (selectedPhotos.length < 2) {
      setSelectedPhotos([...selectedPhotos, photoId])
    } else {
      setSelectedPhotos([selectedPhotos[1], photoId])
    }
  }

  const getPhotosByType = (type: string) => photos.filter(p => p.photoType === type)

  if (loading) {
    return (
      <div className="min-h-screen bg-astral-dark flex items-center justify-center">
        <div className="text-gray-400">Loading photos...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-astral-dark text-white">
      <header className="bg-astral-gray border-b border-gray-800 p-6">
        <div className="max-w-6xl mx-auto">
          <Link href="/progress" className="text-gray-400 hover:text-white mb-2 inline-block">
            ← Back to Progress
          </Link>
          <h1 className="text-3xl font-bold mb-2">Progress Photos</h1>
          <p className="text-gray-400">Track your transformation visually</p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => setShowUpload(!showUpload)}
            className="px-6 py-3 bg-gradient-to-r from-astral-blue to-astral-purple rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            {showUpload ? '✕ Cancel' : '📸 Add Photo'}
          </button>
          {photos.length >= 2 && (
            <button
              onClick={() => {
                setCompareMode(!compareMode)
                if (!compareMode) setSelectedPhotos([])
              }}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                compareMode
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              {compareMode ? '✓ Compare Selected' : '🔄 Compare Mode'}
            </button>
          )}
        </div>

        {/* Upload Form */}
        {showUpload && (
          <div className="bg-astral-gray border border-gray-800 rounded-xl p-6 space-y-4 animate-slide-up">
            <h3 className="text-lg font-semibold">Add Progress Photo</h3>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Photo Type</label>
              <div className="grid grid-cols-3 gap-2">
                {(['front', 'back', 'side'] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => setPhotoType(type)}
                    className={`py-2 rounded-lg transition-all capitalize ${
                      photoType === type
                        ? 'bg-gradient-to-r from-astral-blue to-astral-purple'
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Photo URL (use Imgur, Cloudinary, etc.)
              </label>
              <input
                type="url"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-4 py-2 bg-gray-700 rounded-lg"
              />
              <p className="text-xs text-gray-500 mt-1">
                💡 Upload to a free image host first, then paste the direct link here
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="Optional"
                  className="w-full px-4 py-2 bg-gray-700 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Body Fat %</label>
                <input
                  type="number"
                  step="0.1"
                  value={bodyFat}
                  onChange={(e) => setBodyFat(e.target.value)}
                  placeholder="Optional"
                  className="w-full px-4 py-2 bg-gray-700 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="How you're feeling, what's changed, etc."
                className="w-full px-4 py-3 bg-gray-700 rounded-lg h-24 resize-none"
              />
            </div>

            <button
              onClick={handleUpload}
              disabled={uploading || !photoUrl.trim()}
              className="w-full py-3 bg-gradient-to-r from-astral-blue to-astral-purple rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {uploading ? 'Adding...' : 'Add Photo'}
            </button>
          </div>
        )}

        {/* Comparison View */}
        {compareMode && selectedPhotos.length === 2 && (
          <div className="bg-astral-gray border border-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4">📊 Side-by-Side Comparison</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {selectedPhotos.map(photoId => {
                const photo = photos.find(p => p.id === photoId)
                if (!photo) return null

                return (
                  <div key={photoId} className="space-y-3">
                    <img
                      src={photo.photoUrl}
                      alt={`${photo.photoType} - ${photo.date}`}
                      className="w-full rounded-lg"
                    />
                    <div className="text-center">
                      <div className="font-semibold">{new Date(photo.date).toLocaleDateString()}</div>
                      {photo.weight && <div className="text-sm text-gray-400">{photo.weight}kg</div>}
                      {photo.bodyFat && <div className="text-sm text-gray-400">{photo.bodyFat}% BF</div>}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Comparison Stats */}
            {(() => {
              const photo1 = photos.find(p => p.id === selectedPhotos[0])
              const photo2 = photos.find(p => p.id === selectedPhotos[1])
              if (!photo1 || !photo2) return null

              const weightDiff = photo2.weight && photo1.weight ? photo2.weight - photo1.weight : null
              const bfDiff = photo2.bodyFat && photo1.bodyFat ? photo2.bodyFat - photo1.bodyFat : null
              const daysDiff = Math.abs(Math.round((new Date(photo2.date).getTime() - new Date(photo1.date).getTime()) / (1000 * 60 * 60 * 24)))

              return (
                <div className="mt-6 grid grid-cols-3 gap-4">
                  <div className="bg-gray-700/50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-400">{daysDiff}</div>
                    <div className="text-xs text-gray-400">Days Apart</div>
                  </div>
                  {weightDiff !== null && (
                    <div className="bg-gray-700/50 rounded-lg p-4 text-center">
                      <div className={`text-2xl font-bold ${weightDiff > 0 ? 'text-orange-400' : 'text-green-400'}`}>
                        {weightDiff > 0 ? '+' : ''}{weightDiff.toFixed(1)}kg
                      </div>
                      <div className="text-xs text-gray-400">Weight Change</div>
                    </div>
                  )}
                  {bfDiff !== null && (
                    <div className="bg-gray-700/50 rounded-lg p-4 text-center">
                      <div className={`text-2xl font-bold ${bfDiff > 0 ? 'text-orange-400' : 'text-green-400'}`}>
                        {bfDiff > 0 ? '+' : ''}{bfDiff.toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-400">Body Fat Change</div>
                    </div>
                  )}
                </div>
              )
            })()}
          </div>
        )}

        {/* Photo Gallery */}
        {photos.length === 0 ? (
          <div className="bg-astral-gray border border-gray-800 rounded-xl p-12 text-center">
            <div className="text-6xl mb-4">📸</div>
            <h3 className="text-xl font-bold mb-2">No Photos Yet</h3>
            <p className="text-gray-400 mb-6">
              Start tracking your transformation! Take photos every 2-4 weeks.
            </p>
            <button
              onClick={() => setShowUpload(true)}
              className="px-8 py-3 bg-gradient-to-r from-astral-blue to-astral-purple rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Add Your First Photo
            </button>
          </div>
        ) : (
          <>
            {['front', 'back', 'side'].map(type => {
              const typePhotos = getPhotosByType(type)
              if (typePhotos.length === 0) return null

              return (
                <div key={type} className="bg-astral-gray border border-gray-800 rounded-xl p-6">
                  <h3 className="text-xl font-semibold mb-4 capitalize">{type} View ({typePhotos.length})</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {typePhotos.map(photo => (
                      <div
                        key={photo.id}
                        className={`relative group cursor-pointer ${
                          compareMode && selectedPhotos.includes(photo.id)
                            ? 'ring-4 ring-green-500'
                            : ''
                        }`}
                        onClick={() => compareMode && togglePhotoSelection(photo.id)}
                      >
                        <img
                          src={photo.photoUrl}
                          alt={`${photo.photoType} - ${photo.date}`}
                          className="w-full aspect-[3/4] object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex flex-col items-center justify-center p-2 text-center">
                          <div className="text-sm font-semibold">
                            {new Date(photo.date).toLocaleDateString()}
                          </div>
                          {photo.weight && <div className="text-xs">{photo.weight}kg</div>}
                          {photo.bodyFat && <div className="text-xs">{photo.bodyFat}% BF</div>}
                          {!compareMode && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDelete(photo.id)
                              }}
                              className="mt-2 px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-xs"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                        {compareMode && (
                          <div className={`absolute top-2 right-2 w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                            selectedPhotos.includes(photo.id)
                              ? 'bg-green-500 border-green-500'
                              : 'bg-gray-700 border-gray-500'
                          }`}>
                            {selectedPhotos.includes(photo.id) && (
                              <span className="text-white font-bold">✓</span>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </>
        )}

        {/* Tips */}
        <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-700/30 rounded-xl p-6">
          <h4 className="text-sm font-semibold text-gray-400 mb-3">📸 Photo Tips</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>• Same time of day (morning, after waking up works best)</li>
            <li>• Same lighting and location for consistency</li>
            <li>• Front, back, and side angles</li>
            <li>• Relaxed posture (not flexed)</li>
            <li>• Every 2-4 weeks for noticeable changes</li>
            <li>• Don't judge daily - compare across weeks/months</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
