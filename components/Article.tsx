// components/Article.tsx
import { ReactNode } from 'react'

type Props = {
  title: string
  kicker: string
  date: string
  readingTime: string
  author: string
  children: ReactNode
}

export default function Article({ title, kicker, date, readingTime, author, children }: Props) {
  return (
    <article className="max-w-[720px] mx-auto px-6 md:px-0 py-24">
      <div className="kicker mb-6">{kicker}</div>
      <h1 className="display-l mb-6">{title}</h1>
      <div className="flex items-center gap-4 mb-12 mono text-[11px] tracking-[0.16em] uppercase text-mute">
        <span>{author}</span>
        <span>·</span>
        <time dateTime={date}>{new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</time>
        <span>·</span>
        <span>{readingTime}</span>
      </div>
      <div className="prose prose-lg prose-paper max-w-none
                      prose-headings:serif prose-headings:font-medium prose-headings:tracking-tight
                      prose-p:text-ink-2 prose-p:leading-relaxed
                      prose-a:text-accent prose-a:no-underline hover:prose-a:underline
                      prose-strong:text-ink
                      prose-blockquote:border-l-accent prose-blockquote:text-ink-2 prose-blockquote:not-italic prose-blockquote:font-serif prose-blockquote:text-2xl
                      first-letter:serif first-letter:text-7xl first-letter:font-light first-letter:text-accent first-letter:float-left first-letter:mr-3 first-letter:leading-[0.8]">
        {children}
      </div>
    </article>
  )
}
