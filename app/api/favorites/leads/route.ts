// app/api/favorites/leads/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from 'next/server'
import { ID, Query } from 'node-appwrite'

import {
  AGENTS_COLLECTION_ID, // ← ADD THIS
  DATABASE_ID,
  databases,
  LEADS_COLLECTION_ID,
  PROPERTIES_COLLECTION_ID,
  USERS_COLLECTION_ID,
} from '@/lib/appwrite-server'

const log = (...args: unknown[]) => {
  if (process.env.NODE_ENV !== 'production') console.log(...args)
}

// POST /api/favorites/leads - Create lead from favorite
export async function POST(request: NextRequest) {
  log('🔍 [LEADS API] POST /api/favorites/leads called')
  log('🔍 Request URL:', request.url)

  try {
    const body = await request.json()
    log('🔍 Request body:', body)

    const { userId, propertyId, notes, favoriteId } = body

    if (!userId || !propertyId) {
      log('❌ Missing required fields:', { userId, propertyId })
      return NextResponse.json(
        { error: 'User ID and Property ID are required' },
        { status: 400 }
      )
    }

    // 🔧 FIXED: Get user details - check both agents and users collections
    log('🔍 Getting user details:', userId)
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

    if (!user) {
      console.error('❌ User not found in agents or users collection:', userId)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    log(`✅ Using user from ${userCollection} collection`)

    // Get property details
    log('🔍 Getting property details:', propertyId)
    let property
    try {
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

    // Check if property belongs to an agent and user is not the agent
    log('🔍 Checking lead eligibility...')
    log('🔍 Property agentId:', property.agentId)
    log('🔍 Current userId:', userId)
    log(
      '🔍 Are they different?',
      property.agentId && property.agentId !== userId
    )

    if (!property.agentId || property.agentId === userId) {
      log('ℹ️ No lead created - property not owned by different agent')
      return NextResponse.json({
        message: 'No lead created - property not owned by different agent',
        created: false,
      })
    }

    // Verify agent exists (check both agents and users collections)
    log('🔍 Verifying agent exists:', property.agentId)
    let agentFound = false
    let agentCollection = ''

    for (const collection of userCollections) {
      try {
        const agent = await databases.getDocument(
          DATABASE_ID,
          collection,
          property.agentId
        )
        log(`✅ Agent found in ${collection} collection:`, agent.name)
        agentFound = true
        agentCollection = collection
        break
      } catch {
        continue
      }
    }

    if (!agentFound) {
      console.error('❌ Agent not found:', property.agentId)
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
    }

    log(`✅ Agent found in ${agentCollection} collection`)

    // Check if lead already exists for this user and property
    log('🔍 Checking for existing lead...')
    const existingLeads = await databases.listDocuments(
      DATABASE_ID,
      LEADS_COLLECTION_ID,
      [
        Query.equal('interestedUserId', userId),
        Query.equal('propertyId', propertyId),
        Query.equal('assignedAgentId', property.agentId),
      ]
    )

    log('🔍 Existing leads found:', existingLeads.total)

    if (existingLeads.total > 0) {
      log('ℹ️ Lead already exists')
      return NextResponse.json({
        message: 'Lead already exists',
        created: false,
        leadId: existingLeads.documents[0].$id,
      })
    }

    // Create new lead
    log('🔍 Creating new lead...')
    const leadData = {
      name: user.name || 'Unknown User',
      email: user.email,
      phone: user.phone || user.mobilePhone || '',
      interestedUserId: userId,
      propertyId: propertyId,
      propertyInterest: property.title,
      location: `${property.address}, ${property.city}, ${property.state}`,
      budget: property.price || 0,
      timeline: 'flexible',
      source: 'property_favorite',
      status: 'new',
      message: notes || `User favorited the property "${property.title}"`,
      assignedAgentId: property.agentId,
      favoriteId: favoriteId || '',
      // createdAt: new Date().toISOString(),
      // updatedAt: new Date().toISOString(),
    }

    log('🔍 Lead data:', leadData)

    const leadResponse = await databases.createDocument(
      DATABASE_ID,
      LEADS_COLLECTION_ID,
      ID.unique(),
      leadData
    )

    log('✅ Lead created with ID:', leadResponse.$id)

    return NextResponse.json(
      {
        success: true,
        created: true,
        lead: leadResponse,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('❌ [LEADS API] POST error:', error)
    console.error('❌ Error stack:', error.stack)
    return NextResponse.json(
      { error: 'Failed to create lead from favorite' },
      { status: 500 }
    )
  }
}

// GET /api/favorites/leads - Get leads created from favorites
export async function GET(request: NextRequest) {
  log('🔍 [LEADS API] GET /api/favorites/leads called')
  log('🔍 Request URL:', request.url)

  try {
    const { searchParams } = new URL(request.url)
    const agentId = searchParams.get('agentId')
    const userId = searchParams.get('userId')

    log('🔍 Query params:', { agentId, userId })

    if (!agentId) {
      log('❌ Agent ID is required')
      return NextResponse.json(
        { error: 'Agent ID is required' },
        { status: 400 }
      )
    }

    const queries = [
      Query.equal('assignedAgentId', agentId),
      Query.equal('source', 'property_favorite'),
      Query.orderDesc('$createdAt'),
    ]

    if (userId) {
      queries.push(Query.equal('interestedUserId', userId))
    }

    log('🔍 Appwrite queries:', queries)

    const leadsResponse = await databases.listDocuments(
      DATABASE_ID,
      LEADS_COLLECTION_ID,
      queries
    )

    log('🔍 Found leads:', leadsResponse.total)

    return NextResponse.json({
      leads: leadsResponse.documents,
      total: leadsResponse.total,
    })
  } catch (error: any) {
    console.error('❌ [LEADS API] GET error:', error)
    console.error('❌ Error stack:', error.stack)
    return NextResponse.json(
      { error: 'Failed to fetch favorite leads' },
      { status: 500 }
    )
  }
}

