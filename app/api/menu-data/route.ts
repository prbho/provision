// app/api/menu-data/route.ts
import { NextResponse } from 'next/server'
import { Query } from 'appwrite'

import {
  DATABASE_ID,
  databases,
  PROPERTIES_COLLECTION_ID,
  USERS_COLLECTION_ID,
} from '@/lib/appwrite'

export async function GET() {
  try {
    // Get active properties
    const propertiesResponse = await databases.listDocuments(
      DATABASE_ID,
      PROPERTIES_COLLECTION_ID,
      [
        Query.equal('isActive', true),
        Query.select(['city', 'state', 'status', 'price', 'isVerified']),
      ]
    )

    // Get users count for happy clients
    const usersResponse = await databases.listDocuments(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      [Query.equal('isActive', true)]
    )

    const properties = propertiesResponse.documents || []
    const totalUsers = usersResponse.total || 52300

    // Analyze properties
    const saleCities = new Map<string, number>()
    const rentCities = new Map<string, number>()
    const shortLetCities = new Map<string, number>()
    const allCities = new Set<string>()
    const states = new Set<string>()

    let totalPrice = 0
    let propertyCount = 0
    let totalForSale = 0
    let totalForRent = 0
    let totalForShortLet = 0
    let verifiedCount = 0

    // Track all statuses found
    const statusCounts: Record<string, number> = {}

    properties.forEach((property) => {
      const city = property.city
      const state = property.state
      const status = property.status?.toLowerCase()?.trim() || ''
      const price = parseFloat(property.price) || 0
      const isVerified = property.isVerified || false

      // Count status occurrences
      statusCounts[status] = (statusCounts[status] || 0) + 1

      if (city) {
        allCities.add(city)

        // Categorize by status
        if (status === 'for-sale') {
          saleCities.set(city, (saleCities.get(city) || 0) + 1)
          totalForSale++
        } else if (status === 'for-rent') {
          rentCities.set(city, (rentCities.get(city) || 0) + 1)
          totalForRent++
        } else if (status === 'short-let') {
          shortLetCities.set(city, (shortLetCities.get(city) || 0) + 1)
          totalForShortLet++
        }

        if (price > 0) {
          totalPrice += price
          propertyCount++
        }
      }

      if (state) {
        states.add(state)
      }

      if (isVerified) {
        verifiedCount++
      }
    })

    console.log('Status distribution:', statusCounts)
    console.log(
      'Raw counts - Sale:',
      totalForSale,
      'Rent:',
      totalForRent,
      'Short-let:',
      totalForShortLet
    )

    // Calculate average price
    const avgPrice = propertyCount > 0 ? totalPrice / propertyCount : 85000000

    // Convert to arrays and sort by count
    const popularMarkets = Array.from(saleCities.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, count]) => ({
        name,
        count,
        type: 'sale' as const,
        avgPrice: avgPrice * (Math.random() * 0.3 + 0.85),
        growth: Math.floor(Math.random() * 15) + 5,
      }))

    const popularApartments = Array.from(rentCities.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, count]) => ({
        name,
        count,
        type: 'rent' as const,
        avgPrice: avgPrice * 0.03 * (Math.random() * 0.3 + 0.85),
        growth: Math.floor(Math.random() * 10) + 3,
      }))

    const popularShortLets = Array.from(shortLetCities.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, count]) => ({
        name,
        count,
        type: 'short-let' as const,
        avgPrice: avgPrice * 0.04 * (Math.random() * 0.3 + 0.85),
        growth: Math.floor(Math.random() * 12) + 5,
      }))

    const statesArray = Array.from(states).slice(0, 12)

    const menuData = {
      popularMarkets,
      popularApartments,
      popularShortLets,
      resources: [
        { title: 'Homes for sale near me', href: '/properties?type=buy' },
        {
          title: 'Apartments for rent',
          href: '/properties?type=rent&propertyType=apartment',
        },
        { title: 'Property valuation', href: '/valuation' },
        { title: 'Real estate guides', href: '/guides' },
        { title: 'Mortgage calculator', href: '/calculator' },
        { title: 'Agent directory', href: '/agents' },
      ],
      states: statesArray,
      stats: {
        totalProperties: propertiesResponse.total || properties.length,
        verifiedProperties:
          verifiedCount || Math.floor(properties.length * 0.81),
        happyClients: totalUsers,
        citiesCovered: allCities.size || 28,
        totalForSale,
        totalForRent,
        totalForShortLet,
      },
    }

    console.log('Final menu data stats:', menuData.stats)

    return NextResponse.json(menuData)
  } catch (error) {
    console.error('Error fetching menu data:', error)

    // Return fallback data if API fails
    const fallbackData = {
      popularMarkets: [
        {
          name: 'Lekki, Lagos',
          count: 1240,
          type: 'sale',
          avgPrice: 85000000,
          growth: 12,
        },
        {
          name: 'Victoria Island, Lagos',
          count: 890,
          type: 'sale',
          avgPrice: 120000000,
          growth: 8,
        },
        {
          name: 'Ikoyi, Lagos',
          count: 670,
          type: 'sale',
          avgPrice: 150000000,
          growth: 15,
        },
        {
          name: 'Abuja Central, Abuja',
          count: 1560,
          type: 'sale',
          avgPrice: 95000000,
          growth: 10,
        },
        {
          name: 'Ikeja, Lagos',
          count: 980,
          type: 'sale',
          avgPrice: 65000000,
          growth: 7,
        },
      ],
      popularApartments: [], // Empty array - no rental data
      popularShortLets: [], // Empty array - no short-let data
      resources: [
        { title: 'Homes for sale near me', href: '/properties?type=buy' },
        {
          title: 'Apartments for rent',
          href: '/properties?type=rent&propertyType=apartment',
        },
        { title: 'Property valuation', href: '/valuation' },
        { title: 'Real estate guides', href: '/guides' },
      ],
      states: [
        'Lagos',
        'Abuja',
        'Rivers',
        'Oyo',
        'Kano',
        'Kaduna',
        'Edo',
        'Delta',
      ],
      stats: {
        totalProperties: 12,
        verifiedProperties: 12,
        happyClients: 52300,
        citiesCovered: 5,
        totalForSale: 12,
        totalForRent: 0,
        totalForShortLet: 0,
      },
    }

    return NextResponse.json(fallbackData)
  }
}
