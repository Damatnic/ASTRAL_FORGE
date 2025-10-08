'use client'

import { useState } from 'react'
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Check,
  Calendar,
  Dumbbell,
  Target,
  Clock,
  Zap,
  Trophy,
  Plus,
  Trash2,
  Search
} from 'lucide-react'

interface ProgramCreatorWizardProps {
  isOpen: boolean
  onClose: () => void
  onSave: (program: any) => void
}

interface ProgramData {
  // Step 1: Basic Info
  name: string
  description: string
  category: string
  difficulty: string
  duration: number // weeks
  
  // Step 2: Schedule
  daysPerWeek: number
  selectedDays: string[]
  restDays: string[]
  
  // Step 3: Exercises
  workouts: {
    day: string
    exercises: {
      id: string
      name: string
      sets: number
      reps: string
      rest: number
    }[]
  }[]
  
  // Step 4: Goals & Settings
  primaryGoal: string
  tags: string[]
}

const CATEGORIES = [
  'Strength',
  'Hypertrophy',
  'Powerlifting',
  'Bodybuilding',
  'CrossFit',
  'Calisthenics',
  'Olympic Lifting'
]

const DIFFICULTY_LEVELS = [
  { value: 'beginner', label: 'Beginner', icon: '🌱', color: 'green' },
  { value: 'intermediate', label: 'Intermediate', icon: '💪', color: 'blue' },
  { value: 'advanced', label: 'Advanced', icon: '🔥', color: 'orange' },
  { value: 'elite', label: 'Elite', icon: '⚡', color: 'purple' }
]

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const PRIMARY_GOALS = [
  { value: 'strength', label: 'Build Strength', icon: Trophy },
  { value: 'muscle', label: 'Build Muscle', icon: Dumbbell },
  { value: 'endurance', label: 'Improve Endurance', icon: Zap },
  { value: 'athletic', label: 'Athletic Performance', icon: Target }
]

// Sample exercise database (in real app, this would come from API)
const SAMPLE_EXERCISES = [
  { id: '1', name: 'Barbell Squat', category: 'Legs', muscleGroup: 'Quads' },
  { id: '2', name: 'Bench Press', category: 'Chest', muscleGroup: 'Chest' },
  { id: '3', name: 'Deadlift', category: 'Back', muscleGroup: 'Back' },
  { id: '4', name: 'Overhead Press', category: 'Shoulders', muscleGroup: 'Shoulders' },
  { id: '5', name: 'Barbell Row', category: 'Back', muscleGroup: 'Back' },
  { id: '6', name: 'Pull-ups', category: 'Back', muscleGroup: 'Lats' },
  { id: '7', name: 'Romanian Deadlift', category: 'Legs', muscleGroup: 'Hamstrings' },
  { id: '8', name: 'Dips', category: 'Chest', muscleGroup: 'Triceps' }
]

export default function ProgramCreatorWizard({ isOpen, onClose, onSave }: ProgramCreatorWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [programData, setProgramData] = useState<ProgramData>({
    name: '',
    description: '',
    category: CATEGORIES[0],
    difficulty: 'intermediate',
    duration: 12,
    daysPerWeek: 3,
    selectedDays: ['Monday', 'Wednesday', 'Friday'],
    restDays: [],
    workouts: [],
    primaryGoal: 'strength',
    tags: []
  })
  
  const [exerciseSearch, setExerciseSearch] = useState('')
  const [selectedDay, setSelectedDay] = useState<string | null>(null)

  if (!isOpen) return null

  const totalSteps = 4

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSave = () => {
    onSave(programData)
    onClose()
  }

  const updateProgramData = (updates: Partial<ProgramData>) => {
    setProgramData({ ...programData, ...updates })
  }

  const toggleDay = (day: string) => {
    const isSelected = programData.selectedDays.includes(day)
    if (isSelected) {
      updateProgramData({
        selectedDays: programData.selectedDays.filter(d => d !== day)
      })
    } else {
      updateProgramData({
        selectedDays: [...programData.selectedDays, day]
      })
    }
  }

  const addExerciseToDay = (day: string, exercise: typeof SAMPLE_EXERCISES[0]) => {
    const existingWorkout = programData.workouts.find(w => w.day === day)
    
    if (existingWorkout) {
      updateProgramData({
        workouts: programData.workouts.map(w => 
          w.day === day 
            ? { 
                ...w, 
                exercises: [...w.exercises, { 
                  id: exercise.id, 
                  name: exercise.name, 
                  sets: 3, 
                  reps: '8-12', 
                  rest: 90 
                }]
              }
            : w
        )
      })
    } else {
      updateProgramData({
        workouts: [...programData.workouts, {
          day,
          exercises: [{ 
            id: exercise.id, 
            name: exercise.name, 
            sets: 3, 
            reps: '8-12', 
            rest: 90 
          }]
        }]
      })
    }
  }

  const removeExerciseFromDay = (day: string, exerciseId: string) => {
    updateProgramData({
      workouts: programData.workouts.map(w => 
        w.day === day 
          ? { ...w, exercises: w.exercises.filter(e => e.id !== exerciseId) }
          : w
      ).filter(w => w.exercises.length > 0)
    })
  }

  const filteredExercises = SAMPLE_EXERCISES.filter(ex => 
    ex.name.toLowerCase().includes(exerciseSearch.toLowerCase()) ||
    ex.category.toLowerCase().includes(exerciseSearch.toLowerCase())
  )

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return programData.name.trim() !== '' && programData.description.trim() !== ''
      case 2:
        return programData.selectedDays.length > 0
      case 3:
        return programData.workouts.length > 0
      case 4:
        return true
      default:
        return false
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl border border-slate-700 shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-700 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Create Training Program
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Step {currentStep} of {totalSteps}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="px-6 pt-4">
          <div className="flex items-center justify-between mb-2">
            {Array.from({ length: totalSteps }).map((_, idx) => (
              <div key={idx} className="flex items-center flex-1">
                <div className={`
                  flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all
                  ${currentStep > idx + 1 
                    ? 'bg-gradient-to-r from-blue-400 to-cyan-400 border-blue-400' 
                    : currentStep === idx + 1 
                      ? 'border-blue-400 bg-blue-400/20' 
                      : 'border-slate-600 bg-slate-800'
                  }
                `}>
                  {currentStep > idx + 1 ? (
                    <Check className="w-4 h-4 text-black" />
                  ) : (
                    <span className={currentStep === idx + 1 ? 'text-blue-400' : 'text-gray-500'}>
                      {idx + 1}
                    </span>
                  )}
                </div>
                {idx < totalSteps - 1 && (
                  <div className={`
                    flex-1 h-0.5 mx-2 transition-all
                    ${currentStep > idx + 1 
                      ? 'bg-gradient-to-r from-blue-400 to-cyan-400' 
                      : 'bg-slate-700'
                    }
                  `} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-400 mb-4">
            <span>Basic Info</span>
            <span>Schedule</span>
            <span>Exercises</span>
            <span>Review</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Program Name *
                </label>
                <input
                  type="text"
                  value={programData.name}
                  onChange={(e) => updateProgramData({ name: e.target.value })}
                  placeholder="e.g., Ultimate Strength Builder"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  value={programData.description}
                  onChange={(e) => updateProgramData({ description: e.target.value })}
                  placeholder="Describe your program's focus, methodology, and what makes it unique..."
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={programData.category}
                    onChange={(e) => updateProgramData({ category: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Duration (weeks)
                  </label>
                  <input
                    type="number"
                    value={programData.duration}
                    onChange={(e) => updateProgramData({ duration: parseInt(e.target.value) || 1 })}
                    min="1"
                    max="52"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Difficulty Level
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {DIFFICULTY_LEVELS.map(level => (
                    <button
                      key={level.value}
                      onClick={() => updateProgramData({ difficulty: level.value })}
                      className={`
                        p-4 rounded-lg border-2 transition-all text-left
                        ${programData.difficulty === level.value
                          ? 'border-blue-400 bg-blue-400/10'
                          : 'border-slate-700 bg-slate-800 hover:border-slate-600'
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{level.icon}</span>
                        <div>
                          <div className="font-medium text-white">{level.label}</div>
                          <div className="text-xs text-gray-400">
                            {level.value === 'beginner' && '0-1 year experience'}
                            {level.value === 'intermediate' && '1-3 years experience'}
                            {level.value === 'advanced' && '3-5 years experience'}
                            {level.value === 'elite' && '5+ years experience'}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Schedule */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Training Days per Week: {programData.selectedDays.length}
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {DAYS_OF_WEEK.map(day => {
                    const isSelected = programData.selectedDays.includes(day)
                    return (
                      <button
                        key={day}
                        onClick={() => toggleDay(day)}
                        className={`
                          p-4 rounded-lg border-2 transition-all
                          ${isSelected
                            ? 'border-blue-400 bg-blue-400/10'
                            : 'border-slate-700 bg-slate-800 hover:border-slate-600'
                          }
                        `}
                      >
                        <div className="text-center">
                          <div className={`text-sm font-medium ${isSelected ? 'text-blue-400' : 'text-gray-400'}`}>
                            {day.substring(0, 3)}
                          </div>
                          <div className={`text-xs mt-1 ${isSelected ? 'text-blue-300' : 'text-gray-500'}`}>
                            {isSelected ? 'Training' : 'Rest'}
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-white mb-1">Schedule Summary</h4>
                    <p className="text-sm text-gray-400">
                      {programData.selectedDays.length > 0 ? (
                        <>
                          Training on: <span className="text-blue-400">{programData.selectedDays.join(', ')}</span>
                        </>
                      ) : (
                        'Select your training days above'
                      )}
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      Rest days: {DAYS_OF_WEEK.filter(d => !programData.selectedDays.includes(d)).length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div className="flex-1 text-sm text-gray-300">
                    <strong className="text-blue-400">Tip:</strong> Most programs work best with 3-6 training days per week. 
                    Make sure to include adequate rest days for recovery!
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Exercises */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Add Exercises to Training Days
                </label>
                
                {/* Day selector */}
                <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                  {programData.selectedDays.map(day => {
                    const workout = programData.workouts.find(w => w.day === day)
                    const exerciseCount = workout?.exercises.length || 0
                    
                    return (
                      <button
                        key={day}
                        onClick={() => setSelectedDay(day)}
                        className={`
                          px-4 py-2 rounded-lg border-2 whitespace-nowrap transition-all flex-shrink-0
                          ${selectedDay === day
                            ? 'border-blue-400 bg-blue-400/10 text-blue-400'
                            : 'border-slate-700 bg-slate-800 text-gray-400 hover:border-slate-600'
                          }
                        `}
                      >
                        <div className="text-sm font-medium">{day}</div>
                        <div className="text-xs opacity-75">{exerciseCount} exercises</div>
                      </button>
                    )
                  })}
                </div>

                {selectedDay && (
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Exercise Library */}
                    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Dumbbell className="w-4 h-4 text-blue-400" />
                        <h4 className="font-medium text-white">Exercise Library</h4>
                      </div>
                      
                      <div className="relative mb-3">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                          type="text"
                          value={exerciseSearch}
                          onChange={(e) => setExerciseSearch(e.target.value)}
                          placeholder="Search exercises..."
                          className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {filteredExercises.map(exercise => (
                          <button
                            key={exercise.id}
                            onClick={() => addExerciseToDay(selectedDay, exercise)}
                            className="w-full p-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-left transition-colors group"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">
                                  {exercise.name}
                                </div>
                                <div className="text-xs text-gray-400">
                                  {exercise.category} • {exercise.muscleGroup}
                                </div>
                              </div>
                              <Plus className="w-4 h-4 text-gray-500 group-hover:text-blue-400" />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Selected Exercises */}
                    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Target className="w-4 h-4 text-green-400" />
                        <h4 className="font-medium text-white">{selectedDay} Workout</h4>
                      </div>

                      {programData.workouts.find(w => w.day === selectedDay)?.exercises.length ? (
                        <div className="space-y-2">
                          {programData.workouts.find(w => w.day === selectedDay)?.exercises.map((exercise, idx) => (
                            <div
                              key={`${exercise.id}-${idx}`}
                              className="p-3 bg-slate-900 border border-slate-700 rounded-lg"
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div className="text-sm font-medium text-white">
                                  {exercise.name}
                                </div>
                                <button
                                  onClick={() => removeExerciseFromDay(selectedDay, exercise.id)}
                                  className="p-1 hover:bg-red-500/20 rounded transition-colors"
                                >
                                  <Trash2 className="w-3 h-3 text-red-400" />
                                </button>
                              </div>
                              <div className="grid grid-cols-3 gap-2 text-xs">
                                <div>
                                  <span className="text-gray-500">Sets:</span>
                                  <span className="text-gray-300 ml-1">{exercise.sets}</span>
                                </div>
                                <div>
                                  <span className="text-gray-500">Reps:</span>
                                  <span className="text-gray-300 ml-1">{exercise.reps}</span>
                                </div>
                                <div>
                                  <span className="text-gray-500">Rest:</span>
                                  <span className="text-gray-300 ml-1">{exercise.rest}s</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500 text-sm">
                          <Dumbbell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p>No exercises added yet</p>
                          <p className="text-xs mt-1">Select from the library</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {!selectedDay && (
                  <div className="text-center py-12 text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Select a training day above to add exercises</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Primary Goal
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {PRIMARY_GOALS.map(goal => (
                    <button
                      key={goal.value}
                      onClick={() => updateProgramData({ primaryGoal: goal.value })}
                      className={`
                        p-4 rounded-lg border-2 transition-all text-left
                        ${programData.primaryGoal === goal.value
                          ? 'border-blue-400 bg-blue-400/10'
                          : 'border-slate-700 bg-slate-800 hover:border-slate-600'
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <goal.icon className={`w-5 h-5 ${programData.primaryGoal === goal.value ? 'text-blue-400' : 'text-gray-400'}`} />
                        <span className="font-medium text-white">{goal.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-6">
                <h3 className="text-lg font-bold text-white mb-4">Program Summary</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-slate-700">
                    <span className="text-gray-400">Program Name:</span>
                    <span className="text-white font-medium">{programData.name}</span>
                  </div>
                  
                  <div className="flex justify-between py-2 border-b border-slate-700">
                    <span className="text-gray-400">Category:</span>
                    <span className="text-white">{programData.category}</span>
                  </div>
                  
                  <div className="flex justify-between py-2 border-b border-slate-700">
                    <span className="text-gray-400">Difficulty:</span>
                    <span className="text-white capitalize">{programData.difficulty}</span>
                  </div>
                  
                  <div className="flex justify-between py-2 border-b border-slate-700">
                    <span className="text-gray-400">Duration:</span>
                    <span className="text-white">{programData.duration} weeks</span>
                  </div>
                  
                  <div className="flex justify-between py-2 border-b border-slate-700">
                    <span className="text-gray-400">Training Days:</span>
                    <span className="text-white">{programData.selectedDays.length} days/week</span>
                  </div>
                  
                  <div className="flex justify-between py-2 border-b border-slate-700">
                    <span className="text-gray-400">Total Exercises:</span>
                    <span className="text-white">
                      {programData.workouts.reduce((acc, w) => acc + w.exercises.length, 0)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between py-2">
                    <span className="text-gray-400">Primary Goal:</span>
                    <span className="text-white capitalize">{programData.primaryGoal.replace('_', ' ')}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-700">
                  <div className="text-sm text-gray-400 mb-2">Weekly Schedule:</div>
                  <div className="flex flex-wrap gap-2">
                    {programData.selectedDays.map(day => (
                      <span
                        key={day}
                        className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-xs text-blue-400"
                      >
                        {day}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-400 mt-0.5" />
                  <div className="flex-1 text-sm text-gray-300">
                    <strong className="text-green-400">Ready to save!</strong> Review your program details above. 
                    You can always edit this program later from your programs page.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-700 flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className={`
              px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2
              ${currentStep === 1
                ? 'bg-slate-800 text-gray-600 cursor-not-allowed'
                : 'bg-slate-700 hover:bg-slate-600 text-white'
              }
            `}
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            
            {currentStep < totalSteps ? (
              <button
                onClick={handleNext}
                disabled={!isStepValid()}
                className={`
                  px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2
                  ${isStepValid()
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white'
                    : 'bg-slate-700 text-gray-500 cursor-not-allowed'
                  }
                `}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSave}
                className="px-8 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg font-medium transition-all flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Create Program
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
