// components/PremiumFeaturesSection.tsx - Updated
'use client'

import { useAuth } from '@/contexts/AuthContext' // Add this import
import { PlanType } from '@/types'
import { Check, Crown, Eye, Star, Zap } from 'lucide-react'

import CountdownTimer from '@/components/CountdownTimer'
import PremiumButton from '@/components/PremiumButton'
import { CardContent } from '@/components/ui/card'

import ExtendModalButton from './premium/ExtendModalButton'

interface PremiumFeaturesSectionProps {
  premiumStatus: {
    hasPremium: boolean
    activePlans: string[]
    startDate: string | null
    expiresAt: string | null
    currentPlan?: PlanType
  }
  onExtendPlan?: () => void
}

export default function PremiumFeaturesSection({
  premiumStatus,
  onExtendPlan,
}: PremiumFeaturesSectionProps) {
  const { user } = useAuth() // Add this to get the user

  const features = [
    {
      id: 1,
      title: 'Top Search Visibility',
      description: 'Properties appear first in search',
      icon: Eye,
    },
    {
      id: 2,
      title: 'Premium Badge',
      description: 'Verified badge for trust',
      icon: Star,
    },
    {
      id: 3,
      title: 'Priority Support',
      description: 'Fast, dedicated support',
      icon: Zap,
    },
  ]

  // Define propertyTitle for profile
  const propertyTitle = 'My Profile Premium'

  // Determine current plan
  const currentPlan: PlanType =
    premiumStatus.currentPlan ||
    (premiumStatus.activePlans.length > 0
      ? (premiumStatus.activePlans[0] as PlanType)
      : 'premium')

  // Create profile-specific property ID
  const profilePropertyId = user ? `profile-${user.$id}` : 'profile-upgrade'

  return (
    <div className="border rounded-lg">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-5 h-5 text-gold-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                Premium Features
              </h2>
            </div>
            <p className="text-gray-600">
              {premiumStatus.hasPremium
                ? 'Your premium benefits are active'
                : 'Unlock premium features'}
            </p>
          </div>

          {premiumStatus.hasPremium ? (
            <div className="flex items-center gap-2 bg-brand/5 text-brand px-3 py-1.5 rounded-full text-sm font-medium">
              <Check className="w-4 h-4" />
              Active
            </div>
          ) : (
            <PremiumButton
              propertyId={profilePropertyId}
              propertyTitle="Profile Premium Upgrade"
              currentPlan={null}
              size="sm"
            />
          )}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.id}
                className={`p-4 rounded-lg border ${
                  premiumStatus.hasPremium
                    ? 'border-emerald-100 bg-brand/5'
                    : 'border-brand/10 bg-brand/5'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`p-2 rounded ${
                      premiumStatus.hasPremium ? 'bg-brand/5' : 'bg-brand/10'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 ${
                        premiumStatus.hasPremium ? 'text-brand' : 'text-brand'
                      }`}
                    />
                  </div>
                  <h3 className="font-medium text-gray-900">{feature.title}</h3>
                </div>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            )
          })}
        </div>

        {/* Current Plan Status */}
        {premiumStatus.hasPremium ? (
          <div className="space-y-4">
            <div className="p-4 bg-brand/5 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Plan expires in</p>
                  <CountdownTimer
                    targetDate={premiumStatus.expiresAt || ''}
                    showLabels={true}
                  />
                </div>
                {/* Use the modal version here with proper profile ID */}
                <ExtendModalButton
                  propertyId={profilePropertyId}
                  propertyTitle={propertyTitle}
                  currentPlan={currentPlan}
                  onExtended={() => {
                    console.log(
                      'Button clicked, propertyId:',
                      profilePropertyId
                    )
                    console.log('Current plan:', currentPlan)
                    if (onExtendPlan) onExtendPlan()
                  }}
                  size="sm"
                />
              </div>

              <div className="text-sm text-gray-600">
                <span className="font-medium">Active plan:</span>{' '}
                {premiumStatus.activePlans.join(', ') ||
                  currentPlan ||
                  'Premium'}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-brand/5 rounded-lg">
            <p className="text-gray-700 mb-3">
              Upgrade to get priority placement, premium badge, and faster
              support.
            </p>
            <PremiumButton
              propertyId={profilePropertyId}
              propertyTitle="your profile and listing"
              currentPlan={null}
            />
          </div>
        )}
      </CardContent>
    </div>
  )
}
