'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Exercise {
  id: string
  name: string
  category: string
  muscleGroup: string
  equipment?: string
  description?: string
}

export default function ExerciseSearchPage() {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('all')
  const [selectedEquipment, setSelectedEquipment] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadExercises()
  }, [])

  useEffect(() => {
    filterExercises()
  }, [searchTerm, selectedCategory, selectedMuscleGroup, selectedEquipment, exercises])

  const loadExercises = async () => {
    try {
      const res = await fetch('/api/exercises')
      if (res.ok) {
        const data = await res.json()
        setExercises(data)
        setFilteredExercises(data)
      }
    } catch (error) {
      console.error('Failed to load exercises:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterExercises = () => {
    let filtered = exercises

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(ex =>
        ex.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ex.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(ex => ex.category === selectedCategory)
    }

    // Filter by muscle group
    if (selectedMuscleGroup !== 'all') {
      filtered = filtered.filter(ex => ex.muscleGroup === selectedMuscleGroup)
    }

    // Filter by equipment
    if (selectedEquipment !== 'all') {
      filtered = filtered.filter(ex => ex.equipment === selectedEquipment)
    }

    setFilteredExercises(filtered)
  }

  // Get unique values for filters
  const categories = Array.from(new Set(exercises.map(ex => ex.category)))
  const muscleGroups = Array.from(new Set(exercises.map(ex => ex.muscleGroup)))
  const equipmentTypes = Array.from(new Set(exercises.map(ex => ex.equipment).filter(Boolean)))

  if (loading) {
    return (
      <div className="min-h-screen bg-astral-dark flex items-center justify-center">
        <div className="text-gray-400">Loading exercises...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-astral-dark text-white">
      <header className="bg-astral-gray border-b border-gray-800 p-6">
        <div className="max-w-6xl mx-auto">
          <Link href="/exercises" className="text-gray-400 hover:text-white mb-2 inline-block">
            ← Back to Exercise Library
          </Link>
          <h1 className="text-3xl font-bold">Search Exercises</h1>
          <p className="text-gray-400 mt-2">Find the perfect exercise for your workout</p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        {/* Search Bar */}
        <div className="bg-astral-gray border border-gray-800 rounded-xl p-4 mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search exercises by name or description..."
            className="w-full px-4 py-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-astral-blue outline-none text-lg"
          />
        </div>

        {/* Filters */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-astral-blue"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Muscle Group</label>
            <select
              value={selectedMuscleGroup}
              onChange={(e) => setSelectedMuscleGroup(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-astral-blue"
            >
              <option value="all">All Muscle Groups</option>
              {muscleGroups.map(group => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Equipment</label>
            <select
              value={selectedEquipment}
              onChange={(e) => setSelectedEquipment(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-astral-blue"
            >
              <option value="all">All Equipment</option>
              {equipmentTypes.map(eq => (
                <option key={eq} value={eq}>{eq}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 text-gray-400">
          Showing {filteredExercises.length} of {exercises.length} exercises
        </div>

        {/* Exercise Grid */}
        {filteredExercises.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              No exercises found matching your criteria
            </div>
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('all')
                setSelectedMuscleGroup('all')
                setSelectedEquipment('all')
              }}
              className="px-6 py-2 bg-astral-blue rounded-lg hover:opacity-90 transition-opacity"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredExercises.map((exercise) => (
              <Link
                key={exercise.id}
                href={`/exercises/${exercise.id}`}
                className="bg-astral-gray border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors group"
              >
                <h3 className="text-lg font-semibold mb-2 group-hover:text-astral-blue transition-colors">
                  {exercise.name}
                </h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="px-2 py-1 bg-astral-blue/20 text-astral-blue rounded text-xs">
                    {exercise.category}
                  </span>
                  <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs">
                    {exercise.muscleGroup}
                  </span>
                  {exercise.equipment && (
                    <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">
                      {exercise.equipment}
                    </span>
                  )}
                </div>
                {exercise.description && (
                  <p className="text-sm text-gray-400 line-clamp-2">
                    {exercise.description}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
