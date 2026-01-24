'use client'

import { FileText, Lock, Shield } from 'lucide-react'

export default function PrivacyPolicyPage() {
  const lastUpdated = 'January 21, 2025'

  const sections = [
    {
      id: 'introduction',
      title: '1. Introduction',
      content: `PropertyVision is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our real estate platform and services. We comply with Nigerian data protection laws, including the Nigeria Data Protection Regulation (NDPR).`,
    },
    {
      id: 'information-we-collect',
      title: '2. Information We Collect',
      content: `We collect information you provide directly, such as name, email, phone number, and property details. We also collect technical information like IP address and usage data. Property and financial information is collected for verification and transaction purposes.`,
    },
    {
      id: 'how-we-use',
      title: '3. How We Use Your Information',
      content: `We use your information to provide and improve our services, verify properties, communicate with you, comply with laws, and analyze platform usage. Marketing communications are sent only with your consent where required.`,
    },
    {
      id: 'data-sharing',
      title: '4. Data Sharing',
      content: `We may share information with service providers, legal authorities when required, and business partners involved in your transaction. We never sell your personal information to third parties for marketing purposes.`,
    },
    {
      id: 'your-rights',
      title: '5. Your Data Protection Rights',
      content: `You have rights to access, correct, delete, and object to processing of your data. You can withdraw consent and request data portability. Contact us to exercise these rights.`,
    },
    {
      id: 'data-security',
      title: '6. Data Security',
      content: `We implement security measures including encryption, secure servers, and access controls. However, no transmission method over the Internet is 100% secure.`,
    },
    {
      id: 'cookies',
      title: '7. Cookies & Tracking',
      content: `We use cookies to track activity on our platform. You can control cookies through your browser settings. See our Cookie Policy for details.`,
    },
    {
      id: 'children',
      title: "8. Children's Privacy",
      content: `Our services are not directed to individuals under 18. We do not knowingly collect personal information from children.`,
    },
    {
      id: 'changes',
      title: '9. Changes to Policy',
      content: `We may update this Privacy Policy. We will notify you by posting the new policy here and updating the "Last Updated" date.`,
    },
  ]

  const dataCategories = [
    {
      title: 'Personal Information',
      items: [
        'Name, email, phone number',
        'Date of birth, gender',
        'Address, nationality',
      ],
    },
    {
      title: 'Property Information',
      items: [
        'Property details you list',
        'Verification documents',
        'Transaction history',
      ],
    },
    {
      title: 'Financial Information',
      items: ['Payment details', 'Income information', 'Tax identification'],
    },
    {
      title: 'Technical Information',
      items: [
        'IP address, browser type',
        'Device information',
        'Usage patterns',
      ],
    },
  ]

  const rights = [
    'Access your personal data',
    'Correct inaccurate data',
    'Delete your data under certain conditions',
    'Object to data processing',
    'Receive your data in machine-readable format',
    'Withdraw consent at any time',
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
          </div>
          <p className="text-gray-600 mb-2">
            How we protect and handle your information
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FileText className="h-4 w-4" />
            <span>Last Updated: {lastUpdated}</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Introduction Notice */}
        <div className="mb-12 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Your Privacy Matters
          </h2>
          <p className="text-gray-700">
            By using PropertyVision services, you acknowledge this Privacy
            Policy. If you disagree, you may not access our services.
          </p>
        </div>

        {/* Data Categories */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Information We Collect
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dataCategories.map((category, idx) => (
              <div key={idx} className="p-5 border rounded-lg">
                <h3 className="font-medium text-gray-900 mb-3">
                  {category.title}
                </h3>
                <ul className="space-y-1.5 text-sm text-gray-600">
                  {category.items.map((item, itemIdx) => (
                    <li key={itemIdx}>• {item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Security */}
        <div className="mb-12 p-6 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start gap-4">
            <Lock className="h-6 w-6 text-green-600 shrink-0" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Data Security
              </h3>
              <p className="text-gray-700 text-sm">
                We implement security measures including encryption, secure
                servers, and access controls. However, no method of transmission
                over the Internet is 100% secure.
              </p>
            </div>
          </div>
        </div>

        {/* Your Rights */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Your Data Protection Rights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rights.map((right, idx) => (
              <div key={idx} className="p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">{right}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-700">
              To exercise these rights, contact us at{' '}
              <a
                href="mailto:privacy@propertyvisionltd.com"
                className="text-blue-600 font-medium"
              >
                privacy@propertyvisionltd.com
              </a>
              . We respond within 30 days as required by law.
            </p>
          </div>
        </div>

        {/* Policy Sections */}
        <div className="space-y-10">
          {sections.map((section) => (
            <section key={section.id} id={section.id}>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                {section.title}
              </h2>
              <p className="text-gray-700 leading-relaxed">{section.content}</p>
            </section>
          ))}
        </div>

        {/* Contact */}
        <div className="mt-12 pt-8 border-t">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Contact Information
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-1">Privacy Team</h3>
              <p className="text-gray-600">privacy@propertyvisionltd.com</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-1">
                Data Protection Officer
              </h3>
              <p className="text-gray-600">dpo@propertyvisionltd.com</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-1">
                Registered Address
              </h3>
              <p className="text-gray-600">
                Didi Mall, Suit LF6A, Adjacent Novare Mall
                <br />
                Sangotedo, Ajah, Lagos, Nigeria
              </p>
            </div>
          </div>
        </div>

        {/* Final Notice */}
        <div className="mt-12 p-6 bg-gray-50 rounded-lg">
          <p className="text-center text-gray-700">
            By using PropertyVision services, you acknowledge that you have read
            and understood this Privacy Policy.
          </p>
          <div className="text-center mt-4 text-sm text-gray-600">
            Last Updated: {lastUpdated}
          </div>
        </div>
      </div>
    </div>
  )
}
