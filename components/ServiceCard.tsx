// components/ServiceCard.tsx
import Link from 'next/link'
import { ReactNode } from 'react'

type Props = {
  num: string
  total: string
  icon: ReactNode
  title: string
  body: string
  tags: string[]
  href: string
}

export default function ServiceCard({ num, total, icon, title, body, tags, href }: Props) {
  return (
    <Link href={href} className="group relative block p-8 md:p-12 border-r border-b border-rule last:border-r-0 hover:bg-paper-2 transition-colors no-underline text-ink">
      <span className="absolute top-6 right-7 mono text-[10px] tracking-[0.2em] text-mute">{num} / {total}</span>
      <div className="w-9 h-9 mb-6 relative">{icon}</div>
      <h3 className="heading-m mb-3.5">{title}</h3>
      <p className="body-s mb-6">{body}</p>
      <div className="flex flex-wrap gap-1.5">
        {tags.map((t) => (
          <span key={t} className="mono text-[10px] tracking-[0.08em] px-2 py-1 bg-paper-2 text-ink-2 group-hover:bg-paper">{t}</span>
        ))}
      </div>
    </Link>
  )
}
