/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import { Account, Client } from 'node-appwrite'

const SESSION_COOKIE_NAME = 'pv_session' // your own cookie name

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Missing credentials' },
        { status: 400 }
      )
    }

    const endpoint =
      process.env.APPWRITE_ENDPOINT || process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT
    const projectId =
      process.env.APPWRITE_PROJECT_ID ||
      process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID

    if (!endpoint || !projectId) {
      return NextResponse.json(
        { success: false, error: 'Missing Appwrite server config' },
        { status: 500 }
      )
    }

    // IMPORTANT: no API key here — we want a real user session
    const client = new Client().setEndpoint(endpoint).setProject(projectId)
    const account = new Account(client)

    const session = await account.createEmailPasswordSession(email, password)

    // Appwrite session secret is what lets server authenticate as that user
    const secret = (session as any)?.secret
    if (!secret) {
      return NextResponse.json(
        {
          success: false,
          error: 'Session secret missing from Appwrite response',
        },
        { status: 500 }
      )
    }

    const res = NextResponse.json({ success: true })

    res.cookies.set(SESSION_COOKIE_NAME, secret, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      // optional: 30 days
      maxAge: 60 * 60 * 24 * 30,
    })

    return res
  } catch (err: any) {
    console.error('❌ ssr-login error:', err?.message || err)
    return NextResponse.json(
      { success: false, error: 'SSR session sync failed' },
      { status: 401 }
    )
  }
}
