// components/Header/NavigationLinks.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

import PropertiesMegaMenu from './PropertiesMegaMenu'
import ResourcesMegaMenu from './ResourcesMegaMenu'
import ServicesMegaMenu from './ServicesMegaMenu'

export default function NavigationLinks() {
  const [isResourcesOpen, setIsResourcesOpen] = useState(false)
  const [isServicesOpen, setIsServicesOpen] = useState(false)
  const [isPropertiesOpen, setIsPropertiesOpen] = useState(false)

  return (
    <nav className="flex items-center space-x-6">
      {/* Company */}
      <Link
        href="/about"
        className="text-sm text-gray-700 hover:text-brand transition-colors"
      >
        About
      </Link>
      {/* Properties Mega Menu */}
      <Popover open={isPropertiesOpen} onOpenChange={setIsPropertiesOpen}>
        <PopoverTrigger asChild>
          <button className="flex items-center text-sm text-gray-700 hover:text-brand transition-colors">
            Properties
            <ChevronDown
              className={`h-3 w-3 ml-1 transition-transform ${
                isPropertiesOpen ? 'rotate-180' : ''
              }`}
            />
          </button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          className="w-screen p-0 border-gray-200 shadow-xl rounded-none mt-3"
          sideOffset={10}
        >
          <PropertiesMegaMenu onClose={() => setIsPropertiesOpen(false)} />
        </PopoverContent>
      </Popover>

      {/* Services Mega Menu */}
      <Popover open={isServicesOpen} onOpenChange={setIsServicesOpen}>
        <PopoverTrigger asChild>
          <button className="flex items-center text-sm text-gray-700 hover:text-brand transition-colors">
            Services
            <ChevronDown
              className={`h-3 w-3 ml-1 transition-transform ${isServicesOpen ? 'rotate-180' : ''}`}
            />
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-screen p-0 border-gray-200 shadow-xl rounded-none mt-3"
          sideOffset={10}
        >
          <ServicesMegaMenu onClose={() => setIsServicesOpen(false)} />
        </PopoverContent>
      </Popover>

      {/* Resources Mega Menu */}
      <Popover open={isResourcesOpen} onOpenChange={setIsResourcesOpen}>
        <PopoverTrigger asChild>
          <button className="flex items-center text-sm text-gray-700 hover:text-brand transition-colors">
            Resources
            <ChevronDown
              className={`h-3 w-3 ml-1 transition-transform ${isResourcesOpen ? 'rotate-180' : ''}`}
            />
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-screen p-0 border-gray-200 shadow-xl mt-3 rounded-none"
          sideOffset={10}
        >
          <ResourcesMegaMenu onClose={() => setIsResourcesOpen(false)} />
        </PopoverContent>
      </Popover>

      {/* Contact */}
      <Link
        href="/contact"
        className="text-sm text-gray-700 hover:text-brand transition-colors"
      >
        Contact
      </Link>
    </nav>
  )
}
