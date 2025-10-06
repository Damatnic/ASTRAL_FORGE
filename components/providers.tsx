'use client'

/**
 * Centralized Providers Component
 * Wraps the application with all necessary context providers
 */

import { SessionProvider } from 'next-auth/react'
import { ToastProvider } from '@/components/toast'
import { ThemeProvider } from './theme-provider'
import { SoundProvider } from './sound-provider'

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <SoundProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </SoundProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}
