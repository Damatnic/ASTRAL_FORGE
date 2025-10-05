'use client';

import { useState, useRef } from 'react';
import { Download, Copy, Check, Palette, Image as ImageIcon } from 'lucide-react';
import html2canvas from 'html2canvas';

// Types
export interface WorkoutCardData {
  id: string;
  name: string;
  date: Date;
  duration: number; // minutes
  xpEarned: number;
  totalVolume: number; // lbs
  exercises: WorkoutExerciseData[];
  notes?: string;
  template?: string;
  prCount: number;
  user: {
    username: string;
    level: number;
    title?: string;
    avatar?: string;
  };
}

export interface WorkoutExerciseData {
  name: string;
  sets: number;
  bestSet: {
    weight: number;
    reps: number;
    isPR?: boolean;
  };
  totalVolume: number;
}

type CardTheme = 'dark' | 'light' | 'purple' | 'blue' | 'gradient';

interface WorkoutShareCardProps {
  workout: WorkoutCardData;
  onDownload?: (imageUrl: string) => void;
  onCopy?: (imageUrl: string) => void;
}

export default function WorkoutShareCard({
  workout,
  onDownload,
  onCopy,
}: WorkoutShareCardProps) {
  const [theme, setTheme] = useState<CardTheme>('dark');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Theme configurations
  const themes = {
    dark: {
      bg: 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900',
      text: 'text-white',
      subtext: 'text-gray-400',
      accent: 'text-purple-400',
      border: 'border-purple-500/30',
      statBg: 'bg-gray-800/50',
    },
    light: {
      bg: 'bg-gradient-to-br from-gray-100 via-white to-gray-100',
      text: 'text-gray-900',
      subtext: 'text-gray-600',
      accent: 'text-purple-600',
      border: 'border-purple-300',
      statBg: 'bg-white/80',
    },
    purple: {
      bg: 'bg-gradient-to-br from-purple-900 via-purple-800 to-blue-900',
      text: 'text-white',
      subtext: 'text-purple-200',
      accent: 'text-yellow-400',
      border: 'border-yellow-500/30',
      statBg: 'bg-purple-800/50',
    },
    blue: {
      bg: 'bg-gradient-to-br from-blue-900 via-cyan-800 to-blue-900',
      text: 'text-white',
      subtext: 'text-cyan-200',
      accent: 'text-cyan-400',
      border: 'border-cyan-500/30',
      statBg: 'bg-blue-800/50',
    },
    gradient: {
      bg: 'bg-gradient-to-br from-orange-600 via-purple-600 to-blue-600',
      text: 'text-white',
      subtext: 'text-white/80',
      accent: 'text-yellow-300',
      border: 'border-white/30',
      statBg: 'bg-white/20',
    },
  };

  const currentTheme = themes[theme];

  // Format helpers
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatVolume = (volume: number): string => {
    if (volume >= 1000) return `${(volume / 1000).toFixed(1)}K`;
    return volume.toString();
  };

  // Generate image from card
  const generateImage = async (): Promise<string> => {
    if (!cardRef.current) throw new Error('Card ref not available');

    setIsGenerating(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2, // Higher quality
        logging: false,
      });

      const imageUrl = canvas.toDataURL('image/png');
      return imageUrl;
    } finally {
      setIsGenerating(false);
    }
  };

  // Download as image
  const handleDownload = async () => {
    try {
      const imageUrl = await generateImage();
      
      const link = document.createElement('a');
      link.download = `workout-${workout.name.replace(/\s+/g, '-')}-${Date.now()}.png`;
      link.href = imageUrl;
      link.click();

      onDownload?.(imageUrl);
    } catch (error) {
      console.error('Failed to download image:', error);
    }
  };

  // Copy to clipboard
  const handleCopy = async () => {
    try {
      const imageUrl = await generateImage();
      
      // Convert base64 to blob
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob }),
      ]);

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);

      onCopy?.(imageUrl);
    } catch (error) {
      console.error('Failed to copy image:', error);
    }
  };

  return (
    <div className="space-y-4">
      {/* Theme Selector */}
      <div className="flex items-center gap-2 flex-wrap">
        <Palette className="w-5 h-5 text-gray-400" />
        <span className="text-sm text-gray-400 mr-2">Card Theme:</span>
        {(['dark', 'light', 'purple', 'blue', 'gradient'] as CardTheme[]).map((t) => (
          <button
            key={t}
            onClick={() => setTheme(t)}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors capitalize ${
              theme === t
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Workout Card */}
      <div
        ref={cardRef}
        className={`${currentTheme.bg} ${currentTheme.text} rounded-xl border-2 ${currentTheme.border} p-6 shadow-2xl max-w-2xl mx-auto`}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            {/* User Avatar */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-2xl font-bold">
              {workout.user.avatar ? (
                <img
                  src={workout.user.avatar}
                  alt={workout.user.username}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                workout.user.username[0].toUpperCase()
              )}
            </div>

            {/* User Info */}
            <div>
              <h3 className="text-xl font-bold">{workout.user.username}</h3>
              <div className="flex items-center gap-2 text-sm">
                <span className={currentTheme.subtext}>Level {workout.user.level}</span>
                {workout.user.title && (
                  <>
                    <span className={currentTheme.subtext}>•</span>
                    <span className={currentTheme.accent}>{workout.user.title}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Date */}
          <div className={`text-sm ${currentTheme.subtext} text-right`}>
            {formatDate(workout.date)}
          </div>
        </div>

        {/* Workout Name */}
        <h2 className="text-3xl font-bold mb-2">{workout.name}</h2>
        {workout.template && (
          <div className="flex items-center gap-2 mb-4">
            <span className={`px-3 py-1 ${currentTheme.statBg} rounded-full text-sm`}>
              {workout.template}
            </span>
            {workout.prCount > 0 && (
              <span className="px-3 py-1 bg-yellow-600 rounded-full text-sm text-white font-semibold">
                {workout.prCount} PR{workout.prCount > 1 ? 's' : ''}
              </span>
            )}
          </div>
        )}

        {/* Statistics Grid */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className={`${currentTheme.statBg} rounded-lg p-4 text-center`}>
            <div className={`text-2xl font-bold ${currentTheme.accent}`}>
              {workout.duration}
            </div>
            <div className={`text-sm ${currentTheme.subtext}`}>Minutes</div>
          </div>

          <div className={`${currentTheme.statBg} rounded-lg p-4 text-center`}>
            <div className={`text-2xl font-bold ${currentTheme.accent}`}>
              {workout.xpEarned.toLocaleString()}
            </div>
            <div className={`text-sm ${currentTheme.subtext}`}>XP Earned</div>
          </div>

          <div className={`${currentTheme.statBg} rounded-lg p-4 text-center`}>
            <div className={`text-2xl font-bold ${currentTheme.accent}`}>
              {formatVolume(workout.totalVolume)}
            </div>
            <div className={`text-sm ${currentTheme.subtext}`}>lbs Volume</div>
          </div>
        </div>

        {/* Exercises List */}
        <div className="space-y-3 mb-6">
          <h4 className={`text-sm font-semibold ${currentTheme.subtext} uppercase tracking-wide`}>
            Exercises ({workout.exercises.length})
          </h4>
          {workout.exercises.map((exercise, index) => (
            <div
              key={index}
              className={`${currentTheme.statBg} rounded-lg p-3 flex items-center justify-between`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{exercise.name}</span>
                  {exercise.bestSet.isPR && (
                    <span className="px-2 py-0.5 bg-yellow-600 rounded text-xs font-bold text-white">
                      PR
                    </span>
                  )}
                </div>
                <div className={`text-sm ${currentTheme.subtext}`}>
                  {exercise.sets} sets • Best: {exercise.bestSet.weight} lbs × {exercise.bestSet.reps}
                </div>
              </div>
              <div className="text-right">
                <div className={currentTheme.accent}>{formatVolume(exercise.totalVolume)}</div>
                <div className={`text-xs ${currentTheme.subtext}`}>lbs</div>
              </div>
            </div>
          ))}
        </div>

        {/* Notes */}
        {workout.notes && (
          <div className={`${currentTheme.statBg} rounded-lg p-4 mb-6`}>
            <h4 className={`text-sm font-semibold ${currentTheme.subtext} uppercase tracking-wide mb-2`}>
              Notes
            </h4>
            <p className={`text-sm ${currentTheme.subtext}`}>{workout.notes}</p>
          </div>
        )}

        {/* Branding Footer */}
        <div className={`text-center pt-4 border-t ${currentTheme.border}`}>
          <div className={`text-lg font-bold ${currentTheme.accent}`}>ASTRAL POWER</div>
          <div className={`text-xs ${currentTheme.subtext}`}>Track • Compete • Dominate</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={handleDownload}
          disabled={isGenerating}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 rounded-lg transition-colors font-medium text-white flex items-center gap-2"
        >
          <Download className="w-5 h-5" />
          {isGenerating ? 'Generating...' : 'Download Image'}
        </button>

        <button
          onClick={handleCopy}
          disabled={isGenerating}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 rounded-lg transition-colors font-medium text-white flex items-center gap-2"
        >
          {copied ? (
            <>
              <Check className="w-5 h-5" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-5 h-5" />
              Copy to Clipboard
            </>
          )}
        </button>
      </div>

      {/* Info Text */}
      <p className="text-sm text-gray-500 text-center">
        <ImageIcon className="w-4 h-4 inline mr-1" />
        Generates high-quality image perfect for sharing on social media
      </p>
    </div>
  );
}
