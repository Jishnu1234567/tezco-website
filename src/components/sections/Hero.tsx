"use client";

import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
// Fixed: Correct import for RGBELoader to avoid the deprecation warning
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { motion } from "framer-motion";
import { Radio } from "lucide-react";
import { animate, createTimeline, createTimer, stagger, utils } from 'animejs';

function DataCoreScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#000000');

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 7);

    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current, 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance" 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    // --- Environment ---
    const rgbeLoader = new RGBELoader();
    rgbeLoader.load('https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/royal_esplanade_2k.hdr', (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = texture;
    });

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambientLight);
    
    const frontLight = new THREE.DirectionalLight(0xffffff, 2.0);
    frontLight.position.set(0, 2, 10);
    scene.add(frontLight);

    const group = new THREE.Group();
    scene.add(group);

    // --- Logo ---
    const textureLoader = new THREE.TextureLoader();
    const logoTexture = textureLoader.load('/TEZCO (2).png'); 
    logoTexture.colorSpace = THREE.SRGBColorSpace;
    
    const logoMat = new THREE.MeshStandardMaterial({ 
      map: logoTexture, 
      transparent: true, 
      roughness: 0.2,
      metalness: 0.1,
      side: THREE.DoubleSide,
      depthWrite: true,
      alphaTest: 0.05 
    });

    const logoMesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), logoMat);
    logoMesh.renderOrder = 0; 
    group.add(logoMesh);

    logoTexture.onUpdate = () => {
      const img = logoTexture.image;
      if (img) {
        const ratio = img.width / img.height;
        const s = 2.0;
        ratio > 1 ? logoMesh.scale.set(s, s / ratio, 1) : logoMesh.scale.set(s * ratio, s, 1);
      }
    };

    // --- Glass Shell ---
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: '#ffffff',
      transmission: 1.0,
      opacity: 1.0,
      ior: 1.45, // Slightly changed to help GPU math precision
      thickness: 1.0, // Whole number helps prevent "double precision" warnings
      roughness: 0.0,
      metalness: 0.0,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide
    });

    const glassMesh = new THREE.Mesh(new RoundedBoxGeometry(2.5, 2.5, 1.0, 32, 0.25), glassMat);
    glassMesh.renderOrder = 1; 
    group.add(glassMesh);

    // --- Modern Animation Loop (Fixes Clock Warning) ---
    let lastTime = 0;
    let accumulatedTime = 0;

    const animateLoop = (now: number) => {
      const requestID = requestAnimationFrame(animateLoop);
      
      // Converting timestamp to seconds (Modern THREE.Timer style)
      const deltaTime = (now - lastTime) / 1000;
      if (deltaTime > 0.1) { lastTime = now; return; } // Prevent jump on tab switch
      lastTime = now;
      accumulatedTime += deltaTime;

      group.rotation.y += deltaTime * 0.5;
      group.rotation.x = Math.cos(accumulatedTime * 0.4) * 0.2;
      group.rotation.z = Math.sin(accumulatedTime * 0.3) * 0.1;

      renderer.render(scene, camera);
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
    requestAnimationFrame(animateLoop);
    
    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      // Clean up the logo and glass textures/geometries here for performance
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-10 pointer-events-none" />;
}

export default function Hero() {
  const creatureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!creatureRef.current) return;
    const rows = 13;
    const grid = [rows, rows];
    const from = 'center';
    const viewport = { w: window.innerWidth * .5, h: window.innerHeight * .5 };
    const cursor = { x: 0, y: 0 };

    creatureRef.current.innerHTML = '';
    for (let i = 0; i < (rows * rows); i++) {
      const dot = document.createElement('div');
      Object.assign(dot.style, {
        position: 'relative', width: '4em', height: '4em', margin: '3em',
        borderRadius: '2em', willChange: 'transform', mixBlendMode: 'plus-lighter', background: '#2acbef'
      });
      creatureRef.current.appendChild(dot);
    }

    const particuleEls = creatureRef.current.querySelectorAll('div');
    const scaleStagger = stagger([2, 5], { ease: 'inQuad', grid, from });
    const opacityStagger = stagger([1, .1], { grid, from });

    utils.set(creatureRef.current, { width: rows * 10 + 'em', height: rows * 10 + 'em' });
    utils.set(particuleEls, {
      x: 0, y: 0, scale: scaleStagger, opacity: opacityStagger,
      background: stagger([80, 20], { grid, from, modifier: (v: any) => `hsl(185, 100%, ${v}%)` }),
      boxShadow: stagger([8, 1], { grid, from, modifier: (v: any) => `0px 0px ${utils.round(v, 0)}em 0px rgba(0, 242, 255, 0.5)` }),
    });

    const pulse = () => {
      animate(particuleEls, {
        keyframes: [
          { scale: 5, opacity: 1, delay: stagger(90, { start: 1650, grid, from }), duration: 150 },
          { scale: scaleStagger, opacity: opacityStagger, ease: 'inOutQuad', duration: 600 }
        ],
      });
    }

    const mainLoop = createTimer({
      frameRate: 15,
      onUpdate: () => {
        animate(particuleEls, {
          x: cursor.x, y: cursor.y, delay: stagger(40, { grid, from }),
          duration: stagger(120, { start: 750, ease: 'inQuad', grid, from }),
          ease: 'inOut', composition: 'blend',
        });
      }
    });

    const autoMove = createTimeline()
      .add(cursor, {
        x: [-viewport.w * .45, viewport.w * .45],
        modifier: (x: number) => x + Math.sin(mainLoop.currentTime * .0007) * viewport.w * .5,
        duration: 3000, ease: 'inOutExpo', alternate: true, loop: true,
        onBegin: pulse, onLoop: pulse,
      }, 0)
      .add(cursor, {
        y: [-viewport.h * .45, viewport.h * .45],
        modifier: (y: number) => y + Math.cos(mainLoop.currentTime * .00012) * viewport.h * .5,
        duration: 1000, ease: 'inOutQuad', alternate: true, loop: true,
      }, 0);

    const followPointer = (e: any) => {
      const event = e.type === 'touchmove' ? e.touches[0] : e;
      cursor.x = event.pageX - (window.innerWidth / 2);
      cursor.y = event.pageY - (window.innerHeight / 2);
    }

    window.addEventListener('mousemove', followPointer);
    return () => {
      window.removeEventListener('mousemove', followPointer);
      mainLoop.pause(); autoMove.pause();
    };
  }, []);

  return (
    <section className="relative min-h-screen w-full flex items-center overflow-hidden bg-[#050505]">
      <div className="absolute inset-0 flex justify-center items-center overflow-hidden pointer-events-none z-0 opacity-20">
        <div ref={creatureRef} className="flex flex-wrap justify-center items-center" style={{ fontSize: '.2vh' }} />
      </div>

      <DataCoreScene />

      <div className="absolute top-1/2 -translate-y-1/2 left-8 lg:left-20 z-30 flex flex-col items-start max-w-xl">
        <motion.div className="flex flex-col gap-2">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 text-cyan-500 mb-2">
            <Radio size={14} className="animate-pulse" />
            
          </motion.div>

          <h1 className="text-6xl lg:text-6xl font-black text-white tracking-tighter leading-none">
            THE <span className="text-cyan-500">TECH EXPERTS</span>
          </h1>

          <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="text-blue-400 text-sm font-light tracking-[0.2em] uppercase max-w-xs">
            Advanced Architectural Infrastructure & Software Systems
          </motion.p>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#050505] to-transparent z-40" />
    </section>
  );
}