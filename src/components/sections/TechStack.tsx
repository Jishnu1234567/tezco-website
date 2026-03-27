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

    // --- 1. THREE.JS FLOATING PARTICLES (Experience Class Logic) ---
    let renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera;
    let meshes: THREE.Mesh[] = [];
    const clock = new THREE.Clock();

    const initThree = () => {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
      camera.position.z = 5;

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(window.innerWidth, window.innerHeight);
      canvasRef.current?.appendChild(renderer.domElement);

      // Lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
      scene.add(ambientLight);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(5, 3, 2);
      scene.add(directionalLight);

      // Create Floating Boxes
      const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
      const material = new THREE.MeshLambertMaterial({ color: 0xffffff });

      for (let i = 0; i < 45; i++) {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 10
        );
        mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
        mesh.userData.rotationSpeed = Math.random() * 0.01 + 0.005;
        scene.add(mesh);
        meshes.push(mesh);
      }
    };

    const animate = () => {
      const time = clock.getElapsedTime();
      const scaleEffect = 0.2 + 0.05 * Math.sin(Math.PI * 2 * (time / 8));

      meshes.forEach((m) => {
        m.scale.set(scaleEffect, scaleEffect, scaleEffect);
        m.rotation.x += m.userData.rotationSpeed;
        m.rotation.y += m.userData.rotationSpeed;
      });

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    initThree();
    animate();

    // --- 2. GSAP SCROLL TRIGGERS (Lyrics & Camera) ---
    const ctx = gsap.context(() => {
      // Light up spans on scroll
      document.querySelectorAll(".lyric-content span").forEach((span) => {
        gsap.to(span, {
          scrollTrigger: {
            trigger: span,
            start: "top 80%",
            end: "bottom 20%",
            onUpdate: (self) => {
              const dist = Math.abs(self.progress - 0.5);
              const lightness = 80 + (0.5 - dist) * 40; // Map to 80-100%
              (span as HTMLElement).style.setProperty("--l", `${lightness}%`);
            },
          },
        });
      });

      // Move Three.js Camera on Scroll
      ScrollTrigger.create({
        trigger: ".experience-wrapper",
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const cameraRange = 8;
          camera.position.y = (0.5 - self.progress) * (cameraRange * 2);
        }
      });

      // Split Screen Resize Logic
      const handleMove = (e: MouseEvent | TouchEvent) => {
        const clientX = 'clientX' in e ? e.clientX : e.touches[0].clientX;
        const percentage = (clientX / window.innerWidth) * 100;
        if (leftSideRef.current) {
          leftSideRef.current.style.width = `${percentage}%`;
        }
      };

      window.addEventListener("mousemove", handleMove);
      window.addEventListener("touchstart", handleMove);
    }, containerRef);

    // Resize Handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      ctx.revert();
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="experience-wrapper relative w-full bg-[#111] overflow-x-hidden">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Work+Sans:wght@800&family=Montserrat:wght@800&family=Permanent+Marker&display=swap');

        .lyric-content {
          color: white;
          font-family: "Work Sans", sans-serif;
          padding: 10vw 5vw;
          font-size: clamp(24px, 6vw, 100px);
          line-height: 1.1;
          z-index: 10;
          position: relative;
        }

        .lyric-content span {
          --h: 200; --s: 100%; --l: 80%;
          position: relative;
          color: hsl(var(--h), var(--s), var(--l));
          background: linear-gradient(to right, hsl(var(--h), 100%, 80%), hsl(calc(var(--h) + 30), 100%, 80%));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          transition: --l 0.1s linear;
        }

        /* Split Screen Section */
        .split-container {
          position: relative;
          height: 100vh;
          width: 100vw;
          overflow: hidden;
          background-color: #e0e4d8; /* Right side color */
        }

        .side {
          display: grid;
          height: 100vh;
          place-items: center;
          position: absolute;
          width: 100%;
          overflow: hidden;
        }

        .side .title {
          font-family: "Montserrat", sans-serif;
          font-size: 7vw;
          font-weight: 800;
          margin: 0 10vw;
          width: 80vw;
        }

        .side .fancy {
          font-family: "Permanent Marker", cursive;
          font-size: 1.8em;
          line-height: 0.6em;
        }

        #left-side {
          background-color: #000000;
          width: 60%;
          z-index: 2;
          border-right: 4px solid #359fe6;
        }

        #left-side .title { color: white; }
        #left-side .fancy { color: #33caef; }
        #right-side .title { color: #000000; }
        #right-side .fancy { color: #33caef; }

        .three-canvas-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
          opacity: 0.8;
        }

        .three-canvas-container:after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, #111 0%, transparent 15%, transparent 85%, #111 100%);
        }
      `}} />

      {/* Floating Particles background */}
      <div ref={canvasRef} className="three-canvas-container" />

      {/* 1. LYRICS SECTION */}
      <section className="lyric-content">
       <p>
    Technical experts building in the heart of <span style={{"--h": 165} as any}>innovation</span><br />
    Take these legacy <span style={{"--h": 170} as any}>systems</span> and learn to scale<br />
    All your life<br />
    You were only <span style={{"--h": 175} as any}>waiting</span> for this stack to arise<br />
    
  </p>
      </section>

      {/* 2. SPLIT SCREEN INTERACTIVE SECTION */}
      <section className="split-container">
        <div ref={leftSideRef} id="left-side" className="side">
          <h2 className="title">
            Sometimes a simple header is <span className="fancy">better</span>
          </h2>
        </div>
        <div id="right-side" className="side">
          <h2 className="title">
            Sometimes a simple header is <span className="fancy">worse</span>
          </h2>
        </div>
      </section>

      {/* Spacing for scroll effect */}
      <div className="h-[50vh]" />
    </div>
  );
}