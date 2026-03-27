"use client";

import React, { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { motion } from "framer-motion";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function AboutTezco() {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // 1. Kinetic Background Grid
      gsap.to(gridRef.current, {
        y: "-15%",
        opacity: 0.15,
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      // 2. Main Content Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top 65%",
          toggleActions: "play none none reverse",
        },
      });

      tl.from(headlineRef.current, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      })
      .from(subtextRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      }, "-=0.6")
      .from(visualRef.current, {
        scale: 0.8,
        opacity: 0,
        duration: 1.5,
        ease: "expo.out",
      }, "-=0.7");
    },
    { scope: containerRef }
  );

 return (
    <section
      ref={triggerRef}
      /* ADDED 'experience-wrapper' HERE */
      className="experience-wrapper relative min-h-screen py-32 flex items-center overflow-hidden bg-[#010103] border-y border-white/5"
    >
      <style jsx global>{`
        .masked-tezco-text {
          font-weight: 900;
          color: transparent;
          background-image: url('https://images.unsplash.com/photo-1732535725600-f805d8b33c9c?q=80&w=1470&auto=format&fit=crop'); 
          background-size: 200% auto;
          background-position: 0 50%;
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: animate-mask-bg 8s infinite alternate ease-in-out;
          line-height: 0.9;
          text-align: center;
        }

        @keyframes animate-mask-bg {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }

        .masking-container {
          display: flex;
          justify-content: center;
          align-items: center;
          perspective: 1000px;
        }
      `}</style>

      {/* Background Grid Layer */}
      <div
        ref={gridRef}
        className="absolute inset-0 z-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(56,189,248,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div ref={containerRef} className="container mx-auto px-6 relative z-10 grid lg:grid-cols-12 gap-16 items-center">
        
        {/* Left Side: Narrative */}
        <div className="lg:col-span-5 space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-white/70 text-[11px] uppercase tracking-[0.3em] font-bold"
          >
            Engineering studio
          </motion.div>
          
          <h2 
            ref={headlineRef}
            className="text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tighter"
          >
            Engineering Ideas into <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
              Real-World Solutions
            </span>
          </h2>

          <p 
            ref={subtextRef}
            className="text-gray-400 text-lg font-light leading-relaxed max-w-xl"
          >
            Tezco is a team of technical experts building SaaS platforms, complex applications, and guiding startups from concept to deployment.
          </p>
        </div>

        {/* Right Side: Masked Animation Style */}
        <div className="lg:col-span-7 flex justify-center items-center">
          <div ref={visualRef} className="masking-container w-full">
            <h1 className="masked-tezco-text text-7xl md:text-8xl lg:text-[10rem] uppercase tracking-tighter select-none">
              TEZCO THE TECH EXPERTS <br />
              <span className="text-[0.5em] tracking-[0.2em] block opacity-90">THE TECH EXPERTS</span>
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
}