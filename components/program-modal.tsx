'use client'

import { X, Calendar, Dumbbell, Star, Users, Target, Clock, CheckCircle, ChevronRight } from 'lucide-react'
import { useEffect } from 'react'
import CalendarPreview from '@/components/calendar-preview'

interface Program {
  id: number
  name: string
  description: string
  category: string
  difficulty: string
  duration: string
  daysPerWeek: number
  popularity: number
  enrolledUsers: number
  progress?: number
  imageColor: string
  schedule?: {
    monday?: string
    tuesday?: string
    wednesday?: string
    thursday?: string
    friday?: string
    saturday?: string
    sunday?: string
  }
  equipment?: string[]
  goals?: string[]
  isActive?: boolean
}

interface ProgramModalProps {
  program: Program | null
  isOpen: boolean
  onClose: () => void
  onStart?: (program: Program) => void
}

export function ProgramModal({ program, isOpen, onClose, onStart }: ProgramModalProps) {
  // Handle ESC key
  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      window.addEventListener('keydown', handleEsc)
      // Prevent body scroll
      document.body.style.overflow = 'hidden'
    }
    return () => {
      window.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen || !program) return null

  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  // Default equipment and goals if not provided
  const equipment = program.equipment || ['Barbell', 'Dumbbells', 'Bench', 'Rack']
  const goals = program.goals || ['Build Muscle', 'Gain Strength', 'Improve Endurance']

  // Difficulty colors
  const difficultyColors = {
    'Beginner': 'border-green-500 text-green-400 bg-green-500/10',
    'Intermediate': 'border-yellow-500 text-yellow-400 bg-yellow-500/10',
    'Advanced': 'border-red-500 text-red-400 bg-red-500/10',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl animate-slide-up overflow-hidden">
        {/* Header with Gradient */}
        <div className={`relative h-48 bg-gradient-to-br ${program.imageColor} overflow-hidden`}>
          <div className="absolute inset-0 bg-black/30" />
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-colors backdrop-blur-sm border border-white/20"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          {/* Difficulty Badge */}
          <div className="absolute top-4 left-4">
            <span className={`px-4 py-2 rounded-lg text-sm font-bold border-2 backdrop-blur-md ${difficultyColors[program.difficulty as keyof typeof difficultyColors]}`}>
              {program.difficulty}
            </span>
          </div>

          {/* Large Icon */}
          <div className="absolute bottom-6 left-6">
            <Dumbbell className="w-16 h-16 text-white/50" />
          </div>

          {/* Active Badge */}
          {program.isActive && (
            <div className="absolute bottom-6 right-6">
              <div className="bg-green-500 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 shadow-lg">
                <CheckCircle className="w-4 h-4" />
                ACTIVE PROGRAM
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-12rem)] p-8">
          {/* Title and Stats */}
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-white mb-3">{program.name}</h2>
            
            {/* Quick Stats */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="text-white font-semibold">{program.popularity}</span>
                <span className="text-gray-400">/5.0</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-400" />
                <span className="text-white">{program.enrolledUsers.toLocaleString()}</span>
                <span className="text-gray-400">enrolled</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-400" />
                <span className="text-white">{program.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-orange-400" />
                <span className="text-white">{program.daysPerWeek}x per week</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <span className="text-2xl">📝</span>
              Description
            </h3>
            <p className="text-gray-300 leading-relaxed">{program.description}</p>
          </div>

          {/* Weekly Schedule */}
          <div className="mb-8">
            <CalendarPreview
              workouts={[
                { day: 'Mon', type: 'push', focus: program.schedule?.monday || 'Push', exercises: ['Bench Press', 'Overhead Press', 'Dips'] },
                { day: 'Tue', type: 'pull', focus: program.schedule?.tuesday || 'Pull', exercises: ['Deadlift', 'Pull-ups', 'Rows'] },
                { day: 'Wed', type: 'legs', focus: program.schedule?.wednesday || 'Legs', exercises: ['Squat', 'RDL', 'Lunges'] },
                { day: 'Thu', type: 'upper', focus: program.schedule?.thursday || 'Upper', exercises: ['Bench Press', 'Rows'] },
                { day: 'Fri', type: 'lower', focus: program.schedule?.friday || 'Lower', exercises: ['Squat', 'Deadlift'] },
                { day: 'Sat', type: program.daysPerWeek >= 6 ? 'fullbody' : 'rest', focus: program.schedule?.saturday },
                { day: 'Sun', type: 'rest' }
              ]}
              variant="full"
            />
          </div>

          {/* Equipment Needed */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-orange-400" />
              Equipment Needed
            </h3>
            <div className="flex flex-wrap gap-2">
              {equipment.map((item, index) => (
                <div
                  key={index}
                  className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-gray-300"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Goals */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-green-400" />
              Program Goals
            </h3>
            <div className="space-y-2">
              {goals.map((goal, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                  <span className="text-gray-300">{goal}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Progress (if active) */}
          {program.isActive && program.progress !== undefined && (
            <div className="mb-8 bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-500/30 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-green-400" />
                Your Progress
              </h3>
              <div className="mb-3">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>Overall Completion</span>
                  <span className="font-semibold text-white">{program.progress}%</span>
                </div>
                <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-1000 ease-out rounded-full"
                    style={{ width: `${program.progress}%` }}
                  />
                </div>
              </div>
              <p className="text-sm text-gray-400">
                Keep up the great work! You're {program.progress}% through the program.
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-slate-700 p-6 bg-slate-900/50 backdrop-blur-sm">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
            >
              Close
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  // Navigate to full page
                  window.location.href = `/programs/${program.id}`
                }}
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                View Full Details
                <ChevronRight className="w-4 h-4" />
              </button>
              {!program.isActive && onStart && (
                <button
                  onClick={() => onStart(program)}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg font-bold transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                  <Dumbbell className="w-5 h-5" />
                  Start Program
                </button>
              )}
              {program.isActive && (
                <button
                  onClick={() => {
                    window.location.href = `/programs/${program.id}`
                  }}
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg font-bold transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Continue Program
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
