import SEO from '../components/SEO'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Hero from '../components/Hero'
import PricingTier from '../components/PricingTier'
import FAQ from '../components/FAQ'
import { breadcrumbs } from '../lib/seo'

const TIERS = [
  {
    name: 'By the Visit',
    tagline: 'One-time repairs, setups, and installs.',
    price: 'From $89',
    priceNote: 'Diagnostic; repairs quoted up front',
    includes: [
      'Computer & Mac diagnostics ($89, applied to repair)',
      'Virus / malware removal + tune-ups',
      'Data backup and recovery',
      'WiFi & networking setup (from $149)',
      'Security camera & smart-home installs (from $129)',
      'Up-front price — you approve before we start',
    ],
    excludes: [
      'Replacement parts (quoted separately at cost)',
      'Ongoing monitoring (see Managed IT)',
    ],
    cta: { label: 'Book a service call', href: '/contact#book' },
    featured: true,
  },
  {
    name: 'Hourly Support',
    tagline: 'Onsite or remote, when you need a hand.',
    price: '$95 / hr',
    priceNote: 'Remote or onsite, billed in 15-min increments',
    includes: [
      'Same-day remote support for most issues',
      'New computer setup + data migration',
      'Email, printer, and software troubleshooting',
      'Onsite visits across Orange County',
      'No trip charge within core service area',
      'Honest assessment — no upselling',
    ],
    excludes: [
      'After-hours emergency rate (quoted on request)',
      'Parts and hardware (at cost)',
    ],
    cta: { label: 'Get support', href: '/contact#book' },
  },
  {
    name: 'Managed IT',
    tagline: 'Flat monthly. We keep it all running.',
    price: 'From $299 / mo',
    priceNote: 'Per small office, scales with seats',
    includes: [
      'Proactive monitoring of computers + network',
      'Automated backups + security updates',
      'Priority same-day support',
      'Antivirus / endpoint protection managed',
      'Quarterly check-in + tech roadmap',
      'Discounted rates on projects + installs',
    ],
    excludes: [
      'New hardware purchases (at cost)',
      'Major one-time projects (quoted separately)',
    ],
    cta: { label: 'Get a managed quote', href: '/contact#book' },
  },
]

const FAQ_ITEMS = [
  { q: "Is the $89 diagnostic on top of the repair cost?", a: "No — if you go ahead with the repair, the $89 applies toward it. You only pay it on its own if you decide not to proceed." },
  { q: "Do you charge a trip fee for onsite visits?", a: "No trip charge within our core Orange County service area. For longer drives we'll tell you any travel fee up front before booking." },
  { q: "Can you give a price before starting?", a: "Yes. After a quick diagnosis we give you a flat quote. You approve the price before any work begins — no surprise bills." },
  { q: "What does Managed IT actually cover?", a: "We monitor your computers and network, run backups and security updates automatically, and give you priority support — so problems get caught before they take you down. Pricing scales with how many computers you have." },
]

export default function Pricing() {
  return (
    <>
      <SEO title="Pricing — Repairs, Support & Managed IT" description="Computer diagnostics from $89. Onsite & remote support $95/hr. Managed IT from $299/mo. Up-front pricing, no surprise bills. Orange County, CA." jsonLd={[breadcrumbs([{ name: 'Home', href: '/' }, { name: 'Pricing', href: '/pricing' }])]} />
      <Navbar />
      <Hero kicker="§ 07 — Pricing" headline={<>Clear pricing.<br/><em className="serif italic text-accent">No surprise bills.</em></>} sub="Pick how you want to work with us — one-time visit, hourly support, or a flat monthly plan. Every quote is confirmed before we start." />
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
