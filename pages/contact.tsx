import Link from "next/link";
import { useState } from "react";
import SEO from '../components/SEO'
import { siteUrl } from '../seo.config'

export default function Contact() {
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    subject: string;
    message: string;
  }>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState({
    isSubmitting: false,
    isSubmitted: false,
    error: null as string | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ isSubmitting: true, isSubmitted: false, error: null });

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

      // Clear form and show success message
      setFormData({ name: '', email: '', subject: '', message: '' });
      setStatus({
        isSubmitting: false,
        isSubmitted: true,
        error: null
      });

      // Reset success message after 5 seconds
      setTimeout(() => {
        setStatus(prev => ({ ...prev, isSubmitted: false }));
      }, 5000);
    } catch (error) {
      console.error("Error sending message:", error);
      setStatus({
        isSubmitting: false,
        isSubmitted: false,
        error: error instanceof Error ? error.message : 'Failed to send message'
      });
    }
  };

  return (
    <>
      <SEO
        title="Contact Us | Strategic Sync"
        description="Get in touch with Strategic Sync for AI consulting, implementation, and support services."
        path="/contact"
      />
      <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Contact Us</h1>
      
      {/* Contact Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <a href="https://maps.google.com/?q=San+Clemente,+CA" 
           target="_blank" 
           rel="noopener noreferrer" 
           className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center">
          <div className="text-3xl mb-4">📍</div>
          <h3 className="font-semibold mb-2">Location</h3>
          <p>San Clemente, CA</p>
        </a>

        <a href="mailto:admin@2105.io" 
           className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center">
          <div className="text-3xl mb-4">📧</div>
          <h3 className="font-semibold mb-2">Email</h3>
          <p>admin@2105.io</p>
        </a>

        <a href="tel:949-529-2424" 
           className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center">
          <div className="text-3xl mb-4">📞</div>
          <h3 className="font-semibold mb-2">Phone</h3>
          <p>(949) 529-2424</p>
        </a>
      </div>

      {/* Contact Form */}
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8 max-w-2xl mx-auto relative">
        {status.isSubmitted && (
          <div className="absolute top-0 left-0 right-0 bg-green-500 text-white p-4 rounded-t-lg text-center">
            Message sent successfully! We&apos;ll get back to you soon.
          </div>
        )}
        {status.error && (
          <div className="absolute top-0 left-0 right-0 bg-red-500 text-white p-4 rounded-t-lg text-center">
            {status.error}
          </div>
        )}

        <div className="space-y-6 mt-4">
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">Name</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              required 
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">Email</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              required 
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">Subject</label>
            <input 
              type="text" 
              name="subject" 
              value={formData.subject} 
              onChange={handleChange} 
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              required 
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">Message</label>
            <textarea 
              name="message" 
              value={formData.message} 
              onChange={handleChange} 
              rows={4} 
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              required 
            />
          </div>

          <button 
            type="submit" 
            disabled={status.isSubmitting}
            className={`w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300 ${
              status.isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {status.isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </div>
      </form>

      {/* FAQ Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
          <div>
            <h3 className="font-semibold mb-2">How quickly do you respond to inquiries?</h3>
            <p className="text-gray-600">We aim to respond to all inquiries within 24 business hours.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Do you offer free consultations?</h3>
            <p className="text-gray-600">Yes! You can book a free consultation through our <Link href="/booking" className="text-blue-600 hover:underline">booking page</Link>.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">What industries do you specialize in?</h3>
            <p className="text-gray-600">We work with businesses across various sectors including finance, healthcare, e-commerce, and technology.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">What is your typical project timeline?</h3>
            <p className="text-gray-600">Project timelines vary based on complexity, but most implementations take 4-12 weeks.</p>
          </div>
        </div>
      </div>

      {/* Back to Home */}
      <div className="text-center mt-12">
        <Link href="/" className="inline-block bg-gray-800 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition duration-300">
          Back to Home
        </Link>
      </div>
      </div>
    </>
  );
}