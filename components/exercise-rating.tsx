'use client'

import { useState, useEffect } from 'react'
import { useToast } from './toast'

interface ExerciseRatingProps {
  exerciseId: string
}

export function ExerciseRating({ exerciseId }: ExerciseRatingProps) {
  const { toast } = useToast()
  const [rating, setRating] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRating()
  }, [exerciseId])

  const loadRating = async () => {
    try {
      const res = await fetch(`/api/exercises/${exerciseId}/rating`)
      if (res.ok) {
        const data = await res.json()
        setRating(data.rating || 0)
        setIsFavorite(data.isFavorite || false)
      }
    } catch (error) {
      console.error('Failed to load rating:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRatingClick = async (newRating: number) => {
    setRating(newRating)
    await saveRating(newRating, isFavorite)
  }

  const handleFavoriteClick = async () => {
    const newFavorite = !isFavorite
    setIsFavorite(newFavorite)
    await saveRating(rating || 3, newFavorite)
  }

  const saveRating = async (rating: number, favorite: boolean) => {
    try {
      const res = await fetch(`/api/exercises/${exerciseId}/rating`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, isFavorite: favorite }),
      })

      if (res.ok) {
        toast('success', favorite ? 'Added to favorites!' : 'Rating saved!')
      }
    } catch (error) {
      toast('error', 'Failed to save')
    }
  }

  if (loading) {
    return <div className="text-gray-400 text-sm">Loading...</div>
  }

  return (
    <div className="flex items-center gap-4">
      {/* Star Rating */}
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleRatingClick(star)}
            className="text-2xl transition-all hover:scale-110"
          >
            {star <= rating ? '⭐' : '☆'}
          </button>
        ))}
      </div>

      {/* Favorite */}
      <button
        onClick={handleFavoriteClick}
        className={`text-2xl transition-all hover:scale-110 ${
          isFavorite ? 'text-red-500' : 'text-gray-500'
        }`}
        title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        {isFavorite ? '❤️' : '🤍'}
      </button>
    </div>
  )
}

