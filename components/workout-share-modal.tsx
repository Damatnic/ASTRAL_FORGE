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
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl border border-gray-700 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Share2 className="w-6 h-6 text-purple-500" />
            Share Workout
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-4 bg-gray-900/50 border-b border-gray-700">
          <button
            onClick={() => setActiveTab('card')}
            className={`flex-1 px-4 py-3 rounded-lg transition-colors font-medium ${
              activeTab === 'card'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Workout Card
          </button>
          <button
            onClick={() => setActiveTab('social')}
            className={`flex-1 px-4 py-3 rounded-lg transition-colors font-medium ${
              activeTab === 'social'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
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
        <div className="p-4 bg-gray-900/50 border-t border-gray-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors font-medium text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
