import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { couponId, toWallet } = body ?? {}
    if (!couponId || !toWallet) {
      return NextResponse.json({ error: 'Missing couponId or toWallet' }, { status: 400 })
    }

    const coupon = await prisma.dealCoupon.findUnique({ where: { id: couponId } })
    if (!coupon) return NextResponse.json({ error: 'Coupon not found' }, { status: 404 })
    if (coupon.state === 'REDEEMED' || coupon.redeemedAt) {
      return NextResponse.json({ error: 'Coupon already redeemed' }, { status: 400 })
    }

    const updated = await prisma.$transaction(async (tx) => {
      const updatedCoupon = await tx.dealCoupon.update({
        where: { id: couponId },
        data: { ownerWallet: toWallet, state: 'TRANSFERRED' },
      })

      await tx.couponTransfer.create({
        data: {
          couponId,
          fromWallet: coupon.ownerWallet ?? undefined,
          toWallet,
        },
      })

      await tx.dealInteraction.create({
        data: {
          dealId: coupon.dealId,
          type: 'TRANSFER',
          context: { couponId, fromWallet: coupon.ownerWallet, toWallet },
        },
      })

      return updatedCoupon
    })

    return NextResponse.json({ coupon: updated })
  } catch (e) {
    console.error('Transfer failed', e)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}
