'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { Property } from '@/types'
import {
  Bath,
  Bed,
  Calendar,
  Check,
  ChevronLeft,
  Clock,
  Home,
  Key,
  MapPin,
  Maximize2,
  Moon,
  Share2,
  Square,
} from 'lucide-react'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import MoreDetails from './properties/MoreDetails'
import PropertyMap from './properties/PropertyMap'
import PropertySidebar from './properties/PropertySidebar'
import PropertyFavoriteButton from './PropertyFavoriteButton'
import { SimpleHtmlDisplay } from './ui/SimpleHtmlDisplay'

interface PropertyDetailsProps {
  property: Property
}

export default function PropertyDetails({ property }: PropertyDetailsProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [imageExpanded, setImageExpanded] = useState(false)
  const { user } = useAuth()

  const isShortLet = property.status === 'short-let'

  // Add debug useEffect
  useEffect(() => {
    console.log('🔄 PropertyDetails rendered')
  }, [])

  useEffect(() => {
    console.log('📍 Property Location Data:', {
      address: property.address,
      city: property.city,
      state: property.state,
      country: property.country,
      latitude: property.latitude,
      longitude: property.longitude,
    })
  }, [property])

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: property.description,
          url: window.location.href,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  }

  const mainImage =
    property.images[activeImageIndex] || '/placeholder-property.jpg'

  const formatAppwriteTime = (dateTime: string | undefined): string => {
    if (!dateTime) return ''

    try {
      const date = new Date(dateTime)
      const hours = date.getUTCHours().toString().padStart(2, '0')
      const minutes = date.getUTCMinutes().toString().padStart(2, '0')
      return `${hours}:${minutes}`
    } catch (error) {
      console.error('Error formatting Appwrite time:', error)
      return ''
    }
  }

  // Helper function to get status badge
  const getStatusBadge = () => {
    const baseClasses = 'px-3 py-1.5 rounded-lg text-xs font-semibold'

    switch (property.status) {
      case 'for-sale':
        return (
          <Badge variant="destructive" className={baseClasses}>
            For Sale
          </Badge>
        )
      case 'for-rent':
        return (
          <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white border-0">
            <Key className="h-3 w-3 mr-1" />
            For Rent
          </Badge>
        )
      case 'short-let':
        return (
          <Badge className="bg-purple-600 hover:bg-purple-700 text-white border-0">
            <Moon className="h-3 w-3 mr-1" />
            Short-Let
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-gray-100 rounded-full"
                asChild
              >
                <Link href="/properties">
                  <ChevronLeft className="h-5 w-5" />
                </Link>
              </Button>
              <h1 className="text-base font-semibold text-gray-900 truncate sm:text-lg">
                {property.title}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleShare}
                className="rounded-full"
              >
                <Share2 className="h-5 w-5" />
              </Button>
              <PropertyFavoriteButton
                property={property}
                userId={user?.$id}
                size="md"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
              <div className="relative aspect-4/3 bg-gray-100">
                <Image
                  src={mainImage}
                  alt={property.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
                />

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  {getStatusBadge()}
                  {property.isVerified && (
                    <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white border-0">
                      <Check className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                  {property.isFeatured && (
                    <Badge className="bg-amber-500 hover:bg-amber-600 text-white border-0">
                      Featured
                    </Badge>
                  )}
                </div>

                {/* Expand Image Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute bottom-4 right-4 bg-white/90 hover:bg-white rounded-full shadow-md"
                  onClick={() => setImageExpanded(!imageExpanded)}
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Image Thumbnails */}
              {property.images.length > 1 && (
                <div className="flex gap-2 p-4 overflow-x-auto scrollbar-hide">
                  {property.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImageIndex(index)}
                      className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        activeImageIndex === index
                          ? isShortLet
                            ? 'border-purple-500 ring-2 ring-purple-200'
                            : 'border-emerald-500 ring-2 ring-emerald-200'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      aria-label={`View image ${index + 1}`}
                    >
                      <Image
                        src={image}
                        alt={`${property.title} - Image ${index + 1}`}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Title and Location */}
            {/* <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-sm">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                {property.title}
              </h1>
              <div className="flex items-start text-gray-600">
                <MapPin className="h-5 w-5 mr-2 mt-0.5 shrink-0 text-emerald-600" />
                <span className="text-sm sm:text-base">
                  {property.address}, {property.neighborhood}, {property.city},{' '}
                  {property.state}
                </span>
              </div>
            </div> */}

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
              <div className="flex flex-col items-center p-4 rounded-xl bg-brand/5">
                <div className="flex items-center gap-2">
                  <Bed className="h-5 w-5 text-brand" />
                  <span className="text-xl font-bold text-gray-900">
                    {property.bedrooms}
                  </span>
                </div>
                <span className="text-xs text-gray-600">Bedrooms</span>
              </div>
              <div className="flex flex-col items-center p-4 rounded-xl bg-brand/5">
                <div className="flex items-center gap-2">
                  <Bath className="h-5 w-5 text-brand mb-2" />
                  <span className="text-xl font-bold text-gray-900">
                    {property.bathrooms}
                  </span>
                </div>
                <span className="text-xs text-gray-600">Bathrooms</span>
              </div>
              <div className="flex flex-col items-center p-4 rounded-xl bg-brand/5">
                <div className="flex items-center gap-2">
                  <Square className="h-5 w-5 text-brand mb-2" />
                  <span className="text-xl font-bold text-gray-900">
                    {property.squareFeet.toLocaleString()}
                  </span>
                </div>
                <span className="text-xs text-gray-600">m²</span>
              </div>
              <div className="flex flex-col items-center p-4 rounded-xl bg-gold-50">
                {isShortLet ? (
                  <Moon className="h-5 w-5 text-brand mb-2" />
                ) : (
                  <Home className="h-5 w-5 text-brand mb-2" />
                )}
                <span className="text-sm font-semibold text-gray-900 capitalize truncate w-full text-center">
                  {isShortLet ? 'Short-Let' : property.propertyType}
                </span>
              </div>
            </div>

            {/* SHORT-LET AVAILABILITY SECTION */}
            {isShortLet && (
              <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  <Calendar className="h-5 w-5 text-emerald-600 mr-2" />
                  <h2 className="text-lg font-bold text-gray-900">
                    Availability & Booking
                  </h2>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-700">
                        Stay Duration
                      </h3>
                      <div className="flex gap-3">
                        <div className="flex-1 p-3 bg-brand/5 rounded-lg">
                          <div className="text-xs text-brand">Minimum Stay</div>
                          <div className="font-bold text-gray-900">
                            {property.minimumStay || 1} night
                            {property.minimumStay && property.minimumStay > 1
                              ? 's'
                              : ''}
                          </div>
                        </div>
                        {property.maximumStay && (
                          <div className="flex-1 p-3 bg-gray-50 rounded-lg">
                            <div className="text-xs text-gray-700">
                              Maximum Stay
                            </div>
                            <div className="font-bold text-gray-900">
                              {property.maximumStay} nights
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-700">
                        Check-in/Out
                      </h3>
                      <div className="flex gap-3">
                        <div className="flex-1 p-3 bg-brand/5 rounded-lg">
                          <div className="text-xs text-brand">Check-in</div>
                          <div className="font-bold text-gray-900">
                            {formatAppwriteTime(property.checkInTime) ||
                              '14:00'}
                          </div>
                        </div>
                        <div className="flex-1 p-3 bg-brand/5 rounded-lg">
                          <div className="text-xs text-brand">Check-out</div>
                          <div className="font-bold text-gray-900">
                            {formatAppwriteTime(property.checkOutTime) ||
                              '11:00'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Instant Booking Badge */}
                  {property.instantBooking && (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand/5 text-brand rounded-full">
                      <Clock className="h-3 w-3" />
                      <span className="text-sm font-medium">
                        Instant Booking Available
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                About This {isShortLet ? 'Short-Let' : 'Property'}
              </h3>
              <div className="prose prose-sm max-w-none">
                <SimpleHtmlDisplay
                  html={property.description}
                  emptyMessage={`No description available for this ${isShortLet ? 'short-let' : 'property'}.`}
                />
              </div>
            </div>

            {/* Features & Amenities */}
            {(property.features.length > 0 ||
              property.amenities.length > 0) && (
              <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Features */}
                  {property.features.length > 0 && (
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-3">
                        Features
                      </h3>
                      <div className="space-y-2">
                        {property.features.map((feature, index) => (
                          <div key={index} className="flex items-center">
                            <Check className="h-4 w-4 text-brand mr-2 shrink-0" />
                            <span className="text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Amenities */}
                  {property.amenities.length > 0 && (
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-3">
                        Amenities
                      </h3>
                      <div className="space-y-2">
                        {property.amenities.map((amenity, index) => (
                          <div key={index} className="flex items-center">
                            <Check className="h-4 w-4 text-brand mr-2 shrink-0" />
                            <span className="text-gray-700">{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* More Details Component */}
            <MoreDetails property={property} />

            {/* Location */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Location</h3>

              <div className="space-y-3 text-gray-700 mb-5">
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 mr-3 mt-1 shrink-0 text-brand" />
                  <span className="font-medium">
                    {property.address || 'Address not specified'}
                  </span>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 mr-3 mt-1 shrink-0 text-brand" />
                  <span>
                    {property.neighborhood && `${property.neighborhood}, `}
                    {property.city}, {property.state}
                  </span>
                </div>
              </div>

              {/* Map Component */}
              <div className="rounded-xl overflow-hidden border border-gray-200">
                <PropertyMap
                  latitude={property.latitude}
                  longitude={property.longitude}
                  address={property.address}
                  city={property.city}
                  state={property.state}
                  country={property.country}
                />
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:sticky lg:top-24 space-y-6">
            <div className="sticky top-20">
              <PropertySidebar property={property} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
