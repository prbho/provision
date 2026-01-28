// app/api/properties/[id]/route.ts - FIXED
/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from 'next/server'

import {
  DATABASE_ID,
  databases,
  PROPERTIES_COLLECTION_ID,
} from '@/lib/appwrite-server'

interface Context {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, context: Context) {
  try {
    // Await the params Promise
    const params = await context.params
    const propertyId = params.id

    console.log('🔍 Fetching property with ID:', propertyId)

    // Validate property ID
    if (!propertyId || propertyId.trim().length === 0) {
      console.error('❌ Invalid property ID:', propertyId)
      return NextResponse.json(
        { error: 'Invalid property ID' },
        { status: 400 }
      )
    }

    const property = await databases.getDocument(
      DATABASE_ID,
      PROPERTIES_COLLECTION_ID,
      propertyId
    )

    console.log('✅ Property found:', property?.title || 'No title')

    // Increment view count
    try {
      await databases.updateDocument(
        DATABASE_ID,
        PROPERTIES_COLLECTION_ID,
        propertyId,
        {
          views: (property.views || 0) + 1,
        }
      )
      console.log('✅ View count incremented')
    } catch (updateError) {
      console.error('❌ Error updating view count:', updateError)
      // Don't fail the entire request if view count update fails
    }

    return NextResponse.json(property)
  } catch (error: any) {
    console.error('❌ Error fetching property:', {
      message: error.message,
      code: error.code,
      type: error.type,
    })

    // Handle specific errors
    if (error.code === 404) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }

    if (error.code === 401) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to fetch property' },
      { status: 500 }
    )
  }
}
