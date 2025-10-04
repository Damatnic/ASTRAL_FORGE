import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ToastProvider } from '@/components/toast'
import { PWAInstallPrompt } from '@/components/pwa-install-prompt'
import { KeyboardShortcutsHelp } from '@/components/keyboard-shortcuts-help'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Astral Forge - Forge Your Strength',
  description: 'Forge your strength with progressive, adaptive training. Automated progressive overload and RPE-based autoregulation.',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  manifest: '/manifest.json',
  themeColor: '#3B82F6',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Astral Forge',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastProvider>
          {children}
          <PWAInstallPrompt />
          <KeyboardShortcutsHelp />
        </ToastProvider>
      </body>
    </html>
  )
}

