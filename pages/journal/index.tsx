import { GetStaticProps } from 'next'
import Link from 'next/link'
import SEO from '../../components/SEO'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Hero from '../../components/Hero'
import { listJournal, type JournalFront } from '../../lib/content'
import { breadcrumbs, itemListSchema } from '../../lib/seo'

type Post = JournalFront & { content: string }

export default function JournalIndex({ posts }: { posts: Post[] }) {
  return (
    <>
      <SEO
        title="Tech Tips — Computer, WiFi & IT Advice"
        description="Plain-English tech tips from an Orange County IT pro — computer repair, WiFi, security cameras, backups, and small-business IT."
        jsonLd={[
          breadcrumbs([{ name: 'Home', href: '/' }, { name: 'Tech Tips', href: '/journal' }]),
          itemListSchema(posts.map((p) => ({ name: p.title, href: `/journal/${p.slug}` }))),
        ]}
      />
      <Navbar />
      <Hero kicker="§ 06 — Tech Tips" headline={<>Tech <em className="serif italic text-accent">tips.</em></>} sub="Straight answers to the questions we get all the time — slow computers, dead WiFi, backups, cameras, and keeping a small office running." />
      <section className="max-w-wrap mx-auto px-6 md:px-12 pb-32 border-t border-rule">
        {posts.length === 0 ? (
          <p className="body text-mute py-16 text-center">First post coming soon.</p>
        ) : (
          posts.map((p) => (
            <Link key={p.slug} href={`/journal/${p.slug}`} className="block py-12 border-b border-rule no-underline text-ink group">
              <div className="grid md:grid-cols-[160px_1fr] gap-8">
                <div>
                  <div className="kicker mb-2">{p.kicker}</div>
                  <div className="mono text-[11px] text-mute">{new Date(p.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
                  <div className="mono text-[11px] text-mute mt-1">{p.readingTime}</div>
                </div>
                <div>
                  <h2 className="serif text-3xl font-medium mb-3 group-hover:text-accent">{p.title}</h2>
                  <p className="body max-w-[640px]">{p.description}</p>
                </div>
              </div>
            </Link>
          ))
        )}
      </section>
      <Footer />
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const posts = await listJournal()
  return { props: { posts } }
}
