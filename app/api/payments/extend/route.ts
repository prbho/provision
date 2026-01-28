// app/api/payments/extend/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { PlanType } from '@/types'

import { PaymentService } from '@/lib/services/payment-service'
import { PREMIUM_PLANS } from '@/lib/services/premium-service'

export async function POST(request: NextRequest) {
  console.log('🔄 EXTEND PLAN ENDPOINT CALLED')

  try {
    const body = await request.json()
    console.log('📦 Extend request body:', body)

    const { email, planType, propertyId, agentId, userId, isProfileUpgrade } =
      body

    // Validate required fields
    if (!email || !planType || !propertyId || !agentId || !userId) {
      console.error('❌ Missing required fields for extension')
      return NextResponse.json(
        {
          error: 'Missing required fields',
        },
        { status: 400 }
      )
    }

    // Validate plan type
    const validPlanType = planType as PlanType
    if (!PREMIUM_PLANS[validPlanType]) {
      console.error('❌ Invalid plan type for extension:', planType)
      return NextResponse.json(
        {
          error: 'Invalid plan type',
        },
        { status: 400 }
      )
    }

    console.log('✅ Extension validation passed:', {
      isProfileUpgrade,
      planType: validPlanType,
      propertyId,
    })

    // Initialize payment for extension with metadata
    const paymentData = await PaymentService.initializePayment({
      email,
      planType: validPlanType,
      propertyId,
      agentId,
      userId,
      metadata: {
        ...body,
        isProfileUpgrade: isProfileUpgrade || false,
        extensionType: isProfileUpgrade ? 'profile' : 'property',
      },
    })

    console.log('✅ Extension payment initialized:', {
      reference: paymentData.reference,
      email,
      isProfileUpgrade,
    })

    return NextResponse.json({
      success: true,
      authorizationUrl: paymentData.authorization_url,
      reference: paymentData.reference,
      message: 'Proceed to payment to extend your plan',
    })
  } catch (error: any) {
    console.error('💥 Extend plan error:', error.message)
    return NextResponse.json(
      {
        error: 'Failed to extend plan',
        details: error.message,
      },
      { status: 500 }
    )
  }
}
