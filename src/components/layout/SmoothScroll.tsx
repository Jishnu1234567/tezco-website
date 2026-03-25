"use client";

import { ReactLenis } from 'lenis/react';
import { ReactNode } from "react";

export default function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis 
      root 
      options={{ 
        lerp: 0.1,      
        duration: 1.2, // Slightly faster duration feels better on modern webs
        smoothWheel: true,
        // --- MOBILE & TOUCH FIXES ---
        syncTouch: false,   // Crucial: Let the browser handle touch natively
        touchMultiplier: 2, // Use this instead of touchInertiaMultiplier
        wheelMultiplier: 1,
        infinite: false,
      }}
    >
      {children}
    </ReactLenis>
  );
}