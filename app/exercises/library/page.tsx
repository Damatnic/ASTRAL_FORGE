/**
 * Exercise Library with Equipment Filtering Demo
 * 
 * Shows all exercises with equipment-based filtering and alternatives
 */

// Force dynamic rendering to prevent build timeout with large dataset
export const dynamic = 'force-dynamic'

import { Suspense } from 'react'
import Link from 'next/link'
import { ArrowLeft, Dumbbell } from 'lucide-react'
import { ExerciseLibraryFiltered } from '@/components/equipment/exercise-library-filtered'

// Mock exercise data for demo
// In production, this would come from the database
const mockExercises = [
  {
    id: '1',
    name: 'Barbell Squat',
    category: 'compound',
    muscleGroup: 'legs',
    equipment: 'barbell',
    description: 'King of leg exercises. Full depth, controlled tempo.',
  },
  {
    id: '2',
    name: 'Deadlift',
    category: 'compound',
    muscleGroup: 'pull',
    equipment: 'barbell',
    description: 'Full body power movement. Focus on hip hinge pattern.',
  },
  {
    id: '3',
    name: 'Bench Press',
    category: 'compound',
    muscleGroup: 'push',
    equipment: 'barbell',
    description: 'Primary horizontal pressing movement.',
  },
  {
    id: '4',
    name: 'Pull-Up',
    category: 'compound',
    muscleGroup: 'pull',
    equipment: 'bodyweight',
    description: 'Vertical pulling for back width.',
  },
  {
    id: '5',
    name: 'Dumbbell Bench Press',
    category: 'compound',
    muscleGroup: 'push',
    equipment: 'dumbbell',
    description: 'Horizontal pressing with dumbbells for greater ROM.',
  },
  {
    id: '6',
    name: 'Romanian Deadlift',
    category: 'compound',
    muscleGroup: 'pull',
    equipment: 'barbell',
    description: 'Hamstring and glute focused hinge movement.',
  },
  {
    id: '7',
    name: 'Overhead Press',
    category: 'compound',
    muscleGroup: 'push',
    equipment: 'barbell',
    description: 'Vertical pressing for shoulders.',
  },
  {
    id: '8',
    name: 'Bent-Over Row',
    category: 'compound',
    muscleGroup: 'pull',
    equipment: 'barbell',
    description: 'Horizontal pulling for back thickness.',
  },
  {
    id: '9',
    name: 'Goblet Squat',
    category: 'compound',
    muscleGroup: 'legs',
    equipment: 'dumbbell',
    description: 'Squat variation holding weight at chest.',
  },
  {
    id: '10',
    name: 'Lat Pulldown',
    category: 'compound',
    muscleGroup: 'pull',
    equipment: 'machine',
    description: 'Vertical pulling on cable machine.',
  },
  {
    id: '11',
    name: 'Leg Press',
    category: 'compound',
    muscleGroup: 'legs',
    equipment: 'machine',
    description: 'Lower body pressing on machine.',
  },
  {
    id: '12',
    name: 'Dumbbell Curl',
    category: 'isolation',
    muscleGroup: 'pull',
    equipment: 'dumbbell',
    description: 'Bicep isolation with full ROM.',
  },
  {
    id: '13',
    name: 'Tricep Pushdown',
    category: 'isolation',
    muscleGroup: 'push',
    equipment: 'cable',
    description: 'Tricep isolation on cable machine.',
  },
  {
    id: '14',
    name: 'Push-Up',
    category: 'compound',
    muscleGroup: 'push',
    equipment: 'bodyweight',
    description: 'Classic horizontal pressing bodyweight movement.',
  },
  {
    id: '15',
    name: 'Plank',
    category: 'accessory',
    muscleGroup: 'core',
    equipment: 'bodyweight',
    description: 'Isometric core stability exercise.',
  },
  {
    id: '16',
    name: 'Dumbbell Row',
    category: 'compound',
    muscleGroup: 'pull',
    equipment: 'dumbbell',
    description: 'Unilateral horizontal pulling movement.',
  },
  {
    id: '17',
    name: 'Lateral Raise',
    category: 'isolation',
    muscleGroup: 'push',
    equipment: 'dumbbell',
    description: 'Shoulder isolation for lateral delts.',
  },
  {
    id: '18',
    name: 'Front Squat',
    category: 'compound',
    muscleGroup: 'legs',
    equipment: 'barbell',
    description: 'Squat with bar on front of shoulders.',
  },
  {
    id: '19',
    name: 'Dips',
    category: 'compound',
    muscleGroup: 'push',
    equipment: 'bodyweight',
    description: 'Vertical pressing for chest and triceps.',
  },
  {
    id: '20',
    name: 'Ab Wheel Rollout',
    category: 'accessory',
    muscleGroup: 'core',
    equipment: 'bodyweight',
    description: 'Advanced core exercise with ab wheel.',
  },
]

// Mock user equipment - in production, fetch from database
const mockUserEquipment = [
  'Olympic Barbell (20kg)',
  'Dumbbell (Pair)',
  'Flat Bench',
  'Pull-up Bar',
]

export default function ExerciseLibraryPage() {
  return (
    <div className="min-h-screen bg-astral-dark p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-astral-text-dim hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>

          <div className="flex items-center gap-3 mb-2">
            <Dumbbell className="w-8 h-8 text-astral-accent" />
            <h1 className="text-3xl font-bold text-white">Exercise Library</h1>
          </div>
          
          <p className="text-astral-text-dim">
            Browse exercises filtered by your available equipment. See alternatives for exercises you cannot perform.
          </p>
        </div>

        {/* Equipment Summary */}
        <div className="bg-astral-gray border border-astral-light rounded-lg p-4 mb-6">
          <h2 className="text-sm font-medium text-white mb-2">Your Equipment</h2>
          <div className="flex flex-wrap gap-2">
            {mockUserEquipment.map(equipment => (
              <span
                key={equipment}
                className="px-3 py-1 bg-astral-dark border border-astral-accent/30 rounded-full text-xs text-astral-accent"
              >
                {equipment}
              </span>
            ))}
            <Link
              href="/settings/equipment"
              className="px-3 py-1 bg-astral-accent/10 border border-astral-accent rounded-full text-xs text-astral-accent hover:bg-astral-accent/20 transition-colors"
            >
              Edit Equipment
            </Link>
          </div>
        </div>

        {/* Exercise Library */}
        <Suspense fallback={<div className="text-center py-8 text-astral-text-dim">Loading exercises...</div>}>
          <ExerciseLibraryFiltered
            exercises={mockExercises}
            userEquipment={mockUserEquipment}
            onSelectExercise={(exercise) => {
              console.log('Selected exercise:', exercise)
              // Handle exercise selection - could navigate to exercise detail page
            }}
          />
        </Suspense>

        {/* Info Section */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="bg-astral-gray border border-astral-light rounded-lg p-4">
            <h3 className="font-bold text-white mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              Available Exercises
            </h3>
            <p className="text-sm text-astral-text-dim">
              Exercises you can perform with your current equipment
            </p>
          </div>

          <div className="bg-astral-gray border border-astral-light rounded-lg p-4">
            <h3 className="font-bold text-white mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
              Missing Equipment
            </h3>
            <p className="text-sm text-astral-text-dim">
              Exercises requiring equipment you do not have, with suggested alternatives
            </p>
          </div>

          <div className="bg-astral-gray border border-astral-light rounded-lg p-4">
            <h3 className="font-bold text-white mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
              Bodyweight Exercises
            </h3>
            <p className="text-sm text-astral-text-dim">
              Exercises that require no equipment at all
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
