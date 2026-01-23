'use client'

import { useState } from 'react'
import { Grid3X3, Home, Key, Moon, Sparkles, Target, Zap } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface ViewTypeButtonProps {
  type: 'all' | 'buy' | 'rent' | 'short-let'
  isActive: boolean
  isNavigating: boolean
  onClick: (type: 'all' | 'buy' | 'rent' | 'short-let') => void
  variant?: 'desktop' | 'mobile'
  count?: string // Optional property count
}

export function ViewTypeButton({
  type,
  isActive,
  isNavigating,
  onClick,
  variant = 'desktop',
  count,
}: ViewTypeButtonProps) {
  const [isPressed, setIsPressed] = useState(false)

  // Get configuration based on type
  const getConfig = () => {
    const configs = {
      all: {
        title: 'All',
        mobileTitle: 'All',
        icon: Grid3X3,
        activeColor: 'bg-gray-900 text-white border-gray-900',
        inactiveColor:
          'bg-white text-gray-700 border-gray-200 hover:bg-gray-50',
        iconColor: 'text-gray-600',
        badgeColor: 'bg-gray-100 text-gray-800',
        count: '10K+',
        description: 'All properties',
      },
      buy: {
        title: 'For Sale',
        mobileTitle: 'Sale',
        icon: Home,
        activeColor: 'bg-brand text-white border-brand shadow-brand/5',
        inactiveColor: 'bg-white text-brand border-brand/10 hover:bg-brand/5',
        iconColor: 'text-brand',
        badgeColor: 'bg-brand text-brand',
        count: '5K+',
        description: 'Properties for sale',
      },
      rent: {
        title: 'For Rent',
        mobileTitle: 'Rent',
        icon: Key,
        activeColor: 'bg-brand text-white border-brand shadow-brand/5',
        inactiveColor: 'bg-white text-brand border-brand/10 hover:bg-brand/5',
        iconColor: 'text-brand',
        badgeColor: 'bg-brand text-brand',
        count: '4K+',
        description: 'Rental properties',
      },
      'short-let': {
        title: 'Short-Let',
        mobileTitle: 'Short-Let',
        icon: Moon,
        activeColor: 'bg-brand text-white border-brand shadow-brand/20',
        inactiveColor: 'bg-white text-brand border-brand hover:bg-brand/5',
        iconColor: 'text-brand',
        badgeColor: 'bg-brand/100 text-brand',
        count: '700+',
        description: 'Short-term stays',
      },
    }

    return configs[type]
  }

  const config = getConfig()
  const Icon = config.icon

  const handleClick = () => {
    if (!isNavigating) {
      setIsPressed(true)
      setTimeout(() => setIsPressed(false), 150)
      onClick(type)
    }
  }

  if (variant === 'mobile') {
    return (
      <button
        onClick={handleClick}
        disabled={isNavigating}
        className={`
          flex-1
          py-3
          px-2
          rounded-xl
          font-medium
          text-sm
          transition-all
          duration-200
          active:scale-[0.98]
          border-2
          relative
          overflow-hidden
          ${isActive ? config.activeColor : config.inactiveColor}
          ${isActive ? 'shadow-sm' : 'shadow-sm hover:shadow-md'}
          ${isPressed ? 'scale-[0.97]' : ''}
          ${isNavigating ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.02]'}
          group
        `}
      >
        {/* Active indicator dot */}
        {isActive && (
          <div className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full animate-pulse" />
        )}

        {/* Content */}
        <div className="flex flex-col items-center justify-center gap-1">
          <div
            className={`p-2 rounded-lg ${
              isActive ? 'bg-white/20' : 'bg-gray-100 group-hover:bg-gray-200'
            } transition-colors`}
          >
            <Icon
              className={`h-4 w-4 ${
                isActive ? 'text-white' : config.iconColor
              }`}
            />
          </div>
          <span
            className={`font-medium ${isActive ? 'text-white' : 'text-gray-700'}`}
          >
            {config.mobileTitle}
          </span>
          {count && (
            <Badge
              className={`text-xs px-2 py-0.5 ${
                isActive ? 'bg-white/20 text-white' : config.badgeColor
              }`}
            >
              {count}
            </Badge>
          )}
        </div>

        {/* Loading overlay */}
        {isNavigating && isActive && (
          <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        )}
      </button>
    )
  }

  // Desktop variant
  return (
    <Button
      variant="ghost"
      onClick={handleClick}
      disabled={isNavigating}
      className={`
        h-auto
        px-5
        py-3
        rounded-xl
        font-medium
        transition-all
        duration-200
        relative
        overflow-hidden
        group
        ${isActive ? config.activeColor : config.inactiveColor}
        ${isActive ? 'shadow-lg' : 'shadow-sm hover:shadow-md hover:border-gray-300'}
        ${isActive ? 'ring-2 ring-offset-2' : ''}
        ${
          isActive
            ? type === 'buy'
              ? 'ring-emerald-200'
              : type === 'rent'
                ? 'ring-brand/20'
                : type === 'short-let'
                  ? 'ring-purple-200'
                  : 'ring-gray-200'
            : ''
        }
        ${isPressed ? 'scale-[0.98]' : ''}
        ${isNavigating ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.02]'}
      `}
    >
      {/* Gradient overlay on hover */}
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
          type === 'buy'
            ? 'bg-linear-to-br from-brand/10 to-brand/10'
            : type === 'rent'
              ? 'bg-linear-to-br from-brand/10 to-brand/10'
              : type === 'short-let'
                ? 'bg-linear-to-br from-brand/10 to-brand/10'
                : 'bg-linear-to-br from-brand/10 to-brand/10'
        }`}
      />

      {/* Active indicator */}
      {isActive && (
        <>
          <div className="absolute top-3 right-3 w-2 h-2 bg-white rounded-full animate-ping" />
          <div className="absolute top-3 right-3 w-2 h-2 bg-white rounded-full" />
        </>
      )}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-2">
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-1">
            <div
              className={`p-2 rounded-sm ${
                isActive ? 'bg-brand/20' : 'bg-brand/5 group-hover:bg-gray-200'
              } transition-colors`}
            >
              <Icon
                className={`h-5 w-5 ${isActive ? 'text-white' : config.iconColor}`}
              />
            </div>

            <span
              className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-gray-800'}`}
            >
              {config.title}
            </span>
          </div>
          <span
            className={`text-xs ${isActive ? 'text-white/90' : 'text-gray-500'}`}
          >
            {config.description}
          </span>
        </div>

        {count && (
          <Badge
            variant="outline"
            className={`text-xs px-2 py-0.5 border ${
              isActive
                ? 'bg-white/20 text-white border-white/30'
                : config.badgeColor
            }`}
          >
            {count}
          </Badge>
        )}
      </div>

      {/* Loading indicator */}
      {isNavigating && isActive && (
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center rounded-xl">
          <div className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}
    </Button>
  )
}

// Main toggle component
interface ViewTypeToggleProps {
  viewType: 'all' | 'buy' | 'rent' | 'short-let'
  isNavigating: boolean
  onViewTypeChange: (type: 'all' | 'buy' | 'rent' | 'short-let') => void
  variant?: 'desktop' | 'mobile'
}

export function ViewTypeToggle({
  viewType,
  isNavigating,
  onViewTypeChange,
  variant = 'desktop',
}: ViewTypeToggleProps) {
  const viewTypes: Array<'all' | 'buy' | 'rent' | 'short-let'> = [
    'all',
    'buy',
    'rent',
    'short-let',
  ]

  // Sample counts for demonstration - in real app these would come from props
  const counts = {
    all: '10K+',
    buy: '5K+',
    rent: '4K+',
    'short-let': '700+',
  }

  if (variant === 'mobile') {
    return (
      <div className="relative">
        <div className="flex items-center gap-1 mb-3">
          <Target className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">
            View by type:
          </span>
          {isNavigating && (
            <div className="ml-2 w-3 h-3 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          )}
        </div>

        <div className="grid grid-cols-4 gap-2 p-1 bg-gray-100 rounded-2xl">
          {viewTypes.map((type) => (
            <ViewTypeButton
              key={type}
              type={type}
              isActive={viewType === type}
              isNavigating={isNavigating}
              onClick={onViewTypeChange}
              variant="mobile"
              count={counts[type]}
            />
          ))}
        </div>
      </div>
    )
  }

  // Desktop variant
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-amber-500" />
          <span className="text-sm font-medium text-gray-700">
            Browse Properties
          </span>
        </div>
        {isNavigating && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Zap className="h-3 w-3 animate-pulse" />
            <span>Switching view...</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-4 gap-3">
        {viewTypes.map((type) => (
          <ViewTypeButton
            key={type}
            type={type}
            isActive={viewType === type}
            isNavigating={isNavigating}
            onClick={onViewTypeChange}
            variant="desktop"
            count={counts[type]}
          />
        ))}
      </div>
    </div>
  )
}
