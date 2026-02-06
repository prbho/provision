// lib/services/payment-service.ts
/* eslint-disable @typescript-eslint/no-explicit-any */

import { ID, Query } from 'appwrite'

import { databases } from '@/lib/appwrite-server'

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'propertyDB'

// IMPORTANT:
// - This must match your actual Appwrite collection IDs.
// - If your collection is named "payments", set NEXT_PUBLIC_APPWRITE_PAYMENT_TABLE_ID=payments
const PAYMENTS_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_PAYMENT_TABLE_ID || 'payment'

const PURCHASES_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_PURCHASES_TABLE_ID || 'purchases'

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY
const PAYSTACK_BASE_URL = 'https://api.paystack.co'

type AppwritePaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded'

function mapPaystackStatusToAppwriteStatus(
  paystackStatus: string
): AppwritePaymentStatus {
  const s = String(paystackStatus || '').toLowerCase()

  // Paystack commonly returns: success, failed, abandoned
  if (s === 'success') return 'completed'
  if (s === 'failed') return 'failed'
  if (s === 'refunded' || s === 'reversed') return 'refunded'

  // includes "abandoned", "pending", unknown values
  return 'pending'
}

export class PaymentService {
  // ✅ Paystack verify
  static async verifyPayment(reference: string) {
    if (!PAYSTACK_SECRET_KEY) throw new Error('Missing PAYSTACK_SECRET_KEY')

    const res = await fetch(
      `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }
    )

    const json = await res.json().catch(() => null)

    if (!res.ok || !json?.status || !json?.data) {
      throw new Error(json?.message || 'Paystack verification failed')
    }

    const data = json.data

    return {
      status: data.status, // paystack status (e.g. "success")
      reference: data.reference,
      amount: Number(data.amount) || 0, // kobo
      currency: data.currency || data.metadata?.currency || 'NGN',
      metadata: data.metadata || {},
      paidAt: data.paid_at || data.paidAt || new Date().toISOString(),
      raw: data,
    }
  }

  // ✅ prevent duplicates
  static async getPaymentByReference(reference: string) {
    const res = await databases.listDocuments(
      DATABASE_ID,
      PAYMENTS_COLLECTION_ID,
      [Query.equal('reference', reference), Query.limit(1)]
    )
    return res.total > 0 ? res.documents[0] : null
  }

  // ✅ supports premium + property_purchase (Option A: map status + store gatewayStatus)
  static async createPaymentRecord(verification: any) {
    const reference = String(verification?.reference || '').trim()
    if (!reference) throw new Error('Missing payment reference')

    const paystackStatus = String(verification?.status || '').trim()
    const appwriteStatus = mapPaystackStatusToAppwriteStatus(paystackStatus)

    const amount = Number(verification?.amount) || 0
    const currency =
      verification?.currency || verification?.metadata?.currency || 'NGN'
    const metadata = verification?.metadata || {}
    const paidAt = verification?.paidAt || new Date().toISOString()

    const existing = await this.getPaymentByReference(reference)
    if (existing) return existing

    const paymentType = metadata?.paymentType || 'premium'

    // Premium-only (may be absent for property purchases)
    const planType = metadata?.planType ?? null

    // If you used to rely on duration, keep it safe:
    // - allow metadata.duration
    // - allow metadata.planDuration (if you ever used that)
    // - otherwise null
    const duration =
      metadata?.duration ?? metadata?.planDuration ?? metadata?.months ?? null

    const doc = await databases.createDocument(
      DATABASE_ID,
      PAYMENTS_COLLECTION_ID,
      ID.unique(),
      {
        // Core
        reference,
        status: appwriteStatus, // ✅ must be one of: pending/completed/failed/refunded
        gatewayStatus: paystackStatus || null, // ✅ store raw paystack status (Option A)
        amount, // kobo
        currency,
        paymentType,

        // Premium fields
        planType,
        duration,

        // Shared fields
        propertyId: metadata?.propertyId ?? null,
        agentId: metadata?.agentId ?? null,

        // Premium user field (older flow)
        userId: metadata?.userId ?? null,

        // Purchase fields
        buyerId: metadata?.buyerId ?? null,
        buyerEmail: metadata?.buyerEmail ?? null,

        // Store full metadata safely
        metadata: JSON.stringify(metadata || {}),
        paidAt,
      }
    )

    return doc
  }

  // ✅ Paystack initialize
  static async initializePayment({
    email,
    amount,
    metadata,
  }: {
    email: string
    amount: number // kobo
    metadata: Record<string, any>
  }) {
    if (!PAYSTACK_SECRET_KEY) {
      throw new Error('Missing PAYSTACK_SECRET_KEY')
    }

    if (!email || !amount) {
      throw new Error('Email and amount are required')
    }

    const res = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount, // MUST be in kobo
        currency: metadata?.currency || 'NGN',
        metadata, // 👈 THIS is what powers everything later
      }),
    })

    const json = await res.json().catch(() => null)

    if (!res.ok || !json?.status || !json?.data) {
      throw new Error(json?.message || 'Paystack initialization failed')
    }

    return {
      authorization_url: json.data.authorization_url,
      reference: json.data.reference,
    }
  }

  // ✅ create purchases row (also map status to enum-safe values if purchases.status is enum)
  static async createPurchaseRecord({
    paymentRecordId,
    verification,
  }: {
    paymentRecordId: string
    verification: any
  }) {
    const m = verification?.metadata || {}
    const reference = String(verification?.reference || '').trim()
    if (!reference) throw new Error('Missing purchase reference')

    const existing = await databases.listDocuments(
      DATABASE_ID,
      PURCHASES_COLLECTION_ID,
      [Query.equal('reference', reference), Query.limit(1)]
    )
    if (existing.total > 0) return existing.documents[0]

    const paystackStatus = String(verification?.status || '').trim()
    const appwriteStatus = mapPaystackStatusToAppwriteStatus(paystackStatus)

    const doc = await databases.createDocument(
      DATABASE_ID,
      PURCHASES_COLLECTION_ID,
      ID.unique(),
      {
        reference,

        // If your purchases collection "status" is ALSO enum:
        status: appwriteStatus, // ✅ pending/completed/failed/refunded
        gatewayStatus: paystackStatus || null, // ✅ optional but recommended

        amount: Number(verification?.amount) || 0,
        currency: verification?.currency || m.currency || 'NGN',

        propertyId: m.propertyId ?? null,
        agentId: m.agentId ?? null,
        buyerId: m.buyerId ?? null,
        buyerEmail: m.buyerEmail ?? null,

        propertyTitle: m.propertyTitle ?? null,
        propertyPrice: m.propertyPrice ?? null,

        paymentId: paymentRecordId,
        metadata: JSON.stringify(m || {}),

        $createdAt: new Date().toISOString(),
      }
    )

    return doc
  }
}
