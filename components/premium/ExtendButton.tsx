// components/premium/ExtendButton.tsx
'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { PlanType } from '@/types'
import { Loader2, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'

interface ExtendButtonProps {
  propertyId: string
  propertyTitle: string
  currentPlan: PlanType
  onExtended?: () => void
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'outline'
  className?: string
  children?: React.ReactNode
}

export default function ExtendButton({
  propertyId,
  propertyTitle,
  currentPlan,
  onExtended,
  size = 'md',
  variant = 'default',
  className = '',
  children = 'Extend Plan',
}: ExtendButtonProps) {
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
          propertyId: profilePropertyId, // Use profile-specific ID
          propertyTitle: `Profile: ${propertyTitle}`,
          agentId: user.$id,
          userId: user.$id,
          isProfileUpgrade: true, // Flag for backend
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
    } finally {
      setIsProcessing(false)
    }
  }

  // Size variants
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  // Variant styles
  const variantStyles = {
    default: 'bg-amber-500 text-white hover:bg-amber-600',
    outline: 'border border-amber-500 text-amber-500 hover:bg-amber-50',
  }

  return (
    <button
      onClick={handleExtend}
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
      {isProcessing ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <RefreshCw className="w-4 h-4" />
      )}
      <span>{children}</span>
    </button>
  )
}
