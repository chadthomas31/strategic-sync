import React from "react";
import { motion } from "framer-motion";

const services = [
  {
    title: "AI Strategy & Consulting",
    description: "Custom AI strategies to optimize business workflows and improve efficiency.",
    icon: "📊",
  },
  {
    title: "Custom AI Model Development",
    description: "Specialized AI models tailored to unique business needs and industries.",
    icon: "🛠️",
  },
  {
    title: "AI Automation & Workflow Optimization",
    description: "Automate processes with intelligent AI-driven automation solutions.",
    icon: "⚙️",
  },
  {
    title: "AI-Powered Chatbot Development",
    description: "Enhance customer engagement with smart AI chatbots and voice assistants.",
    icon: "💬",
  },
  {
    title: "AI Data Analytics & Insights",
    description: "Leverage AI-driven analytics for better decision-making and business insights.",
    icon: "📈",
  },
  {
    title: "AI Voice & Speech Solutions",
    description: "Integrate AI-powered voice recognition and speech synthesis for enhanced interactions.",
    icon: "🎙️",
  },
];

export default function Services() {
  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800">Our AI Consulting Services</h1>
        <p className="text-gray-600 mt-2">Innovative AI solutions tailored for your business success.</p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            className="p-6 bg-white shadow-lg rounded-xl flex flex-col items-center text-center border border-gray-200"
          >
            <span className="text-4xl">{service.icon}</span>
            <h2 className="text-xl font-semibold text-gray-800 mt-4">{service.title}</h2>
            <p className="text-gray-600 mt-2">{service.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
