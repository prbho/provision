'use client'

import React, { useCallback, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { Property } from '@/types'
import {
  BathIcon,
  BedIcon,
  CalculatorIcon,
  Edit,
  Heart,
  Ruler,
  Trees,
} from 'lucide-react'

import { useFavorites } from '@/hooks/useFavorites'

import MortgageCalculator from './MortgageCalculator'
import Portal from './Portal'

interface PropertyCardProps {
  property: Property
  userId: string
  featured?: boolean
  priority?: boolean // for lazy loading images
  className?: string
  agentProfileId?: string
}

// Helper function to get status badge info
const getStatusInfo = (status: string) => {
  switch (status) {
    case 'for-sale':
      return {
        label: 'For Sale',
        bg: 'bg-red-600',
        color: 'text-white',
      }
    case 'for-rent':
      return {
        label: 'For Rent',
        bg: 'bg-emerald-600',
        color: 'text-white',
      }
    case 'short-let':
      return {
        label: 'Short-Let',
        bg: 'bg-purple-600',
        color: 'text-white',
      }
    case 'sold':
      return {
        label: 'Sold',
        bg: 'bg-gray-600',
        color: 'text-white',
      }
    case 'rented':
      return {
        label: 'Rented',
        bg: 'bg-blue-600',
        color: 'text-white',
      }
    default:
      return {
        label: 'Available',
        bg: 'bg-gray-600',
        color: 'text-white',
      }
  }
}

// Helper function to get price unit label
const getPriceUnitLabel = (unit: string) => {
  switch (unit) {
    case 'daily':
      return '/night'
    case 'weekly':
      return '/week'
    case 'monthly':
      return '/month'
    case 'yearly':
      return '/year'
    default:
      return ''
  }
}

// Check if property is land
const isLandType = (propertyType: string): boolean => {
  const landTypes = [
    'land',
    'plot',
    'agricultural land',
    'vacant land',
    'acreage',
  ]
  return landTypes.some((type) =>
    propertyType?.toLowerCase().includes(type.toLowerCase())
  )
}

function PropertyCard({ property, priority = false }: PropertyCardProps) {
  const [showMortgageCalc, setShowMortgageCalc] = useState(false)
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false)
  const { isFavorited, toggleFavorite } = useFavorites()
  const { user, isAuthenticated } = useAuth()

  // Determine if property is land
  const isLand = isLandType(property.propertyType)

  // Memoized price formatter
  const formatPrice = useCallback((price: number, unit: string) => {
    const formatter = new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    })
    const formatted = formatter.format(price)
    const unitLabel = getPriceUnitLabel(unit)
    return `${formatted}${unitLabel}`
  }, [])

  const mainImage = property.images?.[0] || '/placeholder-property.jpg'
  const statusInfo = getStatusInfo(property.status)

  // Handlers
  const handleMortgageClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShowMortgageCalc(true)
  }, [])

  const handleFavoriteClick = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (!isAuthenticated || !user) return
      setIsFavoriteLoading(true)
      try {
        await toggleFavorite(property)
      } catch (error) {
        console.error('Error toggling favorite:', error)
      } finally {
        setIsFavoriteLoading(false)
      }
    },
    [isAuthenticated, user, property, toggleFavorite]
  )

  const isOwner = user && property.agentId === user.$id
  const isFavoritedByUser = isFavorited(property)

  return (
    <div className="relative">
      {/* EDIT BUTTON */}
      {isOwner && (
        <Link
          href={`/dashboard/${user?.userType}/${user?.$id}/properties/edit/${property.$id}`}
          className="absolute top-3 left-3 z-20 bg-white text-gray-700 hover:text-emerald-700 p-1.5 rounded-lg shadow-md transition-colors duration-200 hover:shadow-lg"
        >
          <Edit className="w-4 h-4" />
        </Link>
      )}

      {/* FAVORITE BUTTON */}
      {isAuthenticated && user && (
        <button
          onClick={handleFavoriteClick}
          disabled={isFavoriteLoading}
          className={`absolute top-3 right-3 z-20 bg-white p-1.5 rounded-lg shadow-md transition-all duration-200 ${
            isFavoritedByUser
              ? 'text-red-500'
              : 'text-gray-400 hover:text-red-500'
          } disabled:opacity-50`}
          title={
            isFavoritedByUser ? 'Remove from favorites' : 'Add to favorites'
          }
        >
          {isFavoriteLoading ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <Heart
              className={`w-4 h-4 ${isFavoritedByUser ? 'fill-current' : ''}`}
            />
          )}
        </button>
      )}

      <Link href={`/properties/${property.$id}`} className="block">
        <div className="bg-white rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-300 border border-stone-200">
          {/* IMAGE */}
          <div className="relative h-48 w-full bg-gray-100">
            <Image
              src={mainImage}
              alt={property.title}
              fill
              className="object-cover"
              priority={priority}
              loading={priority ? 'eager' : 'lazy'}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* STATUS BADGE */}
            <span
              className={`absolute bottom-3 left-3 px-2 py-1 rounded text-xs font-medium ${statusInfo.bg} ${statusInfo.color}`}
            >
              {statusInfo.label}
            </span>
          </div>

          {/* CONTENT */}
          <div className="p-4">
            {/* TITLE */}
            <h3 className="font-semibold text-stone-900 line-clamp-2">
              {property.title}
            </h3>

            {/* LOCATION */}
            <p className="text-gray-600 text-sm mb-3 line-clamp-1">
              {property.address}, {property.city}
            </p>

            {/* PRICE */}
            <div className="mb-4">
              <span className="text-lg font-bold text-stone-900">
                {formatPrice(property.price, property.priceUnit)}
              </span>
            </div>

            {/* META INFO - Conditional based on property type */}
            <div className="flex items-center justify-between text-sm text-gray-700 mb-4">
              <div className="flex items-center gap-3">
                {isLand ? (
                  // Land-specific attributes
                  <>
                    <div className="flex items-center gap-1">
                      <Trees className="w-4 h-4 text-emerald-600" />
                      <span>Land</span>
                    </div>
                    {property.squareFeet && (
                      <div className="flex items-center gap-1">
                        <Ruler className="w-4 h-4 text-gray-500" />
                        <span>{property.squareFeet.toLocaleString()} m²</span>
                      </div>
                    )}
                  </>
                ) : (
                  // Building-specific attributes
                  <>
                    {property.bedrooms > 0 && (
                      <div className="flex items-center gap-1">
                        <BedIcon className="w-4 h-4 text-gray-500" />
                        <span>{property.bedrooms}</span>
                      </div>
                    )}
                    {property.bathrooms > 0 && (
                      <div className="flex items-center gap-1">
                        <BathIcon className="w-4 h-4 text-gray-500" />
                        <span>{property.bathrooms}</span>
                      </div>
                    )}
                    {property.squareFeet && (
                      <div className="flex items-center gap-1">
                        <Ruler className="w-4 h-4 text-gray-500" />
                        <span>{property.squareFeet.toLocaleString()} m²</span>
                      </div>
                    )}
                  </>
                )}
              </div>

              {property.mortgageEligible && !isLand && (
                <button
                  onClick={handleMortgageClick}
                  className="text-gray-500 hover:text-emerald-600 transition-colors"
                  title="Calculate mortgage"
                >
                  <CalculatorIcon className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* PAYMENT OPTIONS */}
            {/* {(property.outright ||
              property.paymentPlan ||
              property.mortgageEligible) && (
              <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
                {property.outright && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    Outright
                  </span>
                )}
                {property.paymentPlan && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    Payment Plan
                  </span>
                )}
                {property.mortgageEligible && !isLand && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    Mortgage
                  </span>
                )}
                {isLand && (
                  <span className="px-2 py-1 bg-brand/10 text-emerald-700 text-xs rounded">
                    Land
                  </span>
                )}
              </div>
            )} */}
          </div>
        </div>
      </Link>

      {/* MORTGAGE CALCULATOR MODAL */}
      {showMortgageCalc && (
        <Portal>
          <MortgageCalculator
            property={property}
            isOpen={showMortgageCalc}
            onClose={() => setShowMortgageCalc(false)}
            userId={user?.$id}
          />
        </Portal>
      )}
    </div>
  )
}

export default React.memo(PropertyCard)
