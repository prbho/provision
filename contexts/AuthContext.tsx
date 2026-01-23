// contexts/AuthContext.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import {
  AuthState,
  EmailCheckResult,
  LoginCredentials,
  RegisterData,
  User,
  VerificationEmailResult,
} from '@/types/auth'
import { Query } from 'appwrite'

import EmailVerificationModal from '@/components/EmailVerificationModal'
import {
  account,
  AGENTS_COLLECTION_ID,
  DATABASE_ID,
  databases,
  USERS_COLLECTION_ID,
} from '@/lib/appwrite'

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData | FormData) => Promise<void>
  logout: () => Promise<void>
  checkEmail: (email: string) => Promise<EmailCheckResult>
  refreshUser: () => Promise<void>
  resendVerificationEmail: (email: string) => Promise<VerificationEmailResult>
  dismissVerificationModal: () => void
  showVerificationModal: boolean
  checkVerificationStatus: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  })
  const [showVerificationModal, setShowVerificationModal] = useState(false)
  const [verificationDismissed, setVerificationDismissed] = useState(false)
  const [authCheckComplete, setAuthCheckComplete] = useState(false)

  // Fetch user document from database - UPDATED TO CHECK BOTH COLLECTIONS
  const fetchUserDocument = async (userId: string): Promise<User | null> => {
    try {
      console.log('📄 Fetching user document for:', userId)

      let userDoc
      let collectionId = USERS_COLLECTION_ID
      let agentDocumentId: string | undefined = undefined
      let avatarUrl: string | undefined = undefined // Add this variable

      // First try users collection
      try {
        userDoc = await databases.getDocument(
          DATABASE_ID,
          USERS_COLLECTION_ID,
          userId
        )

        // If user is an agent, try to find their agent profile
        if (userDoc.userType === 'agent') {
          try {
            // Search for agent profile by userId field
            const agentProfiles = await databases.listDocuments(
              DATABASE_ID,
              AGENTS_COLLECTION_ID,
              [Query.equal('userId', userId)]
            )

            if (agentProfiles.documents.length > 0) {
              const agentProfile = agentProfiles.documents[0]
              agentDocumentId = agentProfile.$id

              // ✅ CRITICAL: Use agent's avatar if available
              avatarUrl = agentProfile.avatar || userDoc.avatar

              console.log('✅ Found agent profile for user:', {
                userAccountId: userId,
                agentDocumentId: agentProfile.$id,
                agentAvatar: agentProfile.avatar ? 'Set' : 'Not set',
                userAvatar: userDoc.avatar ? 'Set' : 'Not set',
                finalAvatar: avatarUrl ? 'Set' : 'Not set',
              })
            } else {
              console.log('⚠️ User is agent type but no agent profile found')
              avatarUrl = userDoc.avatar // Fall back to user avatar
            }
          } catch (agentError) {
            console.log('⚠️ Could not search for agent profile:', agentError)
            avatarUrl = userDoc.avatar // Fall back to user avatar
          }
        } else {
          // Regular user - use user's avatar
          avatarUrl = userDoc.avatar
        }
      } catch {
        // If not found in users, try agents collection
        try {
          userDoc = await databases.getDocument(
            DATABASE_ID,
            AGENTS_COLLECTION_ID,
            userId
          )
          collectionId = AGENTS_COLLECTION_ID
          agentDocumentId = userDoc.$id // This IS the agent document

          // ✅ Direct agent login - use agent's avatar
          avatarUrl = userDoc.avatar

          console.log('✅ User found in AGENTS collection (direct agent login)')
        } catch {
          return null
        }
      }

      console.log('✅ User document fetched successfully:', {
        id: userDoc.$id,
        email: userDoc.email,
        name: userDoc.name,
        userType: userDoc.userType,
        emailVerified: userDoc.emailVerified,
        avatar: avatarUrl ? 'Set' : 'Not set', // Log the determined avatar
        collection: collectionId === USERS_COLLECTION_ID ? 'users' : 'agents',
        agentDocumentId,
      })

      // Build user object with all fields
      const userObject: User = {
        $id: userDoc.$id,
        $createdAt: userDoc.$createdAt,
        $updatedAt: userDoc.$updatedAt,
        name: userDoc.name,
        email: userDoc.email,
        emailVerified: userDoc.emailVerified,
        phone: userDoc.phone || '',
        mobilePhone: userDoc.mobilePhone || '',
        userType: userDoc.userType || 'user',
        isActive: userDoc.isActive,
        verificationToken: userDoc.verificationToken,
        lastVerificationRequest: userDoc.lastVerificationRequest,
        emailVerifiedAt: userDoc.emailVerifiedAt,
        savedSearches: userDoc.savedSearches || [],
        favoriteProperties: userDoc.favoriteProperties || [],
        avatar: avatarUrl || userDoc.avatar || '', // ✅ Use the determined avatar URL
        bio: userDoc.bio,
        city: userDoc.city,
        state: userDoc.state,
      }

      // Add agent document ID if found
      if (agentDocumentId) {
        userObject.agentDocumentId = agentDocumentId
      }

      // Add optional fields
      if (userDoc.bio) userObject.bio = userDoc.bio
      if (userDoc.city) userObject.city = userDoc.city
      if (userDoc.state) userObject.state = userDoc.state

      // Add agent-specific fields if user is an agent
      // Check both collectionId AND userType for agent-specific fields
      if (
        collectionId === AGENTS_COLLECTION_ID ||
        userDoc.userType === 'agent'
      ) {
        userObject.agency = userDoc.agency
        userObject.licenseNumber = userDoc.licenseNumber
        userObject.yearsExperience = userDoc.yearsExperience
        userObject.specialties = userDoc.specialties || []
        userObject.languages = userDoc.languages || ['English']
        userObject.totalListings = userDoc.totalListings || 0
        userObject.rating = userDoc.rating || 0
        userObject.reviewCount = userDoc.reviewCount || 0
        userObject.isVerified = userDoc.isVerified || false
        userObject.verificationDocuments = userDoc.verificationDocuments || []
        userObject.officePhone = userDoc.officePhone
        userObject.website = userDoc.website
        userObject.specialty = userDoc.specialty
      }

      return userObject
    } catch (error) {
      console.error('❌ Error fetching user document:', error)
      return null
    }
  }

  // Create user document if it doesn't exist
  // This function is kept for potential future use, but eslint warning is suppressed
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const createUserDocument = async (userId: string): Promise<User | null> => {
    try {
      console.log('📝 Creating user document for:', userId)

      const appwriteUser = await account.get()

      const userDoc = await databases.createDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        userId,
        {
          name: appwriteUser.name,
          email: appwriteUser.email,
          emailVerified: false,
          userType: 'buyer',
          isActive: true,
          savedSearches: [],
          favoriteProperties: [],
        }
      )

      console.log('✅ User document created:', userDoc)

      return {
        $id: userDoc.$id,
        $createdAt: userDoc.$createdAt,
        $updatedAt: userDoc.$updatedAt,
        name: userDoc.name,
        email: userDoc.email,
        bio: userDoc.bio,
        state: userDoc.state,
        city: userDoc.city,
        emailVerified: userDoc.emailVerified,
        phone: userDoc.phone,
        mobilePhone: userDoc.mobilePhone,
        userType: userDoc.userType,
        isActive: userDoc.isActive,
        verificationToken: userDoc.verificationToken,
        lastVerificationRequest: userDoc.lastVerificationRequest,
        emailVerifiedAt: userDoc.emailVerifiedAt,
        savedSearches: userDoc.savedSearches || [],
        favoriteProperties: userDoc.favoriteProperties || [],
        avatar: userDoc.avatar,
      }
    } catch (error) {
      console.error('❌ Error creating user document:', error)
      return null
    }
  }

  const checkAuthStatus = useCallback(async () => {
    try {
      console.log('🔍 Starting auth status check...')
      setAuthState((prev) => ({ ...prev, isLoading: true }))

      // Check if we have a valid session first
      try {
        const session = await account.getSession('current')
        console.log('✅ Session found:', {
          id: session.$id,
          userId: session.userId,
          expire: session.expire,
        })
      } catch {
        console.log('❌ No active session found')
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        })
        setAuthCheckComplete(true)
        return
      }

      // Then get the Appwrite user
      const appwriteUser = await account.get()
      console.log('✅ Appwrite user account found:', {
        id: appwriteUser.$id,
        email: appwriteUser.email,
        name: appwriteUser.name,
      })

      // Fetch complete user data from database (UPDATED TO CHECK BOTH COLLECTIONS)
      const userDoc = await fetchUserDocument(appwriteUser.$id)

      if (userDoc) {
        console.log('🎯 Setting authenticated state with user:', {
          email: userDoc.email,
          userType: userDoc.userType,
          emailVerified: userDoc.emailVerified,
          isAgent: userDoc.userType === 'agent',
        })

        setAuthState({
          user: userDoc,
          isLoading: false,
          isAuthenticated: true,
        })
        setAuthCheckComplete(true)

        // Show verification modal if user is not verified and hasn't dismissed it
        if (!userDoc.emailVerified && !verificationDismissed) {
          console.log('📧 Showing verification modal - user not verified')
          setShowVerificationModal(true)
        } else if (userDoc.emailVerified) {
          console.log('✅ User is verified, hiding modal')
          setShowVerificationModal(false)
        }
      } else {
        console.log('❌ Could not fetch user document')
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        })
        setAuthCheckComplete(true)
      }
    } catch {
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      })
      setAuthCheckComplete(true)
    }
  }, [verificationDismissed])

  useEffect(() => {
    console.log('🚀 AuthProvider mounted - checking auth status')
    checkAuthStatus()
  }, [checkAuthStatus])

  const checkVerificationStatus = async (): Promise<boolean> => {
    try {
      if (!authState.user) {
        console.log('❌ No user in auth state for verification check')
        return false
      }

      console.log(
        '🔍 Checking verification status for user:',
        authState.user.$id
      )
      const updatedUser = await fetchUserDocument(authState.user.$id)

      if (updatedUser?.emailVerified) {
        console.log('✅ User email is verified!')
        setAuthState((prev) => ({
          ...prev,
          user: updatedUser,
        }))
        setShowVerificationModal(false)
        return true
      }

      console.log('📧 User email not yet verified')
      return false
    } catch (error) {
      console.error('❌ Error checking verification status:', error)
      return false
    }
  }

  // refreshUser function (single implementation)
  const refreshUser = async () => {
    try {
      console.log('🔄 Refreshing user data...')

      if (!authState.user) {
        console.log('❌ No user to refresh')
        return
      }

      const updatedUserDoc = await fetchUserDocument(authState.user.$id)

      if (updatedUserDoc) {
        console.log('✅ User data refreshed:', {
          name: updatedUserDoc.name,
          email: updatedUserDoc.email,
          userType: updatedUserDoc.userType,
          avatar: updatedUserDoc.avatar, // Check if avatar is included
          collection: updatedUserDoc.userType === 'agent' ? 'agents' : 'users',
        })

        setAuthState((prev) => ({
          ...prev,
          user: updatedUserDoc,
        }))
      }
    } catch (error) {
      console.error('❌ Error refreshing user:', error)
    }
  }

  const checkEmail = async (email: string): Promise<EmailCheckResult> => {
    try {
      console.log('📧 Checking email:', email)

      if (!email || !email.includes('@')) {
        console.log('❌ Invalid email format')
        return {
          exists: false,
          error: true,
          message: 'Please enter a valid email address',
        }
      }

      const response = await fetch('/api/auth/check-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const result = await response.json()
      console.log('📧 API response:', result)

      // Handle API errors
      if (!response.ok || result.error) {
        console.error(
          '❌ Email check failed:',
          result.message || result.warning
        )
        return {
          exists: false,
          error: true,
          message: result.message || result.warning || 'Unable to check email',
          warning: result.warning,
        }
      }

      // Return the result (exists will be true/false)
      return result as EmailCheckResult
    } catch (error: any) {
      console.error('❌ Email check exception:', error.message)
      return {
        exists: false,
        error: true,
        message: 'Network error. Please try again.',
      }
    }
  }

  const login = async (credentials: LoginCredentials) => {
    try {
      console.log('🔐 Attempting login for:', credentials.email)
      setAuthState((prev) => ({ ...prev, isLoading: true }))

      await account.createEmailPasswordSession(
        credentials.email,
        credentials.password
      )

      await checkAuthStatus()
    } catch (error: any) {
      console.error('❌ Login error details:', {
        code: error.code,
        message: error.message,
        type: error.type,
        response: error.response,
      })

      setAuthState((prev) => ({ ...prev, isLoading: false }))

      // Map Appwrite errors to user-friendly messages
      let userFriendlyError = error

      if (error.code === 400) {
        userFriendlyError = {
          ...error,
          message: 'Invalid email or password. Please try again.',
        }
      } else if (error.code === 401) {
        userFriendlyError = {
          ...error,
          message: 'Invalid credentials. Please check your email and password.',
        }
      } else if (error.code === 429) {
        userFriendlyError = {
          ...error,
          message: 'Too many login attempts. Please try again in 15 minutes.',
        }
      } else if (
        error.message?.toLowerCase().includes('password') ||
        error.message?.toLowerCase().includes('credentials')
      ) {
        userFriendlyError = {
          ...error,
          message: 'Incorrect password. Please try again.',
        }
      }

      throw userFriendlyError
    }
  }

  const register = async (data: RegisterData | FormData) => {
    try {
      console.log('📝 Starting registration...')
      setAuthState((prev) => ({ ...prev, isLoading: true }))

      let response

      // Check if data is FormData (for file uploads)
      if (data instanceof FormData) {
        console.log('📁 Using FormData for registration (with file)')

        // Add debug logging for FormData contents
        console.log('📋 FormData entries:')
        for (const [key, value] of data.entries()) {
          if (key === 'avatar' && value instanceof File) {
            console.log(`  ${key}:`, {
              name: value.name,
              type: value.type,
              size: value.size,
            })
          } else if (key === 'agentData' && typeof value === 'string') {
            try {
              console.log(`  ${key}:`, JSON.parse(value))
            } catch {
              console.log(`  ${key}:`, value)
            }
          } else {
            console.log(`  ${key}:`, value)
          }
        }

        response = await fetch('/api/auth/register', {
          method: 'POST',
          body: data,
          // DO NOT set Content-Type header - browser will set it automatically
        })
      } else {
        // Handle regular JSON data (backward compatibility)
        console.log('📄 Using JSON for registration (no file)')
        console.log('📋 Registration data:', {
          ...data,
          password: '[PROTECTED]',
          email: data.email ? `${data.email.substring(0, 3)}...` : 'none',
        })

        response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
      }

      const result = await response.json()

      if (!response.ok) {
        console.error('❌ Registration API error:', result.error)
        throw new Error(result.error || 'Registration failed')
      }

      console.log('✅ Registration successful, user:', {
        id: result.user?.id,
        email: result.user?.email
          ? `${result.user.email.substring(0, 3)}...`
          : 'none',
        userType: result.user?.userType,
        hasAvatar: !!result.user?.avatar,
      })

      // Immediately update auth state
      setAuthState({
        user: result.user,
        isLoading: false,
        isAuthenticated: true,
      })
      setAuthCheckComplete(true)

      // Show verification modal
      setVerificationDismissed(false)
      setShowVerificationModal(true)

      console.log('📧 Verification modal shown')

      return result // Return the result for the caller
    } catch (error: any) {
      console.error('❌ Registration error:', error.message || error)
      setAuthState((prev) => ({ ...prev, isLoading: false }))
      throw error // Re-throw the error for the caller to handle
    }
  }

  const resendVerificationEmail = async (
    email: string
  ): Promise<VerificationEmailResult> => {
    try {
      console.log('📧 Resending verification email to:', email)

      if (!email) {
        throw new Error('Email is required')
      }

      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      console.log('📡 Response status:', response.status, response.statusText)

      // Get response text first to see what we're getting
      const responseText = await response.text()
      console.log(
        '📄 Raw response text:',
        responseText.substring(0, 200) + '...'
      )

      let errorData
      try {
        errorData = JSON.parse(responseText)
      } catch (parseError) {
        console.error('❌ Failed to parse JSON response:', parseError)
        throw new Error(
          `Server returned invalid JSON: ${responseText.substring(0, 100)}`
        )
      }

      if (!response.ok) {
        console.error('❌ Resend verification API error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData,
        })

        // Provide more specific error messages
        let userMessage = 'Failed to resend verification email'

        if (errorData?.code === 'USER_NOT_FOUND') {
          userMessage = 'User not found with this email address'
        } else if (errorData?.code === 'ALREADY_VERIFIED') {
          userMessage = 'Email is already verified'
        } else if (errorData?.code === 'EMAIL_SEND_FAILED') {
          userMessage = 'Failed to send email. Please try again later.'
        } else if (errorData?.error) {
          userMessage = errorData.error
        } else if (errorData?.message) {
          userMessage = errorData.message
        }

        throw new Error(userMessage)
      }

      console.log('✅ Verification email resent successfully:', errorData)

      return {
        success: true,
        message:
          errorData.message ||
          'Verification email sent! Please check your inbox.',
        data: errorData, // Pass along any additional data
      }
    } catch (error: any) {
      console.error('❌ Resend verification catch error:', error.message)
      // Don't use toast.error here - let the component handle it
      throw error // Re-throw so the component can show the error
    }
  }
  const dismissVerificationModal = () => {
    console.log('📧 Verification modal dismissed')
    setShowVerificationModal(false)
    setVerificationDismissed(true)
  }

  const logout = async () => {
    try {
      console.log('🚪 Logging out...')
      setAuthState((prev) => ({ ...prev, isLoading: true }))
      await account.deleteSession('current')
    } catch (error) {
      console.error('❌ Logout error:', error)
    } finally {
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      })
      setAuthCheckComplete(true)
      setShowVerificationModal(false)
      setVerificationDismissed(false)
      console.log('✅ Logout completed')
    }
  }

  // CORRECTED context value (no duplicate refreshUser)
  const value: AuthContextType = {
    ...authState,
    login,
    register,
    logout,
    checkEmail,
    refreshUser, // Only one instance
    resendVerificationEmail,
    dismissVerificationModal,
    showVerificationModal,
    checkVerificationStatus,
  }

  // Debug: Log when auth state changes
  useEffect(() => {
    console.log('🔄 Auth state updated:', {
      isAuthenticated: authState.isAuthenticated,
      isLoading: authState.isLoading,
      authCheckComplete,
      user: authState.user
        ? {
            email: authState.user.email,
            name: authState.user.name,
            userType: authState.user.userType,
            emailVerified: authState.user.emailVerified,
            isAgent: authState.user.userType === 'agent',
          }
        : null,
    })
  }, [authState, authCheckComplete])

  return (
    <AuthContext.Provider value={value}>
      {children}
      <EmailVerificationModal
        isOpen={showVerificationModal && !authState.user?.emailVerified}
        userEmail={authState.user?.email || ''}
        onClose={dismissVerificationModal}
        onResendEmail={() => {
          console.log('📧 Resend email triggered for:', authState.user?.email)
          return resendVerificationEmail(authState.user?.email || '')
        }}
        onCheckVerification={checkVerificationStatus}
      />
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
