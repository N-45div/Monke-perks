import { NextResponse } from 'next/server'
import { claimDrop } from '@/services/drop-rush/service'
import { DropClaimError } from '@/services/drop-rush/errors'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { dropId, walletAddress } = body ?? {}

    if (!dropId || !walletAddress) {
      return NextResponse.json({ error: 'Missing dropId or walletAddress' }, { status: 400 })
    }

    const result = await claimDrop({ dropId, walletAddress })

    return NextResponse.json({
      claim: {
        id: result.claim.id,
        status: result.claim.status,
        reference: result.claim.reference,
        streakSnapshot: result.claim.streakSnapshot,
        paymentUrl: result.paymentUrl,
      },
      streak: {
        current: result.currentStreak,
        longest: result.longestStreak,
      },
    })
  } catch (error) {
    if (error instanceof DropClaimError) {
      return NextResponse.json({ error: error.message, code: error.code }, { status: 400 })
    }

    console.error('Drop claim failed', error)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}
