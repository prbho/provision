'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from '@formspree/react'
import { Calendar, CheckCircle, Mail, MapPin, Phone, Send } from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    service: '',
    preferredContact: 'email',
  })

  const [state, handleSubmit] = useForm('mzznvwvy', {
    data: {
      _subject: `PropertyVision Contact: ${formData.subject}`,
      service: formData.service,
      preferredContact: formData.preferredContact,
    },
  })

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const form = e.currentTarget as HTMLFormElement
    const formDataObj = new FormData(form)

    formDataObj.append('service', formData.service)
    formDataObj.append('preferredContact', formData.preferredContact)
    formDataObj.append(
      '_subject',
      `PropertyVision Contact: ${formData.subject}`
    )

    await handleSubmit(formDataObj)

    if (state.succeeded) {
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        service: '',
        preferredContact: 'email',
      })
    }
  }

  const contactInfo = {
    office:
      'Didi Mall, Suit LF6A, Adjacent Novare Mall, Sangotedo, Ajah, Lagos',
    phone: '+234 906 8425 841',
    email: 'propertyvision@gmail.com',
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Contact Us
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get in touch with our real estate experts for any inquiries or
              support.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Send a Message
            </h2>

            {state.succeeded ? (
              <div className="p-8 border rounded-lg text-center">
                <div className="p-3 bg-green-100 text-green-600 rounded-full inline-block mb-4">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Message Sent!
                </h3>
                <p className="text-gray-600 mb-6">
                  We&apos;ll get back to you within 24 hours.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-2 bg-brand text-white rounded-md hover:bg-brand"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      required
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      required
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand"
                    placeholder="+234 800 000 0000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject *
                  </label>
                  <input
                    required
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={(e) => handleChange('subject', e.target.value)}
                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Service
                  </label>
                  <select
                    value={formData.service}
                    onChange={(e) => handleChange('service', e.target.value)}
                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand"
                  >
                    <option value="">Select a service</option>
                    <option value="verification">Property Verification</option>
                    <option value="advisory">Investment Advisory</option>
                    <option value="diaspora">Diaspora Services</option>
                    <option value="mortgage">Mortgage Financing</option>
                    <option value="construction">Construction Services</option>
                    <option value="general">General Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message *
                  </label>
                  <textarea
                    required
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand resize-none"
                    placeholder="Tell us more about what you need..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preferred Contact Method
                  </label>
                  <select
                    value={formData.preferredContact}
                    onChange={(e) =>
                      handleChange('preferredContact', e.target.value)
                    }
                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand"
                  >
                    <option value="email">Email</option>
                    <option value="phone">Phone Call</option>
                    <option value="whatsapp">WhatsApp</option>
                  </select>
                </div>

                {state.errors && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded">
                    <p className="text-sm text-red-600">
                      Please check your form entries and try again.
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={state.submitting}
                  className="w-full p-3 bg-brand text-white rounded-md hover:bg-brand disabled:opacity-50"
                >
                  {state.submitting ? (
                    'Sending...'
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Send className="h-4 w-4" />
                      Send Message
                    </span>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Contact Information
              </h2>

              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <div className="p-3 bg-brand/5 rounded-lg">
                    <Phone className="h-5 w-5 text-brand" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Phone</h3>
                    <a
                      href={`tel:${contactInfo.phone}`}
                      className="text-brand hover:text-brand/95"
                    >
                      {contactInfo.phone}
                    </a>
                    <p className="text-sm text-gray-600 mt-1">
                      Monday - Friday, 8AM - 6PM
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-3 bg-brand/5 rounded-lg">
                    <Mail className="h-5 w-5 text-brand" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Email</h3>
                    <a
                      href={`mailto:${contactInfo.email}`}
                      className="text-brand hover:text-brand"
                    >
                      {contactInfo.email}
                    </a>
                    <p className="text-sm text-gray-600 mt-1">
                      We respond within 24 hours
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-3 bg-brand/5 rounded-lg">
                    <MapPin className="h-5 w-5 text-brand" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Office</h3>
                    <p className="text-gray-700">{contactInfo.office}</p>
                    <a
                      href="https://maps.google.com/?q=50+Emerald+Avenue+Sangotedo+Ajah+Lagos"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-brand hover:text-brand/95 mt-1 inline-block"
                    >
                      Get directions →
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Quick Actions
              </h3>
              <div className="grid gap-3">
                <Link
                  href="/faqs"
                  className="p-4 border rounded-lg hover:bg-gray-50 text-center"
                >
                  <span className="font-medium text-gray-900">Visit FAQ</span>
                  <p className="text-sm text-gray-600 mt-1">
                    Find quick answers
                  </p>
                </Link>
                <Link
                  href="/schedule-meeting"
                  className="p-4 border rounded-lg hover:bg-gray-50 text-center"
                >
                  <Calendar className="h-5 w-5 text-brand mx-auto mb-2" />
                  <span className="font-medium text-gray-900">
                    Schedule Meeting
                  </span>
                  <p className="text-sm text-gray-600 mt-1">
                    Book a call with experts
                  </p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
