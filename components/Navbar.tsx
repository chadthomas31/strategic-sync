import { useState, useEffect } from "react";
import Link from "next/link"; // ✅ Next.js routing
import Image from "next/image";
import { FiMenu, FiX } from "react-icons/fi";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Handle scrolling effect only after component is mounted
  useEffect(() => {
    setIsMounted(true);
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    // Initial check for scroll position
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full py-4 transition-all duration-300 shadow-lg ${
        isMounted && scrolled ? "bg-white shadow-md" : "bg-white"
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center group">
          <Image
            src="/images/concept_logo_4.png"
            alt="Strategic Sync"
            width={160}
            height={160}
            priority
            className="transition-all duration-300 hover:scale-105"
          />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8">
          <Link href="/" className="text-gray-900 hover:text-blue-600 text-lg font-semibold transition-colors duration-300">
            Home
          </Link>
          <Link href="/services" className="text-gray-900 hover:text-blue-600 text-lg font-semibold transition-colors duration-300">
            Services
          </Link>
          <Link href="/blog" className="text-gray-900 hover:text-blue-600 text-lg font-semibold transition-colors duration-300">
            Blog
          </Link>
          <Link href="/contact" className="text-gray-900 hover:text-blue-600 text-lg font-semibold transition-colors duration-300">
            Contact
          </Link>
          <Link href="/seo-dashboard" className="text-gray-900 hover:text-blue-600 text-lg font-semibold transition-colors duration-300">
            SEO
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gray-900 focus:outline-none hover:text-blue-600 transition-colors duration-300"
        >
          {isOpen ? <FiX size={28} /> : <FiMenu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white mt-2 py-4 px-8 shadow-lg">
          <div className="flex flex-col space-y-4">
            <Link
              href="/"
              className="text-gray-900 hover:text-blue-600 text-lg font-semibold transition-colors duration-300"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/services"
              className="text-gray-900 hover:text-blue-600 text-lg font-semibold transition-colors duration-300"
              onClick={() => setIsOpen(false)}
            >
              Services
            </Link>
            <Link
              href="/blog"
              className="text-gray-900 hover:text-blue-600 text-lg font-semibold transition-colors duration-300"
              onClick={() => setIsOpen(false)}
            >
              Blog
            </Link>
            <Link
              href="/contact"
              className="text-gray-900 hover:text-blue-600 text-lg font-semibold transition-colors duration-300"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
            <Link
              href="/seo-dashboard"
              className="text-gray-900 hover:text-blue-600 text-lg font-semibold transition-colors duration-300"
              onClick={() => setIsOpen(false)}
            >
              SEO
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}