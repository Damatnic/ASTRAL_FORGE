'use client'

import { useState, useEffect, useCallback } from 'react'
import { Trophy, Star, Award, Book, Unlock, Sparkles, X } from 'lucide-react'

interface RewardUnlockCardProps {
  type: 'achievement' | 'template' | 'feature' | 'title'
  name: string
  description: string
  onClose?: () => void
  autoClose?: boolean
  autoCloseDelay?: number
}

export function RewardUnlockCard({
  type,
  name,
  description,
  onClose,
  autoClose = false,
  autoCloseDelay = 5000,
}: RewardUnlockCardProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(true)

  const handleClose = useCallback(() => {
    setIsVisible(false)
    setTimeout(() => {
      onClose?.()
    }, 300)
  }, [onClose])

  useEffect(() => {
    // Trigger entrance animation
    setTimeout(() => setIsVisible(true), 50)
    
    // Stop pulsing animation after 2 seconds
    setTimeout(() => setIsAnimating(false), 2000)

    // Auto close if enabled
    if (autoClose && autoCloseDelay && onClose) {
      const timer = setTimeout(() => {
        handleClose()
      }, autoCloseDelay)
      return () => clearTimeout(timer)
    }
  }, [autoClose, autoCloseDelay, onClose, handleClose])

  // Icon and color based on type
  const getTypeConfig = () => {
    switch (type) {
      case 'achievement':
        return {
          icon: Trophy,
          color: 'from-yellow-500 to-amber-600',
          bgColor: 'bg-yellow-500/10',
          borderColor: 'border-yellow-500/50',
          textColor: 'text-yellow-400',
          glowColor: 'shadow-yellow-500/50',
        }
      case 'template':
        return {
          icon: Book,
          color: 'from-blue-500 to-indigo-600',
          bgColor: 'bg-blue-500/10',
          borderColor: 'border-blue-500/50',
          textColor: 'text-blue-400',
          glowColor: 'shadow-blue-500/50',
        }
      case 'feature':
        return {
          icon: Unlock,
          color: 'from-purple-500 to-violet-600',
          bgColor: 'bg-purple-500/10',
          borderColor: 'border-purple-500/50',
          textColor: 'text-purple-400',
          glowColor: 'shadow-purple-500/50',
        }
      case 'title':
        return {
          icon: Award,
          color: 'from-pink-500 to-rose-600',
          bgColor: 'bg-pink-500/10',
          borderColor: 'border-pink-500/50',
          textColor: 'text-pink-400',
          glowColor: 'shadow-pink-500/50',
        }
    }
  }

  const config = getTypeConfig()
  const Icon = config.icon

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleClose}
    >
      <div
        className={`relative max-w-md w-full mx-4 transform transition-all duration-300 ${
          isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        {onClose && (
          <button
            onClick={handleClose}
            className="absolute -top-2 -right-2 z-10 bg-gray-800 hover:bg-gray-700 rounded-full p-2 border border-gray-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Card */}
        <div
          className={`relative bg-gradient-to-br from-gray-900 to-gray-950 rounded-xl border-2 ${
            config.borderColor
          } ${config.bgColor} overflow-hidden shadow-2xl ${
            isAnimating ? `animate-pulse ${config.glowColor}` : ''
          }`}
        >
          {/* Sparkles decoration */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <Sparkles
                key={i}
                className={`absolute ${config.textColor} opacity-20`}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${Math.random() * 16 + 8}px`,
                  height: `${Math.random() * 16 + 8}px`,
                  animation: `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              />
            ))}
          </div>

          {/* Content */}
          <div className="relative p-8 text-center space-y-4">
            {/* Icon */}
            <div className="flex justify-center">
              <div
                className={`relative w-24 h-24 rounded-full bg-gradient-to-br ${config.color} flex items-center justify-center ${
                  isAnimating ? 'animate-bounce' : ''
                }`}
              >
                <Icon className="w-12 h-12 text-white" />
                {/* Glow ring */}
                <div
                  className={`absolute inset-0 rounded-full bg-gradient-to-br ${config.color} opacity-30 blur-xl animate-pulse`}
                />
              </div>
            </div>

            {/* Type label */}
            <div>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${config.bgColor} ${config.textColor} border ${config.borderColor}`}
              >
                {type} Unlocked!
              </span>
            </div>

            {/* Name */}
            <h2 className="text-2xl font-bold text-white">{name}</h2>

            {/* Description */}
            <p className="text-gray-400 text-sm leading-relaxed">{description}</p>

            {/* Star decoration */}
            <div className="flex justify-center gap-2 pt-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${config.textColor} fill-current`}
                  style={{
                    animation: `twinkle ${0.5 + i * 0.1}s ease-in-out infinite`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.2);
          }
        }
      `}</style>
    </div>
  )
}
