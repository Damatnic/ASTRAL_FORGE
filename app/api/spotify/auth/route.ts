import { NextResponse } from 'next/server'

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID || ''
const SPOTIFY_REDIRECT_URI = process.env.NEXTAUTH_URL + '/api/spotify/callback'
const SCOPES = [
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'playlist-read-private',
].join(' ')

// GET /api/spotify/auth - Redirect to Spotify authorization
export async function GET(_request: Request) {
  if (!SPOTIFY_CLIENT_ID) {
    return NextResponse.json(
      { error: 'Spotify integration not configured. Please set SPOTIFY_CLIENT_ID.' },
      { status: 400 }
    )
  }

  const state = Math.random().toString(36).substring(7)
  const authUrl = `https://accounts.spotify.com/authorize?${new URLSearchParams({
    response_type: 'code',
    client_id: SPOTIFY_CLIENT_ID,
    scope: SCOPES,
    redirect_uri: SPOTIFY_REDIRECT_URI,
    state,
  })}`

  return NextResponse.redirect(authUrl)
}

