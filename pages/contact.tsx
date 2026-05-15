import SEO from '../components/SEO'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Hero from '../components/Hero'
import ContactBlock from '../components/ContactBlock'
import { breadcrumbs, localBusinessSchema } from '../lib/seo'

export default function Contact() {
  return (
    <>
      <SEO title="Contact — Book a Diagnostic" description="Book a 30-min diagnostic call with Strategic Sync. (949) 998-2424. San Clemente, CA." jsonLd={[localBusinessSchema(), breadcrumbs([{ name: 'Home', href: '/' }, { name: 'Contact', href: '/contact' }])]} />
      <Navbar />
      <Hero kicker="§ 08 — Contact" headline={<>Let's see if we<br/><em className="serif italic text-accent">fit.</em></>} sub="Book a 30-minute diagnostic. We'll map your current stack, identify the highest-leverage automation, and tell you whether AI is the right answer. If it isn't, we'll say so." />
      <section className="py-16">
        <ContactBlock calLink="strategicsync/30min" />
      </section>
      <Footer />
    </>
  )
}
