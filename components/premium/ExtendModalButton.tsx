// components/premium/ExtendModalButton.tsx
'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { PlanType } from '@/types'
import { Check, Crown, Loader2, RefreshCw, Star, Zap } from 'lucide-react'
import { toast } from 'sonner'

import { PREMIUM_PLANS } from '@/lib/services/premium-service'

interface ExtendModalButtonProps {
  propertyId: string
  propertyTitle: string
  currentPlan: PlanType
  onExtended?: () => void
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'outline'
  className?: string
  children?: React.ReactNode
}

export default function ExtendModalButton({
  propertyId,
  propertyTitle,
  currentPlan,
  onExtended,
  size = 'md',
  variant = 'default',
  className = '',
  children = 'Extend Plan',
}: ExtendModalButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const { user } = useAuth()

  const handleExtend = async () => {
    if (!user) {
      toast.error('Please sign in to extend your plan')
      return
    }

    setIsProcessing(true)

    try {
      console.log('🔄 EXTEND PROFILE PLAN START:', {
        propertyId,
        propertyTitle,
        currentPlan,
        user: user.$id,
        isProfileUpgrade: true,
      })

      // Use profile-specific ID for user profile extensions
      const profilePropertyId = `profile-${user.$id}`

      const response = await fetch('/api/payments/extend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          planType: currentPlan,
          propertyId: profilePropertyId,
          propertyTitle: `Profile: ${propertyTitle}`,
          agentId: user.$id,
          userId: user.$id,
          isProfileUpgrade: true,
        }),
      })

      console.log('📥 Extend response status:', response.status)

      if (!response.ok) {
        const error = await response.json()
        console.error('❌ Extend error:', error)
        throw new Error(error.error || 'Failed to extend plan')
      }

      const result = await response.json()
      console.log('✅ Extend success:', result)

      // Show success message
      toast.success('Redirecting to payment page...')

      // Call the callback if provided
      if (onExtended) {
        onExtended()
      }

      // Close modal
      setIsOpen(false)

      // Redirect to payment page
      if (result.authorizationUrl) {
        window.location.href = result.authorizationUrl
      } else {
        throw new Error('No payment URL received')
      }
    } catch (error) {
      console.error('💥 Extend error:', error)
      toast.error(
        error instanceof Error ? error.message : 'Failed to extend plan'
      )
      setIsProcessing(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(price / 100)
  }

  // Get plan details
  const plan = PREMIUM_PLANS[currentPlan]

  // Size variants
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  // Variant styles
  const variantStyles = {
    default: 'bg-brand text-white hover:bg-brand/95 cursor-pointer',
    outline: 'border border-border text-brand hover:bg-brand/5',
  }

  // Get plan icon
  const getPlanIcon = () => {
    if (currentPlan === 'featured') {
      return <Zap className="w-6 h-6" />
    } else if (currentPlan === 'premium') {
      return <Star className="w-6 h-6" />
    } else {
      return <Crown className="w-6 h-6" />
    }
  }

  // Get plan icon color
  const getPlanIconColor = () => {
    if (currentPlan === 'featured') {
      return 'bg-blue-100 text-blue-600'
    } else if (currentPlan === 'premium') {
      return 'bg-brand/10 text-brand'
    } else {
      return 'bg-gold-50 text-gold-600'
    }
  }

  return (
    <>
      {/* Button to open modal */}
      <button
        onClick={() => setIsOpen(true)}
        disabled={isProcessing}
        className={`
          flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200
          ${sizeClasses[size]}
          ${variantStyles[variant]}
          ${className}
          disabled:opacity-50 disabled:cursor-not-allowed
          hover:scale-105 active:scale-95
        `}
      >
        <RefreshCw className="w-4 h-4" />
        <span>{children}</span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Header */}
            <div className="sticky top-0 bg-white p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Extend Your Plan
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Keep your premium profile benefits active
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
                  disabled={isProcessing}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Plan Details */}
            <div className="p-4">
              <div className="border rounded-lg p-6 bg-brand/5 border-brand/50">
                {/* Plan Header */}
                <div className="text-center mb-2">
                  <div className="flex justify-center mb-2">
                    <div className={`p-3 rounded-lg ${getPlanIconColor()}`}>
                      {getPlanIcon()}
                    </div>
                  </div>

                  <h3 className="font-bold text-gray-900 mb-2">{plan.name}</h3>

                  <div className="mb-4">
                    <span className="text-2xl font-bold text-gray-900">
                      {formatPrice(plan.price)}
                    </span>
                    <div className="text-gray-600 text-sm mt-1">
                      Extend for {plan.duration} additional days
                    </div>
                  </div>

                  <div className="inline-block px-3 py-1 bg-green-100 text-brand text-xs font-semibold rounded-full">
                    Current Plan
                  </div>
                </div>

                {/* Features */}
                <div className="mb-2">
                  <h4 className="font-medium text-sm text-gray-900 mb-3">
                    Benefits:
                  </h4>
                  <ul className="space-y-2">
                    {plan.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Extension Info */}
                <div className="mb-2 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                  <div className="flex items-start gap-2">
                    <div className="text-brand mt-0.5">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="text-sm text-brand">
                      <span className="font-medium">Note:</span> Your profile
                      premium benefits will continue seamlessly after payment.
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleExtend}
                    disabled={isProcessing}
                    className="w-full flex items-center justify-center gap-2 bg-brand text-white py-3 px-4 rounded-lg font-medium hover:bg-brand/95 cursor-pointer transition-colors disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4" />
                        Extend for {formatPrice(plan.price)}
                      </>
                    )}
                  </button>

                  {/* <button
                    onClick={() => setIsOpen(false)}
                    disabled={isProcessing}
                    className="w-full py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button> */}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t p-4">
              <div className="text-center text-sm text-gray-600">
                <p className="mb-2">All payments are secured with PayStack.</p>
                <p>
                  Questions?{' '}
                  <a
                    href="/support"
                    className="text-amber-600 hover:text-amber-700 font-medium"
                  >
                    Contact support
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
