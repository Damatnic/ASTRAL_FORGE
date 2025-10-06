import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID || ''
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET || ''
const SPOTIFY_REDIRECT_URI = process.env.NEXTAUTH_URL + '/api/spotify/callback'

// GET /api/spotify/callback
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  if (error || !code) {
    return NextResponse.redirect('/settings?spotify=error')
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString('base64'),
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: SPOTIFY_REDIRECT_URI,
      }),
    })

    const tokens = await tokenResponse.json()

    if (!tokenResponse.ok) {
      console.error('Spotify token exchange failed:', tokens)
      return NextResponse.redirect('/settings?spotify=error')
    }

    // Save tokens to user profile
    const user = await prisma.user.findUnique({
      where: { email: 'demo@astralforge.app' },
      include: { profile: true },
    })

    if (user && user.profile) {
      await prisma.userProfile.update({
        where: { id: user.profile.id },
        data: {
          spotifyAccessToken: tokens.access_token,
          spotifyRefreshToken: tokens.refresh_token,
        },
      })
    }

    return NextResponse.redirect('/settings?spotify=success')
  } catch (error) {
    console.error('Spotify callback error:', error)
    return NextResponse.redirect('/settings?spotify=error')
  }
}

