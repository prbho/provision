// app/profile/[userType]/[id]/page.tsx
'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import {
  Award,
  Bell,
  Briefcase,
  Calendar,
  Camera,
  Clock,
  DollarSign,
  Edit3,
  Eye,
  Globe,
  Heart,
  Home,
  Key,
  LogOut,
  Mail,
  MapPin,
  Phone,
  Save,
  Shield,
  Trash2,
  TrendingUp,
  User,
  X,
} from 'lucide-react'
import { toast } from 'sonner'

import DeleteAccountModal from '@/components/DeleteAccountModal'
import ImageCropperModal from '@/components/ImageCropperModal'
import PremiumFeaturesSection from '@/components/PremiumFeaturesSection'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  AGENTS_COLLECTION_ID,
  DATABASE_ID,
  databases,
  deleteAgentAccount,
  deleteUserAccount,
  Query,
  updateAgentProfile,
  updateUserProfile,
  uploadAvatar,
  USERS_COLLECTION_ID,
} from '@/lib/appwrite'

const checkUserPremiumStatus = async (userId: string) => {
  try {
    const response = await fetch(`/api/premium/status?userId=${userId}`)
    if (response.ok) {
      return await response.json()
    }
    throw new Error('Failed to fetch premium status')
  } catch (error) {
    console.error('Error checking premium status:', error)
    return {
      hasPremium: false,
      activePlans: [],
      startDate: null,
      expiresAt: null,
    }
  }
}

export default function DynamicProfilePage({}: {
  params: Promise<{ userType: string; id: string }>
}) {
  const params = useParams()
  const userType = params.userType as string
  const id = params.id as string
  const router = useRouter()
  const { user, isAuthenticated, logout, isLoading, refreshUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [showCropper, setShowCropper] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string>('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    location: '',
    website: '',
  })
  const [premiumStatus, setPremiumStatus] = useState({
    hasPremium: false,
    activePlans: [] as string[],
    startDate: null as string | null,
    expiresAt: null as string | null,
  })

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Validate if user is viewing their own profile
  useEffect(() => {
    if (!isLoading && user && user.$id !== id) {
      toast.error('You can only view your own profile')
      router.push('/')
    }

    if (!isLoading && user && user.userType !== userType) {
      const correctPath = `/profile/${user.userType}/${user.$id}`
      router.replace(correctPath)
    }
  }, [user, isLoading, id, userType, router])

  const loadPremiumStatus = useCallback(async () => {
    if (!user) return

    try {
      const status = await checkUserPremiumStatus(user.$id)
      setPremiumStatus(status)
    } catch {}
  }, [user])

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || '',
        location: user.city || '',
        website: user.website || '',
      })

      loadPremiumStatus()
    }
  }, [user, loadPremiumStatus])

  const handleSave = async () => {
    if (!user) return

    try {
      if (user.userType === 'agent') {
        await updateAgentProfile(user.$id, formData)
      } else {
        await updateUserProfile(user.$id, formData)
      }

      await refreshUser()
      setIsEditing(false)
      toast.success('Profile updated successfully!')
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    }
  }

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB')
      return
    }

    if (selectedImage && selectedImage.startsWith('blob:')) {
      URL.revokeObjectURL(selectedImage)
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const base64Image = e.target?.result as string
      setSelectedImage(base64Image)
      setShowCropper(true)
    }
    reader.onerror = () => {
      toast.error('Failed to read image file')
    }
    reader.readAsDataURL(file)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleCropComplete = async (croppedImageBlob: Blob) => {
    if (!user) return

    setIsUploading(true)
    try {
      const croppedFile = new File([croppedImageBlob], 'avatar.jpg', {
        type: 'image/jpeg',
        lastModified: Date.now(),
      })

      let avatarUrl

      if (user.userType === 'agent') {
        let agentDocId = user.agentDocumentId
        if (!agentDocId) {
          const agents = await databases.listDocuments(
            DATABASE_ID,
            AGENTS_COLLECTION_ID,
            [Query.equal('userId', user.$id)]
          )
          if (agents.total === 0) {
            throw new Error('Agent profile not found')
          }
          agentDocId = agents.documents[0].$id
        }
        avatarUrl = await uploadAvatar(
          agentDocId,
          croppedFile,
          AGENTS_COLLECTION_ID
        )
      } else {
        avatarUrl = await uploadAvatar(
          user.$id,
          croppedFile,
          USERS_COLLECTION_ID
        )
      }

      await refreshUser()
      toast.success('Profile picture updated!')
    } catch (error) {
      console.error('Error uploading cropped avatar:', error)
      toast.error('Failed to upload avatar')
    } finally {
      setIsUploading(false)
      if (selectedImage) {
        URL.revokeObjectURL(selectedImage)
        setSelectedImage('')
      }
    }
  }

  const handleCancelCrop = () => {
    setShowCropper(false)
    setTimeout(() => {
      if (selectedImage) {
        URL.revokeObjectURL(selectedImage)
        setSelectedImage('')
      }
    }, 100)
  }

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || '',
        location: user.city || '',
        website: user.website || '',
      })
    }
    setIsEditing(false)
  }

  const handleDeleteAccount = async () => {
    if (!user) return

    setIsDeleting(true)
    try {
      if (user.userType === 'agent') {
        await deleteAgentAccount(user.$id)
      } else {
        await deleteUserAccount(user.$id)
      }

      await logout()
      router.push('/')
      toast.success('Account deleted successfully')
    } catch (error) {
      console.error('❌ Error deleting account:', error)
      toast.error('Failed to delete account')
    } finally {
      setIsDeleting(false)
      setShowDeleteModal(false)
    }
  }

  const getUserTypeConfig = () => {
    switch (userType) {
      case 'agent':
        return {
          icon: <Briefcase className="w-4 h-4" />,
          color: 'bg-purple-100 text-purple-800',
          label: 'Real Estate Agent',
          badgeColor: 'bg-gradient-to-r from-purple-500 to-purple-600',
        }
      case 'seller':
        return {
          icon: <DollarSign className="w-4 h-4" />,
          color: 'bg-amber-100 text-amber-800',
          label: 'Property Seller',
          badgeColor: 'bg-gradient-to-r from-amber-500 to-amber-600',
        }
      case 'buyer':
        return {
          icon: <Home className="w-4 h-4" />,
          color: 'bg-blue-100 text-blue-800',
          label: 'Property Buyer',
          badgeColor: 'bg-gradient-to-r from-blue-500 to-blue-600',
        }
      default:
        return {
          icon: <User className="w-4 h-4" />,
          color: 'bg-gray-100 text-gray-800',
          label: 'User',
          badgeColor: 'bg-gradient-to-r from-gray-500 to-gray-600',
        }
    }
  }

  const userTypeConfig = getUserTypeConfig()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin absolute top-0"></div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-linear-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center max-w-md mx-4">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Sign In Required
          </h2>
          <p className="text-gray-600 mb-8">
            Please sign in to access your profile and personalized settings
          </p>
          <Button
            onClick={() => router.push('/login')}
            className="bg-linear-to-r from-brand to-brand hover:from-brand hover:to-brand text-white px-8 py-3 rounded-xl shadow-lg"
          >
            Sign In
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 overflow-hidden">
          <div className="p-0">
            <div className="px-8 pb-4">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900">
                    My Profile
                  </h1>
                  <p className="text-gray-600 mt-2">
                    Manage your account and preferences
                  </p>
                </div>

                <div className="flex gap-3">
                  {!isEditing ? (
                    <Button
                      onClick={() => setIsEditing(true)}
                      className="bg-linear-to-r from-brand to-emerald-600 hover:from-brand/90 hover:to-brand text-white shadow-lg"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  ) : (
                    <>
                      <Button
                        onClick={handleSave}
                        className="bg-linear-to-r from-brand/85 to-green-600 hover:from-brand hover:to-brand text-white shadow-lg"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleCancel}
                        className="border-gray-300 hover:bg-gray-50"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>

            <Separator className="my-0" />

            {/* Profile Content */}
            <div className="p-8">
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* Avatar Section */}
                <div className="shrink-0">
                  <div className="relative group">
                    <div className="relative">
                      <Avatar className="h-40 w-40 border-4 border-white shadow-xl">
                        <AvatarImage
                          src={user?.avatar}
                          alt={user.name}
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-linear-to-br from-gray-100 to-gray-200">
                          <User className="w-16 h-16 text-gray-400" />
                        </AvatarFallback>
                      </Avatar>

                      <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageSelect}
                      accept="image/*"
                      className="hidden"
                    />

                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="absolute bottom-4 right-4 p-3 bg-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200"
                      size="icon"
                    >
                      {isUploading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-emerald-600 border-t-transparent" />
                      ) : (
                        <Camera className="w-5 h-5 text-gray-700" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* User Details */}
                <div className="flex-1 space-y-6">
                  {isEditing ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                            placeholder="Enter your full name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                          </label>
                          <div className="relative">
                            <input
                              type="email"
                              value={formData.email}
                              className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 text-gray-600"
                              disabled
                            />
                            <Mail className="absolute right-3 top-3.5 w-4 h-4 text-gray-400" />
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            Contact support to change your email
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number
                          </label>
                          <div className="relative">
                            <input
                              type="tel"
                              value={formData.phone}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  phone: e.target.value,
                                })
                              }
                              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                              placeholder="+234 800 000 0000"
                            />
                            <Phone className="absolute right-3 top-3.5 w-4 h-4 text-gray-400" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Location
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={formData.location}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  location: e.target.value,
                                })
                              }
                              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                              placeholder="e.g., Lagos, Nigeria"
                            />
                            <MapPin className="absolute right-3 top-3.5 w-4 h-4 text-gray-400" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Website / Portfolio
                          </label>
                          <div className="relative">
                            <input
                              type="url"
                              value={formData.website}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  website: e.target.value,
                                })
                              }
                              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                              placeholder="https://example.com"
                            />
                            <Globe className="absolute right-3 top-3.5 w-4 h-4 text-gray-400" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Bio / About
                          </label>
                          <textarea
                            value={formData.bio}
                            onChange={(e) =>
                              setFormData({ ...formData, bio: e.target.value })
                            }
                            rows={4}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors resize-none"
                            placeholder="Tell us about yourself..."
                            maxLength={500}
                          />
                          <div className="flex justify-between text-xs text-gray-500 mt-2">
                            <span>Brief introduction about yourself</span>
                            <span>{formData.bio.length}/500</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                          {user.name}
                        </h2>
                        <div className="flex items-center gap-4 text-gray-600">
                          {user.city && (
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              <span>{user.city}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>
                              Joined{' '}
                              {new Date(user.$createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <p className="text-gray-700 leading-relaxed">
                          {user.bio ||
                            'Add a bio to tell others about yourself.'}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-4 bg-brand/5 rounded-xl">
                          <div className="p-2 bg-white rounded-lg shadow-sm">
                            <Mail className="w-5 h-5 text-brand" />
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Email</div>
                            <div className="font-medium text-gray-900">
                              {user.email}
                            </div>
                          </div>
                          {user.emailVerified && (
                            <Badge className="ml-auto bg-brand/10 text-brand">
                              Verified
                            </Badge>
                          )}
                        </div>

                        {user.phone && (
                          <div className="flex items-center gap-3 p-4 bg-brand/5 rounded-xl">
                            <div className="p-2 bg-white rounded-lg shadow-sm">
                              <Phone className="w-5 h-5 text-brand" />
                            </div>
                            <div>
                              <div className="text-sm text-gray-500">Phone</div>
                              <div className="font-medium text-gray-900">
                                {user.phone}
                              </div>
                            </div>
                          </div>
                        )}

                        {user.website && (
                          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl sm:col-span-2">
                            <div className="p-2 bg-white rounded-lg shadow-sm">
                              <Globe className="w-5 h-5 text-gray-600" />
                            </div>
                            <div className="flex-1">
                              <div className="text-sm text-gray-500">
                                Website
                              </div>
                              <a
                                href={
                                  user.website.startsWith('http')
                                    ? user.website
                                    : `https://${user.website}`
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-emerald-600 hover:text-emerald-700 hover:underline"
                              >
                                {user.website}
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <Card className="bg-white px-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div
              className="border rounded-lg cursor-pointer"
              onClick={() => router.push('/profile/saved')}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-red-50 rounded-xl">
                        <Heart className="w-6 h-6 text-red-500" />
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-gray-900">
                          {user.favoriteProperties?.length || 0}
                        </div>
                        <div className="text-sm text-gray-600">
                          Saved Properties
                        </div>
                      </div>
                    </div>
                    <div className="text-emerald-600 font-medium text-sm flex items-center gap-1 group">
                      View saved properties
                      <TrendingUp className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </div>

            <div
              className="border rounded-lg cursor-pointer"
              onClick={() => router.push('/profile/recent')}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-blue-50 rounded-xl">
                        <Eye className="w-6 h-6 text-blue-500" />
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-gray-900">
                          {user.savedSearches?.length || 0}
                        </div>
                        <div className="text-sm text-gray-600">
                          Saved Searches
                        </div>
                      </div>
                    </div>
                    <div className="text-emerald-600 font-medium text-sm flex items-center gap-1 group">
                      View search history
                      <Clock className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </div>

            <div className="border rounded-lg cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-green-50 rounded-xl">
                        <Award className="w-6 h-6 text-green-500" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900 capitalize">
                          {user.userType || 'buyer'}
                        </div>
                        <div className="text-sm text-gray-600">
                          Account Type
                        </div>
                      </div>
                    </div>
                    {(user.userType === 'buyer' ||
                      user.userType === 'seller') && (
                      <Button
                        variant="ghost"
                        className="text-emerald-600 hover:text-emerald-700 px-0"
                        onClick={() => router.push('/become-agent')}
                      >
                        Upgrade to Agent
                        <TrendingUp className="w-4 h-4 ml-1" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Premium Features */}
            <div className="lg:col-span-2">
              <PremiumFeaturesSection
                premiumStatus={premiumStatus}
                onExtendPlan={() => router.push('/pricing')}
              />
            </div>

            {/* Quick Settings */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6">
                  Quick Settings
                </h3>
                <div className="space-y-4">
                  <Button
                    variant="ghost"
                    className="w-full justify-start hover:bg-gray-50"
                    onClick={() => router.push('/settings#security')}
                  >
                    <Key className="w-4 h-4 mr-3 text-gray-500" />
                    Change Password
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start hover:bg-gray-50"
                    onClick={() => router.push('/settings#notifications')}
                  >
                    <Shield className="w-4 h-4 mr-3 text-gray-500" />
                    Privacy Settings
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start hover:bg-gray-50"
                    onClick={() => router.push('/settings#notifications')}
                  >
                    <Bell className="w-4 h-4 mr-3 text-gray-500" />
                    Notifications
                  </Button>

                  {!user.emailVerified && (
                    <Button
                      variant="outline"
                      className="w-full justify-start border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-700"
                      onClick={() => router.push('/auth/verify-email')}
                    >
                      <Shield className="w-4 h-4 mr-3" />
                      Verify Email
                    </Button>
                  )}

                  <Separator className="my-4" />

                  <Button
                    variant="ghost"
                    className="w-full justify-start hover:bg-gray-50 text-gray-600"
                    onClick={logout}
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Sign Out
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full justify-start hover:bg-red-50 text-red-600"
                    onClick={() => setShowDeleteModal(true)}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-600 border-t-transparent mr-3" />
                    ) : (
                      <Trash2 className="w-4 h-4 mr-3" />
                    )}
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </Card>
      </div>

      {showDeleteModal && (
        <DeleteAccountModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteAccount}
          userEmail={user?.email || ''}
        />
      )}

      {showCropper && selectedImage && (
        <ImageCropperModal
          image={selectedImage}
          onClose={handleCancelCrop}
          onCropComplete={handleCropComplete}
          aspectRatio={1}
        />
      )}
    </div>
  )
}
