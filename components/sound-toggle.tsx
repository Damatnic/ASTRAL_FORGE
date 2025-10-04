'use client'

import { useState, useEffect } from 'react'
import { useSound } from '@/lib/sound-system'

/**
 * Sound Settings Toggle
 * Control panel for sound effects and music
 */

export function SoundToggle() {
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [volume, setVolume] = useState(50)
  const [musicVolume, setMusicVolume] = useState(30)
  const [showPanel, setShowPanel] = useState(false)
  const sound = useSound()

  useEffect(() => {
    // Load from localStorage
    const savedSound = localStorage.getItem('soundEnabled')
    const savedVolume = localStorage.getItem('soundVolume')
    const savedMusic = localStorage.getItem('musicVolume')
    
    if (savedSound !== null) setSoundEnabled(savedSound === 'true')
    if (savedVolume !== null) setVolume(parseInt(savedVolume))
    if (savedMusic !== null) setMusicVolume(parseInt(savedMusic))
  }, [])

  const toggleSound = () => {
    const newValue = !soundEnabled
    setSoundEnabled(newValue)
    sound.setEnabled(newValue)
    localStorage.setItem('soundEnabled', String(newValue))
    
    if (newValue) {
      sound.play('success')
    }
  }

  const handleVolumeChange = (value: number) => {
    setVolume(value)
    sound.setVolume(value / 100)
    localStorage.setItem('soundVolume', String(value))
  }

  const handleMusicVolumeChange = (value: number) => {
    setMusicVolume(value)
    sound.setMusicVolume(value / 100)
    localStorage.setItem('musicVolume', String(value))
  }

  const testSound = (effect: any) => {
    sound.play(effect)
  }

  return (
    <div className="relative">
      {/* Toggle Button */}
      <button
        onClick={() => {
          setShowPanel(!showPanel)
          sound.play('click')
        }}
        className={`
          p-3 rounded-lg transition-all
          ${soundEnabled 
            ? 'bg-cyan-500/20 border-2 border-cyan-500 text-cyan-400' 
            : 'bg-gray-800 border-2 border-gray-600 text-gray-500'
          }
        `}
      >
        <span className="text-xl">{soundEnabled ? '🔊' : '🔇'}</span>
      </button>

      {/* Settings Panel */}
      {showPanel && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-black/95 border-2 border-cyan-500 rounded-lg shadow-2xl shadow-cyan-500/50 backdrop-blur-md z-50">
          <div className="p-4 space-y-4">
            <h3 className="text-lg font-bold text-cyan-400 flex items-center gap-2">
              <span>🎵</span>
              <span>AUDIO SETTINGS</span>
            </h3>

            {/* Master Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-white">Sound Effects</span>
              <button
                onClick={toggleSound}
                className={`
                  relative w-14 h-7 rounded-full transition-colors
                  ${soundEnabled ? 'bg-cyan-500' : 'bg-gray-600'}
                `}
              >
                <div
                  className={`
                    absolute top-1 w-5 h-5 bg-white rounded-full transition-transform
                    ${soundEnabled ? 'translate-x-8' : 'translate-x-1'}
                  `}
                />
              </button>
            </div>

            {soundEnabled && (
              <>
                {/* SFX Volume */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">SFX Volume</span>
                    <span className="text-cyan-400 font-mono">{volume}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
                    onMouseUp={() => sound.play('click')}
                    className="w-full"
                  />
                </div>

                {/* Music Volume */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Music Volume</span>
                    <span className="text-purple-400 font-mono">{musicVolume}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={musicVolume}
                    onChange={(e) => handleMusicVolumeChange(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                {/* Test Sounds */}
                <div>
                  <div className="text-sm text-gray-400 mb-2">Test Sounds</div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: 'Click', sound: 'click' },
                      { label: 'Level', sound: 'levelup' },
                      { label: 'Achieve', sound: 'achievement' },
                      { label: 'XP', sound: 'xp' },
                      { label: 'Loot', sound: 'loot' },
                      { label: 'Crit', sound: 'critical' },
                    ].map((item) => (
                      <button
                        key={item.sound}
                        onClick={() => testSound(item.sound)}
                        className="px-3 py-2 bg-gray-800 hover:bg-cyan-500/20 border border-gray-700 hover:border-cyan-500 rounded text-xs transition-colors"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

