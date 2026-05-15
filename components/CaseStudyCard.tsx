// components/CaseStudyCard.tsx
import Link from 'next/link'

type Props = {
  industry: string
  client: string
  outcome: string
  metric: string
  metricLabel: string
  href: string
}

export default function CaseStudyCard({ industry, client, outcome, metric, metricLabel, href }: Props) {
  return (
    <Link href={href} className="group block border border-rule p-8 hover:bg-paper-2 transition-colors no-underline text-ink">
      <div className="kicker mb-3">{industry}</div>
      <h3 className="serif text-xl font-medium mb-5">{client}</h3>
      <div className="serif text-5xl font-light text-accent leading-none mb-2">{metric}</div>
      <div className="kicker mb-4">{metricLabel}</div>
      <p className="body-s">{outcome}</p>
      <div className="mt-6 mono text-[11px] tracking-[0.16em] uppercase text-ink group-hover:text-accent">Read case →</div>
    </Link>
  )
}
