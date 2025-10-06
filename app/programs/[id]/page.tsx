'use client'

import Link from 'next/link'
import { ArrowLeft, Calendar, Dumbbell, Target, Play } from 'lucide-react'
import { useParams } from 'next/navigation'

export default function ProgramDetailPage() {
  const params = useParams()
  const programId = params.id

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href="/programs"
            className="w-10 h-10 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-center hover:border-blue-500/50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Program Details</h1>
            <p className="text-gray-400">Program #{programId}</p>
          </div>
        </div>

        {/* Program Info */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Training Program</h2>
              <p className="text-gray-400">
                View program details and start training
              </p>
            </div>
            <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-lg font-semibold flex items-center gap-2 transition-all">
              <Play className="w-5 h-5" />
              Start Program
            </button>
          </div>

          {/* Program Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-slate-800/50 rounded-lg p-4 text-center">
              <Calendar className="w-6 h-6 mx-auto mb-2 text-blue-400" />
              <div className="text-xl font-bold">12 weeks</div>
              <div className="text-sm text-gray-400">Duration</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 text-center">
              <Dumbbell className="w-6 h-6 mx-auto mb-2 text-purple-400" />
              <div className="text-xl font-bold">4-5 days</div>
              <div className="text-sm text-gray-400">Per Week</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 text-center">
              <Target className="w-6 h-6 mx-auto mb-2 text-green-400" />
              <div className="text-xl font-bold">Strength</div>
              <div className="text-sm text-gray-400">Focus</div>
            </div>
          </div>
        </div>

        {/* Program Details */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4">About This Program</h3>
          <p className="text-gray-400">
            This training program is designed to help you achieve your fitness goals through structured workouts and progressive overload.
          </p>
        </div>

        {/* Coming Soon Notice */}
        <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border border-slate-700 rounded-xl p-8 text-center">
          <h3 className="text-xl font-bold mb-2">Full Program Details Coming Soon</h3>
          <p className="text-gray-400">
            Detailed workout plans, exercise breakdowns, and progression tracking are in development
          </p>
        </div>
      </div>
    </div>
  )
}
