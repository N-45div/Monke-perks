import { NextResponse } from 'next/server'
import { getActiveDrop } from '@/services/drop-rush/service'
import type { Deal } from '@/generated/prisma/client'
import { getCache, setCache } from '@/lib/redis'

function serializeDeal(deal: Deal) {
  return {
    id: deal.id,
    title: deal.title,
    slug: deal.slug,
    summary: deal.summary,
    description: deal.description,
    heroImageUrl: deal.heroImageUrl,
    discountType: deal.discountType,
    discountValue: deal.discountValue ? Number(deal.discountValue) : null,
    originalPrice: deal.originalPrice ? Number(deal.originalPrice) : null,
    currency: deal.currency,
    tags: deal.tags,
    categories: deal.categories,
  }
}

export async function GET() {
  const cacheKey = 'drop:today'
  const cached = await getCache<{ drop: unknown | null }>(cacheKey)
  if (cached) {
    return NextResponse.json(cached)
  }

  const drop = await getActiveDrop()

  if (!drop) {
    const payload = { drop: null }
    await setCache(cacheKey, payload, 15)
    return NextResponse.json(payload, { status: 200 })
  }

  const payload = {
    drop: {
      id: drop.id,
      dealId: drop.dealId,
      title: drop.title,
      description: drop.description,
      startAt: drop.startAt,
      endAt: drop.endAt,
      supplyAllocation: drop.supplyAllocation,
      streakMultiplier: drop.streakMultiplier,
      status: drop.status,
      deal: serializeDeal(drop.deal),
    },
  }

  await setCache(cacheKey, payload, 15)

  return NextResponse.json(payload)
}
