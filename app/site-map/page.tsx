// app/site-map/page.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Accessibility,
  AlertCircle,
  Bell,
  Building,
  Calculator,
  Calendar,
  ChevronRight,
  Contact,
  Cookie,
  DollarSign,
  FileText,
  Globe,
  Home,
  Key,
  Lock,
  MapPin,
  MessageSquare,
  Search,
  Settings,
  Shield,
  Sparkles,
  TrendingUp,
  User,
  Users,
} from 'lucide-react'

interface SitemapLink {
  title: string
  href: string
  description: string
  icon: React.ElementType
  personality: string
  tagline?: string
}

interface SitemapCategory {
  title: string
  description: string
  icon: React.ElementType
  color: string
  personality: string
  links: SitemapLink[]
}

const sitemapData: SitemapCategory[] = [
  {
    title: 'Welcome & Getting Started',
    description: 'Begin your property journey with us',
    icon: Home,
    color: 'bg-brand/5',
    personality: 'Warm & Inviting',
    links: [
      {
        title: 'Home',
        href: '/',
        description: 'Start your property discovery journey',
        icon: Sparkles,
        personality: 'Your starting point',
        tagline: 'Where dreams find addresses',
      },
      {
        title: 'About Us',
        href: '/about',
        description: 'Learn about our mission and team',
        icon: Users,
        personality: 'Get to know us',
        tagline: 'Building trust in real estate',
      },
      {
        title: 'How It Works',
        href: '/how-it-works',
        description: 'See how we make property hunting stress-free',
        icon: TrendingUp,
        personality: 'Our simple process',
        tagline: 'Property made simple',
      },
      {
        title: 'Contact',
        href: '/contact',
        description: 'Reach out to our friendly support team',
        icon: MessageSquare,
        personality: "We're here to help",
        tagline: 'Real humans, real help',
      },
    ],
  },
  {
    title: 'Find Properties',
    description: 'Browse verified properties across Nigeria',
    icon: Building,
    color: 'bg-blue-50',
    personality: 'Adventurous & Exciting',
    links: [
      {
        title: 'All Properties',
        href: '/properties',
        description: 'Browse our complete collection of verified listings',
        icon: Search,
        personality: 'Your property playground',
        tagline: 'Discover your next home',
      },
      {
        title: 'Buy Properties',
        href: '/buy',
        description: 'Find properties ready for their new owners',
        icon: Key,
        personality: 'Ready to own',
        tagline: 'Your keys are waiting',
      },
      {
        title: 'Rent Properties',
        href: '/rent',
        description: 'Beautiful rental properties across Nigeria',
        icon: Home,
        personality: 'Your temporary palace',
        tagline: 'Find your perfect rental',
      },
      {
        title: 'Sell Property',
        href: '/sell',
        description: 'Ready to sell? We make it easy',
        icon: DollarSign,
        personality: 'Turn property into cash',
        tagline: 'Get the best price',
      },
    ],
  },
  {
    title: 'List Your Property',
    description: 'Showcase your property to qualified buyers',
    icon: MapPin,
    color: 'bg-purple-50',
    personality: 'Smart & Professional',
    links: [
      {
        title: 'List Property',
        href: '/list-property',
        description: 'Quick and easy property listing',
        icon: Sparkles,
        personality: 'Show off your space',
        tagline: 'List in minutes',
      },
      {
        title: 'List for Sale',
        href: '/list-property/sale',
        description: 'Sell your property with confidence',
        icon: DollarSign,
        personality: 'Sell smart',
        tagline: 'Maximum value, minimum stress',
      },
      {
        title: 'List for Rent',
        href: '/list-property/rent',
        description: 'Find reliable tenants quickly',
        icon: Key,
        personality: 'Rent with peace of mind',
        tagline: 'Quality tenants only',
      },
      {
        title: 'Post Property',
        href: '/properties/post',
        description: 'Create a detailed property listing',
        icon: Building,
        personality: 'Detailed listings',
        tagline: 'The more details, the better',
      },
    ],
  },
  {
    title: 'Our Services',
    description: 'Professional real estate solutions',
    icon: Shield,
    color: 'bg-amber-50',
    personality: 'Trustworthy & Expert',
    links: [
      {
        title: 'All Services',
        href: '/services',
        description: 'Comprehensive real estate solutions',
        icon: Shield,
        personality: 'Your property toolkit',
        tagline: 'Everything you need',
      },
      {
        title: 'Property Verification',
        href: '/services/property-verification',
        description: 'Verify property documents and titles',
        icon: Shield,
        personality: 'Sleep well at night',
        tagline: 'No surprises, just truth',
      },
      {
        title: 'Due Diligence',
        href: '/services/due-diligence',
        description: 'Thorough property investigation',
        icon: Search,
        personality: 'Investigate before you invest',
        tagline: 'Leave no stone unturned',
      },
      {
        title: 'Diaspora Services',
        href: '/services/diaspora',
        description: 'Property support for overseas Nigerians',
        icon: Globe,
        personality: 'Home from afar',
        tagline: 'Buying from anywhere',
      },
      {
        title: 'Mortgage Assistance',
        href: '/services/mortgage',
        description: 'Home loan guidance and support',
        icon: DollarSign,
        personality: 'Finance made friendly',
        tagline: 'Demystifying mortgages',
      },
      {
        title: 'Investment Advisory',
        href: '/services/investment',
        description: 'Smart property investment strategies',
        icon: TrendingUp,
        personality: 'Grow your wealth',
        tagline: 'Smart money moves',
      },
      {
        title: 'Construction Services',
        href: '/services/construction',
        description: 'Build and construction management',
        icon: Building,
        personality: 'Build your dream',
        tagline: 'From ground to greatness',
      },
      {
        title: 'Agent Verification',
        href: '/services/agent-verification',
        description: 'Verify your credentials as an agent',
        icon: Users,
        personality: 'Trusted professionals',
        tagline: 'Earn your badge of trust',
      },
    ],
  },
  {
    title: 'Helpful Guides',
    description: 'Educational resources for smart decisions',
    icon: FileText,
    color: 'bg-cyan-50',
    personality: 'Educational & Supportive',
    links: [
      {
        title: 'First-Time Buyer Guide',
        href: '/guides/first-time-buyer',
        description: 'Essential tips for new property buyers',
        icon: Key,
        personality: 'Avoid rookie mistakes',
        tagline: 'Start smart',
      },
      {
        title: 'Diaspora Guide',
        href: '/guides/diaspora',
        description: 'Buying property from overseas',
        icon: Globe,
        personality: 'Global property expert',
        tagline: 'Home buying from anywhere',
      },
      {
        title: 'Inspection Checklist',
        href: '/guides/inspection-checklist',
        description: 'Comprehensive property inspection guide',
        icon: Search,
        personality: 'Inspect like a pro',
        tagline: "Don't miss a thing",
      },
      {
        title: 'Negotiation Guide',
        href: '/guides/negotiation',
        description: 'Get the best price for your property',
        icon: DollarSign,
        personality: 'Negotiate with confidence',
        tagline: 'Get the deal you deserve',
      },
      {
        title: 'FAQs',
        href: '/faqs',
        description: 'Answers to common questions',
        icon: FileText,
        personality: 'Quick answers',
        tagline: 'Got questions? We have answers',
      },
    ],
  },
  {
    title: 'Useful Tools',
    description: 'Calculators and resources',
    icon: Calculator,
    color: 'bg-orange-50',
    personality: 'Helpful & Practical',
    links: [
      {
        title: 'Mortgage Calculator',
        href: '/mortgage-calculator',
        description: 'Calculate your monthly mortgage payments',
        icon: Calculator,
        personality: 'Crunch the numbers',
        tagline: 'Budget with confidence',
      },
      {
        title: 'ROI Calculator',
        href: '/resources/roi-calculator',
        description: 'Calculate property investment returns',
        icon: TrendingUp,
        personality: 'Invest smart',
        tagline: 'See your potential returns',
      },
      {
        title: 'Payment History',
        href: '/calculations/history',
        description: 'View your payment calculations',
        icon: DollarSign,
        personality: 'Track your finances',
        tagline: 'Keep tabs on your budget',
      },
    ],
  },
  {
    title: 'Account & Profile',
    description: 'Manage your account and preferences',
    icon: User,
    color: 'bg-pink-50',
    personality: 'Personal & Secure',
    links: [
      {
        title: 'Login',
        href: '/login',
        description: 'Sign in to your account',
        icon: Key,
        personality: 'Welcome back',
        tagline: 'Your property journey awaits',
      },
      {
        title: 'Register',
        href: '/register',
        description: 'Create your free account',
        icon: User,
        personality: 'Join the family',
        tagline: 'Start your property story',
      },
      {
        title: 'Sign Up',
        href: '/signup',
        description: 'Alternative signup option',
        icon: Sparkles,
        personality: 'Quick signup',
        tagline: 'Get started in seconds',
      },
      {
        title: 'Dashboard',
        href: '/dashboard',
        description: 'Your personal property dashboard',
        icon: TrendingUp,
        personality: 'Your command center',
        tagline: 'Everything in one place',
      },
      {
        title: 'Profile',
        href: '/profile',
        description: 'Manage your personal information',
        icon: User,
        personality: 'Your digital identity',
        tagline: 'Make it yours',
      },
      {
        title: 'Settings',
        href: '/settings',
        description: 'Account settings and preferences',
        icon: Settings,
        personality: 'Tailor your experience',
        tagline: 'Make it work for you',
      },
      {
        title: 'Favorites',
        href: '/favorites',
        description: 'Save and track your favorite properties',
        icon: Sparkles,
        personality: 'Your wishlist',
        tagline: 'Properties you love',
      },
      {
        title: 'Messages',
        href: '/messages',
        description: 'Chat with agents and sellers',
        icon: MessageSquare,
        personality: 'Stay connected',
        tagline: 'Communicate easily',
      },
      {
        title: 'Notifications',
        href: '/notifications',
        description: 'Stay updated on property alerts',
        icon: Bell,
        personality: 'Never miss out',
        tagline: 'Stay in the know',
      },
    ],
  },
  {
    title: 'For Real Estate Professionals',
    description: 'Tools and resources for agents',
    icon: Users,
    color: 'bg-indigo-50',
    personality: 'Professional & Empowering',
    links: [
      {
        title: 'Find Agents',
        href: '/agents',
        description: 'Browse verified real estate agents',
        icon: Users,
        personality: 'Find your expert',
        tagline: 'Connect with professionals',
      },
      {
        title: 'Become an Agent',
        href: '/become-agent',
        description: 'Join our network of verified agents',
        icon: Shield,
        personality: 'Join our team',
        tagline: 'Build your reputation',
      },
      {
        title: 'Schedule Meeting',
        href: '/schedule-meeting',
        description: 'Book professional consultations',
        icon: Calendar,
        personality: 'Get expert advice',
        tagline: 'Talk to the pros',
      },
    ],
  },
  {
    title: 'Account Recovery',
    description: 'Secure access to your account',
    icon: Lock,
    color: 'bg-red-50',
    personality: 'Secure & Helpful',
    links: [
      {
        title: 'Forgot Password',
        href: '/forget-password',
        description: 'Reset your password if forgotten',
        icon: Key,
        personality: 'Locked out? No problem',
        tagline: 'Get back in quickly',
      },
      {
        title: 'Reset Password',
        href: '/reset-password',
        description: 'Set a new password for your account',
        icon: Lock,
        personality: 'Fresh start',
        tagline: 'Secure your account',
      },
    ],
  },
  {
    title: 'Legal & Policies',
    description: 'Important documents and policies',
    icon: FileText,
    color: 'bg-gray-50',
    personality: 'Transparent & Clear',
    links: [
      {
        title: 'Privacy Policy',
        href: '/privacy',
        description: 'How we protect your data',
        icon: Shield,
        personality: 'Your privacy matters',
        tagline: 'We value your trust',
      },
      {
        title: 'Terms of Service',
        href: '/terms',
        description: 'Platform terms and conditions',
        icon: FileText,
        personality: 'The fine print',
        tagline: 'Clear and fair terms',
      },
      {
        title: 'Disclaimer',
        href: '/disclaimer',
        description: 'Legal disclaimer and limitations',
        icon: AlertCircle,
        personality: 'Important notices',
        tagline: 'Know what to expect',
      },
      {
        title: 'Cookie Policy',
        href: '/cookies',
        description: 'How we use cookies',
        icon: Cookie,
        personality: 'Tech transparency',
        tagline: 'How our site works',
      },
      {
        title: 'Accessibility',
        href: '/accessibility',
        description: 'Our accessibility commitment',
        icon: Accessibility,
        personality: 'For everyone',
        tagline: 'Inclusive by design',
      },
    ],
  },
]

export default function SitemapPage() {
  const [searchQuery, setSearchQuery] = useState('')

  // Filter links based on search
  const filteredData = sitemapData
    .map((category) => ({
      ...category,
      links: category.links.filter(
        (link) =>
          searchQuery === '' ||
          link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          link.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          link.personality.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((category) => category.links.length > 0)

  // Count total links
  const totalLinks = sitemapData.reduce(
    (total, category) => total + category.links.length,
    0
  )

  // Add missing icons
  const Bell = ({ className }: { className?: string }) => (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
      />
    </svg>
  )

  const Calendar = ({ className }: { className?: string }) => (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  )

  const AlertCircle = ({ className }: { className?: string }) => (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  )

  const Cookie = ({ className }: { className?: string }) => (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
      />
    </svg>
  )

  const Accessibility = ({ className }: { className?: string }) => (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  )

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex p-3 bg-brand/10 rounded-xl mb-4">
              <MapPin className="h-8 w-8 text-brand" />
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              PropertyVision Sitemap
            </h1>

            <p className="text-gray-600 mb-8">
              Your comprehensive guide to every corner of our real estate
              platform. We've organized everything so you can find your way
              around with a smile.
            </p>

            {/* Search */}
            <div className="max-w-xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="search"
                  placeholder="Looking for something specific? Type here..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand outline-none shadow-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Search by page name, description, or even personality type!
              </p>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-brand rounded-full"></div>
                <span>
                  <span className="font-medium text-gray-900">
                    {sitemapData.length}
                  </span>{' '}
                  categories
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>
                  <span className="font-medium text-gray-900">
                    {totalLinks}
                  </span>{' '}
                  helpful pages
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>
                  All{' '}
                  <span className="font-medium text-gray-900">verified</span> &
                  safe
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {filteredData.length === 0 ? (
          <div className="text-center py-16 border border-gray-200 rounded-lg">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No pages found for "{searchQuery}"
            </h3>
            <p className="text-gray-600 mb-4">
              Try searching with different keywords or browse our categories
              below
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="text-brand hover:text-brand/95 font-medium"
            >
              Clear search and show all pages
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredData.map((category, index) => (
              <div key={index} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 ${category.color} rounded-lg`}>
                    <category.icon className="h-6 w-6 text-gray-700" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {category.title}
                    </h2>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-gray-600 text-sm">
                        {category.description}
                      </p>
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                        {category.personality}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.links.map((link, linkIndex) => (
                    <Link
                      key={linkIndex}
                      href={link.href}
                      className="group p-4 border border-gray-200 rounded-lg hover:border-brand/30 hover:shadow-sm transition-all duration-200"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`p-2 ${category.color} rounded-lg group-hover:bg-brand/5 transition-colors`}
                        >
                          <link.icon className="h-5 w-5 text-gray-600 group-hover:text-brand" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-medium text-gray-900 group-hover:text-brand">
                                {link.title}
                              </h3>
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                {link.description}
                              </p>
                            </div>
                            <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-brand transition-colors ml-2 flex-shrink-0" />
                          </div>

                          <div className="flex items-center justify-between mt-3">
                            <span className="text-xs px-2 py-1 bg-gray-50 text-gray-600 rounded-full">
                              {link.personality}
                            </span>
                            {link.tagline && (
                              <span className="text-xs text-gray-500 italic">
                                "{link.tagline}"
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 border border-brand/20 bg-brand/5 rounded-xl p-8">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex p-3 bg-brand/10 rounded-full mb-4">
              <Sparkles className="h-6 w-6 text-brand" />
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Found what you're looking for?
            </h3>

            <p className="text-gray-600 mb-6">
              If not, our friendly support team is always here to help you
              navigate.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="px-6 py-3 bg-brand text-white rounded-lg hover:bg-brand transition-colors font-medium flex items-center justify-center gap-2"
              >
                <MessageSquare className="h-4 w-4" />
                Chat with Support
              </Link>
              <Link
                href="/"
                className="px-6 py-3 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Back to Homepage
              </Link>
            </div>

            <div className="mt-6 pt-6 border-t border-brand/20">
              <p className="text-sm text-gray-500">
                Pro tip: Bookmark this page for quick reference!
              </p>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-6 text-sm text-gray-500">
            <a
              href="/sitemap.xml"
              className="hover:text-brand transition-colors flex items-center gap-1"
            >
              <FileText className="h-4 w-4" />
              XML Sitemap
            </a>
            <span className="text-gray-300">•</span>
            <Link href="/faqs" className="hover:text-brand transition-colors">
              Need help? Check FAQs
            </Link>
            <span className="text-gray-300">•</span>
            <Link
              href="/how-it-works"
              className="hover:text-brand transition-colors"
            >
              How our platform works
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
