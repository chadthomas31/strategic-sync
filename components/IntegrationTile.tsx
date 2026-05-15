// components/IntegrationTile.tsx
import Link from 'next/link'

type Props = {
  slug: string
  name: string
  category: string
  useCase: string
}

export default function IntegrationTile({ slug, name, category, useCase }: Props) {
  return (
    <Link href={`/integrations/${slug}`} className="group block border border-rule p-6 hover:bg-paper-2 transition-colors no-underline text-ink">
      <div className="kicker mb-2">{category}</div>
      <h3 className="serif text-lg font-medium mb-2">{name}</h3>
      <p className="body-s mb-4">{useCase}</p>
      <span className="mono text-[10px] tracking-[0.16em] uppercase text-ink group-hover:text-accent">Connect →</span>
    </Link>
  )
}
