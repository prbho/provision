// components/properties/MoreDetails.tsx
'use client'

import { Property } from '@/types'
import {
  Building,
  Calendar,
  Car,
  Clock,
  Home,
  Layers,
  MapPin,
  Ruler,
  Tag,
  TrendingUp,
} from 'lucide-react'

interface MoreDetailsProps {
  property: Property
}

export default function MoreDetails({ property }: MoreDetailsProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const details = [
    {
      icon: Tag,
      label: 'Status',
      value: property.status.replace('-', ' '),
      capitalize: true,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      icon: Home,
      label: 'Property Type',
      value: property.propertyType,
      capitalize: true,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      icon: Calendar,
      label: 'Listed Date',
      value: formatDate(property.listDate),
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    ...(property.yearBuilt
      ? [
          {
            icon: Clock,
            label: 'Year Built',
            value: property.yearBuilt.toString(),
            color: 'text-amber-600',
            bgColor: 'bg-amber-50',
          },
        ]
      : []),
    ...(property.lotSize
      ? [
          {
            icon: Ruler,
            label: 'Lot Size',
            value: `${property.lotSize.toLocaleString()} m²`,
            color: 'text-teal-600',
            bgColor: 'bg-teal-50',
          },
        ]
      : []),

    ...(property.neighborhood
      ? [
          {
            icon: MapPin,
            label: 'Neighborhood',
            value: property.neighborhood,
            color: 'text-rose-600',
            bgColor: 'bg-rose-50',
          },
        ]
      : []),
  ]

  const isShortLet = property.status === 'short-let'

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Property Details</h3>
          <p className="text-sm text-gray-600 mt-1">
            Comprehensive information about this{' '}
            {isShortLet ? 'short-let' : 'property'}
          </p>
        </div>
        <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-lg bg-gray-50">
          <Layers className="w-5 h-5 text-gray-600" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {details.map((detail, index) => (
          <div
            key={index}
            className={`flex flex-col p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-all duration-200 hover:shadow-sm ${detail.bgColor}`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className={`p-2 rounded-lg ${detail.bgColor.replace('50', '100')}`}
              >
                <detail.icon className={`w-4 h-4 ${detail.color}`} />
              </div>
              <span className="text-xs font-medium text-gray-700">
                {detail.label}
              </span>
            </div>
            <span
              className={`text-sm font-semibold text-gray-900 ${
                detail.capitalize ? 'capitalize' : ''
              }`}
            >
              {detail.value}
            </span>
          </div>
        ))}
      </div>

      {/* Additional Information Section */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <h4 className="text-sm font-semibold text-gray-900 mb-4">
          Additional Information
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Last Updated */}
          {property.$updatedAt && (
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg sm:col-span-2">
              <span className="text-sm text-gray-600">Last Updated</span>
              <span className="text-sm font-medium text-gray-900">
                {formatDate(property.$updatedAt)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Tags Section */}
      <div className="mt-6">
        <div className="flex flex-wrap gap-2">
          {/* Featured Tag */}
          {property.isFeatured && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
              <TrendingUp className="w-3 h-3 mr-1" />
              Featured
            </span>
          )}

          {/* Verified Tag */}
          {property.isVerified && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              ✓ Verified
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
