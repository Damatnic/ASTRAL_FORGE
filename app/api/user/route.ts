import { NextResponse } from 'next/server'

export async function GET() {
  // For demo purposes, return mock user data
  // In production, get this from NextAuth session
  return NextResponse.json({
    id: 'demo-user-id',
    email: 'demo@astralforge.app',
    name: 'Demo User',
  })
}


