// app/api/payments/initialize/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from 'next/server'
import { PlanType } from '@/types'

import { PaymentService } from '@/lib/services/plan-service'
import { PREMIUM_PLANS } from '@/lib/services/premium-service'

export async function POST(request: NextRequest) {
  console.log('🚀 PAYMENT INITIALIZE ENDPOINT CALLED')

  try {
    const body = await request.json()
    console.log('📦 Request body:', body)

    const { email, planType, propertyId, agentId, userId } = body

    // Validate required fields
    if (!email || !planType || !propertyId || !agentId || !userId) {
      console.error('❌ Missing required fields:', {
        email: !!email,
        planType: !!planType,
        propertyId: !!propertyId,
        agentId: !!agentId,
        userId: !!userId,
      })
      return NextResponse.json(
        {
          error: 'Missing required fields',
          details: { email, planType, propertyId, agentId, userId },
        },
        { status: 400 }
      )
    }

    // Validate plan type
    const validPlanType = planType as PlanType
    if (!PREMIUM_PLANS[validPlanType]) {
      console.error('❌ Invalid plan type:', planType)
      return NextResponse.json(
        {
          error: 'Invalid plan type',
          validTypes: Object.keys(PREMIUM_PLANS),
        },
        { status: 400 }
      )
    }

    console.log('✅ Validation passed, initializing payment...')

    // Initialize payment
    const paymentData = await PaymentService.initializePayment({
      email,
      planType: validPlanType,
      propertyId,
      agentId,
      userId,
    })

    console.log('✅ Payment initialized successfully:', {
      reference: paymentData.reference,
      hasAuthorizationUrl: !!paymentData.authorization_url,
      email,
    })

    return NextResponse.json({
      success: true,
      authorizationUrl: paymentData.authorization_url,
      reference: paymentData.reference,
    })
  } catch (error: any) {
    console.error('💥 Payment initialization error:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
    })
    return NextResponse.json(
      {
        error: 'Failed to initialize payment',
        details: error.message,
      },
      { status: 500 }
    )
  }
}
