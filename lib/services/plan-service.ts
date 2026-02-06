// lib/payment-service.ts
/* eslint-disable @typescript-eslint/no-explicit-any */

import { PaymentRecord, PlanType } from '@/types'
import { ID, Models, Query } from 'appwrite'

import {
  DATABASE_ID,
  databases,
  PAYMENT_COLLECTION_ID,
} from '../appwrite-server'
import { PREMIUM_PLANS } from './premium-service'

export class PaymentService {
  private static paystackSecretKey = process.env.PAYSTACK_SECRET_KEY!
  private static baseUrl = 'https://api.paystack.co'

  // Initialize payment with PayStack

  static async initializePayment(data: {
    email: string
    planType: PlanType
    propertyId: string
    agentId: string
    userId: string
    metadata?: any
  }) {
    console.log('💳 INITIALIZE PAYMENT CALLED:', {
      email: data.email,
      planType: data.planType,
      propertyId: data.propertyId,
      agentId: data.agentId,
      userId: data.userId,
      metadata: data.metadata,
    })

    const plan = PREMIUM_PLANS[data.planType]
    console.log('📊 Plan details:', plan)

    // Check if PayStack key is available
    if (!this.paystackSecretKey) {
      console.error('❌ PayStack secret key is not set!')
      throw new Error('PayStack configuration error')
    }

    // Prepare callback URL
    const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/payment/verify`
    console.log('🔗 Callback URL:', callbackUrl)

    // Prepare metadata with extension info if provided
    const requestMetadata = {
      userId: data.userId,
      agentId: data.agentId,
      propertyId: data.propertyId,
      planType: data.planType,
      ...(data.metadata || {}),
    }

    console.log('📋 Request metadata:', requestMetadata)

    const requestBody = {
      email: data.email,
      amount: plan.price, // PayStack expects amount in kobo
      metadata: requestMetadata,
      callback_url: callbackUrl,
    }

    console.log('📤 Sending request to PayStack:', {
      url: `${this.baseUrl}/transaction/initialize`,
      amount: plan.price,
      amountInNaira: plan.price / 100,
    })

    try {
      const response = await fetch(`${this.baseUrl}/transaction/initialize`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.paystackSecretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      console.log('📥 PayStack response status:', response.status)
      console.log(
        '📥 PayStack response headers:',
        Object.fromEntries(response.headers.entries())
      )

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ PayStack initialize error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
        })
        throw new Error(`Payment initialization failed: ${errorText}`)
      }

      const result = await response.json()
      console.log('✅ PayStack initialize result:', {
        status: result.status,
        message: result.message,
        hasData: !!result.data,
        reference: result.data?.reference,
        authorization_url: result.data?.authorization_url,
      })

      if (!result.status || !result.data) {
        console.error('❌ PayStack returned invalid response:', result)
        throw new Error('Invalid response from payment gateway')
      }

      return result.data
    } catch (error: any) {
      console.error('💥 Initialize payment error:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
      })
      throw error
    }
  }

  // Verify PayStack payment
  static async verifyPayment(reference: string) {
    console.log('🔍 VERIFY PAYMENT START:', reference)

    try {
      const response = await fetch(
        `${this.baseUrl}/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${this.paystackSecretKey}`,
          },
        }
      )

      console.log('📤 PayStack verify response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ PayStack verify error:', errorText)
        throw new Error(`Failed to verify payment: ${errorText}`)
      }

      const result = await response.json()
      console.log('✅ PayStack verify result:', {
        status: result.data.status,
        amount: result.data.amount,
        metadata: result.data.metadata,
      })

      return result.data
    } catch (error: any) {
      console.error('💥 Verify payment error:', error)
      throw error
    }
  }

  // Create payment record in database
  static async createPaymentRecord(paymentData: any): Promise<PaymentRecord> {
    console.log('💾 CREATE PAYMENT RECORD START:', {
      reference: paymentData.reference,
      status: paymentData.status,
      metadata: paymentData.metadata,
    })

    try {
      // Check if payment already exists
      const existingPayment = await this.getPaymentByReference(
        paymentData.reference
      )
      if (existingPayment) {
        console.log('⚠️ Payment already exists:', existingPayment.$id)
        return existingPayment
      }

      const plan = PREMIUM_PLANS[paymentData.metadata.planType as PlanType]
      console.log('📊 Plan for payment:', plan)

      // Prepare document data
      const documentData = {
        // Core identifiers
        userId: paymentData.metadata.userId,
        agentId: paymentData.metadata.agentId,
        propertyId: paymentData.metadata.propertyId,

        // Payment details
        amount: paymentData.amount / 100, // Convert from kobo to Naira
        currency: 'NGN',
        status: paymentData.status === 'success' ? 'completed' : 'failed',
        paymentMethod: paymentData.channel || 'card',
        paymentGateway: 'paystack',
        gatewayReference: paymentData.reference,

        // Plan information
        planType: paymentData.metadata.planType,
        duration: plan.duration,

        // Additional useful fields
        customerEmail: paymentData.customer?.email,
        ipAddress: paymentData.ip_address,
        fees: paymentData.fees ? paymentData.fees / 100 : 0, // Convert from kobo to Naira
        paidAt: paymentData.paid_at || new Date().toISOString(),
        transactionDate: paymentData.transaction_date,

        // Card details (if available)
        cardBrand: paymentData.authorization?.brand,
        cardLast4: paymentData.authorization?.last4,
        bank: paymentData.authorization?.bank,
      }

      console.log('📝 Creating payment document with data:', documentData)

      const paymentDoc = await databases.createDocument(
        DATABASE_ID,
        PAYMENT_COLLECTION_ID,
        ID.unique(),
        documentData
      )

      console.log('✅ Payment record created:', {
        id: paymentDoc.$id,
        reference: (paymentDoc as any).gatewayReference,
        status: (paymentDoc as any).status,
      })

      return this.mapToPaymentRecord(paymentDoc)
    } catch (error: any) {
      console.error('❌ Create payment record error:', {
        message: error.message,
        code: error.code,
        type: error.type,
        data: error.data,
      })
      throw error
    }
  }

  // Get payment by reference
  static async getPaymentByReference(
    reference: string
  ): Promise<PaymentRecord | null> {
    console.log('🔍 GET PAYMENT BY REFERENCE:', reference)

    try {
      const result = await databases.listDocuments(
        DATABASE_ID,
        PAYMENT_COLLECTION_ID,
        [Query.equal('gatewayReference', reference)]
      )

      console.log('🔍 Payment search result:', {
        found: result.documents.length,
        references: result.documents.map((d) => (d as any).gatewayReference),
      })

      if (result.documents.length === 0) {
        console.log('📭 No payment found with reference:', reference)
        return null
      }

      const payment = this.mapToPaymentRecord(result.documents[0])
      console.log('✅ Payment found:', payment.$id)
      return payment
    } catch (error: any) {
      console.error('❌ Get payment by reference error:', {
        message: error.message,
        code: error.code,
      })
      return null
    }
  }

  // Helper method to map AppWrite document to PaymentRecord
  private static mapToPaymentRecord(doc: Models.Document): PaymentRecord {
    const typedDoc = doc as any

    console.log('🗺️ Mapping document to PaymentRecord:', {
      id: doc.$id,
      hasUserId: !!typedDoc.userId,
      hasMetadata: !!typedDoc.metadata, // This shouldn't exist
    })

    const paymentRecord = {
      $id: doc.$id,
      $createdAt: doc.$createdAt,
      $updatedAt: doc.$updatedAt,
      userId: typedDoc.userId,
      agentId: typedDoc.agentId,
      propertyId: typedDoc.propertyId,
      amount: typedDoc.amount,
      currency: typedDoc.currency,
      status: typedDoc.status,
      paymentMethod: typedDoc.paymentMethod,
      paymentGateway: typedDoc.paymentGateway,
      gatewayReference: typedDoc.gatewayReference,
      planType: typedDoc.planType,
      duration: typedDoc.duration,

      // Additional fields
      customerEmail: typedDoc.customerEmail,
      ipAddress: typedDoc.ipAddress,
      fees: typedDoc.fees,
      paidAt: typedDoc.paidAt,
      transactionDate: typedDoc.transactionDate,
      cardBrand: typedDoc.cardBrand,
      cardLast4: typedDoc.cardLast4,
      bank: typedDoc.bank,
    }

    console.log('✅ Mapped PaymentRecord:', {
      id: paymentRecord.$id,
      status: paymentRecord.status,
      amount: paymentRecord.amount,
    })

    return paymentRecord
  }
}
