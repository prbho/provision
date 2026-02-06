/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies } from 'next/headers'
import { Account, Client, Databases, Storage } from 'node-appwrite'

const SESSION_COOKIE_NAME = 'pv_session'

function getConfig() {
  const endpoint =
    process.env.APPWRITE_ENDPOINT || process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT
  const projectId =
    process.env.APPWRITE_PROJECT_ID ||
    process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID

  if (!endpoint) throw new Error('Missing APPWRITE_ENDPOINT')
  if (!projectId) throw new Error('Missing APPWRITE_PROJECT_ID')

  return { endpoint, projectId }
}

export async function createSessionClient() {
  const { endpoint, projectId } = getConfig()

  const cookieStore = await cookies()
  const secret = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (!secret) return null

  const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setSession(secret)

  return {
    client,
    account: new Account(client),
    databases: new Databases(client),
    storage: new Storage(client),
  }
}

export async function getServerCurrentUser() {
  const session = await createSessionClient()
  if (!session) return null

  try {
    return await session.account.get()
  } catch {
    return null
  }
}

export async function requireServerUser() {
  return await getServerCurrentUser() // returns null if not logged in
}
