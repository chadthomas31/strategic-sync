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
  'ai-voice-agents': (
    <svg viewBox="0 0 36 36" className="w-9 h-9"><rect x="2" y="6" width="32" height="24" stroke="#15140f" strokeWidth="2" fill="none"/><circle cx="28" cy="10" r="3" fill="#f04e23"/></svg>
  ),
  'workflow-integration': (
    <svg viewBox="0 0 36 36" className="w-9 h-9"><path d="M4 18 L18 4 L32 18 L18 32 Z" stroke="#15140f" strokeWidth="2" fill="none"/><circle cx="18" cy="18" r="3" fill="#f04e23"/></svg>
  ),
  'custom-systems': (
    <svg viewBox="0 0 36 36" className="w-9 h-9"><rect x="4" y="4" width="28" height="28" stroke="#15140f" strokeWidth="2" fill="none"/><rect x="12" y="12" width="12" height="12" fill="#f04e23"/></svg>
  ),
}

const FAQ_ITEMS = [
  { q: 'How is this different from "an AI strategy consultancy"?', a: 'We ship working systems, not slide decks. Every engagement ends with software live in production and your team trained to own it.' },
  { q: "Do I need to replace my existing phone system?", a: "No. We deploy AI agents on top of whatever you already use — Sangoma, Yealink, RingCentral, traditional landlines. Your number stays the same." },
  { q: "What if the AI gets it wrong?", a: "Every interaction is logged and reviewable. Agents escalate to humans on uncertainty thresholds we set together. Guardrails are your call, not ours." },
  { q: "Do you sign 12-month contracts?", a: "No. Voice Agents are month-to-month. Integration Sprints are fixed-scope. Custom Builds are project-based with a defined end date." },
  { q: "Where are you based?", a: "San Clemente, CA. We work primarily with US-based businesses but have shipped projects internationally." },
]

export default function Home({ services, cases, integrations }: Props) {
  return (
    <>
      <SEO
        title="AI Automation & Integration"
        description="We wire AI into the systems you already run — phones, CRMs, billing, workflows. San Clemente, CA."
        canonical="https://strategicsync.com"
        jsonLd={[localBusinessSchema()]}
      />
      <Navbar />
      <Hero
        kicker="AI Automation · Integration · EST. 2023"
        headline={<>We wire AI<br/>into the systems<br/>you <em className="serif italic text-accent">already run.</em></>}
        sub={<><strong className="text-ink">Quietly. Reliably.</strong> Then we hand you the keys.</>}
        aside={{ label: 'Currently wired', body: integrations.slice(0, 8).map((i) => i.name).join(' · ') }}
        primaryCta={{ label: 'Start a project', href: '/contact#book' }}
        secondaryCta={{ label: 'Or call (949) 998-2424', href: 'tel:949-998-2424' }}
      />

      <StatusStrip stats={statsData as any} />

      <section className="max-w-wrap mx-auto px-6 md:px-12 py-32">
        <div className="grid md:grid-cols-[120px_1fr_1fr] gap-12 mb-16">
          <div className="kicker">§ 02 — Services</div>
          <h2 className="display-l">Three ways<br/>we <em className="text-accent serif italic">get hired.</em></h2>
          <p className="body pt-3.5">Each engagement starts with a 30-minute diagnostic call. If we can't ship measurable value inside 30 days, we won't take the project.</p>
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
            <h2 className="display-l">Things we <em className="text-accent serif italic">shipped.</em></h2>
            <p className="body pt-3.5">Selected case studies. Numbers are real. Names anonymized where contracts require.</p>
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
