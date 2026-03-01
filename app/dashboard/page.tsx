/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

const VALID_DASHBOARD_USER_TYPES = new Set([
  'buyer',
  'seller',
  'agent',
  'admin',
  'user',
])

export default function Dashboard() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    // wait for auth hydration
    if (isLoading) return

    // if not logged in, go to login (or your landing)
    if (!isAuthenticated || !user?.$id) {
      router.replace('/login')
      return
    }

    const rawUserType =
      (user as unknown as any)?.userType || (user as unknown as any)?.prefs?.userType
    const userType = VALID_DASHBOARD_USER_TYPES.has(rawUserType)
      ? rawUserType
      : 'buyer'

    const target = `/dashboard/${userType}/${user.$id}`

    // prevent loop / repeated replace
    if (pathname === target) return

    router.replace(target)

    // Fallback if client-side transition gets stuck on /dashboard.
    const fallbackTimer = window.setTimeout(() => {
      if (window.location.pathname === '/dashboard') {
        window.location.replace(target)
      }
    }, 1500)

    return () => window.clearTimeout(fallbackTimer)
  }, [isLoading, isAuthenticated, user, router, pathname])

  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <p className="text-sm text-gray-600">Opening your dashboard...</p>
    </div>
  )
}
