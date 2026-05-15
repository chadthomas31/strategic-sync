import Link from 'next/link'
import SEO from '../components/SEO'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Hero from '../components/Hero'
import { breadcrumbs } from '../lib/seo'

const PHASES = [
  { num: '01', title: 'Diagnose', length: '30 min', body: "A free call. We map your current stack, identify the highest-leverage automation, and tell you whether AI is even the right answer. If it isn't, we'll say so." },
  { num: '02', title: 'Pilot', length: '2 weeks', body: 'Fixed-scope build. We ship one working integration end-to-end so you can hold it in your hands before committing to a bigger engagement.' },
  { num: '03', title: 'Deploy', length: '1 week', body: "Production cutover. Real traffic. Monitoring, alerting, and human-in-the-loop guardrails wired up. We're on call during the transition." },
  { num: '04', title: 'Hand Off', length: '1 day', body: "Documentation, video walkthroughs, and 2 hours of training with your team. You own the system. We're available on retainer if you want us, but you don't need us." },
]

export default function Approach() {
  return (
    <>
      <SEO title="Approach — How We Work" description="Four phases: Diagnose, Pilot, Deploy, Hand Off. No 12-month contracts. No vendor lock-in." jsonLd={[breadcrumbs([{ name: 'Home', href: '/' }, { name: 'Approach', href: '/approach' }])]} />
      <Navbar />
      <Hero kicker="§ 04 — Approach" headline={<>Four phases.<br/><em className="serif italic text-accent">No lock-in.</em></>} sub="We don't sell retainers you can't escape. Every engagement is structured to end with you owning the system, not us holding it hostage." />
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
