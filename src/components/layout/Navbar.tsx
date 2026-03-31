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
  // Increased height from h-12 to h-16 and width to w-52
  <div className="relative h-25 w-35 flex items-center">
    <img
      src="/Tezco-logo.png"
      alt="TEZCO"
      className="h-full w-auto object-contain drop-shadow-[0_0_12px_rgba(56,189,248,0.4)] transition-all duration-300 hover:scale-105"
      draggable={false}
    />
  </div>
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
      // Slightly increased padding in scrolled state for the larger logo
      scrolled ? "py-4 bg-black/80 backdrop-blur-lg border-b border-white/5" : "py-8 bg-transparent"
    }`}>
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-nav {
          display: flex;
          align-items: center;
          padding: 4px;
          border-radius: 100px;
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 4px 24px -1px rgba(0, 0, 0, 0.2);
        }
        .nav-link {
          padding: 0.6rem 1.4rem;
          color: #a1a1aa;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          transition: all 300ms ease;
          border-radius: 100px;
        }
        .nav-link:hover { 
          color: white; 
          background: rgba(255, 255, 255, 0.05);
        }
        @media (max-width: 768px) { .custom-nav { display: none; } }
      `}} />

      <div className="container mx-auto px-6 lg:px-20 flex justify-between items-center relative z-[1001]">
        <a href="#home" className="flex items-center transform active:scale-95">
          <TezcoLogo />
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:block">
          <div className="custom-nav">
            <ul className="flex gap-1">
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
          className="md:hidden text-white p-2 relative z-[1002] transition-colors hover:text-cyan-400"
        >
          {isOpen ? <X size={36} /> : <Menu size={36} />}
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
              className="fixed inset-0 bg-black/95 backdrop-blur-2xl z-[1000] md:hidden"
            />
            
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-screen w-[85%] bg-[#030303] border-l border-white/10 z-[1001] flex flex-col justify-center p-12 gap-10 md:hidden"
            >
              <div className="space-y-6">
                {NAV_ITEMS.map((item, i) => (
                  <motion.a
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="block text-5xl font-black text-white hover:text-cyan-500 transition-colors tracking-tighter uppercase"
                  >
                    {item.label}
                  </motion.a>
                ))}
              </div>
              
              <div className="mt-12 pt-12 border-t border-white/5">
                <p className="text-cyan-500/60 text-xs tracking-[0.3em] uppercase font-bold">Engineering the Future</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}