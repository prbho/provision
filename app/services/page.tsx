'use client'

import Link from 'next/link'
import {
  ArrowRight,
  FileText,
  Globe,
  ShieldCheck,
  TrendingUp,
  Users,
} from 'lucide-react'

import { Button } from '@/components/ui/button'

const services = [
  {
    title: 'Property Verification',
    description:
      'Comprehensive legal, physical, and ownership verification before any transaction.',
    icon: ShieldCheck,
    href: '/services/property-verification',
  },
  {
    title: 'Agent & Developer Verification',
    description:
      'We vet and approve only credible real estate professionals on our platform.',
    icon: Users,
    href: '/services/agent-developer-verification',
  },
  {
    title: 'Investment Advisory',
    description:
      'Data-driven guidance to help investors make informed property decisions.',
    icon: TrendingUp,
    href: '/services/investment-advisory',
  },
  {
    title: 'Diaspora Services',
    description:
      'Secure real estate investment for Nigerians abroad with end-to-end oversight.',
    icon: Globe,
    href: '/services/diaspora-services',
  },
  {
    title: 'Market Reports & Insights',
    description: 'Location-based pricing, demand trends, and risk analysis.',
    icon: FileText,
    href: '/services/market-reports',
  },
]

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <h1 className="text-4xl font-bold mb-6 text-gray-900">
            Our Services
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            PropertyVision provides professional verification, intelligence, and
            advisory services designed to eliminate fraud and reduce investment
            risk.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, idx) => (
              <div
                key={idx}
                className="border rounded-2xl p-8 hover:shadow-md transition"
              >
                <div className="inline-flex p-4 bg-brand/10 text-emerald-600 rounded-xl mb-6">
                  <service.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <Link
                  href={service.href}
                  className="inline-flex items-center gap-2 text-emerald-600 font-medium hover:gap-3 transition-all"
                >
                  Learn more <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-emerald-600 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Work With a Verified Platform?
        </h2>
        <p className="mb-8 text-emerald-100">
          Protect your investment with structured verification.
        </p>
        <Button asChild size="lg" className="bg-white text-emerald-700">
          <Link href="/contact">Contact Us</Link>
        </Button>
      </section>
    </div>
  )
}
