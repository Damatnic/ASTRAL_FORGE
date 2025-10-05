'use client'

import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { PROGRAM_TEMPLATES } from '@/components/program-template-browser'
import { useState } from 'react'

export default function ProgramTemplateDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [creating, setCreating] = useState(false)
  
  const template = PROGRAM_TEMPLATES.find(t => t.id === params.id)

  if (!template) {
    return (
      <div className="min-h-screen bg-astral-dark text-white flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Template Not Found</h1>
          <Link href="/programs/templates" className="text-astral-blue hover:underline">
            ← Back to Templates
          </Link>
        </div>
      </div>
    )
  }

  const handleCreateProgram = async () => {
    setCreating(true)
    try {
      const response = await fetch('/api/programs/from-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId: template.id })
      })

      if (response.ok) {
        const { programId } = await response.json()
        router.push(`/programs/${programId}`)
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to create program')
      }
    } catch (error) {
      console.error('Failed to create program:', error)
      alert('Failed to create program. Please try again.')
    } finally {
      setCreating(false)
    }
  }

  const difficultyColors = {
    beginner: 'bg-green-500/20 text-green-400 border-green-500/30',
    intermediate: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    advanced: 'bg-red-500/20 text-red-400 border-red-500/30'
  }

  const typeColors = {
    strength: 'bg-blue-500/20 text-blue-400',
    hypertrophy: 'bg-purple-500/20 text-purple-400',
    powerlifting: 'bg-red-500/20 text-red-400',
    bodyweight: 'bg-green-500/20 text-green-400',
    hybrid: 'bg-orange-500/20 text-orange-400'
  }

  // Get detailed program information based on template
  const getDetailedInfo = () => {
    const details: Record<string, any> = {
      'stronglifts-5x5': {
        workoutA: {
          name: 'Workout A',
          exercises: [
            { name: 'Squat', sets: '5×5', notes: 'Every workout' },
            { name: 'Bench Press', sets: '5×5', notes: 'Alternate with OHP' },
            { name: 'Barbell Row', sets: '5×5', notes: 'Pull variation' }
          ]
        },
        workoutB: {
          name: 'Workout B',
          exercises: [
            { name: 'Squat', sets: '5×5', notes: 'Every workout' },
            { name: 'Overhead Press', sets: '5×5', notes: 'Alternate with bench' },
            { name: 'Deadlift', sets: '1×5', notes: 'Only 1 heavy set' }
          ]
        },
        progression: 'Add 5 lbs to upper body, 10 lbs to lower body each workout',
        deload: 'Deload 10% when you fail the same weight 3 workouts in a row'
      },
      'starting-strength': {
        workoutA: {
          name: 'Workout A',
          exercises: [
            { name: 'Squat', sets: '3×5', notes: 'Every workout' },
            { name: 'Bench Press', sets: '3×5', notes: 'Alternate with OHP' },
            { name: 'Deadlift', sets: '1×5', notes: 'Alternates with power clean' }
          ]
        },
        workoutB: {
          name: 'Workout B',
          exercises: [
            { name: 'Squat', sets: '3×5', notes: 'Every workout' },
            { name: 'Overhead Press', sets: '3×5', notes: 'Alternate with bench' },
            { name: 'Power Clean', sets: '5×3', notes: 'Alternates with deadlift' }
          ]
        },
        progression: 'Add 5-10 lbs each workout for 12-16 weeks',
        deload: 'Switch to intermediate program when linear progression stalls'
      },
      'ppl': {
        push: {
          name: 'Push Day',
          exercises: [
            { name: 'Bench Press', sets: '4×8-12', notes: 'Compound' },
            { name: 'Overhead Press', sets: '3×8-12', notes: 'Compound' },
            { name: 'Incline Dumbbell Press', sets: '3×10-15', notes: 'Accessory' },
            { name: 'Lateral Raises', sets: '3×12-20', notes: 'Isolation' },
            { name: 'Tricep Pushdowns', sets: '3×12-15', notes: 'Isolation' }
          ]
        },
        pull: {
          name: 'Pull Day',
          exercises: [
            { name: 'Deadlift', sets: '3×5', notes: 'Compound - once per week' },
            { name: 'Barbell Row', sets: '4×8-12', notes: 'Compound' },
            { name: 'Pull-ups', sets: '3×8-12', notes: 'Compound' },
            { name: 'Face Pulls', sets: '3×15-20', notes: 'Accessory' },
            { name: 'Barbell Curls', sets: '3×8-12', notes: 'Isolation' }
          ]
        },
        legs: {
          name: 'Leg Day',
          exercises: [
            { name: 'Squat', sets: '4×8-12', notes: 'Compound' },
            { name: 'Romanian Deadlift', sets: '3×8-12', notes: 'Compound' },
            { name: 'Leg Press', sets: '3×10-15', notes: 'Accessory' },
            { name: 'Leg Curls', sets: '3×12-15', notes: 'Isolation' },
            { name: 'Calf Raises', sets: '4×15-20', notes: 'Isolation' }
          ]
        },
        progression: 'Add weight when you hit top of rep range for all sets',
        deload: 'Reduce volume by 40-50% every 6-8 weeks'
      }
    }
    return details[template.id] || null
  }

  const detailedInfo = getDetailedInfo()

  return (
    <div className="min-h-screen bg-astral-dark text-white">
      {/* Header */}
      <header className="bg-astral-gray border-b border-gray-800 p-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/programs/templates" className="text-gray-400 hover:text-white mb-4 inline-block">
            ← Back to Templates
          </Link>
          
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">{template.name}</h1>
              <p className="text-gray-300 text-lg">{template.description}</p>
            </div>
            {template.featured && <span className="text-yellow-400 text-3xl">⭐</span>}
            {template.popular && !template.featured && <span className="text-orange-400 text-3xl">🔥</span>}
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <span className={`px-4 py-2 rounded-lg text-sm font-medium border ${difficultyColors[template.difficulty]}`}>
              {template.difficulty.toUpperCase()}
            </span>
            <span className={`px-4 py-2 rounded-lg text-sm font-medium ${typeColors[template.type]}`}>
              {template.type.toUpperCase()}
            </span>
            <span className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-700 text-gray-300">
              {template.daysPerWeek}x per week
            </span>
            <span className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-700 text-gray-300">
              {template.duration}
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Quick Info Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Goals */}
          <div className="bg-astral-gray border border-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-astral-blue">🎯 Primary Goals</h2>
            <ul className="space-y-2">
              {template.goals.map(goal => (
                <li key={goal} className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  <span>{goal}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Equipment */}
          <div className="bg-astral-gray border border-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-astral-blue">🏋️ Required Equipment</h2>
            <ul className="space-y-2">
              {template.equipment.map(item => (
                <li key={item} className="flex items-center gap-2">
                  <span className="text-astral-purple">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Program Structure */}
        {detailedInfo && (
          <div className="bg-astral-gray border border-gray-800 rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-6">📋 Program Structure</h2>
            
            <div className="space-y-6">
              {Object.values(detailedInfo)
                .filter((item: any) => item.name && item.exercises)
                .map((workout: any) => (
                  <div key={workout.name} className="bg-gray-800/50 rounded-lg p-5">
                    <h3 className="text-lg font-semibold mb-4 text-astral-purple">{workout.name}</h3>
                    <div className="space-y-3">
                      {workout.exercises.map((exercise: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-700 last:border-0">
                          <div>
                            <div className="font-medium">{exercise.name}</div>
                            <div className="text-sm text-gray-400">{exercise.notes}</div>
                          </div>
                          <div className="text-astral-blue font-semibold">{exercise.sets}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>

            {/* Progression & Deload */}
            <div className="mt-6 grid md:grid-cols-2 gap-4">
              {detailedInfo.progression && (
                <div className="bg-green-900/20 border border-green-800 rounded-lg p-4">
                  <h4 className="font-semibold mb-2 text-green-400">📈 Progression</h4>
                  <p className="text-sm text-gray-300">{detailedInfo.progression}</p>
                </div>
              )}
              {detailedInfo.deload && (
                <div className="bg-orange-900/20 border border-orange-800 rounded-lg p-4">
                  <h4 className="font-semibold mb-2 text-orange-400">🔄 Deload Strategy</h4>
                  <p className="text-sm text-gray-300">{detailedInfo.deload}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tags */}
        <div className="bg-astral-gray border border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">🏷️ Tags</h2>
          <div className="flex flex-wrap gap-2">
            {template.tags.map(tag => (
              <span key={tag} className="px-3 py-1 bg-gray-700 text-gray-300 rounded-lg text-sm">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Who This Is For */}
        <div className="bg-gradient-to-r from-astral-blue/20 to-astral-purple/20 border border-astral-blue/30 rounded-xl p-6">
          <h2 className="text-2xl font-semibold mb-4">💡 Who Is This For?</h2>
          <div className="space-y-4 text-gray-300">
            {template.difficulty === 'beginner' && (
              <>
                <p>✅ <strong>Perfect for beginners</strong> who are new to lifting and want proven results.</p>
                <p>✅ Focus on learning proper form with basic compound movements.</p>
                <p>✅ Simple progression that doesn't require complicated planning.</p>
                <p>⚠️ May become too easy after 3-6 months of consistent training.</p>
              </>
            )}
            {template.difficulty === 'intermediate' && (
              <>
                <p>✅ <strong>Great for intermediate lifters</strong> with 6+ months of experience.</p>
                <p>✅ Ready for more volume and training frequency.</p>
                <p>✅ Can handle more complex progression schemes.</p>
                <p>⚠️ Requires understanding of progressive overload and recovery.</p>
              </>
            )}
            {template.difficulty === 'advanced' && (
              <>
                <p>✅ <strong>Designed for advanced lifters</strong> with 1+ years of experience.</p>
                <p>✅ High work capacity and recovery ability required.</p>
                <p>✅ Comfortable with high volume and intensity.</p>
                <p>⚠️ Not recommended for beginners - risk of overtraining.</p>
              </>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="sticky bottom-6 bg-astral-gray border border-gray-800 rounded-xl p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold mb-1">Ready to start {template.name}?</h3>
              <p className="text-sm text-gray-400">Create a personalized program based on this template</p>
            </div>
            <button
              onClick={handleCreateProgram}
              disabled={creating}
              className="px-6 py-3 bg-gradient-to-r from-astral-blue to-astral-purple text-white rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {creating ? 'Creating...' : 'Create Program'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
