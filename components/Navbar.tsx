// components/Navbar.tsx
import Link from 'next/link'
import { useEffect, useState } from 'react'

const links = [
  { href: '/services', label: 'Services' },
  { href: '/work', label: 'Work' },
  { href: '/approach', label: 'Approach' },
  { href: '/integrations', label: 'Brands' },
  { href: '/journal', label: 'Tech Tips' },
  { href: '/pricing', label: 'Pricing' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`sticky top-0 z-50 transition-colors ${scrolled ? 'bg-paper-2/95 backdrop-blur border-b border-rule/20' : 'bg-transparent'}`}>
      <div className="max-w-wrap mx-auto px-6 md:px-12 flex items-center justify-between py-5 border-b border-rule">
        <Link href="/" className="flex items-baseline gap-2.5 no-underline text-ink">
          <span className="relative inline-block w-7 h-7 bg-ink">
            <span className="absolute inset-y-1.5 right-1.5 left-3.5 bg-accent" />
          </span>
          <span className="serif font-medium text-xl tracking-tight">
            Strategic <em className="not-italic md:italic font-normal text-accent">Sync</em>
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-7">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-[13px] tracking-wide text-ink hover:text-accent no-underline">
              {l.label}
            </Link>
          ))}
          <Link href="/contact#book" className="btn-ink !py-2.5 !px-4 text-[11px]">Book a call →</Link>
        </div>
      </div>
    </nav>
  )
}
