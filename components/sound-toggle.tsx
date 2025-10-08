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
          p-3 transition-all border-2
          ${soundEnabled 
            ? 'bg-amber-950/20 border-amber-700 text-amber-400' 
            : 'bg-neutral-900 border-neutral-600 text-neutral-500'
          }
        `}
      >
        <span className="text-xl">{soundEnabled ? '🔊' : '🔇'}</span>
      </button>

      {/* Settings Panel */}
      {showPanel && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-black/95 border-2 border-amber-700 shadow-2xl shadow-amber-500/50 backdrop-blur-md z-50">
          <div className="p-4 space-y-4">
            <h3 className="text-lg font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <span>🎵</span>
              <span>AUDIO SETTINGS</span>
            </h3>

            {/* Master Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-white font-black uppercase tracking-wider">Sound Effects</span>
              <button
                onClick={toggleSound}
                className={`
                  relative w-14 h-7 transition-colors
                  ${soundEnabled ? 'bg-amber-500' : 'bg-neutral-600'}
                `}
              >
                <div
                  className={`
                    absolute top-1 w-5 h-5 bg-white transition-transform
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
                    <span className="text-sm text-neutral-400 uppercase tracking-wider font-bold">SFX Volume</span>
                    <span className="text-amber-400 font-mono font-black">{volume}%</span>
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
                    <span className="text-sm text-neutral-400 font-bold uppercase tracking-wider">MUSIC VOLUME</span>
                    <span className="text-amber-400 font-mono font-black uppercase tracking-wider">{musicVolume}%</span>
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
                  <div className="text-sm text-neutral-400 font-bold uppercase tracking-wider mb-2">TEST SOUNDS</div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: 'CLICK', sound: 'click' },
                      { label: 'LEVEL', sound: 'levelup' },
                      { label: 'ACHIEVE', sound: 'achievement' },
                      { label: 'XP', sound: 'xp' },
                      { label: 'LOOT', sound: 'loot' },
                      { label: 'CRIT', sound: 'critical' },
                    ].map((item) => (
                      <button
                        key={item.sound}
                        onClick={() => testSound(item.sound)}
                        className="px-3 py-2 bg-neutral-900 hover:bg-amber-950/20 border-2 border-neutral-700 hover:border-amber-700 text-xs font-black uppercase tracking-wider transition-colors"
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

