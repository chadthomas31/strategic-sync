import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { 
  FiArrowUp, FiCpu, FiTrendingUp, FiShield, 
  FiBarChart, FiDatabase, FiSettings, FiArrowRight,
  FiCheck, FiMail, FiPhone, FiMapPin,
  FiZap, FiTarget, FiUsers, FiAward
} from 'react-icons/fi';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import SEO from '../components/SEO';

// Dynamic imports
const StrategicSyncHero = dynamic(() => import('../components/StrategicSyncHero'), { ssr: false });

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

// Service card component
const ServiceCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}> = ({ icon, title, description, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="card-feature group cursor-pointer"
    >
      <div className="icon-glow mb-6">{icon}</div>
      <h3 className="heading-md mb-3 group-hover:text-[#00f0ff] transition-colors">
        {title}
      </h3>
      <p className="text-[#a0a0a0] leading-relaxed">{description}</p>
      <div className="mt-6 flex items-center text-[#00f0ff] opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-2 transition-all">
        <span className="text-sm font-medium">Learn more</span>
        <FiArrowRight className="ml-2" />
      </div>
    </motion.div>
  );
};

// Case study card
const CaseStudyCard: React.FC<{
  company: string;
  industry: string;
  result: string;
  metric: string;
  index: number;
}> = ({ company, industry, result, metric, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-[#00f0ff]/10 to-[#ffd700]/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative bg-gradient-to-br from-[#1a1a1a] to-[#111] rounded-2xl border border-[rgba(255,255,255,0.08)] p-8 h-full hover:border-[rgba(0,240,255,0.3)] transition-all duration-500">
        <div className="text-[#666] text-sm uppercase tracking-widest mb-2">{industry}</div>
        <h3 className="text-xl font-semibold mb-4">{company}</h3>
        <div className="stat-number text-4xl mb-2">{metric}</div>
        <p className="text-[#a0a0a0]">{result}</p>
      </div>
    </motion.div>
  );
};

// Testimonial card
const TestimonialCard: React.FC<{
  name: string;
  role: string;
  content: string;
  index: number;
}> = ({ name, role, content, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="testimonial-card"
    >
      <p className="testimonial-quote">{content}</p>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00f0ff] to-[#ffd700] flex items-center justify-center text-[#0a0a0a] font-bold text-lg">
          {name.charAt(0)}
        </div>
        <div>
          <div className="font-semibold">{name}</div>
          <div className="text-[#666] text-sm">{role}</div>
        </div>
      </div>
    </motion.div>
  );
};

// Form status interface
interface FormStatus {
  isSubmitting: boolean;
  isSubmitted: boolean;
  error: string | null;
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [showScroll, setShowScroll] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState<FormStatus>({
    isSubmitting: false,
    isSubmitted: false,
    error: null
  });

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setShowScroll(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus({ isSubmitting: true, isSubmitted: false, error: null });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send message');
      }

      setFormData({ name: '', email: '', subject: '', message: '' });
      setFormStatus({ isSubmitting: false, isSubmitted: true, error: null });

      setTimeout(() => {
        setFormStatus(prev => ({ ...prev, isSubmitted: false }));
      }, 5000);
    } catch (error) {
      console.error('Error sending message:', error);
      setFormStatus({
        isSubmitting: false,
        isSubmitted: false,
        error: error instanceof Error ? error.message : 'Failed to send message. Please try again.'
      });
    }
  };

  // Services data
  const services = [
    {
      icon: <FiCpu className="w-6 h-6" />,
      title: 'AI Integration',
      description: 'Seamlessly integrate cutting-edge AI solutions into your existing infrastructure for maximum impact.'
    },
    {
      icon: <FiTrendingUp className="w-6 h-6" />,
      title: 'Business Intelligence',
      description: 'Transform raw data into strategic insights that drive growth and competitive advantage.'
    },
    {
      icon: <FiShield className="w-6 h-6" />,
      title: 'AI Security',
      description: 'Enterprise-grade security protocols to protect your AI implementations and sensitive data.'
    },
    {
      icon: <FiBarChart className="w-6 h-6" />,
      title: 'Performance Analytics',
      description: 'Real-time monitoring and optimization to ensure peak AI system performance.'
    },
    {
      icon: <FiDatabase className="w-6 h-6" />,
      title: 'Data Engineering',
      description: 'Build robust data pipelines that fuel your AI initiatives with quality information.'
    },
    {
      icon: <FiSettings className="w-6 h-6" />,
      title: 'Strategic Consulting',
      description: 'Expert guidance on AI roadmap development and digital transformation strategy.'
    }
  ];

  // Case studies data
  const caseStudies = [
    {
      company: 'Fortune 500 Retailer',
      industry: 'Retail',
      result: 'Inventory optimization through predictive AI',
      metric: '-32%'
    },
    {
      company: 'FinTech Startup',
      industry: 'Finance',
      result: 'Customer service automation with AI chatbots',
      metric: '+85%'
    },
    {
      company: 'Healthcare Network',
      industry: 'Healthcare',
      result: 'Diagnostic accuracy improvement via ML',
      metric: '4.2x'
    }
  ];

  // Testimonials data
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'CTO, TechCorp',
      content: 'Strategic Sync transformed our operations. The ROI exceeded our expectations within the first quarter.'
    },
    {
      name: 'Michael Chen',
      role: 'CEO, InnovateX',
      content: 'Their expertise in AI integration is unmatched. They delivered exactly what we needed, when we needed it.'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Director of Ops, DataFlow',
      content: 'The team\'s strategic approach helped us identify opportunities we didn\'t know existed.'
    }
  ];

  // Why choose us data
  const whyChooseUs = [
    {
      icon: <FiZap className="w-6 h-6" />,
      title: 'Rapid Implementation',
      description: 'Get from strategy to production in weeks, not months.'
    },
    {
      icon: <FiTarget className="w-6 h-6" />,
      title: 'Measurable Results',
      description: 'Clear KPIs and ROI tracking from day one.'
    },
    {
      icon: <FiUsers className="w-6 h-6" />,
      title: 'Dedicated Team',
      description: 'Expert consultants assigned to your success.'
    },
    {
      icon: <FiAward className="w-6 h-6" />,
      title: 'Proven Track Record',
      description: '200+ successful AI implementations.'
    }
  ];

  return (
    <>
      <SEO
        title="Strategic Sync | AI Consulting & Business Transformation"
        description="Transform your business with AI that delivers measurable results. Strategic consulting, implementation, and optimization services."
        path="/"
        image="/images/og-image.jpg"
      />

      <div className="bg-[#0a0a0a] min-h-screen">
        {/* Hero Section */}
        <section id="home">
          <StrategicSyncHero />
        </section>

        {/* Services Section */}
        <section id="services" className="section section-mesh">
          <div className="container relative z-10">
            <AnimatedSection className="text-center mb-16">
              <span className="text-[#00f0ff] text-sm font-medium uppercase tracking-widest mb-4 block">
                What We Do
              </span>
              <h2 className="heading-xl mb-6">
                AI Solutions That <span className="text-gradient-cyan">Drive Results</span>
              </h2>
              <p className="text-xl text-[#a0a0a0] max-w-2xl mx-auto">
                Comprehensive AI services designed to transform every aspect of your business operations.
              </p>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <ServiceCard key={service.title} {...service} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="section section-dark">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <AnimatedSection>
                <span className="text-[#ffd700] text-sm font-medium uppercase tracking-widest mb-4 block">
                  Why Strategic Sync
                </span>
                <h2 className="heading-xl mb-6">
                  The Strategic <span className="text-gradient-gold">Advantage</span>
                </h2>
                <p className="text-xl text-[#a0a0a0] mb-8">
                  We combine deep AI expertise with business acumen to deliver solutions that 
                  create lasting competitive advantages.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {whyChooseUs.map((item, index) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-start gap-4"
                    >
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[rgba(255,215,0,0.1)] flex items-center justify-center text-[#ffd700]">
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">{item.title}</h4>
                        <p className="text-[#666] text-sm">{item.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.2}>
                <div className="relative">
                  {/* Background glow */}
                  <div className="absolute -inset-8 bg-gradient-to-r from-[#ffd700]/10 via-transparent to-[#00f0ff]/10 blur-3xl rounded-3xl" />
                  
                  {/* Stats grid */}
                  <div className="relative grid grid-cols-2 gap-4">
                    {[
                      { value: '98%', label: 'Client Retention' },
                      { value: '47%', label: 'Avg Efficiency Gain' },
                      { value: '$50M+', label: 'Cost Savings' },
                      { value: '8.2x', label: 'Average ROI' }
                    ].map((stat, index) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-br from-[#1a1a1a] to-[#111] rounded-2xl border border-[rgba(255,255,255,0.08)] p-6 text-center"
                      >
                        <div className="stat-number text-3xl">{stat.value}</div>
                        <div className="text-[#666] text-sm mt-2">{stat.label}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Case Studies Section */}
        <section className="section section-mesh">
          <div className="container relative z-10">
            <AnimatedSection className="text-center mb-16">
              <span className="text-[#00f0ff] text-sm font-medium uppercase tracking-widest mb-4 block">
                Success Stories
              </span>
              <h2 className="heading-xl mb-6">
                Transformations That <span className="text-gradient-cyan">Speak Volumes</span>
              </h2>
              <p className="text-xl text-[#a0a0a0] max-w-2xl mx-auto">
                Real results from real businesses that trusted us with their AI journey.
              </p>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {caseStudies.map((study, index) => (
                <CaseStudyCard key={study.company} {...study} index={index} />
              ))}
            </div>

            <AnimatedSection className="mt-12 text-center">
              <Link href="/services" className="btn-secondary inline-flex">
                View All Case Studies
                <FiArrowRight className="ml-2" />
              </Link>
            </AnimatedSection>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="section section-dark">
          <div className="container">
            <AnimatedSection className="text-center mb-16">
              <span className="text-[#ffd700] text-sm font-medium uppercase tracking-widest mb-4 block">
                Client Voices
              </span>
              <h2 className="heading-xl mb-6">
                What Our <span className="text-gradient-gold">Partners Say</span>
              </h2>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard key={testimonial.name} {...testimonial} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="section section-mesh">
          <div className="container relative z-10">
            <div className="grid lg:grid-cols-2 gap-16">
              {/* Contact Info */}
              <AnimatedSection>
                <span className="text-[#00f0ff] text-sm font-medium uppercase tracking-widest mb-4 block">
                  Get In Touch
                </span>
                <h2 className="heading-xl mb-6">
                  Ready to <span className="text-gradient-cyan">Transform?</span>
                </h2>
                <p className="text-xl text-[#a0a0a0] mb-8">
                  Let&apos;s discuss how AI can revolutionize your business. 
                  Our experts are ready to help you take the next step.
                </p>

                <div className="space-y-6">
                  <a href="tel:949-529-2424" className="flex items-center gap-4 text-[#a0a0a0] hover:text-[#00f0ff] transition-colors group">
                    <div className="w-12 h-12 rounded-xl bg-[rgba(0,240,255,0.1)] flex items-center justify-center text-[#00f0ff] group-hover:bg-[rgba(0,240,255,0.2)] transition-colors">
                      <FiPhone className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm text-[#666]">Phone</div>
                      <div className="font-medium text-white">949-529-2424</div>
                    </div>
                  </a>

                  <a href="mailto:contact@strategicsync.com" className="flex items-center gap-4 text-[#a0a0a0] hover:text-[#00f0ff] transition-colors group">
                    <div className="w-12 h-12 rounded-xl bg-[rgba(0,240,255,0.1)] flex items-center justify-center text-[#00f0ff] group-hover:bg-[rgba(0,240,255,0.2)] transition-colors">
                      <FiMail className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm text-[#666]">Email</div>
                      <div className="font-medium text-white">contact@strategicsync.com</div>
                    </div>
                  </a>

                  <div className="flex items-center gap-4 text-[#a0a0a0]">
                    <div className="w-12 h-12 rounded-xl bg-[rgba(0,240,255,0.1)] flex items-center justify-center text-[#00f0ff]">
                      <FiMapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm text-[#666]">Location</div>
                      <div className="font-medium text-white">San Clemente, California</div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              {/* Contact Form */}
              <AnimatedSection delay={0.2}>
                <div className="card-glass relative overflow-hidden">
                  {/* Success/Error messages */}
                  {formStatus.isSubmitted && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-0 left-0 right-0 bg-gradient-to-r from-[#00f0ff] to-[#00b8d4] text-[#0a0a0a] p-4 font-medium flex items-center justify-center gap-2"
                    >
                      <FiCheck className="w-5 h-5" />
                      Message sent successfully!
                    </motion.div>
                  )}
                  {formStatus.error && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-0 left-0 right-0 bg-red-500 text-white p-4 font-medium text-center"
                    >
                      {formStatus.error}
                    </motion.div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="form-label">Name</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="form-input"
                          placeholder="John Doe"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="form-input"
                          placeholder="john@company.com"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className="form-label">Subject</label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="How can we help?"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="form-label">Message</label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={4}
                        className="form-input resize-none"
                        placeholder="Tell us about your project..."
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={formStatus.isSubmitting}
                      className={`btn-primary w-full justify-center ${
                        formStatus.isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    >
                      {formStatus.isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <FiArrowRight className="ml-2" />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
              {/* Brand */}
              <div className="md:col-span-2">
                <Image
                  src="/images/concept_logo_4.png"
                  alt="Strategic Sync"
                  width={120}
                  height={120}
                  className="brightness-0 invert opacity-80 mb-4"
                />
                <p className="text-[#666] max-w-sm">
                  Transforming businesses through strategic AI implementation. 
                  Your partner in digital evolution.
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  {['Services', 'Blog', 'Contact', 'Booking'].map((link) => (
                    <li key={link}>
                      <Link href={`/${link.toLowerCase()}`} className="footer-link">
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h4 className="font-semibold mb-4">Contact</h4>
                <ul className="space-y-2 text-[#666]">
                  <li>San Clemente, CA</li>
                  <li>
                    <a href="tel:949-529-2424" className="footer-link">949-529-2424</a>
                  </li>
                  <li>
                    <a href="mailto:contact@strategicsync.com" className="footer-link">
                      contact@strategicsync.com
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="pt-8 border-t border-[rgba(255,255,255,0.05)] flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-[#666] text-sm">
                © {new Date().getFullYear()} Strategic Sync. All rights reserved.
              </p>
              <div className="flex gap-6">
                <a href="#" className="text-[#666] hover:text-[#00f0ff] transition-colors text-sm">
                  Privacy Policy
                </a>
                <a href="#" className="text-[#666] hover:text-[#00f0ff] transition-colors text-sm">
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
        </footer>

        {/* Scroll to top button */}
        {mounted && showScroll && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-[#00f0ff] text-[#0a0a0a] flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all z-50"
          >
            <FiArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </div>
    </>
  );
}
