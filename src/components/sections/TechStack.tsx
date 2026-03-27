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

    let renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera;
    let meshes: THREE.Mesh[] = [];
    const clock = new THREE.Clock();

    const initThree = () => {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
      camera.position.z = 5;

      const isMobile = window.innerWidth < 768;

      renderer = new THREE.WebGLRenderer({ 
        antialias: false, // Performance over smoothness for mobile
        alpha: true,
        powerPreference: "high-performance" 
      });
      
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // Capped for mobile
      renderer.setSize(window.innerWidth, window.innerHeight);
      canvasRef.current?.appendChild(renderer.domElement);

      scene.add(new THREE.AmbientLight(0xffffff, 0.5));

      const geometry = new THREE.BoxGeometry(0.4, 0.4, 0.4);
      const material = new THREE.MeshLambertMaterial({ color: 0xffffff });
      const boxCount = isMobile ? 12 : 35;

      for (let i = 0; i < boxCount; i++) {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 15, (Math.random() - 0.5) * 10);
        mesh.userData.rotationSpeed = Math.random() * 0.01 + 0.005;
        scene.add(mesh);
        meshes.push(mesh);
      }
    };

    const animate = () => {
      if (!renderer || !containerRef.current) return;

      // STOP rendering if section is off-screen
      const rect = containerRef.current.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) {
        requestAnimationFrame(animate);
        return;
      }

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

    const ctx = gsap.context(() => {
      document.querySelectorAll(".lyric-content span").forEach((span) => {
        gsap.to(span, {
          scrollTrigger: {
            trigger: span,
            start: "top 85%",
            end: "bottom 15%",
            onUpdate: (self) => {
              const dist = Math.abs(self.progress - 0.5);
              (span as HTMLElement).style.setProperty("--l", `${80 + (0.5 - dist) * 40}%`);
            },
          },
        });
      });

      ScrollTrigger.create({
        trigger: ".experience-wrapper",
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => { camera.position.y = (0.5 - self.progress) * 12; }
      });

      const handleMove = (e: any) => {
        const x = e.clientX || e.touches?.[0]?.clientX;
        if (x && leftSideRef.current) {
          leftSideRef.current.style.width = `${(x / window.innerWidth) * 100}%`;
        }
      };

      window.addEventListener("mousemove", handleMove);
      window.addEventListener("touchstart", handleMove);
      return () => {
        window.removeEventListener("mousemove", handleMove);
        window.removeEventListener("touchstart", handleMove);
      };
    }, containerRef);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      ctx.revert();
      window.removeEventListener("resize", handleResize);
      renderer?.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="experience-wrapper relative w-full bg-[#111] overflow-x-hidden">
      <style dangerouslySetInnerHTML={{ __html: `
        .lyric-content { color: white; font-family: sans-serif; padding: 20vh 5vw; font-size: clamp(28px, 7vw, 100px); font-weight: 800; line-height: 1.1; position: relative; z-index: 10; }
        .lyric-content span { --l: 80%; color: hsl(190, 100%, var(--l)); transition: color 0.1s; }
        .split-container { position: relative; height: 100vh; background: #e0e4d8; overflow: hidden; }
        .side { display: grid; height: 100vh; place-items: center; position: absolute; width: 100%; }
        #left-side { background: #000; z-index: 2; border-right: 3px solid #359fe6; width: 50%; }
        .side .title { font-size: 6vw; font-weight: 900; color: #000; padding: 0 10%; text-align: center; }
        #left-side .title { color: #fff; }
        .three-canvas-container { position: fixed; inset: 0; pointer-events: none; z-index: 1; opacity: 0.5; }
      `}} />
      <div ref={canvasRef} className="three-canvas-container" />
      <section className="lyric-content">
        <p>Technical experts building in the heart of <span>innovation</span><br />
        Waiting for this <span>stack</span> to arise</p>
      </section>
      <section className="split-container">
        <div ref={leftSideRef} id="left-side" className="side"><h2 className="title">SIMPLE IS BETTER</h2></div>
        <div id="right-side" className="side"><h2 className="title">SIMPLE IS WORSE</h2></div>
      </section>
    </div>
  );
}