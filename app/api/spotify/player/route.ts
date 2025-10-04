import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { handleApiError } from '@/lib/error-handler'

// POST /api/spotify/player - Control Spotify playback
export async function POST(request: Request) {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'demo@astralforge.app' },
      include: { profile: true },
    })

    if (!user || !user.profile?.spotifyAccessToken) {
      return NextResponse.json(
        { error: 'Spotify not connected' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { action, playlistUri } = body // action: 'play', 'pause', 'next', 'previous'

    let endpoint = ''
    let method = 'PUT'
    let spotifyBody: any = undefined

    switch (action) {
      case 'play':
        endpoint = 'https://api.spotify.com/v1/me/player/play'
        if (playlistUri) {
          spotifyBody = { context_uri: playlistUri }
        }
        break
      case 'pause':
        endpoint = 'https://api.spotify.com/v1/me/player/pause'
        break
      case 'next':
        endpoint = 'https://api.spotify.com/v1/me/player/next'
        method = 'POST'
        break
      case 'previous':
        endpoint = 'https://api.spotify.com/v1/me/player/previous'
        method = 'POST'
        break
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    const response = await fetch(endpoint, {
      method,
      headers: {
        Authorization: `Bearer ${user.profile.spotifyAccessToken}`,
        'Content-Type': 'application/json',
      },
      body: spotifyBody ? JSON.stringify(spotifyBody) : undefined,
    })

    if (!response.ok) {
      // Token might be expired, try to refresh
      if (response.status === 401 && user.profile.spotifyRefreshToken) {
        // Attempt token refresh
        const refreshResponse = await fetch('https://accounts.spotify.com/api/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: 'Basic ' + Buffer.from(
              (process.env.SPOTIFY_CLIENT_ID || '') + ':' + (process.env.SPOTIFY_CLIENT_SECRET || '')
            ).toString('base64'),
          },
          body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: user.profile.spotifyRefreshToken,
          }),
        })

        if (refreshResponse.ok) {
          const tokens = await refreshResponse.json()
          
          // Update stored token
          await prisma.userProfile.update({
            where: { id: user.profile.id },
            data: { spotifyAccessToken: tokens.access_token },
          })

          // Retry original request with new token
          const retryResponse = await fetch(endpoint, {
            method,
            headers: {
              Authorization: `Bearer ${tokens.access_token}`,
              'Content-Type': 'application/json',
            },
            body: spotifyBody ? JSON.stringify(spotifyBody) : undefined,
          })

          if (retryResponse.ok) {
            return NextResponse.json({ success: true })
          }
        }
        
        return NextResponse.json({ error: 'Token expired, please reconnect Spotify' }, { status: 401 })
      }
      return NextResponse.json({ error: 'Spotify API error' }, { status: response.status })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return handleApiError(error)
  }
}

// GET /api/spotify/player - Get current playback state
export async function GET(request: Request) {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'demo@astralforge.app' },
      include: { profile: true },
    })

    if (!user || !user.profile?.spotifyAccessToken) {
      return NextResponse.json({ connected: false })
    }

    const response = await fetch('https://api.spotify.com/v1/me/player', {
      headers: {
        Authorization: `Bearer ${user.profile.spotifyAccessToken}`,
      },
    })

    if (!response.ok) {
      if (response.status === 204) {
        // No active device
        return NextResponse.json({ connected: true, playing: false })
      }
      return NextResponse.json({ connected: false })
    }

    const playback = await response.json()
    return NextResponse.json({
      connected: true,
      playing: playback.is_playing,
      track: playback.item?.name,
      artist: playback.item?.artists?.[0]?.name,
    })
  } catch (error) {
    return NextResponse.json({ connected: false })
  }
}
