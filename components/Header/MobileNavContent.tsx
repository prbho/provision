// components/Header/MobileNavContent.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import {
  BadgeQuestionMark,
  Building,
  ChevronRight,
  FileCheck,
  Globe,
  Heart,
  Plane,
  Shield,
  TrendingUp,
  User,
  Users,
} from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Separator } from '@/components/ui/separator'

import NotificationBell from '../NotificationBell'

interface MobileNavContentProps {
  openAuth: () => void
  isAuthenticated: boolean
}

export default function MobileNavContent({
  openAuth,
  isAuthenticated,
}: MobileNavContentProps) {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [openProperties, setOpenProperties] = useState(false)
  const [openServices, setOpenServices] = useState(false)
  const [openAgents, setOpenAgents] = useState(false)
  const [openResources, setOpenResources] = useState(false)
  // Determine dashboard link based on user type - UPDATED for dynamic URLs
  const getDashboardLink = () => {
    if (!user?.$id || !user?.userType) return '/dashboard'

    // Use the dynamic URL pattern: /dashboard/[userType]/[id]
    return `/dashboard/${user.userType}/${user.$id}`
  }

  // Get profile link based on user type - UPDATED for dynamic URLs
  const getProfileLink = () => {
    if (!user?.$id || !user?.userType) return '/profile'

    // Use the dynamic URL pattern: /profile/[userType]/[id]
    return `/profile/${user.userType}/${user.$id}`
  }

  // Get list property link based on user type
  const getListPropertyLink = () => {
    if (user?.userType === 'agent') {
      return '/properties/post' // Agents use the advanced property posting
    } else if (user?.userType === 'seller') {
      return '/properties/post' // Regular sellers use simple listing
    }
    return '/properties/post' // Fallback
  }

  const handleLogout = () => {
    logout()
    document.dispatchEvent(new Event('sheet-close'))
  }

  const closeSheet = () => {
    document.dispatchEvent(new Event('sheet-close'))
  }

  return (
    <div className="space-y-6 mt-6">
      {/* Mobile Nav Links - Organized like desktop */}
      <nav className="flex flex-col space-y-1 px-4">
        {/* Properties Dropdown */}
        <Collapsible
          open={openProperties}
          onOpenChange={setOpenProperties}
          className="border-b border-gray-100 last:border-0"
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full py-3 text-lg font-medium text-gray-900 hover:text-emerald-600 transition-colors">
            <span>Properties</span>
            <ChevronRight
              className={`h-4 w-4 transition-transform ${openProperties ? 'rotate-90' : ''}`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 pl-4 pb-3">
            <Link
              href="/properties?type=buy"
              className="flex items-center text-gray-700 hover:text-emerald-600 transition-colors py-2"
              onClick={closeSheet}
            >
              <div className="h-2 w-2 rounded-full bg-brand/5 mr-3" />
              Properties for Sale
            </Link>
            <Link
              href="/properties?type=rent"
              className="flex items-center text-gray-700 hover:text-emerald-600 transition-colors py-2"
              onClick={closeSheet}
            >
              <div className="h-2 w-2 rounded-full bg-brand/5 mr-3" />
              Properties for Rent
            </Link>
            <Link
              href="/properties?type=short-let"
              className="flex items-center text-gray-700 hover:text-emerald-600 transition-colors py-2"
              onClick={closeSheet}
            >
              <div className="h-2 w-2 rounded-full bg-brand/5 mr-3" />
              Properties for Short-let
            </Link>
            <Link
              href="/properties/post"
              className="flex items-center text-gray-700 hover:text-emerald-600 transition-colors py-2"
              onClick={closeSheet}
            >
              <div className="h-2 w-2 rounded-full bg-brand/5 mr-3" />
              List Your Property
            </Link>
          </CollapsibleContent>
        </Collapsible>

        {/* Services Dropdown */}
        <Collapsible
          open={openServices}
          onOpenChange={setOpenServices}
          className="border-b border-gray-100 last:border-0"
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full py-3 text-lg font-medium text-gray-900 hover:text-emerald-600 transition-colors">
            <span>Services</span>
            <ChevronRight
              className={`h-4 w-4 transition-transform ${openServices ? 'rotate-90' : ''}`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 pl-4 pb-3">
            <Link
              href="/services/verification"
              className="flex items-start space-x-3 text-gray-700 hover:text-emerald-600 transition-colors py-2"
              onClick={closeSheet}
            >
              <FileCheck className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">Verification & Due Diligence</p>
                <p className="text-xs text-gray-500">Property Verification</p>
                <p className="text-xs text-gray-500">
                  Comprehensive Due Diligence
                </p>
                <p className="text-xs text-gray-500">Physical Inspection</p>
                <p className="text-xs text-gray-500">Fraud Risk Assessment</p>
              </div>
            </Link>
            <Link
              href="/services/investment"
              className="flex items-start space-x-3 text-gray-700 hover:text-emerald-600 transition-colors py-2"
              onClick={closeSheet}
            >
              <TrendingUp className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">Investment Advisory</p>
                <p className="text-xs text-gray-500">Investment Strategy</p>
                <p className="text-xs text-gray-500">Market Intelligence</p>
                <p className="text-xs text-gray-500">Wealth Management</p>
              </div>
            </Link>
            <Link
              href="/services/diaspora"
              className="flex items-start space-x-3 text-gray-700 hover:text-emerald-600 transition-colors py-2"
              onClick={closeSheet}
            >
              <Globe className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">Diaspora Services</p>
                <p className="text-xs text-gray-500">
                  Remote Property Purchase
                </p>
                <p className="text-xs text-gray-500">International Payments </p>
              </div>
            </Link>
            <Link
              href="/services/mortage"
              className="flex items-start space-x-3 text-gray-700 hover:text-emerald-600 transition-colors py-2"
              onClick={closeSheet}
            >
              <Globe className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">Mortgage & Financing</p>
                <p className="text-xs text-gray-500">
                  Mortgage Pre-Qualification
                </p>
                <p className="text-xs text-gray-500">Loan Optimization</p>
              </div>
            </Link>
            <Link
              href="/services/construction"
              className="flex items-start space-x-3 text-gray-700 hover:text-emerald-600 transition-colors py-2"
              onClick={closeSheet}
            >
              <Building className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">Development & Construction</p>
                <p className="text-xs text-gray-500">Project Management</p>
                <p className="text-xs text-gray-500">Design & Planning</p>
              </div>
            </Link>
            <Link
              href="/services/mortgage"
              className="flex items-start space-x-3 text-gray-700 hover:text-emerald-600 transition-colors py-2"
              onClick={closeSheet}
            >
              <div className="h-5 w-5 flex items-center justify-center text-emerald-600 font-bold text-lg shrink-0">
                ₦
              </div>
              <div>
                <p className="font-medium">Mortgage & Financing</p>
                <p className="text-xs text-gray-500">
                  Mortgage Pre-Qualification
                </p>
                <p className="text-xs text-gray-500">Loan Optimization</p>
              </div>
            </Link>
          </CollapsibleContent>
        </Collapsible>

        {/* Agents Dropdown */}
        {/* <Collapsible
          open={openAgents}
          onOpenChange={setOpenAgents}
          className="border-b border-gray-100 last:border-0"
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full py-3 text-lg font-medium text-gray-900 hover:text-emerald-600 transition-colors">
            <span>Agents</span>
            <ChevronRight
              className={`h-4 w-4 transition-transform ${openAgents ? 'rotate-90' : ''}`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 pl-4 pb-3">
            <Link
              href="/agents"
              className="flex items-start space-x-3 text-gray-700 hover:text-emerald-600 transition-colors py-2"
              onClick={closeSheet}
            >
              <Users className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">Browse All Agents</p>
                <p className="text-xs text-gray-500">View all listing agents</p>
              </div>
            </Link>
            <Link
              href="/list-property"
              className="flex items-start space-x-3 text-emerald-600 font-medium py-2"
              onClick={closeSheet}
            >
              <Handshake className="h-5 w-5 shrink-0" />
              <div>
                <p className="font-medium">Become an Agent</p>
                <p className="text-xs text-emerald-500">Join our network</p>
              </div>
            </Link>
          </CollapsibleContent>
        </Collapsible> */}

        {/* Resources Dropdown */}
        <Collapsible
          open={openResources}
          onOpenChange={setOpenResources}
          className="border-b border-gray-100 last:border-0"
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full py-3 text-lg font-medium text-gray-900 hover:text-emerald-600 transition-colors">
            <span>Resources</span>
            <ChevronRight
              className={`h-4 w-4 transition-transform ${openResources ? 'rotate-90' : ''}`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 pl-4 pb-3">
            <Link
              href="/how-it-works"
              className="flex items-center text-gray-700 hover:text-emerald-600 transition-colors py-2"
              onClick={closeSheet}
            >
              <User className="h-5 w-5 text-emerald-600 mr-3 shrink-0" />
              How It Works
            </Link>
            <Link
              href="/guides/first-time-buyer"
              className="flex items-center text-gray-700 hover:text-emerald-600 transition-colors py-2"
              onClick={closeSheet}
            >
              <User className="h-5 w-5 text-emerald-600 mr-3 shrink-0" />
              First-Time Buyer Guide
            </Link>
            <Link
              href="/resources/roi-calculator"
              className="flex items-center text-gray-700 hover:text-emerald-600 transition-colors py-2"
              onClick={closeSheet}
            >
              <BadgeQuestionMark className="h-5 w-5 text-emerald-600 mr-3 shrink-0" />
              Property Inspection Checklist
            </Link>
            <Link
              href="/guides/inspection-checklist"
              className="flex items-center text-gray-700 hover:text-emerald-600 transition-colors py-2"
              onClick={closeSheet}
            >
              <BadgeQuestionMark className="h-5 w-5 text-emerald-600 mr-3 shrink-0" />
              ROI Calculator
            </Link>
            <Link
              href="/guides/diaspora"
              className="flex items-center text-gray-700 hover:text-emerald-600 transition-colors py-2"
              onClick={closeSheet}
            >
              <Plane className="h-5 w-5 text-emerald-600 mr-3 shrink-0" />
              Diaspora Investor Guide
            </Link>
          </CollapsibleContent>
        </Collapsible>

        {/* Simple Links (No Dropdown) */}
        <Link
          href="/about"
          className="py-3 text-lg font-medium text-gray-900 hover:text-emerald-600 transition-colors border-b border-gray-100"
          onClick={closeSheet}
        >
          About
        </Link>
        <Link
          href="/contact"
          className="py-3 text-lg font-medium text-gray-900 hover:text-emerald-600 transition-colors border-b border-gray-100"
          onClick={closeSheet}
        >
          Contact
        </Link>

        {/* Favorites (Only for authenticated users) */}
        {isAuthenticated && (
          <Link
            href="/favorites"
            className="flex items-center space-x-3 py-3 text-lg font-medium text-gray-900 hover:text-emerald-600 transition-colors border-b border-gray-100"
            onClick={closeSheet}
          >
            <Heart className="h-5 w-5" />
            <span>My Favorites</span>
          </Link>
        )}
      </nav>

      <Separator />

      {/* Auth / Profile Section */}
      {isAuthenticated ? (
        <div className="space-y-4 px-4">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback className="bg-brand/10 text-emerald-600 text-lg">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-gray-900">{user?.name}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
              {!user?.emailVerified && (
                <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  Verify your email
                </p>
              )}
            </div>
          </div>

          {/* Mobile Notification Bell */}
          <div className="flex justify-center">
            <NotificationBell />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" className="w-full" asChild>
              <Link href={getProfileLink()} onClick={closeSheet}>
                My Profile
              </Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href={getListPropertyLink()} onClick={closeSheet}>
                List Property
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" className="w-full" asChild>
              <Link href={getDashboardLink()} onClick={closeSheet}>
                Dashboard
              </Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link
                href={`/dashboard/agent/${user?.$id || ''}/properties`}
                onClick={closeSheet}
              >
                My Properties
              </Link>
            </Button>
          </div>

          <Button
            variant="ghost"
            className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      ) : (
        <div className="flex flex-col space-y-3 px-4">
          <Button
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            asChild
          >
            <Link href="/login" onClick={closeSheet}>
              Sign In
            </Link>
          </Button>
          <Button
            variant="outline"
            className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50"
            asChild
          >
            <Link href="/register" onClick={closeSheet}>
              Sign Up
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}
