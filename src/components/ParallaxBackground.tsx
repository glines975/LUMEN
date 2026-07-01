import React, { useEffect, useRef, useState } from 'react';
import WebGLDepthMap from './WebGLDepthMap';

interface ParallaxBackgroundProps {
  currentPage?: string;
  backgroundMode?: 'layered' | 'depthMap';
  backgroundImage?: string;
  depthMapImage?: string;
  midgroundImage?: string;
  foregroundImage?: string;
  isParchmentOpen?: boolean;
}

export default function ParallaxBackground({ 
  currentPage = 'home',
  backgroundMode = 'layered',
  backgroundImage = 'background.jpg',
  depthMapImage = 'depth.jpg',
  midgroundImage = 'midground.png',
  foregroundImage = 'foreground.png',
  isParchmentOpen = false
}: ParallaxBackgroundProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Track smoothed page scroll anchor to eliminate jumps
  const [anchorScrollY, setAnchorScrollY] = useState(0);

  // Smoothly lerp anchorScrollY to the currently active page's target offset
  useEffect(() => {
    const pageIndex = ['home', 'works', 'about', 'contact'].indexOf(currentPage);
    const targetAnchor = pageIndex * (window.innerHeight || 1000);
    
    let frameId: number;
    const animate = () => {
      setAnchorScrollY(prev => {
        const diff = targetAnchor - prev;
        if (Math.abs(diff) < 0.2) return targetAnchor;
        // Smooth lerp: 0.08 matches the deceleration curve of the main page transitions
        return prev + diff * 0.08;
      });
      frameId = requestAnimationFrame(animate);
    };
    
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [currentPage]);

  // Fallbacks for classic multi-layer mode
  const [bgFailed, setBgFailed] = useState(false);
  const [midFailed, setMidFailed] = useState(false);
  const [fgFailed, setFgFailed] = useState(false);

  // WebGL load status helper
  const [webglActive, setWebglActive] = useState(true);

  // Local state for smooth transition
  const [activeBg, setActiveBg] = useState(backgroundImage);
  const [activeDepth, setActiveDepth] = useState(depthMapImage);
  const [activeMid, setActiveMid] = useState(midgroundImage);
  const [activeFg, setActiveFg] = useState(foregroundImage);
  const [activeMode, setActiveMode] = useState(backgroundMode);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Smart checking to avoid overlapping duplicate layers
  const showMid = activeMid && activeMid.trim() !== '' && activeMid !== activeBg;
  const showFg = activeFg && activeFg.trim() !== '' && activeFg !== activeBg;

  // Listen to background asset changes and perform crossfade
  useEffect(() => {
    if (
      backgroundImage === activeBg &&
      depthMapImage === activeDepth &&
      midgroundImage === activeMid &&
      foregroundImage === activeFg &&
      backgroundMode === activeMode
    ) {
      return;
    }

    setIsTransitioning(true);

    const timeout = setTimeout(() => {
      setActiveBg(backgroundImage);
      setActiveDepth(depthMapImage);
      setActiveMid(midgroundImage);
      setActiveFg(foregroundImage);
      setActiveMode(backgroundMode);
      setBgFailed(false);
      setMidFailed(false);
      setFgFailed(false);
      setWebglActive(true); // Reset WebGL active flag for the new scene
      setIsTransitioning(false);
    }, 500); // 500ms fade-out transition

    return () => clearTimeout(timeout);
  }, [backgroundImage, depthMapImage, midgroundImage, foregroundImage, backgroundMode]);

  // Track mouse coordinates normalized from -0.5 to 0.5 relative to viewport center
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth) - 0.5;
      const y = (e.clientY / innerHeight) - 0.5;
      setMousePos({ x, y });
    };

    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setScrollY(currentScroll);
      
      const maxScroll = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1
      );
      setScrollProgress(currentScroll / maxScroll);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initial trigger
    handleScroll();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const relativeScrollY = scrollY - anchorScrollY;
  const relativeScrollProgress = relativeScrollY / Math.max(window.innerHeight || 1000, 1);

  const effectiveMouseX = isParchmentOpen ? 0 : mousePos.x;
  const effectiveMouseY = isParchmentOpen ? 0 : mousePos.y;
  const effectiveScrollY = isParchmentOpen ? 0 : relativeScrollY;
  const effectiveScrollProgress = isParchmentOpen ? 0 : relativeScrollProgress;

  // Classic mode styles - unified transition durations and optimized multipliers to keep layers perfectly cohesive
  const bgStyle: React.CSSProperties = {
    transform: `translate3d(${effectiveMouseX * -30}px, ${effectiveMouseY * -30 + effectiveScrollY * 0.02}px, 0) scale(1.08)`,
    transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
  };

  const midStyle: React.CSSProperties = {
    transform: `translate3d(${effectiveMouseX * -60}px, ${effectiveMouseY * -60 + effectiveScrollY * 0.05}px, 0) scale(1.12)`,
    transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
  };

  const fgStyle: React.CSSProperties = {
    transform: `translate3d(${effectiveMouseX * -90}px, ${effectiveMouseY * -90 + effectiveScrollY * 0.08}px, 0) scale(1.15)`,
    transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
  };

  const orb1Style: React.CSSProperties = {
    transform: `translate3d(${effectiveMouseX * 50}px, ${effectiveMouseY * 50 + effectiveScrollY * -0.08}px, 0)`,
    transition: 'transform 0.35s cubic-bezier(0.1, 0.8, 0.3, 1)',
  };

  const orb2Style: React.CSSProperties = {
    transform: `translate3d(${effectiveMouseX * -60}px, ${effectiveMouseY * -60 + effectiveScrollY * -0.15}px, 0)`,
    transition: 'transform 0.45s cubic-bezier(0.1, 0.8, 0.3, 1)',
  };

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 w-full h-full overflow-hidden bg-[#020204] select-none pointer-events-none"
      style={{ 
        zIndex: 0,
        opacity: isTransitioning ? 0 : 1,
        transition: 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      {/* ================= METHOD 1: WebGL Depth Map Displacement Shader (Pixel Level 2.5D) ================= */}
      {activeMode === 'depthMap' && webglActive && (
        <div className="absolute inset-0 w-full h-full z-10">
          <WebGLDepthMap
            image={activeBg}
            depthMap={activeDepth}
            offsetX={effectiveMouseX}
            offsetY={effectiveMouseY}
            scrollProgress={effectiveScrollProgress}
            onLoadStatusChange={(success) => {
              if (!success) {
                setWebglActive(false); // Fallback to procedural or layered on error
              }
            }}
          />
          
          {/* Minimal Film Vignette - reduced to keep bright color image on top without dark presets */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#020204]/30 via-transparent to-transparent opacity-30 z-15" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#020204]/20 via-transparent to-transparent opacity-20 z-15" />
        </div>
      )}

      {/* ================= METHOD 2: Classic Multi-Layer PNG Parallax (Fallback / Optional Mode) ================= */}
      {((activeMode === 'layered') || !webglActive) && (
        <>
          {/* Layer 1: Deep Background */}
          <div style={bgStyle} className="absolute inset-[-5%] w-[110%] h-[110%] z-10">
            {!bgFailed ? (
              <img 
                src={activeBg} 
                alt="2.5D Background" 
                onError={() => setBgFailed(true)}
                className="w-full h-full object-cover opacity-100"
              />
            ) : (
              /* Procedural fallback if image fails */
              <div className="w-full h-full bg-gradient-to-br from-[#080816] via-[#020204] to-[#120a21] opacity-70">
                <div className="absolute inset-0 opacity-20 mix-blend-screen bg-[radial-gradient(#ffffff_1.5px,transparent_1.5px)] [background-size:32px_32px]" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#020204]/20 via-transparent to-transparent opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#020204]/10 via-transparent to-transparent opacity-20" />
          </div>

          {/* Layer 2: Midground */}
          {showMid && (
            <div style={midStyle} className="absolute inset-[-7%] w-[114%] h-[114%] z-20 flex items-center justify-center">
              {!midFailed ? (
                <img 
                  src={activeMid} 
                  alt="2.5D Midground" 
                  onError={() => setMidFailed(true)}
                  className="w-full h-full object-contain opacity-95 mix-blend-screen"
                />
              ) : (
                /* High-tech procedural lattice */
                <div className="absolute w-[200%] h-[200%] opacity-[0.03]"
                  style={{
                    backgroundImage: 'linear-gradient(90deg, rgba(59,130,246,0.15) 1px, transparent 1px), linear-gradient(0deg, rgba(59,130,246,0.15) 1px, transparent 1px)',
                    backgroundSize: '60px 60px',
                    transform: 'perspective(1200px) rotateX(65deg) translateY(-150px)',
                  }}
                />
              )}
              {/* Spinning abstract vector circles */}
              <div className="absolute w-[500px] h-[500px] border border-white/[0.02] rounded-full flex items-center justify-center opacity-30">
                <div className="w-[450px] h-[450px] border border-dashed border-white/[0.01] rounded-full animate-spin [animation-duration:140s]" />
              </div>
            </div>
          )}

          {/* Layer 3: Foreground */}
          {showFg && (
            <div style={fgStyle} className="absolute inset-[-9%] w-[118%] h-[118%] z-30">
              {!fgFailed ? (
                <img 
                  src={activeFg} 
                  alt="2.5D Foreground" 
                  onError={() => setFgFailed(true)}
                  className="w-full h-full object-cover opacity-90 mix-blend-lighten"
                />
              ) : (
                <div className="absolute inset-0 opacity-[0.06] mix-blend-screen bg-[radial-gradient(#ffffff_3px,transparent_3px)] [background-size:120px_120px]" />
              )}
            </div>
          )}
        </>
      )}

      {/* ================= SHARED CINEMATIC AMBIENT ELEMENTS ================= */}
      {/* Dynamic Glow Orbs */}
      <div className="absolute inset-0 z-40 pointer-events-none overflow-hidden mix-blend-color-dodge">
        <div 
          style={orb1Style}
          className="absolute top-[10%] left-[5%] w-[500px] h-[500px] rounded-full bg-blue-900/12 blur-[100px] opacity-60 animate-pulse"
        />
        <div 
          style={orb2Style}
          className="absolute bottom-[10%] right-[5%] w-[600px] h-[600px] rounded-full bg-purple-900/12 blur-[120px] opacity-50 animate-pulse [animation-delay:2.5s]"
        />
      </div>

      {/* Movie Theater Scanline Overlay */}
      <div className="absolute inset-0 z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,_rgba(0,0,0,0.2)_50%),_linear-gradient(90deg,_rgba(255,0,0,0.01),_rgba(0,255,0,0.005),_rgba(0,0,255,0.01))] bg-[length:100%_4px,_8px_100%] opacity-15" />
    </div>
  );
}
