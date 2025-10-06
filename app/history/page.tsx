'use client'

import Link from 'next/link'
import { ArrowLeft, Calendar, Dumbbell, Clock } from 'lucide-react'

export default function WorkoutHistoryPage() {
  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href="/progress"
            className="w-10 h-10 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-center hover:border-blue-500/50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Workout History</h1>
            <p className="text-gray-400">Your training log</p>
          </div>
        </div>

        {/* Empty State */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-12 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Dumbbell className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold mb-2">No Workouts Yet</h2>
          <p className="text-gray-400 mb-6">
            Start your first workout to begin building your training history
          </p>
          <Link
            href="/workout/session"
            className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-lg font-semibold transition-all"
          >
            Start Workout
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 text-center">
            <Calendar className="w-8 h-8 mx-auto mb-2 text-blue-400" />
            <div className="text-2xl font-bold">0</div>
            <div className="text-sm text-gray-400">Total Workouts</div>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 text-center">
            <Dumbbell className="w-8 h-8 mx-auto mb-2 text-purple-400" />
            <div className="text-2xl font-bold">0</div>
            <div className="text-sm text-gray-400">This Week</div>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 text-center">
            <Clock className="w-8 h-8 mx-auto mb-2 text-green-400" />
            <div className="text-2xl font-bold">0h</div>
            <div className="text-sm text-gray-400">Total Time</div>
          </div>
        </div>
      </div>
    </div>
  )
}
