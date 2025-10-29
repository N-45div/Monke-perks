#!/usr/bin/env tsx
import 'dotenv/config'
import { addHours } from 'date-fns'
import { prisma } from '@/lib/prisma'
import { slugify } from '@/lib/slug'
import { deleteCache } from '@/lib/redis'

async function ensureDemoDeal() {
  // Create a lightweight demo merchant + deal if DB is empty
  const existingDeal = await prisma.deal.findFirst({ where: { status: 'ACTIVE' } })
  if (existingDeal) return existingDeal

  const merchant = await prisma.merchant.upsert({
    where: { slug: 'monkedaocoffee' },
    update: {},
    create: {
      name: 'MonkeDAO Coffee Lab',
      slug: 'monkedaocoffee',
      logoUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085',
      categories: ['food', 'lifestyle'],
      description: 'DAO-owned cafe that doubles as Solana meetup HQ.',
      verified: false,
    },
  })

  const slug = slugify('MonkeDAO Espresso Protocol')
  const deal = await prisma.deal.upsert({
    where: { slug },
    update: {},
    create: {
      merchantId: merchant.id,
      title: 'Lifetime Espresso Protocol Pass',
      slug,
      summary: 'Unlimited single-origin espresso shots + DAO governance badge.',
      description:
        'Own an NFT that unlocks lifetime espresso at MonkeDAO Coffee Lab, monthly member tastings, and on-chain governance over seasonal roasts.',
      heroImageUrl: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e',
      discountType: 'FLAT',
      discountValue: 25,
      originalPrice: 0,
      currency: 'USD',
      tags: ['coffee', 'lifestyle'],
      categories: ['food', 'lifestyle'],
      location: 'Lisbon, Portugal',
      supplyCap: 250,
      perWalletLimit: 1,
      startsAt: new Date(),
      expiresAt: addHours(new Date(), 24 * 180),
      status: 'ACTIVE',
      redemptionNotes: 'Tap wallet at register. Barista verifies NFT ownership on Solana.',
    },
  })

  return deal
}

function parseArgs() {
  // Usage: tsx scripts/create-demo-drop.ts [deal-slug] [--supply=1000] [--hours=4]
  const args = process.argv.slice(2)
  let dealSlug: string | undefined
  let supply = 1000
  let hours = 4

  for (const a of args) {
    if (a.startsWith('--supply=')) supply = Math.max(1, parseInt(a.split('=')[1] || '1000', 10))
    else if (a.startsWith('--hours=')) hours = Math.max(1, parseInt(a.split('=')[1] || '4', 10))
    else if (!dealSlug) dealSlug = a
  }

  return { dealSlug, supply, hours }
}

async function main() {
  const { dealSlug, supply, hours } = parseArgs()

  let deal = null as null | Awaited<ReturnType<typeof ensureDemoDeal>>
  if (dealSlug) {
    deal = await prisma.deal.findUnique({ where: { slug: dealSlug } })
    if (!deal) {
      console.log(`[drop:create] Deal not found for slug=${dealSlug}, creating demo deal instead`)
      deal = await ensureDemoDeal()
    }
  } else {
    deal = await ensureDemoDeal()
  }

  const startAt = new Date(Date.now() - 60 * 1000)
  const endAt = addHours(new Date(), hours)

  const drop = await prisma.dailyDrop.create({
    data: {
      dealId: deal.id,
      title: `${deal.title} – Today’s Drop`,
      description: deal.summary,
      startAt,
      endAt,
      supplyAllocation: supply,
      streakMultiplier: 1,
      status: 'SCHEDULED',
    },
  })

  await deleteCache('drop:today')
  await deleteCache('drop:leaderboard')

  console.log('[drop:create] created drop', {
    id: drop.id,
    deal: { id: deal.id, slug: deal.slug, title: deal.title },
    startAt,
    endAt,
    supply,
    status: drop.status,
  })
}

main().catch((error) => {
  console.error('[drop:create] failed', error)
  process.exit(1)
})
