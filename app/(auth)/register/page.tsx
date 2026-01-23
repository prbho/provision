// app/(auth)/register/page.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  NIGERIAN_CITIES,
  NIGERIAN_STATES,
} from '@/constants/nigerian-locations'
import { useAuth } from '@/contexts/AuthContext'
import {
  formatPhoneNumber,
  validateAgentData,
  validateEmail,
  validatePhoneNumber,
} from '@/utils/auth-validations'
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  ChevronDown,
  Eye,
  EyeOff,
  Loader2,
  Phone,
} from 'lucide-react'
import { toast } from 'sonner'

import { AgentRegistrationForm } from '@/components/auth/AgentRegistrationForm'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type RegistrationStep = 'email' | 'register' | 'agent-info'
type UserType = 'buyer' | 'seller' | 'agent' | null

export default function RegisterPage() {
  const router = useRouter()
  const {
    isAuthenticated,
    isLoading: authLoading,
    register,
    checkEmail,
  } = useAuth()

  const [step, setStep] = useState<RegistrationStep>('email')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('+234')
  const [userType, setUserType] = useState<UserType>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [showUserTypeDropdown, setShowUserTypeDropdown] = useState(false)

  // Agent-specific fields
  const [agency, setAgency] = useState('')
  const [city, setCity] = useState('')
  const [yearsExperience, setYearsExperience] = useState('0')
  const [state, setState] = useState('')
  const [specialty, setSpecialty] = useState('')
  const [isAgentFormValid, setIsAgentFormValid] = useState(false)

  // Warning states
  const [showWarningModal, setShowWarningModal] = useState(false)
  const [warningMessage, setWarningMessage] = useState('')
  const [emailCheckResult, setEmailCheckResult] = useState<any>(null)

  // Check for email in URL params (if coming from somewhere else)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const emailParam = params.get('email')
    if (emailParam) {
      setEmail(emailParam)
    }
  }, [])

  // Redirect if already authenticated - this runs first
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, authLoading, router])

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="flex items-center justify-center ">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand mx-auto" />
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // Don't render anything if authenticated (will redirect)
  if (isAuthenticated) {
    return null
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setPhone(formatted)
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    console.log('=== EMAIL CHECK START ===')
    console.log('Email to check:', email)

    if (!email) {
      toast.error('Please enter your email address')
      return
    }

    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const result = await checkEmail(email)
      console.log('Email check result:', result)

      // If email exists
      if (result.exists === true && result.user) {
        console.log('Email already exists:', result.user.email)

        if (result.user && !result.user.isActive) {
          toast.error(
            'This account has been deactivated. Please contact support.'
          )
          return
        }

        toast.error(
          'An account with this email already exists. Please sign in instead.'
        )
        router.push('/login')
        return
      }

      // If there was an error checking email
      if (result.error || result.warning) {
        console.warn(
          'Email check had warning:',
          result.message || result.warning
        )

        // Save the result and show warning modal
        setEmailCheckResult(result)
        setWarningMessage(
          result.message ||
            result.warning ||
            'Unable to verify email availability.'
        )
        setShowWarningModal(true)
        return // Stop here, wait for user decision
      }

      // Email doesn't exist or check passed - proceed
      console.log('Email available, proceeding to registration')
      setStep('register')
      toast.success('Email is available! Please complete your registration.')
    } catch (error: any) {
      console.error('Email check exception:', error)

      // If check completely fails, show warning modal
      setWarningMessage(
        'Unable to verify email availability due to a network error.'
      )
      setEmailCheckResult({ error: true })
      setShowWarningModal(true)
    } finally {
      setIsLoading(false)
      console.log('=== EMAIL CHECK END ===')
    }
  }

  const handleProceedWithWarning = () => {
    setShowWarningModal(false)
    setStep('register')
    toast.info('Proceeding with registration. Please complete your details.')
  }

  const handleTryDifferentEmail = () => {
    setShowWarningModal(false)
    setEmail('')
    // Focus on email input
    setTimeout(() => {
      const emailInput = document.getElementById('email')
      emailInput?.focus()
    }, 100)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!name || !password || !confirmPassword || !userType) {
      toast.error('Please fill in all required fields')
      return
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters long')
      return
    }

    // Validate password match
    if (password !== confirmPassword) {
      toast.error('Passwords do not match. Please re-enter your password')
      return
    }

    if (phone && !validatePhoneNumber(phone)) {
      toast.error(
        'Please enter a valid Nigerian phone number (e.g., +2348012345678)'
      )
      return
    }

    // If user type is agent, show agent info step
    if (userType === 'agent') {
      setStep('agent-info')
      toast.info('Please provide your agent information.')
      return
    }

    // For non-agents, proceed with registration
    await submitRegistration()
  }

  const submitRegistration = async () => {
    setIsLoading(true)
    setError('')

    // Show loading toast
    const loadingToast = toast.loading('Creating your account...')

    try {
      // Create FormData for registration (supports file upload)
      const formData = new FormData()
      formData.append('name', name)
      formData.append('email', email)
      formData.append('password', password)
      formData.append('userType', userType!)

      if (phone && phone !== '+234') {
        formData.append('phone', phone)
      }

      // Add avatar if selected
      if (avatarFile) {
        formData.append('avatar', avatarFile)
      }

      // Add agent data if userType is agent
      if (userType === 'agent') {
        const agentData = {
          agency: agency.trim(),
          city: city.trim(),
          yearsExperience: parseInt(yearsExperience) || 0,
          specialties: specialty ? [specialty] : [],
          languages: ['English'],
          ...(state.trim() && { state: state.trim() }),
          ...(specialty.trim() && { specialty: specialty.trim() }),
        }
        formData.append('agentData', JSON.stringify(agentData))
      }

      console.log('📤 Sending registration with FormData')
      await register(formData)

      // Dismiss loading toast and show success
      toast.dismiss(loadingToast)

      let successMessage =
        'Account created successfully! Please check your email to verify your account.'
      if (userType === 'agent') {
        successMessage =
          'Agent account created successfully! Please check your email to verify your account.'
      } else if (userType === 'seller') {
        successMessage =
          'Seller account created! Please check your email to verify your account.'
      } else if (userType === 'buyer') {
        successMessage =
          'Buyer account created! Please check your email to verify your account.'
      }

      toast.success(successMessage, {
        duration: 5000,
        icon: '🎉',
      })

      // Redirect to success page
      router.push('/success?type=registration')
    } catch (error: any) {
      // Dismiss loading toast
      toast.dismiss(loadingToast)

      // Handle specific registration errors
      let errorMessage = 'Registration failed. Please try again.'

      if (error.code === 409) {
        errorMessage =
          'An account with this email already exists. Please sign in instead.'
        router.push('/login')
      } else if (error.code === 400) {
        if (error.message?.includes('password')) {
          errorMessage = 'Password is too weak. Please use a stronger password.'
        } else if (error.message?.includes('email')) {
          errorMessage =
            'Invalid email format. Please check your email address.'
        } else if (error.message?.includes('phone')) {
          errorMessage =
            'Invalid phone number format. Please use Nigerian format (+234XXXXXXXXXX).'
        }
      } else if (error.message?.includes('license')) {
        errorMessage =
          'Invalid license number. Please check your real estate license.'
      }

      toast.error(errorMessage, {
        duration: 5000,
        icon: '❌',
      })

      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAgentInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Re-validate passwords on agent info submit as well
    if (password !== confirmPassword) {
      toast.error('Passwords do not match. Please check your passwords')
      return
    }

    // Agent-specific validation
    const agentError = validateAgentData(agency, city)
    if (agentError) {
      toast.error(agentError)
      setError(agentError)
      return
    }

    await submitRegistration()
  }

  const getUserTypeLabel = () => {
    if (!userType) return ''
    if (userType === 'buyer') return 'Buy'
    if (userType === 'seller') return 'Sell'
    if (userType === 'agent') return 'Agent'
    return 'Select your role *'
  }

  const getUserTypeDescription = () => {
    if (!userType) return 'Choose how you want to use PropertyVision'
    if (userType === 'buyer') return 'Looking to buy or rent properties'
    if (userType === 'seller') return 'Looking to sell or list properties'
    if (userType === 'agent')
      return 'Real estate professional (requires verification)'
    return 'Choose how you want to use PropertyVision'
  }

  const renderEmailStep = () => (
    <div className="bg-white py-8 px-6 shadow rounded-lg">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Register an Account
        </h2>
      </div>
      <div>
        <form onSubmit={handleEmailSubmit} className="space-y-6">
          <div>
            <Label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="mt-1 h-12"
              required
              disabled={isLoading}
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              className="w-full h-12 bg-linear-to-r from-brand to-brand/90 hover:from-brand hover:to-brand text-white py-4 text-base font-semibold rounded-xl transition-all duration-200"
              disabled={isLoading || !email}
            >
              {isLoading ? 'Checking...' : 'Continue'}
            </Button>
          </div>

          <div className="text-center pt-4 border-t">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-medium text-stone-800 hover:text-blue-800"
              >
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )

  const renderRegisterStep = () => (
    <>
      <div className="flex items-center gap-2 mb-6">
        <button
          type="button"
          onClick={() => setStep('email')}
          className="text-brand w-6 h-6 text-center justify-items-center cursor-pointer hover:text-brand rounded-full items-center bg-brand/10"
          disabled={isLoading}
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <h2 className="text-xl font-bold text-gray-900 flex-1">
          Complete Registration
        </h2>
      </div>
      <div className="bg-white py-8 px-6 shadow rounded-lg">
        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              Full Name *
            </Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="mt-1 h-12"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <Label
              htmlFor="email-display"
              className="text-sm font-medium text-gray-700"
            >
              Email Address
            </Label>
            <Input
              id="email-display"
              type="email"
              value={email}
              className="mt-1 h-12 bg-gray-50"
              disabled
            />
            <p className="text-xs text-gray-500 mt-1">
              This email will be used for your account
            </p>
          </div>

          <div>
            <Label
              htmlFor="phone"
              className="text-sm font-medium text-gray-700"
            >
              Phone Number (Optional)
            </Label>
            <div className="relative mt-1">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="+2348012345678"
                className="h-12 pl-10"
                disabled={isLoading}
                maxLength={14}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Format: +234 followed by your 10-digit number
            </p>
          </div>

          <div>
            <Label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Create Password *
            </Label>
            <div className="relative mt-1">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password (min. 8 characters)"
                className="h-12 pr-10"
                required
                minLength={8}
                disabled={isLoading}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Password must be at least 8 characters long
            </p>
          </div>

          <div>
            <Label
              htmlFor="confirmPassword"
              className="text-sm font-medium text-gray-700"
            >
              Confirm Password *
            </Label>
            <div className="relative mt-1">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                className="h-12 pr-10"
                required
                minLength={8}
                disabled={isLoading}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {password && confirmPassword && password !== confirmPassword && (
              <p className="text-xs text-red-500 mt-1">
                Passwords do not match
              </p>
            )}
            {password && confirmPassword && password === confirmPassword && (
              <p className="text-xs text-green-500 mt-1">Passwords match ✓</p>
            )}
          </div>

          {/* User Type Select Dropdown */}
          <div className="relative">
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              I am here to *
            </Label>

            {/* Custom Dropdown Trigger */}
            <button
              type="button"
              className={`w-full text-left p-3 border rounded-lg transition-all duration-200 flex items-center justify-between ${
                !userType
                  ? 'border-gray-300 bg-gray-50 text-gray-500 hover:border-gray-400 hover:bg-gray-100'
                  : 'border-brand bg-brand/5 text-gray-900'
              } ${showUserTypeDropdown ? 'border-brand ring-2 ring-brand/20' : ''}`}
              onClick={() => setShowUserTypeDropdown(!showUserTypeDropdown)}
              disabled={isLoading}
            >
              <div className="flex flex-col">
                <span className="font-medium">{getUserTypeLabel()}</span>
                <span className="text-xs text-gray-500 mt-0.5">
                  {getUserTypeDescription()}
                </span>
              </div>
              <ChevronDown
                className={`h-5 w-5 transition-transform ${showUserTypeDropdown ? 'rotate-180' : ''} ${!userType ? 'text-gray-400' : 'text-brand'}`}
              />
            </button>

            {/* Dropdown Menu */}
            {showUserTypeDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                {[
                  {
                    value: 'buyer' as UserType,
                    label: 'Buy',
                    description: 'Looking to buy or rent properties',
                    icon: '🏠',
                  },
                  {
                    value: 'seller' as UserType,
                    label: 'Sell',
                    description: 'Looking to sell or list properties',
                    icon: '💰',
                  },
                  {
                    value: 'agent' as UserType,
                    label: 'Agent',
                    description:
                      'Real estate professional (requires verification)',
                    icon: '👔',
                  },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`w-full p-4 text-left hover:bg-gray-50 transition-colors flex items-start gap-3 ${
                      userType === option.value ? 'bg-brand/5' : ''
                    }`}
                    onClick={() => {
                      setUserType(option.value)
                      setShowUserTypeDropdown(false)
                      if (option.value === 'agent') {
                        toast.info(
                          'Agent registration is subject to verification'
                        )
                      }
                    }}
                  >
                    <span className="text-xl">{option.icon}</span>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {option.label}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {option.description}
                      </div>
                    </div>
                    {userType === option.value && (
                      <div className="w-2 h-2 rounded-full bg-brand" />
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Error message if not selected when trying to submit */}
            {!userType && (
              <p className="text-xs text-red-500 mt-1">
                Please select your role to continue
              </p>
            )}
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              className="w-full h-12 bg-linear-to-r from-brand to-brand/90 hover:from-brand hover:to-brand text-white py-4 text-base font-semibold rounded-xl transition-all duration-200"
              disabled={
                isLoading ||
                !name ||
                !password ||
                !confirmPassword ||
                !userType ||
                password.length < 8 ||
                password !== confirmPassword
              }
            >
              Continue
            </Button>
          </div>
        </form>
      </div>
    </>
  )

  const renderAgentInfoStep = () => (
    <form onSubmit={handleAgentInfoSubmit} className="space-y-6">
      <div className="flex items-center mb-6 gap-2">
        <button
          type="button"
          onClick={() => setStep('register')}
          className="text-brand w-6 h-6 text-center justify-items-center cursor-pointer hover:text-brand rounded-full items-center bg-brand/10"
          disabled={isLoading}
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <h2 className="text-xl font-bold text-gray-900 flex-1">
          Agent Information
        </h2>
      </div>

      <div className="mb-4">
        <p className="text-sm text-stone-800">
          <span className="font-semibold">
            Completing agent registration for
          </span>{' '}
          {name}
        </p>
      </div>

      <div className="bg-white py-8 px-6 shadow rounded-lg">
        <AgentRegistrationForm
          agency={agency}
          setAgency={setAgency}
          city={city}
          setCity={setCity}
          yearsExperience={yearsExperience}
          setYearsExperience={setYearsExperience}
          state={state}
          setState={setState}
          specialty={specialty}
          setSpecialty={setSpecialty}
          avatarFile={avatarFile}
          setAvatarFile={setAvatarFile}
          avatarPreview={avatarPreview}
          setAvatarPreview={setAvatarPreview}
          isLoading={isLoading}
          nigerianCities={NIGERIAN_CITIES}
          nigerianStates={NIGERIAN_STATES}
          onFormValidityChange={setIsAgentFormValid}
        />

        <div className="pt-2">
          <Button
            type="submit"
            className="w-full h-12 bg-linear-to-r from-brand to-brand/90 hover:from-brand hover:to-brand text-white py-4 text-base font-semibold rounded-xl transition-all duration-200"
            disabled={isLoading || !isAgentFormValid}
          >
            {isLoading ? 'Creating Account...' : 'Create Agent Account'}
          </Button>
        </div>
      </div>
    </form>
  )

  return (
    <>
      {/* Warning Modal Dialog */}
      <AlertDialog open={showWarningModal} onOpenChange={setShowWarningModal}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-yellow-100 rounded-full">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
              <AlertDialogTitle className="text-yellow-600">
                Unable to Verify Email
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-gray-600 space-y-4">
              <div>
                <p className="font-medium">
                  We couldn&apos;t verify if this email is available:
                </p>
                <p className="text-brand font-semibold mt-1">{email}</p>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <p className="text-sm font-medium text-yellow-800 mb-2">
                  Important Information:
                </p>
                <ul className="text-sm text-yellow-700 list-disc pl-5 space-y-1">
                  <li>
                    This email <strong>might already be registered</strong>
                  </li>
                  <li>If it is, registration will fail</li>
                  <li>
                    You&apos;ll need to use &quotForgot Password&quot if you
                    can&apos;t sign in
                  </li>
                  <li>Consider trying a different email address</li>
                </ul>
              </div>

              <div className="text-sm text-gray-500">
                <p>
                  <strong>Reason:</strong> {warningMessage}
                </p>
                <p className="mt-2">
                  Service issue or network problem detected.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-3">
            <AlertDialogCancel
              onClick={handleTryDifferentEmail}
              className="w-full sm:w-auto"
            >
              Try Different Email
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleProceedWithWarning}
              className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              I Understand - Proceed Anyway
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex items-center justify-center">
        <div className="max-w-md w-full">
          {/* Email Check Status Banner (Optional - shows when warning occurred) */}
          {step === 'register' && emailCheckResult?.error && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">
                    ⚠️ Email Verification Warning
                  </p>
                  <p className="text-sm text-yellow-700 mt-1">
                    We couldn&apos;t verify if &quot;{email}&quot; is available.
                    Ensure this email isn&apos;t already registered.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Registration Card */}
          <div>
            {/* Error Message */}
            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start">
                <AlertCircle className="h-4 w-4 mr-2 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Render current step */}
            {step === 'email' && renderEmailStep()}
            {step === 'register' && renderRegisterStep()}
            {step === 'agent-info' && renderAgentInfoStep()}
          </div>

          {/* Terms and Conditions */}
          <p className="text-xs text-gray-500 text-center mt-6">
            By creating an account, you agree to our{' '}
            <Link href="/terms" className="text-brand hover:text-brand">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-brand hover:text-brand">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}
