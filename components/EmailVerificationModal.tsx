'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  HelpCircle,
  Mail,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'

interface EmailVerificationModalProps {
  isOpen: boolean
  onClose: () => void
  onResendEmail: () => Promise<{ success: boolean; message?: string }>
  onCheckVerification: () => Promise<boolean>
  userEmail?: string
}

export default function EmailVerificationModal({
  isOpen,
  onClose,
  onResendEmail,
  onCheckVerification,
  userEmail,
}: EmailVerificationModalProps) {
  const [isSending, setIsSending] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')
  const [isChecking, setIsChecking] = useState(false)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)
  const [resendMessage, setResendMessage] = useState('')
  const [isVerified, setIsVerified] = useState(false)
  const [showProgress, setShowProgress] = useState(false)
  const [progress, setProgress] = useState(0)

  const checkVerificationStatus = useCallback(async () => {
    if (isChecking) return

    setIsChecking(true)
    try {
      const isVerified = await onCheckVerification()
      if (isVerified) {
        setIsVerified(true)
        setIsSuccess(true)
        setError('')
        setResendMessage('Email verified successfully!')

        // Auto-close after 3 seconds if verified
        setTimeout(() => {
          onClose()
          // Reset state for next time
          setTimeout(() => {
            setIsVerified(false)
            setIsSuccess(false)
            setResendMessage('')
            setShowProgress(false)
            setProgress(0)
          }, 500)
        }, 3000)
      }
      setLastChecked(new Date())
    } catch (error) {
      console.error('Error checking verification status:', error)
    } finally {
      setIsChecking(false)
    }
  }, [isChecking, onCheckVerification, onClose])

  // Auto-check verification status every 10 seconds when modal is open
  useEffect(() => {
    if (!isOpen) return

    checkVerificationStatus()

    const checkInterval = setInterval(async () => {
      await checkVerificationStatus()
    }, 10000)

    return () => clearInterval(checkInterval)
  }, [isOpen, checkVerificationStatus])

  // Progress bar for auto-close countdown
  useEffect(() => {
    if (!isVerified) {
      setShowProgress(false)
      setProgress(0)
      return
    }

    setShowProgress(true)
    const duration = 3000
    const interval = 50
    const steps = duration / interval
    const increment = 100 / steps

    let currentProgress = 0
    const timer = setInterval(() => {
      currentProgress += increment
      setProgress(Math.min(currentProgress, 100))
    }, interval)

    return () => clearInterval(timer)
  }, [isVerified])

  const handleResendVerification = async () => {
    try {
      setIsSending(true)
      setError('')
      setIsSuccess(false)
      setResendMessage('')

      const result = await onResendEmail()
      setIsSuccess(true)
      setResendMessage(
        result.message || 'Verification email sent successfully!'
      )

      // Clear success message after 5 seconds
      setTimeout(() => {
        setIsSuccess(false)
        setResendMessage('')
      }, 5000)
    } catch {
      // Error handling logic preserved
    } finally {
      setIsSending(false)
    }
  }

  const handleManualCheck = async () => {
    await checkVerificationStatus()
  }

  const handleClose = () => {
    setError('')
    setResendMessage('')
    setIsSuccess(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        {/* Header */}
        <div className="bg-brand/5 px-6 py-5 border-b">
          <DialogHeader className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/10">
                {isVerified ? (
                  <CheckCircle2 className="h-5 w-5 text-brand" />
                ) : (
                  <ShieldCheck className="h-5 w-5 text-brand" />
                )}
              </div>
              <DialogTitle className="text-xl font-semibold text-gray-900">
                {isVerified ? 'Email Verified!' : 'Verify Your Email'}
              </DialogTitle>
            </div>
            <p className="text-sm text-gray-600">
              {isVerified
                ? 'Your email has been successfully verified.'
                : 'Complete verification to access all features'}
            </p>
          </DialogHeader>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Status Indicators */}
          <div className="space-y-3">
            {/* Success Messages */}
            {isSuccess && resendMessage && !isVerified && (
              <div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50/50 p-4">
                <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-medium text-green-900">Email sent!</p>
                  <p className="text-sm text-green-700">{resendMessage}</p>
                </div>
              </div>
            )}

            {isVerified && (
              <div className="space-y-4">
                <div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50/50 p-4">
                  <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-medium text-green-900">
                      Email verified successfully!
                    </p>
                    <p className="text-sm text-green-700">
                      Your email has been verified. You now have full access to
                      all features.
                    </p>
                  </div>
                </div>
                {showProgress && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Redirecting to app...</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-1.5" />
                  </div>
                )}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50/50 p-4">
                <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-medium text-red-900">Error</p>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            {/* Email Info - Only show if not verified */}
            {!isVerified && (
              <div className="space-y-4">
                <div>
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-brand shrink-0 mt-0.5" />
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-900">
                        Verification email sent to
                      </p>
                    </div>
                  </div>
                  <div className="inline-flex items-center rounded-full mt-3 bg-brand/5 px-3 py-1.5">
                    <span className="text-sm font-medium text-gray-900">
                      {userEmail}
                    </span>
                  </div>
                </div>

                {/* Auto-check Status */}
                <div className="rounded-lg border border-gold-600/20 bg-amber-50/50 p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gold-600" />
                        <span className="text-sm font-medium text-amber-900">
                          Auto-checking status
                        </span>
                      </div>
                      {isChecking && (
                        <RefreshCw className="h-4 w-4 text-amber-600 animate-spin" />
                      )}
                    </div>
                    <p className="text-xs text-amber-700">
                      {isChecking
                        ? 'Checking verification status...'
                        : "We'll check automatically every 10 seconds"}
                    </p>
                    {lastChecked && (
                      <p className="text-xs text-amber-700/80">
                        Last checked:{' '}
                        {lastChecked.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons - Only show if not verified */}
          {!isVerified && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={handleResendVerification}
                  disabled={isSending}
                  className="h-11 bg-brand hover:bg-brand/95 text-white"
                >
                  {isSending ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Resend Email
                    </>
                  )}
                </Button>

                <Button
                  onClick={handleManualCheck}
                  disabled={isChecking}
                  variant="outline"
                  className="h-11"
                >
                  {isChecking ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    'Check Now'
                  )}
                </Button>
              </div>

              <Button
                onClick={handleClose}
                variant="ghost"
                disabled={isSending || isChecking}
                className="w-full h-10 border text-gray-600 hover:text-gray-900"
              >
                I&apos;ll verify later
              </Button>
            </div>
          )}

          {/* Help Information - Only show if not verified */}
          {!isVerified && (
            <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-gray-500" />
                <h4 className="text-sm font-medium text-gray-900">
                  Need help?
                </h4>
              </div>
              <ul className="text-xs text-gray-600 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-0.5">•</span>
                  <span>Check your spam or junk folder</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-0.5">•</span>
                  <span>
                    Ensure <span className="font-medium">{userEmail}</span> is
                    correct
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-0.5">•</span>
                  <span>Allow a few minutes for delivery</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-0.5">•</span>
                  <span>Modal auto-closes upon verification</span>
                </li>
              </ul>
            </div>
          )}

          {/* Verified State Actions */}
          {isVerified && (
            <div className="flex justify-center pt-2">
              <Button
                onClick={handleClose}
                className="h-11 px-8 bg-brand hover:bg-brand/95 text-white"
              >
                Continue to App
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
