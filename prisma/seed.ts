import 'dotenv/config'
import { prisma } from '@/lib/prisma'
import { ingestBookingDeals } from '@/services/external/booking/ingest'
import { slugify } from '@/lib/slug'

async function ensureDemoMerchant() {
  const slug = 'monke-dao-coffee'
  return prisma.merchant.upsert({
    where: { slug },
    update: {},
    create: {
      name: 'MonkeDAO Coffee Lab',
      slug,
      logoUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085',
      categories: ['food', 'lifestyle'],
      description: 'DAO-owned cafe that doubles as Solana meetup HQ.',
    },
  })
}

async function seedDemoDeals(merchantId: string) {
  const slug = slugify('MonkeDAO Espresso Protocol')
  await prisma.deal.upsert({
    where: { slug },
    update: {},
    create: {
      merchantId,
      title: 'Lifetime Espresso Protocol Pass',
      slug,
      summary: 'Unlimited single-origin espresso shots + DAO governance badge.',
      description:
        'Own an NFT that unlocks lifetime espresso at MonkeDAO Coffee Lab, monthly member tastings, and on-chain governance over seasonal roasts.',
      heroImageUrl: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e',
      discountType: 'FLAT',
      discountValue: 25,
      originalPrice: 99,
      currency: 'USD',
      tags: ['coffee', 'lifestyle'],
      categories: ['food', 'lifestyle'],
      location: 'Lisbon, Portugal',
      supplyCap: 250,
      perWalletLimit: 1,
      startsAt: new Date(),
      expiresAt: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      status: 'ACTIVE',
      redemptionNotes: 'Tap wallet at register. Barista verifies NFT ownership on Solana.',
    },
  })
}

async function main() {
  const merchant = await ensureDemoMerchant()
  await seedDemoDeals(merchant.id)
  await ingestBookingDeals(['Lisbon', 'Tokyo'])
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error('Seed failed', error)
    await prisma.$disconnect()
    process.exit(1)
  })
