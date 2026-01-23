// app/components/cta-banner.tsx
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { BarChart, CheckCircle, Shield, TrendingUp } from 'lucide-react'

import { Button } from '@/components/ui/button'

export default function CTABannerCentered() {
  return (
    <section className="px-4 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-lg"
      >
        {/* Background */}
        <div className="absolute inset-0 bg-linear-to-r from-brand/95 via-brand/90 to-brand/80" />

        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 px-6 py-12 md:p-12">
          <div className="max-w-3xl mx-auto text-center">
            {/* Headline */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-2xl md:text-3xl font-bold text-white mb-4"
            >
              Invest With Confidence
            </motion.h2>

            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Every property is vetted, verified, and approved before it reaches
              you
            </p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8"
            >
              {[
                { value: '1,000+', label: 'Verified Properties' },
                { value: '₦8B+', label: 'Transactions' },
                { value: '99%', label: 'Satisfaction' },
                { value: 'Zero', label: 'Fraud Listings' },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-white/70">{stat.label}</div>
                </div>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
            >
              <Button
                asChild
                size="lg"
                className="bg-white text-brand hover:bg-white/90 px-8 py-3"
              >
                <Link
                  href="/properties?verified=true"
                  className="flex items-center justify-center gap-2"
                >
                  <Shield className="h-5 w-5" />
                  <span>Browse Verified Properties</span>
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white/30 text-white  px-8 py-3 bg-gold-600 hover:bg-gold-600/95"
              >
                <Link
                  href="/how-verification-works"
                  className="flex items-center justify-center gap-2 "
                >
                  <BarChart className="h-5 w-5" />
                  <span>How Verification Works</span>
                </Link>
              </Button>
            </motion.div>

            {/* Trust Signals */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-white/70"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>Independent due diligence</span>
              </div>
              <div className="hidden sm:block">•</div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>Verified agents only</span>
              </div>
              <div className="hidden sm:block">•</div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span>Long-term investment focus</span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
