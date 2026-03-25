"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

const TECHNOLOGIES = [
  "Next.js", "React", "Three.js", "Tailwind", 
  "Supabase", "Django", "Framer", "TypeScript", "AnimeJS"
];

export default function TechStack() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLUListElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // 1. Rotate the entire circle based on scroll
    gsap.to(circleRef.current, {
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1, // Smoothly ties the rotation to the scrollbar
      },
      rotate: 360,
      ease: "none",
    });

    // 2. Animate the individual characters (The "Scramble" effect)
    const chars = gsap.utils.toArray<HTMLElement>(".tech-char");
    chars.forEach((char) => {
      const charIndex = parseInt(char.style.getPropertyValue("--char-index"));
      const angleDelta = 35; // Matches your original CSS variable
      
      gsap.fromTo(char, 
        { rotate: charIndex * angleDelta }, // Start scrambled
        {
          rotate: 0, // End aligned
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
          },
          ease: "none",
        }
      );
    });

    // 3. Reveal Logo at the end of the scroll
    gsap.fromTo(logoRef.current, 
      { opacity: 0, scale: 0.8, filter: "blur(10px)" },
      {
        opacity: 1, scale: 1, filter: "blur(0px)",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "80% center", // Starts revealing near the end
          end: "95% center",
          scrub: true,
        }
      }
    );

    // 4. Fade out mouse icon
    gsap.to(mouseRef.current, {
      opacity: 0,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "20% top",
        scrub: true,
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[400vh] bg-[#010103] w-full overflow-visible">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        
        {/* Central Branding */}
        <div ref={logoRef} className="absolute z-30 pointer-events-none flex flex-col items-center justify-center">
          <div className="flex flex-col items-center">
             <span className="text-4xl md:text-6xl font-black tracking-tighter text-white">
                TEZ<span className="text-cyan-500">CO</span>
             </span>
             <div className="w-12 h-[2px] bg-cyan-500 mt-1 shadow-[0_0_20px_#00f2ff]"></div>
          </div>
        </div>

        {/* Mouse Indicator */}
        <div className="absolute z-20 pointer-events-none">
          <svg 
            ref={mouseRef}
            xmlns="http://www.w3.org/2000/svg" 
            width="50" height="50" 
            viewBox="0 0 24 40" 
            fill="none" 
            stroke="#00f2ff" 
            strokeWidth="1.5" 
            className="animate-bounce"
          >
            <path d="M6 3m0 4a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v10a4 4 0 0 1 -4 4h-4a4 4 0 0 1 -4 -4z" />
            <path d="M12 7l0 4" />
          </svg>
        </div>

        {/* Circular Technologies */}
        <ul ref={circleRef} className="relative w-[80vw] h-[80vw] md:w-[30vw] md:h-[30vw] list-none p-0 m-0">
          {TECHNOLOGIES.map((tech, techIndex) => (
            <li 
              key={techIndex} 
              className="absolute inset-1/2"
              style={{ 
                transform: `rotate(${(360 / TECHNOLOGIES.length) * techIndex}deg)` 
              } as any}
            >
              {tech.split("").map((char, charIndex) => (
                <span 
                  key={charIndex} 
                  className="tech-char absolute top-1/2 left-1/2 origin-[0_0] text-cyan-500/80 font-mono font-bold uppercase whitespace-nowrap"
                  style={{ 
                    '--char-index': charIndex + 1,
                    fontSize: 'clamp(0.8rem, 2vw, 2rem)',
                    // Positioning logic moved from CSS to inline for reliability
                    marginLeft: `calc(15vw + ${charIndex * 1.2}ch)` 
                  } as any}
                >
                  {char}
                </span>
              ))}
            </li>
          ))}
        </ul>

        {/* Background Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,242,255,0.05)_0%,transparent_70%)] pointer-events-none" />
      </div>

      <style jsx>{`
        .tech-char {
          transition: color 0.3s ease, text-shadow 0.3s ease;
        }
        .tech-char:hover {
          color: #fff;
          text-shadow: 0 0 15px #00f2ff;
          z-index: 50;
        }
      `}</style>
    </section>
  );
}