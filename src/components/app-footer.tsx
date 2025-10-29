import Link from 'next/link'
import { Github, Twitter, Youtube } from 'lucide-react'

const footerLinks = [
  {
    heading: 'Platform',
    items: [
      { label: 'Marketplace', href: '/' },
      { label: 'Docs', href: '/docs' },
      { label: 'Integration guide', href: '/docs/integration' },
    ],
  },
  {
    heading: 'Company',
    items: [
      { label: 'MonkeDAO', href: 'https://monke.museum' },
      { label: 'Partnerships', href: '/contact' },
      { label: 'Press kit', href: '/press' },
    ],
  },
]

const socials = [
  { icon: Github, href: 'https://github.com/N-45div/Monke-perks', label: 'GitHub' },
  { icon: Twitter, href: 'https://x.com/monkedao', label: 'Twitter' },
  { icon: Youtube, href: 'https://youtube.com/@MonkeDAO', label: 'YouTube' },
]

export function AppFooter() {
  return (
    <footer className="border-t border-white/10 bg-black/95 text-white">
      <div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-10 px-6 py-12 md:flex-row md:justify-between">
        <div className="max-w-sm space-y-4">
          <div className="flex items-center gap-3 text-lg font-extrabold tracking-tight">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-white/10 text-sm font-black text-white">
              DM
            </span>
            DealMint
          </div>
          <p className="text-sm text-white/70">
            The DAO-owned deal discovery network. Collect liquid perks, mint brand-new drops, and onboard merchants with
            zero Web3 friction.
          </p>
          <div className="flex items-center gap-3 text-sm text-white/60">
            Powered by{' '}
            <a href="https://solana.com" target="_blank" rel="noopener noreferrer" className="text-white hover:opacity-80">
              Solana
            </a>{' '}
            &amp;{' '}
            <a
              href="https://github.com/solana-foundation/create-solana-dapp"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:opacity-80"
            >
              create-solana-dapp
            </a>
          </div>
        </div>
        <div className="grid flex-1 gap-10 sm:grid-cols-2">
          {footerLinks.map((section) => (
            <div key={section.heading} className="space-y-3">
              <h4 className="text-sm font-semibold uppercase tracking-[0.3em] text-white/60">{section.heading}</h4>
              <ul className="space-y-2 text-sm text-white/70">
                {section.items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="transition hover:text-white">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-4 px-6 py-6 text-xs text-white/60 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} DealMint. All rights reserved.</p>
          <div className="flex items-center gap-4">
            {socials.map(({ icon: Icon, href, label }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="transition hover:text-white">
                <Icon className="h-4 w-4" aria-hidden />
                <span className="sr-only">{label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
