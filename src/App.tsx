import React, { useState, useEffect, useRef } from 'react';
import { PageType } from './types';
import ParallaxBackground from './components/ParallaxBackground';
import Navbar from './components/Navbar';
import HomeSection from './components/HomeSection';
import AboutSection from './components/AboutSection';
import WorksSection from './components/WorksSection';
import ContactSection from './components/ContactSection';
import VideoUploaderModal from './components/VideoUploaderModal';
import { dbStore } from './lib/storage';
import CustomCursor from './components/CustomCursor';
import LumenIntro from './components/LumenIntro';

export interface PageScene {
  backgroundImage: string;
  depthMapImage: string;
  midgroundImage: string;
  foregroundImage: string;
  backgroundMode: 'layered' | 'depthMap';
}

const DEFAULT_SCENES: Record<'home' | 'about' | 'works' | 'contact', PageScene> = {
  home: {
    backgroundMode: 'layered',
    // Majestic pristine white city with canals, bridges, and a giant robed statue under blue sky
    backgroundImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1920&auto=format&fit=crop',
    depthMapImage: '', // auto-generates beautiful depth map Fallback
    midgroundImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1920&auto=format&fit=crop',
    foregroundImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1920&auto=format&fit=crop'
  },
  about: {
    backgroundMode: 'layered',
    backgroundImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1920&auto=format&fit=crop',
    depthMapImage: '',
    midgroundImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1920&auto=format&fit=crop',
    foregroundImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1920&auto=format&fit=crop'
  },
  works: {
    backgroundMode: 'layered',
    // Futuristic glowing space tech digital network
    backgroundImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1920&auto=format&fit=crop',
    depthMapImage: '',
    midgroundImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1920&auto=format&fit=crop',
    foregroundImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1920&auto=format&fit=crop'
  },
  contact: {
    backgroundMode: 'layered',
    // Cosmic starry nebula night sky
    backgroundImage: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=1920&auto=format&fit=crop',
    depthMapImage: '',
    midgroundImage: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=1920&auto=format&fit=crop',
    foregroundImage: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=1920&auto=format&fit=crop'
  }
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [scenes, setScenes] = useState<Record<'home' | 'about' | 'works' | 'contact', PageScene>>(DEFAULT_SCENES);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Track ongoing scroll transitions to prevent user scroll interruptions or duplicate triggers
  const isTransitioningRef = useRef(false);

  // Load custom saved background settings for each page from persistent IndexedDB
  useEffect(() => {
    const loadSavedSettings = async () => {
      const updatedScenes = { ...DEFAULT_SCENES };
      const pages: Array<'home' | 'about' | 'works' | 'contact'> = ['home', 'about', 'works', 'contact'];

      for (const page of pages) {
        const mode = await dbStore.get(`${page}_backgroundMode`);
        const bg = await dbStore.get(`${page}_backgroundImage`);
        const depth = await dbStore.get(`${page}_depthMapImage`);
        const mid = await dbStore.get(`${page}_midgroundImage`);
        const fg = await dbStore.get(`${page}_foregroundImage`);

        if (mode === 'layered' || mode === 'depthMap') {
          updatedScenes[page].backgroundMode = mode;
        }
        if (bg) updatedScenes[page].backgroundImage = bg;
        if (depth) updatedScenes[page].depthMapImage = depth;
        if (mid) updatedScenes[page].midgroundImage = mid;
        if (fg) updatedScenes[page].foregroundImage = fg;
      }
      
      setScenes(updatedScenes);
    };
    loadSavedSettings();
  }, []);

  const handleUpdateScene = async (pageId: 'home' | 'about' | 'works' | 'contact', newScene: PageScene) => {
    setScenes(prev => ({
      ...prev,
      [pageId]: newScene
    }));

    await dbStore.set(`${pageId}_backgroundMode`, newScene.backgroundMode);
    await dbStore.set(`${pageId}_backgroundImage`, newScene.backgroundImage);
    await dbStore.set(`${pageId}_depthMapImage`, newScene.depthMapImage);
    await dbStore.set(`${pageId}_midgroundImage`, newScene.midgroundImage);
    await dbStore.set(`${pageId}_foregroundImage`, newScene.foregroundImage);
  };

  // Smooth scroll handler for Navbar navigation clicks
  const handlePageChange = (pageId: PageType) => {
    if (isTransitioningRef.current) return;
    
    isTransitioningRef.current = true;
    setCurrentPage(pageId);
    
    const element = document.getElementById(`section-${pageId}`);
    if (element) {
      const targetPosition = element.offsetTop;
      const startPosition = window.scrollY;
      const distance = targetPosition - startPosition;
      
      // Let's use a 1.6-second duration (1600ms) for a slow, premium, and buttery smooth transition
      const duration = 1600; 
      let startTime: number | null = null;

      // Cubic easing in-out for ultra smooth deceleration
      const easeInOutCubic = (t: number): number => {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      };

      const animation = (currentTime: number) => {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        const ease = easeInOutCubic(progress);
        
        window.scrollTo(0, startPosition + distance * ease);
        
        if (timeElapsed < duration) {
          requestAnimationFrame(animation);
        } else {
          // Ensure precise alignment and unlock the transition state
          window.scrollTo(0, targetPosition);
          isTransitioningRef.current = false;
        }
      };

      requestAnimationFrame(animation);
    } else {
      isTransitioningRef.current = false;
    }
  };

  // Implement debounced full-page slide on wheel or touch swiping
  useEffect(() => {
    const sections: PageType[] = ['home', 'about', 'works', 'contact'];
    let touchStartY = 0;

    const handleWheel = (e: WheelEvent) => {
      // If settings open or intro is playing (body overflow hidden), do not switch page
      if (isSettingsOpen || document.body.style.overflow === 'hidden') return;

      // Prevent native browser scrolling to ensure strict full-page control
      e.preventDefault();

      if (isTransitioningRef.current) return;

      const currentIndex = sections.indexOf(currentPage);
      // We detect deltaY: positive means scrolling down, negative means scrolling up
      if (Math.abs(e.deltaY) > 10) {
        if (e.deltaY > 10) {
          // Scroll Down -> Go to next section
          if (currentIndex < sections.length - 1) {
            const nextPage = sections[currentIndex + 1];
            handlePageChange(nextPage);
          }
        } else {
          // Scroll Up -> Go to previous section
          if (currentIndex > 0) {
            const prevPage = sections[currentIndex - 1];
            handlePageChange(prevPage);
          }
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (isSettingsOpen || document.body.style.overflow === 'hidden') return;
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isSettingsOpen || document.body.style.overflow === 'hidden') return;
      if (e.cancelable) e.preventDefault();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isSettingsOpen || document.body.style.overflow === 'hidden') return;
      if (isTransitioningRef.current) return;

      const touchEndY = e.changedTouches[0].clientY;
      const diffY = touchStartY - touchEndY; // Positive is swipe up (scroll down)

      if (Math.abs(diffY) > 40) {
        const currentIndex = sections.indexOf(currentPage);
        if (diffY > 0) {
          // Swipe up -> scroll down to next
          if (currentIndex < sections.length - 1) {
            const nextPage = sections[currentIndex + 1];
            handlePageChange(nextPage);
          }
        } else {
          // Swipe down -> scroll up to prev
          if (currentIndex > 0) {
            const prevPage = sections[currentIndex - 1];
            handlePageChange(prevPage);
          }
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [currentPage, isSettingsOpen]);

  // IntersectionObserver to sync the current scroll position with active state in Navbar
  useEffect(() => {
    const sections = ['home', 'about', 'works', 'contact'];
    const observers = sections.map((id) => {
      const element = document.getElementById(`section-${id}`);
      if (!element) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !isTransitioningRef.current) {
            setCurrentPage(id as PageType);
          }
        },
        {
          root: null, // Viewport
          rootMargin: '-30% 0px -40% 0px', // Matches center of screen
          threshold: 0.1,
        }
      );

      observer.observe(element);
      return { observer, element };
    });

    return () => {
      observers.forEach((item) => {
        if (item) {
          item.observer.unobserve(item.element);
        }
      });
    };
  }, []);

  // Find which scene is active based on page state. 'services' maps to 'works'.
  const activePageKey = (currentPage === 'services' ? 'works' : currentPage) as 'home' | 'about' | 'works' | 'contact';
  const activeScene = scenes[activePageKey] || scenes.home;

  return (
    <div className="relative min-h-screen text-white bg-[#020204] font-sans selection:bg-blue-500/30 selection:text-white overflow-x-hidden">
      
      {/* 2.5D Cinematic Parallax Image Layered Background (Supports WebGL Depth-Displacement & Classic Layers) */}
      <ParallaxBackground 
        currentPage={currentPage}
        backgroundMode={activeScene.backgroundMode}
        backgroundImage={activeScene.backgroundImage} 
        depthMapImage={activeScene.depthMapImage}
        midgroundImage={activeScene.midgroundImage} 
        foregroundImage={activeScene.foregroundImage} 
      />

      {/* Floating Cinematic Navigation Bar */}
      <Navbar 
        currentPage={currentPage} 
        onPageChange={handlePageChange} 
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Responsive Viewport with Stacked Sections (Scroll Trend Layout) */}
      <main className="relative z-10 w-full flex flex-col">
        {/* Section 01: Home */}
        <section id="section-home" className="h-screen w-full">
          <HomeSection onPageChange={handlePageChange} />
        </section>

        {/* Section 02: About */}
        <section id="section-about" className="h-screen w-full">
          <AboutSection />
        </section>

        {/* Section 03: Works */}
        <section id="section-works" className="h-screen w-full">
          <WorksSection />
        </section>

        {/* Section 04: Contact */}
        <section id="section-contact" className="h-screen w-full">
          <ContactSection />
        </section>
      </main>

      {/* Configuration modal for 2.5D Background Image Layers */}
      <VideoUploaderModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        scenes={scenes}
        onUpdateScene={handleUpdateScene}
        defaultPage={activePageKey}
      />

      {/* Universal Floating Aesthetic Ambient Footer */}
      <footer className="fixed bottom-4 left-6 md:left-12 z-30 pointer-events-none hidden sm:block">
        <p className="font-mono text-[9px] tracking-widest text-white/20 uppercase">
          © {new Date().getFullYear()} Cinematic Parallax Studio. // Scroll Driven Canvas.
        </p>
      </footer>

      {/* Custom Crosshair Cursor */}
      <CustomCursor />

      {/* Elegant Classical Opening Intro Animation */}
      <LumenIntro />
    </div>
  );
}
