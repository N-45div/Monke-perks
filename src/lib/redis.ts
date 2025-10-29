import Redis from 'ioredis'

let client: Redis | null = null

function createClient(): Redis | null {
  const url = process.env.REDIS_URL
  if (!url) return null
  if (client) return client
  client = new Redis(url, {
    maxRetriesPerRequest: 1,
    enableAutoPipelining: true,
  })
  client.on('error', (error) => {
    console.error('Redis error', error)
  })
  return client
}

export function getRedis(): Redis | null {
  return client ?? createClient()
}

export async function getCache<T>(key: string): Promise<T | null> {
  const redis = getRedis()
  if (!redis) return null
  try {
    const value = await redis.get(key)
    if (!value) return null
    return JSON.parse(value) as T
  } catch (error) {
    console.error('Redis get error', { key, error })
    return null
  }
}

export async function setCache<T>(key: string, value: T, ttlSeconds = 30): Promise<void> {
  const redis = getRedis()
  if (!redis) return
  try {
    await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds)
  } catch (error) {
    console.error('Redis set error', { key, error })
  }
}

export async function deleteCache(key: string): Promise<void> {
  const redis = getRedis()
  if (!redis) return
  try {
    await redis.del(key)
  } catch (error) {
    console.error('Redis delete error', { key, error })
  }
}
