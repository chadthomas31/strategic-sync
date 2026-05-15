import { GetStaticPaths, GetStaticProps } from 'next'
import SEO from '../../components/SEO'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Hero from '../../components/Hero'
import ContactBlock from '../../components/ContactBlock'
import { listServices, getService, type Service } from '../../lib/content'
import { breadcrumbs, serviceSchema } from '../../lib/seo'

export default function ServiceDetail({ service }: { service: Service }) {
  return (
    <>
      <SEO
        title={service.name}
        description={service.description}
        canonical={`https://strategicsync.com/services/${service.slug}`}
        jsonLd={[
          serviceSchema(service),
          breadcrumbs([{ name: 'Home', href: '/' }, { name: 'Services', href: '/services' }, { name: service.name, href: `/services/${service.slug}` }]),
        ]}
      />
      <Navbar />
      <Hero kicker={`§ Service · ${service.name}`} headline={<><em className="serif italic text-accent">{service.tagline}</em></>} sub={service.description} aside={{ label: 'Stack', body: service.tags.join(' · ') }} primaryCta={{ label: 'Book diagnostic', href: '/contact#book' }} />
      <section className="max-w-wrap mx-auto px-6 md:px-12 py-24 border-t border-rule">
        <div className="grid md:grid-cols-[120px_1fr_1fr] gap-12">
          <div className="kicker">Deliverables</div>
          <div>
            <h2 className="display-l mb-8">What you get.</h2>
            <ul className="space-y-4">
              {service.deliverables.map((d) => (
                <li key={d} className="body pl-6 relative before:absolute before:left-0 before:top-2 before:w-3 before:h-px before:bg-accent">{d}</li>
              ))}
            </ul>
          </div>
          <div>
            <div className="border border-rule p-8">
              <div className="kicker mb-3">Starting at</div>
              <div className="serif text-4xl font-light mb-4">{service.starting.replace(/^From /, '')}</div>
              <div className="kicker mb-2">Timeline</div>
              <div className="body mb-6">{service.timeline}</div>
              <div className="kicker mb-2">Best for</div>
              <p className="body-s">{service.buyerProfile}</p>
            </div>
          </div>
        </div>
      </section>
      <section className="py-32 border-t border-rule">
        <ContactBlock />
      </section>
      <Footer />
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const services = await listServices()
  return { paths: services.map((s) => ({ params: { slug: s.slug } })), fallback: false }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const service = await getService(params!.slug as string)
  if (!service) return { notFound: true }
  return { props: { service } }
}
