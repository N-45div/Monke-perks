import { NextResponse } from 'next/server'
import { getDropLeaderboard } from '@/services/drop-rush/service'
import { getCache, setCache } from '@/lib/redis'

export async function GET() {
  const cacheKey = 'drop:leaderboard'
  const cached = await getCache<{ leaderboard: unknown[] }>(cacheKey)
  if (cached) {
    return NextResponse.json(cached)
  }

  const leaders = await getDropLeaderboard()

  const payload = {
    leaderboard: leaders.map((entry) => ({
      wallet: entry.wallet,
      streak: entry.streak,
      user: entry.user
        ? {
            id: entry.user.id,
            walletAddress: entry.user.walletAddress,
            username: entry.user.username,
            avatarUrl: entry.user.avatarUrl,
          }
        : null,
    })),
  }

  await setCache(cacheKey, payload, 30)

  return NextResponse.json(payload)
}
