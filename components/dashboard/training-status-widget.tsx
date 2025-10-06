'use client'

/**
 * Training Status Widget
 * Shows current program and next workout
 */

import React from 'react'
import Link from 'next/link'
import { Widget } from './widget'
import { cn } from '@/lib/utils'

interface TrainingStatusProps {
  programName?: string
  nextWorkout?: {
    name: string
    exercises: number
    estimatedTime: number // in minutes
    scheduledDate?: string
  }
  programProgress?: {
    current: number
    total: number
  }
  className?: string
}

export function TrainingStatusWidget({
  programName,
  nextWorkout,
  programProgress,
  className,
}: TrainingStatusProps) {
  const hasProgram = !!programName
  const hasNextWorkout = !!nextWorkout

  return (
    <Widget
      title="Training Status"
      icon="🏋️"
      variant="gradient"
      className={className}
    >
      {hasProgram ? (
        <div className="space-y-4">
          {/* Current Program */}
          <div className="bg-astral-dark/50 rounded-lg p-4 border border-astral-light/30">
            <div className="text-xs text-gray-400 uppercase mb-1">Active Program</div>
            <div className="text-xl font-bold text-white mb-2">{programName}</div>
            
            {/* Progress Bar */}
            {programProgress && (
              <div>
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Progress</span>
                  <span>{programProgress.current} / {programProgress.total} workouts</span>
                </div>
                <div className="w-full bg-astral-gray rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-astral-blue to-astral-purple h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(programProgress.current / programProgress.total) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Next Workout */}
          {hasNextWorkout && (
            <div className="bg-green-900/20 rounded-lg p-4 border border-green-500/30">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs text-green-400 uppercase font-semibold">Next Up</div>
                {nextWorkout.scheduledDate && (
                  <div className="text-xs text-gray-400">{nextWorkout.scheduledDate}</div>
                )}
              </div>
              
              <div className="text-lg font-bold text-white mb-3">{nextWorkout.name}</div>
              
              <div className="flex items-center gap-4 text-sm text-gray-300 mb-4">
                <div className="flex items-center gap-1">
                  <span>💪</span>
                  <span>{nextWorkout.exercises} exercises</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>⏱️</span>
                  <span>~{nextWorkout.estimatedTime}min</span>
                </div>
              </div>

              <Link
                href="/programs"
                className={cn(
                  'block w-full py-3 px-4 rounded-lg font-bold text-center',
                  'bg-gradient-to-r from-green-500 to-emerald-600',
                  'hover:opacity-90 transition-opacity',
                  'text-white'
                )}
              >
                Start Workout
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">📋</div>
          <p className="text-gray-400 mb-4">No active training program</p>
          <Link
            href="/programs"
            className={cn(
              'inline-block px-6 py-3 rounded-lg font-bold',
              'bg-gradient-to-r from-astral-blue to-astral-purple',
              'hover:opacity-90 transition-opacity',
              'text-white'
            )}
          >
            Browse Programs
          </Link>
        </div>
      )}
    </Widget>
  )
}

export default TrainingStatusWidget
