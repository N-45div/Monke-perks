import { test } from 'node:test'
import assert from 'node:assert/strict'
import { Prisma } from '@/generated/prisma/client'
import type { DealWithMerchant } from '@/repositories/deal-repository'
import { mapDealsToFeaturedDrops } from '@/features/landing/landing-transform'

const decimal = (value: number) => new Prisma.Decimal(value)

const baseDeal: DealWithMerchant = {
  id: 'deal-1',
  merchantId: 'merchant-1',
  title: 'VIP Arcade Night',
  slug: 'vip-arcade-night',
  summary: 'DAO-only arcade takeover',
  description: 'Exclusive arcade night for MonkeDAO members.',
  heroImageUrl: null,
  galleryImages: [],
  discountType: 'PERCENTAGE',
  discountValue: decimal(25),
  originalPrice: decimal(100),
  currency: 'USD',
  tags: ['arcade'],
  categories: ['experiences'],
  location: 'Lisbon',
  supplyCap: 100,
  perWalletLimit: 1,
  startsAt: new Date(),
  expiresAt: new Date(),
  status: 'ACTIVE',
  redemptionNotes: null,
  termsUrl: null,
  externalUrl: null,
  socialShareText: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  merchant: {
    id: 'merchant-1',
    name: 'Monke Arcade',
    slug: 'monke-arcade',
    logoUrl: null,
    coverImageUrl: null,
    websiteUrl: null,
    contactEmail: null,
    description: null,
    categories: ['experiences'],
    verified: false,
    socialLinks: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
}

test('maps a deal to featured drop metadata', () => {
  const drops = mapDealsToFeaturedDrops([baseDeal])
  assert.equal(drops.length, 1)
  assert.equal(drops[0].brand, 'Monke Arcade')
  assert.equal(drops[0].title, 'VIP Arcade Night')
  assert.equal(drops[0].badge, 'EXPERIENCES')
  assert.ok(drops[0].stats.some((stat) => stat.label === 'Discount'))
})

test('limits to six drops and cycles gradients', () => {
  const deals = Array.from({ length: 8 }, (_, index) => ({
    ...baseDeal,
    id: `deal-${index}`,
    slug: `deal-${index}`,
    title: `Deal ${index}`,
    merchant: {
      ...baseDeal.merchant,
      id: `merchant-${index}`,
      name: `Merchant ${index}`,
      slug: `merchant-${index}`,
    },
  }))

  const drops = mapDealsToFeaturedDrops(deals)
  assert.equal(drops.length, 6)
  assert.ok(new Set(drops.map((drop) => drop.gradient)).size > 1)
})
