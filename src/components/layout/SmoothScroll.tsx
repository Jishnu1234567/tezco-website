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
    // --- MODERN LENIS TOUCH FIX ---
    syncTouch: false,    // Let the browser handle touch naturally
    touchMultiplier: 1.5, // Standard touch speed
    wheelMultiplier: 1,
    autoRaf: true,       
  }}
>
  {children}
</ReactLenis>
  );
}