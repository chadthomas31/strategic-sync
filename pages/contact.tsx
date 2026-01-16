import Link from 'next/link';
import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiArrowRight, FiCheck, FiChevronDown } from 'react-icons/fi';
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

// FAQ Accordion Item
const FAQItem: React.FC<{
  question: string;
  answer: React.ReactNode;
  isOpen: boolean;
  onClick: () => void;
}> = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="border-b border-[rgba(255,255,255,0.08)]">
      <button
        onClick={onClick}
        className="w-full py-6 flex items-center justify-between text-left hover:text-[#00f0ff] transition-colors"
      >
        <span className="font-semibold text-lg">{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <FiChevronDown className="w-5 h-5" />
        </motion.div>
      </button>
      <motion.div
        initial={false}
        animate={{
          height: isOpen ? 'auto' : 0,
          opacity: isOpen ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="pb-6 text-[#a0a0a0] leading-relaxed">
          {answer}
        </div>
      </motion.div>
    </div>
  );
};

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [status, setStatus] = useState({
    isSubmitting: false,
    isSubmitted: false,
    error: null as string | null,
  });

  const [openFAQ, setOpenFAQ] = useState<number | null>(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ isSubmitting: true, isSubmitted: false, error: null });

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
      setStatus({ isSubmitting: false, isSubmitted: true, error: null });

      setTimeout(() => {
        setStatus(prev => ({ ...prev, isSubmitted: false }));
      }, 5000);
    } catch (error) {
      console.error('Error sending message:', error);
      setStatus({
        isSubmitting: false,
        isSubmitted: false,
        error: error instanceof Error ? error.message : 'Failed to send message'
      });
    }
  };

  const faqs = [
    {
      question: 'How quickly do you respond to inquiries?',
      answer: 'We aim to respond to all inquiries within 24 business hours. For urgent matters, we recommend calling us directly.'
    },
    {
      question: 'Do you offer free consultations?',
      answer: (
        <>
          Yes! We offer a complimentary 30-minute discovery call to understand your needs and explore how we can help. 
          <Link href="/booking" className="text-[#00f0ff] hover:underline ml-1">Book your free consultation here</Link>.
        </>
      )
    },
    {
      question: 'What industries do you specialize in?',
      answer: 'We work with businesses across various sectors including finance, healthcare, e-commerce, retail, and technology. Our solutions are tailored to each industry\'s unique challenges and opportunities.'
    },
    {
      question: 'What is your typical project timeline?',
      answer: 'Project timelines vary based on complexity and scope. Most implementations take 4-12 weeks, with our agile approach ensuring you see value delivered incrementally throughout the engagement.'
    }
  ];

  return (
    <>
      <SEO
        title="Contact Us | Strategic Sync"
        description="Get in touch with Strategic Sync for AI consulting, implementation, and support services."
        path="/contact"
      />

      <div className="bg-[#0a0a0a] min-h-screen">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          {/* Background effects */}
          <div className="absolute inset-0">
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#00f0ff]/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#ffd700]/10 rounded-full blur-[100px]" />
          </div>

          <div className="container relative z-10">
            <AnimatedSection className="text-center max-w-4xl mx-auto">
              <span className="text-[#00f0ff] text-sm font-medium uppercase tracking-widest mb-4 block">
                Get In Touch
              </span>
              <h1 className="heading-display mb-6">
                Let&apos;s Start a <span className="text-gradient-cyan">Conversation</span>
              </h1>
              <p className="text-xl text-[#a0a0a0] max-w-2xl mx-auto">
                Ready to transform your business with AI? We&apos;re here to help you 
                every step of the way.
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* Contact Cards */}
        <section className="section section-mesh pt-0">
          <div className="container relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              {[
                {
                  icon: <FiMapPin className="w-6 h-6" />,
                  title: 'Location',
                  value: 'San Clemente, CA',
                  href: 'https://maps.google.com/?q=San+Clemente,+CA',
                  external: true
                },
                {
                  icon: <FiMail className="w-6 h-6" />,
                  title: 'Email',
                  value: 'contact@strategicsync.com',
                  href: 'mailto:contact@strategicsync.com',
                  external: false
                },
                {
                  icon: <FiPhone className="w-6 h-6" />,
                  title: 'Phone',
                  value: '(949) 529-2424',
                  href: 'tel:949-529-2424',
                  external: false
                }
              ].map((item, index) => (
                <motion.a
                  key={item.title}
                  href={item.href}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="card-feature group text-center"
                >
                  <div className="w-16 h-16 rounded-2xl bg-[rgba(0,240,255,0.1)] flex items-center justify-center mx-auto mb-4 text-[#00f0ff] group-hover:bg-[rgba(0,240,255,0.2)] transition-colors">
                    {item.icon}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-[#a0a0a0] group-hover:text-[#00f0ff] transition-colors">{item.value}</p>
                </motion.a>
              ))}
            </div>

            {/* Contact Form */}
            <div className="grid lg:grid-cols-2 gap-16">
              {/* Form */}
              <AnimatedSection>
                <div className="card-glass relative overflow-hidden">
                  <h2 className="heading-md mb-6">Send Us a Message</h2>
                  
                  {/* Success/Error messages */}
                  {status.isSubmitted && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-6 bg-gradient-to-r from-[#00f0ff] to-[#00b8d4] text-[#0a0a0a] p-4 rounded-xl font-medium flex items-center gap-2"
                    >
                      <FiCheck className="w-5 h-5" />
                      Message sent successfully! We&apos;ll get back to you soon.
                    </motion.div>
                  )}
                  {status.error && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-6 bg-red-500/20 border border-red-500/50 text-red-400 p-4 rounded-xl"
                    >
                      {status.error}
                    </motion.div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="form-label">Name</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
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
                          onChange={handleChange}
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
                        onChange={handleChange}
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
                        onChange={handleChange}
                        rows={5}
                        className="form-input resize-none"
                        placeholder="Tell us about your project..."
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={status.isSubmitting}
                      className={`btn-primary w-full justify-center ${
                        status.isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    >
                      {status.isSubmitting ? (
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

              {/* FAQ Section */}
              <AnimatedSection delay={0.2}>
                <h2 className="heading-md mb-8">
                  Frequently Asked <span className="text-gradient-cyan">Questions</span>
                </h2>
                
                <div className="space-y-0">
                  {faqs.map((faq, index) => (
                    <FAQItem
                      key={index}
                      question={faq.question}
                      answer={faq.answer}
                      isOpen={openFAQ === index}
                      onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                    />
                  ))}
                </div>

                {/* Book a call CTA */}
                <div className="mt-12 p-6 bg-gradient-to-br from-[#1a1a1a] to-[#111] rounded-2xl border border-[rgba(255,255,255,0.08)]">
                  <h3 className="font-semibold text-lg mb-2">Prefer to talk?</h3>
                  <p className="text-[#a0a0a0] mb-4">
                    Schedule a free 30-minute discovery call with our team.
                  </p>
                  <Link href="/booking" className="btn-secondary inline-flex">
                    Book a Call
                    <FiArrowRight className="ml-2" />
                  </Link>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <div className="container">
            <div className="pt-8 border-t border-[rgba(255,255,255,0.05)] flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-[#666] text-sm">
                © {new Date().getFullYear()} Strategic Sync. All rights reserved.
              </p>
              <div className="flex gap-6">
                <Link href="/" className="text-[#666] hover:text-[#00f0ff] transition-colors text-sm">
                  Home
                </Link>
                <Link href="/services" className="text-[#666] hover:text-[#00f0ff] transition-colors text-sm">
                  Services
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
