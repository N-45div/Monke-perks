import { addDays, formatISO } from 'date-fns'
import { prisma } from '@/lib/prisma'
import { slugify } from '@/lib/slug'
import { BookingHotelOffer, BookingHotelResult } from './types'
import { searchDestinations, searchHotelsByDestination } from './client'

const DEFAULT_DESTINATIONS = ['Tokyo', 'Lisbon', 'New York']

function buildDealSummary(hotel: BookingHotelResult): string {
  const highlights = hotel.property_highlight_strip?.map((item) => item.text).filter(Boolean) ?? []
  const base = hotel.property_description ?? highlights.slice(0, 3).join(' • ')
  return base || 'Exclusive hotel offer curated by MonkePerks.'
}

function buildDealDescription(hotel: BookingHotelResult): string {
  const details = [hotel.address, hotel.city, hotel.country_trans].filter(Boolean).join(', ')
  return `${hotel.property_description ?? hotel.unit_configuration_label ?? 'Premium stay powered by MonkePerks.'}\n\nLocation: ${details}`
}

function extractDiscount(hotel: BookingHotelResult) {
  const price = hotel.composite_price_breakdown
  const original = price?.strikethrough_amount?.value
  const discounted = price?.gross_amount?.value
  if (!original || !discounted || original <= discounted) {
    return { type: 'FLAT' as const, value: price?.discount_amount?.value ?? 0 }
  }
  const percent = Math.round(((original - discounted) / original) * 100)
  return { type: 'PERCENTAGE' as const, value: percent }
}

async function upsertMerchant(label: string, logo?: string) {
  const slug = slugify(label)
  return prisma.merchant.upsert({
    where: { slug },
    update: {
      name: label,
      logoUrl: logo,
    },
    create: {
      name: label,
      slug,
      logoUrl: logo,
      categories: ['travel'],
      verified: false,
    },
  })
}

async function upsertDeal(offer: BookingHotelOffer, merchantId: string) {
  const { result, destination } = offer
  const slug = slugify(`${result.hotel_name}-${destination.dest_id}`)
  const discount = extractDiscount(result)
  const price = result.composite_price_breakdown?.gross_amount?.value ?? undefined
  const externalUrl = result.url

  return prisma.deal.upsert({
    where: { slug },
    update: {
      merchantId,
      title: result.hotel_name,
      summary: buildDealSummary(result),
      description: buildDealDescription(result),
      heroImageUrl: result.main_photo_url,
      discountType: discount.type,
      discountValue: discount.value,
      originalPrice: price,
      currency: result.composite_price_breakdown?.gross_amount?.currency ?? 'USD',
      tags: ['hotel', 'travel'],
      categories: ['travel'],
      location: [result.city, result.country_trans].filter(Boolean).join(', '),
      redemptionNotes: 'Present MonkePerks NFT at check-in. Merchant verifies on-chain ownership.',
      termsUrl: externalUrl ?? undefined,
      externalUrl,
      status: 'ACTIVE',
    },
    create: {
      merchantId,
      title: result.hotel_name,
      slug,
      summary: buildDealSummary(result),
      description: buildDealDescription(result),
      heroImageUrl: result.main_photo_url,
      discountType: discount.type,
      discountValue: discount.value,
      originalPrice: price,
      currency: result.composite_price_breakdown?.gross_amount?.currency ?? 'USD',
      tags: ['hotel', 'travel'],
      categories: ['travel'],
      location: [result.city, result.country_trans].filter(Boolean).join(', '),
      supplyCap: 500,
      perWalletLimit: 1,
      startsAt: new Date(),
      expiresAt: addDays(new Date(), 30),
      status: 'ACTIVE',
      redemptionNotes: 'Present MonkePerks NFT at check-in. Merchant verifies on-chain ownership.',
      termsUrl: externalUrl ?? undefined,
      externalUrl,
    },
  })
}

export async function ingestBookingDeals(destinations = DEFAULT_DESTINATIONS) {
  const checkin = formatISO(addDays(new Date(), 30), { representation: 'date' })
  const checkout = formatISO(addDays(new Date(), 33), { representation: 'date' })

  for (const query of destinations) {
    const destCandidates = await searchDestinations(query)
    const destination = destCandidates[0]
    if (!destination) continue

    const offers = await searchHotelsByDestination(destination.dest_id, checkin, checkout)

    for (const offer of offers.slice(0, 3)) {
      const merchant = await upsertMerchant(offer.result.hotel_name, offer.result.main_photo_url)
      await upsertDeal(offer, merchant.id)
    }
  }
}
