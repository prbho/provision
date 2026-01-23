'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import {
  Building2,
  ChevronDown,
  Heart,
  Home,
  ListPlus,
  LogOut,
  Settings,
  Shield,
  User,
} from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import NotificationBell from '../NotificationBell'

export default function UserDropdown() {
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
      window.location.href = '/'
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  // Keep your original dynamic URL structure
  const getDashboardLink = () => {
    if (!user?.$id || !user?.userType) return '/dashboard'
    return `/dashboard/${user.userType}/${user.$id}`
  }

  const getProfileLink = () => {
    if (!user?.$id || !user?.userType) return '/profile'
    return `/profile/${user.userType}/${user.$id}`
  }

  const getListPropertyLink = () => {
    if (user?.userType === 'agent') {
      return '/properties/post'
    } else if (user?.userType === 'seller') {
      return '/properties/post'
    }
    return '/properties/post'
  }

  const getDashboardLabel = () => {
    if (!user) return 'Dashboard'

    switch (user.userType) {
      case 'admin':
        return 'Admin Dashboard'
      case 'agent':
        return 'Agent Dashboard'
      case 'seller':
        return 'Seller Dashboard'
      case 'buyer':
        return 'Buyer Dashboard'
      default:
        return 'Dashboard'
    }
  }

  const getDashboardIcon = () => {
    if (!user) return <Home className="h-4 w-4" />

    switch (user.userType) {
      case 'admin':
        return <Shield className="h-4 w-4" />
      case 'agent':
        return <Building2 className="h-4 w-4" />
      default:
        return <Home className="h-4 w-4" />
    }
  }

  return (
    <div className="flex items-center space-x-3">
      <NotificationBell />

      {/* List Property Button - Only for agents and sellers */}
      {(user?.userType === 'agent' || user?.userType === 'seller') && (
        <Link href={getListPropertyLink()} className="hidden sm:block">
          <Button size="sm" variant="outline" className="gap-2">
            <ListPlus className="h-4 w-4" />
            List Property
          </Button>
        </Link>
      )}

      {/* User Dropdown */}
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback className="bg-brand/10 text-brand">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <ChevronDown
              className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-56" align="end">
          {/* User Info */}
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col">
              <p className="font-medium text-gray-900 truncate">{user?.name}</p>
              <p className="text-sm text-gray-500 truncate">{user?.email}</p>
              {user?.userType && (
                <div className="mt-1">
                  <span className="inline-flex items-center gap-1 text-xs bg-brand/10 text-brand px-2 py-1 rounded-full">
                    {user.userType === 'admin' && (
                      <Shield className="h-3 w-3" />
                    )}
                    {user.userType === 'agent' && (
                      <Building2 className="h-3 w-3" />
                    )}
                    {user.userType.charAt(0).toUpperCase() +
                      user.userType.slice(1)}
                  </span>
                </div>
              )}
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* Profile */}
          <DropdownMenuItem asChild onClick={() => setIsOpen(false)}>
            <Link href={getProfileLink()} className="cursor-pointer">
              <User className="h-4 w-4 mr-2" />
              My Profile
            </Link>
          </DropdownMenuItem>

          {/* Dashboard */}
          <DropdownMenuItem asChild onClick={() => setIsOpen(false)}>
            <Link href={getDashboardLink()} className="cursor-pointer">
              <div className="mr-2">{getDashboardIcon()}</div>
              {getDashboardLabel()}
            </Link>
          </DropdownMenuItem>

          {/* User Type Specific Links - Keep your original structure */}
          {user?.userType === 'agent' && (
            <>
              <DropdownMenuItem asChild onClick={() => setIsOpen(false)}>
                <Link
                  href={`/dashboard/agent/${user.$id}/properties`}
                  className="cursor-pointer"
                >
                  <Home className="h-4 w-4 mr-2" />
                  My Properties
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild onClick={() => setIsOpen(false)}>
                <Link
                  href={`/dashboard/agent/${user.$id}/leads`}
                  className="cursor-pointer"
                >
                  <User className="h-4 w-4 mr-2" />
                  My Leads
                </Link>
              </DropdownMenuItem>
            </>
          )}

          {user?.userType === 'admin' && (
            <>
              <DropdownMenuItem asChild onClick={() => setIsOpen(false)}>
                <Link
                  href={`/dashboard/admin/${user.$id}/users`}
                  className="cursor-pointer"
                >
                  <User className="h-4 w-4 mr-2" />
                  User Management
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild onClick={() => setIsOpen(false)}>
                <Link
                  href={`/dashboard/admin/${user.$id}/properties`}
                  className="cursor-pointer"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Property Management
                </Link>
              </DropdownMenuItem>
            </>
          )}

          {user?.userType === 'seller' && (
            <DropdownMenuItem asChild onClick={() => setIsOpen(false)}>
              <Link
                href={`/dashboard/seller/${user.$id}/properties`}
                className="cursor-pointer"
              >
                <Home className="h-4 w-4 mr-2" />
                My Listings
              </Link>
            </DropdownMenuItem>
          )}

          {user?.userType === 'buyer' && (
            <>
              <DropdownMenuItem asChild onClick={() => setIsOpen(false)}>
                <Link
                  href={`/dashboard/buyer/${user.$id}/saved`}
                  className="cursor-pointer"
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Saved Properties
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild onClick={() => setIsOpen(false)}>
                <Link
                  href={`/dashboard/buyer/${user.$id}/searches`}
                  className="cursor-pointer"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Saved Searches
                </Link>
              </DropdownMenuItem>
            </>
          )}

          {/* Common Links */}
          <DropdownMenuItem asChild onClick={() => setIsOpen(false)}>
            <Link
              href={`/dashboard/${user?.userType || ''}/${user?.$id || ''}/favorites`}
              className="cursor-pointer"
            >
              <Heart className="h-4 w-4 mr-2" />
              Favorites
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild onClick={() => setIsOpen(false)}>
            <Link href="/settings" className="cursor-pointer">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Logout */}
          <DropdownMenuItem
            onClick={() => {
              setIsOpen(false)
              handleLogout()
            }}
            className="cursor-pointer text-red-600 hover:text-red-700"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
