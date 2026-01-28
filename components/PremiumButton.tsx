'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { PlanType } from '@/types'
import { Check, Crown, Loader2, Sparkles, Star, Zap } from 'lucide-react'
import { toast } from 'sonner'

import { PREMIUM_PLANS } from '@/lib/services/premium-service'

interface PremiumButtonProps {
  propertyId: string
  propertyTitle: string
  currentPlan?: PlanType | null
  isExtension?: boolean
  onUpgrade?: (planType: PlanType) => void
  onExtended?: (newExpiryDate: string) => void
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'gradient'
  className?: string
  children?: React.ReactNode
}

export default function PremiumButton({
  propertyId,
  propertyTitle,
  currentPlan,
  onUpgrade,
  isExtension = false,
  size = 'md',
  variant = 'default',
  className = '',
  children,
}: PremiumButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const { user } = useAuth()

  const handleUpgrade = async (planType: PlanType) => {
    if (!user) {
      toast.error('Please sign in to upgrade')
      return
    }

    setIsProcessing(true)
    try {
      const response = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          planType,
          propertyId,
          agentId: user.$id,
          userId: user.$id,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Payment failed')
      }

      const { authorizationUrl } = await response.json()
      window.location.href = authorizationUrl
    } catch (error) {
      console.error('Upgrade error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to upgrade')
    } finally {
      setIsProcessing(false)
      setIsOpen(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(price / 100)
  }

  // Size variants
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  // Variant styles
  const variantStyles = {
    default: currentPlan
      ? 'bg-gold-600 text-white hover:cursor-pointer'
      : 'bg-gold-600 text-white hover:bg-gold-600',
    gradient: currentPlan
      ? 'bg-gradient-to-r from-brand/95 to-brand text-white'
      : 'bg-gradient-to-r from-brand to-brand text-white hover:from-brand hover:from-brand',
  }

  return (
    <>
      {/* Simple Premium Button */}
      <button
        onClick={() => setIsOpen(true)}
        disabled={isProcessing}
        className={`
          flex items-center cursor-pointer gap-2 rounded-lg font-medium transition-colors
          ${sizeClasses[size]}
          ${variantStyles[variant]}
          ${className}
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
      >
        {isProcessing ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : currentPlan ? (
          <>
            <Crown className="w-4 h-4" />
            <span>Premium Active</span>
          </>
        ) : (
          <>
            <Crown className="w-4 h-4" />
            <span>{children || 'Go Premium'}</span>
          </>
        )}
      </button>

      {/* Simple Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Upgrade Your Listing
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Make{' '}
                    <span className="font-medium">
                      &quot;{propertyTitle}&quot;
                    </span>{' '}
                    stand out
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Plans */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(PREMIUM_PLANS).map(([planKey, plan]) => {
                  const planType = planKey as PlanType
                  const isCurrentPlan = currentPlan === planType
                  const isPopular = planType === 'premium'

                  return (
                    <div
                      key={planKey}
                      className={`
                        border rounded-lg p-4 cursor-pointer transition-colors flex flex-col
                        ${selectedPlan === planType ? 'border-brand bg-brand/5' : 'border-gray-200 hover:border-gray-300'}
                        ${isCurrentPlan ? 'bg-brand/5 border-brand/30' : ''}
                        ${isPopular ? 'border-brand/30' : ''}
                      `}
                      onClick={() =>
                        !isCurrentPlan && setSelectedPlan(planType)
                      }
                    >
                      <div>
                        {/* Plan Header */}
                        <div className="text-center mb-4">
                          <div className="flex justify-center mb-3">
                            <div
                              className={`p-2 rounded ${
                                planType === 'featured'
                                  ? 'bg-blue-100 text-blue-600'
                                  : planType === 'premium'
                                    ? 'bg-brand/10 text-brand'
                                    : 'bg-gold-50 text-gold-600'
                              }`}
                            >
                              {planType === 'featured' && (
                                <Zap className="w-5 h-5" />
                              )}
                              {planType === 'premium' && (
                                <Star className="w-5 h-5" />
                              )}
                              {planType === 'enterprise' && (
                                <Crown className="w-5 h-5" />
                              )}
                            </div>
                          </div>

                          <h3 className="font-semibold text-gray-900 mb-1">
                            {plan.name}
                          </h3>

                          <div className="mb-2 flex flex-col">
                            <span className="text-2xl font-bold text-gray-900">
                              {formatPrice(plan.price)}
                            </span>
                            <span className="text-gray-600 ml-1">
                              {plan.duration} days
                            </span>
                          </div>

                          {isPopular && !isCurrentPlan && (
                            <span className="text-xs text-brand font-medium">
                              Most Popular
                            </span>
                          )}
                        </div>

                        {/* Features */}
                        <ul className="space-y-2 mb-4">
                          {plan.features.slice(0, 3).map((feature, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <Check className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                              <span className="text-sm text-gray-700">
                                {feature}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      {/* Action Button */}
                      {isCurrentPlan ? (
                        <div className="text-center p-2 bg-brand/10 rounded">
                          <div className="flex items-center justify-center gap-1 text-brand text-sm font-medium">
                            <Check className="w-4 h-4" />
                            Active
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleUpgrade(planType)
                          }}
                          disabled={isProcessing}
                          className={`
                            w-full py-2 mt-auto px-4 rounded font-medium text-sm transition-colors
                            ${
                              selectedPlan === planType || isPopular
                                ? 'bg-brand text-white hover:bg-brand'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }
                            disabled:opacity-50
                          `}
                        >
                          {isProcessing ? 'Processing...' : 'Select'}
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Selected Plan Action */}
              {selectedPlan && !currentPlan && (
                <div className="mt-6 p-4 bg-brand/5 border border-brand/20 rounded-lg">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Selected: {PREMIUM_PLANS[selectedPlan].name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Get more visibility for your listing
                      </p>
                    </div>
                    <button
                      onClick={() => handleUpgrade(selectedPlan)}
                      disabled={isProcessing}
                      className="bg-brand text-white px-6 py-2 rounded font-medium hover:bg-brand transition-colors disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Processing...
                        </div>
                      ) : (
                        `Upgrade for ${formatPrice(PREMIUM_PLANS[selectedPlan].price)}`
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
