'use client'

import { useState, useEffect } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Sword, ChevronLeft } from 'lucide-react'

const warriorQuotes = [
  {
    quote: "The iron never lies.",
    author: "Henry Rollins"
  },
  {
    quote: "Discipline is the bridge between goals and accomplishment.",
    author: "Jim Rohn"
  },
  {
    quote: "Strength does not come from winning. Your struggles develop your strengths.",
    author: "Arnold Schwarzenegger"
  },
  {
    quote: "The body achieves what the mind believes.",
    author: "Napoleon Hill"
  },
  {
    quote: "Pain is weakness leaving the body.",
    author: "Unknown Warrior"
  },
  {
    quote: "Earned, not given.",
    author: "Warrior Code"
  }
]

export default function SignIn() {
  const [email, setEmail] = useState('demo@astralforge.app')
  const [password, setPassword] = useState('demo123')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [currentQuote, setCurrentQuote] = useState(0)
  const router = useRouter()

  // Rotate quotes every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % warriorQuotes.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

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
        setError('Invalid credentials. Only warriors with honor may enter.')
      } else {
        router.push('/dashboard')
      }
    } catch (_err) {
      setError('The forge is unavailable. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-neutral-950">
      {/* LEFT SIDE - Warrior Quote/Imagery */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-neutral-900 border-r border-amber-900/20">
        {/* Dark Metal Texture */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#1a1a1a_1px,transparent_1px)] bg-[size:24px_24px] opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-br from-amber-950/30 via-neutral-900 to-neutral-950" />
        </div>

        {/* Content */}
        <div className="relative flex flex-col justify-between p-16 w-full">
          {/* Top - Logo */}
          <Link href="/" className="group flex items-center gap-3 text-amber-500 hover:text-amber-400 transition-colors">
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-bold tracking-wider uppercase">Back to Home</span>
          </Link>

          {/* Center - Quote */}
          <div className="space-y-8">
            <div className="w-16 h-1 bg-gradient-to-r from-amber-600 to-transparent" />
            <blockquote className="space-y-6">
              <p className="text-4xl md:text-5xl font-black text-amber-100 leading-tight tracking-tight transition-opacity duration-500">
                &ldquo;{warriorQuotes[currentQuote].quote}&rdquo;
              </p>
              <footer className="text-xl text-neutral-500 font-light">
                — {warriorQuotes[currentQuote].author}
              </footer>
            </blockquote>
            <div className="w-16 h-1 bg-gradient-to-r from-transparent to-amber-600" />
          </div>

          {/* Bottom - Decoration */}
          <div className="flex items-center gap-2">
            {warriorQuotes.map((_, index) => (
              <div
                key={index}
                className={`h-1 flex-1 transition-all duration-500 ${
                  index === currentQuote ? 'bg-amber-600' : 'bg-neutral-800'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - Sign In Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 border-2 border-amber-700 bg-amber-950/50">
              <Sword className="w-8 h-8 text-amber-500" />
            </div>
            <div>
              <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-2">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-400">
                  ENTER
                </span>
              </h1>
              <h2 className="text-3xl font-black text-amber-100 tracking-tight mb-3">
                THE FORGE
              </h2>
              <div className="h-0.5 w-24 mx-auto bg-gradient-to-r from-transparent via-amber-600 to-transparent" />
            </div>
            <p className="text-neutral-500 font-light">
              Only warriors with discipline may pass
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-bold tracking-wider uppercase text-neutral-400">
                Warrior Identification
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-5 py-4 bg-neutral-900 border-2 border-neutral-800 hover:border-neutral-700 focus:border-amber-700 focus:outline-none text-neutral-100 placeholder-neutral-600 transition-colors font-mono"
                placeholder="your@email.com"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-bold tracking-wider uppercase text-neutral-400">
                Secret Passphrase
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-5 py-4 bg-neutral-900 border-2 border-neutral-800 hover:border-neutral-700 focus:border-amber-700 focus:outline-none text-neutral-100 placeholder-neutral-600 transition-colors font-mono"
                placeholder="••••••••••••"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="border-2 border-red-900 bg-red-950/50 p-4 text-center">
                <p className="text-red-400 text-sm font-semibold">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full py-5 bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 hover:from-amber-600 hover:via-amber-500 hover:to-amber-600 border-2 border-amber-500/50 shadow-[0_0_30px_rgba(205,127,50,0.3)] hover:shadow-[0_0_50px_rgba(205,127,50,0.5)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="flex items-center justify-center gap-3 text-lg font-black tracking-wider uppercase text-neutral-950">
                <Sword className="w-5 h-5" />
                {loading ? 'Entering...' : 'Enter The Forge'}
              </span>
            </button>

            {/* Divider */}
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-800" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-neutral-950 text-xs text-neutral-600 uppercase tracking-widest">
                  Demo Access
                </span>
              </div>
            </div>

            {/* Demo Credentials Box */}
            <div className="border-2 border-neutral-800 bg-neutral-900/50 p-5 space-y-3">
              <div className="text-xs text-neutral-600 uppercase tracking-widest mb-3">
                Demo Credentials
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-500">ID:</span>
                  <code className="text-sm text-amber-500 font-mono">demo@astralforge.app</code>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-500">Pass:</span>
                  <code className="text-sm text-amber-500 font-mono">demo123</code>
                </div>
              </div>
            </div>
          </form>

          {/* Mobile-only Quote */}
          <div className="lg:hidden pt-8 border-t border-neutral-800">
            <blockquote className="text-center space-y-3">
              <p className="text-lg text-neutral-400 italic leading-relaxed">
                &ldquo;{warriorQuotes[currentQuote].quote}&rdquo;
              </p>
              <footer className="text-sm text-neutral-600">
                — {warriorQuotes[currentQuote].author}
              </footer>
            </blockquote>
          </div>
        </div>
      </div>
    </div>
  )
}

