/**
 * Sound Effects & Music System
 * Web Audio API-based sound system for gaming experience
 */

export type SoundEffect = 
  // UI Interactions
  | 'click'
  | 'hover'
  | 'tab_switch'
  | 'modal_open'
  | 'modal_close'
  | 'notification'
  | 'error'
  | 'success'
  | 'warning'
  
  // Progression & Achievements
  | 'tier_up'
  | 'achievement'
  | 'achievement_rare'
  | 'achievement_legendary'
  | 'progress'
  | 'prestige_up'
  | 'milestone_reached'
  
  // Combat & Workout
  | 'hit_light'
  | 'hit_medium'
  | 'hit_heavy'
  | 'critical'
  | 'combo'
  | 'combo_2'
  | 'combo_3'
  | 'combo_4'
  | 'combo_5plus'
  | 'damage_taken'
  | 'block'
  | 'dodge'
  
  // Rewards
  | 'gold_gained'
  | 'chest_open'
  
  // Quests & Events
  | 'quest_complete'
  | 'quest_update'
  | 'victory'
  | 'defeat'
  | 'buff_gained'
  | 'debuff_gained'
  
  // Social
  | 'friend_online'
  | 'message_received'
  | 'guild_notification'
  | 'challenge_received'
  
  // Timers
  | 'timer_tick'
  | 'countdown_final'

export type MusicTrack = 
  | 'menu'
  | 'workout'
  | 'victory'
  | 'boss'
  | 'ambient'

export interface SoundPreferences {
  sound: {
    enabled: boolean;
    volume: number;
  };
  music: {
    enabled: boolean;
    volume: number;
  };
  haptics: {
    enabled: boolean;
  };
}

class SoundSystem {
  private audioContext: AudioContext | null = null
  private enabled: boolean = true
  private volume: number = 0.5
  private musicVolume: number = 0.3
  private hapticsEnabled: boolean = true
  private currentMusic: AudioBufferSourceNode | null = null
  private musicAudio: HTMLAudioElement | null = null
  
  constructor() {
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      this.loadPreferences()
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
    if (this.musicAudio) {
      this.musicAudio.volume = this.musicVolume
    }
    this.savePreferences()
  }

  /**
   * Toggle haptics on/off
   */
  setHapticsEnabled(enabled: boolean) {
    this.hapticsEnabled = enabled
    this.savePreferences()
  }

  /**
   * Get current preferences
   */
  getPreferences(): SoundPreferences {
    return {
      sound: {
        enabled: this.enabled,
        volume: this.volume
      },
      music: {
        enabled: this.musicAudio !== null,
        volume: this.musicVolume
      },
      haptics: {
        enabled: this.hapticsEnabled
      }
    }
  }

  /**
   * Load preferences from localStorage
   */
  private loadPreferences() {
    if (typeof window === 'undefined') return
    
    try {
      const saved = localStorage.getItem('astral-forge-sound-preferences')
      if (saved) {
        const prefs: SoundPreferences = JSON.parse(saved)
        this.enabled = prefs.sound.enabled
        this.volume = prefs.sound.volume
        this.musicVolume = prefs.music.volume
        this.hapticsEnabled = prefs.haptics.enabled
      }
    } catch (error) {
      console.warn('Failed to load sound preferences:', error)
    }
  }

  /**
   * Save preferences to localStorage
   */
  private savePreferences() {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.setItem('astral-forge-sound-preferences', JSON.stringify(this.getPreferences()))
    } catch (error) {
      console.warn('Failed to save sound preferences:', error)
    }
  }

  /**
   * Trigger haptic feedback
   */
  private triggerHaptic(intensity: 'light' | 'medium' | 'heavy' = 'light') {
    if (!this.hapticsEnabled) return
    if (!navigator.vibrate) return
    
    const durations = {
      light: 10,
      medium: 25,
      heavy: 50
    }
    
    navigator.vibrate(durations[intensity])
  }

  /**
   * Play a procedurally generated sound effect
   */
  play(effect: SoundEffect) {
    if (!this.enabled || !this.audioContext) return

    const ctx = this.audioContext
    const now = ctx.currentTime

    switch (effect) {
      // UI Interactions
      case 'click':
        this.playClick(ctx, now)
        this.triggerHaptic('light')
        break
      case 'hover':
        this.playHover(ctx, now)
        break
      case 'tab_switch':
        this.playClick(ctx, now)
        break
      case 'modal_open':
        this.playModalOpen(ctx, now)
        break
      case 'modal_close':
        this.playModalClose(ctx, now)
        break
      case 'notification':
        this.playNotification(ctx, now)
        break
      case 'success':
        this.playSuccess(ctx, now)
        this.triggerHaptic('medium')
        break
      case 'error':
        this.playError(ctx, now)
        this.triggerHaptic('heavy')
        break
      case 'warning':
        this.playWarning(ctx, now)
        break
      
      // Progression & Achievements
      case 'tier_up':
        this.playTierUp(ctx, now)
        this.triggerHaptic('heavy')
        break
      case 'achievement':
        this.playAchievement(ctx, now)
        this.triggerHaptic('heavy')
        break
      case 'achievement_rare':
        this.playAchievementRare(ctx, now)
        this.triggerHaptic('heavy')
        break
      case 'achievement_legendary':
        this.playAchievementLegendary(ctx, now)
        this.triggerHaptic('heavy')
        break
      case 'progress':
        this.playProgress(ctx, now)
        break
      case 'prestige_up':
        this.playPrestigeUp(ctx, now)
        this.triggerHaptic('heavy')
        break
      case 'milestone_reached':
        this.playMilestoneReached(ctx, now)
        break
      
      // Combat & Workout
      case 'hit_light':
        this.playHitLight(ctx, now)
        this.triggerHaptic('light')
        break
      case 'hit_medium':
        this.playHitMedium(ctx, now)
        this.triggerHaptic('medium')
        break
      case 'hit_heavy':
        this.playHitHeavy(ctx, now)
        this.triggerHaptic('heavy')
        break
      case 'critical':
        this.playCritical(ctx, now)
        this.triggerHaptic('heavy')
        break
      case 'combo':
      case 'combo_2':
        this.playCombo(ctx, now, 2)
        break
      case 'combo_3':
        this.playCombo(ctx, now, 3)
        break
      case 'combo_4':
        this.playCombo(ctx, now, 4)
        break
      case 'combo_5plus':
        this.playCombo(ctx, now, 5)
        break
      case 'damage_taken':
        this.playDamageTaken(ctx, now)
        this.triggerHaptic('medium')
        break
      case 'block':
        this.playBlock(ctx, now)
        break
      case 'dodge':
        this.playDodge(ctx, now)
        break
      
      // Rewards
      case 'gold_gained':
        this.playGoldGained(ctx, now)
        break
      case 'chest_open':
        this.playChestOpen(ctx, now)
        break
      
      // Quests & Events
      case 'quest_complete':
        this.playQuestComplete(ctx, now)
        break
      case 'quest_update':
        this.playQuestUpdate(ctx, now)
        break
      case 'victory':
        this.playVictory(ctx, now)
        break
      case 'defeat':
        this.playDefeat(ctx, now)
        break
      case 'buff_gained':
        this.playBuffGained(ctx, now)
        break
      case 'debuff_gained':
        this.playDebuffGained(ctx, now)
        break
      
      // Social
      case 'friend_online':
        this.playFriendOnline(ctx, now)
        break
      case 'message_received':
        this.playMessageReceived(ctx, now)
        break
      case 'guild_notification':
        this.playGuildNotification(ctx, now)
        break
      case 'challenge_received':
        this.playChallengeReceived(ctx, now)
        break
      
      // Timers
      case 'timer_tick':
        this.playTimerTick(ctx, now)
        break
      case 'countdown_final':
        this.playCountdownFinal(ctx, now)
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

  private playTierUp(ctx: AudioContext, time: number) {
    // Epic tier-up fanfare
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

  private playProgress(ctx: AudioContext, time: number) {
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

  private playCombo(ctx: AudioContext, time: number, level: number = 2) {
    // Rising combo sound based on level
    const baseFreq = 400 + (level - 2) * 100
    const targetFreq = 800 + (level - 2) * 200
    
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    
    osc.connect(gain)
    gain.connect(ctx.destination)
    
    osc.frequency.setValueAtTime(baseFreq, time)
    osc.frequency.exponentialRampToValueAtTime(targetFreq, time + 0.15)
    osc.type = 'square'
    
    const volumeBoost = 1 + (level - 2) * 0.1
    gain.gain.setValueAtTime(this.volume * 0.4 * volumeBoost, time)
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

  // Additional Sound Effects

  private playWarning(ctx: AudioContext, time: number) {
    // Warning beep
    for (let i = 0; i < 2; i++) {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      
      osc.connect(gain)
      gain.connect(ctx.destination)
      
      osc.frequency.setValueAtTime(400, time + i * 0.1)
      osc.type = 'square'
      
      gain.gain.setValueAtTime(this.volume * 0.3, time + i * 0.1)
      gain.gain.exponentialRampToValueAtTime(0.01, time + i * 0.1 + 0.08)
      
      osc.start(time + i * 0.1)
      osc.stop(time + i * 0.1 + 0.08)
    }
  }

  private playModalOpen(ctx: AudioContext, time: number) {
    // Swoosh up
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    
    osc.connect(gain)
    gain.connect(ctx.destination)
    
    osc.frequency.setValueAtTime(300, time)
    osc.frequency.exponentialRampToValueAtTime(600, time + 0.1)
    osc.type = 'sine'
    
    gain.gain.setValueAtTime(this.volume * 0.2, time)
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1)
    
    osc.start(time)
    osc.stop(time + 0.1)
  }

  private playModalClose(ctx: AudioContext, time: number) {
    // Swoosh down
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    
    osc.connect(gain)
    gain.connect(ctx.destination)
    
    osc.frequency.setValueAtTime(600, time)
    osc.frequency.exponentialRampToValueAtTime(300, time + 0.1)
    osc.type = 'sine'
    
    gain.gain.setValueAtTime(this.volume * 0.2, time)
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1)
    
    osc.start(time)
    osc.stop(time + 0.1)
  }

  private playAchievementRare(ctx: AudioContext, time: number) {
    // More dramatic achievement sound
    const notes = [440, 554.37, 659.25, 880] // A4, C#5, E5, A5
    
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      
      osc.connect(gain)
      gain.connect(ctx.destination)
      
      osc.frequency.setValueAtTime(freq, time + i * 0.08)
      osc.type = 'triangle'
      
      gain.gain.setValueAtTime(this.volume * 0.5, time + i * 0.08)
      gain.gain.exponentialRampToValueAtTime(0.01, time + i * 0.08 + 0.3)
      
      osc.start(time + i * 0.08)
      osc.stop(time + i * 0.08 + 0.3)
    })
  }

  private playAchievementLegendary(ctx: AudioContext, time: number) {
    // Epic legendary achievement fanfare
    const melody = [
      { freq: 440, time: 0 },     // A4
      { freq: 554.37, time: 0.1 }, // C#5
      { freq: 659.25, time: 0.2 }, // E5
      { freq: 880, time: 0.3 },    // A5
      { freq: 1046.50, time: 0.4 }, // C6
      { freq: 1318.51, time: 0.5 } // E6
    ]
    
    melody.forEach((note) => {
      const osc1 = ctx.createOscillator()
      const osc2 = ctx.createOscillator()
      const gain = ctx.createGain()
      
      osc1.connect(gain)
      osc2.connect(gain)
      gain.connect(ctx.destination)
      
      osc1.frequency.setValueAtTime(note.freq, time + note.time)
      osc2.frequency.setValueAtTime(note.freq * 2, time + note.time)
      osc1.type = 'triangle'
      osc2.type = 'sine'
      
      gain.gain.setValueAtTime(this.volume * 0.6, time + note.time)
      gain.gain.exponentialRampToValueAtTime(0.01, time + note.time + 0.4)
      
      osc1.start(time + note.time)
      osc1.stop(time + note.time + 0.4)
      osc2.start(time + note.time)
      osc2.stop(time + note.time + 0.4)
    })
  }

  private playPrestigeUp(ctx: AudioContext, time: number) {
    // Grand prestige fanfare
    const chords = [
      [523.25, 659.25, 783.99], // C major
      [587.33, 739.99, 880.00], // D major
      [659.25, 830.61, 987.77]  // E major
    ]
    
    chords.forEach((chord, i) => {
      chord.forEach(freq => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        
        osc.connect(gain)
        gain.connect(ctx.destination)
        
        osc.frequency.setValueAtTime(freq, time + i * 0.2)
        osc.type = 'square'
        
        gain.gain.setValueAtTime(this.volume * 0.3, time + i * 0.2)
        gain.gain.exponentialRampToValueAtTime(0.01, time + i * 0.2 + 0.5)
        
        osc.start(time + i * 0.2)
        osc.stop(time + i * 0.2 + 0.5)
      })
    })
  }

  private playMilestoneReached(ctx: AudioContext, time: number) {
    // Magical unlock sound
    for (let i = 0; i < 5; i++) {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      
      osc.connect(gain)
      gain.connect(ctx.destination)
      
      osc.frequency.setValueAtTime(1000 + i * 300, time + i * 0.03)
      osc.type = 'sine'
      
      gain.gain.setValueAtTime(this.volume * 0.25, time + i * 0.03)
      gain.gain.exponentialRampToValueAtTime(0.01, time + i * 0.03 + 0.15)
      
      osc.start(time + i * 0.03)
      osc.stop(time + i * 0.03 + 0.15)
    }
  }

  private playHitLight(ctx: AudioContext, time: number) {
    // Quick punch
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    
    osc.connect(gain)
    gain.connect(ctx.destination)
    
    osc.frequency.setValueAtTime(200, time)
    osc.frequency.exponentialRampToValueAtTime(100, time + 0.05)
    osc.type = 'sawtooth'
    
    gain.gain.setValueAtTime(this.volume * 0.3, time)
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.05)
    
    osc.start(time)
    osc.stop(time + 0.05)
  }

  private playHitMedium(ctx: AudioContext, time: number) {
    // Solid impact
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    
    osc.connect(gain)
    gain.connect(ctx.destination)
    
    osc.frequency.setValueAtTime(180, time)
    osc.frequency.exponentialRampToValueAtTime(80, time + 0.1)
    osc.type = 'sawtooth'
    
    gain.gain.setValueAtTime(this.volume * 0.5, time)
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1)
    
    osc.start(time)
    osc.stop(time + 0.1)
  }

  private playHitHeavy(ctx: AudioContext, time: number) {
    // Heavy slam
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    
    osc.connect(gain)
    gain.connect(ctx.destination)
    
    osc.frequency.setValueAtTime(160, time)
    osc.frequency.exponentialRampToValueAtTime(60, time + 0.15)
    osc.type = 'sawtooth'
    
    gain.gain.setValueAtTime(this.volume * 0.7, time)
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.15)
    
    osc.start(time)
    osc.stop(time + 0.15)
  }

  private playDamageTaken(ctx: AudioContext, time: number) {
    // Hurt sound
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    
    osc.connect(gain)
    gain.connect(ctx.destination)
    
    osc.frequency.setValueAtTime(300, time)
    osc.frequency.exponentialRampToValueAtTime(150, time + 0.1)
    osc.type = 'sawtooth'
    
    gain.gain.setValueAtTime(this.volume * 0.4, time)
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1)
    
    osc.start(time)
    osc.stop(time + 0.1)
  }

  private playBlock(ctx: AudioContext, time: number) {
    // Shield block
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    
    osc.connect(gain)
    gain.connect(ctx.destination)
    
    osc.frequency.setValueAtTime(400, time)
    osc.type = 'square'
    
    gain.gain.setValueAtTime(this.volume * 0.3, time)
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.08)
    
    osc.start(time)
    osc.stop(time + 0.08)
  }

  private playDodge(ctx: AudioContext, time: number) {
    // Whoosh
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    
    osc.connect(gain)
    gain.connect(ctx.destination)
    
    osc.frequency.setValueAtTime(800, time)
    osc.frequency.exponentialRampToValueAtTime(400, time + 0.12)
    osc.type = 'sine'
    
    gain.gain.setValueAtTime(this.volume * 0.25, time)
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.12)
    
    osc.start(time)
    osc.stop(time + 0.12)
  }

  private playGoldGained(ctx: AudioContext, time: number) {
    // Coin clink
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    
    osc.connect(gain)
    gain.connect(ctx.destination)
    
    osc.frequency.setValueAtTime(1800, time)
    osc.frequency.exponentialRampToValueAtTime(1600, time + 0.05)
    osc.type = 'sine'
    
    gain.gain.setValueAtTime(this.volume * 0.3, time)
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.05)
    
    osc.start(time)
    osc.stop(time + 0.05)
  }

  private playChestOpen(ctx: AudioContext, time: number) {
    // Chest creak and reveal
    const osc1 = ctx.createOscillator()
    const osc2 = ctx.createOscillator()
    const gain = ctx.createGain()
    
    osc1.connect(gain)
    osc2.connect(gain)
    gain.connect(ctx.destination)
    
    osc1.frequency.setValueAtTime(100, time)
    osc1.frequency.exponentialRampToValueAtTime(200, time + 0.2)
    osc2.frequency.setValueAtTime(1500, time + 0.2)
    osc2.frequency.exponentialRampToValueAtTime(2000, time + 0.4)
    
    osc1.type = 'sawtooth'
    osc2.type = 'sine'
    
    gain.gain.setValueAtTime(this.volume * 0.4, time)
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.4)
    
    osc1.start(time)
    osc1.stop(time + 0.2)
    osc2.start(time + 0.2)
    osc2.stop(time + 0.4)
  }

  private playQuestUpdate(ctx: AudioContext, time: number) {
    // Quest log update
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    
    osc.connect(gain)
    gain.connect(ctx.destination)
    
    osc.frequency.setValueAtTime(900, time)
    osc.frequency.setValueAtTime(1100, time + 0.05)
    osc.type = 'sine'
    
    gain.gain.setValueAtTime(this.volume * 0.25, time)
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1)
    
    osc.start(time)
    osc.stop(time + 0.1)
  }

  private playDefeat(ctx: AudioContext, time: number) {
    // Sad defeat sound
    const notes = [523.25, 466.16, 415.30, 369.99] // Descending
    
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      
      osc.connect(gain)
      gain.connect(ctx.destination)
      
      osc.frequency.setValueAtTime(freq, time + i * 0.2)
      osc.type = 'sine'
      
      gain.gain.setValueAtTime(this.volume * 0.4, time + i * 0.2)
      gain.gain.exponentialRampToValueAtTime(0.01, time + i * 0.2 + 0.4)
      
      osc.start(time + i * 0.2)
      osc.stop(time + i * 0.2 + 0.4)
    })
  }

  private playBuffGained(ctx: AudioContext, time: number) {
    // Positive buff chime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    
    osc.connect(gain)
    gain.connect(ctx.destination)
    
    osc.frequency.setValueAtTime(800, time)
    osc.frequency.exponentialRampToValueAtTime(1200, time + 0.1)
    osc.type = 'sine'
    
    gain.gain.setValueAtTime(this.volume * 0.3, time)
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.15)
    
    osc.start(time)
    osc.stop(time + 0.15)
  }

  private playDebuffGained(ctx: AudioContext, time: number) {
    // Negative debuff
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    
    osc.connect(gain)
    gain.connect(ctx.destination)
    
    osc.frequency.setValueAtTime(300, time)
    osc.frequency.exponentialRampToValueAtTime(200, time + 0.15)
    osc.type = 'square'
    
    gain.gain.setValueAtTime(this.volume * 0.3, time)
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.15)
    
    osc.start(time)
    osc.stop(time + 0.15)
  }

  private playFriendOnline(ctx: AudioContext, time: number) {
    // Friend notification
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    
    osc.connect(gain)
    gain.connect(ctx.destination)
    
    osc.frequency.setValueAtTime(700, time)
    osc.frequency.setValueAtTime(900, time + 0.05)
    osc.type = 'sine'
    
    gain.gain.setValueAtTime(this.volume * 0.3, time)
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1)
    
    osc.start(time)
    osc.stop(time + 0.1)
  }

  private playMessageReceived(ctx: AudioContext, time: number) {
    // Message ping
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    
    osc.connect(gain)
    gain.connect(ctx.destination)
    
    osc.frequency.setValueAtTime(1000, time)
    osc.type = 'sine'
    
    gain.gain.setValueAtTime(this.volume * 0.25, time)
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.08)
    
    osc.start(time)
    osc.stop(time + 0.08)
  }

  private playGuildNotification(ctx: AudioContext, time: number) {
    // Guild fanfare
    const notes = [523.25, 659.25] // C5, E5
    
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      
      osc.connect(gain)
      gain.connect(ctx.destination)
      
      osc.frequency.setValueAtTime(freq, time + i * 0.08)
      osc.type = 'triangle'
      
      gain.gain.setValueAtTime(this.volume * 0.3, time + i * 0.08)
      gain.gain.exponentialRampToValueAtTime(0.01, time + i * 0.08 + 0.15)
      
      osc.start(time + i * 0.08)
      osc.stop(time + i * 0.08 + 0.15)
    })
  }

  private playChallengeReceived(ctx: AudioContext, time: number) {
    // Challenge horn
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    
    osc.connect(gain)
    gain.connect(ctx.destination)
    
    osc.frequency.setValueAtTime(400, time)
    osc.frequency.setValueAtTime(500, time + 0.1)
    osc.type = 'square'
    
    gain.gain.setValueAtTime(this.volume * 0.4, time)
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.2)
    
    osc.start(time)
    osc.stop(time + 0.2)
  }

  private playTimerTick(ctx: AudioContext, time: number) {
    // Subtle tick
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    
    osc.connect(gain)
    gain.connect(ctx.destination)
    
    osc.frequency.setValueAtTime(1000, time)
    osc.type = 'sine'
    
    gain.gain.setValueAtTime(this.volume * 0.15, time)
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.02)
    
    osc.start(time)
    osc.stop(time + 0.02)
  }

  private playCountdownFinal(ctx: AudioContext, time: number) {
    // Final countdown beep
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    
    osc.connect(gain)
    gain.connect(ctx.destination)
    
    osc.frequency.setValueAtTime(1200, time)
    osc.type = 'square'
    
    gain.gain.setValueAtTime(this.volume * 0.5, time)
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
    setHapticsEnabled: (enabled: boolean) => soundSystem.setHapticsEnabled(enabled),
    getPreferences: () => soundSystem.getPreferences(),
  }
}

