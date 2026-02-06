/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies } from 'next/headers'
import { Account, Client } from 'node-appwrite'

function env(key: string) {
  return process.env[key] || ''
}

function getEndpoint() {
  return env('APPWRITE_ENDPOINT') || env('NEXT_PUBLIC_APPWRITE_ENDPOINT')
}

function getProjectId() {
  return env('APPWRITE_PROJECT_ID') || env('NEXT_PUBLIC_APPWRITE_PROJECT_ID')
}

function getSessionCookieName(projectId: string) {
  // Appwrite SSR cookie format
  return `a_session_${projectId.toLowerCase()}`
}

/**
 * Returns an authenticated Account client using the Appwrite session cookie (SSR).
 * If no cookie, returns null.
 */
export async function createSessionAccount(): Promise<Account | null> {
  const endpoint = getEndpoint()
  const projectId = getProjectId()

  if (!endpoint || !projectId) {
    console.error('❌ Missing Appwrite env vars for SSR:', {
      endpoint: !!endpoint,
      projectId: !!projectId,
    })
    return null
  }

  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get(getSessionCookieName(projectId))

  if (!sessionCookie?.value) {
    return null
  }

  const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId)
    // ✅ This is the critical part:
    .setSession(sessionCookie.value)

  return new Account(client)
}

/**
 * Gets current user based on Appwrite session cookie. Returns null if not logged in.
 */
export async function getServerCurrentUser() {
  const account = await createSessionAccount()
  if (!account) return null

  try {
    return await account.get() // { $id, email, name, ... }
  } catch (e: any) {
    console.error('❌ getServerCurrentUser failed:', e?.message || e)
    return null
  }
}
