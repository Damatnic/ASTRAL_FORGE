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
    const stats = `📊 Stats:\n• ${workout.duration} min\n• ${workout.xpEarned.toLocaleString()} Progress Points earned\n• ${(workout.totalVolume / 1000).toFixed(1)}K lbs total volume\n• ${workout.exercises.length} exercises`;
    const prText = workout.prCount > 0 ? `\n🏆 ${workout.prCount} NEW PR${workout.prCount > 1 ? 'S' : ''}!` : '';
    
    const hashtags = {
      instagram: '\n\n#fitness #workout #gains #training #gym #fitfam #fitnessmotivation #workoutmotivation #astralpower #fitnessgaming',
      twitter: '\n\n#fitness #workout #gains #training #astralpower',
      facebook: '\n\n#fitness #workout #gains #astralpower',
    };

    if (platform === 'twitter' && (baseText + stats + prText + hashtags.twitter).length > 280) {
      // Shorten for Twitter's character limit
      return `💪 Crushed "${workout.name}"!\n${workout.duration}min • ${workout.xpEarned} pts • ${workout.prCount} PRs\n\n#fitness #workout #astralpower`;
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
        <h3 className="text-2xl font-black text-white mb-2 flex items-center justify-center gap-2 uppercase tracking-wider">
          <Share2 className="w-6 h-6 text-amber-400" />
          Share Your Battle
        </h3>
        <p className="text-neutral-400 uppercase tracking-wider font-bold">Show off your gains on social media!</p>
      </div>

      {/* Platform Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Instagram */}
        <button
          onClick={() => handleShare('instagram')}
          className="group relative bg-amber-950/50 border-2 border-amber-700 hover:shadow-lg hover:shadow-amber-500/50 p-6 transition-all hover:scale-105"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white flex items-center justify-center">
              <Instagram className="w-8 h-8 text-pink-600" />
            </div>
            <div className="text-left flex-1">
              <div className="text-lg font-black text-white uppercase tracking-wider">Instagram</div>
              <div className="text-sm text-white/80 uppercase tracking-wider font-bold">Share to feed or story</div>
            </div>
          </div>
          <div className="mt-3 text-xs text-white/60 uppercase tracking-wider font-bold">
            Optimized for 1080×1080 (feed) and 1080×1920 (story)
          </div>
        </button>

        {/* Twitter */}
        <button
          onClick={() => handleShare('twitter')}
          className="group relative bg-amber-950/50 border-2 border-amber-700 hover:shadow-lg hover:shadow-amber-500/50 p-6 transition-all hover:scale-105"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white flex items-center justify-center">
              <Twitter className="w-8 h-8 text-blue-500" />
            </div>
            <div className="text-left flex-1">
              <div className="text-lg font-black text-white uppercase tracking-wider">Twitter</div>
              <div className="text-sm text-white/80 uppercase tracking-wider font-bold">Tweet your progress</div>
            </div>
          </div>
          <div className="mt-3 text-xs text-white/60 uppercase tracking-wider font-bold">
            Auto-generated caption with stats and hashtags
          </div>
        </button>

        {/* Facebook */}
        <button
          onClick={() => handleShare('facebook')}
          className="group relative bg-amber-950/50 border-2 border-amber-700 hover:shadow-lg hover:shadow-amber-500/50 p-6 transition-all hover:scale-105"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white flex items-center justify-center">
              <Facebook className="w-8 h-8 text-blue-700" />
            </div>
            <div className="text-left flex-1">
              <div className="text-lg font-black text-white uppercase tracking-wider">Facebook</div>
              <div className="text-sm text-white/80 uppercase tracking-wider font-bold">Post to your timeline</div>
            </div>
          </div>
          <div className="mt-3 text-xs text-white/60 uppercase tracking-wider font-bold">
            Share with friends and groups
          </div>
        </button>

        {/* Copy Link */}
        <button
          onClick={() => handleShare('link')}
          className="group relative bg-neutral-900 border-2 border-neutral-800 hover:shadow-lg hover:shadow-neutral-700/50 p-6 transition-all hover:scale-105"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white flex items-center justify-center">
              {copiedLink ? (
                <Check className="w-8 h-8 text-amber-600" />
              ) : (
                <LinkIcon className="w-8 h-8 text-neutral-700" />
              )}
            </div>
            <div className="text-left flex-1">
              <div className="text-lg font-black text-white uppercase tracking-wider">
                {copiedLink ? 'Link Copied!' : 'Copy Link'}
              </div>
              <div className="text-sm text-white/80 uppercase tracking-wider font-bold">Share anywhere</div>
            </div>
          </div>
          <div className="mt-3 text-xs text-white/60 truncate uppercase tracking-wider font-bold">
            {shareableLink}
          </div>
        </button>
      </div>

      {/* Pre-Generated Captions */}
      <div className="bg-neutral-900 border-2 border-neutral-800 p-6">
        <h4 className="text-lg font-black text-white mb-4 uppercase tracking-wider">Quick Captions</h4>
        
        <div className="space-y-4">
          {/* Instagram Caption */}
          <div className="bg-neutral-950 border-2 border-neutral-800 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Instagram className="w-4 h-4 text-pink-500" />
              <span className="text-sm font-black text-white uppercase tracking-wider">Instagram</span>
            </div>
            <p className="text-sm text-neutral-300 whitespace-pre-line mb-3">
              {generateCaption('instagram')}
            </p>
            <button
              onClick={() => {
                navigator.clipboard.writeText(generateCaption('instagram'));
              }}
              className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 uppercase tracking-wider font-bold"
            >
              <Copy className="w-3 h-3" />
              Copy Caption
            </button>
          </div>

          {/* Twitter Caption */}
          <div className="bg-neutral-950 border-2 border-neutral-800 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Twitter className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-black text-white uppercase tracking-wider">Twitter</span>
            </div>
            <p className="text-sm text-neutral-300 whitespace-pre-line mb-3">
              {generateCaption('twitter')}
            </p>
            <button
              onClick={() => {
                navigator.clipboard.writeText(generateCaption('twitter'));
              }}
              className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 uppercase tracking-wider font-bold"
            >
              <Copy className="w-3 h-3" />
              Copy Caption
            </button>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-amber-950/20 border-2 border-amber-700/30 p-4">
        <h5 className="text-sm font-black text-amber-400 mb-2 uppercase tracking-wider">💡 Sharing Tips</h5>
        <ul className="text-sm text-neutral-400 space-y-1">
          <li>• Download the battle card image before sharing</li>
          <li>• Use provided captions for better engagement</li>
          <li>• Tag friends to challenge them!</li>
          <li>• Share your PRs to inspire your community</li>
        </ul>
      </div>
    </div>
  );
}
