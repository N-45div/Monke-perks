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
    icon: <Sparkle className="h-6 w-6 text-amber-300" />,
  },
  {
    title: 'Merchant controls',
    description: 'Programmable issuance limits, geo-fencing, and real-time analytics keep merchants in command.',
    icon: <Wand2 className="h-6 w-6 text-rose-200" />,
  },
  {
    title: 'Liquid secondary market',
    description: 'Resell unused deals or gift them to frens with instant settlement and royalties baked in.',
    icon: <Rocket className="h-6 w-6 text-sky-200" />,
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

const stats = [
  { value: '12,400+', label: 'DAO members curating perks' },
  { value: '280+', label: 'Merchants issuing on-chain' },
  { value: '78,000 ◎', label: 'Secondary volume (30d)' },
]

const howItWorks = [
  {
    title: 'Mint the drop',
    description: 'Stake DAO points or join public drops to secure collectible discounts before they sell out.',
    icon: <Zap className="h-6 w-6 text-cyan-200" />,
  },
  {
    title: 'Flex or flip',
    description: 'Keep perks in your wallet, gift to frens, or list on integrated marketplaces in a tap.',
    icon: <Users className="h-6 w-6 text-emerald-200" />,
  },
  {
    title: 'Redeem seamlessly',
    description: 'Scan a QR or sign a transaction; merchants see verified ownership instantly.',
    icon: <Wallet2 className="h-6 w-6 text-purple-200" />,
  },
]

const partnerBadges = [
  { label: 'Supersonic Airlines', icon: <Sun className="h-5 w-5 text-yellow-200" /> },
  { label: 'Tensor Marketplace', icon: <Crown className="h-5 w-5 text-rose-200" /> },
  { label: 'Dripverse Loyalty', icon: <Gift className="h-5 w-5 text-sky-200" /> },
]

export function LandingPage({ featuredDrops = FALLBACK_FEATURED_DROPS }: LandingPageProps) {
  return (
    <div className="flex flex-col gap-20 pb-24">
      <HeroSection />
      <FeaturedDrops items={featuredDrops} />
      <HowItWorks />
      <StatsMarquee />
      <IntegrationCTA />
    </div>
  )
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-[36px] border border-white/15 bg-[#090C27] p-8 shadow-[0_35px_120px_-30px_rgba(255,105,180,0.6)] md:p-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(255,255,255,0.18),transparent_52%),radial-gradient(circle_at_80%_10%,rgba(255,170,0,0.32),transparent_45%),radial-gradient(circle_at_70%_75%,rgba(70,205,255,0.3),transparent_50%)]" />
      <div className="relative grid gap-12 lg:grid-cols-[1.4fr,1fr]">
        <div className="flex flex-col gap-8 text-white">
          <span className="inline-flex w-max items-center gap-2 rounded-full bg-white/15 px-4 py-1 text-xs font-semibold uppercase tracking-[0.45em] text-rose-100">
            <Sparkle className="h-4 w-4" /> MonkeDAO Presents
          </span>
          <div className="max-w-2xl space-y-6">
            <h1 className="text-balance text-4xl font-black leading-tight drop-shadow-lg md:text-5xl lg:text-6xl">
              Deals go bananas when they become liquid, ownable, and global.
            </h1>
            <p className="text-lg text-white/80 md:text-xl">
              MonkePerks turns real-world discounts into NFTs with built-in liquidity. Discover seasonal drops, reward
              loyal travelers, and onboard merchants with zero Web3 friction.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-white text-slate-900 shadow-lg shadow-rose-400/40 transition hover:scale-[1.02] hover:bg-white/90"
            >
              <Link href="#discover">Browse live drops</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border-white/40 bg-white/10 text-white hover:bg-white/20"
            >
              <Link href="#launch">Launch merchant dashboard</Link>
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {heroHighlights.map((item) => (
              <Card key={item.title} className="border-white/15 bg-white/10 backdrop-blur">
                <CardHeader className="flex flex-row items-center gap-3 pb-2">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/30 bg-white/10">
                    {item.icon}
                  </span>
                  <CardTitle className="text-base text-white">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 text-sm text-white/70">{item.description}</CardContent>
              </Card>
            ))}
          </div>
        </div>
        <div className="relative">
          <div className="absolute -top-8 left-6 h-40 w-40 rounded-full bg-[#ff7eb3]/40 blur-3xl" />
          <div className="absolute bottom-4 right-0 h-32 w-32 rounded-full bg-[#40c9ff]/30 blur-2xl" />
          <div className="relative flex h-full flex-col justify-between gap-4 rounded-[28px] border border-white/25 bg-white/10 p-6 backdrop-blur-xl text-white">
            <div className="flex flex-col gap-3">
              <span className="inline-flex w-max items-center gap-2 rounded-full border border-white/30 bg-white/15 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-amber-200">
                Live drop
              </span>
              <h3 className="text-2xl font-semibold">Mangos & Miles Travel Club</h3>
              <p className="text-sm text-white/70">
                VIP membership NFT unlocking elite flight discounts, lounge passes, and DAO-hosted travel quests across
                the globe.
              </p>
            </div>
            <div className="grid gap-3 rounded-2xl border border-white/25 bg-white/10 p-4">
              {[
                { label: 'Supply', value: '888 collectibles' },
                { label: 'Unlocks', value: 'Up to 70% off + concierge' },
                { label: 'Mint window', value: 'Closes in 18h' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between text-sm">
                  <span className="text-white/60">{item.label}</span>
                  <span className="font-semibold text-white">{item.value}</span>
                </div>
              ))}
            </div>
            <Button
              asChild
              size="lg"
              className="rounded-full bg-gradient-to-r from-[#FF8A8A] via-[#FF6F1E] to-[#4E18C1] text-white shadow-lg shadow-[#FF6F1E]/40 hover:opacity-90"
            >
              <Link href="#" className="flex items-center gap-2">
                Mint access pass <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

function FeaturedDrops({ items }: { items: FeaturedDrop[] }) {
  return (
    <section id="discover" className="space-y-8">
      <div className="flex flex-col gap-3 text-center text-white">
        <span className="mx-auto inline-flex items-center gap-2 rounded-full bg-[#FF6F91]/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-[#FF6F91]">
          Featured drops
        </span>
        <h2 className="text-balance text-3xl font-bold md:text-4xl">Curated perks from the MonkeDAO orbit</h2>
        <p className="mx-auto max-w-2xl text-base text-white/70">
          Each drop comes with programmable metadata, on-chain redemption attestations, and instant liquidity across
          partner marketplaces.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        {items.map((drop) => (
          <article
            key={drop.id}
            className={`group relative overflow-hidden rounded-[28px] border border-white/15 bg-gradient-to-br ${drop.gradient} p-[1px] shadow-[0_18px_50px_-20px_rgba(255,111,145,0.65)]`}
          >
            <div className="relative flex h-full flex-col gap-5 rounded-[26px] bg-[#0C102F]/95 p-6 text-white backdrop-blur">
              <span className="inline-flex w-max items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em]">
                {drop.badge}
              </span>
              <div className="space-y-2">
                <p className="text-sm uppercase tracking-[0.4em] text-white/60">{drop.brand}</p>
                <h3 className="text-xl font-semibold leading-tight">{drop.title}</h3>
              </div>
              <div className="mt-auto grid gap-3 rounded-2xl border border-white/15 bg-white/5 p-4 text-sm">
                {drop.stats.map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between">
                    <span className="text-white/60">{stat.label}</span>
                    <span className="font-semibold text-white">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function HowItWorks() {
  return (
    <section className="rounded-[32px] border border-white/15 bg-white/5 p-8 text-white backdrop-blur md:p-12">
      <div className="grid gap-10 lg:grid-cols-[1.2fr,1fr]">
        <div className="space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#845EC2]/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[#845EC2]">
            How it works
          </span>
          <h2 className="text-3xl font-bold md:text-4xl">Coupons that evolve with your community</h2>
          <p className="max-w-xl text-base text-white/70">
            From mint to redemption, MonkePerks handles the full lifecycle. Merchants keep control, users get true
            ownership, and the DAO shares in every transaction.
          </p>
          <div className="flex flex-wrap gap-3 text-sm text-white/60">
            {partnerBadges.map((partner) => (
              <span key={partner.label} className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1">
                {partner.icon}
                {partner.label}
              </span>
            ))}
          </div>
        </div>
        <div className="grid gap-4">
          {howItWorks.map((item, index) => (
            <Card key={item.title} className="border-white/20 bg-[#0C102F]/80 text-white">
              <CardHeader className="flex flex-row items-start gap-4 pb-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/30 bg-white/10 text-lg font-bold">
                  {index + 1}
                </span>
                <div>
                  <CardTitle className="flex items-center gap-2 text-lg font-semibold">
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

function StatsMarquee() {
  return (
    <section className="flex flex-wrap items-center justify-center gap-6 rounded-[28px] border border-white/10 bg-white/5 px-8 py-10 text-white">
      {stats.map((item) => (
        <div key={item.label} className="text-center">
          <p className="text-3xl font-black md:text-4xl">{item.value}</p>
          <p className="text-sm uppercase tracking-[0.35em] text-white/60">{item.label}</p>
        </div>
      ))}
    </section>
  )
}

function IntegrationCTA() {
  return (
    <section
      id="launch"
      className="overflow-hidden rounded-[32px] border border-white/15 bg-gradient-to-r from-[#2E0469] via-[#5F14B8] to-[#FF6F91] p-[1px]"
    >
      <div className="flex flex-col gap-8 rounded-[30px] bg-[#080B24]/95 p-10 text-white md:flex-row md:items-center md:justify-between">
        <div className="space-y-4">
          <h3 className="text-3xl font-bold">Launch your drop or integrate our APIs</h3>
          <p className="max-w-2xl text-base text-white/70">
            Access GraphQL + webhook feeds for real-time redemption updates, or embed the MonkePerks widget inside your
            own product. We provide SDKs, docs, and go-to-market support for partners.
          </p>
        </div>
        <div className="flex flex-col gap-3 md:w-60">
          <Button asChild size="lg" className="rounded-full bg-white text-slate-900 hover:bg-white/90">
            <Link href="/docs">Read integration docs</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-full border-white/40 bg-white/10 text-white hover:bg-white/20"
          >
            <Link href="/contact">Book partner demo</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
