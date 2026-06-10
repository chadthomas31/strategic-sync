// pages/index.tsx
import { GetStaticProps } from 'next'
import SEO from '../components/SEO'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Hero from '../components/Hero'
import StatusStrip from '../components/StatusStrip'
import ServiceCard from '../components/ServiceCard'
import CaseStudyCard from '../components/CaseStudyCard'
import FAQ from '../components/FAQ'
import { listServices, listCases, listIntegrations, type Service, type Integration, type CaseFront } from '../lib/content'
import { localBusinessSchema } from '../lib/seo'
import statsData from '../content/stats.json'

type CaseListItem = CaseFront & { content: string }

type Props = {
  services: Service[]
  cases: CaseListItem[]
  integrations: Integration[]
}

const ICONS: Record<string, JSX.Element> = {
  'computer-repair': (
    <svg viewBox="0 0 36 36" className="w-9 h-9"><rect x="3" y="5" width="30" height="20" stroke="#15140f" strokeWidth="2" fill="none"/><path d="M12 30 H24" stroke="#15140f" strokeWidth="2"/><circle cx="18" cy="15" r="3" fill="#f04e23"/></svg>
  ),
  'networking-wifi': (
    <svg viewBox="0 0 36 36" className="w-9 h-9"><path d="M6 14 A18 18 0 0 1 30 14" stroke="#15140f" strokeWidth="2" fill="none"/><path d="M11 19 A11 11 0 0 1 25 19" stroke="#15140f" strokeWidth="2" fill="none"/><circle cx="18" cy="26" r="3" fill="#f04e23"/></svg>
  ),
  'it-support': (
    <svg viewBox="0 0 36 36" className="w-9 h-9"><circle cx="18" cy="18" r="14" stroke="#15140f" strokeWidth="2" fill="none"/><path d="M18 10 v8 l6 4" stroke="#15140f" strokeWidth="2" fill="none"/><circle cx="18" cy="18" r="2.5" fill="#f04e23"/></svg>
  ),
  'smart-home-security': (
    <svg viewBox="0 0 36 36" className="w-9 h-9"><path d="M5 17 L18 5 L31 17" stroke="#15140f" strokeWidth="2" fill="none"/><rect x="9" y="17" width="18" height="14" stroke="#15140f" strokeWidth="2" fill="none"/><circle cx="18" cy="24" r="3" fill="#f04e23"/></svg>
  ),
  'ai-integration': (
    <svg viewBox="0 0 36 36" className="w-9 h-9"><rect x="6" y="6" width="24" height="24" rx="4" stroke="#15140f" strokeWidth="2" fill="none"/><circle cx="14" cy="15" r="2" fill="#15140f"/><circle cx="22" cy="15" r="2" fill="#15140f"/><path d="M13 23 h10" stroke="#f04e23" strokeWidth="2"/></svg>
  ),
}

const FAQ_ITEMS = [
  { q: "Do you come to me, or do I drop off my computer?", a: "Both. We do onsite visits across Orange County and remote support for most software issues. For hardware repairs you can drop off or we'll arrange pickup — whatever's easier." },
  { q: "How much does a repair cost?", a: "Diagnostics start at $89 and apply toward the repair if you go ahead. Networking and install jobs are quoted up front — you approve the price before we start. No surprise bills." },
  { q: "How fast can you help?", a: "Same-day for most remote support, and same-week for hardware repairs and onsite visits. Call (949) 998-2424 and we'll tell you the next available slot." },
  { q: "Do you work with businesses or just homes?", a: "Both. We handle home computers, WiFi, and cameras, and we run networking, IT support, and managed-IT plans for small offices across Orange County." },
  { q: "Can you actually recover my data?", a: "Often, yes — failing drives, deleted files, and water/crash damage. We assess first and tell you honestly whether it's recoverable before you spend a dime on recovery." },
  { q: "Where are you based?", a: "San Clemente, CA. We serve all of Orange County onsite, plus remote support anywhere." },
]

export default function Home({ services, cases, integrations }: Props) {
  return (
    <>
      <SEO
        title="IT Services, Computer Repair & Networking · Orange County"
        description="Orange County IT services — computer & Mac repair, networking and WiFi, IT support, and security camera installs. Same-day remote help. San Clemente, CA. (949) 998-2424."
        canonical="https://strategicsync.com"
        jsonLd={[localBusinessSchema()]}
      />
      <Navbar />
      <Hero
        kicker="Orange County IT · Computer Repair · Networking"
        headline={<>Computers fixed.<br/>WiFi that works.<br/>IT you can <em className="serif italic text-accent">actually call.</em></>}
        sub={<><strong className="text-ink">Onsite across Orange County, remote anywhere.</strong> Repairs, networking, IT support, and camera installs — done right.</>}
        aside={{ label: 'We service', body: integrations.slice(0, 8).map((i) => i.name).join(' · ') }}
        primaryCta={{ label: 'Book a service call', href: '/contact#book' }}
        secondaryCta={{ label: 'Or call (949) 998-2424', href: 'tel:949-998-2424' }}
      />

      <StatusStrip stats={statsData as any} />

      <section className="max-w-wrap mx-auto px-6 md:px-12 py-32">
        <div className="grid md:grid-cols-[120px_1fr_1fr] gap-12 mb-16">
          <div className="kicker">§ 02 — Services</div>
          <h2 className="display-l">What we <em className="text-accent serif italic">fix &amp; set up.</em></h2>
          <p className="body pt-3.5">From a single slow laptop to a whole office network. Every job starts with a clear diagnosis and an up-front price — you approve before we start.</p>
        </div>
        <div className="grid md:grid-cols-3 border-t border-rule">
          {services.map((s, i) => (
            <ServiceCard
              key={s.slug}
              num={String(i + 1).padStart(2, '0')}
              total={String(services.length).padStart(2, '0')}
              icon={ICONS[s.slug]}
              title={s.name}
              body={s.description}
              tags={s.tags}
              href={`/services/${s.slug}`}
            />
          ))}
        </div>
      </section>

      {cases.length > 0 && (
        <section className="max-w-wrap mx-auto px-6 md:px-12 py-32 border-t border-rule">
          <div className="grid md:grid-cols-[120px_1fr_1fr] gap-12 mb-16">
            <div className="kicker">§ 03 — Work</div>
            <h2 className="display-l">Recent <em className="text-accent serif italic">jobs.</em></h2>
            <p className="body pt-3.5">A sample of the kind of work we do across Orange County. Customer details anonymized for privacy.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {cases.slice(0, 3).map((c) => (
              <CaseStudyCard key={c.slug} industry={c.industry} client={c.client} outcome={c.outcome} metric={c.metric} metricLabel={c.metricLabel} href={`/work/${c.slug}`} />
            ))}
          </div>
        </section>
      )}

      <section className="max-w-wrap mx-auto px-6 md:px-12 py-32 border-t border-rule">
        <div className="grid md:grid-cols-[120px_1fr] gap-12 mb-12">
          <div className="kicker">§ 04 — FAQ</div>
          <h2 className="display-l">Common <em className="text-accent serif italic">questions.</em></h2>
        </div>
        <FAQ items={FAQ_ITEMS} />
      </section>

      <Footer />
    </>
  )
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const [services, cases, integrations] = await Promise.all([listServices(), listCases(), listIntegrations()])
  return { props: { services, cases, integrations } }
}
