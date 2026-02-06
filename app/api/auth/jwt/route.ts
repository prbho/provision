import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { jwt } = await req.json().catch(() => ({}))
  if (!jwt) return NextResponse.json({ success: false }, { status: 400 })

  const res = NextResponse.json({ success: true })

  res.cookies.set('pv_jwt', jwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })

  return res
}
