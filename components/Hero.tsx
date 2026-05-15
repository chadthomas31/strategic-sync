// components/Hero.tsx
import { motion } from 'framer-motion'
import { ReactNode } from 'react'

type Props = {
  kicker: string
  headline: ReactNode
  sub?: ReactNode
  aside?: { label: string; body: ReactNode }
  primaryCta?: { label: string; href: string }
  secondaryCta?: { label: string; href: string }
}

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
})

export default function Hero({ kicker, headline, sub, aside, primaryCta, secondaryCta }: Props) {
  return (
    <section className="max-w-wrap mx-auto px-6 md:px-12 pt-24 pb-16 md:pt-32 md:pb-20">
      <div className="grid md:grid-cols-[1fr_380px] gap-12 md:gap-16 items-end">
        <div>
          <motion.div className="flex items-center gap-3.5 kicker mb-8" {...fade(0)}>
            <span className="w-1.5 h-1.5 bg-accent" />
            <span>{kicker}</span>
            <span className="flex-1 max-w-[120px] h-px bg-rule" />
          </motion.div>
          <motion.h1 className="display-xl text-ink" {...fade(0.06)}>{headline}</motion.h1>
          {sub && <motion.div className="body mt-5 max-w-[640px]" {...fade(0.14)}>{sub}</motion.div>}
          {(primaryCta || secondaryCta) && (
            <motion.div className="flex flex-wrap items-center gap-4 mt-12" {...fade(0.22)}>
              {primaryCta && <a href={primaryCta.href} className="btn-ink">{primaryCta.label} →</a>}
              {secondaryCta && <a href={secondaryCta.href} className="btn-ghost">{secondaryCta.label}</a>}
            </motion.div>
          )}
        </div>
        {aside && (
          <motion.aside className="border-l border-rule pl-8 pb-2" {...fade(0.18)}>
            <div className="kicker mb-3.5">{aside.label}</div>
            <div className="body">{aside.body}</div>
          </motion.aside>
        )}
      </div>
    </section>
  )
}
