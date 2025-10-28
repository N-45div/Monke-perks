import { LandingPage } from '@/features/landing/landing-page'
import { mapDealsToFeaturedDrops } from '@/features/landing/landing-transform'
import { getFeaturedDeals } from '@/repositories/deal-repository'

export const revalidate = 300

async function loadFeaturedDrops() {
  try {
    const deals = await getFeaturedDeals()
    return mapDealsToFeaturedDrops(deals)
  } catch (error) {
    console.error('Failed to load deals', error)
    return undefined
  }
}

export default async function Home() {
  const featuredDrops = await loadFeaturedDrops()
  return <LandingPage featuredDrops={featuredDrops} />
}
