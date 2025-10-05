'use client'

import { ReactNode, useState } from 'react'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string | ReactNode
  confirmText?: string
  cancelText?: string
  confirmVariant?: 'danger' | 'primary' | 'success'
  onConfirm: () => void
  onCancel: () => void
  loading?: boolean
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'primary',
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmDialogProps) {
  if (!isOpen) return null

  const variantStyles = {
    danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    primary: 'bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 focus:ring-purple-500',
    success: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div 
        className="bg-gray-900 border border-purple-500/30 rounded-xl shadow-2xl max-w-md w-full transform transition-all animate-scale-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
      >
        {/* Header */}
        <div className="p-6 border-b border-purple-500/20">
          <h2 
            id="dialog-title"
            className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
          >
            {title}
          </h2>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="text-gray-300 text-lg leading-relaxed">
            {message}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-purple-500/20 flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`
              px-6 py-3 text-white font-semibold rounded-lg transition-all
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900
              disabled:opacity-50 disabled:cursor-not-allowed
              ${variantStyles[confirmVariant]}
            `}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </span>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

// Hook for easier usage
export function useConfirmDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [dialogProps, setDialogProps] = useState<Omit<ConfirmDialogProps, 'isOpen' | 'onConfirm' | 'onCancel'>>({
    title: '',
    message: '',
  })
  const [onConfirmCallback, setOnConfirmCallback] = useState<(() => void) | null>(null)

  const confirm = (props: Omit<ConfirmDialogProps, 'isOpen' | 'onConfirm' | 'onCancel'>): Promise<boolean> => {
    return new Promise((resolve) => {
      setDialogProps(props)
      setIsOpen(true)
      
      setOnConfirmCallback(() => () => {
        resolve(true)
        setIsOpen(false)
      })
    })
  }

  const handleCancel = () => {
    setIsOpen(false)
  }

  const handleConfirm = () => {
    if (onConfirmCallback) {
      onConfirmCallback()
    }
  }

  const DialogComponent = () => (
    <ConfirmDialog
      {...dialogProps}
      isOpen={isOpen}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
  )

  return {
    confirm,
    ConfirmDialog: DialogComponent,
  }
}
