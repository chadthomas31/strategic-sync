import { useState, useEffect } from "react";
import Link from "next/link"; // ✅ Next.js routing
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
      className={`fixed top-0 w-full py-6 transition-all duration-300 shadow-lg ${
        isMounted && scrolled ? "bg-gray-800 shadow-md" : "bg-gray-900"
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-8">
        {/* ✅ Larger Logo */}
        <Link href="/" className="text-4xl font-extrabold text-white">
          Strategic Sync
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8">
          <Link href="/" className="text-white hover:text-blue-400 text-lg font-semibold">
            Home
          </Link>
          <Link href="/services" className="text-white hover:text-blue-400 text-lg font-semibold">
            Services
          </Link>
          <Link href="/blog" className="text-white hover:text-blue-400 text-lg font-semibold">
            Blog
          </Link>
          <Link href="/contact" className="text-white hover:text-blue-400 text-lg font-semibold">
            Contact
          </Link>
          <Link href="/seo-dashboard" className="text-white hover:text-blue-400 text-lg font-semibold">
            SEO
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white focus:outline-none"
        >
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-gray-800 mt-2 py-4 px-8">
          <div className="flex flex-col space-y-4">
            <Link
              href="/"
              className="text-white hover:text-blue-400 text-lg font-semibold"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/services"
              className="text-white hover:text-blue-400 text-lg font-semibold"
              onClick={() => setIsOpen(false)}
            >
              Services
            </Link>
            <Link
              href="/blog"
              className="text-white hover:text-blue-400 text-lg font-semibold"
              onClick={() => setIsOpen(false)}
            >
              Blog
            </Link>
            <Link
              href="/contact"
              className="text-white hover:text-blue-400 text-lg font-semibold"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
            <Link
              href="/seo-dashboard"
              className="text-white hover:text-blue-400 text-lg font-semibold"
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
