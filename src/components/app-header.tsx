'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeSelect } from '@/components/theme-select'
import { WalletDropdown } from '@/components/wallet-dropdown'

const ClusterDropdown = dynamic(() => import('@/components/cluster-dropdown').then((m) => m.ClusterDropdown), {
  ssr: false,
})

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Drop Rush', href: '/drop-rush' },
  { label: 'Leaderboard', href: '/leaderboard' },
  { label: 'Verify', href: '/verify' },
  { label: 'Builders', href: '/builders' },
]

export function AppHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const isActive = (href: string) => (href === '/' ? pathname === href : pathname?.startsWith(href))

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/90 text-white backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-screen-2xl items-center justify-between px-4 py-3 md:px-6 md:py-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-extrabold tracking-tight md:text-xl">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-white/10 text-sm font-black text-white">
            DM
          </span>
          DealMint
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-white/70 md:flex">
          {navItems.map(({ label, href }) => (
            <Link key={href} href={href} className={`transition hover:text-white ${isActive(href) ? 'text-white' : ''}`}>
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button
            asChild
            size="sm"
            variant="ghost"
            className="rounded-full bg-white/10 font-semibold text-white backdrop-blur transition hover:bg-white/20"
          >
            <Link href="/drop-rush">See today’s drop</Link>
          </Button>
          <Button
            asChild
            size="sm"
            className="rounded-full bg-white text-black transition hover:bg-white/90"
          >
            <Link href="/verify">Verify</Link>
          </Button>
          <WalletDropdown />
          <ClusterDropdown />
          <ThemeSelect />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <WalletDropdown />
          <Button size="icon" variant="ghost" className="text-white" onClick={() => setOpen((value) => !value)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-white/10 bg-black/95 text-white md:hidden">
          <div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-4 px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex gap-3">
                <ClusterDropdown />
                <ThemeSelect />
              </div>
              <Button asChild size="sm" className="rounded-full bg-white text-black">
                <Link href="/verify" onClick={() => setOpen(false)}>
                  Verify
                </Link>
              </Button>
            </div>
            <nav className="flex flex-col gap-3 text-sm font-semibold">
              {navItems.map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`rounded-xl px-3 py-2 transition hover:bg-white/5 ${isActive(href) ? 'bg-white/10 text-white' : 'text-white/70'}`}
                >
                  {label}
                </Link>
              ))}
            </nav>
            <Button asChild variant="ghost" className="rounded-full bg-white/10 font-semibold text-white hover:bg-white/20">
              <Link href="/drop-rush" onClick={() => setOpen(false)}>
                See today’s drop
              </Link>
            </Button>
          </div>
        </div>
      ) : null}
    </header>
  )
}
