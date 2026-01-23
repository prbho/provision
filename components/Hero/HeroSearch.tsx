// app/components/hero-search.tsx
'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Search, X } from 'lucide-react'

import { Input } from '@/components/ui/input'

interface HeroSearchProps {
  searchType: 'buy' | 'rent'
  onSearch: (query: string, type: 'buy' | 'rent') => void
}

export default function HeroSearch({ searchType, onSearch }: HeroSearchProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleInputChange = (value: string) => {
    setSearchQuery(value)
  }

  const performSearch = (query: string) => {
    if (!query.trim()) return

    onSearch(query, searchType)

    const params = new URLSearchParams()
    params.set('q', query)
    params.set('type', searchType)

    router.push(`/properties?${params.toString()}`)
  }

  return (
    <div className="w-full">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          performSearch(searchQuery)
        }}
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />

          <Input
            ref={inputRef}
            placeholder="Enter city, neighborhood, or property type"
            value={searchQuery}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                performSearch(searchQuery)
              }
            }}
            className="pl-12 pr-20 h-14 rounded-lg border-gray-300 focus:border-brand focus:ring-brand/20"
          />

          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {searchQuery && !isLoading && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-gray-400 hover:text-gray-600 transition"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}

            <button
              type="submit"
              disabled={!searchQuery || isLoading}
              className="flex items-center justify-center h-10 w-10 rounded-lg bg-brand text-white hover:bg-brand/90 disabled:opacity-50 transition"
              aria-label="Search"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
