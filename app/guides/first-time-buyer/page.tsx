'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  Calculator,
  CheckCircle,
  DollarSign,
  FileText,
} from 'lucide-react'

export default function FirstTimeBuyerGuide() {
  const [activeStep, setActiveStep] = useState(1)

  const steps = [
    {
      number: 1,
      title: 'Financial Preparation',
      description: 'Assess your budget and savings',
      details: [
        'Determine your budget (20-30% of income)',
        'Save for down payment (10-30% of property value)',
        'Check your credit score (aim for 650+)',
        'Get pre-approved for mortgage',
      ],
    },
    {
      number: 2,
      title: 'Property Search',
      description: 'Find verified properties',
      details: [
        'Research neighborhoods and locations',
        'View verified property listings',
        'Schedule property viewings',
        'Compare prices and features',
      ],
    },
    {
      number: 3,
      title: 'Due Diligence',
      description: 'Verify legal documents and property',
      details: [
        'Check Certificate of Occupancy',
        'Verify Survey Plan',
        'Conduct property inspection',
        'Review all legal documents',
      ],
    },
    {
      number: 4,
      title: 'Negotiation & Offer',
      description: 'Make your offer and negotiate',
      details: [
        'Make a formal offer',
        'Negotiate price and terms',
        'Sign purchase agreement',
        'Pay deposit',
      ],
    },
    {
      number: 5,
      title: 'Closing',
      description: 'Complete the purchase',
      details: [
        'Final mortgage approval',
        'Complete legal paperwork',
        'Pay closing costs',
        'Receive keys and documents',
      ],
    },
  ]

  const tools = [
    {
      title: 'Mortgage Calculator',
      description: 'Calculate monthly payments',
      icon: Calculator,
      href: '/mortgage-calculator',
    },
    {
      title: 'Budget Planner',
      description: 'Plan your property budget',
      icon: DollarSign,
      href: '/tools/budget-planner',
    },
    {
      title: 'Checklist',
      description: 'Complete buying checklist',
      icon: FileText,
      href: '/downloads/buyer-checklist.pdf',
    },
  ]

  const mistakes = [
    'Skipping property inspection',
    'Not verifying legal documents',
    'Overlooking location factors',
    'Ignoring hidden costs',
    'Making emotional decisions',
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              First-Time Home Buyer Guide
            </h1>
            <p className="text-gray-600">
              A step-by-step guide to buying your first property in Nigeria
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Steps */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            5-Step Buying Process
          </h2>
          <div className="space-y-4">
            {steps.map((step) => (
              <div
                key={step.number}
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  activeStep === step.number
                    ? 'border-brand0 bg-brand/5'
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
                    {step.number}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {step.title}
                      </h3>
                      <ArrowRight
                        className={`h-4 w-4 ${
                          activeStep === step.number
                            ? 'text-brand'
                            : 'text-gray-400'
                        }`}
                      />
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {step.description}
                    </p>
                    {activeStep === step.number && (
                      <ul className="space-y-2">
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
            Helpful Tools
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

        {/* Mistakes to Avoid */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Common Mistakes to Avoid
          </h2>
          <div className="p-4 border border-gold-50 bg-yellow-50 rounded-lg">
            <ul className="space-y-2">
              {mistakes.map((mistake, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="w-2 h-2 bg-gold-600 rounded-full mt-1.5"></span>
                  <span className="text-gray-700">{mistake}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="p-6 bg-brand/5 border border-brand/20 rounded-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Need help buying your first home?
              </h3>
              <p className="text-gray-700">
                Our experts guide first-time buyers through every step.
              </p>
            </div>
            <Link
              href="/conteact"
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
