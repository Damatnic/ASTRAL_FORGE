'use client'

import { useState, useRef } from 'react'
import { useToast } from './toast'

interface VoiceRecorderProps {
  onTranscriptComplete: (text: string) => void
}

export function VoiceRecorder({ onTranscriptComplete }: VoiceRecorderProps) {
  const { toast } = useToast()
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [duration, setDuration] = useState(0)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' })
        // In a real implementation, you'd send this to a transcription service
        // Note: Full transcription requires Web Speech API or external service
        // For now, we store audio duration and timestamp
        const note = `🎤 Voice note recorded - ${duration}s - ${new Date().toLocaleTimeString()}`
        onTranscriptComplete(note)
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop())
        
        setDuration(0)
      }

      mediaRecorder.start()
      setIsRecording(true)

      // Start timer
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1)
      }, 1000)

      toast('info', 'Recording started')
    } catch (error) {
      toast('error', 'Microphone access denied')
      console.error('Recording error:', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setIsPaused(false)
      
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }

      toast('success', 'Recording saved')
    }
  }

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume()
        setIsPaused(false)
        // Resume timer
        timerRef.current = setInterval(() => {
          setDuration(prev => prev + 1)
        }, 1000)
      } else {
        mediaRecorderRef.current.pause()
        setIsPaused(true)
        // Pause timer
        if (timerRef.current) {
          clearInterval(timerRef.current)
          timerRef.current = null
        }
      }
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="bg-gray-700/50 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${isRecording ? (isPaused ? 'bg-yellow-500' : 'bg-red-500 animate-pulse') : 'bg-gray-500'}`} />
          <span className="font-mono text-lg">
            {formatTime(duration)}
          </span>
        </div>

        <div className="flex gap-2">
          {!isRecording ? (
            <button
              onClick={startRecording}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors"
            >
              🎤 Record
            </button>
          ) : (
            <>
              <button
                onClick={pauseRecording}
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg font-medium transition-colors"
              >
                {isPaused ? '▶️ Resume' : '⏸️ Pause'}
              </button>
              <button
                onClick={stopRecording}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg font-medium transition-colors"
              >
                ⏹️ Stop
              </button>
            </>
          )}
        </div>
      </div>

      <p className="text-xs text-gray-400">
        {isRecording
          ? isPaused
            ? 'Recording paused. Press Resume to continue.'
            : 'Recording in progress. Speak clearly into your microphone.'
          : 'Click Record to add a voice note to your workout.'}
      </p>
    </div>
  )
}
