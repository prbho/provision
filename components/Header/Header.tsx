// components/Header/index.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'

import { useAuth } from '../../contexts/AuthContext'
import HeaderDesktop from './HeaderDesktop'
import HeaderLoading from './HeaderLoading'
import HeaderMobile from './HeaderMobile'

export default function Header() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const auth = useAuth()
  const pathname = usePathname()

  // Define auth routes where header should be hidden
  const authRoutes = [
    '/login',
    '/register',
    '/signup',
    '/forgot-password',
    '/reset-password',
    '/verify-email',
    '/forget-password',
    '/auth/',
  ]

  // Check if current route is an auth route
  const isAuthRoute = authRoutes.some((route) => pathname?.startsWith(route))

  // Don't render header on auth routes
  if (isAuthRoute) {
    return null
  }

  const openAuth = () => setIsAuthModalOpen(true)

  // Use type assertion as temporary fix
  const isLoading = (auth as any).isLoading

  if (isLoading) {
    return <HeaderLoading />
  }

  return (
    <>
      <header className="bg-white border-b sticky top-0 z-50">
        <HeaderDesktop />
        <HeaderMobile
          isAuthModalOpen={isAuthModalOpen}
          setIsAuthModalOpen={setIsAuthModalOpen}
          openAuth={openAuth}
        />
      </header>
    </>
  )
}
