'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { ArrowLeft, Plus, Play, Check, Search, Link as LinkIcon } from 'lucide-react'
import { ChartSkeleton } from '@/components/chart-skeleton'
import type { ExerciseData, WorkoutSet } from '@/components/enhanced-set-log'
import type { SupersetModeConfig } from '@/components/advanced-superset-modes'

// Dynamic imports for heavy components (performance optimization)
const EnhancedSetLog = dynamic(
  () => import('@/components/enhanced-set-log').then(mod => ({ default: mod.EnhancedSetLog })),
  {
    loading: () => <ChartSkeleton />,
    ssr: false,
  }
)

const RestTimerWidget = dynamic(
  () => import('@/components/rest-timer-widget').then(mod => ({ default: mod.RestTimerWidget })),
  {
    loading: () => <div className="animate-pulse bg-gray-700 rounded-lg h-20" />,
    ssr: false,
  }
)

const WorkoutSummaryCard = dynamic(
  () => import('@/components/workout-summary-card').then(mod => ({ default: mod.WorkoutSummaryCard })),
  {
    loading: () => <ChartSkeleton />,
    ssr: false,
  }
)

const SupersetGroup = dynamic(
  () => import('@/components/superset-group').then(mod => ({ default: mod.SupersetGroup })),
  {
    loading: () => <ChartSkeleton />,
    ssr: false,
  }
)

const PlateCalculatorModal = dynamic(
  () => import('@/components/plate-calculator-modal').then(mod => ({ default: mod.PlateCalculatorModal })),
  {
    loading: () => <div className="animate-pulse bg-gray-700 rounded-lg h-96" />,
    ssr: false,
  }
)

const PlateCalculatorEnhanced = dynamic(
  () => import('@/components/plate-calculator-enhanced').then(mod => ({ default: mod.PlateCalculatorEnhanced })),
  {
    loading: () => <div className="animate-pulse bg-gray-700 rounded-lg h-96" />,
    ssr: false,
  }
)

const SupersetTemplates = dynamic(
  () => import('@/components/superset-templates').then(mod => ({ default: mod.SupersetTemplates })),
  {
    loading: () => <ChartSkeleton />,
    ssr: false,
  }
)

const AdvancedSupersetModes = dynamic(
  () => import('@/components/advanced-superset-modes').then(mod => ({ default: mod.AdvancedSupersetModes })),
  {
    loading: () => <ChartSkeleton />,
    ssr: false,
  }
)

const CustomTemplateCreator = dynamic(
  () => import('@/components/custom-template-creator').then(mod => ({ default: mod.CustomTemplateCreator })),
  {
    loading: () => <ChartSkeleton />,
    ssr: false,
  }
)

const PersonalWeightPresets = dynamic(
  () => import('@/components/personal-weight-presets').then(mod => ({ default: mod.PersonalWeightPresets })),
  {
    loading: () => <ChartSkeleton />,
    ssr: false,
  }
)

const TemplateAnalytics = dynamic(
  () => import('@/components/template-analytics').then(mod => ({ default: mod.TemplateAnalytics })),
  {
    loading: () => <ChartSkeleton />,
    ssr: false,
  }
)

// Types for new components
interface CustomTemplate {
  id: string
  name: string
  exercises: string[]
  category: 'chest' | 'back' | 'legs' | 'arms' | 'shoulders' | 'full-body' | 'custom'
  restTime: number
  isFavorite: boolean
  createdAt: number
  usageCount: number
}

interface WeightPreset {
  id: string
  name: string
  weight: number
  exerciseName: string
  category: 'warmup' | 'working' | 'pr' | 'custom'
  isFavorite: boolean
  createdAt: number
  usageCount: number
  lastUsed: number | null
}

export default function WorkoutSessionPage() {
  const [isWorkoutActive, setIsWorkoutActive] = useState(false)
  const [exercises, setExercises] = useState<ExerciseData[]>([])
  const [workoutStartTime, setWorkoutStartTime] = useState<number>(0)
  const [workoutDuration, setWorkoutDuration] = useState<number>(0)
  const [showRestTimer, setShowRestTimer] = useState(false)
  const [restDuration, setRestDuration] = useState(90)
  const [showPlateCalculator, setShowPlateCalculator] = useState(false)
  const [useEnhancedCalculator, setUseEnhancedCalculator] = useState(true)
  const [selectedSetForCalculator, setSelectedSetForCalculator] = useState<{ exerciseId: string; setId: string; currentWeight: number | null } | null>(null)
  const [showSummary, setShowSummary] = useState(false)
  const [showExerciseSearch, setShowExerciseSearch] = useState(false)
  const [supersetGroups, setSupersetGroups] = useState<string[][]>([])
  const [selectedExercisesForSuperset, setSelectedExercisesForSuperset] = useState<string[]>([])
  const [showSupersetTemplates, setShowSupersetTemplates] = useState(false)
  const [showAdvancedModes, setShowAdvancedModes] = useState(false)
  const [currentSupersetMode, setCurrentSupersetMode] = useState<SupersetModeConfig | null>(null)
  
  // Phase 4 Polish v2 state
  const [customTemplates, setCustomTemplates] = useState<CustomTemplate[]>([])
  const [weightPresets, setWeightPresets] = useState<WeightPreset[]>([])
  const [showCustomTemplateCreator, setShowCustomTemplateCreator] = useState(false)
  const [showWeightPresets, setShowWeightPresets] = useState(false)
  const [showTemplateAnalytics, setShowTemplateAnalytics] = useState(false)
  const [currentExerciseForPreset, setCurrentExerciseForPreset] = useState<{ name: string; weight: number } | null>(null)

  // Load custom templates and weight presets from localStorage
  useEffect(() => {
    try {
      const savedTemplates = localStorage.getItem('customTemplates')
      const savedPresets = localStorage.getItem('weightPresets')
      
      if (savedTemplates) {
        setCustomTemplates(JSON.parse(savedTemplates))
      }
      if (savedPresets) {
        setWeightPresets(JSON.parse(savedPresets))
      }
    } catch (error) {
      console.error('Error loading templates/presets:', error)
    }
  }, [])

  // Update workout duration every second
  useEffect(() => {
    if (!isWorkoutActive || workoutStartTime === 0) return

    const interval = setInterval(() => {
      setWorkoutDuration(Math.floor((Date.now() - workoutStartTime) / 1000))
    }, 1000)

    return () => clearInterval(interval)
  }, [isWorkoutActive, workoutStartTime])

  const startWorkout = () => {
    setIsWorkoutActive(true)
    setWorkoutStartTime(Date.now())
    setWorkoutDuration(0)
  }

  const finishWorkout = () => {
    setIsWorkoutActive(false)
    setShowSummary(true)
  }

  const addExercise = (name: string) => {
    const newExercise: ExerciseData = {
      id: `ex-${Date.now()}`,
      name,
      sets: [createNewSet(1)],
      previousWorkout: {
        date: '7 days ago',
        sets: [
          { weight: 135, reps: 10 },
          { weight: 135, reps: 10 },
          { weight: 140, reps: 8 }
        ]
      }
    }
    setExercises([...exercises, newExercise])
    setShowExerciseSearch(false)
  }

  const createNewSet = (setNumber: number): WorkoutSet => ({
    id: `set-${Date.now()}-${setNumber}`,
    setNumber,
    weight: null,
    reps: null,
    rpe: null,
    isCompleted: false,
    isToFailure: false,
    note: '',
    restTime: 90
  })

  const updateSet = (exerciseId: string, setId: string, updates: Partial<WorkoutSet>) => {
    setExercises(
      exercises.map((ex) =>
        ex.id === exerciseId
          ? {
              ...ex,
              sets: ex.sets.map((set) => (set.id === setId ? { ...set, ...updates } : set))
            }
          : ex
      )
    )
  }

  const addSetToExercise = (exerciseId: string) => {
    setExercises(
      exercises.map((ex) => {
        if (ex.id === exerciseId) {
          const newSetNumber = ex.sets.length + 1
          return {
            ...ex,
            sets: [...ex.sets, createNewSet(newSetNumber)]
          }
        }
        return ex
      })
    )
  }

  const removeSet = (exerciseId: string, setId: string) => {
    setExercises(
      exercises.map((ex) =>
        ex.id === exerciseId
          ? {
              ...ex,
              sets: ex.sets.filter((s) => s.id !== setId)
            }
          : ex
      )
    )
  }

  const removeExercise = (exerciseId: string) => {
    setExercises(exercises.filter((ex) => ex.id !== exerciseId))
  }

  const openPlateCalculator = (exerciseId: string, setId: string) => {
    const exercise = exercises.find(ex => ex.id === exerciseId)
    const set = exercise?.sets.find(s => s.id === setId)
    setSelectedSetForCalculator({
      exerciseId,
      setId,
      currentWeight: set?.weight || null
    })
    setShowPlateCalculator(true)
  }

  const applyCalculatedWeight = (weight: number) => {
    if (selectedSetForCalculator) {
      updateSet(selectedSetForCalculator.exerciseId, selectedSetForCalculator.setId, { weight })
    }
  }

  const createSuperset = () => {
    if (selectedExercisesForSuperset.length >= 2) {
      setSupersetGroups([...supersetGroups, [...selectedExercisesForSuperset]])
      setSelectedExercisesForSuperset([])
    }
  }

  const breakSuperset = (groupIndex: number) => {
    setSupersetGroups(supersetGroups.filter((_, i) => i !== groupIndex))
  }

  const toggleExerciseForSuperset = (exerciseId: string) => {
    setSelectedExercisesForSuperset(prev =>
      prev.includes(exerciseId)
        ? prev.filter(id => id !== exerciseId)
        : [...prev, exerciseId]
    )
  }

  const isExerciseInSuperset = (exerciseId: string) => {
    return supersetGroups.some(group => group.includes(exerciseId))
  }

  const getSupersetGroupIndex = (exerciseId: string) => {
    return supersetGroups.findIndex(group => group.includes(exerciseId))
  }

  const startRestTimer = (duration: number) => {
    setRestDuration(duration)
    setShowRestTimer(true)
  }

  const applySupersetTemplate = (exerciseNames: string[]) => {
    // Add exercises from template
    const newExercises: ExerciseData[] = exerciseNames.map((name, index) => ({
      id: `ex-${Date.now()}-${index}`,
      name,
      sets: [
        { 
          id: `set-${Date.now()}-${index}`,
          setNumber: 1,
          reps: null,
          weight: null,
          rpe: null,
          isCompleted: false,
          isToFailure: false,
          notes: '',
          note: '',
          restTime: 0
        }
      ],
      totalVolume: 0,
      notes: ''
    }))
    setExercises([...exercises, ...newExercises])

    // Auto-create superset group
    const exerciseIds = newExercises.map(ex => ex.id)
    setSupersetGroups([...supersetGroups, exerciseIds])
  }

  const applyAdvancedMode = (config: SupersetModeConfig) => {
    setCurrentSupersetMode(config)
    // Update rest time for active superset if applicable
    if (config.restTime) {
      setRestDuration(config.restTime)
    }
  }

  // Custom Template Handlers
  const handleSaveTemplate = (template: Omit<CustomTemplate, 'id' | 'createdAt' | 'usageCount'>) => {
    const newTemplate: CustomTemplate = {
      ...template,
      id: Date.now().toString(),
      createdAt: Date.now(),
      usageCount: 0,
    }
    const updated = [...customTemplates, newTemplate]
    setCustomTemplates(updated)
    localStorage.setItem('customTemplates', JSON.stringify(updated))
  }

  const handleDeleteTemplate = (templateId: string) => {
    const updated = customTemplates.filter(t => t.id !== templateId)
    setCustomTemplates(updated)
    localStorage.setItem('customTemplates', JSON.stringify(updated))
  }

  const handleToggleFavoriteTemplate = (templateId: string) => {
    const updated = customTemplates.map(t =>
      t.id === templateId ? { ...t, isFavorite: !t.isFavorite } : t
    )
    setCustomTemplates(updated)
    localStorage.setItem('customTemplates', JSON.stringify(updated))
  }

  // Weight Preset Handlers
  const handleSavePreset = (preset: Omit<WeightPreset, 'id' | 'createdAt' | 'usageCount' | 'lastUsed'>) => {
    const newPreset: WeightPreset = {
      ...preset,
      id: Date.now().toString(),
      createdAt: Date.now(),
      usageCount: 0,
      lastUsed: null,
    }
    const updated = [...weightPresets, newPreset]
    setWeightPresets(updated)
    localStorage.setItem('weightPresets', JSON.stringify(updated))
  }

  const handleDeletePreset = (presetId: string) => {
    const updated = weightPresets.filter(p => p.id !== presetId)
    setWeightPresets(updated)
    localStorage.setItem('weightPresets', JSON.stringify(updated))
  }

  const handleToggleFavoritePreset = (presetId: string) => {
    const updated = weightPresets.map(p =>
      p.id === presetId ? { ...p, isFavorite: !p.isFavorite } : p
    )
    setWeightPresets(updated)
    localStorage.setItem('weightPresets', JSON.stringify(updated))
  }

  const handleApplyPreset = (weight: number) => {
    // Apply weight to current set if available
    if (selectedSetForCalculator) {
      updateSet(selectedSetForCalculator.exerciseId, selectedSetForCalculator.setId, { weight })
    }
    
    // Update preset usage stats (simplified - would need preset ID in real implementation)
    // For now, just close the modal
    setShowWeightPresets(false)
    setCurrentExerciseForPreset(null)
  }

  const openWeightPresets = (exerciseId: string, setId: string) => {
    const exercise = exercises.find(ex => ex.id === exerciseId)
    const set = exercise?.sets.find(s => s.id === setId)
    
    if (exercise && set) {
      setCurrentExerciseForPreset({
        name: exercise.name,
        weight: set.weight || 0
      })
      setSelectedSetForCalculator({
        exerciseId,
        setId,
        currentWeight: set.weight || null
      })
      setShowWeightPresets(true)
    }
  }

  const saveWorkout = () => {
    console.log('Saving workout...', { exercises, duration: workoutDuration })
    alert('Workout saved! (This would save to your workout history)')
    setShowSummary(false)
    setExercises([])
    setWorkoutDuration(0)
  }

  const discardWorkout = () => {
    if (confirm('Are you sure you want to discard this workout?')) {
      setShowSummary(false)
      setExercises([])
      setWorkoutDuration(0)
    }
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Sample exercises for quick add
  const quickExercises = [
    'Bench Press',
    'Squat',
    'Deadlift',
    'Overhead Press',
    'Barbell Row',
    'Pull-ups',
    'Dumbbell Curl',
    'Tricep Extension',
    'Leg Press',
    'Romanian Deadlift'
  ]

  return (
    <div className="min-h-screen bg-slate-950 p-6 pb-32">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="w-10 h-10 bg-neutral-900 border-2 border-neutral-800 flex items-center justify-center hover:border-amber-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-400">Battle Session</h1>
              <p className="text-neutral-400 font-medium">Track your combat training</p>
            </div>
          </div>
          
          {!isWorkoutActive ? (
            <button
              onClick={startWorkout}
              className="px-6 py-3 bg-amber-950/50 hover:bg-amber-900/50 border-2 border-amber-700 font-bold uppercase tracking-wider flex items-center gap-2 transition-all text-amber-400"
            >
              <Play className="w-5 h-5" />
              Engage Battle
            </button>
          ) : (
            <button
              onClick={finishWorkout}
              className="px-6 py-3 bg-amber-950/50 hover:bg-amber-900/50 border-2 border-amber-700 font-bold uppercase tracking-wider flex items-center gap-2 transition-all text-amber-400"
            >
              <Check className="w-5 h-5" />
              Claim Victory
            </button>
          )}
        </div>

        {/* Workout Status */}
        {isWorkoutActive && (
          <div className="bg-neutral-900 border-2 border-amber-800/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-neutral-400 mb-1 uppercase tracking-wider font-bold">Battle Duration</div>
                <div className="text-3xl font-bold tabular-nums text-amber-400">{formatDuration(workoutDuration)}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-neutral-400 mb-1 uppercase tracking-wider font-bold">Techniques</div>
                <div className="text-3xl font-bold text-amber-400">{exercises.length}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-400 mb-1">Sets Completed</div>
                <div className="text-3xl font-bold">
                  {exercises.reduce((total, ex) => total + ex.sets.filter((s) => s.isCompleted).length, 0)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Exercise List */}
        <div className="space-y-4">
          {/* Superset Groups */}
          {supersetGroups.map((group, groupIndex) => {
            const groupExercises = exercises.filter(ex => group.includes(ex.id))
            if (groupExercises.length === 0) return null
            
            return (
              <SupersetGroup
                key={`superset-${groupIndex}`}
                exercises={groupExercises}
                onBreakGroup={() => breakSuperset(groupIndex)}
                onStartRestTimer={startRestTimer}
              >
                {groupExercises.map((exercise) => (
                  <EnhancedSetLog
                    key={exercise.id}
                    exercise={exercise}
                    onUpdateSet={(setId, updates) => updateSet(exercise.id, setId, updates)}
                    onCompleteSet={(setId) => updateSet(exercise.id, setId, { isCompleted: true })}
                    onAddSet={() => addSetToExercise(exercise.id)}
                    onRemoveSet={(setId) => removeSet(exercise.id, setId)}
                    onToggleFailure={(setId) => {
                      const set = exercise.sets.find(s => s.id === setId)
                      updateSet(exercise.id, setId, { isToFailure: !set?.isToFailure })
                    }}
                    onAddNote={(setId, note) => updateSet(exercise.id, setId, { note })}
                    onRemoveExercise={() => removeExercise(exercise.id)}
                    onOpenPlateCalculator={openPlateCalculator}
                    onStartRestTimer={startRestTimer}
                  />
                ))}
              </SupersetGroup>
            )
          })}

          {/* Individual Exercises (not in superset) */}
          {exercises.filter(ex => !isExerciseInSuperset(ex.id)).map((exercise) => (
            <div key={exercise.id} className="relative">
              {/* Superset selection checkbox */}
              {isWorkoutActive && exercises.length > 1 && (
                <div className="absolute -left-12 top-1/2 -translate-y-1/2 z-10">
                  <input
                    type="checkbox"
                    checked={selectedExercisesForSuperset.includes(exercise.id)}
                    onChange={() => toggleExerciseForSuperset(exercise.id)}
                    className="w-5 h-5 rounded bg-slate-800 border-2 border-slate-700 checked:border-purple-500 checked:bg-purple-500 cursor-pointer"
                    title="Select for superset"
                  />
                </div>
              )}
              
              <EnhancedSetLog
                exercise={exercise}
                onUpdateSet={(setId, updates) => updateSet(exercise.id, setId, updates)}
                onCompleteSet={(setId) => updateSet(exercise.id, setId, { isCompleted: true })}
                onAddSet={() => addSetToExercise(exercise.id)}
                onRemoveSet={(setId) => removeSet(exercise.id, setId)}
                onToggleFailure={(setId) => {
                  const set = exercise.sets.find(s => s.id === setId)
                  updateSet(exercise.id, setId, { isToFailure: !set?.isToFailure })
                }}
                onAddNote={(setId, note) => updateSet(exercise.id, setId, { note })}
                onRemoveExercise={() => removeExercise(exercise.id)}
                onOpenPlateCalculator={openPlateCalculator}
                onStartRestTimer={startRestTimer}
              />
            </div>
          ))}

          {/* Advanced Features Toolbar */}
          {isWorkoutActive && exercises.length > 0 && (
            <div className="flex flex-wrap gap-3 p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
              <button
                onClick={() => setShowSupersetTemplates(true)}
                className="flex-1 min-w-[200px] px-4 py-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 hover:border-purple-500/70 rounded-lg font-semibold text-purple-300 transition-all flex items-center justify-center gap-2"
              >
                📚 Load Template
              </button>
              <button
                onClick={() => setShowAdvancedModes(true)}
                className="flex-1 min-w-[200px] px-4 py-3 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 hover:border-blue-500/70 rounded-lg font-semibold text-blue-300 transition-all flex items-center justify-center gap-2"
              >
                ⚡ Training Mode
              </button>
              <button
                onClick={() => setUseEnhancedCalculator(!useEnhancedCalculator)}
                className={`flex-1 min-w-[200px] px-4 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                  useEnhancedCalculator
                    ? 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 hover:border-green-500/70 text-green-300'
                    : 'bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-400'
                }`}
              >
                🧮 {useEnhancedCalculator ? 'Enhanced' : 'Basic'} Calc
              </button>
              <button
                onClick={() => setShowCustomTemplateCreator(true)}
                className="flex-1 min-w-[200px] px-4 py-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 hover:border-purple-500/70 rounded-lg font-semibold text-purple-300 transition-all flex items-center justify-center gap-2"
                title="Create Custom Templates"
              >
                ⚙️ Custom Templates
              </button>
              <button
                onClick={() => setShowWeightPresets(true)}
                className="flex-1 min-w-[200px] px-4 py-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 hover:border-green-500/70 rounded-lg font-semibold text-green-300 transition-all flex items-center justify-center gap-2"
                title="Weight Presets"
              >
                💪 Weight Presets
              </button>
              <button
                onClick={() => setShowTemplateAnalytics(true)}
                className="flex-1 min-w-[200px] px-4 py-3 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 hover:border-blue-500/70 rounded-lg font-semibold text-blue-300 transition-all flex items-center justify-center gap-2"
                title="Template Analytics"
              >
                📊 Analytics
              </button>
            </div>
          )}

          {/* Create Superset Button */}
          {selectedExercisesForSuperset.length >= 2 && (
            <button
              onClick={createSuperset}
              className="w-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-2 border-purple-500/50 hover:border-purple-500 rounded-xl p-6 text-center transition-all shadow-lg shadow-purple-500/20"
            >
              <LinkIcon className="w-8 h-8 mx-auto mb-2 text-purple-400" />
              <p className="font-semibold text-purple-300">
                Create Superset ({selectedExercisesForSuperset.length} exercises selected)
              </p>
              <p className="text-sm text-purple-400/70 mt-1">
                Group these exercises together for alternating sets
              </p>
            </button>
          )}

          {/* Add Exercise Button */}
          {isWorkoutActive && (
            <button
              onClick={() => setShowExerciseSearch(true)}
              className="w-full bg-slate-900/50 border border-slate-800 hover:border-blue-500/50 rounded-xl p-12 text-center transition-colors"
            >
              <Plus className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="font-semibold">Add Exercise</p>
            </button>
          )}

          {exercises.length === 0 && !isWorkoutActive && (
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-12 text-center">
              <p className="text-gray-400 mb-4">Start a workout to begin tracking your exercises</p>
              <button
                onClick={startWorkout}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-lg font-semibold flex items-center gap-2 mx-auto transition-all"
              >
                <Play className="w-5 h-5" />
                Start Workout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Exercise Search Modal */}
      {showExerciseSearch && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-slate-800">
              <h2 className="text-2xl font-bold mb-4">Add Exercise</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search exercises..."
                  className="w-full pl-11 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-96">
              <div className="grid grid-cols-2 gap-3">
                {quickExercises.map((exerciseName) => (
                  <button
                    key={exerciseName}
                    onClick={() => addExercise(exerciseName)}
                    className="px-4 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg font-medium text-left transition-colors"
                  >
                    {exerciseName}
                  </button>
                ))}
              </div>
            </div>
            <div className="p-6 border-t border-slate-800">
              <button
                onClick={() => setShowExerciseSearch(false)}
                className="w-full px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Plate Calculator Modal (Enhanced) */}
      {useEnhancedCalculator ? (
        <PlateCalculatorEnhanced
          isOpen={showPlateCalculator}
          onClose={() => {
            setShowPlateCalculator(false)
            setSelectedSetForCalculator(null)
          }}
          currentWeight={selectedSetForCalculator?.currentWeight || null}
          onApplyWeight={applyCalculatedWeight}
        />
      ) : (
        <PlateCalculatorModal
          isOpen={showPlateCalculator}
          onClose={() => {
            setShowPlateCalculator(false)
            setSelectedSetForCalculator(null)
          }}
          currentWeight={selectedSetForCalculator?.currentWeight || null}
          onApplyWeight={applyCalculatedWeight}
        />
      )}

      {/* Superset Templates Modal */}
      <SupersetTemplates
        isOpen={showSupersetTemplates}
        onClose={() => setShowSupersetTemplates(false)}
        onApplyTemplate={applySupersetTemplate}
      />

      {/* Advanced Superset Modes Modal */}
      <AdvancedSupersetModes
        isOpen={showAdvancedModes}
        onClose={() => setShowAdvancedModes(false)}
        onSelectMode={applyAdvancedMode}
      />

      {/* Custom Template Creator Modal */}
      <CustomTemplateCreator
        isOpen={showCustomTemplateCreator}
        onClose={() => setShowCustomTemplateCreator(false)}
        currentExercises={exercises.map(e => ({ id: e.id, name: e.name }))}
        onSaveTemplate={handleSaveTemplate}
        existingTemplates={customTemplates}
        onDeleteTemplate={handleDeleteTemplate}
        onToggleFavorite={handleToggleFavoriteTemplate}
      />

      {/* Personal Weight Presets Modal */}
      <PersonalWeightPresets
        isOpen={showWeightPresets}
        onClose={() => {
          setShowWeightPresets(false)
          setCurrentExerciseForPreset(null)
        }}
        onSavePreset={handleSavePreset}
        existingPresets={weightPresets}
        onDeletePreset={handleDeletePreset}
        onToggleFavorite={handleToggleFavoritePreset}
        onApplyPreset={handleApplyPreset}
        currentExercise={currentExerciseForPreset?.name}
        currentWeight={currentExerciseForPreset?.weight}
      />

      {/* Template Analytics Modal */}
      <TemplateAnalytics
        isOpen={showTemplateAnalytics}
        onClose={() => setShowTemplateAnalytics(false)}
        templates={customTemplates}
      />

      {/* Rest Timer Widget */}
      <RestTimerWidget
        isActive={showRestTimer}
        onClose={() => setShowRestTimer(false)}
        initialDuration={restDuration}
      />

      {/* Workout Summary Modal */}
      {showSummary && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-6 overflow-y-auto">
          <div className="max-w-3xl w-full my-8">
            <WorkoutSummaryCard
              exercises={exercises}
              duration={workoutDuration}
              onSave={saveWorkout}
              onDiscard={discardWorkout}
            />
          </div>
        </div>
      )}
    </div>
  )
}
