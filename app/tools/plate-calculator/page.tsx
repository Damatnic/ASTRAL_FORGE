'use client'

/**
 * Plate Calculator Demo Page
 * Showcases the enhanced plate calculator
 */

import React from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { PlateCalculatorEnhanced } from '@/components/equipment/plate-calculator-enhanced'

export default function PlateCalculatorPage() {
  return (
    <div className="min-h-screen bg-astral-dark text-white">
      {/* Header */}
      <header className="bg-astral-gray border-b border-astral-light p-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="p-2 hover:bg-astral-light rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Plate Calculator</h1>
              <p className="text-sm text-gray-400">
                Visual guide for loading barbells
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto p-4 md:p-6">
        {/* Plate Calculator */}
        <PlateCalculatorEnhanced />

        {/* Usage Tips */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-astral-gray rounded-lg border border-astral-light p-4">
            <h3 className="font-semibold text-white mb-2">💡 Quick Tips</h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Use warmup sets for safe progressive loading</li>
              <li>• Switch between kg/lb based on your gym</li>
              <li>• Select correct bar type for accurate calculations</li>
              <li>• Standard plate colors follow IPF/IWF standards</li>
            </ul>
          </div>

          <div className="bg-astral-gray rounded-lg border border-astral-light p-4">
            <h3 className="font-semibold text-white mb-2">🎯 1RM Calculator</h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Set your 1 rep max for quick percentages</li>
              <li>• Click any percentage to load that weight</li>
              <li>• Perfect for following strength programs</li>
              <li>• Works with any exercise using a barbell</li>
            </ul>
          </div>
        </div>

        {/* Common Exercises */}
        <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <h3 className="font-semibold text-blue-400 mb-3">
            📊 Common Barbell Exercises
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-300">
            <div>• Squat</div>
            <div>• Bench Press</div>
            <div>• Deadlift</div>
            <div>• Overhead Press</div>
            <div>• Barbell Row</div>
            <div>• Romanian Deadlift</div>
            <div>• Front Squat</div>
            <div>• Hip Thrust</div>
          </div>
        </div>
      </div>
    </div>
  )
}
