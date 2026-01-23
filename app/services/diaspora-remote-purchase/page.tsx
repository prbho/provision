import Link from 'next/link'
import { CheckCircle, FileCheck, Globe, Shield, Video } from 'lucide-react'

import { Button } from '@/components/ui/button'

export default function DiasporaRemotePurchasePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-indigo-700 text-white py-24">
        <div className="container max-w-6xl mx-auto px-4">
          <Globe className="h-12 w-12 mb-6" />
          <h1 className="text-4xl font-bold mb-4">
            Buy Property in Nigeria — From Anywhere
          </h1>
          <p className="text-indigo-100 max-w-2xl text-lg">
            A fully managed, secure property acquisition service designed
            specifically for Nigerians in the diaspora.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="container max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">How It Works</h2>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                icon: Shield,
                title: 'Verified Listings',
                desc: 'Only vetted developers and agents are allowed.',
              },
              {
                icon: Video,
                title: 'Virtual Inspections',
                desc: 'Live video tours and inspection reports.',
              },
              {
                icon: FileCheck,
                title: 'Due Diligence',
                desc: 'Legal, physical and fraud checks.',
              },
              {
                icon: Globe,
                title: 'Secure Closing',
                desc: 'Remote documentation & power of attorney.',
              },
            ].map((step, i) => (
              <div key={i} className="border rounded-2xl p-6 text-center">
                <step.icon className="h-8 w-8 text-indigo-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Diaspora Clients Trust You */}
      <section className="bg-gray-50 py-16">
        <div className="container max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Why Diaspora Clients Trust Us
          </h2>

          <ul className="grid md:grid-cols-2 gap-6">
            {[
              'No random agents or listings',
              'Clear reporting and documentation',
              'Independent verification',
              'Transparent fees',
              'End-to-end accountability',
            ].map((point, i) => (
              <li key={i} className="flex gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">
            Invest Back Home With Confidence
          </h3>
          <p className="text-gray-600 mb-8">
            We act as your trusted eyes, ears, and legal shield on ground.
          </p>
          <Button asChild size="lg">
            <Link href="/contact">Start Remote Purchase</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
