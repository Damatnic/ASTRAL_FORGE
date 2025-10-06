'use client'

/**
 * Program Detail View
 * Detailed program view with week breakdown, exercise substitution, and progress
 */

import React, { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Container, Stack, Grid, Card, Inline } from '@/components/ui/layout'
import {
  ArrowLeft,
  Calendar,
  Dumbbell,
  TrendingUp,
  Clock,
  Target,
  Play,
  Download,
  Share2,
  Edit,
  ChevronDown,
  ChevronUp,
  BarChart3,
} from 'lucide-react'

// Mock program data
const mockProgramData = {
  id: 1,
  name: 'Starting Strength',
  description: 'Classic beginner strength program focusing on compound lifts. Build a solid foundation of strength with proven programming principles.',
  category: 'Strength',
  difficulty: 'Beginner',
  duration: '12 weeks',
  daysPerWeek: 3,
  author: 'Mark Rippetoe',
  enrolledUsers: 1250,
  rating: 4.8,
  totalWorkouts: 36,
  completedWorkouts: 0,
  currentWeek: 1,
  weeks: [
    {
      weekNumber: 1,
      description: 'Foundation Week - Focus on form',
      workouts: [
        {
          day: 'Monday',
          name: 'Workout A',
          exercises: [
            { name: 'Squat', sets: 3, reps: 5, weight: 'Work up to working weight' },
            { name: 'Bench Press', sets: 3, reps: 5, weight: 'Work up to working weight' },
            { name: 'Deadlift', sets: 1, reps: 5, weight: 'Work up to working weight' },
          ],
        },
        {
          day: 'Wednesday',
          name: 'Workout B',
          exercises: [
            { name: 'Squat', sets: 3, reps: 5, weight: 'Work up to working weight' },
            { name: 'Overhead Press', sets: 3, reps: 5, weight: 'Work up to working weight' },
            { name: 'Power Clean', sets: 5, reps: 3, weight: 'Work up to working weight' },
          ],
        },
        {
          day: 'Friday',
          name: 'Workout A',
          exercises: [
            { name: 'Squat', sets: 3, reps: 5, weight: 'Work up to working weight' },
            { name: 'Bench Press', sets: 3, reps: 5, weight: 'Work up to working weight' },
            { name: 'Deadlift', sets: 1, reps: 5, weight: 'Work up to working weight' },
          ],
        },
      ],
    },
    // Additional weeks would be here...
  ],
  stats: {
    avgWorkoutDuration: '45 min',
    totalVolume: '124,500 lbs',
    avgIntensity: '75% 1RM',
    restDays: 4,
  },
}

export default function ProgramDetailPage() {
  const params = useParams()
  const [expandedWeek, setExpandedWeek] = useState<number>(1)
  const program = mockProgramData

  return (
    <Container size="2xl" className="py-8">
      <Stack spacing="lg">
        {/* Back Button */}
        <Link
          href="/programs"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Programs
        </Link>

        {/* Header */}
        <div>
          <Inline justify="between" align="start" className="mb-4">
            <div className="flex-1">
              <h1 className="text-display-md text-white mb-2">{program.name}</h1>
              <p className="text-body-lg text-gray-400 mb-4 max-w-3xl">
                {program.description}
              </p>
              <Inline spacing="md" wrap>
                <span className="px-3 py-1 bg-astral-light rounded-full text-body-sm text-gray-300">
                  {program.category}
                </span>
                <span className="px-3 py-1 bg-astral-light rounded-full text-body-sm text-green-400">
                  {program.difficulty}
                </span>
                <span className="text-body-sm text-gray-400">By {program.author}</span>
              </Inline>
            </div>

            {/* Action Buttons */}
            <Inline spacing="sm" className="flex-shrink-0">
              <button className="p-3 bg-astral-gray border border-astral-light rounded-lg hover:bg-astral-light transition-colors">
                <Share2 className="w-5 h-5 text-gray-400" />
              </button>
              <button className="p-3 bg-astral-gray border border-astral-light rounded-lg hover:bg-astral-light transition-colors">
                <Download className="w-5 h-5 text-gray-400" />
              </button>
              <button className="p-3 bg-astral-gray border border-astral-light rounded-lg hover:bg-astral-light transition-colors">
                <Edit className="w-5 h-5 text-gray-400" />
              </button>
            </Inline>
          </Inline>
        </div>

        {/* Stats Grid */}
        <Grid cols={2} responsive={{ md: 4 }} gap="md">
          <Card padding="md" variant="bordered">
            <Stack spacing="xs">
              <Inline spacing="xs" align="center">
                <Calendar className="w-4 h-4 text-astral-blue" />
                <span className="text-body-sm text-gray-400">Duration</span>
              </Inline>
              <p className="text-heading-md text-white">{program.duration}</p>
            </Stack>
          </Card>
          
          <Card padding="md" variant="bordered">
            <Stack spacing="xs">
              <Inline spacing="xs" align="center">
                <Dumbbell className="w-4 h-4 text-astral-purple" />
                <span className="text-body-sm text-gray-400">Frequency</span>
              </Inline>
              <p className="text-heading-md text-white">{program.daysPerWeek}x/week</p>
            </Stack>
          </Card>
          
          <Card padding="md" variant="bordered">
            <Stack spacing="xs">
              <Inline spacing="xs" align="center">
                <Clock className="w-4 h-4 text-warning" />
                <span className="text-body-sm text-gray-400">Avg Duration</span>
              </Inline>
              <p className="text-heading-md text-white">{program.stats.avgWorkoutDuration}</p>
            </Stack>
          </Card>
          
          <Card padding="md" variant="bordered">
            <Stack spacing="xs">
              <Inline spacing="xs" align="center">
                <Target className="w-4 h-4 text-success" />
                <span className="text-body-sm text-gray-400">Progress</span>
              </Inline>
              <p className="text-heading-md text-white">
                {program.completedWorkouts}/{program.totalWorkouts}
              </p>
            </Stack>
          </Card>
        </Grid>

        {/* Progress Bar */}
        <Card padding="lg" variant="elevated">
          <Stack spacing="md">
            <Inline justify="between" align="center">
              <div>
                <h3 className="text-heading-md text-white mb-1">Your Progress</h3>
                <p className="text-body-sm text-gray-400">
                  Week {program.currentWeek} of {program.duration.split(' ')[0]}
                </p>
              </div>
              <Link
                href="/workout/start"
                className="px-6 py-3 bg-gradient-to-r from-astral-blue to-astral-purple rounded-lg text-white hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                <Play className="w-5 h-5" />
                Start Workout
              </Link>
            </Inline>
            <div className="h-3 bg-astral-light rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-astral-blue to-astral-purple transition-all"
                style={{ width: `${(program.completedWorkouts / program.totalWorkouts) * 100}%` }}
              />
            </div>
          </Stack>
        </Card>

        {/* Week Breakdown */}
        <div>
          <h2 className="text-heading-lg text-white mb-4">Program Schedule</h2>
          <Stack spacing="md">
            {program.weeks.map((week) => (
              <WeekCard
                key={week.weekNumber}
                week={week}
                isExpanded={expandedWeek === week.weekNumber}
                onToggle={() => setExpandedWeek(
                  expandedWeek === week.weekNumber ? 0 : week.weekNumber
                )}
              />
            ))}
            
            {/* Placeholder for remaining weeks */}
            {Array.from({ length: 11 }, (_, i) => i + 2).map((weekNum) => (
              <Card key={weekNum} padding="lg" variant="bordered" className="opacity-50">
                <Inline justify="between" align="center">
                  <div>
                    <h3 className="text-heading-md text-white">Week {weekNum}</h3>
                    <p className="text-body-sm text-gray-400">Locked - Complete previous weeks</p>
                  </div>
                  <div className="w-6 h-6 bg-astral-light rounded-full flex items-center justify-center">
                    🔒
                  </div>
                </Inline>
              </Card>
            ))}
          </Stack>
        </div>

        {/* Additional Info */}
        <Grid cols={1} responsive={{ lg: 2 }} gap="lg">
          <Card padding="lg" variant="bordered">
            <Stack spacing="md">
              <h3 className="text-heading-md text-white">Program Overview</h3>
              <div className="space-y-3 text-body-md text-gray-400">
                <p>
                  Starting Strength is a comprehensive program designed for novice lifters
                  looking to build a foundation of strength through compound movements.
                </p>
                <p>
                  The program focuses on linear progression, adding weight each session
                  while maintaining proper form and technique.
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Progressive overload each workout</li>
                  <li>Focus on compound movements</li>
                  <li>Emphasis on proper form</li>
                  <li>Built-in deload weeks</li>
                </ul>
              </div>
            </Stack>
          </Card>

          <Card padding="lg" variant="bordered">
            <Stack spacing="md">
              <h3 className="text-heading-md text-white">Community Stats</h3>
              <div className="space-y-4">
                <div>
                  <Inline justify="between" className="mb-2">
                    <span className="text-body-sm text-gray-400">Completion Rate</span>
                    <span className="text-body-sm text-white font-medium">78%</span>
                  </Inline>
                  <div className="h-2 bg-astral-light rounded-full overflow-hidden">
                    <div className="h-full bg-success" style={{ width: '78%' }} />
                  </div>
                </div>
                <div>
                  <Inline justify="between" className="mb-2">
                    <span className="text-body-sm text-gray-400">User Rating</span>
                    <span className="text-body-sm text-white font-medium">{program.rating}/5.0</span>
                  </Inline>
                  <div className="h-2 bg-astral-light rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-400" style={{ width: `${(program.rating / 5) * 100}%` }} />
                  </div>
                </div>
                <div className="pt-3 border-t border-astral-light">
                  <p className="text-body-sm text-gray-400">
                    {program.enrolledUsers.toLocaleString()} users currently enrolled
                  </p>
                </div>
              </div>
            </Stack>
          </Card>
        </Grid>
      </Stack>
    </Container>
  )
}

// Week Card Component
function WeekCard({ 
  week, 
  isExpanded, 
  onToggle 
}: { 
  week: typeof mockProgramData.weeks[0]
  isExpanded: boolean
  onToggle: () => void
}) {
  return (
    <Card padding="none" variant="bordered">
      {/* Week Header */}
      <button
        onClick={onToggle}
        className="w-full p-6 text-left hover:bg-astral-light/50 transition-colors"
      >
        <Inline justify="between" align="center">
          <div>
            <h3 className="text-heading-md text-white mb-1">Week {week.weekNumber}</h3>
            <p className="text-body-sm text-gray-400">{week.description}</p>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </Inline>
      </button>

      {/* Week Details */}
      {isExpanded && (
        <div className="border-t border-astral-light">
          {week.workouts.map((workout, idx) => (
            <div
              key={idx}
              className="p-6 border-b border-astral-light last:border-b-0"
            >
              <Stack spacing="md">
                <Inline justify="between" align="center">
                  <div>
                    <h4 className="text-heading-sm text-white">{workout.day}</h4>
                    <p className="text-body-sm text-gray-400">{workout.name}</p>
                  </div>
                  <Link
                    href={`/workout/start?program=1&week=${week.weekNumber}&day=${idx}`}
                    className="px-4 py-2 bg-astral-blue rounded-lg text-white text-body-sm hover:opacity-90 transition-opacity"
                  >
                    Start
                  </Link>
                </Inline>

                {/* Exercise List */}
                <div className="space-y-2">
                  {workout.exercises.map((exercise, exIdx) => (
                    <div
                      key={exIdx}
                      className="flex items-center justify-between p-3 bg-astral-dark rounded-lg"
                    >
                      <span className="text-body-md text-white">{exercise.name}</span>
                      <span className="text-body-sm text-gray-400">
                        {exercise.sets} × {exercise.reps}
                      </span>
                    </div>
                  ))}
                </div>
              </Stack>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
