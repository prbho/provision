// app/guides/diaspora/page.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  CheckCircle,
  DollarSign,
  FileText,
  Headphones,
  Home,
  Phone,
  Plane,
  Shield,
  TrendingUp,
  Users,
  Video,
} from 'lucide-react'

export default function DiasporaInvestorGuide() {
  const [activeStep, setActiveStep] = useState(1)

  const steps = [
    {
      number: 1,
      title: 'Initial Consultation',
      description: 'Understand your goals and budget',
      details: [
        '60-minute video consultation with diaspora specialist',
        'Discuss investment objectives and timeline',
        'Review budget and financing options',
        'Create personalized investment plan',
      ],
      icon: Headphones,
    },
    {
      number: 2,
      title: 'Property Selection',
      description: 'Browse verified properties',
      details: [
        'Access curated portfolio with 3D tours',
        'Video walkthroughs and drone footage',
        'Market analysis and investment potential',
        'Shortlist properties matching criteria',
      ],
      icon: Home,
    },
    {
      number: 3,
      title: 'Due Diligence',
      description: 'Complete legal verification',
      details: [
        'Verify Certificate of Occupancy',
        'Check Survey Plan and land documents',
        'Comprehensive legal document review',
        'Receive due diligence report',
      ],
      icon: Shield,
    },
    {
      number: 4,
      title: 'Remote Closing',
      description: 'Complete purchase digitally',
      details: [
        'Electronic document signing',
        'Secure international funds transfer',
        'Power of Attorney processing',
        'Digital title transfer',
      ],
      icon: FileText,
    },
    {
      number: 5,
      title: 'Property Management',
      description: 'Ongoing management support',
      details: [
        'Tenant screening and placement',
        'Monthly rent collection',
        'Regular property maintenance',
        'Quarterly performance reports',
      ],
      icon: Users,
    },
  ]

  const tools = [
    {
      title: 'ROI Calculator',
      description: 'Calculate potential returns',
      icon: TrendingUp,
      href: '/resources/roi-calculator',
    },
    {
      title: 'Currency Converter',
      description: 'Real-time exchange rates',
      icon: DollarSign,
      href: '/currency-converter',
    },
    {
      title: 'Market Reports',
      description: 'Latest market insights',
      icon: FileText,
      href: '/market-reports',
    },
    {
      title: 'Legal Guide',
      description: 'Diaspora documentation process',
      icon: FileText,
      href: '/legal-guide',
    },
  ]

  const challenges = [
    'Not verifying legal documents remotely',
    'Underestimating currency exchange costs',
    'Choosing wrong location without local insight',
    'Not arranging proper property management',
    'Skipping remote property inspection',
    'Ignoring tax implications in both countries',
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Diaspora Investor Guide
            </h1>
            <p className="text-gray-600">
              Complete guide for Nigerians abroad to invest in homeland real
              estate securely
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Steps */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Plane className="h-5 w-5 text-brand" />
            <h2 className="text-xl font-semibold text-gray-900">
              5-Step Remote Investment Process
            </h2>
          </div>
          <div className="space-y-4">
            {steps.map((step) => (
              <div
                key={step.number}
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  activeStep === step.number
                    ? 'border-brand bg-brand/5'
                    : 'hover:border-gray-300'
                }`}
                onClick={() => setActiveStep(step.number)}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`p-3 rounded ${
                      activeStep === step.number
                        ? 'bg-brand/10 text-brand'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    <step.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {step.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {step.description}
                        </p>
                      </div>
                      <ArrowRight
                        className={`h-4 w-4 ${
                          activeStep === step.number
                            ? 'text-brand'
                            : 'text-gray-400'
                        }`}
                      />
                    </div>
                    {activeStep === step.number && (
                      <ul className="space-y-2 pt-2 border-t border-gray-100">
                        {step.details.map((detail, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 text-sm"
                          >
                            <CheckCircle className="h-4 w-4 text-brand/70 mt-0.5" />
                            <span className="text-gray-700">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tools */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Investment Tools
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tools.map((tool) => (
              <Link
                key={tool.title}
                href={tool.href}
                className="border rounded-lg p-4 hover:border-brand/30 hover:bg-brand/5 transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-brand/10 rounded">
                    <tool.icon className="h-5 w-5 text-brand" />
                  </div>
                  <h3 className="font-semibold text-gray-900">{tool.title}</h3>
                </div>
                <p className="text-sm text-gray-600">{tool.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Challenges to Avoid */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Phone className="h-5 w-5 text-brand" />
            <h2 className="text-xl font-semibold text-gray-900">
              Common Challenges to Avoid
            </h2>
          </div>
          <div className="p-4 border border-gold-50 bg-yellow-50 rounded-lg">
            <ul className="space-y-2">
              {challenges.map((challenge, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="w-2 h-2 bg-gold-600 rounded-full mt-1.5"></span>
                  <span className="text-gray-700">{challenge}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="p-6 bg-brand/5 border border-brand/20 rounded-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Video className="h-5 w-5 text-brand" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Need remote investment support?
                </h3>
              </div>
              <p className="text-gray-700">
                Our diaspora specialists guide international investors through
                every step.
              </p>
            </div>
            <Link
              href="/contact"
              className="px-6 py-2 bg-brand text-white rounded-md hover:bg-brand/95 text-center"
            >
              Book Free Consultation
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
