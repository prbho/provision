'use client'

import { useState } from 'react'
import {
  Building2,
  ChevronDown,
  DollarSign,
  HelpCircle,
  KeyRound,
  Mail,
  Search,
  ShieldCheck,
  UserCircle,
} from 'lucide-react'

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [openSection, setOpenSection] = useState<string | null>('general')

  const faqSections = [
    {
      id: 'general',
      title: 'General Questions',
      icon: HelpCircle,
      questions: [
        {
          q: 'What is PropertyVision?',
          a: 'PropertyVision is a real estate platform that connects property buyers, sellers, agents, and developers in Nigeria. We provide property listings, verification services, and transaction support.',
        },
        {
          q: 'Is PropertyVision free to use?',
          a: 'Yes, browsing and creating an account is free. Some premium services like property verification and agent features have associated fees.',
        },
        {
          q: 'Do I need to create an account to browse properties?',
          a: 'No, you can browse properties without an account. However, you need an account to save properties, contact agents, and use other features.',
        },
      ],
    },
    {
      id: 'accounts',
      title: 'Accounts & Registration',
      icon: UserCircle,
      questions: [
        {
          q: 'How do I create an account?',
          a: 'Click "Sign Up" in the top right corner. You can register with your email or phone number. You\'ll need to verify your email or phone to activate your account.',
        },
        {
          q: 'I forgot my password. How can I reset it?',
          a: 'Click "Forgot Password" on the login page. Enter your email or phone number, and we\'ll send you instructions to reset your password.',
        },
        {
          q: 'How do I update my profile information?',
          a: 'Log in to your account, go to "My Profile" in the dashboard, and click "Edit Profile". You can update your information there.',
        },
        {
          q: 'Can I have multiple accounts?',
          a: 'No, each user should have only one account. Multiple accounts may be suspended for violating our terms of service.',
        },
      ],
    },
    {
      id: 'properties',
      title: 'Properties & Listings',
      icon: Building2,
      questions: [
        {
          q: 'How do I list my property for sale or rent?',
          a: 'Log in to your account, go to your dashboard, and click "List Property". You\'ll need to provide property details, photos, and pricing information.',
        },
        {
          q: 'How long does property verification take?',
          a: 'Property verification typically takes 3-5 business days. We verify ownership, documents, and property details to ensure accuracy.',
        },
        {
          q: 'Can I edit my property listing after posting?',
          a: 'Yes, you can edit your listing at any time. Go to your dashboard, find the property, and click "Edit Listing".',
        },
        {
          q: 'How do I mark a property as sold or rented?',
          a: 'Go to your property listing in the dashboard and select "Mark as Sold/Rented". This helps keep our platform updated.',
        },
      ],
    },
    {
      id: 'agents',
      title: 'For Agents',
      icon: KeyRound,
      questions: [
        {
          q: 'How do I become a verified agent on PropertyVision?',
          a: "Apply through the agent registration page. You'll need to provide your real estate license and other professional documentation for verification.",
        },
        {
          q: 'What are the benefits of being a verified agent?',
          a: 'Verified agents get priority placement, access to analytics tools, direct client connections, and can list more properties.',
        },
        {
          q: 'How much does it cost to become a verified agent?',
          a: "There's a monthly subscription fee for verified agents. Contact our sales team for current pricing and plans.",
        },
      ],
    },
    {
      id: 'payments',
      title: 'Payments & Fees',
      icon: DollarSign,
      questions: [
        {
          q: 'What payment methods do you accept?',
          a: 'We accept bank transfers, debit/credit cards, and other popular payment methods in Nigeria. All transactions are secure.',
        },
        {
          q: 'Are there any hidden fees?',
          a: "No, all fees are clearly stated before you commit to any service. You'll see a complete breakdown before payment.",
        },
        {
          q: 'How do I request a refund?',
          a: 'Contact our support team with your transaction details. Refunds are processed according to our refund policy.',
        },
      ],
    },
    {
      id: 'safety',
      title: 'Safety & Security',
      icon: ShieldCheck,
      questions: [
        {
          q: 'How does PropertyVision ensure property listings are legitimate?',
          a: 'We verify property documents, ownership, and agent credentials. We also have user reporting systems to flag suspicious listings.',
        },
        {
          q: 'What should I do if I encounter a suspicious listing or user?',
          a: 'Click the "Report" button on the listing or contact our support team immediately with details.',
        },
        {
          q: 'Is my personal information safe?',
          a: 'Yes, we protect your data with encryption and follow Nigerian data protection regulations. See our Privacy Policy for details.',
        },
      ],
    },
  ]

  const filteredQuestions = searchQuery
    ? faqSections.flatMap((section) =>
        section.questions
          .filter(
            (q) =>
              q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
              q.a.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((question) => ({ ...question, sectionTitle: section.title }))
      )
    : []

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-brand/5 rounded-lg">
              <HelpCircle className="h-6 w-6 text-brand" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Frequently Asked Questions
            </h1>
          </div>
          <p className="text-gray-600">
            Find answers to common questions about PropertyVision
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Search */}
        <div className="mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search for questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
            />
          </div>
          {searchQuery && (
            <div className="mt-2 text-sm text-gray-500">
              Found {filteredQuestions.length} result
              {filteredQuestions.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>

        {/* Search Results */}
        {searchQuery && filteredQuestions.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Search Results
            </h2>
            <div className="space-y-4">
              {filteredQuestions.map((item, index) => (
                <div key={index} className="p-5 border rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">
                    {item.sectionTitle}
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">{item.q}</h3>
                  <p className="text-gray-700">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {searchQuery && filteredQuestions.length === 0 && (
          <div className="mb-12 p-8 text-center border rounded-lg">
            <div className="text-gray-400 mb-4">No results found</div>
            <p className="text-gray-600">
              Try different keywords or browse the categories below
            </p>
          </div>
        )}

        {/* FAQ Sections */}
        {!searchQuery && (
          <div className="space-y-6">
            {faqSections.map((section) => {
              const Icon = section.icon
              return (
                <div key={section.id} className="border rounded-lg">
                  <button
                    onClick={() =>
                      setOpenSection(
                        openSection === section.id ? null : section.id
                      )
                    }
                    className="w-full p-6 flex items-center justify-between hover:bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-brand/5 rounded-lg">
                        <Icon className="h-5 w-5 text-brand" />
                      </div>
                      <h2 className="text-lg font-semibold text-gray-900 text-left">
                        {section.title}
                      </h2>
                    </div>
                    <ChevronDown
                      className={`h-5 w-5 text-gray-400 transition-transform ${
                        openSection === section.id ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {openSection === section.id && (
                    <div className="px-6 pb-6">
                      <div className="space-y-5">
                        {section.questions.map((item, index) => (
                          <div
                            key={index}
                            className="pt-5 border-t first:border-t-0 first:pt-0"
                          >
                            <h3 className="font-medium text-gray-900 mb-2">
                              {item.q}
                            </h3>
                            <p className="text-gray-700 text-sm">{item.a}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Still Have Questions */}
        <div className="mt-12 p-6 bg-brand/5 border border-brand/20 rounded-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Still have questions?
              </h3>
              <p className="text-gray-700">
                Can&apos;t find what you&apos;re looking for? Our support team
                is here to help.
              </p>
            </div>
            <div className="flex gap-3">
              <a
                href="mailto:support@propertyvisionltd.com"
                className="flex items-center gap-2 px-4 py-2 bg-brand/90 text-white text-sm rounded-md hover:bg-brand"
              >
                <Mail className="h-4 w-4" />
                Email Support
              </a>
              <a
                href="/contact"
                className="px-4 py-2 bg-white border text-gray-700 text-sm rounded-md hover:bg-gray-50"
              >
                Contact Form
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
