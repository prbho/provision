// app/how-it-works/page.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Award,
  Building,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  Globe,
  Handshake,
  Home,
  Key,
  MessageSquare,
  Phone,
  Search,
  Shield,
  TrendingUp,
  Users,
  Video,
} from 'lucide-react'

export default function HowItWorksPage() {
  const [activeTab, setActiveTab] = useState<'buy' | 'sell' | 'invest'>('buy')

  const buyingSteps = [
    {
      step: 1,
      title: 'Find Your Property',
      description: 'Search verified properties that match your criteria',
      icon: Search,
      details: [
        'Browse our curated property listings',
        'Use advanced filters to narrow your search',
        'Schedule virtual or in-person viewings',
        'Get neighborhood insights and market data',
      ],
      duration: '1-2 weeks',
    },
    {
      step: 2,
      title: 'Due Diligence',
      description: 'Complete property verification and legal checks',
      icon: Shield,
      details: [
        'Verify Certificate of Occupancy',
        'Check Survey Plan and title documents',
        'Professional property inspection',
        'Review all legal paperwork',
      ],
      duration: '2-3 weeks',
    },
    {
      step: 3,
      title: 'Make an Offer',
      description: 'Negotiate terms and make your purchase offer',
      icon: Handshake,
      details: [
        'Get professional valuation report',
        'Submit formal purchase offer',
        'Negotiate price and terms',
        'Sign purchase agreement',
      ],
      duration: '1-2 weeks',
    },
    {
      step: 4,
      title: 'Closing Process',
      description: 'Complete legal transfer and payment',
      icon: FileText,
      details: [
        'Final mortgage approval (if applicable)',
        'Complete legal documentation',
        'Make payment through secure channels',
        'Receive keys and ownership documents',
      ],
      duration: '2-4 weeks',
    },
    {
      step: 5,
      title: 'Post-Purchase Support',
      description: 'Get settled with ongoing support',
      icon: Key,
      details: [
        'Property handover and orientation',
        'Connect with trusted service providers',
        'Set up property management',
        'Access homeowner resources',
      ],
      duration: '1 week',
    },
  ]

  const sellingSteps = [
    {
      step: 1,
      title: 'Property Valuation',
      description: 'Get accurate market valuation',
      icon: TrendingUp,
      details: [
        'Professional market analysis',
        'Comparative property assessment',
        'Recommended listing price',
        'Market positioning strategy',
      ],
      duration: '1 week',
    },
    {
      step: 2,
      title: 'Property Preparation',
      description: 'Prepare your property for sale',
      icon: Home,
      details: [
        'Professional photography & virtual tour',
        'Staging recommendations',
        'Minor repairs and improvements',
        'Marketing material creation',
      ],
      duration: '1-2 weeks',
    },
    {
      step: 3,
      title: 'Marketing & Showings',
      description: 'Market to qualified buyers',
      icon: Globe,
      details: [
        'Multi-channel marketing campaign',
        'Schedule and conduct viewings',
        'Digital marketing promotion',
        'Open house events',
      ],
      duration: '2-4 weeks',
    },
    {
      step: 4,
      title: 'Offer Review',
      description: 'Evaluate and negotiate offers',
      icon: Handshake,
      details: [
        'Review purchase offers',
        'Negotiate price and terms',
        'Select the best offer',
        'Sign purchase agreement',
      ],
      duration: '1-2 weeks',
    },
    {
      step: 5,
      title: 'Closing & Transfer',
      description: 'Complete sale and transfer ownership',
      icon: FileText,
      details: [
        "Coordinate with buyer's team",
        'Complete legal documentation',
        'Receive payment',
        'Transfer keys and documents',
      ],
      duration: '2-4 weeks',
    },
  ]

  const investingSteps = [
    {
      step: 1,
      title: 'Strategy Session',
      description: 'Define your investment goals',
      icon: DollarSign,
      details: [
        'Assess your financial capacity',
        'Define investment objectives',
        'Determine risk tolerance',
        'Create investment strategy',
      ],
      duration: '1 week',
    },
    {
      step: 2,
      title: 'Property Search',
      description: 'Find investment-grade properties',
      icon: Search,
      details: [
        'Access off-market opportunities',
        'Analyze cash flow potential',
        'Review ROI projections',
        'Evaluate market trends',
      ],
      duration: '2-4 weeks',
    },
    {
      step: 3,
      title: 'Due Diligence',
      description: 'Complete investment analysis',
      icon: Shield,
      details: [
        'Financial feasibility analysis',
        'Legal document verification',
        'Property condition assessment',
        'Risk assessment report',
      ],
      duration: '2-3 weeks',
    },
    {
      step: 4,
      title: 'Acquisition',
      description: 'Purchase and secure the property',
      icon: Building,
      details: [
        'Secure financing (if needed)',
        'Negotiate purchase terms',
        'Complete legal transfer',
        'Property registration',
      ],
      duration: '3-4 weeks',
    },
    {
      step: 5,
      title: 'Management & Growth',
      description: 'Manage and grow your investment',
      icon: TrendingUp,
      details: [
        'Property management setup',
        'Tenant acquisition',
        'Portfolio performance tracking',
        'Exit strategy planning',
      ],
      duration: 'Ongoing',
    },
  ]

  const benefits = [
    {
      title: 'Verified Properties Only',
      description: 'Every property undergoes strict verification',
      icon: Shield,
      color: 'bg-brand',
    },
    {
      title: 'Transparent Process',
      description: 'Clear timelines and no hidden fees',
      icon: FileText,
      color: 'bg-brand',
    },
    {
      title: 'Expert Guidance',
      description: 'Dedicated professionals at every step',
      icon: Users,
      color: 'bg-brand',
    },
    {
      title: 'Digital Convenience',
      description: 'Manage everything online from anywhere',
      icon: Globe,
      color: 'bg-brand',
    },
    {
      title: 'Secure Transactions',
      description: 'Bank-grade security for all payments',
      icon: Shield,
      color: 'bg-brand',
    },
    {
      title: 'Post-Sale Support',
      description: 'Continued support after transaction',
      icon: Award,
      color: 'bg-brand',
    },
  ]

  const faqs = [
    {
      question: 'How long does the buying process take?',
      answer:
        'Typically 8-12 weeks from search to closing, depending on property type and financing.',
    },
    {
      question: 'What documents do I need to buy a property?',
      answer:
        "You'll need valid ID, proof of funds, and tax documents. We guide you through all requirements.",
    },
    {
      question: 'Can I buy property remotely?',
      answer:
        'Yes! We offer full remote purchase services including virtual viewings and digital closing.',
    },
    {
      question: 'How do you verify properties?',
      answer:
        'We verify all legal documents, conduct inspections, and check compliance with regulations.',
    },
    {
      question: 'What are your fees?',
      answer:
        'Our fees are transparent and competitive. We provide a full breakdown before you commit.',
    },
  ]

  const getSteps = () => {
    switch (activeTab) {
      case 'buy':
        return buyingSteps
      case 'sell':
        return sellingSteps
      case 'invest':
        return investingSteps
      default:
        return buyingSteps
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h1>
            <p className="text-gray-600">
              Simple, transparent process for buying, selling, and investing in
              real estate
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Tabs */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row gap-2 mb-8">
            <button
              onClick={() => setActiveTab('buy')}
              className={`px-6 py-3 rounded-lg text-center transition-colors ${
                activeTab === 'buy'
                  ? 'bg-brand text-white'
                  : 'border border-gray-300 hover:border-brand/30 hover:bg-brand/5'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Home className="h-5 w-5" />
                <span className="font-semibold">Buying</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('sell')}
              className={`px-6 py-3 rounded-lg text-center transition-colors ${
                activeTab === 'sell'
                  ? 'bg-brand text-white'
                  : 'border border-gray-300 hover:border-brand/30 hover:bg-brand/5'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <DollarSign className="h-5 w-5" />
                <span className="font-semibold">Selling</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('invest')}
              className={`px-6 py-3 rounded-lg text-center transition-colors ${
                activeTab === 'invest'
                  ? 'bg-brand text-white'
                  : 'border border-gray-300 hover:border-brand/30 hover:bg-brand/5'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <TrendingUp className="h-5 w-5" />
                <span className="font-semibold">Investing</span>
              </div>
            </button>
          </div>

          {/* Process Steps */}
          <div className="space-y-6">
            {getSteps().map((step) => (
              <div
                key={step.step}
                className={`border rounded-lg p-6 transition-colors hover:border-brand/30`}
              >
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center">
                      <step.icon className="h-6 w-6 text-brand" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="px-3 py-1 bg-brand text-white text-sm font-medium rounded-full">
                            Step {step.step}
                          </span>
                          <span className="flex items-center gap-1 text-sm text-gray-500">
                            <Clock className="h-4 w-4" />
                            {step.duration}
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {step.title}
                        </h3>
                        <p className="text-gray-600 mt-1">{step.description}</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                      <ul className="space-y-2">
                        {step.details.map((detail, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 text-sm"
                          >
                            <CheckCircle className="h-4 w-4 text-brand/70 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Why Choose Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 hover:border-brand/30 hover:bg-brand/5 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${benefit.color} shrink-0`}>
                    <benefit.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 hover:border-brand/30 transition-colors"
              >
                <h3 className="font-semibold text-gray-900 mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="p-6 bg-brand/5 border border-brand/20 rounded-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <MessageSquare className="h-5 w-5 text-brand" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Ready to{' '}
                  {activeTab === 'buy'
                    ? 'find your dream home'
                    : activeTab === 'sell'
                      ? 'sell your property'
                      : 'start investing'}
                  ?
                </h3>
              </div>
              <p className="text-gray-700">
                Our experts are here to guide you through every step of the
                process.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/contact"
                className="px-6 py-2 bg-brand text-white rounded-md hover:bg-brand/95 text-center"
              >
                <Phone className="h-4 w-4 inline mr-2" />
                Book Consultation
              </Link>
              <Link
                href="/contact"
                className="px-6 py-2 border border-brand/30 text-brand rounded-md hover:bg-brand/5 text-center"
              >
                <Video className="h-4 w-4 inline mr-2" />
                Virtual Meeting
              </Link>
            </div>
          </div>
        </div>

        {/* Timeline Summary */}
        <div className="mt-12 p-6 border rounded-lg bg-gray-50">
          <h3 className="font-semibold text-gray-900 mb-4 text-center">
            Typical Timeline for{' '}
            {activeTab === 'buy'
              ? 'Buying'
              : activeTab === 'sell'
                ? 'Selling'
                : 'Investing'}
          </h3>
          <div className="flex items-center justify-between">
            {getSteps().map((step, _index) => (
              <div key={step.step} className="text-center">
                <div className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center mx-auto mb-2">
                  {step.step}
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {step.duration}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {step.title.split(' ')[0]}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Total estimated time:{' '}
              <span className="font-semibold text-gray-900">
                {activeTab === 'buy'
                  ? '8-12 weeks'
                  : activeTab === 'sell'
                    ? '7-13 weeks'
                    : '10-14 weeks'}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
