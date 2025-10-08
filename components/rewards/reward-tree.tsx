'use client'

import { Trophy, Book, Unlock, Award, Lock, CheckCircle2, ChevronRight } from 'lucide-react'

interface RewardNode {
  id: string
  type: 'achievement' | 'template' | 'feature' | 'title'
  name: string
  description: string
  requirement: string
  unlocked: boolean
  progress?: number // 0-100 for partial completion
  children?: RewardNode[]
}

interface RewardTreeProps {
  rewards: RewardNode[]
  onNodeClick?: (node: RewardNode) => void
}

export function RewardTree({ rewards, onNodeClick }: RewardTreeProps) {
  return (
    <div className="space-y-8">
      {rewards.map((reward) => (
        <RewardNode key={reward.id} node={reward} onNodeClick={onNodeClick} level={0} />
      ))}
    </div>
  )
}

function RewardNode({
  node,
  onNodeClick,
  level,
}: {
  node: RewardNode
  onNodeClick?: (node: RewardNode) => void
  level: number
}) {
  const getTypeConfig = (type: RewardNode['type']) => {
    switch (type) {
      case 'achievement':
        return {
          icon: Trophy,
          color: 'text-amber-400',
          bgColor: 'bg-amber-950/10',
          borderColor: 'border-amber-700/30',
          hoverBorder: 'hover:border-amber-700/60',
        }
      case 'template':
        return {
          icon: Book,
          color: 'text-amber-400',
          bgColor: 'bg-amber-950/10',
          borderColor: 'border-amber-700/30',
          hoverBorder: 'hover:border-amber-700/60',
        }
      case 'feature':
        return {
          icon: Unlock,
          color: 'text-amber-400',
          bgColor: 'bg-amber-950/10',
          borderColor: 'border-amber-700/30',
          hoverBorder: 'hover:border-amber-700/60',
        }
      case 'title':
        return {
          icon: Award,
          color: 'text-amber-400',
          bgColor: 'bg-amber-950/10',
          borderColor: 'border-amber-700/30',
          hoverBorder: 'hover:border-amber-700/60',
        }
    }
  }

  const config = getTypeConfig(node.type)
  const Icon = config.icon
  const hasProgress = node.progress !== undefined && node.progress > 0 && node.progress < 100

  return (
    <div className="relative" style={{ marginLeft: `${level * 2}rem` }}>
      {/* Connection line to parent */}
      {level > 0 && (
        <div className="absolute -left-8 top-6 w-8 h-px bg-gray-700">
          <ChevronRight className="absolute -right-1 -top-2.5 w-5 h-5 text-gray-700" />
        </div>
      )}

      {/* Node card */}
      <button
        onClick={() => onNodeClick?.(node)}
        disabled={!node.unlocked && !hasProgress}
        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
          node.unlocked
            ? `${config.bgColor} ${config.borderColor} ${config.hoverBorder} hover:scale-[1.02]`
            : 'bg-gray-900/50 border-gray-800 opacity-60'
        } ${onNodeClick ? 'cursor-pointer' : 'cursor-default'}`}
      >
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div
            className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${
              node.unlocked ? config.bgColor : 'bg-gray-800/50'
            }`}
          >
            {node.unlocked ? (
              <Icon className={`w-6 h-6 ${config.color}`} />
            ) : (
              <Lock className="w-6 h-6 text-gray-600" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 space-y-2">
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3
                    className={`font-semibold ${
                      node.unlocked ? 'text-white' : 'text-gray-500'
                    }`}
                  >
                    {node.name}
                  </h3>
                  {node.unlocked && (
                    <CheckCircle2 className={`w-4 h-4 ${config.color} flex-shrink-0`} />
                  )}
                </div>
                <p
                  className={`text-sm ${node.unlocked ? 'text-gray-400' : 'text-gray-600'} mt-1`}
                >
                  {node.description}
                </p>
              </div>

              {/* Type badge */}
              <span
                className={`flex-shrink-0 px-2 py-1 text-xs font-medium rounded ${
                  node.unlocked ? config.bgColor + ' ' + config.color : 'bg-gray-800 text-gray-600'
                } border ${node.unlocked ? config.borderColor : 'border-gray-700'}`}
              >
                {node.type}
              </span>
            </div>

            {/* Requirement */}
            {!node.unlocked && (
              <div className="flex items-start gap-2 text-sm">
                <Lock className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-500">{node.requirement}</span>
              </div>
            )}

            {/* Progress bar */}
            {hasProgress && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-500 uppercase tracking-wider font-bold">Progress</span>
                  <span className={config.color}>{node.progress}%</span>
                </div>
                <div className="h-1.5 bg-neutral-800 overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r from-amber-600 to-amber-500 transition-all duration-500`}
                    style={{ width: `${node.progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </button>

      {/* Children (recursive) */}
      {node.children && node.children.length > 0 && (
        <div className="mt-4 space-y-4 relative">
          {/* Vertical connector line */}
          {node.children.length > 1 && (
            <div
              className="absolute left-6 top-0 w-px bg-gray-700"
              style={{ height: `calc(100% - 2rem)` }}
            />
          )}
          {node.children.map((child) => (
            <RewardNode
              key={child.id}
              node={child}
              onNodeClick={onNodeClick}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// Example usage with sample data
export function RewardTreeExample() {
  const sampleRewards: RewardNode[] = [
    {
      id: '1',
      type: 'achievement',
      name: 'Getting Started',
      description: 'Complete your first workout',
      requirement: 'Complete 1 workout session',
      unlocked: true,
      children: [
        {
          id: '2',
          type: 'achievement',
          name: 'Dedicated',
          description: 'Complete 10 workouts',
          requirement: 'Complete 10 workout sessions',
          unlocked: true,
          children: [
            {
              id: '3',
              type: 'template',
              name: 'PPL Program',
              description: 'Unlock Push/Pull/Legs training split',
              requirement: 'Reach Intermediate tier',
              unlocked: false,
              progress: 65,
            },
          ],
        },
        {
          id: '4',
          type: 'feature',
          name: 'Advanced Metrics',
          description: 'Track volume, intensity, and frequency',
          requirement: 'Reach Beginner tier',
          unlocked: true,
          children: [
            {
              id: '5',
              type: 'title',
              name: 'The Relentless',
              description: 'Special title for consistency',
              requirement: '7-day workout streak',
              unlocked: false,
              progress: 40,
            },
          ],
        },
      ],
    },
  ]

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-950 rounded-xl">
      <h2 className="text-2xl font-bold text-white mb-6">Reward Progression</h2>
      <RewardTree
        rewards={sampleRewards}
        onNodeClick={(node) => console.log('Clicked:', node.name)}
      />
    </div>
  )
}
