// app/agents/page.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Agent } from '@/types'
import { Filter } from 'lucide-react'

import AgentCard from '@/components/AgentCard'
import SortSelect from '@/components/agents/SortSelect'
import AgentsSearchFilters from '@/components/AgentsSearchFilters'
import {
  AGENTS_COLLECTION_ID,
  DATABASE_ID,
  databases,
  Query,
} from '@/lib/appwrite-server'

// New function to fetch unique values from the database
async function getUniqueValues(field: string): Promise<string[]> {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      AGENTS_COLLECTION_ID,
      [Query.select([field]), Query.limit(1000)]
    )

    const allValues: string[] = []

    response.documents.forEach((doc: any) => {
      const value = doc[field]

      if (value === undefined || value === null) return

      if (Array.isArray(value)) {
        value.forEach((item) => {
          if (typeof item === 'string' && item.trim() !== '') {
            allValues.push(item.trim())
          }
        })
      } else if (typeof value === 'string' && value.trim() !== '') {
        allValues.push(value.trim())
      }
    })

    const uniqueValues = [...new Set(allValues)].sort()
    return uniqueValues
  } catch (error) {
    console.error(`Error fetching unique ${field}:`, error)
    return []
  }
}

async function getAgents(filters?: {
  city?: string
  specialties?: string[]
  minExperience?: number
  minRating?: number
  sortBy?: string
}): Promise<{ agents: Agent[]; error?: string }> {
  try {
    const queries: any[] = [Query.limit(100)]

    if (filters?.city && filters.city.trim()) {
      queries.push(Query.equal('city', filters.city.trim()))
    }

    if (filters?.specialties && filters.specialties.length > 0) {
      filters.specialties.forEach((specialty) => {
        if (specialty.trim()) {
          queries.push(Query.contains('specialties', specialty.trim()))
        }
      })
    }

    if (filters?.minExperience && filters.minExperience > 0) {
      queries.push(
        Query.greaterThanEqual('yearsExperience', filters.minExperience)
      )
    }

    if (filters?.minRating && filters.minRating > 0) {
      queries.push(Query.greaterThanEqual('rating', filters.minRating))
    }

    switch (filters?.sortBy) {
      case 'experience':
        queries.push(Query.orderDesc('yearsExperience'))
        queries.push(Query.orderDesc('rating'))
        break
      case 'listings':
        queries.push(Query.orderDesc('totalListings'))
        queries.push(Query.orderDesc('rating'))
        break
      case 'name':
        queries.push(Query.orderAsc('name'))
        queries.push(Query.orderDesc('rating'))
        break
      case 'rating':
      default:
        queries.push(Query.orderDesc('rating'))
        queries.push(Query.orderDesc('yearsExperience'))
        break
    }

    const response = await databases.listDocuments(
      DATABASE_ID,
      AGENTS_COLLECTION_ID,
      queries
    )

    const agents: Agent[] = response.documents.map((doc: any) => ({
      $id: doc.$id,
      $createdAt: doc.$createdAt,
      $updatedAt: doc.$updatedAt,
      name: doc.name || 'Unknown Agent',
      email: doc.email || '',
      phone: doc.phone || '',
      avatar: doc.avatar || '',
      agency: doc.agency || 'Independent Agent',
      city: doc.city || '',
      state: doc.state || '',
      yearsExperience: doc.yearsExperience || 0,
      specialties: doc.specialties || [],
      languages: doc.languages || ['English'],
      rating: doc.rating || 0,
      reviewCount: doc.reviewCount || 0,
      totalListings: doc.totalListings || 0,
      licenseNumber: doc.licenseNumber || '',
      isVerified: doc.isVerified || false,
      bio: doc.bio || '',
      officePhone: doc.officePhone || '',
      mobilePhone: doc.mobilePhone || '',
      website: doc.website || '',
      verificationDocuments: doc.verificationDocuments || [],
    }))

    return { agents }
  } catch (error: any) {
    console.error('Error fetching agents:', error)
    return {
      agents: [],
      error: error.message || 'Failed to fetch agents',
    }
  }
}

interface AgentsPageProps {
  searchParams: Promise<{
    city?: string
    specialties?: string
    minExperience?: string
    minRating?: string
    sortBy?: string
  }>
}

export default async function AgentsPage({ searchParams }: AgentsPageProps) {
  const params = await searchParams

  const filters = {
    city: params.city,
    specialties: params.specialties ? params.specialties.split(',') : undefined,
    minExperience: params.minExperience
      ? parseInt(params.minExperience)
      : undefined,
    minRating: params.minRating ? parseFloat(params.minRating) : undefined,
    sortBy: params.sortBy || 'rating',
  }

  const [agentsResult, uniqueCities] = await Promise.all([
    getAgents(filters),
    getUniqueValues('city'),
    getUniqueValues('specialties'),
  ])

  const { agents, error } = agentsResult

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Database Error
          </h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Connect with Trusted Real Estate Experts
            </h1>
            <p className="mt-2 text-gray-600">
              Work with verified professionals who know your local market and
              act in your best interest
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-6">
          <details className="border border-gray-200 rounded-lg">
            <summary className="px-4 py-3 flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-900">Filters</span>
              </div>
              <span className="text-sm text-gray-500">
                {agents.length} agents
              </span>
            </summary>
            <div className="p-4 border-t border-gray-200">
              <AgentsSearchFilters
                initialFilters={{
                  city: filters.city,
                  specialty: filters.specialties?.[0],
                  minExperience: filters.minExperience,
                  minRating: filters.minRating,
                }}
                availableCities={uniqueCities}
              />
            </div>
          </details>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-8 gap-6">
          {/* Filters Sidebar - Desktop */}
          <div className="hidden lg:block lg:col-span-2">
            <div className="sticky top-6">
              <div className="mb-4">
                <h2 className="font-semibold text-gray-900 mb-2">Filters</h2>
                <p className="text-sm text-gray-600">
                  {agents.length} agents found
                </p>
              </div>
              <AgentsSearchFilters
                initialFilters={{
                  city: filters.city,
                  specialty: filters.specialties?.[0],
                  minExperience: filters.minExperience,
                  minRating: filters.minRating,
                }}
                availableCities={uniqueCities}
              />
            </div>
          </div>

          {/* Agents Grid */}
          <div className="lg:col-span-6">
            {/* Header with Sort */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {filters.city
                    ? `Agents in ${filters.city}`
                    : 'Verified Agents'}
                </h2>
                <p className="text-gray-600 mt-1">
                  {agents.length} {agents.length === 1 ? 'agent' : 'agents'}{' '}
                  available
                </p>
              </div>

              <SortSelect currentSort={filters.sortBy} />
            </div>

            {/* Agents Grid */}
            {agents.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {agents.map((agent) => (
                  <AgentCard key={agent.$id} agent={agent} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">👨‍💼</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No agents found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search criteria
                </p>
              </div>
            )}

            {/* CTA Section */}
            {agents.length > 0 && (
              <div className="mt-12 border border-gray-200 rounded-lg p-8">
                <div className="text-center max-w-2xl mx-auto">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Still Unsure About Choosing an Agent?
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Our matching service can help you find the perfect agent
                    based on your specific needs.
                  </p>
                  <a
                    href="/contact"
                    className="inline-block bg-brand text-white px-6 py-3 rounded-lg hover:bg-brand/95 transition-colors font-medium"
                  >
                    Get Agent Recommendations
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
