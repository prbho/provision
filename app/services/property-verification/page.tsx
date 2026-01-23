'use client'

import Link from 'next/link'
import { CheckCircle2, FileSearch, MapPinned, ShieldCheck } from 'lucide-react'

import { Button } from '@/components/ui/button'

export default function PropertyVerificationPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="py-24 bg-linear-to-br from-brand from-brand text-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <h1 className="text-4xl font-bold mb-6">Property Verification</h1>
          <p className="text-lg text-emerald-100 max-w-3xl">
            Every property listed on PropertyVision is thoroughly verified to
            protect buyers and investors from fraud, disputes, and hidden risks.
          </p>
        </div>
      </section>

      {/* What We Verify */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-3xl font-bold mb-12 text-center">
            What We Verify
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: FileSearch,
                title: 'Legal & Title Documents',
                text: 'We authenticate ownership, titles, survey plans, C of O, and government approvals.',
              },
              {
                icon: MapPinned,
                title: 'Physical Inspection',
                text: 'On-site inspections confirm property existence, boundaries, and condition.',
              },
              {
                icon: ShieldCheck,
                title: 'Risk & Compliance Checks',
                text: 'We identify government acquisition, disputes, encumbrances, and zoning risks.',
              },
            ].map((item, idx) => (
              <div key={idx} className="border p-8 rounded-2xl">
                <div className="inline-flex p-4 bg-brand/10 text-emerald-600 rounded-xl mb-6">
                  <item.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Our Verification Process
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              'Document submission',
              'Legal & technical review',
              'Physical inspection',
              'Verification approval',
            ].map((step, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl border">
                <CheckCircle2 className="h-6 w-6 text-emerald-600 mb-3" />
                <p className="font-medium">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Verify Before You Buy</h2>
        <p className="text-gray-600 mb-8">
          Make informed decisions backed by expert validation.
        </p>
        <Button asChild size="lg">
          <Link href="/contact">Request Verification</Link>
        </Button>
      </section>
    </div>
  )
}
