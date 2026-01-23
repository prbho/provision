'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

import { Separator } from '@/components/ui/separator'

import HeaderSearch from './HeaderSearch'
import NavigationLinks from './NavigationLinks'
import UserDropdown from './UserDropdown'

export default function HeaderDesktop() {
  const { isAuthenticated } = useAuth()

  return (
    <header className="hidden md:block sticky top-0 z-50">
      {/* Glass container */}
      <div className="backdrop-blur-md bg-white/80 border-b border-gray-100">
        <div className="mx-auto px-6 h-16 flex items-center max-w-11/12">
          {/* Left: Logo + Search */}
          <div className="flex items-center flex-1 min-w-0">
            {/* Logo */}
            <Link href="/" className="flex items-center shrink-0">
              <Image
                src="/logo.png"
                alt="PropertyVision"
                width={180}
                height={60}
                priority
                className="h-15 w-auto object-contain"
              />
            </Link>

            {/* Search */}
            <div className="hidden lg:flex flex-1 mx-8 max-w-xl">
              <HeaderSearch />
            </div>
          </div>

          {/* Right: Nav + Auth */}
          <div className="flex items-center gap-4 ml-auto">
            <NavigationLinks />

            <Separator orientation="vertical" className="h-6" />

            {isAuthenticated ? (
              <UserDropdown />
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="bg-brand hover:bg-brand/90 text-white px-5 py-2 rounded-sm text-sm font-semibold"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="bg-brand/10 border border-brand/90 transition-all hover:bg-brand/20 text-brand px-5 py-2 rounded-sm text-sm font-semibold"
                  >
                    Get Started
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
