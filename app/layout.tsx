import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { PWAInstallPrompt } from '@/components/pwa-install-prompt'
import { KeyboardShortcutsHelp } from '@/components/keyboard-shortcuts-help'
import { ServiceWorkerProvider, OfflineIndicator } from '@/components/offline-mode'
import { PerformanceMonitorToggle } from '@/components/performance-monitor'

const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#CD7F32', // Warrior Bronze
}

export const metadata: Metadata = {
  title: 'Astral Forge - Forge Your Warrior Body',
  description: 'Train like the ancients. Track like a champion. Master your strength through discipline and iron.',
  manifest: '/manifest.json',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">⚔️</text></svg>',
  },
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
    <html lang="en" className="dark">
      <body className={inter.className}>
        <ServiceWorkerProvider>
          <Providers>
            {children}
            <PWAInstallPrompt />
            <KeyboardShortcutsHelp />
            <OfflineIndicator />
            <PerformanceMonitorToggle />
          </Providers>
        </ServiceWorkerProvider>
      </body>
    </html>
  )
}

