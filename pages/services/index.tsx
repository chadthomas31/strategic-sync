import { GetStaticProps } from 'next'
import SEO from '../../components/SEO'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Hero from '../../components/Hero'
import { listServices, type Service } from '../../lib/content'
import { breadcrumbs, itemListSchema } from '../../lib/seo'
import Link from 'next/link'

export default function ServicesIndex({ services }: { services: Service[] }) {
  return (
    <>
      <SEO
        title="Services — AI Automation & Integration"
        description="AI Voice Agents, Workflow Integration, Custom Systems. Three productized service lines from Strategic Sync."
        jsonLd={[
          breadcrumbs([{ name: 'Home', href: '/' }, { name: 'Services', href: '/services' }]),
          itemListSchema(services.map((s) => ({ name: s.name, href: `/services/${s.slug}` }))),
        ]}
      />
      <Navbar />
      <Hero kicker="§ 02 — Services" headline={<>Three productized<br/><em className="serif italic text-accent">service lines.</em></>} sub="Each one solves a specific problem with a specific stack. Pick the one that matches what's on fire." />
      <div className="max-w-wrap mx-auto px-6 md:px-12 pb-32">
        <div className="border-t border-rule">
          {services.map((s, i) => (
            <Link key={s.slug} href={`/services/${s.slug}`} className="block py-12 md:py-16 border-b border-rule group no-underline text-ink">
              <div className="grid md:grid-cols-[80px_1fr_1fr] gap-8 items-start">
                <div className="kicker">{String(i + 1).padStart(2, '0')} / {String(services.length).padStart(2, '0')}</div>
                <div>
                  <h2 className="display-l mb-3 group-hover:text-accent transition-colors">{s.name}</h2>
                  <p className="body">{s.tagline}</p>
                </div>
                <div>
                  <div className="kicker mb-2">{s.starting}</div>
                  <div className="kicker mb-4 text-ink-2">{s.timeline}</div>
                  <p className="body-s">{s.description}</p>
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {s.tags.map((t) => <span key={t} className="mono text-[10px] tracking-[0.08em] px-2 py-1 bg-paper-2">{t}</span>)}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const services = await listServices()
  return { props: { services } }
}
