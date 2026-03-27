"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Draggable } from "gsap/dist/Draggable";
import { motion, AnimatePresence } from "framer-motion";
import { Layout, Globe, Smartphone, GraduationCap, X, CheckCircle2, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(Draggable);
}

const SERVICES = [
  { title: "SaaS", icon: <Layout />, desc: "Cloud Interfaces", img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800", color: "#4ba877", riser: "#3d855e" },
  { title: "Web", icon: <Globe />, desc: "Modern Portfolios", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800", color: "#4b86a8", riser: "#3a6a85" },
  { title: "App", icon: <Smartphone />, desc: "Mobile Systems", img: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=800", color: "#a84b84", riser: "#853a69" },
  { title: "Edu", icon: <GraduationCap />, desc: "College Projects", img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800", color: "#ffe14b", riser: "#ccb43c" },
  { title: "SaaS", icon: <Layout />, desc: "Visual Editors", img: "https://tse3.mm.bing.net/th/id/OIP.ZtYk3CZFZVfKNBunNWU6hwHaEK?rs=1&pid=ImgDetMain&o=7&rm=3", color: "#4ba877", riser: "#3d855e" },
  { title: "Web", icon: <Globe />, desc: "E-Commerce", img: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?q=80&w=800", color: "#4b86a8", riser: "#3a6a85" },
  { title: "App", icon: <Smartphone />, desc: "React Native", img: "https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?q=80&w=800", color: "#a84b84", riser: "#853a69" },
  { title: "Edu", icon: <GraduationCap />, desc: "System Design", img: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800", color: "#ffe14b", riser: "#ccb43c" },
  { title: "Tech", icon: <Layout />, desc: "SaaS Logic", img: "https://tse3.mm.bing.net/th/id/OIP.Vw4PF5JXQ6yKBJkjrPLlLAHaFH?pid=ImgDet&w=474&h=327&rs=1&o=7&rm=3", color: "#4ba877", riser: "#3d855e" },
  { title: "FullStack", icon: <Globe />, desc: "Django Backend", img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800", color: "#4b86a8", riser: "#3a6a85" },
];

export default function Services() {
  const ringRef = useRef<HTMLDivElement>(null);
  const draggerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [modalIndex, setModalIndex] = useState<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let stars: { x: number; y: number; size: number; speed: number }[] = [];
    const initStars = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      stars = Array.from({ length: 150 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5,
        speed: Math.random() * 0.5 + 0.1,
      }));
    };
    const animateStars = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
      stars.forEach((s) => {
        ctx.beginPath(); ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2); ctx.fill();
        s.y += s.speed; if (s.y > canvas.height) s.y = 0;
      });
      requestAnimationFrame(animateStars);
    };
    initStars(); animateStars();
    window.addEventListener("resize", initStars);
    return () => window.removeEventListener("resize", initStars);
  }, []);

  useEffect(() => {
    const ring = ringRef.current;
    const dragger = draggerRef.current;
    if (!ring || !dragger) return;
    let xPos = 0;

    const updateActiveIndex = () => {
      const rotation = gsap.getProperty(ring, "rotationY") as number;
      const index = Math.round((360 - gsap.utils.wrap(0, 360, rotation)) / 36) % 10;
      setActiveIndex(Math.abs(index));
    };

    const rotateRing = (delta: number) => {
      gsap.to(ring, {
        rotationY: `-=${delta}`, duration: 0.6, ease: "power3.out",
        onUpdate: updateActiveIndex,
      });
    };

    const handleWheel = (e: WheelEvent) => {
      rotateRing(e.deltaY * 0.2);
    };
    window.addEventListener("wheel", handleWheel);

    const drag = Draggable.create(dragger, {
      type: "x",
onDragStart: (e) => { 
  xPos = Math.round(e.touches ? e.touches[0].clientX : e.clientX); 
},      onDrag: (e) => {
        const cx = e.touches ? e.touches[0].clientX : e.clientX;
        rotateRing(-(cx - xPos) * 0.5); xPos = Math.round(cx);
      },
    })[0];

    gsap.set(ring, { rotationY: 180 });
    gsap.set(".img-card", {
      rotateY: (i) => i * -36, transformOrigin: "50% 50% 500px", z: -500, backfaceVisibility: "hidden",
    });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      if (drag) drag.kill();
    };
  }, []);

  const nextModal = (e: React.MouseEvent) => { e.stopPropagation(); setModalIndex((prev) => (prev !== null ? (prev + 1) % SERVICES.length : 0)); };
  const prevModal = (e: React.MouseEvent) => { e.stopPropagation(); setModalIndex((prev) => (prev !== null ? (prev - 1 + SERVICES.length) % SERVICES.length : 0)); };

  return (
    <section className="relative w-screen h-screen overflow-hidden bg-black flex items-center justify-center font-['Lexend']">
      <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-40" />

      <style jsx global>{`
        .img-card {
          width: 100%; height: 100%; position: absolute;
          background-size: cover; background-position: center;
          border: 1px solid rgba(255,255,255,0.1); border-radius: 12px;
        }
        .glass-panel {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .cube-btn {
          position: relative; width: 140px; height: 50px;
          transition: 0.6s cubic-bezier(0.4, 0, 0.2, 1); transform-style: preserve-3d;
        }
        .cube-btn:hover { transform: rotateX(90deg); }
        .cube-btn span {
          position: absolute; top: 0; left: 0; width: 100%; height: 100%;
          display: flex; align-items: center; justify-content: center;
          font-size: 10px; letter-spacing: 2px; text-transform: uppercase; font-weight: 900;
          border: 1px solid rgba(255,255,255,0.1);
        }
        .cube-btn span:nth-child(1) { transform: rotateX(0deg) translateZ(25px); background: #111; color: #fff; }
        .cube-btn span:nth-child(2) { transform: rotateX(-90deg) translateZ(25px); background: #22d3ee; color: #000; }
        .cube-btn span:nth-child(3) { transform: rotateX(-180deg) translateZ(25px); background: #111; color: #fff; }
        .cube-btn span:nth-child(4) { transform: rotateX(-270deg) translateZ(25px); background: #22d3ee; color: #000; }

        .card-wrapper { width: 400px; height: 580px; position: relative; transform-style: preserve-3d; perspective: 2000px; }
        .card-body { position: absolute; inset: 0; border-radius: 32px; padding: 40px; transform-style: preserve-3d; }
        .riser { position: absolute; background: var(--riser-bg); backface-visibility: hidden; }
        .r-t { width: 100%; height: 30px; transform-origin: top; transform: rotateX(90deg); top: 0; left: 0; }
        .r-b { width: 100%; height: 30px; transform-origin: bottom; transform: rotateX(-90deg); bottom: 0; left: 0; }
        .r-l { width: 30px; height: 100%; transform-origin: left; transform: rotateY(-90deg); left: 0; top: 0; }
        .r-r { width: 30px; height: 100%; transform-origin: right; transform: rotateY(90deg); right: 0; top: 0; }
      `}</style>

      {/* Interaction Layer */}
      <div ref={draggerRef} className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing" />

      {/* BACKGROUND HEADING: TEZCO SERVICE */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center z-0 pointer-events-none select-none">
        <h1 className="text-white/[0.50] text-[22vw] font-black uppercase tracking-tighter leading-none">
          TEZCO SERVICE
        </h1>
      </div>

      {/* 3D Ring */}
      <div className="relative w-[280px] h-[380px] perspective-[2000px] z-20" style={{ transformStyle: "preserve-3d" }}>
        <div ref={ringRef} className="w-full h-full relative" style={{ transformStyle: "preserve-3d" }}>
          {SERVICES.map((s, i) => (
            <div key={i} className="img-card group" style={{ backgroundImage: `url(${s.img})` }}>
              <div className="absolute inset-0 bg-black/40 rounded-xl" />
            </div>
          ))}
        </div>
      </div>

      {/* Center Service Display */}
      <div className="absolute z-30 pointer-events-none text-center">
        <AnimatePresence mode="wait">
          <motion.div key={activeIndex} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.2 }}
            className="flex flex-col items-center glass-panel p-10 rounded-full shadow-[0_0_60px_rgba(34,211,238,0.1)]">
            <div className="text-cyan-400 mb-2">{SERVICES[activeIndex % SERVICES.length].icon}</div>
            <h3 className="text-white text-3xl font-black uppercase tracking-widest">{SERVICES[activeIndex % SERVICES.length].title}</h3>
            <p className="text-white/40 text-[10px] uppercase tracking-[0.5em] mt-2">{SERVICES[activeIndex % SERVICES.length].desc}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer 3D Cube Buttons */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-[80] flex gap-6">
        {SERVICES.slice(0, 4).map((item, idx) => (
          <div key={idx} className="cube-btn cursor-pointer" onClick={() => setModalIndex(idx)}>
            <span>{item.title}</span>
            <span>Discover</span>
            <span>{item.title}</span>
            <span>Tezco</span>
          </div>
        ))}
      </div>

      {/* Popup Modal */}
      <AnimatePresence>
        {modalIndex !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-2xl">
            
            <button onClick={() => setModalIndex(null)} className="absolute top-10 right-10 text-white/30 hover:text-white transition-all z-[120]">
              <X size={40} strokeWidth={1} />
            </button>
            
            <button onClick={prevModal} className="absolute left-10 p-5 border border-white/10 rounded-full text-white/40 hover:text-cyan-400 hover:border-cyan-400/50 transition-all z-[120]">
              <ChevronLeft size={44} />
            </button>
            <button onClick={nextModal} className="absolute right-10 p-5 border border-white/10 rounded-full text-white/40 hover:text-cyan-400 hover:border-cyan-400/50 transition-all z-[120]">
              <ChevronRight size={44} />
            </button>

            <motion.div key={modalIndex} initial={{ y: 50, rotateX: -20 }} animate={{ y: 0, rotateX: 0 }} transition={{ type: "spring", damping: 20 }}
              className="card-wrapper" style={{ '--riser-bg': SERVICES[modalIndex].riser } as any}>
              <div className="card-body shadow-[0_40px_100px_rgba(0,0,0,0.8)]" style={{ background: SERVICES[modalIndex].color }}>
                <div className="riser r-t" /><div className="riser r-b" /><div className="riser r-l" /><div className="riser r-r" />
                
                <div className="relative h-full flex flex-col justify-between" style={{ transform: "translateZ(30px)" }}>
                  <div className="h-64 w-full rounded-3xl overflow-hidden border-4 border-white/20 shadow-2xl">
                    <img src={SERVICES[modalIndex].img} className="w-full h-full object-cover" alt="service" />
                  </div>
                  <div className="mt-10">
                    <h2 className="text-black text-5xl font-black uppercase tracking-tighter leading-[0.8]">{SERVICES[modalIndex].title}</h2>
                    <p className="text-black/70 text-sm font-bold mt-6 leading-relaxed max-w-[90%]">Engineering high-performance {SERVICES[modalIndex].desc} logic with the Tezco design system.</p>
                  </div>
                  <div className="flex justify-between items-center mt-auto">
                    <div className="flex gap-2">
                       <CheckCircle2 size={18} className="text-black/40" />
                       <CheckCircle2 size={18} className="text-black/40" />
                    </div>
                   
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute inset-0 pointer-events-none border-[40px] border-black/20 z-[5] radial-mask" />
    </section>
  );
}