import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FiArrowRight, FiCheck, FiClock, FiStar, FiUsers, FiShield, FiZap } from "react-icons/fi";
import SEO from '../components/SEO';

// Animated section wrapper
const AnimatedSection: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
}> = ({ children, className = '', delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.8, delay, ease: [0.4, 0, 0.2, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface BookingTier {
  title: string;
  duration: string;
  price: string;
  priceNote: string;
  description: string;
  features: string[];
  href: string;
  gradient: string;
  popular?: boolean;
  icon: React.ReactNode;
}

const tiers: BookingTier[] = [
  {
    title: 'Free AI Consultation',
    duration: '45 minutes',
    price: 'Free',
    priceNote: 'No credit card required',
    description: 'Explore how AI can benefit your business with a no-obligation discovery call.',
    features: [
      'Business needs assessment',
      'AI opportunity identification',
      'High-level recommendations',
      'Q&A with our consultants',
    ],
    href: 'https://cal.com/strategicsync/ai-consultation-45-min-free',
    gradient: 'from-[#00f0ff] to-[#00b8d4]',
    icon: <FiZap className="w-6 h-6" />,
  },
  {
    title: 'AI Readiness Assessment',
    duration: '90 minutes',
    price: '$299',
    priceNote: 'One-time investment',
    description: 'Get a comprehensive evaluation of your systems, data, and team readiness for AI integration.',
    features: [
      'Full systems & data audit',
      'Technology gap analysis',
      'Risk assessment report',
      'Prioritized action plan',
      'Written summary delivered',
    ],
    href: 'https://cal.com/strategicsync/ai-assessment',
    gradient: 'from-[#ffd700] to-[#ff6b35]',
    popular: true,
    icon: <FiUsers className="w-6 h-6" />,
  },
  {
    title: 'AI Strategy Session',
    duration: '120 minutes',
    price: '$499',
    priceNote: 'Applied to project cost',
    description: 'Walk away with a custom AI strategy and implementation roadmap built for your business.',
    features: [
      'Custom AI strategy document',
      'ROI projections & modeling',
      'Implementation roadmap',
      'Vendor & tool recommendations',
      'Executive-ready presentation',
      '30-day follow-up included',
    ],
    href: 'https://cal.com/strategicsync/ai-strategy-session',
    gradient: 'from-[#00f0ff] to-[#ffd700]',
    icon: <FiStar className="w-6 h-6" />,
  },
];

const testimonials = [
  {
    quote: "The AI readiness assessment saved us months of guesswork. We knew exactly where to start.",
    name: "Sarah K.",
    role: "VP of Operations, FinTech Startup",
  },
  {
    quote: "Strategic Sync's strategy session gave us a roadmap our entire leadership team aligned behind.",
    name: "Michael T.",
    role: "CTO, Healthcare Platform",
  },
  {
    quote: "The free consultation alone was more valuable than a paid session with another firm.",
    name: "David R.",
    role: "Founder, E-Commerce Brand",
  },
];

export default function Booking() {
  return (
    <>
      <SEO
        title="Book an AI Consultation | Strategic Sync"
        description="Choose the AI consulting session that best fits your needs. Free consultations available."
        path="/booking"
      />

      <div className="bg-[#0a0a0a] min-h-screen">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/3 w-96 h-96 bg-[#00f0ff]/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-[#ffd700]/10 rounded-full blur-[100px]" />
          </div>

          <div className="container relative z-10">
            <AnimatedSection className="text-center max-w-4xl mx-auto">
              <span className="text-[#00f0ff] text-sm font-medium uppercase tracking-widest mb-4 block">
                Book a Session
              </span>
              <h1 className="heading-display mb-6">
                Choose Your <span className="text-gradient-cyan">AI Consultation</span>
              </h1>
              <p className="text-xl text-[#a0a0a0] max-w-2xl mx-auto mb-6">
                Every engagement starts with understanding your business. Pick the session that
                matches where you are in your AI journey.
              </p>
              <div className="flex flex-wrap justify-center gap-6 text-sm text-[#666]">
                <div className="flex items-center gap-2">
                  <FiCheck className="text-[#00f0ff]" />
                  <span>No hidden fees</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiCheck className="text-[#00f0ff]" />
                  <span>Cancel or reschedule anytime</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiCheck className="text-[#00f0ff]" />
                  <span>100% satisfaction guarantee</span>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Booking Tiers */}
        <section className="section section-mesh pt-0">
          <div className="container relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {tiers.map((tier, index) => (
                <motion.div
                  key={tier.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15 }}
                  viewport={{ once: true }}
                  className="relative group"
                >
                  {/* Popular badge */}
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                      <span className="bg-gradient-to-r from-[#ffd700] to-[#ff6b35] text-[#0a0a0a] text-xs font-bold uppercase tracking-wider px-4 py-1 rounded-full flex items-center gap-1">
                        <FiStar className="w-3 h-3" /> Most Popular
                      </span>
                    </div>
                  )}

                  {/* Glow */}
                  <div className={`absolute -inset-1 bg-gradient-to-r ${tier.gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />

                  <motion.div
                    whileHover={{ y: -6 }}
                    className={`relative bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-2xl border ${tier.popular ? 'border-[rgba(255,215,0,0.3)]' : 'border-[rgba(255,255,255,0.08)]'} p-8 h-full flex flex-col hover:border-[rgba(0,240,255,0.3)] transition-all duration-500`}
                  >
                    {/* Icon */}
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tier.gradient} bg-opacity-10 flex items-center justify-center mb-6 text-[#00f0ff]`}>
                      {tier.icon}
                    </div>

                    <h3 className="text-xl font-semibold mb-2">{tier.title}</h3>

                    <div className="flex items-center gap-2 text-sm text-[#666] mb-4">
                      <FiClock className="w-4 h-4" />
                      <span>{tier.duration}</span>
                    </div>

                    {/* Price */}
                    <div className="mb-4 pb-4 border-b border-[rgba(255,255,255,0.06)]">
                      <span className={`text-3xl font-bold bg-gradient-to-r ${tier.gradient} bg-clip-text text-transparent`}>
                        {tier.price}
                      </span>
                      <span className="block text-xs text-[#666] mt-1">{tier.priceNote}</span>
                    </div>

                    <p className="text-[#a0a0a0] text-sm leading-relaxed mb-6">
                      {tier.description}
                    </p>

                    {/* Features */}
                    <ul className="space-y-3 mb-8 flex-grow">
                      {tier.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3 text-[#999] text-sm">
                          <FiCheck className="text-[#00f0ff] flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <motion.a
                      href={tier.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full text-center py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                        tier.popular
                          ? 'bg-gradient-to-r from-[#ffd700] to-[#ff6b35] text-[#0a0a0a] hover:shadow-[0_0_30px_rgba(255,215,0,0.3)]'
                          : 'bg-gradient-to-r from-[#00f0ff] to-[#00b8d4] text-[#0a0a0a] hover:shadow-[0_0_30px_rgba(0,240,255,0.3)]'
                      }`}
                    >
                      Book Now {tier.price !== 'Free' ? `- ${tier.price}` : ''}
                      <FiArrowRight />
                    </motion.a>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Social Proof / Testimonials */}
        <section className="section section-dark">
          <div className="container">
            <AnimatedSection className="text-center mb-12">
              <span className="text-[#ffd700] text-sm font-medium uppercase tracking-widest mb-4 block">
                Client Feedback
              </span>
              <h2 className="heading-xl mb-4">
                Trusted by <span className="text-gradient-gold">Industry Leaders</span>
              </h2>
              <p className="text-[#666] max-w-xl mx-auto">
                Hear from businesses that started with a single consultation and transformed their operations.
              </p>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] rounded-2xl border border-[rgba(255,255,255,0.06)] p-6"
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <FiStar key={i} className="w-4 h-4 text-[#ffd700] fill-current" />
                    ))}
                  </div>
                  <p className="text-[#a0a0a0] text-sm leading-relaxed mb-6 italic">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div>
                    <p className="font-semibold text-sm">{testimonial.name}</p>
                    <p className="text-[#666] text-xs">{testimonial.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Urgency / Availability */}
        <section className="py-16 border-y border-[rgba(255,255,255,0.05)]">
          <div className="container">
            <AnimatedSection className="text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(255,215,0,0.1)] border border-[rgba(255,215,0,0.2)] text-[#ffd700] text-sm font-medium mb-6">
                <span className="w-2 h-2 rounded-full bg-[#ffd700] animate-pulse" />
                Limited Availability This Month
              </div>
              <h3 className="text-2xl font-semibold mb-3">
                We take on a limited number of new clients each month to ensure quality.
              </h3>
              <p className="text-[#666] mb-8">
                Book your session now to secure your spot. Free consultations typically fill up within the first two weeks.
              </p>
              <motion.a
                href="https://cal.com/strategicsync/ai-consultation-45-min-free"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary inline-flex"
              >
                Claim Your Free Consultation
                <FiArrowRight className="ml-2" />
              </motion.a>
            </AnimatedSection>
          </div>
        </section>

        {/* Embedded Calendar */}
        <section className="section section-mesh">
          <div className="container relative z-10">
            <AnimatedSection className="text-center mb-10">
              <h2 className="heading-xl mb-4">
                Quick Book a <span className="text-gradient-cyan">Session</span>
              </h2>
              <p className="text-[#a0a0a0] max-w-xl mx-auto">
                Select a time that works for you directly from our calendar.
              </p>
            </AnimatedSection>
            <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden border border-[rgba(255,255,255,0.08)] bg-[#111]">
              <iframe
                src="https://cal.com/strategicsync"
                style={{ height: "700px", width: "100%", border: "none" }}
                title="Cal.com Booking"
              />
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <div className="container">
            <div className="pt-8 border-t border-[rgba(255,255,255,0.05)] flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-[#666] text-sm">
                &copy; {new Date().getFullYear()} Strategic Sync. All rights reserved.
              </p>
              <div className="flex gap-6">
                <Link href="/" className="text-[#666] hover:text-[#00f0ff] transition-colors text-sm">
                  Home
                </Link>
                <Link href="/services" className="text-[#666] hover:text-[#00f0ff] transition-colors text-sm">
                  Services
                </Link>
                <Link href="/contact" className="text-[#666] hover:text-[#00f0ff] transition-colors text-sm">
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
