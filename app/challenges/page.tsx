'use client'

import { useState, useEffect } from 'react'
import { ChallengeBoard } from '@/components/challenge-board'
import { Challenge } from '@/lib/challenge-system'

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadChallenges() {
      try {
        setLoading(true)
        const response = await fetch('/api/challenges')
        
        if (!response.ok) {
          throw new Error('Failed to load challenges')
        }

        const data = await response.json()
        setChallenges(data.challenges || [])
      } catch (err) {
        console.error('Error loading challenges:', err)
        setError('Failed to load challenges. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    loadChallenges()
  }, [])

  const handleRewardClaim = async (challengeId: string) => {
    try {
      const response = await fetch('/api/challenges/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challengeId }),
      })

      if (response.ok) {
        const data = await fetch('/api/challenges').then(r => r.json())
        setChallenges(data.challenges || [])
        alert('Rewards claimed successfully!')
      } else {
        alert('Failed to claim rewards. Please try again.')
      }
    } catch (err) {
      console.error('Error claiming reward:', err)
      alert('Failed to claim rewards. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="text-6xl mb-4 animate-bounce"></div>
            <h2 className="text-2xl font-bold text-gray-400">Loading challenges...</h2>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="text-6xl mb-4"></div>
            <h2 className="text-2xl font-bold text-red-400 mb-2">Error</h2>
            <p className="text-gray-400">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text mb-4">
            Training Challenges
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Complete challenges to earn progress points, unlock achievements, and gain access to
            advanced training programs and features.
          </p>
        </div>

        <ChallengeBoard challenges={challenges} onRewardClaim={handleRewardClaim} />

        <div className="mt-12 bg-slate-800/30 border border-slate-700 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4"> How Challenges Work</h3>
          <div className="grid md:grid-cols-3 gap-6 text-sm text-gray-400">
            <div>
              <div className="text-2xl mb-2"></div>
              <h4 className="font-semibold text-white mb-1">Daily Challenges</h4>
              <p>Reset every 24 hours. Quick goals to build daily training habits.</p>
            </div>
            <div>
              <div className="text-2xl mb-2"></div>
              <h4 className="font-semibold text-white mb-1">Weekly Challenges</h4>
              <p>Reset every Monday. Longer-term goals for consistent progress.</p>
            </div>
            <div>
              <div className="text-2xl mb-2"></div>
              <h4 className="font-semibold text-white mb-1">Long-Term Goals</h4>
              <p>No deadline. Major milestones for serious achievements.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
