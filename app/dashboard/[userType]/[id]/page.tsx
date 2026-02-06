// app/dashboard/[userType]/[id]/page.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Property } from '@/types/index'
import { Query } from 'appwrite'
import {
  AlertTriangle,
  BarChart3,
  Bell,
  Building,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Eye,
  Heart,
  Home,
  MessageSquare,
  Search,
  Settings,
  Shield,
  Star,
  TrendingUp,
  User,
  UserCheck,
  Users,
} from 'lucide-react'
import { toast } from 'sonner'

import DashboardSkeleton from '@/components/dashboard/DashboardSkeleton'
import DashboardStats from '@/components/dashboard/DashboardStats'
import { databases } from '@/lib/appwrite'

interface DashboardStatsData {
  totalListings?: number
  totalViews?: number
  totalFavorites?: number
  pendingViewings?: number
  confirmedViewings?: number
  totalProperties?: number
  activeListings?: number
  totalInquiries?: number
  pendingOffers?: number
  savedProperties?: number
  scheduledTours?: number
  savedSearches?: number
  propertiesViewed?: number
  totalUsers?: number
  totalAgents?: number
  verifiedAgents?: number
  pendingApprovals?: number

  // ✅ new buyer stats
  recentPurchasesCount?: number
  totalSpentKobo?: number

  [key: string]: any
}

interface QuickAction {
  title: string
  description: string
  icon: any
  href: string
  color: string
  badge?: number
}

interface StatItem {
  title: string
  value: string | number
  icon: any
  description: string
  color: string
  bgColor: string
  urgent?: boolean
}

interface DashboardProperty extends Property {
  inquiries?: number
  lastInquiry?: string
}

type PurchaseDoc = {
  $id: string
  $createdAt: string
  buyerId?: string
  agentId?: string
  propertyId?: string
  propertyTitle?: string
  amountKobo?: number
  currency?: string
  status?: string
  reference?: string
}

export default function DynamicDashboardPage({}: {
  params: Promise<{ userType: string; id: string }>
}) {
  const params = useParams()
  const userType = params.userType as string
  const id = params.id as string
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()

  const [dashboardStats, setDashboardStats] = useState<DashboardStatsData>({})
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [properties, setProperties] = useState<DashboardProperty[]>([])
  const [recentPurchases, setRecentPurchases] = useState<PurchaseDoc[]>([])
  const [dashboardLoading, setDashboardLoading] = useState(true)

  const databaseId =
    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'propertyDB'
  const propertiesCollectionId =
    process.env.NEXT_PUBLIC_APPWRITE_PROPERTIES_TABLE_ID || 'properties'
  const purchasesCollectionId =
    process.env.NEXT_PUBLIC_APPWRITE_PURCHASES_TABLE_ID || 'purchases'
  const usersCollectionId =
    process.env.NEXT_PUBLIC_APPWRITE_USERS_TABLE_ID || 'users'
  const agentsCollectionId =
    process.env.NEXT_PUBLIC_APPWRITE_AGENTS_TABLE_ID || 'agents'

  const money = useCallback((amountKobo?: number, currency = 'NGN') => {
    const n = Math.round((Number(amountKobo) || 0) / 100)
    if (currency === 'NGN') return `₦${n.toLocaleString()}`
    return new Intl.NumberFormat('en', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(n)
  }, [])

  // ✅ Validate route once auth state is ready (prevents loops / spam)
  useEffect(() => {
    if (isLoading) return
    if (!user) return

    // only their own dashboard
    if (user.$id !== id) {
      toast.error('You can only view your own dashboard')
      router.replace('/')
      return
    }

    // userType mismatch: fix URL
    if (user.userType !== userType) {
      router.replace(`/dashboard/${user.userType}/${user.$id}`)
      return
    }
  }, [isLoading, user, id, userType, router])

  // Fetch properties from Appwrite
  const fetchProperties = useCallback(async () => {
    if (!user?.$id) return []

    try {
      // For admin, fetch all properties without filters
      if (user.userType === 'admin') {
        const response = await databases.listDocuments(
          databaseId,
          propertiesCollectionId,
          [Query.orderDesc('$createdAt'), Query.limit(1000)]
        )

        const transformed: DashboardProperty[] = response.documents.map(
          (doc: any) => ({
            $id: doc.$id,
            $collectionId: doc.$collectionId,
            $databaseId: doc.$databaseId,
            $createdAt: doc.$createdAt,
            $updatedAt: doc.$updatedAt,
            $permissions: doc.$permissions || '',
            agentId: doc.agentId || '',
            userId: user.$id,
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
            amenities: doc.amenities || [],
            images: doc.images || [],
            videos: doc.videos || [],
            titles: doc.titles || [],
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
            paymentOutright: doc.paymentOutright || doc.outright || false,
            outright: doc.outright || false,
            paymentPlan: doc.paymentPlan || false,
            mortgageEligible: doc.mortgageEligible || false,
            customPlanAvailable: doc.customPlanAvailable || false,
            customPlanDepositPercent: doc.customPlanDepositPercent || 0,
            customPlanMonths: doc.customPlanMonths || 0,
            inquiries: doc.inquiries || 0,
            lastInquiry: doc.lastInquiry,
          })
        )

        return transformed
      }

      // For other user types
      const queries: any[] = []

      if (user.userType === 'seller') {
        queries.push(Query.equal('ownerId', user.$id))
      } else if (user.userType === 'agent') {
        queries.push(Query.equal('agentId', user.$id))
      } else if (user.userType === 'buyer') {
        queries.push(Query.equal('isActive', true))
      }

      queries.push(Query.orderDesc('$createdAt'))
      queries.push(Query.limit(20))

      const response = await databases.listDocuments(
        databaseId,
        propertiesCollectionId,
        queries
      )

      const transformed: DashboardProperty[] = response.documents.map(
        (doc: any) => ({
          $id: doc.$id,
          $collectionId: doc.$collectionId,
          $databaseId: doc.$databaseId,
          $createdAt: doc.$createdAt,
          $updatedAt: doc.$updatedAt,
          $permissions: doc.$permissions || '',
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
          amenities: doc.amenities || [],
          images: doc.images || [],
          videos: doc.videos || [],
          titles: doc.titles || [],
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
          paymentOutright: doc.paymentOutright || doc.outright || false,
          outright: doc.outright || false,
          paymentPlan: doc.paymentPlan || false,
          mortgageEligible: doc.mortgageEligible || false,
          customPlanAvailable: doc.customPlanAvailable || false,
          customPlanDepositPercent: doc.customPlanDepositPercent || 0,
          customPlanMonths: doc.customPlanMonths || 0,
          inquiries: doc.inquiries || 0,
          lastInquiry: doc.lastInquiry,
        })
      )

      return transformed
    } catch (error) {
      console.error('Error fetching properties:', error)
      return []
    }
  }, [user, databaseId, propertiesCollectionId])

  // ✅ Fetch purchases (buyer)
  const fetchPurchases = useCallback(async () => {
    if (!user?.$id) return []

    try {
      const queries: any[] = [
        Query.orderDesc('$createdAt'),
        Query.limit(5),
        Query.equal('buyerId', user.$id),
      ]

      const res = await databases.listDocuments(
        databaseId,
        purchasesCollectionId,
        queries
      )

      return (res.documents || []) as unknown as PurchaseDoc[]
    } catch (e) {
      console.error('Error fetching purchases:', e)
      return []
    }
  }, [user, databaseId, purchasesCollectionId])

  // Calculate dashboard stats based on properties
  const calculateStats = useCallback(
    async (props: DashboardProperty[], type: string) => {
      if (type === 'admin') {
        try {
          const [
            usersResponse,
            agentsResponse,
            verifiedAgentsResponse,
            pendingApprovalsResponse,
          ] = await Promise.all([
            databases.listDocuments(databaseId, usersCollectionId, [
              Query.limit(1),
            ]),
            databases.listDocuments(databaseId, agentsCollectionId, [
              Query.limit(1),
            ]),
            databases.listDocuments(databaseId, agentsCollectionId, [
              Query.equal('isVerified', true),
              Query.limit(1),
            ]),
            databases.listDocuments(databaseId, propertiesCollectionId, [
              Query.equal('isVerified', false),
              Query.equal('isActive', true),
              Query.limit(1),
            ]),
          ])

          const totalViews = props.reduce((sum, p) => sum + (p.views || 0), 0)
          const totalFavorites = props.reduce(
            (sum, p) => sum + (p.favorites || 0),
            0
          )
          const activeListings = props.filter(
            (p) => p.isActive === true && p.isVerified === true
          ).length

          return {
            totalUsers: usersResponse.total,
            totalAgents: agentsResponse.total,
            verifiedAgents: verifiedAgentsResponse.total,
            totalProperties: props.length,
            pendingApprovals: pendingApprovalsResponse.total,
            totalViews,
            totalFavorites,
            activeListings,
          }
        } catch (error) {
          console.error('Error fetching admin stats:', error)
          return {
            totalUsers: 0,
            totalAgents: 0,
            verifiedAgents: 0,
            totalProperties: props.length,
            activeListings: 0,
            pendingApprovals: 0,
            totalViews: 0,
            totalFavorites: 0,
          }
        }
      }

      if (type === 'agent') {
        const totalViews = props.reduce((sum, p) => sum + (p.views || 0), 0)
        const totalFavorites = props.reduce(
          (sum, p) => sum + (p.favorites || 0),
          0
        )

        return {
          totalListings: props.length,
          totalViews,
          totalFavorites,
          pendingViewings: 0,
          confirmedViewings: 0,
        }
      }

      if (type === 'seller') {
        const totalViews = props.reduce((sum, p) => sum + (p.views || 0), 0)
        const activeListings = props.filter(
          (p) => p.status === 'active' || p.isActive === true
        ).length

        return {
          totalProperties: props.length,
          activeListings,
          totalViews,
          totalInquiries: props.reduce((sum, p) => sum + (p.inquiries || 0), 0),
          pendingOffers: 0,
        }
      }

      if (type === 'buyer') {
        const savedProperties = Array.isArray((user as any)?.favoriteProperties)
          ? (user as any).favoriteProperties.length
          : 0
        const savedSearches = Array.isArray((user as any)?.savedSearches)
          ? (user as any).savedSearches.length
          : 0
        const propertiesViewed = Array.isArray((user as any)?.recentlyViewed)
          ? (user as any).recentlyViewed.length
          : 0

        return {
          savedProperties,
          scheduledTours: 0,
          savedSearches,
          propertiesViewed,
        }
      }

      return {}
    },
    [
      user,
      databaseId,
      usersCollectionId,
      agentsCollectionId,
      propertiesCollectionId,
    ]
  )

  // Load dashboard data
  const loadDashboardData = useCallback(async () => {
    if (!user || !id || !userType) return

    try {
      setDashboardLoading(true)

      const [fetchedProperties, purchases] = await Promise.all([
        fetchProperties(),
        userType === 'buyer' ? fetchPurchases() : Promise.resolve([]),
      ])

      setProperties(fetchedProperties)
      setRecentPurchases(purchases)

      const stats = await calculateStats(fetchedProperties, userType)

      if (userType === 'buyer') {
        const totalSpentKobo = purchases.reduce(
          (sum, p) => sum + (Number(p.amountKobo) || 0),
          0
        )
        setDashboardStats({
          ...stats,
          recentPurchasesCount: purchases.length,
          totalSpentKobo,
        })
      } else {
        setDashboardStats(stats)
      }

      const activity: any[] = []

      if (userType === 'buyer') {
        purchases.slice(0, 3).forEach((p) => {
          activity.push({
            id: p.$id,
            title: 'Purchase',
            description: `Payment completed${
              p.propertyTitle ? ` for "${p.propertyTitle}"` : ''
            }`,
            time: new Date(p.$createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            }),
            status: 'completed',
          })
        })
      }

      if (activity.length === 0) {
        activity.push(
          {
            id: '1',
            type: userType === 'admin' ? 'system_update' : 'property_update',
            title: userType === 'admin' ? 'System' : user?.name || 'User',
            description:
              userType === 'admin'
                ? 'Admin dashboard refreshed'
                : userType === 'seller' || userType === 'agent'
                  ? 'updated property listing'
                  : 'viewed a property',
            time: new Date().toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            }),
            status: 'completed',
          },
          {
            id: '2',
            type: 'notification',
            title: userType === 'admin' ? 'Welcome' : 'System',
            description:
              userType === 'admin'
                ? 'Welcome to admin dashboard'
                : 'Welcome to your dashboard',
            time: new Date().toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            }),
            status: 'new',
          }
        )
      }

      setRecentActivity(activity)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setDashboardLoading(false)
    }
  }, [user, id, userType, fetchProperties, fetchPurchases, calculateStats])

  useEffect(() => {
    if (!isLoading && user && user.$id === id && user.userType === userType) {
      loadDashboardData()
    }
  }, [isLoading, user, id, userType, loadDashboardData])

  const userTypeConfig = useMemo(() => {
    const configs: any = {
      admin: {
        title: 'Admin Dashboard',
        icon: Shield,
        badgeColor: 'bg-purple-100 text-purple-800',
        subtitle: 'System overview and platform management',
      },
      agent: {
        title: 'Agent Dashboard',
        badgeColor: 'bg-blue-100 text-blue-800',
        subtitle: 'Manage your properties and clients',
      },
      seller: {
        title: 'Seller Dashboard',
        badgeColor: 'bg-amber-100 text-amber-800',
        subtitle: 'Manage your property listings and sales',
      },
      buyer: {
        title: 'Buyer Dashboard',
        badgeColor: 'bg-green-100 text-green-800',
        subtitle: 'Find your dream property',
      },
    }
    return configs[userType] || configs.buyer
  }, [userType])

  const getStats = useCallback((): StatItem[] => {
    const statsConfigs: any = {
      admin: [
        {
          title: 'Total Users',
          value: dashboardStats.totalUsers?.toLocaleString() || '0',
          icon: Users,
          description: 'Registered platform users',
          color: 'text-blue-500',
          bgColor: 'bg-blue-50',
        },
        {
          title: 'Verified Agents',
          value: dashboardStats.verifiedAgents?.toLocaleString() || '0',
          icon: UserCheck,
          description: 'Professional agents',
          color: 'text-green-500',
          bgColor: 'bg-green-50',
        },
        {
          title: 'Total Properties',
          value: dashboardStats.totalProperties?.toLocaleString() || '0',
          icon: Building,
          description: 'All property listings',
          color: 'text-purple-500',
          bgColor: 'bg-purple-50',
        },
        {
          title: 'Pending Approvals',
          value: dashboardStats.pendingApprovals?.toString() || '0',
          icon: AlertTriangle,
          description: 'Awaiting review',
          color: 'text-orange-500',
          bgColor: 'bg-orange-50',
          urgent: true,
        },
        {
          title: 'Total Views',
          value: dashboardStats.totalViews?.toLocaleString() || '0',
          icon: Eye,
          description: 'Platform-wide property views',
          color: 'text-cyan-500',
          bgColor: 'bg-cyan-50',
        },
        {
          title: 'Active Listings',
          value: dashboardStats.activeListings?.toLocaleString() || '0',
          icon: CheckCircle,
          description: 'Verified live properties',
          color: 'text-teal-500',
          bgColor: 'bg-teal-50',
        },
      ],
      agent: [
        {
          title: 'Total Listings',
          value: dashboardStats.totalListings || 0,
          icon: Home,
          description: 'Active properties',
          color: 'text-blue-500',
          bgColor: 'bg-blue-50',
        },
        {
          title: 'Property Views',
          value: dashboardStats.totalViews || 0,
          icon: Eye,
          description: 'Total views this month',
          color: 'text-green-500',
          bgColor: 'bg-green-50',
        },
        {
          title: 'Favorites',
          value: dashboardStats.totalFavorites || 0,
          icon: Star,
          description: 'User favorites',
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-50',
        },
        {
          title: 'Pending Viewings',
          value: dashboardStats.pendingViewings || 0,
          icon: Calendar,
          description: 'Awaiting confirmation',
          color: 'text-orange-500',
          bgColor: 'bg-orange-50',
        },
      ],
      seller: [
        {
          title: 'Total Properties',
          value: dashboardStats.totalProperties || 0,
          icon: Home,
          description: 'Properties listed',
          color: 'text-blue-500',
          bgColor: 'bg-blue-50',
        },
        {
          title: 'Active Listings',
          value: dashboardStats.activeListings || 0,
          icon: DollarSign,
          description: 'Currently for sale',
          color: 'text-green-500',
          bgColor: 'bg-green-50',
        },
        {
          title: 'Property Views',
          value: dashboardStats.totalViews || 0,
          icon: Eye,
          description: 'Total views this month',
          color: 'text-purple-500',
          bgColor: 'bg-purple-50',
        },
        {
          title: 'Inquiries',
          value: dashboardStats.totalInquiries || 0,
          icon: MessageSquare,
          description: 'Buyer inquiries',
          color: 'text-orange-500',
          bgColor: 'bg-orange-50',
        },
      ],
      buyer: [
        {
          title: 'Saved Properties',
          value: dashboardStats.savedProperties || 0,
          icon: Heart,
          description: 'Properties you saved',
          color: 'text-red-500',
          bgColor: 'bg-red-50',
        },
        {
          title: 'Purchases',
          value: dashboardStats.recentPurchasesCount || 0,
          icon: DollarSign,
          description: 'Recent successful payments',
          color: 'text-emerald-600',
          bgColor: 'bg-emerald-50',
        },
        {
          title: 'Total Spent',
          value:
            typeof dashboardStats.totalSpentKobo === 'number'
              ? `₦${Math.round(dashboardStats.totalSpentKobo / 100).toLocaleString()}`
              : '₦0',
          icon: BarChart3,
          description: 'All-time spending',
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
        },
        {
          title: 'Saved Searches',
          value: dashboardStats.savedSearches || 0,
          icon: Search,
          description: 'Your search criteria',
          color: 'text-green-500',
          bgColor: 'bg-green-50',
        },
      ],
    }

    return statsConfigs[userType] || statsConfigs.buyer
  }, [dashboardStats, userType])

  const getQuickActions = useCallback((): QuickAction[] => {
    const actionsConfigs: any = {
      admin: [
        {
          title: 'Approval Queue',
          description: 'Review pending submissions',
          icon: Shield,
          href: `/dashboard/${userType}/${user?.$id || ''}/approvals`,
          color: 'bg-orange-500 hover:bg-orange-600',
          badge: dashboardStats.pendingApprovals,
        },
        {
          title: 'Agent Management',
          description: 'Verify and manage agents',
          icon: UserCheck,
          href: `/dashboard/${userType}/${user?.$id || ''}/users`,
          color: 'bg-green-500 hover:bg-green-600',
          badge:
            dashboardStats.totalAgents && dashboardStats.verifiedAgents
              ? dashboardStats.totalAgents - dashboardStats.verifiedAgents
              : 0,
        },
        {
          title: 'User Management',
          description: 'Manage all users',
          icon: Users,
          href: `/dashboard/${userType}/${user?.$id || ''}/users`,
          color: 'bg-slate-900 hover:bg-slate-800',
        },
        {
          title: 'Properties',
          description: 'Manage all listings',
          icon: Home,
          href: `/dashboard/${userType}/${user?.$id || ''}/properties`,
          color: 'bg-slate-900 hover:bg-slate-800',
        },
        {
          title: 'Analytics',
          description: 'Platform performance',
          icon: BarChart3,
          href: '/admin/analytics',
          color: 'bg-slate-900 hover:bg-slate-800',
        },
        {
          title: 'System Settings',
          description: 'Platform configuration',
          icon: Settings,
          href: '/admin/settings',
          color: 'bg-slate-900 hover:bg-slate-800',
        },
      ],
      agent: [
        {
          title: 'Manage Properties',
          description: 'View all listings',
          icon: Settings,
          href: `/dashboard/agent/${user?.$id || ''}/properties`,
          color: 'bg-slate-900 hover:bg-slate-800',
        },
        {
          title: 'Messages',
          description: 'Respond to inquiries',
          icon: MessageSquare,
          href: `/dashboard/agent/${user?.$id || ''}/messages`,
          color: 'bg-slate-900 hover:bg-slate-800',
        },
        {
          title: 'Performance',
          description: 'View analytics',
          icon: TrendingUp,
          href: `/dashboard/agent/${user?.$id || ''}/analytics`,
          color: 'bg-slate-900 hover:bg-slate-800',
        },
      ],
      seller: [
        {
          title: 'List New Property',
          description: 'Sell your property',
          icon: Home,
          href: '/properties/post',
          color: 'bg-emerald-600 hover:bg-emerald-700',
        },
        {
          title: 'Manage Properties',
          description: 'Edit your listings',
          icon: Settings,
          href: `/dashboard/${userType}/${user?.$id || ''}/properties`,
          color: 'bg-slate-900 hover:bg-slate-800',
        },
        {
          title: 'View Inquiries',
          description: 'Respond to buyers',
          icon: MessageSquare,
          href: `/dashboard/${userType}/${user?.$id || ''}/messages`,
          color: 'bg-slate-900 hover:bg-slate-800',
        },
        {
          title: 'Market Analysis',
          description: 'Pricing insights',
          icon: TrendingUp,
          href: `/dashboard/${userType}/${user?.$id || ''}/analytics`,
          color: 'bg-slate-900 hover:bg-slate-800',
        },
      ],
      buyer: [
        {
          title: 'Search Properties',
          description: 'Find your dream home',
          icon: Search,
          href: `/properties`,
          color: 'bg-emerald-600 hover:bg-emerald-700',
        },
        {
          title: 'Saved Properties',
          description: 'View your favorites',
          icon: Heart,
          href: `/dashboard/${userType}/${user?.$id || ''}/favorites`,
          color: 'bg-red-500 hover:bg-red-600',
        },
        {
          title: 'My Purchases',
          description: 'Receipts & payment status',
          icon: DollarSign,
          href: `/dashboard/${userType}/${user?.$id || ''}/purchases`,
          color: 'bg-blue-600 hover:bg-blue-700',
          badge: dashboardStats.recentPurchasesCount || 0,
        },
        {
          title: 'Notifications',
          description: 'Updates & alerts',
          icon: Bell,
          href: `/dashboard/${userType}/${user?.$id || ''}/notifications`,
          color: 'bg-slate-900 hover:bg-slate-800',
        },
      ],
    }

    return actionsConfigs[userType] || actionsConfigs.buyer
  }, [dashboardStats, userType, user])

  const getTips = useCallback(() => {
    const tipsConfigs: any = {
      admin: [
        {
          title: 'System Monitoring',
          content: 'Monitor user activity and system performance regularly',
          color: 'bg-blue-50',
          textColor: 'text-blue-700',
        },
        {
          title: 'Agent Verification',
          content: 'Verify new agents quickly for a better user experience',
          color: 'bg-green-50',
          textColor: 'text-green-700',
        },
      ],
      agent: [
        {
          title: 'Quick Response',
          content:
            'Respond to viewing requests quickly to increase conversions.',
          color: 'bg-yellow-50',
          textColor: 'text-yellow-700',
        },
        {
          title: 'Quality Photos',
          content: 'Listings with great photos get significantly more views.',
          color: 'bg-blue-50',
          textColor: 'text-blue-700',
        },
      ],
      seller: [
        {
          title: 'Quality Photos',
          content: 'Properties with professional photos sell faster.',
          color: 'bg-yellow-50',
          textColor: 'text-yellow-700',
        },
        {
          title: 'Accurate Pricing',
          content: 'Correct pricing increases serious buyer inquiries.',
          color: 'bg-blue-50',
          textColor: 'text-blue-700',
        },
      ],
      buyer: [
        {
          title: 'Shortlist Smartly',
          content:
            'Save 5–10 properties, then compare location + price trends.',
          color: 'bg-green-50',
          textColor: 'text-green-700',
        },
        {
          title: 'Ask the Right Questions',
          content: 'Confirm title, service charge, and neighborhood details.',
          color: 'bg-blue-50',
          textColor: 'text-blue-700',
        },
      ],
    }
    return tipsConfigs[userType] || tipsConfigs.buyer
  }, [userType])

  const displayProperties = useMemo(() => {
    if (userType === 'buyer') {
      const favoriteIds = (user as any)?.favoriteProperties || []
      return properties.filter((p) => favoriteIds.includes(p.$id))
    }
    return properties
  }, [userType, user, properties])

  const topPerformingAgents = useMemo(() => {
    if (userType !== 'admin') return []

    const perf = properties.reduce((acc, p: any) => {
      if (!p.agentId || !p.agentName) return acc
      if (!acc[p.agentId]) {
        acc[p.agentId] = {
          name: p.agentName,
          listings: 0,
          views: 0,
          favorites: 0,
        }
      }
      acc[p.agentId].listings++
      acc[p.agentId].views += p.views || 0
      acc[p.agentId].favorites += p.favorites || 0
      return acc
    }, {} as any)

    return Object.values(perf)
      .sort((a: any, b: any) => b.listings - a.listings)
      .slice(0, 3)
  }, [userType, properties])

  const agentVerificationStatus = useMemo(() => {
    if (userType !== 'admin') return null
    return {
      verified: dashboardStats.verifiedAgents || 0,
      pending:
        dashboardStats.totalAgents && dashboardStats.verifiedAgents
          ? dashboardStats.totalAgents - dashboardStats.verifiedAgents
          : 0,
      total: dashboardStats.totalAgents || 0,
    }
  }, [userType, dashboardStats])

  if (isLoading || dashboardLoading) return <DashboardSkeleton />

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Not Signed In
          </h2>
          <p className="text-gray-600 mb-4">
            Please sign in to view your dashboard
          </p>
          <button
            onClick={() => router.push('/login')}
            className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center w-max-6xl mx-auto px-6">
            <div>
              <div className="flex items-center gap-3">
                {userType === 'admin' && (
                  <Shield className="w-8 h-8 text-purple-600" />
                )}
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {userTypeConfig.title}
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Welcome back, {user.name}! {userTypeConfig.subtitle}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${userTypeConfig.badgeColor}`}
              >
                {userType.replace(/^\w/, (c) => c.toUpperCase())}
              </span>
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-gray-900">
                  {user.email}
                </p>
                <p className="text-sm text-gray-500">
                  Member since{' '}
                  {new Date(user.$createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* ✅ show stats for all user types (more useful) */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
            <DashboardStats stats={getStats()} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Quick Actions
                  </h3>
                  <span className="text-sm text-gray-500">
                    Most used features
                  </span>
                </div>

                <div
                  className={`grid grid-cols-1 gap-4 ${
                    userType === 'admin' ? 'md:grid-cols-1' : 'md:grid-cols-'
                  }`}
                >
                  {getQuickActions().map((action, index) => (
                    <button
                      key={index}
                      onClick={() => router.push(action.href)}
                      className={`relative flex flex-col text-left p-4 rounded-lg text-white ${action.color} transition-all hover:shadow-md hover:scale-[1.02]`}
                      type="button"
                    >
                      <div className="flex items-start gap-2">
                        <action.icon className="w-5 h-5 mt-0.5" />
                        <div className="min-w-0">
                          <p className="font-semibold truncate">
                            {action.title}
                          </p>
                          <p className="text-sm opacity-90 line-clamp-2">
                            {action.description}
                          </p>
                        </div>
                      </div>

                      {action.badge !== undefined && action.badge > 0 && (
                        <span className="absolute top-3 right-3 bg-white text-slate-900 text-xs rounded-full px-2 py-1 min-w-6 h-6 flex items-center justify-center">
                          {action.badge}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Recent Activity
                  </h3>
                  <span className="text-sm text-gray-500">Latest updates</span>
                </div>

                <div className="space-y-3">
                  {recentActivity.length > 0 ? (
                    recentActivity.slice(0, 5).map((activity, index) => (
                      <div
                        key={activity.id || index}
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            activity.status === 'completed' ||
                            activity.status === 'approved'
                              ? 'bg-green-100'
                              : activity.status === 'pending'
                                ? 'bg-orange-100'
                                : 'bg-blue-100'
                          }`}
                        >
                          {activity.status === 'completed' ||
                          activity.status === 'approved' ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : activity.status === 'pending' ? (
                            <Clock className="w-4 h-4 text-orange-600" />
                          ) : (
                            <Eye className="w-4 h-4 text-blue-600" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {activity.title}
                          </p>
                          <p className="text-sm text-gray-600 truncate">
                            {activity.description}
                          </p>
                        </div>

                        <span className="text-xs text-gray-500">
                          {activity.time}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No recent activity
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* System Health for Admin */}
            {userType === 'admin' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  System Health
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                    <div>
                      <p className="font-medium text-gray-900">Database</p>
                      <p className="text-sm text-gray-500">Appwrite database</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-green-600">
                        Connected
                      </span>
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                    <div>
                      <p className="font-medium text-gray-900">
                        Verified Agents
                      </p>
                      <p className="text-sm text-gray-500">
                        Professional agents
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-green-600">
                        {dashboardStats.verifiedAgents || 0} active
                      </span>
                      <div
                        className={`w-3 h-3 rounded-full ${
                          (dashboardStats.verifiedAgents || 0) > 0
                            ? 'bg-green-500'
                            : 'bg-yellow-500'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                    <div>
                      <p className="font-medium text-gray-900">
                        Platform Activity
                      </p>
                      <p className="text-sm text-gray-500">
                        {dashboardStats.totalProperties || 0} properties
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-green-600">
                        {(dashboardStats.totalProperties || 0) > 0
                          ? 'Active'
                          : 'No Data'}
                      </span>
                      <div
                        className={`w-3 h-3 rounded-full ${
                          (dashboardStats.totalProperties || 0) > 0
                            ? 'bg-green-500'
                            : 'bg-yellow-500'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                    <div>
                      <p className="font-medium text-gray-900">
                        Pending Actions
                      </p>
                      <p className="text-sm text-gray-500">Awaiting review</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-orange-600">
                        {dashboardStats.pendingApprovals || 0} items
                      </span>
                      <div
                        className={`w-3 h-3 rounded-full ${
                          (dashboardStats.pendingApprovals || 0) > 0
                            ? 'bg-orange-500'
                            : 'bg-green-500'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Top Performing Agents for Admin */}
            {userType === 'admin' && topPerformingAgents.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Top Performing Agents
                  </h3>
                  <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    Based on Listings
                  </span>
                </div>

                <div className="space-y-4">
                  {topPerformingAgents.map((agent: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <UserCheck className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {agent.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {agent.listings} listings
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {agent.views} views
                        </p>
                        <p className="text-sm text-green-600">
                          {agent.favorites} favorites
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Agent Verification Status for Admin */}
            {userType === 'admin' && agentVerificationStatus && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Agent Verification Status
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-gray-700">
                        Verified Agents
                      </span>
                    </div>
                    <span className="font-semibold text-green-600">
                      {agentVerificationStatus.verified}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-orange-600" />
                      <span className="text-sm font-medium text-gray-700">
                        Pending Verification
                      </span>
                    </div>
                    <span className="font-semibold text-orange-600">
                      {agentVerificationStatus.pending}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">
                        Total Agent Accounts
                      </span>
                    </div>
                    <span className="font-semibold text-blue-600">
                      {agentVerificationStatus.total}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Tips & Advice */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Tips & Advice
              </h3>
              <div className="space-y-3">
                {getTips().map((tip: any, index: number) => (
                  <div key={index} className={`p-3 rounded-lg ${tip.color}`}>
                    <p className="font-medium mb-1">{tip.title}</p>
                    <p className={`text-sm ${tip.textColor}`}>{tip.content}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                This Month
              </h3>
              <div className="space-y-4">
                {Object.entries(dashboardStats)
                  .filter(
                    ([key, value]) =>
                      typeof value === 'number' &&
                      value > 0 &&
                      ![
                        'totalUsers',
                        'totalAgents',
                        'verifiedAgents',
                        'totalProperties',
                        'pendingApprovals',
                        'activeListings',
                        'totalSpentKobo',
                      ].includes(key)
                  )
                  .slice(0, 6)
                  .map(([key, value], index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <span className="text-sm text-gray-600 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className="font-semibold text-emerald-600">
                        {typeof value === 'number'
                          ? value.toLocaleString()
                          : (value as any)}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {/* ✅ Buyer - Recent Purchases */}
            {userType === 'buyer' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Recent Purchases
                  </h3>
                  <button
                    onClick={() =>
                      router.push(
                        `/dashboard/${userType}/${user.$id}/purchases`
                      )
                    }
                    className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
                    type="button"
                  >
                    View all →
                  </button>
                </div>

                {recentPurchases.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    No purchases yet. When you complete a payment, it will
                    appear here.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {recentPurchases.slice(0, 5).map((p) => (
                      <div
                        key={p.$id}
                        className="p-3 border border-gray-200 rounded-lg flex items-start justify-between"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 line-clamp-1">
                            {p.propertyTitle || 'Property purchase'}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            Ref: {p.reference || p.$id}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(p.$createdAt).toLocaleDateString(
                              'en-US',
                              {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              }
                            )}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-sm font-semibold text-emerald-700">
                            {money(p.amountKobo, p.currency || 'NGN')}
                          </p>
                          <span className="text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                            {p.status || 'success'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Buyer - Saved Properties Preview */}
            {userType === 'buyer' && displayProperties.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Saved Properties
                  </h3>
                  <button
                    type="button"
                    onClick={() =>
                      router.push(
                        `/dashboard/${userType}/${user.$id}/favorites`
                      )
                    }
                    className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
                  >
                    View all →
                  </button>
                </div>

                <div className="space-y-3">
                  {displayProperties.slice(0, 3).map((property) => (
                    <button
                      key={property.$id}
                      type="button"
                      onClick={() => router.push(`/properties/${property.$id}`)}
                      className="w-full text-left block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 line-clamp-1">
                            {property.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {property.city}, {property.state}
                          </p>
                        </div>
                        <div className="text-emerald-600 text-sm font-medium shrink-0">
                          View →
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
