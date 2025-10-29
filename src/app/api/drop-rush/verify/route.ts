import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const ref = url.searchParams.get('ref') || url.searchParams.get('reference')
    if (!ref) return NextResponse.json({ error: 'Missing ref' }, { status: 400 })

    const claim = await prisma.dropClaim.findFirst({
      where: { reference: ref },
      include: {
        drop: { include: { deal: true } },
        user: true,
        coupon: true,
      },
    })

    if (!claim) return NextResponse.json({ verified: false, reason: 'Reference not found' }, { status: 404 })

    return NextResponse.json({
      verified: claim.status === 'CONFIRMED',
      status: claim.status,
      walletAddress: claim.walletAddress,
      drop: {
        id: claim.dropId,
        title: claim.drop.title,
        deal: {
          id: claim.drop.dealId,
          title: claim.drop.deal.title,
          slug: claim.drop.deal.slug,
        },
      },
      coupon: claim.coupon
        ? {
            id: claim.coupon.id,
            ownerWallet: claim.coupon.ownerWallet,
            state: claim.coupon.state,
            redeemedAt: claim.coupon.redeemedAt,
          }
        : null,
      transactionSig: claim.transactionSig,
      claimedAt: claim.claimedAt,
      completedAt: claim.completedAt,
    })
  } catch (e) {
    console.error('Verify failed', e)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}
