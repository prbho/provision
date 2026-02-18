// app/api/favorites/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from 'next/server'
import { ID, Query } from 'node-appwrite'

import {
  AGENTS_COLLECTION_ID, // ← ADD THIS
  DATABASE_ID,
  databases,
  FAVORITES_COLLECTION_ID,
  PROPERTIES_COLLECTION_ID,
  USERS_COLLECTION_ID,
} from '@/lib/appwrite-server'
import { triggerFavoriteNotification } from '@/lib/services/server/notificationTriggers'

const log = (...args: unknown[]) => {
  if (process.env.NODE_ENV !== 'production') console.log(...args)
}

// GET /api/favorites - Get user's favorites with property details
export async function GET(request: NextRequest) {
  log('🔍 [FAVORITES API] GET /api/favorites called')
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const propertyId = searchParams.get('propertyId')
    const category = searchParams.get('category')

    log('🔍 Query params:', { userId, propertyId, category })

    if (!userId) {
      log('❌ Missing userId')
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const queries = [Query.equal('userId', userId)]

    if (propertyId) {
      queries.push(Query.equal('propertyId', propertyId))
    }

    if (category) {
      queries.push(Query.equal('category', category))
    }

    queries.push(Query.orderDesc('$createdAt'))

    log('🔍 Appwrite queries:', queries)

    const favoritesResponse = await databases.listDocuments(
      DATABASE_ID,
      FAVORITES_COLLECTION_ID,
      queries
    )

    log('🔍 Found favorites:', favoritesResponse.total)

    // If we need property details, fetch them
    if (favoritesResponse.total > 0 && !propertyId) {
      const favoritesWithDetails = await Promise.all(
        favoritesResponse.documents.map(async (favorite) => {
          try {
            // Fetch property details
            const property = await databases.getDocument(
              DATABASE_ID,
              PROPERTIES_COLLECTION_ID,
              favorite.propertyId
            )

            return {
              ...favorite,
              property, // Include full property details
            }
          } catch (error) {
            console.error(
              '❌ [API /favorites] Error fetching property:',
              favorite.propertyId,
              error
            )
            return {
              ...favorite,
              property: null, // Property might be deleted
            }
          }
        })
      )

      return NextResponse.json({
        favorites: favoritesWithDetails,
        total: favoritesResponse.total,
      })
    }

    return NextResponse.json({
      favorites: favoritesResponse.documents,
      total: favoritesResponse.total,
    })
  } catch (error: any) {
    console.error('❌ [FAVORITES API] GET error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch favorites' },
      { status: 500 }
    )
  }
}

// POST /api/favorites - Add to favorites with validation
export async function POST(request: NextRequest) {
  log('🔍 [FAVORITES API] POST /api/favorites called - Start')
  log('🔍 Request URL:', request.url)

  try {
    const body = await request.json()
    log('🔍 Request body:', body)

    const { userId, propertyId, notes, category } = body

    if (!userId || !propertyId) {
      log('❌ Missing required fields:', { userId, propertyId })
      return NextResponse.json(
        { error: 'User ID and Property ID are required' },
        { status: 400 }
      )
    }

    // 🔧 FIXED: Validate that user exists in either agents or users collection
    log('🔍 Validating user:', userId)
    let user = null
    let userCollection = ''

    // Try agents collection first, then users collection
    const userCollections = [AGENTS_COLLECTION_ID, USERS_COLLECTION_ID] // ← USE CONSTANTS

    for (const collection of userCollections) {
      try {
        log(`🔍 Checking ${collection} collection...`)
        user = await databases.getDocument(DATABASE_ID, collection, userId)
        log(`✅ User found in ${collection} collection:`, user.name)
        userCollection = collection
        break // Exit loop once user is found
      } catch {
        log(`❌ User not in ${collection} collection`)
        continue
      }
    }

    // If user is still not found after checking both collections
    if (!user) {
      console.error('❌ User not found in agents or users collection:', userId)
      return NextResponse.json(
        {
          error: 'User not found',
        },
        { status: 404 }
      )
    }

    log(`✅ Using user from ${userCollection} collection`)

    // Validate that property exists
    let property
    try {
      log('🔍 Validating property:', propertyId)
      property = await databases.getDocument(
        DATABASE_ID,
        PROPERTIES_COLLECTION_ID,
        propertyId
      )
      log('✅ Property found:', property.title)
      log('🔍 Property agentId:', property.agentId)
      log('🔍 Property ownerId:', property.ownerId)
    } catch (error: any) {
      console.error('❌ Property not found:', propertyId, error.message)
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }

    // Check if already favorited
    log('🔍 Checking if already favorited...')
    const existingFavorites = await databases.listDocuments(
      DATABASE_ID,
      FAVORITES_COLLECTION_ID,
      [Query.equal('userId', userId), Query.equal('propertyId', propertyId)]
    )

    if (existingFavorites.total > 0) {
      log('❌ Already favorited')
      return NextResponse.json(
        { error: 'Property is already in favorites' },
        { status: 409 }
      )
    }

    const favoriteData = {
      userId,
      propertyId,
      addedAt: new Date().toISOString(),
      notes: notes || '',
      category: category || 'wishlist',
    }

    log('🔍 Creating favorite document:', favoriteData)

    const response = await databases.createDocument(
      DATABASE_ID,
      FAVORITES_COLLECTION_ID,
      ID.unique(),
      favoriteData
    )

    log('✅ Favorite created with ID:', response.$id)

    // 🔔 TRIGGER FAVORITE NOTIFICATION
    try {
      log('🔍 Checking notification...')
      // Determine who should get the notification (property owner or agent)
      const notificationRecipientId = property.agentId || property.ownerId
      log('🔍 Notification recipient:', notificationRecipientId)

      if (notificationRecipientId && notificationRecipientId !== userId) {
        log('🔔 Triggering notification...')
        await triggerFavoriteNotification({
          propertyOwnerId: notificationRecipientId,
          userName: user.name || 'A user',
          propertyId: propertyId,
          propertyTitle: property.title,
        })
        log('✅ Notification triggered')
      } else {
        log('ℹ️ No notification needed (same user or no recipient)')
      }
    } catch (error: any) {
      console.error('❌ Notification failed:', error.message)
      // Silently fail if notification fails
    }

    // After the favorite is successfully created, optionally create a lead
    try {
      log('🔍 Checking lead creation...')
      log('🔍 Property agentId:', property.agentId)
      log('🔍 Current userId:', userId)
      log(
        '🔍 Are they different?',
        property.agentId && property.agentId !== userId
      )

      // Only create lead if property belongs to an agent and user is not the agent
      if (property.agentId && property.agentId !== userId) {
        log('🎯 Creating lead...')
        const leadUrl = `${request.nextUrl.origin}/api/favorites/leads`
        log('🔗 Lead creation URL:', leadUrl)

        const leadResponse = await fetch(leadUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            propertyId,
            notes: notes || '',
            favoriteId: response.$id,
          }),
        })

        log('📡 Lead creation response status:', leadResponse.status)

        if (!leadResponse.ok) {
          const errorText = await leadResponse.text()
          console.error(
            '❌ Lead creation failed with status:',
            leadResponse.status
          )
          console.error('❌ Lead creation error:', errorText)
          // Don't throw, just log
        } else {
          const leadResult = await leadResponse.json()
          log('✅ Lead created:', leadResult)
        }
      } else {
        log('ℹ️ No lead creation needed (no agent or same user)')
      }
    } catch (error: any) {
      console.error('❌ Lead creation exception:', error.message)
      // Don't fail the favorite request if lead creation fails
    }

    // Update the property's favorites count atomically
    try {
      log('🔍 Updating property favorites count...')
      const currentFavorites = property.favorites || 0
      log('🔍 Current favorites:', currentFavorites)

      await databases.updateDocument(
        DATABASE_ID,
        PROPERTIES_COLLECTION_ID,
        propertyId,
        {
          favorites: currentFavorites + 1,
        }
      )
      log('✅ Favorites count updated to:', currentFavorites + 1)
    } catch (error: any) {
      console.error('❌ Failed to update favorites count:', error.message)
      // Silently fail if favorites count update fails
    }

    log('✅ [FAVORITES API] POST completed successfully')
    return NextResponse.json(response, { status: 201 })
  } catch (error: any) {
    console.error('❌ [FAVORITES API] POST error:', error)
    console.error('❌ Error stack:', error.stack)
    return NextResponse.json(
      { error: 'Failed to add to favorites' },
      { status: 500 }
    )
  }
}

// DELETE /api/favorites - Remove from favorites
export async function DELETE(request: NextRequest) {
  log('🔍 [FAVORITES API] DELETE /api/favorites called')
  try {
    const { searchParams } = new URL(request.url)
    const favoriteId = searchParams.get('favoriteId')
    const propertyId = searchParams.get('propertyId')

    log('🔍 Query params:', { favoriteId, propertyId })

    if (!favoriteId || !propertyId) {
      log('❌ Missing required params')
      return NextResponse.json(
        { error: 'Favorite ID and Property ID are required' },
        { status: 400 }
      )
    }

    // Get the property first to get current favorites count
    let currentFavorites = 0
    try {
      log('🔍 Getting property:', propertyId)
      const property = await databases.getDocument(
        DATABASE_ID,
        PROPERTIES_COLLECTION_ID,
        propertyId
      )
      currentFavorites = property.favorites || 0
      log('🔍 Current favorites:', currentFavorites)
    } catch (error: any) {
      console.error('❌ Failed to get property:', error.message)
      // Use default value if property fetch fails
    }

    // Delete the favorite
    log('🔍 Deleting favorite:', favoriteId)
    await databases.deleteDocument(
      DATABASE_ID,
      FAVORITES_COLLECTION_ID,
      favoriteId
    )
    log('✅ Favorite deleted')

    // Update the property's favorites count atomically
    try {
      const newFavoritesCount = Math.max(0, currentFavorites - 1)
      log('🔍 New favorites count:', newFavoritesCount)

      await databases.updateDocument(
        DATABASE_ID,
        PROPERTIES_COLLECTION_ID,
        propertyId,
        {
          favorites: newFavoritesCount,
        }
      )
      log('✅ Property favorites count updated')
    } catch (error: any) {
      console.error('❌ Failed to update favorites count:', error.message)
      // Silently fail if favorites count update fails
    }

    log('✅ [FAVORITES API] DELETE completed successfully')
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('❌ [FAVORITES API] DELETE error:', error)
    console.error('❌ Error stack:', error.stack)
    return NextResponse.json(
      { error: 'Failed to remove favorite' },
      { status: 500 }
    )
  }
}

