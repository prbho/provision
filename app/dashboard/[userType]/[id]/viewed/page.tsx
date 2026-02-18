/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Property } from '@/types'
import { Query } from 'appwrite'
import {
  BirdhouseIcon,
  DollarSign,
  Eye,
  Home,
  Search,
  ShieldCheck,
  Star,
} from 'lucide-react'

import PropertyCard from '@/components/PropertyCard'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { databases } from '@/lib/appwrite'

export default function DynamicViewedPage() {
  const router = useRouter()
  const params = useParams()
  const userType = params.userType as string
  const id = params.id as string

  const { user, isAuthenticated, isLoading: authLoading } = useAuth()

  const [loading, setLoading] = useState(true)
  const [properties, setProperties] = useState<Property[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const VIEWED_CACHE_TTL_MS = 60 * 1000
  const viewedCacheKey = `viewed:${userType}:${id}`

  useEffect(() => {
    if (!authLoading && user) {
      if (user.$id !== id) {
        router.push('/')
        return
      }

      if (!['buyer', 'user'].includes(user.userType)) {
        router.push(`/dashboard/${user.userType}/${user.$id}`)
        return
      }

      if (user.userType !== userType) {
        router.push(`/dashboard/${user.userType}/${user.$id}`)
      }
    }
  }, [authLoading, user, id, userType, router])

  const fetchViewedProperties = useCallback(async () => {
    if (!user?.$id) return

    try {
      setLoading(true)

      if (typeof window !== 'undefined') {
        try {
          const cachedRaw = sessionStorage.getItem(viewedCacheKey)
          if (cachedRaw) {
            const cached = JSON.parse(cachedRaw) as {
              at: number
              properties: Property[]
            }
            if (
              cached?.at &&
              Date.now() - cached.at <= VIEWED_CACHE_TTL_MS
            ) {
              setProperties(cached.properties || [])
              setLoading(false)
              return
            }
          }
        } catch {
          // ignore cache parse issues
        }
      }

      const databaseId =
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'propertyDB'
      const usersCollectionId =
        process.env.NEXT_PUBLIC_APPWRITE_USERS_TABLE_ID || 'users'
      const propertiesCollectionId =
        process.env.NEXT_PUBLIC_APPWRITE_PROPERTIES_TABLE_ID || 'properties'

      let recentlyViewed: string[] = []

      try {
        const userDoc = await databases.getDocument(
          databaseId,
          usersCollectionId,
          user.$id
        )
        if (Array.isArray((userDoc as any).recentlyViewed)) {
          recentlyViewed = (userDoc as any).recentlyViewed
        }
      } catch {
        if (Array.isArray((user as any)?.recentlyViewed)) {
          recentlyViewed = (user as any).recentlyViewed
        }
      }

      const viewedIds = [...new Set(recentlyViewed.filter(Boolean))]
      if (viewedIds.length === 0) {
        setProperties([])
        return
      }

      let propsRes
      try {
        propsRes = await databases.listDocuments(databaseId, propertiesCollectionId, [
          Query.equal('$id', viewedIds),
          Query.limit(100),
          Query.select([
            '$id',
            '$collectionId',
            '$databaseId',
            '$createdAt',
            '$updatedAt',
            '$permissions',
            'agentId',
            'userId',
            'name',
            'propertyId',
            'agentName',
            'title',
            'description',
            'propertyType',
            'status',
            'price',
            'priceUnit',
            'address',
            'city',
            'state',
            'images',
            'isActive',
            'isFeatured',
            'isVerified',
            'views',
            'favorites',
          ]),
        ])
      } catch {
        propsRes = await databases.listDocuments(
          databaseId,
          propertiesCollectionId,
          [Query.equal('$id', viewedIds), Query.limit(100)]
        )
      }

      const transformed: Property[] = propsRes.documents.map((doc: any) => ({
        $id: doc.$id || '',
        $collectionId: doc.$collectionId || '',
        $databaseId: doc.$databaseId || '',
        $createdAt: doc.$createdAt || new Date().toISOString(),
        $updatedAt: doc.$updatedAt || new Date().toISOString(),
        $permissions: doc.$permissions || [],
        agentId: doc.agentId || '',
        userId: doc.userId || '',
        name: doc.name || '',
        propertyId: doc.propertyId || doc.$id,
        agentName: doc.agentName || '',
        title: doc.title || 'Untitled Property',
        description: doc.description || '',
        propertyType: doc.propertyType || 'house',
        status: doc.status || 'for-sale',
        price: doc.price || 0,
        priceUnit: doc.priceUnit || 'total',
        originalPrice: doc.originalPrice,
        priceHistory: doc.priceHistory || [],
        address: doc.address || '',
        phone: doc.phone || '',
        city: doc.city || '',
        state: doc.state || '',
        zipCode: doc.zipCode || '',
        country: doc.country || '',
        neighborhood: doc.neighborhood,
        latitude: doc.latitude || 0,
        longitude: doc.longitude || 0,
        bedrooms: doc.bedrooms || 0,
        bathrooms: doc.bathrooms || 0,
        squareFeet: doc.squareFeet || 0,
        lotSize: doc.lotSize,
        yearBuilt: doc.yearBuilt,
        features: doc.features || [],
        titles: doc.titles || [],
        amenities: doc.amenities || [],
        images: doc.images || [],
        videos: doc.videos || [],
        ownerId: doc.ownerId || '',
        listedBy: doc.listedBy || 'agent',
        listDate: doc.listDate || doc.$createdAt,
        lastUpdated: doc.lastUpdated || doc.$updatedAt,
        isActive: doc.isActive !== undefined ? doc.isActive : true,
        isFeatured: doc.isFeatured || false,
        isVerified: doc.isVerified || false,
        tags: doc.tags || [],
        views: doc.views || 0,
        favorites: doc.favorites || 0,
        paymentOutright: doc.outright || true,
        outright: doc.outright || false,
        paymentPlan: doc.paymentPlan || false,
        mortgageEligible: doc.mortgageEligible || false,
        customPlanAvailable: doc.customPlanAvailable || false,
        customPlanDepositPercent: doc.customPlanDepositPercent || 0,
        customPlanMonths: doc.customPlanMonths || 0,
      }))

      const idToOrder = new Map(viewedIds.map((propId, idx) => [propId, idx]))
      transformed.sort(
        (a, b) => (idToOrder.get(a.$id) ?? 9999) - (idToOrder.get(b.$id) ?? 9999)
      )

      setProperties(transformed)

      if (typeof window !== 'undefined') {
        sessionStorage.setItem(
          viewedCacheKey,
          JSON.stringify({ at: Date.now(), properties: transformed })
        )
      }
    } catch (error) {
      console.error('Error fetching viewed properties:', error)
      setProperties([])
    } finally {
      setLoading(false)
    }
  }, [user?.$id, viewedCacheKey, VIEWED_CACHE_TTL_MS])

  useEffect(() => {
    if (isAuthenticated && user && user.$id === id) {
      fetchViewedProperties()
    }
  }, [isAuthenticated, user, id, fetchViewedProperties])

  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      const matchesSearch =
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.city.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus =
        statusFilter === 'all' || property.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [properties, searchTerm, statusFilter])

  const totalValue = useMemo(() => {
    return filteredProperties.reduce((sum, p) => sum + (Number(p.price) || 0), 0)
  }, [filteredProperties])

  const featuredCount = useMemo(() => {
    return filteredProperties.filter((p) => p.isFeatured).length
  }, [filteredProperties])

  const verifiedCount = useMemo(() => {
    return filteredProperties.filter((p) => p.isVerified).length
  }, [filteredProperties])

  if (authLoading || loading) {
    return (
      <div className="p-6 mx-auto max-w-7xl">
        <div className="animate-pulse">
          <div className="flex">
            <div className="h-8 bg-gray-200 rounded w-1/6 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-44 mb-2 ml-auto"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-6"></div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-lg border border-gray-200 p-4 h-20"
              />
            ))}
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4 h-16 mb-6" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
              >
                <div className="h-48 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user || user.$id !== id) return null

  const formatNaira = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="p-4 md:p-6 mx-auto max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Recently Viewed
          </h1>
          <p className="text-gray-600 mt-2 text-sm md:text-base">
            Continue from where you left off.
          </p>
        </div>
        <Link
          href="/properties"
          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Home className="w-5 h-5" />
          Browse Properties
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Viewed</p>
              <p className="text-xl font-bold text-gray-900">
                {filteredProperties.length}
              </p>
            </div>
            <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-emerald-50 rounded-xl">
              <Eye className="w-5 h-5 md:w-6 md:h-6 text-emerald-700" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Featured</p>
              <p className="text-xl font-bold text-gray-900">{featuredCount}</p>
            </div>
            <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-amber-50 rounded-xl">
              <Star className="w-5 h-5 md:w-6 md:h-6 text-amber-700" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Verified</p>
              <p className="text-xl font-bold text-gray-900">{verifiedCount}</p>
            </div>
            <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-blue-50 rounded-xl">
              <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 text-blue-700" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-xl font-bold text-gray-900">
                {formatNaira(totalValue)}
              </p>
            </div>
            <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-gray-50 rounded-xl">
              <DollarSign className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by property title or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full max-w-48 border border-gray-300 bg-white rounded-lg focus:outline-none focus:border-emerald-500">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Status</SelectLabel>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="for-sale">For Sale</SelectItem>
                  <SelectItem value="for-rent">For Rent</SelectItem>
                  <SelectItem value="short-let">Short Let</SelectItem>
                  <SelectItem value="sold">Sold</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {filteredProperties.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 md:p-12 text-center">
          <BirdhouseIcon className="w-12 h-12 md:w-16 md:h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
            {properties.length === 0 ? 'No Viewed Properties Yet' : 'No Match Found'}
          </h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            {properties.length === 0
              ? 'Properties you open will appear here for quick access.'
              : "Try adjusting your search or filters to find what you're looking for."}
          </p>

          {properties.length === 0 && (
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Browse properties
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <PropertyCard key={property.$id} property={property} userId={user?.$id} />
          ))}
        </div>
      )}
    </div>
  )
}
