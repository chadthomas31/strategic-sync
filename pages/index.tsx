import Navbar from "../components/Navbar";
import { useState, useEffect, ReactNode } from "react";
import { FiArrowUp, FiCpu, FiTrendingUp, FiShield, FiBarChart, FiDatabase, FiSettings, FiAward, FiUsers, FiTarget } from "react-icons/fi";
import dynamic from 'next/dynamic';
import { HTMLMotionProps } from "framer-motion";
import { format, parseISO } from "date-fns";
import Link from "next/link";

// Client-side only components with NoSSR
const ClientSideMotion = dynamic(
  () => import('../components/ClientSideMotion').then((mod) => mod.default),
  { ssr: false }
);

// Static components for server-side rendering
const StaticContent = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={className}>{children}</div>
);

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [showScroll, setShowScroll] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState({
    isSubmitting: false,
    isSubmitted: false,
    error: null
  });

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setShowScroll(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus({ isSubmitting: true, isSubmitted: false, error: null });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send message');
      }

      // Clear form after successful submission
      setFormData({ name: '', email: '', subject: '', message: '' });
      setFormStatus({
        isSubmitting: false,
        isSubmitted: true,
        error: null
      });

      // Reset success message after 5 seconds
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

  const services = [
    {
      icon: <FiCpu className="w-8 h-8 mb-4 text-blue-500" />,
      title: "AI Integration",
      description: "Custom AI solutions tailored to your business needs, from chatbots to predictive analytics."
    },
    {
      icon: <FiTrendingUp className="w-8 h-8 mb-4 text-blue-500" />,
      title: "Business Intelligence",
      description: "Transform your data into actionable insights with our advanced analytics solutions."
    },
    {
      icon: <FiShield className="w-8 h-8 mb-4 text-blue-500" />,
      title: "AI Security",
      description: "Ensure your AI implementations are secure and compliant with industry standards."
    },
    {
      icon: <FiBarChart className="w-8 h-8 mb-4 text-blue-500" />,
      title: "Performance Optimization",
      description: "Enhance your business processes with AI-driven optimization strategies."
    },
    {
      icon: <FiDatabase className="w-8 h-8 mb-4 text-blue-500" />,
      title: "Data Management",
      description: "Comprehensive data solutions for collecting, processing, and utilizing business data."
    },
    {
      icon: <FiSettings className="w-8 h-8 mb-4 text-blue-500" />,
      title: "AI Consulting",
      description: "Expert guidance on implementing AI solutions in your business workflow."
    }
  ];

  const blogPosts = [
    {
      title: "The Future of AI in Business",
      excerpt: "Discover how artificial intelligence is reshaping the business landscape and what it means for your company.",
      date: "2024-03-15",
      image: "/images/blog/ai-future.png",
      category: "AI Trends"
    },
    {
      title: "Maximizing ROI with AI Solutions",
      excerpt: "Learn how businesses are achieving remarkable returns on investment through strategic AI implementation.",
      date: "2024-03-10",
      image: "/images/blog/roi.png",
      category: "Business Strategy"
    },
    {
      title: "AI Security Best Practices",
      excerpt: "Essential security measures to protect your AI implementations and maintain data integrity.",
      date: "2024-03-05",
      image: "/images/blog/security.png",
      category: "Security"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "CTO, TechCorp",
      content: "Strategic Sync transformed our business operations with their AI solutions. We've seen a 40% increase in efficiency.",
      image: "/testimonials/sarah.jpg"
    },
    {
      name: "Michael Chen",
      role: "CEO, InnovateX",
      content: "The team's expertise in AI integration is unmatched. They delivered exactly what we needed, when we needed it.",
      image: "/testimonials/michael.jpg"
    },
    {
      name: "Emily Rodriguez",
      role: "Director of Operations, DataFlow",
      content: "Their AI consulting services helped us identify and implement the perfect solutions for our unique challenges.",
      image: "/testimonials/emily.jpg"
    }
  ];

  const caseStudies = [
    {
      company: "Global Retail Corp",
      challenge: "Inventory Management",
      solution: "AI-Powered Predictive Analytics",
      results: "32% reduction in stockouts, 45% improvement in inventory turnover",
      icon: <FiTarget className="w-12 h-12 text-blue-500" />
    },
    {
      company: "FinTech Solutions",
      challenge: "Customer Service",
      solution: "Advanced AI Chatbot Integration",
      results: "85% faster response time, 60% reduction in support tickets",
      icon: <FiUsers className="w-12 h-12 text-blue-500" />
    },
    {
      company: "Healthcare Plus",
      challenge: "Patient Data Analysis",
      solution: "Machine Learning Analytics Platform",
      results: "40% faster diagnosis rates, 25% improvement in patient outcomes",
      icon: <FiAward className="w-12 h-12 text-blue-500" />
    }
  ];

  const renderSection = (content: ReactNode, animationProps: HTMLMotionProps<"div"> = {}) => {
    return (
      <ClientSideMotion
        className="w-full"
        animationProps={{
          ...animationProps,
          initial: mounted && animationProps.initial !== undefined ? animationProps.initial : { opacity: 0 },
          animate: mounted && animationProps.animate !== undefined ? animationProps.animate : { opacity: 1 },
          whileInView: mounted && animationProps.whileInView !== undefined ? animationProps.whileInView : { opacity: 1 },
          whileHover: mounted && animationProps.whileHover !== undefined ? animationProps.whileHover : { scale: 1 },
        }}
      >
        {content}
      </ClientSideMotion>
    );
  };

  return (
    <div className="min-h-screen">
      <div className="relative min-h-screen">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('/images/landing.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 z-10" />
        <div className="relative z-20">
          <Navbar />
          <section id="home" className="flex flex-col items-center justify-center min-h-screen pt-24 text-center px-4">
            {renderSection(
              <div className="space-y-6 mx-auto max-w-4xl">
                <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6">
                  Transform Your Business<br />with Strategic AI Solutions
                </h1>
                <p className="text-xl md:text-2xl text-white mt-4 mx-auto max-w-2xl">
                  Unlock the power of AI-driven solutions to streamline operations,
                  boost efficiency, and drive growth for your business.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
                  <button 
                    className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:bg-gray-100 transition-all duration-300"
                    onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Get Started
                  </button>
                  <button 
                    className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-300"
                    onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Learn More
                  </button>
                </div>
              </div>,
              {
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                transition: { delay: 0.2 }
              }
            )}
          </section>
        </div>
      </div>

      <section id="services" className="py-20 px-4 bg-gray-50">
        {renderSection(
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Our Services</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Comprehensive AI solutions tailored to elevate your business performance
                and drive sustainable growth.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <div key={service.title}>
                  {renderSection(
                    <>
                      {service.icon}
                      <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                      <p className="text-gray-600">{service.description}</p>
                    </>,
                    {
                      initial: { opacity: 0, y: 20 },
                      whileInView: { opacity: 1, y: 0 },
                      transition: { delay: index * 0.1 },
                      viewport: { once: true }
                    }
                  )}
                </div>
              ))}
            </div>
          </div>,
          {
            initial: { opacity: 0 },
            whileInView: { opacity: 1 },
            transition: { duration: 0.8 },
            viewport: { once: true }
          }
        )}
      </section>

      <section className="py-20 px-4 bg-white">
        <StaticContent className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose Strategic Sync?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We combine cutting-edge AI technology with deep business expertise to deliver
              solutions that drive real results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {renderSection(
              <div className="bg-gray-50 p-8 rounded-xl">
                <h3 className="text-2xl font-semibold mb-4">Expert Team</h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <span className="text-blue-500 mr-2">✓</span>
                    Experienced AI specialists and data scientists
                  </li>
                  <li className="flex items-center">
                    <span className="text-blue-500 mr-2">✓</span>
                    Industry-specific knowledge and expertise
                  </li>
                  <li className="flex items-center">
                    <span className="text-blue-500 mr-2">✓</span>
                    Dedicated support and consultation
                  </li>
                </ul>
              </div>,
              {
                initial: { opacity: 0, x: -20 },
                whileInView: { opacity: 1, x: 0 },
                transition: { delay: 0.2 },
                viewport: { once: true }
              }
            )}

            {renderSection(
              <div className="bg-gray-50 p-8 rounded-xl">
                <h3 className="text-2xl font-semibold mb-4">Proven Results</h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <span className="text-blue-500 mr-2">✓</span>
                    Measurable ROI and performance metrics
                  </li>
                  <li className="flex items-center">
                    <span className="text-blue-500 mr-2">✓</span>
                    Customized solutions for your specific needs
                  </li>
                  <li className="flex items-center">
                    <span className="text-blue-500 mr-2">✓</span>
                    Continuous optimization and improvements
                  </li>
                </ul>
              </div>,
              {
                initial: { opacity: 0, x: 20 },
                whileInView: { opacity: 1, x: 0 },
                transition: { delay: 0.4 },
                viewport: { once: true }
              }
            )}
          </div>
        </StaticContent>
      </section>

      <section className="py-20 px-4 bg-gray-50">
        <StaticContent className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Success Stories</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See how we've helped businesses achieve remarkable results with AI solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {caseStudies.map((study, index) => (
              <div key={study.company}>
                {renderSection(
                  <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="flex justify-center mb-6">{study.icon}</div>
                    <h3 className="text-xl font-semibold mb-2">{study.company}</h3>
                    <p className="text-gray-600 mb-4">Challenge: {study.challenge}</p>
                    <p className="text-blue-600 mb-4">Solution: {study.solution}</p>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="font-semibold text-blue-800">Results:</p>
                      <p className="text-blue-600">{study.results}</p>
                    </div>
                  </div>,
                  {
                    initial: { opacity: 0, y: 20 },
                    whileInView: { opacity: 1, y: 0 },
                    transition: { delay: index * 0.1 },
                    viewport: { once: true },
                    whileHover: { y: -5 }
                  }
                )}
              </div>
            ))}
          </div>
        </StaticContent>
      </section>

      <section className="py-20 px-4 bg-white">
        <StaticContent className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">What Our Clients Say</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hear from businesses that have transformed their operations with our AI solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={testimonial.name}>
                {renderSection(
                  <div className="bg-gray-50 p-8 rounded-xl relative">
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                      <div className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center">
                        <span className="text-3xl">❝</span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-6 mt-6 italic">"{testimonial.content}"</p>
                    <div className="flex items-center">
                      <div className="flex-1">
                        <h4 className="font-semibold">{testimonial.name}</h4>
                        <p className="text-gray-500 text-sm">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>,
                  {
                    initial: { opacity: 0, y: 20 },
                    whileInView: { opacity: 1, y: 0 },
                    transition: { delay: index * 0.1 },
                    viewport: { once: true },
                    whileHover: { y: -5 }
                  }
                )}
              </div>
            ))}
          </div>
        </StaticContent>
      </section>

      <section id="blog" className="py-20 px-4 bg-gray-50">
        <StaticContent className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Latest Insights</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Stay updated with the latest trends and insights in AI and business technology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <div key={post.title}>
                {renderSection(
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="h-48 bg-gray-200 relative">
                      {post.image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="p-6">
                      <div className="text-sm text-blue-600 mb-2">{post.category}</div>
                      <h3 className="text-xl font-semibold mb-3">{post.title}</h3>
                      <p className="text-gray-600 mb-4">{post.excerpt}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          {format(parseISO(post.date), 'MMM d, yyyy')}
                        </span>
                        <Link href="/blog" className="text-blue-600 hover:text-blue-800 font-semibold">
                          Read More →
                        </Link>
                      </div>
                    </div>
                  </div>,
                  {
                    initial: { opacity: 0, y: 20 },
                    whileInView: { opacity: 1, y: 0 },
                    transition: { delay: index * 0.1 },
                    viewport: { once: true },
                    whileHover: { y: -5 }
                  }
                )}
              </div>
            ))}
          </div>
        </StaticContent>
      </section>

      <section id="contact" className="min-h-screen flex flex-col items-center justify-center bg-gray-300 pt-24 px-4 md:px-0">
        <StaticContent className="max-w-5xl w-full">
          <h2 className="text-4xl font-bold text-center mb-8">Contact Us</h2>
          <p className="text-gray-600 text-center mb-8">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
          
          <form className="space-y-6 bg-white p-8 rounded-lg shadow-lg relative max-w-3xl mx-auto" onSubmit={handleSubmit}>
            {formStatus.isSubmitted && (
              <div className="absolute top-0 left-0 right-0 bg-green-500 text-white p-3 rounded-t-lg text-center">
                Message sent successfully!
              </div>
            )}
            {formStatus.error && (
              <div className="absolute top-0 left-0 right-0 bg-red-500 text-white p-3 rounded-t-lg text-center">
                {formStatus.error}
              </div>
            )}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Your name"
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="your@email.com"
                required
              />
            </div>
            
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="What is this regarding?"
                required
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Your message here..."
                required
              ></textarea>
            </div>
            
            <button
              type="submit"
              disabled={formStatus.isSubmitting}
              className={`w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition duration-300 ${
                formStatus.isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {formStatus.isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-12 place-items-center px-4">
            {renderSection(
              <a href="https://maps.google.com/?q=San+Clemente,+CA" target="_blank" rel="noopener noreferrer" className="cursor-pointer w-full">
                <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-[300px] flex flex-col items-center text-center hover:shadow-xl transition-all duration-300">
                  <div className="text-blue-600 text-2xl mb-3">📍</div>
                  <h3 className="font-semibold mb-2">Company</h3>
                  <p className="text-gray-600">Strategic Sync</p>
                  <p className="text-gray-600">San Clemente, CA</p>
                </div>
              </a>,
              {
                initial: { opacity: 0 },
                whileInView: { opacity: 1 },
                transition: { duration: 0.8 },
                viewport: { once: true }
              }
            )}
            
            {renderSection(
              <a href="tel:949-529-2424" className="cursor-pointer w-full">
                <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-[300px] flex flex-col items-center text-center hover:shadow-xl transition-all duration-300">
                  <div className="text-blue-600 text-2xl mb-3">📞</div>
                  <h3 className="font-semibold mb-2">Phone</h3>
                  <p className="text-gray-600">949-529-2424</p>
                  <p className="text-blue-600 text-sm mt-2">Click to call</p>
                </div>
              </a>,
              {
                initial: { opacity: 0 },
                whileInView: { opacity: 1 },
                transition: { duration: 0.8 },
                viewport: { once: true }
              }
            )}
            
            {renderSection(
              <a href="mailto:contact@strategicsync.com" className="cursor-pointer w-full">
                <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-[300px] flex flex-col items-center text-center hover:shadow-xl transition-all duration-300">
                  <div className="text-blue-600 text-2xl mb-3">✉️</div>
                  <h3 className="font-semibold mb-2">Email</h3>
                  <p className="text-gray-600 break-words">contact@strategicsync.com</p>
                  <p className="text-blue-600 text-sm mt-2">Click to email</p>
                </div>
              </a>,
              {
                initial: { opacity: 0 },
                whileInView: { opacity: 1 },
                transition: { duration: 0.8 },
                viewport: { once: true }
              }
            )}
          </div>
        </StaticContent>
      </section>

      {mounted && showScroll && (
        <ClientSideMotion
          animationProps={{
            className: "fixed bottom-24 right-5 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300",
            initial: { opacity: 0, y: 50 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.5 },
            onClick: () => window.scrollTo({ top: 0, behavior: "smooth" })
          }}
        >
          <FiArrowUp size={24} />
        </ClientSideMotion>
      )}
    </div>
  );
}

