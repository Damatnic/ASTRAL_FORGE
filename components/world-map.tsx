'use client';

import { useState } from 'react';

// TypeScript Interfaces
type RegionStatus = 'locked' | 'unlocked' | 'current' | 'completed';
type RegionDifficulty = 1 | 2 | 3 | 4 | 5;

interface RegionChallenge {
  id: string;
  name: string;
  type: 'boss' | 'quest' | 'dungeon' | 'trial';
  difficulty: RegionDifficulty;
  completed: boolean;
  reward: string;
}

interface Region {
  id: string;
  name: string;
  description: string;
  lore: string;
  status: RegionStatus;
  levelRequirement: number;
  difficulty: RegionDifficulty;
  completionPercentage: number;
  challenges: RegionChallenge[];
  rewards: string[];
  bonus: string;
  // SVG position
  x: number;
  y: number;
  // Connected regions
  connectsTo: string[];
}

interface WorldMapProps {
  regions: Region[];
  currentLevel: number;
  onRegionClick: (region: Region) => void;
  onFastTravel: (regionId: string) => void;
  onChallengeStart: (regionId: string, challengeId: string) => void;
}

export default function WorldMap({
  regions,
  currentLevel,
  onRegionClick,
  onFastTravel,
  onChallengeStart,
}: WorldMapProps) {
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  // Helper Functions
  const getRegionColor = (status: RegionStatus): string => {
    switch (status) {
      case 'locked':
        return '#6b7280'; // gray-500
      case 'unlocked':
        return '#3b82f6'; // blue-500
      case 'current':
        return '#a855f7'; // purple-500
      case 'completed':
        return '#f59e0b'; // amber-500
      default:
        return '#6b7280';
    }
  };

  const getRegionGlow = (status: RegionStatus): string => {
    switch (status) {
      case 'locked':
        return '0 0 0px rgba(0,0,0,0)';
      case 'unlocked':
        return '0 0 20px rgba(59, 130, 246, 0.6)';
      case 'current':
        return '0 0 30px rgba(168, 85, 247, 0.8)';
      case 'completed':
        return '0 0 25px rgba(245, 158, 11, 0.7)';
      default:
        return '0 0 0px rgba(0,0,0,0)';
    }
  };

  const getDifficultyStars = (difficulty: RegionDifficulty): string => {
    return '⭐'.repeat(difficulty);
  };

  const getDifficultyColor = (difficulty: RegionDifficulty): string => {
    const colors = {
      1: 'text-green-400',
      2: 'text-blue-400',
      3: 'text-purple-400',
      4: 'text-red-400',
      5: 'text-amber-400',
    };
    return colors[difficulty];
  };

  const getChallengeIcon = (type: RegionChallenge['type']): string => {
    const icons = {
      boss: '👹',
      quest: '📜',
      dungeon: '🏰',
      trial: '⚔️',
    };
    return icons[type];
  };

  const isRegionUnlocked = (region: Region): boolean => {
    return region.status !== 'locked' && currentLevel >= region.levelRequirement;
  };

  const canFastTravel = (region: Region): boolean => {
    return region.status !== 'locked' && region.status !== 'current';
  };

  const handleRegionClick = (region: Region) => {
    if (isRegionUnlocked(region)) {
      setSelectedRegion(region);
      onRegionClick(region);
    }
  };

  const handleFastTravel = () => {
    if (selectedRegion && canFastTravel(selectedRegion)) {
      onFastTravel(selectedRegion.id);
      setSelectedRegion(null);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* World Map SVG */}
      <div className="lg:col-span-2 bg-slate-900/50 rounded-xl border border-purple-500/20 p-6 backdrop-blur-sm">
        <div className="mb-4">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            🗺️ World of Astral Forge
          </h2>
          <p className="text-slate-400 text-sm mt-1">Explore the realm and conquer legendary challenges</p>
        </div>

        {/* SVG Map Canvas */}
        <div className="relative bg-slate-950/50 rounded-lg border border-slate-700/50 overflow-hidden">
          <svg
            viewBox="0 0 800 600"
            className="w-full h-auto"
            style={{ minHeight: '500px' }}
          >
            {/* Background */}
            <defs>
              <radialGradient id="mapBg" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#1e1b4b" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#0f172a" stopOpacity="1" />
              </radialGradient>
              
              {/* Glow filters for each status */}
              <filter id="glowUnlocked">
                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              
              <filter id="glowCurrent">
                <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            <rect width="800" height="600" fill="url(#mapBg)" />

            {/* Connection Paths */}
            {regions.map((region) =>
              region.connectsTo.map((targetId) => {
                const targetRegion = regions.find((r) => r.id === targetId);
                if (!targetRegion) return null;

                const isPathUnlocked =
                  region.status !== 'locked' && targetRegion.status !== 'locked';

                return (
                  <line
                    key={`${region.id}-${targetId}`}
                    x1={region.x}
                    y1={region.y}
                    x2={targetRegion.x}
                    y2={targetRegion.y}
                    stroke={isPathUnlocked ? '#8b5cf6' : '#4b5563'}
                    strokeWidth="3"
                    strokeDasharray={isPathUnlocked ? '0' : '5,5'}
                    opacity={isPathUnlocked ? '0.6' : '0.3'}
                    strokeLinecap="round"
                  />
                );
              })
            )}

            {/* Region Nodes */}
            {regions.map((region) => {
              const isUnlocked = isRegionUnlocked(region);
              const isHovered = hoveredRegion === region.id;
              const isSelected = selectedRegion?.id === region.id;
              const nodeRadius = isHovered || isSelected ? 45 : 40;

              return (
                <g
                  key={region.id}
                  transform={`translate(${region.x}, ${region.y})`}
                  onMouseEnter={() => setHoveredRegion(region.id)}
                  onMouseLeave={() => setHoveredRegion(null)}
                  onClick={() => handleRegionClick(region)}
                  style={{ cursor: isUnlocked ? 'pointer' : 'not-allowed' }}
                >
                  {/* Outer glow ring for current region */}
                  {region.status === 'current' && (
                    <circle
                      r={nodeRadius + 10}
                      fill="none"
                      stroke="#a855f7"
                      strokeWidth="2"
                      opacity="0.5"
                    >
                      <animate
                        attributeName="r"
                        values={`${nodeRadius + 10};${nodeRadius + 15};${nodeRadius + 10}`}
                        dur="2s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="0.5;0.8;0.5"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}

                  {/* Main node circle */}
                  <circle
                    r={nodeRadius}
                    fill={getRegionColor(region.status)}
                    stroke={isSelected ? '#ec4899' : region.status === 'locked' ? '#374151' : '#fff'}
                    strokeWidth={isSelected ? '4' : '2'}
                    opacity={region.status === 'locked' ? '0.5' : '1'}
                    filter={region.status === 'current' ? 'url(#glowCurrent)' : region.status !== 'locked' ? 'url(#glowUnlocked)' : 'none'}
                    style={{
                      transition: 'all 0.3s ease',
                      filter: `drop-shadow(${getRegionGlow(region.status)})`,
                    }}
                  />

                  {/* Lock icon for locked regions */}
                  {region.status === 'locked' && (
                    <text
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="24"
                      fill="#9ca3af"
                    >
                      🔒
                    </text>
                  )}

                  {/* Completion checkmark for completed regions */}
                  {region.status === 'completed' && (
                    <text
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="28"
                      fill="#fff"
                    >
                      ✓
                    </text>
                  )}

                  {/* Current location marker */}
                  {region.status === 'current' && (
                    <text
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="28"
                      fill="#fff"
                    >
                      📍
                    </text>
                  )}

                  {/* Unlocked region icon (no special marker) */}
                  {region.status === 'unlocked' && (
                    <text
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="24"
                      fill="#fff"
                    >
                      🗺️
                    </text>
                  )}

                  {/* Region name label */}
                  <text
                    y={nodeRadius + 20}
                    textAnchor="middle"
                    fontSize="14"
                    fontWeight="bold"
                    fill={region.status === 'locked' ? '#6b7280' : '#fff'}
                    style={{ pointerEvents: 'none' }}
                  >
                    {region.name}
                  </text>

                  {/* Level requirement for locked regions */}
                  {region.status === 'locked' && (
                    <text
                      y={nodeRadius + 38}
                      textAnchor="middle"
                      fontSize="12"
                      fill="#9ca3af"
                      style={{ pointerEvents: 'none' }}
                    >
                      Lv. {region.levelRequirement}
                    </text>
                  )}

                  {/* Completion percentage for unlocked regions */}
                  {region.status !== 'locked' && (
                    <text
                      y={nodeRadius + 38}
                      textAnchor="middle"
                      fontSize="12"
                      fill="#a855f7"
                      fontWeight="600"
                      style={{ pointerEvents: 'none' }}
                    >
                      {region.completionPercentage}%
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Hover Tooltip */}
          {hoveredRegion && (
            <div className="absolute top-4 right-4 bg-slate-900/95 border border-purple-500/30 rounded-lg p-4 max-w-xs backdrop-blur-sm">
              {(() => {
                const region = regions.find((r) => r.id === hoveredRegion);
                if (!region) return null;

                return (
                  <>
                    <h3 className="font-bold text-lg text-purple-400 mb-2">
                      {region.name}
                    </h3>
                    <p className="text-slate-300 text-sm mb-2">{region.description}</p>
                    <div className="flex items-center gap-2 text-sm mb-2">
                      <span className={getDifficultyColor(region.difficulty)}>
                        {getDifficultyStars(region.difficulty)}
                      </span>
                      <span className="text-slate-400">
                        Lv. {region.levelRequirement}+
                      </span>
                    </div>
                    {region.status !== 'locked' && (
                      <div className="text-xs text-slate-400">
                        <div>Completion: {region.completionPercentage}%</div>
                        <div>Challenges: {region.challenges.filter(c => c.completed).length}/{region.challenges.length}</div>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          )}
        </div>

        {/* Map Legend */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-4 h-4 rounded-full bg-gray-500"></div>
            <span className="text-slate-400">Locked</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-4 h-4 rounded-full bg-blue-500"></div>
            <span className="text-slate-400">Unlocked</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-4 h-4 rounded-full bg-purple-500 animate-pulse"></div>
            <span className="text-slate-400">Current</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-4 h-4 rounded-full bg-amber-500"></div>
            <span className="text-slate-400">Completed</span>
          </div>
        </div>
      </div>

      {/* Region Details Panel */}
      <div className="bg-slate-900/50 rounded-xl border border-purple-500/20 p-6 backdrop-blur-sm">
        {selectedRegion ? (
          <>
            <div className="mb-4">
              <h3 className="text-2xl font-bold text-purple-400 mb-2">
                {selectedRegion.name}
              </h3>
              <div className="flex items-center gap-3 mb-3">
                <span className={`${getDifficultyColor(selectedRegion.difficulty)} text-lg`}>
                  {getDifficultyStars(selectedRegion.difficulty)}
                </span>
                <span className="text-slate-400 text-sm">Level {selectedRegion.levelRequirement}+</span>
              </div>
              <p className="text-slate-300 text-sm mb-3">{selectedRegion.description}</p>
              <p className="text-purple-300 text-xs italic border-l-2 border-purple-500 pl-3 py-2 bg-purple-900/20">
                "{selectedRegion.lore}"
              </p>
            </div>

            {/* Progress */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Completion</span>
                <span className="text-purple-400 font-semibold">{selectedRegion.completionPercentage}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${selectedRegion.completionPercentage}%` }}
                ></div>
              </div>
            </div>

            {/* Regional Bonus */}
            {selectedRegion.status !== 'locked' && (
              <div className="mb-4 p-3 bg-amber-900/20 border border-amber-500/30 rounded-lg">
                <div className="text-xs text-amber-400 font-semibold mb-1">Regional Bonus</div>
                <div className="text-sm text-amber-200">{selectedRegion.bonus}</div>
              </div>
            )}

            {/* Challenges */}
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-slate-300 mb-3">Challenges ({selectedRegion.challenges.filter(c => c.completed).length}/{selectedRegion.challenges.length})</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {selectedRegion.challenges.map((challenge) => (
                  <div
                    key={challenge.id}
                    className={`p-3 rounded-lg border ${
                      challenge.completed
                        ? 'bg-green-900/20 border-green-500/30'
                        : 'bg-slate-800/50 border-slate-700/50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getChallengeIcon(challenge.type)}</span>
                        <span className="text-sm font-medium text-slate-200">{challenge.name}</span>
                      </div>
                      {challenge.completed && (
                        <span className="text-green-400 text-xs">✓</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className={getDifficultyColor(challenge.difficulty)}>
                        {getDifficultyStars(challenge.difficulty)}
                      </span>
                      <span className="text-slate-400">{challenge.reward}</span>
                    </div>
                    {!challenge.completed && selectedRegion.status !== 'locked' && (
                      <button
                        onClick={() => onChallengeStart(selectedRegion.id, challenge.id)}
                        className="mt-2 w-full px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded transition-colors"
                      >
                        Start Challenge
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Rewards */}
            {selectedRegion.rewards.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-slate-300 mb-2">Rewards</h4>
                <div className="space-y-1">
                  {selectedRegion.rewards.map((reward, index) => (
                    <div key={index} className="text-xs text-slate-400 flex items-center gap-2">
                      <span className="text-amber-400">🎁</span>
                      {reward}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-2">
              {canFastTravel(selectedRegion) && (
                <button
                  onClick={handleFastTravel}
                  className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all"
                >
                  ⚡ Fast Travel
                </button>
              )}
              <button
                onClick={() => setSelectedRegion(null)}
                className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🗺️</div>
            <p className="text-slate-400 text-sm">Select a region on the map to view details</p>
          </div>
        )}
      </div>
    </div>
  );
}
