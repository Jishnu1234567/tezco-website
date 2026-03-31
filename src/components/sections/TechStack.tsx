"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

// ─── Floating boxes background ────────────────────────────────────────────────
function FloatingBoxes() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const isMobile = window.innerWidth < 768;
    let destroyed = false;

    // Skip Three.js entirely on mobile — too expensive, causes scroll lag
    if (isMobile) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      powerPreference: "low-power", // changed from high-performance to reduce thermal throttle
      precision: "mediump",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.7));

    const geo = new THREE.BoxGeometry(0.32, 0.32, 0.32);
    const mat = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const meshes: THREE.Mesh[] = [];

    for (let i = 0; i < 25; i++) {
      const m = new THREE.Mesh(geo, mat);
      m.position.set((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 14, (Math.random() - 0.5) * 7);
      m.userData.rs = Math.random() * 0.007 + 0.002;
      scene.add(m);
      meshes.push(m);
    }

    // Cap at ~30fps on desktop — enough for smooth visuals without blocking scroll
    let last = 0;
    const fpsCap = 33;
    let animId: number;
    let elapsed = 0;
    let lastTs = performance.now();

    const tick = (ts: number) => {
      if (destroyed) return;
      animId = requestAnimationFrame(tick);
      if (ts - last < fpsCap) return;
      const delta = (ts - lastTs) / 1000;
      lastTs = ts;
      elapsed += delta;
      last = ts;

      const s = 0.17 + 0.04 * Math.sin(elapsed * 0.8);
      meshes.forEach((m) => {
        m.scale.setScalar(s);
        m.rotation.x += m.userData.rs;
        m.rotation.y += m.userData.rs;
      });
      renderer.render(scene, camera);
    };
    animId = requestAnimationFrame(tick);

    // Passive scroll — RAF throttled
    let scrollTicking = false;
    const onScroll = () => {
      if (scrollTicking) return;
      scrollTicking = true;
      requestAnimationFrame(() => {
        const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
        camera.position.y = (0.5 - pct) * 9;
        scrollTicking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      destroyed = true;
      cancelAnimationFrame(animId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      geo.dispose();
      mat.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1, opacity: 0.3 }}
    />
  );
}

// ─── Lyric section ────────────────────────────────────────────────────────────
function LyricSection() {
  const words = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const spans = words.current.filter(Boolean) as HTMLSpanElement[];
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          (e.target as HTMLElement).style.setProperty("--l", e.isIntersecting ? "100%" : "60%");
        });
      },
      { threshold: 0.5, rootMargin: "-10% 0px -10% 0px" }
    );
    spans.forEach((s) => obs.observe(s));
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
      fontSize: "clamp(26px,6.5vw,88px)",
      fontWeight: 800,
      lineHeight: 1.18,
      position: "relative",
      zIndex: 10,
      color: "white",
    }}>
      <p>
        {content.map(([text, highlight], i) =>
          highlight ? (
            <span
              key={i}
              ref={(el) => { words.current[i] = el; }}
              style={{
                "--l": "60%",
                color: "hsl(190,100%,var(--l))",
                transition: "color 0.5s ease",
                display: "inline",
              } as React.CSSProperties}
            >
              {text}
            </span>
          ) : (
            <React.Fragment key={i}>{text}</React.Fragment>
          )
        )}
      </p>
    </section>
  );
}

// ─── Split drag section ───────────────────────────────────────────────────────
function SplitSection() {
  const leftRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const rafId = useRef(0);
  const pendingX = useRef<number | null>(null);

  useEffect(() => {
    const getX = (e: MouseEvent | TouchEvent) => {
      if ("touches" in e && e.touches.length) return e.touches[0].clientX;
      if ("changedTouches" in e && e.changedTouches.length) return e.changedTouches[0].clientX;
      return (e as MouseEvent).clientX;
    };

    const commit = () => {
      if (pendingX.current !== null && leftRef.current && handleRef.current) {
        const pct = Math.max(8, Math.min(92, (pendingX.current / window.innerWidth) * 100));
        leftRef.current.style.width = `${pct}%`;
        handleRef.current.style.left = `${pct}%`;
        pendingX.current = null;
      }
      if (dragging.current) rafId.current = requestAnimationFrame(commit);
    };

    // Mouse events — desktop only, no restrictions needed
    const onMouseDown = (e: MouseEvent) => {
      dragging.current = true;
      pendingX.current = e.clientX;
      rafId.current = requestAnimationFrame(commit);
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      pendingX.current = e.clientX;
    };
    const onMouseUp = () => {
      dragging.current = false;
      cancelAnimationFrame(rafId.current);
    };

    // Touch events — only activate drag on HORIZONTAL swipe, let vertical pass through
    let touchStartX = 0;
    let touchStartY = 0;
    let isHorizontalDrag = false;

    const onTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      isHorizontalDrag = false;
    };
    const onTouchMove = (e: TouchEvent) => {
      const dx = Math.abs(e.touches[0].clientX - touchStartX);
      const dy = Math.abs(e.touches[0].clientY - touchStartY);

      if (!isHorizontalDrag && !dragging.current) {
        // Only start drag if clearly horizontal — let vertical pass to scroll
        if (dy > dx) return;
        if (dx > 8) {
          isHorizontalDrag = true;
          dragging.current = true;
          rafId.current = requestAnimationFrame(commit);
        }
      }

      if (dragging.current) {
        pendingX.current = e.touches[0].clientX;
        // Only prevent default when we've confirmed horizontal drag
        // This allows vertical scroll to work normally
      }
    };
    const onTouchEnd = () => {
      dragging.current = false;
      isHorizontalDrag = false;
      cancelAnimationFrame(rafId.current);
    };

    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    // Passive: true on all touch events so scroll is NEVER blocked
    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchmove", onTouchMove, { passive: true });
    document.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      cancelAnimationFrame(rafId.current);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  return (
    <section
      style={{
        position: "relative",
        height: "100vh",
        overflow: "hidden",
        background: "#e0e4d8",
        cursor: "col-resize",
        userSelect: "none",
        // KEY FIX: was "none" which blocked ALL touch including scroll
        // "pan-y" lets vertical scroll pass through to the browser
        touchAction: "pan-y",
      }}
    >
      {/* Right side */}
      <div style={{
        position: "absolute", inset: 0,
        display: "grid", placeItems: "center",
        background: "#e0e4d8",
        zIndex: 1,
      }}>
        <h2 style={{
          fontWeight: 900,
          fontSize: "clamp(20px,4.5vw,5.5vw)",
          color: "#000",
          textAlign: "center",
          padding: "0 5%",
          userSelect: "none",
          letterSpacing: "-0.02em",
        }}>
          SIMPLE IS WORSE
        </h2>
      </div>

      {/* Left side */}
      <div
        ref={leftRef}
        style={{
          position: "absolute", top: 0, left: 0, bottom: 0,
          width: "50%",
          overflow: "hidden",
          background: "#000",
          zIndex: 2,
        }}
      >
        <div style={{
          position: "absolute", inset: 0,
          display: "grid", placeItems: "center",
          width: "100vw",
        }}>
          <h2 style={{
            fontWeight: 900,
            fontSize: "clamp(20px,4.5vw,5.5vw)",
            color: "#fff",
            textAlign: "center",
            padding: "0 5%",
            userSelect: "none",
            letterSpacing: "-0.02em",
          }}>
            SIMPLE IS BETTER
          </h2>
        </div>
      </div>

      {/* Drag handle */}
      <div
        ref={handleRef}
        style={{
          position: "absolute",
          top: 0, bottom: 0,
          left: "50%",
          width: 3,
          background: "#359fe6",
          zIndex: 10,
          pointerEvents: "none",
        }}
      >
        <div style={{
          position: "absolute",
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: 40, height: 40,
          borderRadius: "50%",
          background: "#359fe6",
          display: "grid", placeItems: "center",
          color: "white",
          fontSize: 14,
          boxShadow: "0 0 20px rgba(53,159,230,0.6)",
          pointerEvents: "none",
        }}>
          ⟺
        </div>
      </div>

      <div style={{
        position: "absolute", bottom: 20, left: "50%",
        transform: "translateX(-50%)",
        color: "rgba(0,0,0,0.35)",
        fontSize: 11,
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        zIndex: 20,
        pointerEvents: "none",
        whiteSpace: "nowrap",
      }}>
        drag to compare
      </div>
    </section>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────
export default function UltimateExperience() {
  return (
    <div
      className="experience-wrapper relative w-full bg-[#111] overflow-x-hidden"
      style={{ fontFamily: "'Archivo', sans-serif" }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @import url("https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;700;800;900&display=swap");
      `}} />

      <FloatingBoxes />
      <LyricSection />
      <SplitSection />
    </div>
  );
}