// app/api/payments/verify/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from 'next/server'
import { ID } from 'node-appwrite'

// ✅ Appwrite server DB
import {
  AGENTS_COLLECTION_ID,
  DATABASE_ID,
  databases,
  NOTIFICATIONS_COLLECTION_ID,
  USERS_COLLECTION_ID,
} from '@/lib/appwrite-server'
// ✅ Email + services
import { emailService } from '@/lib/services/email-service'
import { PaymentService } from '@/lib/services/payment-service'
import { PremiumListingService } from '@/lib/services/premium-service'
import { PropertyService } from '@/lib/services/property-service'

function jsonError(message: string, status = 400, extra?: any) {
  return NextResponse.json(
    { success: false, error: message, ...extra },
    { status }
  )
}

type NotificationType =
  | 'systemAlert'
  | 'propertyUpdate'
  | 'userMessage'
  | 'appointmentReminder'

async function createNotification(payload: {
  userId: string
  title: string
  message: string
  type: NotificationType
  link?: string | null
}) {
  return databases.createDocument(
    DATABASE_ID,
    NOTIFICATIONS_COLLECTION_ID,
    ID.unique(),
    {
      userId: payload.userId,
      title: payload.title,
      message: payload.message,
      type: payload.type,
      isRead: false,
      link: payload.link ?? null,
    }
  )
}

/**
 * ✅ Admin emails:
 * ADMIN_ALERT_EMAILS=admin1@x.com,admin2@x.com
 */
function getAdminAlertEmails() {
  const raw = process.env.ADMIN_ALERT_EMAILS || ''
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

/**
 * Try to get agent email so you can notify the listing owner by email.
 * This expects you have an "agents" collection doc with an "email" field.
 * If your schema differs, adjust AGENTS_COLLECTION_ID + fields here.
 */
async function getAgentEmail(agentId?: string | null) {
  if (!agentId) return null
  try {
    const agentDoc: any = await databases.getDocument(
      DATABASE_ID,
      AGENTS_COLLECTION_ID,
      agentId
    )
    const email = String(agentDoc?.email || '').trim()
    return email || null
  } catch (e) {
    console.log('⚠️ Could not load agent email:', (e as any)?.message)
    return null
  }
}

/**
 * Optional: If you store admin users in a "users" collection with userType="admin",
 * you can notify them in-app too.
 * If you don’t have this, the function safely returns [].
 */
async function getAdminUserIds(): Promise<string[]> {
  try {
    // NOTE: If your appwrite-server exports Query, use it.
    // If not, remove this and rely on email-only for admin.
    const { Query } = await import('node-appwrite')
    const res = await databases.listDocuments(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      [Query.equal('userType', 'admin'), Query.limit(50)]
    )
    return res.documents.map((d: any) => d.$id).filter(Boolean)
  } catch {
    return []
  }
}

export async function POST(request: NextRequest) {
  console.log('🔍 PAYMENT VERIFY ENDPOINT STARTED')

  try {
    const body = await request.json().catch(() => null)
    const reference = String(body?.reference || '').trim()

    if (!reference) return jsonError('Payment reference is required', 400)

    // 1) Verify payment with Paystack
    const paymentVerification = await PaymentService.verifyPayment(reference)

    console.log('✅ Paystack verification:', {
      status: paymentVerification.status,
      reference: paymentVerification.reference,
      paymentType: paymentVerification?.metadata?.paymentType,
    })

    if (paymentVerification.status !== 'success') {
      return jsonError('Payment failed or pending', 400, {
        status: paymentVerification.status,
      })
    }

    const paymentType = paymentVerification?.metadata?.paymentType || 'premium'

    // 2) Create payment record (works for BOTH premium + property purchase)
    const paymentRecord =
      await PaymentService.createPaymentRecord(paymentVerification)

    console.log('✅ Payment record created:', paymentRecord.$id)

    // =========================
    // ✅ PROPERTY PURCHASE FLOW
    // =========================
    if (paymentType === 'property_purchase') {
      const purchase = await PaymentService.createPurchaseRecord({
        paymentRecordId: paymentRecord.$id,
        verification: paymentVerification,
      })

      const m = paymentVerification?.metadata || {}

      const buyerId = String(m.buyerId || '').trim() || null
      const agentId = String(m.agentId || '').trim() || null
      const propertyId = String(m.propertyId || '').trim() || null
      const propertyTitle = String(m.propertyTitle || 'Property').trim()
      const buyerEmail = String(m.buyerEmail || '').trim() || null
      const currency = String(
        m.currency || paymentVerification.currency || 'NGN'
      )

      // Paystack amount is usually in kobo already in verify payload
      const amountKobo = Number(paymentVerification.amount) || 0
      const paidAtIso =
        String(paymentVerification.paidAt || '').trim() ||
        new Date().toISOString()

      console.log('🧾 Purchase verify payload normalized:', {
        buyerId,
        agentId,
        propertyId,
        buyerEmail,
        currency,
        amountKobo,
        paidAtIso,
      })

      const linkToPurchases =
        buyerId && propertyId ? `/dashboard/buyer/${buyerId}/purchases` : null

      // ✅ 1) In-app notification for buyer
      if (buyerId) {
        await createNotification({
          userId: buyerId,
          type: 'systemAlert',
          title: 'Purchase completed',
          message: `Your payment for "${propertyTitle}" was completed successfully. Ref: ${paymentVerification.reference}`,
          link: linkToPurchases,
        })
      }

      // ✅ 2) In-app notification for agent/owner
      if (agentId) {
        await createNotification({
          userId: agentId,
          type: 'systemAlert',
          title: 'New purchase completed',
          message: `A buyer completed payment for "${propertyTitle}". Ref: ${paymentVerification.reference}`,
          link: propertyId ? `/properties/${propertyId}` : null,
        })
      }

      // ✅ 3) Admin in-app notifications (optional) + admin emails
      const adminEmails = getAdminAlertEmails()
      const adminUserIds = await getAdminUserIds()

      if (adminUserIds.length) {
        await Promise.allSettled(
          adminUserIds.map((adminId) =>
            createNotification({
              userId: adminId,
              type: 'systemAlert',
              title: 'New purchase on platform',
              message: `Payment completed for "${propertyTitle}". Ref: ${paymentVerification.reference}`,
              link: propertyId ? `/admin/properties` : '/admin/dashboard',
            })
          )
        )
      }

      // ✅ 4) Buyer receipt email (REAL receipt, not test)
      // This requires you to have added sendPurchaseReceiptEmail + purchase template file as discussed.
      if (
        buyerEmail &&
        typeof (emailService as any).sendPurchaseReceiptEmail === 'function'
      ) {
        await (emailService as any)
          .sendPurchaseReceiptEmail({
            buyerName: String(m.buyerName || '').trim() || undefined,
            buyerEmail,
            reference: paymentVerification.reference,
            amountKobo,
            currency,
            propertyTitle,
            propertyId: propertyId || undefined,
            paidAtIso,
          })
          .catch((e: any) =>
            console.log(
              '⚠️ Buyer receipt email failed (non-critical):',
              e?.message
            )
          )
      } else {
        console.log(
          'ℹ️ Skipped buyer receipt email: missing buyerEmail OR sendPurchaseReceiptEmail not implemented'
        )
      }

      // ✅ 5) Agent/owner receipt email (if agent email exists)
      const agentEmail = await getAgentEmail(agentId)
      if (
        agentEmail &&
        typeof (emailService as any).sendPurchaseReceiptEmail === 'function'
      ) {
        await (emailService as any)
          .sendPurchaseReceiptEmail({
            buyerName: 'Agent/Owner',
            buyerEmail: agentEmail,
            reference: paymentVerification.reference,
            amountKobo,
            currency,
            propertyTitle,
            propertyId: propertyId || undefined,
            paidAtIso,
          })
          .catch((e: any) =>
            console.log(
              '⚠️ Agent receipt email failed (non-critical):',
              e?.message
            )
          )
      }

      // ✅ 6) Admin email alerts (optional)
      if (adminEmails.length) {
        await Promise.allSettled(
          adminEmails.map((to) => {
            if (
              typeof (emailService as any).sendPurchaseReceiptEmail ===
              'function'
            ) {
              return (emailService as any).sendPurchaseReceiptEmail({
                buyerName: 'Admin',
                buyerEmail: to,
                reference: paymentVerification.reference,
                amountKobo,
                currency,
                propertyTitle,
                propertyId: propertyId || undefined,
                paidAtIso,
              })
            }
            // fallback: do nothing (or you can wire a separate admin alert email method)
            return Promise.resolve()
          })
        )
      }

      return NextResponse.json({
        success: true,
        message: 'Purchase completed successfully!',
        data: {
          paymentId: paymentRecord.$id,
          purchaseId: purchase.$id,
          propertyId,
          reference: paymentVerification.reference,
        },
      })
    }

    // =========================
    // ✅ PREMIUM FLOW (unchanged)
    // =========================
    const { metadata } = paymentVerification

    const isProfileUpgrade =
      metadata.isProfileUpgrade === true || metadata.isProfileUpgrade === 'true'

    const isExtension =
      isProfileUpgrade ||
      (metadata.propertyId && metadata.propertyId.startsWith('profile-')) ||
      metadata.extensionType === 'profile' ||
      metadata.extensionType === 'property'

    const premiumListing = await PremiumListingService.createPremiumListing({
      propertyId: metadata.propertyId,
      agentId: metadata.agentId,
      userId: metadata.userId,
      planType: metadata.planType,
      paymentId: paymentRecord.$id,
      isExtension,
    })

    try {
      await PropertyService.syncPropertyWithPremium(metadata.propertyId)
    } catch (syncError: any) {
      console.error('⚠️ Property sync error (non-critical):', syncError.message)
    }

    return NextResponse.json({
      success: true,
      message: isExtension
        ? 'Premium plan extended successfully!'
        : 'Premium listing activated successfully!',
      data: {
        paymentId: paymentRecord.$id,
        premiumListingId: premiumListing.$id,
        propertyId: metadata.propertyId,
        isExtension,
      },
    })
  } catch (error: any) {
    console.error('❌ Payment verification error:', {
      message: error.message,
      stack: error.stack,
    })
    return jsonError('Failed to verify payment', 500, {
      details: error.message,
    })
  }
}
