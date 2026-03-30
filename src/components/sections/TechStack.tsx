"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

export default function UltimateExperience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const leftSideRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    let renderer: THREE.WebGLRenderer;
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let meshes: THREE.Mesh[] = [];
    const clock = new THREE.Clock();
    let animId: number;
    let isDestroyed = false;

    // ── Detect mobile ──────────────────────────────────────────────────────────
    const isMobile = window.innerWidth < 768;

    const initThree = () => {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
      camera.position.z = 5;

      renderer = new THREE.WebGLRenderer({
        antialias: false,
        alpha: true,
        powerPreference: "high-performance",
        precision: isMobile ? "mediump" : "highp",
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 1.5));
      renderer.setSize(window.innerWidth, window.innerHeight);
      canvasRef.current?.appendChild(renderer.domElement);

      scene.add(new THREE.AmbientLight(0xffffff, 0.6));

      const geometry = new THREE.BoxGeometry(0.35, 0.35, 0.35);
      const material = new THREE.MeshLambertMaterial({ color: 0xffffff });
      const count = isMobile ? 8 : 30;

      for (let i = 0; i < count; i++) {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 8
        );
        mesh.userData.rs = Math.random() * 0.008 + 0.003;
        scene.add(mesh);
        meshes.push(mesh);
      }
    };

    // ── Render loop — throttled to 30fps on mobile ─────────────────────────────
    let lastFrame = 0;
    const fpsCap = isMobile ? 33 : 16; // ~30fps mobile, ~60fps desktop

    const animate = (ts: number) => {
      if (isDestroyed) return;
      animId = requestAnimationFrame(animate);
      if (ts - lastFrame < fpsCap) return;
      lastFrame = ts;

      // Skip if section is fully off-screen
      if (containerRef.current) {
        const { bottom, top } = containerRef.current.getBoundingClientRect();
        if (bottom < -200 || top > window.innerHeight + 200) return;
      }

      const time = clock.getElapsedTime();
      const scale = 0.18 + 0.04 * Math.sin(Math.PI * 2 * (time / 8));

      meshes.forEach((m) => {
        m.scale.setScalar(scale);
        m.rotation.x += m.userData.rs;
        m.rotation.y += m.userData.rs;
      });

      renderer.render(scene, camera);
    };

    initThree();
    animId = requestAnimationFrame(animate);

    // ── Lyric scroll highlight ─────────────────────────────────────────────────
    const ctx = gsap.context(() => {
      document.querySelectorAll<HTMLElement>(".lyric-content span").forEach((span) => {
        ScrollTrigger.create({
          trigger: span,
          start: "top 85%",
          end: "bottom 15%",
          onUpdate: (self) => {
            const dist = Math.abs(self.progress - 0.5);
            span.style.setProperty("--l", `${80 + (0.5 - dist) * 40}%`);
          },
        });
      });

      // Camera Y scroll
      ScrollTrigger.create({
        trigger: ".experience-wrapper",
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          if (camera) camera.position.y = (0.5 - self.progress) * 10;
        },
      });
    }, containerRef);

    // ── Split drag — unified mouse + touch ─────────────────────────────────────
    let dragging = false;

    const getClientX = (e: MouseEvent | TouchEvent): number => {
      if ("touches" in e && e.touches.length > 0) return e.touches[0].clientX;
      if ("changedTouches" in e && e.changedTouches.length > 0) return e.changedTouches[0].clientX;
      return (e as MouseEvent).clientX;
    };

    const setWidth = (x: number) => {
      if (leftSideRef.current) {
        const pct = Math.max(10, Math.min(90, (x / window.innerWidth) * 100));
        leftSideRef.current.style.width = `${pct}%`;
      }
    };

    const onStart = (e: MouseEvent | TouchEvent) => { dragging = true; setWidth(getClientX(e)); };
    const onMove = (e: MouseEvent | TouchEvent) => { if (dragging) setWidth(getClientX(e)); };
    const onEnd = () => { dragging = false; };

    const splitEl = document.querySelector(".split-container");
    if (splitEl) {
      splitEl.addEventListener("mousedown", onStart as EventListener);
      splitEl.addEventListener("touchstart", onStart as EventListener, { passive: true });
    }
    window.addEventListener("mousemove", onMove as EventListener);
    window.addEventListener("mouseup", onEnd);
    window.addEventListener("touchmove", onMove as EventListener, { passive: true });
    window.addEventListener("touchend", onEnd);

    // ── Resize ────────────────────────────────────────────────────────────────
    const onResize = () => {
      if (!renderer || !camera) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      isDestroyed = true;
      cancelAnimationFrame(animId);
      ctx.revert();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMove as EventListener);
      window.removeEventListener("mouseup", onEnd);
      window.removeEventListener("touchmove", onMove as EventListener);
      window.removeEventListener("touchend", onEnd);
      if (splitEl) {
        splitEl.removeEventListener("mousedown", onStart as EventListener);
        splitEl.removeEventListener("touchstart", onStart as EventListener);
      }
      renderer?.dispose();
      meshes.forEach((m) => { m.geometry.dispose(); (m.material as THREE.Material).dispose(); });
    };
  }, []);

  return (
    <div ref={containerRef} className="experience-wrapper relative w-full bg-[#111] overflow-x-hidden">
      <style dangerouslySetInnerHTML={{ __html: `
        .lyric-content {
          color: white;
          font-family: 'Archivo', sans-serif;
          padding: clamp(60px,20vh,200px) clamp(20px,5vw,80px);
          font-size: clamp(28px, 7vw, 100px);
          font-weight: 800;
          line-height: 1.15;
          position: relative;
          z-index: 10;
        }
        .lyric-content span {
          --l: 80%;
          color: hsl(190, 100%, var(--l));
          transition: color 0.1s;
          display: inline;
        }

        /* Split section */
        .split-container {
          position: relative;
          height: clamp(300px, 100vh, 100vh);
          background: #e0e4d8;
          overflow: hidden;
          cursor: col-resize;
          touch-action: none;
        }
        .side {
          display: grid;
          height: 100%;
          place-items: center;
          position: absolute;
          top: 0;
        }
        #right-side {
          width: 100%;
          background: #e0e4d8;
        }
        #left-side {
          background: #000;
          z-index: 2;
          border-right: 3px solid #359fe6;
          width: 50%;
          transition: none; /* no transition — we want real-time drag feel */
        }
        .side .title {
          font-family: 'Archivo', sans-serif;
          font-size: clamp(24px, 5vw, 6vw);
          font-weight: 900;
          color: #000;
          padding: 0 5%;
          text-align: center;
          user-select: none;
        }
        #left-side .title { color: #fff; }

        /* Drag hint bar */
        #left-side::after {
          content: '⟺';
          position: absolute;
          right: -20px;
          top: 50%;
          transform: translateY(-50%);
          width: 40px;
          height: 40px;
          background: #359fe6;
          border-radius: 50%;
          display: grid;
          place-items: center;
          color: white;
          font-size: 14px;
          z-index: 10;
          pointer-events: none;
        }

        /* Three canvas */
        .three-canvas-wrapper {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 1;
          opacity: 0.35;
        }
        .three-canvas-wrapper canvas {
          display: block;
          width: 100% !important;
          height: 100% !important;
        }
      `}} />

      {/* Three.js canvas */}
      <div ref={canvasRef} className="three-canvas-wrapper" />

      {/* Lyric text */}
      <section className="lyric-content">
        <p>
          Technical experts building in the heart of{" "}
          <span>innovation</span>
          <br />
          Waiting for this <span>stack</span> to arise
        </p>
      </section>

      {/* Split section */}
      <section className="split-container">
        <div id="right-side" className="side">
          <h2 className="title">SIMPLE IS WORSE</h2>
        </div>
        <div ref={leftSideRef} id="left-side" className="side">
          <h2 className="title">SIMPLE IS BETTER</h2>
        </div>
      </section>
    </div>
  );
}