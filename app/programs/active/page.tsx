'use client'

import Link from 'next/link'
import { ArrowLeft, Calendar, Target, TrendingUp } from 'lucide-react'

export default function ActiveProgramPage() {
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
            <h1 className="text-3xl font-bold">Active Program</h1>
            <p className="text-gray-400">Your current training program</p>
          </div>
        </div>

        {/* No Active Program */}
        <div className="bg-neutral-900/50 border-2 border-neutral-800 p-12 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-600 to-amber-500 flex items-center justify-center mx-auto mb-6">
            <Target className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-wider mb-2">No Active Program</h2>
          <p className="text-neutral-400 mb-6 uppercase tracking-wider font-bold">
            Select a program to start tracking your training progress
          </p>
          <Link
            href="/programs"
            className="inline-block px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 font-black uppercase tracking-wider transition-all"
          >
            Browse Programs
          </Link>
        </div>

        {/* Program Stats Placeholder */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-neutral-900/50 border-2 border-neutral-800 p-6 text-center">
            <Calendar className="w-8 h-8 mx-auto mb-2 text-amber-400" />
            <div className="text-2xl font-black uppercase tracking-wider">-</div>
            <div className="text-sm text-neutral-400 uppercase tracking-wider font-bold">Week</div>
          </div>
          <div className="bg-neutral-900/50 border-2 border-neutral-800 p-6 text-center">
            <Target className="w-8 h-8 mx-auto mb-2 text-amber-400" />
            <div className="text-2xl font-black uppercase tracking-wider">-</div>
            <div className="text-sm text-neutral-400 uppercase tracking-wider font-bold">Sessions</div>
          </div>
          <div className="bg-neutral-900/50 border-2 border-neutral-800 p-6 text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-amber-400" />
            <div className="text-2xl font-black uppercase tracking-wider">-</div>
            <div className="text-sm text-neutral-400 uppercase tracking-wider font-bold">Progress</div>
          </div>
        </div>
      </div>
    </div>
  )
}
