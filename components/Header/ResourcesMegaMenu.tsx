'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  Calculator,
  ChevronRight,
  FileCheck,
  Globe,
  Home,
  MapPin,
  Newspaper,
  Shield,
  TrendingUp,
} from 'lucide-react'

interface ResourcesMegaMenuProps {
  onClose?: () => void
}

export default function ResourcesMegaMenu({ onClose }: ResourcesMegaMenuProps) {
  const [activeCategory, setActiveCategory] = useState<
    'guides' | 'insights' | 'trust'
  >('guides')

  const categories = [
    {
      id: 'guides',
      label: 'Guides & Tools',
      icon: Home,
      description: 'Helpful resources for buyers and sellers',
    },
    // {
    //   id: 'insights',
    //   label: 'Market Insights',
    //   icon: TrendingUp,
    //   description: 'Data and analysis on Nigerian real estate',
    // },
    {
      id: 'trust',
      label: 'Trust & Safety',
      icon: Shield,
      description: 'How we protect you and ensure transparency',
    },
  ]

  const guideItems = [
    {
      label: 'First-Time Buyer Guide',
      href: '/guides/first-time-buyer',
      icon: Home,
      description: 'Step-by-step guide for new home buyers',
    },
    {
      label: 'Diaspora Investor Guide',
      href: '/guides/diaspora',
      icon: Globe,
      description: 'Buying property from abroad',
    },
    {
      label: 'ROI Calculator',
      href: '/resources/roi-calculator',
      icon: Calculator,
      description: 'Calculate returns on investment',
    },
    {
      label: 'Property Inspection Checklist',
      href: '/guides/inspection-checklist',
      icon: FileCheck,
      description: 'What to check before buying',
    },
  ]

  const insightItems = [
    {
      label: 'Latest Articles',
      href: '/blog',
      icon: Newspaper,
      description: 'News and updates in Nigerian real estate',
    },
    {
      label: 'Market Reports',
      href: '/reports',
      icon: TrendingUp,
      description: 'Quarterly market analysis',
    },
    {
      label: 'Location Insights',
      href: '/locations',
      icon: MapPin,
      description: 'Area trends and growth data',
    },
  ]

  const trustItems = [
    {
      label: 'How It Works',
      href: '/how-it-works',
      icon: Shield,
      description: 'Our verification process explained',
    },
    {
      label: 'Terms of Service',
      href: '/terms',
      icon: FileCheck,
      description: 'Legal terms and conditions',
    },
    {
      label: 'Privacy Policy',
      href: '/privacy',
      icon: FileCheck,
      description: 'How we protect your data',
    },
  ]

  const getActiveItems = () => {
    switch (activeCategory) {
      case 'guides':
        return guideItems
      case 'insights':
        return insightItems
      case 'trust':
        return trustItems
      default:
        return guideItems
    }
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Categories */}
        <div className="lg:w-1/3">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Resources</h3>
            <p className="text-sm text-gray-600">
              Expert guides, insights, and tools for real estate
            </p>
          </div>

          <div className="space-y-2">
            {categories.map((category) => {
              const Icon = category.icon
              const isActive = activeCategory === category.id

              return (
                <button
                  key={category.id}
                  onClick={() =>
                    setActiveCategory(
                      category.id as 'guides' | 'insights' | 'trust'
                    )
                  }
                  className={`w-full flex items-center gap-3 px-4 py-3 border rounded-lg text-sm transition-all ${
                    isActive
                      ? 'bg-brand/10 text-brand border-brand/20 font-medium'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 border-transparent'
                  }`}
                >
                  <div
                    className={`p-2 rounded ${isActive ? 'bg-white' : 'bg-gray-100'}`}
                  >
                    <Icon
                      className={`h-4 w-4 ${isActive ? 'text-brand' : 'text-gray-600'}`}
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium">{category.label}</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {category.description}
                    </div>
                  </div>
                  {isActive && (
                    <ArrowRight className="h-4 w-4 ml-2 text-brand" />
                  )}
                </button>
              )
            })}
          </div>

          {/* Contact Link */}
          <div className="mt-6">
            <Link
              href="/contact"
              className="inline-flex items-center text-sm text-brand hover:text-brand/80 font-medium"
              onClick={onClose}
            >
              Need help? Contact support
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>

        {/* Resources */}
        <div className="lg:w-2/3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {getActiveItems().map((item, index) => {
              const Icon = item.icon

              return (
                <Link
                  key={index}
                  href={item.href}
                  onClick={onClose}
                  className="border rounded-lg p-4 hover:border-brand/30 hover:bg-brand/5 transition-colors group"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-brand/10 rounded">
                      <Icon className="h-5 w-5 text-brand" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm group-hover:text-brand mb-1">
                        {item.label}
                      </h4>
                      <p className="text-xs text-gray-600">
                        {item.description}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-brand group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              )
            })}
          </div>

          {/* View All Link */}
          <div className="mt-6 pt-4 border-t">
            <Link
              href={`/${activeCategory === 'insights' ? 'blog' : 'guides'}`}
              className="inline-flex items-center text-sm text-brand hover:text-brand/80 font-medium"
              onClick={onClose}
            >
              View all{' '}
              {activeCategory === 'guides'
                ? 'guides'
                : activeCategory === 'insights'
                  ? 'insights'
                  : 'trust resources'}
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
