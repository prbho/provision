// app/components/hero-section.tsx
'use client'

import { JSX, useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Home, Pause, Play, Shield, TrendingUp } from 'lucide-react'

type Slide = {
  title: string
  highlight: string
  description: string
  trustBadges: string[]
  cta: {
    text: string
    icon: JSX.Element
    action: () => void
  }
}

export default function Hero() {
  const [textIndex, setTextIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const slides: Slide[] = [
    {
      title: 'Verified Properties from Trusted Agents',
      highlight: 'Trusted Agents',
      description:
        'We work exclusively with vetted real estate companies and licensed agents. Every listing is legally and physically verified.',
      trustBadges: [
        'Verified Agents Only',
        'Legal & Physical Checks',
        'Fraud Protected',
      ],
      cta: {
        text: 'View Verified Homes',
        icon: <Shield className="w-5 h-5" />,
        action: () => (window.location.href = '/properties'),
      },
    },
    {
      title: 'Secure and Transparent Property Listings',
      highlight: 'Transparent',
      description:
        'No anonymous sellers. Every property is listed under a verified company or accountable professional.',
      trustBadges: [
        'Documents Verified',
        'Ownership Confirmed',
        'Agent Accountability',
      ],
      cta: {
        text: 'See How We Protect You',
        icon: <Home className="w-5 h-5" />,
        action: () => (window.location.href = '/how-it-works'),
      },
    },
    {
      title: 'Invest Confidently with Lower Risk',
      highlight: 'Confidently',
      description:
        'Avoid common real estate fraud and make smarter investment decisions backed by verification.',
      trustBadges: ['Verified Assets', 'Expert Review', 'Investor Safe'],
      cta: {
        text: 'Start Investing Safely',
        icon: <TrendingUp className="w-5 h-5" />,
        action: () => (window.location.href = '/properties'),
      },
    },
  ]

  const nextSlide = useCallback(
    () => setTextIndex((p) => (p + 1) % slides.length),
    [slides.length]
  )

  const prevSlide = useCallback(
    () => setTextIndex((p) => (p - 1 + slides.length) % slides.length),
    [slides.length]
  )

  useEffect(() => {
    if (isPaused) return
    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [nextSlide, isPaused])

  const slide = slides[textIndex]

  return (
    <section className="relative min-h-[70vh] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/homepage/contemprary-building.png)' }}
        />
        <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/50 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative max-w-4xl mx-auto px-4 py-20">
        <div
          className="space-y-6 text-center"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Headline */}
          <AnimatePresence mode="wait">
            <motion.div
              key={textIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
                {slide.title.split(slide.highlight).map((part, i, arr) => (
                  <span key={i}>
                    {part}
                    {i < arr.length - 1 && (
                      <span className="text-gold-600">{slide.highlight}</span>
                    )}
                  </span>
                ))}
              </h1>

              <p className="text-lg text-gray-200 max-w-2xl mx-auto leading-relaxed">
                {slide.description}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-3">
            {slide.trustBadges.map((badge, i) => (
              <div
                key={i}
                className="flex items-center gap-2 rounded-lg px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20"
              >
                <Shield className="w-4 h-4 text-brand" />
                <span className="text-sm font-medium text-white">{badge}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="pt-3">
            <button
              onClick={slide.cta.action}
              className="inline-flex cursor-pointer items-center gap-3 px-6 py-3 rounded-lg font-medium bg-brand text-white hover:bg-brand/90 transition-colors"
            >
              {slide.cta.icon}
              {slide.cta.text}
              <ArrowRight className="w-5 h-5" />
            </button>

            <p className="mt-2 text-sm text-gray-300">
              Only verified agents • No anonymous listings
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 pt-2">
            <button onClick={prevSlide} aria-label="Previous">
              <ArrowRight className="rotate-180 text-white/70 hover:text-brand" />
            </button>

            <div className="flex gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setTextIndex(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === textIndex ? 'w-8 bg-brand' : 'w-2 bg-white/40'
                  }`}
                />
              ))}
            </div>

            <button onClick={nextSlide} aria-label="Next">
              <ArrowRight className="text-white/70 hover:text-brand" />
            </button>

            <button
              onClick={() => setIsPaused(!isPaused)}
              aria-label="Pause autoplay"
              className="ml-3"
            >
              {isPaused ? (
                <Play className="text-white/70 hover:text-brand" />
              ) : (
                <Pause className="text-white/70 hover:text-brand" />
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
