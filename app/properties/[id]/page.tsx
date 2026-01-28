/* eslint-disable @typescript-eslint/no-explicit-any */

import { notFound } from 'next/navigation'
import { Property } from '@/types'

import PropertyDetails from '@/components/PropertyDetails'
import {
  DATABASE_ID,
  databases,
  PROPERTIES_COLLECTION_ID,
} from '@/lib/appwrite'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

async function getProperty(id: string): Promise<Property> {
  try {
    if (!id) {
      throw new Error('Missing document ID')
    }

    console.log('🔍 Fetching property with ID:', id)

    // First, get the property
    const property = await databases.getDocument(
      DATABASE_ID,
      PROPERTIES_COLLECTION_ID,
      id
    )

    if (!property) {
      console.error('❌ Property not found in database')
      throw new Error('Property not found')
    }

    console.log('✅ Property found:', property.title)

    // Then, update view count (don't await this to speed up response)
    databases
      .updateDocument(DATABASE_ID, PROPERTIES_COLLECTION_ID, id, {
        views: (property.views || 0) + 1,
      })
      .catch((err) => {
        console.error('❌ Error updating view count:', err)
        // Don't throw, this is non-critical
      })

    // Cast to Property type
    return property as unknown as Property
  } catch (error: any) {
    console.error('❌ Error in getProperty:', {
      message: error.message,
      code: error.code,
      id: id,
    })
    throw new Error('Property not found')
  }
}

// Cache the property fetch to avoid duplicate calls
const propertyCache = new Map<string, Promise<Property>>()

function getCachedProperty(id: string): Promise<Property> {
  if (!propertyCache.has(id)) {
    propertyCache.set(id, getProperty(id))
  }
  return propertyCache.get(id)!
}

export default async function PropertyPage(props: PageProps) {
  const params = await props.params
  let property: Property

  try {
    property = await getCachedProperty(params.id)
  } catch {
    notFound()
  }

  return <PropertyDetails property={property} />
}

// Generate metadata for SEO
export async function generateMetadata(props: PageProps) {
  const params = await props.params

  try {
    const property = await getCachedProperty(params.id)

    return {
      title: `${property.title} | ${property.city}, ${property.state} - PropertyVision`,
      description:
        property.description?.substring(0, 160) + '...' ||
        'Property listing on PropertyVision',
      openGraph: {
        title: property.title,
        description:
          property.description?.substring(0, 160) + '...' ||
          'Property listing on PropertyVision',
        images: property.images?.length > 0 ? [property.images[0]] : [],
      },
    }
  } catch {
    return {
      title: 'Property Not Found - PropertyVision',
      description: 'The property you are looking for does not exist.',
    }
  }
}
