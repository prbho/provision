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

  /**
   * ✅ Fetch user document from database (checks Users first, then Agents).
   * Keeps your existing avatar logic intact.
   */
  const fetchUserDocument = async (userId: string): Promise<User | null> => {
    try {
      console.log('📄 Fetching user document for:', userId)

      let userDoc: any
      let collectionId = USERS_COLLECTION_ID
      let agentDocumentId: string | undefined = undefined
      let avatarUrl: string | undefined = undefined

      // 1) Try users collection
      try {
        userDoc = await databases.getDocument(
          DATABASE_ID,
          USERS_COLLECTION_ID,
          userId
        )

        if (userDoc.userType === 'agent') {
          try {
            const agentProfiles = await databases.listDocuments(
              DATABASE_ID,
              AGENTS_COLLECTION_ID,
              [Query.equal('userId', userId)]
            )

            if (agentProfiles.documents.length > 0) {
              const agentProfile: any = agentProfiles.documents[0]
              agentDocumentId = agentProfile.$id
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
              avatarUrl = userDoc.avatar
            }
          } catch (agentError) {
            console.log('⚠️ Could not search for agent profile:', agentError)
            avatarUrl = userDoc.avatar
          }
        } else {
          avatarUrl = userDoc.avatar
        }
      } catch {
        // 2) Fallback: agents collection direct login
        try {
          userDoc = await databases.getDocument(
            DATABASE_ID,
            AGENTS_COLLECTION_ID,
            userId
          )
          collectionId = AGENTS_COLLECTION_ID
          agentDocumentId = userDoc.$id
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
        avatar: avatarUrl ? 'Set' : 'Not set',
        collection: collectionId === USERS_COLLECTION_ID ? 'users' : 'agents',
        agentDocumentId,
      })

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
        avatar: avatarUrl || userDoc.avatar || '',
        bio: userDoc.bio,
        city: userDoc.city,
        state: userDoc.state,
      }

      if (agentDocumentId) userObject.agentDocumentId = agentDocumentId

      // agent fields
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

  /**
   * ✅ Server-side cookie sync for SSR routes.
   * We call your server login route so it can set pv_jwt (httpOnly).
   * This will NOT break production if it fails.
   */
  const ssrLoginSync = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      // Your login route returns 200/401. We don’t block user if it fails.
      const json = await res.json().catch(() => null)
      if (!res.ok) {
        console.warn('⚠️ SSR login sync failed:', json?.error || res.statusText)
        return
      }

      console.log('✅ SSR login sync ok (pv_jwt should be set)')
    } catch (e) {
      console.warn('⚠️ SSR login sync error:', e)
    }
  }

  /**
   * ✅ Server-side logout sync (clears pv_jwt).
   * You need a tiny /api/auth/logout route to clear cookie (I’ll provide below).
   */
  const ssrLogoutSync = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' }).catch(() => null)
    } catch {}
  }

  const checkAuthStatus = useCallback(async () => {
    try {
      console.log('🔍 Starting auth status check...')
      setAuthState((prev) => ({ ...prev, isLoading: true }))

      // Check session first
      try {
        const session = await account.getSession('current')
        console.log('✅ Session found:', {
          id: session.$id,
          userId: session.userId,
          expire: session.expire,
        })
      } catch {
        console.log('❌ No active session found')
        setAuthState({ user: null, isLoading: false, isAuthenticated: false })
        setAuthCheckComplete(true)
        return
      }

      const appwriteUser = await account.get()
      console.log('✅ Appwrite user account found:', {
        id: appwriteUser.$id,
        email: appwriteUser.email,
        name: appwriteUser.name,
      })

      const userDoc = await fetchUserDocument(appwriteUser.$id)

      if (userDoc) {
        setAuthState({ user: userDoc, isLoading: false, isAuthenticated: true })
        setAuthCheckComplete(true)

        if (!userDoc.emailVerified && !verificationDismissed) {
          setShowVerificationModal(true)
        } else if (userDoc.emailVerified) {
          setShowVerificationModal(false)
        }
      } else {
        setAuthState({ user: null, isLoading: false, isAuthenticated: false })
        setAuthCheckComplete(true)
      }
    } catch {
      setAuthState({ user: null, isLoading: false, isAuthenticated: false })
      setAuthCheckComplete(true)
    }
  }, [verificationDismissed])

  useEffect(() => {
    console.log('🚀 AuthProvider mounted - checking auth status')
    checkAuthStatus()
  }, [checkAuthStatus])

  const checkVerificationStatus = async (): Promise<boolean> => {
    try {
      if (!authState.user) return false

      const updatedUser = await fetchUserDocument(authState.user.$id)
      if (updatedUser?.emailVerified) {
        setAuthState((prev) => ({ ...prev, user: updatedUser }))
        setShowVerificationModal(false)
        return true
      }
      return false
    } catch (error) {
      console.error('❌ Error checking verification status:', error)
      return false
    }
  }

  const refreshUser = async () => {
    try {
      if (!authState.user) return
      const updatedUserDoc = await fetchUserDocument(authState.user.$id)
      if (updatedUserDoc) {
        setAuthState((prev) => ({ ...prev, user: updatedUserDoc }))
      }
    } catch (error) {
      console.error('❌ Error refreshing user:', error)
    }
  }

  const checkEmail = async (email: string): Promise<EmailCheckResult> => {
    try {
      if (!email || !email.includes('@')) {
        return {
          exists: false,
          error: true,
          message: 'Please enter a valid email address',
        }
      }

      const response = await fetch('/api/auth/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const result = await response.json()
      if (!response.ok || result.error) {
        return {
          exists: false,
          error: true,
          message: result.message || result.warning || 'Unable to check email',
          warning: result.warning,
        }
      }

      return result as EmailCheckResult
    } catch (error: any) {
      return {
        exists: false,
        error: true,
        message: 'Network error. Please try again.',
      }
    }
  }

  /**
   * ✅ LOGIN
   * 1) client Appwrite session (keeps current behavior)
   * 2) SSR sync by calling your server login route to set pv_jwt cookie
   */
  const login = async (credentials: LoginCredentials) => {
    try {
      console.log('🔐 Attempting login for:', credentials.email)
      setAuthState((prev) => ({ ...prev, isLoading: true }))

      // 1) Keep your current client login
      await account.createEmailPasswordSession(
        credentials.email,
        credentials.password
      )

      // 2) NEW: create pv_jwt cookie on localhost / production domain
      await fetch('/api/auth/ssr-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // IMPORTANT: credentials include (safe even for same-origin)
        credentials: 'include',
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      })

      await checkAuthStatus()
    } catch (error: any) {
      console.error('❌ Login error details:', {
        code: error.code,
        message: error.message,
        type: error.type,
        response: error.response,
      })

      setAuthState((prev) => ({ ...prev, isLoading: false }))

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

      let response: Response

      if (data instanceof FormData) {
        response = await fetch('/api/auth/register', {
          method: 'POST',
          body: data,
        })
      } else {
        response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
      }

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Registration failed')
      }

      setAuthState({
        user: result.user,
        isLoading: false,
        isAuthenticated: true,
      })
      setAuthCheckComplete(true)

      setVerificationDismissed(false)
      setShowVerificationModal(true)

      return result
    } catch (error: any) {
      setAuthState((prev) => ({ ...prev, isLoading: false }))
      throw error
    }
  }

  const resendVerificationEmail = async (
    email: string
  ): Promise<VerificationEmailResult> => {
    const response = await fetch('/api/auth/resend-verification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ email }),
    })

    const text = await response.text()
    let data: any
    try {
      data = JSON.parse(text)
    } catch {
      throw new Error(`Server returned invalid JSON: ${text.substring(0, 100)}`)
    }

    if (!response.ok) {
      let userMessage = 'Failed to resend verification email'
      if (data?.code === 'USER_NOT_FOUND')
        userMessage = 'User not found with this email address'
      else if (data?.code === 'ALREADY_VERIFIED')
        userMessage = 'Email is already verified'
      else if (data?.code === 'EMAIL_SEND_FAILED')
        userMessage = 'Failed to send email. Please try again later.'
      else if (data?.error) userMessage = data.error
      else if (data?.message) userMessage = data.message
      throw new Error(userMessage)
    }

    return {
      success: true,
      message:
        data.message || 'Verification email sent! Please check your inbox.',
      data,
    }
  }

  const dismissVerificationModal = () => {
    setShowVerificationModal(false)
    setVerificationDismissed(true)
  }

  /**
   * ✅ LOGOUT
   * 1) client session delete
   * 2) clear pv_jwt on server
   */
  const logout = async () => {
    try {
      console.log('🚪 Logging out...')
      setAuthState((prev) => ({ ...prev, isLoading: true }))

      // 1) Keep your current client logout
      await account.deleteSession('current')

      // 2) NEW: clear pv_jwt too
      await fetch('/api/auth/ssr-logout', {
        method: 'POST',
        credentials: 'include',
      })
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

  const value: AuthContextType = {
    ...authState,
    login,
    register,
    logout,
    checkEmail,
    refreshUser,
    resendVerificationEmail,
    dismissVerificationModal,
    showVerificationModal,
    checkVerificationStatus,
  }

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
        onResendEmail={() =>
          resendVerificationEmail(authState.user?.email || '')
        }
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
