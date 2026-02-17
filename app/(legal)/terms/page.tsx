'use client'

import { FileText, Scale, Shield } from 'lucide-react'

export default function TermsOfServicePage() {
  const lastUpdated = 'January 21, 2025'

  const sections = [
    {
      title: '1. Agreement to Terms',
      content: `These Terms of Service constitute a legally binding agreement between you and PropertyVision Limited concerning your access to and use of our real estate platform, services, and applications. These Terms apply to all visitors, users, and others who wish to access or use our Services.`,
    },
    {
      title: '2. User Accounts',
      content: `You must provide accurate information and be at least 18 years old. You are responsible for maintaining account security and all activities under your account. Keep your password confidential and update information promptly.`,
    },
    {
      title: '3. Services Description',
      content: `PropertyVision provides property listings, verification services, transaction support, and market intelligence. We are a technology platform, not a real estate broker, agent, or financial advisor. We facilitate connections but do not guarantee transaction outcomes.`,
    },
    {
      title: '4. Prohibited Activities',
      content: `You may not provide false information, engage in fraud, violate laws, harass users, upload malware, or infringe intellectual property. Violations may result in account suspension and legal action.`,
    },
    {
      title: '5. Fees and Payments',
      content: `Service fees apply to verification, advisory, and premium services. Transaction fees may apply to successful property transactions. All fees are displayed in Nigerian Naira (₦). Taxes and additional charges may apply.`,
    },
    {
      title: '6. Intellectual Property',
      content: `The Service and its content are owned by PropertyVision and protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, modify, or publicly display our proprietary material.`,
    },
    {
      title: '7. Disclaimer of Warranties',
      content: `The Service is provided "AS-IS" and "AS AVAILABLE". We disclaim all warranties. We do not warrant that the Service will be uninterrupted, secure, or error-free.`,
    },
    {
      title: '8. Limitation of Liability',
      content: `PropertyVision shall not be liable for indirect, incidental, special, consequential, or punitive damages. Our total liability shall not exceed the amount you have paid to us in the last six months, or ₦100,000, whichever is greater.`,
    },
    {
      title: '9. Governing Law',
      content: `These Terms are governed by the laws of Nigeria. Disputes shall be subject to the exclusive jurisdiction of the courts of Lagos State, Nigeria.`,
    },
    {
      title: '10. Changes to Terms',
      content: `We may modify these Terms at any time. We will post updated Terms on our platform. By continuing to use our Service after changes, you agree to the revised terms.`,
    },
  ]

  const userTypes = [
    {
      type: 'Buyers/Tenants',
      obligations: [
        'Provide accurate information',
        'Conduct due diligence',
        'Make timely payments',
      ],
    },
    {
      type: 'Sellers/Landlords',
      obligations: [
        'Provide truthful property information',
        'Maintain listing accuracy',
        'Honor agreements',
      ],
    },
    {
      type: 'Agents',
      obligations: [
        'Maintain professional standards',
        'Disclose conflicts of interest',
        'Protect client information',
      ],
    },
    {
      type: 'Developers',
      obligations: [
        'Provide accurate project details',
        'Meet legal requirements',
        'Honor warranties',
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Scale className="h-6 w-6 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Terms of Service
            </h1>
          </div>
          <p className="text-gray-600 mb-2">
            Legal agreement governing your use of PropertyVision
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FileText className="h-4 w-4" />
            <span>Effective: {lastUpdated}</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Important Notice */}
        <div className="mb-12 p-6 bg-amber-50 border border-amber-200 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Important Notice
          </h2>
          <p className="text-gray-700">
            By accessing or using PropertyVision&apos;s services, you agree to
            these Terms. If you disagree, you may not access our services.
          </p>
        </div>

        {/* User Responsibilities */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            User Responsibilities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="p-5 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="h-5 w-5 text-blue-600" />
                <h3 className="font-medium text-gray-900">Account Creation</h3>
              </div>
              <ul className="space-y-1.5 text-sm text-gray-700">
                <li>• Must be 18 years or older</li>
                <li>• Provide accurate information</li>
                <li>• Maintain account security</li>
              </ul>
            </div>
            <div className="p-5 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="h-5 w-5 text-blue-600" />
                <h3 className="font-medium text-gray-900">Account Security</h3>
              </div>
              <ul className="space-y-1.5 text-sm text-gray-700">
                <li>• Keep password confidential</li>
                <li>• Don&apos;t share account access</li>
                <li>• Update information promptly</li>
              </ul>
            </div>
          </div>

          <h3 className="text-lg font-medium text-gray-900 mb-4">
            User Type Obligations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userTypes.map((user, idx) => (
              <div key={idx} className="p-4 border rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">{user.type}</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  {user.obligations.map((obligation, oIdx) => (
                    <li key={oIdx}>• {obligation}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Terms Sections */}
        <div className="space-y-10">
          {sections.map((section, index) => (
            <section key={index}>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">
                Legal Department
              </h3>
              <p className="text-gray-600">legal@propertyvisionltd.com</p>
              <p className="text-gray-600">+234 906 009 1554</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">
                Registered Address
              </h3>
              <p className="text-gray-600">
                Didi Mall, Suit LF6A, Adjacent Novare Mall
                <br />
                Sangotedo, Ajah, Lagos
                <br />
                Nigeria
              </p>
            </div>
          </div>
        </div>

        {/* Acceptance */}
        <div className="mt-12 p-6 bg-blue-50 rounded-lg">
          <p className="text-center text-gray-700">
            By using PropertyVision services, you acknowledge that you have
            read, understood, and agree to these Terms of Service.
          </p>
          <div className="text-center mt-4 text-sm text-gray-600">
            Last Updated: {lastUpdated}
          </div>
        </div>
      </div>
    </div>
  )
}
