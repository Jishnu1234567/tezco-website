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

// --- TEZCO LOGO COMPONENT ---
const TezcoLogo = () => (
  <img
    src="/TEZCO (2).png"
    alt="TEZCO - Technical Experts"
    style={{
      height: "125px",        // ✅ reduced from 150px
      width: "125px",
      display: "block",
      mixBlendMode: "screen", // ✅ kills any remaining dark background
     
      transition: "filter 0.3s ease",
    }}
   
  />
);

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
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
          background: rgb(0, 0, 0);
          backdrop-filter: blur(10px);
          border: 1px solid rgb(0, 0, 0);
        }
        .nav-link {
          display: block;
          padding: 0.6rem 1.2rem;
          color: #9ca3af;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          transition: color 300ms;
        }
        .nav-link:hover { color: white; }
        @media (max-width: 768px) { .custom-nav { display: none; } }
      `}} />

      <div className="container mx-auto px-6 lg:px-20 flex justify-between items-center relative z-[1001]">
        {/* Logo Section - Now using the native SVG component */}
        <a href="#home" className="flex items-center transform transition-transform hover:scale-105 active:scale-95">
          <TezcoLogo />
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
          className="md:hidden text-white p-2 relative z-[1002]"
        >
          {isOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[1000] md:hidden"
            />
            
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-screen w-[85%] bg-[#050505] border-l border-white/10 z-[1001] flex flex-col justify-center p-12 gap-8 md:hidden"
            >
              {NAV_ITEMS.map((item, i) => (
                <motion.a
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="text-4xl font-black text-white hover:text-cyan-400 transition-colors tracking-tighter uppercase"
                >
                  {item.label}
                </motion.a>
              ))}
              <div className="mt-10 pt-10 border-t border-white/5">
                <p className="text-cyan-500/50 text-xs tracking-widest uppercase font-bold">The Technical Experts</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}