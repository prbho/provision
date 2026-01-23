// app/services/due-diligence/page.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  FileCheck,
  Home,
  Phone,
  Search,
  Shield,
  ShieldCheck,
  Target,
  Users,
} from 'lucide-react'

import { Button } from '@/components/ui/button'

export default function DueDiligencePage() {
  const [activeSection, setActiveSection] = useState('overview')

  const phases = [
    {
      phase: 1,
      title: 'Document Verification',
      description: 'Comprehensive legal document review and authentication',
      checks: [
        'Certificate of Occupancy Validation',
        'Survey Plan Verification',
        'Deed of Assignment Review',
        "Governor's Consent Check",
        'Excision/Approval Status',
        'Land Use Charge Clearance',
      ],
      time: '3-5 days',
      icon: FileCheck,
    },
    {
      phase: 2,
      title: 'Title History Investigation',
      description: 'Detailed tracing of property ownership history',
      checks: [
        'Previous Ownership Chain',
        'Liens & Encumbrances Search',
        'Court Case/Litigation Check',
        'Family Settlement Issues',
        'Inheritance Verification',
        'Community/Family Consent',
      ],
      time: '5-7 days',
      icon: Search,
    },
    {
      phase: 3,
      title: 'Physical & Technical Inspection',
      description: 'On-site property assessment and technical evaluation',
      checks: [
        'Structural Integrity Assessment',
        'Boundary Confirmation Survey',
        'Utility Connection Verification',
        'Environmental Risk Assessment',
        'Neighborhood Analysis',
        'Access Road Verification',
      ],
      time: '2-3 days',
      icon: Home,
    },
    {
      phase: 4,
      title: 'Market & Financial Analysis',
      description: 'Comprehensive market valuation and investment analysis',
      checks: [
        'Market Value Appraisal',
        'Comparative Market Analysis',
        'Future Development Potential',
        'ROI Projection Analysis',
        'Tax Implication Review',
        'Hidden Cost Identification',
      ],
      time: '2-4 days',
      icon: Target,
    },
  ]

  const commonIssues = [
    {
      issue: 'Missing Certificate of Occupancy',
      risk: 'High',
      description: 'Property lacks proper government approval',
      solution: 'Require C of O application or seek alternative properties',
    },
    {
      issue: 'Multiple Ownership Claims',
      risk: 'Critical',
      description: 'Family disputes or community claims on property',
      solution: 'Verify all consent documents and family resolutions',
    },
    {
      issue: 'Encroachment Issues',
      risk: 'High',
      description: 'Property boundaries overlap with neighboring lands',
      solution: 'Conduct fresh survey with registered surveyor',
    },
    {
      issue: 'Outstanding Land Charges',
      risk: 'Medium',
      description: 'Unpaid government taxes and levies',
      solution: 'Clear all outstanding payments before purchase',
    },
  ]

  const checklistItems = [
    'Original Certificate of Occupancy',
    'Registered Survey Plan',
    'Deed of Assignment/Conveyance',
    'Government Approval for Excision',
    'Receipts of All Payments Made',
    "Vendor's Valid ID & Photograph",
    'Recent Land Use Charge Receipt',
    'Family Consent Letter (if applicable)',
    'Community Consent (if applicable)',
    'Photographs of Property & Surroundings',
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 bg-linear-to-r from-brand/5 via-white to-brand/5">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand/10 text-brand rounded-full text-sm font-medium mb-6">
              <ShieldCheck className="h-4 w-4" />
              Professional Due Diligence Service
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              Property <span className="text-gold-600">Due Diligence</span>{' '}
              Service
            </h1>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Avoid costly mistakes with our comprehensive property
              verification. We uncover hidden risks before you commit to any
              purchase.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="bg-white p-6 border rounded-xl text-center hover:border-brand/30 transition-colors">
              <div className="text-2xl font-bold text-gray-900 mb-2">₦8.5B</div>
              <div className="text-sm text-gray-600">Fraud Prevented</div>
            </div>
            <div className="bg-white p-6 border rounded-xl text-center hover:border-brand/30 transition-colors">
              <div className="text-2xl font-bold text-gray-900 mb-2">
                2,400+
              </div>
              <div className="text-sm text-gray-600">Properties Verified</div>
            </div>
            <div className="bg-white p-6 border rounded-xl text-center hover:border-brand/30 transition-colors">
              <div className="text-2xl font-bold text-gray-900 mb-2">97%</div>
              <div className="text-sm text-gray-600">Client Satisfaction</div>
            </div>
            <div className="bg-white p-6 border rounded-xl text-center hover:border-brand/30 transition-colors">
              <div className="text-2xl font-bold text-gray-900 mb-2">
                14 Days
              </div>
              <div className="text-sm text-gray-600">Average Timeline</div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="sticky top-0 z-10 bg-white border-b">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex overflow-x-auto gap-1 py-4">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'phases', label: 'Our Process' },
              { id: 'checklist', label: 'Document Checklist' },
              { id: 'risks', label: 'Common Risks' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`px-6 py-3 rounded-lg whitespace-nowrap transition-colors ${
                  activeSection === tab.id
                    ? 'bg-brand text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Overview Section */}
        {activeSection === 'overview' && (
          <div className="space-y-12">
            <div className="prose prose-lg max-w-none">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                What is Property Due Diligence?
              </h2>

              <p className="text-gray-600 mb-6">
                Property due diligence is a comprehensive investigation process
                that verifies all aspects of a real estate transaction before
                finalizing the purchase. It&apos;s your protection against
                fraud, hidden liabilities, and costly legal disputes.
              </p>

              <div className="bg-gold-50 border border-yellow-100 rounded-xl p-6 my-8">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="h-6 w-6 text-gold-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-2">
                      Why Due Diligence is Critical in Nigeria
                    </h3>
                    <p className="text-stone-800">
                      In Nigeria&apos;s complex real estate market, up to 30% of
                      property transactions involve some form of
                      misrepresentation or fraud. Proper due diligence is not
                      optional — it&apos;s essential for protecting your
                      investment.
                    </p>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Who Needs Due Diligence?
              </h3>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="border rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Users className="h-5 w-5 text-brand" />
                    <h4 className="font-medium text-gray-900">
                      Individual Buyers
                    </h4>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Protect your life savings when buying land or building your
                    dream home
                  </p>
                </div>

                <div className="border rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Target className="h-5 w-5 text-brand" />
                    <h4 className="font-medium text-gray-900">
                      Real Estate Investors
                    </h4>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Secure your investment portfolio and ensure sustainable
                    returns
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Phases Section */}
        {activeSection === 'phases' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Our 4-Phase Due Diligence Process
            </h2>

            <div className="space-y-8">
              {phases.map((phase) => {
                const Icon = phase.icon
                return (
                  <div
                    key={phase.phase}
                    className="border rounded-xl p-8 hover:border-brand/30 transition-colors"
                  >
                    <div className="flex flex-col lg:flex-row gap-8">
                      <div className="lg:w-1/3">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="p-3 bg-brand/10 rounded-lg">
                            <Icon className="h-6 w-6 text-brand" />
                          </div>
                          <div>
                            <div className="flex items-center gap-3">
                              <span className="px-3 py-1 bg-brand/10 text-brand text-sm font-medium rounded-full">
                                Phase {phase.phase}
                              </span>
                              <span className="flex items-center gap-1 text-sm text-gray-500">
                                <Clock className="h-4 w-4" />
                                {phase.time}
                              </span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mt-2">
                              {phase.title}
                            </h3>
                          </div>
                        </div>
                        <p className="text-gray-600">{phase.description}</p>
                      </div>

                      <div className="lg:w-2/3">
                        <div className="grid md:grid-cols-2 gap-4">
                          {phase.checks.map((check, index) => (
                            <div key={index} className="flex items-start gap-3">
                              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700">{check}</span>
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
        )}

        {/* Checklist Section */}
        {activeSection === 'checklist' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Required Documents Checklist
              </h2>
              <p className="text-gray-600">
                Gather these documents before starting your due diligence
                process
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="border rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Essential Documents
                </h3>
                <ul className="space-y-3">
                  {checklistItems.slice(0, 5).map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-brand rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Supporting Documents
                </h3>
                <ul className="space-y-3">
                  {checklistItems.slice(5).map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-brand rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-amber-900 mb-2">
                    Important Notice
                  </h3>
                  <p className="text-amber-800">
                    Missing any of these documents significantly increases your
                    risk. If the seller cannot provide these documents, consider
                    it a major red flag.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Risks Section */}
        {activeSection === 'risks' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Common Property Risks We Uncover
              </h2>
              <p className="text-gray-600">
                These are the most frequent issues we encounter during due
                diligence
              </p>
            </div>

            <div className="space-y-6">
              {commonIssues.map((issue, index) => (
                <div
                  key={index}
                  className="border rounded-xl p-6 hover:border-brand/30 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-start gap-6">
                    <div className="md:w-1/3">
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            issue.risk === 'Critical'
                              ? 'bg-red-100 text-red-800'
                              : issue.risk === 'High'
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {issue.risk} Risk
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {issue.issue}
                      </h3>
                    </div>

                    <div className="md:w-2/3">
                      <p className="text-gray-600 mb-4">{issue.description}</p>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <Shield className="h-5 w-5 text-brand mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="font-medium text-gray-900 mb-1">
                              Our Recommended Solution
                            </h4>
                            <p className="text-gray-700">{issue.solution}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <section className="py-16 bg-brand text-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6">
              Protect Your Investment Today
            </h2>

            <p className="text-white/80 max-w-2xl mx-auto mb-8">
              Don&apos;t risk your hard-earned money. Let our experts handle the
              verification while you focus on your investment goals.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-white text-brand hover:bg-white/90"
              >
                <Link
                  href="contact#request"
                  onClick={() => setActiveSection('request')}
                >
                  <Phone className="mr-2 h-5 w-5" />
                  Request Service
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
