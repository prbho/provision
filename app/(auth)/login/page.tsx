// app/login/page.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react'
import { toast, Toaster } from 'sonner'

import { ToastHandler } from '@/components/toast-handler'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  const router = useRouter()
  const { login, isAuthenticated, isLoading: authLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const searchParams = useSearchParams()

  useEffect(() => {
    const verified = searchParams.get('verified') === 'true'
    const verificationError = searchParams.get('verification_error') === 'true'

    if (verified) {
      toast.success('Email verified successfully! You can now login.')
    }

    if (verificationError) {
      toast.error(
        'Email verification failed. Please try again or request a new verification link.'
      )
    }
  }, [searchParams])

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, authLoading, router])

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="flex items-center justify-center">
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!email || !password) {
      setError('Please fill in all required fields')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      await login({ email, password })
      toast.success('Login successful! Redirecting...')
      // Short delay to show success message
      setTimeout(() => {
        router.push('/dashboard')
      }, 1000)
    } catch (err: any) {
      let errorMessage = 'Invalid email or password. Please try again.'

      if (err.message?.includes('inactive')) {
        errorMessage = 'Your account is deactivated. Please contact support.'
      } else if (err.message?.includes('verified')) {
        errorMessage = 'Please verify your email before logging in.'
      } else if (err.message?.includes('rate limit')) {
        errorMessage = 'Too many login attempts. Please try again later.'
      }

      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center p-4 mx-auto">
      <div className="bg-white py-8 px-6 shadow rounded-lg w-full sm:w-96 max-w-md">
        <Toaster position="top-right" expand={false} richColors closeButton />
        <ToastHandler />
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="text-xl font-bold text-gray-900 mb-1">
            Sign in to PropertyVision
          </h2>
          <p className="text-sm text-gray-500">
            Secure access to your PropertyVision dashboard
          </p>
        </div>

        <div className="mt-8">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start">
              <AlertCircle className="h-5 w-5 mr-3 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <Label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address *
              </Label>
              <div className="mt-1">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="h-12 text-base"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password *
                </Label>
                <Link
                  href="/forget-password"
                  className="text-sm font-medium text-stone-500 hover:text-blue-800 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="mt-1 relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your PropertyVision password"
                  className="h-12 text-base pr-10"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-brand focus:ring-brand border-gray-300 rounded"
                disabled={isLoading}
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-700"
              >
                Remember me
              </label>
            </div>

            {/* Submit Button */}
            <div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 text-base font-semibold bg-linear-to-r from-brand to-brand hover:from-brand hover:to-brand text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </Button>
              <p className="text-xs mt-3 text-gray-500 text-center">
                By signing in, you agree to our{' '}
                <Link href="/terms" className="underline hover:text-gray-700">
                  Terms
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="underline hover:text-gray-700">
                  Privacy Policy
                </Link>
                .
              </p>

              <p className="mt-4 text-xs text-gray-500 text-center">
                This is a secure login for PropertyVision. We never ask for
                sensitive information outside this platform.
              </p>
            </div>
          </form>

          {/* Sign Up Link */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-center text-sm text-gray-600">
              Don&apos;t have an account?{' '}
              <Link
                href="/register"
                className="font-semibold text-stone-800 hover:text-blue-800 transition-colors"
              >
                Register an account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
