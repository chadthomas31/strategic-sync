import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import Link from 'next/link';

// Particle component for floating elements
const Particle: React.FC<{ delay: number; size: number; x: number; y: number }> = ({ delay, size, x, y }) => (
  <motion.div
    className="absolute rounded-full"
    style={{
      width: size,
      height: size,
      left: `${x}%`,
      top: `${y}%`,
      background: 'radial-gradient(circle, rgba(0, 240, 255, 0.6) 0%, transparent 70%)',
    }}
    initial={{ opacity: 0, scale: 0 }}
    animate={{
      opacity: [0, 1, 0],
      scale: [0.5, 1, 0.5],
      y: [0, -100, -200],
    }}
    transition={{
      duration: 8,
      delay,
      repeat: Infinity,
      ease: 'easeInOut',
    }}
  />
);

// Animated counter for stats
const AnimatedCounter: React.FC<{ value: string; label: string; suffix?: string }> = ({ value, label, suffix = '' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [displayValue, setDisplayValue] = useState('0');

  useEffect(() => {
    if (isInView) {
      const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''));
      const duration = 2000;
      const steps = 60;
      const increment = numericValue / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= numericValue) {
          setDisplayValue(value);
          clearInterval(timer);
        } else {
          if (value.includes('M')) {
            setDisplayValue(`$${Math.floor(current)}M`);
          } else if (value.includes('%')) {
            setDisplayValue(`${Math.floor(current)}%`);
          } else if (value.includes('+')) {
            setDisplayValue(`${Math.floor(current)}+`);
          } else {
            setDisplayValue(Math.floor(current).toString());
          }
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <div ref={ref} className="stat-item">
      <div className="stat-number">{displayValue}{suffix}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
};

const StrategicSyncHero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  const springY = useSpring(y, { stiffness: 100, damping: 30 });

  // Generate particles
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    delay: Math.random() * 5,
    size: Math.random() * 6 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
  }));

  const handleContactClick = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleServicesClick = () => {
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section ref={containerRef} className="hero">
      {/* Animated background elements */}
      <div className="hero-grid" />
      <div className="orb orb-cyan" />
      <div className="orb orb-gold" />
      <div className="orb orb-ember" />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <Particle key={particle.id} {...particle} />
        ))}
      </div>

      {/* Main content */}
      <motion.div
        className="container relative z-10"
        style={{ y: springY, opacity, scale }}
      >
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-screen py-32">
          {/* Left column - Text content */}
          <div className="space-y-8">
            {/* Eyebrow text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(0,240,255,0.3)] bg-[rgba(0,240,255,0.05)]"
            >
              <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-pulse" />
              <span className="text-sm text-[#00f0ff] font-medium tracking-wide uppercase">
                AI-Powered Business Transformation
              </span>
            </motion.div>

            {/* Main heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="heading-display"
            >
              Where Strategy
              <br />
              <span className="text-gradient-cyan">Meets AI</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl lg:text-2xl text-[#a0a0a0] max-w-xl leading-relaxed"
            >
              We don&apos;t just implement AI—we architect strategic advantages that 
              transform how your business operates, competes, and wins.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <button onClick={handleContactClick} className="btn-primary">
                Start Your Transformation
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
              <button onClick={handleServicesClick} className="btn-secondary">
                Explore Services
              </button>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="pt-8 flex items-center gap-6 text-[#666]"
            >
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-[#1a1a1a] bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] flex items-center justify-center text-xs font-bold text-[#00f0ff]"
                  >
                    {['G', 'M', 'A', 'F'][i - 1]}
                  </div>
                ))}
              </div>
              <span className="text-sm">
                Trusted by <span className="text-white font-semibold">Fortune 500</span> companies
              </span>
            </motion.div>
          </div>

          {/* Right column - Visual element */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="relative hidden lg:block"
          >
            {/* Glowing card */}
            <div className="relative">
              {/* Background glow */}
              <div className="absolute -inset-4 bg-gradient-to-r from-[#00f0ff]/20 via-transparent to-[#ffd700]/20 blur-3xl rounded-3xl" />
              
              {/* Main visual card */}
              <div className="relative bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-3xl border border-[rgba(255,255,255,0.08)] p-8 shadow-2xl">
                {/* Terminal header */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                  <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                  <span className="ml-4 text-[#666] text-sm font-mono">strategic-sync-ai.console</span>
                </div>

                {/* Animated code/metrics display */}
                <div className="space-y-4 font-mono text-sm">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 }}
                    className="flex items-center gap-3"
                  >
                    <span className="text-[#00f0ff]">→</span>
                    <span className="text-[#a0a0a0]">Analyzing business operations...</span>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.5 }}
                    className="pl-6 space-y-2"
                  >
                    <div className="flex justify-between">
                      <span className="text-[#666]">efficiency_gain:</span>
                      <span className="text-[#28c840] font-bold">+47%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#666]">cost_reduction:</span>
                      <span className="text-[#28c840] font-bold">$2.4M</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#666]">roi_multiplier:</span>
                      <span className="text-[#28c840] font-bold">8.2x</span>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 2 }}
                    className="flex items-center gap-3 pt-4 border-t border-[rgba(255,255,255,0.05)]"
                  >
                    <span className="text-[#ffd700]">✓</span>
                    <span className="text-[#ffd700]">Strategy deployment successful</span>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ delay: 2.5, duration: 1.5, repeat: Infinity }}
                    className="flex items-center gap-2 text-[#00f0ff]"
                  >
                    <span>→</span>
                    <span className="w-2 h-5 bg-[#00f0ff]" />
                  </motion.div>
                </div>
              </div>

              {/* Floating accent elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br from-[#00f0ff]/20 to-transparent rounded-2xl blur-sm"
              />
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-br from-[#ffd700]/20 to-transparent rounded-2xl blur-sm"
              />
            </div>
          </motion.div>
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-t border-[rgba(255,255,255,0.05)]"
        >
          <AnimatedCounter value="$50M+" label="Cost Savings Generated" />
          <AnimatedCounter value="200+" label="AI Implementations" />
          <AnimatedCounter value="98%" label="Client Satisfaction" />
          <AnimatedCounter value="8.2x" label="Average ROI" />
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-[#666]"
        >
          <span className="text-xs uppercase tracking-widest">Scroll to explore</span>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default StrategicSyncHero;
