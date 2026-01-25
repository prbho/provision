// components/chatbot/types.ts
/* eslint-disable @typescript-eslint/no-explicit-any */

export interface Property {
  $id: string
  $collectionId: string
  $databaseId: string
  $createdAt: string
  $updatedAt: string
  $permissions: string[]
  agentId: string
  userId: string
  name: string
  propertyId: string
  agentName: string
  title: string
  description: string
  propertyType: string
  status: string
  price: number
  priceUnit: string
  originalPrice?: number
  priceHistory: any[]
  address: string
  paymentOutright: string
  phone: string
  city: string
  state: string
  zipCode: string
  country: string
  neighborhood?: string
  latitude: number
  longitude: number
  bedrooms: number
  bathrooms: number
  squareFeet: number
  lotSize?: number
  yearBuilt?: number
  features: string[]
  titles: string[]
  amenities: string[]
  images: string[]
  videos: string[]
  ownerId: string
  listedBy: string
  listDate: string
  lastUpdated: string
  isActive: boolean
  isFeatured: boolean
  isVerified: boolean
  tags: string[]
  views: number
  favorites: number
  outright: boolean
  paymentPlan: boolean
  mortgageEligible: boolean
  customPlanAvailable: boolean
  customPlanDepositPercent: number
  customPlanMonths: number
}

export interface ChatMessage {
  id: string
  type: 'user' | 'bot' | 'card'
  content: string
  timestamp: Date
  propertyData?: Property[]
}

export interface Memory {
  propertyType?: string
  budget?: string
  location?: string
  bedrooms?: string
  bathrooms?: string
  moveInDate?: string
  contactRequested?: string
  name?: string
  email?: string
  phone?: string

  // Add conversation state tracking
  conversationStep?:
    | 'greeting'
    | 'property_type'
    | 'location'
    | 'results'
    | 'details'
    | 'scheduling'
  propertiesFound?: number
  lastQuestionAsked?:
    | 'location'
    | 'propertyType'
    | 'budget'
    | 'bedrooms'
    | 'none'
}

export interface LeadFormData {
  name: string
  email: string
  phone: string
  propertyInterest: string
  budget: string
  timeline: string
  message: string
  bedrooms: string
  location: string
  source?: 'chatbot' | 'website' | 'contact-form'
  status?: 'new' | 'contacted' | 'qualified' | 'converted'
}

export interface QuickReply {
  label: string
  action: () => void
}

// Local storage keys
export const LS_MEMORY_KEY = 'axon_memory'
export const LS_CONVO_KEY = 'axon_conversation'
export const LS_VOICE_MUTED_KEY = 'axon_voice_muted'

// Environment variables with fallbacks
export const DATABASE_ID =
  process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'propertyDB'
export const PROPERTIES_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_PROPERTIES_TABLE_ID || 'properties'
export const LEADS_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_LEADS_TABLE_ID || 'leads'

// Free AI API configuration
export const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY
export const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'
