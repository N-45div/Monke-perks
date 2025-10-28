import { prisma } from '@/lib/prisma'
import type { Deal, Merchant } from '@/generated/prisma/client'

export type DealWithMerchant = Deal & { merchant: Merchant }

export async function getFeaturedDeals(limit = 6): Promise<DealWithMerchant[]> {
  return prisma.deal.findMany({
    where: {
      status: 'ACTIVE',
    },
    include: {
      merchant: true,
    },
    orderBy: [
      {
        updatedAt: 'desc',
      },
    ],
    take: limit,
  })
}
