"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { ChevronLeft, ChevronRight } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const sliderData = [
  { title: "Minimal UI", sub: "Precision", desc: "Clean interfaces designed to reduce cognitive load.", img: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=1200&auto=format&fit=crop" },
  { title: "Smart UX", sub: "Intuitive", desc: "Architecting seamless user journeys that feel natural.", img: "https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=1200&auto=format&fit=crop" },
  { title: "Motion Design", sub: "Dynamics", desc: "Purposeful animations that guide users.", img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop" },
  { title: "Grid Systems", sub: "Structure", desc: "Mathematical layouts ensuring perfect scalability.", img: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?q=80&w=1200&auto=format&fit=crop" },
];

export default function ModernEffectsPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const roadRef = useRef<HTMLDivElement>(null);
  const zoomCircleRef = useRef<HTMLDivElement>(null);
  const zoomContentRef = useRef<HTMLDivElement>(null);
  const zoomBgTextRef = useRef<HTMLHeadingElement>(null);
  const zoomContainerRef = useRef<HTMLDivElement>(null);

  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(1);
  const [imagesReady, setImagesReady] = useState(false);

  // ── Preload images before hiding loader ──────────────────────────────────────
  useEffect(() => {
    let loaded = 0;
    sliderData.forEach(({ img }) => {
      const i = new Image();
      i.src = img;
      i.onload = i.onerror = () => { loaded++; if (loaded === sliderData.length) setImagesReady(true); };
    });
  }, []);

  // ── Loading progress bar ──────────────────────────────────────────────────────
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        // Slow near end if images aren't ready
        if (prev > 80 && !imagesReady) return prev + 0.5;
        return prev + 4;
      });
    }, 60);
    return () => clearInterval(timer);
  }, [imagesReady]);

  // Hide loader once both progress=100 and images ready
  useEffect(() => {
    if (progress >= 100 && imagesReady) {
      const t = setTimeout(() => setIsLoading(false), 400);
      return () => clearTimeout(t);
    }
  }, [progress, imagesReady]);

  // ── Road parallax (passive, RAF-throttled) ────────────────────────────────────
  useEffect(() => {
    if (isLoading) return;
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          if (roadRef.current) {
            const h = Math.max(0, window.innerHeight - scrollY * 1.2);
            roadRef.current.style.height = `${h}px`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isLoading]);

  // ── GSAP Zoom section (pure CSS-var based, no scroll jank) ────────────────────
  useEffect(() => {
    if (isLoading) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: zoomContainerRef.current,
          start: "top top",
          end: "+=100%",
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });

      tl.to(zoomCircleRef.current, { scale: 45, duration: 1.5, ease: "power2.in" })
        .to(zoomBgTextRef.current, { opacity: 0, duration: 0.4 }, 0)
        .to(zoomContentRef.current, { opacity: 1, scale: 1, duration: 0.7, ease: "back.out(1.4)" }, "-=0.7");
    }, containerRef);

    return () => ctx.revert();
  }, [isLoading]);

  const changeSlide = useCallback((dir: number) => {
    setActiveIndex((prev) => (prev + dir + sliderData.length) % sliderData.length);
  }, []);

  // ── Touch swipe for slider ────────────────────────────────────────────────────
  const touchStartX = useRef(0);
  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) changeSlide(diff > 0 ? 1 : -1);
  };

  return (
    <div ref={containerRef} className="relative bg-[#050505] text-white overflow-x-hidden" style={{ fontFamily: "'Archivo', sans-serif" }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url("https://fonts.googleapis.com/css2?family=Archivo:wght@100;200;300;400;500;600;700;800;900&display=swap");
        .clip-path-road { clip-path: polygon(48% 0%, 52% 0%, 100% 100%, 0% 100%); }
        .slide-3d { transition: transform 0.7s cubic-bezier(0.22,1,0.36,1), opacity 0.5s ease, z-index 0s; will-change: transform; }
        .zoom-circle-el { will-change: transform; }
      `}} />

      {/* ── LOADING SCREEN ─────────────────────────────────────────────────── */}
      {isLoading && (
        <div className="fixed inset-0 bg-white z-[10000] flex flex-col justify-end p-6 md:p-10 text-black overflow-hidden">
          <div
            className="absolute bottom-0 left-0 h-full bg-black transition-none"
            style={{ width: `${progress}%`, transition: "width 0.06s linear" }}
          />
          <h1
            className="font-black z-10 leading-none tracking-tighter"
            style={{ fontSize: "clamp(60px,20vw,200px)" }}
          >
            {Math.round(progress)}%
          </h1>
        </div>
      )}

      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section className="h-screen flex flex-col justify-end items-center relative overflow-hidden bg-black">
        <div className="flex flex-col items-center justify-end w-full h-full">
          <div
            className="bg-white rounded-t-full mix-blend-difference"
            style={{ width: "clamp(200px,80%,600px)", height: "clamp(100px,20vw,300px)" }}
          />
          <div className="w-full h-[1px] bg-white" />
        </div>
        <div
          ref={roadRef}
          className="bg-white w-full mix-blend-difference clip-path-road absolute bottom-0"
          style={{ height: "100%" }}
        />
      </section>

      {/* ── CONTENT PART 1 ─────────────────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-20 px-6 md:px-10 min-h-screen relative overflow-hidden">
        <h2
          className="fixed top-10 left-0 font-black mix-blend-difference text-white pointer-events-none z-0 leading-none whitespace-nowrap"
          style={{ fontSize: "clamp(60px,14vw,200px)", opacity: 0.08 }}
        >
          TEZCO FLOW
        </h2>
        <div className="mt-[35vh] md:mt-[20vw] space-y-2 md:space-y-4 text-right relative z-10">
          {["BUILD BY", "TECHNICAL", "EXPERTS"].map((text, i) => (
            <h3
              key={i}
              className="font-black text-black uppercase leading-[0.75]"
              style={{ fontSize: "clamp(36px,10vw,120px)" }}
            >
              {text}
            </h3>
          ))}
        </div>
      </section>

      {/* ── 3D CARD SLIDER ─────────────────────────────────────────────────── */}
      <div
        className="bg-black min-h-screen flex items-center justify-center overflow-hidden relative py-20"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="relative w-full max-w-7xl flex flex-col items-center justify-center px-4">
          {/* Nav arrows */}
          <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-2 md:px-8 z-50 pointer-events-none">
            <button
              onClick={() => changeSlide(-1)}
              className="pointer-events-auto p-3 md:p-4 bg-white/5 backdrop-blur-md rounded-full border border-white/10 hover:bg-white/20 active:scale-95 transition-all"
            >
              <ChevronLeft size={22} className="text-white" />
            </button>
            <button
              onClick={() => changeSlide(1)}
              className="pointer-events-auto p-3 md:p-4 bg-white/5 backdrop-blur-md rounded-full border border-white/10 hover:bg-white/20 active:scale-95 transition-all"
            >
              <ChevronRight size={22} className="text-white" />
            </button>
          </div>

          {/* Slider track */}
          <div className="flex items-center justify-center gap-4 md:gap-12 py-10 md:py-20 w-full overflow-visible">
            {sliderData.map((card, i) => {
              const offset = i - activeIndex;
              const isCurrent = i === activeIndex;
              // On mobile show only current ±1
              const isMobileHidden = Math.abs(offset) > 1;

              return (
                <div
                  key={i}
                  className={`slide-3d relative shrink-0 ${isMobileHidden ? "hidden md:block" : "block"}`}
                  style={{
                    width: "clamp(200px,55vw,320px)",
                    height: "clamp(300px,70vw,480px)",
                    transform: `perspective(1200px) translateX(${offset * (window?.innerWidth < 640 ? 30 : 60)}px) rotateY(${offset * -35}deg) scale(${isCurrent ? 1.08 : 0.75})`,
                    zIndex: isCurrent ? 30 : 20 - Math.abs(offset),
                    opacity: Math.abs(offset) > 1 ? 0 : 1,
                  }}
                  onClick={() => !isCurrent && changeSlide(offset > 0 ? 1 : -1)}
                >
                  <div className={`w-full h-full rounded-3xl overflow-hidden border ${isCurrent ? "border-white/40" : "border-white/10"} shadow-2xl`}>
                    <img
                      src={card.img}
                      alt={card.title}
                      className={`w-full h-full object-cover transition-all duration-700 ${isCurrent ? "scale-110 brightness-75" : "scale-100 brightness-50"}`}
                      loading="lazy"
                      decoding="async"
                    />

                    {/* Info card — repositioned for mobile */}
                    {isCurrent && (
                      <div
                        className="absolute z-40 p-4 md:p-8 backdrop-blur-xl bg-black/60 rounded-2xl border border-white/10 shadow-2xl"
                        style={{
                          bottom: "clamp(-8px,-2vw,-20px)",
                          left: "clamp(-8px,-3vw,-48px)",
                          minWidth: "clamp(160px,70%,340px)",
                        }}
                      >
                        <p className="text-cyan-400 font-bold uppercase tracking-[0.2em] text-[10px] mb-1">{card.sub}</p>
                        <h4
                          className="font-black text-white uppercase leading-none mb-2"
                          style={{ fontSize: "clamp(18px,5vw,36px)" }}
                        >
                          {card.title}
                        </h4>
                        <p className="text-white/70 leading-relaxed font-light" style={{ fontSize: "clamp(10px,2vw,13px)" }}>
                          {card.desc}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dot indicators (mobile) */}
          <div className="flex gap-2 mt-4 md:hidden">
            {sliderData.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === activeIndex ? "bg-cyan-400 w-6" : "bg-white/30"}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── ZOOM SECTION ───────────────────────────────────────────────────── */}
      <div
        ref={zoomContainerRef}
        className="h-screen bg-white flex flex-col items-center justify-center overflow-hidden px-6 text-center relative"
      >
        <h2
          ref={zoomBgTextRef}
          className="font-black text-black z-10 leading-tight"
          style={{ fontSize: "clamp(24px,7vw,80px)" }}
        >
          TEZCO HERE TO
        </h2>
        <div
          ref={zoomCircleRef}
          className="zoom-circle-el absolute w-[80px] h-[80px] md:w-[100px] md:h-[100px] bg-black rounded-full z-20"
          style={{ transform: "scale(0)" }}
        />
        <div
          ref={zoomContentRef}
          className="absolute text-cyan-400 font-black uppercase z-30"
          style={{
            fontSize: "clamp(40px,12vw,10vw)",
            opacity: 0,
            transform: "scale(0.8)",
          }}
        >
          HELP YOU
        </div>
      </div>
    </div>
  );
}