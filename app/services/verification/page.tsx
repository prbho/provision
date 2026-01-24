// app/services/verification/page.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  FileCheck,
  Mail,
  MessageSquare,
  Phone,
  Search,
  Shield,
  ShieldCheck,
} from 'lucide-react'

export default function PropertyVerificationPage() {
  const verificationSteps = [
    {
      step: 1,
      title: 'Document Verification',
      description:
        'We authenticate all legal paperwork to ensure your property has proper documentation',
      checks: [
        'Certificate of Occupancy',
        'Survey Plan',
        'Deed of Assignment',
        "Governor's Consent",
      ],
      time: '2-3 days',
      icon: FileCheck,
      color: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      step: 2,
      title: 'Physical Inspection',
      description:
        'Our inspectors visit the property to verify its condition and boundaries',
      checks: [
        'Structural Integrity',
        'Utility Connections',
        'Boundary Confirmation',
        'Neighborhood Assessment',
      ],
      time: '1-2 days',
      icon: Search,
      color: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      step: 3,
      title: 'Title History Search',
      description:
        'We trace the ownership history to uncover any hidden issues',
      checks: [
        'Previous Owners',
        'Liens & Encumbrances',
        'Court Cases',
        'Legal Disputes',
      ],
      time: '3-5 days',
      icon: Clock,
      color: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      step: 4,
      title: 'Fraud Risk Assessment',
      description:
        'Comprehensive analysis to identify potential fraud or security threats',
      checks: [
        'Document Forgery Risk',
        'Seller Identity Verification',
        'Transaction History',
        'Market Price Validation',
      ],
      time: '1-2 days',
      icon: ShieldCheck,
      color: 'bg-red-50',
      iconColor: 'text-red-600',
    },
  ]

  const redFlags = [
    'Missing Certificate of Occupancy',
    'Unregistered Survey Plan',
    'Price significantly below market rate',
    'Seller avoids physical meetings',
    'Pressure for quick payment without due diligence',
    'Inconsistent property history or documentation',
    'Agent unwilling to provide references',
    'No proof of ownership transfer chain',
  ]

  const [formData, setFormData] = useState({
    address: '',
    propertyType: 'residential',
    email: '',
    phone: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="py-16 bg-white border-b">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand/10 text-brand rounded-full text-sm font-medium mb-6">
              <Shield className="h-4 w-4" />
              Fraud Protection Service
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              Property <span className="text-gold-600">Verification</span>{' '}
              Service
            </h1>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Eliminate the risk of property fraud with our comprehensive
              verification process. We check everything so you can invest with
              confidence.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="p-6 border rounded-xl text-center hover:border-brand/30 transition-colors">
              <div className="text-3xl font-bold text-gray-900 mb-2">
                5,000+
              </div>
              <div className="text-sm text-gray-600">Properties Verified</div>
            </div>
            <div className="p-6 border rounded-xl text-center hover:border-brand/30 transition-colors">
              <div className="text-3xl font-bold text-gray-900 mb-2">₦42B</div>
              <div className="text-sm text-gray-600">Fraud Prevented</div>
            </div>
            <div className="p-6 border rounded-xl text-center hover:border-brand/30 transition-colors">
              <div className="text-3xl font-bold text-gray-900 mb-2">99.8%</div>
              <div className="text-sm text-gray-600">Accuracy Rate</div>
            </div>
            <div className="p-6 border rounded-xl text-center hover:border-brand/30 transition-colors">
              <div className="text-3xl font-bold text-gray-900 mb-2">24hrs</div>
              <div className="text-sm text-gray-600">Emergency Response</div>
            </div>
          </div>
        </div>
      </section>

      {/* Verification Process */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-brand rounded-full"></div>
              <span className="text-sm font-medium text-brand">
                OUR PROCESS
              </span>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How We Verify Properties
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our 4-step verification process leaves no stone unturned
            </p>
          </div>

          <div className="space-y-6">
            {verificationSteps.map((step) => {
              const Icon = step.icon
              return (
                <div
                  key={step.step}
                  className="bg-white border rounded-xl p-8 hover:border-brand/30 transition-colors"
                >
                  <div className="flex items-start gap-6">
                    <div className="shrink-0">
                      <div className={`p-4 rounded-xl ${step.color}`}>
                        <Icon className={`h-7 w-7 ${step.iconColor}`} />
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="px-3 py-1 bg-brand/10 text-brand text-sm font-medium rounded-full">
                              Step {step.step}
                            </span>
                            <span className="flex items-center gap-1 text-sm text-gray-500">
                              <Clock className="h-4 w-4" />
                              {step.time}
                            </span>
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900">
                            {step.title}
                          </h3>
                          <p className="text-gray-600 mt-2">
                            {step.description}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {step.checks.map((check, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <div className="shrink-0">
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            </div>
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
      </section>

      {/* Red Flags & Request Form */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Red Flags */}
            <div>
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 mb-4">
                  <div className="h-1 w-8 bg-red-500 rounded-full"></div>
                  <span className="text-sm font-medium text-red-600">
                    WARNING SIGNS
                  </span>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Common Red Flags
                </h2>
              </div>

              <div className="border border-red-100 bg-red-50 rounded-xl p-6">
                <div className="flex items-start gap-3 mb-6">
                  <AlertTriangle className="h-6 w-6 text-red-600 shrink-0 mt-0.5" />
                  <p className="text-red-800">
                    Watch out for these warning signs when dealing with property
                    transactions
                  </p>
                </div>

                <div className="space-y-3">
                  {redFlags.map((flag, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="shrink-0 w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                      <span className="text-red-700">{flag}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Request Form */}
            <div>
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 mb-4">
                  <div className="h-1 w-8 bg-brand rounded-full"></div>
                  <span className="text-sm font-medium text-brand">
                    GET STARTED
                  </span>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Request Verification
                </h2>
              </div>

              <div className="border rounded-xl p-6 bg-white">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Property Address
                    </label>
                    <input
                      type="text"
                      placeholder="Enter full property address"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:border-brand focus:ring-2 focus:ring-brand/20"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Property Type
                      </label>
                      <select
                        className="w-full p-3 border border-gray-300 rounded-lg focus:border-brand focus:ring-2 focus:ring-brand/20"
                        value={formData.propertyType}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            propertyType: e.target.value,
                          })
                        }
                      >
                        <option value="residential">Residential</option>
                        <option value="commercial">Commercial</option>
                        <option value="land">Land</option>
                        <option value="industrial">Industrial</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Email
                      </label>
                      <input
                        type="email"
                        placeholder="you@example.com"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:border-brand focus:ring-2 focus:ring-brand/20"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full p-3 bg-brand text-white rounded-lg hover:bg-brand/90 transition-colors font-medium"
                  >
                    Start Verification Process
                  </button>

                  <p className="text-sm text-gray-500 text-center">
                    Our team will contact you within 2 hours
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ & Support */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {/* FAQ Preview */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Common Questions
              </h3>

              <div className="space-y-6">
                <div className="border-b pb-6">
                  <div className="font-medium text-gray-900 mb-2">
                    How long does verification take?
                  </div>
                  <p className="text-gray-600">
                    Complete verification takes 7-12 business days depending on
                    document availability and property location. Emergency
                    verification available within 48 hours.
                  </p>
                </div>

                <div className="border-b pb-6">
                  <div className="font-medium text-gray-900 mb-2">
                    What documents are needed?
                  </div>
                  <p className="text-gray-600">
                    Certificate of Occupancy, Survey Plan, proof of ownership,
                    and any previous transaction documents. We`&apos;ll guide
                    you through the complete list.
                  </p>
                </div>

                <div className="pb-2">
                  <div className="font-medium text-gray-900 mb-2">
                    Is my information secure?
                  </div>
                  <p className="text-gray-600">
                    Yes. All documents and personal information are encrypted
                    and stored securely. We never share your data without
                    permission.
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  href="/faqs#verification"
                  className="inline-flex items-center gap-2 text-brand hover:text-brand/90 font-medium"
                >
                  View all verification FAQs
                  <span>→</span>
                </Link>
              </div>
            </div>

            {/* Support */}
            <div>
              <div className="p-6 bg-brand/5 border border-brand/20 rounded-xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-brand/10 rounded-lg">
                    <MessageSquare className="h-6 w-6 text-brand" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Need immediate help?
                    </h3>
                    <p className="text-sm text-gray-600">
                      Our verification experts are ready to assist you
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <a
                    href="mailto:verification@propertyvisionltd.com"
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-white border rounded-lg hover:border-brand/30 transition-colors"
                  >
                    <Mail className="h-5 w-5 text-gray-600" />
                    <span className="font-medium">Send us an email</span>
                  </a>

                  <a
                    href="tel:+2347048000553"
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-brand text-white rounded-lg hover:bg-brand/90 transition-colors"
                  >
                    <Phone className="h-5 w-5" />
                    <span className="font-medium">
                      Call our verification team
                    </span>
                  </a>
                </div>

                <div className="mt-6 pt-6 border-t border-brand/20">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5 text-brand" />
                    <span className="text-sm text-gray-700">
                      Average response time: 15 minutes
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
