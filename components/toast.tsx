'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface Toast {
  id: string
  message: string
  type: ToastType
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void
  toast: (type: ToastType, message: string) => void
  success: (message: string) => void
  error: (message: string) => void
  info: (message: string) => void
  warning: (message: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

const toastIcons = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
  warning: '⚠',
}

const toastStyles = {
  success: 'bg-amber-950/90 border-l-4 border-amber-500',
  error: 'bg-red-950/90 border-l-4 border-red-500',
  info: 'bg-amber-950/90 border-l-4 border-amber-500',
  warning: 'bg-amber-950/90 border-l-4 border-amber-500',
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(7)
    const newToast = { id, message, type }
    
    setToasts(prev => [...prev, newToast])

    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3000)
  }, [])

  const toast = useCallback((type: ToastType, message: string) => {
    showToast(message, type)
  }, [showToast])

  const success = useCallback((message: string) => {
    showToast(message, 'success')
  }, [showToast])

  const error = useCallback((message: string) => {
    showToast(message, 'error')
  }, [showToast])

  const info = useCallback((message: string) => {
    showToast(message, 'info')
  }, [showToast])

  const warning = useCallback((message: string) => {
    showToast(message, 'warning')
  }, [showToast])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast, toast, success, error, info, warning }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`
              ${toastStyles[toast.type]}
              text-white px-6 py-3 shadow-lg
              min-w-[300px] max-w-[500px]
              animate-slide-in-right pointer-events-auto
              flex items-center gap-3
              border-2 border-neutral-800
            `}
          >
            <span className="text-xl font-black flex-shrink-0 uppercase tracking-wider">
              {toastIcons[toast.type]}
            </span>
            <span className="flex-1 font-bold uppercase tracking-wider">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 hover:bg-white/20 px-2 py-1 transition border border-neutral-700 font-black uppercase tracking-wider"
              aria-label="Close notification"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}
