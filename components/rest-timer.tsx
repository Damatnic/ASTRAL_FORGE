'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

type TimerState = 'idle' | 'running' | 'paused' | 'completed';
type ExerciseType = 'strength' | 'hypertrophy' | 'endurance' | 'custom';

interface RestTimerProps {
  onComplete?: () => void;
  onSkip?: () => void;
  autoStart?: boolean;
  exerciseType?: ExerciseType;
  customDuration?: number; // seconds
  showNotifications?: boolean;
  embedded?: boolean; // If true, uses compact embedded mode
}

interface PresetDuration {
  label: string;
  seconds: number;
  icon: string;
  type: ExerciseType;
  description: string;
}

// ============================================================================
// PRESET DURATIONS
// ============================================================================

const PRESET_DURATIONS: PresetDuration[] = [
  { label: '30s', seconds: 30, icon: '⚡', type: 'endurance', description: 'Conditioning/Cardio' },
  { label: '1min', seconds: 60, icon: '🔥', type: 'endurance', description: 'High-Intensity' },
  { label: '90s', seconds: 90, icon: '💪', type: 'hypertrophy', description: 'Isolation/Hypertrophy' },
  { label: '2min', seconds: 120, icon: '🏋️', type: 'hypertrophy', description: 'Compound Hypertrophy' },
  { label: '3min', seconds: 180, icon: '⚡', type: 'strength', description: 'Heavy Compounds' },
  { label: '5min', seconds: 300, icon: '💎', type: 'strength', description: 'Max Effort Lifts' },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const getRecommendedRestTime = (exerciseType: ExerciseType): number => {
  switch (exerciseType) {
    case 'strength': return 180; // 3 minutes for heavy strength work
    case 'hypertrophy': return 90; // 90 seconds for hypertrophy
    case 'endurance': return 60; // 60 seconds for endurance
    case 'custom': return 120; // 2 minutes default
  }
};

const playSound = (frequency: number, duration: number) => {
  if (typeof window === 'undefined' || !window.AudioContext) return;
  
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  } catch (error) {
    console.error('Error playing sound:', error);
  }
};

const vibrate = (pattern: number | number[]) => {
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate(pattern);
  }
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function RestTimer({
  onComplete,
  onSkip,
  autoStart = false,
  exerciseType = 'hypertrophy',
  customDuration,
  showNotifications = true,
  embedded = false,
}: RestTimerProps) {
  const [duration, setDuration] = useState<number>(
    customDuration || getRecommendedRestTime(exerciseType)
  );
  const [timeRemaining, setTimeRemaining] = useState<number>(duration);
  const [timerState, setTimerState] = useState<TimerState>('idle');
  const [showSettings, setShowSettings] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [notification, setNotification] = useState('');
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Auto-start timer if enabled
  useEffect(() => {
    if (autoStart && timerState === 'idle') {
      startTimer();
    }
  }, [autoStart]);

  // Timer logic
  useEffect(() => {
    if (timerState === 'running') {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          const newTime = prev - 1;
          
          // Notifications at specific times
          if (showNotifications) {
            if (newTime === 10 && soundEnabled) {
              playSound(440, 0.1); // A4 note, 100ms
              if (vibrationEnabled) vibrate(100);
            } else if (newTime === 5 && soundEnabled) {
              playSound(523, 0.1); // C5 note, 100ms
              if (vibrationEnabled) vibrate(100);
            } else if (newTime === 0) {
              // Completion sound
              if (soundEnabled) {
                playSound(659, 0.2); // E5 note, 200ms
                setTimeout(() => playSound(784, 0.3), 150); // G5 note, 300ms
              }
              if (vibrationEnabled) vibrate([100, 50, 100, 50, 200]);
              setNotification('Rest complete! 💪');
              setTimeout(() => setNotification(''), 3000);
            }
          }
          
          if (newTime <= 0) {
            setTimerState('completed');
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (onComplete) onComplete();
            return 0;
          }
          
          return newTime;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timerState, showNotifications, soundEnabled, vibrationEnabled, onComplete]);

  const startTimer = useCallback(() => {
    if (timerState === 'idle') {
      setTimeRemaining(duration);
    }
    setTimerState('running');
    startTimeRef.current = Date.now();
  }, [duration, timerState]);

  const pauseTimer = useCallback(() => {
    setTimerState('paused');
  }, []);

  const resetTimer = useCallback(() => {
    setTimerState('idle');
    setTimeRemaining(duration);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, [duration]);

  const skipTimer = useCallback(() => {
    setTimerState('completed');
    setTimeRemaining(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (onSkip) onSkip();
  }, [onSkip]);

  const addTime = useCallback((seconds: number) => {
    setDuration((prev) => prev + seconds);
    setTimeRemaining((prev) => prev + seconds);
  }, []);

  const selectPreset = useCallback((preset: PresetDuration) => {
    setDuration(preset.seconds);
    setTimeRemaining(preset.seconds);
    setTimerState('idle');
    setShowSettings(false);
  }, []);

  // Calculate progress percentage
  const progressPercentage = ((duration - timeRemaining) / duration) * 100;
  const circumference = 2 * Math.PI * 54; // radius of 54
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

  // Get color based on time remaining
  const getTimerColor = () => {
    const percentage = (timeRemaining / duration) * 100;
    if (percentage > 50) return 'text-amber-400 stroke-amber-400';
    if (percentage > 25) return 'text-amber-400 stroke-amber-400';
    return 'text-red-400 stroke-red-400';
  };

  // Embedded compact mode
  if (embedded) {
    return (
      <div className="bg-neutral-900 border-2 border-neutral-800 p-3">
        <div className="flex items-center gap-3">
          {/* Mini circular timer */}
          <div className="relative w-16 h-16">
            <svg className="transform -rotate-90 w-16 h-16">
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                className="text-neutral-800"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                className={getTimerColor()}
                strokeDasharray={2 * Math.PI * 28}
                strokeDashoffset={(2 * Math.PI * 28) * (1 - progressPercentage / 100)}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-sm font-bold ${getTimerColor()}`}>
                {formatTime(timeRemaining)}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex-1">
            <div className="text-xs text-neutral-400 mb-1 uppercase tracking-wider font-bold">Recovery Timer</div>
            <div className="flex gap-2">
              {timerState === 'idle' && (
                <button
                  onClick={startTimer}
                  className="px-3 py-1 bg-amber-950/50 hover:bg-amber-900/50 border-2 border-amber-700 text-sm font-bold uppercase tracking-wider transition-colors"
                >
                  ▶ Start
                </button>
              )}
              {timerState === 'running' && (
                <button
                  onClick={pauseTimer}
                  className="px-3 py-1 bg-amber-600 hover:bg-amber-700 border-2 border-amber-700 text-sm font-bold uppercase tracking-wider transition-colors"
                >
                  ⏸ Pause
                </button>
              )}
              {timerState === 'paused' && (
                <button
                  onClick={startTimer}
                  className="px-3 py-1 bg-amber-950/50 hover:bg-amber-900/50 border-2 border-amber-700 text-sm font-bold uppercase tracking-wider transition-colors"
                >
                  ▶ Resume
                </button>
              )}
              <button
                onClick={skipTimer}
                className="px-3 py-1 bg-neutral-900 hover:bg-neutral-800 border-2 border-neutral-700 text-sm uppercase tracking-wider transition-colors"
              >
                Skip
              </button>
              <button
                onClick={() => addTime(30)}
                className="px-3 py-1 bg-neutral-900 hover:bg-neutral-800 border-2 border-neutral-700 text-sm uppercase tracking-wider transition-colors"
              >
                +30s
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Full standalone mode
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 text-white p-6">
      <div className="max-w-2xl mx-auto">
        {/* Notification Toast */}
        {notification && (
          <div className="fixed top-4 right-4 bg-amber-950/50 border-2 border-amber-700 text-white px-6 py-3 shadow-lg z-50 animate-slide-in-right flex items-center gap-2">
            <span>✓</span>
            <span>{notification}</span>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black mb-2 uppercase tracking-wider">⏱️ Recovery Timer</h1>
          <p className="text-neutral-400">Track your recovery between sets</p>
        </div>

        {/* Main Timer Display */}
        <div className="bg-neutral-900 border-2 border-neutral-800 p-8 mb-6">
          {/* Circular Progress Timer */}
          <div className="flex justify-center mb-6">
            <div className="relative w-64 h-64">
              <svg className="transform -rotate-90 w-64 h-64">
                {/* Background circle */}
                <circle
                  cx="128"
                  cy="128"
                  r="110"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  className="text-neutral-800"
                />
                {/* Progress circle */}
                <circle
                  cx="128"
                  cy="128"
                  r="110"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  className={getTimerColor()}
                  strokeDasharray={2 * Math.PI * 110}
                  strokeDashoffset={(2 * Math.PI * 110) * (1 - progressPercentage / 100)}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 1s linear' }}
                />
              </svg>
              
              {/* Timer text in center */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className={`text-6xl font-bold mb-2 ${getTimerColor()}`}>
                  {formatTime(timeRemaining)}
                </div>
                <div className="text-neutral-400 text-sm uppercase tracking-wider font-bold">
                  {timerState === 'idle' && 'Ready to start'}
                  {timerState === 'running' && 'Recovering...'}
                  {timerState === 'paused' && 'Paused'}
                  {timerState === 'completed' && 'Complete! 💪'}
                </div>
                <div className="text-neutral-500 text-xs mt-1">
                  {Math.round(progressPercentage)}% complete
                </div>
              </div>
            </div>
          </div>

          {/* Timer Controls */}
          <div className="flex flex-wrap gap-3 justify-center">
            {timerState === 'idle' && (
              <button
                onClick={startTimer}
                className="px-8 py-3 bg-amber-950/50 hover:bg-amber-900/50 border-2 border-amber-700 font-black text-lg uppercase tracking-wider transition-colors touch-manipulation min-h-[48px] flex items-center gap-2"
              >
                ▶ Start Timer
              </button>
            )}
            
            {timerState === 'running' && (
              <>
                <button
                  onClick={pauseTimer}
                  className="px-8 py-3 bg-amber-600 hover:bg-amber-700 border-2 border-amber-700 font-black text-lg uppercase tracking-wider transition-colors touch-manipulation min-h-[48px] flex items-center gap-2"
                >
                  ⏸ Pause
                </button>
                <button
                  onClick={resetTimer}
                  className="px-6 py-3 bg-neutral-900 hover:bg-neutral-800 border-2 border-neutral-700 font-bold uppercase tracking-wider transition-colors touch-manipulation min-h-[48px]"
                >
                  🔄 Reset
                </button>
              </>
            )}
            
            {timerState === 'paused' && (
              <>
                <button
                  onClick={startTimer}
                  className="px-8 py-3 bg-amber-950/50 hover:bg-amber-900/50 border-2 border-amber-700 font-black text-lg uppercase tracking-wider transition-colors touch-manipulation min-h-[48px] flex items-center gap-2"
                >
                  ▶ Resume
                </button>
                <button
                  onClick={resetTimer}
                  className="px-6 py-3 bg-neutral-900 hover:bg-neutral-800 border-2 border-neutral-700 font-bold uppercase tracking-wider transition-colors touch-manipulation min-h-[48px]"
                >
                  🔄 Reset
                </button>
              </>
            )}
            
            {timerState === 'completed' && (
              <button
                onClick={resetTimer}
                className="px-8 py-3 bg-amber-950/50 hover:bg-amber-900/50 border-2 border-amber-700 font-black text-lg uppercase tracking-wider transition-colors touch-manipulation min-h-[48px] flex items-center gap-2"
              >
                🔄 Start New Recovery
              </button>
            )}

            {timerState !== 'completed' && (
              <>
                <button
                  onClick={skipTimer}
                  className="px-6 py-3 bg-neutral-900 hover:bg-neutral-800 border-2 border-neutral-700 font-bold uppercase tracking-wider transition-colors"
                >
                  ⏭ Skip
                </button>
                <button
                  onClick={() => addTime(30)}
                  className="px-6 py-3 bg-neutral-900 hover:bg-neutral-800 border-2 border-neutral-700 font-bold uppercase tracking-wider transition-colors"
                >
                  +30s
                </button>
              </>
            )}
          </div>
        </div>

        {/* Preset Durations */}
        <div className="bg-neutral-900 border-2 border-neutral-800 p-6 mb-6">
          <h3 className="text-xl font-black mb-4 uppercase tracking-wider">⚡ Quick Presets</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {PRESET_DURATIONS.map((preset) => (
              <button
                key={preset.label}
                onClick={() => selectPreset(preset)}
                disabled={timerState === 'running'}
                className={`p-4 border-2 transition-colors ${
                  duration === preset.seconds
                    ? 'bg-amber-950/50 border-amber-700'
                    : 'bg-neutral-950 border-neutral-800 hover:border-amber-700'
                } ${timerState === 'running' ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="text-2xl mb-1">{preset.icon}</div>
                <div className="font-black uppercase tracking-wider">{preset.label}</div>
                <div className="text-xs text-neutral-400 uppercase tracking-wider font-bold">{preset.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Settings */}
        <div className="bg-neutral-900 border-2 border-neutral-800 p-6">
          <div
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center justify-between cursor-pointer"
          >
            <h3 className="text-xl font-black uppercase tracking-wider">⚙️ Settings</h3>
            <span className="text-neutral-400">{showSettings ? '▼' : '▶'}</span>
          </div>

          {showSettings && (
            <div className="mt-4 space-y-4">
              {/* Sound Toggle */}
              <div className="flex items-center justify-between p-3 bg-neutral-900 border-2 border-neutral-800">
                <div>
                  <div className="font-black uppercase tracking-wider">🔊 SOUND ALERTS</div>
                  <div className="text-sm text-neutral-400 font-bold uppercase tracking-wider">PLAY BEEPS AT 10S, 5S, AND COMPLETION</div>
                </div>
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`w-12 h-6 transition-colors ${
                    soundEnabled ? 'bg-amber-600' : 'bg-neutral-600'
                  } relative`}
                >
                  <div
                    className={`w-5 h-5 bg-white absolute top-0.5 transition-transform ${
                      soundEnabled ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* Vibration Toggle */}
              <div className="flex items-center justify-between p-3 bg-neutral-900 border-2 border-neutral-800">
                <div>
                  <div className="font-black uppercase tracking-wider">📳 VIBRATION</div>
                  <div className="text-sm text-neutral-400 font-bold uppercase tracking-wider">VIBRATE ON NOTIFICATIONS (MOBILE)</div>
                </div>
                <button
                  onClick={() => setVibrationEnabled(!vibrationEnabled)}
                  className={`w-12 h-6 transition-colors ${
                    vibrationEnabled ? 'bg-amber-600' : 'bg-neutral-600'
                  } relative`}
                >
                  <div
                    className={`w-5 h-5 bg-white absolute top-0.5 transition-transform ${
                      vibrationEnabled ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* Custom Duration */}
              <div className="p-3 bg-neutral-900 border-2 border-neutral-800">
                <div className="font-black uppercase tracking-wider mb-2">🎯 CUSTOM DURATION</div>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="10"
                    max="600"
                    value={duration}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 60;
                      setDuration(val);
                      setTimeRemaining(val);
                    }}
                    disabled={timerState === 'running'}
                    className="flex-1 px-3 py-2 bg-neutral-900 border-2 border-neutral-800 focus:outline-none focus:border-amber-700"
                  />
                  <span className="text-neutral-400 uppercase tracking-wider font-bold">seconds</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-amber-950/20 border-2 border-amber-700/30 p-6">
          <h3 className="text-xl font-black mb-4 uppercase tracking-wider">💡 Recovery Guidelines</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-black text-amber-400 mb-2 uppercase tracking-wider">🏋️ Strength Training</h4>
              <ul className="space-y-1 text-sm text-neutral-300 uppercase tracking-wider font-bold">
                <li>• <strong>Heavy Compounds:</strong> 3-5 minutes</li>
                <li>• <strong>Main Lifts (80%+ 1RM):</strong> 3-4 minutes</li>
                <li>• <strong>Accessory Work:</strong> 2-3 minutes</li>
              </ul>
            </div>
            <div>
              <h4 className="font-black text-amber-400 mb-2 uppercase tracking-wider">💪 Hypertrophy</h4>
              <ul className="space-y-1 text-sm text-neutral-300 uppercase tracking-wider font-bold">
                <li>• <strong>Compound Exercises:</strong> 90-120 seconds</li>
                <li>• <strong>Isolation Exercises:</strong> 60-90 seconds</li>
                <li>• <strong>Drop Sets/Supersets:</strong> 60 seconds</li>
              </ul>
            </div>
            <div>
              <h4 className="font-black text-amber-400 mb-2 uppercase tracking-wider">🔥 Conditioning</h4>
              <ul className="space-y-1 text-sm text-neutral-300 uppercase tracking-wider font-bold">
                <li>• <strong>HIIT Intervals:</strong> 30-60 seconds</li>
                <li>• <strong>Circuit Training:</strong> 30-45 seconds</li>
                <li>• <strong>Cardio Bursts:</strong> 15-30 seconds</li>
              </ul>
            </div>
            <div>
              <h4 className="font-black text-amber-400 mb-2 uppercase tracking-wider">⚡ Pro Tips</h4>
              <ul className="space-y-1 text-sm text-neutral-300 uppercase tracking-wider font-bold">
                <li>• <strong>Listen to your body</strong></li>
                <li>• <strong>Longer rest = better strength</strong></li>
                <li>• <strong>Shorter rest = more conditioning</strong></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Animation CSS */}
      <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
