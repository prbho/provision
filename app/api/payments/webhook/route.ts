/* eslint-disable @typescript-eslint/no-explicit-any */
import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'

import {
  DATABASE_ID,
  databases,
  ID,
  PAYMENT_COLLECTION_ID,
  PROPERTIES_COLLECTION_ID,
  Query,
} from '@/lib/appwrite-server'

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY!

function verifyPaystackSignature(rawBody: string, signature: string | null) {
  if (!PAYSTACK_SECRET_KEY || !signature) return false
  const hash = crypto
    .createHmac('sha512', PAYSTACK_SECRET_KEY)
    .update(rawBody)
    .digest('hex')
  return hash === signature
}

async function paymentExists(reference: string) {
  const result = await databases.listDocuments(
    DATABASE_ID,
    PAYMENT_COLLECTION_ID,
    [Query.equal('gatewayReference', reference)]
  )
  return result.total > 0 ? result.documents[0] : null
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text()
    const signature = req.headers.get('x-paystack-signature')

    if (!verifyPaystackSignature(rawBody, signature)) {
      return NextResponse.json(
        { success: false, error: 'Invalid signature' },
        { status: 401 }
      )
    }

    const event = JSON.parse(rawBody)

    if (event?.event !== 'charge.success') {
      return NextResponse.json({ success: true, ignored: true })
    }

    const data = event?.data
    const reference = data?.reference
    const status = data?.status
    const metadata = data?.metadata || {}

    if (!reference) {
      return NextResponse.json(
        { success: false, error: 'Missing reference' },
        { status: 400 }
      )
    }

    const existing = await paymentExists(reference)
    if (existing) {
      return NextResponse.json({ success: true, message: 'Already processed' })
    }

    if (status !== 'success') {
      return NextResponse.json(
        { success: false, error: 'Payment not successful' },
        { status: 400 }
      )
    }

    if (metadata.paymentType !== 'property_purchase') {
      return NextResponse.json({ success: true, ignored: true })
    }

    const propertyId = metadata.propertyId as string
    const buyerId = metadata.buyerId as string
    const agentId = metadata.agentId as string

    if (!propertyId || !buyerId) {
      return NextResponse.json(
        { success: false, error: 'Missing metadata fields', metadata },
        { status: 400 }
      )
    }

    const property: any = await databases.getDocument(
      DATABASE_ID,
      PROPERTIES_COLLECTION_ID,
      propertyId
    )

    await databases.createDocument(
      DATABASE_ID,
      PAYMENT_COLLECTION_ID,
      ID.unique(),
      {
        userId: buyerId,
        agentId: agentId || property.agentId,
        propertyId,
        amount: (Number(data.amount) || 0) / 100,
        currency: data.currency || 'NGN',
        status: 'completed',
        paymentMethod: data.channel || 'card',
        paymentGateway: 'paystack',
        gatewayReference: reference,
        planType: 'premium',
        duration: 0,
        customerEmail: data.customer?.email || metadata.buyerEmail,
        ipAddress: data.ip_address,
        fees: data.fees ? data.fees / 100 : 0,
        paidAt: data.paid_at || new Date().toISOString(),
        transactionDate: data.transaction_date,
        cardBrand: data.authorization?.brand,
        cardLast4: data.authorization?.last4,
        bank: data.authorization?.bank,
      }
    )

    if (property.status !== 'sold') {
      await databases.updateDocument(
        DATABASE_ID,
        PROPERTIES_COLLECTION_ID,
        propertyId,
        {
          status: 'sold',
          isActive: false,
          ownerId: buyerId,
          lastUpdated: new Date().toISOString(),
        }
      )
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Paystack webhook error:', err)
    return NextResponse.json(
      { success: false, error: 'Webhook error', details: err.message },
      { status: 500 }
    )
  }
}
