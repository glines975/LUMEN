import React, { useEffect, useRef, useState } from 'react';
import WebGLDepthMap from './WebGLDepthMap';

interface ParallaxBackgroundProps {
  currentPage?: string;
  backgroundMode?: 'layered' | 'depthMap';
  backgroundImage?: string;
  depthMapImage?: string;
  midgroundImage?: string;
  foregroundImage?: string;
  fallbackBackground?: string;
  fallbackMidground?: string;
  fallbackForeground?: string;
  isParchmentOpen?: boolean;
}

export default function ParallaxBackground({ 
  currentPage = 'home',
  backgroundMode = 'layered',
  backgroundImage = '',
  depthMapImage = '',
  midgroundImage = '',
  foregroundImage = '',
  fallbackBackground = '',
  fallbackMidground = '',
  fallbackForeground = '',
  isParchmentOpen = false
}: ParallaxBackgroundProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [anchorScrollY, setAnchorScrollY] = useState(0);
  const [webglActive, setWebglActive] = useState(true);

  useEffect(() => {
    const pageIndex = ['home', 'works', 'about', 'contact'].indexOf(currentPage);
    const targetAnchor = pageIndex * (window.innerHeight || 1000);
    
    let frameId: number;
    const animate = () => {
      setAnchorScrollY(prev => {
        const diff = targetAnchor - prev;
        if (Math.abs(diff) < 0.2) return targetAnchor;
        return prev + diff * 0.08;
      });
      frameId = requestAnimationFrame(animate);
    };
    
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [currentPage]);

  useEffect(() => {
    setWebglActive(true);
  }, [backgroundImage, depthMapImage, midgroundImage, foregroundImage, backgroundMode]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      setMousePos({
        x: (e.clientX / innerWidth) - 0.5,
        y: (e.clientY / innerHeight) - 0.5,
      });
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

  const sharedLayerStyle: React.CSSProperties = {
    inset: 0,
    transformOrigin: 'center center',
    willChange: 'transform',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  const bgStyle: React.CSSProperties = {
    ...sharedLayerStyle,
    transform: `translate3d(${effectiveMouseX * -30}px, ${effectiveMouseY * -30 + effectiveScrollY * 0.02}px, 0) scale(1.08)`,
    transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
  };

  const midStyle: React.CSSProperties = {
    ...sharedLayerStyle,
    transform: `translate3d(${effectiveMouseX * -60}px, ${effectiveMouseY * -60 + effectiveScrollY * 0.05}px, 0) scale(1.12)`,
    transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
  };

  const fgStyle: React.CSSProperties = {
    ...sharedLayerStyle,
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

  const useLayered = backgroundMode === 'layered' || !webglActive;
  const resolvedBackground = backgroundImage?.trim() || fallbackBackground;
  const resolvedMidground = midgroundImage?.trim() || fallbackMidground;
  const resolvedForeground = foregroundImage?.trim() || fallbackForeground;
  const showMid = Boolean(resolvedMidground);
  const showFg = Boolean(resolvedForeground);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 w-full h-full overflow-hidden bg-[#020204] select-none pointer-events-none"
      style={{ zIndex: 0 }}
    >
      {backgroundMode === 'depthMap' && webglActive && (
        <div className="absolute inset-0 w-full h-full z-10">
          <WebGLDepthMap
            image={backgroundImage}
            depthMap={depthMapImage}
            offsetX={effectiveMouseX}
            offsetY={effectiveMouseY}
            scrollProgress={effectiveScrollProgress}
            onLoadStatusChange={(success) => {
              if (!success) setWebglActive(false);
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020204]/30 via-transparent to-transparent opacity-30 z-15" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#020204]/20 via-transparent to-transparent opacity-20 z-15" />
          <div className="absolute inset-0 bg-[#020204]/10 z-25 pointer-events-none" />
        </div>
      )}

      {useLayered && (
        <>
          {resolvedBackground && (
            <div
              style={{
                ...bgStyle,
                backgroundImage: resolvedBackground.startsWith('url(') ? resolvedBackground : `url("${resolvedBackground}")`,
                backgroundSize: resolvedBackground.startsWith('url(') ? 'cover' : 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
              className="absolute inset-0 z-10"
              role="img"
              aria-label="Parallax background"
            />
          )}

          {showMid && (
            <div
              style={{
                ...midStyle,
                backgroundImage: resolvedMidground.startsWith('url(') ? resolvedMidground : `url("${resolvedMidground}")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
              className="absolute inset-0 z-20"
              role="img"
              aria-label="Parallax midground"
            />
          )}

          {showFg && (
            <div
              style={{
                ...fgStyle,
                backgroundImage: resolvedForeground.startsWith('url(') ? resolvedForeground : `url("${resolvedForeground}")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
              className="absolute inset-0 z-30"
              role="img"
              aria-label="Parallax foreground"
            />
          )}
        </>
      )}

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

      <div className="absolute inset-0 z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,_rgba(0,0,0,0.2)_50%),_linear-gradient(90deg,_rgba(255,0,0,0.01),_rgba(0,255,0,0.005),_rgba(0,0,255,0.01))] bg-[length:100%_4px,_8px_100%] opacity-15" />
    </div>
  );
}
