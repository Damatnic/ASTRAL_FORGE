'use client'

import { useState } from 'react'
import { Eye, Star, Play, Share2, X, Link as LinkIcon, Printer, Calendar } from 'lucide-react'

interface QuickActionMenuProps {
  onViewDetails: () => void
  onStartProgram: () => void
  onToggleFavorite: () => void
  onShare: () => void
  isFavorite?: boolean
  position?: 'bottom-right' | 'bottom-center' | 'top-right'
}

export function QuickActionMenu({
  onViewDetails,
  onStartProgram,
  onToggleFavorite,
  onShare,
  isFavorite = false,
  position = 'bottom-right'
}: QuickActionMenuProps) {
  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
    'top-right': 'top-4 right-4'
  }

  return (
    <div className={`absolute ${positionClasses[position]} z-20 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
      {/* View Details */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onViewDetails()
        }}
        className="p-2 bg-amber-950/90 hover:bg-amber-900 border-2 border-amber-700 backdrop-blur-sm transition-all hover:scale-110 shadow-lg"
        title="VIEW DETAILS"
      >
        <Eye className="w-4 h-4 text-white" />
      </button>

      {/* Toggle Favorite */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onToggleFavorite()
        }}
        className={`p-2 ${isFavorite ? 'bg-amber-950/90 hover:bg-amber-900' : 'bg-neutral-800/90 hover:bg-neutral-700'} border-2 border-amber-700 backdrop-blur-sm transition-all hover:scale-110 shadow-lg`}
        title={isFavorite ? 'REMOVE FROM FAVORITES' : 'ADD TO FAVORITES'}
      >
        <Star className={`w-4 h-4 ${isFavorite ? 'fill-white text-white' : 'text-white'}`} />
      </button>

      {/* Start Program */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onStartProgram()
        }}
        className="p-2 bg-amber-950/90 hover:bg-amber-900 border-2 border-amber-700 backdrop-blur-sm transition-all hover:scale-110 shadow-lg"
        title="START CAMPAIGN"
      >
        <Play className="w-4 h-4 text-white fill-white" />
      </button>

      {/* Share */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onShare()
        }}
        className="p-2 bg-amber-950/90 hover:bg-amber-900 border-2 border-amber-700 backdrop-blur-sm transition-all hover:scale-110 shadow-lg"
        title="SHARE CAMPAIGN"
      >
        <Share2 className="w-4 h-4 text-white" />
      </button>
    </div>
  )
}

interface ContextMenuProps {
  x: number
  y: number
  onClose: () => void
  onOpenNewTab: () => void
  onToggleFavorite: () => void
  onShare: () => void
  onCopyLink: () => void
  onExportSchedule: () => void
  onPrintDetails: () => void
  isFavorite?: boolean
}

export function ContextMenu({
  x,
  y,
  onClose,
  onOpenNewTab,
  onToggleFavorite,
  onShare,
  onCopyLink,
  onExportSchedule,
  onPrintDetails,
  isFavorite = false
}: ContextMenuProps) {
  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      
      {/* Context Menu */}
      <div
        className="fixed z-50 bg-neutral-900 border-2 border-neutral-800 shadow-2xl min-w-[200px] overflow-hidden"
        style={{ left: x, top: y }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="py-2">
          {/* Open in New Tab */}
          <button
            onClick={() => {
              onOpenNewTab()
              onClose()
            }}
            className="w-full px-4 py-2 text-left text-sm text-neutral-200 hover:bg-neutral-800 transition-colors flex items-center space-x-3"
          >
            <Eye className="w-4 h-4" />
            <span className="font-bold uppercase tracking-wider">OPEN IN NEW TAB</span>
          </button>

          {/* Toggle Favorite */}
          <button
            onClick={() => {
              onToggleFavorite()
              onClose()
            }}
            className="w-full px-4 py-2 text-left text-sm text-neutral-200 hover:bg-neutral-800 transition-colors flex items-center space-x-3"
          >
            <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
            <span className="font-bold uppercase tracking-wider">{isFavorite ? 'REMOVE FROM FAVORITES' : 'ADD TO FAVORITES'}</span>
          </button>

          <div className="h-px bg-neutral-700 my-2"></div>

          {/* Share Program */}
          <button
            onClick={() => {
              onShare()
              onClose()
            }}
            className="w-full px-4 py-2 text-left text-sm text-neutral-200 hover:bg-neutral-800 transition-colors flex items-center space-x-3"
          >
            <Share2 className="w-4 h-4" />
            <span className="font-bold uppercase tracking-wider">SHARE CAMPAIGN</span>
          </button>

          {/* Copy Link */}
          <button
            onClick={() => {
              onCopyLink()
              onClose()
            }}
            className="w-full px-4 py-2 text-left text-sm text-neutral-200 hover:bg-neutral-800 transition-colors flex items-center space-x-3"
          >
            <LinkIcon className="w-4 h-4" />
            <span className="font-bold uppercase tracking-wider">COPY LINK</span>
          </button>

          {/* Export Schedule */}
          <button
            onClick={() => {
              onExportSchedule()
              onClose()
            }}
            className="w-full px-4 py-2 text-left text-sm text-neutral-200 hover:bg-neutral-800 transition-colors flex items-center space-x-3"
          >
            <Calendar className="w-4 h-4" />
            <span className="font-bold uppercase tracking-wider">EXPORT SCHEDULE</span>
          </button>

          <div className="h-px bg-neutral-700 my-2"></div>

          {/* Print Details */}
          <button
            onClick={() => {
              onPrintDetails()
              onClose()
            }}
            className="w-full px-4 py-2 text-left text-sm text-neutral-200 hover:bg-neutral-800 transition-colors flex items-center space-x-3"
          >
            <Printer className="w-4 h-4" />
            <span className="font-bold uppercase tracking-wider">PRINT DETAILS</span>
          </button>
        </div>
      </div>
    </>
  )
}
