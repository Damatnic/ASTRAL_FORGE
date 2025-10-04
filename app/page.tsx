import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-b from-astral-dark via-astral-gray to-black">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Logo/Title */}
        <div className="space-y-4 animate-fade-in">
          <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-astral-blue via-astral-purple to-astral-blue bg-clip-text text-transparent">
            🔨 Astral Forge
          </h1>
          <p className="text-xl md:text-2xl text-gray-400">
            Forge Your Strength. Temper Your Discipline.
          </p>
          <p className="text-lg text-gray-500">
            Where science meets iron, and legends are smithed
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mt-12 animate-slide-up">
          <div className="bg-astral-gray/50 backdrop-blur-sm p-6 rounded-xl border border-gray-800 card-hover">
            <div className="text-4xl mb-4">⚒️</div>
            <h3 className="text-lg font-semibold mb-2">Progressive Tempering</h3>
            <p className="text-gray-400 text-sm">
              Research-backed algorithms that forge stronger lifts with every session
            </p>
          </div>

          <div className="bg-astral-gray/50 backdrop-blur-sm p-6 rounded-xl border border-gray-800 card-hover">
            <div className="text-4xl mb-4">🔥</div>
            <h3 className="text-lg font-semibold mb-2">Anvil Feedback</h3>
            <p className="text-gray-400 text-sm">
              Real-time adjustments based on RPE to optimize every forging session
            </p>
          </div>

          <div className="bg-astral-gray/50 backdrop-blur-sm p-6 rounded-xl border border-gray-800 card-hover">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-lg font-semibold mb-2">Master Craftsman</h3>
            <p className="text-gray-400 text-sm">
              Streaks, achievements, and the forgemaster's record to track your journey
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
          <Link
            href="/auth/signin"
            className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl font-bold text-lg hover:opacity-90 transition-opacity text-black shadow-lg shadow-yellow-500/50"
          >
            🔨 ENTER THE FORGE
          </Link>
          <Link
            href="/dashboard"
            className="px-8 py-4 bg-gray-800 hover:bg-gray-700 rounded-xl font-semibold text-lg transition-colors border-2 border-gray-700"
          >
            Classic View
          </Link>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-gray-800">
          <div>
            <div className="text-3xl font-bold text-astral-blue">27</div>
            <div className="text-sm text-gray-400">Forging Tools</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-astral-purple">3s</div>
            <div className="text-sm text-gray-400">To Log a Set</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-astral-blue">100%</div>
            <div className="text-sm text-gray-400">Science-Forged</div>
          </div>
        </div>

        {/* Forge Philosophy */}
        <div className="mt-16 bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-700/30 rounded-xl p-8">
          <h3 className="text-2xl font-bold mb-4">⚡ The Forge Philosophy</h3>
          <p className="text-gray-300 text-lg leading-relaxed">
            Every great lifter was forged through consistent tempering. 
            Astral Forge combines cutting-edge exercise science with the ancient art of 
            progressive overload - where each session hammers you into a stronger version 
            of yourself. No gimmicks. No shortcuts. Just you, the iron, and intelligent 
            algorithms guiding your transformation.
          </p>
        </div>
      </div>
    </main>
  )
}
