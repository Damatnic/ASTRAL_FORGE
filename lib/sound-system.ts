/**
 * Sound Effects & Music System
 * Web Audio API-based sound system for gaming experience
 */

export type SoundEffect = 
  | 'click'
  | 'hover'
  | 'levelup'
  | 'achievement'
  | 'xp'
  | 'loot'
  | 'quest_complete'
  | 'critical'
  | 'combo'
  | 'victory'
  | 'defeat'
  | 'notification'
  | 'error'
  | 'success'

export type MusicTrack = 
  | 'menu'
  | 'workout'
  | 'victory'
  | 'boss'
  | 'ambient'

class SoundSystem {
  private audioContext: AudioContext | null = null
  private enabled: boolean = true
  private volume: number = 0.5
  private musicVolume: number = 0.3
  private currentMusic: AudioBufferSourceNode | null = null
  
  constructor() {
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
  }

  /**
   * Enable/disable all sounds
   */
  setEnabled(enabled: boolean) {
    this.enabled = enabled
    if (!enabled && this.currentMusic) {
      this.stopMusic()
    }
  }

  /**
   * Set master volume (0-1)
   */
  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume))
  }

  /**
   * Set music volume (0-1)
   */
  setMusicVolume(volume: number) {
    this.musicVolume = Math.max(0, Math.min(1, volume))
  }

  /**
   * Play a procedurally generated sound effect
   */
  play(effect: SoundEffect) {
    if (!this.enabled || !this.audioContext) return

    const ctx = this.audioContext
    const now = ctx.currentTime

    switch (effect) {
      case 'click':
        this.playClick(ctx, now)
        break
      case 'hover':
        this.playHover(ctx, now)
        break
      case 'levelup':
        this.playLevelUp(ctx, now)
        break
      case 'achievement':
        this.playAchievement(ctx, now)
        break
      case 'xp':
        this.playXP(ctx, now)
        break
      case 'loot':
        this.playLoot(ctx, now)
        break
      case 'quest_complete':
        this.playQuestComplete(ctx, now)
        break
      case 'critical':
        this.playCritical(ctx, now)
        break
      case 'combo':
        this.playCombo(ctx, now)
        break
      case 'victory':
        this.playVictory(ctx, now)
        break
      case 'notification':
        this.playNotification(ctx, now)
        break
      case 'success':
        this.playSuccess(ctx, now)
        break
      case 'error':
        this.playError(ctx, now)
        break
    }
  }

  /**
   * Play background music (looping)
   */
  playMusic(track: MusicTrack) {
    // In a full implementation, this would load and play actual audio files
    // For now, we'll just set up the infrastructure
    console.log(`Playing music: ${track}`)
  }

  /**
   * Stop current music
   */
  stopMusic() {
    if (this.currentMusic) {
      this.currentMusic.stop()
      this.currentMusic = null
    }
  }

  // Sound Effect Generators

  private playClick(ctx: AudioContext, time: number) {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    
    osc.connect(gain)
    gain.connect(ctx.destination)
    
    osc.frequency.setValueAtTime(800, time)
    osc.frequency.exponentialRampToValueAtTime(600, time + 0.05)
    
    gain.gain.setValueAtTime(this.volume * 0.3, time)
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.05)
    
    osc.start(time)
    osc.stop(time + 0.05)
  }

  private playHover(ctx: AudioContext, time: number) {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    
    osc.connect(gain)
    gain.connect(ctx.destination)
    
    osc.frequency.setValueAtTime(600, time)
    osc.frequency.exponentialRampToValueAtTime(800, time + 0.03)
    
    gain.gain.setValueAtTime(this.volume * 0.2, time)
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.03)
    
    osc.start(time)
    osc.stop(time + 0.03)
  }

  private playLevelUp(ctx: AudioContext, time: number) {
    // Epic level-up fanfare
    const notes = [523.25, 659.25, 783.99, 1046.50] // C5, E5, G5, C6
    
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      
      osc.connect(gain)
      gain.connect(ctx.destination)
      
      osc.frequency.setValueAtTime(freq, time + i * 0.1)
      osc.type = 'square'
      
      gain.gain.setValueAtTime(this.volume * 0.4, time + i * 0.1)
      gain.gain.exponentialRampToValueAtTime(0.01, time + i * 0.1 + 0.3)
      
      osc.start(time + i * 0.1)
      osc.stop(time + i * 0.1 + 0.3)
    })
  }

  private playAchievement(ctx: AudioContext, time: number) {
    // Triumphant achievement sound
    const osc1 = ctx.createOscillator()
    const osc2 = ctx.createOscillator()
    const gain = ctx.createGain()
    
    osc1.connect(gain)
    osc2.connect(gain)
    gain.connect(ctx.destination)
    
    osc1.frequency.setValueAtTime(440, time)
    osc1.frequency.exponentialRampToValueAtTime(880, time + 0.2)
    osc2.frequency.setValueAtTime(554.37, time)
    osc2.frequency.exponentialRampToValueAtTime(1108.73, time + 0.2)
    
    osc1.type = 'triangle'
    osc2.type = 'sine'
    
    gain.gain.setValueAtTime(this.volume * 0.5, time)
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.4)
    
    osc1.start(time)
    osc1.stop(time + 0.4)
    osc2.start(time)
    osc2.stop(time + 0.4)
  }

  private playXP(ctx: AudioContext, time: number) {
    // Quick positive chime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    
    osc.connect(gain)
    gain.connect(ctx.destination)
    
    osc.frequency.setValueAtTime(1200, time)
    osc.frequency.exponentialRampToValueAtTime(1400, time + 0.08)
    osc.type = 'sine'
    
    gain.gain.setValueAtTime(this.volume * 0.3, time)
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.08)
    
    osc.start(time)
    osc.stop(time + 0.08)
  }

  private playLoot(ctx: AudioContext, time: number) {
    // Sparkly loot sound
    for (let i = 0; i < 3; i++) {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      
      osc.connect(gain)
      gain.connect(ctx.destination)
      
      osc.frequency.setValueAtTime(1500 + i * 200, time + i * 0.05)
      osc.type = 'sine'
      
      gain.gain.setValueAtTime(this.volume * 0.3, time + i * 0.05)
      gain.gain.exponentialRampToValueAtTime(0.01, time + i * 0.05 + 0.1)
      
      osc.start(time + i * 0.05)
      osc.stop(time + i * 0.05 + 0.1)
    }
  }

  private playQuestComplete(ctx: AudioContext, time: number) {
    // Victory jingle
    const notes = [659.25, 783.99, 1046.50] // E5, G5, C6
    
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      
      osc.connect(gain)
      gain.connect(ctx.destination)
      
      osc.frequency.setValueAtTime(freq, time + i * 0.15)
      osc.type = 'triangle'
      
      gain.gain.setValueAtTime(this.volume * 0.4, time + i * 0.15)
      gain.gain.exponentialRampToValueAtTime(0.01, time + i * 0.15 + 0.3)
      
      osc.start(time + i * 0.15)
      osc.stop(time + i * 0.15 + 0.3)
    })
  }

  private playCritical(ctx: AudioContext, time: number) {
    // Impact sound
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    
    osc.connect(gain)
    gain.connect(ctx.destination)
    
    osc.frequency.setValueAtTime(150, time)
    osc.frequency.exponentialRampToValueAtTime(50, time + 0.2)
    osc.type = 'sawtooth'
    
    gain.gain.setValueAtTime(this.volume * 0.6, time)
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.2)
    
    osc.start(time)
    osc.stop(time + 0.2)
  }

  private playCombo(ctx: AudioContext, time: number) {
    // Rising combo sound
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    
    osc.connect(gain)
    gain.connect(ctx.destination)
    
    osc.frequency.setValueAtTime(400, time)
    osc.frequency.exponentialRampToValueAtTime(800, time + 0.15)
    osc.type = 'square'
    
    gain.gain.setValueAtTime(this.volume * 0.4, time)
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.15)
    
    osc.start(time)
    osc.stop(time + 0.15)
  }

  private playVictory(ctx: AudioContext, time: number) {
    // Epic victory fanfare
    const melody = [
      { freq: 523.25, time: 0 },    // C5
      { freq: 659.25, time: 0.1 },  // E5
      { freq: 783.99, time: 0.2 },  // G5
      { freq: 1046.50, time: 0.3 }, // C6
      { freq: 1046.50, time: 0.5 }, // C6 hold
    ]
    
    melody.forEach((note) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      
      osc.connect(gain)
      gain.connect(ctx.destination)
      
      osc.frequency.setValueAtTime(note.freq, time + note.time)
      osc.type = 'triangle'
      
      const duration = note.time === 0.5 ? 0.5 : 0.2
      gain.gain.setValueAtTime(this.volume * 0.5, time + note.time)
      gain.gain.exponentialRampToValueAtTime(0.01, time + note.time + duration)
      
      osc.start(time + note.time)
      osc.stop(time + note.time + duration)
    })
  }

  private playNotification(ctx: AudioContext, time: number) {
    // Gentle notification
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    
    osc.connect(gain)
    gain.connect(ctx.destination)
    
    osc.frequency.setValueAtTime(800, time)
    osc.frequency.setValueAtTime(1000, time + 0.05)
    osc.type = 'sine'
    
    gain.gain.setValueAtTime(this.volume * 0.3, time)
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1)
    
    osc.start(time)
    osc.stop(time + 0.1)
  }

  private playSuccess(ctx: AudioContext, time: number) {
    // Positive confirmation
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    
    osc.connect(gain)
    gain.connect(ctx.destination)
    
    osc.frequency.setValueAtTime(600, time)
    osc.frequency.exponentialRampToValueAtTime(800, time + 0.1)
    osc.type = 'sine'
    
    gain.gain.setValueAtTime(this.volume * 0.4, time)
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.15)
    
    osc.start(time)
    osc.stop(time + 0.15)
  }

  private playError(ctx: AudioContext, time: number) {
    // Negative buzz
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    
    osc.connect(gain)
    gain.connect(ctx.destination)
    
    osc.frequency.setValueAtTime(200, time)
    osc.frequency.exponentialRampToValueAtTime(150, time + 0.15)
    osc.type = 'sawtooth'
    
    gain.gain.setValueAtTime(this.volume * 0.4, time)
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.15)
    
    osc.start(time)
    osc.stop(time + 0.15)
  }
}

// Singleton instance
export const soundSystem = new SoundSystem()

// React hook for easy usage
export function useSound() {
  return {
    play: (effect: SoundEffect) => soundSystem.play(effect),
    playMusic: (track: MusicTrack) => soundSystem.playMusic(track),
    stopMusic: () => soundSystem.stopMusic(),
    setEnabled: (enabled: boolean) => soundSystem.setEnabled(enabled),
    setVolume: (volume: number) => soundSystem.setVolume(volume),
    setMusicVolume: (volume: number) => soundSystem.setMusicVolume(volume),
  }
}

