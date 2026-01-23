'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  BadgeCheck,
  Building2,
  CheckCircle,
  FileCheck,
  Percent,
  ShieldCheck,
  Star,
  TrendingUp,
  UserCheck,
} from 'lucide-react'

export default function AgentVerificationPage() {
  const [selectedType, setSelectedType] = useState<'agent' | 'developer'>(
    'agent'
  )

  const verificationSteps = [
    {
      step: 'Document Review',
      description: 'Verify business registration, licenses, and identification',
      checks: [
        'CAC Registration',
        'Professional License',
        'Valid ID',
        'Tax Compliance',
      ],
      icon: FileCheck,
    },
    {
      step: 'Background Check',
      description: 'Review transaction history and professional reputation',
      checks: [
        'Previous Transactions',
        'Client References',
        'Online Presence',
        'Complaint History',
      ],
      icon: ShieldCheck,
    },
    {
      step: 'Property Verification',
      description: 'Validate property documentation and ownership',
      checks: [
        'Property Documents',
        'Ownership Proof',
        'Approvals & Permits',
        'Project Status',
      ],
      icon: Building2,
    },
    {
      step: 'Platform Approval',
      description: 'Final review and badge assignment',
      checks: [
        'Verification Badge',
        'Profile Activation',
        'Listing Permissions',
        'Client Access',
      ],
      icon: UserCheck,
    },
  ]

  const benefits = [
    {
      icon: BadgeCheck,
      title: 'Verified Badge',
      description: 'Build trust with potential clients',
    },
    {
      icon: TrendingUp,
      title: 'Increased Visibility',
      description: 'Priority in search results',
    },
    {
      icon: Percent,
      title: 'Higher Conversion',
      description: 'More qualified leads and sales',
    },
    {
      icon: Star,
      title: 'Premium Features',
      description: 'Access to advanced tools',
    },
  ]

  const successMetrics = [
    { value: '1,200+', label: 'Verified Professionals' },
    { value: '75%', label: 'More Client Trust' },
    { value: '3x', label: 'Higher Engagement' },
    { value: '98%', label: 'Satisfaction Rate' },
  ]

  const requirements = {
    agent: [
      'Valid means of identification',
      'Real estate license/certification',
      'CAC registration (if registered)',
      'Proof of past transactions',
      'Client references',
      'Professional profile photo',
    ],
    developer: [
      'Company registration documents',
      'Project approvals and permits',
      'Proof of land ownership',
      'Past project portfolio',
      'Financial statements',
      'Company profile',
    ],
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-linear-to-b from-brand/5 to-white">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand/10 text-bbrand rounded-full text-sm font-medium mb-6">
              <ShieldCheck className="h-4 w-4" />
              Professional Verification
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              Get <span className="text-gold-600">Verified</span> and Build
              <span className="text-gold-600"> Trust</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
              Join Nigeria&apos;s trusted network of verified real estate
              professionals. Stand out with credibility and increase your
              business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-brand text-white rounded-lg hover:bg-brand/95 font-medium">
                Apply Now
              </button>
              <button className="px-8 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">
                View Benefits
              </button>
            </div>
          </div>

          {/* Success Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {successMetrics.map((stat, index) => (
              <div key={index} className="p-4 text-center">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Type Selection */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
            Who Can Apply?
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <button
              onClick={() => setSelectedType('agent')}
              className={`p-6 rounded-lg text-center ${selectedType === 'agent' ? 'bg-brand text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              <UserCheck className="h-8 w-8 mx-auto mb-4" />
              <div className="font-semibold text-lg mb-2">
                Real Estate Agents
              </div>
              <p className="text-sm">Independent agents and brokerage firms</p>
            </button>
            <button
              onClick={() => setSelectedType('developer')}
              className={`p-6 rounded-lg text-center ${selectedType === 'developer' ? 'bg-brand text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              <Building2 className="h-8 w-8 mx-auto mb-4" />
              <div className="font-semibold text-lg mb-2">
                Property Developers
              </div>
              <p className="text-sm">
                Registered developers and construction firms
              </p>
            </button>
          </div>
        </div>

        {/* Verification Process */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our 4-Step Verification Process
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Transparent process to ensure credibility and build trust.
            </p>
          </div>

          <div className="space-y-8">
            {verificationSteps.map((step, index) => {
              const Icon = step.icon
              return (
                <div
                  key={index}
                  className="p-6 border-2 border-brand/10 rounded-xl"
                >
                  <div className="flex items-start gap-6">
                    <div className="p-4 bg-brand/5 rounded-lg">
                      <Icon className="h-8 w-8 text-brand" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {step.step}
                        </h3>
                        <div className="text-sm text-gray-500">
                          Step {index + 1}
                        </div>
                      </div>
                      <p className="text-gray-600 mb-4">{step.description}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {step.checks.map((check, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm text-gray-700">
                              {check}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Requirements */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
            {selectedType === 'agent' ? 'Agent' : 'Developer'} Requirements
          </h2>
          <div className="p-6 border rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {requirements[selectedType].map((req, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded"
                >
                  <div className="w-2 h-2 bg-brand rounded-full"></div>
                  <span className="text-gray-700">{req}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
            Benefits of Being Verified
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <div key={index} className="p-5 border rounded-lg text-center">
                  <div className="p-3 bg-brand/5 rounded-full inline-block mb-4">
                    <Icon className="h-6 w-6 text-brand" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mb-12 p-8 bg-linear-to-r from-brand to-brand/95 rounded-2xl text-white">
          <div className="max-w-3xl mx-auto text-center">
            <BadgeCheck className="h-12 w-12 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">
              Ready to Stand Out from the Crowd?
            </h2>
            <p className="text-lg text-green-50 mb-8 max-w-2xl mx-auto">
              Get your verified badge and start building trust with potential
              clients today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-white text-brand rounded-lg hover:bg-gray-100 font-semibold">
                Apply for Verification
              </button>
              <a
                href="tel:+2347048000553"
                className="px-8 py-3 border-2 border-white rounded-lg hover:bg-white/10 font-medium"
              >
                Call Verification Team
              </a>
            </div>
          </div>
        </div>

        {/* Pricing Preview */}
        {/* <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
            Simple Pricing
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                plan: 'Basic Verification',
                price: '₦15,000',
                period: 'one-time',
                features: [
                  'Verified Badge',
                  'Profile Listing',
                  'Basic Support',
                ],
              },
              {
                plan: 'Professional',
                price: '₦30,000',
                period: 'per year',
                features: [
                  'Priority Placement',
                  'Advanced Analytics',
                  'Dedicated Support',
                ],
              },
              {
                plan: 'Agency',
                price: '₦75,000',
                period: 'per year',
                features: ['Multiple Agents', 'Custom Branding', 'VIP Support'],
              },
            ].map((plan, index) => (
              <div key={index} className="p-6 border rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">
                  {plan.plan}
                </h3>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {plan.price}
                </div>
                <div className="text-sm text-gray-600 mb-4">{plan.period}</div>
                <div className="space-y-2 mb-6">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
                <button className="w-full py-2 border border-brand text-brand rounded-md hover:bg-brand/5">
                  Choose Plan
                </button>
              </div>
            ))}
          </div>
        </div> */}

        {/* FAQ */}
        <div className="mb-12 p-6 border rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Common Verification Questions
          </h3>
          <div className="space-y-6">
            {[
              {
                q: 'How long does verification take?',
                a: 'Typically 3-5 business days once all documents are submitted.',
              },
              {
                q: 'What if my verification is rejected?',
                a: 'We provide feedback and allow reapplication after addressing the issues.',
              },
              {
                q: 'Is verification mandatory?',
                a: 'No, but verified professionals get 3x more client engagement.',
              },
            ].map((faq, index) => (
              <div key={index}>
                <div className="font-medium text-gray-900 mb-2">{faq.q}</div>
                <p className="text-gray-600 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Link
              href="/faqs#verification"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              View all verification FAQs →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
