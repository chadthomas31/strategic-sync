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
        title="Services — Computer Repair, Networking & IT Support"
        description="Computer & Mac repair, networking & WiFi, IT support & managed IT, security camera installs, and AI integration. Orange County, CA."
        jsonLd={[
          breadcrumbs([{ name: 'Home', href: '/' }, { name: 'Services', href: '/services' }]),
          itemListSchema(services.map((s) => ({ name: s.name, href: `/services/${s.slug}` }))),
        ]}
      />
      <Navbar />
      <Hero kicker="§ 02 — Services" headline={<>What we<br/><em className="serif italic text-accent">fix &amp; set up.</em></>} sub="Computers, networks, IT support, and installs for homes and small businesses across Orange County. Pick what you need help with." />
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
