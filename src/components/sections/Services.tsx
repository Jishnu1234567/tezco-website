"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layout, Globe, Smartphone, GraduationCap,
  X, CheckCircle2, ChevronLeft, ChevronRight,
} from "lucide-react";

const SERVICES = [
  { title: "SaaS", icon: <Layout size={20} />, desc: "Cloud Interfaces", img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800", color: "#4ba877", riser: "#3d855e" },
  { title: "Web", icon: <Globe size={20} />, desc: "Modern Portfolios", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800", color: "#4b86a8", riser: "#3a6a85" },
  { title: "App", icon: <Smartphone size={20} />, desc: "Mobile Systems", img: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=800", color: "#a84b84", riser: "#853a69" },
  { title: "Edu", icon: <GraduationCap size={20} />, desc: "College Projects", img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800", color: "#ffe14b", riser: "#ccb43c" },
  { title: "SaaS", icon: <Layout size={20} />, desc: "Visual Editors", img: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=800", color: "#4ba877", riser: "#3d855e" },
  { title: "Web", icon: <Globe size={20} />, desc: "E-Commerce", img: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?q=80&w=800", color: "#4b86a8", riser: "#3a6a85" },
  { title: "App", icon: <Smartphone size={20} />, desc: "React Native", img: "https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?q=80&w=800", color: "#a84b84", riser: "#853a69" },
  { title: "Edu", icon: <GraduationCap size={20} />, desc: "System Design", img: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800", color: "#ffe14b", riser: "#ccb43c" },
  { title: "Tech", icon: <Layout size={20} />, desc: "SaaS Logic", img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800", color: "#4ba877", riser: "#3d855e" },
  { title: "Full", icon: <Globe size={20} />, desc: "Django Backend", img: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=800", color: "#4b86a8", riser: "#3a6a85" },
];

export default function Services() {
  const ringRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [modalIndex, setModalIndex] = useState<number | null>(null);
  const rotationRef = useRef(180);
  const isDragging = useRef(false);
  const lastX = useRef(0);
  const rafRef = useRef<number>(0);
  const animatingTo = useRef<number | null>(null);

  // ─── Star canvas (throttled to 30fps) ───────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let stars: { x: number; y: number; size: number; speed: number }[] = [];
    let animId: number;
    let lastFrame = 0;

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      stars = Array.from({ length: 100 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.2 + 0.3,
        speed: Math.random() * 0.3 + 0.1,
      }));
    };

    const draw = (ts: number) => {
      animId = requestAnimationFrame(draw);
      if (ts - lastFrame < 33) return; // ~30 fps cap
      lastFrame = ts;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(255,255,255,0.65)";
      stars.forEach((s) => {
        ctx.beginPath(); ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2); ctx.fill();
        s.y += s.speed; if (s.y > canvas.height) s.y = 0;
      });
    };

    init();
    animId = requestAnimationFrame(draw);
    const onResize = () => init();
    window.addEventListener("resize", onResize, { passive: true });
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", onResize); };
  }, []);

  // ─── Apply rotation to ring ──────────────────────────────────────────────────
  const applyRotation = useCallback((rot: number) => {
    if (!ringRef.current) return;
    ringRef.current.style.transform = `rotateY(${rot}deg)`;
    // Compute active index
    const wrapped = ((rot % 360) + 360) % 360;
    const idx = Math.round((360 - wrapped) / 36) % 10;
    setActiveIndex(Math.abs(idx));
  }, []);

  // ─── Snap to nearest card ────────────────────────────────────────────────────
  const snapToNearest = useCallback(() => {
    const step = 36;
    const current = rotationRef.current;
    const nearest = Math.round(current / step) * step;
    animatingTo.current = nearest;

    const duration = 400;
    const start = performance.now();
    const from = current;

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3); // cubic ease-out
      const val = from + (nearest - from) * ease;
      rotationRef.current = val;
      applyRotation(val);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
      else animatingTo.current = null;
    };
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
  }, [applyRotation]);

  // ─── Wheel scroll ────────────────────────────────────────────────────────────
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      cancelAnimationFrame(rafRef.current);
      rotationRef.current -= e.deltaY * 0.15;
      applyRotation(rotationRef.current);
      clearTimeout((onWheel as any)._t);
      (onWheel as any)._t = setTimeout(snapToNearest, 120);
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [applyRotation, snapToNearest]);

  // ─── Touch / Mouse drag ──────────────────────────────────────────────────────
  useEffect(() => {
    const getX = (e: MouseEvent | TouchEvent) =>
      "touches" in e ? e.touches[0].clientX : (e as MouseEvent).clientX;

    const onStart = (e: MouseEvent | TouchEvent) => {
      if (modalIndex !== null) return;
      isDragging.current = true;
      lastX.current = getX(e);
      cancelAnimationFrame(rafRef.current);
    };

    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging.current) return;
      const x = getX(e);
      const delta = (x - lastX.current) * 0.6;
      lastX.current = x;
      rotationRef.current += delta;
      applyRotation(rotationRef.current);
    };

    const onEnd = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      snapToNearest();
    };

    window.addEventListener("mousedown", onStart);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onEnd);
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", onEnd);

    return () => {
      window.removeEventListener("mousedown", onStart);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onEnd);
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
    };
  }, [applyRotation, snapToNearest, modalIndex]);

  // ─── Init ring cards ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!ringRef.current) return;
    const cards = ringRef.current.querySelectorAll<HTMLDivElement>(".img-card");
    cards.forEach((card, i) => {
      card.style.cssText += `
        transform: rotateY(${i * 36}deg) translateZ(var(--tz));
        backface-visibility: hidden;
        -webkit-backface-visibility: hidden;
      `;
    });
    applyRotation(180);
  }, [applyRotation]);

  const nextModal = (e: React.MouseEvent) => { e.stopPropagation(); setModalIndex((p) => p !== null ? (p + 1) % SERVICES.length : 0); };
  const prevModal = (e: React.MouseEvent) => { e.stopPropagation(); setModalIndex((p) => p !== null ? (p - 1 + SERVICES.length) % SERVICES.length : 0); };

  return (
    <section className="relative w-screen h-screen overflow-hidden bg-black flex items-center justify-center select-none" style={{ fontFamily: "'Lexend', sans-serif" }}>
      <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-40" />

      <style jsx global>{`
        .img-card {
          width: 100%; height: 100%;
          position: absolute;
          background-size: cover;
          background-position: center;
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 12px;
          will-change: transform;
        }
        .glass-panel {
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.1);
        }
        /* 3D Cube Button */
        .cube-btn {
          position: relative;
          width: clamp(80px, 18vw, 140px);
          height: clamp(38px, 8vw, 50px);
          transition: transform 0.5s cubic-bezier(0.4,0,0.2,1);
          transform-style: preserve-3d;
          cursor: pointer;
        }
        .cube-btn:hover, .cube-btn:active { transform: rotateX(90deg); }
        .cube-btn span {
          position: absolute; top:0; left:0; width:100%; height:100%;
          display:flex; align-items:center; justify-content:center;
          font-size: clamp(8px,1.5vw,10px); letter-spacing:2px; text-transform:uppercase; font-weight:900;
          border: 1px solid rgba(255,255,255,0.12);
        }
        .cube-btn span:nth-child(1){ transform:rotateX(0deg) translateZ(calc(clamp(38px,8vw,50px)/2)); background:#111; color:#fff; }
        .cube-btn span:nth-child(2){ transform:rotateX(-90deg) translateZ(calc(clamp(38px,8vw,50px)/2)); background:#22d3ee; color:#000; }
        .cube-btn span:nth-child(3){ transform:rotateX(-180deg) translateZ(calc(clamp(38px,8vw,50px)/2)); background:#111; color:#fff; }
        .cube-btn span:nth-child(4){ transform:rotateX(-270deg) translateZ(calc(clamp(38px,8vw,50px)/2)); background:#22d3ee; color:#000; }

        /* Card modal */
        .card-wrapper { width: clamp(260px,80vw,400px); height: clamp(400px,85vh,580px); position:relative; transform-style:preserve-3d; perspective:2000px; }
        .card-body { position:absolute; inset:0; border-radius:32px; padding: clamp(20px,5vw,40px); transform-style:preserve-3d; }
        .riser { position:absolute; background:var(--riser-bg); backface-visibility:hidden; }
        .r-t { width:100%; height:30px; transform-origin:top; transform:rotateX(90deg); top:0; left:0; }
        .r-b { width:100%; height:30px; transform-origin:bottom; transform:rotateX(-90deg); bottom:0; left:0; }
        .r-l { width:30px; height:100%; transform-origin:left; transform:rotateY(-90deg); left:0; top:0; }
        .r-r { width:30px; height:100%; transform-origin:right; transform:rotateY(90deg); right:0; top:0; }

        /* Ring perspective container */
        .ring-perspective { --tz: clamp(280px, 40vw, 500px); }
      `}</style>

      {/* Background heading */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center z-0 pointer-events-none">
        <h1 className="text-white/[0.03] text-[18vw] font-black uppercase tracking-tighter leading-none whitespace-nowrap">
          TEZCO SERVICE
        </h1>
      </div>

      {/* 3D Ring */}
      <div
        className="ring-perspective relative z-20"
        style={{
          width: "clamp(160px,30vw,280px)",
          height: "clamp(220px,40vh,380px)",
          transformStyle: "preserve-3d",
          perspective: "2000px",
        }}
      >
        <div
          ref={ringRef}
          className="w-full h-full relative"
          style={{ transformStyle: "preserve-3d", willChange: "transform" }}
        >
          {SERVICES.map((s, i) => (
            <div
              key={i}
              className="img-card"
              style={{ backgroundImage: `url(${s.img})` }}
            >
              <div className="absolute inset-0 bg-black/40 rounded-xl" />
            </div>
          ))}
        </div>
      </div>

      {/* Center display */}
      <div className="absolute z-30 pointer-events-none text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col items-center glass-panel rounded-full shadow-[0_0_50px_rgba(34,211,238,0.1)]"
            style={{ padding: "clamp(20px,5vw,40px) clamp(24px,6vw,48px)" }}
          >
            <div className="text-cyan-400 mb-1">
              {SERVICES[activeIndex % SERVICES.length].icon}
            </div>
            <h3
              className="text-white font-black uppercase tracking-widest"
              style={{ fontSize: "clamp(16px,4vw,28px)" }}
            >
              {SERVICES[activeIndex % SERVICES.length].title}
            </h3>
            <p className="text-white/40 uppercase mt-1 tracking-[0.4em]" style={{ fontSize: "clamp(7px,1.5vw,10px)" }}>
              {SERVICES[activeIndex % SERVICES.length].desc}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Cube buttons */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[80] flex gap-3 flex-wrap justify-center px-4">
        {SERVICES.slice(0, 4).map((item, idx) => (
          <div
            key={idx}
            className="cube-btn"
            onClick={() => setModalIndex(idx)}
            onTouchEnd={(e) => { e.preventDefault(); setModalIndex(idx); }}
          >
            <span>{item.title}</span>
            <span>Discover</span>
            <span>{item.title}</span>
            <span>Tezco</span>
          </div>
        ))}
      </div>

      {/* Swipe hint on mobile */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 text-white/20 text-[10px] tracking-widest uppercase pointer-events-none md:hidden">
        ← swipe to explore →
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modalIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-2xl px-4"
            onClick={() => setModalIndex(null)}
          >
            {/* Close */}
            <button
              onClick={(e) => { e.stopPropagation(); setModalIndex(null); }}
              className="absolute top-5 right-5 text-white/30 hover:text-white transition-all z-[120] p-2"
            >
              <X size={32} strokeWidth={1} />
            </button>

            {/* Prev */}
            <button
              onClick={prevModal}
              className="absolute left-3 md:left-10 p-3 md:p-5 border border-white/10 rounded-full text-white/40 hover:text-cyan-400 hover:border-cyan-400/50 transition-all z-[120]"
            >
              <ChevronLeft size={28} />
            </button>

            {/* Next */}
            <button
              onClick={nextModal}
              className="absolute right-3 md:right-10 p-3 md:p-5 border border-white/10 rounded-full text-white/40 hover:text-cyan-400 hover:border-cyan-400/50 transition-all z-[120]"
            >
              <ChevronRight size={28} />
            </button>

            <motion.div
              key={modalIndex}
              initial={{ y: 40, rotateX: -15 }}
              animate={{ y: 0, rotateX: 0 }}
              exit={{ y: -40 }}
              transition={{ type: "spring", damping: 22, stiffness: 200 }}
              className="card-wrapper"
              style={{ "--riser-bg": SERVICES[modalIndex].riser } as React.CSSProperties}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="card-body shadow-[0_40px_100px_rgba(0,0,0,0.8)]"
                style={{ background: SERVICES[modalIndex].color }}
              >
                <div className="riser r-t" />
                <div className="riser r-b" />
                <div className="riser r-l" />
                <div className="riser r-r" />

                <div className="relative h-full flex flex-col justify-between" style={{ transform: "translateZ(20px)" }}>
                  <div className="rounded-3xl overflow-hidden border-4 border-white/20 shadow-2xl" style={{ height: "clamp(160px,40%,260px)" }}>
                    <img
                      src={SERVICES[modalIndex].img}
                      className="w-full h-full object-cover"
                      alt="service"
                      loading="lazy"
                    />
                  </div>
                  <div className="mt-6">
                    <h2 className="text-black font-black uppercase tracking-tighter leading-[0.85]" style={{ fontSize: "clamp(28px,8vw,52px)" }}>
                      {SERVICES[modalIndex].title}
                    </h2>
                    <p className="text-black/70 text-sm font-bold mt-4 leading-relaxed">
                      Engineering high-performance {SERVICES[modalIndex].desc} logic with the Tezco design system.
                    </p>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <CheckCircle2 size={18} className="text-black/40" />
                    <CheckCircle2 size={18} className="text-black/40" />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}