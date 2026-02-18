// hooks/usePropertyFavorite.ts
import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Property } from '@/types'

import { favoritesAPI } from '@/lib/favorites'

export function usePropertyFavorite(property: Property) {
  const { user } = useAuth()
  const [isFavorited, setIsFavorited] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Check favorite status
  const checkFavoriteStatus = useCallback(async () => {
    if (!user?.$id || !property?.$id) {
      console.log(
        '🔄 [usePropertyFavorite] No user or property ID, setting isFavorited to false'
      )
      setIsFavorited(false)
      return
    }

    try {
      console.log('🔄 [usePropertyFavorite] Checking favorite status for:', {
        userId: user.$id,
        propertyId: property.$id,
      })
      const favorited = await favoritesAPI.isPropertyFavorited(
        user.$id,
        property.$id
      )
      console.log('✅ [usePropertyFavorite] Favorite status result:', favorited)
      setIsFavorited(favorited)
    } catch {
      setIsFavorited(false)
    }
  }, [property?.$id, user?.$id])

  // Check favorite status on mount and when dependencies change
  useEffect(() => {
    checkFavoriteStatus()
  }, [user?.$id, checkFavoriteStatus, property?.$id])

  const toggleFavorite = async () => {
    console.log(
      '🔄 [usePropertyFavorite] Toggling favorite, current state:',
      isFavorited
    )

    if (!user?.$id) {
      const errorMsg = 'Please log in to add favorites'
      console.error('❌ [usePropertyFavorite]', errorMsg)
      setError(errorMsg)
      throw new Error(errorMsg)
    }

    if (!property?.$id) {
      const errorMsg = 'Invalid property'
      console.error('❌ [usePropertyFavorite]', errorMsg)
      setError(errorMsg)
      throw new Error(errorMsg)
    }

    setLoading(true)
    setError(null)

    try {
      let result: boolean

      if (isFavorited) {
        // Remove from favorites
        console.log('➖ [usePropertyFavorite] Removing from favorites')
        await favoritesAPI.removeFavoriteByProperty(user.$id, property.$id)
        setIsFavorited(false)
        result = false
        console.log(
          '✅ [usePropertyFavorite] Successfully removed from favorites'
        )
      } else {
        // Add to favorites
        console.log('➕ [usePropertyFavorite] Adding to favorites')
        await favoritesAPI.addToFavorite({
          userId: user.$id,
          propertyId: property.$id,
          category: 'wishlist',
        })
        setIsFavorited(true)
        result = true
        console.log('✅ [usePropertyFavorite] Successfully added to favorites')
      }

      return result
    } catch {
      // Re-check the actual status after error
      await checkFavoriteStatus()
    } finally {
      setLoading(false)
    }
  }

  return {
    isFavorited,
    loading,
    error,
    toggleFavorite,
    refetch: checkFavoriteStatus,
  }
}
