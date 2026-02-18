/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from 'next/server'
import { Query } from 'node-appwrite'

import {
  DATABASE_ID,
  databases,
  PROPERTIES_COLLECTION_ID,
  USERS_COLLECTION_ID,
} from '@/lib/appwrite-server'

type RouteContext = {
  params: Promise<{ userType: string; id: string }>
}

function toKobo(value: any): number {
  const n = Number(value)
  return Number.isFinite(n) ? n : 0
}

export async function GET(_req: NextRequest, { params }: RouteContext) {
  try {
    const { userType, id } = await params

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing user id' }, { status: 400 })
    }

    if (userType !== 'buyer' && userType !== 'user') {
      return NextResponse.json({
        success: true,
        supported: false,
        message: 'Summary aggregation currently optimized for buyer routes',
      })
    }

    const purchasesCollectionId =
      process.env.NEXT_PUBLIC_APPWRITE_PURCHASES_TABLE_ID || 'purchases'

    let purchasesRes
    try {
      purchasesRes = await databases.listDocuments(
        DATABASE_ID,
        purchasesCollectionId,
        [
          Query.equal('buyerId', id),
          Query.orderDesc('$createdAt'),
          Query.limit(100),
          Query.select([
            '$id',
            '$createdAt',
            'buyerId',
            'agentId',
            'propertyId',
            'propertyTitle',
            'amount',
            'amountKobo',
            'currency',
            'status',
            'reference',
          ]),
        ]
      )
    } catch {
      purchasesRes = await databases.listDocuments(
        DATABASE_ID,
        purchasesCollectionId,
        [Query.equal('buyerId', id), Query.orderDesc('$createdAt'), Query.limit(100)]
      )
    }

    const recentPurchases = (purchasesRes.documents || []).map((d: any) => ({
      $id: d.$id,
      $createdAt: d.$createdAt,
      buyerId: d.buyerId,
      agentId: d.agentId,
      propertyId: d.propertyId,
      propertyTitle: d.propertyTitle || d.title,
      amount: Number(d.amount) || 0,
      amountKobo: toKobo(d.amountKobo ?? d.amount),
      currency: d.currency || 'NGN',
      status: d.status,
      reference: d.reference,
    }))

    const totalSpentKobo = recentPurchases.reduce(
      (sum: number, p: any) => sum + toKobo(p.amountKobo),
      0
    )

    let favoriteProperties: string[] = []
    let savedSearches: any[] = []
    let recentlyViewed: string[] = []

    try {
      const userDoc = await databases.getDocument(DATABASE_ID, USERS_COLLECTION_ID, id)
      favoriteProperties = Array.isArray((userDoc as any).favoriteProperties)
        ? (userDoc as any).favoriteProperties.filter(Boolean)
        : []
      savedSearches = Array.isArray((userDoc as any).savedSearches)
        ? (userDoc as any).savedSearches
        : []
      recentlyViewed = Array.isArray((userDoc as any).recentlyViewed)
        ? (userDoc as any).recentlyViewed
        : []
    } catch {
      // keep defaults
    }

    let savedProperties: any[] = []
    const previewIds = favoriteProperties.slice(0, 10)
    if (previewIds.length > 0) {
      try {
        const propsRes = await databases.listDocuments(
          DATABASE_ID,
          PROPERTIES_COLLECTION_ID,
          [
            Query.equal('$id', previewIds),
            Query.limit(10),
            Query.select([
              '$id',
              '$collectionId',
              '$databaseId',
              '$createdAt',
              '$updatedAt',
              '$permissions',
              'agentId',
              'userId',
              'name',
              'propertyId',
              'agentName',
              'title',
              'description',
              'propertyType',
              'status',
              'price',
              'priceUnit',
              'address',
              'city',
              'state',
              'images',
              'isFeatured',
              'isVerified',
              'views',
              'favorites',
            ]),
          ]
        )
        savedProperties = propsRes.documents || []
      } catch {
        // keep empty
      }
    }

    return NextResponse.json({
      success: true,
      supported: true,
      stats: {
        savedProperties: favoriteProperties.length,
        scheduledTours: 0,
        savedSearches: savedSearches.length,
        propertiesViewed: recentlyViewed.length,
        recentPurchasesCount: recentPurchases.length,
        totalSpentKobo,
      },
      recentPurchases,
      savedProperties,
    })
  } catch (error) {
    console.error('dashboard summary error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to build dashboard summary' },
      { status: 500 }
    )
  }
}
