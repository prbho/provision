// app/about/page.tsx
'use client'

import Link from 'next/link'
import {
  Award,
  Building,
  CheckCircle2,
  Eye,
  Handshake,
  Home,
  Mail,
  Shield,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react'

import { Button } from '@/components/ui/button'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* HERO */}
      <section className="relative py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand/10 text-brand rounded-full text-sm font-medium mb-6">
              <Shield className="h-4 w-4" />
              Trusted Real Estate Verification Platform
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              Building Trust in Nigerian Real Estate
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              We&apos;re on a mission to eliminate fraud and bring transparency
              to real estate transactions. Every property listed has been
              verified for your peace of mind.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-brand hover:bg-brand/90 text-white px-8"
              >
                <Link href="/properties">Browse Verified Properties</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-brand text-brand hover:bg-brand/5 px-8"
              >
                <Link href="/how-it-works">See How It Works</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* WHO WE ARE */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 mb-4">
                <div className="h-1 w-8 bg-brand rounded-full"></div>
                <span className="text-sm font-medium text-brand">
                  OUR STORY
                </span>
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                More Than Just a Listing Platform
              </h2>

              <div className="space-y-4">
                <p className="text-gray-700">
                  Founded out of frustration with the lack of transparency in
                  Nigerian real estate, PropertyVision started with a simple
                  question:{' '}
                  <strong className="text-brand">
                    &quot;How can we make property buying safer for
                    everyone?&quot;
                  </strong>
                </p>

                <p className="text-gray-700">
                  Unlike traditional listing sites, we&apos;re built on a{' '}
                  <strong className="text-brand">verification-first</strong>
                  approach. We work directly with licensed professionals and
                  conduct thorough checks before any property appears on our
                  platform.
                </p>

                <p className="text-gray-700">
                  Today, we&apos;re trusted by thousands of buyers, investors,
                  and agents who value transparency and security over
                  convenience.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-brand/10 rounded-lg">
                    <Award className="h-6 w-6 text-brand" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Our Promise</h3>
                    <p className="text-sm text-gray-600">
                      What we guarantee to every user
                    </p>
                  </div>
                </div>

                <ul className="space-y-4">
                  {[
                    'No fake or fraudulent listings',
                    'All agents are verified professionals',
                    'Legal documents are cross-checked',
                    'Properties undergo physical inspection',
                    'Transparent pricing with no hidden fees',
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT WE DO */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-brand rounded-full"></div>
              <span className="text-sm font-medium text-brand">
                OUR PROCESS
              </span>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How We Protect You
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our multi-step verification process ensures every property meets
              our strict standards
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Document Verification',
                description:
                  'We verify ownership documents, title deeds, and regulatory approvals before listing any property.',
                features: [
                  'C of O Validation',
                  'Survey Plan Checks',
                  "Governor's Consent",
                ],
              },
              {
                icon: Building,
                title: 'Agent Vetting',
                description:
                  'Only registered real estate professionals with proven track records can list on our platform.',
                features: [
                  'Company Registration',
                  'Professional License',
                  'Client References',
                ],
              },
              {
                icon: Users,
                title: 'Market Validation',
                description:
                  'We analyze market data to ensure fair pricing and identify genuine investment opportunities.',
                features: [
                  'Price Analysis',
                  'Location Scoring',
                  'Growth Potential',
                ],
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="group border rounded-xl p-6 hover:border-brand/30 hover:shadow-sm transition-all"
              >
                <div className="mb-6">
                  <div className="p-3 rounded-lg bg-brand/10 inline-flex group-hover:scale-110 transition-transform">
                    <item.icon className="h-6 w-6 text-brand" />
                  </div>
                </div>

                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-gray-600 mb-6">{item.description}</p>

                <ul className="space-y-2">
                  {item.features.map((feature, fIdx) => (
                    <li
                      key={fIdx}
                      className="flex items-center gap-2 text-sm text-gray-700"
                    >
                      <div className="h-1.5 w-1.5 rounded-full bg-brand"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MISSION / VISION / VALUES */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl border hover:border-brand/30 transition-colors">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-gren-50 rounded-lg">
                  <Target className="h-6 w-6 text-brand" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Our Mission</h3>
                  <p className="text-sm text-gray-600">
                    What drives us forward
                  </p>
                </div>
              </div>
              <p className="text-gray-700">
                To provide a safe haven for all real estate investors by
                providing accessible and secure real estate platform that meets
                the needs of everyone.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl border hover:border-brand/30 transition-colors">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-green-50 rounded-lg">
                  <Eye className="h-6 w-6 text-brand" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Our Vision</h3>
                  <p className="text-sm text-gray-600">
                    Where we&apos;re heading
                  </p>
                </div>
              </div>
              <p className="text-gray-700">
                To become the most trusted real estate company and verification
                platform across Africa, setting a new standards for transparency
                in real estate transactions and empowering individuals to make
                informed decisions with confidence.
              </p>
            </div>

            {/* <div className="bg-white p-8 rounded-xl border hover:border-brand/30 transition-colors">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-green-50 rounded-lg">
                  <Handshake className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Our Values</h3>
                  <p className="text-sm text-gray-600">What we stand for</p>
                </div>
              </div>
              <p className="text-gray-700">
                Integrity first, transparency always, professional excellence,
                and creating lasting value for our community.
              </p>
            </div> */}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-20 bg-brand text-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Trusted by Thousands</h2>
            <p className="text-white/80 max-w-2xl mx-auto">
              Our numbers reflect the growing trust in verified real estate
              transactions
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '50K+', label: 'Users Protected', icon: Users },
              { value: '15K+', label: 'Verified Properties', icon: Home },
              { value: '₦25B+', label: 'Transaction Value', icon: TrendingUp },
              { value: '98%', label: 'Trust Rating', icon: Award },
            ].map((stat, idx) => (
              <div key={idx} className="space-y-3">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10">
                  <stat.icon className="h-7 w-7 text-white" />
                </div>
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="text-white/80 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-linear-to-r from-brand/10 to-brand/5 border border-brand/20 rounded-2xl p-12 text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Join Our Community of Trust
              </h2>

              <p className="text-gray-600 mb-8">
                Whether you&apos;re buying your first home, expanding your
                investment portfolio, or building your real estate business —
                we&apos;re here to ensure you do it safely.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-brand hover:bg-brand/90 text-white px-8"
                >
                  <Link href="/contact">
                    <Mail className="mr-2 h-5 w-5" />
                    Get in Touch
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-brand text-brand hover:bg-brand/5 px-8"
                >
                  <Link href="/properties">
                    <Home className="mr-2 h-5 w-5" />
                    Explore Properties
                  </Link>
                </Button>
              </div>

              <p className="text-sm text-gray-500 mt-6">
                Have questions? Our team is ready to help →
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
