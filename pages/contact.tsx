import SEO from '../components/SEO'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Hero from '../components/Hero'
import ContactBlock from '../components/ContactBlock'
import { breadcrumbs, localBusinessSchema } from '../lib/seo'

export default function Contact() {
  return (
    <>
      <SEO title="Contact — Book a Service Call" description="Book IT service with Strategic Sync — computer repair, networking, IT support & camera installs across Orange County. Call (949) 998-2424. San Clemente, CA." jsonLd={[localBusinessSchema(), breadcrumbs([{ name: 'Home', href: '/' }, { name: 'Contact', href: '/contact' }])]} />
      <Navbar />
      <Hero kicker="§ 08 — Contact" headline={<>Let&apos;s get it<br/><em className="serif italic text-accent">fixed.</em></>} sub="Tell us what's going on — a slow computer, dead WiFi, a network to set up, cameras to install. Book online or call (949) 998-2424 and we'll get you scheduled." />
      <section className="py-16">
        <ContactBlock calLink="strategicsync/it-service-call" />
      </section>
      <Footer />
    </>
  )
}
