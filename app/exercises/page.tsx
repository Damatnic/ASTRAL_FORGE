'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('all')

  useEffect(() => {
    loadExercises()
  }, [])

  const loadExercises = async () => {
    try {
      const response = await fetch('/api/exercises')
      if (response.ok) {
        const data = await response.json()
        setExercises(data)
      }
    } catch (error) {
      console.error('Failed to load exercises:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || exercise.category === selectedCategory
    const matchesMuscleGroup = selectedMuscleGroup === 'all' || exercise.muscleGroup === selectedMuscleGroup
    return matchesSearch && matchesCategory && matchesMuscleGroup
  })

  const categories = ['all', 'compound', 'isolation', 'accessory']
  const muscleGroups = ['all', 'push', 'pull', 'legs', 'core']

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
          <div className="flex items-center justify-between">
            <div>
              <Link href="/dashboard" className="text-gray-400 hover:text-white mb-2 inline-block">
                ← Back to Dashboard
              </Link>
              <h1 className="text-3xl font-bold">Exercise Library</h1>
              <p className="text-gray-400 mt-2">{exercises.length} exercises available</p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/exercises/create"
                className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 rounded-lg hover:opacity-90 transition-opacity text-sm font-medium whitespace-nowrap"
              >
                ➕ Create Custom
              </Link>
              <Link
                href="/exercises/search"
                className="px-4 py-2 bg-gradient-to-r from-astral-blue to-astral-purple rounded-lg hover:opacity-90 transition-opacity text-sm font-medium whitespace-nowrap"
              >
                🔍 Advanced Search
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        {/* Filters */}
        <div className="bg-astral-gray border border-gray-800 rounded-xl p-6 mb-6">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Search</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search exercises..."
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-astral-blue text-white"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-astral-blue text-white"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Muscle Group Filter */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Muscle Group</label>
              <select
                value={selectedMuscleGroup}
                onChange={(e) => setSelectedMuscleGroup(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-astral-blue text-white"
              >
                {muscleGroups.map(group => (
                  <option key={group} value={group}>
                    {group.charAt(0).toUpperCase() + group.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {(searchTerm || selectedCategory !== 'all' || selectedMuscleGroup !== 'all') && (
            <div className="mt-4 text-sm text-gray-400">
              Showing {filteredExercises.length} of {exercises.length} exercises
            </div>
          )}
        </div>

        {/* Exercise Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredExercises.map((exercise) => (
            <div
              key={exercise.id}
              className="bg-astral-gray border border-gray-800 rounded-xl p-6 hover:border-astral-blue transition-colors"
            >
              <div className="mb-3">
                <h3 className="text-lg font-semibold mb-1">{exercise.name}</h3>
                <div className="flex gap-2 text-xs">
                  <span className="px-2 py-1 bg-astral-blue/20 text-astral-blue rounded">
                    {exercise.category}
                  </span>
                  <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded">
                    {exercise.muscleGroup}
                  </span>
                </div>
              </div>

              {exercise.description && (
                <p className="text-sm text-gray-400 mb-3">{exercise.description}</p>
              )}

              <div className="text-sm text-gray-500">
                Equipment: {exercise.equipment || 'None'}
              </div>

              <Link
                href={`/exercises/${exercise.id}`}
                className="mt-4 block text-center py-2 bg-astral-blue/20 text-astral-blue rounded-lg hover:bg-astral-blue/30 transition-colors text-sm"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>

        {filteredExercises.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p>No exercises found matching your filters</p>
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('all')
                setSelectedMuscleGroup('all')
              }}
              className="mt-4 px-6 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

