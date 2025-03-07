import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FiArrowUp } from "react-icons/fi";

export default function Home() {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== "undefined") {
        setShowScroll(window.scrollY > 300);
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Background Gradient Wrapper */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 min-h-screen">
        <Navbar />
        <motion.section
          id="home"
          className="flex flex-col items-center justify-center min-h-screen pt-24 text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl font-extrabold text-white">
            Welcome to Strategic Sync
          </h1>
          <p className="text-xl text-white mt-4">
            Unlock the power of AI-driven solutions to streamline and elevate
            your business operations.
          </p>
          <button 
            className="mt-6 px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:bg-gray-200 transition-all duration-300"
            onClick={() => console.log('Get Started clicked')}
          >
            Get Started
          </button>
        </motion.section>
      </div>

      {/* Sections Below the Banner */}
      <motion.section
        id="services"
        className="min-h-screen flex items-center justify-center bg-gray-100 pt-24 text-center"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl font-bold">Our Services</h2>
      </motion.section>

      <motion.section
        id="blog"
        className="min-h-screen flex items-center justify-center bg-gray-200 pt-24 text-center"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl font-bold">Our Blog</h2>
      </motion.section>

      <motion.section
        id="contact"
        className="min-h-screen flex items-center justify-center bg-gray-300 pt-24 text-center"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl font-bold">Contact Us</h2>
      </motion.section>

      {/* Scroll to Top Button */}
      {showScroll && (
        <motion.button
          className="fixed bottom-5 right-5 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300"
          onClick={scrollToTop}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <FiArrowUp size={24} />
        </motion.button>
      )}
    </div>
  );
}

