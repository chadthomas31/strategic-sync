import SEO from '../components/SEO'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Hero from '../components/Hero'
import PricingTier from '../components/PricingTier'
import FAQ from '../components/FAQ'
import { breadcrumbs } from '../lib/seo'

const TIERS = [
  {
    name: 'Voice Agent',
    tagline: 'AI receptionist on your existing number.',
    price: 'From $1,495',
    priceNote: 'Per month, month-to-month',
    includes: [
      'AI receptionist live in 2 weeks',
      'Custom intake script + brand voice',
      'CRM/calendar sync (HubSpot, Cal.com, etc.)',
      'Multilingual (English + Spanish)',
      'Full call recordings + transcripts',
      'Monthly script tuning',
    ],
    excludes: [
      'Custom integrations beyond standard CRMs (add Integration Sprint)',
      'Long-term contract',
    ],
    cta: { label: 'Book diagnostic', href: '/contact#book' },
    featured: true,
  },
  {
    name: 'Integration Sprint',
    tagline: '2-week build, fixed scope.',
    price: 'From $4,500',
    priceNote: 'One-time, fixed scope',
    includes: [
      'Discovery + integration audit',
      '1 production-grade workflow shipped',
      'n8n + Anthropic agent setup',
      'Slack/email/SMS handoff',
      'Documentation + 1hr training',
      '30 days post-launch tuning',
    ],
    excludes: [
      'Hosting (we deploy to your Vercel/n8n cloud)',
      'Ongoing retainer (available separately)',
    ],
    cta: { label: 'Scope a sprint', href: '/contact#book' },
  },
  {
    name: 'Custom Build',
    tagline: 'Bespoke system, your codebase.',
    price: 'From $15,000',
    priceNote: 'Project-based',
    includes: [
      'Discovery + technical architecture doc',
      'MVP build (Next.js + Supabase + your stack)',
      'RAG pipeline if applicable',
      'Auth + role-based access',
      'Production deploy + monitoring',
      'Code handoff + 2hr engineering training',
    ],
    excludes: [
      'Ongoing maintenance (retainer available)',
      'Third-party SaaS subscriptions',
    ],
    cta: { label: 'Discuss your project', href: '/contact#book' },
  },
]

const FAQ_ITEMS = [
  { q: "Why no enterprise contracts?", a: "Our work is supposed to make you independent, not locked in. Voice Agents are month-to-month so you can leave any time. Integration Sprints and Custom Builds end with documentation + training so your team owns it." },
  { q: "What if I need more than what's listed?", a: "Every tier can be customized. Pricing here is a starting point. After a 30-min diagnostic call we'll send a fixed quote." },
  { q: "Do you take equity?", a: "No. Cash only. We've found the founders most asking for equity-instead-of-fees are also the ones who couldn't pay even if they wanted to." },
  { q: "How do you handle data security?", a: "All client data stays in your infrastructure (your Supabase, your n8n, your Vercel). We don't operate a multi-tenant SaaS — your stack is yours." },
]

export default function Pricing() {
  return (
    <>
      <SEO title="Pricing — Productized AI Services" description="Voice Agent from $1,495/mo. Integration Sprint from $4,500. Custom Build from $15,000. Month-to-month, no enterprise contracts." jsonLd={[breadcrumbs([{ name: 'Home', href: '/' }, { name: 'Pricing', href: '/pricing' }])]} />
      <Navbar />
      <Hero kicker="§ 07 — Pricing" headline={<>Productized.<br/><em className="serif italic text-accent">No enterprise games.</em></>} sub="Three tiers. Real numbers. The price you see is the price you start at — final scope confirmed after a 30-min diagnostic." />
      <section className="max-w-wrap mx-auto px-6 md:px-12 pb-32">
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {TIERS.map((t) => <PricingTier key={t.name} {...t} />)}
        </div>
      </section>
      <section className="max-w-wrap mx-auto px-6 md:px-12 py-32 border-t border-rule">
        <div className="grid md:grid-cols-[120px_1fr] gap-12 mb-12">
          <div className="kicker">FAQ</div>
          <h2 className="display-l">Pricing <em className="text-accent serif italic">questions.</em></h2>
        </div>
        <FAQ items={FAQ_ITEMS} />
      </section>
      <Footer />
    </>
  )
}
