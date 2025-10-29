import Link from 'next/link'
import { ArrowRight, Crown, Gift, Rocket, Sparkle, Sun, Users, Wallet2, Wand2, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
 

export type FeaturedDrop = {
  id: string
  badge: string
  brand: string
  title: string
  gradient: string
  stats: { label: string; value: string }[]
}

type LandingPageProps = {
  featuredDrops?: FeaturedDrop[]
}

const heroHighlights = [
  {
    title: 'Collectible coupons',
    description: 'Each perk is minted as a Solana NFT with verifiable scarcity and metadata-rich redemption rules.',
    icon: <Sparkle className="h-6 w-6 text-white/80" />,
  },
  {
    title: 'Merchant controls',
    description: 'Programmable issuance limits, geo-fencing, and real-time analytics keep merchants in command.',
    icon: <Wand2 className="h-6 w-6 text-white/80" />,
  },
  {
    title: 'Liquid secondary market',
    description: 'Resell unused deals or gift them to frens with instant settlement and royalties baked in.',
    icon: <Rocket className="h-6 w-6 text-white/80" />,
  },
]

const FALLBACK_FEATURED_DROPS: FeaturedDrop[] = [
  {
    id: 'mango-airlounge',
    badge: 'Travel drop',
    brand: 'Mango Air Lounge',
    title: 'Lifetime lounge access + 40% off flights',
    gradient: 'from-[#FF8A8A] via-[#FF6F1E] to-[#4E18C1]',
    stats: [
      { label: 'Supply', value: '500 NFTs' },
      { label: 'Floor', value: '0.75 ◎' },
      { label: 'Redemption', value: 'QR + signature' },
    ],
  },
  {
    id: 'banana-bazaar',
    badge: 'Streetwear collab',
    brand: 'Banana Bazaar',
    title: 'Merch bundle + 25% lifetime discount',
    gradient: 'from-[#27C4F7] via-[#9B5DE5] to-[#F15BB5]',
    stats: [
      { label: 'Supply', value: '180 NFTs' },
      { label: 'Floor', value: '0.42 ◎' },
      { label: 'Utility', value: 'Instant checkout unlock' },
    ],
  },
  {
    id: 'jungle-jams',
    badge: 'Experiences',
    brand: 'Jungle Jams Arcade',
    title: 'VIP takeover night for squads of 6',
    gradient: 'from-[#5BFF89] via-[#FFD23F] to-[#FF7C7C]',
    stats: [
      { label: 'Supply', value: '96 NFTs' },
      { label: 'Floor', value: '1.25 ◎' },
      { label: 'Utility', value: 'On-chain unlock' },
    ],
  },
]

 

const howItWorks = [
  {
    title: 'Mint the drop',
    description: 'Stake DAO points or join public drops to secure collectible discounts before they sell out.',
    icon: <Zap className="h-6 w-6 text-white/80" />,
  },
  {
    title: 'Flex or flip',
    description: 'Keep perks in your wallet, gift to friends, or list on integrated marketplaces in a tap.',
    icon: <Users className="h-6 w-6 text-white/80" />,
  },
  {
    title: 'Redeem seamlessly',
    description: 'Scan a QR or sign a transaction; merchants see verified ownership instantly.',
    icon: <Wallet2 className="h-6 w-6 text-white/80" />,
  },
]

const partnerBadges = [
  { label: 'Supersonic Airlines', icon: <Sun className="h-5 w-5 text-white/70" /> },
  { label: 'Tensor Marketplace', icon: <Crown className="h-5 w-5 text-white/70" /> },
  { label: 'Dripverse Loyalty', icon: <Gift className="h-5 w-5 text-white/70" /> },
]

export function LandingPage({ featuredDrops = FALLBACK_FEATURED_DROPS }: LandingPageProps) {
  return (
    <div className="flex flex-col gap-20 pb-24">
      <HeroSection />
      <FeaturedDrops items={featuredDrops} />
      <HowItWorks />
      <IntegrationCTA />
    </div>
  )
}

function HeroSection() {
  return (
    <section className="relative bg-black px-8 py-20 md:px-16 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          {/* Left: Text Content */}
          <div className="flex flex-col gap-8">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-black leading-tight text-white">
                The Easiest Way<br />to Claim Perks
              </h1>
              <p className="text-lg text-white/70 max-w-xl">
                Collectible NFT coupons with instant redemption. No wallets, no gas, no headaches.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button asChild size="lg" className="w-fit rounded-full bg-white text-black hover:bg-white/90">
                <Link href="/drop-rush">See today’s drop</Link>
              </Button>
              <Button asChild variant="ghost" size="lg" className="rounded-full bg-white/10 text-white hover:bg-white/20">
                <Link href="#how-it-works">How it works</Link>
              </Button>
            </div>
          </div>

          {/* Right: Phone Mockup */}
          <div className="relative flex justify-center">
            <div className="relative w-80 h-96 rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur">
              {/* Glass Panel: API Preview */}
              <div className="w-full h-full p-6 flex flex-col justify-between">
                <div className="text-white">
                  <p className="text-sm opacity-90">Drop Rush Preview</p>
                  <p className="text-2xl font-bold">Live daily at 00:00 UTC</p>
                  <p className="text-xs opacity-75 mt-2">Claim, keep your streak, redeem via QR at partner merchants.</p>
                </div>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <span className="inline-flex items-center rounded-md border border-white/15 bg-white/5 px-2.5 py-1 text-xs text-white/80">
                      Streak x1.0
                    </span>
                    <span className="inline-flex items-center rounded-md border border-white/15 bg-white/5 px-2.5 py-1 text-xs text-white/80">
                      Supply limited
                    </span>
                  </div>
                  <div className="rounded-lg px-3 py-2 bg-white/10 text-xs text-white/75">
                    Redemption via Solana Pay QR
                  </div>
                  <Button asChild className="w-full rounded-full bg-white text-black hover:bg-white/90">
                    <Link href="/drop-rush">See today’s drop</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function FeaturedDrops({ items }: { items: FeaturedDrop[] }) {
  return (
    <section id="discover" className="bg-black px-8 py-20 md:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Most Popular Drops</h2>
          <p className="text-white/60 text-lg">From travel to fashion, discover curated perks from top brands.</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-5">
          {items.map((drop, idx) => (
            <article
              key={drop.id}
              className={`group relative overflow-hidden rounded-2xl h-64 cursor-pointer transition-transform hover:scale-105 border border-white/10 bg-white/5 backdrop-blur`}
            >
              <div className="relative h-full flex flex-col justify-between p-6 text-white">
                <div>
                  <span className="inline-block bg-white/20 backdrop-blur px-3 py-1 rounded-full text-xs font-bold mb-3">
                    {drop.badge}
                  </span>
                  <h3 className="font-bold text-lg leading-tight">{drop.brand}</h3>
                  <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-white/70">
                    {drop.stats?.slice(0,3).map((s) => (
                      <span key={s.label} className="inline-flex rounded-md border border-white/15 bg-white/5 px-2.5 py-1">
                        {s.label}: {s.value}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-white/80 mb-4">{drop.title}</p>
                  <Button className="w-full bg-white text-black font-bold py-2 rounded-lg hover:bg-white/90">
                    View
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function HowItWorks() {
  return (
    <section id="how-it-works" className="rounded-2xl border border-white/12 bg-white/5 p-8 text-white backdrop-blur md:p-12">
      <div className="grid gap-10 lg:grid-cols-[1.2fr,1fr]">
        <div className="space-y-6">
          <span className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">
            How it works
          </span>
          <h2 className="text-3xl font-bold md:text-4xl">Coupons that evolve with your community</h2>
          <p className="max-w-xl text-base text-white/70">
            From mint to redemption, MonkePerks handles the full lifecycle. Merchants keep control, users get true
            ownership, and the DAO shares in every transaction.
          </p>
          <div className="flex flex-wrap gap-3 text-sm text-white/60">
            {partnerBadges.map((partner) => (
              <span key={partner.label} className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/5 px-3 py-1">
                {partner.icon}
                {partner.label}
              </span>
            ))}
          </div>
        </div>
        <div className="grid gap-4">
          {howItWorks.map((item, index) => (
            <Card key={item.title} className="rounded-xl border-white/12 bg-white/5 text-white backdrop-blur">
              <CardHeader className="flex flex-row items-start gap-4 pb-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-md border border-white/20 bg-white/10 text-xs font-semibold text-white/80">
                  {index + 1}
                </span>
                <div>
                  <CardTitle className="flex items-center gap-2 text-base font-semibold">
                    {item.icon}
                    {item.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0 text-sm text-white/70">{item.description}</CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

 

function IntegrationCTA() {
  return (
    <section
      id="launch"
      className="overflow-hidden rounded-[32px] border border-white/15 bg-white/5"
    >
      <div className="flex flex-col gap-8 p-10 text-white md:flex-row md:items-center md:justify-between">
        <div className="space-y-4">
          <h3 className="text-3xl font-bold">Launch your drop or integrate our APIs</h3>
          <p className="max-w-2xl text-base text-white/70">
            Access GraphQL + webhook feeds for real-time redemption updates, or embed the MonkePerks widget inside your
            own product. We provide SDKs, docs, and go-to-market support for partners.
          </p>
        </div>
        <div className="flex flex-col gap-3 md:w-60">
          <Button asChild size="lg" className="rounded-full bg-white text-slate-900 hover:bg-white/90">
            <Link href="/builders">Read integration docs</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-full border-white/40 bg-white/10 text-white hover:bg-white/20"
          >
            <Link href="/leaderboard">View leaderboard</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
