'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Calculator,
  CheckCircle,
  FileText,
  Home,
  Shield,
  TrendingDown,
  Users,
} from 'lucide-react'

export default function MortgageFinancingPage() {
  const [propertyPrice, setPropertyPrice] = useState(50000000)
  const [downPayment, setDownPayment] = useState(30)
  const [loanTerm, setLoanTerm] = useState(20)

  const calculateMortgage = () => {
    const loanAmount = propertyPrice * ((100 - downPayment) / 100)
    const annualInterest = 0.18 // 18% annual interest
    const monthlyInterest = annualInterest / 12
    const numberOfPayments = loanTerm * 12

    const monthlyPayment =
      (loanAmount *
        (monthlyInterest * Math.pow(1 + monthlyInterest, numberOfPayments))) /
      (Math.pow(1 + monthlyInterest, numberOfPayments) - 1)

    return Math.round(monthlyPayment)
  }

  const monthlyPayment = calculateMortgage()
  const loanAmount = propertyPrice * ((100 - downPayment) / 100)

  const mortgageTypes = [
    {
      type: 'nhf',
      title: 'National Housing Fund',
      rate: '6%',
      term: 'Up to 30 years',
      features: ['Government-backed', 'Lowest rates', 'Long tenure'],
    },
    {
      type: 'commercial',
      title: 'Commercial Bank',
      rate: '17-20%',
      term: 'Up to 25 years',
      features: ['Widely available', 'Flexible terms', 'Faster processing'],
    },
    {
      type: 'cooperative',
      title: 'Cooperative',
      rate: '14-16%',
      term: 'Up to 25 years',
      features: ['Lower rates', 'Community-based', 'Shared risk'],
    },
    {
      type: 'developer',
      title: 'Developer Finance',
      rate: '15-25%',
      term: 'Up to 10 years',
      features: [
        'Direct financing',
        'Simplified process',
        'Flexible down payment',
      ],
    },
  ]

  const requirements = [
    { item: 'Minimum Age', value: '21 years' },
    { item: 'Minimum Income', value: '₦150,000/month' },
    { item: 'Down Payment', value: '30-50%' },
    { item: 'Employment', value: 'Formal employment or business' },
    { item: 'Credit History', value: 'Clean record required' },
    { item: 'Maximum Age', value: '65 years at maturity' },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-linear-to-b from-brand/5 to-white">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand/10 text-brand rounded-full text-sm font-medium mb-6">
              <Home className="h-4 w-4" />
              Mortgage Financing Solutions
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              Own Your Dream Home with
              <span className="text-gold-600"> Affordable Mortgages</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
              Access competitive mortgage options through our trusted banking
              partners. Flexible terms and expert guidance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-brand text-white rounded-lg hover:bg-brand/95 font-medium">
                Check Eligibility
              </button>
              <button className="px-8 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">
                Talk to Advisor
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Mortgage Calculator */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
            Mortgage Calculator
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Inputs */}
            <div className="p-6 border rounded-lg">
              <div className="flex items-center gap-3 mb-6">
                <Calculator className="h-6 w-6 text-brand" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Calculate Your Payment
                </h3>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">
                      Property Price
                    </label>
                    <span className="font-medium">
                      ₦{propertyPrice.toLocaleString()}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1000000"
                    max="500000000"
                    value={propertyPrice}
                    onChange={(e) => setPropertyPrice(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>₦1M</span>
                    <span>₦500M</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">
                      Down Payment
                    </label>
                    <span className="font-medium">{downPayment}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="70"
                    value={downPayment}
                    onChange={(e) => setDownPayment(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>10%</span>
                    <span>70%</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">
                      Loan Term
                    </label>
                    <span className="font-medium">{loanTerm} years</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="30"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>5 years</span>
                    <span>30 years</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="p-6 bg-linear-to-br from-brand to-brand/95 text-white rounded-lg">
              <h3 className="text-lg font-semibold mb-6">
                Your Monthly Payment
              </h3>

              <div className="text-center mb-8">
                <div className="text-4xl font-bold mb-2">
                  ₦{monthlyPayment.toLocaleString()}
                </div>
                <div className="text-brand/20">per month</div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-brand/20">Loan Amount</span>
                  <span className="font-medium">
                    ₦{Math.round(loanAmount).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand/20">Down Payment</span>
                  <span className="font-medium">
                    ₦{(propertyPrice * (downPayment / 100)).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand/20">Total Interest</span>
                  <span className="font-medium">
                    ₦
                    {(
                      monthlyPayment * loanTerm * 12 -
                      loanAmount
                    ).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand/20">Total Payment</span>
                  <span className="font-medium">
                    ₦{(monthlyPayment * loanTerm * 12).toLocaleString()}
                  </span>
                </div>
              </div>

              <button className="mt-8 w-full py-3 bg-white text-brand rounded-lg hover:bg-gray-100 font-medium">
                Apply Now
              </button>
            </div>
          </div>
        </div>

        {/* Mortgage Types */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
            Mortgage Options
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mortgageTypes.map((type) => (
              <div key={type.type} className="p-5 border rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">{type.title}</h3>
                  <div className="px-3 py-1 bg-brand/10 text-brand text-sm rounded-full">
                    {type.rate}
                  </div>
                </div>
                <div className="text-sm text-gray-600 mb-4">{type.term}</div>
                <div className="space-y-2">
                  {type.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-sm"
                    >
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Requirements */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
            Basic Requirements
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {requirements.map((req, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="text-sm text-gray-600 mb-1">{req.item}</div>
                <div className="font-medium text-gray-900">{req.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mb-12 p-8 bg-linear-to-r from-brand to-brand/95 rounded-2xl text-white">
          <div className="max-w-3xl mx-auto text-center">
            <Shield className="h-12 w-12 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">Ready to Own Your Home?</h2>
            <p className="text-lg text-brand/10 mb-8 max-w-2xl mx-auto">
              Our mortgage advisors will guide you from application to approval.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-white text-brand rounded-lg hover:bg-gray-100 font-semibold">
                Start Application
              </button>
              <a
                href="tel:+2347048000553"
                className="px-8 py-3 border-2 border-white rounded-lg hover:bg-white/10 font-medium"
              >
                Call Mortgage Team
              </a>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
            Why Choose Our Mortgage Services?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Expert Guidance',
                description:
                  'Dedicated mortgage advisors throughout the process',
                icon: Users,
              },
              {
                title: 'Best Rates',
                description: 'Access to competitive rates from multiple banks',
                icon: TrendingDown,
              },
              {
                title: 'Fast Approval',
                description: 'Streamlined process with quick decisions',
                icon: FileText,
              },
            ].map((benefit, index) => {
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

        {/* FAQ */}
        <div className="p-6 border rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Common Mortgage Questions
          </h3>
          <div className="space-y-6">
            {[
              {
                q: 'How long does mortgage approval take?',
                a: 'Preliminary approval takes 48 hours. Full approval takes 2-4 weeks.',
              },
              {
                q: 'What documents are required?',
                a: 'ID, proof of income, employment letter, bank statements, and property documents.',
              },
              {
                q: 'Can diaspora Nigerians apply?',
                a: 'Yes, we have special mortgage programs for Nigerians abroad.',
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
              href="/faqs#mortgage"
              className="text-brand hover:text-brand/95 font-medium"
            >
              View all mortgage FAQs →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
