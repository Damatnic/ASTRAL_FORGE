'use client'

import Link from 'next/link'
import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-astral-dark flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-astral-gray border border-red-800 rounded-xl p-8 text-center">
        <div className="text-6xl mb-4">💥</div>
        <h1 className="text-2xl font-bold text-red-400 mb-2">
          Oops! Something went wrong
        </h1>
        <p className="text-gray-300 mb-6">
          {error.message || 'An unexpected error occurred'}
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={reset}
            className="w-full py-3 bg-gradient-to-r from-astral-blue to-astral-purple rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Try Again
          </button>
          <Link
            href="/dashboard"
            className="w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors block"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}

