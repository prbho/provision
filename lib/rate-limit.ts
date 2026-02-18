import { NextRequest } from 'next/server'

type Bucket = {
  count: number
  resetAt: number
}

type RateLimitOptions = {
  key: string
  limit: number
  windowMs: number
}

type RateLimitResult = {
  ok: boolean
  retryAfterSeconds: number
  remaining: number
}

const globalStore = globalThis as typeof globalThis & {
  __pvRateLimitStore?: Map<string, Bucket>
  __pvRateLimitCleanupAt?: number
}

const store = globalStore.__pvRateLimitStore ?? new Map<string, Bucket>()
globalStore.__pvRateLimitStore = store
const MAX_BUCKETS = 50_000

function cleanupExpiredBuckets(now: number) {
  const nextCleanupAt = globalStore.__pvRateLimitCleanupAt ?? 0
  if (now < nextCleanupAt) return

  for (const [key, bucket] of store) {
    if (bucket.resetAt <= now) {
      store.delete(key)
    }
  }

  globalStore.__pvRateLimitCleanupAt = now + 60_000
}

function ensureCapacity() {
  if (store.size < MAX_BUCKETS) return

  let oldestKey: string | null = null
  let oldestResetAt = Number.POSITIVE_INFINITY

  for (const [key, bucket] of store) {
    if (bucket.resetAt < oldestResetAt) {
      oldestResetAt = bucket.resetAt
      oldestKey = key
    }
  }

  if (oldestKey) {
    store.delete(oldestKey)
  }
}

export function getRequestClientIp(req: NextRequest): string {
  const forwardedFor = req.headers.get('x-forwarded-for')
  if (forwardedFor) {
    const first = forwardedFor.split(',')[0]?.trim()
    if (first) return first
  }

  const realIp = req.headers.get('x-real-ip')
  if (realIp) return realIp

  return 'unknown'
}

export function enforceRateLimit(options: RateLimitOptions): RateLimitResult {
  const now = Date.now()
  cleanupExpiredBuckets(now)

  const existing = store.get(options.key)
  if (!existing || existing.resetAt <= now) {
    ensureCapacity()
    store.set(options.key, { count: 1, resetAt: now + options.windowMs })
    return {
      ok: true,
      retryAfterSeconds: Math.ceil(options.windowMs / 1000),
      remaining: options.limit - 1,
    }
  }

  if (existing.count >= options.limit) {
    return {
      ok: false,
      retryAfterSeconds: Math.max(
        1,
        Math.ceil((existing.resetAt - now) / 1000)
      ),
      remaining: 0,
    }
  }

  existing.count += 1
  store.set(options.key, existing)

  return {
    ok: true,
    retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    remaining: options.limit - existing.count,
  }
}
