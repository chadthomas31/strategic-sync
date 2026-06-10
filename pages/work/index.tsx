import { GetStaticProps } from 'next'
import SEO from '../../components/SEO'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Hero from '../../components/Hero'
import CaseStudyCard from '../../components/CaseStudyCard'
import { listCases, type CaseFront } from '../../lib/content'
import { breadcrumbs, itemListSchema } from '../../lib/seo'

type Case = CaseFront & { content: string }

export default function WorkIndex({ cases }: { cases: Case[] }) {
  return (
    <>
      <SEO
        title="Work — Recent Jobs"
        description="A sample of recent IT work across Orange County — network installs, virus and ransomware recovery, office setups, and WiFi fixes."
        jsonLd={[
          breadcrumbs([{ name: 'Home', href: '/' }, { name: 'Work', href: '/work' }]),
          itemListSchema(cases.map((c) => ({ name: c.client, href: `/work/${c.slug}` }))),
        ]}
      />
      <Navbar />
      <Hero kicker="§ 03 — Work" headline={<>Recent <em className="serif italic text-accent">jobs.</em></>} sub="A sample of the kind of work we do across Orange County. Customer details anonymized for privacy." />
      <section className="max-w-wrap mx-auto px-6 md:px-12 pb-32">
        <div className="grid md:grid-cols-3 gap-6">
          {cases.map((c) => (
            <CaseStudyCard key={c.slug} industry={c.industry} client={c.client} outcome={c.outcome} metric={c.metric} metricLabel={c.metricLabel} href={`/work/${c.slug}`} />
          ))}
        </div>
      </section>
      <Footer />
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const cases = await listCases()
  return { props: { cases } }
}
