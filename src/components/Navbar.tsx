import React from 'react';
import { motion } from 'motion/react';
import { PageType } from '../types';

interface NavbarProps {
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
  onOpenSettings?: () => void;
}

export default function Navbar({ currentPage, onPageChange }: NavbarProps) {
  const navItems = [
    { id: 'home' as PageType, english: 'HOME' },
    { id: 'works' as PageType, english: 'PROJECT' },
    { id: 'about' as PageType, english: 'ABOUT' },
    { id: 'contact' as PageType, english: 'CONTACT' },
  ];

  return (
    <>
      {/* Floating Cinematic Navigation Bar - Expanded with 20px margins, Golden Border, No shadow, Feathered Dissipation */}
      <header 
        className="fixed top-5 left-5 right-5 z-40 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent backdrop-blur-2xl border border-[#d4af37]/40 rounded-lg md:rounded-xl flex items-center justify-center py-2"
        style={{
          maskImage: 'linear-gradient(to right, transparent, white 25%, white 75%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, white 25%, white 75%, transparent)'
        }}
      >
        
        {/* Center: Main Navigation Links with EXACTLY 10px top and bottom spacing */}
        <nav className="flex items-center space-x-5 sm:space-x-8 md:space-x-12 z-0 py-0 group/nav">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className="relative pt-[10px] pb-[10px] leading-none text-[9px] sm:text-[10px] md:text-[11px] font-sans font-bold tracking-[0.2em] transition-all duration-300 pointer-on uppercase overflow-visible group flex items-center justify-center"
              >
                <span className={`transition-colors duration-300 ${isActive ? 'text-white' : 'text-white/55 group-hover/nav:text-white/30 hover:!text-white'}`}>
                  {item.english}
                </span>
                
                {/* Underline indicators with motion spring slide animation */}
                {isActive && (
                  <motion.div
                    layoutId="activeNavLine"
                    className="absolute bottom-[2px] left-0 right-0 h-[1.5px] bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>
      </header>
    </>
  );
}
