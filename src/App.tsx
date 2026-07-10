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
import LumenIntro from './components/LumenIntro';
import { HOME_PARALLAX } from './constants/homeParallax';

const PROJECT_ASSET = (file: string) => `${import.meta.env.BASE_URL}images/project/${file}`;
const PROJECT_PARALLAX = {
  backgroundMode: 'layered' as const,
  backgroundImage: PROJECT_ASSET('background.jpeg'),
  depthMapImage: '',
  midgroundImage: PROJECT_ASSET('midground.png'),
  foregroundImage: PROJECT_ASSET('foreground.png'),
  fallbackBackground: '',
  fallbackMidground: '',
  fallbackForeground: '',
};

export interface PageScene {
  backgroundImage: string;
  depthMapImage: string;
  midgroundImage: string;
  foregroundImage: string;
  backgroundMode: 'layered' | 'depthMap';
}

const DEFAULT_SCENES: Record<'home' | 'about' | 'works' | 'contact', PageScene> = {
  home: {
    ...HOME_PARALLAX,
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

// Bump when default home parallax assets change — forces IndexedDB to refresh stale cached URLs.
const HOME_SCENE_VERSION = 'local-parallax-v4';

const persistScene = async (pageId: 'home' | 'about' | 'works' | 'contact', scene: PageScene) => {
  await dbStore.set(`${pageId}_backgroundMode`, scene.backgroundMode);
  await dbStore.set(`${pageId}_backgroundImage`, scene.backgroundImage);
  await dbStore.set(`${pageId}_depthMapImage`, scene.depthMapImage);
  await dbStore.set(`${pageId}_midgroundImage`, scene.midgroundImage);
  await dbStore.set(`${pageId}_foregroundImage`, scene.foregroundImage);
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [scenes, setScenes] = useState<Record<'home' | 'about' | 'works' | 'contact', PageScene>>(DEFAULT_SCENES);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [introCompleted, setIntroCompleted] = useState(false);
  const [isParchmentOpen, setIsParchmentOpen] = useState(false);
  
  // Keep the Project page locked vertically; only allow scrolling inside Works detail views.
  useEffect(() => {
    if (currentPage === 'works' || isParchmentOpen) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    }
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, [currentPage, isParchmentOpen]);
  
  // Track ongoing scroll transitions to prevent user scroll interruptions or duplicate triggers
  const isTransitioningRef = useRef(false);

  // Load custom saved background settings for each page from persistent IndexedDB
  useEffect(() => {
    const loadSavedSettings = async () => {
      const updatedScenes = { ...DEFAULT_SCENES };
      const pages: Array<'home' | 'about' | 'works' | 'contact'> = ['home', 'about', 'works', 'contact'];
      const homeVersion = await dbStore.get('home_scene_version');
      const homeNeedsMigration = homeVersion !== HOME_SCENE_VERSION;

      for (const page of pages) {
        if (page === 'home') {
          updatedScenes.home = { ...DEFAULT_SCENES.home };
          if (homeNeedsMigration) {
            await persistScene('home', updatedScenes.home);
            await dbStore.set('home_scene_version', HOME_SCENE_VERSION);
          }
          continue;
        }

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

    await persistScene(pageId, newScene);
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

  // Find which scene is active based on page state. 'services' maps to 'works'.
  const activePageKey = (currentPage === 'services' ? 'works' : currentPage) as 'home' | 'about' | 'works' | 'contact';
  const activeScene = scenes[activePageKey] || scenes.home;

  return (
    <div className="relative min-h-screen text-white bg-[#020204] font-sans selection:bg-blue-500/30 selection:text-white overflow-x-hidden">
      
      {/* 2.5D Cinematic Parallax Image Layered Background (Supports WebGL Depth-Displacement & Classic Layers) */}
      <ParallaxBackground 
        currentPage={currentPage}
        backgroundMode={activePageKey === 'home' ? HOME_PARALLAX.backgroundMode : activePageKey === 'works' ? PROJECT_PARALLAX.backgroundMode : activeScene.backgroundMode}
        backgroundImage={activePageKey === 'home' ? HOME_PARALLAX.backgroundImage : activePageKey === 'works' ? PROJECT_PARALLAX.backgroundImage : activeScene.backgroundImage} 
        depthMapImage={activePageKey === 'home' ? HOME_PARALLAX.depthMapImage : activePageKey === 'works' ? PROJECT_PARALLAX.depthMapImage : activeScene.depthMapImage}
        midgroundImage={activePageKey === 'home' ? HOME_PARALLAX.midgroundImage : activePageKey === 'works' ? PROJECT_PARALLAX.midgroundImage : activeScene.midgroundImage} 
        foregroundImage={activePageKey === 'home' ? HOME_PARALLAX.foregroundImage : activePageKey === 'works' ? PROJECT_PARALLAX.foregroundImage : activeScene.foregroundImage} 
        fallbackBackground={activePageKey === 'home' ? HOME_PARALLAX.fallbackBackground : ''}
        fallbackMidground={activePageKey === 'home' ? HOME_PARALLAX.fallbackMidground : ''}
        fallbackForeground={activePageKey === 'home' ? HOME_PARALLAX.fallbackForeground : ''}
        isParchmentOpen={isParchmentOpen}
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
          <HomeSection onPageChange={handlePageChange} introCompleted={introCompleted} currentPage={currentPage} />
        </section>

        {/* Section 02: Works */}
        <section id="section-works" className="h-screen w-full">
          <WorksSection 
            currentPage={currentPage} 
            introCompleted={introCompleted} 
            onParchmentOpenChange={setIsParchmentOpen}
          />
        </section>

        {/* Section 03: About */}
        <section id="section-about" className="h-screen w-full">
          <AboutSection />
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
      <footer className="fixed bottom-4 left-6 md:left-12 z-30 pointer-events-none text-left">
        <p className="font-mono text-[9px] tracking-widest text-white/20 uppercase">
          @lumen-city.world
        </p>
      </footer>

      {/* Elegant Classical Opening Intro Animation */}
      <LumenIntro onComplete={() => setIntroCompleted(true)} />
    </div>
  );
}
