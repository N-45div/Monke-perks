import { Connection, PublicKey } from '@solana/web3.js'
import { findReference, FindReferenceError } from '@solana/pay'
import { prisma } from '@/lib/prisma'
import { deleteCache } from '@/lib/redis'
import { optionalEnv } from '@/lib/utils'

const DEFAULT_RPC_URL = 'https://api.devnet.solana.com'
const BATCH_LIMIT = Number(optionalEnv('DROP_CLAIM_CONFIRM_BATCH') ?? 25)

function createConnection() {
  const endpoint = optionalEnv('SOLANA_RPC_URL') ?? DEFAULT_RPC_URL
  return new Connection(endpoint, 'confirmed')
}

export async function confirmPendingDropClaims() {
  const connection = createConnection()
  const pendingClaims = await prisma.dropClaim.findMany({
    where: { status: 'PENDING', reference: { not: null } },
    orderBy: { claimedAt: 'asc' },
    include: {
      drop: true,
      coupon: true,
    },
    take: BATCH_LIMIT,
  })

  if (!pendingClaims.length) {
    return { processed: 0, confirmed: 0 }
  }

  let confirmedCount = 0
  for (const claim of pendingClaims) {
    try {
      if (!claim.reference) continue
      const referenceKey = new PublicKey(claim.reference)
      const signatureInfo = await findReference(connection, referenceKey, { finality: 'confirmed' })

      await prisma.$transaction(async (tx) => {
        await tx.dropClaim.update({
          where: { id: claim.id },
          data: {
            status: 'CONFIRMED',
            transactionSig: signatureInfo.signature,
            completedAt: new Date(),
          },
        })

        if (claim.couponId) {
          await tx.dealCoupon.update({
            where: { id: claim.couponId },
            data: {
              solanaPayTx: signatureInfo.signature,
              state: 'REDEEMED',
              redeemedAt: new Date(),
            },
          })
        }

        await tx.dealAnalytics.upsert({
          where: { dealId: claim.drop.dealId },
          update: {
            totalRedemptions: { increment: 1 },
            lastInteractionAt: new Date(),
          },
          create: {
            dealId: claim.drop.dealId,
            totalClaims: 0,
            totalViews: 0,
            totalFavorites: 0,
            totalRedemptions: 1,
            totalTransfers: 0,
          },
        })
      })

      confirmedCount += 1
    } catch (error) {
      if (error instanceof FindReferenceError) {
        continue
      }

      console.error('Failed to confirm drop claim', { claimId: claim.id, error })
    }
  }

  if (confirmedCount > 0) {
    await deleteCache('drop:leaderboard')
    await deleteCache('drop:today')
  }

  return { processed: pendingClaims.length, confirmed: confirmedCount }
}
