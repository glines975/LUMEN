import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealTextProps {
  text: string;
  className?: string;
  textClass?: string;
}

export default function ScrollRevealText({ text, className = '', textClass = '' }: ScrollRevealTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Clear previous elements to avoid duplicates on re-render
    el.innerHTML = '';

    const p = document.createElement('p');
    p.className = `flex flex-wrap gap-x-2 gap-y-1 ${textClass}`;

    // Split text into words, preserving spaces
    const words = text.split(/(\s+)/);

    words.forEach((word) => {
      if (!word.trim()) return;
      const span = document.createElement('span');
      span.className = 'scroll-word inline-block';
      span.textContent = word;
      span.style.opacity = '0.1';
      span.style.filter = 'blur(4px)';
      span.style.transform = 'translateY(10px)';
      p.appendChild(span);
    });

    el.appendChild(p);

    const spans = p.querySelectorAll('.scroll-word');

    // Simple GSAP animation matching the PDF's style
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top bottom-=10%',
        end: 'bottom center+=10%',
        scrub: true,
      }
    });

    tl.to(spans, {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      stagger: 0.1,
      ease: 'none',
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [text, textClass]);

  return (
    <div 
      ref={containerRef} 
      className={`scroll-reveal ${className}`}
    />
  );
}
