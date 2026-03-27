"use client"; // <--- ADD THIS LINE AT THE TOP

import dynamic from 'next/dynamic';

// Dynamically import components that use window, GSAP, or Three.js
const Hero = dynamic(() => import("@/components/sections/Hero"), { ssr: false });
const About = dynamic(() => import("@/components/sections/About"), { ssr: false });
const Services = dynamic(() => import("@/components/sections/Services"), { ssr: false });
const Process = dynamic(() => import("@/components/sections/Process"), { ssr: false });
const TechStack = dynamic(() => import("@/components/sections/TechStack"), { ssr: false });
const DataCore = dynamic(() => import("@/components/sections/DataCore"), { ssr: false });

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <section id="home" className="mobile-safe-section">
        <Hero />
      </section>
      
      <section id="about" className="mobile-safe-section">
        <About />
      </section>
      
      <section id="services" className="mobile-safe-section">
        <Services />
      </section>
      
      <section id="process" className="mobile-safe-section">
        <Process />
      </section>
      
      <section className="mobile-safe-section">
        <TechStack />
      </section>
      
      <section id="contact" className="mobile-safe-section">
        <DataCore />
      </section>
    </div>
  );
}