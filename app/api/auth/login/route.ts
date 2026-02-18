/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from 'next/server'
import { Account, Client } from 'node-appwrite'

import {
  DATABASE_ID,
  databases,
  USERS_COLLECTION_ID,
} from '@/lib/appwrite-server'
import { enforceRateLimit, getRequestClientIp } from '@/lib/rate-limit'

function jsonError(message: string, status = 400, extra?: any) {
  return NextResponse.json(
    { success: false, error: message, ...extra },
    { status }
  )
}

export async function POST(request: NextRequest) {
  try {
    const ip = getRequestClientIp(request)
    const limit = enforceRateLimit({
      key: `auth:login:${ip}`,
      limit: 12,
      windowMs: 10 * 60 * 1000,
    })

    if (!limit.ok) {
      return NextResponse.json(
        { success: false, error: 'Too many login attempts. Try again later.' },
        {
          status: 429,
          headers: { 'Retry-After': String(limit.retryAfterSeconds) },
        }
      )
    }

    const { email, password } = await request.json()

    if (!email || !password) {
      return jsonError('Email and password are required', 400)
    }

    const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT
    const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID

    if (!endpoint || !projectId) {
      return jsonError('Missing Appwrite config (endpoint/projectId)', 500)
    }

    const userClient = new Client().setEndpoint(endpoint).setProject(projectId)
    const userAccount = new Account(userClient)

    let session: any
    try {
      session = await userAccount.createEmailPasswordSession(email, password)
    } catch (error: any) {
      console.error('Login failed:', error?.message)
      return jsonError('Invalid email or password', 401)
    }

    const authedClient = new Client()
      .setEndpoint(endpoint)
      .setProject(projectId)
      .setSession(session.secret)

    const authedAccount = new Account(authedClient)

    const jwtRes = await authedAccount.createJWT()
    const jwt = jwtRes?.jwt

    if (!jwt) {
      return jsonError('Failed to create JWT', 500)
    }

    const appwriteUser = await authedAccount.get()

    let userDoc: any
    try {
      userDoc = await databases.getDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        appwriteUser.$id
      )
    } catch {
      userDoc = await databases.createDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        appwriteUser.$id,
        {
          name: appwriteUser.name,
          email: appwriteUser.email,
          userType: 'buyer',
          emailVerified: false,
          isActive: true,
        } as any
      )
    }

    const userResponse = {
      id: userDoc.$id,
      name: userDoc.name,
      email: userDoc.email,
      phone: userDoc.phone || '',
      userType: userDoc.userType || 'buyer',
      emailVerified: userDoc.emailVerified || false,
      isActive: userDoc.isActive !== false,
      createdAt: userDoc.$createdAt,
      updatedAt: userDoc.$updatedAt,
    }

    const res = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: userResponse,
    })

    res.cookies.set('pv_jwt', jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })

    return res
  } catch (error: any) {
    console.error('Login error:', error?.message)
    return jsonError('Login failed. Please try again.', 500, {
      details: error?.message,
    })
  }
}
