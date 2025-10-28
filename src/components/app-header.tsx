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
  { label: 'Marketplace', href: '/' },
  { label: 'Docs', href: '/docs' },
  { label: 'DAO', href: 'https://monke.museum' },
]

export function AppHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const isActive = (href: string) => (href === '/' ? pathname === href : pathname?.startsWith(href))

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#070A1F]/80 text-white shadow-[0_4px_30px_rgba(15,23,42,0.35)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-screen-2xl items-center justify-between px-4 py-3 md:px-6 md:py-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-extrabold tracking-tight md:text-xl">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF6F91] via-[#845EC2] to-[#FFC75F] text-sm font-black text-slate-900 shadow-lg">
            MP
          </span>
          MonkePerks
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
            className="rounded-full bg-white/10 font-semibold text-white shadow-sm shadow-[#FF6F91]/30 backdrop-blur transition hover:bg-white/20"
          >
            <Link href="#discover">Browse Drops</Link>
          </Button>
          <Button
            asChild
            size="sm"
            className="rounded-full bg-gradient-to-r from-[#FF8A8A] via-[#FF6F1E] to-[#4E18C1] text-white shadow-lg shadow-[#FF6F1E]/30 transition hover:opacity-90"
          >
            <Link href="/contact">Launch your drop</Link>
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
        <div className="border-t border-white/10 bg-[#070A1F]/95 text-white shadow-inner shadow-black/30 md:hidden">
          <div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-4 px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex gap-3">
                <ClusterDropdown />
                <ThemeSelect />
              </div>
              <Button
                asChild
                size="sm"
                className="rounded-full bg-gradient-to-r from-[#FF8A8A] via-[#FF6F1E] to-[#4E18C1] text-white"
              >
                <Link href="/contact" onClick={() => setOpen(false)}>
                  Launch drop
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
            <Button
              asChild
              variant="ghost"
              className="rounded-full bg-white/10 font-semibold text-white hover:bg-white/20"
            >
              <Link href="#discover" onClick={() => setOpen(false)}>
                Browse drops
              </Link>
            </Button>
          </div>
        </div>
      ) : null}
    </header>
  )
}
