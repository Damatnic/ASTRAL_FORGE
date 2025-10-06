'use client'

/**
 * Workout History
 * Complete workout history with calendar view, filtering, and analytics
 */

import React, { useState } from 'react'
import Link from 'next/link'
import { Container, Stack, Grid, Card, Inline } from '@/components/ui/layout'
import {
  Calendar as CalendarIcon,
  List,
  TrendingUp,
  Download,
  Filter,
  Search,
  Trophy,
  Flame,
  Clock,
  Dumbbell,
  ChevronRight,
} from 'lucide-react'

// Mock workout history data
const mockWorkoutHistory = [
  {
    id: 1,
    date: '2024-01-03',
    dateDisplay: 'Today',
    programName: 'Starting Strength',
    workoutName: 'Workout A',
    duration: 52,
    exercises: 3,
    sets: 7,
    totalVolume: 4250,
    avgRpe: 8.2,
    completed: true,
    personalRecords: 0,
  },
  {
    id: 2,
    date: '2024-01-01',
    dateDisplay: '2 days ago',
    programName: 'Starting Strength',
    workoutName: 'Workout B',
    duration: 48,
    exercises: 3,
    sets: 11,
    totalVolume: 3890,
    avgRpe: 7.8,
    completed: true,
    personalRecords: 1,
  },
  {
    id: 3,
    date: '2023-12-29',
    dateDisplay: '5 days ago',
    programName: 'Starting Strength',
    workoutName: 'Workout A',
    duration: 55,
    exercises: 3,
    sets: 7,
    totalVolume: 4100,
    avgRpe: 8.5,
    completed: true,
    personalRecords: 0,
  },
  {
    id: 4,
    date: '2023-12-27',
    dateDisplay: '1 week ago',
    programName: 'Starting Strength',
    workoutName: 'Workout B',
    duration: 50,
    exercises: 3,
    sets: 11,
    totalVolume: 3750,
    avgRpe: 7.5,
    completed: true,
    personalRecords: 0,
  },
  {
    id: 5,
    date: '2023-12-25',
    dateDisplay: '1 week ago',
    programName: 'Starting Strength',
    workoutName: 'Workout A',
    duration: 58,
    exercises: 3,
    sets: 7,
    totalVolume: 3950,
    avgRpe: 8.8,
    completed: true,
    personalRecords: 1,
  },
]

const weeklyStats = {
  workoutsCompleted: 4,
  totalDuration: 213,
  totalVolume: 15990,
  avgRpe: 8.2,
  streak: 7,
}

export default function HistoryPage() {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterProgram, setFilterProgram] = useState('all')

  const filteredWorkouts = mockWorkoutHistory.filter((workout) => {
    const matchesSearch =
      workout.workoutName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workout.programName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesProgram = filterProgram === 'all' || workout.programName === filterProgram
    return matchesSearch && matchesProgram
  })

  return (
    <Container size="2xl" className="py-8">
      <Stack spacing="lg">
        {/* Header */}
        <div>
          <h1 className="text-display-sm text-white mb-2">Workout History</h1>
          <p className="text-body-lg text-gray-400">
            Track your training journey and celebrate your progress
          </p>
        </div>

        {/* Weekly Stats */}
        <Grid cols={2} responsive={{ md: 4 }} gap="md">
          <Card padding="md" variant="bordered">
            <Stack spacing="xs">
              <Inline spacing="xs" align="center">
                <Dumbbell className="w-4 h-4 text-astral-blue" />
                <span className="text-body-sm text-gray-400">This Week</span>
              </Inline>
              <p className="text-heading-lg text-white">{weeklyStats.workoutsCompleted}</p>
            </Stack>
          </Card>

          <Card padding="md" variant="bordered">
            <Stack spacing="xs">
              <Inline spacing="xs" align="center">
                <Clock className="w-4 h-4 text-astral-purple" />
                <span className="text-body-sm text-gray-400">Total Time</span>
              </Inline>
              <p className="text-heading-lg text-white">{weeklyStats.totalDuration} min</p>
            </Stack>
          </Card>

          <Card padding="md" variant="bordered">
            <Stack spacing="xs">
              <Inline spacing="xs" align="center">
                <TrendingUp className="w-4 h-4 text-success" />
                <span className="text-body-sm text-gray-400">Total Volume</span>
              </Inline>
              <p className="text-heading-lg text-white">
                {(weeklyStats.totalVolume / 1000).toFixed(1)}k lbs
              </p>
            </Stack>
          </Card>

          <Card padding="md" variant="bordered">
            <Stack spacing="xs">
              <Inline spacing="xs" align="center">
                <Flame className="w-4 h-4 text-warning" />
                <span className="text-body-sm text-gray-400">Streak</span>
              </Inline>
              <p className="text-heading-lg text-white">{weeklyStats.streak} days</p>
            </Stack>
          </Card>
        </Grid>

        {/* Search & Filters */}
        <Inline justify="between" align="center" wrap className="gap-4">
          {/* Search */}
          <div className="relative flex-1 min-w-[280px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="search"
              placeholder="Search workouts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-astral-gray border border-astral-light rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-astral-blue focus:border-transparent"
            />
          </div>

          {/* View Toggle & Actions */}
          <Inline spacing="sm">
            {/* View Mode Toggle */}
            <div className="bg-astral-gray border border-astral-light rounded-lg p-1 flex">
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded text-body-sm transition-colors ${
                  viewMode === 'list'
                    ? 'bg-astral-blue text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-4 py-2 rounded text-body-sm transition-colors ${
                  viewMode === 'calendar'
                    ? 'bg-astral-blue text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <CalendarIcon className="w-4 h-4" />
              </button>
            </div>

            <button className="px-4 py-3 bg-astral-gray border border-astral-light rounded-lg text-white hover:bg-astral-light transition-colors flex items-center gap-2">
              <Download className="w-5 h-5" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </Inline>
        </Inline>

        {/* Program Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {['all', 'Starting Strength', 'PPL', 'Custom'].map((program) => (
            <button
              key={program}
              onClick={() => setFilterProgram(program)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                filterProgram === program
                  ? 'bg-gradient-to-r from-astral-blue to-astral-purple text-white'
                  : 'bg-astral-gray text-gray-400 hover:text-white hover:bg-astral-light'
              }`}
            >
              {program === 'all' ? 'All Programs' : program}
            </button>
          ))}
        </div>

        {/* Content */}
        {viewMode === 'list' ? (
          <Stack spacing="sm">
            {filteredWorkouts.length > 0 ? (
              filteredWorkouts.map((workout) => (
                <WorkoutCard key={workout.id} workout={workout} />
              ))
            ) : (
              <Card padding="xl" className="text-center">
                <Stack spacing="md" align="center">
                  <div className="w-16 h-16 bg-astral-light rounded-full flex items-center justify-center">
                    <Dumbbell className="w-8 h-8 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-heading-md text-white mb-2">No workouts found</h3>
                    <p className="text-body-md text-gray-400">
                      Try adjusting your search or filters
                    </p>
                  </div>
                </Stack>
              </Card>
            )}
          </Stack>
        ) : (
          <Card padding="lg" variant="bordered">
            <div className="h-96 flex items-center justify-center">
              <Stack spacing="md" align="center">
                <CalendarIcon className="w-16 h-16 text-gray-400" />
                <p className="text-body-lg text-gray-400">Calendar View Coming Soon</p>
              </Stack>
            </div>
          </Card>
        )}

        {/* Monthly Summary */}
        <Card padding="lg" variant="bordered">
          <Stack spacing="md">
            <h3 className="text-heading-md text-white">This Month</h3>
            <Grid cols={2} responsive={{ md: 4 }} gap="md">
              <div>
                <p className="text-body-sm text-gray-400 mb-1">Total Workouts</p>
                <p className="text-heading-md text-white">18</p>
              </div>
              <div>
                <p className="text-body-sm text-gray-400 mb-1">Total Volume</p>
                <p className="text-heading-md text-white">72.5k lbs</p>
              </div>
              <div>
                <p className="text-body-sm text-gray-400 mb-1">Avg Duration</p>
                <p className="text-heading-md text-white">53 min</p>
              </div>
              <div>
                <p className="text-body-sm text-gray-400 mb-1">Personal Records</p>
                <p className="text-heading-md text-white">4</p>
              </div>
            </Grid>
          </Stack>
        </Card>
      </Stack>
    </Container>
  )
}

// Workout Card Component
function WorkoutCard({ workout }: { workout: typeof mockWorkoutHistory[0] }) {
  return (
    <Link href={`/history/${workout.id}`}>
      <Card padding="md" hover variant="bordered">
        <Inline justify="between" align="start" className="gap-4">
          {/* Left Section */}
          <div className="flex-1 min-w-0">
            <Inline spacing="sm" align="center" className="mb-2">
              <h3 className="text-heading-sm text-white">{workout.workoutName}</h3>
              {workout.personalRecords > 0 && (
                <div className="px-2 py-0.5 bg-yellow-400/20 rounded-full flex items-center gap-1">
                  <Trophy className="w-3 h-3 text-yellow-400" />
                  <span className="text-body-xs text-yellow-400 font-medium">
                    {workout.personalRecords} PR
                  </span>
                </div>
              )}
            </Inline>

            <p className="text-body-sm text-gray-400 mb-3">
              {workout.programName} • {workout.dateDisplay}
            </p>

            {/* Stats Grid */}
            <Grid cols={2} responsive={{ sm: 4 }} gap="md" className="text-body-sm">
              <Inline spacing="xs" align="center">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300">{workout.duration} min</span>
              </Inline>
              <Inline spacing="xs" align="center">
                <Dumbbell className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300">{workout.exercises} exercises</span>
              </Inline>
              <Inline spacing="xs" align="center">
                <TrendingUp className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300">{workout.totalVolume.toLocaleString()} lbs</span>
              </Inline>
              <Inline spacing="xs" align="center">
                <span className="text-gray-400">RPE</span>
                <span className="text-gray-300">{workout.avgRpe}</span>
              </Inline>
            </Grid>
          </div>

          {/* Right Section - Arrow */}
          <div className="flex-shrink-0 self-center">
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </Inline>
      </Card>
    </Link>
  )
}
