// components/agents/PropertyPostForm.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import {
  PROPERTY_AMENITIES,
  PROPERTY_FEATURES,
  PROPERTY_TYPES,
  PropertyFormData,
} from '@/types'
import {
  Bath,
  Bed,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Globe,
  Home,
  InfoIcon,
  Key,
  Loader2,
  Map,
  MapPin,
  Moon,
  Navigation,
  Sparkles,
  Square,
  Upload,
} from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Location } from '@/lib/locations/locationService'
import { clientPropertyService } from '@/lib/properties/clientPropertyService'

import ImageUpload from '../ui/ImageUpload'
import { SafeRichTextEditor } from '../ui/SafeRichTextEditor'
import LocationSearch from './LocationSearch'

interface PropertyPostFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

// Progress step component
const ProgressStep = ({
  number,
  title,
  isActive,
  isCompleted,
}: {
  number: number
  title: string
  isActive: boolean
  isCompleted: boolean
}) => (
  <div className="flex items-center gap-3">
    <div
      className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
        isCompleted
          ? 'bg-brand/10 text-brand border-2 border-brand/30 shadow-sm'
          : isActive
            ? 'bg-brand text-white shadow-md'
            : 'bg-gray-100 text-gray-400 border border-gray-200'
      }`}
    >
      {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : number}
    </div>
    <div
      className={`hidden sm:block transition-all duration-300 ${
        isActive ? 'opacity-100' : 'opacity-60'
      }`}
    >
      <span
        className={`text-xs font-medium ${
          isActive ? 'text-brand' : 'text-gray-500'
        }`}
      >
        Step {number}
      </span>
      <p
        className={`text-sm font-medium ${
          isActive ? 'text-gray-900' : 'text-gray-600'
        }`}
      >
        {title}
      </p>
    </div>
  </div>
)

export default function PropertyPostForm({
  onSuccess,
  onCancel,
}: PropertyPostFormProps) {
  // Get params inside component
  const params = useParams()
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  )
  const userType = params.userType as string
  const [currentStep, setCurrentStep] = useState(1) // Changed to numeric steps
  const totalSteps = 5

  // Image states
  const [newImages, setNewImages] = useState<
    Array<{ file: File; previewUrl: string }>
  >([])
  const [uploadingImages, setUploadingImages] = useState<string[]>([])

  const [pageLoading, setPageLoading] = useState(true)
  const [agentProfileId, setAgentProfileId] = useState<string>('')
  const [fetchingAgentProfile, setFetchingAgentProfile] = useState(false)
  const [tagsInput, setTagsInput] = useState<string>('')
  const mainContentRef = useRef<HTMLDivElement>(null)
  const [formData, setFormData] = useState<PropertyFormData>({
    // Basic Information
    title: '',
    description: '',
    propertyType: 'house',
    status: 'for-sale',
    price: 0,
    priceUnit: 'total',

    // Location
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Nigeria',
    neighborhood: '',

    // Property Details
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 0,
    lotSize: undefined,
    yearBuilt: new Date().getFullYear(),

    // Features & Amenities
    features: [],
    amenities: [],

    // titles
    titles: [],

    // Media
    images: [],
    videos: [],

    // Listing Details
    listedBy: 'agent',
    isFeatured: false,
    tags: [],

    // Payment Options
    paymentOutright: true,
    paymentPlan: false,
    mortgageEligible: false,
    customPlanAvailable: false,
    customPlanDepositPercent: 30,
    customPlanMonths: 12,

    // Short-Let Specific Fields
    minimumStay: 1,
    maximumStay: 30,
    instantBooking: false,
    checkInTime: '14:00',
    checkOutTime: '11:00',
    cancellationPolicy: 'moderate',
    houseRules: [],
    availabilityStart: '',
    availabilityEnd: '',
  })

  // House rules for short-let
  const houseRulesList = [
    'No smoking',
    'No parties or events',
    'No pets',
    'No loud noise after 10 PM',
    'No extra guests without approval',
    'Shoes off inside',
    'Keep the property clean',
    'Report any damages immediately',
    'Check-in after 2 PM',
    'Check-out before 11 AM',
  ]

  // Additional short-let features
  const shortLetFeaturesList = [
    'Free WiFi',
    'Coffee Maker',
    'Smart TV',
    'Netflix',
    'Kitchenette',
    'Washing Machine',
    'Dryer',
    'Iron',
    'Hair Dryer',
    'Hot Water',
    'BBQ Grill',
    'Fireplace',
    'Jacuzzi',
    'Beach Access',
    'Mountain View',
    'City View',
    'Private Entrance',
    'Self Check-in',
    '24/7 Support',
    'Breakfast Included',
  ]

  // Check if property type is land
  const isLandProperty = formData.propertyType === 'land'

  // Fetch agent profile when user is loaded
  useEffect(() => {
    const fetchAgentProfile = async () => {
      if (user && user.userType === 'agent') {
        setFetchingAgentProfile(true)
        try {
          const response = await fetch(
            `/api/agents/get-by-user?userId=${user.$id}`
          )

          if (response.ok) {
            const agentProfile = await response.json()
            setAgentProfileId(agentProfile.$id)
          } else {
            const emailResponse = await fetch(
              `/api/agents/get-by-user?email=${encodeURIComponent(user.email)}`
            )
            if (emailResponse.ok) {
              const agentProfile = await emailResponse.json()
              setAgentProfileId(agentProfile.$id)

              try {
                await fetch('/api/agents/update-user-id', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    agentId: agentProfile.$id,
                    userId: user.$id,
                  }),
                })
              } catch {}
            } else {
              toast.error('Agent profile not found. Please contact support.')
            }
          }
        } catch (error) {
          console.error('❌ Error fetching agent profile:', error)
          toast.error('Failed to load agent profile. Please refresh the page.')
        } finally {
          setFetchingAgentProfile(false)
          setPageLoading(false)
        }
      }
    }

    if (!authLoading) {
      if (!user) {
        router.push('/login?redirect=/agent/properties/new')
      } else if (user.userType !== 'agent' && user.userType !== 'seller') {
        router.push('/dashboard')
      } else {
        if (user.userType === 'seller') {
          setFormData((prev) => ({
            ...prev,
            listedBy: 'owner',
          }))
          setPageLoading(false)
        }

        if (user.userType === 'agent') {
          fetchAgentProfile()
        }
      }
    }
  }, [user, authLoading, router])

  // Clean up function to revoke object URLs
  useEffect(() => {
    return () => {
      newImages.forEach((img) => URL.revokeObjectURL(img.previewUrl))
    }
  }, [newImages])

  // Update price unit based on status
  useEffect(() => {
    if (formData.status === 'short-let') {
      setFormData((prev) => ({
        ...prev,
        priceUnit: 'daily',
      }))
    } else if (formData.status === 'for-rent') {
      setFormData((prev) => ({
        ...prev,
        priceUnit: 'monthly',
      }))
    } else if (formData.status === 'for-sale') {
      setFormData((prev) => ({
        ...prev,
        priceUnit: 'total',
      }))
    }
  }, [formData.status])

  const handleLocationSelect = useCallback((location: Location) => {
    setSelectedLocation(location)
    setFormData((prev) => ({
      ...prev,
      city: location.name,
      state: location.state,
      neighborhood: location.lga || location.name,
      latitude: location.latitude ? Number(location.latitude) : undefined,
      longitude: location.longitude ? Number(location.longitude) : undefined,
    }))
  }, [])

  const handleInputChange = (field: keyof PropertyFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleTagsInputChange = (value: string) => {
    setTagsInput(value)
    const tagsArray = value
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)
    setFormData((prev) => ({ ...prev, tags: tagsArray }))
  }

  // Initialize tagsInput when formData loads
  useEffect(() => {
    if (formData.tags.length > 0) {
      setTagsInput(formData.tags.join(', '))
    }
  }, [])

  const handleArrayToggle = (
    field: 'features' | 'titles' | 'amenities' | 'tags' | 'houseRules',
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field]?.includes(value)
        ? prev[field]?.filter((item) => item !== value)
        : [...(prev[field] || []), value],
    }))
  }

  const handleImageChange = (files: File[]) => {
    const newImageFiles = files.map((file) => {
      const placeholderUrl =
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNmMGYwZjAiLz48dGV4dCB4PSI1MCIgeT0iNTUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzY2NiI+TG9hZGluZy4uLjwvdGV4dD48L3N2Zz4='

      return {
        file,
        previewUrl: placeholderUrl,
      }
    })

    setNewImages((prev) => {
      const combined = [...prev, ...newImageFiles]
      const uniqueFiles = combined.reduce(
        (acc, current) => {
          const exists = acc.find(
            (item) =>
              item.file.name === current.file.name &&
              item.file.size === current.file.size
          )
          if (!exists) {
            acc.push(current)
          }
          return acc
        },
        [] as Array<{ file: File; previewUrl: string }>
      )

      return uniqueFiles.slice(0, 10)
    })

    files.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setNewImages((prev) => {
          const newImages = [...prev]
          const fileIndex = newImages.findIndex(
            (img) => img.file.name === file.name && img.file.size === file.size
          )
          if (fileIndex !== -1) {
            newImages[fileIndex] = {
              ...newImages[fileIndex],
              previewUrl: reader.result as string,
            }
          }
          return newImages
        })
      }
      reader.readAsDataURL(file)
    })
  }

  const uploadImagesToStorage = async (files: File[]): Promise<string[]> => {
    const uploadedImageUrls: string[] = []

    setUploadingImages(newImages.map((img) => img.previewUrl))

    for (const file of files) {
      try {
        const formData = new FormData()
        formData.append('image', file)

        const response = await fetch('/api/properties/upload-image', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(
            errorData.error || `Failed to upload image: ${response.statusText}`
          )
        }

        const result = await response.json()
        uploadedImageUrls.push(result.fileUrl || result.fileId)
        setUploadingImages((prev) => prev.slice(1))
      } catch (error) {
        console.error('Error uploading image:', error)
        throw error
      }
    }

    setUploadingImages([])
    return uploadedImageUrls
  }

  const getPriceLabel = () => {
    switch (formData.status) {
      case 'for-sale':
        return 'Total Price'
      case 'for-rent':
        return 'Monthly Rent'
      case 'short-let':
        return 'Daily Rate'
      default:
        return 'Price'
    }
  }

  const getPriceUnitOptions = () => {
    switch (formData.status) {
      case 'for-sale':
        return ['total']
      case 'for-rent':
        return ['monthly', 'yearly']
      case 'short-let':
        return ['daily', 'weekly', 'monthly']
      default:
        return ['monthly']
    }
  }

  // Step validation functions - Updated for land properties
  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1: // Basic Info
        return !!(formData.title && formData.description && formData.status)
      case 2: // Details
        if (!selectedLocation || !formData.address || !formData.squareFeet) {
          return false
        }

        // For land properties, only require squareFeet
        if (isLandProperty) {
          return true
        }

        // For non-land properties, require bedrooms and bathrooms
        return !!(formData.bedrooms && formData.bathrooms)
      case 3: // Media
        return newImages.length > 0
      case 4: // Pricing
        return !!(formData.price > 0)
      case 5: // Finalize
        return true // No validation needed for final step
      default:
        return false
    }
  }

  // Navigation functions
  const goToNextStep = () => {
    if (currentStep < totalSteps) {
      if (validateStep(currentStep)) {
        setCurrentStep(currentStep + 1)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        toast.error(
          `Please complete all required fields in step ${currentStep} before continuing.`
        )
      }
    }
  }

  const goToPrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const goToStep = (step: number) => {
    // Allow going back to completed steps
    if (step < currentStep || validateStep(currentStep)) {
      setCurrentStep(step)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      toast.error('Please complete the current step before jumping ahead.')
    }
  }

  // HandleSubmit function
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (user?.userType === 'agent' && !agentProfileId) {
      toast.error(
        'Agent profile not loaded. Please refresh the page and try again.'
      )
      return
    }

    if (
      !validateStep(1) ||
      !validateStep(2) ||
      !validateStep(3) ||
      !validateStep(4)
    ) {
      toast.error('Please complete all required steps before submitting.')
      return
    }

    if (newImages.length === 0) {
      toast.error('Please upload at least one property image')
      return
    }

    if (!selectedLocation) {
      toast.error('Please select a valid location')
      return
    }

    setIsSubmitting(true)

    try {
      const imageUrls = await uploadImagesToStorage(
        newImages.map((img) => img.file)
      )

      const propertyData = {
        ...formData,
        // Clear bedrooms and bathrooms for land properties
        ...(isLandProperty && {
          bedrooms: 0,
          bathrooms: 0,
          yearBuilt: undefined,
        }),
        userId: user?.$id,
        userType: user?.userType,
        ...(user?.userType === 'agent' && {
          agentId: agentProfileId,
          agentName: user?.name,
        }),
        ...(user?.userType === 'seller' && {
          sellerId: user?.$id,
          sellerName: user?.name,
        }),
        listedBy: formData.listedBy,
        phone: user?.phone || '',
        images: imageUrls,
        propertyId: `property_${Date.now()}`,
      }

      const result = await clientPropertyService.createProperty(propertyData)
      toast.success('Property created successfully!')
      onSuccess?.()
      router.push(`/dashboard/${userType}/${user?.$id || ''}?success=true`)
    } catch (error: any) {
      console.error('❌ Error creating property:', error)
      toast.error(error.message || 'Failed to create property listing')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (
    authLoading ||
    pageLoading ||
    (user?.userType === 'agent' && fetchingAgentProfile)
  ) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-12">
        <Loader2 className="w-12 h-12 text-brand animate-spin" />
        <h2 className="text-xl font-semibold text-gray-900">
          {user?.userType === 'agent' && fetchingAgentProfile
            ? 'Loading agent profile...'
            : 'Loading...'}
        </h2>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-white">
      {/* Sticky Progress Header */}

      {/* Fixed Header */}
      <header className="fixed top-16 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="border-t">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            {/* Progress steps */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-lg md:text-xl font-bold">
                  {formData.status === 'short-let'
                    ? 'List a Short-Let'
                    : 'List a Property'}
                </h1>
                <p className="text-gray-400">
                  Complete {totalSteps} simple steps to publish your listing
                </p>
              </div>

              {/* Progress steps */}
              <div className="flex items-center gap-4">
                {[1, 2, 3, 4, 5].map((step) => (
                  <button
                    key={step}
                    onClick={() => goToStep(step)}
                    className="flex items-center gap-3 group"
                    disabled={step > currentStep && !validateStep(currentStep)}
                  >
                    <ProgressStep
                      number={step}
                      title={
                        step === 1
                          ? 'Basics'
                          : step === 2
                            ? 'Details'
                            : step === 3
                              ? 'Media'
                              : step === 4
                                ? 'Pricing'
                                : 'Finalize'
                      }
                      isActive={currentStep === step}
                      isCompleted={currentStep > step}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="space-y-8 mt-20">
        {/* User Type Indicator */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {user?.userType === 'seller' && (
            <div className="bg-brand/5 border border-brand/20 rounded-xl p-2 flex items-center gap-3">
              <InfoIcon className="w-8 h-8 text-brand" />
              <div>
                <p className="text-brand font-medium">
                  Selling as Property Owner
                </p>
                <p className="text-stone-600 text-sm">
                  You&apos;ll be listed as the property owner and direct contact
                </p>
              </div>
            </div>
          )}

          {user?.userType === 'agent' && !agentProfileId && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-3">
                <InfoIcon className="w-5 h-5 text-yellow-600" />
                <p className="text-yellow-800">
                  Agent profile not found. Properties cannot be created without
                  an agent profile.
                </p>
              </div>
            </div>
          )}

          {/* Current Step Display */}
          <div className="flex items-center justify-between mb-6 mt-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {currentStep === 1 && 'Step 1: Property Basics'}
                {currentStep === 2 && 'Step 2: Location & Details'}
                {currentStep === 3 && 'Step 3: Upload Images'}
                {currentStep === 4 && 'Step 4: Pricing'}
                {currentStep === 5 && 'Step 5: Finalize & Publish'}
              </h2>
              <p className="text-gray-600">
                {currentStep === 1 && 'Tell us about your property'}
                {currentStep === 2 && 'Where is your property located?'}
                {currentStep === 3 && 'Add photos to showcase your property'}
                {currentStep === 4 && 'Set your price and payment options'}
                {currentStep === 5 && 'Review and publish your listing'}
              </p>
            </div>
            <div className="text-sm text-gray-500">
              Step {currentStep} of {totalSteps}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-fadeIn">
                <Card>
                  <CardHeader className="border-b">
                    <CardTitle className="flex items-center gap-2">
                      <Home className="w-5 h-5" />
                      Property Basics
                    </CardTitle>
                    <CardDescription>
                      Start with the essential information about your property
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
                      <div className="space-y-3 col-span-5">
                        <Label htmlFor="title" className="font-medium">
                          Listing Title *
                        </Label>
                        <Input
                          id="title"
                          required
                          value={formData.title}
                          onChange={(e) =>
                            handleInputChange('title', e.target.value)
                          }
                          placeholder={
                            formData.status === 'short-let'
                              ? 'Cozy 2-Bedroom Vacation Home with WiFi & Pool'
                              : formData.status === 'for-rent'
                                ? 'Modern 3-Bedroom Apartment in Lekki'
                                : isLandProperty
                                  ? 'Prime Land for Sale in Lekki Phase 1'
                                  : 'Luxurious 5-Bedroom House for Sale'
                          }
                          className="h-11"
                        />
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="status" className="font-medium">
                          Listing Type *
                        </Label>
                        <Select
                          required
                          value={formData.status}
                          onValueChange={(value) =>
                            handleInputChange('status', value)
                          }
                        >
                          <SelectTrigger id="status" className="h-11">
                            <SelectValue placeholder="Select listing type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="for-sale">
                              <div className="flex items-center gap-2">
                                <Home className="w-4 h-4" />
                                <span>For Sale</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="for-rent">
                              <div className="flex items-center gap-2">
                                <Key className="w-4 h-4" />
                                <span>For Rent</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="short-let">
                              <div className="flex items-center gap-2">
                                <Moon className="w-4 h-4" />
                                <span>Short-Let</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {formData.status !== 'short-let' && (
                        <div className="space-y-2">
                          <Label htmlFor="propertyType">Property Type *</Label>
                          <Select
                            required
                            value={formData.propertyType}
                            onValueChange={(value) =>
                              handleInputChange('propertyType', value)
                            }
                          >
                            <SelectTrigger id="propertyType">
                              <SelectValue placeholder="Select property type" />
                            </SelectTrigger>
                            <SelectContent>
                              {PROPERTY_TYPES.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type.charAt(0).toUpperCase() + type.slice(1)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <Label className="font-medium">Description *</Label>
                      <div className="rounded-lg border border-gray-200 bg-white">
                        <SafeRichTextEditor
                          value={formData.description}
                          onChange={(value) =>
                            handleInputChange('description', value)
                          }
                          placeholder={
                            formData.status === 'short-let'
                              ? 'Describe your short-let property, nearby attractions, unique features...'
                              : isLandProperty
                                ? 'Describe the land, zoning, development potential, nearby infrastructure...'
                                : 'Describe the property features, neighborhood, and unique selling points...'
                          }
                        />
                      </div>
                      <p className="text-sm text-gray-500">
                        {isLandProperty
                          ? 'Include zoning information, development potential, and nearby infrastructure'
                          : 'Include key features in the first paragraph for better visibility'}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Validation reminder */}
                {!validateStep(1) && (
                  <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 flex items-center gap-3">
                    <InfoIcon className="w-5 h-5 text-amber-600" />
                    <p className="text-amber-700 text-sm">
                      Please complete all required fields (*) before continuing
                      to the next step.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Location & Details */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-fadeIn">
                <Card className="border-blue-100 shadow-sm">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b">
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Location & Property Details
                    </CardTitle>
                    <CardDescription>
                      {isLandProperty
                        ? 'Specify land location and size'
                        : `Help potential ${
                            formData.status === 'short-let'
                              ? 'guests'
                              : 'buyers'
                          } find and understand your property`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-6">
                    <div className="space-y-4">
                      <div className="space-y-3">
                        <Label className="font-medium">Search Location *</Label>
                        <LocationSearch
                          onLocationSelect={handleLocationSelect}
                          placeholder="Type area, city, or state..."
                          showMapFeatures={true}
                          selectedLocation={selectedLocation}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <Label htmlFor="address" className="font-medium">
                            Full Address *
                          </Label>
                          <Input
                            id="address"
                            required
                            value={formData.address}
                            onChange={(e) =>
                              handleInputChange('address', e.target.value)
                            }
                            placeholder={
                              isLandProperty
                                ? "Land's street address or nearby landmark"
                                : 'Street address, building number, etc.'
                            }
                            className="h-11"
                          />
                        </div>

                        <div className="space-y-3">
                          <Label htmlFor="zipCode" className="font-medium">
                            ZIP Code
                          </Label>
                          <Input
                            id="zipCode"
                            value={formData.zipCode}
                            onChange={(e) =>
                              handleInputChange('zipCode', e.target.value)
                            }
                            placeholder="e.g., 100001"
                            className="h-11"
                          />
                        </div>
                      </div>

                      {selectedLocation && (
                        <div className="bg-linear-to-r from-green-50 to-brand/5 border border-green-200 rounded-xl p-4">
                          <div className="flex items-center gap-3 mb-4">
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                            <h4 className="font-semibold text-green-900">
                              Location Confirmed
                            </h4>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div className="text-center p-3 bg-white rounded-lg border border-green-100">
                              <Building2 className="w-4 h-4 text-green-600 mx-auto mb-2" />
                              <p className="text-gray-600">City</p>
                              <p className="font-semibold text-gray-900">
                                {formData.city}
                              </p>
                            </div>
                            <div className="text-center p-3 bg-white rounded-lg border border-green-100">
                              <Map className="w-4 h-4 text-blue-600 mx-auto mb-2" />
                              <p className="text-gray-600">State</p>
                              <p className="font-semibold text-gray-900">
                                {formData.state}
                              </p>
                            </div>
                            <div className="text-center p-3 bg-white rounded-lg border border-green-100">
                              <Globe className="w-4 h-4 text-purple-600 mx-auto mb-2" />
                              <p className="text-gray-600">Country</p>
                              <p className="font-semibold text-gray-900">
                                {formData.country}
                              </p>
                            </div>
                            {formData.neighborhood && (
                              <div className="text-center p-3 bg-white rounded-lg border border-green-100">
                                <Navigation className="w-4 h-4 text-orange-600 mx-auto mb-2" />
                                <p className="text-gray-600">Area</p>
                                <p className="font-semibold text-gray-900">
                                  {formData.neighborhood}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Property Specifications - Only show for non-land properties */}
                    {!isLandProperty ? (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Property Specifications
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="space-y-3">
                            <Label
                              htmlFor="bedrooms"
                              className="flex items-center gap-2 font-medium"
                            >
                              <Bed className="w-4 h-4" />
                              Bedrooms *
                            </Label>
                            <Input
                              id="bedrooms"
                              type="number"
                              required
                              min="0"
                              max="20"
                              value={formData.bedrooms}
                              onChange={(e) =>
                                handleInputChange(
                                  'bedrooms',
                                  parseInt(e.target.value) || 0
                                )
                              }
                              className="h-11"
                            />
                          </div>

                          <div className="space-y-3">
                            <Label
                              htmlFor="bathrooms"
                              className="flex items-center gap-2 font-medium"
                            >
                              <Bath className="w-4 h-4" />
                              Bathrooms *
                            </Label>
                            <Input
                              id="bathrooms"
                              type="number"
                              required
                              min="0"
                              max="20"
                              value={formData.bathrooms}
                              onChange={(e) =>
                                handleInputChange(
                                  'bathrooms',
                                  parseInt(e.target.value) || 0
                                )
                              }
                              className="h-11"
                            />
                          </div>

                          <div className="space-y-3">
                            <Label
                              htmlFor="squareFeet"
                              className="flex items-center gap-2 font-medium"
                            >
                              <Square className="w-4 h-4" />
                              Square Meter *
                            </Label>
                            <Input
                              id="squareFeet"
                              type="number"
                              required
                              min="0"
                              value={formData.squareFeet}
                              onChange={(e) =>
                                handleInputChange(
                                  'squareFeet',
                                  parseInt(e.target.value) || 0
                                )
                              }
                              className="h-11"
                            />
                          </div>

                          <div className="space-y-3">
                            <Label
                              htmlFor="yearBuilt"
                              className="flex items-center gap-2 font-medium"
                            >
                              <Calendar className="w-4 h-4" />
                              Year Built
                            </Label>
                            <Input
                              id="yearBuilt"
                              type="number"
                              min="1800"
                              max={new Date().getFullYear()}
                              value={formData.yearBuilt || ''}
                              onChange={(e) =>
                                handleInputChange(
                                  'yearBuilt',
                                  e.target.value
                                    ? parseInt(e.target.value)
                                    : undefined
                                )
                              }
                              className="h-11"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Land-specific fields
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Land Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <Label
                              htmlFor="squareFeet"
                              className="flex items-center gap-2 font-medium"
                            >
                              <Square className="w-4 h-4" />
                              Land Area (Square Meter) *
                            </Label>
                            <Input
                              id="squareFeet"
                              type="number"
                              required
                              min="0"
                              value={formData.squareFeet}
                              onChange={(e) =>
                                handleInputChange(
                                  'squareFeet',
                                  parseInt(e.target.value) || 0
                                )
                              }
                              placeholder="e.g., 1000"
                              className="h-11"
                            />
                          </div>

                          <div className="space-y-3">
                            <Label
                              htmlFor="lotSize"
                              className="flex items-center gap-2 font-medium"
                            >
                              <Square className="w-4 h-4" />
                              Lot Size (Optional)
                            </Label>
                            <Input
                              id="lotSize"
                              type="number"
                              min="0"
                              value={formData.lotSize || ''}
                              onChange={(e) =>
                                handleInputChange(
                                  'lotSize',
                                  e.target.value
                                    ? parseInt(e.target.value)
                                    : undefined
                                )
                              }
                              placeholder="e.g., 500"
                              className="h-11"
                            />
                          </div>
                        </div>
                        <p className="text-sm text-gray-500">
                          Land properties don&apos;t require bedroom/bathroom
                          specifications
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {!validateStep(2) && (
                  <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 flex items-center gap-3">
                    <InfoIcon className="w-5 h-5 text-amber-600" />
                    <p className="text-amber-700 text-sm">
                      {isLandProperty
                        ? 'Please complete location and land area before continuing.'
                        : 'Please complete location and property specifications before continuing.'}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Media */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-fadeIn">
                <Card className="border-amber-100 shadow-sm">
                  <CardHeader className="bg-gradient-to-r from-amber-50 to-white border-b">
                    <CardTitle className="flex items-center gap-2">
                      <Upload className="w-5 h-5" />
                      Property Images
                    </CardTitle>
                    <CardDescription>
                      Showcase your property with high-quality photos
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-6">
                    <div className="space-y-4">
                      <div className="rounded-xl border-2 border-dashed border-amber-300 bg-amber-50 p-8 text-center hover:border-amber-400 transition-colors">
                        <div className="mb-4">
                          <Upload className="w-12 h-12 text-amber-600 mx-auto" />
                        </div>
                        <ImageUpload
                          value={newImages}
                          onChange={setNewImages}
                          onImagesChange={handleImageChange}
                          maxImages={10}
                          accept="image/*"
                        />
                        <p className="text-sm text-amber-700 mt-4">
                          Drag & drop or click to upload. Max 10 images.
                        </p>
                      </div>

                      {newImages.length > 0 && (
                        <div className="rounded-lg bg-gray-50 p-4 border border-gray-200">
                          <div className="flex items-start gap-4">
                            <div className="p-3 bg-white rounded-lg border border-gray-300">
                              <InfoIcon className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                              <h5 className="font-medium text-sm text-gray-900 mb-2">
                                Tips for great property photos
                              </h5>
                              <ul className="text-xs text-gray-600 space-y-1">
                                <li>
                                  • Use natural lighting for better quality
                                </li>
                                {isLandProperty ? (
                                  <>
                                    <li>• Show clear boundaries of the land</li>
                                    <li>
                                      • Include photos of the surrounding area
                                    </li>
                                    <li>
                                      • Show access roads and nearby
                                      infrastructure
                                    </li>
                                    <li>
                                      • Include any existing structures or
                                      features
                                    </li>
                                  </>
                                ) : (
                                  <>
                                    <li>
                                      • Include different angles of each room
                                    </li>
                                    <li>
                                      • Show exterior, kitchen, and bathrooms
                                    </li>
                                    <li>
                                      • First image should be the best exterior
                                      shot
                                    </li>
                                  </>
                                )}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}

                      {newImages.length === 0 && (
                        <div className="rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50 p-6 border border-amber-200">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-white rounded-lg border border-amber-300">
                              <Upload className="w-6 h-6 text-amber-600" />
                            </div>
                            <div>
                              <h5 className="font-semibold text-lg text-amber-900">
                                High-quality photos increase visibility
                              </h5>
                              <p className="text-amber-700 text-sm mt-1">
                                Properties with good photos get 10x more views
                                and 5x more inquiries!
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {!validateStep(3) && (
                  <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 flex items-center gap-3">
                    <InfoIcon className="w-5 h-5 text-amber-600" />
                    <p className="text-amber-700 text-sm">
                      Please upload at least one image of your property before
                      continuing.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Pricing */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-fadeIn">
                <Card className="border-brand/10 shadow-sm">
                  <CardHeader className="bg-linear-to-r from-brand/5 to-white border-b">
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      Pricing Details
                    </CardTitle>
                    <CardDescription>
                      Set competitive pricing for your property
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="price" className="font-medium">
                          {getPriceLabel()} *
                        </Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            ₦
                          </span>
                          <Input
                            id="price"
                            type="number"
                            required
                            min="0"
                            value={formData.price || ''}
                            onChange={(e) =>
                              handleInputChange(
                                'price',
                                e.target.value === ''
                                  ? 0
                                  : parseFloat(e.target.value)
                              )
                            }
                            className="h-11 pl-8"
                            placeholder={
                              isLandProperty
                                ? 'e.g., 50000000'
                                : 'e.g., 15000000'
                            }
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="priceUnit" className="font-medium">
                          Price Unit *
                        </Label>
                        <Select
                          required
                          value={formData.priceUnit}
                          onValueChange={(value) =>
                            handleInputChange('priceUnit', value)
                          }
                        >
                          <SelectTrigger id="priceUnit" className="h-11">
                            <SelectValue placeholder="Select price unit" />
                          </SelectTrigger>
                          <SelectContent>
                            {getPriceUnitOptions().map((unit) => (
                              <SelectItem key={unit} value={unit}>
                                <span className="capitalize">{unit}</span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3">
                        <Label className="font-medium text-transparent">
                          Display
                        </Label>
                        <div className="bg-linear-to-r from-brand to-brand/60 text-white rounded-lg p-4">
                          <p className="text-sm font-medium mb-1">
                            Your listing price
                          </p>
                          <p className="text-xl font-bold">
                            ₦{formData.price.toLocaleString()}
                            {formData.priceUnit === 'monthly' && '/mo'}
                            {formData.priceUnit === 'yearly' && '/yr'}
                            {formData.priceUnit === 'daily' && '/night'}
                            {formData.priceUnit === 'weekly' && '/week'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="originalPrice" className="font-medium">
                        Original Price (Optional)
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                          ₦
                        </span>
                        <Input
                          id="originalPrice"
                          type="number"
                          min="0"
                          value={formData.originalPrice || ''}
                          onChange={(e) =>
                            handleInputChange(
                              'originalPrice',
                              e.target.value
                                ? parseFloat(e.target.value)
                                : undefined
                            )
                          }
                          placeholder="Original price if discounted"
                          className="h-11 pl-8"
                        />
                      </div>
                      <p className="text-sm text-gray-500">
                        Shows as a discounted price to attract buyers
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {!validateStep(4) && (
                  <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 flex items-center gap-3">
                    <InfoIcon className="w-5 h-5 text-amber-600" />
                    <p className="text-amber-700 text-sm">
                      Please set a valid price for your property before
                      continuing.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Step 5: Finalize */}
            {currentStep === 5 && (
              <div className="space-y-6 animate-fadeIn">
                <Card className="border-blue-100 shadow-sm">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b">
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Review & Publish
                    </CardTitle>
                    <CardDescription>
                      Review your listing and make final adjustments before
                      publishing
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-6">
                    {/* Features & Amenities - Only show for non-land properties */}
                    {!isLandProperty && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Features & Amenities
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-3">
                            <h4 className="text-sm font-medium text-gray-900">
                              Property Features
                            </h4>
                            <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto p-2">
                              {PROPERTY_FEATURES.map((feature) => (
                                <div
                                  key={feature}
                                  className="flex items-center space-x-2"
                                >
                                  <Checkbox
                                    id={`feature-${feature}`}
                                    checked={formData.features.includes(
                                      feature
                                    )}
                                    onCheckedChange={() =>
                                      handleArrayToggle('features', feature)
                                    }
                                  />
                                  <Label
                                    htmlFor={`feature-${feature}`}
                                    className="text-sm cursor-pointer"
                                  >
                                    {feature}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-3">
                            <h4 className="text-sm font-medium text-gray-900">
                              Community Amenities
                            </h4>
                            <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto p-2">
                              {PROPERTY_AMENITIES.map((amenity) => (
                                <div
                                  key={amenity}
                                  className="flex items-center space-x-2"
                                >
                                  <Checkbox
                                    id={`amenity-${amenity}`}
                                    checked={formData.amenities.includes(
                                      amenity
                                    )}
                                    onCheckedChange={() =>
                                      handleArrayToggle('amenities', amenity)
                                    }
                                  />
                                  <Label
                                    htmlFor={`amenity-${amenity}`}
                                    className="text-sm cursor-pointer"
                                  >
                                    {amenity}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Additional Options */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Additional Options
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <Checkbox
                            id="isFeatured"
                            checked={formData.isFeatured}
                            onCheckedChange={(checked) =>
                              handleInputChange('isFeatured', checked)
                            }
                          />
                          <div>
                            <Label
                              htmlFor="isFeatured"
                              className="font-medium cursor-pointer"
                            >
                              Feature this property
                            </Label>
                            <p className="text-sm text-gray-500">
                              Get more visibility at the top of search results
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="tags" className="font-medium">
                            Tags (comma separated)
                          </Label>
                          <Input
                            id="tags"
                            value={tagsInput}
                            onChange={(e) =>
                              handleTagsInputChange(e.target.value)
                            }
                            placeholder={
                              isLandProperty
                                ? 'e.g., residential land, commercial land, waterfront, developed'
                                : 'e.g., luxury, waterfront, new, renovated'
                            }
                          />
                          {formData.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {formData.tags.map((tag, index) => (
                                <span
                                  key={index}
                                  className="bg-gray-100 text-gray-800 text-xs px-3 py-1.5 rounded-full border border-gray-300"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Summary Section */}
                    <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          Listing Summary
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="space-y-1">
                            <p className="text-gray-600">Property Type</p>
                            <p className="font-medium text-gray-900 capitalize">
                              {formData.propertyType}
                              {isLandProperty && ' (Land)'}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-gray-600">Listing Type</p>
                            <p className="font-medium text-gray-900 capitalize">
                              {formData.status.replace('-', ' ')}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-gray-600">Price</p>
                            <p className="font-medium text-gray-900">
                              ₦{formData.price.toLocaleString()}
                              {formData.priceUnit === 'monthly' && '/mo'}
                              {formData.priceUnit === 'yearly' && '/yr'}
                              {formData.priceUnit === 'daily' && '/night'}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-gray-600">Location</p>
                            <p className="font-medium text-gray-900">
                              {formData.city}, {formData.state}
                            </p>
                          </div>
                        </div>
                        {!isLandProperty && (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-4">
                            <div className="space-y-1">
                              <p className="text-gray-600">Bedrooms</p>
                              <p className="font-medium text-gray-900">
                                {formData.bedrooms}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-gray-600">Bathrooms</p>
                              <p className="font-medium text-gray-900">
                                {formData.bathrooms}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-gray-600">Size</p>
                              <p className="font-medium text-gray-900">
                                {formData.squareFeet} m²
                              </p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-gray-600">Images</p>
                              <p className="font-medium text-gray-900">
                                {newImages.length} uploaded
                              </p>
                            </div>
                          </div>
                        )}
                        {isLandProperty && (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-4">
                            <div className="space-y-1">
                              <p className="text-gray-600">Land Area</p>
                              <p className="font-medium text-gray-900">
                                {formData.squareFeet} m²
                              </p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-gray-600">Lot Size</p>
                              <p className="font-medium text-gray-900">
                                {formData.lotSize || 'Not specified'}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-gray-600">Images</p>
                              <p className="font-medium text-gray-900">
                                {newImages.length} uploaded
                              </p>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Navigation Buttons - Always visible at bottom */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 -mx-6 -mb-6 mt-8">
              <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    {currentStep > 1 && (
                      <Button
                        type="button"
                        onClick={goToPrevStep}
                        variant="outline"
                        className="gap-2"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Previous Step
                      </Button>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    {onCancel && (
                      <Button type="button" onClick={onCancel} variant="ghost">
                        Cancel
                      </Button>
                    )}

                    {currentStep < totalSteps ? (
                      <Button
                        type="button"
                        onClick={goToNextStep}
                        disabled={!validateStep(currentStep)}
                        className="gap-2 bg-brand hover:bg-brand"
                      >
                        Next Step
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button
                        type="button" // Changed from "submit" to "button"
                        onClick={handleSubmit} // Add onClick handler
                        disabled={
                          isSubmitting ||
                          (user?.userType === 'agent' && !agentProfileId) ||
                          !validateStep(1) ||
                          !validateStep(2) ||
                          !validateStep(3) ||
                          !validateStep(4)
                        }
                        className="gap-2 bg-linear-to-r from-brand/90 to-brand hover:from-brand hover:to-brand shadow-lg hover:shadow-xl"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Publishing...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" />
                            Publish Property
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Progress indicator at bottom */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      {currentStep === 1 && 'Complete basic information'}
                      {currentStep === 2 &&
                        (isLandProperty
                          ? 'Fill in location and land area'
                          : 'Fill in location and property details')}
                      {currentStep === 3 &&
                        'Upload at least one property image'}
                      {currentStep === 4 && 'Set your pricing'}
                      {currentStep === 5 && 'Review and publish'}
                    </div>
                    <div className="text-sm font-medium text-brand">
                      {validateStep(currentStep)
                        ? '✓ Step complete'
                        : 'Required fields missing'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// Add CSS for fade-in animation
const style = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}
`

// Add the style to the head
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style')
  styleElement.textContent = style
  document.head.appendChild(styleElement)
}
