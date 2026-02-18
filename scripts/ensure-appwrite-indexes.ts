import { Client, Databases, IndexType } from 'node-appwrite'

const endpoint =
  process.env.APPWRITE_ENDPOINT || process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT
const projectId =
  process.env.APPWRITE_PROJECT_ID || process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID
const apiKey = process.env.APPWRITE_API_KEY
const databaseId =
  process.env.APPWRITE_DATABASE_ID ||
  process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID

const purchasesCollectionId =
  process.env.APPWRITE_PURCHASES_COLLECTION_ID ||
  process.env.NEXT_PUBLIC_APPWRITE_PURCHASES_TABLE_ID ||
  'purchases'
const messagesCollectionId =
  process.env.APPWRITE_MESSAGES_COLLECTION_ID || 'messages'

if (!endpoint || !projectId || !apiKey || !databaseId) {
  console.error(
    'Missing envs: APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID, APPWRITE_API_KEY, APPWRITE_DATABASE_ID'
  )
  process.exit(1)
}

const dbId: string = databaseId

const client = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId)
  .setKey(apiKey)

const databases = new Databases(client)

async function ensureIndex(
  collectionId: string,
  key: string,
  attributes: string[],
  orders: ('ASC' | 'DESC')[] = []
) {
  try {
    await databases.createIndex(
      dbId,
      collectionId,
      key,
      IndexType.Key,
      attributes,
      orders
    )
    console.log(`Created index: ${collectionId}.${key}`)
  } catch (error: unknown) {
    const appwriteError = error as { code?: number; message?: string }
    const msg = String(appwriteError?.message || '')
    if (
      appwriteError?.code === 409 ||
      msg.toLowerCase().includes('already exists') ||
      msg.toLowerCase().includes('duplicate')
    ) {
      console.log(`Index already exists: ${collectionId}.${key}`)
      return
    }
    throw error
  }
}

async function main() {
  await ensureIndex(
    purchasesCollectionId,
    'idx_purchases_buyer_created_desc',
    ['buyerId', '$createdAt'],
    ['ASC', 'DESC']
  )
  await ensureIndex(
    purchasesCollectionId,
    'idx_purchases_buyer_status_created_desc',
    ['buyerId', 'status', '$createdAt'],
    ['ASC', 'ASC', 'DESC']
  )
  await ensureIndex(
    messagesCollectionId,
    'idx_messages_from_to_sentAt',
    ['fromUserId', 'toUserId', 'sentAt'],
    ['ASC', 'ASC', 'ASC']
  )
  await ensureIndex(
    messagesCollectionId,
    'idx_messages_to_from_sentAt',
    ['toUserId', 'fromUserId', 'sentAt'],
    ['ASC', 'ASC', 'ASC']
  )
  await ensureIndex(
    messagesCollectionId,
    'idx_messages_property_sentAt',
    ['propertyId', 'sentAt'],
    ['ASC', 'ASC']
  )
}

main()
  .then(() => {
    console.log('Index bootstrap completed')
  })
  .catch((error) => {
    console.error('Index bootstrap failed:', error?.message || error)
    process.exit(1)
  })
