import { Agent } from '@/types'

import { databases } from '@/lib/appwrite-server'

export async function getAgent(id: string): Promise<Agent | null> {
  try {
    if (!id || typeof id !== 'string' || id.trim().length === 0) {
      console.error('Invalid agent ID:', id)
      return null
    }

    const agent = await databases.getDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_AGENTS_TABLE_ID!,
      id.trim()
    )

    return agent as unknown as Agent
  } catch (error) {
    console.error('Error fetching agent:', error)
    return null
  }
}
