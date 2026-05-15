// components/FAQ.tsx
import { useState } from 'react'

type Item = { q: string; a: string }

export default function FAQ({ items }: { items: Item[] }) {
  const [open, setOpen] = useState<number | null>(0)

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.q,
      acceptedAnswer: { '@type': 'Answer', text: it.a },
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="border-t border-rule">
        {items.map((it, i) => {
          const isOpen = open === i
          return (
            <div key={it.q} className="border-b border-rule">
              <button onClick={() => setOpen(isOpen ? null : i)} className="w-full py-6 flex items-center justify-between text-left hover:text-accent transition-colors">
                <span className="serif font-medium text-lg pr-6">{it.q}</span>
                <span className={`mono text-2xl text-mute transition-transform ${isOpen ? 'rotate-45' : ''}`}>+</span>
              </button>
              <div className={`grid transition-all duration-300 ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                  <p className="body pb-6 max-w-[720px]">{it.a}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
