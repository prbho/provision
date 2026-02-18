/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { BarChart3, Clock3, Home, Sparkles, TrendingUp } from 'lucide-react'

export default function DynamicTrendsPage() {
  const router = useRouter()
  const params = useParams()
  const userType = params.userType as string
  const id = params.id as string
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()

  useEffect(() => {
    if (!authLoading && user) {
      if (user.$id !== id) {
        router.push('/')
        return
      }

      if (user.userType !== userType) {
        router.push(`/dashboard/${user.userType}/${user.$id}`)
      }
    }
  }, [authLoading, user, id, userType, router])

  if (authLoading) {
    return (
      <div className="p-6 mx-auto max-w-7xl">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/6 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-lg border border-gray-200 p-4 h-24"
              />
            ))}
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-10 h-80" />
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user || user.$id !== id) return null

  return (
    <div className="p-4 md:p-6 mx-auto max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Market Trends
          </h1>
          <p className="text-gray-600 mt-2 text-sm md:text-base">
            Track pricing and demand movement for smarter decisions.
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Price Direction</p>
              <p className="text-xl font-bold text-gray-900">Coming Soon</p>
            </div>
            <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-blue-50 rounded-xl">
              <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-blue-700" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Area Insights</p>
              <p className="text-xl font-bold text-gray-900">Coming Soon</p>
            </div>
            <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-amber-50 rounded-xl">
              <BarChart3 className="w-5 h-5 md:w-6 md:h-6 text-amber-700" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Trend Alerts</p>
              <p className="text-xl font-bold text-gray-900">Coming Soon</p>
            </div>
            <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-purple-50 rounded-xl">
              <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-purple-700" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-8 md:p-12 text-center">
        <Clock3 className="w-12 h-12 md:w-16 md:h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
          Trends Dashboard Is Coming Soon
        </h3>
        <p className="text-gray-500 mb-6 max-w-2xl mx-auto">
          We could not find a complete trends data model wired for this route
          yet. This page will be enabled once trend attributes and aggregation
          endpoints are finalized.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href={`/dashboard/${userType}/${user.$id}`}
            className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Back To Dashboard
          </Link>
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Explore Listings
          </Link>
        </div>
      </div>
    </div>
  )
}
