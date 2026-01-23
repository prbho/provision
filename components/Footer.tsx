// components/Footer/Footer.tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from 'lucide-react'

export default function Footer() {
  const pathname = usePathname()

  // Define auth routes where footer should be hidden
  const authRoutes = [
    '/login',
    '/register',
    '/signup',
    '/forgot-password',
    '/reset-password',
    '/verify-email',
    '/auth/',
    '/forget-password',
  ]

  // Check if current route is an auth route
  const isAuthRoute = authRoutes.some((route) => pathname?.startsWith(route))

  // Don't render footer on auth routes
  if (isAuthRoute) {
    return null
  }

  const popularLocations = [
    { name: 'Lekki, Lagos', type: 'buy' },
    { name: 'Victoria Island', type: 'rent' },
    { name: 'Maitama, Abuja', type: 'buy' },
    { name: 'Yaba, Lagos', type: 'rent' },
    { name: 'Ikoyi, Lagos', type: 'buy' },
    { name: 'Gwarinpa, Abuja', type: 'rent' },
  ]

  const quickLinks = [
    { label: 'Buy Property', href: '/properties?status=for-sale' },
    { label: 'Rent Property', href: '/properties?status=for-rent' },
    { label: 'Short Lets', href: '/properties?status=short-let' },
    { label: 'List Property', href: '/properties/post' },
    { label: 'Verified Agents', href: '/agents' },
  ]

  // const supportLinks = [
  //   { label: 'Contact Us', href: '/contact' },
  //   { label: 'Privacy Policy', href: '/privacy' },
  //   { label: 'Terms of Service', href: '/terms' },
  //   { label: 'FAQs', href: '/faqs' },
  // ]

  const socialLinks = [
    { icon: Facebook, label: 'Facebook', href: '#' },
    { icon: Twitter, label: 'Twitter', href: '#' },
    { icon: Instagram, label: 'Instagram', href: '#' },
    { icon: Linkedin, label: 'LinkedIn', href: '#' },
  ]

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Brand Color Bar */}
      <div className="bg-brand py-3 relative">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <p className="text-white font-medium">
              Nigeria&apos;s Trusted Real Estate Platform
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand & Info */}
            <div className="md:col-span-2">
              <Link href="/" className="inline-block mb-6">
                <div className="flex items-center gap-3">
                  <Image
                    src="/logot.png"
                    alt="PropertyVision"
                    width={48}
                    height={48}
                    className="rounded-lg"
                  />
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      PropertyVision
                    </h2>
                    <p className="text-sm text-gray-400">
                      Verified Properties • Secure Transactions
                    </p>
                  </div>
                </div>
              </Link>

              <p className="text-gray-400 mb-6 max-w-md">
                Buy, rent, or invest in Nigerian real estate with confidence.
                Every property is verified for your protection.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-brand" />
                  <span>(+234) 906 8425 841</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-brand" />
                  <span>hello@propertyvision.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-brand" />
                  <span>Lagos, Nigeria</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                Quick Links
              </h3>
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-brand transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support & Locations */}
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">
                  Locations
                </h3>
                <ul className="space-y-2">
                  {popularLocations.slice(0, 4).map((location) => (
                    <li key={location.name}>
                      <Link
                        href={`/properties?location=${encodeURIComponent(location.name)}&status=${location.type}`}
                        className="text-gray-400 hover:text-brand transition-colors text-sm"
                      >
                        {location.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Social Links */}
              <div>
                <h4 className="text-sm font-semibold text-white mb-3">
                  Follow Us
                </h4>
                <div className="flex gap-2">
                  {socialLinks.map((social) => (
                    <Link
                      key={social.label}
                      href={social.href}
                      aria-label={social.label}
                      className="p-2 rounded-lg bg-gray-800 hover:bg-brand transition-colors"
                    >
                      <social.icon className="w-4 h-4" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 py-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
            <div className="text-gray-500">
              © {new Date().getFullYear()} PropertyVision. All rights reserved.
            </div>

            <div className="flex items-center gap-6">
              <div className="flex gap-4">
                <Link
                  href="/privacy"
                  className="text-gray-500 hover:text-brand transition-colors"
                >
                  Privacy
                </Link>
                <Link
                  href="/terms"
                  className="text-gray-500 hover:text-brand transition-colors"
                >
                  Terms
                </Link>
                <Link
                  href="/site-map"
                  className="text-gray-500 hover:text-brand transition-colors"
                >
                  Sitemap
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
