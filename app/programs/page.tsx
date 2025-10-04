'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPrograms()
  }, [])

  const loadPrograms = async () => {
    try {
      const response = await fetch('/api/programs')
      if (response.ok) {
        const data = await response.json()
        setPrograms(data)
      }
    } catch (error) {
      console.error('Failed to load programs:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-astral-dark flex items-center justify-center">
        <div className="text-gray-400">Loading programs...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-astral-dark text-white">
      {/* Header */}
      <header className="bg-astral-gray border-b border-gray-800 p-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <Link href="/dashboard" className="text-gray-400 hover:text-white mb-2 inline-block">
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold">Workout Programs</h1>
          </div>
          <Link
            href="/programs/new"
            className="px-6 py-3 bg-gradient-to-r from-astral-blue to-astral-purple rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            + Create Program
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        {programs.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">💪</div>
            <h2 className="text-2xl font-bold mb-2">No Programs Yet</h2>
            <p className="text-gray-400 mb-6">Create your first workout program to get started!</p>
            <Link
              href="/programs/new"
              className="inline-block px-8 py-3 bg-astral-blue rounded-lg hover:opacity-90 transition-opacity"
            >
              Create Your First Program
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program) => (
              <div
                key={program.id}
                className="bg-astral-gray border border-gray-800 rounded-xl p-6 hover:border-astral-blue transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-1">{program.name}</h3>
                    {program.description && (
                      <p className="text-sm text-gray-400">{program.description}</p>
                    )}
                  </div>
                  {program.active && (
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">
                      Active
                    </span>
                  )}
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-400">
                    <span className="mr-2">📋</span>
                    {program.exerciseCount || 0} exercises
                  </div>
                  {program.schedule && (
                    <div className="flex items-center text-sm text-gray-400">
                      <span className="mr-2">📅</span>
                      {Object.keys(program.schedule).length} days/week
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/programs/${program.id}`}
                    className="flex-1 py-2 bg-astral-blue rounded-lg text-center hover:opacity-90 transition-opacity text-sm"
                  >
                    View Details
                  </Link>
                  <Link
                    href={`/programs/${program.id}/edit`}
                    className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors text-sm"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

