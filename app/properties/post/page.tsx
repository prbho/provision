// app/properties/post/page.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'

import PropertyPostForm from '@/components/agents/PropertyPostForm'

export default function PostPropertyPage() {
  const { user, isLoading } = useAuth()
  const [, setIsScrolled] = useState(false)
  const [, setShowScrollTop] = useState(false)

  // Check if user is authenticated and is an agent or seller
  useEffect(() => {
    if (!isLoading && user) {
      // Allow both agents and sellers
      if (user.userType !== 'agent' && user.userType !== 'seller') {
        toast.error('Only agents and property sellers can post properties')
        window.location.href = '/'
      }
    } else if (!isLoading && !user) {
      toast.error('Please sign in to post a property')
      window.location.href = '/login'
    }
  }, [user, isLoading])

  // Handle scroll for sticky sidebar and scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
      setShowScrollTop(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Progress calculation (you can make this dynamic based on form completion)
  const [, setFormProgress] = useState(0)

  // Simulate form progress - in real app, update this based on actual form completion
  useEffect(() => {
    // This is a placeholder - you should update progress based on actual form fields
    const timer = setTimeout(() => {
      setFormProgress(25) // Starting progress
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-white">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div>
          {/* Main Content - Form */}
          <div>
            <div className="relative">
              {/* Form Container with subtle background */}
              <div className="overflow-hidden">
                <div>
                  <PropertyPostForm />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
