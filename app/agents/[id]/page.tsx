// app/agents/[id]/page.tsx
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Mail, MapPin, Phone, Star } from 'lucide-react'

import AgentProperties from '@/components/AgentProperties'
import { getAgent } from '@/lib/agents/getAgent'
import { getAgentProperties } from '@/lib/agents/getAgentProperties'

interface AgentProfilePageProps {
  params: Promise<{
    id: string
  }>
}

export default async function AgentProfilePage({
  params,
}: AgentProfilePageProps) {
  const { id } = await params

  if (!id || id.trim().length === 0) {
    notFound()
  }

  const agent = await getAgent(id)
  if (!agent) {
    notFound()
  }

  const agentProperties = await getAgentProperties(id)

  return (
    <div className="min-h-screen bg-white">
      {/* Agent Header */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-100 rounded-lg overflow-hidden shrink-0">
              {agent.avatar ? (
                // Using img tag instead of Next.js Image for Appwrite compatibility
                <Image
                  src={agent.avatar}
                  alt={agent.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-50">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-200 rounded-full" />
                </div>
              )}
            </div>

            {/* Agent Info */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-2xl font-bold text-gray-900">
                      {agent.name}
                    </h1>
                    {agent.isVerified && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-lg">{agent.agency}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-xl font-bold text-gray-900">
                    {agent.rating?.toFixed(1) || '0.0'}
                  </span>
                  <span className="text-gray-600">
                    ({agent.reviewCount || 0} reviews)
                  </span>
                </div>
              </div>

              {/* Location & Contact */}
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                  <span>
                    {agent.city || 'No location specified'}
                    {agent.state && `, ${agent.state}`}
                  </span>
                </div>

                <div className="flex flex-wrap gap-4">
                  {(agent.phone || agent.mobilePhone) && (
                    <a
                      href={`tel:${agent.phone || agent.mobilePhone}`}
                      className="flex items-center gap-2 text-gray-700 hover:text-brand transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">
                        {agent.phone || agent.mobilePhone}
                      </span>
                    </a>
                  )}
                  {agent.email && (
                    <a
                      href={`mailto:${agent.email}`}
                      className="flex items-center gap-2 text-gray-700 hover:text-brand/95 transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">{agent.email}</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            {agent.bio && (
              <div className="border border-gray-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  About
                </h2>
                <p className="text-gray-700 whitespace-pre-line">{agent.bio}</p>
              </div>
            )}

            {/* Experience & Specialties */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Experience & Specialties
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Experience</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold text-gray-900">
                      {agent.yearsExperience || 0}
                    </span>
                    <span className="text-gray-600">years</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Real estate experience
                  </p>
                </div>
                {agent.specialties && agent.specialties.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">
                      Specialties
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {agent.specialties.slice(0, 5).map((specialty, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Agent's Properties */}
            {agentProperties.length > 0 ? (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Current Listings
                  </h2>
                  <span className="text-gray-600">
                    {agentProperties.length} properties
                  </span>
                </div>
                <AgentProperties
                  agentId={agent.$id}
                  initialProperties={agentProperties}
                  agentName={agent.name}
                  userId={''}
                />
              </div>
            ) : (
              <div className="border border-gray-200 rounded-lg p-8 text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Properties Listed
                </h3>
                <p className="text-gray-600">
                  {agent.name} hasn&apos;t listed any properties yet.
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Contact Agent
              </h3>
              <div className="space-y-4">
                {(agent.phone || agent.mobilePhone) && (
                  <a
                    href={`tel:${agent.phone || agent.mobilePhone}`}
                    className="block w-full py-3 bg-brand text-white text-center rounded-lg hover:bg-brand/95 transition-colors"
                  >
                    Call Now
                  </a>
                )}
                {agent.email && (
                  <a
                    href={`mailto:${agent.email}`}
                    className="block w-full py-3 border border-brand text-brand text-center rounded-lg hover:bg-brand/5 transition-colors"
                  >
                    Send Email
                  </a>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Agent Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Experience</span>
                  <span className="font-medium text-gray-900">
                    {agent.yearsExperience || 0} years
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Total Listings</span>
                  <span className="font-medium text-gray-900">
                    {agent.totalListings || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Rating</span>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium text-gray-900">
                      {agent.rating?.toFixed(1) || '0.0'}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Reviews</span>
                  <span className="font-medium text-gray-900">
                    {agent.reviewCount || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
