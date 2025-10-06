'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Flame, Sparkles, Shield, Swords } from 'lucide-react'

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
    } catch (_err) {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)]" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-slate-950 to-purple-900/20" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
      </div>
      
      <div className="relative w-full max-w-md">
        {/* Card with border glow */}
        <div className="relative bg-slate-900/80 border border-slate-800 rounded-2xl p-8 backdrop-blur-xl shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl" />
          
          <div className="relative space-y-8">
            {/* Header */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-full backdrop-blur-sm mb-2">
                <Shield className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-semibold text-blue-300">Warrior Authentication</span>
              </div>
              
              <h1 className="text-4xl font-black">
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                  ASTRAL FORGE
                </span>
              </h1>
              <p className="text-gray-400 text-lg">
                Enter the <span className="text-purple-400 font-semibold">Forge</span> and begin your legendary journey
              </p>
            </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-300 mb-2">
                Warrior ID
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500 transition-all"
                placeholder="demo@astralforge.app"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-300 mb-2">
                Secret Key
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-500 transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-400 text-sm text-center bg-red-900/20 border border-red-800 rounded-lg p-3 flex items-center justify-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-xl font-bold text-lg transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-purple-500/40"
          >
            <span className="flex items-center justify-center gap-2">
              <Flame className="w-5 h-5" />
              {loading ? 'Entering the Forge...' : 'Enter The Forge'}
              <Sparkles className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </span>
          </button>

          {/* Demo Credentials */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-slate-900 text-gray-400">Demo Access</span>
            </div>
          </div>

          <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Warrior ID:</span>
              <span className="text-blue-400 font-mono">demo@astralforge.app</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Secret Key:</span>
              <span className="text-purple-400 font-mono">demo123</span>
            </div>
          </div>

          <div className="text-center pt-2">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-blue-400 transition-colors group"
            >
              <Swords className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Return to Home
            </Link>
          </div>
        </form>
          </div>
        </div>
      </div>
    </div>
  )
}

