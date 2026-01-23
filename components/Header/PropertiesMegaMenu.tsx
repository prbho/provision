'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  BadgeCheck,
  Building,
  ChevronRight,
  Home,
  KeySquare,
  MapPin,
  ShieldCheck,
} from 'lucide-react'

interface PropertiesMegaMenuProps {
  onClose?: () => void
}

interface PropertyLocation {
  name: string
  count: number
  type: 'sale' | 'rent' | 'short-let'
  avgPrice?: number
  growth?: number
}

interface MenuData {
  popularMarkets: PropertyLocation[]
  popularApartments: PropertyLocation[]
  popularShortLets: PropertyLocation[]
  stats: {
    totalProperties: number
    verifiedProperties: number
    happyClients: number
    citiesCovered: number
    totalForSale: number
    totalForRent: number
    totalForShortLet: number
  }
}

export default function PropertiesMegaMenu({
  onClose,
}: PropertiesMegaMenuProps) {
  const [activeType, setActiveType] = useState<'buy' | 'rent' | 'short-let'>(
    'buy'
  )
  const [menuData, setMenuData] = useState<MenuData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const response = await fetch('/api/menu-data')
        if (response.ok) {
          const data = await response.json()
          setMenuData(data)
          console.log('Menu data loaded:', data)
        }
      } catch (error) {
        console.error('Error fetching menu data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMenuData()
  }, [])

  // Get all locations sorted by count
  const getAllLocations = () => {
    if (!menuData) return []

    const allLocations = [
      ...(menuData.popularMarkets || []),
      ...(menuData.popularApartments || []),
      ...(menuData.popularShortLets || []),
    ]

    // Sort by count descending and take top 5
    return allLocations.sort((a, b) => b.count - a.count).slice(0, 5)
  }

  const propertyTypes = [
    {
      id: 'buy',
      label: 'Buy Property',
      icon: Home,
      description: 'Verified homes for sale',
      count: menuData?.stats?.totalForSale || 0,
    },
    {
      id: 'rent',
      label: 'Rent Property',
      icon: KeySquare,
      description: 'Secure rental properties',
      count: menuData?.stats?.totalForRent || 0,
    },
    {
      id: 'short-let',
      label: 'Short-Let',
      icon: Building,
      description: 'Vacation rentals & serviced apartments',
      count: menuData?.stats?.totalForShortLet || 0,
    },
  ]

  const buyProperties = [
    {
      label: 'All Properties for Sale',
      href: '/properties?type=buy',
      count: menuData?.stats?.totalForSale || 0,
    },
    {
      label: 'New Developments',
      href: '/properties?type=buy&propertyType=new-development',
      count: Math.floor((menuData?.stats?.totalForSale || 0) * 0.3), // 30% of total
    },
    {
      label: 'Luxury Homes',
      href: '/properties?type=buy&propertyType=luxury',
      count: Math.floor((menuData?.stats?.totalForSale || 0) * 0.2), // 20% of total
    },
    {
      label: 'Land & Plots',
      href: '/properties?type=buy&propertyType=land',
      count: Math.floor((menuData?.stats?.totalForSale || 0) * 0.25), // 25% of total
    },
  ]

  const rentProperties = [
    {
      label: 'All Properties for Rent',
      href: '/properties?type=rent',
      count: menuData?.stats?.totalForRent || 0,
    },
    {
      label: 'Apartments for Rent',
      href: '/properties?type=rent&propertyType=apartment',
      count: Math.floor((menuData?.stats?.totalForRent || 0) * 0.6), // 60% of total
    },
    {
      label: 'Houses for Rent',
      href: '/properties?type=rent&propertyType=house',
      count: Math.floor((menuData?.stats?.totalForRent || 0) * 0.4), // 40% of total
    },
    {
      label: 'Commercial Spaces',
      href: '/properties?type=rent&propertyType=commercial',
      count: Math.floor((menuData?.stats?.totalForRent || 0) * 0.2), // 20% of total
    },
  ]

  const shortLetProperties = [
    {
      label: 'All Short-Let Properties',
      href: '/properties?type=short-let',
      count: menuData?.stats?.totalForShortLet || 0,
    },
    {
      label: 'Serviced Apartments',
      href: '/properties?type=short-let&propertyType=serviced-apartment',
      count: Math.floor((menuData?.stats?.totalForShortLet || 0) * 0.6), // 60% of total
    },
    {
      label: 'Vacation Homes',
      href: '/properties?type=short-let&propertyType=vacation-home',
      count: Math.floor((menuData?.stats?.totalForShortLet || 0) * 0.4), // 40% of total
    },
    {
      label: 'Luxury Short-Lets',
      href: '/properties?type=short-let&propertyType=luxury',
      count: Math.floor((menuData?.stats?.totalForShortLet || 0) * 0.3), // 30% of total
    },
  ]

  const getActiveProperties = () => {
    switch (activeType) {
      case 'buy':
        return buyProperties
      case 'rent':
        return rentProperties
      case 'short-let':
        return shortLetProperties
      default:
        return buyProperties
    }
  }

  const formatCount = (count: number) => {
    if (count === 0) return '0'
    return count >= 1000 ? `${(count / 1000).toFixed(1)}k+` : `${count}`
  }

  const popularLocations = getAllLocations()

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Sidebar - Property Types */}
        <div className="lg:w-1/3">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Find Properties
            </h3>
            <p className="text-sm text-gray-600">
              {menuData?.stats?.totalProperties
                ? `${menuData.stats.totalProperties} verified properties available`
                : 'Browse verified properties across Nigeria'}
            </p>
          </div>

          <div className="space-y-2">
            {propertyTypes.map((type) => {
              const Icon = type.icon
              const isActive = activeType === type.id
              const hasProperties = type.count > 0

              return (
                <button
                  key={type.id}
                  onClick={() =>
                    setActiveType(type.id as 'buy' | 'rent' | 'short-let')
                  }
                  disabled={!hasProperties}
                  className={`w-full flex items-center gap-3 px-4 py-3 border rounded-lg text-sm transition-all ${
                    isActive
                      ? 'bg-brand/10 text-brand border-brand/20 font-medium'
                      : hasProperties
                        ? 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 border-transparent'
                        : 'text-gray-400 border-transparent cursor-not-allowed'
                  }`}
                >
                  <div
                    className={`p-2 rounded ${isActive ? 'bg-white' : hasProperties ? 'bg-gray-100' : 'bg-gray-50'}`}
                  >
                    <Icon
                      className={`h-4 w-4 ${isActive ? 'text-brand' : hasProperties ? 'text-gray-600' : 'text-gray-400'}`}
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium">{type.label}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span
                        className={`text-xs ${hasProperties ? 'text-gray-500' : 'text-gray-400'}`}
                      >
                        {type.description}
                      </span>
                      {hasProperties && (
                        <span className="text-xs font-medium text-brand">
                          {formatCount(type.count)}
                        </span>
                      )}
                    </div>
                  </div>
                  {isActive && (
                    <ArrowRight className="h-4 w-4 ml-2 text-brand" />
                  )}
                </button>
              )
            })}
          </div>

          {/* Popular Locations */}
          {popularLocations.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="h-4 w-4 text-gray-500" />
                <h4 className="text-sm font-semibold text-gray-900">
                  Popular Locations
                </h4>
              </div>
              <div className="space-y-2">
                {popularLocations.map((location, index) => (
                  <Link
                    key={index}
                    href={`/properties?location=${encodeURIComponent(location.name)}&type=${location.type}`}
                    onClick={onClose}
                    className="flex items-center justify-between p-2 rounded hover:bg-gray-50 group"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-700 group-hover:text-brand">
                        {location.name}
                      </span>
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded ${
                          location.type === 'sale'
                            ? 'bg-blue-100 text-blue-800'
                            : location.type === 'rent'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {location.type.replace('-', ' ')}
                      </span>
                    </div>
                    <span className="text-xs font-medium text-gray-900">
                      {formatCount(location.count)}
                    </span>
                  </Link>
                ))}
              </div>
              <Link
                href="/locations"
                className="mt-3 text-xs text-brand hover:text-brand/80 font-medium inline-flex items-center"
                onClick={onClose}
              >
                View all locations
                <ChevronRight className="h-3 w-3 ml-1" />
              </Link>
            </div>
          )}
        </div>

        {/* Main Content - Properties */}
        <div className="lg:w-2/3">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 animate-pulse"
                >
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getActiveProperties().map((property, index) => {
                  const hasProperties = property.count > 0

                  return (
                    <div
                      key={index}
                      className={`border rounded-lg p-4 transition-colors group ${
                        hasProperties
                          ? 'hover:border-brand/30 hover:bg-brand/5 cursor-pointer'
                          : 'opacity-60 cursor-not-allowed'
                      }`}
                      onClick={
                        hasProperties
                          ? () => {
                              if (onClose) onClose()
                              window.location.href = property.href
                            }
                          : undefined
                      }
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4
                          className={`font-semibold text-sm ${
                            hasProperties
                              ? 'text-gray-900 group-hover:text-brand'
                              : 'text-gray-500'
                          }`}
                        >
                          {property.label}
                        </h4>
                        {hasProperties && (
                          <BadgeCheck className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs ${
                            hasProperties ? 'text-gray-600' : 'text-gray-400'
                          }`}
                        >
                          {hasProperties
                            ? `${formatCount(property.count)} properties`
                            : 'No properties'}
                        </span>
                        {hasProperties && (
                          <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-brand group-hover:translate-x-1 transition-transform" />
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Trust Section */}
              {menuData?.stats && (
                <div className="mt-6 p-4 border border-brand/20 rounded-lg bg-brand/5">
                  <div className="flex items-center gap-3 mb-3">
                    <ShieldCheck className="h-5 w-5 text-brand" />
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        Verified Properties
                      </h4>
                      <p className="text-xs text-gray-600">
                        {menuData.stats.verifiedProperties} of{' '}
                        {menuData.stats.totalProperties} properties verified
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-2 bg-white rounded">
                      <div className="text-lg font-bold text-gray-900">
                        {menuData.stats.citiesCovered || 15}+
                      </div>
                      <div className="text-xs text-gray-600">Cities</div>
                    </div>
                    <div className="text-center p-2 bg-white rounded">
                      <div className="text-lg font-bold text-gray-900">
                        {menuData.stats.totalProperties > 0
                          ? Math.round(
                              (menuData.stats.verifiedProperties /
                                menuData.stats.totalProperties) *
                                100
                            )
                          : 100}
                        %
                      </div>
                      <div className="text-xs text-gray-600">Verified</div>
                    </div>
                  </div>
                </div>
              )}

              {/* View All Link */}
              <div className="mt-6 pt-4 border-t">
                <Link
                  href={`/properties?type=${activeType}`}
                  className="inline-flex items-center text-sm text-brand hover:text-brand/80 font-medium"
                  onClick={onClose}
                >
                  View all{' '}
                  {activeType === 'buy'
                    ? 'properties for sale'
                    : activeType === 'rent'
                      ? 'rental properties'
                      : 'short-let properties'}
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
