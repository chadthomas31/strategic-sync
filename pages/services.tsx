import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  FiCpu, FiTrendingUp, FiShield, FiBarChart,
  FiDatabase, FiSettings, FiArrowRight, FiCheck,
  FiZap, FiLayers, FiGlobe, FiCode, FiStar
} from 'react-icons/fi';
import Link from 'next/link';
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

interface Service {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  gradient: string;
  startingAt: string;
  popular?: boolean;
}

const services: Service[] = [
  {
    icon: <FiCpu className="w-8 h-8" />,
    title: 'AI Strategy & Consulting',
    description: 'Get a clear, actionable AI roadmap that aligns with your revenue goals and eliminates guesswork from your transformation journey.',
    features: [
      'AI readiness assessment',
      'Technology stack evaluation',
      'ROI projection modeling',
      'Implementation roadmap'
    ],
    gradient: 'from-[#00f0ff] to-[#00b8d4]',
    startingAt: 'Starting at $2,500'
  },
  {
    icon: <FiCode className="w-8 h-8" />,
    title: 'Custom AI Development',
    description: 'Purpose-built AI solutions that solve your specific business challenges and deliver measurable competitive advantages.',
    features: [
      'Machine learning models',
      'Natural language processing',
      'Computer vision systems',
      'Predictive analytics'
    ],
    gradient: 'from-[#ffd700] to-[#ff6b35]',
    startingAt: 'Starting at $10,000',
    popular: true
  },
  {
    icon: <FiLayers className="w-8 h-8" />,
    title: 'AI Integration',
    description: 'Connect AI capabilities to your existing stack without disruption. Start seeing results in weeks, not months.',
    features: [
      'API development & integration',
      'Legacy system modernization',
      'Cloud migration support',
      'Real-time data pipelines'
    ],
    gradient: 'from-[#00f0ff] to-[#00b8d4]',
    startingAt: 'Starting at $5,000'
  },
  {
    icon: <FiTrendingUp className="w-8 h-8" />,
    title: 'Business Intelligence',
    description: 'Turn raw data into revenue-driving insights. Make faster, smarter decisions backed by AI-powered analytics.',
    features: [
      'Dashboard development',
      'KPI tracking systems',
      'Automated reporting',
      'Data visualization'
    ],
    gradient: 'from-[#ffd700] to-[#ff6b35]',
    startingAt: 'Starting at $3,500'
  },
  {
    icon: <FiZap className="w-8 h-8" />,
    title: 'Process Automation',
    description: 'Reclaim hundreds of hours per month by automating repetitive workflows. Most clients see ROI within 90 days.',
    features: [
      'Workflow automation',
      'Document processing',
      'Customer service bots',
      'Quality assurance AI'
    ],
    gradient: 'from-[#00f0ff] to-[#00b8d4]',
    startingAt: 'Starting at $4,000'
  },
  {
    icon: <FiShield className="w-8 h-8" />,
    title: 'AI Security & Compliance',
    description: 'Deploy AI with confidence. We ensure your implementations meet every industry standard and security requirement.',
    features: [
      'Security audits',
      'Compliance frameworks',
      'Data privacy protection',
      'Model governance'
    ],
    gradient: 'from-[#ffd700] to-[#ff6b35]',
    startingAt: 'Starting at $3,000'
  }
];

const ServiceCard: React.FC<{ service: Service; index: number }> = ({ service, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative"
    >
      {/* Popular badge */}
      {service.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
          <span className="bg-gradient-to-r from-[#ffd700] to-[#ff6b35] text-[#0a0a0a] text-xs font-bold uppercase tracking-wider px-4 py-1 rounded-full flex items-center gap-1">
            <FiStar className="w-3 h-3" /> Most Popular
          </span>
        </div>
      )}

      {/* Hover glow effect */}
      <div className={`absolute -inset-1 bg-gradient-to-r ${service.gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />

      <motion.div
        whileHover={{ y: -8, transition: { duration: 0.3, ease: 'easeOut' } }}
        className={`relative bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-2xl border ${service.popular ? 'border-[rgba(255,215,0,0.3)]' : 'border-[rgba(255,255,255,0.08)]'} p-8 h-full hover:border-[rgba(0,240,255,0.3)] transition-all duration-500`}
      >
        {/* Icon */}
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.gradient} bg-opacity-10 flex items-center justify-center mb-6`}
        >
          <div className="text-[#00f0ff]">{service.icon}</div>
        </motion.div>

        {/* Content */}
        <h3 className="text-2xl font-semibold mb-3 group-hover:text-[#00f0ff] transition-colors">
          {service.title}
        </h3>
        <p className="text-[#a0a0a0] mb-6 leading-relaxed">
          {service.description}
        </p>

        {/* Pricing indicator */}
        <div className="mb-6 pb-6 border-b border-[rgba(255,255,255,0.06)]">
          <span className="text-[#ffd700] font-semibold text-lg">{service.startingAt}</span>
        </div>

        {/* Features */}
        <ul className="space-y-3 mb-8">
          {service.features.map((feature, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
              transition={{ delay: index * 0.1 + i * 0.05 + 0.3 }}
              className="flex items-center gap-3 text-[#999] group-hover:text-[#b0b0b0] transition-colors"
            >
              <FiCheck className="text-[#00f0ff] flex-shrink-0" />
              <span>{feature}</span>
            </motion.li>
          ))}
        </ul>

        {/* CTA */}
        <Link href="/contact" className="flex items-center text-[#00f0ff] font-medium group-hover:gap-3 gap-2 transition-all duration-300">
          <span>Get Started</span>
          <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </motion.div>
    </motion.div>
  );
};

const Services: React.FC = () => {
  const handleContactClick = () => {
    window.location.href = '/contact';
  };

  return (
    <>
      <SEO
        title="AI Consulting Services | Strategic Sync"
        description="Comprehensive AI solutions including strategy consulting, custom development, integration, and business intelligence services."
        path="/services"
      />

      <div className="bg-[#0a0a0a] min-h-screen">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          {/* Background effects */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00f0ff]/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#ffd700]/10 rounded-full blur-[100px]" />
          </div>

          <div className="container relative z-10">
            <AnimatedSection className="text-center max-w-4xl mx-auto">
              <span className="text-[#00f0ff] text-sm font-medium uppercase tracking-widest mb-4 block">
                Our Services
              </span>
              <h1 className="heading-display mb-6">
                AI Solutions That <span className="text-gradient-cyan">Drive Revenue</span>
              </h1>
              <p className="text-xl text-[#a0a0a0] max-w-2xl mx-auto mb-8">
                From strategy to deployment, our end-to-end AI services help businesses
                cut costs by 40%, automate workflows, and unlock new revenue streams.
              </p>
              <div className="flex flex-wrap justify-center gap-6 text-sm text-[#666]">
                <div className="flex items-center gap-2">
                  <FiCheck className="text-[#00f0ff]" />
                  <span>Free initial consultation</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiCheck className="text-[#00f0ff]" />
                  <span>90-day ROI guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiCheck className="text-[#00f0ff]" />
                  <span>Dedicated project manager</span>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Services Grid */}
        <section className="section section-mesh">
          <div className="container relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <ServiceCard key={service.title} service={service} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="section section-dark">
          <div className="container">
            <AnimatedSection className="text-center mb-16">
              <span className="text-[#ffd700] text-sm font-medium uppercase tracking-widest mb-4 block">
                Our Process
              </span>
              <h2 className="heading-xl mb-6">
                How We <span className="text-gradient-gold">Deliver Results</span>
              </h2>
              <p className="text-[#a0a0a0] max-w-2xl mx-auto">
                A proven 4-step methodology that has delivered measurable outcomes for over 100 businesses.
              </p>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { step: '01', title: 'Discovery', desc: 'We audit your systems, data, and processes to find the highest-impact AI opportunities' },
                { step: '02', title: 'Strategy', desc: 'You receive a tailored roadmap with clear milestones and projected ROI' },
                { step: '03', title: 'Implementation', desc: 'Our team builds and deploys your solution using agile sprints with weekly demos' },
                { step: '04', title: 'Optimization', desc: 'Continuous monitoring and refinement ensures your AI keeps delivering results' }
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15 }}
                  viewport={{ once: true }}
                  className="relative group"
                >
                  {/* Connecting line */}
                  {index < 3 && (
                    <div className="hidden md:block absolute top-8 left-1/2 w-full h-[2px] bg-gradient-to-r from-[#00f0ff]/50 to-transparent" />
                  )}

                  <div className="relative text-center">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00f0ff] to-[#00b8d4] flex items-center justify-center mx-auto mb-4 text-[#0a0a0a] font-bold text-xl shadow-[0_0_30px_rgba(0,240,255,0.2)]"
                    >
                      {item.step}
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-[#00f0ff] transition-colors">{item.title}</h3>
                    <p className="text-[#666] text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Social Proof Bar */}
        <section className="py-16 border-y border-[rgba(255,255,255,0.05)]">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { value: '150+', label: 'Projects Delivered' },
                { value: '40%', label: 'Avg. Cost Reduction' },
                { value: '98%', label: 'Client Satisfaction' },
                { value: '< 4 Weeks', label: 'Time to First Results' }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="text-3xl md:text-4xl font-bold text-gradient-cyan mb-2">{stat.value}</div>
                  <div className="text-[#666] text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section section-mesh">
          <div className="container relative z-10">
            <AnimatedSection>
              <div className="relative">
                {/* Background glow */}
                <div className="absolute -inset-4 bg-gradient-to-r from-[#00f0ff]/20 via-transparent to-[#ffd700]/20 blur-3xl rounded-3xl" />

                <div className="relative bg-gradient-to-br from-[#1a1a1a] to-[#111] rounded-3xl border border-[rgba(255,255,255,0.08)] p-12 md:p-16 text-center">
                  <h2 className="heading-xl mb-4">
                    Ready to <span className="text-gradient-cyan">Transform</span> Your Business?
                  </h2>
                  <p className="text-xl text-[#a0a0a0] max-w-2xl mx-auto mb-4">
                    Join 150+ companies already leveraging AI to outperform their competition.
                    Your free consultation is one click away.
                  </p>
                  <p className="text-sm text-[#666] mb-8">No commitment required. We will assess your needs and recommend a path forward.</p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <motion.button
                      onClick={handleContactClick}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                      className="btn-primary"
                    >
                      Get Your Free Consultation
                      <FiArrowRight className="ml-2" />
                    </motion.button>
                    <Link href="/booking" className="btn-secondary">
                      Book a Discovery Call
                    </Link>
                  </div>
                </div>
              </div>
            </AnimatedSection>
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
};

export default Services;
