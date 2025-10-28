import type { DealWithMerchant } from '@/repositories/deal-repository'
import type { FeaturedDrop } from './landing-page'

const GRADIENTS = [
  'from-[#FF8A8A] via-[#FF6F1E] to-[#4E18C1]',
  'from-[#27C4F7] via-[#9B5DE5] to-[#F15BB5]',
  'from-[#5BFF89] via-[#FFD23F] to-[#FF7C7C]',
  'from-[#845EC2] via-[#FF6F91] to-[#FFC75F]',
]

function formatDiscount(type: string, value?: number | null) {
  if (!value || value <= 0) return 'Exclusive access'
  if (type === 'PERCENTAGE') return `${Math.round(value)}% off`
  if (type === 'FLAT') return `$${value.toFixed(2)} savings`
  return 'Dynamic perks'
}

function formatPrice(value?: number | null, currency = 'USD') {
  if (!value || value <= 0) return 'Call to unlock'
  return `${currency} ${value.toFixed(0)}`
}

export function mapDealsToFeaturedDrops(deals: DealWithMerchant[]): FeaturedDrop[] {
  return deals.slice(0, 6).map((deal, index) => {
    const gradient = GRADIENTS[index % GRADIENTS.length]
    const discountValue = deal.discountValue ? Number(deal.discountValue) : undefined
    const originalPrice = deal.originalPrice ? Number(deal.originalPrice) : undefined

    return {
      id: deal.id,
      badge: deal.categories[0]?.toUpperCase() ?? 'Exclusive drop',
      brand: deal.merchant.name,
      title: deal.title,
      gradient,
      stats: [
        { label: 'Discount', value: formatDiscount(deal.discountType, discountValue) },
        { label: 'Price', value: formatPrice(originalPrice, deal.currency) },
        { label: 'Supply', value: deal.supplyCap ? `${deal.supplyCap} NFTs` : 'Dynamic' },
      ],
    }
  })
}
