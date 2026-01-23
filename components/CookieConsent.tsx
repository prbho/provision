'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Cookie, X } from 'lucide-react'

import { Button } from '@/components/ui/button'

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const hasConsent = localStorage.getItem('cookie-consent')
    if (!hasConsent) {
      setTimeout(() => setIsVisible(true), 2000)
    }
  }, [])

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    setIsVisible(false)
  }

  const rejectCookies = () => {
    localStorage.setItem('cookie-consent', 'rejected')
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-brand border-t shadow-lg sm:bottom-4 sm:left-4 sm:right-auto sm:max-w-md sm:rounded-lg sm:border">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <div className="flex items-center mb-2 gap-2 relative">
            <div className="p-2 bg-brand/10 rounded-lg">
              <Cookie className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-semibold text-white">Cookie Preferences</h3>
            <button
              onClick={rejectCookies}
              className="p-1 text-white/90 absolute -top-2 right-0 hover:text-white0 ml-auto cursor-pointer"
              aria-label="Close cookie consent"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="text-sm text-white/90 mb-4">
            We use cookies to enhance your browsing experience, analyze site
            traffic, and personalize content. By continuing to use our site, you
            consent to our use of cookies.
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={acceptCookies}
              size="sm"
              className="bg-stone-950 hover:bg-stone-900 cursor-pointer"
            >
              Accept All Cookies
            </Button>
            <Button
              className="border border-brand/85 text-stone-900 bg-white cursor-pointer"
              onClick={rejectCookies}
              variant="outline"
              size="sm"
            >
              Reject Non-Essential
            </Button>
            <Button
              className="bg-white text-stone-900"
              asChild
              variant="ghost"
              size="sm"
            >
              <Link href="/cookies">Learn More</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
