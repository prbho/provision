// lib/ssr-auth.ts
import { account } from '@/lib/appwrite'

export async function ensurePvJwtCookie(): Promise<boolean> {
  try {
    // Create JWT from the CURRENT logged-in session (no password needed)
    const jwtRes = await account.createJWT()
    if (!jwtRes?.jwt) return false

    // Store it as httpOnly cookie on your Next.js domain
    const res = await fetch('/api/auth/ssr-jwt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ jwt: jwtRes.jwt }),
    })

    return res.ok
  } catch {
    return false
  }
}
