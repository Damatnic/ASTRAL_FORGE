'use client';

import { useState } from 'react';
import { Share2, Instagram, Twitter, Facebook, Link as LinkIcon, Check, Copy } from 'lucide-react';
import type { WorkoutCardData } from './workout-share-card';

interface SocialMediaExportProps {
  workout: WorkoutCardData;
  imageUrl?: string;
  onShare?: (platform: string) => void;
}

export default function SocialMediaExport({
  workout,
  imageUrl,
  onShare,
}: SocialMediaExportProps) {
  const [copiedLink, setCopiedLink] = useState(false);

  // Generate workout summary for captions
  const generateCaption = (platform: 'instagram' | 'twitter' | 'facebook'): string => {
    const baseText = `💪 Just crushed "${workout.name}"!\n\n`;
    const stats = `📊 Stats:\n• ${workout.duration} min\n• ${workout.xpEarned.toLocaleString()} XP earned\n• ${(workout.totalVolume / 1000).toFixed(1)}K lbs total volume\n• ${workout.exercises.length} exercises`;
    const prText = workout.prCount > 0 ? `\n🏆 ${workout.prCount} NEW PR${workout.prCount > 1 ? 'S' : ''}!` : '';
    
    const hashtags = {
      instagram: '\n\n#fitness #workout #gains #training #gym #fitfam #fitnessmotivation #workoutmotivation #astralpower #fitnessgaming',
      twitter: '\n\n#fitness #workout #gains #training #astralpower',
      facebook: '\n\n#fitness #workout #gains #astralpower',
    };

    if (platform === 'twitter' && (baseText + stats + prText + hashtags.twitter).length > 280) {
      // Shorten for Twitter's character limit
      return `💪 Crushed "${workout.name}"!\n${workout.duration}min • ${workout.xpEarned} XP • ${workout.prCount} PRs\n\n#fitness #workout #astralpower`;
    }

    return baseText + stats + prText + hashtags[platform];
  };

  // Generate shareable link (mock - would be actual URL in production)
  const shareableLink = `https://astralpower.app/workouts/${workout.id}`;

  // Handle platform-specific sharing
  const handleShare = (platform: 'instagram' | 'twitter' | 'facebook' | 'link') => {
    if (platform === 'link') {
      navigator.clipboard.writeText(shareableLink);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
      onShare?.('link');
      return;
    }

    const caption = generateCaption(platform);
    let shareUrl = '';

    switch (platform) {
      case 'instagram':
        // Instagram doesn't support web sharing with pre-filled captions
        // User would need to save image and paste caption manually
        alert(`Image ready to share on Instagram!\n\nCopy this caption:\n\n${caption}`);
        break;
      
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(caption)}&url=${encodeURIComponent(shareableLink)}`;
        window.open(shareUrl, '_blank', 'width=600,height=400');
        break;
      
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareableLink)}&quote=${encodeURIComponent(caption)}`;
        window.open(shareUrl, '_blank', 'width=600,height=400');
        break;
    }

    onShare?.(platform);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
          <Share2 className="w-6 h-6 text-purple-500" />
          Share Your Workout
        </h3>
        <p className="text-gray-400">Show off your gains on social media!</p>
      </div>

      {/* Platform Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Instagram */}
        <button
          onClick={() => handleShare('instagram')}
          className="group relative bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 hover:shadow-lg hover:shadow-pink-500/50 rounded-xl p-6 transition-all hover:scale-105"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center">
              <Instagram className="w-8 h-8 text-pink-600" />
            </div>
            <div className="text-left flex-1">
              <div className="text-lg font-bold text-white">Instagram</div>
              <div className="text-sm text-white/80">Share to feed or story</div>
            </div>
          </div>
          <div className="mt-3 text-xs text-white/60">
            Optimized for 1080×1080 (feed) and 1080×1920 (story)
          </div>
        </button>

        {/* Twitter */}
        <button
          onClick={() => handleShare('twitter')}
          className="group relative bg-gradient-to-br from-blue-500 to-blue-600 hover:shadow-lg hover:shadow-blue-500/50 rounded-xl p-6 transition-all hover:scale-105"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center">
              <Twitter className="w-8 h-8 text-blue-500" />
            </div>
            <div className="text-left flex-1">
              <div className="text-lg font-bold text-white">Twitter</div>
              <div className="text-sm text-white/80">Tweet your progress</div>
            </div>
          </div>
          <div className="mt-3 text-xs text-white/60">
            Auto-generated caption with stats and hashtags
          </div>
        </button>

        {/* Facebook */}
        <button
          onClick={() => handleShare('facebook')}
          className="group relative bg-gradient-to-br from-blue-700 to-blue-800 hover:shadow-lg hover:shadow-blue-700/50 rounded-xl p-6 transition-all hover:scale-105"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center">
              <Facebook className="w-8 h-8 text-blue-700" />
            </div>
            <div className="text-left flex-1">
              <div className="text-lg font-bold text-white">Facebook</div>
              <div className="text-sm text-white/80">Post to your timeline</div>
            </div>
          </div>
          <div className="mt-3 text-xs text-white/60">
            Share with friends and groups
          </div>
        </button>

        {/* Copy Link */}
        <button
          onClick={() => handleShare('link')}
          className="group relative bg-gradient-to-br from-gray-700 to-gray-800 hover:shadow-lg hover:shadow-gray-700/50 rounded-xl p-6 transition-all hover:scale-105"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center">
              {copiedLink ? (
                <Check className="w-8 h-8 text-green-600" />
              ) : (
                <LinkIcon className="w-8 h-8 text-gray-700" />
              )}
            </div>
            <div className="text-left flex-1">
              <div className="text-lg font-bold text-white">
                {copiedLink ? 'Link Copied!' : 'Copy Link'}
              </div>
              <div className="text-sm text-white/80">Share anywhere</div>
            </div>
          </div>
          <div className="mt-3 text-xs text-white/60 truncate">
            {shareableLink}
          </div>
        </button>
      </div>

      {/* Pre-Generated Captions */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Quick Captions</h4>
        
        <div className="space-y-4">
          {/* Instagram Caption */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Instagram className="w-4 h-4 text-pink-500" />
              <span className="text-sm font-semibold text-white">Instagram</span>
            </div>
            <p className="text-sm text-gray-300 whitespace-pre-line mb-3">
              {generateCaption('instagram')}
            </p>
            <button
              onClick={() => {
                navigator.clipboard.writeText(generateCaption('instagram'));
              }}
              className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
            >
              <Copy className="w-3 h-3" />
              Copy Caption
            </button>
          </div>

          {/* Twitter Caption */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Twitter className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-semibold text-white">Twitter</span>
            </div>
            <p className="text-sm text-gray-300 whitespace-pre-line mb-3">
              {generateCaption('twitter')}
            </p>
            <button
              onClick={() => {
                navigator.clipboard.writeText(generateCaption('twitter'));
              }}
              className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
            >
              <Copy className="w-3 h-3" />
              Copy Caption
            </button>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
        <h5 className="text-sm font-semibold text-blue-400 mb-2">💡 Sharing Tips</h5>
        <ul className="text-sm text-gray-400 space-y-1">
          <li>• Download the workout card image before sharing</li>
          <li>• Use provided captions for better engagement</li>
          <li>• Tag friends to challenge them!</li>
          <li>• Share your PRs to inspire your community</li>
        </ul>
      </div>
    </div>
  );
}
