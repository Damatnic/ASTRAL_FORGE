/**
 * React Hook for Sound System Integration
 * 
 * Provides easy-to-use React hooks for sound management in components
 */

'use client';

import { useEffect, useCallback, useState } from 'react';
import {
  soundSystem,
  type SoundEffect,
  type MusicTrack,
  type SoundPreferences
} from '@/lib/sound-system';

/**
 * Hook for playing sound effects
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { play } = useSoundEffects();
 *   
 *   return (
 *     <button onClick={() => play('click')}>
 *       Click Me
 *     </button>
 *   );
 * }
 * ```
 */
export function useSoundEffects() {
  const play = useCallback((effect: SoundEffect) => {
    soundSystem.play(effect);
  }, []);
  
  return { play };
}

/**
 * Hook for managing background music
 * 
 * @example
 * ```tsx
 * function GamePage() {
 *   const { playMusic, stopMusic } = useMusic();
 *   
 *   useEffect(() => {
 *     playMusic('workout');
 *     return () => stopMusic();
 *   }, []);
 *   
 *   return <div>Game Content</div>;
 * }
 * ```
 */
export function useMusic() {
  const playMusic = useCallback((track: MusicTrack) => {
    soundSystem.playMusic(track);
  }, []);
  
  const stopMusic = useCallback(() => {
    soundSystem.stopMusic();
  }, []);
  
  return {
    playMusic,
    stopMusic
  };
}

/**
 * Hook for managing sound preferences
 * 
 * @example
 * ```tsx
 * function SoundSettings() {
 *   const {
 *     preferences,
 *     setVolume,
 *     setMusicVolume,
 *     toggleSound,
 *     toggleHaptics
 *   } = useSoundPreferences();
 *   
 *   return (
 *     <div>
 *       <input
 *         type="range"
 *         value={preferences.sound.volume}
 *         onChange={(e) => setVolume(parseFloat(e.target.value))}
 *       />
 *     </div>
 *   );
 * }
 * ```
 */
export function useSoundPreferences() {
  const [preferences, setPreferences] = useState<SoundPreferences>(
    soundSystem.getPreferences()
  );
  
  const setVolume = useCallback((volume: number) => {
    soundSystem.setVolume(volume);
    setPreferences(soundSystem.getPreferences());
  }, []);
  
  const setMusicVolume = useCallback((volume: number) => {
    soundSystem.setMusicVolume(volume);
    setPreferences(soundSystem.getPreferences());
  }, []);
  
  const toggleSound = useCallback((enabled?: boolean) => {
    soundSystem.setEnabled(enabled ?? !preferences.sound.enabled);
    setPreferences(soundSystem.getPreferences());
  }, [preferences.sound.enabled]);
  
  const toggleHaptics = useCallback((enabled?: boolean) => {
    soundSystem.setHapticsEnabled(enabled ?? !preferences.haptics.enabled);
    setPreferences(soundSystem.getPreferences());
  }, [preferences.haptics.enabled]);
  
  return {
    preferences,
    setVolume,
    setMusicVolume,
    toggleSound,
    toggleHaptics
  };
}

/**
 * Hook for button click sounds
 * Automatically plays click sound on button press
 * 
 * @example
 * ```tsx
 * function MyButton() {
 *   const { onClick, onMouseEnter } = useButtonSound();
 *   
 *   return <button onClick={onClick} onMouseEnter={onMouseEnter}>Click Me</button>;
 * }
 * ```
 */
export function useButtonSound(soundEffect: SoundEffect = 'click') {
  const { play } = useSoundEffects();
  
  const onClick = useCallback(() => {
    play(soundEffect);
  }, [play, soundEffect]);
  
  const onMouseEnter = useCallback(() => {
    play('hover');
  }, [play]);
  
  return {
    onClick,
    onMouseEnter
  };
}

/**
 * Hook for combat sounds
 * Provides helpers for workout/combat sound effects
 * 
 * @example
 * ```tsx
 * function WorkoutSession() {
 *   const { playHit, playCritical, playCombo } = useCombatSounds();
 *   
 *   function onSetComplete(reps: number, wasCritical: boolean) {
 *     if (wasCritical) {
 *       playCritical();
 *     } else {
 *       playHit(reps > 10 ? 'heavy' : 'light');
 *     }
 *   }
 * }
 * ```
 */
export function useCombatSounds() {
  const { play } = useSoundEffects();
  
  const playHit = useCallback((intensity: 'light' | 'medium' | 'heavy' = 'medium') => {
    const soundMap = {
      light: 'hit_light' as SoundEffect,
      medium: 'hit_medium' as SoundEffect,
      heavy: 'hit_heavy' as SoundEffect
    };
    play(soundMap[intensity]);
  }, [play]);
  
  const playCritical = useCallback(() => {
    play('critical');
  }, [play]);
  
  const playCombo = useCallback((comboCount: number) => {
    if (comboCount >= 5) {
      play('combo_5plus');
    } else if (comboCount === 4) {
      play('combo_4');
    } else if (comboCount === 3) {
      play('combo_3');
    } else if (comboCount === 2) {
      play('combo_2');
    }
  }, [play]);
  
  return {
    playHit,
    playCritical,
    playCombo
  };
}

/**
 * Hook for auto-playing music on page mount
 * 
 * @example
 * ```tsx
 * function ForgePage() {
 *   useAutoMusic('workout');
 *   
 *   return <div>Forge Content</div>;
 * }
 * ```
 */
export function useAutoMusic(track: MusicTrack) {
  const { playMusic, stopMusic } = useMusic();
  
  useEffect(() => {
    playMusic(track);
    
    // Cleanup: stop music when component unmounts
    return () => {
      stopMusic();
    };
  }, [track, playMusic, stopMusic]);
}
