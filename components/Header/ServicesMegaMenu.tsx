'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  Award,
  BarChart,
  Building,
  Calculator,
  CheckCircle,
  CreditCard,
  DollarSign,
  FileCheck,
  Globe,
  Home,
  Lock,
  Shield,
  TrendingUp,
} from 'lucide-react'

interface ServicesMegaMenuProps {
  onClose?: () => void
}

export default function ServicesMegaMenu({ onClose }: ServicesMegaMenuProps) {
  const [activeCategory, setActiveCategory] = useState<string>('verification')

  const categories = [
    {
      id: 'verification',
      label: 'Verification & Due Diligence',
      icon: Shield,
      description: 'Ensure your property is safe and legally sound',
    },
    {
      id: 'investment',
      label: 'Investment Advisory',
      icon: TrendingUp,
      description: 'Maximize returns with expert guidance',
    },
    {
      id: 'diaspora',
      label: 'Diaspora Services',
      icon: Globe,
      description: 'Invest in Nigeria from anywhere in the world',
    },
    {
      id: 'mortgage',
      label: 'Mortgage & Financing',
      icon: DollarSign,
      description: 'Secure the best financing options',
    },
    {
      id: 'construction',
      label: 'Development & Construction',
      icon: Building,
      description: 'Build your dream property with confidence',
    },
  ]

  const serviceContent = {
    verification: [
      {
        title: 'Property Verification',
        description: 'Legal and ownership verification',
        icon: FileCheck,
        features: [
          'Certificate of Occupancy Validation',
          'Title & Deed Authentication',
          'Survey Plan & Boundary Confirmation',
        ],
        link: '/services/verification',
      },
      {
        title: 'Comprehensive Due Diligence',
        description: 'Full property investigation service',
        icon: Shield,
        features: [
          '4-Phase Verification Process',
          'Title History Investigation',
          'Risk Assessment & Recommendations',
        ],
        link: '/services/due-diligence',
      },
      {
        title: 'Physical Inspection',
        description: 'On-site inspection by professionals',
        icon: Home,
        features: [
          'Structural & Condition Assessment',
          'Utility & Infrastructure Verification',
          'Neighborhood Review',
        ],
        link: '/services/verification',
      },
      {
        title: 'Fraud Risk Assessment',
        description: 'Comprehensive fraud prevention',
        icon: Lock,
        features: [
          'Seller & Agent Verification',
          'Document Risk Detection',
          'Ownership History Review',
        ],
        link: '/services/verification',
      },
    ],

    investment: [
      {
        title: 'Investment Strategy',
        description: 'Tailored investment guidance',
        icon: BarChart,
        features: [
          'Investor Risk Profiling',
          'Property Selection Strategy',
          'Portfolio Diversification',
        ],
        link: '/services/investment',
      },
      {
        title: 'Market Intelligence',
        description: 'Data-backed market insights',
        icon: TrendingUp,
        features: [
          'Location Growth Analysis',
          'Rental Yield Forecasting',
          'Market Trend Reports',
        ],
        link: '/services/investment',
      },
      {
        title: 'Wealth Management',
        description: 'Long-term wealth planning',
        icon: DollarSign,
        features: [
          'Asset Allocation Strategy',
          'Tax & Compliance Planning',
          'Portfolio Management',
        ],
        link: '/services/investment',
      },
    ],

    diaspora: [
      {
        title: 'Remote Property Purchase',
        description: 'Buy property without being present',
        icon: Globe,
        features: [
          'Verified Property Listings',
          'Virtual Inspections',
          'Remote Due Diligence',
        ],
        link: '/services/diaspora',
      },
      {
        title: 'International Payments',
        description: 'Transparent fund transfers',
        icon: CreditCard,
        features: [
          'Cross-Border Payments',
          'Currency Conversion Support',
          'Payment Tracking',
        ],
        link: '/services/diaspora',
      },
    ],

    mortgage: [
      {
        title: 'Mortgage Pre-Qualification',
        description: 'Know what you qualify for',
        icon: FileCheck,
        features: [
          'Document Preparation',
          'Lender Matching',
          'Interest Rate Comparison',
        ],
        link: '/services/mortgage',
      },
      {
        title: 'Loan Optimization',
        description: 'Secure the best loan terms',
        icon: Calculator,
        features: [
          'Interest Rate Optimization',
          'Loan Tenure Structuring',
          'Refinancing Advisory',
        ],
        link: '/services/mortgage',
      },
    ],

    construction: [
      {
        title: 'Project Management',
        description: 'Professional oversight',
        icon: Building,
        features: [
          'Contractor Selection',
          'Budget Control',
          'Quality Assurance',
        ],
        link: '/services/construction',
      },
      {
        title: 'Design & Planning',
        description: 'Architectural services',
        icon: Award,
        features: [
          'Architectural Drawings',
          'Interior Planning',
          'Planning Approvals',
        ],
        link: '/services/construction',
      },
    ],
  }

  const activeServices =
    serviceContent[activeCategory as keyof typeof serviceContent] || []

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Sidebar - Categories */}
        <div className="lg:w-1/3">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Our Services
            </h3>
            <p className="text-sm text-gray-600">
              Expert solutions for every real estate need
            </p>
          </div>

          <div className="space-y-2">
            {categories.map((category) => {
              const Icon = category.icon
              const isActive = activeCategory === category.id

              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 border rounded-lg text-sm transition-all ${
                    isActive
                      ? 'bg-brand/10 text-brand border-brand/20 font-medium'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 border-transparent'
                  }`}
                >
                  <div
                    className={`p-2 rounded ${isActive ? 'bg-white' : 'bg-gray-100'}`}
                  >
                    <Icon
                      className={`h-4 w-4 ${isActive ? 'text-brand' : 'text-gray-600'}`}
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium">{category.label}</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {category.description}
                    </div>
                  </div>
                  {isActive && (
                    <ArrowRight className="h-4 w-4 ml-2 text-brand" />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Main Content - Services */}
        <div className="lg:w-2/3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeServices.map((service, index) => {
              const Icon = service.icon

              return (
                <div
                  key={index}
                  className="border rounded-lg p-4 hover:border-brand/30 transition-colors"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-2 bg-brand/10 rounded">
                      <Icon className="h-5 w-5 text-brand" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">
                        {service.title}
                      </h4>
                      <p className="text-xs text-gray-600 mt-1">
                        {service.description}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-xs text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Link
                    href={service.link}
                    className="mt-4 inline-flex items-center text-xs text-brand hover:text-brand/80 font-medium"
                    onClick={onClose}
                  >
                    Learn more
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Link>
                </div>
              )
            })}
          </div>

          {/* View All Link */}
          <div className="mt-6 pt-4 border-t">
            <Link
              href={`/services/${activeCategory === 'verification' ? 'verification' : activeCategory}`}
              className="inline-flex items-center text-sm text-brand hover:text-brand/80 font-medium"
              onClick={onClose}
            >
              View all {categories.find((c) => c.id === activeCategory)?.label}
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
