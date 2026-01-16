import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  FiCpu, FiTrendingUp, FiShield, FiBarChart, 
  FiDatabase, FiSettings, FiArrowRight, FiCheck,
  FiZap, FiLayers, FiGlobe, FiCode
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
}

const services: Service[] = [
  {
    icon: <FiCpu className="w-8 h-8" />,
    title: 'AI Strategy & Consulting',
    description: 'Develop a comprehensive AI roadmap tailored to your business objectives and market position.',
    features: [
      'AI readiness assessment',
      'Technology stack evaluation',
      'ROI projection modeling',
      'Implementation roadmap'
    ],
    gradient: 'from-[#00f0ff] to-[#00b8d4]'
  },
  {
    icon: <FiCode className="w-8 h-8" />,
    title: 'Custom AI Development',
    description: 'Build bespoke AI solutions engineered specifically for your unique business challenges.',
    features: [
      'Machine learning models',
      'Natural language processing',
      'Computer vision systems',
      'Predictive analytics'
    ],
    gradient: 'from-[#ffd700] to-[#ff6b35]'
  },
  {
    icon: <FiLayers className="w-8 h-8" />,
    title: 'AI Integration',
    description: 'Seamlessly integrate AI capabilities into your existing systems and workflows.',
    features: [
      'API development & integration',
      'Legacy system modernization',
      'Cloud migration support',
      'Real-time data pipelines'
    ],
    gradient: 'from-[#00f0ff] to-[#00b8d4]'
  },
  {
    icon: <FiTrendingUp className="w-8 h-8" />,
    title: 'Business Intelligence',
    description: 'Transform raw data into actionable insights that drive strategic decisions.',
    features: [
      'Dashboard development',
      'KPI tracking systems',
      'Automated reporting',
      'Data visualization'
    ],
    gradient: 'from-[#ffd700] to-[#ff6b35]'
  },
  {
    icon: <FiZap className="w-8 h-8" />,
    title: 'Process Automation',
    description: 'Automate repetitive tasks and workflows to increase efficiency and reduce costs.',
    features: [
      'Workflow automation',
      'Document processing',
      'Customer service bots',
      'Quality assurance AI'
    ],
    gradient: 'from-[#00f0ff] to-[#00b8d4]'
  },
  {
    icon: <FiShield className="w-8 h-8" />,
    title: 'AI Security & Compliance',
    description: 'Ensure your AI implementations meet industry standards and security requirements.',
    features: [
      'Security audits',
      'Compliance frameworks',
      'Data privacy protection',
      'Model governance'
    ],
    gradient: 'from-[#ffd700] to-[#ff6b35]'
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
      {/* Hover glow effect */}
      <div className={`absolute -inset-1 bg-gradient-to-r ${service.gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
      
      <div className="relative bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-2xl border border-[rgba(255,255,255,0.08)] p-8 h-full hover:border-[rgba(0,240,255,0.3)] transition-all duration-500">
        {/* Icon */}
        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.gradient} bg-opacity-10 flex items-center justify-center mb-6`}>
          <div className="text-[#00f0ff]">{service.icon}</div>
        </div>

        {/* Content */}
        <h3 className="text-2xl font-semibold mb-4 group-hover:text-[#00f0ff] transition-colors">
          {service.title}
        </h3>
        <p className="text-[#a0a0a0] mb-6 leading-relaxed">
          {service.description}
        </p>

        {/* Features */}
        <ul className="space-y-3 mb-8">
          {service.features.map((feature, i) => (
            <li key={i} className="flex items-center gap-3 text-[#666]">
              <FiCheck className="text-[#00f0ff] flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="flex items-center text-[#00f0ff] opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-2 transition-all">
          <span className="font-medium">Learn more</span>
          <FiArrowRight className="ml-2" />
        </div>
      </div>
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
                AI Solutions for <span className="text-gradient-cyan">Every Challenge</span>
              </h1>
              <p className="text-xl text-[#a0a0a0] max-w-2xl mx-auto">
                From strategy to implementation, we provide end-to-end AI services 
                that transform how your business operates and competes.
              </p>
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
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { step: '01', title: 'Discovery', desc: 'Deep dive into your business challenges and opportunities' },
                { step: '02', title: 'Strategy', desc: 'Develop a tailored AI roadmap with clear milestones' },
                { step: '03', title: 'Implementation', desc: 'Build and deploy solutions with agile methodology' },
                { step: '04', title: 'Optimization', desc: 'Continuous improvement and performance monitoring' }
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  {/* Connecting line */}
                  {index < 3 && (
                    <div className="hidden md:block absolute top-8 left-1/2 w-full h-[2px] bg-gradient-to-r from-[#00f0ff]/50 to-transparent" />
                  )}
                  
                  <div className="relative text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00f0ff] to-[#00b8d4] flex items-center justify-center mx-auto mb-4 text-[#0a0a0a] font-bold text-xl">
                      {item.step}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-[#666] text-sm">{item.desc}</p>
                  </div>
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
                  <h2 className="heading-xl mb-6">
                    Ready to Get <span className="text-gradient-cyan">Started?</span>
                  </h2>
                  <p className="text-xl text-[#a0a0a0] max-w-2xl mx-auto mb-8">
                    Let&apos;s discuss how our AI solutions can transform your business. 
                    Schedule a free consultation with our experts.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button onClick={handleContactClick} className="btn-primary">
                      Schedule Consultation
                      <FiArrowRight className="ml-2" />
                    </button>
                    <Link href="/booking" className="btn-secondary">
                      Book a Call
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
                © {new Date().getFullYear()} Strategic Sync. All rights reserved.
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
