// app/api/payments/verify/route.ts - UPDATED with fix
import { NextRequest, NextResponse } from 'next/server'

import { PaymentService } from '@/lib/services/payment-service'
import { PremiumListingService } from '@/lib/services/premium-service'
import { PropertyService } from '@/lib/services/property-service'

export async function POST(request: NextRequest) {
  console.log('🔍 PAYMENT VERIFY ENDPOINT STARTED')

  try {
    const body = await request.json()
    console.log('📦 VERIFY REQUEST BODY:', body)

    const { reference } = body

    if (!reference) {
      console.error('❌ Missing reference in verify request')
      return NextResponse.json(
        { error: 'Payment reference is required' },
        { status: 400 }
      )
    }

    // Verify payment with PayStack
    console.log('🔍 Verifying payment with PayStack, reference:', reference)
    const paymentVerification = await PaymentService.verifyPayment(reference)
    console.log('✅ PayStack verification complete:', {
      status: paymentVerification.status,
      reference: paymentVerification.reference,
    })

    if (paymentVerification.status !== 'success') {
      console.error('❌ Payment not successful:', paymentVerification.status)
      return NextResponse.json(
        {
          error: 'Payment failed or pending',
          status: paymentVerification.status,
        },
        { status: 400 }
      )
    }

    // Create payment record in AppWrite
    console.log('💾 Creating payment record in AppWrite...')
    const paymentRecord =
      await PaymentService.createPaymentRecord(paymentVerification)
    console.log('✅ Payment record created:', paymentRecord.$id)

    // Create or extend premium listing
    console.log('💎 Creating/Extending premium listing...')
    const { metadata } = paymentVerification
    console.log('📋 Metadata for premium listing:', metadata)

    // Determine if this is an extension (profile upgrade or property extension)
    // Note: metadata.isProfileUpgrade comes as string 'true', not boolean
    const isProfileUpgrade =
      metadata.isProfileUpgrade === true || metadata.isProfileUpgrade === 'true'

    const isExtension =
      isProfileUpgrade ||
      (metadata.propertyId && metadata.propertyId.startsWith('profile-')) ||
      metadata.extensionType === 'profile' ||
      metadata.extensionType === 'property'

    console.log('🔍 Extension detection:', {
      isExtension,
      isProfileUpgrade,
      propertyId: metadata.propertyId,
      extensionType: metadata.extensionType,
    })

    const premiumListing = await PremiumListingService.createPremiumListing({
      propertyId: metadata.propertyId,
      agentId: metadata.agentId,
      userId: metadata.userId,
      planType: metadata.planType,
      paymentId: paymentRecord.$id,
      isExtension: isExtension, // Pass the isExtension flag
    })
    console.log('✅ Premium listing created/extended:', premiumListing.$id)

    // ✅ Sync property with premium status
    console.log('🔄 Syncing property featured status...')
    try {
      await PropertyService.syncPropertyWithPremium(metadata.propertyId)
      console.log('✅ Property featured status synced successfully')
    } catch (syncError: any) {
      console.error('⚠️ Property sync error (non-critical):', {
        propertyId: metadata.propertyId,
        error: syncError.message,
        stack: syncError.stack,
      })
      // Continue - don't fail the entire process if sync fails
    }

    console.log('🎉 Payment verification completed successfully!')

    return NextResponse.json({
      success: true,
      message: isExtension
        ? 'Premium plan extended successfully!'
        : 'Premium listing activated successfully!',
      data: {
        paymentId: paymentRecord.$id,
        premiumListingId: premiumListing.$id,
        propertyId: metadata.propertyId,
        isExtension: isExtension,
      },
    })
  } catch (error: any) {
    console.error('❌ Payment verification error:', {
      message: error.message,
      code: error.code,
      stack: error.stack,
      name: error.name,
    })

    return NextResponse.json(
      {
        error: 'Failed to verify payment',
        details: error.message,
        code: error.code,
      },
      { status: 500 }
    )
  }
}
