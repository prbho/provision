// lib/services/property-service.ts
import { Query } from 'appwrite'

import {
  DATABASE_ID,
  databases,
  PROPERTIES_COLLECTION_ID,
} from '@/lib/appwrite'

import { PremiumListingService } from './premium-service'

export class PropertyService {
  /**
   * Update a property's isFeatured status
   */
  static async updateFeaturedStatus(propertyId: string, isFeatured: boolean) {
    try {
      console.log('🔧 UPDATE FEATURED STATUS START:', {
        propertyId,
        isFeatured,
        timestamp: new Date().toISOString(),
      })

      // First, check the current state of the property
      const currentProperty = await databases.getDocument(
        DATABASE_ID,
        PROPERTIES_COLLECTION_ID,
        propertyId
      )

      console.log('📊 Current property state:', {
        id: currentProperty.$id,
        isFeatured: (currentProperty as any).isFeatured,
        isActive: (currentProperty as any).isActive,
        hasFeaturedField: 'isFeatured' in currentProperty,
        allFields: Object.keys(currentProperty),
      })

      // Update the property
      const updateData: Record<string, any> = {
        lastUpdated: new Date().toISOString(),
      }

      // Check which field name to use based on your schema
      if ('isFeatured' in currentProperty) {
        updateData.isFeatured = isFeatured
      } else if ('featured' in currentProperty) {
        updateData.featured = isFeatured
      } else {
        console.warn(
          '⚠️ Neither "isFeatured" nor "featured" field found in property schema'
        )
        updateData.isFeatured = isFeatured // Try isFeatured as default
      }

      console.log('📝 Update data:', updateData)

      const updatedProperty = await databases.updateDocument(
        DATABASE_ID,
        PROPERTIES_COLLECTION_ID,
        propertyId,
        updateData
      )

      console.log(
        `✅ Property ${propertyId} featured status updated to: ${isFeatured}`
      )

      return updatedProperty
    } catch (error: any) {
      console.error('❌ Error updating property featured status:', {
        propertyId,
        isFeatured,
        message: error.message,
        code: error.code,
        type: error.type,
        data: error.data,
      })
      throw error
    }
  }

  /**
   * Get all properties for a user/agent
   */
  static async getUserProperties(userId: string) {
    console.log('🔍 GET USER PROPERTIES:', userId)

    try {
      // Try different queries to see which one works
      const queries = [
        Query.equal('agentId', userId),
        Query.equal('isActive', true),
      ]

      const properties = await databases.listDocuments(
        DATABASE_ID,
        PROPERTIES_COLLECTION_ID,
        queries
      )

      console.log('📊 Found properties:', {
        userId,
        total: properties.total,
        sampleProperty:
          properties.documents.length > 0
            ? {
                id: properties.documents[0].$id,
                agentId: (properties.documents[0] as any).agentId,
                isActive: (properties.documents[0] as any).isActive,
                isFeatured: (properties.documents[0] as any).isFeatured,
                featured: (properties.documents[0] as any).featured,
              }
            : 'No properties found',
      })

      return properties.documents
    } catch (error: any) {
      console.error('❌ Error fetching user properties:', {
        userId,
        message: error.message,
        code: error.code,
      })
      throw error
    }
  }

  /**
   * Update all user properties to featured when they become premium
   */
  static async featureAllUserProperties(userId: string) {
    console.log('🌟 FEATURE ALL USER PROPERTIES START:', userId)

    try {
      const userProperties = await this.getUserProperties(userId)

      console.log(
        `📊 Processing ${userProperties.length} properties for user ${userId}`
      )

      const updatePromises = userProperties.map((property) =>
        this.updateFeaturedStatus(property.$id, true)
      )

      const results = await Promise.allSettled(updatePromises)

      const successful = results.filter(
        (result) => result.status === 'fulfilled'
      ).length
      const failed = results.filter(
        (result) => result.status === 'rejected'
      ).length

      console.log(
        `✅ Featured ${successful} properties for user ${userId}, ${failed} failed`
      )

      // Log failed updates
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          console.error(
            `❌ Failed to feature property ${userProperties[index].$id}:`,
            result.reason
          )
        }
      })

      return {
        successful,
        failed,
        total: userProperties.length,
      }
    } catch (error: any) {
      console.error('❌ Error featuring all user properties:', {
        userId,
        message: error.message,
        stack: error.stack,
      })
      throw error
    }
  }

  /**
   * Sync property featured status with premium listings
   * This ensures properties are featured only when they have active premium
   */
  static async syncPropertyWithPremium(propertyId: string) {
    console.log('🔄 SYNC PROPERTY WITH PREMIUM START:', propertyId)

    try {
      // Check if property exists first
      try {
        const property = await databases.getDocument(
          DATABASE_ID,
          PROPERTIES_COLLECTION_ID,
          propertyId
        )
        console.log('📋 Property found:', {
          id: property.$id,
          title: (property as any).title || 'No title',
        })
      } catch (propertyError: any) {
        console.error('❌ Property not found:', {
          propertyId,
          error: propertyError.message,
        })
        throw new Error(`Property ${propertyId} not found`)
      }

      // Check premium status
      const hasActivePremium =
        await PremiumListingService.isPropertyPremium(propertyId)

      console.log('📊 Premium status check:', {
        propertyId,
        hasActivePremium,
      })

      // Update featured status based on premium status
      await this.updateFeaturedStatus(propertyId, hasActivePremium)

      console.log(
        `✅ Synced property ${propertyId} featured status: ${hasActivePremium}`
      )
      return hasActivePremium
    } catch (error: any) {
      console.error('❌ Error syncing property with premium:', {
        propertyId,
        message: error.message,
        stack: error.stack,
      })
      throw error
    }
  }

  /**
   * Sync all user properties with their premium status
   */
  static async syncUserPropertiesPremiumStatus(userId: string) {
    console.log('🔄 SYNC USER PROPERTIES PREMIUM STATUS START:', userId)

    try {
      const userProperties = await this.getUserProperties(userId)

      console.log(
        `📊 Syncing ${userProperties.length} properties for user ${userId}`
      )

      const syncPromises = userProperties.map((property) =>
        this.syncPropertyWithPremium(property.$id)
      )

      const results = await Promise.allSettled(syncPromises)
      const successful = results.filter(
        (result) => result.status === 'fulfilled'
      ).length

      console.log(
        `✅ Synced premium status for ${successful}/${userProperties.length} properties for user ${userId}`
      )

      // Log failures
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          console.error(
            `❌ Failed to sync property ${userProperties[index].$id}:`,
            result.reason
          )
        }
      })

      return {
        successful,
        total: userProperties.length,
      }
    } catch (error: any) {
      console.error('❌ Error syncing user properties premium status:', {
        userId,
        message: error.message,
        stack: error.stack,
      })
      throw error
    }
  }

  /**
   * Get property by ID
   */
  static async getPropertyById(propertyId: string) {
    console.log('🔍 GET PROPERTY BY ID:', propertyId)

    try {
      const property = await databases.getDocument(
        DATABASE_ID,
        PROPERTIES_COLLECTION_ID,
        propertyId
      )

      console.log('✅ Property found:', {
        id: property.$id,
        availableFields: Object.keys(property).filter(
          (k) => !k.startsWith('$')
        ),
        featuredStatus:
          (property as any).featured || (property as any).isFeatured,
        isActive: (property as any).isActive,
      })

      return property
    } catch (error: any) {
      console.error('❌ Error fetching property:', {
        propertyId,
        message: error.message,
        code: error.code,
        type: error.type,
      })
      throw error
    }
  }
}
