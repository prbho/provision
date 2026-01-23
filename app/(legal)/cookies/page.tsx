'use client'

import { useState } from 'react'
import { Cookie, Eye, Settings, Shield } from 'lucide-react'

import { Switch } from '@/components/ui/switch'

export default function CookiePolicyPage() {
  const [cookiePreferences, setCookiePreferences] = useState({
    essential: true,
    analytics: true,
    marketing: false,
    personalization: true,
  })

  const cookieTypes = [
    {
      id: 'essential',
      name: 'Essential Cookies',
      description: 'Required for basic site functionality',
      examples: ['Session management', 'Security', 'Load balancing'],
      necessary: true,
      storage: 'Up to 24 months',
    },
    {
      id: 'analytics',
      name: 'Analytics Cookies',
      description: 'Help us understand how visitors interact',
      examples: ['Visitor counts', 'Page views', 'Bounce rates'],
      necessary: false,
      storage: 'Up to 24 months',
    },
    {
      id: 'marketing',
      name: 'Marketing Cookies',
      description: 'Used to deliver relevant advertisements',
      examples: ['Retargeting', 'Ad performance', 'Conversion tracking'],
      necessary: false,
      storage: 'Up to 12 months',
    },
    {
      id: 'personalization',
      name: 'Personalization Cookies',
      description: 'Remember your preferences and settings',
      examples: ['Language settings', 'Display preferences', 'Saved searches'],
      necessary: false,
      storage: 'Up to 12 months',
    },
  ]

  const handleToggle = (cookieType: string) => {
    setCookiePreferences((prev) => ({
      ...prev,
      [cookieType]: !prev[cookieType as keyof typeof prev],
    }))
  }

  const handleEssentialOnly = () => {
    setCookiePreferences({
      essential: true,
      analytics: false,
      marketing: false,
      personalization: false,
    })
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Cookie className="h-6 w-6 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Cookie Policy</h1>
          </div>
          <p className="text-gray-600">
            Understanding how we use cookies and similar technologies
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Cookie Manager */}
        <div className="mb-12 p-6 bg-gray-50 border rounded-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Manage Your Cookie Preferences
              </h2>
              <p className="text-gray-600 text-sm">
                Control which cookies are used on our site
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() =>
                  setCookiePreferences({
                    essential: true,
                    analytics: true,
                    marketing: true,
                    personalization: true,
                  })
                }
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
              >
                Accept All
              </button>
              <button
                onClick={handleEssentialOnly}
                className="px-4 py-2 bg-white border text-gray-700 text-sm rounded-md hover:bg-gray-50"
              >
                Essential Only
              </button>
            </div>
          </div>
        </div>

        {/* Cookie Types */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Types of Cookies We Use
          </h2>
          <div className="space-y-4">
            {cookieTypes.map((cookie) => (
              <div key={cookie.id} className="p-5 border rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-medium text-gray-900">{cookie.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {cookie.description}
                    </p>
                  </div>
                  {!cookie.necessary && (
                    <Switch
                      checked={
                        cookiePreferences[
                          cookie.id as keyof typeof cookiePreferences
                        ]
                      }
                      onCheckedChange={() => handleToggle(cookie.id)}
                    />
                  )}
                </div>
                <div className="text-sm text-gray-700 mb-3">
                  <span className="font-medium">Storage:</span> {cookie.storage}
                </div>
                <div className="text-sm">
                  <span className="font-medium text-gray-700">Examples:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {cookie.examples.map((example, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                      >
                        {example}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How We Use Cookies */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            How We Use Cookies
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 border rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Settings className="h-5 w-5 text-blue-600" />
                <h3 className="font-medium text-gray-900">
                  Site Functionality
                </h3>
              </div>
              <p className="text-sm text-gray-600">
                Enable basic functions like page navigation and access to secure
                areas
              </p>
            </div>
            <div className="p-5 border rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Eye className="h-5 w-5 text-blue-600" />
                <h3 className="font-medium text-gray-900">Analytics</h3>
              </div>
              <p className="text-sm text-gray-600">
                Understand how visitors interact with our platform to improve it
              </p>
            </div>
            <div className="p-5 border rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="h-5 w-5 text-blue-600" />
                <h3 className="font-medium text-gray-900">Security</h3>
              </div>
              <p className="text-sm text-gray-600">
                Protect your account and prevent fraudulent activities
              </p>
            </div>
            <div className="p-5 border rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-5 w-5 flex items-center justify-center">
                  <span className="text-blue-600 text-lg">☆</span>
                </div>
                <h3 className="font-medium text-gray-900">Personalization</h3>
              </div>
              <p className="text-sm text-gray-600">
                Remember your preferences to provide a tailored experience
              </p>
            </div>
          </div>
        </div>

        {/* Third-Party Cookies */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Third-Party Cookies
          </h2>
          <p className="text-gray-700 mb-4">
            We may use cookies from trusted services like Google Analytics for
            website traffic analysis, Facebook Pixel for marketing insights, and
            payment processors for secure transactions.
          </p>
          <p className="text-gray-600 text-sm">
            These third-party cookies are subject to their respective privacy
            policies.
          </p>
        </div>

        {/* Managing Cookies */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Managing Your Cookies
          </h2>
          <div className="p-5 bg-gray-50 border rounded-lg">
            <h3 className="font-medium text-gray-900 mb-3">Browser Settings</h3>
            <p className="text-gray-700 text-sm mb-4">
              Most web browsers allow you to control cookies through settings.
              You can:
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                Delete existing cookies
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                Block future cookies
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                Set preferences for specific sites
              </li>
            </ul>
          </div>
        </div>

        {/* Updates & Contact */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Updates to This Policy
            </h2>
            <p className="text-gray-700">
              We may update this Cookie Policy from time to time. We encourage
              you to review it periodically.
            </p>
          </div>

          <div className="p-5 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-3">
              Questions About Cookies?
            </h3>
            <p className="text-gray-700 text-sm mb-2">
              Contact us at privacy@propertyvision.com
            </p>
            <p className="text-gray-600 text-xs">
              Subject: Cookie Policy Inquiry
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
