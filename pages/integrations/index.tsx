import { GetStaticProps } from 'next'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import SEO from '../../components/SEO'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Hero from '../../components/Hero'
import IntegrationTile from '../../components/IntegrationTile'
import { listIntegrations, type Integration } from '../../lib/content'
import { breadcrumbs, itemListSchema } from '../../lib/seo'

export default function IntegrationsIndex({ integrations }: { integrations: Integration[] }) {
  const [q, setQ] = useState('')
  const [cat, setCat] = useState<string>('All')

  const categories = useMemo(() => ['All', ...Array.from(new Set(integrations.map((i) => i.category))).sort()], [integrations])
  const filtered = integrations.filter((i) => (cat === 'All' || i.category === cat) && (q === '' || i.name.toLowerCase().includes(q.toLowerCase()) || i.useCase.toLowerCase().includes(q.toLowerCase())))

  return (
    <>
      <SEO
        title="Brands We Service — Hardware & Platforms We Support"
        description="Strategic Sync services Windows PCs, Apple/macOS, Ubiquiti UniFi, Synology, eero, Ring & Nest cameras, Microsoft 365, Google Workspace, QuickBooks, and more across Orange County."
        jsonLd={[
          breadcrumbs([{ name: 'Home', href: '/' }, { name: 'Brands', href: '/integrations' }]),
          itemListSchema(integrations.map((i) => ({ name: i.name, href: `/integrations/${i.slug}` }))),
        ]}
      />
      <Navbar />
      <Hero kicker="§ 05 — Brands" headline={<>The gear &amp; tools<br/><em className="serif italic text-accent">we support.</em></>} sub="Hardware, platforms, and apps we set up and service. Don't see yours? Ask — we work on just about everything." />
      <div className="max-w-wrap mx-auto px-6 md:px-12 pb-32">
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-start md:items-center">
          <input type="search" placeholder="Search brands…" value={q} onChange={(e) => setQ(e.target.value)} className="flex-1 bg-transparent border-b border-rule py-3 px-1 text-ink placeholder:text-mute focus:outline-none focus:border-accent" />
          <div className="flex gap-2 flex-wrap">
            {categories.map((c) => (
              <button key={c} onClick={() => setCat(c)} className={`mono text-[10px] tracking-[0.16em] uppercase px-3 py-1.5 border ${cat === c ? 'bg-ink text-paper border-ink' : 'border-rule text-ink-2 hover:border-ink'}`}>{c}</button>
            ))}
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {filtered.map((i) => <IntegrationTile key={i.slug} {...i} />)}
        </div>
        {filtered.length === 0 && <p className="body text-mute text-center py-16">No integrations match that filter. <Link href="/contact#book" className="text-accent">Ask us about it →</Link></p>}
      </div>
      <Footer />
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const integrations = await listIntegrations()
  return { props: { integrations } }
}
