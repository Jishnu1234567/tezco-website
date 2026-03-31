"use client";

import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// ... (Keep your TECH_ICONS and MarqueeRow as they are, they are already efficient)

export default function ModernEffectsPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const roadRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(1);

  const sliderData = useMemo(() => [
    { title: "Minimal UI", sub: "Precision", desc: "Clean interfaces designed to reduce cognitive load.", img: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=1200&auto=format&fit=crop" },
    { title: "Smart UX", sub: "Intuitive", desc: "Architecting seamless user journeys that feel natural.", img: "https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=1200&fit=crop" },
    { title: "Motion Design", sub: "Dynamics", desc: "Purposeful animations that guide users.", img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&fit=crop" },
    { title: "Grid Systems", sub: "Structure", desc: "Mathematical layouts ensuring perfect scalability.", img: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?q=80&w=1200&fit=crop" },
  ], []);

  // 1. Optimized Loader
  useEffect(() => {
    const start = Date.now();
    const duration = 1500; 
    const update = () => {
      const elapsed = Date.now() - start;
      const p = Math.min((elapsed / duration) * 100, 100);
      setProgress(p);
      if (p < 100) requestAnimationFrame(update);
      else setTimeout(() => setIsLoading(false), 400);
    };
    requestAnimationFrame(update);
  }, []);

  // 2. High-Performance Road Parallax
  useEffect(() => {
    if (isLoading) return;
    const onScroll = () => {
      if (roadRef.current) {
        // Use transform instead of height to prevent layout shifts
        const scaleY = Math.max(0, 1 - window.scrollY / window.innerHeight);
        roadRef.current.style.transform = `scaleY(${scaleY})`;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isLoading]);

  const changeSlide = useCallback((dir: number) => {
    setActiveIndex(p => (p + dir + sliderData.length) % sliderData.length);
  }, [sliderData.length]);

  // 3. Touch Handling Fix (Crucial for Mobile)
  const touchStart = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart.current - touchEnd;
    if (Math.abs(diff) > 50) {
      changeSlide(diff > 0 ? 1 : -1);
    }
  };

  return (
    <div ref={containerRef} className="relative bg-[#050505] text-white overflow-x-hidden selection:bg-cyan-500/30">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes mq-fwd { from { transform: translate3d(0,0,0); } to { transform: translate3d(-50%,0,0); } }
        @keyframes mq-rev { from { transform: translate3d(-50%,0,0); } to { transform: translate3d(0,0,0); } }
        
        .mq-fwd, .mq-rev { will-change: transform; transform: translateZ(0); }
        .slide-3d { 
          transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease;
          pointer-events: auto;
        }
        /* Mobile Performance: Hide inactive slides to save GPU memory */
        @media (max-width: 768px) {
          .slide-inactive { opacity: 0 !important; pointer-events: none; }
        }
      `}} />

      {/* HERO SECTION */}
      <section className="h-screen flex flex-col justify-end items-center relative overflow-hidden bg-black">
         <div className="flex flex-col items-center justify-end w-full h-full relative z-10">
          <div className="bg-white rounded-t-full mix-blend-difference w-[280px] h-[140px] md:w-[580px] md:h-[280px]" />
          <div className="w-full h-px bg-white/20" />
        </div>
        <div ref={roadRef} className="clip-path-road bg-white mix-blend-difference absolute bottom-0 w-full h-screen origin-bottom will-change-transform" />
      </section>

      {/* 3D SLIDER SECTION */}
      <section 
        className="relative min-h-screen flex flex-col items-center justify-center bg-black py-20 overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Navigation Buttons */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-6 z-50 pointer-events-none">
          <button onClick={() => changeSlide(-1)} className="pointer-events-auto p-4 rounded-full bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 active:scale-90 transition-all">
            <ChevronLeft size={24} />
          </button>
          <button onClick={() => changeSlide(1)} className="pointer-events-auto p-4 rounded-full bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 active:scale-90 transition-all">
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Cards Container */}
        <div className="relative flex items-center justify-center w-full h-[500px] perspective-[1200px]">
          {sliderData.map((card, i) => {
            const offset = i - activeIndex;
            const isActive = offset === 0;
            const absOffset = Math.abs(offset);

            return (
              <div
                key={i}
                className={`slide-3d absolute w-[280px] md:w-[340px] aspect-[3/4] ${absOffset > 1 ? 'slide-inactive' : ''}`}
                style={{
                  transform: `
                    translate3d(${offset * 80}%, 0, ${isActive ? 0 : -300}px) 
                    rotateY(${offset * -35}deg)
                    scale(${isActive ? 1 : 0.85})
                  `,
                  zIndex: 20 - absOffset,
                  opacity: absOffset > 1 ? 0 : 1,
                }}
              >
                <div className={`w-full h-full rounded-[2rem] overflow-hidden border-2 transition-colors duration-500 ${isActive ? 'border-cyan-500/50 shadow-[0_0_50px_rgba(34,211,238,0.2)]' : 'border-white/10'}`}>
                  <img 
                    src={card.img} 
                    alt={card.title}
                    className={`w-full h-full object-cover transition-transform duration-1000 ${isActive ? 'scale-110' : 'scale-100 grayscale-[0.5]'}`}
                  />
                  
                  {/* Content Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="absolute bottom-8 left-8 right-8">
                      <span className="text-cyan-400 text-xs font-bold tracking-[0.3em] uppercase">{card.sub}</span>
                      <h3 className="text-3xl font-black mt-2 uppercase italic">{card.title}</h3>
                      <p className="text-gray-400 text-sm mt-3 line-clamp-2">{card.desc}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ... rest of your Marquee section */}
    </div>
  );
}