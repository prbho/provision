'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  BarChart3,
  CheckCircle,
  ChevronRight,
  Home,
  LineChart,
  PieChart,
  Shield,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react'

export default function InvestmentAdvisoryPage() {
  const [selectedService, setSelectedService] = useState<string | null>(null)

  const services = [
    {
      id: 'strategy',
      title: 'Investment Strategy & Planning',
      subtitle: 'Tailored real estate investment guidance',
      icon: Target,
      features: [
        'Investor Risk Profiling',
        'Verified Property Selection',
        'Portfolio Diversification Planning',
        'Exit & Resale Strategy',
      ],
      description:
        'Personalized investment roadmap based on your goals, risk tolerance, and timeline.',
    },
    {
      id: 'analysis',
      title: 'Market Intelligence & Analysis',
      subtitle: 'Data-backed market insights',
      icon: BarChart3,
      features: [
        'Location Growth & Demand Analysis',
        'Rental Yield & ROI Forecasting',
        'Market Trend Reports',
        'Comparable Property Evaluation',
      ],
      description:
        'Make informed decisions with comprehensive market data and predictive analytics.',
    },
    {
      id: 'management',
      title: 'Wealth & Asset Management',
      subtitle: 'Long-term real estate wealth planning',
      icon: PieChart,
      features: [
        'Asset Allocation Strategy',
        'Tax & Compliance Planning',
        'Estate & Legacy Planning Support',
        'Multi-Property Portfolio Management',
      ],
      description:
        'Optimize your real estate portfolio for wealth preservation and growth.',
    },
  ]

  const investmentTypes = [
    {
      label: 'First-time Investor',
      description: 'Starting your investment journey',
    },
    {
      label: 'Portfolio Growth',
      description: 'Expanding existing investments',
    },
    { label: 'Retirement Planning', description: 'Building long-term wealth' },
    {
      label: 'Institutional Investor',
      description: 'Corporate or fund investments',
    },
  ]

  const successStories = [
    { metric: 'Average ROI', value: '18.5%', icon: TrendingUp },
    { metric: 'Portfolio Growth', value: '42%', icon: LineChart },
    { metric: 'Client Satisfaction', value: '97%', icon: Users },
    { metric: 'Properties Managed', value: '1,200+', icon: Home },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-linear-to-b from-brand/5 to-white">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand/10 text-brand rounded-full text-sm font-medium mb-6">
              <TrendingUp className="h-4 w-4" />
              Premium Investment Advisory
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Build Wealth Through
              <span className="text-gold-600"> Smart Real Estate</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Professional guidance to maximize returns and minimize risks in
              your real estate investments.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-brand text-white rounded-lg hover:bg-brand/95 font-medium">
                Book Free Consultation
              </button>
              <a
                href="#services"
                className="px-8 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
              >
                Explore Services
              </a>
            </div>
          </div>

          {/* Success Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {successStories.map((item, index) => {
              const Icon = item.icon
              return (
                <div key={index} className="p-4 text-center">
                  <div className="p-3 bg-white rounded-lg shadow-sm inline-block mb-3">
                    <Icon className="h-6 w-6 text-brand" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {item.value}
                  </div>
                  <div className="text-sm text-gray-600">{item.metric}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Services */}
        <div id="services" className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Comprehensive Investment Services
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              End-to-end advisory solutions designed to optimize your real
              estate investments.
            </p>
          </div>

          <div className="space-y-8">
            {services.map((service) => {
              const Icon = service.icon
              return (
                <div
                  key={service.id}
                  className={`p-6 border-2 rounded-xl cursor-pointer transition-all hover:border-brand hover:shadow-lg ${selectedService === service.id ? 'border-brand bg-brand/5' : 'border-gray-200'}`}
                  onClick={() =>
                    setSelectedService(
                      selectedService === service.id ? null : service.id
                    )
                  }
                >
                  <div className="flex items-start gap-6">
                    <div className="p-4 bg-brand/5 rounded-lg">
                      <Icon className="h-8 w-8 text-brand" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">
                            {service.title}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {service.subtitle}
                          </p>
                        </div>
                        <ChevronRight
                          className={`h-5 w-5 text-gray-400 transition-transform ${selectedService === service.id ? 'rotate-90' : ''}`}
                        />
                      </div>
                      <p className="text-gray-700 mb-4">
                        {service.description}
                      </p>

                      {(selectedService === service.id ||
                        service.id === 'strategy') && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {service.features.map((feature, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2"
                            >
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="text-gray-700">{feature}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Investment Types */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
            Investment Types We Serve
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {investmentTypes.map((type, index) => (
              <div
                key={index}
                className="p-5 border rounded-lg hover:border-brand/30 hover:shadow-md transition-shadow"
              >
                <div className="font-semibold text-gray-900 mb-2">
                  {type.label}
                </div>
                <p className="text-sm text-gray-600">{type.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Process */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                step: '1',
                title: 'Initial Assessment',
                description: 'Understand your goals and risk profile',
              },
              {
                step: '2',
                title: 'Strategy Development',
                description: 'Create personalized investment plan',
              },
              {
                step: '3',
                title: 'Property Selection',
                description: 'Identify and verify opportunities',
              },
              {
                step: '4',
                title: 'Ongoing Management',
                description: 'Monitor and optimize portfolio',
              },
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-brand/10 text-brand rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mb-12 p-8 bg-linear-to-r from-brand/95 to-brand rounded-2xl text-white">
          <div className="max-w-3xl mx-auto text-center">
            <Shield className="h-12 w-12 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">
              Ready to Build Your Real Estate Portfolio?
            </h2>
            <p className="text-lg text-green-100 mb-8 max-w-2xl mx-auto">
              Schedule a free consultation with our investment experts. No
              commitments, just professional advice.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-white text-brand rounded-lg hover:bg-gray-100 font-semibold">
                Book Free Strategy Session
              </button>
              <a
                href="tel:+2347048000553"
                className="px-8 py-3 border-2 border-white rounded-lg hover:bg-white/10 font-medium"
              >
                Call Investment Team
              </a>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
            Investor Success Stories
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote:
                  'Increased my portfolio value by 35% in 18 months with their strategic guidance.',
                author: 'Adebayo Johnson',
                role: 'Portfolio Investor',
              },
              {
                quote:
                  'The market analysis helped me avoid a bad investment and find a better opportunity.',
                author: 'Chinwe Okonkwo',
                role: 'First-time Investor',
              },
              {
                quote:
                  'Professional estate planning saved my family thousands in taxes and legal fees.',
                author: 'Emeka Nwankwo',
                role: 'Retirement Planner',
              },
            ].map((testimonial, index) => (
              <div key={index} className="p-6 border rounded-lg">
                <div className="text-gray-700 mb-4 italic">
                  &quot;{testimonial.quote}&quot;
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.author}
                  </div>
                  <div className="text-sm text-gray-600">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Preview */}
        <div className="p-6 border rounded-lg mb-12">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Common Investment Questions
          </h3>
          <div className="space-y-4">
            {[
              {
                q: 'What is the minimum investment amount?',
                a: 'We work with investors at all levels, starting from ₦5 million.',
              },
              {
                q: 'How are advisory fees structured?',
                a: 'Transparent fee structure based on services used. No hidden charges.',
              },
              {
                q: 'Can I invest remotely?',
                a: 'Yes, we provide full virtual support for remote investors.',
              },
            ].map((faq, index) => (
              <div key={index}>
                <div className="font-medium text-gray-900 mb-1">{faq.q}</div>
                <p className="text-gray-600 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Link
              href="/faqs#investment"
              className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1"
            >
              View all investment FAQs <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
