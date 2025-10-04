'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { keyboardShortcuts } from '@/lib/keyboard-shortcuts'

export function KeyboardShortcutsHelp() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (!keyboardShortcuts) return

    // Register global shortcuts
    keyboardShortcuts.register('help', {
      key: '?',
      shift: true,
      description: 'Show keyboard shortcuts',
      action: () => setIsOpen(true),
    })

    keyboardShortcuts.register('close-help', {
      key: 'Escape',
      description: 'Close dialogs',
      action: () => setIsOpen(false),
    })

    // Navigation shortcuts
    keyboardShortcuts.register('goto-dashboard', {
      key: 'd',
      description: 'Go to Dashboard',
      action: () => router.push('/dashboard'),
    })

    keyboardShortcuts.register('goto-workout', {
      key: 'w',
      description: 'Start Workout',
      action: () => router.push('/workout/session'),
    })

    keyboardShortcuts.register('goto-progress', {
      key: 'p',
      description: 'View Progress',
      action: () => router.push('/progress'),
    })

    keyboardShortcuts.register('goto-exercises', {
      key: 'e',
      description: 'Browse Exercises',
      action: () => router.push('/exercises'),
    })

    keyboardShortcuts.register('goto-programs', {
      key: 'r',
      description: 'View Programs',
      action: () => router.push('/programs'),
    })

    keyboardShortcuts.register('goto-settings', {
      key: 's',
      description: 'Open Settings',
      action: () => router.push('/settings'),
    })

    return () => {
      // Cleanup
      keyboardShortcuts.unregister('help')
      keyboardShortcuts.unregister('close-help')
      keyboardShortcuts.unregister('goto-dashboard')
      keyboardShortcuts.unregister('goto-workout')
      keyboardShortcuts.unregister('goto-progress')
      keyboardShortcuts.unregister('goto-exercises')
      keyboardShortcuts.unregister('goto-programs')
      keyboardShortcuts.unregister('goto-settings')
    }
  }, [router])

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center text-lg font-bold transition-colors z-40 hidden md:flex"
        title="Keyboard shortcuts (Shift + ?)"
      >
        ?
      </button>
    )
  }

  const shortcuts = keyboardShortcuts?.getAll() || []

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 z-50 animate-fade-in"
        onClick={() => setIsOpen(false)}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-astral-gray border border-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto z-50 animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">⌨️ Keyboard Shortcuts</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-700 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {/* Navigation */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-astral-blue">Navigation</h3>
            <div className="grid gap-2">
              <ShortcutRow shortcut="D" description="Go to Dashboard" />
              <ShortcutRow shortcut="W" description="Start Workout" />
              <ShortcutRow shortcut="P" description="View Progress" />
              <ShortcutRow shortcut="E" description="Browse Exercises" />
              <ShortcutRow shortcut="R" description="View Programs" />
              <ShortcutRow shortcut="S" description="Open Settings" />
            </div>
          </div>

          {/* General */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-astral-purple">General</h3>
            <div className="grid gap-2">
              <ShortcutRow shortcut="Shift + ?" description="Show this help" />
              <ShortcutRow shortcut="Esc" description="Close dialogs/modals" />
              <ShortcutRow shortcut="/" description="Focus search (where available)" />
            </div>
          </div>

          {/* During Workout */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-green-400">During Workout</h3>
            <div className="grid gap-2">
              <ShortcutRow shortcut="Space" description="Mark set complete (when focused)" />
              <ShortcutRow shortcut="Enter" description="Submit current form" />
              <ShortcutRow shortcut="Tab" description="Navigate between inputs" />
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-700">
          <p className="text-sm text-gray-400 text-center">
            💡 Tip: These shortcuts work anywhere in the app except when typing in text fields
          </p>
        </div>
      </div>
    </>
  )
}

function ShortcutRow({ shortcut, description }: { shortcut: string; description: string }) {
  return (
    <div className="flex items-center justify-between py-2 px-3 bg-gray-700/30 rounded-lg">
      <span className="text-gray-300">{description}</span>
      <kbd className="px-3 py-1 bg-gray-800 border border-gray-600 rounded text-sm font-mono">
        {shortcut}
      </kbd>
    </div>
  )
}
