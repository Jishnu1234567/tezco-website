"use client";

import React, { useEffect, useRef } from "react";

// ─── Floating boxes — CSS only, no Three.js ───────────────────────────────────
function FloatingBoxes() {
  return (
    <>
      <style>{`
        @keyframes floatBox {
          0%   { transform: translateY(0px)   rotate(0deg); }
          50%  { transform: translateY(-30px) rotate(180deg); }
          100% { transform: translateY(0px)   rotate(360deg); }
        }
        .fbox {
          position: absolute;
          border: 1px solid rgba(255,255,255,0.15);
          animation: floatBox linear infinite;
          will-change: transform;
        }
      `}</style>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1, opacity: 0.25, overflow: "hidden" }}>
        {[
          { w:18, h:18, top:"8%",  left:"12%", dur:"9s",  delay:"0s"   },
          { w:12, h:12, top:"22%", left:"78%", dur:"13s", delay:"1s"   },
          { w:22, h:22, top:"55%", left:"5%",  dur:"11s", delay:"2s"   },
          { w:14, h:14, top:"70%", left:"88%", dur:"15s", delay:"0.5s" },
          { w:10, h:10, top:"38%", left:"55%", dur:"8s",  delay:"3s"   },
          { w:20, h:20, top:"15%", left:"42%", dur:"12s", delay:"1.5s" },
          { w:16, h:16, top:"82%", left:"30%", dur:"10s", delay:"2.5s" },
          { w:8,  h:8,  top:"46%", left:"92%", dur:"14s", delay:"0.8s" },
          { w:24, h:24, top:"62%", left:"62%", dur:"16s", delay:"1.2s" },
          { w:11, h:11, top:"5%",  left:"95%", dur:"7s",  delay:"4s"   },
        ].map((b, i) => (
          <div key={i} className="fbox" style={{
            width: b.w, height: b.h,
            top: b.top, left: b.left,
            animationDuration: b.dur,
            animationDelay: b.delay,
          }} />
        ))}
      </div>
    </>
  );
}

// ─── Lyric section ────────────────────────────────────────────────────────────
function LyricSection() {
  const words = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const spans = words.current.filter(Boolean) as HTMLSpanElement[];
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        (e.target as HTMLElement).style.setProperty("--l", e.isIntersecting ? "100%" : "60%");
      }),
      { threshold: 0.5, rootMargin: "-10% 0px -10% 0px" }
    );
    spans.forEach(s => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  const content: [string, boolean][] = [
    ["Technical experts building in the heart of ", false],
    ["innovation", true],
    [" — waiting for this ", false],
    ["stack", true],
    [" to arise.", false],
  ];

  return (
    <section style={{
      padding: "clamp(80px,18vh,200px) clamp(20px,6vw,80px)",
      fontSize: "clamp(24px,6vw,82px)",
      fontWeight: 800, lineHeight: 1.18,
      position: "relative", zIndex: 10, color: "white",
    }}>
      <p>
        {content.map(([text, highlight], i) =>
          highlight ? (
            <span key={i} ref={el => { words.current[i] = el; }}
              style={{ "--l": "60%", color: "hsl(190,100%,var(--l))", transition: "color 0.5s ease", display: "inline" } as React.CSSProperties}>
              {text}
            </span>
          ) : <React.Fragment key={i}>{text}</React.Fragment>
        )}
      </p>
    </section>
  );
}

// ─── Split drag section ───────────────────────────────────────────────────────
function SplitSection() {
  const leftRef   = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const dragging  = useRef(false);
  const rafId     = useRef(0);
  const pendingX  = useRef<number | null>(null);

  useEffect(() => {
    const commit = () => {
      if (pendingX.current !== null && leftRef.current && handleRef.current) {
        const pct = Math.max(8, Math.min(92, (pendingX.current / window.innerWidth) * 100));
        leftRef.current.style.width  = `${pct}%`;
        handleRef.current.style.left = `${pct}%`;
        pendingX.current = null;
      }
      if (dragging.current) rafId.current = requestAnimationFrame(commit);
    };

    // ── Mouse (desktop) ──
    const onMouseDown = (e: MouseEvent) => {
      dragging.current = true;
      pendingX.current = e.clientX;
      rafId.current = requestAnimationFrame(commit);
    };
    const onMouseMove = (e: MouseEvent) => { if (dragging.current) pendingX.current = e.clientX; };
    const onMouseUp   = () => { dragging.current = false; cancelAnimationFrame(rafId.current); };

    // ── Touch (mobile) — only horizontal drag, vertical scroll passes through ──
    let startX = 0, startY = 0, isH = false;
    const onTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      isH = false;
    };
    const onTouchMove = (e: TouchEvent) => {
      const dx = Math.abs(e.touches[0].clientX - startX);
      const dy = Math.abs(e.touches[0].clientY - startY);
      if (!isH && !dragging.current) {
        if (dy > dx) return;
        if (dx > 8) { isH = true; dragging.current = true; rafId.current = requestAnimationFrame(commit); }
      }
      if (dragging.current) pendingX.current = e.touches[0].clientX;
    };
    const onTouchEnd = () => { dragging.current = false; isH = false; cancelAnimationFrame(rafId.current); };

    document.addEventListener("mousedown",  onMouseDown);
    document.addEventListener("mousemove",  onMouseMove);
    document.addEventListener("mouseup",    onMouseUp);
    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchmove",  onTouchMove,  { passive: true });
    document.addEventListener("touchend",   onTouchEnd,   { passive: true });

    return () => {
      cancelAnimationFrame(rafId.current);
      document.removeEventListener("mousedown",  onMouseDown);
      document.removeEventListener("mousemove",  onMouseMove);
      document.removeEventListener("mouseup",    onMouseUp);
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchmove",  onTouchMove);
      document.removeEventListener("touchend",   onTouchEnd);
    };
  }, []);

  const textStyle: React.CSSProperties = {
    fontWeight: 900,
    fontSize: "clamp(18px,4vw,52px)",
    textAlign: "center",
    padding: "0 5%",
    userSelect: "none",
    letterSpacing: "-0.02em",
  };

  return (
    <section style={{
      position: "relative", height: "100vh",
      overflow: "hidden", background: "#e0e4d8",
      cursor: "col-resize", userSelect: "none",
      touchAction: "pan-y",
    }}>
      {/* Right */}
      <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", background: "#e0e4d8", zIndex: 1 }}>
        <h2 style={{ ...textStyle, color: "#000" }}>Deliver a Message, Our experts will reach out shortly</h2>
      </div>

      {/* Left */}
      <div ref={leftRef} style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: "50%", overflow: "hidden", background: "#000", zIndex: 2 }}>
        <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", width: "100vw" }}>
          <h2 style={{ ...textStyle, color: "#fff" }}>Ready to build something legendary?</h2>
        </div>
      </div>

      {/* Handle */}
      <div ref={handleRef} style={{ position: "absolute", top: 0, bottom: 0, left: "50%", width: 3, background: "#359fe6", zIndex: 10, pointerEvents: "none" }}>
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          width: 40, height: 40, borderRadius: "50%",
          background: "#359fe6", display: "grid", placeItems: "center",
          color: "white", fontSize: 14,
          boxShadow: "0 0 20px rgba(53,159,230,0.6)",
          pointerEvents: "none",
        }}>⟺</div>
      </div>

      <div style={{
        position: "absolute", bottom: 20, left: "50%",
        transform: "translateX(-50%)",
        color: "rgba(0,0,0,0.35)", fontSize: 11,
        letterSpacing: "0.2em", textTransform: "uppercase",
        zIndex: 20, pointerEvents: "none", whiteSpace: "nowrap",
      }}>drag to compare</div>
    </section>
  );
}

export default function UltimateExperience() {
  return (
    <div className="relative w-full bg-[#111] overflow-x-hidden" style={{ fontFamily: "'Archivo',sans-serif" }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url("https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;700;800;900&display=swap");
      `}} />
      <FloatingBoxes />
      <LyricSection />
      <SplitSection />
    </div>
  );
}