"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "lenis/react";

export default function ScrollAnimations() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    gsap.registerPlugin(ScrollTrigger);

    // Sync ScrollTrigger with Lenis
    lenis.on("scroll", ScrollTrigger.update);

    // Add Lenis to the GSAP ticker
    const update = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [lenis]);

  return null; // This component just handles logic, it doesn't render anything
}