/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

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

    const userType =
      (user as unknown as any)?.userType ||
      (user as unknown as any)?.prefs?.userType ||
      'user'

    const target = `/dashboard/${userType}/${user.$id}`

    // prevent loop / repeated replace
    if (pathname === target) return

    router.replace(target)
  }, [isLoading, isAuthenticated, user, router, pathname])

  return null
}
