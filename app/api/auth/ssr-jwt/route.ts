// app/api/auth/ssr-jwt/route.ts
import { NextRequest, NextResponse } from 'next/server'

function jsonError(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status })
}

export async function POST(req: NextRequest) {
  try {
    const { jwt } = await req.json().catch(() => ({}))

    if (!jwt || typeof jwt !== 'string') {
      return jsonError('JWT is required', 400)
    }

    const res = NextResponse.json({ success: true })

    res.cookies.set('pv_jwt', jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // false on localhost
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return res
  } catch {
    return jsonError('Failed to set SSR JWT cookie', 500)
  }
}
