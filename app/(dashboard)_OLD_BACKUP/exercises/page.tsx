'use client'

/**
 * Exercise Library
 * Comprehensive exercise database with search, filtering, and categorization
 */

import React, { useState } from 'react'
import Link from 'next/link'
import { Container, Stack, Grid, Card, Inline } from '@/components/ui/layout'
import {
  Search,
  Filter,
  Plus,
  Dumbbell,
  TrendingUp,
  BarChart3,
  Video,
  Star,
  ChevronRight,
} from 'lucide-react'

// Mock exercise data
const muscleGroups = [
  'All',
  'Chest',
  'Back',
  'Shoulders',
  'Arms',
  'Legs',
  'Core',
  'Full Body',
]

const equipmentTypes = [
  'All',
  'Barbell',
  'Dumbbell',
  'Bodyweight',
  'Machine',
  'Cable',
  'Kettlebell',
]

const difficultyLevels = ['All', 'Beginner', 'Intermediate', 'Advanced']

const mockExercises = [
  {
    id: 1,
    name: 'Barbell Squat',
    primaryMuscle: 'Legs',
    secondaryMuscles: ['Core', 'Back'],
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    type: 'Compound',
    hasVideo: true,
    personalRecords: { weight: 315, reps: 5 },
    lastPerformed: '2 days ago',
    totalSets: 156,
    avgRpe: 8.2,
    favorite: true,
  },
  {
    id: 2,
    name: 'Bench Press',
    primaryMuscle: 'Chest',
    secondaryMuscles: ['Shoulders', 'Arms'],
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    type: 'Compound',
    hasVideo: true,
    personalRecords: { weight: 225, reps: 5 },
    lastPerformed: '3 days ago',
    totalSets: 142,
    avgRpe: 8.5,
    favorite: true,
  },
  {
    id: 3,
    name: 'Deadlift',
    primaryMuscle: 'Back',
    secondaryMuscles: ['Legs', 'Core'],
    equipment: 'Barbell',
    difficulty: 'Advanced',
    type: 'Compound',
    hasVideo: true,
    personalRecords: { weight: 405, reps: 3 },
    lastPerformed: '4 days ago',
    totalSets: 98,
    avgRpe: 9.1,
    favorite: true,
  },
  {
    id: 4,
    name: 'Pull-ups',
    primaryMuscle: 'Back',
    secondaryMuscles: ['Arms'],
    equipment: 'Bodyweight',
    difficulty: 'Intermediate',
    type: 'Compound',
    hasVideo: true,
    personalRecords: { weight: 45, reps: 12 },
    lastPerformed: '1 week ago',
    totalSets: 87,
    avgRpe: 7.8,
    favorite: false,
  },
  {
    id: 5,
    name: 'Overhead Press',
    primaryMuscle: 'Shoulders',
    secondaryMuscles: ['Arms', 'Core'],
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    type: 'Compound',
    hasVideo: true,
    personalRecords: { weight: 135, reps: 6 },
    lastPerformed: '5 days ago',
    totalSets: 76,
    avgRpe: 8.3,
    favorite: false,
  },
  {
    id: 6,
    name: 'Dumbbell Row',
    primaryMuscle: 'Back',
    secondaryMuscles: ['Arms'],
    equipment: 'Dumbbell',
    difficulty: 'Beginner',
    type: 'Compound',
    hasVideo: true,
    personalRecords: { weight: 80, reps: 10 },
    lastPerformed: '1 week ago',
    totalSets: 64,
    avgRpe: 7.5,
    favorite: false,
  },
]

export default function ExercisesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMuscle, setSelectedMuscle] = useState('All')
  const [selectedEquipment, setSelectedEquipment] = useState('All')
  const [selectedDifficulty, setSelectedDifficulty] = useState('All')
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [sortBy, setSortBy] = useState<'name' | 'recent' | 'pr'>('name')

  const filteredExercises = mockExercises
    .filter((exercise) => {
      const matchesSearch =
        exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exercise.primaryMuscle.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesMuscle = selectedMuscle === 'All' || exercise.primaryMuscle === selectedMuscle
      const matchesEquipment = selectedEquipment === 'All' || exercise.equipment === selectedEquipment
      const matchesDifficulty = selectedDifficulty === 'All' || exercise.difficulty === selectedDifficulty
      const matchesFavorite = !showFavoritesOnly || exercise.favorite

      return matchesSearch && matchesMuscle && matchesEquipment && matchesDifficulty && matchesFavorite
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'recent') return 0 // Would use actual date
      if (sortBy === 'pr') return b.personalRecords.weight - a.personalRecords.weight
      return 0
    })

  return (
    <Container size="2xl" className="py-8">
      <Stack spacing="lg">
        {/* Header */}
        <div>
          <h1 className="text-display-sm text-white mb-2">Exercise Library</h1>
          <p className="text-body-lg text-gray-400">
            Browse {mockExercises.length} exercises with detailed instructions and tracking
          </p>
        </div>

        {/* Search & Actions */}
        <Inline justify="between" align="center" wrap className="gap-4">
          {/* Search Bar */}
          <div className="relative flex-1 min-w-[280px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="search"
              placeholder="Search exercises..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-astral-gray border border-astral-light rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-astral-blue focus:border-transparent"
            />
          </div>

          {/* Action Buttons */}
          <Inline spacing="sm">
            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`px-4 py-3 rounded-lg transition-colors flex items-center gap-2 ${
                showFavoritesOnly
                  ? 'bg-gradient-to-r from-astral-blue to-astral-purple text-white'
                  : 'bg-astral-gray border border-astral-light text-white hover:bg-astral-light'
              }`}
            >
              <Star className={`w-5 h-5 ${showFavoritesOnly ? 'fill-white' : ''}`} />
              <span className="hidden sm:inline">Favorites</span>
            </button>

            <Link
              href="/exercises/new"
              className="px-4 py-3 bg-gradient-to-r from-astral-blue to-astral-purple rounded-lg text-white hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Add Exercise</span>
            </Link>
          </Inline>
        </Inline>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Muscle Group Filter */}
          <div>
            <label className="block text-body-sm text-gray-400 mb-2">Muscle Group</label>
            <select
              value={selectedMuscle}
              onChange={(e) => setSelectedMuscle(e.target.value)}
              className="w-full px-4 py-2 bg-astral-gray border border-astral-light rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-astral-blue"
            >
              {muscleGroups.map((muscle) => (
                <option key={muscle} value={muscle}>
                  {muscle}
                </option>
              ))}
            </select>
          </div>

          {/* Equipment Filter */}
          <div>
            <label className="block text-body-sm text-gray-400 mb-2">Equipment</label>
            <select
              value={selectedEquipment}
              onChange={(e) => setSelectedEquipment(e.target.value)}
              className="w-full px-4 py-2 bg-astral-gray border border-astral-light rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-astral-blue"
            >
              {equipmentTypes.map((equipment) => (
                <option key={equipment} value={equipment}>
                  {equipment}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div>
            <label className="block text-body-sm text-gray-400 mb-2">Difficulty</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-4 py-2 bg-astral-gray border border-astral-light rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-astral-blue"
            >
              {difficultyLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sort Options */}
        <Inline spacing="sm">
          <span className="text-body-sm text-gray-400">Sort by:</span>
          {(['name', 'recent', 'pr'] as const).map((option) => (
            <button
              key={option}
              onClick={() => setSortBy(option)}
              className={`px-3 py-1.5 rounded text-body-sm transition-colors ${
                sortBy === option
                  ? 'bg-astral-blue text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {option === 'name' && 'Name'}
              {option === 'recent' && 'Recent'}
              {option === 'pr' && 'Personal Record'}
            </button>
          ))}
        </Inline>

        {/* Exercise List */}
        {filteredExercises.length > 0 ? (
          <Stack spacing="sm">
            {filteredExercises.map((exercise) => (
              <ExerciseCard key={exercise.id} exercise={exercise} />
            ))}
          </Stack>
        ) : (
          <Card padding="xl" className="text-center">
            <Stack spacing="md" align="center">
              <div className="w-16 h-16 bg-astral-light rounded-full flex items-center justify-center">
                <Dumbbell className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <h3 className="text-heading-md text-white mb-2">No exercises found</h3>
                <p className="text-body-md text-gray-400">
                  Try adjusting your filters or search query
                </p>
              </div>
            </Stack>
          </Card>
        )}

        {/* Quick Stats */}
        <Grid cols={2} responsive={{ md: 4 }} gap="md">
          <Card padding="md" variant="bordered">
            <Stack spacing="xs">
              <p className="text-body-sm text-gray-400">Total Exercises</p>
              <p className="text-heading-lg text-white">{mockExercises.length}</p>
            </Stack>
          </Card>
          <Card padding="md" variant="bordered">
            <Stack spacing="xs">
              <p className="text-body-sm text-gray-400">Favorites</p>
              <p className="text-heading-lg text-white">
                {mockExercises.filter((e) => e.favorite).length}
              </p>
            </Stack>
          </Card>
          <Card padding="md" variant="bordered">
            <Stack spacing="xs">
              <p className="text-body-sm text-gray-400">Total Sets Logged</p>
              <p className="text-heading-lg text-white">
                {mockExercises.reduce((sum, e) => sum + e.totalSets, 0)}
              </p>
            </Stack>
          </Card>
          <Card padding="md" variant="bordered">
            <Stack spacing="xs">
              <p className="text-body-sm text-gray-400">Avg RPE</p>
              <p className="text-heading-lg text-white">
                {(mockExercises.reduce((sum, e) => sum + e.avgRpe, 0) / mockExercises.length).toFixed(1)}
              </p>
            </Stack>
          </Card>
        </Grid>
      </Stack>
    </Container>
  )
}

// Exercise Card Component
function ExerciseCard({ exercise }: { exercise: typeof mockExercises[0] }) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'text-green-400'
      case 'Intermediate':
        return 'text-yellow-400'
      case 'Advanced':
        return 'text-red-400'
      default:
        return 'text-gray-400'
    }
  }

  return (
    <Link href={`/exercises/${exercise.id}`}>
      <Card padding="md" hover variant="bordered">
        <Inline justify="between" align="center" className="gap-4">
          {/* Left Section - Exercise Info */}
          <div className="flex-1 min-w-0">
            <Inline spacing="sm" align="center" className="mb-2">
              <h3 className="text-heading-sm text-white">{exercise.name}</h3>
              {exercise.favorite && (
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 flex-shrink-0" />
              )}
              {exercise.hasVideo && (
                <Video className="w-4 h-4 text-astral-blue flex-shrink-0" />
              )}
            </Inline>
            
            <Inline spacing="md" wrap className="text-body-sm text-gray-400">
              <span>{exercise.primaryMuscle}</span>
              <span>•</span>
              <span>{exercise.equipment}</span>
              <span>•</span>
              <span className={getDifficultyColor(exercise.difficulty)}>
                {exercise.difficulty}
              </span>
            </Inline>
          </div>

          {/* Right Section - Stats */}
          <div className="hidden md:flex items-center gap-6">
            <div className="text-right">
              <p className="text-body-xs text-gray-400">Personal Record</p>
              <p className="text-body-md text-white font-medium">
                {exercise.personalRecords.weight} lbs × {exercise.personalRecords.reps}
              </p>
            </div>
            
            <div className="text-right">
              <p className="text-body-xs text-gray-400">Last Performed</p>
              <p className="text-body-md text-white">{exercise.lastPerformed}</p>
            </div>

            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>

          {/* Mobile - Just show arrow */}
          <ChevronRight className="w-5 h-5 text-gray-400 md:hidden" />
        </Inline>
      </Card>
    </Link>
  )
}
