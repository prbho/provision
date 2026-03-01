/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from 'next/server'

// This endpoint now only handles redirects from old verification links
// Old format: /api/auth/verify-email?token=abc&userId=123
// New format: /verify/abc

function getAppUrl(request: NextRequest): string {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.trim()
  if (configured) return configured.replace(/\/+$/, '')
  return request.nextUrl.origin.replace(/\/+$/, '')
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')
    const userId = searchParams.get('userId')
    const appUrl = getAppUrl(request)

    console.log('Processing old verification link:', {
      hasToken: !!token,
      hasUserId: !!userId,
    })

    if (!token) {
      console.error('Missing token in old verification link')
      return NextResponse.redirect(`${appUrl}/login?verification_error=true`)
    }

    // Redirect to new clean URL format
    const newVerificationUrl = `${appUrl}/verify/${token}`

    console.log('Redirecting to new format:', newVerificationUrl)

    return NextResponse.redirect(newVerificationUrl)
  } catch (error: any) {
    console.error('Error processing old verification link:', error.message)
    const appUrl = getAppUrl(request)
    return NextResponse.redirect(`${appUrl}/login?verification_error=true`)
  }
}

// Disable POST to this endpoint - use the new /api/auth/verify instead
export async function POST() {
  return NextResponse.json(
    {
      error:
        'This endpoint is deprecated. Please use the new verification system at /api/auth/verify',
      code: 'DEPRECATED_ENDPOINT',
    },
    { status: 410 } // 410 Gone
  )
}
