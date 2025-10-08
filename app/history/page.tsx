'use client'

import Link from 'next/link'
import { ArrowLeft, Calendar, Dumbbell, Clock } from 'lucide-react'

export default function WorkoutHistoryPage() {
  return (
    <div className="min-h-screen bg-neutral-950 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href="/progress"
            className="w-10 h-10 bg-neutral-900 border-2 border-neutral-800 flex items-center justify-center hover:border-amber-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-400">Battle History</h1>
            <p className="text-neutral-400 font-medium">Your combat log</p>
          </div>
        </div>

        {/* Empty State */}
        <div className="bg-neutral-900 border-2 border-neutral-800 p-12 text-center">
          <div className="w-20 h-20 bg-amber-950/50 border-2 border-amber-700 flex items-center justify-center mx-auto mb-6">
            <Dumbbell className="w-10 h-10 text-amber-400" />
          </div>
          <h2 className="text-2xl font-bold uppercase tracking-wider mb-2">No Battles Yet</h2>
          <p className="text-neutral-400 mb-6">
            Engage in your first battle to begin building your combat history
          </p>
          <Link
            href="/workout/session"
            className="inline-block px-6 py-3 bg-amber-950/50 border-2 border-amber-700 hover:bg-amber-900/50 font-bold uppercase tracking-wider transition-all text-amber-400"
          >
            Engage Battle
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-neutral-900 border-2 border-neutral-800 p-6 text-center">
            <Calendar className="w-8 h-8 mx-auto mb-2 text-amber-400" />
            <div className="text-2xl font-bold text-amber-400">0</div>
            <div className="text-sm text-neutral-400 uppercase tracking-wider font-bold">Total Battles</div>
          </div>
          <div className="bg-neutral-900 border-2 border-neutral-800 p-6 text-center">
            <Dumbbell className="w-8 h-8 mx-auto mb-2 text-amber-400" />
            <div className="text-2xl font-bold text-amber-400">0</div>
            <div className="text-sm text-neutral-400 uppercase tracking-wider font-bold">This Week</div>
          </div>
          <div className="bg-neutral-900 border-2 border-neutral-800 p-6 text-center">
            <Clock className="w-8 h-8 mx-auto mb-2 text-amber-400" />
            <div className="text-2xl font-bold text-amber-400">0h</div>
            <div className="text-sm text-neutral-400 uppercase tracking-wider font-bold">Total Time</div>
          </div>
        </div>
      </div>
    </div>
  )
}
