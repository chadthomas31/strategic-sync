import React from "react";
import SEO from '../components/SEO'
import { siteUrl } from '../seo.config'

const Services: React.FC = () => {
  return (
    <>
      <SEO
        title="Our AI Consulting Services | Strategic Sync"
        description="Innovative AI solutions tailored for your business success."
        path="/services"
      />
      <div className="pt-20"> {/* Fix navbar overlap */}
      <h1 className="text-3xl font-bold text-center">
        Our AI Consulting Services
      </h1>
      <p className="text-center text-gray-600">
        Innovative AI solutions tailored for your business success.
      </p>

      {/* Service grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {servicesData.map((service) => (
          <div
            key={service.title}
            className="bg-white shadow-md rounded-lg p-6 text-center"
          >
            <div className="text-5xl mb-4">{service.icon}</div>
            <h2 className="text-xl font-semibold">{service.title}</h2>
            <p className="text-gray-600">{service.description}</p>
          </div>
        ))}
      </div>
      </div>
    </>
  );
};

// TypeScript Data Types
interface Service {
  title: string;
  description: string;
  icon: React.ReactElement; // ✅ Fix: Use React.ReactElement instead of JSX.Element
}

// Example Services Data
const servicesData: Service[] = [
  {
    title: "AI Strategy & Consulting",
    description: "Optimize business workflows with AI strategies.",
    icon: <span>📊</span>, // Replace with an actual icon component if needed
  },
  {
    title: "Custom AI Model Development",
    description: "Tailored AI models for business needs.",
    icon: <span>🤖</span>,
  },
  {
    title: "AI Automation & Workflow Optimization",
    description: "Automate processes with AI solutions.",
    icon: <span>⚙️</span>,
  },
];

export default Services;
