import { useState, useEffect } from "react";
import { Link as ScrollLink } from "react-scroll";
import { FiMenu, FiX } from "react-icons/fi";

export default function Navbar() {
  const [active, setActive] = useState("Home");
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Function to handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) { // Apply effect sooner
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full py-4 transition-all duration-300 shadow-lg ${
        scrolled ? "bg-gray-800 shadow-md" : "bg-gray-900"
      }`}
    >
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6">
        {/* Logo */}
        <h1 className="text-2xl font-bold text-white">Strategic Sync</h1>

        {/* Desktop Menu with Hover Animation */}
        <ul className="hidden md:flex space-x-6">
          {["Home", "Services", "Blog", "Contact"].map((item) => (
            <li key={item} className="relative">
              <ScrollLink
                to={item.toLowerCase()}
                smooth={true}
                duration={500}
                offset={-70} // Fixes navbar covering section titles
                className={`relative text-white transition-all duration-300 ease-in-out cursor-pointer ${
                  active === item ? "text-blue-400 font-semibold" : "hover:text-blue-400"
                }`}
                onClick={() => setActive(item)}
              >
                {item}
              </ScrollLink>
            </li>
          ))}
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white text-2xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-gray-900 absolute top-16 left-0 w-full py-4 shadow-lg">
          <ul className="flex flex-col space-y-4 text-center">
            {["Home", "Services", "Blog", "Contact"].map((item) => (
              <li key={item}>
                <ScrollLink
                  to={item.toLowerCase()}
                  smooth={true}
                  duration={500}
                  offset={-70} // Fixes section alignment on mobile
                  className="block py-2 text-white hover:text-blue-400 transition-all duration-300 cursor-pointer"
                  onClick={() => {
                    setActive(item);
                    setIsOpen(false);
                  }}
                >
                  {item}
                </ScrollLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
