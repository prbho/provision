'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  AlertTriangle,
  ArrowLeft,
  Building,
  Home,
  MapPin,
  Phone,
  Search,
} from 'lucide-react'

export default function NotFound() {
  const router = useRouter()
  const [showAnimation, setShowAnimation] = useState(false)

  useEffect(() => {
    setTimeout(() => setShowAnimation(true), 300)
    return () => setShowAnimation(false)
  }, [])

  const helpfulLinks = [
    {
      label: 'Browse All Properties',
      href: '/properties',
      icon: Search,
      description: 'Find homes, apartments, and land',
    },
    {
      label: 'Find Local Agents',
      href: '/agents',
      icon: Building,
      description: 'Connect with trusted professionals',
    },
    {
      label: 'Popular Locations',
      href: '/locations',
      icon: MapPin,
      description: 'Explore trending neighborhoods',
    },
  ]

  const popularSearches = [
    {
      label: '3 Bedroom Apartments',
      href: '/properties?bedrooms=3&type=apartment',
    },
    { label: 'Lekki Properties', href: '/properties?location=lekki' },
    { label: 'Commercial Real Estate', href: '/properties?type=commercial' },
    { label: 'New Developments', href: '/properties?status=new' },
  ]

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        {/* Decorative property elements */}
        {showAnimation && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-8 h-8 opacity-10"
                style={{
                  left: `${10 + i * 12}%`,
                  top: `${20 + Math.sin(i) * 20}%`,
                  backgroundImage:
                    'url("data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"%23000000\"%3E%3Cpath d=\"M19 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 14H5V8h14z\"%3E%3C/path%3E%3C/svg%3E")',
                  animation: `float ${4 + i}s ease-in-out infinite`,
                  animationDelay: `${i * 0.5}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="p-3 bg-amber-50 rounded-full">
              <AlertTriangle className="h-8 w-8 text-gold-600" />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-gray-500 mb-4">404</h1>

          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            The page you&apos;re looking for might have been moved, or property
            has been sold, rented, or is no longer available. Don&apos;t worry,
            we have thousands of other great properties waiting for you.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button
            onClick={() => router.push('/')}
            className="flex flex-1 items-center justify-center gap-3 px-6 py-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
          >
            <div className="text-left">
              <div className="font-medium text-gray-900">
                Go Back To Homepage
              </div>
              <div className="text-sm text-gray-500">Return to homepage</div>
            </div>
          </button>

          <button
            onClick={() => router.push('/properties')}
            className="flex flex-1 items-center justify-center gap-3 px-6 py-4 bg-brand text-white rounded-lg hover:bg-brand/95 transition-all duration-200"
          >
            <div className="text-left">
              <div className="font-medium">Browse Properties</div>
              <div className="text-sm opacity-90">
                Check-out avaliable listings
              </div>
            </div>
          </button>
        </div>

        {/* Help Card */}
        <div className="bg-brand/5 border border-brand/10 rounded-xl p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <Phone className="h-5 w-5 text-brand" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Need Personal Assistance?
                </h3>
              </div>
              <p className="text-gray-700">
                Our real estate experts can help you find the perfect property
                or answer any questions about your search.
              </p>
            </div>
            <a
              href="/contact"
              className="px-6 py-3 bg-brand text-white rounded-lg hover:bg-brand/95 transition-colors font-medium text-center whitespace-nowrap"
            >
              Contact Our Team
            </a>
          </div>
        </div>

        {/* Real Estate Tip */}
        <div className="text-center mt-12 pt-8 border-t border-gray-100">
          <p className="text-sm text-gray-500 italic">
            Tip: Save your favorite properties to easily track them later!
          </p>
        </div>
      </div>

      {/* Add CSS for animation */}
      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(5deg);
          }
        }
      `}</style>
    </div>
  )
}
