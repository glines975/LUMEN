import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export default function CustomCursor() {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Motion values for the absolute mouse position
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Springs for the outer reticle to give a smooth mechanical delay
  const springConfig = { damping: 30, stiffness: 250, mass: 0.5 };
  const reticleX = useSpring(mouseX, springConfig);
  const reticleY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Detect if the device has a touch screen and no accurate pointer (mobile/tablet)
    const checkTouch = () => {
      const hasTouch = window.matchMedia('(pointer: coarse)').matches;
      setIsTouchDevice(hasTouch);
    };

    checkTouch();

    // Mouse movement listener
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    // Track mouse entering and leaving window
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    // Track interactive elements to scale up the crosshair on hover
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Check if target or parent is clickable/interactive
      const isInteractive = 
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.closest('button') !== null ||
        target.closest('a') !== null ||
        target.closest('.pointer-on') !== null ||
        target.closest('.cursor-pointer') !== null ||
        window.getComputedStyle(target).cursor === 'pointer';

      setIsHovered(isInteractive);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mouseover', handleMouseOver, { passive: true });

    // Inject global cursor styles to hide default cursor, but only when cursor is active and on desktop
    const styleEl = document.createElement('style');
    styleEl.innerHTML = `
      @media (pointer: fine) {
        body, a, button, input, select, textarea, [role="button"], .pointer-on, .cursor-pointer {
          cursor: none !important;
        }
      }
    `;
    document.head.appendChild(styleEl);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseover', handleMouseOver);
      styleEl.remove();
    };
  }, [mouseX, mouseY, isVisible]);

  // Render nothing on touch screens where standard touch navigation is expected
  if (isTouchDevice || !isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {/* 1. Outer Reticle Ring (瞄准镜外圈) with ticks - Spring-delayed */}
      <motion.div
        style={{
          x: reticleX,
          y: reticleY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isHovered ? 1.3 : 1.0,
          rotate: isHovered ? 45 : 0,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="absolute w-8 h-8 rounded-full border-2 border-white/75 flex items-center justify-center mix-blend-difference"
      >
        {/* Bold Horizontal crosshair ticks */}
        <div className="absolute left-[-6px] w-[6px] h-[2px] bg-white/80" />
        <div className="absolute right-[-6px] w-[6px] h-[2px] bg-white/80" />
        {/* Bold Vertical crosshair ticks */}
        <div className="absolute top-[-6px] w-[2px] h-[6px] bg-white/80" />
        <div className="absolute bottom-[-6px] w-[2px] h-[6px] bg-white/80" />

        {/* Hover expanding circle accent */}
        {isHovered && (
          <motion.div 
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1.1, opacity: 0.2 }}
            className="absolute inset-0 rounded-full bg-blue-400"
          />
        )}
      </motion.div>
    </div>
  );
}
