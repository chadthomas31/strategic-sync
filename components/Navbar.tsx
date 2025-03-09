import { useState, useEffect } from "react";
import Link from "next/link"; // ✅ Next.js routing
import { FiMenu, FiX } from "react-icons/fi";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scrolling effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full py-6 transition-all duration-300 shadow-lg ${
        scrolled ? "bg-gray-800 shadow-md" : "bg-gray-900"
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-8">
        {/* ✅ Larger Logo */}
        <Link href="/" className="text-4xl font-extrabold text-white">
          Strategic Sync
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-8">
          <li>
            <Link href="/" legacyBehavior>
              <span className="cursor-pointer hover:text-blue-400 text-white text-2xl font-semibold">
                Home
              </span>
            </Link>
          </li>
          <li>
            <Link href="/services" legacyBehavior>
              <span className="cursor-pointer hover:text-blue-400 text-white text-2xl font-semibold">
                Services
              </span>
            </Link>
          </li>
          <li>
            <Link href="/blog" legacyBehavior>
              <span className="cursor-pointer hover:text-blue-400 text-white text-2xl font-semibold">
                Blog
              </span>
            </Link>
          </li>
          <li>
            <Link href="/contact" legacyBehavior>
              <span className="cursor-pointer hover:text-blue-400 text-white text-2xl font-semibold">
                Contact
              </span>
            </Link>
          </li>
          <li>
            <Link href="/booking" legacyBehavior>
              <span className="cursor-pointer hover:text-blue-400 text-white text-2xl font-semibold">
                Booking
              </span>
            </Link>
          </li>
          <li>
            <Link href="/client-login" legacyBehavior>
              <span className="cursor-pointer hover:text-blue-400 text-white text-2xl font-semibold">
                Client Login
              </span>
            </Link>
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white text-4xl" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-gray-900 absolute top-20 left-0 w-full py-6 shadow-lg">
          <ul className="flex flex-col space-y-6 text-center">
            <li>
              <Link href="/" passHref legacyBehavior>
                <span className="block py-3 text-white text-2xl font-semibold hover:text-blue-400" onClick={() => setIsOpen(false)}>Home</span>
              </Link>
            </li>
            <li>
              <Link href="/services" passHref legacyBehavior>
                <span className="block py-3 text-white text-2xl font-semibold hover:text-blue-400" onClick={() => setIsOpen(false)}>Services</span>
              </Link>
            </li>
            <li>
              <Link href="/blog" passHref legacyBehavior>
                <span className="block py-3 text-white text-2xl font-semibold hover:text-blue-400" onClick={() => setIsOpen(false)}>Blog</span>
              </Link>
            </li>
            <li>
              <Link href="/contact" passHref legacyBehavior>
                <span className="block py-3 text-white text-2xl font-semibold hover:text-blue-400" onClick={() => setIsOpen(false)}>Contact</span>
              </Link>
            </li>
            <li>
              <Link href="/booking" passHref legacyBehavior>
                <span className="block py-3 text-white text-2xl font-semibold hover:text-blue-400" onClick={() => setIsOpen(false)}>Booking</span>
              </Link>
            </li>
            <li>
              <Link href="/client-login" passHref legacyBehavior>
                <span className="block py-3 text-white text-2xl font-semibold hover:text-blue-400" onClick={() => setIsOpen(false)}>Client Login</span>
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
