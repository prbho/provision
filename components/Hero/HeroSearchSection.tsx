'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck } from 'lucide-react'

import HeroSearch from './HeroSearch'

export default function Hero() {
  const [searchType, setSearchType] = useState<'buy' | 'rent'>('buy')

  const handleSearch = (query: string, type: 'buy' | 'rent') => {
    if (!query.trim()) return
    window.dispatchEvent(
      new CustomEvent('propertySearch', {
        detail: {
          q: query,
          status: type === 'buy' ? 'for-sale' : 'for-rent',
          page: 1,
        },
      })
    )
    document
      .getElementById('properties-section')
      ?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative ">
      <div className="relative max-w-4xl mx-auto px-6 pb-20 -top-16">
        <div className="items-center mx-auto">
          {/* Search Container */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              {/* Tabs */}
              <div className="relative flex bg-linear-to-r from-gray-50 to-gray-50/50">
                {['buy', 'rent'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setSearchType(type as 'buy' | 'rent')}
                    className={`flex-1 py-5 text-lg font-semibold transition-all duration-300 relative
                    ${
                      searchType === type
                        ? 'text-brand'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {type === 'buy' ? 'Buy Property' : 'Rent Property'}
                    {searchType === type && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-1 bg-brand"
                        transition={{
                          type: 'spring',
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Search Content */}
              <div className="p-8">
                <HeroSearch searchType={searchType} onSearch={handleSearch} />
              </div>

              {/* Verification Badge */}
              <div className="px-8 pb-6">
                <div className="flex items-center justify-center gap-3 text-sm text-gray-600 bg-gray-50/80 rounded-xl py-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-brand/10 rounded-lg">
                      <ShieldCheck className="h-4 w-4 text-brand" />
                    </div>
                    <span className="font-medium">
                      Only verified agents & approved listings
                    </span>
                  </div>
                  <div className="h-4 w-px bg-brand/5" />
                  <span className="text-brand font-semibold">
                    100% Fraud Protection
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
