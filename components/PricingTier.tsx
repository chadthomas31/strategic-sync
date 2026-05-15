// components/PricingTier.tsx
import Link from 'next/link'

type Props = {
  name: string
  tagline: string
  price: string
  priceNote?: string
  includes: string[]
  excludes: string[]
  cta: { label: string; href: string }
  featured?: boolean
}

export default function PricingTier({ name, tagline, price, priceNote, includes, excludes, cta, featured }: Props) {
  return (
    <div className={`relative p-8 md:p-10 border ${featured ? 'border-accent bg-paper-2' : 'border-rule'}`}>
      {featured && <span className="absolute -top-3 left-8 mono text-[10px] tracking-[0.2em] uppercase bg-accent text-paper px-3 py-1">Most chosen</span>}
      <div className="kicker mb-3">{name}</div>
      <h3 className="serif text-2xl font-medium mb-6">{tagline}</h3>
      {priceNote && <div className="kicker mb-1">{priceNote}</div>}
      <div className="serif text-4xl font-light text-ink mb-8">{price}</div>
      <div className="space-y-3 mb-6">
        <div className="kicker">Includes</div>
        <ul className="space-y-2 body-s">
          {includes.map((i) => <li key={i} className="pl-4 relative before:absolute before:left-0 before:content-['+'] before:text-accent">{i}</li>)}
        </ul>
      </div>
      <div className="space-y-3 mb-8">
        <div className="kicker">Not included</div>
        <ul className="space-y-2 body-s opacity-60">
          {excludes.map((i) => <li key={i} className="pl-4 relative before:absolute before:left-0 before:content-['−']">{i}</li>)}
        </ul>
      </div>
      <Link href={cta.href} className="btn-ink w-full justify-center">{cta.label} →</Link>
    </div>
  )
}
