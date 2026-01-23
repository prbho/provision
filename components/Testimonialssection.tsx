// app/components/testimonials-section.tsx
'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Quote, ShieldCheck, Star } from 'lucide-react'

type Testimonial = {
  name: string
  role: string
  location: string
  content: string
  image: string
  rating: number
}

const testimonials: Testimonial[] = [
  {
    name: 'Chidi A.',
    role: 'Diaspora Investor',
    location: 'Lagos, Nigeria',
    content:
      'I was hesitant to invest in Nigerian property from abroad, but PropertyVision made it seamless!',
    image: '/testimonials/chidi.png',
    rating: 5,
  },
  {
    name: 'Fatima K.',
    role: 'BUsiness Owner',
    location: 'London, UK',
    content:
      'I bought my home without stress. Highly recommend for anyone wanting confidence in Nigerian real estate.',
    image: '/testimonials/fatima.png',
    rating: 5,
  },
  {
    name: 'Emeka O.',
    role: 'Accountant',
    location: 'Port Harcourt',
    content:
      'Every listing was real. Found my perfect apartment in days! Thanks for making renting trustworthy.',
    image: '/testimonials/emeka.png',
    rating: 5,
  },

  {
    name: 'Adaeze N.',
    role: 'Banker',
    location: 'Port Harcourt',
    content:
      'PropertyVison in buying my first plot of land confidently. Excellent service for new investors!',
    image: '/testimonials/adaeze.png',
    rating: 5,
  },
]

export default function TestimonialsSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Trusted by Real Investors
          </h2>
          <p className="text-gray-600">
            Verified experiences from individuals who chose structure,
            transparency, and protection over risk.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative border rounded-lg p-6 bg-white hover:border-brand/30 transition-colors"
            >
              {/* Verified Tag */}
              <div className="absolute -top-2 left-6">
                <div className="flex items-center gap-1 text-xs font-medium bg-brand/10 text-brand px-2 py-1 rounded-full">
                  <ShieldCheck className="h-3 w-3" />
                  Verified
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 text-amber-500 fill-amber-500"
                  />
                ))}
              </div>

              {/* Content */}
              <div className="mb-6">
                <Quote className="h-6 w-6 text-gray-300 mb-2" />
                <p className="text-gray-700 text-sm">
                  &quot;{testimonial.content}&quot;
                </p>
              </div>

              {/* Author */}
              <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div>
                  <p className="font-medium text-gray-900 text-sm">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-gray-600">
                    {testimonial.role} · {testimonial.location}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Trust Line */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="p-4 border border-brand/20 bg-brand/5 rounded-lg text-center"
        >
          <div className="flex items-center justify-center gap-3">
            <ShieldCheck className="h-5 w-5 text-brand" />
            <span className="text-sm font-medium text-gray-700">
              Trusted by 1,000+ investors using verified listings
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
