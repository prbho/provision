// components/chatbot/SimplePropertyCard.tsx
import Image from 'next/image'
import { Bath, Bed, MapPin } from 'lucide-react'

import { Property } from './types'

interface SimplePropertyCardProps {
  property: Property
  onScheduleViewing: (property: Property) => void
}

export function SimplePropertyCard({
  property,
  onScheduleViewing,
}: SimplePropertyCardProps) {
  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `₦${(price / 1000000).toFixed(1)}M`
    }
    return `₦${price.toLocaleString()}`
  }

  const mainImage = property.images?.[0] || '/placeholder-property.jpg'

  return (
    <div className="border border-gray-200 rounded-lg p-3 bg-white hover:shadow-md transition-shadow">
      <div className="flex gap-3">
        <div className="shrink-0 w-20 h-20 bg-gray-200 rounded-md overflow-hidden">
          <Image
            src={mainImage}
            alt={property.title}
            className="w-full h-full object-cover"
            width={80}
            height={80}
          />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm text-gray-900 line-clamp-1 mb-1">
            {property.title}
          </h4>

          <div className="flex items-center text-gray-600 text-xs mb-1">
            <MapPin size={12} className="mr-1" />
            <span className="line-clamp-1">
              {property.address}, {property.city}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-gray-600 mb-2">
            <div className="flex items-center">
              <Bed size={12} className="mr-1" />
              {property.bedrooms} bed
            </div>
            <div className="flex items-center">
              <Bath size={12} className="mr-1" />
              {property.bathrooms} bath
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-brand font-bold text-sm">
          {formatPrice(property.price)}
        </span>
        <button
          onClick={() => onScheduleViewing(property)}
          className="bg-brand text-white text-xs py-1 px-2 rounded hover:bg-brand transition-colors"
        >
          Schedule Viewing
        </button>
      </div>
    </div>
  )
}
