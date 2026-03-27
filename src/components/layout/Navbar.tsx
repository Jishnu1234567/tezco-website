"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const NAV_ITEMS = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#process", label: "Process" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  return (
    <nav className={`fixed top-0 w-full z-[999] transition-all duration-500 ${
      scrolled ? "py-2 bg-black/80 backdrop-blur-md" : "py-6 bg-transparent"
    }`}>
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-nav {
          width: fit-content;
          padding: 6px;
          border-radius: 12px;
          position: relative;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .nav-link {
          display: block;
          padding: 0.6rem 1.2rem;
          text-decoration: none;
          color: #9ca3af;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          transition: color 300ms;
          position: relative;
          z-index: 10;
        }

        .nav-link:hover { color: white; }

        @media (max-width: 768px) {
          .custom-nav { display: none; }
        }
      `}} />

      <div className="container mx-auto px-6 lg:px-20 flex justify-between items-center relative z-[1001]">
        <a href="#home" className="text-2xl font-black text-white tracking-tighter">
          TEZ<span className="text-blue-600">CO</span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:block">
          <div className="custom-nav">
            <ul className="flex">
              {NAV_ITEMS.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="nav-link">{item.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Mobile Toggle Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          aria-label="Toggle Menu"
          className="md:hidden text-white p-2 relative z-[1002]"
        >
          {isOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Dark Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[1000] md:hidden"
            />
            
            {/* Menu Links */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-screen w-[80%] bg-[#050505] border-l border-white/10 z-[1001] flex flex-col justify-center p-12 gap-8 md:hidden"
            >
              {NAV_ITEMS.map((item, i) => (
                <motion.a
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="text-4xl font-black text-white hover:text-blue-500 transition-colors tracking-tighter uppercase"
                >
                  {item.label}
                </motion.a>
              ))}
              
              <div className="mt-10 pt-10 border-t border-white/5">
                <p className="text-gray-500 text-sm tracking-widest uppercase">Expert Engineering</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}