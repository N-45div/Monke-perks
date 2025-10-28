import { NextResponse } from 'next/server'
import { getFeaturedDeals } from '@/repositories/deal-repository'

export const revalidate = 30

export async function GET() {
  try {
    const deals = await getFeaturedDeals(20)
    return NextResponse.json({ deals })
  } catch (error) {
    console.error('Failed to fetch deals', error)
    return NextResponse.json({ error: 'Unable to fetch deals' }, { status: 500 })
  }
}
