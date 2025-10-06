'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Play, Pause, Check, X } from 'lucide-react'

export default function WorkoutSessionPage() {
  const [isWorkoutActive, setIsWorkoutActive] = useState(false)
  const [exercises, setExercises] = useState<any[]>([])

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="w-10 h-10 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-center hover:border-blue-500/50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Workout Session</h1>
              <p className="text-gray-400">Track your training</p>
            </div>
          </div>
          
          {!isWorkoutActive ? (
            <button
              onClick={() => setIsWorkoutActive(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-lg font-semibold flex items-center gap-2 transition-all"
            >
              <Play className="w-5 h-5" />
              Start Workout
            </button>
          ) : (
            <button
              onClick={() => setIsWorkoutActive(false)}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-lg font-semibold flex items-center gap-2 transition-all"
            >
              <Check className="w-5 h-5" />
              Finish Workout
            </button>
          )}
        </div>

        {/* Workout Status */}
        {isWorkoutActive && (
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400 mb-1">Workout Duration</div>
                <div className="text-3xl font-bold">00:00:00</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-400 mb-1">Exercises</div>
                <div className="text-3xl font-bold">{exercises.length}</div>
              </div>
            </div>
          </div>
        )}

        {/* Exercise List */}
        <div className="space-y-4">
          {exercises.length === 0 ? (
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-12 text-center">
              <p className="text-gray-400 mb-4">No exercises added yet</p>
              <button className="px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg font-semibold flex items-center gap-2 mx-auto transition-colors">
                <Plus className="w-5 h-5" />
                Add Exercise
              </button>
            </div>
          ) : (
            exercises.map((exercise, index) => (
              <div
                key={index}
                className="bg-slate-900/50 border border-slate-800 rounded-xl p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold">{exercise.name}</h3>
                  <button className="text-red-400 hover:text-red-300">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                {/* Sets would go here */}
              </div>
            ))
          )}
        </div>

        {/* Quick Actions */}
        {isWorkoutActive && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-800 rounded-full px-6 py-4 shadow-xl flex items-center gap-4">
            <button className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-full font-semibold flex items-center gap-2 transition-colors">
              <Plus className="w-4 h-4" />
              Add Exercise
            </button>
            <button className="px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-full font-semibold flex items-center gap-2 transition-colors">
              <Pause className="w-4 h-4" />
              Rest Timer
            </button>
          </div>
        )}

        {/* Feature Coming Soon Notice */}
        <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border border-slate-700 rounded-xl p-8 text-center mt-8">
          <h3 className="text-xl font-bold mb-2">Full Workout Tracking Coming Soon</h3>
          <p className="text-gray-400">
            Exercise selection, set tracking, and performance analysis features are in development
          </p>
        </div>
      </div>
    </div>
  )
}
