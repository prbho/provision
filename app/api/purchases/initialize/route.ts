// app/api/purchases/initialize/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from 'next/server'
import { Account, Client } from 'node-appwrite'

import {
  DATABASE_ID,
  databases,
  PROPERTIES_COLLECTION_ID,
} from '@/lib/appwrite-server'
import { enforceRateLimit, getRequestClientIp } from '@/lib/rate-limit'

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY
const PAYSTACK_BASE_URL = 'https://api.paystack.co'
const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || 'https://propertyvisionltd.com'

function jsonError(message: string, status = 400, extra?: any) {
  return NextResponse.json(
    { success: false, error: message, ...extra },
    { status }
  )
}

// ✅ Read pv_jwt safely in Route Handlers (App Router)
function getJwtFromRequest(req: NextRequest) {
  return req.cookies.get('pv_jwt')?.value || null
}

// ✅ Build an Appwrite Account client using JWT
async function getServerUserFromJwt(req: NextRequest) {
  const jwt = getJwtFromRequest(req)
  if (!jwt) return null

  const endpoint =
    process.env.APPWRITE_ENDPOINT || process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT
  const projectId =
    process.env.APPWRITE_PROJECT_ID ||
    process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID

  if (!endpoint || !projectId) return null

  const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setJWT(jwt)
  const account = new Account(client)

  try {
    return await account.get()
  } catch {
    return null
  }
}

/**
 * ✅ Robust price parser:
 * - supports number, "3000000", "3,000,000", "₦3,000,000"
 * - returns a clean number in Naira
 */
function parsePriceToNaira(price: any): number {
  if (typeof price === 'number') return price

  if (typeof price === 'string') {
    // Remove currency symbols, commas, spaces
    const cleaned = price.replace(/[₦,\s]/g, '').trim()
    const n = Number(cleaned)
    return n
  }

  return Number(price)
}

export async function POST(req: NextRequest) {
  try {
    const ip = getRequestClientIp(req)
    const limit = enforceRateLimit({
      key: `purchases:init:${ip}`,
      limit: 20,
      windowMs: 10 * 60 * 1000,
    })

    if (!limit.ok) {
      return NextResponse.json(
        {
          success: false,
          error: 'Too many purchase initialization requests. Try again later.',
        },
        {
          status: 429,
          headers: { 'Retry-After': String(limit.retryAfterSeconds) },
        }
      )
    }

    if (!PAYSTACK_SECRET_KEY) {
      return jsonError('Missing PAYSTACK_SECRET_KEY', 500)
    }

    // ✅ user comes ONLY from pv_jwt cookie (set by /api/auth/ssr-jwt)
    const sessionUser = await getServerUserFromJwt(req)
    if (!sessionUser) {
      return jsonError('Unauthorized', 401, { code: 'NO_SESSION' })
    }

    const body = await req.json().catch(() => null)
    const propertyId = String(body?.propertyId || '').trim()
    if (!propertyId) return jsonError('Missing propertyId', 400)

    // Load property
    const property: any = await databases.getDocument(
      DATABASE_ID,
      PROPERTIES_COLLECTION_ID,
      propertyId
    )

    if (!property) return jsonError('Property not found', 404)

    // block unavailable
    const status = String(property.status || '').toLowerCase()
    if (status === 'sold' || status === 'rented') {
      return jsonError('This property is no longer available.', 400, {
        status: property.status,
      })
    }

    /**
     * ✅ IMPORTANT FIX:
     * Some of your property docs probably don't store isActive at all.
     * Treat missing isActive as TRUE (active) unless explicitly false.
     */
    const isActive = property.isActive !== false
    if (!isActive) return jsonError('This property is not active.', 400)

    // ✅ Price in kobo (Paystack expects integer)
    const priceNaira = parsePriceToNaira(property.price)
    const amountKobo = Math.round(priceNaira * 100)

    if (!Number.isFinite(amountKobo) || amountKobo <= 0) {
      return jsonError('Invalid property price', 400, {
        price: property.price,
        parsed: priceNaira,
      })
    }

    // ✅ Safer agentId/ownerId handling (some properties might not have agentId)
    const agentId =
      property.agentId || property.ownerId || property.userId || null

    const callbackUrl = `${APP_URL}/payment/verify`

    // ✅ Ensure metadata is clean (avoid undefined)
    const metadata = {
      paymentType: 'property_purchase',
      propertyId,
      agentId,
      buyerId: sessionUser.$id,
      buyerEmail: sessionUser.email,
      propertyTitle: property.title || 'Property Purchase',
      propertyPrice: priceNaira, // store as number (naira)
      currency: 'NGN',
    }

    const paystackBody = {
      email: sessionUser.email,
      amount: amountKobo,
      callback_url: callbackUrl,
      metadata,
    }

    const res = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paystackBody),
    })

    const json = await res.json().catch(() => null)

    if (!res.ok || !json?.status || !json?.data) {
      return jsonError('Paystack initialization failed.', 400, {
        paystack: json || { status: res.status },
        debug: {
          propertyId,
          amountKobo,
          priceNaira,
          agentId,
          buyerId: sessionUser.$id,
        },
      })
    }

    return NextResponse.json({
      success: true,
      authorizationUrl: json.data.authorization_url,
      reference: json.data.reference,
    })
  } catch (err: any) {
    console.error('❌ purchases/initialize error:', err)
    return jsonError('Failed to initialize purchase', 500, {
      details: err?.message,
    })
  }
}
