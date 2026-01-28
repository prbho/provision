// lib/services/premium-service.ts
/* eslint-disable @typescript-eslint/no-explicit-any */

import { PlanType, PremiumListing } from '@/types'
import { ID, Models, Query } from 'appwrite'

import {
  DATABASE_ID,
  databases,
  PREMIUM_COLLECTION_ID,
} from '../appwrite-server'
import { PropertyService } from './property-service'

export const PREMIUM_PLANS: Record<
  PlanType,
  {
    name: string
    description: string
    price: number
    duration: number
    priority: number
    features: string[]
  }
> = {
  featured: {
    name: 'Featured Listing',
    description: 'Get your property featured at the top of search results',
    price: 500000, // 5000 Naira in kobo
    duration: 7,
    priority: 8,
    features: [
      'Top of search results',
      'Featured badge',
      '7 days visibility',
      'Priority placement',
    ],
  },
  premium: {
    name: 'Premium Listing',
    description: 'Maximum visibility with premium placement',
    price: 1500000, // 15000 Naira in kobo
    duration: 30,
    priority: 9,
    features: [
      'Top of search results',
      'Premium badge',
      '30 days visibility',
      'Highest priority',
      'Featured in premium section',
    ],
  },
  enterprise: {
    name: 'Enterprise',
    description: 'For agencies with multiple premium listings',
    price: 3000000, // 30000 Naira in kobo
    duration: 30,
    priority: 10,
    features: [
      'Multiple listings',
      'Agency branding',
      'Highest priority',
      'Dedicated support',
      'Analytics dashboard',
    ],
  },
}

export class PremiumListingService {
  // Create premium listing
  static async createPremiumListing(data: {
    propertyId: string
    agentId: string
    userId: string
    planType: PlanType
    paymentId: string
    isExtension?: boolean
  }): Promise<PremiumListing> {
    console.log('💎 CREATE PREMIUM LISTING START:', data)

    try {
      // Check if premium listing already exists for this property
      const existingListings = await databases.listDocuments(
        DATABASE_ID,
        PREMIUM_COLLECTION_ID,
        [
          Query.equal('propertyId', data.propertyId),
          Query.equal('status', 'active'),
        ]
      )

      // If this is an extension and we have an existing active listing
      if (data.isExtension && existingListings.total > 0) {
        console.log('🔄 EXTENDING EXISTING PREMIUM LISTING:', {
          propertyId: data.propertyId,
          existingId: existingListings.documents[0].$id,
        })

        const existingListing = existingListings.documents[0]
        const currentEndDate = new Date(existingListing.endDate)
        const plan = PREMIUM_PLANS[data.planType]

        // Calculate new end date by adding plan duration to existing end date
        const newEndDate = new Date(currentEndDate)
        newEndDate.setDate(newEndDate.getDate() + plan.duration)

        console.log('📅 Extension dates:', {
          currentEndDate: currentEndDate.toISOString(),
          newEndDate: newEndDate.toISOString(),
          addedDays: plan.duration,
        })

        // Update the existing premium listing
        const updateData: any = {
          endDate: newEndDate.toISOString(),
          paymentId: data.paymentId,
          renewal: 'extended',
          $updatedAt: new Date().toISOString(),
        }

        // Add extension tracking if metadata field exists
        const existingListingData = existingListing as any
        if (existingListingData.metadata !== undefined) {
          const currentMetadata = existingListingData.metadata
            ? JSON.parse(existingListingData.metadata)
            : {}

          updateData.metadata = JSON.stringify({
            ...currentMetadata,
            lastExtendedAt: new Date().toISOString(),
            totalExtensions: (currentMetadata.totalExtensions || 0) + 1,
            extensions: [
              ...(currentMetadata.extensions || []),
              {
                extendedAt: new Date().toISOString(),
                addedDays: plan.duration,
                paymentId: data.paymentId,
                previousEndDate: currentEndDate.toISOString(),
                newEndDate: newEndDate.toISOString(),
              },
            ],
          })
        }

        const updatedListing = await databases.updateDocument(
          DATABASE_ID,
          PREMIUM_COLLECTION_ID,
          existingListing.$id,
          updateData
        )

        console.log('✅ Premium listing extended:', {
          id: updatedListing.$id,
          newEndDate: (updatedListing as any).endDate,
        })

        return this.mapToPremiumListing(updatedListing)
      }

      // If no extension or no existing listing, create new one
      if (existingListings.total > 0) {
        console.log(
          '⚠️ Active premium listing already exists for property:',
          data.propertyId
        )
      }

      const plan = PREMIUM_PLANS[data.planType]
      const startDate = new Date().toISOString()
      const endDate = new Date(
        Date.now() + plan.duration * 24 * 60 * 60 * 1000
      ).toISOString()

      console.log('📅 New premium listing dates:', {
        startDate,
        endDate,
        duration: plan.duration,
      })

      const documentData = {
        propertyId: data.propertyId,
        agentId: data.agentId,
        userId: data.userId,
        planType: data.planType,
        status: 'active',
        startDate,
        endDate,
        priority: plan.priority,
        impressions: 0,
        clicks: 0,
        paymentId: data.paymentId,
        renewal: 'monthly',
      }

      console.log('📝 Creating new premium listing document:', documentData)

      const premiumListing = await databases.createDocument(
        DATABASE_ID,
        PREMIUM_COLLECTION_ID,
        ID.unique(),
        documentData
      )

      console.log('✅ New premium listing created:', {
        id: premiumListing.$id,
        propertyId: (premiumListing as any).propertyId,
        expires: (premiumListing as any).endDate,
      })

      // Sync property featured status
      try {
        console.log('🔄 Syncing property featured status...')
        await PropertyService.syncPropertyWithPremium(data.propertyId)
        console.log('✅ Property featured status synced')
      } catch (syncError: any) {
        console.warn(
          '⚠️ Property sync error (non-critical):',
          syncError.message
        )
        // Continue even if sync fails
      }

      return this.mapToPremiumListing(premiumListing)
    } catch (error: any) {
      console.error('❌ Create premium listing error:', {
        message: error.message,
        code: error.code,
        type: error.type,
        data: error.data,
      })
      throw error
    }
  }

  // Get active premium listings for search
  static async getActivePremiumListings(): Promise<PremiumListing[]> {
    console.log('🔍 GET ACTIVE PREMIUM LISTINGS')

    try {
      const now = new Date().toISOString()

      const result = await databases.listDocuments(
        DATABASE_ID,
        PREMIUM_COLLECTION_ID,
        [
          Query.equal('status', 'active'),
          Query.greaterThan('endDate', now),
          Query.orderDesc('priority'),
          Query.orderDesc('startDate'),
        ]
      )

      console.log('✅ Found active premium listings:', result.total)
      return result.documents.map((doc) => this.mapToPremiumListing(doc))
    } catch (error: any) {
      console.error('❌ Get active premium listings error:', error.message)
      return []
    }
  }

  // Check if property has active premium
  static async isPropertyPremium(propertyId: string): Promise<boolean> {
    console.log('🔍 CHECK PROPERTY PREMIUM:', propertyId)

    try {
      const now = new Date().toISOString()

      const result = await databases.listDocuments(
        DATABASE_ID,
        PREMIUM_COLLECTION_ID,
        [
          Query.equal('propertyId', propertyId),
          Query.equal('status', 'active'),
          Query.greaterThan('endDate', now),
        ]
      )

      console.log('📊 Premium status:', {
        propertyId,
        isPremium: result.total > 0,
        activeListings: result.total,
      })

      return result.total > 0
    } catch (error: any) {
      console.error('❌ Check property premium error:', error.message)
      return false
    }
  }

  // Get agent's premium listings
  static async getAgentPremiumListings(
    agentId: string
  ): Promise<PremiumListing[]> {
    console.log('🔍 GET AGENT PREMIUM LISTINGS:', agentId)

    try {
      const now = new Date().toISOString()

      const result = await databases.listDocuments(
        DATABASE_ID,
        PREMIUM_COLLECTION_ID,
        [
          Query.equal('agentId', agentId),
          Query.equal('status', 'active'),
          Query.greaterThan('endDate', now),
          Query.orderDesc('priority'),
        ]
      )

      console.log('✅ Agent premium listings:', result.total)
      return result.documents.map((doc) => this.mapToPremiumListing(doc))
    } catch (error: any) {
      console.error('❌ Get agent premium listings error:', error.message)
      return []
    }
  }

  // Record impression
  static async recordImpression(premiumListingId: string): Promise<void> {
    console.log('📊 RECORD IMPRESSION:', premiumListingId)

    try {
      const listing = await databases.getDocument(
        DATABASE_ID,
        PREMIUM_COLLECTION_ID,
        premiumListingId
      )

      const currentImpressions = (listing as any).impressions || 0
      const newImpressions = currentImpressions + 1

      await databases.updateDocument(
        DATABASE_ID,
        PREMIUM_COLLECTION_ID,
        premiumListingId,
        {
          impressions: newImpressions,
        }
      )

      console.log('✅ Impression recorded:', {
        listingId: premiumListingId,
        impressions: newImpressions,
      })
    } catch (error: any) {
      console.error('❌ Record impression error:', error.message)
      throw error
    }
  }

  // Record click
  static async recordClick(premiumListingId: string): Promise<void> {
    console.log('📊 RECORD CLICK:', premiumListingId)

    try {
      const listing = await databases.getDocument(
        DATABASE_ID,
        PREMIUM_COLLECTION_ID,
        premiumListingId
      )

      const currentClicks = (listing as any).clicks || 0
      const newClicks = currentClicks + 1

      await databases.updateDocument(
        DATABASE_ID,
        PREMIUM_COLLECTION_ID,
        premiumListingId,
        {
          clicks: newClicks,
        }
      )

      console.log('✅ Click recorded:', {
        listingId: premiumListingId,
        clicks: newClicks,
      })
    } catch (error: any) {
      console.error('❌ Record click error:', error.message)
      throw error
    }
  }

  /**
   * Check for expired premium listings and update their status
   */
  static async processExpiredListings(): Promise<{ expired: number }> {
    console.log('⏰ PROCESS EXPIRED LISTINGS START')

    try {
      const now = new Date().toISOString()

      // Find active listings that have expired
      const expiredListings = await databases.listDocuments(
        DATABASE_ID,
        PREMIUM_COLLECTION_ID,
        [Query.equal('status', 'active'), Query.lessThanEqual('endDate', now)]
      )

      console.log('📊 Expired listings found:', expiredListings.total)

      // Update expired listings
      const updatePromises = expiredListings.documents.map((listing) =>
        databases.updateDocument(
          DATABASE_ID,
          PREMIUM_COLLECTION_ID,
          listing.$id,
          {
            status: 'expired',
          }
        )
      )

      await Promise.all(updatePromises)

      console.log('✅ Expired listings processed:', expiredListings.total)

      // Sync properties that lost premium status
      for (const listing of expiredListings.documents) {
        try {
          await PropertyService.syncPropertyWithPremium(
            (listing as any).propertyId
          )
        } catch (syncError) {
          console.warn('⚠️ Failed to sync expired property:', syncError)
        }
      }

      return { expired: expiredListings.total }
    } catch (error: any) {
      console.error('❌ Process expired listings error:', error.message)
      throw error
    }
  }

  // Helper method to map AppWrite document to PremiumListing
  private static mapToPremiumListing(doc: Models.Document): PremiumListing {
    const typedDoc = doc as any

    console.log('🗺️ Mapping to PremiumListing:', {
      id: doc.$id,
      propertyId: typedDoc.propertyId,
      status: typedDoc.status,
    })

    const premiumListing = {
      $id: doc.$id,
      $createdAt: doc.$createdAt,
      $updatedAt: doc.$updatedAt,
      propertyId: typedDoc.propertyId,
      agentId: typedDoc.agentId,
      userId: typedDoc.userId,
      planType: typedDoc.planType,
      status: typedDoc.status,
      startDate: typedDoc.startDate,
      endDate: typedDoc.endDate,
      priority: typedDoc.priority,
      impressions: typedDoc.impressions || 0,
      clicks: typedDoc.clicks || 0,
      paymentId: typedDoc.paymentId,
      renewal: typedDoc.renewal,
    }

    console.log('✅ Mapped PremiumListing:', premiumListing)
    return premiumListing
  }
}
