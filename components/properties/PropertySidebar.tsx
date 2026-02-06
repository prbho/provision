/* eslint-disable @typescript-eslint/no-unused-vars */

'use client'

import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Property } from '@/types'
import {
  Calculator,
  Calendar,
  CreditCard,
  Loader2,
  TrendingDown,
  Users,
} from 'lucide-react'
import { toast } from 'sonner'

import MessageButton from '@/components/messages/MessageButton'
import MortgageCalculator from '@/components/MortgageCalculator'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ensurePvJwtCookie } from '@/lib/ssr-auth' // ✅ add this helper

import Portal from '../Portal'
import AgentDetails from './AgentDetails'
import ScheduleViewingModal, { ScheduleData } from './ScheduleViewingModal'

interface PropertySidebarProps {
  property: Property
  agentProfileId?: string
}

export default function PropertySidebar({
  property,
  agentProfileId,
}: PropertySidebarProps) {
  const [, setAgentData] = useState<{
    name?: string
    avatar?: string
    rating?: number
    reviewCount?: number
    agency?: string
  } | null>(null)

  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [showMortgageCalculator, setShowMortgageCalculator] = useState(false)
  const [isBuying, setIsBuying] = useState(false)

  const { user, isAuthenticated } = useAuth()

  // Prevent re-calculating on every render
  const isOwner = useMemo(() => {
    if (!user || !property.agentId) return false

    const checks = [
      property.agentId === user.$id,
      !!user.agentDocumentId && property.agentId === user.agentDocumentId,
      !!agentProfileId && property.agentId === agentProfileId,
    ]

    return checks.some(Boolean)
  }, [user, property.agentId, agentProfileId])

  const isShortLet = property.status === 'short-let'

  // ✅ show Buy Now only when it makes sense
  const canBuyNow =
    !isOwner &&
    property.status === 'for-sale' &&
    property.isActive === true &&
    // optional gating - keep only if these fields exist in your schema
    property.paymentOutright === true &&
    property.priceUnit === 'total'

  const handleScheduleViewing = async (scheduleData: ScheduleData) => {
    try {
      const response = await fetch('/api/properties/schedule-viewing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId: property.$id,
          propertyTitle: property.title,
          agentId: property.agentId,
          ...scheduleData,
        }),
      })

      const result = await response.json().catch(() => null)

      if (result?.success) {
        toast.success(
          isShortLet
            ? 'Booking request sent! The host will contact you soon.'
            : 'Viewing scheduled successfully! The agent will contact you soon.'
        )
        setShowScheduleModal(false)
      } else {
        toast.error(result?.error || 'Failed to schedule. Please try again.')
      }
    } catch {
      toast.error('An error occurred. Please try again.')
    }
  }

  const formatPrice = (price: number, unit: string) => {
    const formatter = new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    })

    const formattedPrice = formatter.format(price)

    switch (unit) {
      case 'daily':
        return `${formattedPrice}/night`
      case 'weekly':
        return `${formattedPrice}/week`
      case 'monthly':
        return `${formattedPrice}/mo`
      case 'yearly':
        return `${formattedPrice}/yr`
      default:
        return formattedPrice
    }
  }

  // ✅ Buy Now handler (sync pv_jwt first, then hit purchases API)
  const handleBuyNow = async () => {
    if (!user || !isAuthenticated) {
      toast.error('Please login to continue.')
      window.location.href = `/login?next=/properties/${property.$id}`
      return
    }

    if (property.status !== 'for-sale') {
      toast.error('This property is not available for purchase.')
      return
    }

    if (!property.isActive) {
      toast.error('This property is currently inactive.')
      return
    }

    setIsBuying(true)
    try {
      // 1) ensure server can read logged-in user (pv_jwt cookie)
      const synced = await ensurePvJwtCookie()
      if (!synced) {
        toast.error('Session sync failed. Please refresh and try again.')
        return
      }

      // 2) initialize Paystack
      const res = await fetch('/api/purchases/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ propertyId: property.$id }),
      })

      const json = await res.json().catch(() => null)

      if (!res.ok || !json?.success) {
        toast.error(json?.error || 'Unable to start payment.')
        return
      }

      if (!json.authorizationUrl) {
        toast.error('Payment gateway returned no authorization URL.')
        return
      }

      window.location.href = json.authorizationUrl
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Something went wrong.'
      toast.error(errorMessage)
    } finally {
      setIsBuying(false)
    }
  }

  useEffect(() => {
    async function fetchAgent() {
      if (!property.agentId) return

      try {
        const response = await fetch(`/api/agents/${property.agentId}`)
        if (!response.ok) throw new Error('Failed to fetch agent')

        const data = await response.json()
        setAgentData({
          name: data.name,
          avatar: data.avatar,
          rating: data.rating,
          reviewCount: data.reviewCount,
          agency: data.agency,
        })
      } catch (error) {
        console.error('Failed to fetch agent:', error)
      }
    }

    fetchAgent()
  }, [property.agentId])

  return (
    <>
      <div className="space-y-4 sm:space-y-6">
        <Card className="border-gray-200 shadow-sm py-0">
          <CardContent className="p-5 sm:p-6">
            {/* Price */}
            <div className="mb-6">
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                {formatPrice(property.price, property.priceUnit)}
              </div>

              {property.originalPrice &&
                property.originalPrice > property.price && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-base text-gray-500 line-through">
                      {formatPrice(property.originalPrice, property.priceUnit)}
                    </span>
                    <Badge className="bg-brand hover:bg-brand/90 text-white">
                      <TrendingDown className="h-3 w-3 mr-1" />
                      Save{' '}
                      {Math.round(
                        ((property.originalPrice - property.price) /
                          property.originalPrice) *
                          100
                      )}
                      %
                    </Badge>
                  </div>
                )}
            </div>

            {/* CTAs */}
            <div className="space-y-3 mb-6">
              {/* Buy Now */}
              {canBuyNow && (
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2">
                    Pay securely via Paystack
                  </p>

                  <Button
                    onClick={handleBuyNow}
                    disabled={isBuying || property.status === 'sold'}
                    className="w-full py-5 bg-linear-to-r cursor-pointer from-brand to-brand/95 hover:from-brand/95 hover:to-brand/75 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                    size="lg"
                  >
                    {isBuying ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Redirecting…
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-5 w-5 mr-2" />
                        Buy Now
                      </>
                    )}
                  </Button>

                  {/* <p className="mt-2 text-[11px] text-gray-500 leading-snug">
                    You’ll be redirected to Paystack to complete your payment.
                  </p> */}
                </div>
              )}

              {/* Mortgage Calculator */}
              {!isShortLet && (
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2">
                    Estimate your monthly payments
                  </p>
                  <Button
                    onClick={() => setShowMortgageCalculator(true)}
                    className="w-full hover:bg-brand hover:text-white py-5 bg-white text-brand border border-brand font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                    size="lg"
                  >
                    <Calculator className="h-5 w-5 mr-2" />
                    Calculate Mortgage
                  </Button>
                </div>
              )}

              {/* Message/Contact */}
              <div className="space-y-2">
                {!isOwner ? (
                  <MessageButton
                    property={property}
                    agentId={property.agentId}
                    agentName={property.agentName || 'Property Agent'}
                    propertyId={property.$id}
                    propertyTitle={property.title}
                    className="w-full py-5 bg-white text-brand text-sm border border-brand font-semibold shadow-md hover:bg-brand hover:text-white hover:shadow-lg transition-all duration-200"
                    variant="button"
                  />
                ) : (
                  <div className="space-y-2">
                    <div className="p-3 bg-brand border border-brand/20 rounded-lg">
                      <p className="text-sm text-brand font-medium text-center">
                        Your listing • View messages from interested{' '}
                        {isShortLet ? 'guests' : 'buyers'}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full py-5 border-brand/20 hover:bg-brand/10"
                      onClick={() => {
                        window.location.href = `/dashboard/agent/${user?.$id}/messages?propertyId=${property.$id}`
                      }}
                    >
                      <Users className="h-5 w-5 mr-2" />
                      View Messages
                    </Button>
                  </div>
                )}
              </div>

              {/* Schedule Viewing/Booking */}
              <Button
                variant={isShortLet ? 'default' : 'outline'}
                className={`w-full py-5 ${
                  isShortLet
                    ? 'bg-linear-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white'
                    : 'border-brand shadow-md text-brand font-semibold hover:bg-brand/10 cursor-pointer mt-1'
                }`}
                onClick={() => setShowScheduleModal(true)}
                disabled={isOwner}
                title={
                  isOwner
                    ? "You can't schedule a viewing for your own property"
                    : isShortLet
                      ? 'Book this property'
                      : 'Schedule a property viewing'
                }
              >
                <Calendar className="h-5 w-5 mr-2" />
                {isOwner
                  ? 'Manage Bookings'
                  : isShortLet
                    ? 'Book Now'
                    : 'Schedule Viewing'}
              </Button>
            </div>

            {/* Stats */}
            {/* <div className="border-t border-gray-100 pt-5 space-y-4"> */}
            {/* <div className="grid grid-cols-1 gap-4"> */}
            {/* <div className="text-center p-3 rounded-lg bg-gray-50">
                  <div className="flex items-center justify-center mb-1">
                    <Eye className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="text-sm font-semibold text-gray-900">
                    {property.views.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">Views</div>
                </div> */}

            {/* <div className="text-center p-3 rounded-lg bg-gray-50">
                  <div className="flex items-center justify-center mb-1">
                    <Heart className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="text-sm font-semibold text-gray-900">
                    {property.favorites}
                  </div>
                  <div className="text-xs text-gray-500">Favorites</div>
                </div> */}

            {/* <div className=" flextext-center p-3 rounded-lg bg-gray-50">
                  <div className="flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="text-xs text-gray-500">Listed</div>
                  <div className="text-sm font-semibold text-gray-900">
                    {new Date(property.listDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>
                </div> */}
            {/* </div> */}

            {/* Quick Info */}
            <div className="space-y-2 text-sm">
              {property.isVerified && (
                <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                  <span className="text-gray-600">Verification</span>
                  <Badge className="bg-brand/10 text-brand hover:bg-brand/20">
                    ✓ Verified
                  </Badge>
                </div>
              )}
              {/* </div> */}
            </div>
          </CardContent>
        </Card>

        <AgentDetails property={property} />
      </div>

      {/* Modals */}
      <Portal>
        <ScheduleViewingModal
          property={property}
          isOpen={showScheduleModal}
          onClose={() => setShowScheduleModal(false)}
          onSchedule={handleScheduleViewing}
        />

        {!isShortLet && (
          <MortgageCalculator
            property={property}
            isOpen={showMortgageCalculator}
            onClose={() => setShowMortgageCalculator(false)}
            userId={user?.$id}
          />
        )}
      </Portal>
    </>
  )
}
