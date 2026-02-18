import { NextRequest, NextResponse } from 'next/server'

import {
  DATABASE_ID,
  databases,
  PROPERTIES_COLLECTION_ID,
  Query,
} from '@/lib/appwrite'

let propertyFulltextSupported: boolean | null = null

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const status = searchParams.get('status')
    const type = searchParams.get('type')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const city = searchParams.get('city')
    const state = searchParams.get('state')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const bedrooms = searchParams.get('bedrooms')
    const propertyType = searchParams.get('propertyType')
    const q = searchParams.get('q')

    const baseQueries = [Query.equal('isActive', true)]

    let finalStatus = status

    if (type === 'buy') {
      finalStatus = 'for-sale'
    } else if (type === 'rent') {
      finalStatus = 'for-rent'
    } else if (type === 'short-let') {
      finalStatus = 'short-let'
    } else if (type === 'all') {
      finalStatus = null
    }

    if (finalStatus && finalStatus !== 'all') {
      baseQueries.push(Query.equal('status', finalStatus))
    }

    const searchQueries = [...baseQueries]
    if (q && propertyFulltextSupported !== false) {
      const cleanQuery = q.trim().toLowerCase()
      searchQueries.push(
        Query.or([
          Query.search('title', cleanQuery),
          Query.search('city', cleanQuery),
          Query.search('state', cleanQuery),
          Query.search('description', cleanQuery),
        ])
      )
    }

    if (city) {
      const cityOrStateQuery = Query.or([
        Query.equal('city', city),
        Query.equal('state', city),
      ])
      baseQueries.push(cityOrStateQuery)
      searchQueries.push(cityOrStateQuery)
    }
    if (state) {
      const stateQuery = Query.equal('state', state)
      baseQueries.push(stateQuery)
      searchQueries.push(stateQuery)
    }

    if (minPrice) {
      const min = Query.greaterThanEqual('price', parseInt(minPrice))
      baseQueries.push(min)
      searchQueries.push(min)
    }
    if (maxPrice) {
      const max = Query.lessThanEqual('price', parseInt(maxPrice))
      baseQueries.push(max)
      searchQueries.push(max)
    }
    if (bedrooms) {
      const beds = Query.equal('bedrooms', parseInt(bedrooms))
      baseQueries.push(beds)
      searchQueries.push(beds)
    }
    if (propertyType) {
      const pt = Query.equal('propertyType', propertyType)
      baseQueries.push(pt)
      searchQueries.push(pt)
    }

    const offset = (page - 1) * limit
    const paginationQueries = [
      Query.limit(limit),
      Query.offset(offset),
      Query.orderDesc('isFeatured'),
      Query.orderDesc('listDate'),
    ]

    let properties
    try {
      properties = await databases.listDocuments(
        DATABASE_ID,
        PROPERTIES_COLLECTION_ID,
        [...searchQueries, ...paginationQueries]
      )
      if (q) {
        propertyFulltextSupported = true
      }
    } catch (error: unknown) {
      const message = String((error as { message?: string })?.message || '')
      const fullTextUnavailable = message.includes('requires a fulltext index')
      if (!fullTextUnavailable || !q) throw error

      propertyFulltextSupported = false
      properties = await databases.listDocuments(
        DATABASE_ID,
        PROPERTIES_COLLECTION_ID,
        [...baseQueries, ...paginationQueries]
      )
    }

    return NextResponse.json({
      success: true,
      documents: properties.documents,
      total: properties.total,
      currentPage: page,
      limit,
      hasMore: page * limit < properties.total,
    })
  } catch (error) {
    console.error('Properties API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch properties',
      },
      { status: 500 }
    )
  }
}
