"use client";

import { ReactLenis } from 'lenis/react';
import React, { ReactNode } from "react";

interface SmoothScrollProps {
  children: ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  return (
    <ReactLenis 
      root 
      options={{ 
        lerp: 0.1,      
        duration: 1.2,
        smoothWheel: true,
        // --- UPDATED FOR MODERN LENIS ---
        syncTouch: false,   // Crucial: Let the mobile browser handle touch naturally
        touchMultiplier: 2, // This replaces the old inertia multiplier
        wheelMultiplier: 1,
        infinite: false,
      }}
    >
      {children}
    </ReactLenis>
  );
}