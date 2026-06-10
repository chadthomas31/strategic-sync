import Link from 'next/link'
import SEO from '../components/SEO'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Hero from '../components/Hero'
import { breadcrumbs } from '../lib/seo'

const PHASES = [
  { num: '01', title: 'Diagnose', length: 'Same day', body: "Tell us what's wrong and we figure out why. Computer diagnostics are a flat $89, and most network or install jobs we can scope over the phone or a quick look." },
  { num: '02', title: 'Quote', length: 'Up front', body: "Before any work starts you get a clear, flat price — parts and labor. You approve it first. No surprise bills, no padded hours, no upselling you don't need." },
  { num: '03', title: 'Fix', length: 'Most jobs, 1 visit', body: "We do the work — onsite across Orange County or remote for software issues. Repairs done the same week, networking and installs usually in a single visit." },
  { num: '04', title: 'Follow Up', length: 'After every job', body: "We make sure it actually works, show you how to use it, and stand behind the work. Got a managed plan? We keep watching so the next problem never happens." },
]

export default function Approach() {
  return (
    <>
      <SEO title="Approach — How We Work" description="Four simple steps: Diagnose, Quote, Fix, Follow Up. Up-front pricing, no surprise bills, honest IT service across Orange County." jsonLd={[breadcrumbs([{ name: 'Home', href: '/' }, { name: 'Approach', href: '/approach' }])]} />
      <Navbar />
      <Hero kicker="§ 04 — Approach" headline={<>Four steps.<br/><em className="serif italic text-accent">No surprises.</em></>} sub="No padded hours, no upselling, no surprise bills. You get a clear diagnosis and a flat price before we touch anything." />
      <section className="max-w-wrap mx-auto px-6 md:px-12 pb-32">
        <div className="border-t border-rule">
          {PHASES.map((p) => (
            <div key={p.num} className="grid md:grid-cols-[120px_1fr_2fr] gap-8 py-16 border-b border-rule">
              <div>
                <div className="serif text-6xl font-light text-accent leading-none">{p.num}</div>
                <div className="kicker mt-3">{p.length}</div>
              </div>
              <h2 className="display-l">{p.title}</h2>
              <p className="body max-w-[640px]">{p.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-16 text-center">
          <Link href="/contact#book" className="btn-ink">Book your diagnostic →</Link>
        </div>
      </section>
      <Footer />
    </>
  )
}
