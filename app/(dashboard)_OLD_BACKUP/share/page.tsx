'use client'

import { useState } from 'react'
import { useWorkoutHistory } from '@/hooks/use-data'

type ShareType = 'workout' | 'achievement' | 'pr'

export default function SharePage() {
  const [shareType, setShareType] = useState<ShareType>('workout')
  const [selectedWorkoutId, setSelectedWorkoutId] = useState('')
  const [achievementId, setAchievementId] = useState('')
  const [prExercise, setPrExercise] = useState('')
  const [prWeight, setPrWeight] = useState('')
  const [prReps, setPrReps] = useState('')
  const [shareContent, setShareContent] = useState<any>(null)
  const [shareMetadata, setShareMetadata] = useState<any>(null)
  const [copied, setCopied] = useState(false)

  const { data: workoutsData } = useWorkoutHistory()
  const recentWorkouts = workoutsData?.workouts?.slice(0, 10) || []

  const handleGenerateShare = async () => {
    try {
      let body: any = { action: '' }
      
      if (shareType === 'workout') {
        body.action = 'generate-workout-share'
        body.sessionId = selectedWorkoutId
      } else if (shareType === 'achievement') {
        body.action = 'generate-achievement-share'
        body.achievementId = achievementId
      } else if (shareType === 'pr') {
        body.action = 'generate-pr-share'
        body.exerciseName = prExercise
        body.weight = parseFloat(prWeight)
        body.reps = parseInt(prReps)
      }

      const response = await fetch('/api/engagement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (!response.ok) throw new Error('Failed to generate share content')

      const data = await response.json()
      setShareContent(data.content)
      setShareMetadata(data.metadata)
    } catch (error) {
      console.error('Error generating share content:', error)
    }
  }

  const handleCopyLink = () => {
    if (shareMetadata?.url) {
      navigator.clipboard.writeText(shareMetadata.url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleSocialShare = (platform: string) => {
    if (!shareMetadata) return

    const encodedUrl = encodeURIComponent(shareMetadata.url)
    const encodedTitle = encodeURIComponent(shareMetadata.title)
    const encodedDescription = encodeURIComponent(shareMetadata.description)

    let shareUrl = ''

    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}&hashtags=${shareMetadata.hashtags.join(',')}`
        break
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
        break
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
        break
      case 'discord':
        // Discord doesn't have a direct share URL - would need webhook integration
        handleCopyLink()
        alert('Link copied! Paste it in Discord.')
        return
    }

    window.open(shareUrl, '_blank', 'width=600,height=400')
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
          Social Sharing
        </h1>
        <p className="text-slate-400">Share your fitness journey with the world</p>
      </div>

      {/* Share Type Selection */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">What would you like to share?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setShareType('workout')}
            className={`p-4 rounded-lg border-2 transition-all ${
              shareType === 'workout'
                ? 'bg-blue-500/20 border-blue-500 text-white'
                : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600'
            }`}
          >
            <div className="text-3xl mb-2">💪</div>
            <div className="font-bold">Workout</div>
            <div className="text-sm opacity-70">Share a completed workout</div>
          </button>

          <button
            onClick={() => setShareType('achievement')}
            className={`p-4 rounded-lg border-2 transition-all ${
              shareType === 'achievement'
                ? 'bg-blue-500/20 border-blue-500 text-white'
                : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600'
            }`}
          >
            <div className="text-3xl mb-2">🏆</div>
            <div className="font-bold">Achievement</div>
            <div className="text-sm opacity-70">Share an accomplishment</div>
          </button>

          <button
            onClick={() => setShareType('pr')}
            className={`p-4 rounded-lg border-2 transition-all ${
              shareType === 'pr'
                ? 'bg-blue-500/20 border-blue-500 text-white'
                : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600'
            }`}
          >
            <div className="text-3xl mb-2">🎯</div>
            <div className="font-bold">Personal Record</div>
            <div className="text-sm opacity-70">Share a new PR</div>
          </button>
        </div>
      </div>

      {/* Content Selection */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Select Content</h2>

        {shareType === 'workout' && (
          <div>
            <label className="block text-sm text-slate-400 mb-2">Recent Workouts</label>
            <select
              value={selectedWorkoutId}
              onChange={(e) => setSelectedWorkoutId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white"
            >
              <option value="">Select a workout...</option>
              {recentWorkouts.map((workout: any) => (
                <option key={workout.id} value={workout.id}>
                  {workout.name} - {new Date(workout.date).toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>
        )}

        {shareType === 'achievement' && (
          <div>
            <label className="block text-sm text-slate-400 mb-2">Achievement ID</label>
            <input
              type="text"
              value={achievementId}
              onChange={(e) => setAchievementId(e.target.value)}
              placeholder="Enter achievement ID..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white"
            />
            <p className="text-xs text-slate-500 mt-2">Find achievement IDs in your achievements page</p>
          </div>
        )}

        {shareType === 'pr' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-2">Exercise Name</label>
              <input
                type="text"
                value={prExercise}
                onChange={(e) => setPrExercise(e.target.value)}
                placeholder="e.g., Bench Press"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Weight (kg)</label>
                <input
                  type="number"
                  value={prWeight}
                  onChange={(e) => setPrWeight(e.target.value)}
                  placeholder="100"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Reps</label>
                <input
                  type="number"
                  value={prReps}
                  onChange={(e) => setPrReps(e.target.value)}
                  placeholder="5"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white"
                />
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleGenerateShare}
          disabled={
            (shareType === 'workout' && !selectedWorkoutId) ||
            (shareType === 'achievement' && !achievementId) ||
            (shareType === 'pr' && (!prExercise || !prWeight || !prReps))
          }
          className="mt-4 w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg font-bold hover:from-blue-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Generate Share Content
        </button>
      </div>

      {/* Share Preview */}
      {shareContent && shareMetadata && (
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Preview & Share</h2>

          <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg p-6 mb-6">
            <div className="text-2xl font-bold text-white mb-2">{shareContent.title}</div>
            <div className="text-slate-300 mb-4">{shareContent.description}</div>
            {shareContent.stats && (
              <div className="flex flex-wrap gap-4">
                {Object.entries(shareContent.stats).map(([key, value]) => (
                  <div key={key} className="bg-slate-900/50 rounded-lg px-3 py-2">
                    <div className="text-xs text-slate-400 uppercase">{key}</div>
                    <div className="text-lg font-bold text-white">{String(value)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button
                onClick={() => handleSocialShare('twitter')}
                className="px-4 py-3 bg-[#1DA1F2]/20 border border-[#1DA1F2]/30 rounded-lg text-white hover:bg-[#1DA1F2]/30 transition-all font-semibold"
              >
                🐦 Twitter
              </button>
              <button
                onClick={() => handleSocialShare('facebook')}
                className="px-4 py-3 bg-[#1877F2]/20 border border-[#1877F2]/30 rounded-lg text-white hover:bg-[#1877F2]/30 transition-all font-semibold"
              >
                📘 Facebook
              </button>
              <button
                onClick={() => handleSocialShare('linkedin')}
                className="px-4 py-3 bg-[#0A66C2]/20 border border-[#0A66C2]/30 rounded-lg text-white hover:bg-[#0A66C2]/30 transition-all font-semibold"
              >
                💼 LinkedIn
              </button>
              <button
                onClick={() => handleSocialShare('discord')}
                className="px-4 py-3 bg-[#5865F2]/20 border border-[#5865F2]/30 rounded-lg text-white hover:bg-[#5865F2]/30 transition-all font-semibold"
              >
                💬 Discord
              </button>
            </div>

            <button
              onClick={handleCopyLink}
              className="w-full px-6 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white hover:bg-slate-700 transition-all font-semibold"
            >
              {copied ? '✓ Link Copied!' : '🔗 Copy Link'}
            </button>
          </div>

          <div className="mt-4 text-sm text-slate-400">
            Hashtags: {shareMetadata.hashtags.map((tag: string) => `#${tag}`).join(' ')}
          </div>
        </div>
      )}
    </div>
  )
}
