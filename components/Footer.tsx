// components/Footer.tsx
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-rule mt-32">
      <div className="max-w-wrap mx-auto px-6 md:px-12 py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div>
          <div className="kicker mb-4">Strategic Sync</div>
          <p className="body-s max-w-[240px]">We wire AI into the systems you already run. San Clemente, CA.</p>
        </div>
        <div>
          <div className="kicker mb-4">Services</div>
          <ul className="space-y-2 text-[13px]">
            <li><Link href="/services/ai-voice-agents" className="text-ink hover:text-accent no-underline">AI Voice Agents</Link></li>
            <li><Link href="/services/workflow-integration" className="text-ink hover:text-accent no-underline">Workflow Integration</Link></li>
            <li><Link href="/services/custom-systems" className="text-ink hover:text-accent no-underline">Custom Systems</Link></li>
          </ul>
        </div>
        <div>
          <div className="kicker mb-4">Company</div>
          <ul className="space-y-2 text-[13px]">
            <li><Link href="/work" className="text-ink hover:text-accent no-underline">Work</Link></li>
            <li><Link href="/approach" className="text-ink hover:text-accent no-underline">Approach</Link></li>
            <li><Link href="/journal" className="text-ink hover:text-accent no-underline">Journal</Link></li>
            <li><Link href="/pricing" className="text-ink hover:text-accent no-underline">Pricing</Link></li>
          </ul>
        </div>
        <div>
          <div className="kicker mb-4">Contact</div>
          <ul className="space-y-2 text-[13px]">
            <li><a href="tel:949-998-2424" className="text-ink hover:text-accent no-underline">(949) 998-2424</a></li>
            <li><a href="mailto:contact@strategicsync.com" className="text-ink hover:text-accent no-underline">contact@strategicsync.com</a></li>
            <li><Link href="/contact#book" className="text-ink hover:text-accent no-underline">Book a call →</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-rule">
        <div className="max-w-wrap mx-auto px-6 md:px-12 py-5 flex justify-between mono text-[10px] tracking-[0.2em] uppercase text-mute">
          <span>© {new Date().getFullYear()} Strategic Sync</span>
          <span>SS · 949.998.2424</span>
        </div>
      </div>
    </footer>
  )
}
