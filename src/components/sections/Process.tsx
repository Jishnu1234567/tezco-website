"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { ChevronLeft, ChevronRight } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ModernEffectsPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(1);

  const sliderData = [
    { title: "Minimal UI", sub: "Precision", desc: "Clean interfaces designed to reduce cognitive load.", img: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=2000&auto=format&fit=crop" },
    { title: "Smart UX", sub: "Intuitive", desc: "Architecting seamless user journeys that feel natural.", img: "https://codestrup.com/wp-content/uploads/2023/09/ui-ux-design-services-banner-1024x683.webp" },
    { title: "Motion Design", sub: "Dynamics", desc: "Purposeful animations that guide users.", img: "https://tse4.mm.bing.net/th/id/OIP._WQYw9u_NI6bKqjzGivfdAHaEK?rs=1&pid=ImgDetMain&o=7&rm=3" },
    { title: "Grid Systems", sub: "Structure", desc: "Mathematical layouts ensuring perfect scalability.", img: "https://media.geeksforgeeks.org/wp-content/uploads/20230209170229/Grid-System-In-UI-Design.gif" }
  ];

  // ── Loading progress ──────────────────────────────────────────────────────
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setIsLoading(false), 500);
          return 100;
        }
        return prev + 5;
      });
    }, 80);
    return () => clearInterval(timer);
  }, []);

  // ── GSAP effects — only after loading, only on desktop ───────────────────
  useEffect(() => {
    if (isLoading) return;
    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      // Zoom section — skip pin on mobile to avoid scroll blocking
      gsap.timeline({
        scrollTrigger: {
          trigger: ".zoom-container",
          start: "top top",
          end: "+=120%",
          // On mobile: no pin (scrub only), so native scroll stays free
          pin: !isMobile,
          scrub: isMobile ? 1.5 : true,
        }
      })
        .to(".zoom-circle", { scale: 50, duration: 1.5, ease: "power2.in" })
        .to(".tezco-bg-text", { opacity: 0, duration: 0.5 }, "-=1")
        .to(".zoom-content", { opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.7)" }, "-=0.8");
    }, containerRef);

    // Road parallax — passive listener, RAF-throttled
    let ticking = false;
    const handleRoad = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const road = document.querySelector(".road") as HTMLElement;
        if (road) {
          const h = Math.max(0, window.innerHeight - window.scrollY * 1.5);
          road.style.height = `${h}px`;
        }
        ticking = false;
      });
    };
    window.addEventListener("scroll", handleRoad, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleRoad);
      ctx.revert();
    };
  }, [isLoading]);

  const changeSlide = (dir: number) => {
    setActiveIndex((prev) => (prev + dir + sliderData.length) % sliderData.length);
  };

  return (
    <div ref={containerRef} className="relative bg-[#050505] text-white overflow-x-hidden font-['Archivo']">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url("https://api.fontshare.com/v2/css?f[]=archivo@100,200,300,400,500,600,700,800,900&f[]=clash-display@200,300,400,500,600,700&display=swap");
        .clip-path-road { clip-path: polygon(48% 0%, 52% 0%, 100% 100%, 0% 100%); }
        .slide-3d { transition: all 0.8s cubic-bezier(0.22, 1, 0.36, 1); }
        /* Prevent GSAP pin from blocking mobile scroll */
        .ScrollTrigger-pin-spacer { touch-action: pan-y !important; }
      `}} />

      {/* LOADING SCREEN */}
      {isLoading && (
        <div className="fixed inset-0 bg-white z-[10000] flex flex-col justify-end p-6 md:p-10 text-black">
          <div className="absolute bottom-0 left-0 h-full bg-black transition-all duration-300" style={{ width: `${progress}%` }} />
          <h1 className="text-[25vw] md:text-[20vw] font-black z-10 leading-none tracking-tighter">{progress}%</h1>
        </div>
      )}

      {/* HERO SECTION */}
      <section className="hero h-screen flex flex-col justify-end items-center relative overflow-hidden bg-black">
        <div className="sun flex flex-col items-center justify-end w-full h-full">
          <div className="semicircle w-[80%] md:w-[40%] h-[40vw] md:h-[20vw] bg-white rounded-t-full mix-blend-difference" />
          <div className="line w-full h-[1px] bg-white" />
        </div>
        <div className="road bg-white w-full h-full mix-blend-difference clip-path-road" style={{ willChange: "height" }} />
      </section>

      {/* CONTENT PART 1 */}
      <section className="part1 bg-white py-16 md:py-20 px-6 md:px-10 min-h-screen relative overflow-hidden">
        <h2 className="fixed top-10 left-0 text-[20vw] md:text-[14vw] font-black mix-blend-difference text-white opacity-10 pointer-events-none z-0 leading-none">TEZCO FLOW</h2>
        <div className="mt-[40vh] md:mt-[20vw] space-y-2 md:space-y-4 text-right relative z-10">
          {["BUILD BY", "TECHNICAL", "EXPERTS"].map((text, i) => (
            <h3 key={i} className="text-[12vw] md:text-[8vw] leading-[0.7] font-black text-black uppercase">{text}</h3>
          ))}
        </div>
      </section>

      {/* 3D CARD SLIDER — touch-action pan-y so mobile can still scroll */}
      <div
        className="horizontal-container bg-black min-h-screen flex items-center justify-center overflow-hidden relative"
        style={{ touchAction: "pan-y" }}
      >
        <div className="relative w-full max-w-7xl flex flex-col items-center justify-center px-4">
          <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-2 md:px-4 z-50 pointer-events-none">
            <button onClick={() => changeSlide(-1)} className="pointer-events-auto p-3 md:p-4 bg-white/5 backdrop-blur-md rounded-full border border-white/10 hover:bg-white/20 transition-all">
              <ChevronLeft size={24} className="md:w-10 md:h-10 text-white" />
            </button>
            <button onClick={() => changeSlide(1)} className="pointer-events-auto p-3 md:p-4 bg-white/5 backdrop-blur-md rounded-full border border-white/10 hover:bg-white/20 transition-all">
              <ChevronRight size={24} className="md:w-10 md:h-10 text-white" />
            </button>
          </div>

          {/* overflow-x-auto with snap for mobile so it doesn't block vertical scroll */}
          <div
            className="flex items-center justify-center gap-6 md:gap-16 py-10 md:py-20"
            style={{ touchAction: "pan-y" }}
          >
            {sliderData.map((card, i) => {
              const offset = i - activeIndex;
              const isCurrent = i === activeIndex;
              return (
                <div
                  key={i}
                  className="slide-3d relative w-[260px] h-[380px] md:w-[320px] md:h-[480px] shrink-0"
                  style={{
                    transform: `perspective(1200px) translateX(${offset * 60}px) rotateY(${offset * -35}deg) scale(${isCurrent ? 1.1 : 0.75})`,
                    zIndex: isCurrent ? 30 : 20 - Math.abs(offset),
                    opacity: Math.abs(offset) > 1 ? 0 : 1,
                  }}
                >
                  <div className={`w-full h-full rounded-3xl overflow-hidden border ${isCurrent ? 'border-white/40' : 'border-white/10'} shadow-2xl`}>
                    <img src={card.img} alt={card.title} className={`w-full h-full object-cover transition-all duration-1000 ${isCurrent ? 'scale-110 brightness-75' : 'scale-100 brightness-50'}`} />
                    {isCurrent && (
                      <div className="absolute bottom-4 -left-6 md:bottom-6 md:-left-12 z-40 p-5 md:p-8 w-[280px] md:min-w-[340px] backdrop-blur-xl bg-black/60 rounded-2xl border border-white/10 shadow-2xl">
                        <p className="text-cyan-400 font-bold uppercase tracking-[0.2em] text-[10px] mb-1">{card.sub}</p>
                        <h4 className="text-2xl md:text-4xl font-black text-white uppercase leading-none mb-2">{card.title}</h4>
                        <p className="text-[11px] md:text-sm text-white/70 leading-relaxed font-light">{card.desc}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ZOOM SECTION */}
      <div className="zoom-container h-screen bg-white flex flex-col items-center justify-center overflow-hidden px-6 text-center relative">
        <h2 className="tezco-bg-text text-4xl md:text-7xl font-black text-black z-10 leading-tight">TEZCO HERE TO</h2>
        <div className="zoom-circle absolute w-[100px] h-[100px] bg-black rounded-full scale-0 z-20" style={{ willChange: "transform" }} />
        <div className="zoom-content absolute opacity-0 text-cyan-400 text-[12vw] md:text-[10vw] font-black uppercase z-30" style={{ scale: "0.8", willChange: "transform, opacity" }}>
          HELP YOU
        </div>
      </div>
    </div>
  );
}