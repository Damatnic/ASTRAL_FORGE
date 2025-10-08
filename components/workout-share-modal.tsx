'use client';

import { useState } from 'react';
import { X, Share2 } from 'lucide-react';
import WorkoutShareCard, { WorkoutCardData } from './workout-share-card';
import SocialMediaExport from './social-media-export';

interface WorkoutShareModalProps {
  workout: WorkoutCardData;
  isOpen: boolean;
  onClose: () => void;
}

export default function WorkoutShareModal({
  workout,
  isOpen,
  onClose,
}: WorkoutShareModalProps) {
  const [activeTab, setActiveTab] = useState<'card' | 'social'>('card');
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string>();

  if (!isOpen) return null;

  const handleDownload = (imageUrl: string) => {
    setGeneratedImageUrl(imageUrl);
    console.log('Image downloaded:', imageUrl);
  };

  const handleCopy = (imageUrl: string) => {
    setGeneratedImageUrl(imageUrl);
    console.log('Image copied:', imageUrl);
  };

  const handleShare = (platform: string) => {
    console.log('Shared to:', platform);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-neutral-900 border-2 border-neutral-800 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-2 border-neutral-800">
          <h2 className="text-2xl font-black text-white flex items-center gap-2 uppercase tracking-wider">
            <Share2 className="w-6 h-6 text-amber-400" />
            Share Battle
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-amber-900/20 border-2 border-amber-800/50 transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-6 h-6 text-neutral-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-4 bg-neutral-950 border-b-2 border-neutral-800">
          <button
            onClick={() => setActiveTab('card')}
            className={`flex-1 px-4 py-3 transition-colors font-bold uppercase tracking-wider ${
              activeTab === 'card'
                ? 'bg-amber-950/50 border-2 border-amber-700 text-amber-400'
                : 'bg-neutral-900 border-2 border-neutral-800 text-neutral-400 hover:bg-neutral-800'
            }`}
          >
            Battle Card
          </button>
          <button
            onClick={() => setActiveTab('social')}
            className={`flex-1 px-4 py-3 transition-colors font-bold uppercase tracking-wider ${
              activeTab === 'social'
                ? 'bg-amber-950/50 border-2 border-amber-700 text-amber-400'
                : 'bg-neutral-900 border-2 border-neutral-800 text-neutral-400 hover:bg-neutral-800'
            }`}
          >
            Social Media
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'card' && (
            <WorkoutShareCard
              workout={workout}
              onDownload={handleDownload}
              onCopy={handleCopy}
            />
          )}

          {activeTab === 'social' && (
            <SocialMediaExport
              workout={workout}
              imageUrl={generatedImageUrl}
              onShare={handleShare}
            />
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-neutral-950 border-t-2 border-neutral-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-neutral-900 border-2 border-neutral-800 hover:bg-neutral-800 transition-colors font-bold uppercase tracking-wider text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
