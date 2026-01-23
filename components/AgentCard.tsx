'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Agent } from '@/types'
import { BadgeCheck, Mail, MapPin, Phone, Star, User } from 'lucide-react'

interface AgentCardProps {
  agent: Agent
}

export default function AgentCard({ agent }: AgentCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-all duration-200">
      {/* Agent Image */}
      <div className="aspect-4/3 bg-gray-100 relative">
        {agent.avatar ? (
          <Image
            src={agent.avatar}
            alt={agent.name}
            fill
            className="object-cover"
            unoptimized
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50">
            <User className="w-20 h-20 text-gray-300" />
          </div>
        )}

        {/* Verification Badge */}
        {agent.isVerified && (
          <div className="absolute top-3 left-3">
            <div className="bg-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 border border-gray-200">
              <BadgeCheck className="w-3 h-3 text-blue-600" />
              <span className="text-gray-700">Verified</span>
            </div>
          </div>
        )}

        {/* Rating */}
        <div className="absolute top-3 right-3">
          <div className="bg-white px-2 py-1 rounded-full flex items-center gap-1 border border-gray-200">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium text-gray-900">
              {agent.rating.toFixed(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Agent Info */}
      <div className="p-4">
        {/* Name and Agency */}
        <div className="mb-3">
          <Link
            href={`/agents/${agent.$id}`}
            className="hover:text-blue-800 transition-colors text-blue-700 cursor-pointer"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {agent.name}
            </h3>
          </Link>
          <p className="text-gray-600 text-sm">{agent.agency}</p>
        </div>

        {/* Location */}
        <div className="flex items-center text-gray-600 text-sm mb-4">
          <MapPin className="w-4 h-4 mr-1 text-gray-400" />
          <span>{agent.city}</span>
          {agent.state && <span>, {agent.state}</span>}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 text-center mb-4 border-t border-b border-gray-100 py-3">
          <div>
            <div className="text-base font-semibold text-gray-900">
              {agent.yearsExperience}
            </div>
            <div className="text-xs text-gray-500">Years</div>
          </div>
          <div>
            <div className="text-base font-semibold text-gray-900">
              {agent.totalListings}
            </div>
            <div className="text-xs text-gray-500">Listings</div>
          </div>
          <div>
            <div className="text-base font-semibold text-gray-900">
              {agent.reviewCount}
            </div>
            <div className="text-xs text-gray-500">Reviews</div>
          </div>
        </div>

        {/* Contact Buttons */}
        <div className="flex gap-2">
          <button
            className="flex-1 flex items-center justify-center gap-2 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            onClick={() => (window.location.href = `mailto:${agent.email}`)}
          >
            <Mail className="w-4 h-4" />
            <span className="hidden sm:inline">Email</span>
          </button>
          <button
            className="flex-1 flex items-center justify-center gap-2 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            onClick={() =>
              (window.location.href = `tel:${agent.phone || agent.mobilePhone}`)
            }
          >
            <Phone className="w-4 h-4" />
            <span className="hidden sm:inline">Call</span>
          </button>
        </div>
      </div>
    </div>
  )
}
