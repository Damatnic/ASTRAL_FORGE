'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignIn() {
  const [email, setEmail] = useState('demo@astralforge.app')
  const [password, setPassword] = useState('demo123')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid email or password')
      } else {
        router.push('/forge')
      }
    } catch (err) {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-astral-dark to-black">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-astral-blue to-astral-purple bg-clip-text text-transparent">
            🔨 Astral Forge
          </h1>
          <p className="mt-2 text-gray-400">Enter the forge and begin your tempering</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-astral-gray border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-astral-blue text-white"
                placeholder="demo@astralforge.app"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-astral-gray border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-astral-blue text-white"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-400 text-sm text-center bg-red-900/20 border border-red-800 rounded-lg p-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-astral-blue to-astral-purple rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Entering the forge...' : '🔨 Enter Forge'}
          </button>

          <div className="text-center text-sm text-gray-400">
            <p>Demo credentials:</p>
            <p className="mt-1 text-gray-300">
              Email: <span className="text-astral-blue">demo@astralforge.app</span>
            </p>
            <p className="text-gray-300">
              Password: <span className="text-astral-blue">demo123</span>
            </p>
          </div>

          <div className="text-center">
            <Link href="/" className="text-sm text-astral-blue hover:text-astral-purple transition-colors">
              ← Back to home
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

