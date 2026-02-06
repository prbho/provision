// app/components/property-carousel.tsx
'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Property } from '@/types'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Shield, TrendingUp } from 'lucide-react'

import { Button } from '@/components/ui/button'

import PropertyCard from './PropertyCard'

interface PropertyCarouselProps {
  properties: Property[]
  title?: string
  userId: string
  viewAllLink?: string
  showTrustBadge?: boolean
}

export default function PropertyCarousel({
  properties,
  title = 'Verified Investment Properties',
  userId,
  viewAllLink = '/properties',
}: PropertyCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [columns, setColumns] = useState(4)
  const [isAnimating, setIsAnimating] = useState(false)

  // Responsive columns
  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth
      if (width < 640) setColumns(1)
      else if (width < 768) setColumns(2)
      else if (width < 1024) setColumns(3)
      else setColumns(5)
    }

    updateColumns()
    window.addEventListener('resize', updateColumns)
    return () => window.removeEventListener('resize', updateColumns)
  }, [])

  const uniqueProperties = useMemo(() => {
    const map = new Map<string, Property>()
    for (const p of properties) map.set(p.$id, p)
    return Array.from(map.values())
  }, [properties])

  const totalPages = useMemo(
    () => Math.ceil(uniqueProperties.length / columns),
    [uniqueProperties.length, columns]
  )

  const visibleProperties = useMemo(() => {
    const start = currentIndex * columns
    const end = start + columns

    if (end > uniqueProperties.length) {
      const needed = end - uniqueProperties.length
      return [
        ...uniqueProperties.slice(start),
        ...uniqueProperties.slice(0, needed),
      ]
    }

    return uniqueProperties.slice(start, end)
  }, [uniqueProperties, currentIndex, columns])

  const hasMultiplePages = uniqueProperties.length > columns

  const handleNext = async () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentIndex((prev) => {
      if (prev >= totalPages - 1) return 0
      return prev + 1
    })
    setTimeout(() => setIsAnimating(false), 500)
  }

  const handlePrev = async () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentIndex((prev) => {
      if (prev <= 0) return totalPages - 1
      return prev - 1
    })
    setTimeout(() => setIsAnimating(false), 500)
  }

  if (properties.length === 0) return null

  return (
    <div className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div className="mb-6 md:mb-0">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
            <p className="text-gray-600">
              Handpicked properties with complete legal and physical
              verification.
            </p>
          </div>

          <div className="flex items-center gap-4">
            {hasMultiplePages && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePrev}
                  className="h-10 w-10"
                  disabled={isAnimating}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNext}
                  className="h-10 w-10"
                  disabled={isAnimating}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            )}

            <Button
              asChild
              variant="outline"
              className="border-brand text-brand hover:bg-brand/5"
            >
              <Link href={viewAllLink} className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                View All
              </Link>
            </Button>
          </div>
        </div>

        {/* Properties Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6"
          >
            {visibleProperties.slice(0, columns).map((property, idx) => (
              <motion.div
                key={`${property.$id}-${currentIndex}-${idx}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <PropertyCard property={property} userId={userId} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Stats and Trust Section */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded bg-brand/10">
                  <Shield className="h-4 w-4 text-brand" />
                </div>
                <span className="text-sm text-gray-700">Fraud Protection</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded bg-brand/10">
                  <TrendingUp className="h-4 w-4 text-brand" />
                </div>
                <span className="text-sm text-gray-700">Verified ROI</span>
              </div>
            </div>

            {hasMultiplePages && (
              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => !isAnimating && setCurrentIndex(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentIndex
                        ? 'w-8 bg-brand'
                        : 'w-2 bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
