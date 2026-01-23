'use client'

import { useCallback, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  ArrowLeft,
  BookImage,
  Building,
  Check,
  Filter,
  Grid3X3,
  Home,
  Moon,
  Sparkles,
  X,
} from 'lucide-react'

import PropertyGridThree from '@/components/PropertyGridThree'
import SearchFilters from '@/components/SearchFilters'
import SidebarSearchFilters from '@/components/SidebarSearchFilters'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ViewTypeToggle } from '@/components/ViewTypeToggle'

interface SearchParams {
  type?: string
  location?: string
  city?: string
  propertyType?: string
  minPrice?: string
  maxPrice?: string
  bedrooms?: string
  q?: string
}

export default function PropertiesPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  // Derive state directly from URL parameters
  const urlType = searchParams.get('type') as
    | 'all'
    | 'buy'
    | 'rent'
    | 'short-let'
  const viewType =
    urlType &&
    (urlType === 'all' ||
      urlType === 'buy' ||
      urlType === 'rent' ||
      urlType === 'short-let')
      ? urlType
      : 'all'

  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)

  // Memoize activeFilters
  const activeFilters: SearchParams = useMemo(() => {
    const filters: SearchParams = {}
    const location = searchParams.get('location')
    const city = searchParams.get('city')
    const propertyType = searchParams.get('propertyType')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const bedrooms = searchParams.get('bedrooms')
    const q = searchParams.get('q')

    if (location) filters.location = location
    if (city) filters.city = city
    if (propertyType) filters.propertyType = propertyType
    if (minPrice) filters.minPrice = minPrice
    if (maxPrice) filters.maxPrice = maxPrice
    if (bedrooms) filters.bedrooms = bedrooms
    if (q) filters.q = q

    return filters
  }, [searchParams])

  // Page configuration
  const pageConfig = useMemo(
    () => ({
      all: {
        title: 'All Properties',
        description: 'Browse properties for sale, rent, and short-lets.',
        status: undefined,
        icon: Grid3X3,
        color: 'text-gray-600',
        bgColor: 'bg-gray-100',
        badgeColor: 'bg-gray-100 text-gray-800',
        count: '10,240+',
        gradient: 'from-gray-50 to-white',
      },
      buy: {
        title: 'Properties for Sale',
        description: 'Discover properties for sale across Nigeria.',
        status: 'for-sale',
        icon: Home,
        color: 'text-emerald-600',
        bgColor: 'bg-brand/5',
        badgeColor: 'bg-brand/10 text-emerald-800',
        count: '5,340+',
        gradient: 'from-emerald-50 to-white',
      },
      rent: {
        title: 'Properties for Rent',
        description: 'Find your perfect rental property.',
        status: 'for-rent',
        icon: Building,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        badgeColor: 'bg-blue-100 text-blue-800',
        count: '4,200+',
        gradient: 'from-blue-50 to-white',
      },
      'short-let': {
        title: 'Short-Let Properties',
        description: 'Find perfect vacation rentals and short-term stays.',
        status: 'short-let',
        icon: Moon,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
        badgeColor: 'bg-purple-100 text-purple-800',
        count: '700+',
        gradient: 'from-purple-50 to-white',
      },
    }),
    []
  )

  const config = pageConfig[viewType]

  const handleViewTypeChange = useCallback(
    async (type: 'all' | 'buy' | 'rent' | 'short-let') => {
      setIsNavigating(true)
      const params = new URLSearchParams(searchParams.toString())

      if (type === 'all') {
        params.delete('type')
      } else {
        params.set('type', type)
      }

      // Update URL
      const newUrl = params.toString()
        ? `/properties?${params.toString()}`
        : '/properties'

      try {
        await router.push(newUrl, { scroll: false })

        // Trigger search event
        const searchEvent = new CustomEvent('propertySearch', {
          detail: {
            status: type === 'all' ? undefined : pageConfig[type].status,
            page: 1,
          },
        })
        window.dispatchEvent(searchEvent)
      } finally {
        setTimeout(() => setIsNavigating(false), 300)
      }
    },
    [searchParams, router, pageConfig]
  )

  const clearAllFilters = useCallback(async () => {
    setIsNavigating(true)
    const params = new URLSearchParams()
    if (viewType !== 'all') {
      params.set('type', viewType)
    }

    try {
      router.push(`/properties?${params.toString()}`, { scroll: false })
    } finally {
      setTimeout(() => setIsNavigating(false), 300)
    }
  }, [viewType, router])

  const getActiveFiltersCount = useCallback(() => {
    let count = 0
    if (activeFilters.location) count++
    if (activeFilters.city) count++
    if (activeFilters.propertyType) count++
    if (activeFilters.minPrice) count++
    if (activeFilters.maxPrice) count++
    if (activeFilters.bedrooms) count++
    if (activeFilters.q) count++
    return count
  }, [activeFilters])

  const activeFiltersCount = getActiveFiltersCount()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Hero Section */}
      <div className={`bg-linear-to-b ${config.gradient} border-b`}>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col gap-6">
            {/* Breadcrumb and Stats */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <Link
                    href="/"
                    className="hover:text-emerald-600 flex items-center gap-1 transition-colors group"
                  >
                    <ArrowLeft className="h-3 w-3 group-hover:-translate-x-0.5 transition-transform" />
                    Back to Home
                  </Link>
                  <span className="text-gray-300">•</span>
                  <span className="font-medium text-gray-700 capitalize">
                    {viewType} Properties
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      {activeFiltersCount > 0 && (
                        <Badge className="bg-amber-100 text-amber-800 animate-pulse">
                          <Sparkles className="h-3 w-3 mr-1" />
                          {activeFiltersCount} active filter
                          {activeFiltersCount !== 1 ? 's' : ''}
                        </Badge>
                      )}
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                      {config.title}
                    </h1>
                    <p className="text-gray-600 mt-2 max-w-2xl">
                      {config.description}
                    </p>
                  </div>

                  {/* Desktop Actions */}
                  <div className="hidden lg:flex items-center gap-3">
                    {activeFiltersCount > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearAllFilters}
                        className="border-red-200 hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-all"
                        disabled={isNavigating}
                      >
                        <X className="h-3 w-3 mr-1" />
                        Clear Filters
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      onClick={() => setShowMobileFilters(true)}
                      className="lg:hidden border-emerald-200 hover:bg-brand/5 hover:border-emerald-300"
                      disabled={isNavigating}
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                      {activeFiltersCount > 0 && (
                        <span className="ml-2 bg-emerald-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                          {activeFiltersCount}
                        </span>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* View Type Toggle */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <BookImage className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    Browse by Type
                  </span>
                </div>
              </div>

              <ViewTypeToggle
                viewType={viewType}
                isNavigating={isNavigating}
                onViewTypeChange={handleViewTypeChange}
                variant="desktop"
              />
            </div>

            {/* Active Filters Display */}
            {activeFiltersCount > 0 && (
              <Card className="border shadow-sm bg-white/50 backdrop-blur-sm">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">
                        Active Filters
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAllFilters}
                      className="text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                      disabled={isNavigating}
                    >
                      Clear All
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {activeFilters.location && (
                      <Badge className="bg-brand/5 text-emerald-700 hover:bg-brand/10 border-emerald-200">
                        📍 {activeFilters.location}
                      </Badge>
                    )}
                    {activeFilters.city && (
                      <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200">
                        🏙️ {activeFilters.city}
                      </Badge>
                    )}
                    {activeFilters.propertyType && (
                      <Badge className="bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200">
                        🏠 {activeFilters.propertyType}
                      </Badge>
                    )}
                    {activeFilters.bedrooms && (
                      <Badge className="bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200">
                        🛏️ {activeFilters.bedrooms} Beds
                      </Badge>
                    )}
                    {activeFilters.minPrice && (
                      <Badge className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200">
                        💰 From ₦
                        {parseInt(activeFilters.minPrice).toLocaleString()}
                      </Badge>
                    )}
                    {activeFilters.maxPrice && (
                      <Badge className="bg-red-50 text-red-700 hover:bg-red-100 border-red-200">
                        💰 Up to ₦
                        {parseInt(activeFilters.maxPrice).toLocaleString()}
                      </Badge>
                    )}
                    {activeFilters.q && (
                      <Badge className="bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200">
                        🔍 &quot;{activeFilters.q}&quot;
                      </Badge>
                    )}
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sticky Sidebar - Desktop */}
          <div className="hidden lg:block w-80 shrink-0">
            <div className="sticky top-28">
              <div className="border shadow-sm overflow-hidden rounded-lg bg-white">
                <div className="p-4 border-b bg-linear-to-r from-gray-50 to-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-brand/10">
                        <Filter className="h-4 w-4 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          Refine Search
                        </h3>
                        <p className="text-xs text-gray-500">
                          Narrow down your results
                        </p>
                      </div>
                    </div>
                    {activeFiltersCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearAllFilters}
                        className="text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                        disabled={isNavigating}
                      >
                        Clear All
                      </Button>
                    )}
                  </div>
                </div>
                <div className="p-4">
                  <SidebarSearchFilters />
                </div>
                <div className="p-4 border-t bg-gray-50">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="h-3 w-3 text-brand" />
                    <span>All properties are verified for safety</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Property Grid - Main Content */}
          <div className="flex-1 min-w-0">
            {isNavigating ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
                  <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin absolute top-0"></div>
                </div>
                <p className="text-gray-600 mt-4">Loading properties...</p>
                <p className="text-sm text-gray-500 mt-2">
                  Discovering amazing properties for you
                </p>
              </div>
            ) : (
              <>
                {/* Results Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Available Properties
                    </h2>
                    <p className="text-sm text-gray-600">
                      Showing verified properties matching your criteria
                    </p>
                  </div>

                  {/* Mobile Filter Button */}
                  <Button
                    variant="outline"
                    onClick={() => setShowMobileFilters(true)}
                    className="lg:hidden border-emerald-200 hover:bg-brand/5 hover:border-emerald-300"
                    disabled={isNavigating}
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                    {activeFiltersCount > 0 && (
                      <span className="ml-2 bg-emerald-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                        {activeFiltersCount}
                      </span>
                    )}
                  </Button>
                </div>

                <PropertyGridThree
                  initialStatus={config.status}
                  showFilters={false}
                  searchParams={activeFilters}
                />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Overlay */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden animate-in slide-in-from-right-80 duration-300">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowMobileFilters(false)}
          />
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300">
            <div className="p-4 border-b bg-white sticky top-0 z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-brand/10">
                    <Filter className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Filters</h3>
                    <p className="text-xs text-gray-500">
                      Refine your property search
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {activeFiltersCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        clearAllFilters()
                        setShowMobileFilters(false)
                      }}
                      className="text-xs text-red-600 hover:bg-red-50"
                      disabled={isNavigating}
                    >
                      Clear All
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowMobileFilters(false)}
                    className="hover:bg-gray-100 rounded-full"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="p-4">
              <SearchFilters />
            </div>
            <div className="p-4 border-t bg-white sticky bottom-0 shadow-lg">
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowMobileFilters(false)}
                  className="flex-1 border-gray-300 hover:bg-gray-50"
                  size="lg"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => setShowMobileFilters(false)}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 shadow-md"
                  size="lg"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
