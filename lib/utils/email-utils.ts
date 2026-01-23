// app/utils/email-utils.ts

export const validateEmailAddress = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const formatFromAddress = (name: string, email: string): string => {
  return `${name} <${email}>`
}

export const getEnvEmailConfig = () => {
  return {
    fromEmail: process.env.RESEND_FROM_EMAIL || 'noreply@example.com',
    fromName: process.env.RESEND_FROM_NAME || 'Your App Name',
    apiKey: process.env.RESEND_API_KEY,
  }
}
