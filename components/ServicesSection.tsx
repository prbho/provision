// app/components/services-section.tsx
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  CheckCircle,
  ChevronRight,
  FileCheck2Icon,
  LucideShieldCheck,
  ShieldPlusIcon,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export default function ServicesSection() {
  const services = [
    {
      id: 1,
      title: 'Verified Listings Only',
      description:
        'Every property passes legal and physical checks before appearing on the platform.',
      icon: LucideShieldCheck,
      buttonText: 'View Verified Listings',
      href: '/properties?type=buy',
      featured: true,
    },
    {
      id: 2,
      title: 'Due Diligence Report',
      description:
        'We investigate ownership, land history, and documents to expose hidden risks.',
      icon: FileCheck2Icon,
      buttonText: 'Find Safe Properties',
      href: '/services/due-diligence',
    },
    {
      id: 3,
      title: 'Fraud Protection',
      description:
        'Protection against fake documents, impersonation, and fraudulent sellers.',
      icon: ShieldPlusIcon,
      buttonText: 'Request Verification',
      href: '/services/verification',
      badge: 'Most Popular',
    },
    {
      id: 4,
      title: 'Trusted by Investors',
      description:
        'Used by serious buyers and investors across 1,000+ verified properties.',
      icon: CheckCircle,
      buttonText: 'List a Property',
      href: '/properties/post',
    },
  ]

  const features = [
    'Legal document verification',
    'Physical property inspection',
    'Title deed validation',
    'No fake listings',
    'Transparent pricing',
    'Secure transactions',
  ]

  return (
    <section className="pb-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            A verified real estate platform
            <span className="block text-brand mt-2">built to protect you</span>
          </h2>

          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Everything we offer is designed to reduce risk and protect your
            money.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.4,
                delay: index * 0.05,
                ease: 'easeOut',
              }}
              className={`
                relative rounded-lg border p-6 flex flex-col bg-white
                ${service.featured ? 'border-brand/30 bg-brand/5' : 'border-gray-200'}
                hover:border-brand/30 transition-colors
              `}
            >
              {/* Top Accent */}
              {service.featured && (
                <div className="absolute inset-x-0 top-0 h-1 rounded-t-lg bg-brand" />
              )}

              {/* Badge */}
              {service.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-brand text-white px-4 py-1 rounded-full border-0 shadow-sm">
                    {service.badge}
                  </Badge>
                </div>
              )}

              {/* Icon */}
              <div className="mx-auto mt-2 mb-5 flex h-16 w-16 items-center justify-center rounded-xl bg-brand/10">
                <service.icon className="h-8 w-8 text-brand" />
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-center text-gray-900 mb-3">
                {service.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-center text-sm leading-relaxed mb-6 grow">
                {service.description}
              </p>

              {/* CTA */}
              <Button
                asChild
                size="lg"
                className={`
                  w-full rounded-md font-medium text-sm
                  ${
                    service.featured
                      ? 'bg-brand text-white hover:bg-brand/90'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }
                `}
              >
                <Link
                  href={service.href}
                  className="flex items-center justify-center gap-2"
                >
                  <span>{service.buttonText}</span>
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Features List */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-12"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
            Every Property Includes
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.05,
                  ease: 'easeOut',
                }}
                className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-brand/30 transition-colors"
              >
                <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                <span className="text-sm text-gray-700">{feature}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="p-6 bg-brand/5 border border-brand/20 rounded-lg"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Ready to find your perfect property?
              </h3>
              <p className="text-gray-700">
                Browse our verified listings or speak with a property
                specialist.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/properties"
                className="px-6 py-2 bg-brand text-white rounded-md hover:bg-brand/95 text-center"
              >
                View Properties
              </Link>
              <Link
                href="/contact"
                className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-center"
              >
                Book Consultation
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
