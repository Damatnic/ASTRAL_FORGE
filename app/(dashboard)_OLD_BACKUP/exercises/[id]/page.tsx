'use client'

/**
 * Exercise Detail View
 * Single exercise view with analytics, form tips, and performance history
 */

import React, { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Container, Stack, Grid, Card, Inline } from '@/components/ui/layout'
import {
  ArrowLeft,
  Star,
  Video,
  TrendingUp,
  Calendar,
  Target,
  BarChart3,
  Play,
  Edit,
  Share2,
  Lightbulb,
  AlertCircle,
} from 'lucide-react'

// Mock exercise detail data
const mockExerciseDetail = {
  id: 1,
  name: 'Barbell Squat',
  description: 'The king of all exercises. A fundamental compound movement that builds overall strength and muscle mass throughout the lower body.',
  primaryMuscle: 'Quadriceps',
  secondaryMuscles: ['Glutes', 'Hamstrings', 'Core', 'Lower Back'],
  equipment: 'Barbell',
  difficulty: 'Intermediate',
  type: 'Compound',
  hasVideo: true,
  favorite: true,
  instructions: [
    'Set the barbell at chest height on a rack',
    'Step under the bar and position it on your upper back',
    'Grip the bar with hands slightly wider than shoulder-width',
    'Unrack the bar and step back with feet shoulder-width apart',
    'Keep chest up, core tight, and descend by breaking at the hips and knees',
    'Lower until thighs are at least parallel to the ground',
    'Drive through heels to return to starting position',
  ],
  formTips: [
    'Keep your knees tracking over your toes',
    'Maintain a neutral spine throughout the movement',
    'Push your hips back as you descend',
    'Keep your weight on your heels',
    'Take a deep breath before descending',
  ],
  commonMistakes: [
    'Knees caving inward',
    'Excessive forward lean',
    'Not going deep enough',
    'Rising on toes',
    'Rounding the lower back',
  ],
  personalRecords: {
    maxWeight: 315,
    maxReps: 5,
    estimatedMax: 355,
    bestVolume: 4725, // lbs
  },
  stats: {
    totalSets: 156,
    totalReps: 780,
    totalVolume: 124500,
    avgRpe: 8.2,
    lastPerformed: '2 days ago',
    firstPerformed: '6 months ago',
    sessionsUsed: 52,
  },
  recentSets: [
    { date: '2 days ago', weight: 275, reps: 5, rpe: 8 },
    { date: '2 days ago', weight: 275, reps: 5, rpe: 8.5 },
    { date: '2 days ago', weight: 275, reps: 4, rpe: 9 },
    { date: '5 days ago', weight: 265, reps: 5, rpe: 7.5 },
    { date: '5 days ago', weight: 265, reps: 5, rpe: 8 },
  ],
  progressionData: [
    { week: 'Week 1', avgWeight: 225 },
    { week: 'Week 2', avgWeight: 235 },
    { week: 'Week 3', avgWeight: 245 },
    { week: 'Week 4', avgWeight: 255 },
    { week: 'Week 5', avgWeight: 265 },
    { week: 'Week 6', avgWeight: 275 },
  ],
  alternatives: [
    { id: 2, name: 'Front Squat', reason: 'More quad emphasis' },
    { id: 3, name: 'Goblet Squat', reason: 'Better for beginners' },
    { id: 4, name: 'Safety Bar Squat', reason: 'Easier on shoulders' },
  ],
}

export default function ExerciseDetailPage() {
  const params = useParams()
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'history'>('overview')
  const exercise = mockExerciseDetail

  return (
    <Container size="2xl" className="py-8">
      <Stack spacing="lg">
        {/* Back Button */}
        <Link
          href="/exercises"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Exercises
        </Link>

        {/* Header */}
        <div>
          <Inline justify="between" align="start" className="mb-4">
            <div className="flex-1">
              <Inline spacing="sm" align="center" className="mb-2">
                <h1 className="text-display-md text-white">{exercise.name}</h1>
                <button className="p-2 hover:bg-astral-light rounded-lg transition-colors">
                  <Star className={`w-6 h-6 ${exercise.favorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
                </button>
              </Inline>
              <p className="text-body-lg text-gray-400 mb-4 max-w-3xl">
                {exercise.description}
              </p>
              <Inline spacing="md" wrap>
                <span className="px-3 py-1 bg-astral-light rounded-full text-body-sm text-gray-300">
                  {exercise.primaryMuscle}
                </span>
                <span className="px-3 py-1 bg-astral-light rounded-full text-body-sm text-gray-300">
                  {exercise.equipment}
                </span>
                <span className="px-3 py-1 bg-astral-light rounded-full text-body-sm text-yellow-400">
                  {exercise.difficulty}
                </span>
                <span className="px-3 py-1 bg-astral-light rounded-full text-body-sm text-gray-300">
                  {exercise.type}
                </span>
              </Inline>
            </div>

            {/* Action Buttons */}
            <Inline spacing="sm" className="flex-shrink-0">
              <button className="p-3 bg-astral-gray border border-astral-light rounded-lg hover:bg-astral-light transition-colors">
                <Share2 className="w-5 h-5 text-gray-400" />
              </button>
              <button className="p-3 bg-astral-gray border border-astral-light rounded-lg hover:bg-astral-light transition-colors">
                <Edit className="w-5 h-5 text-gray-400" />
              </button>
              {exercise.hasVideo && (
                <button className="px-4 py-3 bg-gradient-to-r from-astral-blue to-astral-purple rounded-lg text-white hover:opacity-90 transition-opacity flex items-center gap-2">
                  <Video className="w-5 h-5" />
                  <span className="hidden sm:inline">Watch Video</span>
                </button>
              )}
            </Inline>
          </Inline>
        </div>

        {/* Personal Records */}
        <Grid cols={2} responsive={{ md: 4 }} gap="md">
          <Card padding="md" variant="bordered">
            <Stack spacing="xs">
              <span className="text-body-sm text-gray-400">Max Weight</span>
              <p className="text-heading-lg text-white">{exercise.personalRecords.maxWeight} lbs</p>
            </Stack>
          </Card>
          <Card padding="md" variant="bordered">
            <Stack spacing="xs">
              <span className="text-body-sm text-gray-400">Max Reps</span>
              <p className="text-heading-lg text-white">{exercise.personalRecords.maxReps}</p>
            </Stack>
          </Card>
          <Card padding="md" variant="bordered">
            <Stack spacing="xs">
              <span className="text-body-sm text-gray-400">Est. 1RM</span>
              <p className="text-heading-lg text-white">{exercise.personalRecords.estimatedMax} lbs</p>
            </Stack>
          </Card>
          <Card padding="md" variant="bordered">
            <Stack spacing="xs">
              <span className="text-body-sm text-gray-400">Best Volume</span>
              <p className="text-heading-lg text-white">
                {exercise.personalRecords.bestVolume.toLocaleString()} lbs
              </p>
            </Stack>
          </Card>
        </Grid>

        {/* Tabs */}
        <div className="border-b border-astral-light">
          <Inline spacing="md">
            {(['overview', 'analytics', 'history'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 px-2 text-body-md font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-astral-blue text-white'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </Inline>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <Grid cols={1} responsive={{ lg: 2 }} gap="lg">
            {/* Instructions */}
            <Card padding="lg" variant="bordered">
              <Stack spacing="md">
                <h3 className="text-heading-md text-white">How to Perform</h3>
                <ol className="space-y-2 text-body-md text-gray-400">
                  {exercise.instructions.map((step, idx) => (
                    <li key={idx} className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-astral-blue/20 text-astral-blue rounded-full flex items-center justify-center text-body-sm font-medium">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </Stack>
            </Card>

            {/* Form Tips & Mistakes */}
            <Stack spacing="md">
              <Card padding="lg" variant="bordered">
                <Stack spacing="md">
                  <Inline spacing="sm" align="center">
                    <Lightbulb className="w-5 h-5 text-success" />
                    <h3 className="text-heading-md text-white">Form Tips</h3>
                  </Inline>
                  <ul className="space-y-2 text-body-md text-gray-400">
                    {exercise.formTips.map((tip, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span className="text-success">✓</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </Stack>
              </Card>

              <Card padding="lg" variant="bordered">
                <Stack spacing="md">
                  <Inline spacing="sm" align="center">
                    <AlertCircle className="w-5 h-5 text-warning" />
                    <h3 className="text-heading-md text-white">Common Mistakes</h3>
                  </Inline>
                  <ul className="space-y-2 text-body-md text-gray-400">
                    {exercise.commonMistakes.map((mistake, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span className="text-warning">✗</span>
                        <span>{mistake}</span>
                      </li>
                    ))}
                  </ul>
                </Stack>
              </Card>
            </Stack>

            {/* Secondary Muscles & Alternatives */}
            <Card padding="lg" variant="bordered">
              <Stack spacing="md">
                <h3 className="text-heading-md text-white">Muscle Groups</h3>
                <div>
                  <p className="text-body-sm text-gray-400 mb-2">Primary</p>
                  <span className="px-3 py-1 bg-astral-blue/20 text-astral-blue rounded-full text-body-sm">
                    {exercise.primaryMuscle}
                  </span>
                </div>
                <div>
                  <p className="text-body-sm text-gray-400 mb-2">Secondary</p>
                  <Inline spacing="xs" wrap>
                    {exercise.secondaryMuscles.map((muscle) => (
                      <span
                        key={muscle}
                        className="px-3 py-1 bg-astral-light text-gray-300 rounded-full text-body-sm"
                      >
                        {muscle}
                      </span>
                    ))}
                  </Inline>
                </div>
              </Stack>
            </Card>

            <Card padding="lg" variant="bordered">
              <Stack spacing="md">
                <h3 className="text-heading-md text-white">Alternative Exercises</h3>
                <Stack spacing="sm">
                  {exercise.alternatives.map((alt) => (
                    <Link
                      key={alt.id}
                      href={`/exercises/${alt.id}`}
                      className="p-3 bg-astral-dark rounded-lg hover:bg-astral-light transition-colors"
                    >
                      <Inline justify="between" align="center">
                        <div>
                          <p className="text-body-md text-white">{alt.name}</p>
                          <p className="text-body-sm text-gray-400">{alt.reason}</p>
                        </div>
                        <ArrowLeft className="w-4 h-4 text-gray-400 rotate-180" />
                      </Inline>
                    </Link>
                  ))}
                </Stack>
              </Stack>
            </Card>
          </Grid>
        )}

        {activeTab === 'analytics' && (
          <Grid cols={1} gap="lg">
            <Card padding="lg" variant="bordered">
              <Stack spacing="md">
                <h3 className="text-heading-md text-white">Strength Progression</h3>
                <div className="h-64 bg-astral-dark rounded-lg flex items-center justify-center">
                  <p className="text-gray-400">Chart: Weight progression over time</p>
                </div>
              </Stack>
            </Card>

            <Grid cols={1} responsive={{ md: 2 }} gap="lg">
              <Card padding="lg" variant="bordered">
                <Stack spacing="md">
                  <h3 className="text-heading-md text-white">Volume Progression</h3>
                  <div className="h-48 bg-astral-dark rounded-lg flex items-center justify-center">
                    <p className="text-gray-400">Chart: Volume trends</p>
                  </div>
                </Stack>
              </Card>

              <Card padding="lg" variant="bordered">
                <Stack spacing="md">
                  <h3 className="text-heading-md text-white">Statistics</h3>
                  <div className="space-y-3">
                    <Inline justify="between">
                      <span className="text-body-sm text-gray-400">Total Sets</span>
                      <span className="text-body-md text-white font-medium">{exercise.stats.totalSets}</span>
                    </Inline>
                    <Inline justify="between">
                      <span className="text-body-sm text-gray-400">Total Reps</span>
                      <span className="text-body-md text-white font-medium">{exercise.stats.totalReps}</span>
                    </Inline>
                    <Inline justify="between">
                      <span className="text-body-sm text-gray-400">Total Volume</span>
                      <span className="text-body-md text-white font-medium">
                        {exercise.stats.totalVolume.toLocaleString()} lbs
                      </span>
                    </Inline>
                    <Inline justify="between">
                      <span className="text-body-sm text-gray-400">Avg RPE</span>
                      <span className="text-body-md text-white font-medium">{exercise.stats.avgRpe}</span>
                    </Inline>
                    <Inline justify="between">
                      <span className="text-body-sm text-gray-400">Sessions</span>
                      <span className="text-body-md text-white font-medium">{exercise.stats.sessionsUsed}</span>
                    </Inline>
                  </div>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        )}

        {activeTab === 'history' && (
          <Card padding="lg" variant="bordered">
            <Stack spacing="md">
              <h3 className="text-heading-md text-white">Recent Sets</h3>
              <div className="space-y-2">
                {exercise.recentSets.map((set, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-astral-dark rounded-lg"
                  >
                    <Inline justify="between" align="center">
                      <div>
                        <p className="text-body-md text-white">
                          {set.weight} lbs × {set.reps} reps
                        </p>
                        <p className="text-body-sm text-gray-400">{set.date}</p>
                      </div>
                      <span className="px-3 py-1 bg-astral-light rounded-full text-body-sm text-gray-300">
                        RPE {set.rpe}
                      </span>
                    </Inline>
                  </div>
                ))}
              </div>
            </Stack>
          </Card>
        )}
      </Stack>
    </Container>
  )
}
