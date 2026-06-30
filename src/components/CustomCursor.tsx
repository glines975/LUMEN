import React, { useEffect, useState, useRef } from 'react';

export default function CustomCursor() {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const mouseRef = useRef({ x: -100, y: -100 });
  const fireflyRef = useRef({ x: -100, y: -100 });
  const innerGlowRef = useRef({ x: -100, y: -100 });
  const outerGlowRef = useRef({ x: -100, y: -100 });
  const magicRingRefCoord = useRef({ x: -100, y: -100 });
  
  const coreRef = useRef<HTMLDivElement>(null);
  const glowInnerRef = useRef<HTMLDivElement>(null);
  const glowOuterRef = useRef<HTMLDivElement>(null);
  const magicRingRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const isVisibleRef = useRef(false);
  const isHoveredRef = useRef(false);

  useEffect(() => {
    // Detect if the device has a touch screen (coarse pointer)
    const checkTouch = () => {
      const hasTouch = window.matchMedia('(pointer: coarse)').matches;
      setIsTouchDevice(hasTouch);
    };

    checkTouch();

    // Mouse movement listener
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      if (!isVisibleRef.current) {
        setIsVisible(true);
        isVisibleRef.current = true;
      }
    };

    // Track mouse entering and leaving window
    const handleMouseLeave = () => {
      setIsVisible(false);
      isVisibleRef.current = false;
    };
    
    const handleMouseEnter = () => {
      setIsVisible(true);
      isVisibleRef.current = true;
    };

    // Particle collection
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      life: number;
      maxLife: number;
      amplitude: number;
      phase: number;
      type: 'spark' | 'star' | 'ring' | 'aura';
      rotation?: number;
      rotationSpeed?: number;
    }

    let particles: Particle[] = [];

    // Sparkle splash helper function
    const spawnSplash = (cx: number, cy: number, count: number, isStrong: boolean) => {
      const colors = [
        '251, 191, 36',  // #fbbf24 (yellow-400)
        '245, 158, 11',  // #f59e0b (amber-500)
        '254, 240, 138', // #fef08a (yellow-200)
        '252, 211, 77',  // #fcd34d (amber-300)
        '253, 186, 116', // #fdbab4 (orange-300)
        '255, 255, 255'  // pure white magic sparkle
      ];

      // Add a magical expanding ripple ring
      particles.push({
        x: cx,
        y: cy,
        vx: 0,
        vy: 0,
        size: isStrong ? 4 : 2,
        color: '251, 191, 36',
        life: isStrong ? 45 : 30,
        maxLife: isStrong ? 45 : 30,
        amplitude: 0,
        phase: 0,
        type: 'ring'
      });

      if (isStrong) {
        particles.push({
          x: cx,
          y: cy,
          vx: 0,
          vy: 0,
          size: 8,
          color: '254, 240, 138',
          life: 55,
          maxLife: 55,
          amplitude: 0,
          phase: 0,
          type: 'ring'
        });
      }

      // Add stars and circle sparks
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
        const speed = (isStrong ? 2.0 : 0.8) + Math.random() * (isStrong ? 4.0 : 1.5);
        const size = (isStrong ? 1.5 : 1.0) + Math.random() * (isStrong ? 3.0 : 1.5);
        const maxLife = (isStrong ? 50 : 35) + Math.random() * (isStrong ? 45 : 25);
        const type = Math.random() > 0.45 ? 'star' : 'spark';
        const colorRGB = colors[Math.floor(Math.random() * colors.length)];

        particles.push({
          x: cx + (Math.random() - 0.5) * 6,
          y: cy + (Math.random() - 0.5) * 6,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.1, // general slight upward floating gravity
          size,
          color: colorRGB,
          life: maxLife,
          maxLife,
          amplitude: 0.1 + Math.random() * 0.3,
          phase: Math.random() * Math.PI * 2,
          type,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.12
        });
      }
    };

    // Track interactive elements to scale up and intensify on hover
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

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

      // If hovering state transitioned from false to true, trigger a mini hover-splash
      if (isInteractive && !isHoveredRef.current && isVisibleRef.current) {
        spawnSplash(fireflyRef.current.x, fireflyRef.current.y, 8, false);
      }

      isHoveredRef.current = isInteractive;
      setIsHovered(isInteractive);
    };

    // Release strong magical splash on mouse click
    const handleMouseDown = (e: MouseEvent) => {
      if (!isVisibleRef.current) return;
      spawnSplash(fireflyRef.current.x, fireflyRef.current.y, 22, true);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mouseover', handleMouseOver, { passive: true });

    // Inject global cursor styles to hide default cursor on desktop
    const styleEl = document.createElement('style');
    styleEl.innerHTML = `
      @media (pointer: fine) {
        body, a, button, input, select, textarea, [role="button"], .pointer-on, .cursor-pointer {
          cursor: none !important;
        }
      }
    `;
    document.head.appendChild(styleEl);

    // Canvas particle engine setup
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let animationFrameId: number;
    let lastTime = performance.now();

    // Helper to draw a 4-point magical star
    const drawStar = (c: CanvasRenderingContext2D, cx: number, cy: number, size: number, angle: number) => {
      c.save();
      c.translate(cx, cy);
      c.rotate(angle);
      c.beginPath();
      for (let i = 0; i < 4; i++) {
        c.lineTo(0, -size);
        c.lineTo(size * 0.22, -size * 0.22);
        c.rotate(Math.PI / 2);
      }
      c.closePath();
      c.fill();
      c.restore();
    };

    const loop = (now: number) => {
      const dt = Math.min(now - lastTime, 32); // clamp delta time to prevent giant leaps
      lastTime = now;

      // 1. Calculate firefly position with organic spring-like lag
      const dx = mouseRef.current.x - fireflyRef.current.x;
      const dy = mouseRef.current.y - fireflyRef.current.y;

      const time = now * 0.003;
      // Soft hovering organic oscillation (making it float like a real glowing firefly)
      const hoverX = Math.sin(time * 1.8) * 4;
      const hoverY = Math.cos(time * 1.2) * 4;

      // Organic lerp speed: slightly faster on hover to feel reactive
      const lerpSpeed = isHoveredRef.current ? 0.16 : 0.08;
      
      // Initialize if coordinates are not set
      if (fireflyRef.current.x === -100) {
        fireflyRef.current.x = mouseRef.current.x;
        fireflyRef.current.y = mouseRef.current.y;
        innerGlowRef.current.x = mouseRef.current.x;
        innerGlowRef.current.y = mouseRef.current.y;
        outerGlowRef.current.x = mouseRef.current.x;
        outerGlowRef.current.y = mouseRef.current.y;
        magicRingRefCoord.current.x = mouseRef.current.x;
        magicRingRefCoord.current.y = mouseRef.current.y;
      } else {
        fireflyRef.current.x += dx * lerpSpeed;
        fireflyRef.current.y += dy * lerpSpeed;
      }

      const currentX = fireflyRef.current.x + hoverX;
      const currentY = fireflyRef.current.y + hoverY;

      // Smooth lag-separated coordinate interpolation for a lush, volumetric 3D feeling
      innerGlowRef.current.x += (currentX - innerGlowRef.current.x) * 0.13;
      innerGlowRef.current.y += (currentY - innerGlowRef.current.y) * 0.13;

      outerGlowRef.current.x += (currentX - outerGlowRef.current.x) * 0.04;
      outerGlowRef.current.y += (currentY - outerGlowRef.current.y) * 0.04;

      magicRingRefCoord.current.x += (currentX - magicRingRefCoord.current.x) * 0.08;
      magicRingRefCoord.current.y += (currentY - magicRingRefCoord.current.y) * 0.08;

      // 2. Direct DOM binding for maximum smooth performance (no React render cycle lag)
      const breath = 1.0 + Math.sin(time * 2.5) * 0.12; // breathing scale
      const hoverScale = isHoveredRef.current ? 1.4 : 1.0;
      const finalScaleCore = breath * hoverScale;
      const finalScaleInner = (1.0 + Math.sin(time * 2.0) * 0.15) * (isHoveredRef.current ? 1.8 : 1.0);
      const finalScaleOuter = (1.0 + Math.sin(time * 1.5) * 0.08) * (isHoveredRef.current ? 2.2 : 1.0);
      const finalScaleRing = (1.0 + Math.sin(time * 0.8) * 0.05) * (isHoveredRef.current ? 1.6 : 1.0);

      if (coreRef.current) {
        coreRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%) scale(${finalScaleCore})`;
      }
      if (glowInnerRef.current) {
        glowInnerRef.current.style.transform = `translate3d(${innerGlowRef.current.x}px, ${innerGlowRef.current.y}px, 0) translate(-50%, -50%) scale(${finalScaleInner})`;
      }
      if (glowOuterRef.current) {
        glowOuterRef.current.style.transform = `translate3d(${outerGlowRef.current.x}px, ${outerGlowRef.current.y}px, 0) translate(-50%, -50%) scale(${finalScaleOuter})`;
      }
      if (magicRingRef.current) {
        magicRingRef.current.style.transform = `translate3d(${magicRingRefCoord.current.x}px, ${magicRingRefCoord.current.y}px, 0) translate(-50%, -50%) scale(${finalScaleRing})`;
      }

      // 3. Clear particle canvas
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // 4. Particle Spawning Logic (ambient passive sparkles & dissolving auras)
      // Only spawn if mouse is inside the screen bounds and cursor is visible
      if (isVisibleRef.current && mouseRef.current.x >= 0 && mouseRef.current.y >= 0) {
        const speed = Math.sqrt(dx * dx + dy * dy);
        
        // Base spawn probability + speed-based count
        const spawnProbability = isHoveredRef.current ? 0.75 : 0.4;
        const speedFactor = Math.min(speed / 4.5, 4);
        const spawnCount = Math.floor(spawnProbability + speedFactor);

        // Periodically spawn ambient volumetric aura/fog clouds that slowly fade out (dissipate)
        // Leaving a gorgeous lingering trail that fades out slowly
        const auraSpawnChance = isHoveredRef.current ? 0.35 : 0.18;
        const speedAuraBonus = Math.min(speed / 10, 0.45);
        if (Math.random() < (auraSpawnChance + speedAuraBonus)) {
          particles.push({
            x: currentX + (Math.random() - 0.5) * 8,
            y: currentY + (Math.random() - 0.5) * 8,
            // Drifts slightly opposite to motion
            vx: (Math.random() - 0.5) * 0.1 - dx * 0.02,
            vy: (Math.random() - 0.5) * 0.1 - dy * 0.02 - 0.08, // float up slightly
            size: 14 + Math.random() * 18, // large volumetric gas cloud
            color: '245, 158, 11', // amber gold
            life: 70 + Math.random() * 40, // lingering life
            maxLife: 110,
            amplitude: 0.15,
            phase: Math.random() * Math.PI * 2,
            type: 'aura'
          });
        }

        for (let i = 0; i < spawnCount; i++) {
          const angle = Math.random() * Math.PI * 2;
          const startSpeed = 0.2 + Math.random() * 0.8;
          const size = 1.0 + Math.random() * (isHoveredRef.current ? 3.0 : 1.8);
          const maxLife = 45 + Math.random() * 45; // frames of lifetime
          
          // Decide particle type: stars (magic twinkle), sparks (light circles)
          const type = Math.random() > 0.55 ? 'star' : 'spark';

          // Golden, amber, and light yellow glowing sparks
          const colors = [
            '251, 191, 36',  // #fbbf24 (yellow-400)
            '245, 158, 11',  // #f59e0b (amber-500)
            '254, 240, 138', // #fef08a (yellow-200)
            '252, 211, 77',  // #fcd34d (amber-300)
            '253, 186, 116'  // #fdbab4 (orange-300)
          ];
          const colorRGB = colors[Math.floor(Math.random() * colors.length)];

          particles.push({
            x: currentX + (Math.random() - 0.5) * 5,
            y: currentY + (Math.random() - 0.5) * 5,
            // Carry minor negative drag velocity from mouse direction for realistic flight inertia
            vx: Math.cos(angle) * startSpeed + (dx * -0.05),
            vy: Math.sin(angle) * startSpeed + (dy * -0.05) - 0.18, // float upwards slightly
            size,
            color: colorRGB,
            life: maxLife,
            maxLife,
            amplitude: 0.12 + Math.random() * 0.35,
            phase: Math.random() * Math.PI * 2,
            type,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.1
          });
        }
      }

      // 5. Update & Draw Particles on Canvas
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life -= 1;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        // Handle physical movement based on particle type
        if (p.type === 'ring') {
          // Ring expands rapidly and fades out
          p.size += isHoveredRef.current ? 1.6 : 1.2;
        } else if (p.type === 'aura') {
          // Aura dissipates: expands softly and drifts upwards
          p.size += isHoveredRef.current ? 0.32 : 0.22;
          p.vy -= 0.005; // slowly float up like heat haze
          p.vx += Math.sin(time * 2 + p.phase) * 0.05; // gentle wavering drift
          p.x += p.vx;
          p.y += p.vy;
        } else {
          // Standard sparks/stars: Apply physics forces: gravity drift, damping drag, and side breeze sway
          p.vy -= 0.015; // slow rising effect like smoke/hot dust
          p.vx += Math.sin(time * 3.5 + p.phase) * p.amplitude * 0.1; // wavy drift sway
          
          p.vx *= 0.982;
          p.vy *= 0.982;

          p.x += p.vx;
          p.y += p.vy;

          if (p.rotation !== undefined && p.rotationSpeed !== undefined) {
            p.rotation += p.rotationSpeed;
          }
        }

        // Dynamic opacity with a smooth fade-out near death
        const lifeRatio = p.life / p.maxLife;
        const alpha = Math.min(1.0, lifeRatio * (isHoveredRef.current ? 1.0 : 0.85));

        ctx.save();

        if (p.type === 'ring') {
          // Draw magic ripples
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${p.color}, ${alpha * 0.4})`;
          ctx.lineWidth = 1.5;
          ctx.shadowBlur = 8;
          ctx.shadowColor = `rgba(${p.color}, ${alpha * 0.5})`;
          ctx.stroke();
        } else if (p.type === 'aura') {
          // Volumetric glowing aura: soft, deeply-blurred radial dissipation (慢慢消散的余晖)
          const radGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
          radGrad.addColorStop(0, `rgba(${p.color}, ${alpha * 0.12})`);
          radGrad.addColorStop(0.35, `rgba(${p.color}, ${alpha * 0.04})`);
          radGrad.addColorStop(1, `rgba(${p.color}, 0)`);
          
          ctx.fillStyle = radGrad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'star') {
          // Draw four-pointed stars
          ctx.shadowBlur = p.size * 3.5;
          ctx.shadowColor = `rgba(${p.color}, ${alpha})`;
          ctx.fillStyle = `rgba(${p.color}, ${alpha})`;
          drawStar(ctx, p.x, p.y, p.size, p.rotation || 0);
        } else {
          // Draw classic glowing circles
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.shadowBlur = p.size * 2.8;
          ctx.shadowColor = `rgba(${p.color}, ${alpha})`;
          ctx.fillStyle = `rgba(${p.color}, ${alpha})`;
          ctx.fill();
        }

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
      styleEl.remove();
    };
  }, [isVisible]);

  if (isTouchDevice) return null;

  return (
    <div 
      className={`fixed inset-0 pointer-events-none z-[9999] overflow-hidden transition-opacity duration-500 ease-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* High-performance particles canvas for magical trails, stars, and rings */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none mix-blend-screen"
      />

      {/* 1. Golden Outer Halo (余晖外圈) */}
      <div
        ref={glowOuterRef}
        className="absolute w-28 h-28 rounded-full bg-amber-500/[0.04] blur-xl pointer-events-none"
        style={{ left: 0, top: 0, willChange: 'transform' }}
      />

      {/* 2. Golden Inner Halo (余晖内圈) */}
      <div
        ref={glowInnerRef}
        className="absolute w-14 h-14 rounded-full bg-yellow-500/[0.11] blur-md pointer-events-none flex items-center justify-center"
        style={{ left: 0, top: 0, willChange: 'transform' }}
      />

      {/* 3. Magical Rune Constellation Rings (魔法星轨环) */}
      <div
        ref={magicRingRef}
        className="absolute w-10 h-10 rounded-full flex items-center justify-center pointer-events-none"
        style={{ left: 0, top: 0, willChange: 'transform' }}
      >
        {/* Outer rotating thin diamond outline */}
        <div className="absolute w-7 h-7 border border-amber-400/25 rotate-45 transform-gpu animate-[spin_12s_linear_infinite]" />
        
        {/* Inner reverse-rotating thin star ring */}
        <div className="absolute w-5 h-5 border border-yellow-300/35 -rotate-45 transform-gpu animate-[spin_7s_linear_infinite_reverse]" />
        
        {/* Dotted magic ring */}
        <div className="absolute w-8 h-8 rounded-full border border-dashed border-amber-500/15 animate-[spin_20s_linear_infinite]" />
      </div>

      {/* 4. Golden Core / Heart of the Firefly (荧惑心) */}
      <div
        ref={coreRef}
        className="absolute w-3.5 h-3.5 rounded-full bg-yellow-300 shadow-[0_0_12px_#f59e0b,0_0_24px_#fbbf24] border border-white/70 pointer-events-none flex items-center justify-center"
        style={{ left: 0, top: 0, willChange: 'transform' }}
      >
        {/* Tiny white inner core for intense bright emission point */}
        <div className="w-[3.5px] h-[3.5px] bg-white rounded-full opacity-90 shadow-[0_0_4px_#ffffff]" />
      </div>
    </div>
  );
}

