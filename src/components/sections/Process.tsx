"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { ScrollToPlugin } from "gsap/dist/ScrollToPlugin";

// Register GSAP Plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

export default function ModernEffectsPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // --- 1. Loading Logic ---
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setIsLoading(false), 500);
          return 100;
        }
        return prev + 5;
      });
    }, 100);

    if (isLoading) return;

    // --- 2. GSAP Horizontal Scroll ---
    const horizontalItems = horizontalRef.current;
    if (horizontalItems) {
      // Calculate exact scroll distance
      const scrollWidth = horizontalItems.scrollWidth - window.innerWidth;
      
      gsap.to(horizontalItems, {
        x: -scrollWidth,
        ease: "none",
        scrollTrigger: {
          trigger: ".horizontal-container", // Triggered by the container
          start: "top top",
          end: () => `+=${scrollWidth}`, // Ends exactly when the items finish moving
          scrub: 0.5,
          pin: true, // Pins the container while items move
          invalidateOnRefresh: true,
          antialiasing: true,
        },
      });
    }

    // --- 3. Zoom Scroll Effect ---
    gsap.timeline({
      scrollTrigger: {
        trigger: ".zoom-container",
        start: "top top",
        end: "+=150%", // Slightly reduced to prevent over-scrolling
        pin: true,
        scrub: true,
      }
    })
    .to(".zoom-circle", { scale: 20, duration: 1 })
    .to(".zoom-content", { opacity: 1, scale: 1.5 }, "<");

    // --- 4. Road Shrinking Logic ---
    const handleRoad = () => {
      const scroll = window.scrollY;
      const road = document.querySelector(".road") as HTMLElement;
      if (road) {
        const h = Math.max(0, window.innerHeight - scroll * 1.2);
        road.style.height = `${h}px`;
      }
    };
    window.addEventListener("scroll", handleRoad);

    return () => {
      window.removeEventListener("scroll", handleRoad);
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [isLoading]);

  return (
    <div ref={containerRef} className="relative bg-black text-white overflow-x-hidden selection:bg-white selection:text-black">
      
      {/* LOADING SCREEN */}
      {isLoading && (
        <div className="fixed inset-0 bg-white z-[10000] flex flex-col justify-end p-10">
          <div className="absolute bottom-0 left-0 h-full bg-black transition-all duration-300" style={{ width: `${progress}%`, mixBlendMode: 'difference' }} />
          <h1 className="text-[20vw] font-black mix-blend-difference text-white leading-none">{progress}%</h1>
        </div>
      )}

      {/* HERO SECTION */}
      <section className="hero h-screen flex flex-col justify-end items-center relative overflow-hidden">
        <div className="sun flex flex-col items-center justify-end w-full h-full">
          <div className="semicircle w-[40%] h-[20vw] bg-white rounded-t-full mix-blend-difference" />
          <div className="line w-full h-[1px] bg-white" />
        </div>
        <div className="road bg-white w-full h-full mix-blend-difference clip-path-road" />
      </section>

      {/* CONTENT PART 1 */}
      <section className="part1 bg-white py-20 px-10 min-h-screen">
        <h2 className="fixed top-0 left-0 text-[14vw] font-black mix-blend-difference text-white pointer-events-none z-50">
          TEZCO FLOW
        </h2>
        <div className="mt-[20vw] space-y-4 text-right">
          {["BUILD BY", "TECHNICAL", "EXPERTS"].map((text, i) => (
            <h3 key={i} className="text-[8vw] leading-[0.6] font-black text-black">
              {text}
            </h3>
          ))}
        </div>
      </section>

      {/* HORIZONTAL SCROLL SECTION */}
      {/* Removed extra padding to keep layout tight */}
      <div className="horizontal-container bg-black overflow-hidden">
        <div className="horizontal-wrapper flex items-center h-screen">
          <div ref={horizontalRef} className="flex gap-10 px-10">
            <HorizontalCard title="Minimal UI" text="Clean interfaces for faster decisions." filled />
            <HorizontalCard title="Smart UX" text="Designed around real user workflows." />
            <HorizontalCard title="Motion Design" text="Animations that guide, not distract." filled />
            <HorizontalCard title="Grid Systems" text="Structured layouts for scalable design." />
          </div>
        </div>
      </div>

      {/* ZOOM SECTION */}
      <div className="zoom-container h-screen bg-white flex items-center justify-center overflow-hidden">
        <h2 className="text-6xl font-black text-black z-10 mix-blend-difference">SCROLL TO ZOOM</h2>
        <div className="zoom-circle absolute w-[30vw] h-[30vw] bg-black rounded-full mix-blend-difference scale-0" />
        <div className="zoom-content absolute opacity-0 text-white text-9xl font-black">THE END</div>
      </div>

      {/* REMOVED: Extra h-[100vh] div that was causing blank space */}
    </div>
  );
}

function HorizontalCard({ title, text, filled = false }: { title: string, text: string, filled?: boolean }) {
  return (
    <div className={`min-w-[50vw] h-[60vh] p-10 rounded-[5vw] border-4 border-white flex flex-col justify-between ${filled ? 'bg-white text-black' : 'text-white'}`}>
      <h4 className="text-4xl md:text-6xl font-black">{title}</h4>
      <p className="text-xl md:text-2xl font-medium">{text}</p>
    </div>
  );
}