'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Calendar,
  CheckCircle,
  ClipboardCheck,
  DollarSign,
  Hammer,
  HardHat,
  Mail,
  Phone,
  ShieldCheck,
  TrendingUp,
  Users,
  Video,
} from 'lucide-react'

export default function ConstructionServicePage() {
  const [projectType, setProjectType] = useState<string>('residential')

  const projectTypes = [
    {
      id: 'residential',
      label: 'Residential',
      description: 'Homes, apartments, estates',
    },
    {
      id: 'commercial',
      label: 'Commercial',
      description: 'Office spaces, retail, hotels',
    },
    {
      id: 'industrial',
      label: 'Industrial',
      description: 'Warehouses, factories',
    },
    {
      id: 'renovation',
      label: 'Renovation',
      description: 'Remodeling, upgrades',
    },
  ]

  const verifiedDevelopers = [
    {
      name: 'PrimeBuild Limited',
      specialty: 'Luxury Residential',
      completed: 42,
      rating: '4.9/5',
      locations: ['Lagos', 'Abuja', 'Port Harcourt'],
    },
    {
      name: 'UrbanSpace Developers',
      specialty: 'Commercial Complexes',
      completed: 28,
      rating: '4.8/5',
      locations: ['Lagos', 'Abuja'],
    },
    {
      name: 'GreenHomes Construction',
      specialty: 'Sustainable Buildings',
      completed: 35,
      rating: '4.9/5',
      locations: ['Lagos', 'Ibadan'],
    },
    {
      name: 'MetroBuild Group',
      specialty: 'Industrial Projects',
      completed: 19,
      rating: '4.7/5',
      locations: ['Lagos', 'Abuja', 'Kano'],
    },
  ]

  const verificationProcess = [
    {
      step: 'Document Verification',
      description: 'Company registration, licenses, and insurance validation',
      checks: ['CAC Registration', 'Tax Compliance', 'Insurance Coverage'],
      icon: BadgeCheck,
    },
    {
      step: 'Track Record Analysis',
      description: 'Review of past projects and client testimonials',
      checks: ['Completed Projects', 'Client References', 'Timeline Adherence'],
      icon: ClipboardCheck,
    },
    {
      step: 'Financial Health Check',
      description: 'Assessment of financial stability and payment systems',
      checks: [
        'Bank Statements',
        'Supplier Payment History',
        'Project Financing',
      ],
      icon: DollarSign,
    },
    {
      step: 'Ongoing Monitoring',
      description: 'Continuous quality assurance throughout projects',
      checks: ['Site Inspections', 'Progress Reports', 'Client Feedback'],
      icon: ShieldCheck,
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-linear-to-b from-brand/10 to-white">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand/10 text-brand rounded-full text-sm font-medium mb-6">
              <HardHat className="h-4 w-4" />
              Verified Construction Services
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              Build with
              <span className="text-gold-600"> Confidence</span>, Not
              Assumptions
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
              Connect with pre-vetted construction companies and developers that
              meet strict quality, legal, and delivery standards.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-brand/95 text-white rounded-lg hover:bg-brand font-medium">
                Find Verified Developers
              </button>
              <button className="px-8 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">
                Book Free Consultation
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {[
              { value: '200+', label: 'Verified Companies', icon: Building2 },
              { value: '95%', label: 'On-Time Completion', icon: Calendar },
              { value: '₦85B', label: 'Projects Managed', icon: TrendingUp },
              { value: '98%', label: 'Client Satisfaction', icon: Users },
            ].map((stat, index) => (
              <div key={index} className="p-4 text-center">
                <div className="p-3 bg-white rounded-lg shadow-sm inline-block mb-3">
                  <stat.icon className="h-6 w-6 text-brand" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Project Types */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
            Construction Projects We Manage
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {projectTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setProjectType(type.id)}
                className={`p-4 rounded-lg text-center ${projectType === type.id ? 'bg-brand text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                <div className="font-semibold mb-1">{type.label}</div>
                <div className="text-sm">{type.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Verification Process */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our 4-Step Verification Process
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Every construction company undergoes rigorous screening before
              joining our platform.
            </p>
          </div>

          <div className="space-y-8">
            {verificationProcess.map((step, index) => {
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
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {step.checks.map((check, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
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

        {/* Verified Developers */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold text-gray-900">
              Featured Verified Developers
            </h2>
            <Link
              href="/developers"
              className="text-brand hover:text-brand/95 font-medium inline-flex items-center gap-1"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {verifiedDevelopers.map((developer, index) => (
              <div
                key={index}
                className="p-6 border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {developer.name}
                  </h3>
                  <div className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                    {developer.rating}
                  </div>
                </div>
                <div className="text-gray-600 mb-4">{developer.specialty}</div>
                <div className="flex items-center gap-6 text-sm">
                  <div>
                    <div className="font-medium text-gray-900">
                      {developer.completed}
                    </div>
                    <div className="text-gray-600">Projects</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {developer.locations.join(', ')}
                    </div>
                    <div className="text-gray-600">Locations</div>
                  </div>
                </div>
                <button className="mt-6 w-full py-2 border border-brand text-brand/95 rounded-md hover:bg-brand/50">
                  Request Quote
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mb-12 p-8 bg-linear-to-r from-brand to-brand/95 rounded-2xl text-white">
          <div className="max-w-3xl mx-auto text-center">
            <ShieldCheck className="h-12 w-12 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">
              Start Your Construction Project with Confidence
            </h2>
            <p className="text-lg text-brand/10 mb-8 max-w-2xl mx-auto">
              Get matched with verified developers and receive 3 free quotes for
              your project.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-white text-brand rounded-lg hover:bg-gray-100 font-semibold">
                Get Free Quotes
              </button>
              <a
                href="tel:+2347048000553"
                className="px-8 py-3 border-2 border-white rounded-lg hover:bg-white/10 font-medium"
              >
                Call Construction Team
              </a>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
            Why Choose Verified Construction?
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: 'Fraud Protection',
                description:
                  'All companies are vetted for legal compliance and track record',
                icon: ShieldCheck,
              },
              {
                title: 'Quality Assurance',
                description: 'Regular site inspections and progress monitoring',
                icon: BadgeCheck,
              },
              {
                title: 'Transparent Pricing',
                description: 'Clear cost breakdowns with no hidden charges',
                icon: DollarSign,
              },
              {
                title: 'Timely Delivery',
                description: 'Project milestones and deadline tracking',
                icon: Calendar,
              },
            ].map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <div key={index} className="p-5 border rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-brand/5 rounded-lg">
                      <Icon className="h-5 w-5 text-brand" />
                    </div>
                    <h3 className="font-semibold text-gray-900">
                      {benefit.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-12 p-6 border rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Common Construction Questions
          </h3>
          <div className="space-y-6">
            {[
              {
                q: 'How do you verify construction companies?',
                a: 'We check CAC registration, tax compliance, insurance, past projects, client references, and financial stability.',
              },
              {
                q: 'What happens if a project is delayed?',
                a: 'We mediate between client and contractor, enforce penalty clauses, and provide progress updates.',
              },
              {
                q: 'Can I get financing for my construction project?',
                a: 'Yes, we partner with banks offering construction finance with our verified developers.',
              },
            ].map((faq, index) => (
              <div key={index}>
                <div className="font-semibold text-gray-900 mb-2">{faq.q}</div>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Link
              href="/faqs#construction"
              className="text-brand hover:text-brand font-medium inline-flex items-center gap-1"
            >
              View all construction FAQs <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Contact Options */}
        <div className="grid md:grid-cols-3 gap-6">
          <a
            href="mailto:construction@propertyvision.com"
            className="p-6 border rounded-lg hover:bg-brand/5 text-center"
          >
            <Mail className="h-8 w-8 text-brand mx-auto mb-3" />
            <div className="font-semibold text-gray-900 mb-1">
              Email Support
            </div>
            <div className="text-sm text-gray-600">
              construction@propertyvision.com
            </div>
          </a>
          <a
            href="/contact/virtual-site-tour"
            className="p-6 border rounded-lg hover:bg-brand/5 text-center"
          >
            <Video className="h-8 w-8 text-brand mx-auto mb-3" />
            <div className="font-semibold text-gray-900 mb-1">
              Virtual Site Tour
            </div>
            <div className="text-sm text-gray-600">
              See ongoing projects live
            </div>
          </a>
          <a
            href="tel:+2347048000553"
            className="p-6 border rounded-lg hover:bg-brand/5 text-center"
          >
            <Phone className="h-8 w-8 text-brand mx-auto mb-3" />
            <div className="font-semibold text-gray-900 mb-1">
              Call Construction Team
            </div>
            <div className="text-sm text-gray-600">+234 906 8425 841</div>
          </a>
        </div>
      </div>
    </div>
  )
}
