import { differenceInHours } from 'date-fns'
import { prisma } from '@/lib/prisma'
import { deleteCache } from '@/lib/redis'
import { env, optionalEnv } from '@/lib/utils'
import { DropClaimError, DropClaimErrorCode } from './errors'
import { buildPaymentUrl, generateReference } from './solana-pay'

const STREAK_THRESHOLD_HOURS = 36

function now() {
  return new Date()
}

async function markDropLive(dropId: string) {
  return prisma.dailyDrop.update({
    where: { id: dropId },
    data: { status: 'LIVE' },
    include: {
      deal: true,
    },
  })
}

export async function getActiveDrop() {
  const current = now()
  const drop = await prisma.dailyDrop.findFirst({
    where: {
      startAt: { lte: current },
      endAt: { gt: current },
      status: { not: 'CANCELLED' },
    },
    include: {
      deal: true,
    },
    orderBy: { startAt: 'desc' },
  })

  if (!drop) return null

  if (drop.status === 'SCHEDULED') {
    return await markDropLive(drop.id)
  }

  return drop
}

async function ensureWalletLimit(dropId: string, walletAddress: string | null) {
  if (!walletAddress) {
    throw new DropClaimError(DropClaimErrorCode.WalletRequired, 'Wallet address required to claim drop')
  }

  const existing = await prisma.dropClaim.findFirst({
    where: {
      dropId,
      walletAddress,
      status: { in: ['PENDING', 'CONFIRMED'] },
    },
  })

  if (existing) {
    throw new DropClaimError(DropClaimErrorCode.LimitReached, 'Wallet already claimed this drop')
  }
}

async function assertSupplyAvailable(dropId: string, supplyAllocation: number) {
  const claimCount = await prisma.dropClaim.count({
    where: {
      dropId,
      status: { in: ['PENDING', 'CONFIRMED'] },
    },
  })

  if (claimCount >= supplyAllocation) {
    throw new DropClaimError(DropClaimErrorCode.DropSoldOut, 'Drop supply exhausted')
  }
}

function calculateNextStreak(lastClaimAt: Date | null | undefined, currentStreak: number) {
  if (!lastClaimAt) {
    return { currentStreak: 1, longestStreak: 1 }
  }

  const hoursSince = differenceInHours(now(), lastClaimAt)
  const continued = hoursSince <= STREAK_THRESHOLD_HOURS
  const nextCurrent = continued ? currentStreak + 1 : 1
  const nextLongest = Math.max(nextCurrent, continued ? currentStreak : currentStreak)
  return { currentStreak: nextCurrent, longestStreak: nextLongest }
}

export interface ClaimDropParams {
  dropId: string
  walletAddress: string
}

export async function claimDrop({ dropId, walletAddress }: ClaimDropParams) {
  const drop = await prisma.dailyDrop.findUnique({
    where: { id: dropId },
    include: {
      deal: {
        include: {
          merchant: true,
        },
      },
    },
  })

  if (!drop) {
    throw new DropClaimError(DropClaimErrorCode.DropNotFound, 'Drop not found')
  }

  const current = now()

  if (drop.status === 'SCHEDULED' && drop.startAt <= current) {
    await markDropLive(drop.id)
  }

  if (drop.status !== 'LIVE' && drop.status !== 'SCHEDULED') {
    throw new DropClaimError(DropClaimErrorCode.DropNotLive, 'Drop is not live')
  }

  if (drop.startAt > current || drop.endAt <= current) {
    throw new DropClaimError(DropClaimErrorCode.DropNotLive, 'Drop is outside active window')
  }

  await ensureWalletLimit(drop.id, walletAddress)
  await assertSupplyAvailable(drop.id, drop.supplyAllocation)

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.userProfile.upsert({
      where: { walletAddress },
      update: {},
      create: { walletAddress },
    })

    const streakRecord = await tx.userStreak.upsert({
      where: { userId: user.id },
      update: {},
      create: { userId: user.id },
    })

    const { currentStreak: nextCurrent, longestStreak: nextLongest } = calculateNextStreak(
      streakRecord.lastClaimAt,
      streakRecord.currentStreak,
    )

    await tx.userStreak.update({
      where: { userId: user.id },
      data: {
        currentStreak: nextCurrent,
        longestStreak: Math.max(nextLongest, streakRecord.longestStreak),
        lastClaimAt: current,
      },
    })

    const originalPrice = drop.deal.originalPrice ? Number(drop.deal.originalPrice) : 0
    const recipient = optionalEnv('SOLANA_PAY_RECIPIENT')
    const shouldGeneratePayment = Boolean(recipient && originalPrice > 0)
    const reference = generateReference()
    const paymentUrl = shouldGeneratePayment
      ? buildPaymentUrl({
          recipient,
          reference,
          label: drop.title,
          message: drop.description ?? undefined,
          memo: drop.deal.slug,
        })
      : null

    const claimStatus = paymentUrl ? 'PENDING' : 'CONFIRMED'

    const claim = await tx.dropClaim.create({
      data: {
        dropId: drop.id,
        userId: user.id,
        walletAddress,
        streakSnapshot: nextCurrent,
        reference,
        status: claimStatus,
      },
    })

    await tx.dealAnalytics.upsert({
      where: { dealId: drop.dealId },
      update: {
        totalClaims: { increment: 1 },
        lastInteractionAt: current,
      },
      create: {
        dealId: drop.dealId,
        totalClaims: 1,
        totalViews: 0,
        totalFavorites: 0,
        totalRedemptions: 0,
        totalTransfers: 0,
      },
    })

    await tx.dealInteraction.create({
      data: {
        dealId: drop.dealId,
        userId: user.id,
        type: 'CLAIM',
        context: {
          dropId: drop.id,
          reference,
        },
      },
    })

    return {
      claim,
      paymentUrl,
      currentStreak: nextCurrent,
      longestStreak: Math.max(nextLongest, streakRecord.longestStreak),
    }
  })

  await deleteCache('drop:today')
  await deleteCache('drop:leaderboard')

  return result
}

export async function getDropLeaderboard(limit = 10) {
  const rows = await prisma.dropClaim.findMany({
    where: { status: 'CONFIRMED' },
    orderBy: { streakSnapshot: 'desc' },
    take: limit,
    include: {
      user: true,
    },
  })

  return rows.map((row) => ({
    wallet: row.walletAddress ?? row.user?.walletAddress ?? 'unknown',
    streak: row.streakSnapshot,
    user: row.user,
  }))
}
