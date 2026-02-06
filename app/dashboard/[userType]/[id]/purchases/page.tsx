// app/[userType]/[id]/purchases/page.tsx
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
  CreditCard,
  Eye,
  Heart,
  Home,
  Search,
  ShieldCheck,
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

type PurchaseDoc = {
  $id: string
  $createdAt: string
  buyerId: string
  propertyId: string
  agentId?: string
  amount?: number
  status?: string // success | pending | failed
  reference?: string
}

export default function DynamicPurchasesPage() {
  const router = useRouter()
  const params = useParams()
  const userType = params.userType as string
  const id = params.id as string

  const { user, isAuthenticated, isLoading: authLoading } = useAuth()

  const [loading, setLoading] = useState(true)
  const [purchases, setPurchases] = useState<PurchaseDoc[]>([])
  const [properties, setProperties] = useState<Property[]>([])

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // ✅ Access control
  useEffect(() => {
    if (!authLoading && user) {
      if (user.$id !== id) {
        router.push('/')
        return
      }

      // Only allow buyer (and optionally seller/agent if you want)
      // If you want ANY logged-in user to view purchases, remove this check.
      if (!['buyer', 'user'].includes(user.userType)) {
        router.push(`/dashboard/${user.userType}/${user.$id}`)
        return
      }

      // Route/userType mismatch guard (optional)
      if (user.userType !== userType) {
        router.push(`/dashboard/${user.userType}/${user.$id}`)
      }
    }
  }, [authLoading, user, id, userType, router])

  const fetchPurchases = useCallback(async () => {
    if (!user?.$id) return

    try {
      setLoading(true)

      const databaseId =
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'propertyDB'

      const purchasesCollectionId =
        process.env.NEXT_PUBLIC_APPWRITE_PURCHASES_TABLE_ID || 'purchases'

      const propertiesCollectionId =
        process.env.NEXT_PUBLIC_APPWRITE_PROPERTIES_TABLE_ID || 'properties'

      // 1) Fetch purchases by buyerId
      const purchasesRes = await databases.listDocuments(
        databaseId,
        purchasesCollectionId,
        [
          Query.equal('buyerId', user.$id),
          Query.orderDesc('$createdAt'),
          Query.limit(100),
        ]
      )

      const purchaseDocs: PurchaseDoc[] = purchasesRes.documents.map(
        (d: any) => ({
          $id: d.$id,
          $createdAt: d.$createdAt,
          buyerId: d.buyerId,
          propertyId: d.propertyId,
          agentId: d.agentId,
          amount: d.amount,
          status: d.status,
          reference: d.reference,
        })
      )

      setPurchases(purchaseDocs)

      // 2) Fetch properties linked to purchases
      const propertyIds = [
        ...new Set(purchaseDocs.map((p) => p.propertyId).filter(Boolean)),
      ]
      if (propertyIds.length === 0) {
        setProperties([])
        return
      }

      // Appwrite Query.equal(field, array) supports IN
      const propsRes = await databases.listDocuments(
        databaseId,
        propertiesCollectionId,
        [Query.equal('$id', propertyIds), Query.limit(100)]
      )

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

      setProperties(transformed)
    } catch (error) {
      console.error('Error fetching purchases:', error)
      setPurchases([])
      setProperties([])
    } finally {
      setLoading(false)
    }
  }, [user?.$id])

  useEffect(() => {
    if (isAuthenticated && user && user.$id === id) {
      fetchPurchases()
    }
  }, [isAuthenticated, user, id, fetchPurchases])

  // Join purchase info to property cards (optional use)
  const purchaseMap = useMemo(() => {
    const map = new Map<string, PurchaseDoc>()
    for (const p of purchases) map.set(p.propertyId, p)
    return map
  }, [purchases])

  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      const purchase = purchaseMap.get(property.$id)

      const matchesSearch =
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (purchase?.reference || '')
          .toLowerCase()
          .includes(searchTerm.toLowerCase())

      const matchesStatus =
        statusFilter === 'all' ||
        (purchase?.status || 'success') === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [properties, purchaseMap, searchTerm, statusFilter])

  const totalAmount = useMemo(() => {
    return purchases.reduce((sum, p) => sum + (Number(p.amount) || 0), 0)
  }, [purchases])

  const successCount = useMemo(() => {
    return purchases.filter((p) => p.status === 'completed').length
  }, [purchases])

  const pendingCount = useMemo(() => {
    return purchases.filter((p) => p.status === 'pending').length
  }, [purchases])

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

  const formatNaira = (kobo: number) => {
    // if you store NGN in kobo, divide by 100; if you store naira, remove /100.
    const naira = kobo / 100
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(naira)
  }

  return (
    <div className="p-4 md:p-6 mx-auto max-w-7xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            My Purchases
          </h1>
          <p className="text-gray-600 mt-2 text-sm md:text-base">
            View your successful property purchases and payment references.
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

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Purchases</p>
              <p className="text-xl font-bold text-gray-900">
                {purchases.length}
              </p>
            </div>
            <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-emerald-50 rounded-xl">
              <CreditCard className="w-5 h-5 md:w-6 md:h-6 text-emerald-700" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Successful</p>
              <p className="text-xl font-bold text-gray-900">{successCount}</p>
            </div>
            <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-emerald-50 rounded-xl">
              <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 text-emerald-700" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-xl font-bold text-gray-900">{pendingCount}</p>
            </div>
            <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-amber-50 rounded-xl">
              <Eye className="w-5 h-5 md:w-6 md:h-6 text-amber-700" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Spent</p>
              <p className="text-xl font-bold text-gray-900">
                {formatNaira(totalAmount)}
              </p>
            </div>
            <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-gray-50 rounded-xl">
              <Heart className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by property, location, or payment reference..."
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
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Purchases Grid */}
      {filteredProperties.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 md:p-12 text-center">
          <BirdhouseIcon className="w-12 h-12 md:w-16 md:h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
            {purchases.length === 0 ? 'No Purchases Yet' : 'No Purchases Found'}
          </h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            {purchases.length === 0
              ? 'When you complete a purchase, it will show up here with the payment reference.'
              : "Try adjusting your search or filters to find what you're looking for."}
          </p>

          {purchases.length === 0 && (
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Browse properties
            </Link>
          )}
        </div>
      ) : (
        <>
          {/* Optional: show purchase reference strip above each card */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => {
              const purchase = purchaseMap.get(property.$id)

              return (
                <div key={property.$id} className="space-y-2">
                  {purchase?.reference && (
                    <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-600">
                      <span className="font-semibold text-gray-800">
                        Reference:
                      </span>{' '}
                      {purchase.reference}
                      {purchase.status && (
                        <span className="ml-2 inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-gray-700">
                          {purchase.status}
                        </span>
                      )}
                    </div>
                  )}

                  <PropertyCard property={property} userId={user?.$id} />
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
