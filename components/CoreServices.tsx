// app/components/core-services.tsx
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Building2,
  CheckCircle,
  DoorClosedLocked,
  HatGlasses,
  Search,
  Shield,
} from 'lucide-react'

import { Button } from '@/components/ui/button'

const services = [
  {
    title: 'Verified Properties Only',
    description: [
      'Listings reviewed by our in-house team',
      'Legal & physical verification completed',
      'No fake or duplicated properties',
    ],
    icon: DoorClosedLocked,
    cta: 'Browse Properties',
    href: '/properties',
    badge: null,
  },
  {
    title: 'Trusted Rental Listings',
    description: [
      'Company-approved rental homes',
      'Verified landlords & agents',
      'Secure, transparent rental process',
    ],
    icon: Building2,
    cta: 'Explore Rentals',
    href: '/properties?type=rent',
    badge: null,
  },
  {
    title: 'Property Verification Service',
    description: [
      'Independent fraud & document checks',
      'On-site inspection & due diligence',
      'Official verification reports issued',
    ],
    icon: Search,
    cta: 'Request Verification',
    href: '/services/verification',
    badge: 'Most Trusted',
    featured: true,
  },
  {
    title: 'Verified Agents & Developers',
    description: [
      'Only approved agents can list',
      'Agent identity & company checks',
      'Higher visibility for trusted sellers',
    ],
    icon: HatGlasses,
    cta: 'Become an Agent',
    href: '/register',
    badge: null,
  },
]

export default function CoreServices() {
  return (
    <section className="py-16 pt-8 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Real Estate Built on Trust,
            <span className="block text-brand mt-2">
              Transparency, and Care.
            </span>
          </h2>
          <p className="text-gray-600">
            We verify properties, agents, and documents — so every transaction
            starts with confidence.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative border rounded-lg p-6 flex flex-col ${
                service.featured
                  ? 'border-brand/30 bg-brand/5'
                  : 'hover:border-gray-300'
              }`}
            >
              {/* Badge */}
              {service.badge && (
                <div className="absolute -top-3 right-4">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold bg-brand text-white px-3 py-1 rounded-full">
                    <CheckCircle className="h-3 w-3" />
                    {service.badge}
                  </span>
                </div>
              )}

              {/* Icon */}
              <div className="mb-6">
                <div
                  className={`p-3 rounded-lg inline-flex ${
                    service.featured
                      ? 'bg-brand/10 text-brand'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <service.icon className="h-6 w-6" />
                </div>
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {service.title}
              </h3>

              {/* List */}
              <ul className="space-y-3 mb-6">
                {service.description.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm">
                    <CheckCircle className="h-4 w-4 text-brand/70 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div className="mt-auto">
                <Button
                  asChild
                  className={`w-full ${
                    service.featured
                      ? 'bg-brand hover:bg-brand/90 text-white'
                      : 'border border-brand/30 text-white hover:bg-brand'
                  }`}
                  size="sm"
                >
                  <Link
                    href={service.href}
                    className="flex items-center justify-center gap-2"
                  >
                    <span>{service.cta}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Trust CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="p-4 border border-brand/20 bg-brand/5 rounded-lg"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-brand" />
              <span className="text-sm font-medium text-gray-700">
                Properties & agents are independently verified
              </span>
            </div>
            <Link
              href="/verification-process"
              className="text-sm text-brand hover:text-brand/80 font-medium"
            >
              Learn more →
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
