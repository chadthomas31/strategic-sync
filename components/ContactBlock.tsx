// components/ContactBlock.tsx
import { useEffect, useState } from 'react'
import Cal, { getCalApi } from '@calcom/embed-react'

export default function ContactBlock({ calLink = 'strategicsync/30min' }: { calLink?: string }) {
  useEffect(() => {
    ;(async () => {
      try {
        const cal = await getCalApi()
        cal('ui', { theme: 'light', styles: { branding: { brandColor: '#f04e23' } } } as any)
      } catch (e) {
        // Cal API surface changes between versions; styling is non-critical
      }
    })()
  }, [])

  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setStatus(res.ok ? 'sent' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="max-w-wrap mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-12 md:gap-16">
      <div id="book">
        <div className="kicker mb-4">Book a 30-min diagnostic</div>
        <h2 className="display-l mb-6">Skip the form. <em className="text-accent">Pick a slot.</em></h2>
        <div className="border border-rule">
          <Cal calLink={calLink} style={{ width: '100%', height: '600px' }} config={{ theme: 'light' }} />
        </div>
      </div>
      <div>
        <div className="kicker mb-4">Or send a note</div>
        <form onSubmit={submit} className="space-y-5">
          <input required placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full bg-transparent border-b border-rule py-3 text-ink placeholder:text-mute focus:outline-none focus:border-accent" />
          <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full bg-transparent border-b border-rule py-3 text-ink placeholder:text-mute focus:outline-none focus:border-accent" />
          <textarea required placeholder="What are you trying to ship?" rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full bg-transparent border-b border-rule py-3 text-ink placeholder:text-mute focus:outline-none focus:border-accent resize-none" />
          <button type="submit" disabled={status === 'sending'} className="btn-ink">
            {status === 'sending' ? 'Sending…' : status === 'sent' ? 'Sent ✓' : 'Send note →'}
          </button>
          {status === 'error' && <p className="body-s text-accent">Send failed. Try email instead: contact@strategicsync.com</p>}
        </form>
        <div className="mt-12 space-y-2 body-s">
          <div><strong className="text-ink">Phone:</strong> <a href="tel:949-998-2424" className="hover:text-accent">(949) 998-2424</a></div>
          <div><strong className="text-ink">Email:</strong> <a href="mailto:contact@strategicsync.com" className="hover:text-accent">contact@strategicsync.com</a></div>
          <div><strong className="text-ink">Based in:</strong> San Clemente, CA</div>
          <div><strong className="text-ink">Hours:</strong> Mon–Fri, 9a–6p Pacific</div>
        </div>
      </div>
    </div>
  )
}
