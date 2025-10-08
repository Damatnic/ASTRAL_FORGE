'use client'

import { useEffect, useState } from 'react'
import { AppLayout, PageContainer } from '@/components/layout'
import { EquipmentFilter } from '@/components/equipment/equipment-filter'
import { Search, Dumbbell, Filter } from 'lucide-react'

interface Equipment {
  id: string
  name: string
  category: string
}

interface ExerciseEquipment {
  equipmentId: string
  required: boolean
  equipment: Equipment
}

interface Exercise {
  id: string
  name: string
  category: string
  muscleGroup: string
  equipment?: string
  description?: string
  equipmentLinks: ExerciseEquipment[]
}

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string>('all')
  const [showAvailableOnly, setShowAvailableOnly] = useState(false)
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    loadExercises()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showAvailableOnly])

  const loadExercises = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      
      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory)
      }
      
      if (selectedMuscleGroup !== 'all') {
        params.append('muscleGroup', selectedMuscleGroup)
      }

      if (showAvailableOnly) {
        params.append('availableOnly', 'true')
      }

      const response = await fetch(`/api/exercises?${params.toString()}`)
      const data = await response.json()
      setExercises(data)
    } catch (error) {
      console.error('Failed to load exercises:', error)
    } finally {
      setLoading(false)
    }
  }

  // Client-side filtering
  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
    
    // If specific equipment is selected, filter by that
    if (selectedEquipment.length > 0) {
      const exerciseEquipmentIds = exercise.equipmentLinks.map(link => link.equipmentId)
      const hasSelectedEquipment = selectedEquipment.some(id => exerciseEquipmentIds.includes(id))
      return matchesSearch && hasSelectedEquipment
    }
    
    return matchesSearch
  })

  const categories = ['compound', 'isolation', 'accessory']
  const muscleGroups = ['legs', 'push', 'pull', 'core']

  return (
    <AppLayout>
      <PageContainer>
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-black uppercase tracking-wider mb-2 text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-400">Exercise Arsenal</h1>
          <p className="text-neutral-400 font-medium">
            Master your battle techniques with the tools of war at your disposal
          </p>
        </div>

        {/* Search and Filter Toggle */}
        <div className="mb-6 space-y-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search exercises..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-neutral-900 border-2 border-neutral-800 focus:outline-none focus:border-amber-700 transition-colors"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-3 border-2 transition-all flex items-center gap-2 ${
                showFilters
                  ? 'border-amber-700 bg-amber-950/50 text-amber-400'
                  : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:border-amber-700'
              }`}
            >
              <Filter className="w-5 h-5" />
              <span className="hidden sm:inline font-bold uppercase tracking-wider">Filters</span>
            </button>
          </div>

          {/* Category Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => {
                setSelectedCategory('all')
                loadExercises()
              }}
              className={`px-4 py-2 border-2 font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                selectedCategory === 'all'
                  ? 'bg-amber-950/50 border-amber-700 text-amber-400'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-amber-700'
              }`}
            >
              All Techniques
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category)
                  loadExercises()
                }}
                className={`px-4 py-2 border-2 font-bold tracking-wider whitespace-nowrap transition-all capitalize ${
                  selectedCategory === category
                    ? 'bg-amber-950/50 border-amber-700 text-amber-400'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-amber-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Muscle Group Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => {
                setSelectedMuscleGroup('all')
                loadExercises()
              }}
              className={`px-4 py-2 border-2 font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                selectedMuscleGroup === 'all'
                  ? 'bg-amber-950/50 border-amber-700 text-amber-400'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-amber-700'
              }`}
            >
              All Muscles
            </button>
            {muscleGroups.map(muscle => (
              <button
                key={muscle}
                onClick={() => {
                  setSelectedMuscleGroup(muscle)
                  loadExercises()
                }}
                className={`px-4 py-2 border-2 font-bold tracking-wider whitespace-nowrap transition-all capitalize ${
                  selectedMuscleGroup === muscle
                    ? 'bg-amber-950/50 border-amber-700 text-amber-400'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-amber-700'
                }`}
              >
                {muscle}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Filters */}
          {showFilters && (
            <div className="lg:col-span-1">
              <EquipmentFilter
                onFilterChange={setSelectedEquipment}
                showAvailableOnly={showAvailableOnly}
                onAvailableOnlyChange={setShowAvailableOnly}
              />
            </div>
          )}

          {/* Exercise List */}
          <div className={showFilters ? 'lg:col-span-3' : 'lg:col-span-4'}>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-40 bg-neutral-900 border-2 border-neutral-800 animate-pulse" />
                ))}
              </div>
            ) : filteredExercises.length === 0 ? (
              <div className="text-center py-16">
                <Dumbbell className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold uppercase tracking-wider mb-2">No Techniques Found</h3>
                <p className="text-neutral-400 mb-4">
                  {showAvailableOnly
                    ? 'No techniques available with your current arsenal'
                    : 'Try adjusting your filters or search query'}
                </p>
                {showAvailableOnly && (
                  <button
                    onClick={() => setShowAvailableOnly(false)}
                    className="text-amber-400 hover:text-amber-300 font-bold uppercase tracking-wider"
                  >
                    Show All Techniques
                  </button>
                )}
              </div>
            ) : (
              <div>
                <div className="mb-4 text-sm text-neutral-400 font-medium uppercase tracking-wider">
                  Showing {filteredExercises.length} Technique{filteredExercises.length !== 1 ? 's' : ''}
                  {selectedEquipment.length > 0 && ` (Filtered by ${selectedEquipment.length} Equipment)`}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredExercises.map((exercise) => (
                    <div
                      key={exercise.id}
                      className="group p-4 bg-neutral-900 border-2 border-neutral-800 hover:border-amber-700 transition-all hover:shadow-lg hover:shadow-amber-700/20"
                    >
                      <div className="mb-3">
                        <h3 className="font-bold uppercase tracking-wide mb-1 text-amber-100 group-hover:text-amber-400 transition-colors">{exercise.name}</h3>
                        <div className="flex gap-2 text-xs">
                          <span className="px-2 py-1 bg-amber-950/50 border border-amber-800/50 text-amber-400 tracking-wider font-bold capitalize">
                            {exercise.category}
                          </span>
                          <span className="px-2 py-1 bg-neutral-950 border border-neutral-800 text-neutral-400 tracking-wider font-medium capitalize">
                            {exercise.muscleGroup}
                          </span>
                        </div>
                      </div>

                      {exercise.equipmentLinks.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-neutral-800">
                          <div className="text-xs text-neutral-500 mb-1 uppercase tracking-wider font-bold">Required Arsenal:</div>
                          <div className="flex flex-wrap gap-1">
                            {exercise.equipmentLinks
                              .filter(link => link.required)
                              .map((link) => (
                                <span
                                  key={link.equipmentId}
                                  className="px-2 py-0.5 bg-neutral-950 border border-neutral-800 text-neutral-400 text-xs uppercase tracking-wider"
                                >
                                  {link.equipment.name}
                                </span>
                              ))}
                          </div>
                        </div>
                      )}

                      {exercise.description && (
                        <p className="text-xs text-neutral-500 mt-2 line-clamp-2">
                          {exercise.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </PageContainer>
    </AppLayout>
  )
}
