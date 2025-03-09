import Link from "next/link";
import { useState } from "react";

export default function Contact() {
  // ✅ Explicitly define formData type
  const [formData, setFormData] = useState<{ name: string; email: string; message: string }>({
    name: "",
    email: "",
    message: "",
  });

  // ✅ Correctly type handleChange to prevent TypeScript errors
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      alert("Message sent! (This is a placeholder, integrate an email API)");
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again later.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Contact Us</h1>
      {/* Contact Info */}
      <div className="bg-gray-100 p-6 rounded-lg text-center mb-6">
        <p className="text-lg">📍 Location: San Clemente, CA</p>
        <p className="text-lg">📧 Email: contact@strategicsync.com</p>
        <p className="text-lg">📞 Phone: (949) 529-2424</p>
      </div>
      {/* Contact Form */}
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 max-w-lg mx-auto">
        <label className="block mb-2">Name:</label>
        <input 
          type="text" 
          name="name" 
          value={formData.name} 
          onChange={handleChange} 
          className="w-full p-2 border rounded mb-4" 
          required 
        />

        <label className="block mb-2">Email:</label>
        <input 
          type="email" 
          name="email" 
          value={formData.email} 
          onChange={handleChange} 
          className="w-full p-2 border rounded mb-4" 
          required 
        />

        <label className="block mb-2">Message:</label>
        <textarea 
          name="message" 
          value={formData.message} 
          onChange={handleChange} 
          className="w-full p-2 border rounded mb-4" 
          rows={4}  // ✅ Fixed: Changed rows="4" to rows={4}
          required 
        />

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg">Send Message</button>
      </form>
      {/* FAQ Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold text-center mb-4">Frequently Asked Questions</h2>
        <div className="bg-gray-100 p-4 rounded-lg">
          <p><strong>Q:</strong> How quickly do you respond to inquiries?</p>
          <p><strong>A:</strong> We aim to respond within 24 hours.</p>
          <hr className="my-3" />
          <p><strong>Q:</strong> Do you offer free consultations?</p>
          <p><strong>A:</strong> Yes! Book one on our <Link href="/booking" className="text-blue-500 underline">Booking Page</Link>.</p>
          <hr className="my-3" />
          <p><strong>Q:</strong> What industries do you specialize in for AI consulting?</p>
          <p><strong>A:</strong> We work with a wide range of industries, including finance, healthcare, e-commerce, and more.</p>
          <hr className="my-3" />
          <p><strong>Q:</strong> Can I get a custom AI solution for my business?</p>
          <p><strong>A:</strong> Absolutely! We specialize in custom AI model development to align with your company's objectives.</p>
          <hr className="my-3" />
          <p><strong>Q:</strong> What is the typical timeline for implementing an AI solution?</p>
          <p><strong>A:</strong> It depends on the complexity of the project, but most implementations take 4-12 weeks.</p>
          <hr className="my-3" />
          <p><strong>Q:</strong> Do you offer ongoing AI support and maintenance?</p>
          <p><strong>A:</strong> Yes, we offer ongoing support plans to ensure your AI solutions stay optimized and up-to-date.</p>
        </div>
      </div>
      {/* Back to Home Button */}
      <div className="text-center mt-10">
        <Link href="/" legacyBehavior>
          <button className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-700">
            Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
}