import { GetStaticPaths, GetStaticProps } from 'next'
import Link from 'next/link'
import SEO from '../../components/SEO'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Hero from '../../components/Hero'
import { listIntegrations, getIntegration, listServices, type Integration, type Service } from '../../lib/content'
import { breadcrumbs, serviceSchema } from '../../lib/seo'

type Props = { integration: Integration; relatedServices: Service[] }

export default function IntegrationDetail({ integration, relatedServices }: Props) {
  return (
    <>
      <SEO
        title={`${integration.name} Support & Setup`}
        description={`Strategic Sync supports ${integration.name}. ${integration.useCase}`}
        canonical={`https://strategicsync.com/integrations/${integration.slug}`}
        jsonLd={[
          serviceSchema({ name: `${integration.name} Support & Setup`, description: integration.useCase, slug: integration.slug }),
          breadcrumbs([{ name: 'Home', href: '/' }, { name: 'Brands', href: '/integrations' }, { name: integration.name, href: `/integrations/${integration.slug}` }]),
        ]}
      />
      <Navbar />
      <Hero kicker={`Brand · ${integration.category}`} headline={<>We service <em className="serif italic text-accent">{integration.name}</em></>} sub={integration.useCase} primaryCta={{ label: `Get help with ${integration.name}`, href: '/contact#book' }} />
      <section className="max-w-wrap mx-auto px-6 md:px-12 py-24 border-t border-rule grid md:grid-cols-2 gap-16">
        <div>
          <div className="kicker mb-6">What we handle</div>
          <ul className="space-y-4">
            {integration.details.map((d) => (
              <li key={d} className="body pl-6 relative before:absolute before:left-0 before:top-2 before:w-3 before:h-px before:bg-accent">{d}</li>
            ))}
          </ul>
        </div>
        <div>
          <div className="kicker mb-6">Related services</div>
          <div className="space-y-4">
            {relatedServices.map((s) => (
              <Link key={s.slug} href={`/services/${s.slug}`} className="block border border-rule p-6 hover:bg-paper-2 transition-colors no-underline text-ink">
                <h3 className="serif text-xl font-medium mb-2">{s.name}</h3>
                <p className="body-s">{s.tagline}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const items = await listIntegrations()
  return { paths: items.map((i) => ({ params: { slug: i.slug } })), fallback: false }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const integration = await getIntegration(params!.slug as string)
  if (!integration) return { notFound: true }
  const allServices = await listServices()
  const relatedServices = allServices.filter((s) => integration.relatedServices.includes(s.slug))
  return { props: { integration, relatedServices } }
}
