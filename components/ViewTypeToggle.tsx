// app/components/properties/view-type-toggle.tsx
'use client'

import { CalendarDays, Home, Key, TrendingUp } from 'lucide-react'

interface ViewTypeButtonProps {
  type: 'all' | 'buy' | 'rent' | 'short-let'
  isActive: boolean
  isNavigating: boolean
  onClick: (type: 'all' | 'buy' | 'rent' | 'short-let') => void
  variant?: 'desktop' | 'mobile'
}

function ViewTypeButton({
  type,
  isActive,
  isNavigating,
  onClick,
  variant = 'desktop',
}: ViewTypeButtonProps) {
  const getButtonContent = () => {
    const iconSize = variant === 'mobile' ? 'h-4 w-4' : 'h-5 w-5'

    switch (type) {
      case 'all':
        return {
          icon: <Home className={iconSize} />,
          label: 'All Properties',
          description: 'Browse all verified listings',
          color: 'text-brand',
          bg: 'bg-brand/5',
          border: 'border-brand/10',
        }
      case 'buy':
        return {
          icon: <TrendingUp className={iconSize} />,
          label: 'Buy',
          description: 'Properties for purchase',
          color: 'text-brand',
          bg: 'bg-brand/5',
          border: 'border-brand/10',
        }
      case 'rent':
        return {
          icon: <Key className={iconSize} />,
          label: 'Rent',
          description: 'Long-term rentals',
          color: 'text-brand',
          bg: 'bg-brand/5',
          border: 'border-brand/10',
        }
      case 'short-let':
        return {
          icon: <CalendarDays className={iconSize} />,
          label: 'Short Let',
          description: 'Short-term rentals',
          color: 'text-brand',
          bg: 'bg-brand/5',
          border: 'border-brand/10',
        }
    }
  }

  const content = getButtonContent()

  if (variant === 'mobile') {
    return (
      <button
        onClick={() => onClick(type)}
        disabled={isNavigating}
        className={`flex-1 flex flex-col items-center justify-center p-3 rounded-lg transition-all ${
          isActive
            ? `${content.bg} ${content.border} border shadow-sm`
            : 'hover:bg-gray-50'
        } ${isNavigating ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        <div
          className={`mb-1 p-2 rounded-lg ${isActive ? content.bg : 'bg-gray-100'}`}
        >
          <div className={isActive ? content.color : 'text-gray-500'}>
            {content.icon}
          </div>
        </div>
        <span
          className={`text-sm font-medium ${isActive ? content.color : 'text-gray-700'}`}
        >
          {content.label}
        </span>
      </button>
    )
  }

  return (
    <button
      onClick={() => onClick(type)}
      disabled={isNavigating}
      className={`flex items-start gap-3 p-4 rounded-xl border transition-all text-left min-w-40 ${
        isActive
          ? `${content.bg} ${content.border} border-brand/40 border shadow-sm`
          : 'border-brand/20 hover:border-gray-300 hover:shadow-sm'
      } ${isNavigating ? 'opacity-70 cursor-not-allowed' : ''}`}
    >
      <div
        className={`p-2 rounded-lg ${isActive ? 'bg-white shadow-sm' : 'bg-gray-100'}`}
      >
        <div className={isActive ? content.color : 'text-gray-500'}>
          {content.icon}
        </div>
      </div>
      <div>
        <span
          className={`block font-semibold ${isActive ? content.color : 'text-gray-900'}`}
        >
          {content.label}
        </span>
        <span className="block text-sm text-gray-600 mt-1">
          {content.description}
        </span>
      </div>
    </button>
  )
}

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
  const types: Array<'all' | 'buy' | 'rent' | 'short-let'> = [
    'all',
    'buy',
    'rent',
    'short-let',
  ]

  if (variant === 'mobile') {
    return (
      <div className="flex bg-gray-50 rounded-xl p-2 gap-2">
        {types.map((type) => (
          <ViewTypeButton
            key={type}
            type={type}
            isActive={viewType === type}
            isNavigating={isNavigating}
            onClick={onViewTypeChange}
            variant="mobile"
          />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {types.map((type) => (
        <ViewTypeButton
          key={type}
          type={type}
          isActive={viewType === type}
          isNavigating={isNavigating}
          onClick={onViewTypeChange}
          variant="desktop"
        />
      ))}
    </div>
  )
}
