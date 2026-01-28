// components/ExtendPremiumButton.tsx
'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { PlanType } from '@/types'
import { Crown, Loader2, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'

interface ExtendPremiumButtonProps {
  propertyId: string
  propertyTitle: string
  currentPlan: PlanType
  onExtended?: (newExpiryDate: string) => void
}

export default function ExtendPremiumButton({
  propertyId,
  propertyTitle,
  currentPlan,
  onExtended,
}: ExtendPremiumButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const { user } = useAuth()

  const handleExtend = async () => {
    if (!user) {
      toast.error('Please sign in to extend your plan')
      return
    }

    setIsProcessing(true)
    try {
      console.log('🔄 Extending plan:', {
        propertyId,
        currentPlan,
        user: user.$id,
      })

      // Call extend API endpoint
      const response = await fetch('/api/payments/extend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          planType: currentPlan,
          propertyId,
          agentId: user.$id,
          userId: user.$id,
        }),
      })

      const result = await response.json()
      console.log('📥 Extend response:', result)

      if (!response.ok) {
        throw new Error(result.error || 'Failed to extend plan')
      }

      toast.success('Plan extended successfully!')

      // Callback with new expiry date if provided
      if (result.newExpiryDate && onExtended) {
        onExtended(result.newExpiryDate)
      }

      // If there's a payment URL (for renewal payment), redirect
      if (result.authorizationUrl) {
        window.location.href = result.authorizationUrl
      }
    } catch (error) {
      console.error('Extend error:', error)
      toast.error(
        error instanceof Error ? error.message : 'Failed to extend plan'
      )
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <button
      onClick={handleExtend}
      disabled={isProcessing}
      className="flex items-center gap-2 bg-brand text-white px-4 py-2 rounded-lg font-medium hover:bg-brand/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isProcessing ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <RefreshCw className="w-4 h-4" />
      )}
      <span>Extend Plan</span>
    </button>
  )
}
