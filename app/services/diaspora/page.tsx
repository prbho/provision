'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  FileCheck,
  FileSearch,
  Globe,
  Home,
  MapPin,
  MessageSquare,
  Phone,
  ShieldCheck,
  Users,
  Video,
} from 'lucide-react'

export default function DiasporaServicesPage() {
  const [selectedRegion, setSelectedRegion] = useState<string>('all')

  const regions = [
    { id: 'north_america', name: 'North America', flag: '🇺🇸🇨🇦', count: 245 },
    { id: 'europe', name: 'Europe', flag: '🇬🇧🇪🇺', count: 187 },
    { id: 'middle_east', name: 'Middle East', flag: '🇦🇪🇸🇦', count: 132 },
    { id: 'asia', name: 'Asia Pacific', flag: '🇸🇬🇦🇺', count: 98 },
    { id: 'africa', name: 'Rest of Africa', flag: '🇬🇭🇿🇦', count: 76 },
  ]

  const services = [
    {
      icon: ShieldCheck,
      title: 'End-to-End Verification',
      description: 'Complete due diligence on properties and sellers',
      features: [
        'Agent & Developer Verification',
        'Title & Document Authentication',
        'No Fraud Guarantee',
        'Secure Escrow Services',
      ],
    },
    {
      icon: Home,
      title: 'Virtual Property Tours',
      description: 'Experience properties remotely before buying',
      features: [
        'HD Video Walkthroughs',
        'Live Virtual Tours',
        '360° Property Views',
        'Neighborhood Exploration',
      ],
    },
    {
      icon: FileSearch,
      title: 'Legal & Documentation',
      description: 'Handle all paperwork and legal compliance',
      features: [
        'C of O Verification',
        'Deed of Assignment',
        "Governor's Consent Processing",
        'Power of Attorney Setup',
      ],
    },
    {
      icon: Users,
      title: 'Property Management',
      description: 'Complete management for remote owners',
      features: [
        'Tenant Screening & Management',
        'Rent Collection',
        'Maintenance & Repairs',
        'Regular Property Reports',
      ],
    },
  ]

  const successStories = [
    {
      location: 'Lagos, Nigeria',
      investment: '$85,000',
      returns: '22% annual ROI',
      story: 'Purchased a 3-bedroom apartment in Lekki remotely from Canada',
      name: 'Oluwaseun A.',
      country: 'Canada',
    },
    {
      location: 'Abuja, Nigeria',
      investment: '$120,000',
      returns: '18% annual ROI',
      story: 'Bought land in Maitama while working in Dubai',
      name: 'Chinedu O.',
      country: 'UAE',
    },
    {
      location: 'Port Harcourt, Nigeria',
      investment: '$65,000',
      returns: '25% annual ROI',
      story: 'Invested in student housing from the United Kingdom',
      name: 'Amina B.',
      country: 'UK',
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-linear-to-b from-blue-50 to-white">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand/10 text-brand rounded-full text-sm font-medium mb-6">
              <Globe className="h-4 w-4" />
              Serving Nigerians Worldwide
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              Invest in Nigerian Real Estate from
              <span className="text-gold-600"> Anywhere in the World</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
              Complete property buying, verification, and management services
              for Nigerians living abroad.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-brand/95 text-white rounded-lg hover:bg-brand font-medium">
                Book Free Consultation
              </button>
              <button className="px-8 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">
                Watch Video Demo
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {[
              { value: '2,500+', label: 'Diaspora Clients', icon: Users },
              {
                value: '$150M+',
                label: 'Property Value Secured',
                icon: DollarSign,
              },
              {
                value: '100%',
                label: 'Fraud-Free Transactions',
                icon: ShieldCheck,
              },
              { value: '24/7', label: 'Global Support', icon: Clock },
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
        {/* Regions */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
            Serving Nigerians Across the Globe
          </h2>
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <button
              onClick={() => setSelectedRegion('all')}
              className={`px-6 py-3 rounded-lg font-medium ${selectedRegion === 'all' ? 'bg-brand text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              All Regions
            </button>
            {regions.map((region) => (
              <button
                key={region.id}
                onClick={() => setSelectedRegion(region.id)}
                className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 ${selectedRegion === region.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                {region.name}
                <span className="text-xs bg-white/20 px-2 py-1 rounded"></span>
              </button>
            ))}
          </div>
        </div>

        {/* Services */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Complete Diaspora Services
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From property search to management, we handle everything for you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon
              return (
                <div
                  key={index}
                  className="p-6 border-2 border-brand/10 rounded-xl bg-white hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 bg-brand/5 rounded-lg">
                      <Icon className="h-8 w-8 text-brand" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">
                        {service.title}
                      </h3>
                      <p className="text-gray-600">{service.description}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-brand/60" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
            Simple 4-Step Process
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                step: '1',
                title: 'Free Consultation',
                description: 'Discuss your investment goals and budget',
                icon: MessageSquare,
              },
              {
                step: '2',
                title: 'Property Selection',
                description: 'We find and verify suitable properties',
                icon: FileCheck,
              },
              {
                step: '3',
                title: 'Virtual Verification',
                description: 'Live tours, document checks, and due diligence',
                icon: Video,
              },
              {
                step: '4',
                title: 'Secure Purchase',
                description: 'We handle all transactions and paperwork',
                icon: ShieldCheck,
              },
            ].map((step, index) => {
              const Icon = step.icon
              return (
                <div
                  key={index}
                  className="text-center p-6 border rounded-lg hover:border-brand/30 transition-colors"
                >
                  <div className="w-12 h-12 bg-brand/10 text-brand rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4">
                    {step.step}
                  </div>
                  <Icon className="h-8 w-8 text-brand mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Success Stories */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
            Success Stories from Diaspora Clients
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <div key={index} className="p-6 border rounded-lg">
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="h-5 w-5 text-brand" />
                  <div>
                    <div className="font-semibold text-gray-900">
                      {story.location}
                    </div>
                    <div className="text-sm text-gray-600">{story.country}</div>
                  </div>
                </div>
                <p className="text-gray-700 mb-4 italic">
                  &quot;{story.story}&quot;
                </p>
                <div className="flex justify-between pt-4 border-t">
                  <div>
                    <div className="text-sm text-gray-600">Investment</div>
                    <div className="font-semibold">{story.investment}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Returns</div>
                    <div className="font-semibold text-brand/60">
                      {story.returns}
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-right">
                  <span className="text-gray-900">{story.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mb-12 p-8 bg-linear-to-r from-brand/95 to-brand rounded-2xl text-white">
          <div className="max-w-3xl mx-auto text-center">
            <Globe className="h-12 w-12 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">
              Start Your Nigerian Real Estate Journey Today
            </h2>
            <p className="text-lg text-green-100 mb-8 max-w-2xl mx-auto">
              Join thousands of Nigerians abroad who are building wealth back
              home with confidence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-white text-brand rounded-lg hover:bg-gray-100 font-semibold">
                Schedule Free Strategy Call
              </button>
              <a
                href="tel:+2347048000553"
                className="px-8 py-3 border-2 border-white rounded-lg hover:bg-white/10 font-medium"
              >
                Call Diaspora Team
              </a>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-12 p-6 border rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Common Diaspora Questions
          </h3>
          <div className="space-y-6">
            {[
              {
                q: 'How do I send money from abroad for property purchase?',
                a: 'We work with approved financial partners for secure international transfers. We also help with CBN requirements.',
              },
              {
                q: 'Can I get a Nigerian mortgage as a diaspora?',
                a: 'Yes, we partner with banks that offer diaspora mortgage schemes with competitive rates.',
              },
              {
                q: 'What if I need to sell my property while abroad?',
                a: 'We provide complete resale services including valuation, marketing, and transaction handling.',
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
              href="/faqs#diaspora"
              className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1"
            >
              View all diaspora FAQs <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Contact Options */}
        <div className="grid md:grid-cols-3 gap-6">
          <a
            href="mailto:diaspora@propertyvisionltd.com"
            className="p-6 border rounded-lg hover:bg-blue-50 text-center"
          >
            <MessageSquare className="h-8 w-8 text-brand mx-auto mb-3" />
            <div className="font-semibold text-gray-900 mb-1">
              Email Support
            </div>
            <div className="text-sm text-gray-600">
              diaspora@propertyvisionltd.com
            </div>
          </a>
          <a
            href="/contact/virtual-meeting"
            className="p-6 border rounded-lg hover:bg-blue-50 text-center"
          >
            <Calendar className="h-8 w-8 text-brand mx-auto mb-3" />
            <div className="font-semibold text-gray-900 mb-1">
              Virtual Meeting
            </div>
            <div className="text-sm text-gray-600">Schedule a video call</div>
          </a>
          <a
            href="https://wa.me/2347048000553"
            target="_blank"
            className="p-6 border rounded-lg hover:bg-blue-50 text-center"
          >
            <Phone className="h-8 w-8 text-brand mx-auto mb-3" />
            <div className="font-semibold text-gray-900 mb-1">WhatsApp</div>
            <div className="text-sm text-gray-600">+234 906 8425 841</div>
          </a>
        </div>
      </div>
    </div>
  )
}
