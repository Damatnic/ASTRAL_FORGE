'use client'

import { ProgramTemplateBrowser } from '@/components/program-template-browser'
import type { ProgramTemplate } from '@/components/program-template-browser'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ProgramTemplatesPage() {
  const router = useRouter()

  const handleSelectTemplate = async (template: ProgramTemplate) => {
    // TODO: Create program from template
    // For now, just navigate to create program page with template ID
    router.push(`/programs/create?template=${template.id}`)
  }

  return (
    <div className="min-h-screen bg-astral-dark text-white">
      {/* Header */}
      <header className="bg-astral-gray border-b border-gray-800 p-6">
        <div className="max-w-7xl mx-auto">
          <Link href="/programs" className="text-gray-400 hover:text-white mb-2 inline-block">
            ← Back to Programs
          </Link>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-astral-blue to-astral-purple bg-clip-text text-transparent">
            Program Templates
          </h1>
          <p className="text-gray-400">
            Choose from proven workout programs designed by experts. Perfect for all experience levels.
          </p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto p-6">
        <ProgramTemplateBrowser
          onSelectTemplate={handleSelectTemplate}
          showFilters
        />
      </main>

      {/* Help Section */}
      <section className="max-w-7xl mx-auto p-6 mt-12">
        <div className="bg-gradient-to-r from-astral-blue/20 to-astral-purple/20 border border-astral-blue/30 rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-4">Need Help Choosing?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold mb-2 text-green-400">🌱 New to Lifting?</h3>
              <p className="text-sm text-gray-300 mb-2">
                Start with <strong>StrongLifts 5×5</strong> or <strong>Starting Strength</strong>.
                These programs build a solid foundation with simple, proven progressions.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-yellow-400">💪 Some Experience?</h3>
              <p className="text-sm text-gray-300 mb-2">
                Try <strong>PPL</strong>, <strong>Upper/Lower Split</strong>, or <strong>GZCLP</strong>.
                More volume and flexibility while still making consistent gains.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-red-400">🔥 Advanced Lifter?</h3>
              <p className="text-sm text-gray-300 mb-2">
                Consider <strong>5/3/1</strong>, <strong>nSuns</strong>, or <strong>Texas Method</strong>.
                Periodized programs for long-term strength development.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
