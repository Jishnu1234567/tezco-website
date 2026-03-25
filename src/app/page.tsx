import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About"; 
import Services from "@/components/sections/Services";
import Process from "@/components/sections/Process";
import TechStack from "@/components/sections/TechStack";
import DataCore from "@/components/sections/DataCore";
// No need to import Navbar here if it's already in layout.tsx

export default function Home() {
  return (
    // 'flex flex-col' ensures sections stack perfectly on mobile
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
      
      {/* TechStack usually doesn't need an ID for nav, but needs scaling */}
      <section className="mobile-safe-section">
        <TechStack />
      </section>
      
      <section id="contact" className="mobile-safe-section">
        <DataCore />
      </section>
    </div>
  );
}